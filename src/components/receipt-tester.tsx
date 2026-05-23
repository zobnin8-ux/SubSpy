"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SAMPLE = `Your Netflix receipt

Plan: Premium
Amount: $15.49
Billing: Monthly
Next billing date: June 23, 2026`;

export function ReceiptTester() {
  const router = useRouter();
  const [from, setFrom] = useState("billing@netflix.com");
  const [subject, setSubject] = useState("Your Netflix receipt");
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
      setStatus(data.error ?? "Failed to parse receipt.");
      return;
    }

    if (data.limitReached) {
      setStatus(data.message ?? "Beta limit reached.");
      return;
    }

    if (data.ignored) {
      setStatus("Not detected as a subscription receipt.");
      return;
    }

    if (data.parsed) {
      setStatus(`Added: ${data.service}. Open Dashboard to see it.`);
      router.refresh();
      return;
    }

    setStatus("Done.");
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Домена пока нет — вставьте текст чека здесь, чтобы протестировать парсинг
        без пересылки почты.
      </p>
      <div className="space-y-2">
        <Label htmlFor="from">From (необязательно)</Label>
        <Input
          id="from"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="billing@service.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Your subscription receipt"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="body">Текст чека</Label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Вставьте текст письма..."
          rows={8}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" onClick={parse} disabled={loading || !body.trim()}>
          {loading ? "Parsing..." : "Parse receipt"}
        </Button>
        <Button type="button" variant="outline" onClick={() => setBody(SAMPLE)}>
          Load sample
        </Button>
      </div>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </div>
  );
}