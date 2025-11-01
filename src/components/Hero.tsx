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
      <div className={`w-full ${isScrolled ? "h-[60px]" : "h-[180px] sm:h-[160px]"}`} />

      <section
        className={`fixed top-0 left-0 right-0 z-10 bg-background border-b-4 border-foreground ${
          isScrolled ? "" : ""
        }`}
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className={`flex items-center justify-between ${isScrolled ? "py-3" : "py-6"}`}>
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <div
                className={`${
                  isScrolled ? "w-10 h-10" : "w-14 h-14"
                } border-4 border-foreground bg-pink flex items-center justify-center`}
                style={{
                  clipPath: isScrolled 
                    ? 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                    : 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                }}
              >
                <div
                  className={`${
                    isTransitioning ? "scale-0" : "scale-100"
                  }`}
                >
                  <img
                    src={`/icons/logo-${logoNumber}.png`}
                    alt="Fluffle Logo"
                    className={`${
                      isScrolled ? "w-6 h-6" : "w-8 h-8"
                    } object-contain`}
                  />
                </div>
              </div>
              <a href="/" className="hover:opacity-70">
                <h1
                  className={`${
                    isScrolled ? "text-2xl" : "text-4xl sm:text-5xl"
                  } font-black uppercase tracking-tight`}
                >
                  FLUFFLE TOOLS
                </h1>
              </a>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              {!isScrolled && (
                <>
                  <div 
                    className="hidden sm:flex items-center gap-3 px-4 py-2 border-3 border-foreground bg-[#e0e0e0]"
                    style={{
                      clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black font-data">5,000</span>
                      <span className="text-xs font-bold uppercase">Rabbits</span>
                    </div>
                    <div className="w-px h-6 bg-foreground" />
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-black font-data">16</span>
                      <span className="text-xs font-bold uppercase">Tribes</span>
                    </div>
                  </div>
                </>
              )}

              <a
                href="https://opensea.io/collection/megaeth-nft-1"
                target="_blank"
                rel="noopener noreferrer"
                className={`hidden sm:flex items-center gap-2 ${
                  isScrolled ? "px-3 py-2 text-xs" : "px-4 py-2 text-sm"
                } border-3 border-foreground bg-green text-background hover:bg-secondary hover:shadow-brutal-sm font-bold uppercase`}
                style={{
                  clipPath: isScrolled
                    ? 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                    : 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                }}
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.629 0 12 0ZM5.92 12.403l.051-.081 3.123-4.884a.107.107 0 0 1 .187.014c.52 1.169.972 2.623.76 3.528-.088.372-.335.876-.614 1.342a2.405 2.405 0 0 1-.117.199.106.106 0 0 1-.09.045H6.013a.106.106 0 0 1-.091-.163zm13.914 1.68a.109.109 0 0 1-.065.101c-.243.103-1.07.485-1.414.962-.878 1.222-1.548 2.97-3.048 2.97H9.053a4.019 4.019 0 0 1-4.013-4.028v-.072c0-.058.048-.106.108-.106h3.485c.07 0 .12.063.115.132-.026.226.017.459.125.67.206.42.636.682 1.099.682h1.726v-1.347H9.99a.11.11 0 0 1-.089-.173l.063-.09c.16-.231.391-.586.621-.992.156-.274.308-.566.43-.86.024-.052.043-.107.065-.16.033-.094.067-.182.091-.269a4.57 4.57 0 0 0 .065-.223c.057-.25.081-.514.081-.787 0-.108-.004-.221-.014-.327-.005-.117-.02-.235-.034-.352a3.415 3.415 0 0 0-.048-.312 6.494 6.494 0 0 0-.098-.468l-.014-.06c-.03-.108-.056-.21-.09-.317a11.824 11.824 0 0 0-.328-.972 5.212 5.212 0 0 0-.142-.355c-.072-.178-.146-.339-.213-.49a3.564 3.564 0 0 1-.094-.197 4.658 4.658 0 0 0-.103-.213c-.024-.053-.053-.104-.072-.152l-.211-.388c-.029-.053.019-.118.077-.101l1.32.357h.01l.173.05.192.054.07.019v-.783c0-.379.302-.686.679-.686a.66.66 0 0 1 .477.202.69.69 0 0 1 .2.484V6.65l.141.039c.01.005.022.01.031.017.034.024.084.062.147.147.05.038.103.086.165.137a10.351 10.351 0 0 1 .574.504c.214.199.454.432.684.691.065.074.127.146.192.226.062.079.132.156.19.232.079.104.16.212.235.324.033.053.074.108.105.161.096.142.178.288.257.435.034.067.067.141.096.213.089.197.159.396.202.598a.65.65 0 0 1 .029.132v.01c.014.057.019.12.024.184a2.057 2.057 0 0 1-.106.874c-.031.084-.06.17-.098.254-.075.17-.161.343-.264.502-.034.06-.075.122-.113.182-.043.063-.089.123-.127.18a3.89 3.89 0 0 1-.173.221c-.053.072-.106.144-.166.209-.081.098-.16.19-.245.278-.048.058-.1.118-.156.17-.052.06-.108.113-.156.161-.084.084-.15.147-.208.202l-.137.122a.102.102 0 0 1-.072.03h-1.051v1.346h1.322c.295 0 .576-.104.804-.298.077-.067.415-.36.816-.802a.094.094 0 0 1 .05-.03l3.65-1.057a.108.108 0 0 1 .138.103z" />
                </svg>
                <span>COLLECTION</span>
              </a>

              <a
                href="https://x.com/intent/follow?screen_name=0x_ultra"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 ${
                  isScrolled ? "px-2 sm:px-3 py-2 text-xs" : "px-3 sm:px-4 py-2 text-sm"
                } border-3 border-foreground bg-foreground text-background hover:bg-pink hover:text-foreground font-bold uppercase`}
                style={{
                  clipPath: isScrolled
                    ? 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'
                    : 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'
                }}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="hidden sm:inline">FOLLOW</span>
                  </a>
                </div>
          </div>

          {/* Description - Only when not scrolled */}
          {!isScrolled && (
            <div className="pb-6 pt-2">
              <div className="border-t-3 border-foreground pt-4">
                <p className="text-base sm:text-lg font-bold uppercase max-w-3xl">
                  UTILITIES FOR{" "}
                  <span className="bg-pink text-foreground px-1">MEGAETH</span>{" "}
                  EXPLORERS AND{" "}
                  <span className="bg-pink text-foreground px-1">FLUFFLE</span>{" "}
                  HOLDERS
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
