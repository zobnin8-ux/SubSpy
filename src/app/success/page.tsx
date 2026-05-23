import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16 text-center">
      <CheckCircle className="mb-4 h-12 w-12 text-foreground" />
      <h1 className="text-2xl font-semibold">You&apos;re all set</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Your Pro subscription is active. Forward receipts and we&apos;ll warn you before renewals.
      </p>
      <Button asChild className="mt-8">
        <Link href="/dashboard">Go to dashboard</Link>
      </Button>
    </div>
  );
}
