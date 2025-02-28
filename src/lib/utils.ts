import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Calculate a project's score based on weighted votes from different roles
 * @param votes Vote breakdown by role
 * @returns Score from 0 to 10
 */
export function calculateProjectScore(votes: {
  breakdown?: Record<string, { up: number; down: number }>;
}): number {
  if (!votes?.breakdown) return 0;

  // Role levels (position in hierarchy)
  const roleWeights: Record<string, number> = {
    MiniETH: 1,
    MegaLevel: 3,
    "Original Mafia": 5,
    Megamind: 8,
    "Chubby Bunny": 13,
    "Big Sequencer Energy": 21,
  };

  let totalWeightedVotes = 0;
  let totalWeight = 0;
  let totalVotes = 0;

  // Calculate weighted votes and total weight
  Object.entries(votes.breakdown).forEach(([role, { up, down }]) => {
    const weight = roleWeights[role] || 1; // Default to MiniETH weight if role not found
    totalWeightedVotes += (up - down) * weight;
    totalWeight += (up + down) * weight; // Track total weight of all votes
    totalVotes += up + down; // Track total number of votes
  });

  // If no votes, return 0
  if (totalWeight === 0) return 0;

  // Calculate base score from weighted votes (0-10 scale)
  const baseScore = (totalWeightedVotes / totalWeight + 1) * 5;

  // Calculate engagement multiplier (starts at 0.5 and approaches 1.0)
  // This ensures projects with very few votes can't get too high scores
  const engagementMultiplier = 0.5 + (1 - Math.exp(-totalVotes / 10)) * 0.5;

  // Apply engagement multiplier to base score
  let score = baseScore * engagementMultiplier;

  // Add engagement bonus (can push score above base * multiplier)
  // More impactful for projects with significant engagement
  const engagementBonus = Math.log(totalVotes + 1) / 2;
  score += engagementBonus;

  // Round to one decimal and ensure bounds
  return Math.max(0, Math.min(10, Number(score.toFixed(1))));
}
