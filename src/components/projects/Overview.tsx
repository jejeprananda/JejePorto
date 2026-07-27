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
          <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
            Project
          </p>
          <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] text-slate-950 sm:text-5xl">
            {heading}
          </h2>
        </div>
        <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg sm:leading-9">
          {description}
        </p>
      </div>
    </SectionShell>
  );
}
