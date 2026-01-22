import { useState } from "react";

interface ContractAddressesProps {
  showCopied: string | null;
  onCopy: (text: string, type: string) => void;
}

interface ContractInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  category: "token" | "infrastructure" | "project";
  faucetUrl?: string;
  issuer?: string;
}

interface CollapsibleSectionProps {
  title: string;
  count: number;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

function CollapsibleSection({
  title,
  count,
  defaultExpanded = true,
  children,
}: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="border border-gray-200/50 dark:border-white/5 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02] hover:bg-gray-100/50 dark:hover:bg-white/[0.04] transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">
            {title}
          </h3>
          <div className="px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
            {count}
          </div>
        </div>
        <svg
          className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 dark:text-gray-400 transition-transform ${
            isExpanded ? "transform rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`transition-all duration-200 ease-in-out ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-2.5 sm:p-4 space-y-2 bg-white/30 dark:bg-transparent">
          {children}
        </div>
      </div>
    </div>
  );
}

// Add function to handle adding token to wallet
async function addTokenToWallet(contract: ContractInfo) {
  try {
    // @ts-ignore - ethereum object is injected by MetaMask
    const ethereum = window.ethereum;
    if (!ethereum) {
      console.error("No ethereum wallet found");
      return;
    }

    await ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: contract.address,
          symbol: contract.name,
          decimals: 18, // Most tokens use 18 decimals
        },
      },
    });
  } catch (error) {
    console.error("Error adding token to wallet:", error);
  }
}

const CONTRACTS: ContractInfo[] = [
  // Token Contracts
  {
    id: "mega",
    name: "MEGA",
    description: "Canonical MEGA token",
    address: "0x10a6be7d23989d00d528e68cf8051d095f741145",
    category: "token",
    issuer: "MegaETH",
  },
  {
    id: "weth",
    name: "WETH",
    description: "Wrapped Ether",
    address: "0x4eB2Bd7beE16F38B1F4a0A5796Fffd028b6040e9",
    category: "token",
    issuer: "MegaETH",
  },
  {
    id: "usdc",
    name: "USDC",
    description: "USD Coin",
    address: "0x8D635c4702BA38b1F1735e8e784c7265Dcc0b623",
    category: "token",
    issuer: "Bronto Finance",
    faucetUrl: "https://bronto.finance/faucet",
  },
  {
    id: "wbtc",
    name: "wBTC",
    description: "Wrapped Bitcoin",
    address: "0xFE928dD7D9cda6bcF7f2600B4A0e9726AE4d2577",
    category: "token",
    issuer: "Bronto Finance",
    faucetUrl: "https://bronto.finance/faucet",
  },
  {
    id: "cusd",
    name: "cUSD",
    description: "Cap USD",
    address: "0xE9b6e75C243B6100ffcb1c66e8f78F96FeeA727F",
    category: "token",
    issuer: "Cap Finance",
    faucetUrl: "https://testnet.teko.finance/mint",
  },
  {
    id: "tketh",
    name: "tkETH",
    description: "Teko ETH",
    address: "0x176735870dc6C22B4EBFBf519DE2ce758de78d94",
    category: "token",
    issuer: "Teko Finance",
    faucetUrl: "https://testnet.teko.finance/mint",
  },
  {
    id: "tkwbtc",
    name: "tkWBTC",
    description: "Teko WBTC",
    address: "0xF82ff0799448630eB56Ce747Db840a2E02Cde4D8",
    category: "token",
    issuer: "Teko Finance",
    faucetUrl: "https://testnet.teko.finance/mint",
  },
  {
    id: "tkusdc",
    name: "tkUSDC",
    description: "Teko USDC",
    address: "0xFaf334e157175Ff676911AdcF0964D7f54F2C424",
    category: "token",
    issuer: "Teko Finance",
    faucetUrl: "https://testnet.teko.finance/mint",
  },
  {
    id: "nusdc",
    name: "nUSDC",
    description: "Noise USDC",
    address: "0xe2e7d898488a2b6442d48d29a3840a92f7c3ff58",
    category: "token",
    issuer: "Noise",
  },
  {
    id: "toast",
    name: "TOAST",
    description: "The one true token",
    address: "0xc49ae2a62e7c18b7ddcab67617a63bf5182b08de",
    category: "token",
    issuer: "Bread",
  },
  // Infrastructure Contracts
  {
    id: "multicall",
    name: "Multicall3",
    description: "Batch Call Contract",
    address: "0xB1F60733C7B76F8F4085af3d9f6e374C43E462f8",
    category: "infrastructure",
  },
  {
    id: "create2deployer",
    name: "Create2 Deployer",
    description: "Deterministic addresses",
    address: "0x13b0D85CcB8bf860b6b79AF3029fCA081AE9beF2",
    category: "infrastructure",
  },
  {
    id: "univ2factory",
    name: "UniV2 Factory",
    description: "DEX Factory",
    address: "0xd2666074688C524Af9C3D000c68a2732458fc7C4",
    category: "infrastructure",
  },
  {
    id: "univ2router",
    name: "UniV2 Router",
    description: "DEX Router",
    address: "0x6CeFC3Bf9813693AAccD59cffcA3B0b2e54b0545",
    category: "infrastructure",
  },
  // Project Contracts
  {
    id: "guessbest",
    name: "Guess.Best",
    description: "Prediction Game",
    address: "0x937832aa1907f3a2E25a30992807C5B281b02540",
    category: "project",
  },
];

function ContractCard({
  contract,
  showCopied,
  onCopy,
}: {
  contract: ContractInfo;
  showCopied: string | null;
  onCopy: (text: string, type: string) => void;
}) {
  return (
    <div className="group relative p-2.5 sm:p-3 rounded-lg bg-white/40 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-blue-100/40 dark:hover:from-blue-500/[0.08] dark:hover:to-blue-600/[0.08] transition-all duration-300">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <div className="font-medium text-sm text-foreground">
              {contract.name}
            </div>
            <div className="px-1.5 py-0.5 text-[10px] rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-400 font-medium">
              {contract.description}
            </div>
            {contract.issuer && (
              <div className="px-1.5 py-0.5 text-[10px] rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium">
                {contract.issuer}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 sm:opacity-60 group-hover:opacity-100 transition-opacity">
            {contract.category === "token" && (
              <button
                onClick={() => addTokenToWallet(contract)}
                className="p-1.5 rounded-md hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-colors"
                title="Add to Wallet"
              >
                <svg
                  className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </button>
            )}
            <a
              href={`https://megaeth.blockscout.com/address/${contract.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-md hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-colors"
              title="View on Explorer"
            >
              <svg
                className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
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
            <button
              onClick={() => onCopy(contract.address, contract.id)}
              className="p-1.5 rounded-md hover:bg-blue-500/10 dark:hover:bg-blue-500/20 transition-colors relative"
              title="Copy Address"
            >
              {showCopied === contract.id ? (
                <>
                  <svg
                    className="w-3.5 h-3.5 text-emerald-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-emerald-500 text-white text-xs font-medium whitespace-nowrap">
                    Copied!
                  </span>
                </>
              ) : (
                <svg
                  className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-full font-mono text-[11px] sm:text-xs leading-relaxed break-all px-2 py-1.5 rounded bg-gray-50 dark:bg-white/[0.04] text-gray-600 dark:text-gray-400 select-all">
            {contract.address}
          </div>
        </div>
        {contract.faucetUrl && (
          <div className="flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <a
              href={contract.faucetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
            >
              Get test tokens from faucet →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export function ContractAddresses({
  showCopied,
  onCopy,
}: ContractAddressesProps) {
  const tokenContracts = CONTRACTS.filter((c) => c.category === "token");
  const infrastructureContracts = CONTRACTS.filter(
    (c) => c.category === "infrastructure"
  );
  const projectContracts = CONTRACTS.filter((c) => c.category === "project");

  return (
    <div className="p-3 sm:p-6 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:justify-between mb-4 sm:mb-6">
        <div className="space-y-1">
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">
            Contract Addresses
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Standard contract addresses on MegaETH testnet
          </p>
        </div>
        <a
          href="https://megaeth-1.gitbook.io/untitled"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-xs sm:text-sm font-medium transition-colors group whitespace-nowrap"
        >
          View full list
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5"
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

      <div className="space-y-2 sm:space-y-3">
        <CollapsibleSection
          title="Token Contracts"
          count={tokenContracts.length}
          defaultExpanded={true}
        >
          {tokenContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              showCopied={showCopied}
              onCopy={onCopy}
            />
          ))}
        </CollapsibleSection>

        <CollapsibleSection
          title="Infrastructure"
          count={infrastructureContracts.length}
          defaultExpanded={false}
        >
          {infrastructureContracts.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              showCopied={showCopied}
              onCopy={onCopy}
            />
          ))}
        </CollapsibleSection>

        {projectContracts.length > 0 && (
          <CollapsibleSection
            title="Project Contracts"
            count={projectContracts.length}
            defaultExpanded={false}
          >
            {projectContracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                showCopied={showCopied}
                onCopy={onCopy}
              />
            ))}
          </CollapsibleSection>
        )}
      </div>

      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200/50 dark:border-white/5">
        <div className="flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
          <svg
            className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 dark:text-amber-400 flex-shrink-0"
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
          <p className="text-[11px] sm:text-xs text-amber-800 dark:text-amber-300">
            These addresses are community maintained and not officially endorsed
            by the MegaETH team.
          </p>
        </div>
      </div>
    </div>
  );
}
