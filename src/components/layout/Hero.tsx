import { colors } from "@/lib/colors";
import { getClipPath } from "@/lib/sizes";

export default function Hero() {
  return (
    <>
      {/* Placeholder */}
      <div className="w-full h-[80px]" />

      <nav
        className="fixed top-0 left-0 right-0 z-10 border-b-4 border-foreground"
        style={{ backgroundColor: colors.foreground }}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-center justify-between py-3">
            {/* Logo and Description */}
            <div className="flex items-center gap-4 sm:gap-6">
              <a href="/" className="hover:opacity-70 flex-shrink-0">
                <img
                  src="/fluffletools.png"
                  alt="FluffleTools"
                  className="h-12 sm:h-14 object-contain"
                  style={{ width: "auto" }}
                />
              </a>
              <p
                className="hidden lg:block text-sm font-bold uppercase max-w-md"
                style={{ color: colors.background }}
              >
                UTILITIES FOR{" "}
                <span className="bg-pink px-1" style={{ color: "#fff" }}>
                  MEGAETH
                  </span>{" "}
                EXPLORERS AND{" "}
                <span className="bg-pink px-1" style={{ color: "#fff" }}>
                  FLUFFLE
                  </span>{" "}
                HOLDERS
              </p>
                </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-3">
                  <a
                    href="https://x.com/intent/follow?screen_name=0x_ultra"
                    target="_blank"
                    rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm border-3 border-background bg-pink hover:bg-pink/80 font-bold uppercase"
                style={{
                  clipPath: getClipPath("sm"),
                  color: colors.foreground,
                }}
                  >
                    <svg
                  className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                <span className="hidden sm:inline">FOLLOW</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
