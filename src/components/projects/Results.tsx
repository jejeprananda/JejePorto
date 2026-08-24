import { SectionShell } from "@/components/projects/SectionShell";
import type { ProjectResult } from "@/types/project";

type ResultsProps = {
  results: ProjectResult[];
};

export function Results({ results }: ResultsProps) {
  return (
    <SectionShell tone="white">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Outcomes
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
          Results
        </h2>
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((result) => (
          <article
            key={`${result.value}-${result.label}`}
            className="border-t border-rule py-8 text-center"
          >
            <p className="text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl">
              {result.value}
            </p>
            <p className="mt-3 text-sm font-medium text-ink-muted">{result.label}</p>
          </article>
        ))}
      </div>
    </SectionShell>
  );
}
