import Image from "next/image";
import { useEffect, useRef } from "react";
import { colors } from "@/lib/colors";

interface Token {
  id: string;
  name: string;
  symbol: string;
  image: string;
  fully_diluted_valuation: number;
}

interface TokenScrollPickerProps {
  tokens: Token[];
  selectedIndex: number;
  onTokenSelect: (index: number) => void;
  formatCurrency: (value: number) => string;
}

export default function TokenScrollPicker({
  tokens,
  selectedIndex,
  onTokenSelect,
  formatCurrency,
}: TokenScrollPickerProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to middle on mount
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;
      const middleScroll = (scrollHeight - clientHeight) / 2;
      container.scrollTop = middleScroll;
    }
  }, [tokens.length]);

  return (
    <div
      style={{
        clipPath:
          "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
      }}
    >
      <div style={{ backgroundColor: colors.foreground, padding: "2px" }}>
        <div
          className="p-6"
          style={{
            backgroundColor: colors.foreground,
            clipPath:
              "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)",
          }}
        >
          <h2
            className="text-lg font-black uppercase mb-2"
            style={{ color: colors.background }}
          >
            Select Valuation
          </h2>
          <p
            className="text-sm font-bold uppercase mb-6"
            style={{ color: colors.background }}
          >
            Click a token to compare
          </p>

          <div
            ref={scrollContainerRef}
            className="max-h-[480px] overflow-y-auto pr-2"
          >
            <div className="grid grid-cols-4 gap-3">
              {tokens.map((token, index) => (
                <button
                  key={token.id}
                  onClick={() => onTokenSelect(index)}
                  className={`flex flex-col items-center p-3 transition-all border-3 ${
                    index === selectedIndex
                      ? "border-foreground hover:bg-pink"
                      : "border-background hover:bg-pink hover:border-foreground"
                  }`}
                  style={{
                    backgroundColor: index === selectedIndex ? colors.pink : colors.light,
                    clipPath:
                      "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
                    color: colors.foreground,
                  }}
                >
                  <div className="relative w-12 h-12 mb-2">
                    <Image
                      src={token.image}
                      alt={token.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                  </div>
                  <div className="text-xs font-black text-center mb-1 uppercase tracking-tight">
                    {token.symbol.toUpperCase()}
                  </div>
                  <div className="text-xs font-data font-bold text-center">
                    {formatCurrency(token.fully_diluted_valuation)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

