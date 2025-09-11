/**
 * Centralized validation utilities for Fluffle application
 * Eliminates duplicate validation logic across the codebase
 */

import { VALIDATION_RULES, VOTE_TYPES } from "./constants";

export type VoteType = (typeof VOTE_TYPES)[number];

// Type definitions for validation
export interface VoteRequest {
  twitter: string;
  vote: VoteType;
  userId: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Discord ID validation
 */
export function validateDiscordId(id: string): boolean {
  return VALIDATION_RULES.DISCORD_ID.PATTERN.test(id);
}

export function sanitizeDiscordId(id: string): string {
  // Remove any non-numeric characters as Discord IDs are numeric
  return id.trim().replace(/[^0-9]/g, "");
}

/**
 * Twitter handle validation
 */
export function validateTwitterHandle(handle: string): boolean {
  if (!handle || handle.length > VALIDATION_RULES.TWITTER_HANDLE.MAX_LENGTH) {
    return false;
  }
  return VALIDATION_RULES.TWITTER_HANDLE.PATTERN.test(handle);
}

export function sanitizeTwitterHandle(handle: string): string {
  return handle.trim().replace(/[^a-zA-Z0-9_]/g, "");
}

/**
 * Vote type validation
 */
export function isValidVoteType(vote: string): vote is VoteType {
  return VOTE_TYPES.includes(vote as VoteType);
}

/**
 * Project ID validation
 */
export function validateProjectId(projectId: string): number | null {
  const parsed = parseInt(projectId.trim());
  if (
    isNaN(parsed) ||
    parsed < VALIDATION_RULES.PROJECT_ID.MIN ||
    parsed > VALIDATION_RULES.PROJECT_ID.MAX
  ) {
    return null;
  }
  return parsed;
}

/**
 * NFT ID validation
 */
export function validateNftId(id: string): ValidationResult {
  const errors: string[] = [];
  const num = parseInt(id);

  if (isNaN(num)) {
    errors.push(`"${id}" is not a valid number`);
  } else if (
    num < VALIDATION_RULES.NFT_ID.MIN ||
    num > VALIDATION_RULES.NFT_ID.MAX
  ) {
    errors.push(
      `NFT ID ${num} is out of range (must be between ${VALIDATION_RULES.NFT_ID.MIN} and ${VALIDATION_RULES.NFT_ID.MAX})`
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate multiple NFT IDs
 */
export function validateNftIds(
  input: string,
  loadedIds: string[] = [],
  maxNFTs?: number
): {
  validIds: string[];
  errors: string[];
  duplicates: string[];
} {
  const ids = input
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const errors: string[] = [];
  const validIds: string[] = [];
  const duplicates: string[] = [];
  const seenIds = new Set<string>();

  // Check if adding these IDs would exceed the maxNFTs limit
  if (maxNFTs && loadedIds.length + ids.length > maxNFTs) {
    errors.push(
      `You can only load up to ${maxNFTs} NFT${maxNFTs === 1 ? "" : "s"}`
    );
    return { validIds, errors, duplicates };
  }

  ids.forEach((id) => {
    const validation = validateNftId(id);

    if (!validation.isValid) {
      errors.push(...validation.errors);
      return;
    }

    // Check for duplicates in current input
    if (seenIds.has(id)) {
      duplicates.push(id);
      return;
    }

    // Check if NFT is already loaded
    if (loadedIds.includes(id)) {
      duplicates.push(id);
      return;
    }

    seenIds.add(id);
    validIds.push(id);
  });

  return { validIds, errors, duplicates };
}

/**
 * Vote request validation
 */
export function validateVoteRequest(body: any): body is VoteRequest {
  if (!body || typeof body !== "object") return false;

  const { twitter, vote, userId } = body;

  if (typeof twitter !== "string" || !twitter.trim()) return false;
  if (typeof userId !== "string" || !userId.trim()) return false;
  if (!isValidVoteType(vote)) return false;

  // Additional validation rules
  if (!validateTwitterHandle(twitter)) return false;
  if (!validateDiscordId(userId)) return false;

  return true;
}

/**
 * User data format validation
 */
export function validateUserData(userData: any): boolean {
  if (!userData || typeof userData !== "object") return false;

  const { id, username, guildIds } = userData;

  if (!id || typeof id !== "string") return false;
  if (!username || typeof username !== "string") return false;
  if (!Array.isArray(guildIds)) return false;

  return validateDiscordId(id);
}

/**
 * Server membership validation
 */
export function validateServerMembership(guildIds: string[]): boolean {
  const { REQUIRED_SERVER_ID } = require("./constants").DISCORD_CONFIG;
  return guildIds.includes(REQUIRED_SERVER_ID);
}

/**
 * MegaETH collection validation (for proxy filtering)
 */
export function isMegaETHCollection(collection: any): boolean {
  if (!collection) return false;

  const isMegaETH =
    collection?.contract_address ===
      "0x9b5C1a2b7c3c7D3A6b7C5e3b4A4C4D8E5F6A7B8C" ||
    collection?.name?.toLowerCase().includes("megaeth") ||
    collection?.symbol?.toLowerCase().includes("mega");

  const isBadBunnz =
    collection?.contract_address ===
      "0x1234567890abcdef1234567890abcdef12345678" ||
    collection?.name?.toLowerCase().includes("badbunnz");

  return isMegaETH || isBadBunnz;
}

/**
 * Task ID validation for bingo
 */
export function validateTaskId(
  taskId: string,
  validTaskIds: string[]
): boolean {
  return typeof taskId === "string" && validTaskIds.includes(taskId);
}
