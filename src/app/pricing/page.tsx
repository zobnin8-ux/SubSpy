import Link from "next/link";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FREE_SUBSCRIPTION_LIMIT } from "@/lib/types";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Try SubSpy with your first subscriptions.",
    features: [
      `Up to ${FREE_SUBSCRIPTION_LIMIT} subscriptions`,
      "Email receipt parsing",
      "Dashboard overview",
    ],
    cta: "Get started",
    href: "/login",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$4",
    period: "/month",
    description: "Unlimited tracking and renewal alerts.",
    features: [
      "Unlimited subscriptions",
      "Renewal alerts (3 days before)",
      "Telegram alerts",
      "Priority parsing",
    ],
    cta: "Upgrade to Pro",
    href: "/login",
    highlighted: true,
  },
];

export default function PricingPage() {
  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Simple pricing</h1>
        <p className="mt-4 text-muted-foreground">
          Start free. Upgrade when you need unlimited tracking and alerts.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl gap-6 md:grid-cols-2">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={
              plan.highlighted
                ? "border-primary/40 bg-card/80 glow-subtle"
                : "border-border/60 bg-card/50"
            }
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <p className="pt-2 text-3xl font-semibold">
                {plan.price}
                <span className="text-base font-normal text-muted-foreground">
                  {plan.period}
                </span>
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 shrink-0 text-foreground" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button asChild className="w-full" variant={plan.highlighted ? "default" : "outline"}>
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
