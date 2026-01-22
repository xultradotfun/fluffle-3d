export enum DepositStatus {
  DETECTED = "DETECTED",
  CONFIRMED = "CONFIRMED",
  SENT = "SENT",
  COMPLETED = "COMPLETED",
  ORPHANED = "ORPHANED",
  FAILED = "FAILED",
}

export interface DepositRow {
  id: string;
  arb_tx_hash: string;
  arb_block_number: string;
  arb_block_hash: string;
  sender: string;
  deposit_amount_wei: string;
  fee_amount_wei: string;
  payout_amount_wei: string;
  status: DepositStatus;
  mega_tx_hash: string | null;
  mega_nonce: string | null;
  detected_at: string;
  confirmed_at: string | null;
  sent_at: string | null;
  completed_at: string | null;
}

export interface DepositStatusResponse {
  deposit: DepositRow;
  step: 1 | 2 | 3 | 4;
  stepLabel: string;
  arbExplorerUrl: string | null;
  megaExplorerUrl: string | null;
  formatted: {
    depositAmount: string;
    feeAmount: string;
    payoutAmount: string;
  };
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  version: string;
  dryRun: boolean;
  queue: {
    paused: boolean;
    reason: string | null;
  };
  chains: {
    arbitrum: {
      chainId: number;
      name: string;
      operatorAddress: string;
      balance: string;
    };
    megaeth: {
      chainId: number;
      name: string;
      operatorAddress: string;
      balance: string;
    };
  };
  config: {
    confirmations: number;
    feeBps: number;
    minDeposit: number;
  };
}

export interface SubmitDepositResponse {
  success: boolean;
  message: string;
  depositId?: string;
  error?: string;
}
