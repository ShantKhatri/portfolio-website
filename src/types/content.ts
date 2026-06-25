export interface NowItem {
  date: string;
  type: "talk" | "event" | "milestone" | "release" | "news";
  text: string;
  url?: string;
  archived: boolean;
}

export interface Talk {
  id: string;
  title: string;
  event: string;
  date: string;
  type: "delivered" | "upcoming";
  description?: string;
  slides?: string;
  video?: string;
}

export interface Project {
  slug: string;
  number: number;
  name: string;
  tagline: string;
  description: string;
  status: "live" | "in-progress" | "shipped" | "published";
  stack: string[];
  tags: ("OSS" | "Infra" | "Research")[];
  github?: string;
  live?: string;
  keyDecision?: {
    label: string;
    text: string;
  };
  sections?: ProjectSection[];
}

export interface ProjectSection {
  title: string;
  body: string;
}

export interface Experience {
  period: string;
  role: string;
  org: string;
  badge?: string;
  description: string;
}

export interface Recognition {
  org: string;
  role: string;
  year: string;
  url?: string;
}

export interface Education {
  period: string;
  degree: string;
  school: string;
  grade: string;
}

export interface ConferenceEvent {
  year: string;
  name: string;
  role: string;
  location: string;
}

export interface OSSOrg {
  org: string;
  role: string;
  period: string;
  description?: string;
  links?: { label: string; url: string }[];
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  credentialId?: string;
}
