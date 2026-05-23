"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { canUseProduct } from "@/lib/access";
import type { UserPlan } from "@/lib/types";

export function TelegramConnect({
  chatId,
  plan,
}: {
  chatId: string | null;
  plan: UserPlan;
}) {
  const [value, setValue] = useState(chatId ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!canUseProduct({ plan })) {
    return (
      <p className="text-sm text-muted-foreground">
        Beta access required to configure Telegram alerts.
      </p>
    );
  }

  async function save() {
    setLoading(true);
    setStatus(null);
    const res = await fetch("/api/telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: value || null }),
    });
    setLoading(false);
    if (res.ok) {
      setStatus("Saved.");
    } else {
      const data = await res.json();
      setStatus(data.error ?? "Failed to save.");
    }
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Message your Telegram bot, then paste your chat ID below.
      </p>
      <div className="space-y-2">
        <Label htmlFor="telegram">Telegram chat ID</Label>
        <Input
          id="telegram"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="123456789"
        />
      </div>
      <Button onClick={save} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
      {status ? <p className="text-sm text-muted-foreground">{status}</p> : null}
    </div>
  );
}
