"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bell, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardMockup } from "@/components/dashboard-mockup";

const STEPS = [
  {
    step: "1",
    title: "Forward receipts",
    body: "One Gmail filter sends subscription emails to your private alias.",
  },
  {
    step: "2",
    title: "We detect renewals",
    body: "AI reads receipts and tracks service, price, and billing cycle.",
  },
  {
    step: "3",
    title: "Get warned early",
    body: "Calm alerts 3 days before a charge — email or Telegram.",
  },
];

export function LandingHero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <section className="relative overflow-hidden px-6 pb-20 pt-28">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <motion.div
          className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
          animate={{ opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
        <motion.div
          className="pointer-events-none absolute -right-24 top-40 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl"
          animate={{ opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 9, repeat: Infinity, delay: 1 }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <p className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
              Free private beta
            </p>
            <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
              Know what renews{" "}
              <span className="text-primary">before</span> you&apos;re charged.
            </h1>
            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Forward receipt emails. SubSpy finds recurring subscriptions and
              shows your real monthly burn — then warns you 3 days ahead.
            </p>
            <motion.div
              className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Button asChild size="lg" className="glow-teal">
                <Link href="/login">
                  Join the Beta
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-border/80">
                <Link href="/pricing">How beta works</Link>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:pl-4"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </section>

      <section className="border-t border-border/40 bg-card/20 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight">
            How it works
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">
            Three steps. No bank linking. Receipts only.
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {STEPS.map((item, i) => (
              <div key={item.step} className="relative text-center md:text-left">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground md:mx-0">
                  {item.step}
                </div>
                {i < STEPS.length - 1 ? (
                  <div
                    className="absolute left-5 top-5 hidden h-px w-[calc(100%+2rem)] bg-gradient-to-r from-primary/50 to-transparent md:block"
                    aria-hidden
                  />
                ) : null}
                <h3 className="font-medium">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border/40 px-6 py-20">
        <motion.div
          className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {[
            {
              icon: Mail,
              title: "Forward receipts",
              body: "Set a Gmail filter once. Receipts flow to your private alias.",
            },
            {
              icon: Shield,
              title: "We parse quietly",
              body: "Only subscription receipts matter. Raw emails delete after 30 days.",
            },
            {
              icon: Bell,
              title: "Warn before charge",
              body: "Calm alerts 3 days before renewal. Email or Telegram.",
            },
          ].map((item) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="h-full glass-card border-border/60 transition-colors hover:border-primary/25">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="px-6 pb-28">
        <div className="glass-card glow-teal mx-auto max-w-2xl rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            Stop surprise renewals.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Join the free beta — paste a receipt today, connect Gmail when you&apos;re ready.
          </p>
          <Button asChild className="mt-8 glow-teal" size="lg">
            <Link href="/login">
              Join the Beta
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </motion.div>
  );
}
