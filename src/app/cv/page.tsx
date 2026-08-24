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
      </div>

      <CvDocument data={data} />
    </main>
  );
}
