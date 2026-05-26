"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Subscription } from "@/lib/types";
import {
  daysUntil,
  formatCurrency,
  formatDate,
  monthlyEquivalent,
  yearlyEquivalent,
} from "@/lib/utils";

const SERVICE_ACCENTS = [
  "bg-red-500/80",
  "bg-emerald-500/80",
  "bg-sky-500/80",
  "bg-violet-500/80",
  "bg-amber-500/80",
];

function serviceAccent(service: string) {
  let hash = 0;
  for (let i = 0; i < service.length; i++) {
    hash = service.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SERVICE_ACCENTS[Math.abs(hash) % SERVICE_ACCENTS.length];
}

export function SubscriptionCard({
  subscription,
  urgent = false,
}: {
  subscription: Subscription;
  urgent?: boolean;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const amount = Number(subscription.amount);
  const monthly = monthlyEquivalent(amount, subscription.cycle);
  const yearly = yearlyEquivalent(amount, subscription.cycle);
  const days = subscription.next_renewal
    ? daysUntil(subscription.next_renewal)
    : null;

  async function handleDelete() {
    if (
      !window.confirm(
        `Delete ${subscription.service} (${formatCurrency(Number(subscription.amount), subscription.currency)} / ${subscription.cycle})?`
      )
    ) {
      return;
    }

    setDeleting(true);
    const res = await fetch(`/api/subscriptions/${subscription.id}`, {
      method: "DELETE",
    });
    setDeleting(false);

    if (!res.ok) {
      const data = await res.json();
      window.alert(data.error ?? "Failed to delete subscription.");
      return;
    }

    router.refresh();
  }

  return (
    <Card
      className={
        urgent
          ? "border-amber-500/35 bg-amber-500/5"
          : "glass-card border-border/60"
      }
    >
      <CardContent className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 gap-3">
          <span
            className={`mt-1 h-10 w-1 shrink-0 rounded-full ${serviceAccent(subscription.service)}`}
            aria-hidden
          />
          <div className="min-w-0">
          <p className="font-medium">{subscription.service}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(amount, subscription.currency)} / {subscription.cycle}
          </p>
          <p className="text-xs text-muted-foreground">
            ≈ {formatCurrency(monthly, subscription.currency)} / mo · ≈{" "}
            {formatCurrency(yearly, subscription.currency)} / yr
          </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
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
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground hover:text-destructive"
            onClick={handleDelete}
            disabled={deleting}
            aria-label="Delete subscription"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
