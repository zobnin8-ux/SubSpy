import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Payments not active</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        SubSpy is currently in free beta. No checkout or subscriptions are
        processed at this time.
      </p>
      <Button asChild className="mt-8">
        <Link href="/dashboard">Go to dashboard</Link>
      </Button>
    </div>
  );
}
