"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CheckoutButton({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <Button onClick={checkout} disabled={loading}>
      {loading ? "Redirecting..." : "Upgrade to Pro — $4/mo"}
    </Button>
  );
}
