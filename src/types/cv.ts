export type CvContactLink = {
  label: string;
  value: string;
  href: string;
};

export type CvExperience = {
  slug: string;
  title: string;
  role: string;
  company: string;
  period: string;
  category: string;
  status: string;
  description: string;
  highlights: string[];
  tech: string[];
};

export type CvSkillGroup = {
  title: string;
  skills: string[];
};

export type CvService = {
  title: string;
  description: string;
};

export type CvData = {
  name: string;
  headline: string;
  location: string;
  availability: string | null;
  summary: string;
  contacts: CvContactLink[];
  experience: CvExperience[];
  skills: CvSkillGroup[];
  services: CvService[];
};
