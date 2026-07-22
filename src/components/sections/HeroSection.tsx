import Image from "next/image";
import Link from "next/link";

export function HeroSection() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-dvh items-end overflow-hidden"
    >
      <Image
        src="/images/bg-hero.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-slate-950/10"
      />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-5 pb-16 pt-32 sm:px-8 sm:pb-20 lg:px-12 lg:pb-24 xl:px-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-300">
          Jessy Prananda
        </p>

        <h1
          id="hero-title"
          className="mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl"
        >
          Fullstack Designer
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 text-white/80 sm:text-lg">
          I design and build modern digital products — websites, webapps, and
          AI-ready tools — with clarity and craft.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/works"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-400"
          >
            View works
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            Contact
          </Link>
        </div>
      </div>
    </section>
  );
}
