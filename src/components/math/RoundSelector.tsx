import Image from "next/image";
import { colors } from "@/lib/colors";
import { getClipPath } from "@/lib/sizes";
import { BorderedBox } from "@/components/ui/BorderedBox";

interface Round {
  name: string;
  investment: number;
  fdv: number;
}

interface RoundSelectorProps {
  rounds: { echo: Round; fluffle: Round; sonar: Round; custom: Round };
  selectedRounds: Array<"echo" | "fluffle" | "sonar" | "custom">;
  onRoundToggle: (round: "echo" | "fluffle" | "sonar" | "custom") => void;
  formatCurrency: (value: number) => string;
  sonarInvestment: number;
  onSonarInvestmentChange: (value: number) => void;
  customInvestment: number;
  customFdv: number;
  onCustomInvestmentChange: (value: number) => void;
  onCustomFdvChange: (value: number) => void;
}

export default function RoundSelector({
  rounds,
  selectedRounds,
  onRoundToggle,
  formatCurrency,
  sonarInvestment,
  onSonarInvestmentChange,
  customInvestment,
  customFdv,
  onCustomInvestmentChange,
  onCustomFdvChange,
}: RoundSelectorProps) {
  const isSonarExpanded = selectedRounds.includes("sonar");
  const isCustomExpanded = selectedRounds.includes("custom");

  return (
    <BorderedBox
      cornerSize="2xl"
      borderColor="dark"
      bgColor="dark"
      className="p-6"
    >
          <h2
            className="text-lg font-black uppercase mb-2"
            style={{ color: colors.background }}
          >
            Select Round
          </h2>
          <p
            className="text-sm font-bold uppercase mb-6"
            style={{ color: colors.background }}
          >
            Choose one or more rounds to see cumulative results
          </p>

          <div className="space-y-3">
            {/* Echo Round */}
            <button
              onClick={() => onRoundToggle("echo")}
              className={`w-full h-auto py-6 px-6 flex items-center gap-6 border-3 font-bold transition-colors ${
                selectedRounds.includes("echo")
                  ? "bg-pink border-foreground"
                  : "bg-transparent border-background hover:bg-pink hover:border-foreground"
              }`}
              style={{
                clipPath: getClipPath("lg"),
                color: selectedRounds.includes("echo") ? colors.foreground : colors.background,
              }}
            >
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src="/math-tokens/echo.png"
                  alt="Echo Round"
                  width={80}
                  height={80}
                />
              </div>
              <div className="flex flex-col items-start gap-1 flex-1">
                <div className="text-xl font-black uppercase tracking-tight">
                  Echo Round
                </div>
                <div className="text-base font-data">
                  ${rounds.echo.investment.toLocaleString()} @{" "}
                  {formatCurrency(rounds.echo.fdv)}
                </div>
              </div>
            </button>

            {/* Fluffle Round */}
            <button
              onClick={() => onRoundToggle("fluffle")}
              className={`w-full h-auto py-6 px-6 flex items-center gap-6 border-3 font-bold transition-colors ${
                selectedRounds.includes("fluffle")
                  ? "bg-pink border-foreground"
                  : "bg-transparent border-background hover:bg-pink hover:border-foreground"
              }`}
              style={{
                clipPath: getClipPath("lg"),
                color: selectedRounds.includes("fluffle")
                  ? colors.foreground
                  : colors.background,
              }}
            >
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src="/math-tokens/fluffle.png"
                  alt="Fluffle Round"
                  width={80}
                  height={80}
                />
              </div>
              <div className="flex flex-col items-start gap-1 flex-1">
                <div className="text-xl font-black uppercase tracking-tight">
                  Fluffle Round
                </div>
                <div className="text-base font-data">
                  ${rounds.fluffle.investment.toLocaleString()} @{" "}
                  {formatCurrency(rounds.fluffle.fdv)}
                </div>
              </div>
            </button>

            {/* Sonar Round */}
            {isSonarExpanded ? (
              <BorderedBox
                cornerSize="lg"
                borderColor="pink"
                bgColor="dark"
                className="space-y-3 p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src="/math-tokens/sonar.png"
                      alt="Sonar Round"
                      width={64}
                      height={64}
                    />
                  </div>
                  <div className="flex-1">
                    <div
                      className="text-xl font-black uppercase tracking-tight"
                      style={{ color: colors.background }}
                    >
                      Sonar Round
                    </div>
                    <div
                      className="text-sm font-data font-bold"
                      style={{ color: colors.background }}
                    >
                      {formatCurrency(rounds.sonar.fdv)}
                    </div>
                  </div>
                  <button
                    onClick={() => onRoundToggle("sonar")}
                    className="h-8 w-8 p-0 border-3 border-foreground bg-destructive hover:bg-pink font-bold transition-colors"
                    style={{
                      color: colors.background,
                      clipPath: getClipPath("xs"),
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="sonar-investment"
                    className="font-data font-bold uppercase text-xs block"
                    style={{ color: colors.background }}
                  >
                    Investment Amount ($)
                  </label>
                  <input
                    id="sonar-investment"
                    type="number"
                    value={sonarInvestment}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      onSonarInvestmentChange(Math.min(value, 186282));
                    }}
                    max={186282}
                    placeholder="186282"
                    className="w-full border-3 border-background px-4 py-3 font-data font-bold focus:border-pink focus:ring-0 focus:outline-none"
                    style={{
                      backgroundColor: colors.light,
                      color: colors.foreground,
                      clipPath: getClipPath("sm"),
                    }}
                  />
                  <p
                    className="text-xs font-data font-bold"
                    style={{ color: colors.background }}
                  >
                    Max: $186,282
                  </p>
                </div>
              </BorderedBox>
            ) : (
              <button
                onClick={() => onRoundToggle("sonar")}
                className="w-full h-auto py-6 px-6 flex items-center gap-6 border-3 border-background hover:bg-pink hover:border-foreground font-bold transition-colors bg-transparent"
                style={{
                  clipPath: getClipPath("lg"),
                  color: colors.background,
                }}
              >
                <div className="relative w-20 h-20 flex-shrink-0">
                  <Image
                    src="/math-tokens/sonar.png"
                    alt="Sonar Round"
                    width={80}
                    height={80}
                  />
                </div>
                <div className="flex flex-col items-start gap-1 flex-1">
                  <div className="text-xl font-black uppercase tracking-tight">
                    Sonar Round
                  </div>
                  <div className="text-base font-data">
                    Up to ${rounds.sonar.investment.toLocaleString()} @{" "}
                    {formatCurrency(rounds.sonar.fdv)}
                  </div>
                </div>
              </button>
            )}

            {/* Custom Round */}
            {isCustomExpanded ? (
              <BorderedBox
                cornerSize="lg"
                borderColor="pink"
                bgColor="dark"
                className="space-y-3 p-4"
              >
                <div className="flex items-center justify-between">
                  <div
                    className="text-xl font-black uppercase tracking-tight"
                    style={{ color: colors.background }}
                  >
                    Custom Round
                  </div>
                  <button
                    onClick={() => onRoundToggle("custom")}
                    className="h-8 w-8 p-0 border-3 border-foreground bg-destructive hover:bg-pink font-bold transition-colors"
                    style={{
                      color: colors.background,
                      clipPath: getClipPath("xs"),
                    }}
                  >
                    ✕
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="investment"
                      className="font-data font-bold uppercase text-xs block"
                      style={{ color: colors.background }}
                    >
                      Investment Amount ($)
                    </label>
                    <input
                      id="investment"
                      type="number"
                      value={customInvestment}
                      onChange={(e) =>
                        onCustomInvestmentChange(Number(e.target.value))
                      }
                      placeholder="5000"
                      className="w-full border-3 border-background px-4 py-3 font-data font-bold focus:border-pink focus:ring-0 focus:outline-none"
                      style={{
                        backgroundColor: colors.light,
                        color: colors.foreground,
                        clipPath: getClipPath("sm"),
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="fdv"
                      className="font-data font-bold uppercase text-xs block"
                      style={{ color: colors.background }}
                    >
                      Fully Diluted Valuation ($)
                    </label>
                    <input
                      id="fdv"
                      type="number"
                      value={customFdv}
                      onChange={(e) =>
                        onCustomFdvChange(Number(e.target.value))
                      }
                      placeholder="300000000"
                      className="w-full border-3 border-background px-4 py-3 font-data font-bold focus:border-pink focus:ring-0 focus:outline-none"
                      style={{
                        backgroundColor: colors.light,
                        color: colors.foreground,
                        clipPath: getClipPath("sm"),
                      }}
                    />
                    <p
                      className="text-xs font-data font-bold"
                      style={{ color: colors.background }}
                    >
                      {formatCurrency(customFdv)}
                    </p>
                  </div>
                </div>
              </BorderedBox>
            ) : (
              <button
                onClick={() => onRoundToggle("custom")}
                className="w-full h-16 border-3 border-dashed border-background hover:border-foreground hover:bg-foreground/5 flex items-center justify-center transition-colors group"
                style={{
                  clipPath: getClipPath("lg"),
                }}
              >
                <div
                  className="text-4xl font-black transition-colors"
                  style={{ color: colors.background }}
                >
                  +
                </div>
              </button>
            )}
          </div>
    </BorderedBox>
  );
}
