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
  testnet: boolean;
  guide?: boolean;
  votes?: ProjectVotes;
  originalIndex?: number; // For sorting by latest added
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
  showTestnetOnly: boolean;
  showGuideOnly: boolean;
  voteFilter: VoteFilter;
}
