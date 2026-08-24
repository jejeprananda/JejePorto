import { SectionShell } from "@/components/projects/SectionShell";
import type { ProjectTimelineItem } from "@/types/project";

type TimelineProps = {
  items: ProjectTimelineItem[];
};

export function Timeline({ items }: TimelineProps) {
  return (
    <SectionShell tone="muted">
      <div className="max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Process
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
          Development process
        </h2>
      </div>

      <ol className="relative mt-14 space-y-0 border-l border-rule pl-8 sm:pl-10">
        {items.map((item, index) => (
          <li key={item.phase} className="relative pb-12 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[2.55rem] flex size-5 items-center justify-center border border-rule bg-paper sm:-left-[3.05rem]"
            >
              <span className="size-2 bg-accent" />
            </span>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-ink">
              {item.phase}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-muted sm:text-base">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
