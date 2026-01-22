import {
  DepositStatusResponse,
  HealthResponse,
  SubmitDepositResponse,
} from "@/types/bridge";

// Use internal API routes to keep backend URL hidden
const API_BASE_URL = "/api/bridge";

export async function fetchDepositStatus(
  arbTxHash: string
): Promise<DepositStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/status?arbTx=${arbTxHash}`, {
    cache: "no-cache", // Never cache - always get fresh status
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to fetch deposit status");
  }

  return response.json();
}

export async function fetchBridgeHealth(): Promise<HealthResponse> {
  const response = await fetch(`${API_BASE_URL}/health`, {
    cache: "no-cache", // Always get fresh health status
  });

  if (!response.ok) {
    throw new Error("Failed to fetch bridge health status");
  }

  return response.json();
}

export async function submitDeposit(
  arbTxHash: string,
  sender: string,
  amountWei: string
): Promise<SubmitDepositResponse> {
  const response = await fetch(`${API_BASE_URL}/deposit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      arbTxHash,
      sender,
      amountWei,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 409) {
      return {
        success: true,
        message: data.error || "Deposit already recorded",
      };
    }
    const error = new Error(data.error || "Failed to submit deposit") as Error & {
      status?: number;
    };
    error.status = response.status;
    throw error;
  }

  return data;
}
