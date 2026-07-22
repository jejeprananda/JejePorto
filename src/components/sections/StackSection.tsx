import type { StackGroup } from "@/types/stack";

type StackSectionProps = {
  groups: StackGroup[];
};

export function StackSection({ groups }: StackSectionProps) {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-12 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-20">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
            Tech stack
          </p>
          <h2
            id="stack-title"
            className="mt-4 text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-slate-950 sm:text-5xl"
          >
            Technologies
            <br />
            I use
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-7 text-slate-600">
            Technologies and tools I use to design, develop, test, and deliver
            modern digital products.
          </p>
        </header>

        {groups.length === 0 ? (
          <p className="text-sm text-slate-600">No stack data available yet.</p>
        ) : (
          <div className="grid grid-cols-1 border-t border-slate-200 sm:grid-cols-2 xl:grid-cols-4">
            {groups.map((group, index) => (
              <article
                key={group.number}
                className={[
                  "border-b border-slate-200 py-7 sm:px-6",
                  index % 2 === 0 ? "sm:border-r" : "",
                  index > 0 ? "xl:border-l" : "",
                  "xl:border-r-0 xl:px-8",
                ].join(" ")}
              >
                <p className="font-mono text-xs text-orange-600">{group.number}</p>
                <h3 className="mt-4 text-base font-semibold text-slate-950">
                  {group.title}
                </h3>
                <ul className="mt-6 space-y-3">
                  {group.technologies.map((technology) => (
                    <li
                      key={technology}
                      className="flex items-center gap-3 text-sm text-slate-600"
                    >
                      <span
                        aria-hidden="true"
                        className="size-1 rounded-full bg-slate-400"
                      />
                      <span>{technology}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
