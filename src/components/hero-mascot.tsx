"use client";

import { useI18n } from "@/components/i18n-provider";
import type { Locale } from "@/lib/i18n";

const HERO_IMAGE: Record<Locale, string> = {
  en: "/images/subspy-spy-hero-en.png",
  ru: "/images/subspy-spy-hero-ru.png",
};

export function HeroMascot({ alt }: { alt: string }) {
  const { locale } = useI18n();
  const src = HERO_IMAGE[locale];

  return (
    <div className="relative flex min-h-[300px] w-full items-end justify-center sm:min-h-[380px] lg:min-h-[min(72vh,720px)] lg:justify-end">
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 h-[85%] w-[95%] max-h-[640px] max-w-[720px] -translate-x-1/2 rounded-full bg-green-500/25 blur-3xl lg:left-auto lg:right-[-5%] lg:translate-x-0 lg:scale-110"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-8 right-0 hidden h-64 w-64 rounded-full bg-primary/15 blur-2xl lg:block"
        aria-hidden
      />

      <div className="relative h-[min(65vh,640px)] w-full max-w-[780px] overflow-hidden lg:h-[min(75vh,700px)] lg:translate-x-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={src}
          src={src}
          alt={alt}
          className="absolute right-0 top-1/2 h-[110%] w-auto max-w-none -translate-y-1/2 object-contain object-right drop-shadow-[0_0_55px_rgba(0,255,140,0.28)]"
        />
      </div>
    </div>
  );
}
