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
          className="p-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(224, 224, 224, 0.5) 0%, rgba(224, 224, 224, 0.45) 100%)",
            clipPath:
              "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
          }}
        >
          {/* Background icon layer - behind content */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url(${token.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(8px) saturate(1.3) brightness(0.7)",
              opacity: 0.7,
            }}
          />
          {/* Heavy grain/noise overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4.8' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              opacity: 0.35,
              mixBlendMode: "overlay",
            }}
          />
          
          {/* Content wrapper */}
          <div className="relative z-10">
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
                style={{ color: "#fff" }}
              >
                {roundName}: $MEGA at {token.name} FDV
              </h2>
              <p
                className="text-base font-data font-bold"
                style={{ color: "#fff" }}
              >
                {formatCurrency(token.fully_diluted_valuation)}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Your Investment */}
            <div
              style={{
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div style={{ backgroundColor: "#fff", padding: "2px", height: "100%" }}>
                <div
                  className="text-center p-6 flex flex-col justify-center"
                  style={{
                    backgroundColor: "#19191a",
                    clipPath:
                      "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                    minHeight: "140px",
                  }}
                >
                  <div className="text-xs font-data font-bold mb-2 uppercase tracking-wider" style={{ color: "#dfd9d9" }}>
                    Your Investment
                  </div>
                  <div className="text-3xl font-black font-data" style={{ color: "#dfd9d9" }}>
                    ${investment.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            {/* Position Value */}
            <div
              style={{
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div style={{ backgroundColor: "#058d5e", padding: "2px", height: "100%" }}>
                <div
                  className="text-center p-6 relative flex flex-col justify-center"
                  style={{
                    backgroundColor: "#19191a",
                    clipPath:
                      "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                    minHeight: "140px",
                  }}
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-xs font-data font-bold uppercase tracking-wider" style={{ color: "#dfd9d9" }}>
                      Position Value
                    </div>
                    <button
                      onClick={onLamboModeToggle}
                      className={`h-6 px-2 text-xs font-data font-bold border-3 transition-colors ${
                        lamboMode
                          ? "bg-background text-foreground border-background"
                          : "bg-transparent text-background border-background hover:bg-background hover:text-foreground"
                      }`}
                      style={{
                        clipPath:
                          "polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)",
                      }}
                    >
                      🏎️
                    </button>
                  </div>
                  <div className="text-3xl font-black font-data" style={{ color: "#058d5e" }}>
                    {formatValue(positionValue)}
                  </div>
                </div>
              </div>
            </div>

            {/* Return Multiple */}
            <div
              style={{
                clipPath:
                  "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <div style={{ backgroundColor: "#fff", padding: "2px", height: "100%" }}>
                <div
                  className="text-center p-6 flex flex-col justify-center"
                  style={{
                    backgroundColor: "#19191a",
                    clipPath:
                      "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                    minHeight: "140px",
                  }}
                >
                  <div className="text-xs font-data font-bold mb-2 uppercase tracking-wider" style={{ color: "#dfd9d9" }}>
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
          {/* End content wrapper */}
        </div>
      </div>
    </div>
  );
}

