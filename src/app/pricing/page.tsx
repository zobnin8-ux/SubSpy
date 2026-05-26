import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getServerT } from "@/lib/i18n/server";

export default async function PricingPage() {
  const { t } = await getServerT();
  const p = t.pricing;

  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight">{p.title}</h1>
        <p className="mt-6 text-lg text-muted-foreground">{p.p1}</p>
        <p className="mt-4 text-muted-foreground">{p.p2}</p>
        <p className="mt-4 text-muted-foreground">{p.p3}</p>
      </div>

      <Card className="glass-card mx-auto mt-12 max-w-lg border-border/60">
        <CardHeader className="text-center">
          <CardTitle>{p.cardTitle}</CardTitle>
          <CardDescription>{p.cardSub}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Button asChild size="lg" className="glow-teal">
            <Link href="/login">{p.join}</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
