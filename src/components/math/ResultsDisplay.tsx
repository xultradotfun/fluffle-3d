import Image from "next/image";

interface Token {
  name: string;
  image: string;
  fully_diluted_valuation: number;
}

interface ResultsDisplayProps {
  token: Token;
  roundName: string;
  investment: number;
  positionValue: number;
  multiplier: number;
  formatCurrency: (value: number) => string;
  lamboMode: boolean;
  onLamboModeToggle: () => void;
}

export default function ResultsDisplay({
  token,
  roundName,
  investment,
  positionValue,
  multiplier,
  formatCurrency,
  lamboMode,
  onLamboModeToggle,
}: ResultsDisplayProps) {
  const LAMBO_PRICE = 300_000; // Average Lamborghini price

  const getMultiplierColor = (mult: number) => {
    if (mult >= 100) return "#058d5e"; // green
    if (mult >= 50) return "#f380cd"; // pink
    if (mult >= 20) return "#f380cd"; // pink
    return "#dfd9d9"; // default light
  };

  const formatValue = (value: number) => {
    if (lamboMode) {
      const lambos = value / LAMBO_PRICE;
      return `${lambos.toFixed(2)} LAMBOS`;
    }
    return formatCurrency(value);
  };

  return (
    <div
      style={{
        clipPath:
          "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
      }}
    >
      <div style={{ backgroundColor: "#19191a", padding: "2px" }}>
        <div
          className="p-6"
          style={{
            backgroundColor: "#19191a",
            clipPath:
              "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
          }}
        >
          <div className="flex items-center gap-4 mb-6">
            <Image
              src={token.image}
              alt={token.name}
              width={64}
              height={64}
              className="rounded-full"
            />
            <div>
              <h2
                className="text-2xl font-black uppercase tracking-tight"
                style={{ color: "#dfd9d9" }}
              >
                {roundName}: $MEGA at {token.name} FDV
              </h2>
              <p
                className="text-base font-data font-bold"
                style={{ color: "#dfd9d9" }}
              >
                {formatCurrency(token.fully_diluted_valuation)}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Your Investment */}
            <div
              className="text-center p-6 border-3 border-background"
              style={{
                backgroundColor: "#e0e0e0",
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div className="text-xs font-data font-bold mb-2 uppercase tracking-wider text-foreground">
                Your Investment
              </div>
              <div className="text-3xl font-black font-data text-foreground">
                ${investment.toLocaleString()}
              </div>
            </div>

            {/* Position Value */}
            <div
              className="text-center p-6 border-3 border-foreground relative"
              style={{
                backgroundColor: "#f380cd",
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="text-xs font-data font-bold uppercase tracking-wider text-foreground">
                  Position Value
                </div>
                <button
                  onClick={onLamboModeToggle}
                  className={`h-6 px-2 text-xs font-data font-bold border-3 transition-colors ${
                    lamboMode
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-foreground hover:bg-foreground hover:text-background"
                  }`}
                  style={{
                    clipPath:
                      "polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)",
                  }}
                >
                  🏎️
                </button>
              </div>
              <div className="text-3xl font-black font-data text-foreground">
                {formatValue(positionValue)}
              </div>
              {lamboMode && (
                <div className="text-xs font-data mt-1 text-foreground">
                  @ ${LAMBO_PRICE.toLocaleString()} each
                </div>
              )}
            </div>

            {/* Return Multiple */}
            <div
              className="text-center p-6 border-3 border-background"
              style={{
                backgroundColor: "#e0e0e0",
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div className="text-xs font-data font-bold mb-2 uppercase tracking-wider text-foreground">
                Return Multiple
              </div>
              <div
                className="text-3xl font-black font-data"
                style={{ color: getMultiplierColor(multiplier) }}
              >
                {multiplier.toFixed(1)}x
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

