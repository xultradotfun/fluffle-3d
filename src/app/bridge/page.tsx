"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, Search, AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { BridgeForm } from "@/components/bridge/BridgeForm";
import { TxInput } from "@/components/bridge/TxInput";
import { StatusStepper } from "@/components/bridge/StatusStepper";
import { DepositDetails } from "@/components/bridge/DepositDetails";
import { useBridgeStatus } from "@/hooks/useBridgeStatus";
import { fetchBridgeHealth } from "@/lib/bridgeApi";
import { HealthResponse } from "@/types/bridge";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import PageHeader from "@/components/PageHeader";

export default function BridgePage() {
  const [view, setView] = useState<"bridge" | "track">("bridge");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);
  const { data, loading, error } = useBridgeStatus(txHash);

  useEffect(() => {
    fetchBridgeHealth()
      .then(setHealth)
      .catch((err) => {
        console.error("Failed to fetch health:", err);
        setHealthError("Unable to connect to bridge service");
      });
  }, []);

  const handleBridgeSuccess = (hash: string) => {
    setTxHash(hash);
    setView("track");
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#dfd9d9" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 py-8">
        <PageHeader
          title="COMMUNITY GAS BRIDGE"
          description="Fund your MegaETH account with gas from Arbitrum"
        />

        <div className="mt-8">
          <ViewSwitcher activeView="bridge" />
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto mt-8">
          {/* Outer container with pink border */}
          <div
            style={{
              clipPath:
                "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
            }}
          >
            <div style={{ backgroundColor: "#f380cd", padding: "2px" }}>
              <div
                style={{
                  backgroundColor: "#19191a",
                  clipPath:
                    "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
                }}
              >
                {/* Toggle Buttons */}
                <div className="flex items-center gap-1 p-2 border-b-2 border-pink">
                  <button
                    onClick={() => setView("bridge")}
                    className={`flex items-center gap-2 px-6 py-3 font-black uppercase text-sm transition-all ${
                      view === "bridge" ? "" : "opacity-50"
                    }`}
                    style={{
                      backgroundColor: view === "bridge" ? "#f380cd" : "transparent",
                      color: view === "bridge" ? "#19191a" : "#dfd9d9",
                      clipPath:
                        view === "bridge"
                          ? "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
                          : "none",
                    }}
                  >
                    <ArrowLeftRight className="w-4 h-4" strokeWidth={3} />
                    Bridge
                  </button>
                  <button
                    onClick={() => setView("track")}
                    className={`flex items-center gap-2 px-6 py-3 font-black uppercase text-sm transition-all ${
                      view === "track" ? "" : "opacity-50"
                    }`}
                    style={{
                      backgroundColor: view === "track" ? "#f380cd" : "transparent",
                      color: view === "track" ? "#19191a" : "#dfd9d9",
                      clipPath:
                        view === "track"
                          ? "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)"
                          : "none",
                    }}
                  >
                    <Search className="w-4 h-4" strokeWidth={3} />
                    Track
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  {view === "bridge" ? (
                    healthError ? (
                      <div className="p-8 text-center">
                        <AlertCircle
                          className="w-12 h-12 mx-auto mb-4"
                          style={{ color: "#f44336" }}
                          strokeWidth={3}
                        />
                        <p className="font-black text-lg uppercase" style={{ color: "#f44336" }}>
                          {healthError}
                        </p>
                        <p className="font-bold text-sm mt-2" style={{ color: "#dfd9d9" }}>
                          Please try again later
                        </p>
                      </div>
                    ) : health ? (
                      <BridgeForm health={health} onBridgeSuccess={handleBridgeSuccess} />
                    ) : (
                      <div className="p-12 text-center">
                        <Loader2
                          className="w-12 h-12 mx-auto animate-spin"
                          style={{ color: "#f380cd" }}
                          strokeWidth={3}
                        />
                        <p className="font-black text-lg uppercase mt-4" style={{ color: "#dfd9d9" }}>
                          Loading...
                        </p>
                      </div>
                    )
                  ) : (
                    <>
                      {txHash && (
                        <button
                          onClick={() => {
                            setTxHash(null);
                          }}
                          className="flex items-center gap-1 text-sm font-bold uppercase mb-4 transition-opacity hover:opacity-70"
                          style={{ color: "#dfd9d9" }}
                        >
                          <ArrowLeft className="w-4 h-4" strokeWidth={3} />
                          New search
                        </button>
                      )}

                      <TxInput
                        onSubmit={setTxHash}
                        disabled={loading}
                        initialValue={txHash || ""}
                      />

                      {txHash && (
                        <div className="mt-6">
                          {loading && !data ? (
                            <div className="py-12 text-center">
                              <Loader2
                                className="w-12 h-12 mx-auto animate-spin"
                                style={{ color: "#f380cd" }}
                                strokeWidth={3}
                              />
                              <p className="font-black text-lg uppercase mt-4" style={{ color: "#dfd9d9" }}>
                                Loading...
                              </p>
                            </div>
                          ) : error ? (
                            <div
                              style={{
                                clipPath:
                                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                              }}
                            >
                              <div style={{ backgroundColor: "#f44336", padding: "2px" }}>
                                <div
                                  className="p-6 text-center"
                                  style={{
                                    backgroundColor: "#19191a",
                                    clipPath:
                                      "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                                  }}
                                >
                                  <AlertCircle
                                    className="w-10 h-10 mx-auto mb-3"
                                    style={{ color: "#f44336" }}
                                    strokeWidth={3}
                                  />
                                  <p className="font-black uppercase" style={{ color: "#f44336" }}>
                                    {error}
                                  </p>
                                  <p className="text-sm font-bold mt-2" style={{ color: "#dfd9d9" }}>
                                    Make sure this is a valid bridge deposit
                                  </p>
                                </div>
                              </div>
                            </div>
                          ) : data ? (
                            <div className="space-y-6">
                              <StatusStepper currentStep={data.step} status={data.deposit.status} />
                              <DepositDetails data={data} />
                            </div>
                          ) : null}
                        </div>
                      )}

                      {!txHash && (
                        <div
                          className="p-8 text-center mt-4"
                          style={{
                            backgroundColor: "#333",
                            clipPath:
                              "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                          }}
                        >
                          <Search className="w-8 h-8 mx-auto mb-3" style={{ color: "#666" }} strokeWidth={3} />
                          <p className="text-sm font-bold" style={{ color: "#dfd9d9" }}>
                            Enter your Arbitrum tx hash to track status
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-xs font-bold uppercase" style={{ color: "#666" }}>
            Community Gas Bridge • Arbitrum → MegaETH
          </p>
          <p className="text-[10px] font-bold mt-1" style={{ color: "#999" }}>
            Min: 0.00015 ETH • Max: 0.0015 ETH
          </p>
        </div>
      </div>
    </div>
  );
}
