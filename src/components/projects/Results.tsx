import { SectionShell } from "@/components/projects/SectionShell";
import type { ProjectResult } from "@/types/project";

type ResultsProps = {
  results: ProjectResult[];
};

export function Results({ results }: ResultsProps) {
  return (
    <SectionShell tone="white">
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
          Outcomes
        </p>
        <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] text-slate-950 sm:text-5xl">
          Results
        </h2>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((result) => (
          <article
            key={`${result.value}-${result.label}`}
            className="rounded-xl border border-slate-200 bg-white px-6 py-8 text-center shadow-sm transition duration-300 hover:-translate-y-0.5"
          >
            <p className="font-serif text-4xl tracking-[-0.04em] text-slate-950 sm:text-5xl">
              {result.value}
            </p>
            <p className="mt-3 text-sm font-medium text-slate-600">{result.label}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
