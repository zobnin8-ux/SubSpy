import { NextResponse } from "next/server";
import { processReceiptForUser } from "@/lib/email-processing";
import { createClient } from "@/lib/supabase/server";
import type { UserPlan } from "@/lib/types";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { from, subject, body } = await request.json();

  if (!subject?.trim() || !body?.trim()) {
    return NextResponse.json(
      { error: "Subject and receipt text are required" },
      { status: 400 }
    );
  }

  const result = await processReceiptForUser(
    user.id,
    profile.plan as UserPlan,
    {
      from: from?.trim() || "receipt@test.local",
      subject: subject.trim(),
      body: body.trim(),
    }
  );

  if (!result.ok) {
    return NextResponse.json(result, { status: 500 });
  }

  if ("limitReached" in result && result.limitReached) {
    return NextResponse.json({
      ...result,
      message: "Beta limit reached. This account has reached the current testing limit.",
    });
  }

  return NextResponse.json(result);
}
