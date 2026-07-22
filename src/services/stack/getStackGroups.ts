import { getDb } from "../../lib/db";
import type { StackGroup } from "../../types/stack";

type StackRow = {
  group_title: string;
  group_number: string;
  technology: string;
  sort_order: number;
};

export function getStackGroups(): StackGroup[] {
  const rows = getDb()
    .prepare(
      `SELECT group_title, group_number, technology, sort_order
       FROM stack
       ORDER BY group_number ASC, sort_order ASC, id ASC`,
    )
    .all() as StackRow[];

  const groups = new Map<string, StackGroup>();

  for (const row of rows) {
    const existing = groups.get(row.group_number);

    if (existing) {
      existing.technologies.push(row.technology);
      continue;
    }

    groups.set(row.group_number, {
      number: row.group_number,
      title: row.group_title,
      technologies: [row.technology],
    });
  }

  return [...groups.values()];
}
