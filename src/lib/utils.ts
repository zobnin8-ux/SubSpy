import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function daysUntil(date: string | Date) {
  const target = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function generateForwardAlias(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function monthlyEquivalent(amount: number, cycle: string): number {
  switch (cycle.toLowerCase()) {
    case "weekly":
      return amount * (52 / 12);
    case "monthly":
      return amount;
    case "quarterly":
      return amount / 3;
    case "yearly":
    case "annual":
      return amount / 12;
    default:
      return amount;
  }
}

export function yearlyEquivalent(amount: number, cycle: string): number {
  return monthlyEquivalent(amount, cycle) * 12;
}

export const GMAIL_FILTER =
  'subject:(receipt OR invoice OR renewal OR subscription OR payment)';

export const FORWARD_DOMAIN =
  process.env.NEXT_PUBLIC_FORWARD_DOMAIN ?? "in.subspy.app";
