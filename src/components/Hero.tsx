"use client";
import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const [logoNumber, setLogoNumber] = useState("01");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const preloadedImages = useRef<HTMLImageElement[]>([]);
  const lastScrollY = useRef(0);

  useEffect(() => {
    // Preload logos
    const numbers = Array.from({ length: 8 }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );

    numbers.forEach((num) => {
      const img = new Image();
      img.src = `/icons/logo-${num}.png`;
      preloadedImages.current.push(img);
    });

    // Set initial random logo
    const randomNum = Math.floor(Math.random() * 8 + 1)
      .toString()
      .padStart(2, "0");
    setLogoNumber(randomNum);

    // Logo rotation
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        const nextNum = ((parseInt(logoNumber) % 8) + 1)
          .toString()
          .padStart(2, "0");
        setLogoNumber(nextNum);
        setIsTransitioning(false);
      }, 50);
    }, 2000);

    // Scroll handling
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const shouldBeScrolled = currentScrollY > 50;

      if (shouldBeScrolled !== isScrolled) {
        setIsScrolled(shouldBeScrolled);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [logoNumber, isScrolled]);

  return (
    <>
      {/* Placeholder */}
      <div className="w-full h-[80px]" />

      <nav
        className="fixed top-0 left-0 right-0 z-10 border-b-4 border-foreground"
        style={{ backgroundColor: "#19191a" }}
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
                style={{ color: "#dfd9d9" }}
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
                  clipPath:
                    "polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)",
                  color: "#19191a",
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
