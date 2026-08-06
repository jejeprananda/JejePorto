"use client";

import { memo, useMemo } from "react";

import type { ContributionDay } from "@/services/github/getGitHubStats";

const LEVEL_COLORS = [
  "rgba(255,255,255,0.08)",
  "#0e4429",
  "#006d32",
  "#26a641",
  "#39d353",
] as const;

const WEEKDAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""] as const;
const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

type ContributionGraphProps = {
  contributions: ContributionDay[];
  profileUrl: string;
  monthsToShow: number;
};

function filterLastMonths(
  contributions: ContributionDay[],
  months: number,
): ContributionDay[] {
  if (contributions.length === 0) {
    return [];
  }

  const cutoff = new Date();
  cutoff.setHours(12, 0, 0, 0);
  cutoff.setMonth(cutoff.getMonth() - months);

  return contributions.filter(
    (day) => new Date(`${day.date}T12:00:00`) >= cutoff,
  );
}

function groupIntoWeeks(
  contributions: ContributionDay[],
): (ContributionDay | null)[][] {
  if (contributions.length === 0) {
    return [];
  }

  const firstDow = new Date(`${contributions[0].date}T12:00:00`).getDay();
  const padded: (ContributionDay | null)[] = [
    ...Array.from({ length: firstDow }, () => null),
    ...contributions,
  ];

  const weeks: (ContributionDay | null)[][] = [];

  for (let index = 0; index < padded.length; index += 7) {
    const week = padded.slice(index, index + 7);
    while (week.length < 7) {
      week.push(null);
    }
    weeks.push(week);
  }

  return weeks;
}

function monthLabelsForWeeks(
  weeks: (ContributionDay | null)[][],
): Array<string | null> {
  let previousMonth = -1;

  return weeks.map((week) => {
    const firstDay = week.find((day) => day !== null);
    if (!firstDay) {
      return null;
    }

    const month = new Date(`${firstDay.date}T12:00:00`).getMonth();
    if (month === previousMonth) {
      return null;
    }

    previousMonth = month;
    return MONTH_LABELS[month];
  });
}

function formatContributionLabel(day: ContributionDay): string {
  const formatted = new Date(`${day.date}T12:00:00`).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  if (day.count === 0) {
    return `No contributions on ${formatted}`;
  }

  if (day.count === 1) {
    return `1 contribution on ${formatted}`;
  }

  return `${day.count} contributions on ${formatted}`;
}

function formatMonthsLabel(months: number): string {
  return months === 1 ? "1 month" : `${months} months`;
}

export const ContributionGraph = memo(function ContributionGraph({
  contributions,
  profileUrl,
  monthsToShow,
}: ContributionGraphProps) {
  const { recentTotal, weeks, monthLabels } = useMemo(() => {
    const recentContributions = filterLastMonths(contributions, monthsToShow);
    const groupedWeeks = groupIntoWeeks(recentContributions);

    return {
      recentTotal: recentContributions.reduce(
        (sum, day) => sum + day.count,
        0,
      ),
      weeks: groupedWeeks,
      monthLabels: monthLabelsForWeeks(groupedWeeks),
    };
  }, [contributions, monthsToShow]);

  const periodLabel = formatMonthsLabel(monthsToShow);

  if (weeks.length === 0) {
    return null;
  }

  return (
    <div className="min-w-0 w-full [contain:layout_paint]">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <p className="text-xs font-semibold tracking-[0.14em] text-white/85 uppercase">
          GitHub Commit Activity
        </p>
        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          className="
            shrink-0 text-xs text-white/70
            transition hover:text-white
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ff8a00]
          "
        >
          {recentTotal.toLocaleString()} in the last {periodLabel}
        </a>
      </div>

      <div className="flex max-w-full justify-center overflow-x-auto overflow-y-hidden pb-1">
        <div
          className="inline-grid gap-[3px]"
          style={{
            gridTemplateColumns: `28px repeat(${weeks.length}, 10px)`,
          }}
          role="img"
          aria-label={`${recentTotal} contributions in the last ${periodLabel} on GitHub`}
        >
          <span aria-hidden="true" />
          {monthLabels.map((label, index) => (
            <span
              key={`month-${index}`}
              aria-hidden="true"
              className="relative h-3 text-[10px] leading-none text-white/60"
            >
              {label ? (
                <span className="absolute top-0 left-0 whitespace-nowrap">
                  {label}
                </span>
              ) : null}
            </span>
          ))}

          {WEEKDAY_LABELS.map((label, rowIndex) => (
            <div key={`row-${rowIndex}`} className="contents">
              <span
                aria-hidden="true"
                className="pr-1 text-right text-[10px] leading-[10px] text-white/60"
              >
                {label}
              </span>

              {weeks.map((week, weekIndex) => {
                const day = week[rowIndex];

                if (!day) {
                  return (
                    <span
                      key={`empty-${rowIndex}-${weekIndex}`}
                      aria-hidden="true"
                      className="size-[10px]"
                    />
                  );
                }

                return (
                  <span
                    key={day.date}
                    title={formatContributionLabel(day)}
                    className="size-[10px] rounded-[2px]"
                    style={{ backgroundColor: LEVEL_COLORS[day.level] }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-2.5 flex items-center justify-end gap-1.5 text-[10px] text-white/60">
        <span>Less</span>
        {LEVEL_COLORS.map((color, level) => (
          <span
            key={color}
            aria-hidden="true"
            className="size-[10px] rounded-[2px]"
            style={{ backgroundColor: color }}
            title={`Level ${level}`}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
});
