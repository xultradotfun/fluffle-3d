import { colors } from "@/lib/colors";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Flower2,
  Rabbit,
  ChevronDown,
  Image,
  X,
  Calculator,
  Wallet,
  DollarSign,
} from "lucide-react";

interface ViewSwitcherProps {
  activeView: "pfp" | "ecosystem" | "builder" | "math" | "allocation" | "usdm";
  onViewChange?: (
    view: "pfp" | "ecosystem" | "builder" | "math" | "allocation" | "usdm"
  ) => void;
}

const VIEW_ROUTES = {
  pfp: "/pfp",
  ecosystem: "/",
  builder: "/builder",
  math: "/math",
  allocation: "/allocation",
  usdm: "/usdm",
} as const;

export function ViewSwitcher({ activeView, onViewChange }: ViewSwitcherProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileMenuOpenMath, setIsMobileMenuOpenMath] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMathDropdownOpen, setIsMathDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const [mathDropdownPosition, setMathDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mathButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mathCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleViewChange = useCallback(
    (view: "pfp" | "ecosystem" | "builder" | "math" | "allocation" | "usdm") => {
      if (onViewChange) {
        onViewChange(view);
      } else {
        router.push(VIEW_ROUTES[view]);
      }
    },
    [onViewChange, router]
  );

  useEffect(() => {
    if (isDropdownOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    if (isMathDropdownOpen && mathButtonRef.current) {
      const rect = mathButtonRef.current.getBoundingClientRect();
      setMathDropdownPosition({
        top: rect.top - 8,
        left: rect.left + rect.width / 2,
      });
    }
  }, [isMathDropdownOpen]);

  const handleMouseEnter = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsDropdownOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsDropdownOpen(false);
    }, 100);
  }, []);

  const handleMathMouseEnter = useCallback(() => {
    if (mathCloseTimeoutRef.current) {
      clearTimeout(mathCloseTimeoutRef.current);
      mathCloseTimeoutRef.current = null;
    }
    setIsMathDropdownOpen(true);
  }, []);

  const handleMathMouseLeave = useCallback(() => {
    mathCloseTimeoutRef.current = setTimeout(() => {
      setIsMathDropdownOpen(false);
    }, 100);
  }, []);

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
          <div style={{ backgroundColor: colors.foreground, padding: "2px" }}>
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
                  onClick={() => handleViewChange("ecosystem")}
                  className={`flex items-center gap-2 px-4 py-2 border-3 font-bold uppercase text-xs ${
                    activeView === "ecosystem"
                      ? "bg-pink border-foreground"
                      : "bg-transparent border-background hover:bg-muted"
                  }`}
                  style={{
                    clipPath:
                      "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                    color: activeView === "ecosystem" ? colors.foreground : colors.background,
                  }}
                >
                  <Flower2 className="w-4 h-4" strokeWidth={3} />
                  <span>ECOSYSTEM</span>
                </button>

                {/* Math Dropdown */}
                <div className="relative z-[100]">
                  <button
                    ref={mathButtonRef}
                    onMouseEnter={handleMathMouseEnter}
                    onMouseLeave={handleMathMouseLeave}
                    className={`flex items-center gap-2 px-4 py-2 border-3 font-bold uppercase text-xs ${
                      ["math", "allocation", "usdm"].includes(activeView)
                        ? "bg-pink border-foreground"
                        : "bg-transparent border-background hover:bg-muted"
                    }`}
                    style={{
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      color: ["math", "allocation", "usdm"].includes(activeView)
                        ? colors.foreground
                        : colors.background,
                    }}
                  >
                    <Calculator className="w-4 h-4" strokeWidth={3} />
                    <span>MATH</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        isMathDropdownOpen ? "rotate-180" : ""
                      }`}
                      strokeWidth={3}
                    />
                  </button>
                </div>

                {/* Divider */}
                <div className="w-px h-10 bg-foreground" />

                {/* Tools Dropdown */}
                <div className="relative z-[100]">
                  <button
                    ref={buttonRef}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className={`flex items-center gap-2 px-4 py-2 border-3 font-bold uppercase text-xs ${
                      ["pfp", "builder"].includes(activeView)
                        ? "bg-pink border-foreground"
                        : "bg-transparent border-background hover:bg-muted"
                    }`}
                    style={{
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      color: ["pfp", "builder"].includes(activeView)
                        ? colors.foreground
                        : colors.background,
                    }}
                  >
                    <Rabbit className="w-4 h-4" strokeWidth={3} />
                    <span>TOOLS</span>
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

      {/* Math Dropdown Menu */}
      {isMathDropdownOpen && (
        <div
          onMouseEnter={handleMathMouseEnter}
          onMouseLeave={handleMathMouseLeave}
          className="fixed w-64"
          style={{
            top: mathDropdownPosition.top,
            left: mathDropdownPosition.left,
            transform: "translate(-50%, -100%)",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              clipPath:
                "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
            }}
          >
            <div style={{ backgroundColor: colors.background, padding: "2px" }}>
              <div
                style={{
                  backgroundColor: colors.foreground,
                  clipPath:
                    "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                  padding: "8px",
                }}
              >
                <div className="space-y-2">
                  <button
                    onClick={() => handleViewChange("math")}
                    className={`flex items-center w-full gap-2 px-4 py-3 border-3 font-bold uppercase text-xs ${
                      activeView === "math"
                        ? "bg-pink border-foreground"
                        : "bg-transparent border-background hover:bg-muted"
                    }`}
                    style={{
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      color: activeView === "math" ? colors.foreground : colors.background,
                    }}
                  >
                    <Calculator className="w-4 h-4" strokeWidth={3} />
                    <span className="flex-1 text-left">MOONMATH</span>
                    {activeView === "math" && (
                      <div className="w-2 h-2 bg-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => handleViewChange("allocation")}
                    className={`flex items-center w-full gap-2 px-4 py-3 border-3 font-bold uppercase text-xs ${
                      activeView === "allocation"
                        ? "bg-pink border-foreground"
                        : "bg-transparent border-background hover:bg-muted"
                    }`}
                    style={{
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      color: activeView === "allocation" ? colors.foreground : colors.background,
                    }}
                  >
                    <Wallet className="w-4 h-4" strokeWidth={3} />
                    <span className="flex-1 text-left">ALLOCATION</span>
                    {activeView === "allocation" && (
                      <div className="w-2 h-2 bg-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => handleViewChange("usdm")}
                    className={`flex items-center w-full gap-2 px-4 py-3 border-3 font-bold uppercase text-xs ${
                      activeView === "usdm"
                        ? "bg-pink border-foreground"
                        : "bg-transparent border-background hover:bg-muted"
                    }`}
                    style={{
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      color: activeView === "usdm" ? colors.foreground : colors.background,
                    }}
                  >
                    <DollarSign className="w-4 h-4" strokeWidth={3} />
                    <span className="flex-1 text-left">USDM REVENUE</span>
                    {activeView === "usdm" && (
                      <div className="w-2 h-2 bg-foreground" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tools Dropdown Menu */}
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
            <div style={{ backgroundColor: colors.background, padding: "2px" }}>
              {/* Inner content layer - dark with same clip-path */}
              <div
                style={{
                  backgroundColor: colors.foreground,
                  clipPath:
                    "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
                  padding: "8px",
                }}
              >
                <div className="space-y-2">
                  <button
                    onClick={() => handleViewChange("builder")}
                    className={`flex items-center w-full gap-2 px-4 py-3 border-3 font-bold uppercase text-xs ${
                      activeView === "builder"
                        ? "bg-pink border-foreground"
                        : "bg-transparent border-background hover:bg-muted"
                    }`}
                    style={{
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      color: activeView === "builder" ? colors.foreground : colors.background,
                    }}
                  >
                    <Rabbit className="w-4 h-4" strokeWidth={3} />
                    <span className="flex-1 text-left">FLUFFLE BUILDER</span>
                    {activeView === "builder" && (
                      <div className="w-2 h-2 bg-foreground" />
                    )}
                  </button>
                  <button
                    onClick={() => handleViewChange("pfp")}
                    className={`flex items-center w-full gap-2 px-4 py-3 border-3 font-bold uppercase text-xs ${
                      activeView === "pfp"
                        ? "bg-pink border-foreground"
                        : "bg-transparent border-background hover:bg-muted"
                    }`}
                    style={{
                      clipPath:
                        "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                      color: activeView === "pfp" ? colors.foreground : colors.background,
                    }}
                  >
                    <Image className="w-4 h-4" strokeWidth={3} />
                    <span className="flex-1 text-left">PFP GENERATOR</span>
                    {activeView === "pfp" && (
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
        style={{ backgroundColor: colors.foreground }}
      >
        <div className="flex items-center justify-around px-2 py-3">
          {/* Ecosystem */}
          <button
            onClick={() => handleViewChange("ecosystem")}
            className={`flex flex-col items-center gap-1 p-2 ${
              activeView === "ecosystem" ? "opacity-100" : "opacity-60"
            }`}
            style={{ color: colors.background }}
          >
            <Flower2 className="w-6 h-6" strokeWidth={3} />
            <span className="text-[10px] font-black uppercase">ECO</span>
          </button>

          {/* Math Dropdown Button */}
          <button
            onClick={() => setIsMobileMenuOpenMath(true)}
            className={`flex flex-col items-center gap-1 p-2 ${
              ["math", "allocation", "usdm"].includes(activeView)
                ? "opacity-100"
                : "opacity-60"
            }`}
            style={{ color: colors.background }}
          >
            <div className="relative">
              <Calculator className="w-6 h-6" strokeWidth={3} />
              <ChevronDown
                className="w-3 h-3 absolute -bottom-1 -right-1"
                strokeWidth={3}
                style={{ backgroundColor: colors.foreground }}
              />
            </div>
            <span className="text-[10px] font-black uppercase">MATH</span>
          </button>

          {/* Tools Dropdown Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className={`flex flex-col items-center gap-1 p-2 ${
              ["pfp", "builder"].includes(activeView)
                ? "opacity-100"
                : "opacity-60"
            }`}
            style={{ color: colors.background }}
          >
            <div className="relative">
              <Rabbit className="w-6 h-6" strokeWidth={3} />
              <ChevronDown
                className="w-3 h-3 absolute -bottom-1 -right-1"
                strokeWidth={3}
                style={{ backgroundColor: colors.foreground }}
              />
            </div>
            <span className="text-[10px] font-black uppercase">TOOLS</span>
          </button>
        </div>
      </div>

      {/* Math Mobile Menu */}
      {isMobileMenuOpenMath && (
        <div
          className="sm:hidden fixed inset-0 z-50"
          style={{ backgroundColor: "rgba(25, 25, 26, 0.95)" }}
        >
          <div
            className="absolute inset-x-0 bottom-0 border-t-4 border-foreground"
            style={{ backgroundColor: colors.foreground }}
          >
            <div
              className="flex items-center justify-between px-4 py-4 border-b-3 border-foreground"
              style={{ color: colors.background }}
            >
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5" strokeWidth={3} />
                <span className="text-sm font-black uppercase">MATH</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpenMath(false)}
                className="p-2 border-3 border-foreground hover:bg-muted"
                style={{ color: colors.background }}
              >
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>
            <div className="p-3 space-y-2">
              <button
                onClick={() => {
                  handleViewChange("math");
                  setIsMobileMenuOpenMath(false);
                }}
                className={`flex items-center w-full gap-3 px-4 py-4 border-3 border-foreground font-bold uppercase text-sm ${
                  activeView === "math"
                    ? "bg-pink"
                    : "bg-transparent hover:bg-muted"
                }`}
                style={{
                  color: activeView === "math" ? colors.foreground : colors.background,
                }}
              >
                <Calculator className="w-5 h-5" strokeWidth={3} />
                <span className="flex-1 text-left">MOONMATH</span>
                {activeView === "math" && (
                  <div className="w-2 h-2 bg-foreground" />
                )}
              </button>
              <button
                onClick={() => {
                  handleViewChange("allocation");
                  setIsMobileMenuOpenMath(false);
                }}
                className={`flex items-center w-full gap-3 px-4 py-4 border-3 border-foreground font-bold uppercase text-sm ${
                  activeView === "allocation"
                    ? "bg-pink"
                    : "bg-transparent hover:bg-muted"
                }`}
                style={{
                  color: activeView === "allocation" ? colors.foreground : colors.background,
                }}
              >
                <Wallet className="w-5 h-5" strokeWidth={3} />
                <span className="flex-1 text-left">ALLOCATION</span>
                {activeView === "allocation" && (
                  <div className="w-2 h-2 bg-foreground" />
                )}
              </button>
              <button
                onClick={() => {
                  handleViewChange("usdm");
                  setIsMobileMenuOpenMath(false);
                }}
                className={`flex items-center w-full gap-3 px-4 py-4 border-3 border-foreground font-bold uppercase text-sm ${
                  activeView === "usdm"
                    ? "bg-pink"
                    : "bg-transparent hover:bg-muted"
                }`}
                style={{
                  color: activeView === "usdm" ? colors.foreground : colors.background,
                }}
              >
                <DollarSign className="w-5 h-5" strokeWidth={3} />
                <span className="flex-1 text-left">USDM REVENUE</span>
                {activeView === "usdm" && (
                  <div className="w-2 h-2 bg-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tools Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="sm:hidden fixed inset-0 z-50"
          style={{ backgroundColor: "rgba(25, 25, 26, 0.95)" }}
        >
          <div
            className="absolute inset-x-0 bottom-0 border-t-4 border-foreground"
            style={{ backgroundColor: colors.foreground }}
          >
            <div
              className="flex items-center justify-between px-4 py-4 border-b-3 border-foreground"
              style={{ color: colors.background }}
            >
              <div className="flex items-center gap-2">
                <Rabbit className="w-5 h-5" strokeWidth={3} />
                <span className="text-sm font-black uppercase">
                  TOOLS
                </span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 border-3 border-foreground hover:bg-muted"
                style={{ color: colors.background }}
              >
                <X className="w-5 h-5" strokeWidth={3} />
              </button>
            </div>
            <div className="p-3 space-y-2">
              <button
                onClick={() => {
                  handleViewChange("builder");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full gap-3 px-4 py-4 border-3 border-foreground font-bold uppercase text-sm ${
                  activeView === "builder"
                    ? "bg-pink"
                    : "bg-transparent hover:bg-muted"
                }`}
                style={{
                  color: activeView === "builder" ? colors.foreground : colors.background,
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
                  handleViewChange("pfp");
                  setIsMobileMenuOpen(false);
                }}
                className={`flex items-center w-full gap-3 px-4 py-4 border-3 border-foreground font-bold uppercase text-sm ${
                  activeView === "pfp"
                    ? "bg-pink"
                    : "bg-transparent hover:bg-muted"
                }`}
                style={{ color: activeView === "pfp" ? colors.foreground : colors.background }}
              >
                <Image className="w-5 h-5" strokeWidth={3} />
                <span className="flex-1 text-left">PFP GENERATOR</span>
                {activeView === "pfp" && (
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
