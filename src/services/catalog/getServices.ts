import { getDb } from "../../lib/db";
import type { Service } from "../../types/service";

type ServiceRow = {
  id: number;
  slug: string;
  title: string;
  short_description: string;
  detail_description: string;
  icon_name: string;
  sort_order: number;
};

function mapService(row: ServiceRow): Service {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    shortDescription: row.short_description,
    detailDescription: row.detail_description,
    iconName: row.icon_name,
    sortOrder: row.sort_order,
  };
}

export function getServices(): Service[] {
  const rows = getDb()
    .prepare(`SELECT * FROM services ORDER BY sort_order ASC, id ASC`)
    .all() as ServiceRow[];

  return rows.map(mapService);
}
