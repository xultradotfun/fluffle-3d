export interface VoteBreakdown {
  [roleName: string]: {
    up: number;
    down: number;
  };
}

export interface ProjectVotes {
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
  breakdown: VoteBreakdown;
}

export interface Project {
  name: string;
  twitter: string;
  website?: string;
  discord?: string;
  telegram?: string;
  description: string;
  category: string;
  megaMafia: boolean;
  native: boolean;
  live: boolean;
  img?: string;
  votes?: ProjectVotes;
  originalIndex?: number; // For sorting by latest added
  featured?: boolean; // Pinned to top when sorting by score
  featuredIndex?: number; // Order in featured list
}

export type VoteFilter = "all" | "voted" | "not_voted";

export type SortType = "alphabetical" | "score" | "latest";
export type SortDirection = "asc" | "desc";

export interface SortMethod {
  type: SortType;
  direction: SortDirection;
}

export interface ProjectFilters {
  selectedCategory: string | null;
  showMegaMafiaOnly: boolean;
  showNativeOnly: boolean;
  showLiveOnly: boolean;
  voteFilter: VoteFilter;
}
