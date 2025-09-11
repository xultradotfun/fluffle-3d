/**
 * API configuration for Fluffle frontend
 * Handles both local development and production API endpoints
 */

import { ENV } from "./constants";

// API Base URL Configuration
const getApiBaseUrl = (): string => {
  // In development, use the backend server
  if (ENV.NODE_ENV === "development") {
    return ENV.NEXT_PUBLIC_API_URL || "http://localhost:3001";
  }

  // In production, use the deployed backend
  return ENV.NEXT_PUBLIC_API_URL || "https://your-backend-url.railway.app";
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * Create full API URL
 */
export const createApiUrl = (path: string): string => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE_URL}/${cleanPath}`;
};

/**
 * Get JWT token from Next.js auth service
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    const response = await fetch("/api/auth/token");
    if (response.ok) {
      const data = await response.json();
      return data.token;
    }
    return null;
  } catch (error) {
    console.error("Failed to get auth token:", error);
    return null;
  }
};

/**
 * Enhanced fetch wrapper with error handling and base URL
 */
export const apiClient = {
  async get(path: string, options?: RequestInit) {
    // Check if this endpoint requires authentication
    const requiresAuth = path.includes("progress") || path.includes("votes");

    let headers = {
      "Content-Type": "application/json",
      ...options?.headers,
    };

    // Add JWT token for authenticated endpoints
    if (requiresAuth) {
      const token = await getAuthToken();
      if (token) {
        headers = {
          ...headers,
          ...(token && { Authorization: `Bearer ${token}` }),
        };
      }
    }

    const response = await fetch(createApiUrl(path), {
      method: "GET",
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },

  async post(path: string, data?: any, options?: RequestInit) {
    const token = await getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      ...options?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(createApiUrl(path), {
      method: "POST",
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return response.json();
  },

  async delete(path: string, data?: any, options?: RequestInit) {
    const token = await getAuthToken();
    const headers = {
      "Content-Type": "application/json",
      ...options?.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    const response = await fetch(createApiUrl(path), {
      method: "DELETE",
      headers,
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      throw new Error(errorData.error || `API Error: ${response.status}`);
    }

    return response.json();
  },

  async raw(path: string, options?: RequestInit) {
    return fetch(createApiUrl(path), options);
  },
};

/**
 * API endpoint paths (for easy updates)
 */
export const API_ENDPOINTS = {
  // Authentication (keep in Next.js for simplicity)
  AUTH: {
    LOGIN: "/api/auth/discord/login",
    CALLBACK: "/api/auth/discord/callback",
    USER: "/api/auth/discord/user",
    LOGOUT: "/api/auth/discord/logout",
  },

  // Voting
  VOTES: {
    LIST: "api/votes",
    SUBMIT: "api/votes",
    HAS_VOTED: "api/votes/hasVoted",
  },

  // Bingo
  BINGO: {
    CONFIG: "api/bingo/config",
    PROGRESS: "api/bingo/progress", // Backend route with JWT
  },

  // Mints (combined endpoint with caching)
  MINTS: "api/mints",

  // Proxy
  PROXY: {
    MINTS: "api/proxy/mints",
    RARIBLE: "api/proxy/rarible",
    IMAGE: "api/proxy/image",
  },

  // Health
  HEALTH: "health",
} as const;
