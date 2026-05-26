export function HeroMascot({ alt }: { alt: string }) {
  return (
    <div className="relative flex justify-center lg:justify-end">
      <div
        className="absolute inset-0 scale-75 rounded-full bg-green-500/20 blur-3xl"
        aria-hidden
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/subspy-spy-hero.png"
        alt={alt}
        className="relative z-10 w-full max-w-[560px] object-contain drop-shadow-[0_0_40px_rgba(132,255,72,0.25)]"
      />
    </div>
  );
}
