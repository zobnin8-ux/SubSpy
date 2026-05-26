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
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-semibold tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
            S
          </span>
          SubSpy
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <Link href="/#features" className="transition-colors hover:text-foreground">
            {t.nav.features}
          </Link>
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
          ) : (
            <Link href="/login" className="transition-colors hover:text-foreground">
              {t.nav.signIn}
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LanguageSwitcher className="hidden sm:flex" />
          {user ? (
            <>
              <LanguageSwitcher className="sm:hidden" />
              <span className="hidden max-w-[120px] truncate text-sm text-muted-foreground lg:inline">
                {user.email}
              </span>
              <SignOutButton label={t.nav.signOut} />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="hidden md:inline-flex">
                <Link href="/login">{t.nav.signIn}</Link>
              </Button>
              <Button asChild size="sm" className="glow-teal">
                <Link href="/login">{t.nav.signUp}</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
