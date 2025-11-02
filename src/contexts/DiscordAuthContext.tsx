"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiClient, API_ENDPOINTS, createApiUrl } from "@/lib/api";

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  canVote: boolean;
  guilds?: {
    id: string;
    name: string;
  }[];
}

interface DiscordAuthContextType {
  user: DiscordUser | null;
  isLoading: boolean;
  login: (returnTo?: string) => void;
  logout: () => void;
}

const DiscordAuthContext = createContext<DiscordAuthContextType>({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export function DiscordAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    checkAuth();

    // Check for auth success/error params in URL (from OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('auth_success') || urlParams.has('auth_error')) {
      // Re-check auth after a brief delay to ensure cookies are set
      setTimeout(() => {
        checkAuth();
        // Clean up URL params after auth check
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('auth_success');
        newUrl.searchParams.delete('auth_error');
        window.history.replaceState({}, '', newUrl.toString());
      }, 100);
    }
  }, []);

  const checkAuth = async () => {
    try {
      // Use relative path for auth endpoints (Next.js)
      const response = await fetch(API_ENDPOINTS.AUTH.USER);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (returnTo?: string) => {
    // Redirect to Discord OAuth flow (use relative path for Next.js)
    const loginUrl = returnTo
      ? `${API_ENDPOINTS.AUTH.LOGIN}?returnTo=${encodeURIComponent(returnTo)}`
      : API_ENDPOINTS.AUTH.LOGIN;
    window.location.href = loginUrl;
  };

  const logout = async () => {
    try {
      // Use relative path for auth endpoints (Next.js)
      await fetch(API_ENDPOINTS.AUTH.LOGOUT, { method: "POST" });
      setUser(null);
    } catch (error) {
      console.error("Failed to logout:", error);
      // Even if logout fails on backend, clear local state
      setUser(null);
    }
  };

  return (
    <DiscordAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </DiscordAuthContext.Provider>
  );
}

export const useDiscordAuth = () => useContext(DiscordAuthContext);
