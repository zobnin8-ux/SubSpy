"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  Bell,
  DollarSign,
  Mail,
  Search,
  Shield,
  Star,
} from "lucide-react";
import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function LandingHero() {
  const { locale, t } = useI18n();
  const l = t.landing;
  const heroSrc = locale === "ru" ? "/hero-ru.png" : "/hero-en.png";

  const steps = [
    { step: "1", title: l.step1Title, body: l.step1Body },
    { step: "2", title: l.step2Title, body: l.step2Body },
    { step: "3", title: l.step3Title, body: l.step3Body },
  ];

  const features = [
    { icon: Mail, title: l.feature1Title, body: l.feature1Body },
    { icon: Shield, title: l.feature2Title, body: l.feature2Body },
    { icon: Bell, title: l.feature3Title, body: l.feature3Body },
  ];

  const bullets = [
    { icon: Search, text: l.bullet1 },
    { icon: Bell, text: l.bullet2 },
    { icon: DollarSign, text: l.bullet3 },
  ];

  const stats = [
    { icon: BarChart3, value: l.stat1Value, label: l.stat1Label },
    { icon: Bell, value: l.stat2Value, label: l.stat2Label },
    { icon: DollarSign, value: l.stat3Value, label: l.stat3Label },
    { icon: Star, value: l.stat4Value, label: l.stat4Label, stars: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <section className="relative overflow-hidden px-6 pb-12 pt-28">
        <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
        <motion.div
          className="pointer-events-none absolute -left-32 top-24 h-80 w-80 rounded-full bg-primary/25 blur-3xl"
          animate={{ opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 7, repeat: Infinity }}
        />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <p className="mb-4 inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
                {l.betaBadge}
              </p>
              <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl lg:text-[3.25rem] lg:leading-[1.08]">
                {l.headline}{" "}
                <span className="text-primary">{l.headlineAccent}</span>
                <br />
                <span className="text-primary/90">{l.headlineEnd}</span>
              </h1>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground">{l.subhead}</p>

              <Button asChild size="lg" className="mt-8 glow-teal h-12 px-8 text-base">
                <Link href="/login">
                  {l.ctaJoin}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <ul className="mt-8 space-y-3">
                {bullets.map((item) => (
                  <li key={item.text} className="flex items-center gap-3 text-sm">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15">
                      <item.icon className="h-4 w-4 text-primary" />
                    </span>
                    <span className="text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto w-full max-w-lg lg:max-w-none"
            >
              <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-primary/15 blur-3xl" />
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/50 shadow-2xl lg:aspect-square">
                <Image
                  src={heroSrc}
                  alt={l.heroImageAlt}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-right"
                />
              </div>
            </motion.div>
          </div>

          <div className="glass-card mt-12 grid gap-6 rounded-2xl border-border/60 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:p-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center lg:text-left">
                <stat.icon className="mx-auto mb-2 h-5 w-5 text-primary lg:mx-0" />
                <p className="text-2xl font-bold text-primary sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
                {stat.stars ? (
                  <div className="mt-2 flex justify-center gap-0.5 text-amber-400 lg:justify-start">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="border-t border-border/40 bg-card/20 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-semibold tracking-tight">{l.howTitle}</h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">
            {l.howSub}
          </p>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {steps.map((item) => (
              <div key={item.step} className="text-center md:text-left">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground md:mx-0">
                  {item.step}
                </div>
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
          {features.map((item) => (
            <motion.div
              key={item.title}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="glass-card h-full border-border/60 transition-colors hover:border-primary/25">
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
          <h2 className="text-2xl font-semibold tracking-tight">{l.ctaBottomTitle}</h2>
          <p className="mt-3 text-muted-foreground">{l.ctaBottomSub}</p>
          <Button asChild className="mt-8 glow-teal" size="lg">
            <Link href="/login">
              {l.ctaJoin}
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </motion.div>
  );
}
