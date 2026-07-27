import { SectionShell } from "@/components/projects/SectionShell";
import type { ProjectTimelineItem } from "@/types/project";

type TimelineProps = {
  items: ProjectTimelineItem[];
};

export function Timeline({ items }: TimelineProps) {
  return (
    <SectionShell tone="muted">
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
          Process
        </p>
        <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] text-slate-950 sm:text-5xl">
          Development process
        </h2>
      </div>

      <ol className="relative mt-14 space-y-0 border-l border-slate-200 pl-8 sm:pl-10">
        {items.map((item, index) => (
          <li key={item.phase} className="relative pb-12 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute top-1.5 -left-[2.55rem] flex size-5 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm sm:-left-[3.05rem]"
            >
              <span className="size-2 rounded-full bg-orange-500" />
            </span>
            <p className="text-xs font-medium tracking-[0.14em] text-orange-600 uppercase">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-slate-950">
              {item.phase}
            </h3>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              {item.description}
            </p>
          </li>
        ))}
      </ol>
    </SectionShell>
  );
}
