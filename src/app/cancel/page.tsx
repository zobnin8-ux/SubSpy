import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerT } from "@/lib/i18n/server";

export default async function CancelPage() {
  const { t } = await getServerT();
  const c = t.cancel;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">{c.title}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{c.body}</p>
      <Button asChild variant="outline" className="mt-8">
        <Link href="/dashboard">{c.back}</Link>
      </Button>
    </div>
  );
}
