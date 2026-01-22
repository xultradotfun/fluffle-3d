import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { useCallback, useState } from "react";
import { submitDeposit } from "@/lib/bridgeApi";

interface UseBridgeOptions {
  operatorAddress: `0x${string}`;
  senderAddress?: `0x${string}`;
  onSuccess?: (txHash: string) => void;
}

export function useBridgeDeposit({
  operatorAddress,
  senderAddress,
  onSuccess,
}: UseBridgeOptions) {
  const [submitError, setSubmitError] = useState<Error | null>(null);

  const {
    data: hash,
    isPending: isSending,
    sendTransaction,
    reset: resetTransaction,
    error: sendError,
  } = useSendTransaction();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: confirmError,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const reset = useCallback(() => {
    resetTransaction();
    setSubmitError(null);
  }, [resetTransaction]);

  const bridge = useCallback(
    async (amountEth: string) => {
      if (!senderAddress) {
        console.error("No sender address");
        return;
      }

      setSubmitError(null);

      try {
        const value = parseEther(amountEth);
        const amountWei = value.toString();

        sendTransaction(
          {
            to: operatorAddress,
            value,
          },
          {
            onSuccess: async (txHash) => {
              // Submit deposit to backend API
              try {
                await submitDeposit(txHash, senderAddress, amountWei);
                console.log("Deposit submitted to backend:", txHash);
              } catch (err) {
                console.error("Failed to submit deposit to backend:", err);
                setSubmitError(
                  err instanceof Error
                    ? err
                    : new Error("Failed to submit deposit")
                );
              }

              onSuccess?.(txHash);
            },
          }
        );
      } catch (err) {
        console.error("Bridge error:", err);
      }
    },
    [operatorAddress, senderAddress, sendTransaction, onSuccess]
  );

  return {
    bridge,
    txHash: hash,
    isSending,
    isConfirming,
    isConfirmed,
    error: sendError || confirmError || submitError,
    reset,
  };
}
