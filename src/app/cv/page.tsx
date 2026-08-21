import type { Metadata } from "next";

import { CvDocument } from "@/components/cv/CvDocument";
import { CvToolbar } from "@/components/cv/CvToolbar";
import { getCvData } from "@/services/cv/getCvData";

export const metadata: Metadata = {
  title: "CV",
  description:
    "Downloadable CV of Jessy Prananda Ismail, generated from portfolio data.",
};

export default function CvPage() {
  const data = getCvData();

  return (
    <main className="min-h-screen bg-slate-100 px-4 pb-20 pt-28 sm:px-6 print:bg-white print:p-0 print:pt-0">
      <div className="mb-5 print:hidden">
        <CvToolbar />
        <p className="mx-auto mt-3 w-full max-w-[900px] text-xs text-slate-500">
          Tip: click{" "}
          <span className="font-medium text-slate-700">Download PDF</span>, then
          choose <span className="font-medium text-slate-700">Save as PDF</span>{" "}
          as the destination for a print-perfect copy.
        </p>
      </div>

      <CvDocument data={data} />
    </main>
  );
}
