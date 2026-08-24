import Link from "next/link";

export function CloseCta() {
  return (
    <section className="bg-paper px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 border-y border-rule py-10 sm:py-12 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Next
          </p>
          <h2 className="mt-3 min-w-0 text-3xl font-semibold tracking-[-0.04em] text-ink [overflow-wrap:anywhere] sm:text-4xl">
            Have something in mind?
          </h2>
          <p className="mt-3 text-sm leading-6 text-ink-muted">
            Let&apos;s collaborate and build something useful.
          </p>
          <p className="mt-5 font-mono text-sm text-ink">
            Need CV of mine? Get here.
          </p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
          <Link
            href="/contact"
            className="inline-flex min-h-12 w-full items-center justify-center border border-ink bg-ink px-7 text-sm font-medium text-paper transition hover:bg-accent hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:w-auto"
          >
            Contact Me
          </Link>
          <Link
            href="/cv"
            className="inline-flex min-h-12 w-full items-center justify-center border border-rule bg-paper px-7 font-mono text-sm font-medium text-ink transition hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-paper sm:w-auto"
          >
            Download CV
          </Link>
        </div>
      </div>
    </section>
  );
}
