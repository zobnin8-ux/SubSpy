import { createServiceClient } from "@/lib/supabase/admin";
import { BETA_LIMITS, canUseProduct } from "@/lib/access";
import { parseReceiptEmail } from "@/lib/parsing";

export async function processIncomingEmail(input: {
  alias: string;
  from: string;
  subject: string;
  body: string;
}) {
  const supabase = createServiceClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, plan")
    .eq("forward_alias", input.alias.toLowerCase())
    .single();

  if (!profile) {
    return { ok: false, error: "Unknown alias" as const };
  }

  if (!canUseProduct(profile)) {
    return { ok: false, error: "Access denied" as const };
  }

  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { count: emailsToday } = await supabase
    .from("email_logs")
    .select("id", { count: "exact", head: true })
    .eq("user_id", profile.id)
    .gte("created_at", startOfDay.toISOString());

  if ((emailsToday ?? 0) >= BETA_LIMITS.maxEmailsPerDay) {
    return { ok: true, limitReached: true as const, reason: "emails" as const };
  }

  const raw = `From: ${input.from}\nSubject: ${input.subject}\n\n${input.body}`;

  const { data: emailLog, error: logError } = await supabase
    .from("email_logs")
    .insert({
      user_id: profile.id,
      raw,
      parse_status: "pending",
    })
    .select("id")
    .single();

  if (logError || !emailLog) {
    return { ok: false, error: "Failed to store email log" as const };
  }

  try {
    const parsed = await parseReceiptEmail({
      from: input.from,
      subject: input.subject,
      body: input.body,
    });

    if (!parsed.is_subscription) {
      await supabase
        .from("email_logs")
        .update({ parse_status: "ignored", parsed_at: new Date().toISOString() })
        .eq("id", emailLog.id);
      return { ok: true, ignored: true as const };
    }

    const { count } = await supabase
      .from("subscriptions")
      .select("id", { count: "exact", head: true })
      .eq("user_id", profile.id)
      .eq("status", "active");

    if ((count ?? 0) >= BETA_LIMITS.maxSubscriptions) {
      await supabase
        .from("email_logs")
        .update({
          parse_status: "limit_reached",
          parsed_at: new Date().toISOString(),
        })
        .eq("id", emailLog.id);
      return { ok: true, limitReached: true as const, reason: "subscriptions" as const };
    }

    const { data: existing } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("user_id", profile.id)
      .eq("service", parsed.service)
      .eq("amount", parsed.amount)
      .eq("cycle", parsed.cycle)
      .maybeSingle();

    const subscriptionData = {
      user_id: profile.id,
      service: parsed.service,
      amount: parsed.amount,
      currency: parsed.currency,
      cycle: parsed.cycle,
      status: parsed.status,
      next_renewal: parsed.next_renewal,
      source_email_id: emailLog.id,
    };

    if (existing) {
      await supabase
        .from("subscriptions")
        .update(subscriptionData)
        .eq("id", existing.id);
    } else {
      await supabase.from("subscriptions").insert(subscriptionData);
    }

    await supabase
      .from("email_logs")
      .update({ parse_status: "parsed", parsed_at: new Date().toISOString() })
      .eq("id", emailLog.id);

    return { ok: true, parsed: true as const };
  } catch {
    await supabase
      .from("email_logs")
      .update({ parse_status: "failed", parsed_at: new Date().toISOString() })
      .eq("id", emailLog.id);
    return { ok: false, error: "Parse failed" as const };
  }
}
