"use client";

import { useEffect, useState } from "react";

import { ContributionGraph } from "@/components/ui/contribution-graph";
import { Reveal } from "@/components/shared/Reveal";
import type { GitHubStats } from "@/services/github/getGitHubStats";

type GitHubActivitySectionProps = {
  github: GitHubStats;
};

export function GitHubActivitySection({ github }: GitHubActivitySectionProps) {
  const [monthsToShow, setMonthsToShow] = useState(4);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const largeQuery = window.matchMedia("(min-width: 1024px)");

    const sync = () => {
      if (mobileQuery.matches) {
        setMonthsToShow(3);
        return;
      }

      if (largeQuery.matches) {
        setMonthsToShow(12);
        return;
      }

      setMonthsToShow(4);
    };

    sync();
    mobileQuery.addEventListener("change", sync);
    largeQuery.addEventListener("change", sync);

    return () => {
      mobileQuery.removeEventListener("change", sync);
      largeQuery.removeEventListener("change", sync);
    };
  }, []);

  if (github.contributions.length === 0) {
    return null;
  }

  return (
    <section
      id="github-activity"
      aria-labelledby="github-activity-title"
      className="scroll-mt-24 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10">
        <Reveal trigger="scroll" direction="up" duration={700}>
          <header className="mx-auto max-w-xl text-center">
            <p className="text-xs font-semibold tracking-[0.22em] text-orange-600 uppercase">
              GitHub
            </p>
            <h2
              id="github-activity-title"
              className="mt-4 text-4xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-5xl"
            >
              Recent activity
            </h2>
            <p className="mt-5 text-sm leading-7 text-slate-600 sm:text-base">
              A look at recent commits and contributions on GitHub.
            </p>
          </header>
        </Reveal>

        <Reveal trigger="scroll" direction="up" delay={100} duration={700}>
          <div
            className="
              mx-auto w-full max-w-[min(100%,420px)]
              rounded-2xl border border-slate-200/80
              bg-[#0d1117] px-3 py-3
              shadow-[0_24px_60px_rgba(15,23,42,0.18)]
              sm:px-4 sm:py-4
              md:max-w-[480px]
              lg:max-w-[900px] lg:px-5 lg:py-5
            "
          >
            <ContributionGraph
              contributions={github.contributions}
              profileUrl={github.profileUrl}
              monthsToShow={monthsToShow}
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
