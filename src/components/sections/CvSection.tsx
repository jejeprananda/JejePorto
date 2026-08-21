import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";

import { Reveal } from "@/components/shared/Reveal";
import type { CvData } from "@/types/cv";

type CvSectionProps = {
  data: CvData;
};

export function CvSection({ data }: CvSectionProps) {
  const technologyCount = data.skills.reduce(
    (total, group) => total + group.skills.length,
    0,
  );

  const previewSkills = data.skills
    .flatMap((group) => group.skills.slice(0, 2))
    .slice(0, 6);

  const stats = [
    { value: String(data.experience.length), label: "Shipped projects" },
    { value: `${technologyCount}+`, label: "Technologies" },
    { value: data.location.split(",")[0] ?? data.location, label: "Based in" },
  ];

  return (
    <section className="bg-white px-5 pb-20 sm:px-8 sm:pb-24 lg:px-12 lg:pb-32">
      <div className="mx-auto w-full max-w-[1280px]">
        <Reveal trigger="scroll" direction="up" duration={700}>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-950 text-white">
            <div className="grid grid-cols-1 gap-10 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:p-14">
              <div className="flex flex-col justify-center">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-orange-400">
                  <FileText className="size-4" aria-hidden="true" />
                  Résumé
                </p>

                <h2 className="mt-4 font-serif text-3xl tracking-[-0.035em] sm:text-4xl lg:text-[2.75rem]">
                  Generate my CV in one click
                </h2>

                <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">
                  A clean, print-ready CV built automatically from this
                  portfolio — the same projects, skills, and experience you see
                  here, formatted for recruiters and downloadable as a PDF.
                </p>

                <ul className="mt-7 flex flex-wrap gap-2">
                  {previewSkills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Link
                    href="/cv"
                    className="inline-flex min-h-12 items-center justify-center gap-2.5 rounded-xl bg-orange-600 px-7 text-sm font-semibold text-white transition hover:bg-orange-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    Open CV generator
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>

                  {data.availability ? (
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-300">
                      <span
                        aria-hidden="true"
                        className="size-2 rounded-full bg-emerald-400"
                      />
                      {data.availability}
                    </span>
                  ) : null}
                </div>
              </div>

              <Reveal
                trigger="scroll"
                direction="up"
                delay={120}
                duration={700}
              >
                <div className="flex h-full flex-col justify-between gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                  <div className="flex items-center gap-4">
                    <div
                      aria-hidden="true"
                      className="flex size-14 shrink-0 items-center justify-center rounded-full bg-orange-500 text-xl font-bold"
                    >
                      JP
                    </div>
                    <div>
                      <p className="font-serif text-xl tracking-[-0.01em]">
                        {data.name}
                      </p>
                      <p className="text-xs uppercase tracking-[0.2em] text-orange-300">
                        {data.headline}
                      </p>
                    </div>
                  </div>

                  <dl className="grid grid-cols-3 gap-3 border-t border-white/10 pt-6">
                    {stats.map((stat) => (
                      <div key={stat.label}>
                        <dt className="sr-only">{stat.label}</dt>
                        <dd className="font-serif text-2xl leading-none text-white">
                          {stat.value}
                        </dd>
                        <p className="mt-1.5 text-[11px] leading-tight text-slate-400">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </dl>
                </div>
              </Reveal>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
