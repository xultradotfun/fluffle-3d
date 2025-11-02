"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ViewSwitcher } from "@/components/ViewSwitcher";
import Hero from "@/components/Hero";
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
  const router = useRouter();
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

  const handleViewChange = (
    view: "pfp" | "ecosystem" | "builder" | "bingo" | "math"
  ) => {
    if (view === "pfp") {
      router.push("/pfp");
    } else if (view === "builder") {
      router.push("/builder");
    } else if (view === "ecosystem") {
      router.push("/");
    } else if (view === "bingo") {
      router.push("/bingo");
    } else if (view === "math") {
      router.push("/math");
    }
  };

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
            <ViewSwitcher activeView="math" onViewChange={handleViewChange} />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 sm:py-12 pb-24">
        {/* Header with video background */}
        <div
          className="relative overflow-hidden mb-8"
          style={{
            clipPath:
              "polygon(24px 0, calc(100% - 48px) 0, 100% 48px, 100% 100%, 0 100%, 0 24px)",
          }}
        >
          <video
            loop
            muted
            autoPlay
            playsInline
            className="absolute top-0 right-0 w-full h-full object-cover"
            poster="/ui/oversubscription.webp"
          >
            <source src="/ui/oversubscription.mp4" type="video/mp4" />
          </video>

          <div
            className="absolute top-0 right-0 w-full h-full"
            style={{ backgroundColor: "rgba(25, 25, 26, 0.5)" }}
          />

          <div className="relative z-10 px-8 py-12" style={{ color: "#fff" }}>
            <div className="flex items-center gap-3 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="68"
                height="68"
                viewBox="0 0 68 68"
                fill="none"
                className="w-[50px] h-[50px] hidden md:block"
              >
                <path
                  d="M34 0C34.6638 18.4957 49.5043 33.3362 68 34C49.5043 34.6638 34.6638 49.5043 34 68C33.3362 49.5043 18.4957 34.6638 0 34C18.4957 33.3362 33.3362 18.4957 34 0Z"
                  fill="white"
                />
              </svg>
              <h1 className="text-4xl sm:text-5xl font-black uppercase leading-none pt-2">
                MegaETH Moonmath
              </h1>
            </div>
            <p className="text-sm sm:text-base font-bold uppercase max-w-2xl">
              Calculate potential returns for Echo, Fluffle & Sonar rounds
            </p>
          </div>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-16 h-16 border-4 border-foreground border-t-pink animate-spin" />
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

