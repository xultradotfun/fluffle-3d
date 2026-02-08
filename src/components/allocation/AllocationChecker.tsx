"use client";

import { useState } from "react";
import { colors } from "@/lib/colors";
import {
  Wallet,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import { AllocationResultCard } from "./AllocationResultCard";
import { ApiDocumentation } from "./ApiDocumentation";

interface AllocationData {
  walletAddress: string;
  usdAmount: number;
  megaAmount: number;
  hasAllocation: boolean;
  status?: string;
  bidAmount?: number;
  locked?: boolean;
  rank?: {
    overall: number;
    category: number;
    categoryType: string;
  };
}

interface ApiResponse {
  success: boolean;
  count: number;
  data: AllocationData[];
}

interface AllocationResult {
  wallet: string;
  allocation?: number;
  usdAmount?: number;
  error?: string;
  bidAmount?: number;
  acceptedAmount?: number;
  fillPercentage?: number;
  lockup?: boolean;
  status?: string;
  rank?: {
    overall: number;
    category: number;
    categoryType: string;
  };
}

const FDV_PRESETS = [
  { label: "999M", value: 999_000_000 },
  { label: "1B", value: 1_000_000_000 },
  { label: "2B", value: 2_000_000_000 },
  { label: "5B", value: 5_000_000_000 },
  { label: "10B", value: 10_000_000_000 },
  { label: "15B", value: 15_000_000_000 },
  { label: "20B", value: 20_000_000_000 },
];

export function AllocationChecker() {
  const [walletInput, setWalletInput] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<AllocationResult[]>([]);
  const [hideAddresses, setHideAddresses] = useState(false);
  const [selectedFdv, setSelectedFdv] = useState(999_000_000); // Default 999M

  const parseWallets = (input: string): string[] => {
    // Split by newlines, commas, or spaces and filter out empty strings
    const wallets = input
      .split(/[\n,\s]+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 0);

    // Remove duplicates (case-insensitive)
    const uniqueWallets = Array.from(
      new Set(wallets.map((w) => w.toLowerCase()))
    );

    return uniqueWallets;
  };

  const handleCheck = async () => {
    const wallets = parseWallets(walletInput);

    if (wallets.length === 0) {
      toast.error("Please enter at least one wallet address");
      return;
    }

    // Basic validation
    const invalidWallets = wallets.filter(
      (w) => !w.startsWith("0x") || w.length !== 42
    );
    if (invalidWallets.length > 0) {
      toast.error(`Invalid wallet address format: ${invalidWallets[0]}`);
      return;
    }

    setIsChecking(true);
    setResults([]);

    try {
      // Fetch allocation data from API
      const apiResponse = await fetch(
        "https://megasale-check.xultra.fun/api/allocations/check",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallets }),
        }
      );

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }

      const data: ApiResponse = await apiResponse.json();

      if (!data.success) {
        throw new Error("API returned unsuccessful response");
      }

      // Transform the response into results
      const newResults: AllocationResult[] = wallets.map((wallet) => {
        const allocationData = data.data.find(
          (item) => item.walletAddress.toLowerCase() === wallet.toLowerCase()
        );

        if (allocationData && allocationData.hasAllocation) {
          const result: AllocationResult = {
            wallet: allocationData.walletAddress,
            allocation: allocationData.megaAmount,
            usdAmount: allocationData.usdAmount,
            status: allocationData.status,
            rank: allocationData.rank,
            lockup: allocationData.locked,
          };

          // Add bid amount and fill percentage if available
          if (allocationData.bidAmount) {
            result.bidAmount = allocationData.bidAmount;
            result.acceptedAmount = allocationData.usdAmount;

            // Calculate fill percentage
            if (result.bidAmount > 0) {
              result.fillPercentage =
                (result.acceptedAmount / result.bidAmount) * 100;
            }
          }

          return result;
        } else {
          // No allocation found - show 0 MEGA with 0% filled
          return {
            wallet,
            allocation: 0,
            usdAmount: 0,
          };
        }
      });

      setResults(newResults);

      const allocatedCount = newResults.filter((r) => r.allocation).length;
      if (allocatedCount > 0) {
        toast.success(
          `Found ${allocatedCount} allocation${
            allocatedCount > 1 ? "s" : ""
          } out of ${wallets.length} wallet${wallets.length > 1 ? "s" : ""}`
        );
      } else {
        toast.info(
          `No allocations found for ${wallets.length} wallet${
            wallets.length > 1 ? "s" : ""
          }`
        );
      }
    } catch (error) {
      console.error("Failed to check allocations:", error);
      toast.error("Failed to check allocations. Please try again.");
      setResults(
        wallets.map((wallet) => ({
          wallet,
          error: "Failed to fetch",
        }))
      );
    } finally {
      setIsChecking(false);
    }
  };

  const handleClear = () => {
    setWalletInput("");
    setResults([]);
  };

  const totalAllocation = results.reduce(
    (sum, r) => sum + (r.allocation || 0),
    0
  );

  // Calculate value at selected FDV
  // Base FDV is 999M (from the API's usdAmount)
  const baseFdv = 999_000_000;
  const calculateValueAtFdv = (megaAmount: number) => {
    const priceAtSelectedFdv = selectedFdv / 10_000_000_000; // 10B total supply
    return megaAmount * priceAtSelectedFdv;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Input Section */}
      <div
        style={{
          clipPath:
            "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
        }}
      >
        <div style={{ backgroundColor: colors.pink, padding: "2px" }}>
          <div
            style={{
              backgroundColor: colors.foreground,
              clipPath:
                "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
              padding: "24px",
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Wallet
                  className="w-5 h-5"
                  style={{ color: colors.pink }}
                  strokeWidth={3}
                />
                <h3
                  className="text-lg font-black uppercase"
                  style={{ color: colors.background }}
                >
                  Enter Wallet Addresses
                </h3>
              </div>

              <textarea
                value={walletInput}
                onChange={(e) => setWalletInput(e.target.value)}
                placeholder="0x123...&#10;0x456...&#10;0x789..."
                rows={6}
                className="w-full px-4 py-3 border-3 font-mono text-sm resize-none focus:outline-none focus:border-pink transition-colors"
                style={{
                  backgroundColor: colors.white,
                  color: colors.foreground,
                  borderColor: colors.foreground,
                  clipPath:
                    "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                }}
                disabled={isChecking}
              />

              <p
                className="text-xs font-bold uppercase"
                style={{ color: colors.background }}
              >
                Enter one or multiple addresses (separated by newlines, commas,
                or spaces)
              </p>

              <div className="flex gap-3">
                <button
                  onClick={handleCheck}
                  disabled={isChecking || !walletInput.trim()}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-3 font-bold uppercase text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-pink hover:border-foreground"
                  style={{
                    backgroundColor: colors.pink,
                    borderColor: colors.foreground,
                    color: colors.foreground,
                    clipPath:
                      "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                >
                  {isChecking ? (
                    <>
                      <Loader2
                        className="w-4 h-4 animate-spin"
                        strokeWidth={3}
                      />
                      <span>CHECKING...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" strokeWidth={3} />
                      <span>CHECK ALLOCATIONS</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleClear}
                  disabled={isChecking}
                  className="px-6 py-3 border-3 font-bold uppercase text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-destructive"
                  style={{
                    backgroundColor: colors.light,
                    borderColor: colors.foreground,
                    color: colors.foreground,
                    clipPath:
                      "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                >
                  CLEAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
        <div
          style={{
            clipPath:
              "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
          }}
        >
          <div style={{ backgroundColor: colors.pink, padding: "2px" }}>
            <div
              style={{
                backgroundColor: colors.foreground,
                clipPath:
                  "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
                padding: "24px",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3
                  className="text-lg font-black uppercase"
                  style={{ color: colors.background }}
                >
                  Results ({results.length} wallet
                  {results.length > 1 ? "s" : ""})
                </h3>

                <div className="flex items-center gap-2">
                  {/* FDV Selector */}
                  <div className="flex items-center gap-1">
                    {FDV_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        onClick={() => setSelectedFdv(preset.value)}
                        className="px-2 py-1.5 border-3 font-bold uppercase text-xs transition-colors"
                        style={{
                          backgroundColor:
                            selectedFdv === preset.value
                              ? colors.pink
                              : "transparent",
                          borderColor: colors.background,
                          color:
                            selectedFdv === preset.value
                              ? colors.foreground
                              : colors.background,
                          clipPath:
                            "polygon(4px 0, 100% 0, 100% calc(100% - 4px), calc(100% - 4px) 100%, 0 100%, 0 4px)",
                        }}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>

                  {/* Privacy Toggle */}
                  <button
                    onClick={() => setHideAddresses(!hideAddresses)}
                    className="flex items-center gap-2 px-3 py-2 border-3 font-bold uppercase text-xs transition-colors hover:bg-muted"
                    style={{
                      backgroundColor: hideAddresses
                        ? colors.pink
                        : "transparent",
                      borderColor: colors.background,
                      color: hideAddresses ? colors.foreground : colors.background,
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                    }}
                    title={hideAddresses ? "Show addresses" : "Hide addresses"}
                  >
                    {hideAddresses ? (
                      <EyeOff className="w-4 h-4" strokeWidth={3} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={3} />
                    )}
                  </button>
                </div>
              </div>

              {/* Total Summary */}
              {totalAllocation > 0 && (
                <div
                  className="mb-4 p-4 border-3"
                  style={{
                    backgroundColor: colors.green,
                    borderColor: colors.foreground,
                    clipPath:
                      "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-black uppercase"
                      style={{ color: colors.white }}
                    >
                      Total Allocation
                    </span>
                    <div className="text-right">
                      <div
                        className="text-2xl font-black"
                        style={{ color: colors.white }}
                      >
                        {totalAllocation.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}{" "}
                        MEGA
                      </div>
                      <div
                        className="text-sm font-bold"
                        style={{ color: colors.light }}
                      >
                        $
                        {calculateValueAtFdv(totalAllocation).toLocaleString(
                          undefined,
                          { maximumFractionDigits: 2 }
                        )}{" "}
                        @{" "}
                        {
                          FDV_PRESETS.find((p) => p.value === selectedFdv)
                            ?.label
                        }{" "}
                        FDV
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Individual Results */}
              <div className="space-y-2">
                {results.map((result, index) => (
                  <AllocationResultCard
                    key={index}
                    result={result}
                    hideAddresses={hideAddresses}
                    calculateValueAtFdv={calculateValueAtFdv}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Documentation */}
      <ApiDocumentation />
    </div>
  );
}
