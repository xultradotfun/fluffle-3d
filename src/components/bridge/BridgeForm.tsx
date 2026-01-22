"use client";

import { useState, useMemo, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { calculateFee, formatWeiToEth, parseEthToWei, truncateAddress } from "@/utils/bridge";
import { useWalletBridge } from "@/hooks/useWalletBridge";
import { useBridgeDeposit } from "@/hooks/useBridgeDeposit";
import { Loader2, ArrowRight, AlertTriangle, LogOut, Wallet } from "lucide-react";
import { HealthResponse } from "@/types/bridge";

interface BridgeFormProps {
  health: HealthResponse;
  onBridgeSuccess: (txHash: string) => void;
}

const MIN_AMOUNT = 0.00015;
const MAX_AMOUNT = 0.0015;
const STEP_SIZE = 0.00005;
const FALLBACK_ETH_PRICE = 3500;

export function BridgeForm({ health, onBridgeSuccess }: BridgeFormProps) {
  const [amount, setAmount] = useState("0.0005"); // Default to 0.0005 ETH
  const [ethPrice, setEthPrice] = useState(FALLBACK_ETH_PRICE);
  
  // Fetch live ETH price
  useEffect(() => {
    fetch("/api/math/markets")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.markets?.ethereum) {
          setEthPrice(data.markets.ethereum.current_price);
        }
      })
      .catch((err) => {
        console.error("Error fetching ETH price:", err);
        // Keep fallback price
      });
  }, []);
  
  const {
    address,
    isConnected,
    balance,
    formattedBalance,
    isWrongChain,
    switchToArbitrum,
    disconnect,
  } = useWalletBridge();

  const { bridge, isSending, isConfirming, txHash, error, reset} = useBridgeDeposit({
    operatorAddress: (health?.chains?.arbitrum?.operatorAddress || "0x0") as `0x${string}`,
    senderAddress: address,
    onSuccess: onBridgeSuccess,
  });

  const { feeBps } = health?.config || { feeBps: 0 };
  const queueInfo = health?.queue;

  // Calculate fee preview
  const feePreview = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return null;
    }
    try {
      const weiAmount = parseEthToWei(amount);
      const { feeWei, payoutWei } = calculateFee(weiAmount, feeBps);
      return {
        fee: formatWeiToEth(feeWei, 6),
        payout: formatWeiToEth(payoutWei, 6),
      };
    } catch {
      return null;
    }
  }, [amount, feeBps]);

  // Validation
  const validation = useMemo(() => {
    const amountNum = parseFloat(amount);

    if (balance !== undefined) {
      const balanceEth = Number(balance) / 1e18;
      if (amountNum > balanceEth) {
        return { valid: false, error: "Insufficient balance" };
      }
    }

    return { valid: true, error: null };
  }, [amount, balance]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.valid || !amount) return;
    await bridge(amount);
  };

  const usdValue = amount ? (parseFloat(amount) * ethPrice).toFixed(2) : "0.00";
  const receiveUsdValue = feePreview
    ? (parseFloat(feePreview.payout) * ethPrice).toFixed(2)
    : "0.00";

  return (
    <>
          {/* Connected Wallet Header */}
          {isConnected && address && (
            <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: "2px solid #333" }}>
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5" style={{ color: "#f380cd" }} strokeWidth={3} />
                <span className="text-sm font-mono font-bold" style={{ color: "#dfd9d9" }}>
                  {truncateAddress(address)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => disconnect()}
                className="flex items-center gap-1.5 text-xs font-black uppercase px-3 py-1.5 transition-opacity hover:opacity-70"
                style={{
                  color: "#f44336",
                  backgroundColor: "rgba(244, 67, 54, 0.1)",
                  clipPath:
                    "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                }}
              >
                <LogOut className="w-3 h-3" strokeWidth={3} />
                Disconnect
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Bridge Route - Single Line */}
            <div
              style={{
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div style={{ backgroundColor: "#fff", padding: "16px" }}>
                <div className="flex items-center justify-center gap-3">
                  <Image src="/tokens/arbitrum.svg" alt="Arbitrum" width={32} height={32} />
                  <span className="font-black text-lg uppercase" style={{ color: "#19191a" }}>
                    Arbitrum
                  </span>
                  <ArrowRight className="w-5 h-5 mx-2" style={{ color: "#f380cd" }} strokeWidth={3} />
                  <Image src="/tokens/mega.png" alt="MegaETH" width={32} height={32} className="rounded-full" />
                  <span className="font-black text-lg uppercase" style={{ color: "#19191a" }}>
                    MegaETH
                  </span>
                </div>
              </div>
            </div>

            {/* Warning */}
            <div
              style={{
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div style={{ backgroundColor: "#ff9800", padding: "2px" }}>
                <div
                  className="p-3"
                  style={{
                    backgroundColor: "#19191a",
                    clipPath:
                      "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#ff9800" }} strokeWidth={3} />
                      <div className="text-xs font-bold leading-tight" style={{ color: "#dfd9d9" }}>
                        <span style={{ color: "#ff9800" }} className="font-black uppercase">Warning:</span> This is a{" "}
                        <span className="font-black">one-way bridge</span>. Maximum bridgeable:{" "}
                        <span className="font-black">{MAX_AMOUNT} ETH</span>. Risk of loss of funds. Use at your own risk.
                      </div>
                    </div>
                    {queueInfo && (
                      <span
                        className="text-[10px] font-black uppercase px-2 py-1 flex-shrink-0"
                        style={{
                          backgroundColor: queueInfo.paused ? "#ff9800" : "#4caf50",
                          color: "#fff",
                          clipPath:
                            "polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)",
                        }}
                      >
                        {queueInfo.paused ? "Paused" : "Live"}
                      </span>
                    )}
                  </div>
                  {queueInfo?.paused && queueInfo.reason && (
                    <p className="text-xs font-bold mt-2 ml-6" style={{ color: "#ff9800" }}>
                      {queueInfo.reason}
                    </p>
                  )}
                </div>
              </div>
            </div>

          {/* Amount Slider */}
          <div
            style={{
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
            }}
          >
            <div style={{ backgroundColor: "#fff", padding: "16px" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-black uppercase tracking-wider" style={{ color: "#666" }}>
                  Gas Amount
                </span>
                {isConnected && formattedBalance && (
                  <span className="text-xs font-bold" style={{ color: "#666" }}>
                    Balance:{" "}
                    <span style={{ color: "#19191a" }}>
                      {parseFloat(formattedBalance).toFixed(4)}
                    </span>{" "}
                    ETH
                  </span>
                )}
              </div>
              
              {/* Selected Amount Display */}
              <div className="flex items-center gap-3 mb-4">
                <Image src="/tokens/eth.svg" alt="ETH" width={32} height={32} />
                <div className="flex-1">
                  <div className="text-2xl font-black" style={{ color: "#19191a" }}>
                    {amount}
                  </div>
                  <div className="text-xs font-bold mt-0.5" style={{ color: "#666" }}>
                    ${usdValue}
                  </div>
                </div>
                <span className="text-sm font-black" style={{ color: "#19191a" }}>
                  ETH
                </span>
              </div>

              {/* Slider */}
              <div className="space-y-2">
                <input
                  type="range"
                  min={MIN_AMOUNT}
                  max={MAX_AMOUNT}
                  step={STEP_SIZE}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  disabled={isSending || isConfirming}
                  className="w-full h-3 border-3 border-background appearance-none cursor-pointer slider-brutalist"
                  style={{
                    background: `linear-gradient(to right, #f380cd 0%, #f380cd ${((parseFloat(amount) - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100}%, #dfd9d9 ${((parseFloat(amount) - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100}%, #dfd9d9 100%)`,
                  }}
                />
                
                {/* Amount Labels */}
                <div className="flex justify-between text-[10px] font-bold uppercase" style={{ color: "#666" }}>
                  <span>{MIN_AMOUNT} ETH</span>
                  <span>Gas Amount</span>
                  <span>{MAX_AMOUNT} ETH</span>
                </div>
              </div>
            </div>
          </div>

            {/* Receive Preview */}
            {feePreview && validation.valid && (
              <div
                style={{
                  clipPath:
                    "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                }}
              >
                <div style={{ backgroundColor: "#4caf50", padding: "2px" }}>
                  <div
                    className="p-4"
                    style={{
                      backgroundColor: "#19191a",
                      clipPath:
                        "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black uppercase tracking-wider" style={{ color: "#dfd9d9" }}>
                        You Receive
                      </span>
                      <span className="text-xs font-bold" style={{ color: "#dfd9d9" }}>
                        Fee: {(feeBps / 100).toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Image src="/tokens/eth.svg" alt="ETH" width={32} height={32} />
                      <div className="flex-1">
                        <div className="text-2xl font-black" style={{ color: "#4caf50" }}>
                          {feePreview.payout}
                        </div>
                        <div className="text-xs font-bold" style={{ color: "#dfd9d9" }}>
                          ${receiveUsdValue}
                        </div>
                      </div>
                      <span className="text-sm font-black" style={{ color: "#dfd9d9" }}>
                        ETH
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Validation Error */}
            {validation.error && (
              <div
                className="text-sm font-black text-center py-3 uppercase"
                style={{ backgroundColor: "rgba(244, 67, 54, 0.1)", color: "#f44336" }}
              >
                {validation.error}
              </div>
            )}

            {/* Transaction Status */}
            {txHash && (
              <div
                style={{
                  clipPath:
                    "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                }}
              >
                <div style={{ backgroundColor: "#f380cd", padding: "2px" }}>
                  <div
                    className="p-4"
                    style={{
                      backgroundColor: "#19191a",
                      clipPath:
                        "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                    }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Loader2 className="h-4 w-4 animate-spin" style={{ color: "#f380cd" }} strokeWidth={3} />
                      <span className="text-sm font-black uppercase" style={{ color: "#f380cd" }}>
                        {isConfirming ? "Confirming..." : "Submitted"}
                      </span>
                    </div>
                    <p className="text-xs font-mono font-bold truncate" style={{ color: "#dfd9d9" }}>
                      {txHash}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div
                style={{
                  clipPath:
                    "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                }}
              >
                <div style={{ backgroundColor: "#f44336", padding: "2px" }}>
                  <div
                    className="p-4"
                    style={{
                      backgroundColor: "#19191a",
                      clipPath:
                        "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                    }}
                  >
                    <p className="text-sm font-bold" style={{ color: "#f44336" }}>
                      {error.message}
                    </p>
                    <button
                      type="button"
                      onClick={() => reset()}
                      className="text-xs font-black uppercase mt-2 hover:underline"
                      style={{ color: "#f380cd" }}
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-2">
              {!isConnected ? (
                <ConnectButton.Custom>
                  {({ openConnectModal }) => (
                    <button
                      type="button"
                      onClick={openConnectModal}
                      className="w-full h-14 text-base font-black uppercase transition-opacity hover:opacity-90"
                      style={{
                        backgroundColor: "#f380cd",
                        color: "#19191a",
                        clipPath:
                          "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                      }}
                    >
                      Connect Wallet
                    </button>
                  )}
                </ConnectButton.Custom>
              ) : isWrongChain ? (
                <button
                  type="button"
                  onClick={switchToArbitrum}
                  className="w-full h-14 text-base font-black uppercase transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: "#ff9800",
                    color: "#fff",
                    clipPath:
                      "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                  }}
                >
                  Switch to Arbitrum
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full h-14 text-base font-black uppercase transition-opacity hover:opacity-90 disabled:opacity-40"
                  style={{
                    backgroundColor: "#f380cd",
                    color: "#19191a",
                    clipPath:
                      "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                  }}
                  disabled={!validation.valid || !amount || isSending || isConfirming}
                >
                  {isSending ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" strokeWidth={3} />
                      Confirm in Wallet
                    </span>
                  ) : isConfirming ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin" strokeWidth={3} />
                      Confirming...
                    </span>
                  ) : (
                    "Bridge to MegaETH"
                  )}
                </button>
              )}
            </div>
          </form>
    </>
  );
}
