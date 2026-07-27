import { getDb } from "../../lib/db";
import type {
  ProjectChallenge,
  ProjectDetail,
  ProjectFeature,
  ProjectGalleryItem,
  ProjectResult,
  ProjectTimelineItem,
} from "../../types/project";

type ProjectDetailRow = {
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
  is_flagship: number;
  role: string;
  company: string;
  status: string;
  duration: string;
  client: string;
  platform: string;
  frontend: string;
  backend: string;
  database: string;
  deployment: string;
  website_url: string | null;
  github_url: string | null;
  hero_image: string;
  hero_caption: string;
  overview_heading: string;
};

type FeatureRow = {
  icon_name: string;
  title: string;
  description: string;
};

type GalleryRow = {
  image_path: string;
  caption: string;
  layout: "large" | "small";
};

type TimelineRow = {
  phase: string;
  description: string;
};

type TechRow = {
  name: string;
};

type ChallengeRow = {
  kind: "challenge" | "solution";
  title: string;
  body: string;
};

type ResultRow = {
  value: string;
  label: string;
};

function mapFeatures(rows: FeatureRow[]): ProjectFeature[] {
  return rows.map((row) => ({
    iconName: row.icon_name,
    title: row.title,
    description: row.description,
  }));
}

function mapGallery(rows: GalleryRow[]): ProjectGalleryItem[] {
  return rows.map((row) => ({
    imagePath: row.image_path,
    caption: row.caption,
    layout: row.layout,
  }));
}

function mapTimeline(rows: TimelineRow[]): ProjectTimelineItem[] {
  return rows.map((row) => ({
    phase: row.phase,
    description: row.description,
  }));
}

function mapChallenges(rows: ChallengeRow[]): ProjectChallenge[] {
  return rows.map((row) => ({
    kind: row.kind,
    title: row.title,
    body: row.body,
  }));
}

function mapResults(rows: ResultRow[]): ProjectResult[] {
  return rows.map((row) => ({
    value: row.value,
    label: row.label,
  }));
}

export function getProjectBySlug(slug: string): ProjectDetail | null {
  const db = getDb();
  const row = db
    .prepare(`SELECT * FROM projects WHERE slug = ?`)
    .get(slug) as ProjectDetailRow | undefined;

  if (!row) {
    return null;
  }

  const features = db
    .prepare(
      `SELECT icon_name, title, description FROM project_features
       WHERE project_id = ? ORDER BY sort_order ASC, id ASC`,
    )
    .all(row.id) as FeatureRow[];

  const gallery = db
    .prepare(
      `SELECT image_path, caption, layout FROM project_gallery
       WHERE project_id = ? ORDER BY sort_order ASC, id ASC`,
    )
    .all(row.id) as GalleryRow[];

  const timeline = db
    .prepare(
      `SELECT phase, description FROM project_timeline
       WHERE project_id = ? ORDER BY sort_order ASC, id ASC`,
    )
    .all(row.id) as TimelineRow[];

  const tech = db
    .prepare(
      `SELECT name FROM project_tech
       WHERE project_id = ? ORDER BY sort_order ASC, id ASC`,
    )
    .all(row.id) as TechRow[];

  const challenges = db
    .prepare(
      `SELECT kind, title, body FROM project_challenges
       WHERE project_id = ? ORDER BY sort_order ASC, id ASC`,
    )
    .all(row.id) as ChallengeRow[];

  const results = db
    .prepare(
      `SELECT value, label FROM project_results
       WHERE project_id = ? ORDER BY sort_order ASC, id ASC`,
    )
    .all(row.id) as ResultRow[];

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
    isFlagship: Boolean(row.is_flagship),
    role: row.role,
    company: row.company,
    status: row.status,
    duration: row.duration,
    client: row.client,
    platform: row.platform,
    frontend: row.frontend,
    backend: row.backend,
    database: row.database,
    deployment: row.deployment,
    websiteUrl: row.website_url,
    githubUrl: row.github_url,
    heroImage: row.hero_image,
    heroCaption: row.hero_caption,
    overviewHeading: row.overview_heading,
    features: mapFeatures(features),
    gallery: mapGallery(gallery),
    timeline: mapTimeline(timeline),
    tech: tech.map((item) => item.name),
    challenges: mapChallenges(challenges),
    results: mapResults(results),
  };
}
