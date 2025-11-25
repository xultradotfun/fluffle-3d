export interface ChainRevenueData {
  name: string;
  logo: string;
  total24h: number;
  total30d: number | null;
}

// Whitelist of chains to display in the revenue leaderboard
export const WHITELISTED_CHAINS = [
  "Ethereum",
  "Tron",
  "Solana",
  "Base",
  "BSC",
  "Arbitrum",
  "Polygon",
  "Avalanche",
  "OP Mainnet",
  "Optimism",
  "Hyperliquid L1",
  "Injective",
  "Near",
  "Linea",
  "TON",
  "opBNB",
  "Berachain",
  "Sonic",
  "Mantle",
  "ZKsync Era",
  "Plasma",
  "Sei",
  "Ronin",
  "Scroll",
  "Soneium",
  "Somnia",
  "Ink",
  "Manta",
  "Polygon zkEVM",
];
