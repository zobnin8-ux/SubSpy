import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { sendRenewalAlertEmail, sendTelegramAlert } from "@/lib/alerts";
import { ALERT_DAYS_BEFORE } from "@/lib/types";
import { daysUntil } from "@/lib/utils";

export async function GET(request: Request) {
  const secret = request.headers.get("authorization");
  if (secret !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createServiceClient();
  const today = new Date();
  const targetDate = new Date(today);
  targetDate.setDate(targetDate.getDate() + ALERT_DAYS_BEFORE);
  const targetStr = targetDate.toISOString().split("T")[0];

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*, profiles!inner(email, plan, telegram_chat_id)")
    .eq("status", "active")
    .eq("next_renewal", targetStr);

  let sent = 0;

  for (const sub of subscriptions ?? []) {
    const profile = sub.profiles as {
      email: string;
      plan: string;
      telegram_chat_id: string | null;
    };

    const isPro = profile.plan === "pro" || profile.plan === "lifetime";
    if (!isPro) continue;

    const { data: existingAlert } = await supabase
      .from("alerts_sent")
      .select("id")
      .eq("subscription_id", sub.id)
      .eq("channel", "email")
      .gte("sent_at", today.toISOString().split("T")[0])
      .maybeSingle();

    if (existingAlert) continue;

    const renewalDate = sub.next_renewal!;
    const days = daysUntil(renewalDate);

    await sendRenewalAlertEmail({
      to: profile.email,
      service: sub.service,
      amount: Number(sub.amount),
      currency: sub.currency,
      cycle: sub.cycle,
      renewalDate,
      daysUntil: days,
    });

    await supabase.from("alerts_sent").insert({
      subscription_id: sub.id,
      channel: "email",
    });

    if (profile.telegram_chat_id) {
      await sendTelegramAlert({
        chatId: profile.telegram_chat_id,
        service: sub.service,
        amount: Number(sub.amount),
        cycle: sub.cycle,
        daysUntil: days,
      });

      await supabase.from("alerts_sent").insert({
        subscription_id: sub.id,
        channel: "telegram",
      });
    }

    sent++;
  }

  await supabase.rpc("cleanup_old_email_logs");

  return NextResponse.json({ sent });
}
