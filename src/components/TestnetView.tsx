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

export function TestnetView() {
  const [activeView, setActiveView] = useState<"users" | "builders">("users");
  const [showCopied, setShowCopied] = useState<string | null>(null);

  const timelineEvents = [
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
      endDate: new Date("2024-12-31"), // Set far in the future as this is ongoing
    },
  ];

  const getCurrentPhase = () => {
    const now = new Date();
    return timelineEvents.findIndex(
      (event) => now >= event.startDate && now <= event.endDate
    );
  };

  const currentPhase = getCurrentPhase();

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
              chainName: "MegaETH Testnet",
              nativeCurrency: {
                name: "MegaETH Testnet Ether",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://carrot.megaeth.com/rpc"],
              blockExplorerUrls: ["https://megaexplorer.xyz"],
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
    <div className="py-16 space-y-24">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-4 text-center relative">
        <div className="absolute inset-x-0 top-6 -bottom-6 bg-gradient-to-b from-pink-500/10 via-purple-500/5 to-transparent dark:from-pink-500/[0.07] dark:via-purple-500/[0.03] dark:to-transparent blur-2xl -z-10 rounded-[100%]" />

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/[0.08] text-emerald-600 dark:text-emerald-400 text-sm font-medium mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Live March 6th
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 dark:from-pink-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
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

        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto font-light">
          Experience the future of Ethereum scaling with ultra-fast block times
          and high gas throughput
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <div className="px-4 py-2 rounded-lg bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div className="text-2xl font-mono font-bold bg-gradient-to-r from-pink-500 to-indigo-500 dark:from-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
              2 Ggas/block
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Max Block Size
            </div>
          </div>
          <div className="px-4 py-2 rounded-lg bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5">
            <div className="text-2xl font-mono font-bold bg-gradient-to-r from-pink-500 to-indigo-500 dark:from-pink-400 dark:to-indigo-400 bg-clip-text text-transparent">
              10ms
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mini Block Time
            </div>
          </div>
        </div>

        {/* Network Information Card */}
        <div className="max-w-2xl mx-auto p-6 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-medium text-foreground">
              Network Information
            </h3>
            <button
              onClick={addToWallet}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-purple-500/10 hover:from-blue-500/20 hover:via-indigo-500/20 hover:to-purple-500/20 dark:from-blue-500/20 dark:via-indigo-500/20 dark:to-purple-500/20 dark:hover:from-blue-500/30 dark:hover:via-indigo-500/30 dark:hover:to-purple-500/30 border border-blue-500/20 hover:border-blue-500/30 dark:border-blue-500/30 dark:hover:border-blue-500/40 text-blue-700 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow backdrop-blur-sm group"
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr,auto] gap-6 sm:gap-x-8">
            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Network Name
              </div>
              <div className="font-mono text-sm">MegaETH Testnet</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  RPC URL
                </div>
                <button
                  onClick={() =>
                    handleCopy("https://carrot.megaeth.com/rpc", "rpc")
                  }
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  {showCopied === "rpc" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="font-mono text-sm truncate max-w-[280px]">
                https://carrot.megaeth.com/rpc
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Chain ID
              </div>
              <div className="font-mono text-sm">6342</div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  WebSocket
                </div>
                <button
                  onClick={() =>
                    handleCopy("wss://carrot.megaeth.com/ws", "ws")
                  }
                  className="text-xs text-blue-500 hover:text-blue-600"
                >
                  {showCopied === "ws" ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="font-mono text-sm truncate max-w-[280px]">
                wss://carrot.megaeth.com/ws
              </div>
            </div>

            <div className="col-span-1 sm:col-span-2">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                Block Explorers
              </div>
              <div className="space-y-1">
                <a
                  href="https://uptime.megaeth.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-500 hover:text-blue-600"
                >
                  Performance Dashboard ↗
                </a>
                <a
                  href="https://megaexplorer.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-sm text-blue-500 hover:text-blue-600"
                >
                  Community Explorer ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline and Tab Sections Side by Side */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-[2fr_3fr] gap-8">
          {/* Timeline Section */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-3">
              <svg
                className="w-5 h-5 text-blue-500"
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
            <div className="p-6 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm">
              <div className="relative pl-8 border-l-2 border-blue-500/20 dark:border-blue-500/30">
                {timelineEvents.map((event, index) => (
                  <div
                    key={event.date}
                    className="mb-8 last:mb-0 group relative hover:bg-blue-500/[0.02] rounded-lg transition-colors duration-200 -ml-8 pl-8 py-2"
                  >
                    <div className="absolute left-0 top-4 -translate-x-[9px] w-[18px] h-[18px] rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 border border-blue-500/30 dark:border-blue-500/40 group-hover:border-blue-500/50 transition-colors duration-200">
                      <div className="absolute inset-[3px] rounded-full bg-blue-500 group-hover:animate-pulse" />
                    </div>
                    <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2 flex items-center gap-2">
                      {event.date}
                      {currentPhase === index && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Current
                        </span>
                      )}
                    </div>
                    <div className="font-semibold text-foreground mb-2 text-base">
                      {event.title}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {event.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tab Section */}
          <div className="pt-[52px]">
            <div className="flex items-center gap-2 p-1 bg-white/60 dark:bg-white/[0.02] rounded-xl border border-gray-200/20 dark:border-white/[0.08] shadow-lg backdrop-blur-lg w-fit mb-8">
              <button
                onClick={() => setActiveView("users")}
                className={`flex items-center justify-start gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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
                className={`flex items-center justify-start gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
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

            {/* Content Sections */}
            <div className="animate-fade-in">
              {activeView === "users" ? (
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="p-6 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm">
                    <h3 className="text-lg font-medium text-foreground mb-4">
                      Get Started
                    </h3>
                    <ol className="space-y-4">
                      <li className="flex gap-4">
                        <span className="flex-none w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-500 flex items-center justify-center text-sm font-medium border border-blue-500/20 dark:border-blue-500/30">
                          1
                        </span>
                        <div>
                          <div className="font-medium text-foreground mb-1">
                            Join Discord
                          </div>
                          <a
                            href="https://discord.com/invite/megaeth"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                          >
                            Join MegaETH Discord
                            <svg
                              className="w-3 h-3"
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
                        <span className="flex-none w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-500 flex items-center justify-center text-sm font-medium border border-blue-500/20 dark:border-blue-500/30">
                          2
                        </span>
                        <div>
                          <div className="font-medium text-foreground mb-1">
                            Register Wallet
                          </div>
                          <a
                            href="https://discord.com/channels/1219739501673451551/1322104558847266848"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                          >
                            Go to #wallet-registration
                            <svg
                              className="w-3 h-3"
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
                        <span className="flex-none w-6 h-6 rounded-full bg-gradient-to-br from-blue-500/10 to-blue-600/10 dark:from-blue-500/20 dark:to-blue-600/20 text-blue-500 flex items-center justify-center text-sm font-medium border border-blue-500/20 dark:border-blue-500/30">
                          3
                        </span>
                        <div>
                          <div className="font-medium text-foreground">
                            Use /register
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Enter the command in Discord
                          </div>
                        </div>
                      </li>
                    </ol>
                  </div>
                  <div className="p-6 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm">
                    <h3 className="text-lg font-medium text-foreground mb-4">
                      Distribution Details
                    </h3>
                    <div className="space-y-4 text-sm">
                      <p className="text-gray-600 dark:text-gray-300">
                        Testnet ETH will be distributed directly to registered
                        wallets starting March 10th.
                      </p>
                      <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 border border-blue-500/10 dark:border-blue-500/20">
                        <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                          <svg
                            className="w-5 h-5 flex-none text-blue-500"
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
                          <span>
                            Direct distribution helps prevent faucet issues and
                            ensures fair access to testnet ETH
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm">
                  <div className="flex flex-row items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 dark:from-purple-500/20 dark:to-pink-500/20 p-2.5 border border-purple-500/20 dark:border-purple-500/30">
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
                    <div className="space-y-2 flex-1">
                      <h3 className="text-lg font-medium text-foreground">
                        Join MegaForge
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Get early access and dedicated support for integrating
                        your app with MegaETH testnet.
                      </p>
                      <a
                        href="https://forms.gle/iwPBVdCmzaYh5x837"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all text-sm font-medium shadow-sm group"
                      >
                        Apply Now
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
                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
