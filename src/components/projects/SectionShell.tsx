import type { ReactNode } from "react";

import { FadeIn } from "@/components/projects/FadeIn";

type SectionShellProps = {
  id?: string;
  tone?: "white" | "muted";
  children: ReactNode;
  className?: string;
  /** Reduce top padding (e.g. hero image under hero) */
  tightTop?: boolean;
};

export function SectionShell({
  id,
  tone = "white",
  children,
  className,
  tightTop = false,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={[
        tone === "muted" ? "bg-slate-50" : "bg-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <FadeIn
        className={[
          "mx-auto w-full max-w-[1280px] px-5 sm:px-8 lg:px-12 xl:px-16",
          tightTop
            ? "pb-16 pt-4 sm:pb-20 sm:pt-6 lg:pb-28 lg:pt-8"
            : "py-16 sm:py-20 lg:py-28",
        ].join(" ")}
      >
        {children}
      </FadeIn>
    </section>
  );
}
