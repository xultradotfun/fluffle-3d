import { http, createConfig } from "wagmi";
import { arbitrum, mainnet } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";

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
      name: "MegaExplorer",
      url: "https://explorer.megaeth.systems",
    },
  },
  testnet: false,
} as const;

export const config = createConfig({
  chains: [arbitrum, megaeth, mainnet],
  connectors: [
    injected(),
    walletConnect({
      projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
    }),
  ],
  transports: {
    [arbitrum.id]: http(process.env.NEXT_PUBLIC_ARB_RPC_HTTP || "https://arb1.arbitrum.io/rpc"),
    [megaeth.id]: http(process.env.NEXT_PUBLIC_MEGA_RPC_HTTP || "https://rpc.megaeth.systems"),
    [mainnet.id]: http(),
  },
  ssr: true,
});

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
    explorerUrl: "https://explorer.megaeth.systems",
  },
};

export function getArbTxUrl(txHash: string): string {
  return `${CHAINS.ARBITRUM.explorerUrl}/tx/${txHash}`;
}

export function getMegaTxUrl(txHash: string): string {
  return `${CHAINS.MEGAETH.explorerUrl}/tx/${txHash}`;
}
