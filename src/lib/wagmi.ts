import { http, createConfig, createStorage, noopStorage } from "wagmi";
import { arbitrum, mainnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

const isServer = typeof window === "undefined";

// Create storage that uses noopStorage during SSR to avoid localStorage errors
const storage = createStorage({
  storage: isServer ? noopStorage : window.localStorage,
});

// MegaETH custom chain
export const megaeth = {
  id: 6342,
  name: "MegaETH",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.megaeth.systems"],
    },
    public: {
      http: ["https://rpc.megaeth.systems"],
    },
  },
  blockExplorers: {
    default: {
      name: "Blockscout",
      url: "https://megaeth.blockscout.com",
    },
  },
  testnet: false,
} as const;

// Connectors - only include walletConnect on client to avoid SSR localStorage errors
const connectors = isServer
  ? [injected()]
  : [
      injected(),
      walletConnect({
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
      }),
    ];

export const wagmiConfig = createConfig({
  chains: [arbitrum, megaeth, mainnet],
  connectors,
  transports: {
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARB_RPC_HTTP || "https://arb1.arbitrum.io/rpc"),
    [megaeth.id]: http(process.env.NEXT_PUBLIC_MEGA_RPC_HTTP || "https://rpc.megaeth.systems"),
    [mainnet.id]: http(),
  },
  storage,
  ssr: true,
});

// Export both for compatibility
export const config = wagmiConfig;

// Chain info helpers
export const CHAINS = {
  ARBITRUM: {
    chainId: arbitrum.id,
    name: "Arbitrum",
    explorerUrl: "https://arbiscan.io",
  },
  MEGAETH: {
    chainId: megaeth.id,
    name: "MegaETH",
    explorerUrl: "https://megaeth.blockscout.com",
  },
};

export function getArbTxUrl(txHash: string): string {
  return `${CHAINS.ARBITRUM.explorerUrl}/tx/${txHash}`;
}

export function getMegaTxUrl(txHash: string): string {
  return `${CHAINS.MEGAETH.explorerUrl}/tx/${txHash}`;
}
