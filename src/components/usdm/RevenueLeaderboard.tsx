"use client";

import { DollarSign, TrendingUp, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { colors } from "@/lib/colors";

interface ChainRevenueData {
  name: string;
  logo: string;
  total24h: number;
  total30d: number;
}

// USDM Bridge contract address on Ethereum mainnet
const USDM_BRIDGE_ADDRESS = "0x46D6Eba3AECD215a3e703cdA963820d4520b45D6";
const ETH_RPC_URL = "https://eth.llamarpc.com";
const APY = 0.04;

export function RevenueLeaderboard() {
  const [chains, setChains] = useState<ChainRevenueData[]>([]);
  const [megaEthData, setMegaEthData] = useState<ChainRevenueData | null>(null);
  const [totalSupply, setTotalSupply] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMegaEthRevenue() {
      try {
        // Create provider and contract instance
        const provider = new ethers.JsonRpcProvider(ETH_RPC_URL);

        // Minimal ABI - just the totalDeposited function
        const abi = ["function totalDeposited() view returns (uint256)"];

        const contract = new ethers.Contract(
          USDM_BRIDGE_ADDRESS,
          abi,
          provider
        );

        // Call totalDeposited
        const totalDeposited = await contract.totalDeposited();

        // Convert from wei (6 decimals for USDC)
        const totalDepositedUSDC = Number(totalDeposited) / 1e6;

        // Store total supply (even if 0)
        setTotalSupply(totalDepositedUSDC);

        // Calculate revenue based on 4% APY
        const dailyRevenue = (totalDepositedUSDC * APY) / 365;
        const revenue30d = dailyRevenue * 30;

        setMegaEthData({
          name: "MegaETH",
          logo: "/avatars/megaeth.jpg",
          total24h: Math.round(dailyRevenue),
          total30d: Math.round(revenue30d),
        });
      } catch (error) {
        console.error("Failed to fetch MegaETH revenue from contract:", error);
        // Set fallback values
        setTotalSupply(null);
        setMegaEthData({
          name: "MegaETH",
          logo: "/avatars/megaeth.jpg",
          total24h: 1250000,
          total30d: 37500000,
        });
      }
    }

    async function fetchChainRevenue() {
      try {
        const res = await fetch("https://api.fluffle.tools/api/revenue");
        if (res.ok) {
          const data = await res.json();
          setChains(data);
        }
      } catch (error) {
        console.error("Failed to fetch chain revenue data", error);
      }
    }

    async function fetchData() {
      await Promise.all([fetchMegaEthRevenue(), fetchChainRevenue()]);
      setIsLoading(false);
    }

    fetchData();
  }, []);

  // Combine MegaETH with fetched chains (or empty if loading/error) and sort
  const allChains = megaEthData
    ? [megaEthData, ...chains].sort((a, b) => b.total24h - a.total24h)
    : chains.sort((a, b) => b.total24h - a.total24h);

  const maxRevenue =
    allChains.length > 0 ? Math.max(...allChains.map((d) => d.total24h)) : 1;

  // Calculate MegaETH placement (rank)
  const megaEthPlacement = megaEthData
    ? allChains.findIndex((chain) => chain.name === "MegaETH") + 1
    : 0;

  if (isLoading && allChains.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg font-bold" style={{ color: colors.background }}>
          Loading revenue data...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Supply Locked */}
        <div
          style={{
            clipPath:
              "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          }}
        >
          <div style={{ backgroundColor: colors.foreground, padding: "2px" }}>
            <div
              className="px-6 py-5"
              style={{
                backgroundColor: colors.white,
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <DollarSign
                  className="w-4 h-4"
                  strokeWidth={3}
                  style={{ color: colors.foreground }}
                />
                <span
                  className="font-black uppercase text-xs tracking-wider"
                  style={{ color: colors.foreground }}
                >
                  Total USDM Supply
                </span>
              </div>
              <div className="text-3xl font-black" style={{ color: colors.foreground }}>
                {totalSupply !== null
                  ? `$${Math.round(totalSupply).toLocaleString()}`
                  : "Loading..."}
              </div>
            </div>
          </div>
        </div>

        {/* MegaETH Placement */}
        <div
          style={{
            clipPath:
              "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          }}
        >
          <div style={{ backgroundColor: colors.foreground, padding: "2px" }}>
            <div
              className="px-6 py-5"
              style={{
                backgroundColor: colors.white,
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp
                  className="w-4 h-4"
                  strokeWidth={3}
                  style={{ color: colors.foreground }}
                />
                <span
                  className="font-black uppercase text-xs tracking-wider"
                  style={{ color: colors.foreground }}
                >
                  MegaETH Placement
                </span>
              </div>
              <div className="text-3xl font-black text-pink">
                #{megaEthPlacement || "--"}
              </div>
            </div>
          </div>
        </div>

        {/* 30d Revenue Projected */}
        <div
          style={{
            clipPath:
              "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          }}
        >
          <div style={{ backgroundColor: colors.foreground, padding: "2px" }}>
            <div
              className="px-6 py-5"
              style={{
                backgroundColor: colors.white,
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <Calendar
                  className="w-4 h-4"
                  strokeWidth={3}
                  style={{ color: colors.foreground }}
                />
                <span
                  className="font-black uppercase text-xs tracking-wider"
                  style={{ color: colors.foreground }}
                >
                  30d Revenue Projected
                </span>
              </div>
              <div className="text-3xl font-black" style={{ color: colors.foreground }}>
                {megaEthData
                  ? `$${megaEthData.total30d?.toLocaleString() || "0"}`
                  : "Loading..."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
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
              padding: "16px",
            }}
            className="sm:!p-6"
          >
            <h2
              className="text-xl sm:text-2xl font-black uppercase mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3"
              style={{ color: colors.background }}
            >
              <DollarSign
                className="w-6 h-6 sm:w-8 sm:h-8 text-pink"
                strokeWidth={3}
              />
              Revenue Leaderboard
            </h2>

            <div className="space-y-2 sm:space-y-3">
              {allChains.map((chain, index) => {
                const isMegaETH = chain.name === "MegaETH";

                return (
                  <div
                    key={chain.name}
                    style={{
                      clipPath:
                        "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: isMegaETH ? colors.pink : colors.foreground,
                        padding: "2px",
                      }}
                    >
                      <div
                        className="p-3 sm:p-4"
                        style={{
                          backgroundColor: colors.white,
                          clipPath:
                            "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                        }}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <span
                              className="font-mono font-bold w-6 sm:w-8 text-center text-sm sm:text-base"
                              style={{ color: colors.foreground }}
                            >
                              #{index + 1}
                            </span>
                            {/* Chain Logo */}
                            {chain.logo &&
                            (chain.logo.startsWith("http") ||
                              chain.logo.startsWith("/")) ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={chain.logo}
                                alt={chain.name}
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                                style={{
                                  border: `2px solid ${colors.foreground}`,
                                }}
                              />
                            ) : (
                              <div
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold border-2 text-sm sm:text-base"
                                style={{
                                  backgroundColor: colors.pink,
                                  borderColor: colors.foreground,
                                  color: colors.foreground,
                                }}
                              >
                                {chain.name[0]}
                              </div>
                            )}
                            <span
                              className="font-black text-base sm:text-lg uppercase"
                              style={{ color: colors.foreground }}
                            >
                              {chain.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 sm:gap-8 text-right">
                            {/* 30d Revenue (Hidden on mobile) */}
                            <div className="hidden md:flex flex-col items-end">
                              <span
                                className="text-xs font-bold uppercase mb-0.5 opacity-60"
                                style={{ color: colors.foreground }}
                              >
                                30d Revenue
                              </span>
                              <span
                                className="font-mono font-bold"
                                style={{ color: colors.foreground }}
                              >
                                {chain.total30d !== null
                                  ? `$${chain.total30d.toLocaleString()}`
                                  : "N/A"}
                              </span>
                            </div>

                            {/* 24h Revenue */}
                            <div className="flex flex-col items-end">
                              <span
                                className="text-xs font-bold uppercase mb-0.5"
                                style={{ color: colors.foreground }}
                              >
                                24h Revenue
                              </span>
                              <span
                                className="font-mono font-bold text-base sm:text-lg"
                                style={{ color: colors.foreground }}
                              >
                                ${chain.total24h.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div
                          className="h-2 sm:h-3 w-full rounded-sm overflow-hidden"
                          style={{ backgroundColor: colors.light }}
                        >
                          <div
                            className="h-full transition-all duration-1000 ease-out"
                            style={{
                              width: `${Math.max(
                                (chain.total24h / maxRevenue) * 100,
                                1
                              )}%`,
                              backgroundColor: isMegaETH
                                ? colors.pink
                                : colors.foreground,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
