import type { StackGroup } from "@/types/stack";

type StackSectionProps = {
  groups: StackGroup[];
};

export function StackSection({ groups }: StackSectionProps) {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="scroll-mt-24 bg-paper px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <header className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
            Tech stack
          </p>
          <h2
            id="stack-title"
            className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl"
          >
            Technologies I use
          </h2>
          <p className="mt-5 text-sm leading-7 text-ink-muted sm:text-base">
            Frontend, backend, database, design, testing, and deployment.
          </p>
        </header>

        {groups.length === 0 ? (
          <p className="mt-12 border-y border-rule py-10 text-sm text-ink-muted">
            No stack data available yet.
          </p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-10 border-t border-rule pt-10 sm:grid-cols-2 xl:grid-cols-4">
            {groups.map((group) => (
              <article key={group.number}>
                <h3 className="font-mono text-xs uppercase tracking-[0.16em] text-accent">
                  {group.title}
                </h3>
                <ul className="mt-4">
                  {group.technologies.map((technology) => (
                    <li
                      key={technology}
                      className="border-t border-rule py-2.5 text-sm text-ink"
                    >
                      {technology}
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
