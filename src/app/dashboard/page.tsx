import Link from "next/link";
import { CalendarClock, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import type { Subscription } from "@/lib/types";
import {
  daysUntil,
  formatCurrency,
  formatDate,
  monthlyEquivalent,
  yearlyEquivalent,
} from "@/lib/utils";

export default async function DashboardPage() {
  const profile = await requireProfile();
  const supabase = await createClient();

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", profile.id)
    .eq("status", "active")
    .order("next_renewal", { ascending: true, nullsFirst: false });

  const items = (subscriptions ?? []) as Subscription[];

  const monthlyTotal = items.reduce(
    (sum, sub) => sum + monthlyEquivalent(Number(sub.amount), sub.cycle),
    0
  );
  const yearlyTotal = items.reduce(
    (sum, sub) => sum + yearlyEquivalent(Number(sub.amount), sub.cycle),
    0
  );

  const upcoming = items.filter(
    (sub) => sub.next_renewal && daysUntil(sub.next_renewal) <= 7
  );

  return (
    <div className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-10">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Active subscriptions and upcoming renewals.
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={DollarSign}
          label="Monthly burn"
          value={formatCurrency(monthlyTotal)}
        />
        <StatCard
          icon={TrendingUp}
          label="Yearly burn"
          value={formatCurrency(yearlyTotal)}
        />
        <StatCard
          icon={CalendarClock}
          label="Active subscriptions"
          value={String(items.length)}
        />
      </div>

      {items.length === 0 ? (
        <Card className="border-border/60 bg-card/50">
          <CardHeader>
            <CardTitle>No subscriptions yet</CardTitle>
            <CardDescription>
              Forward receipt emails to your alias to start tracking renewals.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/settings">Set up forwarding</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {upcoming.length > 0 ? (
            <section>
              <h2 className="mb-4 text-lg font-medium">Renewing soon</h2>
              <div className="grid gap-4">
                {upcoming.map((sub) => (
                  <SubscriptionCard key={sub.id} subscription={sub} urgent />
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <h2 className="mb-4 text-lg font-medium">All subscriptions</h2>
            <div className="grid gap-4">
              {items.map((sub) => (
                <SubscriptionCard key={sub.id} subscription={sub} />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <Card className="border-border/60 bg-card/50">
      <CardContent className="flex items-center gap-4 p-6">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function SubscriptionCard({
  subscription,
  urgent = false,
}: {
  subscription: Subscription;
  urgent?: boolean;
}) {
  const days = subscription.next_renewal
    ? daysUntil(subscription.next_renewal)
    : null;

  return (
    <Card
      className={
        urgent
          ? "border-primary/30 bg-card/80"
          : "border-border/60 bg-card/50"
      }
    >
      <CardContent className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium">{subscription.service}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(Number(subscription.amount), subscription.currency)} /{" "}
            {subscription.cycle}
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          {subscription.next_renewal ? (
            <>
              Renews {formatDate(subscription.next_renewal)}
              {days !== null && days <= 3 ? (
                <span className="ml-2 text-foreground">
                  ({days <= 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`})
                </span>
              ) : null}
            </>
          ) : (
            "Renewal date unknown"
          )}
        </div>
      </CardContent>
    </Card>
  );
}