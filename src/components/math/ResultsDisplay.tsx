import Image from "next/image";
import { colors } from "@/lib/colors";
import { getClipPath } from "@/lib/sizes";
import { BorderedBox } from "@/components/ui/BorderedBox";

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
    if (mult >= 100) return colors.green;
    if (mult >= 50) return colors.pink;
    if (mult >= 20) return colors.pink;
    return colors.background;
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
        clipPath: getClipPath("2xl"),
      }}
    >
      <div style={{ backgroundColor: colors.foreground, padding: "2px" }}>
        <div
          className="p-6 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(224, 224, 224, 0.5) 0%, rgba(224, 224, 224, 0.45) 100%)",
            clipPath: getClipPath("2xl"),
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
            <BorderedBox
              cornerSize="lg"
              borderColor="dark"
              bgColor="white"
              className="text-center p-4 flex flex-col justify-center"
              style={{ minHeight: "110px" }}
            >
              <div className="text-sm font-black mb-1 uppercase tracking-wider" style={{ color: colors.foreground }}>
                Your Investment
              </div>
              <div className="text-4xl font-black" style={{ color: colors.foreground }}>
                ${investment.toLocaleString()}
              </div>
            </BorderedBox>

            {/* Position Value */}
            <BorderedBox
              cornerSize="lg"
              borderColor="dark"
              bgColor="white"
              className="text-center p-4 relative flex flex-col justify-center"
              style={{ minHeight: "110px" }}
            >
              <div className="flex items-center justify-center gap-2 mb-1">
                <div className="text-sm font-black uppercase tracking-wider" style={{ color: colors.foreground }}>
                  Position Value
                </div>
                <button
                  onClick={onLamboModeToggle}
                  className={`h-6 px-2 text-xs font-black border-3 transition-colors ${
                    lamboMode
                      ? "bg-foreground text-background border-foreground"
                      : "bg-transparent text-foreground border-foreground hover:bg-foreground hover:text-background"
                  }`}
                  style={{
                    clipPath: getClipPath(3),
                  }}
                >
                  🏎️
                </button>
              </div>
              <div className="text-4xl font-black" style={{ color: colors.green }}>
                {formatValue(positionValue)}
              </div>
            </BorderedBox>

            {/* Return Multiple */}
            <BorderedBox
              cornerSize="lg"
              borderColor="dark"
              bgColor="white"
              className="text-center p-4 flex flex-col justify-center"
              style={{ minHeight: "110px" }}
            >
              <div className="text-sm font-black mb-1 uppercase tracking-wider" style={{ color: colors.foreground }}>
                Return Multiple
              </div>
              <div
                className="text-4xl font-black"
                style={{ color: getMultiplierColor(multiplier) }}
              >
                {multiplier.toFixed(1)}x
              </div>
            </BorderedBox>
          </div>
          </div>
          {/* End content wrapper */}
        </div>
      </div>
    </div>
  );
}

