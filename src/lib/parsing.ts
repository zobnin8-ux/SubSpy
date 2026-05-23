import { z } from "zod";
import type { ParsedSubscription } from "@/lib/types";

export const parsedSubscriptionSchema = z.object({
  is_subscription: z.boolean(),
  service: z.string(),
  amount: z.number(),
  currency: z.string().default("USD"),
  cycle: z.string(),
  next_renewal: z.string().nullable(),
  status: z.string().default("active"),
});

export const PARSING_SYSTEM_PROMPT = `You parse forwarded email receipts to detect recurring subscriptions.

Return JSON only with this shape:
{
  "is_subscription": boolean,
  "service": string,
  "amount": number,
  "currency": "USD",
  "cycle": "weekly" | "monthly" | "quarterly" | "yearly",
  "next_renewal": "YYYY-MM-DD" | null,
  "status": "active" | "trial" | "cancelled"
}

Rules:
- Detect service name, amount, billing cycle, renewal date, trial/cancel state
- Ignore one-time purchases, shipping confirmations, unrelated invoices
- If not a subscription receipt, set is_subscription to false and use empty service with amount 0
- USD only for MVP
- Infer next_renewal from receipt when possible`;

export async function parseReceiptEmail(input: {
  from: string;
  subject: string;
  body: string;
}): Promise<ParsedSubscription> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: PARSING_SYSTEM_PROMPT },
        {
          role: "user",
          content: `From: ${input.from}\nSubject: ${input.subject}\n\n${input.body.slice(0, 12000)}`,
        },
      ],
      temperature: 0,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI parse failed: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("Empty OpenAI response");
  }

  const parsed = parsedSubscriptionSchema.parse(JSON.parse(content));
  return parsed;
}
