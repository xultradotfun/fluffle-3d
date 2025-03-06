import { Rabbit } from "lucide-react";
import { NETWORK_INFO } from "./constants";

type NetworkInfoCardProps = {
  showCopied: string | null;
  onCopy: (text: string, type: string) => void;
  onAddToWallet: () => void;
};

export const NetworkInfoCard = ({
  showCopied,
  onCopy,
  onAddToWallet,
}: NetworkInfoCardProps) => (
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
