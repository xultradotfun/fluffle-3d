interface AliasRule {
  // Patterns to match against (can match name, twitter, description, or author)
  matches: {
    name?: string[];
    twitter?: string[];
    description?: string[];
    author?: string[];
  };
  // The target collection to map to
  target: {
    twitter: string;
    // Optional override for ecosystem data lookup
    ecosystemOverride?: boolean;
  };
  // Optional explanation for why this alias exists
  reason?: string;
}

export const nftAliases: AliasRule[] = [
  {
    matches: {
      // Single pattern that will be matched case-insensitively
      name: ["fimmonaci", "nacci"],
      twitter: ["fimmonaci"],
      description: ["fimmonaci"],
      author: ["fimmonaci", "fimonacci"], // Added Fimonacci variation that exists in the data
    },
    target: {
      twitter: "meganacci",
      ecosystemOverride: true,
    },
    reason:
      "Fimmonaci/Fimonacci is the testnet version of Meganacci collection",
  },
  {
    matches: {
      name: ["MegaETH Commemorative"],
    },
    target: {
      twitter: "KingdomlyApp",
    },
    reason:
      "MegaETH Commemorative NFT collection from Kingdomly maps to KingdomlyApp account",
  },
  {
    matches: {
      name: ["Alien Rabbits"],
      author: ["Alien Rabbits"],
    },
    target: {
      twitter: "AlienRabbitsNft",
    },
    reason:
      "Map collections by Alien Rabbits author to AlienRabbitsNft account",
  },
  {
    matches: {
      name: ["FUN Starts Here", "G-420: FUN Simulation Cartridge"],
    },
    target: {
      twitter: "rarible",
    },
    reason: "Map FUN Starts Here collection to Rarible account",
  },
  // Add more alias rules here as needed
];

// Helper function to normalize strings for comparison
const normalizeString = (s: string): string => {
  if (!s) return "";
  return s.toLowerCase().trim();
};

// Helper function to check if a string matches any pattern
const matchesPattern = (
  value: string | undefined,
  patterns: string[] | undefined
): boolean => {
  if (!value || !patterns || patterns.length === 0) return false;

  const normalizedValue = normalizeString(value);
  return patterns.some((pattern) => {
    const normalizedPattern = normalizeString(pattern);
    const matches = normalizedValue.includes(normalizedPattern);
    return matches;
  });
};

// Helper function to check if a collection matches any alias rules
export function findMatchingAlias(collection: {
  name: string;
  twitter?: string;
  description: string;
  author?: string;
}): AliasRule | null {
  return (
    nftAliases.find((rule) => {
      // Check each field using the matchesPattern helper
      if (matchesPattern(collection.name, rule.matches.name)) {
        return true;
      }

      if (matchesPattern(collection.twitter, rule.matches.twitter)) {
        return true;
      }

      if (matchesPattern(collection.description, rule.matches.description)) {
        return true;
      }

      if (matchesPattern(collection.author, rule.matches.author)) {
        return true;
      }

      return false;
    }) || null
  );
}
