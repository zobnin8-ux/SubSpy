import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createCheckoutSession } from "@/lib/polar";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const productId = process.env.POLAR_PRO_PRODUCT_ID;
  if (!productId) {
    return NextResponse.json({ error: "Billing not configured" }, { status: 503 });
  }

  const origin = new URL(request.url).origin;

  try {
    const checkout = await createCheckoutSession({
      productId,
      customerEmail: user.email!,
      successUrl: `${origin}/success`,
    });

    return NextResponse.json({ url: checkout.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
