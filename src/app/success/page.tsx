import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getServerT } from "@/lib/i18n/server";

export default async function SuccessPage() {
  const { t } = await getServerT();
  const s = t.success;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">{s.title}</h1>
      <p className="mt-2 max-w-md text-muted-foreground">{s.body}</p>
      <Button asChild className="mt-8 glow-teal">
        <Link href="/dashboard">{s.go}</Link>
      </Button>
    </div>
  );
}
