"use client";

import { useState, useEffect } from "react";
import { colors } from "@/lib/colors";
import { ViewSwitcher } from "@/components/layout/ViewSwitcher";
import Hero from "@/components/layout/Hero";
import PageHeader from "@/components/layout/PageHeader";
import RoundSelector from "@/components/math/RoundSelector";
import TokenScrollPicker from "@/components/math/TokenScrollPicker";
import ResultsDisplay from "@/components/math/ResultsDisplay";

interface MarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  fully_diluted_valuation: number;
}

interface ApiResponse {
  success: boolean;
  markets: {
    [key: string]: MarketData;
  };
}

const ROUNDS = {
  echo: {
    name: "Echo Round",
    investment: 3700,
    fdv: 220_000_000,
  },
  fluffle: {
    name: "Fluffle Round",
    investment: 2650,
    fdv: 550_000_000,
  },
  sonar: {
    name: "Sonar Round",
    investment: 186282,
    fdv: 999_000_000,
  },
  custom: {
    name: "Custom Round",
    investment: 5000,
    fdv: 300_000_000,
  },
};

export default function MathPage() {
  const [marketData, setMarketData] = useState<ApiResponse | null>(null);
  const [selectedRounds, setSelectedRounds] = useState<
    Array<"echo" | "fluffle" | "sonar" | "custom">
  >(["echo"]);
  const [loading, setLoading] = useState(true);
  const [selectedTokenIndex, setSelectedTokenIndex] = useState(0);
  const [sonarInvestment, setSonarInvestment] = useState(186282);
  const [customInvestment, setCustomInvestment] = useState(5000);
  const [customFdv, setCustomFdv] = useState(300_000_000);
  const [lamboMode, setLamboMode] = useState(false);

  useEffect(() => {
    fetch("/api/math/markets")
      .then((res) => res.json())
      .then((data) => {
        setMarketData(data);
        setLoading(false);
        if (data?.success) {
          const tokenCount = Object.keys(data.markets).length;
          setSelectedTokenIndex(Math.floor(tokenCount / 2));
        }
      })
      .catch((err) => {
        console.error("Error fetching market data:", err);
        setLoading(false);
      });
  }, []);

  const sortedTokens = marketData?.success
    ? Object.values(marketData.markets).sort(
        (a, b) => a.fully_diluted_valuation - b.fully_diluted_valuation
      )
    : [];

  const handleTokenSelect = (index: number) => {
    setSelectedTokenIndex(index);
  };

  const handleRoundToggle = (
    round: "echo" | "fluffle" | "sonar" | "custom"
  ) => {
    setSelectedRounds((prev) => {
      if (prev.includes(round)) {
        if (prev.length === 1) return prev;
        return prev.filter((r) => r !== round);
      } else {
        return [...prev, round];
      }
    });
  };

  const calculatePotentialValue = (
    targetFdv: number,
    round: "echo" | "fluffle" | "sonar" | "custom"
  ) => {
    let investment, fdv;
    if (round === "custom") {
      investment = customInvestment;
      fdv = customFdv;
    } else if (round === "sonar") {
      investment = sonarInvestment;
      fdv = ROUNDS.sonar.fdv;
    } else {
      const roundData = ROUNDS[round];
      investment = roundData.investment;
      fdv = roundData.fdv;
    }
    const ownershipPercentage = investment / fdv;
    const potentialValue = ownershipPercentage * targetFdv;
    const multiplier = potentialValue / investment;
    return { potentialValue, multiplier };
  };

  const getCurrentRoundData = (
    round: "echo" | "fluffle" | "sonar" | "custom"
  ) => {
    if (round === "custom") {
      return {
        name: "Custom Round",
        investment: customInvestment,
        fdv: customFdv,
      };
    } else if (round === "sonar") {
      return {
        name: "Sonar Round",
        investment: sonarInvestment,
        fdv: ROUNDS.sonar.fdv,
      };
    }
    return ROUNDS[round];
  };

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(2)}B`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(2)}M`;
    } else if (value >= 1_000) {
      return `$${(value / 1_000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <Hero />

      {/* Desktop View Switcher */}
      <div className="relative z-20 mb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center">
            <ViewSwitcher activeView="math" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-24">
        <PageHeader
          title="MegaETH Moonmath"
          description="Calculate potential returns for Echo, Fluffle & Sonar rounds"
        />
        {loading ? (
          <div className="w-full">
            {/* Skeleton loaders */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 items-start w-full">
              {/* RoundSelector skeleton */}
              <div
                className="w-full"
                style={{
                  clipPath:
                    "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
              >
                <div style={{ backgroundColor: colors.foreground, padding: "2px" }}>
                  <div
                    className="p-6 animate-pulse"
                    style={{
                      backgroundColor: colors.foreground,
                      clipPath:
                        "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                      minHeight: "400px",
                      minWidth: "300px",
                    }}
                  >
                    <div className="h-4 bg-background/20 rounded w-full max-w-[200px] mb-2" />
                    <div className="h-3 bg-background/20 rounded w-full max-w-[300px] mb-6" />
                    <div className="space-y-3">
                      <div className="h-24 bg-background/10 rounded w-full" />
                      <div className="h-24 bg-background/10 rounded w-full" />
                      <div className="h-24 bg-background/10 rounded w-full" />
                      <div className="h-16 bg-background/10 rounded w-full" />
                    </div>
                  </div>
                </div>
              </div>

              {/* TokenScrollPicker skeleton */}
              <div
                className="w-full"
                style={{
                  clipPath:
                    "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                }}
              >
                <div style={{ backgroundColor: colors.foreground, padding: "2px" }}>
                  <div
                    className="p-6 animate-pulse"
                    style={{
                      backgroundColor: colors.foreground,
                      clipPath:
                        "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                      minHeight: "400px",
                      minWidth: "300px",
                    }}
                  >
                    <div className="h-4 bg-background/20 rounded w-full max-w-[200px] mb-2" />
                    <div className="h-3 bg-background/20 rounded w-full max-w-[250px] mb-6" />
                    <div className="grid grid-cols-4 gap-3">
                      {[...Array(16)].map((_, i) => (
                        <div key={i} className="h-20 bg-background/10 rounded" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ResultsDisplay skeleton */}
            <div
              style={{
                clipPath:
                  "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
              }}
            >
              <div style={{ backgroundColor: colors.foreground, padding: "2px" }}>
                <div
                  className="p-6 animate-pulse"
                  style={{
                    backgroundColor: colors.foreground,
                    clipPath:
                      "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
                  }}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-background/20 rounded-full" />
                    <div className="flex-1">
                      <div className="h-6 bg-background/20 rounded w-64 mb-2" />
                      <div className="h-4 bg-background/20 rounded w-32" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="h-32 bg-background/10 rounded" />
                    <div className="h-32 bg-background/10 rounded" />
                    <div className="h-32 bg-background/10 rounded" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : marketData?.success ? (
          <>
            {/* Side by Side Selection */}
            <div className="grid md:grid-cols-2 gap-6 mb-6 items-start">
              <RoundSelector
                rounds={ROUNDS}
                selectedRounds={selectedRounds}
                onRoundToggle={handleRoundToggle}
                formatCurrency={formatCurrency}
                sonarInvestment={sonarInvestment}
                onSonarInvestmentChange={setSonarInvestment}
                customInvestment={customInvestment}
                customFdv={customFdv}
                onCustomInvestmentChange={setCustomInvestment}
                onCustomFdvChange={setCustomFdv}
              />

              <TokenScrollPicker
                tokens={sortedTokens}
                selectedIndex={selectedTokenIndex}
                onTokenSelect={handleTokenSelect}
                formatCurrency={formatCurrency}
              />
            </div>

            {/* Results Display */}
            {sortedTokens[selectedTokenIndex] &&
              (() => {
                // Calculate cumulative values for all selected rounds
                const totalInvestment = selectedRounds.reduce((sum, round) => {
                  return sum + getCurrentRoundData(round).investment;
                }, 0);

                const totalPositionValue = selectedRounds.reduce(
                  (sum, round) => {
                    return (
                      sum +
                      calculatePotentialValue(
                        sortedTokens[selectedTokenIndex]
                          .fully_diluted_valuation,
                        round
                      ).potentialValue
                    );
                  },
                  0
                );

                const averageMultiplier = totalPositionValue / totalInvestment;

                const roundNames =
                  selectedRounds.length === 1
                    ? getCurrentRoundData(selectedRounds[0]).name
                    : selectedRounds
                        .map((round) =>
                          getCurrentRoundData(round).name.replace(" Round", "")
                        )
                        .join(" + ") + " Rounds";

                return (
                  <ResultsDisplay
                    token={sortedTokens[selectedTokenIndex]}
                    roundName={roundNames}
                    investment={totalInvestment}
                    positionValue={totalPositionValue}
                    multiplier={averageMultiplier}
                    formatCurrency={formatCurrency}
                    lamboMode={lamboMode}
                    onLamboModeToggle={() => setLamboMode(!lamboMode)}
                  />
                );
              })()}
          </>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-foreground font-bold uppercase">
              Failed to load market data. Please try again later.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

