import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PricingPage() {
  return (
    <div className="px-6 py-24">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-semibold tracking-tight">Private beta</h1>
        <p className="mt-6 text-lg text-muted-foreground">
          SubSpy is currently in private beta.
        </p>
        <p className="mt-4 text-muted-foreground">
          We are testing whether subscription renewal alerts are useful enough
          before launching paid plans.
        </p>
        <p className="mt-4 text-muted-foreground">
          For now, early users can try the product for free.
        </p>
      </div>

      <Card className="mx-auto mt-12 max-w-lg border-border/60 bg-card/50">
        <CardHeader className="text-center">
          <CardTitle>Early access</CardTitle>
          <CardDescription>
            Forward receipts, track renewals, get alerts — no payment required
            during beta.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center pb-8">
          <Button asChild size="lg" className="glow-subtle">
            <Link href="/login">Join the Beta</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
