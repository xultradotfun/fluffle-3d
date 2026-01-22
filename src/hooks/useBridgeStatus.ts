import { useState, useEffect, useCallback } from "react";
import { fetchDepositStatus } from "@/lib/bridgeApi";
import { DepositStatusResponse } from "@/types/bridge";

const POLL_INTERVAL_MS = 5000;

export function useBridgeStatus(arbTxHash: string | null) {
  const [data, setData] = useState<DepositStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    if (!arbTxHash) return;

    try {
      setLoading(true);
      const response = await fetchDepositStatus(arbTxHash);
      setData(response);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch status"
      );
    } finally {
      setLoading(false);
    }
  }, [arbTxHash]);

  // Initial fetch
  useEffect(() => {
    if (arbTxHash) {
      fetchStatus();
    } else {
      setData(null);
      setError(null);
    }
  }, [arbTxHash, fetchStatus]);

  // Polling for non-completed deposits
  useEffect(() => {
    if (!arbTxHash || !data?.deposit) return;

    // If deposit is completed, no need to poll
    if (data.deposit.status === "COMPLETED") return;

    const pollInterval = setInterval(fetchStatus, POLL_INTERVAL_MS);

    return () => {
      clearInterval(pollInterval);
    };
  }, [arbTxHash, data?.deposit?.status, fetchStatus]);

  return { data, loading, error, refetch: fetchStatus };
}
