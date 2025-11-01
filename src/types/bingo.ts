export interface Project {
  name: string;
  website?: string;
  twitter: string;
  description: string;
  category: string;
  megaMafia: boolean;
  native: boolean;
  live: boolean;
  img?: string;
}

export interface BingoTask {
  id: string;
  title: string;
  description: string;
  category: string;
  projects?: string[];
  culturalElement: string;
  links?: string[];
}
