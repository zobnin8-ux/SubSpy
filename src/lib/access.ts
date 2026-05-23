import type { Profile } from "@/lib/types";

export const BETA_LIMITS = {
  maxSubscriptions: 20,
  maxEmailsPerDay: 50,
} as const;

export function canUseProduct(user: Pick<Profile, "plan">): boolean {
  return (
    user.plan === "free" ||
    user.plan === "beta" ||
    user.plan === "pro" ||
    user.plan === "lifetime"
  );
}

export function planLabel(plan: Profile["plan"]): string {
  if (plan === "beta") return "Beta";
  if (plan === "free") return "Free";
  return plan;
}
