import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col justify-center px-5 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
        404
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-ink">
        Page not found
      </h1>
      <p className="mt-4 text-base text-ink-muted">
        The page you requested does not exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 w-fit items-center justify-center border border-ink px-6 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper"
      >
        Back home
      </Link>
    </main>
  );
}
