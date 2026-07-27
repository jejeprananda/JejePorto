export type Project = {
  id: number;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  year: string;
  iconPath: string;
  iconHasDarkBg: boolean;
  sortOrder: number;
  isFlagship: boolean;
};

export type ProjectFeature = {
  iconName: string;
  title: string;
  description: string;
};

export type ProjectGalleryItem = {
  imagePath: string;
  caption: string;
  layout: "large" | "small";
};

export type ProjectTimelineItem = {
  phase: string;
  description: string;
};

export type ProjectChallenge = {
  kind: "challenge" | "solution";
  title: string;
  body: string;
};

export type ProjectResult = {
  value: string;
  label: string;
};

export type ProjectDetail = Project & {
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
  websiteUrl: string | null;
  githubUrl: string | null;
  heroImage: string;
  heroCaption: string;
  overviewHeading: string;
  features: ProjectFeature[];
  gallery: ProjectGalleryItem[];
  timeline: ProjectTimelineItem[];
  tech: string[];
  challenges: ProjectChallenge[];
  results: ProjectResult[];
};
