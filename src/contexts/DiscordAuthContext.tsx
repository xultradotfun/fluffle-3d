"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar: string;
  guilds?: {
    id: string;
    name: string;
  }[];
}

interface DiscordAuthContextType {
  user: DiscordUser | null;
  isLoading: boolean;
  login: () => void;
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
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/discord/user");
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to check auth status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    // Redirect to Discord OAuth flow
    window.location.href = "/api/auth/discord/login";
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/discord/logout", { method: "POST" });
      setUser(null);
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <DiscordAuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </DiscordAuthContext.Provider>
  );
}

export const useDiscordAuth = () => useContext(DiscordAuthContext);
