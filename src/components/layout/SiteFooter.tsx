import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-paper px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center gap-x-6 gap-y-3 font-mono text-xs text-ink-muted">
        <span className="text-ink">Jessy Prananda</span>
        <Link
          href="/contact"
          className="inline-flex min-h-11 items-center hover:text-accent"
        >
          Contact
        </Link>
        <Link
          href="/cv"
          className="inline-flex min-h-11 items-center hover:text-accent"
        >
          CV
        </Link>
        <span>{year}</span>
      </div>
    </footer>
  );
}
