import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerT } from "@/lib/i18n/server";

export default async function BillingPage() {
  const { t } = await getServerT();
  const b = t.billing;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-lg flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-2xl font-semibold">{b.title}</h1>
      <p className="mt-4 text-muted-foreground">{b.body}</p>
      <Button asChild className="mt-8" variant="outline">
        <Link href="/dashboard">{b.back}</Link>
      </Button>
    </div>
  );
}
