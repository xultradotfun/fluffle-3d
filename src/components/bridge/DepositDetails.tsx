"use client";

import { ExternalLink, Copy, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { useState } from "react";
import { DepositStatusResponse } from "@/types/bridge";
import { truncateHash } from "@/utils/bridge";
import { colors } from "@/lib/colors";

interface DepositDetailsProps {
  data: DepositStatusResponse;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 hover:opacity-70 transition-opacity"
      type="button"
    >
      {copied ? (
        <CheckCircle2 className="h-4 w-4" style={{ color: colors.pink }} strokeWidth={3} />
      ) : (
        <Copy className="h-4 w-4" style={{ color: colors.background }} strokeWidth={3} />
      )}
    </button>
  );
}

export function DepositDetails({ data }: DepositDetailsProps) {
  const { deposit, formatted, arbExplorerUrl, megaExplorerUrl } = data;
  const isCompleted = deposit.status === "COMPLETED";
  const isOrphaned = deposit.status === "ORPHANED";
  const isFailed = deposit.status === "FAILED";

  return (
    <div className="space-y-4">
      {/* Status Banner */}
      {isCompleted && (
        <div
          style={{
            clipPath:
              "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          }}
        >
          <div style={{ backgroundColor: colors.pink, padding: "2px" }}>
            <div
              className="p-4"
              style={{
                backgroundColor: colors.foreground,
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6" style={{ color: colors.pink }} strokeWidth={3} />
                <div>
                  <p className="font-black text-base uppercase" style={{ color: colors.pink }}>
                    FUNDS RECEIVED
                  </p>
                  <p className="text-sm font-bold mt-1" style={{ color: colors.background }}>
                    {formatted.payoutAmount} ETH sent to your address
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {(isOrphaned || isFailed) && (
        <div
          style={{
            clipPath:
              "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
          }}
        >
          <div style={{ backgroundColor: colors.error, padding: "2px" }}>
            <div
              className="p-4"
              style={{
                backgroundColor: colors.foreground,
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="h-6 w-6" style={{ color: colors.error }} strokeWidth={3} />
                <div>
                  <p className="font-black text-base uppercase" style={{ color: colors.error }}>
                    {isOrphaned ? "DEPOSIT ORPHANED" : "PAYOUT FAILED"}
                  </p>
                  <p className="text-sm font-bold mt-1" style={{ color: colors.background }}>
                    {isOrphaned
                      ? "Chain reorganization detected. Deposit will not be processed."
                      : "The payout transaction failed. Please contact support."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Details */}
      <div
        style={{
          clipPath:
            "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
        }}
      >
        <div style={{ backgroundColor: colors.pink, padding: "2px" }}>
          <div
            className="p-5"
            style={{
              backgroundColor: "#fff",
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
            }}
          >
            <div className="space-y-4">
              {/* Status */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase" style={{ color: colors.foreground }}>
                  Status
                </span>
                <span
                  className="text-xs font-black uppercase px-3 py-1"
                  style={{
                    backgroundColor: isCompleted
                      ? colors.pink
                      : isOrphaned || isFailed
                      ? colors.error
                      : colors.foreground,
                    color: "#fff",
                    clipPath:
                      "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  }}
                >
                  {deposit.status}
                </span>
              </div>

              {/* Deposit Amount */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase" style={{ color: colors.foreground }}>
                  Deposit
                </span>
                <span className="font-mono font-bold text-sm" style={{ color: colors.foreground }}>
                  {formatted.depositAmount} ETH
                </span>
              </div>

              {/* Fee */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase" style={{ color: colors.foreground }}>
                  Fee (0.30%)
                </span>
                <span className="font-mono font-bold text-sm" style={{ color: "#666" }}>
                  {formatted.feeAmount} ETH
                </span>
              </div>

              {/* Payout */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase" style={{ color: colors.foreground }}>
                  Payout
                </span>
                <span className="font-mono font-bold text-sm" style={{ color: colors.pink }}>
                  {formatted.payoutAmount} ETH
                </span>
              </div>

              {/* Sender */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase" style={{ color: colors.foreground }}>
                  Sender
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm font-bold" style={{ color: colors.foreground }}>
                    {truncateHash(deposit.sender)}
                  </span>
                  <CopyButton text={deposit.sender} />
                </div>
              </div>

              {/* Arbitrum TX */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase" style={{ color: colors.foreground }}>
                  Arbitrum TX
                </span>
                <div className="flex items-center gap-1">
                  <span className="font-mono text-sm font-bold" style={{ color: colors.foreground }}>
                    {truncateHash(deposit.arb_tx_hash)}
                  </span>
                  <CopyButton text={deposit.arb_tx_hash} />
                  {arbExplorerUrl && (
                    <a
                      href={arbExplorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1 hover:opacity-70 transition-opacity"
                    >
                      <ExternalLink className="h-4 w-4" style={{ color: colors.pink }} strokeWidth={3} />
                    </a>
                  )}
                </div>
              </div>

              {/* MegaETH TX */}
              {deposit.mega_tx_hash && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-black uppercase" style={{ color: colors.foreground }}>
                    MegaETH TX
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-sm font-bold" style={{ color: colors.foreground }}>
                      {truncateHash(deposit.mega_tx_hash)}
                    </span>
                    <CopyButton text={deposit.mega_tx_hash} />
                    {megaExplorerUrl && (
                      <a
                        href={megaExplorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 hover:opacity-70 transition-opacity"
                      >
                        <ExternalLink className="h-4 w-4" style={{ color: colors.pink }} strokeWidth={3} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Detected Time */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-black uppercase" style={{ color: colors.foreground }}>
                  Detected
                </span>
                <span className="text-sm font-bold" style={{ color: "#666" }}>
                  {new Date(deposit.detected_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
