import { SectionShell } from "@/components/projects/SectionShell";

type OverviewProps = {
  heading: string;
  description: string;
};

export function Overview({ heading, description }: OverviewProps) {
  return (
    <SectionShell tone="muted">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] lg:gap-20">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Project
          </p>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
            {heading}
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-8 text-ink-muted sm:text-lg sm:leading-9">
          {description}
        </p>
      </div>
    </SectionShell>
  );
}
