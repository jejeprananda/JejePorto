import type { StackGroup } from "@/types/stack";

type StackSectionProps = {
  groups: StackGroup[];
};

export function StackSection({
  groups,
}: StackSectionProps) {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <header className="grid gap-8 border-b border-slate-200 pb-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-600">
              Tech stack
            </p>

            <h2
              id="stack-title"
              className="mt-4 font-serif text-5xl leading-[0.9] tracking-[-0.045em] text-slate-950 sm:text-6xl"
            >
              Technologies
              <br />
              I use
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-slate-600 sm:text-base">
            A practical combination of frontend, backend, database, design,
            testing, and deployment technologies.
          </p>
        </header>

        {groups.length === 0 ? (
          <p className="border-b border-slate-200 py-10 text-sm text-slate-600">
            No stack data available yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 border-b border-slate-200 sm:grid-cols-2 xl:grid-cols-4">
            {groups.map((group, index) => (
              <article
                key={group.number}
                className={[
                  "border-b border-slate-200 py-9",
                  "sm:px-7",
                  index % 2 === 0 ? "sm:border-r" : "",
                  index > 0 ? "xl:border-l" : "",
                  "xl:border-b-0 xl:border-r-0 xl:px-8",
                ].join(" ")}
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs text-orange-600">
                    {group.number}
                  </p>

                  <span
                    aria-hidden="true"
                    className="h-px w-10 bg-slate-300"
                  />
                </div>

                <h3 className="mt-6 font-serif text-2xl tracking-[-0.025em] text-slate-950">
                  {group.title}
                </h3>

                <ul className="mt-7">
                  {group.technologies.map(
                    (technology, technologyIndex) => (
                      <li
                        key={technology}
                        className="flex items-center justify-between gap-4 border-t border-slate-100 py-3.5 text-sm text-slate-600"
                      >
                        <span>{technology}</span>

                        <span className="font-mono text-[10px] text-slate-400">
                          {String(technologyIndex + 1).padStart(
                            2,
                            "0",
                          )}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
