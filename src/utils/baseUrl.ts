import { ENV } from "@/lib/constants";

const ALLOWED_BASE_URLS = [
  "http://localhost:3000",
  "https://fluffle-3d-git-feat-ecosystem-voting-xultra.vercel.app",
  "https://mega.xultra.fun",
  "https://www.fluffle.tools",
  "https://fluffle.tools",
] as const;

/**
 * Gets the base URL for the current environment
 * @returns The base URL for the current environment
 */
export function getBaseUrl(): string {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    const currentOrigin = window.location.origin;

    // If the current origin is in our allowed list, use it
    if (ALLOWED_BASE_URLS.includes(currentOrigin as any)) {
      return currentOrigin;
    }
  }

  // For development, default to localhost
  if (ENV.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // For production, default to the main domain
  return "https://fluffle.tools";
}

