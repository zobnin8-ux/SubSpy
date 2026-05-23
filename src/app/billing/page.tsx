import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function BillingPage() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">Billing not active</h1>
      <p className="mt-4 text-muted-foreground">
        SubSpy is in free private beta. Paid plans are not available yet.
      </p>
      <Button asChild className="mt-8" variant="outline">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
