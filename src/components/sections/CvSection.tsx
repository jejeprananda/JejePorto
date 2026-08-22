import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/shared/Reveal";

export function CvSection() {
  return (
    <section className="bg-white px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-32">
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="flex flex-col gap-7 border-y border-slate-200 py-10 sm:py-12 md:flex-row md:items-center md:justify-between">
          <Reveal trigger="scroll" direction="up" duration={700}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                CV
              </p>

              <h2 className="mt-3 font-serif text-3xl tracking-[-0.035em] text-slate-950 sm:text-4xl">
                Need CV of mine? Get here.
              </h2>
            </div>
          </Reveal>

          <Reveal
            trigger="scroll"
            direction="up"
            delay={100}
            duration={700}
          >
            <Link
              href="/cv"
              className="inline-flex min-h-12 w-full items-center justify-center gap-3 bg-slate-950 px-7 text-sm font-medium text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 md:w-auto"
            >
              Download CV
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
