"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fmt } from "@/lib/i18n";

const SAMPLE_BODY = `Your Netflix receipt

Plan: Premium
Amount: $15.49
Billing: Monthly
Next billing date: June 23, 2026`;

export function ReceiptTester() {
  const router = useRouter();
  const { t } = useI18n();
  const r = t.receipt;
  const [from, setFrom] = useState("billing@netflix.com");
  const [subject, setSubject] = useState<string>(r.sampleSubject);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function parse() {
    setLoading(true);
    setStatus(null);
    const res = await fetch("/api/receipts/parse", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ from, subject, body }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setStatus(data.error ?? r.parseFailed);
      return;
    }

    if (data.limitReached) {
      setStatus(data.message ?? r.limitReached);
      return;
    }

    if (data.ignored) {
      setStatus(r.notSubscription);
      return;
    }

    if (data.parsed) {
      setStatus(fmt(r.added, { service: data.service }));
      router.refresh();
      return;
    }

    setStatus(r.done);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">{r.hint}</p>
      <div className="space-y-2">
        <Label htmlFor="from">{r.from}</Label>
        <Input
          id="from"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder={r.fromPlaceholder}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">{r.subject}</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={r.subjectPlaceholder}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">{r.body}</Label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder={r.bodyPlaceholder}
          rows={8}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={parse} disabled={loading || !body.trim()}>
          {loading ? r.parsing : r.parse}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setBody(SAMPLE_BODY);
            setSubject(r.sampleSubject);
          }}
        >
          {r.loadSample}
        </Button>
      </div>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </div>
  );
}
