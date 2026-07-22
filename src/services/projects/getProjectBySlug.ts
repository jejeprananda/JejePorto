import { getDb } from "../../lib/db";
import type { Project } from "../../types/project";

type ProjectRow = {
  id: number;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  long_description: string;
  year: string;
  icon_path: string;
  icon_has_dark_bg: number;
  sort_order: number;
};

function mapProject(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category,
    shortDescription: row.short_description,
    longDescription: row.long_description,
    year: row.year,
    iconPath: row.icon_path,
    iconHasDarkBg: Boolean(row.icon_has_dark_bg),
    sortOrder: row.sort_order,
  };
}

export function getProjectBySlug(slug: string): Project | null {
  const row = getDb()
    .prepare(`SELECT * FROM projects WHERE slug = ?`)
    .get(slug) as ProjectRow | undefined;

  return row ? mapProject(row) : null;
}
