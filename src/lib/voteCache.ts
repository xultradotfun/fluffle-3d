interface ProjectVoteData {
  twitter: string;
  name: string;
  votes: {
    upvotes: number;
    downvotes: number;
    userVote: string | null;
    breakdown: Record<string, { up: number; down: number }>;
  };
}

interface VoteData {
  projects: ProjectVoteData[];
  stats: {
    uniqueVoters: number;
    totalVotes: number;
  };
}

interface CacheEntry {
  data: VoteData;
  timestamp: number;
}

class VoteCache {
  private static instance: VoteCache;
  private cache: CacheEntry | null = null;
  private readonly TTL = 300000; // 5 minute cache TTL

  private constructor() {}

  public static getInstance(): VoteCache {
    if (!VoteCache.instance) {
      VoteCache.instance = new VoteCache();
    }
    return VoteCache.instance;
  }

  public get(): VoteData | null {
    if (!this.cache) return null;

    // Check if cache has expired
    if (Date.now() - this.cache.timestamp > this.TTL) {
      this.invalidate();
      return null;
    }

    return this.cache.data;
  }

  public set(data: VoteData): void {
    this.cache = {
      data,
      timestamp: Date.now(),
    };
  }

  public invalidate(): void {
    this.cache = null;
  }
}

export const voteCache = VoteCache.getInstance();
