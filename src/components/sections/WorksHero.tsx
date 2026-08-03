"use client";

import Image from "next/image";
import Link from "next/link";

import { ArrowDownRight } from "lucide-react";

import { Reveal } from "@/components/shared/Reveal";
import { Snowfall } from "@/components/shared/Snowfall";

export function WorksHero() {
  return (
    <section
      aria-labelledby="works-page-title"
      className="relative isolate min-h-[520px] overflow-hidden border-b border-slate-200 bg-slate-50"
    >
      <Reveal
        trigger="mount"
        direction="right"
        distance="wide"
        duration={800}
        className="absolute inset-0 -z-30"
      >
        <div className="absolute inset-0">
          <Image
            src="/images/bg-hero.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[72%_bottom] sm:object-[68%_bottom] lg:object-bottom"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white/10 sm:via-white/80 lg:via-white/55 lg:to-transparent"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/10 to-white/20"
          />
        </div>
      </Reveal>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 motion-reduce:hidden"
      >
        <Snowfall />
      </div>

      <div className="mx-auto flex min-h-[520px] w-full max-w-[1440px] items-center px-5 pb-16 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-36 xl:px-16">
        <div className="flex max-w-3xl gap-5 sm:gap-8">
          <Reveal
            trigger="mount"
            direction="scaleY"
            delay={150}
            duration={700}
            className="relative hidden w-px shrink-0 self-stretch overflow-hidden bg-slate-900 sm:block"
          >
            <span className="absolute bottom-0 left-0 h-20 w-px bg-orange-500" />
          </Reveal>

          <div>
            <Reveal trigger="mount" direction="left" delay={200} duration={700}>
              <p className="text-xs font-semibold uppercase tracking-[0.26em] text-orange-600">
                Portfolio / Works
              </p>
            </Reveal>

            <Reveal trigger="mount" direction="left" delay={280} duration={700}>
              <h1
                id="works-page-title"
                className="mt-5 font-serif text-[clamp(4rem,10vw,8rem)] leading-[0.84] tracking-[-0.055em] text-slate-950"
              >
                Selected
                <br />
                Works
              </h1>
            </Reveal>

            <Reveal trigger="mount" direction="left" delay={360} duration={700}>
              <p className="mt-7 max-w-xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
                A collection of digital products, websites, applications, and
                AI integrations I have designed and developed.
              </p>
            </Reveal>

            <Reveal trigger="mount" direction="left" delay={440} duration={700}>
              <Link
                href="#projects"
                className="mt-8 inline-flex min-h-11 items-center gap-3 text-sm font-medium text-slate-950 transition hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-4"
              >
                Explore projects
                <ArrowDownRight className="size-4" aria-hidden="true" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
