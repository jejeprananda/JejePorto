import { SectionShell } from "@/components/projects/SectionShell";
import type { ProjectChallenge } from "@/types/project";

type ChallengesProps = {
  items: ProjectChallenge[];
};

export function Challenges({ items }: ChallengesProps) {
  const challenges = items.filter((item) => item.kind === "challenge");
  const solutions = items.filter((item) => item.kind === "solution");

  return (
    <SectionShell tone="muted">
      <div className="max-w-2xl">
        <p className="text-xs font-medium tracking-[0.16em] text-slate-500 uppercase">
          Problem solving
        </p>
        <h2 className="mt-4 font-serif text-4xl tracking-[-0.03em] text-slate-950 sm:text-5xl">
          Challenges & solutions
        </h2>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-sm font-medium tracking-[0.14em] text-slate-500 uppercase">
            Challenges
          </h3>
          {challenges.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5"
            >
              <h4 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
                {item.title}
              </h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium tracking-[0.14em] text-slate-500 uppercase">
            Solutions
          </h3>
          {solutions.map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-0.5"
            >
              <h4 className="text-lg font-semibold tracking-[-0.02em] text-slate-950">
                {item.title}
              </h4>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
