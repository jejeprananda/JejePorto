import Link from "next/link";

import { SectionShell } from "@/components/projects/SectionShell";

export function FooterCTA() {
  return (
    <SectionShell tone="white">
      <div className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-slate-50 px-8 py-16 text-center shadow-sm sm:px-12 sm:py-20">
        <h2 className="font-serif text-4xl tracking-[-0.03em] text-slate-950 sm:text-5xl">
          Interested in working together?
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
          Let’s design and build a product that feels calm, clear, and ready for
          real users.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-slate-950 px-7 text-sm font-medium text-white transition duration-300 hover:-translate-y-0.5 hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            Contact Me
          </Link>
          <Link
            href="/works"
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-slate-200 bg-white px-7 text-sm font-medium text-slate-950 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-orange-500 hover:text-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            View More Projects
          </Link>
        </div>
      </div>
    </SectionShell>
  );
}
