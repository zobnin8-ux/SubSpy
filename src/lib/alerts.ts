import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendRenewalAlertEmail(input: {
  to: string;
  service: string;
  amount: number;
  currency: string;
  cycle: string;
  renewalDate: string;
  daysUntil: number;
}) {
  const when =
    input.daysUntil <= 0
      ? "today"
      : input.daysUntil === 1
        ? "tomorrow"
        : `in ${input.daysUntil} days`;

  const cycleLabel =
    input.cycle === "yearly" || input.cycle === "annual" ? "year" : "month";

  const subject = `${input.service} renews ${when}`;
  const text = `${input.service} renews ${when} — $${input.amount}/${cycleLabel}.`;

  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "SubSpy <alerts@subspy.app>",
    to: input.to,
    subject,
    text,
  });
}

export async function sendTelegramAlert(input: {
  chatId: string;
  service: string;
  amount: number;
  cycle: string;
  daysUntil: number;
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  const when =
    input.daysUntil <= 0
      ? "today"
      : input.daysUntil === 1
        ? "tomorrow"
        : `in ${input.daysUntil} days`;

  const cycleLabel =
    input.cycle === "yearly" || input.cycle === "annual" ? "year" : "month";

  const text = `${input.service} renews ${when} — $${input.amount}/${cycleLabel}.`;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: input.chatId,
      text,
    }),
  });
}
