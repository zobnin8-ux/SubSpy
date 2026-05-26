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
import { SubscriptionCard } from "@/components/subscription-card";
import { requireProfile } from "@/lib/profile";
import { createClient } from "@/lib/supabase/server";
import type { Subscription } from "@/lib/types";
import {
  daysUntil,
  formatCurrency,
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

  const breakdown = items
    .map((sub) => ({
      id: sub.id,
      service: sub.service,
      currency: sub.currency,
      monthly: monthlyEquivalent(Number(sub.amount), sub.cycle),
      yearly: yearlyEquivalent(Number(sub.amount), sub.cycle),
    }))
    .sort((a, b) => b.yearly - a.yearly);

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
          highlight
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

      {items.length > 0 ? (
        <Card className="mb-10 glass-card border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Breakdown by service</CardTitle>
            <CardDescription>
              Normalized monthly and yearly cost per subscription.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="pb-2 pr-4 font-medium">Service</th>
                    <th className="pb-2 pr-4 text-right font-medium">Monthly</th>
                    <th className="pb-2 pr-4 text-right font-medium">Yearly</th>
                    <th className="pb-2 text-right font-medium">Share</th>
                  </tr>
                </thead>
                <tbody>
                  {breakdown.map((row) => (
                    <tr key={row.id} className="border-b border-border/50 last:border-0">
                      <td className="py-2.5 pr-4 font-medium">{row.service}</td>
                      <td className="py-2.5 pr-4 text-right text-muted-foreground">
                        {formatCurrency(row.monthly, row.currency)}
                      </td>
                      <td className="py-2.5 pr-4 text-right text-muted-foreground">
                        {formatCurrency(row.yearly, row.currency)}
                      </td>
                      <td className="py-2.5 text-right text-muted-foreground">
                        {yearlyTotal > 0
                          ? `${Math.round((row.yearly / yearlyTotal) * 100)}%`
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {items.length === 0 ? (
        <Card className="glass-card border-border/60">
          <CardHeader>
            <CardTitle>No subscriptions yet</CardTitle>
            <CardDescription>
              Paste a receipt in Settings to test now, or forward emails when your
              domain is connected.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button asChild className="glow-teal">
              <Link href="/settings">Paste a receipt</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/settings">Forwarding setup</Link>
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
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <Card
      className={
        highlight
          ? "border-primary/35 bg-primary/10"
          : "glass-card border-border/60"
      }
    >
      <CardContent className="flex items-center gap-4 p-6">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${
            highlight ? "bg-primary/20" : "bg-muted"
          }`}
        >
          <Icon
            className={`h-5 w-5 ${highlight ? "text-primary" : "text-muted-foreground"}`}
          />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p
            className={`text-2xl font-semibold ${
              highlight ? "text-primary" : ""
            }`}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}