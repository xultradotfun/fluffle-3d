"use client";

import { useState, useMemo, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { calculateFee, formatWeiToEth, parseEthToWei, truncateAddress } from "@/utils/bridge";
import { useWalletBridge } from "@/hooks/useWalletBridge";
import { useBridgeDeposit } from "@/hooks/useBridgeDeposit";
import { Loader2, ArrowRight, AlertTriangle, LogOut, Wallet } from "lucide-react";
import { HealthResponse } from "@/types/bridge";
import { BorderedBox, getClipPath } from "@/components/ui/BorderedBox";
import { Button } from "@/components/ui/Button";
import { colors } from "@/lib/colors";

interface BridgeFormProps {
  health: HealthResponse;
  onBridgeSuccess: (txHash: string) => void;
}

const MIN_AMOUNT = 0.00015;
const MAX_AMOUNT = 0.0015;
const STEP_SIZE = 0.00005;
const FALLBACK_ETH_PRICE = 3500;

function getErrorMessage(error: Error): string {
  const message = error.message.toLowerCase();

  if (message.includes("user rejected") || message.includes("user denied")) {
    return "Transaction rejected";
  }
  if (message.includes("insufficient funds") || message.includes("insufficient balance")) {
    return "Insufficient balance";
  }
  if (message.includes("network") || message.includes("connection")) {
    return "Network error. Please try again";
  }
  if (message.includes("gas")) {
    return "Transaction failed. Gas estimation error";
  }

  const firstLine = error.message.split('\n')[0].split('.')[0];
  return firstLine.length > 80 ? "Transaction failed" : firstLine;
}

// Reusable status box with colored border
interface StatusBoxProps {
  borderColor: string;
  children: React.ReactNode;
  className?: string;
}

function StatusBox({ borderColor, children, className = "p-4" }: StatusBoxProps) {
  const clipPath = getClipPath(12);
  return (
    <div style={{ clipPath }}>
      <div style={{ backgroundColor: borderColor, padding: "2px" }}>
        <div className={className} style={{ backgroundColor: colors.foreground, clipPath }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Action button for bridge
interface BridgeButtonProps {
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  bgColor?: string;
  textColor?: string;
  children: React.ReactNode;
}

function BridgeButton({ onClick, type = "button", disabled, bgColor = colors.pink, textColor = colors.foreground, children }: BridgeButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full h-14 text-base font-black uppercase transition-opacity hover:opacity-90 disabled:opacity-40"
      style={{ backgroundColor: bgColor, color: textColor, clipPath: getClipPath(12) }}
    >
      {children}
    </button>
  );
}

export function BridgeForm({ health, onBridgeSuccess }: BridgeFormProps) {
  const [amount, setAmount] = useState("0.0005");
  const [ethPrice, setEthPrice] = useState(FALLBACK_ETH_PRICE);

  useEffect(() => {
    fetch("/api/math/markets")
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && data.markets?.ethereum) {
          setEthPrice(data.markets.ethereum.current_price);
        }
      })
      .catch((err) => console.error("Error fetching ETH price:", err));
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

  const operatorAddress = health?.chains?.arbitrum?.operatorAddress as `0x${string}` | undefined;

  const { bridge, isSending, isConfirming, txHash, error, reset } = useBridgeDeposit({
    operatorAddress: operatorAddress || "0x0000000000000000000000000000000000000000" as `0x${string}`,
    senderAddress: address,
    onSuccess: onBridgeSuccess,
  });

  const { feeBps } = health?.config || { feeBps: 0 };
  const queueInfo = health?.queue;

  const operatorBalance = health?.chains?.megaeth?.balance;
  const operatorBalanceEth = operatorBalance ? parseFloat(operatorBalance) : 0;
  const hasInsufficientGas = operatorBalanceEth < 0.0001;
  const isBridgeReady = !!operatorAddress && operatorAddress !== "0x0000000000000000000000000000000000000000";

  const feePreview = useMemo(() => {
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) return null;
    try {
      const weiAmount = parseEthToWei(amount);
      const { feeWei, payoutWei } = calculateFee(weiAmount, feeBps);
      return { fee: formatWeiToEth(feeWei, 6), payout: formatWeiToEth(payoutWei, 6) };
    } catch {
      return null;
    }
  }, [amount, feeBps]);

  const validation = useMemo(() => {
    const amountNum = parseFloat(amount);
    if (hasInsufficientGas) return { valid: false, error: "Bridge operator out of gas" };
    if (balance !== undefined) {
      const balanceEth = Number(balance) / 1e18;
      if (amountNum > balanceEth) return { valid: false, error: "Insufficient balance" };
    }
    return { valid: true, error: null };
  }, [amount, balance, hasInsufficientGas]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.valid || !amount || !isBridgeReady) return;
    await bridge(amount);
  };

  const usdValue = amount ? (parseFloat(amount) * ethPrice).toFixed(2) : "0.00";
  const receiveUsdValue = feePreview ? (parseFloat(feePreview.payout) * ethPrice).toFixed(2) : "0.00";

  return (
    <>
      {/* Connected Wallet Header */}
      {isConnected && address && (
        <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: `2px solid ${colors.border}` }}>
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5" style={{ color: colors.pink }} strokeWidth={3} />
            <span className="text-sm font-mono font-bold" style={{ color: colors.background }}>
              {truncateAddress(address)}
            </span>
          </div>
          <Button
            variant="brutalist"
            size="sm"
            cornerSize={6}
            onClick={() => disconnect()}
            className="flex items-center gap-1.5 text-xs"
            style={{ color: colors.error, backgroundColor: "rgba(244, 67, 54, 0.1)" }}
          >
            <LogOut className="w-3 h-3" strokeWidth={3} />
            Disconnect
          </Button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Bridge Route */}
        <div style={{ clipPath: getClipPath(12) }}>
          <div style={{ backgroundColor: colors.white, padding: "16px" }}>
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:justify-between">
              <div className="flex items-center gap-2 sm:gap-3 justify-center">
                <Image src="/tokens/arbitrum.svg" alt="Arbitrum" width={28} height={28} className="sm:w-8 sm:h-8" />
                <span className="font-black text-sm sm:text-lg uppercase" style={{ color: colors.foreground }}>Arbitrum</span>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.pink }} strokeWidth={3} />
                <Image src="/tokens/mega.png" alt="MegaETH" width={28} height={28} className="rounded-full sm:w-8 sm:h-8" />
                <span className="font-black text-sm sm:text-lg uppercase" style={{ color: colors.foreground }}>MegaETH</span>
              </div>

              {queueInfo && (
                <span
                  className="text-[9px] font-black uppercase px-2 py-1 whitespace-nowrap"
                  style={{
                    backgroundColor: queueInfo.paused ? colors.warning : colors.success,
                    color: colors.white,
                    clipPath: getClipPath(3),
                  }}
                >
                  Queue: {queueInfo.paused ? "Paused" : "Live"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Warning */}
        <StatusBox borderColor={colors.warning} className="p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: colors.warning }} strokeWidth={3} />
            <div className="text-xs font-bold leading-tight" style={{ color: colors.background }}>
              <span style={{ color: colors.warning }} className="font-black uppercase">Warning:</span> This is a{" "}
              <span className="font-black">one-way bridge</span> with a{" "}
              <span className="font-black">queue system</span>. Transfers may take a while depending on queue size.
              Maximum bridgeable: <span className="font-black">{MAX_AMOUNT} ETH</span>. Risk of loss of funds. Use at your own risk.
            </div>
          </div>
        </StatusBox>

        {/* Amount Slider */}
        <div style={{ clipPath: getClipPath(12) }}>
          <div style={{ backgroundColor: colors.white, padding: "16px" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: colors.muted }}>
                Gas Amount
              </span>
              {isConnected && formattedBalance && (
                <span className="text-xs font-bold" style={{ color: colors.muted }}>
                  Balance: <span style={{ color: colors.foreground }}>{parseFloat(formattedBalance).toFixed(4)}</span> ETH
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <Image src="/tokens/eth.svg" alt="ETH" width={32} height={32} />
              <div className="flex-1">
                <div className="text-2xl font-black" style={{ color: colors.foreground }}>{amount}</div>
                <div className="text-xs font-bold mt-0.5" style={{ color: colors.muted }}>${usdValue}</div>
              </div>
              <span className="text-sm font-black" style={{ color: colors.foreground }}>ETH</span>
            </div>

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
                  background: `linear-gradient(to right, ${colors.pink} 0%, ${colors.pink} ${((parseFloat(amount) - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100}%, ${colors.background} ${((parseFloat(amount) - MIN_AMOUNT) / (MAX_AMOUNT - MIN_AMOUNT)) * 100}%, ${colors.background} 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px] font-bold uppercase" style={{ color: colors.muted }}>
                <span>{MIN_AMOUNT} ETH</span>
                <span>Gas Amount</span>
                <span>{MAX_AMOUNT} ETH</span>
              </div>
            </div>
          </div>
        </div>

        {/* Receive Preview */}
        {feePreview && validation.valid && (
          <StatusBox borderColor={colors.success}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black uppercase tracking-wider" style={{ color: colors.background }}>
                You Receive
              </span>
              <span className="text-xs font-bold" style={{ color: colors.background }}>
                Fee: {(feeBps / 100).toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/tokens/eth.svg" alt="ETH" width={32} height={32} />
              <div className="flex-1">
                <div className="text-2xl font-black" style={{ color: colors.success }}>{feePreview.payout}</div>
                <div className="text-xs font-bold" style={{ color: colors.background }}>${receiveUsdValue}</div>
              </div>
              <span className="text-sm font-black" style={{ color: colors.background }}>ETH</span>
            </div>
          </StatusBox>
        )}

        {/* Validation Error */}
        {validation.error && (
          <div
            className="text-sm font-black text-center py-3 uppercase"
            style={{ backgroundColor: "rgba(244, 67, 54, 0.1)", color: colors.error }}
          >
            {validation.error}
          </div>
        )}

        {/* Transaction Status */}
        {txHash && (
          <StatusBox borderColor={colors.pink}>
            <div className="flex items-center gap-2 mb-2">
              <Loader2 className="h-4 w-4 animate-spin" style={{ color: colors.pink }} strokeWidth={3} />
              <span className="text-sm font-black uppercase" style={{ color: colors.pink }}>
                {isConfirming ? "Confirming..." : "Submitted"}
              </span>
            </div>
            <p className="text-xs font-mono font-bold truncate" style={{ color: colors.background }}>
              {txHash}
            </p>
          </StatusBox>
        )}

        {/* Operator Out of Gas Warning */}
        {hasInsufficientGas && (
          <StatusBox borderColor={colors.error}>
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: colors.error }} strokeWidth={3} />
              <div>
                <p className="text-sm font-black uppercase" style={{ color: colors.error }}>
                  BRIDGE TEMPORARILY UNAVAILABLE
                </p>
                <p className="text-xs font-bold mt-1" style={{ color: colors.background }}>
                  The bridge operator has run out of gas. Please check back later or contact support.
                </p>
                <p className="text-xs font-mono font-bold mt-1" style={{ color: colors.muted }}>
                  Operator balance: {operatorBalanceEth.toFixed(6)} ETH
                </p>
              </div>
            </div>
          </StatusBox>
        )}

        {/* Error Display */}
        {error && !hasInsufficientGas && (
          <StatusBox borderColor={colors.error}>
            <p className="text-sm font-bold" style={{ color: colors.error }}>
              {getErrorMessage(error)}
            </p>
            <button
              type="button"
              onClick={() => reset()}
              className="text-xs font-black uppercase mt-2 hover:underline"
              style={{ color: colors.pink }}
            >
              Try again
            </button>
          </StatusBox>
        )}

        {/* Action Button */}
        <div className="pt-2">
          {!isConnected ? (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <BridgeButton onClick={openConnectModal}>
                  Connect Wallet
                </BridgeButton>
              )}
            </ConnectButton.Custom>
          ) : isWrongChain ? (
            <BridgeButton onClick={switchToArbitrum} bgColor={colors.warning} textColor={colors.white}>
              Switch to Arbitrum
            </BridgeButton>
          ) : (
            <BridgeButton
              type="submit"
              disabled={!validation.valid || !amount || !isBridgeReady || isSending || isConfirming}
            >
              {!isBridgeReady ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" strokeWidth={3} />
                  Initializing...
                </span>
              ) : hasInsufficientGas ? (
                <span className="flex items-center justify-center gap-2">
                  <AlertTriangle className="h-5 w-5" strokeWidth={3} />
                  Operator Out of Gas
                </span>
              ) : isSending ? (
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
            </BridgeButton>
          )}
        </div>
      </form>
    </>
  );
}
