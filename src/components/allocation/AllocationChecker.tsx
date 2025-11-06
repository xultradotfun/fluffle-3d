"use client";

import { useState } from "react";
import {
  Wallet,
  Loader2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Code,
} from "lucide-react";
import { toast } from "sonner";
import { ethers } from "ethers";
import saleAbi from "../../../public/abis/sale.json";

interface AllocationData {
  walletAddress: string;
  usdAmount: number;
  megaAmount: number;
  hasAllocation: boolean;
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

const SALE_CONTRACT = "0xab02bf85a7a851b6a379ea3d5bd3b9b4f5dd8461";
const RPC_URL = "https://eth.llamarpc.com";

export function AllocationChecker() {
  const [walletInput, setWalletInput] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [results, setResults] = useState<AllocationResult[]>([]);
  const [hideAddresses, setHideAddresses] = useState(false);
  const [selectedFdv, setSelectedFdv] = useState(999_000_000); // Default 999M
  const [showApiDocs, setShowApiDocs] = useState(false);

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

  const fetchOnChainData = async (wallets: string[]) => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(SALE_CONTRACT, saleAbi, provider);

      // Fetch entity IDs for all wallets in a single call
      const entityIds = await contract.entitiesByAddress(wallets);

      // Filter out zero entity IDs (wallets without entities)
      const validEntityIds = entityIds.filter(
        (id: string) => id !== "0x00000000000000000000000000000000"
      );

      if (validEntityIds.length === 0) {
        return null;
      }

      // Convert to plain array to avoid read-only issues with ethers.js
      const entityIdsArray = validEntityIds.map((id: any) => id);

      // Fetch all entity states in a single call
      const entityStates = await contract.entityStatesByID(entityIdsArray);

      // Map entity states back to wallets
      const onChainData = new Map<string, any>();
      for (let i = 0; i < entityStates.length; i++) {
        const state = entityStates[i];
        const walletAddr = state[0].toLowerCase(); // addr field

        onChainData.set(walletAddr, {
          entityID: state[1], // entityID
          acceptedAmount: Number(state[2]), // acceptedAmount (uint64)
          bidTimestamp: Number(state[3]), // bidTimestamp
          refunded: state[4], // refunded
          cancelled: state[5], // cancelled
          bidPrice: Number(state[6][0]), // activeBid.price
          bidAmount: Number(state[6][1]), // activeBid.amount
          bidLockup: state[6][2], // activeBid.lockup
        });
      }

      return onChainData;
    } catch (error) {
      console.error("Error fetching on-chain data:", error);
      return null;
    }
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
      // Fetch both API data and on-chain data in parallel
      const [apiResponse, onChainData] = await Promise.all([
        fetch("https://megasale-check.xultra.fun/api/allocations/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallets }),
        }),
        fetchOnChainData(wallets),
      ]);

      if (!apiResponse.ok) {
        throw new Error(`API error: ${apiResponse.status}`);
      }

      const data: ApiResponse = await apiResponse.json();

      if (!data.success) {
        throw new Error("API returned unsuccessful response");
      }

      // Transform the response into results, enriching with on-chain data
      const newResults: AllocationResult[] = wallets.map((wallet) => {
        const allocationData = data.data.find(
          (item) => item.walletAddress.toLowerCase() === wallet.toLowerCase()
        );

        const onChainInfo = onChainData?.get(wallet.toLowerCase());

        // Check if the bid was cancelled on-chain
        if (onChainInfo?.cancelled) {
          return { wallet, error: "Bid cancelled" };
        }

        if (allocationData && allocationData.hasAllocation) {
          const result: AllocationResult = {
            wallet: allocationData.walletAddress,
            allocation: allocationData.megaAmount,
            usdAmount: allocationData.usdAmount,
          };

          // Add on-chain data if available
          if (onChainInfo) {
            result.bidAmount = onChainInfo.bidAmount / 1_000_000; // Convert from USDT (6 decimals) to USD
            result.acceptedAmount = allocationData.usdAmount; // Use API's usdAmount as the accepted amount
            result.lockup = onChainInfo.bidLockup;

            // Calculate fill percentage
            if (result.bidAmount > 0) {
              result.fillPercentage =
                (result.acceptedAmount / result.bidAmount) * 100;
            }
          }

          return result;
        } else {
          // No allocation found - show 0 MEGA with 0% filled
          const result: AllocationResult = {
            wallet,
            allocation: 0,
            usdAmount: 0,
          };

          // Add on-chain bid data if available
          if (onChainInfo) {
            result.bidAmount = onChainInfo.bidAmount / 1_000_000;
            result.acceptedAmount = 0;
            result.fillPercentage = 0;
            result.lockup = onChainInfo.bidLockup;
          }

          return result;
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
        <div style={{ backgroundColor: "#f380cd", padding: "2px" }}>
          <div
            style={{
              backgroundColor: "#19191a",
              clipPath:
                "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
              padding: "24px",
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Wallet
                  className="w-5 h-5"
                  style={{ color: "#f380cd" }}
                  strokeWidth={3}
                />
                <h3
                  className="text-lg font-black uppercase"
                  style={{ color: "#dfd9d9" }}
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
                  backgroundColor: "#fff",
                  color: "#19191a",
                  borderColor: "#19191a",
                  clipPath:
                    "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                }}
                disabled={isChecking}
              />

              <p
                className="text-xs font-bold uppercase"
                style={{ color: "#dfd9d9" }}
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
                    backgroundColor: "#f380cd",
                    borderColor: "#19191a",
                    color: "#19191a",
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
                    backgroundColor: "#e0e0e0",
                    borderColor: "#19191a",
                    color: "#19191a",
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
          <div style={{ backgroundColor: "#f380cd", padding: "2px" }}>
            <div
              style={{
                backgroundColor: "#19191a",
                clipPath:
                  "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
                padding: "24px",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <h3
                  className="text-lg font-black uppercase"
                  style={{ color: "#dfd9d9" }}
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
                              ? "#f380cd"
                              : "transparent",
                          borderColor: "#dfd9d9",
                          color:
                            selectedFdv === preset.value
                              ? "#19191a"
                              : "#dfd9d9",
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
                        ? "#f380cd"
                        : "transparent",
                      borderColor: "#dfd9d9",
                      color: hideAddresses ? "#19191a" : "#dfd9d9",
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
                    backgroundColor: "#058d5e",
                    borderColor: "#19191a",
                    clipPath:
                      "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-sm font-black uppercase"
                      style={{ color: "#fff" }}
                    >
                      Total Allocation
                    </span>
                    <div className="text-right">
                      <div
                        className="text-2xl font-black"
                        style={{ color: "#fff" }}
                      >
                        {totalAllocation.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}{" "}
                        MEGA
                      </div>
                      <div
                        className="text-sm font-bold"
                        style={{ color: "#e0e0e0" }}
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
                  <div
                    key={index}
                    className="p-4 border-3"
                    style={{
                      backgroundColor:
                        result.allocation && result.allocation > 0
                          ? "#fff"
                          : "#e0e0e0",
                      borderColor: "#19191a",
                      clipPath:
                        "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        {result.allocation !== undefined &&
                        result.allocation > 0 ? (
                          <CheckCircle2
                            className="w-5 h-5 flex-shrink-0"
                            style={{ color: "#058d5e" }}
                            strokeWidth={3}
                          />
                        ) : result.error ? (
                          <XCircle
                            className="w-5 h-5 flex-shrink-0"
                            style={{ color: "#dc2626" }}
                            strokeWidth={3}
                          />
                        ) : (
                          <XCircle
                            className="w-5 h-5 flex-shrink-0"
                            style={{ color: "#999" }}
                            strokeWidth={3}
                          />
                        )}
                        <span
                          className="font-mono text-sm font-bold truncate"
                          style={{
                            color: "#19191a",
                            filter: hideAddresses ? "blur(6px)" : "none",
                            userSelect: hideAddresses ? "none" : "auto",
                          }}
                          title={
                            hideAddresses
                              ? "Address blurred for privacy"
                              : result.wallet
                          }
                        >
                          {result.wallet}
                        </span>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        {result.allocation !== undefined ? (
                          <div className="flex flex-col items-end gap-0.5">
                            <span
                              className="text-lg font-black"
                              style={{
                                color:
                                  result.allocation > 0 ? "#058d5e" : "#999",
                              }}
                            >
                              {result.allocation.toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                              })}{" "}
                              MEGA
                            </span>
                            <div className="flex items-center gap-2">
                              <span
                                className="text-xs font-bold"
                                style={{ color: "#666" }}
                              >
                                $
                                {calculateValueAtFdv(
                                  result.allocation
                                ).toLocaleString(undefined, {
                                  maximumFractionDigits: 2,
                                })}
                                {result.bidAmount !== undefined &&
                                  result.fillPercentage !== undefined && (
                                    <span
                                      style={{
                                        color:
                                          result.fillPercentage > 0
                                            ? "#f380cd"
                                            : "#999",
                                        marginLeft: "8px",
                                      }}
                                    >
                                      {result.fillPercentage > 0
                                        ? `(${result.fillPercentage.toFixed(
                                            2
                                          )}% filled)`
                                        : `(0% filled)`}
                                    </span>
                                  )}
                              </span>
                              {result.lockup !== undefined && (
                                <span
                                  className="text-[10px] font-black uppercase px-1.5 py-0.5 border-2"
                                  style={{
                                    backgroundColor: result.lockup
                                      ? "#f380cd"
                                      : "#e0e0e0",
                                    borderColor: "#19191a",
                                    color: "#19191a",
                                  }}
                                >
                                  {result.lockup ? "🔒 LOCKED" : "UNLOCKED"}
                                </span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span
                            className="text-sm font-bold uppercase"
                            style={{ color: "#dc2626" }}
                          >
                            {result.error || "No allocation"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* API Documentation */}
      <div
        style={{
          clipPath:
            "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
        }}
      >
        <div style={{ backgroundColor: "#19191a", padding: "2px" }}>
          <div
            style={{
              backgroundColor: "#e0e0e0",
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
            }}
          >
            <button
              onClick={() => setShowApiDocs(!showApiDocs)}
              className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Code
                  className="w-4 h-4"
                  style={{ color: "#19191a" }}
                  strokeWidth={3}
                />
                <span
                  className="text-sm font-black uppercase"
                  style={{ color: "#19191a" }}
                >
                  API Documentation
                </span>
              </div>
              {showApiDocs ? (
                <ChevronUp
                  className="w-4 h-4"
                  style={{ color: "#19191a" }}
                  strokeWidth={3}
                />
              ) : (
                <ChevronDown
                  className="w-4 h-4"
                  style={{ color: "#19191a" }}
                  strokeWidth={3}
                />
              )}
            </button>

            {showApiDocs && (
              <div
                className="px-4 pb-4 space-y-3 border-t-2"
                style={{ borderColor: "#19191a" }}
              >
                <div className="pt-3">
                  <p
                    className="text-xs font-bold mb-2"
                    style={{ color: "#19191a" }}
                  >
                    ENDPOINT
                  </p>
                  <code
                    className="block px-3 py-2 text-xs font-mono rounded border-2"
                    style={{
                      backgroundColor: "#fff",
                      color: "#19191a",
                      borderColor: "#19191a",
                    }}
                  >
                    POST https://megasale-check.xultra.fun/api/allocations/check
                  </code>
                </div>

                <div>
                  <p
                    className="text-xs font-bold mb-2"
                    style={{ color: "#19191a" }}
                  >
                    REQUEST BODY
                  </p>
                  <pre
                    className="px-3 py-2 text-xs font-mono rounded border-2 overflow-x-auto"
                    style={{
                      backgroundColor: "#fff",
                      color: "#19191a",
                      borderColor: "#19191a",
                    }}
                  >
                    {`{
  "wallets": [
    "0x1234567890123456789012345678901234567890",
    "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
  ]
}`}
                  </pre>
                </div>

                <div>
                  <p
                    className="text-xs font-bold mb-2"
                    style={{ color: "#19191a" }}
                  >
                    RESPONSE
                  </p>
                  <pre
                    className="px-3 py-2 text-xs font-mono rounded border-2 overflow-x-auto"
                    style={{
                      backgroundColor: "#fff",
                      color: "#19191a",
                      borderColor: "#19191a",
                    }}
                  >
                    {`{
  "success": true,
  "count": 2,
  "data": [
    {
      "walletAddress": "0x1234567890123456789012345678901234567890",
      "usdAmount": 5000.00,
      "megaAmount": 50050.05,
      "hasAllocation": true
    },
    {
      "walletAddress": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
      "usdAmount": 10000.00,
      "megaAmount": 100100.10,
      "hasAllocation": true
    }
  ]
}`}
                  </pre>
                </div>

                <div>
                  <p
                    className="text-xs font-bold mb-2"
                    style={{ color: "#19191a" }}
                  >
                    EXAMPLE (JAVASCRIPT)
                  </p>
                  <pre
                    className="px-3 py-2 text-xs font-mono rounded border-2 overflow-x-auto"
                    style={{
                      backgroundColor: "#fff",
                      color: "#19191a",
                      borderColor: "#19191a",
                    }}
                  >
                    {`const response = await fetch(
  'https://megasale-check.xultra.fun/api/allocations/check',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wallets: ['0x1234567890123456789012345678901234567890']
    })
  }
);
const data = await response.json();`}
                  </pre>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
