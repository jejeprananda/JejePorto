"use client";

import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

export function CvToolbar() {
  function handleDownload() {
    window.print();
  }

  return (
    <div className="print:hidden">
      <div className="mx-auto flex w-full max-w-[900px] items-center justify-between gap-3">
        <Link
          href="/"
          className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to portfolio
        </Link>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-slate-950 px-5 text-sm font-medium text-white transition hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
        >
          <Download className="size-4" aria-hidden="true" />
          Download PDF
        </button>
      </div>
    </div>
  );
}
