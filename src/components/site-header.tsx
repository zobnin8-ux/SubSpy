import Link from "next/link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n/server";
import { createClient } from "@/lib/supabase/server";

export async function SiteHeader() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="fixed top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            S
          </span>
          SubSpy
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link href="/pricing" className="transition-colors hover:text-foreground">
            {t.nav.pricing}
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="transition-colors hover:text-foreground">
                {t.nav.dashboard}
              </Link>
              <Link href="/settings" className="transition-colors hover:text-foreground">
                {t.nav.settings}
              </Link>
            </>
          ) : null}
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher />
          {user ? (
            <>
              <span className="hidden max-w-[140px] truncate text-sm text-muted-foreground lg:inline">
                {user.email}
              </span>
              <SignOutButton label={t.nav.signOut} />
            </>
          ) : (
            <Button asChild size="sm">
              <Link href="/login">{t.nav.signIn}</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
