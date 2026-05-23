import { Polar } from "@polar-sh/sdk";

let polarClient: Polar | null = null;

export function getPolarClient() {
  if (!polarClient) {
    polarClient = new Polar({
      accessToken: process.env.POLAR_ACCESS_TOKEN!,
      server: process.env.POLAR_SANDBOX === "true" ? "sandbox" : "production",
    });
  }
  return polarClient;
}

export async function createCheckoutSession(input: {
  productId: string;
  customerEmail: string;
  successUrl: string;
}) {
  const polar = getPolarClient();

  const checkout = await polar.checkouts.create({
    products: [input.productId],
    customerEmail: input.customerEmail,
    successUrl: input.successUrl,
  });

  return checkout;
}
