"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import { NetworkInfoCard } from "./NetworkInfoCard";
import { TimelineSection } from "./TimelineSection";
import { UsersContent } from "./UsersContent";
import { NETWORK_INFO, TIMELINE_EVENTS } from "./constants";

declare global {
  interface Window {
    ethereum: any;
  }
}

export function TestnetView() {
  const [showCopied, setShowCopied] = useState<string | null>(null);

  const getCurrentPhase = () => {
    const now = new Date();
    return TIMELINE_EVENTS.findIndex(
      (event) => now >= event.startDate && now <= event.endDate
    );
  };

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setShowCopied(type);
    setTimeout(() => setShowCopied(null), 2000);
  };

  const addToWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x18C6", // 6342 in hex
              chainName: NETWORK_INFO.name,
              nativeCurrency: {
                name: "MegaETH Testnet Ether",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: [NETWORK_INFO.rpcUrl],
              blockExplorerUrls: [NETWORK_INFO.explorers.community],
            },
          ],
        });
      } catch (error) {
        console.error("Failed to add network:", error);
      }
    } else {
      console.error("MetaMask is not installed");
    }
  };

  const currentPhase = getCurrentPhase();

  return (
    <div className="py-16 sm:py-20 space-y-24">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
        <div className="absolute inset-x-0 top-6 -bottom-6 bg-gradient-to-b from-pink-500/10 via-purple-500/5 to-transparent dark:from-pink-500/[0.07] dark:via-purple-500/[0.03] dark:to-transparent blur-3xl -z-10 rounded-[100%]" />

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400 text-xs font-medium mb-6 ring-1 ring-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Live Now
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent tracking-tight">
          <span className="relative inline-block">
            <Image
              src="/megalogo.png"
              alt="MEGA"
              width={140}
              height={28}
              className="h-8 sm:h-10 w-auto brightness-0 opacity-80 dark:opacity-100 dark:invert"
              priority
            />
          </span>{" "}
          Testnet
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
          Experience the future of Ethereum scaling with ultra-fast block times
          and high gas throughput
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="text-lg sm:text-2xl font-mono font-bold bg-gradient-to-r from-pink-500 to-indigo-500 dark:from-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
              2 Ggas/block
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
              Max Block Size
            </div>
          </div>
          <div className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="text-lg sm:text-2xl font-mono font-bold bg-gradient-to-r from-pink-500 to-indigo-500 dark:from-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
              10ms
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
              Mini Block Time
            </div>
          </div>
        </div>
      </div>

      {/* Timeline and Network Info Side by Side */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[3fr_2fr] gap-8">
          <TimelineSection currentPhase={currentPhase} />
          <NetworkInfoCard
            showCopied={showCopied}
            onCopy={handleCopy}
            onAddToWallet={addToWallet}
          />
        </div>
      </div>

      {/* User Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <UsersContent />
      </div>
    </div>
  );
}
