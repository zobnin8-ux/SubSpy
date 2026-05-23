export type UserPlan = "free" | "pro" | "lifetime";

export interface Profile {
  id: string;
  email: string;
  forward_alias: string;
  plan: UserPlan;
  telegram_chat_id: string | null;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  service: string;
  amount: number;
  currency: string;
  cycle: string;
  status: string;
  next_renewal: string | null;
  source_email_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: string;
  user_id: string;
  raw: string;
  parse_status: string;
  parsed_at: string | null;
  created_at: string;
}

export interface ParsedSubscription {
  is_subscription: boolean;
  service: string;
  amount: number;
  currency: string;
  cycle: string;
  next_renewal: string | null;
  status: string;
}

export const FREE_SUBSCRIPTION_LIMIT = 5;
export const ALERT_DAYS_BEFORE = 3;
