"use client";

import { useState } from "react";
import Image from "next/image";
import { Rabbit } from "lucide-react";

// Add type declaration at the top of the file
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params: any[] }) => Promise<any>;
    };
  }
}

// Add type declarations at the top
type TimelineEvent = {
  date: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
};

type NetworkInfo = {
  name: string;
  chainId: string;
  rpcUrl: string;
  wsUrl: string;
  explorers: {
    performance: string;
    community: string;
  };
};

// Network information constant
const NETWORK_INFO: NetworkInfo = {
  name: "MegaETH Testnet",
  chainId: "6342",
  rpcUrl: "https://carrot.megaeth.com/rpc",
  wsUrl: "wss://carrot.megaeth.com/ws",
  explorers: {
    performance: "https://uptime.megaeth.com",
    community: "https://megaexplorer.xyz",
  },
};

// Timeline events constant
const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    date: "March 6th",
    title: "Testnet Deployment",
    description: "Initial deployment of the MegaETH public testnet",
    startDate: new Date("2024-03-06"),
    endDate: new Date("2024-03-06"),
  },
  {
    date: "March 6-10th",
    title: "Builder Onboarding",
    description: "Dedicated onboarding period for apps and infrastructure",
    startDate: new Date("2024-03-06"),
    endDate: new Date("2024-03-10"),
  },
  {
    date: "March 10th",
    title: "User Onboarding",
    description: "Public testnet access opens to all users",
    startDate: new Date("2024-03-10"),
    endDate: new Date("2024-12-31"),
  },
];

// Components
const NetworkInfoCard = ({
  showCopied,
  onCopy,
  onAddToWallet,
}: {
  showCopied: string | null;
  onCopy: (text: string, type: string) => void;
  onAddToWallet: () => void;
}) => (
  <div className="max-w-2xl mx-auto p-5 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
    {/* Header Section */}
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Network Information
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-400">
          Connect your wallet to MegaETH Testnet
        </p>
      </div>
      <button
        onClick={onAddToWallet}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 hover:from-blue-500/20 hover:via-indigo-500/20 hover:to-purple-500/20 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 dark:hover:from-blue-500/30 dark:hover:via-indigo-500/30 dark:hover:to-purple-500/30 border border-blue-500/20 hover:border-blue-500/30 dark:border-blue-500/30 dark:hover:border-blue-500/40 text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md backdrop-blur-sm group"
      >
        <Rabbit className="w-4 h-4" />
        Add to Wallet
        <svg
          className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <div className="grid gap-4">
      {/* Basic Network Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-white/30 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Network Name
          </div>
          <div className="font-mono text-sm font-medium text-foreground mt-0.5">
            {NETWORK_INFO.name}
          </div>
        </div>
        <div className="p-3 rounded-lg bg-white/30 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Chain ID
          </div>
          <div className="font-mono text-sm font-medium text-foreground mt-0.5">
            {NETWORK_INFO.chainId}
          </div>
        </div>
      </div>

      {/* Connection URLs */}
      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-white/30 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              RPC URL
            </div>
            <button
              onClick={() => onCopy(NETWORK_INFO.rpcUrl, "rpc")}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium px-2 py-0.5 rounded hover:bg-blue-500/5 transition-colors"
            >
              {showCopied === "rpc" ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="font-mono text-xs text-foreground/90 truncate bg-white/50 dark:bg-white/[0.05] px-2.5 py-1.5 rounded border border-gray-200/50 dark:border-white/5">
            {NETWORK_INFO.rpcUrl}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-white/30 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5">
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
              WebSocket URL
            </div>
            <button
              onClick={() => onCopy(NETWORK_INFO.wsUrl, "ws")}
              className="text-xs text-blue-500 hover:text-blue-600 font-medium px-2 py-0.5 rounded hover:bg-blue-500/5 transition-colors"
            >
              {showCopied === "ws" ? "Copied!" : "Copy"}
            </button>
          </div>
          <div className="font-mono text-xs text-foreground/90 truncate bg-white/50 dark:bg-white/[0.05] px-2.5 py-1.5 rounded border border-gray-200/50 dark:border-white/5">
            {NETWORK_INFO.wsUrl}
          </div>
        </div>
      </div>

      {/* Block Explorers */}
      <div className="pt-3 mt-3 border-t border-gray-200/10">
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Block Explorers
          </div>
          <div className="flex items-center gap-3">
            <a
              href={NETWORK_INFO.explorers.performance}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-medium hover:underline"
            >
              Performance
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
            <a
              href={NETWORK_INFO.explorers.community}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-blue-500 hover:text-blue-600 font-medium hover:underline"
            >
              Explorer
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const TimelineSection = ({ currentPhase }: { currentPhase: number }) => (
  <div>
    <h2 className="text-2xl font-semibold text-foreground mb-8 flex items-center gap-3">
      <svg
        className="w-6 h-6 text-blue-500"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
      Launch Timeline
    </h2>
    <div className="p-8 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
      <div className="relative pl-8 border-l-2 border-blue-500/20 dark:border-blue-500/30">
        {TIMELINE_EVENTS.map((event, index) => (
          <TimelineEvent
            key={event.date}
            event={event}
            isCurrentPhase={currentPhase === index}
          />
        ))}
      </div>
    </div>
  </div>
);

const TimelineEvent = ({
  event,
  isCurrentPhase,
}: {
  event: TimelineEvent;
  isCurrentPhase: boolean;
}) => (
  <div className="mb-10 last:mb-0 group relative hover:bg-blue-500/[0.02] rounded-lg transition-colors duration-200 -ml-8 pl-8 py-3">
    <div className="absolute left-0 top-4 -translate-x-[9px] w-[18px] h-[18px] rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 border border-blue-500/30 dark:border-blue-500/40 group-hover:border-blue-500/50 transition-colors duration-200">
      <div className="absolute inset-[3px] rounded-full bg-blue-500 group-hover:animate-pulse" />
    </div>
    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
      {event.date}
      {isCurrentPhase && (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium ring-1 ring-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Current
        </span>
      )}
    </div>
    <div className="font-semibold text-foreground mb-2 text-lg">
      {event.title}
    </div>
    <div className="text-base text-muted-foreground">{event.description}</div>
  </div>
);

const TabSection = ({
  activeView,
  setActiveView,
}: {
  activeView: "users" | "builders";
  setActiveView: (view: "users" | "builders") => void;
}) => (
  <div className="flex items-center gap-2 p-1.5 bg-white/60 dark:bg-white/[0.02] rounded-xl border border-gray-200/20 dark:border-white/[0.08] shadow-lg backdrop-blur-lg w-fit mb-10">
    <button
      onClick={() => setActiveView("users")}
      className={`flex items-center justify-start gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        activeView === "users"
          ? "bg-gradient-to-r from-orange-50/90 to-amber-50/90 text-orange-600 border border-orange-200/30 shadow-sm dark:from-orange-500/20 dark:to-orange-500/10 dark:text-orange-400 dark:border-orange-500/20"
          : "text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/[0.08]"
      }`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
      <span>For Users</span>
    </button>
    <button
      onClick={() => setActiveView("builders")}
      className={`flex items-center justify-start gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        activeView === "builders"
          ? "bg-gradient-to-r from-purple-50/90 to-pink-50/90 text-purple-600 border border-purple-200/30 shadow-sm dark:from-purple-500/20 dark:to-purple-500/10 dark:text-purple-400 dark:border-purple-500/20"
          : "text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-white/[0.08]"
      }`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
        />
      </svg>
      <span>For Builders</span>
    </button>
  </div>
);

const UsersContent = () => (
  <div className="grid sm:grid-cols-2 gap-8">
    <div className="p-8 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
      <h3 className="text-xl font-semibold text-foreground mb-6">
        Get Started
      </h3>
      <ol className="space-y-6">
        <li className="flex gap-4">
          <span className="flex-none w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-500 flex items-center justify-center text-base font-medium border border-blue-500/20 dark:border-blue-500/30">
            1
          </span>
          <div>
            <div className="font-medium text-foreground text-lg mb-2">
              Join Discord
            </div>
            <a
              href="https://discord.com/invite/megaeth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 font-medium"
            >
              Join MegaETH Discord
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex-none w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-500 flex items-center justify-center text-base font-medium border border-blue-500/20 dark:border-blue-500/30">
            2
          </span>
          <div>
            <div className="font-medium text-foreground text-lg mb-2">
              Register Wallet
            </div>
            <a
              href="https://discord.com/channels/1219739501673451551/1322104558847266848"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1.5 font-medium"
            >
              Go to #wallet-registration
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </a>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex-none w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-500 flex items-center justify-center text-base font-medium border border-blue-500/20 dark:border-blue-500/30">
            3
          </span>
          <div>
            <div className="font-medium text-foreground text-lg mb-2">
              Use /register
            </div>
            <div className="text-base text-muted-foreground">
              Enter the command in Discord
            </div>
          </div>
        </li>
      </ol>
    </div>
    <div className="p-8 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
      <h3 className="text-xl font-semibold text-foreground mb-6">
        Distribution Details
      </h3>
      <div className="space-y-6 text-base">
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          Testnet ETH will be distributed directly to registered wallets
          starting March 10th.
        </p>
        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 border border-blue-500/10 dark:border-blue-500/20">
          <div className="flex items-start gap-4 text-gray-600 dark:text-gray-300">
            <svg
              className="w-6 h-6 flex-none text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="leading-relaxed">
              Direct distribution helps prevent faucet issues and ensures fair
              access to testnet ETH
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const BuildersContent = () => (
  <div className="p-8 rounded-2xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
    <div className="flex flex-row items-start gap-6">
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 p-3 border border-purple-500/20 dark:border-purple-500/30">
        <svg
          className="w-full h-full text-purple-600 dark:text-purple-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
      </div>
      <div className="space-y-3 flex-1">
        <h3 className="text-xl font-semibold text-foreground">
          Join MegaForge
        </h3>
        <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
          Get early access and dedicated support for integrating your app with
          MegaETH testnet.
        </p>
        <a
          href="https://forms.gle/iwPBVdCmzaYh5x837"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all text-base font-medium shadow-sm hover:shadow-md group"
        >
          Apply Now
          <svg
            className="w-5 h-5 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </a>
      </div>
    </div>

    <div className="mt-8 pt-8 border-t border-gray-200/10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h4 className="text-lg font-medium text-foreground">
            Want to get started?
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Check out developer documentation
          </p>
        </div>
        <a
          href="https://docs.megaeth.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium group"
        >
          View Docs
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      </div>
    </div>
  </div>
);

// Main component
export function TestnetView() {
  const [activeView, setActiveView] = useState<"users" | "builders">("users");
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
          Live March 6th
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
          <div className="px-5 py-2.5 rounded-lg bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="text-2xl font-mono font-bold bg-gradient-to-r from-pink-500 to-indigo-500 dark:from-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
              2 Ggas/block
            </div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
              Max Block Size
            </div>
          </div>
          <div className="px-5 py-2.5 rounded-lg bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 shadow-sm">
            <div className="text-2xl font-mono font-bold bg-gradient-to-r from-pink-500 to-indigo-500 dark:from-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
              10ms
            </div>
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mt-0.5">
              Mini Block Time
            </div>
          </div>
        </div>

        <NetworkInfoCard
          showCopied={showCopied}
          onCopy={handleCopy}
          onAddToWallet={addToWallet}
        />
      </div>

      {/* Timeline and Tab Sections Side by Side */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-12">
          <TimelineSection currentPhase={currentPhase} />

          {/* Tab Section */}
          <div className="pt-[60px]">
            <TabSection activeView={activeView} setActiveView={setActiveView} />

            {/* Content Sections */}
            <div className="animate-fade-in">
              {activeView === "users" ? <UsersContent /> : <BuildersContent />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
