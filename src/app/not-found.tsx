import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-[640px] flex-col justify-center px-5 py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
        404
      </p>
      <h1 className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950">
        Page not found
      </h1>
      <p className="mt-4 text-base text-slate-600">
        The page you requested does not exist.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-12 w-fit items-center justify-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-white transition hover:bg-orange-400"
      >
        Back home
      </Link>
    </main>
  );
}
