import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-rule bg-paper px-5 py-6 sm:px-8 lg:px-12">
      <div className="mx-auto flex w-full max-w-[1280px] flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-ink-muted">
        <span className="text-ink">Jessy Prananda</span>
        <Link href="/contact" className="hover:text-accent">
          Contact
        </Link>
        <Link href="/cv" className="hover:text-accent">
          CV
        </Link>
        <span>{year}</span>
      </div>
    </footer>
  );
}
