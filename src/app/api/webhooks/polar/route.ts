import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import crypto from "crypto";

function verifyPolarSignature(payload: string, signature: string, secret: string) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}

export async function POST(request: Request) {
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const payload = await request.text();
  const signature = request.headers.get("x-polar-signature") ?? "";

  try {
    if (!verifyPolarSignature(payload, signature, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(payload);
  const supabase = createServiceClient();

  const email =
    event.data?.customer?.email ??
    event.data?.user?.email ??
    event.data?.email;

  if (!email) {
    return NextResponse.json({ received: true });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single();

  if (!profile) {
    return NextResponse.json({ received: true });
  }

  let plan: "free" | "pro" | "lifetime" = "free";

  switch (event.type) {
    case "subscription.created":
    case "subscription.updated":
      plan = "pro";
      break;
    case "subscription.canceled":
    case "subscription.revoked":
      plan = "free";
      break;
    default:
      return NextResponse.json({ received: true });
  }

  await supabase.from("profiles").update({ plan }).eq("id", profile.id);

  return NextResponse.json({ received: true });
}
