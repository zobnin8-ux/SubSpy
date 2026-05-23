import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Payments not active</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        SubSpy is in free private beta. There is no checkout flow to cancel.
      </p>
      <Button asChild variant="outline" className="mt-8">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  );
}
