"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Bell, Mail, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function LandingHero() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <section className="relative overflow-hidden px-6 pb-24 pt-32">
        <motion.div
          className="pointer-events-none absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-accent/20 blur-3xl"
          animate={{ opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="mx-auto max-w-3xl text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <p className="mb-4 text-sm uppercase tracking-widest text-muted-foreground">
            Free private beta
          </p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-6xl">
            Your subscriptions quietly spend money while you live your life.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Forward your receipt emails. SubSpy detects recurring subscriptions and
            warns you before renewals.
          </p>
          <p className="mx-auto mt-3 text-sm text-muted-foreground">
            SubSpy is currently a free private beta.
          </p>
          <motion.div
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Button asChild size="lg" className="glow-subtle">
              <Link href="/login">
                Join the Beta
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">About beta</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      <section className="border-t border-border/50 px-6 py-24">
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
              <Card className="h-full border-border/60 bg-card/50">
                <CardContent className="p-6">
                  <item.icon className="mb-4 h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{item.body}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="px-6 pb-32">
        <div className="mx-auto max-w-2xl rounded-2xl border border-border/60 bg-card/30 p-10 text-center glow-subtle">
          <h2 className="text-2xl font-semibold tracking-tight">
            Tiny recurring charges become invisible.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three steps: copy a filter, forward receipts, done.
          </p>
          <Button asChild className="mt-8" size="lg">
            <Link href="/login">Join the Beta</Link>
          </Button>
        </div>
      </section>
    </motion.div>
  );
}
