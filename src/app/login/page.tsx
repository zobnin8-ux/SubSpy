"use client";

import { useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const { t } = useI18n();
  const l = t.login;
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function signInWithEmail(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (authError) {
      setError(authError.message);
    } else {
      setMessage(l.magicLinkSent);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-16">
      <Card className="glass-card w-full max-w-md border-border/60">
        <CardHeader>
          <CardTitle>{l.title}</CardTitle>
          <CardDescription>{l.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={signInWithEmail} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">{l.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder={l.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full glow-teal" disabled={loading}>
              {loading ? l.sending : l.submit}
            </Button>
          </form>

          {message ? (
            <p className="text-sm text-muted-foreground">{message}</p>
          ) : null}
          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <p className="text-center text-xs text-muted-foreground">
            {l.termsPrefix}{" "}
            <Link href="/terms" className="underline hover:text-foreground">
              {l.terms}
            </Link>{" "}
            {l.and}{" "}
            <Link href="/privacy" className="underline hover:text-foreground">
              {l.privacy}
            </Link>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
