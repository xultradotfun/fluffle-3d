interface ContractAddressesProps {
  showCopied: string | null;
  onCopy: (text: string, type: string) => void;
}

interface ContractInfo {
  id: string;
  name: string;
  description: string;
  address: string;
  category: "token" | "infrastructure";
  faucetUrl?: string;
}

const CONTRACTS: ContractInfo[] = [
  {
    id: "weth",
    name: "WETH",
    description: "Wrapped Ether",
    address: "0x4eB2Bd7beE16F38B1F4a0A5796Fffd028b6040e9",
    category: "token",
  },
  {
    id: "usdc",
    name: "USDC",
    description: "USD Coin",
    address: "0x8D635c4702BA38b1F1735e8e784c7265Dcc0b623",
    category: "token",
    faucetUrl: "https://bronto.finance/faucet",
  },
  {
    id: "wbtc",
    name: "wBTC",
    description: "Wrapped Bitcoin",
    address: "0xFE928dD7D9cda6bcF7f2600B4A0e9726AE4d2577",
    category: "token",
    faucetUrl: "https://bronto.finance/faucet",
  },
  {
    id: "multicall",
    name: "Multicall3",
    description: "Batch Call Contract",
    address: "0xB1F60733C7B76F8F4085af3d9f6e374C43E462f8",
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
    <div className="group relative p-3 rounded-lg bg-white/40 dark:bg-white/[0.03] border border-gray-200/50 dark:border-white/5 hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:bg-gradient-to-br hover:from-blue-50/40 hover:to-blue-100/40 dark:hover:from-blue-500/[0.08] dark:hover:to-blue-600/[0.08] transition-all duration-300">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="font-medium text-sm text-foreground">
              {contract.name}
            </div>
            <div className="px-1.5 py-0.5 text-[10px] rounded-full bg-gray-100 dark:bg-white/[0.06] text-gray-600 dark:text-gray-400 font-medium">
              {contract.description}
            </div>
          </div>
          <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <a
              href={`https://megaexplorer.xyz/address/${contract.address}`}
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
          <div className="flex-1 px-2 py-1.5 rounded bg-gray-50 dark:bg-white/[0.04] font-mono text-xs text-gray-600 dark:text-gray-400 select-all">
            {contract.address}
          </div>
        </div>
        {contract.faucetUrl && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
            <a
              href={contract.faucetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium transition-colors"
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

  return (
    <div className="p-6 rounded-xl bg-white/50 dark:bg-white/[0.02] border border-gray-200 dark:border-white/5 backdrop-blur-sm shadow-xl">
      <div className="flex items-start justify-between mb-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-foreground">
            Contract Addresses
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Standard contract addresses on MegaETH testnet
          </p>
        </div>
        <a
          href="https://megaeth-1.gitbook.io/untitled"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-sm font-medium transition-colors group"
        >
          View full list
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
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

      <div className="space-y-6">
        {/* Token Contracts */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">
              Token Contracts
            </h3>
            <div className="px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
              {tokenContracts.length}
            </div>
          </div>
          <div className="grid gap-2">
            {tokenContracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                showCopied={showCopied}
                onCopy={onCopy}
              />
            ))}
          </div>
        </div>

        {/* Infrastructure Contracts */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-200">
              Infrastructure
            </h3>
            <div className="px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium">
              {infrastructureContracts.length}
            </div>
          </div>
          <div className="grid gap-2">
            {infrastructureContracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                showCopied={showCopied}
                onCopy={onCopy}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200/50 dark:border-white/5">
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50/50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10">
          <svg
            className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0"
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
          <p className="text-xs text-amber-800 dark:text-amber-300">
            These addresses are community maintained and not officially endorsed
            by the MegaETH team.
          </p>
        </div>
      </div>
    </div>
  );
}
