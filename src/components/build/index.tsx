"use client";

import React from "react";
import { useState } from "react";
import Image from "next/image";
import { NetworkInfoCard } from "../testnet/NetworkInfoCard";
import { NETWORK_INFO } from "../testnet/constants";
import { HeroSection } from "./HeroSection";
import { QuickStartGuide } from "./QuickStartGuide";
import { DeveloperResources } from "./DeveloperResources";
import { ContractAddresses } from "./ContractAddresses";

export function BuildersView() {
  const [showCopied, setShowCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
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

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <HeroSection />
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-8">
          <div className="space-y-8">
            <QuickStartGuide />
            <ContractAddresses showCopied={showCopied} onCopy={handleCopy} />
          </div>
          <div className="space-y-8 lg:max-w-[480px]">
            <DeveloperResources />
            <NetworkInfoCard
              showCopied={showCopied}
              onCopy={handleCopy}
              onAddToWallet={addToWallet}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
