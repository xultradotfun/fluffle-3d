import { colors } from "@/lib/colors";
import {
  CheckCircle2,
  XCircle,
  Lock,
  LockOpen,
} from "lucide-react";

interface AllocationResult {
  wallet: string;
  allocation?: number;
  usdAmount?: number;
  error?: string;
  bidAmount?: number;
  acceptedAmount?: number;
  fillPercentage?: number;
  lockup?: boolean;
  status?: string;
  rank?: {
    overall: number;
    category: number;
    categoryType: string;
  };
}

interface AllocationResultCardProps {
  result: AllocationResult;
  hideAddresses: boolean;
  calculateValueAtFdv: (megaAmount: number) => number;
}

export function AllocationResultCard({
  result,
  hideAddresses,
  calculateValueAtFdv,
}: AllocationResultCardProps) {
  return (
    <div
      className="p-4 border-3"
      style={{
        backgroundColor:
          result.allocation && result.allocation > 0
            ? colors.white
            : colors.light,
        borderColor: colors.foreground,
        clipPath:
          "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
      }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {result.allocation !== undefined &&
          result.allocation > 0 ? (
            <CheckCircle2
              className="w-5 h-5 flex-shrink-0"
              style={{ color: colors.green }}
              strokeWidth={3}
            />
          ) : result.error ? (
            <XCircle
              className="w-5 h-5 flex-shrink-0"
              style={{ color: colors.error }}
              strokeWidth={3}
            />
          ) : (
            <XCircle
              className="w-5 h-5 flex-shrink-0"
              style={{ color: colors.mutedLight }}
              strokeWidth={3}
            />
          )}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <span
              className="font-mono text-sm font-bold truncate"
              style={{
                color: colors.foreground,
                filter: hideAddresses ? "blur(6px)" : "none",
                userSelect: hideAddresses ? "none" : "auto",
              }}
              title={
                hideAddresses
                  ? "Address blurred for privacy"
                  : result.wallet
              }
            >
              {result.wallet}
            </span>
            {result.rank && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <span
                  className="text-[10px] font-black uppercase px-1.5 py-0.5 border-2"
                  style={{
                    backgroundColor: colors.white,
                    borderColor: colors.foreground,
                    color: colors.foreground,
                  }}
                  title="Overall rank"
                >
                  #{result.rank.overall}
                </span>
                <span
                  className="text-[10px] font-black uppercase px-1.5 py-0.5 border-2 flex items-center gap-1"
                  style={{
                    backgroundColor:
                      result.rank.categoryType === "locked"
                        ? colors.pink
                        : colors.light,
                    borderColor: colors.foreground,
                    color: colors.foreground,
                  }}
                  title={`Rank among ${result.rank.categoryType} bids`}
                >
                  {result.rank.categoryType === "locked" ? (
                    <Lock
                      className="w-2.5 h-2.5"
                      strokeWidth={3}
                    />
                  ) : (
                    <LockOpen
                      className="w-2.5 h-2.5"
                      strokeWidth={3}
                    />
                  )}
                  #{result.rank.category}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          {result.allocation !== undefined ? (
            <div className="flex flex-col items-end gap-0.5">
              <span
                className="text-lg font-black"
                style={{
                  color:
                    result.allocation > 0 ? colors.green : colors.mutedLight,
                }}
              >
                {result.allocation.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}{" "}
                MEGA
              </span>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-bold"
                  style={{ color: colors.muted }}
                >
                  $
                  {calculateValueAtFdv(
                    result.allocation
                  ).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                  {result.bidAmount !== undefined &&
                    result.fillPercentage !== undefined && (
                      <span
                        style={{
                          color:
                            result.fillPercentage > 0
                              ? colors.pink
                              : colors.mutedLight,
                          marginLeft: "8px",
                        }}
                      >
                        {result.fillPercentage > 0
                          ? `(${result.fillPercentage.toFixed(
                              2
                            )}% filled)`
                          : `(0% filled)`}
                      </span>
                    )}
                </span>
                {result.lockup !== undefined && (
                  <span
                    className="text-[10px] font-black uppercase px-1.5 py-0.5 border-2"
                    style={{
                      backgroundColor: result.lockup
                        ? colors.pink
                        : colors.light,
                      borderColor: colors.foreground,
                      color: colors.foreground,
                    }}
                  >
                    {result.lockup ? "🔒 LOCKED" : "UNLOCKED"}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <span
              className="text-sm font-bold uppercase"
              style={{ color: colors.error }}
            >
              {result.error || "No allocation"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
