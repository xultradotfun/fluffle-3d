export interface Project {
  name: string;
  twitter: string;
  description: string;
  longDescription?: string;
  features?: ProjectFeature[];
  currentStatus?: string;
  website?: string;
  discord?: string;
  telegram?: string;
}

export interface ProjectFeature {
  title: string;
  description: string;
}

export interface Guide {
  sections: GuideSection[];
  requirements: string[];
  lastUpdated: string;
}

export interface GuideSection {
  id: string;
  title: string;
  steps: GuideStep[];
}

export interface GuideStep {
  id: string;
  title: string;
  content: string;
  images?: GuideImage[];
  links?: GuideLink[];
}

export interface GuideImage {
  url: string;
  alt: string;
}

export interface GuideLink {
  text: string;
  url: string;
}

export interface Progress {
  completedSteps: string[];
  lastVisited: string;
}
