/**
 * Centralized constants for Fluffle application
 * Single source of truth for all configuration values
 * ALL environment variables loaded here once
 */

// Environment Configuration (load ALL env vars once)
export const ENV = {
  NODE_ENV: process.env.NODE_ENV || "development",
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || "",
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET || "",
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN || "",
  JWT_SECRET:
    process.env.JWT_SECRET || "fluffle-default-secret-change-in-production",
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "",
} as const;

// Discord Configuration (use ENV constants)
export const DISCORD_CONFIG = {
  REQUIRED_SERVER_ID: "1219739501673451551",
  REQUIRED_ROLE_ID: "1227046192316285041", // MiniETH role
  CLIENT_ID: ENV.DISCORD_CLIENT_ID,
  CLIENT_SECRET: ENV.DISCORD_CLIENT_SECRET,
  BOT_TOKEN: ENV.DISCORD_BOT_TOKEN,
} as const;

// Discord Roles with Hierarchy
export const DISCORD_ROLES = {
  MINIETH: "1227046192316285041",
  MEGALEVEL: "1245309734362288138",
  ORIGINAL_MAFIA: "1254432472180064286",
  FLUFFLE_HOLDER: "1333412653384728728",
  MEGAMIND: "1302317210160861185",
  CHUBBY_BUNNY: "1302277393616076811",
  BIG_SEQUENCER: "1234655118960365711",
} as const;

// Role tiers from lowest to highest (for vote weighting)
export const ROLE_TIERS = [
  { id: DISCORD_ROLES.MINIETH, name: "MiniETH", weight: 100 },
  { id: DISCORD_ROLES.MEGALEVEL, name: "MegaLevel", weight: 200 },
  { id: DISCORD_ROLES.ORIGINAL_MAFIA, name: "Original Mafia", weight: 300 },
  { id: DISCORD_ROLES.FLUFFLE_HOLDER, name: "Fluffle Holder", weight: 400 },
  { id: DISCORD_ROLES.MEGAMIND, name: "Megamind", weight: 500 },
  { id: DISCORD_ROLES.CHUBBY_BUNNY, name: "Chubby Bunny", weight: 600 },
  {
    id: DISCORD_ROLES.BIG_SEQUENCER,
    name: "Big Sequencer Energy",
    weight: 700,
  },
] as const;

// Rate Limiting Configuration
export const RATE_LIMITS = {
  VOTES: {
    MAX_PER_USER: 15,
    WINDOW_MS: 5 * 60 * 1000, // 5 minutes
  },
  GENERAL: {
    MAX_PER_IP: 100,
    WINDOW_MS: 5 * 60 * 1000, // 5 minutes
  },
} as const;

// Security Headers
export const SECURITY_HEADERS = {
  "Content-Security-Policy": "default-src 'self'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "strict-origin-when-cross-origin",
} as const;

// JWT Configuration (use ENV constants)
export const JWT_CONFIG = {
  SECRET: ENV.JWT_SECRET,
  EXPIRY: 60 * 60, // 1 hour in seconds
} as const;

// Cache Configuration
export const CACHE_TTL = {
  VOTES: 5 * 60, // 5 minutes
  USER_DATA: 10 * 60, // 10 minutes
} as const;

// Vote Types
export const VOTE_TYPES = ["up", "down"] as const;

// Validation Rules
export const VALIDATION_RULES = {
  DISCORD_ID: {
    MIN_LENGTH: 17,
    MAX_LENGTH: 20,
    PATTERN: /^\d{17,20}$/,
  },
  TWITTER_HANDLE: {
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
  PROJECT_ID: {
    MIN: 1,
    MAX: 1000000,
  },
  NFT_ID: {
    MIN: 0,
    MAX: 4999,
  },
} as const;

// Timeouts and Intervals
export const TIMEOUTS = {
  VOTE_COOLDOWN: 1000, // 1 second
  FETCH_TIMEOUT: 10000, // 10 seconds
  HEALTH_CHECK_TIMEOUT: 2000, // 2 seconds
} as const;

// External API Configuration
export const EXTERNAL_APIS = {
  DISCORD: {
    BASE_URL: "https://discord.com/api/v10",
    OAUTH_URL: "https://discord.com/api/oauth2",
  },
  KINGDOMLY: {
    MINTS_URL: "https://kingdomly.app/api/fetchPartnerMints",
  },
  RARIBLE: {
    TESTNET_URL: "https://testnet-bff.rarible.fun/api/drops/search",
  },
} as const;

/**
 * Get highest role from user's roles array
 */
export function getHighestRole(roles: string[]) {
  return ROLE_TIERS.reduce((highest, role) => {
    if (roles.includes(role.id) && (!highest || role.weight > highest.weight)) {
      return role;
    }
    return highest;
  }, null as (typeof ROLE_TIERS)[number] | null);
}
