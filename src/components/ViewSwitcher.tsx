import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Flower2,
  Rabbit,
  ChevronDown,
  Image,
  X,
  Grid,
  Calculator,
} from "lucide-react";

interface ViewSwitcherProps {
  activeView: "pfp" | "ecosystem" | "builder" | "bingo" | "math";
  onViewChange: (
    view: "pfp" | "ecosystem" | "builder" | "bingo" | "math"
  ) => void;
}

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isDropdownOpen]);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 100);
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden sm:block fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        {/* Outer wrapper with clip-path */}
        <div
          className="shadow-brutal"
          style={{
            clipPath:
              "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
          }}
        >
          {/* Middle border layer - black with padding */}
          <div style={{ backgroundColor: "#19191a", padding: "2px" }}>
            {/* Inner content layer - dark with same clip-path */}
            <div
              className="bg-card-foreground"
              style={{
                clipPath:
                  "polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)",
              }}
            >
              <div className="flex items-center gap-2 p-2">
                {/* Ecosystem */}
                <button
                  onClick={() => onViewChange("ecosystem")}
                  className={`flex items-center gap-2 px-4 py-2 border-3 font-bold uppercase text-xs ${
                    activeView === "ecosystem"
                      ? "bg-pink border-foreground"
                      : "bg-transparent border-background hover:bg-muted"
                  }`}
                  style={{
                    clipPath:
                      "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                    color: activeView === "ecosystem" ? "#19191a" : "#dfd9d9",
                  }}
                >
                  <Flower2 className="w-4 h-4" strokeWidth={3} />
                  <span>ECOSYSTEM</span>
                </button>

                {/* Math */}
                <button
                  onClick={() => onViewChange("math")}
                  className={`flex items-center gap-2 px-4 py-2 border-3 font-bold uppercase text-xs ${
                    activeView === "math"
                      ? "bg-pink border-foreground"
                      : "bg-transparent border-background hover:bg-muted"
                  }`}
                  style={{
                    clipPath:
                      "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                    color: activeView === "math" ? "#19191a" : "#dfd9d9",
                  }}
                >
                  <div className="relative">
                    <Calculator className="w-4 h-4" strokeWidth={3} />
                    <span
                      className="absolute -top-1 -right-1 px-0.5 text-[7px] font-black border-2 leading-none text-foreground border-foreground"
                      style={{
                        backgroundColor:
                          activeView === "math" ? "#fff" : "#f380cd",
                      }}
                    >
                      NEW
                    </span>
                  </div>
                  <span>MOONMATH</span>
                </button>

                {/* Divider */}
                <div className="w-px h-10 bg-foreground" />

                {/* Fluffles Dropdown */}
                <div className="relative z-[100]">
                  <button
                    ref={buttonRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={`flex items-center gap-2 px-4 py-2 border-3 font-bold uppercase text-xs ${
                      ["pfp", "builder", "bingo"].includes(activeView)
                        ? "bg-pink border-foreground"
                        : "bg-transparent border-background hover:bg-muted"
                    }`}
                    style={{
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      color: ["pfp", "builder", "bingo"].includes(activeView)
                        ? "#19191a"
                        : "#dfd9d9",
                    }}
                  >
                    <Rabbit className="w-4 h-4" strokeWidth={3} />
                    <span>FLUFFLE TOOLS</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                      strokeWidth={3}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Menu - rendered outside clipped container */}
      {isDropdownOpen && (
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="fixed w-64"
          style={{
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            transform: "translate(-50%, -100%)",
            zIndex: 9999,
          }}
        >
          {/* Outer wrapper with clip-path */}
          <div
            style={{
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
            }}
          >
            {/* Middle border layer - light with padding */}
            <div style={{ backgroundColor: "#dfd9d9", padding: "2px" }}>
              {/* Inner content layer - dark with same clip-path */}
              <div
                style={{
                  backgroundColor: "#19191a",
                  clipPath:
                    "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                  padding: "8px",
                }}
              >
                <div className="space-y-2">
                  <button
                    onClick={() => onViewChange("builder")}
                    className={`flex items-center w-full gap-2 px-4 py-3 border-3 font-bold uppercase text-xs ${
                      activeView === "builder"
                        ? "bg-pink border-foreground"
                        : "bg-transparent border-background hover:bg-muted"
                    }`}
                    style={{
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      color: activeView === "builder" ? "#19191a" : "#dfd9d9",
                    }}
                  >
                    <Rabbit className="w-4 h-4" strokeWidth={3} />
                    <span className="flex-1 text-left">FLUFFLE BUILDER</span>
                    {activeView === "builder" && (
                      <div className="w-2 h-2 bg-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => onViewChange("pfp")}
                    className={`flex items-center w-full gap-2 px-4 py-3 border-3 font-bold uppercase text-xs ${
                      activeView === "pfp"
                        ? "bg-pink border-foreground"
                        : "bg-transparent border-background hover:bg-muted"
                    }`}
                    style={{
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      color: activeView === "pfp" ? "#19191a" : "#dfd9d9",
                    }}
                  >
                    <Image className="w-4 h-4" strokeWidth={3} />
                    <span className="flex-1 text-left">PFP GENERATOR</span>
                    {activeView === "pfp" && (
                      <div className="w-2 h-2 bg-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => onViewChange("bingo")}
                    className={`flex items-center w-full gap-2 px-4 py-3 border-3 font-bold uppercase text-xs ${
                      activeView === "bingo"
                        ? "bg-pink border-foreground"
                        : "bg-transparent border-background hover:bg-muted"
                    }`}
                    style={{
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      color: activeView === "bingo" ? "#19191a" : "#dfd9d9",
                    }}
                  >
                    <div className="relative">
                      <Grid className="w-4 h-4" strokeWidth={3} />
                      <span
                        className="absolute -top-1 -right-1 px-0.5 text-[7px] font-black border-2 leading-none text-foreground border-foreground"
                        style={{
                          backgroundColor:
                            activeView === "bingo" ? "#fff" : "#f380cd",
                        }}
                      >
                        NEW
                      </span>
                    </div>
                    <span className="flex-1 text-left">BINGO</span>
                    {activeView === "bingo" && (
                      <div className="w-2 h-2 bg-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 border-t-4 border-foreground pb-safe"
        style={{ backgroundColor: "#19191a" }}
      >
        <div className="flex items-center justify-around px-2 py-3">
          {/* Ecosystem */}
          <button
            onClick={() => onViewChange("ecosystem")}
            className={`flex flex-col items-center gap-1 p-2 ${
              activeView === "ecosystem" ? "opacity-100" : "opacity-60"
            }`}
            style={{ color: "#dfd9d9" }}
          >
            <Flower2 className="w-6 h-6" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase">ECO</span>
          </button>

          {/* Math */}
          <button
            onClick={() => onViewChange("math")}
            className={`flex flex-col items-center gap-1 p-2 ${
              activeView === "math" ? "opacity-100" : "opacity-60"
            }`}
            style={{ color: "#dfd9d9" }}
          >
            <div className="relative">
              <Calculator className="w-6 h-6" strokeWidth={3} />
              <span
                className="absolute -top-1 -right-1 px-0.5 text-[7px] font-black border leading-none text-foreground border-foreground"
                style={{
                  backgroundColor: activeView === "math" ? "#fff" : "#f380cd",
                }}
              >
                NEW
              </span>
            </div>
            <span className="text-[10px] font-black uppercase">MATH</span>
          </button>

          {/* Fluffles Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center gap-1 p-2 ${
              ["pfp", "builder", "bingo"].includes(activeView)
                ? "opacity-100"
                : "opacity-60"
            }`}
            style={{ color: "#dfd9d9" }}
          >
            <div className="relative">
              <Rabbit className="w-6 h-6" strokeWidth={3} />
              <ChevronDown
                className="w-3 h-3 absolute -bottom-1 -right-1"
                strokeWidth={3}
                style={{ backgroundColor: "#19191a" }}
              />
            </div>
            <span className="text-[10px] font-black uppercase">TOOLS</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50"
          style={{ backgroundColor: "rgba(25, 25, 26, 0.95)" }}
        >
          <div
            className="absolute inset-x-0 bottom-0 border-t-4 border-foreground"
            style={{ backgroundColor: "#19191a" }}
          >
            <div
              className="flex items-center justify-between px-4 py-4 border-b-3 border-foreground"
              style={{ color: "#dfd9d9" }}
            >
              <div className="flex items-center gap-2">
                <Rabbit className="w-5 h-5" strokeWidth={3} />
                <span className="text-sm font-black uppercase">
                  FLUFFLE TOOLS
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 border-3 border-foreground hover:bg-muted"
                style={{ color: "#dfd9d9" }}
              >
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>
            <div className="p-3 space-y-2">
              <button
                onClick={() => {
                  onViewChange("builder");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full gap-3 px-4 py-4 border-3 border-foreground font-bold uppercase text-sm ${
                  activeView === "builder"
                    ? "bg-pink"
                    : "bg-transparent hover:bg-muted"
                }`}
                style={{
                  color: activeView === "builder" ? "#19191a" : "#dfd9d9",
                }}
              >
                <Rabbit className="w-5 h-5" strokeWidth={3} />
                <span className="flex-1 text-left">FLUFFLE BUILDER</span>
                {activeView === "builder" && (
                  <div className="w-2 h-2 bg-foreground" />
                )}
              </button>
              <button
                onClick={() => {
                  onViewChange("pfp");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full gap-3 px-4 py-4 border-3 border-foreground font-bold uppercase text-sm ${
                  activeView === "pfp"
                    ? "bg-pink"
                    : "bg-transparent hover:bg-muted"
                }`}
                style={{ color: activeView === "pfp" ? "#19191a" : "#dfd9d9" }}
              >
                <Image className="w-5 h-5" strokeWidth={3} />
                <span className="flex-1 text-left">PFP GENERATOR</span>
                {activeView === "pfp" && (
                  <div className="w-2 h-2 bg-foreground" />
                )}
              </button>
              <button
                onClick={() => {
                  onViewChange("bingo");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full gap-3 px-4 py-4 border-3 border-foreground font-bold uppercase text-sm ${
                  activeView === "bingo"
                    ? "bg-pink"
                    : "bg-transparent hover:bg-muted"
                }`}
                style={{
                  color: activeView === "bingo" ? "#19191a" : "#dfd9d9",
                }}
              >
                <div className="relative">
                  <Grid className="w-5 h-5" strokeWidth={3} />
                  <span
                    className="absolute -top-1 -right-1 px-0.5 text-[7px] font-black border leading-none text-foreground border-foreground"
                    style={{
                      backgroundColor:
                        activeView === "bingo" ? "#fff" : "#f380cd",
                    }}
                  >
                    NEW
                  </span>
                </div>
                <span className="flex-1 text-left">BINGO</span>
                {activeView === "bingo" && (
                  <div className="w-2 h-2 bg-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
