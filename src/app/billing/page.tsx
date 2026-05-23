import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckoutButton } from "@/components/checkout-button";
import { requireProfile } from "@/lib/profile";
import { FREE_SUBSCRIPTION_LIMIT } from "@/lib/types";

export default async function BillingPage() {
  const profile = await requireProfile();
  const isPro = profile.plan === "pro" || profile.plan === "lifetime";

  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Billing</h1>
        <p className="mt-2 text-muted-foreground">
          Manage your SubSpy subscription.
        </p>
      </div>

      <Card className="border-border/60 bg-card/50">
        <CardHeader>
          <CardTitle className="capitalize">{profile.plan} plan</CardTitle>
          <CardDescription>
            {isPro
              ? "Unlimited subscriptions and renewal alerts."
              : `Track up to ${FREE_SUBSCRIPTION_LIMIT} subscriptions for free.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isPro ? (
            <>
              <p className="text-sm text-muted-foreground">
                Pro is $4/month — unlimited subscriptions, email alerts, and Telegram notifications.
              </p>
              <CheckoutButton email={profile.email} />
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              You&apos;re on Pro. Manage or cancel via Polar customer portal when configured.
            </p>
          )}
          <Button asChild variant="ghost">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}