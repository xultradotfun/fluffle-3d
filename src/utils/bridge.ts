/**
 * Calculate fee in basis points (BPS)
 * 1 BPS = 0.01%, so 100 BPS = 1%
 */
export function calculateFee(
  amount: bigint | string,
  feeBps: number
): { feeWei: string; payoutWei: string } {
  const amountBigInt = typeof amount === "string" ? BigInt(amount) : amount;

  if (amountBigInt < 0n) {
    throw new Error("Amount cannot be negative");
  }

  if (feeBps < 0 || feeBps > 10000) {
    throw new Error("Fee BPS must be between 0 and 10000");
  }

  const feeWei = (amountBigInt * BigInt(feeBps)) / 10000n;
  const payoutWei = amountBigInt - feeWei;

  return {
    feeWei: feeWei.toString(),
    payoutWei: payoutWei.toString(),
  };
}

/**
 * Format wei to ETH string with specified decimals
 */
export function formatWeiToEth(
  wei: bigint | string,
  decimals: number = 6
): string {
  const weiBigInt = typeof wei === "string" ? BigInt(wei) : wei;
  const ethValue = Number(weiBigInt) / 1e18;
  return ethValue.toFixed(decimals);
}

/**
 * Parse ETH string to wei
 */
export function parseEthToWei(eth: string | number): string {
  const ethNum = typeof eth === "string" ? parseFloat(eth) : eth;
  const wei = BigInt(Math.floor(ethNum * 1e18));
  return wei.toString();
}

/**
 * Truncate address for display
 */
export function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Truncate hash for display
 */
export function truncateHash(hash: string): string {
  return `${hash.slice(0, 10)}...${hash.slice(-8)}`;
}

/**
 * Format ETA from milliseconds
 */
export function formatEta(ms: number | null): string {
  if (ms === null) return "Estimating...";
  if (ms < 60000) return `${Math.max(1, Math.round(ms / 1000))}s`;
  if (ms < 60 * 60000) return `${Math.round(ms / 60000)}m`;
  return `${(ms / 3600000).toFixed(1)}h`;
}

/**
 * Estimate queue ETA based on total items
 */
export function estimateQueueEtaMs(queueTotal: number): number {
  const total = Number.isFinite(queueTotal) ? Math.max(0, queueTotal) : 0;
  return (2 + total) * 1000;
}
