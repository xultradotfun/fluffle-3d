import { useState, useEffect } from "react";
import { apiClient, API_ENDPOINTS } from "@/lib/api";

interface BingoConfig {
  metadata: {
    version: string;
  };
  tasks: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    culturalElement?: string;
    projects?: string[];
    links?: string[];
  }>;
}

interface UseBingoConfigReturn {
  bingoConfig: BingoConfig | null;
  configLoading: boolean;
  configError: string | null;
}

/**
 * Custom hook for loading and managing bingo configuration
 * Handles API loading, error states, and caching
 */
export function useBingoConfig(): UseBingoConfigReturn {
  const [bingoConfig, setBingoConfig] = useState<BingoConfig | null>(null);
  const [configLoading, setConfigLoading] = useState(true);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    const loadBingoConfig = async () => {
      try {
        setConfigLoading(true);
        setConfigError(null);

        const config = await apiClient.get(API_ENDPOINTS.BINGO.CONFIG);
        setBingoConfig(config);

        console.log(
          `Loaded bingo config with ${config.tasks?.length || 0} tasks`
        );
      } catch (error) {
        console.error("Failed to load bingo config:", error);
        setConfigError("Failed to load bingo configuration");
      } finally {
        setConfigLoading(false);
      }
    };

    loadBingoConfig();
  }, []);

  return {
    bingoConfig,
    configLoading,
    configError,
  };
}
