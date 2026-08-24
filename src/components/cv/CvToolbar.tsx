"use client";

import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

export function CvToolbar() {
  function handleDownload() {
    window.print();
  }

  return (
    <div className="print:hidden">
      <div className="mx-auto flex w-full max-w-[900px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 border border-ink bg-transparent px-4 text-sm font-medium text-ink transition hover:bg-ink hover:text-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:w-auto sm:justify-start"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Back to portfolio
        </Link>

        <button
          type="button"
          onClick={handleDownload}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 bg-ink px-5 text-sm font-medium text-paper transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 sm:w-auto"
        >
          <Download className="size-4" aria-hidden="true" />
          Download PDF
        </button>
      </div>
    </div>
  );
}
