const ALLOWED_BASE_URLS = [
  "http://localhost:3000",
  "https://fluffle-3d-git-feat-ecosystem-voting-xultra.vercel.app",
  "https://mega.xultra.fun",
  "https://www.fluffle.tools",
  "https://fluffle.tools",
  "https://bingo.fluffle.tools",
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
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // For production, default to the main domain
  return "https://fluffle.tools";
}

/**
 * Checks if a URL is one of our allowed base URLs
 * @param url The URL to check
 * @returns boolean indicating if the URL is allowed
 */
export function isAllowedBaseUrl(url: string): boolean {
  return ALLOWED_BASE_URLS.some((baseUrl) => url.startsWith(baseUrl));
}

/**
 * Gets the API URL for the current environment
 * @param path The API path (should start with /)
 * @returns The full API URL
 */
export function getApiUrl(path: string): string {
  const baseUrl = getBaseUrl();
  return `${baseUrl}/api${path}`;
}
