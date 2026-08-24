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
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Problem solving
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-ink sm:text-4xl">
          Challenges & solutions
        </h2>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
            Challenges
          </h3>
          {challenges.map((item) => (
            <article
              key={item.title}
              className="border-t border-rule py-6"
            >
              <h4 className="text-lg font-semibold tracking-[-0.02em] text-ink">
                {item.title}
              </h4>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
            </article>
          ))}
        </div>

        <div className="space-y-4">
          <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-ink-muted">
            Solutions
          </h3>
          {solutions.map((item) => (
            <article
              key={item.title}
              className="border-t border-rule py-6"
            >
              <h4 className="text-lg font-semibold tracking-[-0.02em] text-ink">
                {item.title}
              </h4>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
