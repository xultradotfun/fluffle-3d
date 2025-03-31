"use client";
import { useState, useEffect, useRef } from "react";
import { MobileThemeToggle, ThemeToggle } from "./ThemeToggle";

export default function Hero() {
  const [logoNumber, setLogoNumber] = useState("01");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const preloadedImages = useRef<HTMLImageElement[]>([]);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(performance.now());
  const animationFrameId = useRef<number>();

  useEffect(() => {
    // Create array of numbers 1-8 with padding
    const numbers = Array.from({ length: 8 }, (_, i) =>
      (i + 1).toString().padStart(2, "0")
    );

    // Preload each image
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

    // Set up the rotation interval
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        const nextNum = ((parseInt(logoNumber) % 8) + 1)
          .toString()
          .padStart(2, "0");
        setLogoNumber(nextNum);
        setIsTransitioning(false);
      }, 100);
    }, 2000);

    // Scroll handling with RAF and velocity detection
    const handleScrollWithRAF = () => {
      const currentScrollY = window.scrollY;
      const currentTime = performance.now();
      const timeDelta = currentTime - lastScrollTime.current;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);

      // Calculate scroll velocity (px/ms)
      const scrollVelocity = scrollDelta / timeDelta;

      // Adjust thresholds based on scroll velocity
      const velocityThreshold = 0.5; // px/ms
      const isScrollingFast = scrollVelocity > velocityThreshold;

      const scrollDownThreshold = isScrollingFast ? 30 : 50;
      const scrollUpThreshold = isScrollingFast ? 10 : 20;

      const shouldBeScrolled =
        currentScrollY > (isScrolled ? scrollUpThreshold : scrollDownThreshold);

      if (shouldBeScrolled !== isScrolled) {
        setIsScrolled(shouldBeScrolled);
      }

      lastScrollY.current = currentScrollY;
      lastScrollTime.current = currentTime;
    };

    const onScroll = () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      animationFrameId.current = requestAnimationFrame(handleScrollWithRAF);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    handleScrollWithRAF(); // Check initial scroll position

    // Cleanup function
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [logoNumber, isScrolled]); // Include both dependencies

  return (
    <>
      {/* Placeholder to prevent content overlap */}
      <div
        className={`w-full sm:transition-all sm:duration-300 sm:ease-in-out ${
          isScrolled ? "h-[48px]" : "h-[220px] sm:h-[180px]"
        }`}
      />

      <section
        className={`fixed top-0 left-0 right-0 z-10 sm:transition-all sm:duration-300 sm:ease-in-out ${
          isScrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-sm"
            : "bg-transparent"
        }`}
      >
        {/* Background Gradient - Only show when not scrolled */}
        {!isScrolled && (
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-pink-500/5 via-purple-500/5 to-transparent dark:from-pink-500/10 dark:via-purple-500/5 dark:to-transparent blur-3xl -z-10" />
        )}

        {/* Content */}
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div
            className={`relative flex flex-col items-center sm:transition-all sm:duration-300 sm:ease-in-out ${
              isScrolled ? "py-1" : "pt-6 pb-8"
            }`}
          >
            {/* Title Section */}
            <div
              className={`text-center ${
                isScrolled
                  ? "flex items-center justify-between w-full"
                  : "space-y-4 mb-6"
              }`}
            >
              {/* Logo and Title */}
              <div className="inline-flex items-center gap-3 flex-shrink-0 min-w-[200px]">
                <div
                  className={`sm:transition-all sm:duration-300 ${
                    isScrolled ? "w-8 h-8" : "w-12 h-12"
                  } rounded-xl bg-white dark:bg-gray-900 border border-gray-200/50 dark:border-gray-800/50 shadow-sm flex items-center justify-center`}
                >
                  <div
                    className={`sm:transition-all sm:duration-150 ${
                      isTransitioning
                        ? "-rotate-180 scale-75 opacity-0"
                        : "rotate-0 scale-100 opacity-100"
                    }`}
                  >
                    <img
                      src={`/icons/logo-${logoNumber}.png`}
                      alt="Fluffle Logo"
                      className={`sm:transition-all sm:duration-300 ${
                        isScrolled ? "w-5 h-5" : "w-8 h-8"
                      } object-contain brightness-0 dark:invert`}
                    />
                  </div>
                </div>
                <a href="/" className="hover:opacity-80 transition-opacity">
                  <h1
                    className={`sm:transition-all sm:duration-300 whitespace-nowrap ${
                      isScrolled ? "text-2xl" : "text-4xl"
                    } font-black tracking-tight bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent`}
                  >
                    Fluffle Tools
                  </h1>
                </a>
              </div>

              {/* Description - Only show when not scrolled */}
              {!isScrolled && (
                <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Utilities for{" "}
                  <span className="text-gray-900 dark:text-white font-medium">
                    MegaETH
                  </span>{" "}
                  explorers and{" "}
                  <span className="text-gray-900 dark:text-white font-medium">
                    Fluffle
                  </span>{" "}
                  holders
                </p>
              )}

              {/* Stats and Action Buttons */}
              {isScrolled ? (
                <div className="flex items-center justify-center sm:justify-end gap-3">
                  <a
                    href="https://opensea.io/collection/megaeth-nft-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`hidden sm:flex items-center gap-2 transition-all duration-300 ${
                      isScrolled ? "px-3.5 py-2 text-xs" : "px-3.5 py-2 text-sm"
                    } rounded-xl bg-blue-50/90 hover:bg-blue-100/90 dark:bg-blue-500/[0.02] dark:hover:bg-blue-500/[0.05] border border-blue-200/30 dark:border-blue-500/[0.05] hover:border-blue-300/50 dark:hover:border-blue-500/[0.1] shadow-sm hover:shadow transition-all group`}
                  >
                    <svg
                      className={`transition-all duration-300 ${
                        isScrolled ? "w-4 h-4" : "w-4 h-4"
                      } text-blue-600 dark:text-blue-400`}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.629 0 12 0ZM5.92 12.403l.051-.081 3.123-4.884a.107.107 0 0 1 .187.014c.52 1.169.972 2.623.76 3.528-.088.372-.335.876-.614 1.342a2.405 2.405 0 0 1-.117.199.106.106 0 0 1-.09.045H6.013a.106.106 0 0 1-.091-.163zm13.914 1.68a.109.109 0 0 1-.065.101c-.243.103-1.07.485-1.414.962-.878 1.222-1.548 2.97-3.048 2.97H9.053a4.019 4.019 0 0 1-4.013-4.028v-.072c0-.058.048-.106.108-.106h3.485c.07 0 .12.063.115.132-.026.226.017.459.125.67.206.42.636.682 1.099.682h1.726v-1.347H9.99a.11.11 0 0 1-.089-.173l.063-.09c.16-.231.391-.586.621-.992.156-.274.308-.566.43-.86.024-.052.043-.107.065-.16.033-.094.067-.182.091-.269a4.57 4.57 0 0 0 .065-.223c.057-.25.081-.514.081-.787 0-.108-.004-.221-.014-.327-.005-.117-.02-.235-.034-.352a3.415 3.415 0 0 0-.048-.312 6.494 6.494 0 0 0-.098-.468l-.014-.06c-.03-.108-.056-.21-.09-.317a11.824 11.824 0 0 0-.328-.972 5.212 5.212 0 0 0-.142-.355c-.072-.178-.146-.339-.213-.49a3.564 3.564 0 0 1-.094-.197 4.658 4.658 0 0 0-.103-.213c-.024-.053-.053-.104-.072-.152l-.211-.388c-.029-.053.019-.118.077-.101l1.32.357h.01l.173.05.192.054.07.019v-.783c0-.379.302-.686.679-.686a.66.66 0 0 1 .477.202.69.69 0 0 1 .2.484V6.65l.141.039c.01.005.022.01.031.017.034.024.084.062.147.147.05.038.103.086.165.137a10.351 10.351 0 0 1 .574.504c.214.199.454.432.684.691.065.074.127.146.192.226.062.079.132.156.19.232.079.104.16.212.235.324.033.053.074.108.105.161.096.142.178.288.257.435.034.067.067.141.096.213.089.197.159.396.202.598a.65.65 0 0 1 .029.132v.01c.014.057.019.12.024.184a2.057 2.057 0 0 1-.106.874c-.031.084-.06.17-.098.254-.075.17-.161.343-.264.502-.034.06-.075.122-.113.182-.043.063-.089.123-.127.18a3.89 3.89 0 0 1-.173.221c-.053.072-.106.144-.166.209-.081.098-.16.19-.245.278-.048.058-.1.118-.156.17-.052.06-.108.113-.156.161-.084.084-.15.147-.208.202l-.137.122a.102.102 0 0 1-.072.03h-1.051v1.346h1.322c.295 0 .576-.104.804-.298.077-.067.415-.36.816-.802a.094.094 0 0 1 .05-.03l3.65-1.057a.108.108 0 0 1 .138.103z" />
                    </svg>
                    <span className="font-medium text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300">
                      Show Collection
                    </span>
                  </a>

                  <a
                    href="https://x.com/intent/follow?screen_name=0x_ultra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 sm:gap-2 transition-all duration-300 ${
                      isScrolled
                        ? "px-2.5 sm:px-3.5 py-2 text-xs"
                        : "px-3.5 py-2 text-sm"
                    } rounded-xl bg-white/80 hover:bg-white/90 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] border border-gray-200/30 dark:border-white/[0.08] hover:border-gray-300/50 dark:hover:border-white/[0.12] shadow-sm hover:shadow group`}
                  >
                    <svg
                      className={`transition-all duration-300 ${
                        isScrolled ? "w-4 h-4" : "w-4 h-4"
                      } text-gray-800 dark:text-white`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="font-medium text-gray-800 dark:text-white group-hover:text-gray-900">
                      {isScrolled ? (
                        <>
                          <span className="inline sm:hidden">@0x_ultra</span>
                          <span className="hidden sm:inline">
                            Follow @0x_ultra
                          </span>
                        </>
                      ) : (
                        "Follow @0x_ultra"
                      )}
                    </span>
                  </a>

                  <MobileThemeToggle />
                  <ThemeToggle />
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-white/80 dark:bg-white/[0.02] border border-gray-200/30 dark:border-white/[0.08] shadow-sm">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        5,000
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Rabbits
                      </span>
                    </div>
                    <div className="w-px h-4 bg-gray-200/50 dark:bg-white/[0.06]" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        16
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Tribes
                      </span>
                    </div>
                  </div>
                  <a
                    href="https://opensea.io/collection/megaeth-nft-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-2 px-3.5 py-2 text-sm rounded-xl bg-blue-50/90 hover:bg-blue-100/90 dark:bg-blue-500/[0.02] dark:hover:bg-blue-500/[0.05] border border-blue-200/30 dark:border-blue-500/[0.05] hover:border-blue-300/50 dark:hover:border-blue-500/[0.1] shadow-sm hover:shadow transition-all group"
                  >
                    <svg
                      className="w-4 h-4 text-blue-600 dark:text-blue-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.629 0 12 0ZM5.92 12.403l.051-.081 3.123-4.884a.107.107 0 0 1 .187.014c.52 1.169.972 2.623.76 3.528-.088.372-.335.876-.614 1.342a2.405 2.405 0 0 1-.117.199.106.106 0 0 1-.09.045H6.013a.106.106 0 0 1-.091-.163zm13.914 1.68a.109.109 0 0 1-.065.101c-.243.103-1.07.485-1.414.962-.878 1.222-1.548 2.97-3.048 2.97H9.053a4.019 4.019 0 0 1-4.013-4.028v-.072c0-.058.048-.106.108-.106h3.485c.07 0 .12.063.115.132-.026.226.017.459.125.67.206.42.636.682 1.099.682h1.726v-1.347H9.99a.11.11 0 0 1-.089-.173l.063-.09c.16-.231.391-.586.621-.992.156-.274.308-.566.43-.86.024-.052.043-.107.065-.16.033-.094.067-.182.091-.269a4.57 4.57 0 0 0 .065-.223c.057-.25.081-.514.081-.787 0-.108-.004-.221-.014-.327-.005-.117-.02-.235-.034-.352a3.415 3.415 0 0 0-.048-.312 6.494 6.494 0 0 0-.098-.468l-.014-.06c-.03-.108-.056-.21-.09-.317a11.824 11.824 0 0 0-.328-.972 5.212 5.212 0 0 0-.142-.355c-.072-.178-.146-.339-.213-.49a3.564 3.564 0 0 1-.094-.197 4.658 4.658 0 0 0-.103-.213c-.024-.053-.053-.104-.072-.152l-.211-.388c-.029-.053.019-.118.077-.101l1.32.357h.01l.173.05.192.054.07.019v-.783c0-.379.302-.686.679-.686a.66.66 0 0 1 .477.202.69.69 0 0 1 .2.484V6.65l.141.039c.01.005.022.01.031.017.034.024.084.062.147.147.05.038.103.086.165.137a10.351 10.351 0 0 1 .574.504c.214.199.454.432.684.691.065.074.127.146.192.226.062.079.132.156.19.232.079.104.16.212.235.324.033.053.074.108.105.161.096.142.178.288.257.435.034.067.067.141.096.213.089.197.159.396.202.598a.65.65 0 0 1 .029.132v.01c.014.057.019.12.024.184a2.057 2.057 0 0 1-.106.874c-.031.084-.06.17-.098.254-.075.17-.161.343-.264.502-.034.06-.075.122-.113.182-.043.063-.089.123-.127.18a3.89 3.89 0 0 1-.173.221c-.053.072-.106.144-.166.209-.081.098-.16.19-.245.278-.048.058-.1.118-.156.17-.052.06-.108.113-.156.161-.084.084-.15.147-.208.202l-.137.122a.102.102 0 0 1-.072.03h-1.051v1.346h1.322c.295 0 .576-.104.804-.298.077-.067.415-.36.816-.802a.094.094 0 0 1 .05-.03l3.65-1.057a.108.108 0 0 1 .138.103z" />
                    </svg>
                    <span className="font-medium text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300">
                      Show Collection
                    </span>
                  </a>
                  <a
                    href="https://x.com/intent/follow?screen_name=0x_ultra"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-1.5 sm:gap-2 transition-all duration-300 ${
                      isScrolled
                        ? "px-2.5 sm:px-3.5 py-2 text-xs"
                        : "px-3.5 py-2 text-sm"
                    } rounded-xl bg-white/80 hover:bg-white/90 dark:bg-white/[0.02] dark:hover:bg-white/[0.05] border border-gray-200/30 dark:border-white/[0.08] hover:border-gray-300/50 dark:hover:border-white/[0.12] shadow-sm hover:shadow group`}
                  >
                    <svg
                      className={`transition-all duration-300 ${
                        isScrolled ? "w-4 h-4" : "w-4 h-4"
                      } text-gray-800 dark:text-white`}
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                    <span className="font-medium text-gray-800 dark:text-white group-hover:text-gray-900">
                      {isScrolled ? (
                        <>
                          <span className="inline sm:hidden">@0x_ultra</span>
                          <span className="hidden sm:inline">
                            Follow @0x_ultra
                          </span>
                        </>
                      ) : (
                        "Follow @0x_ultra"
                      )}
                    </span>
                  </a>
                </div>
              )}
            </div>

            {/* Decorative Divider - Only show when not scrolled */}
            {!isScrolled && (
              <div className="w-full max-w-4xl mx-auto mt-4 mb-2 sm:mb-0">
                <div className="h-px bg-gradient-to-r from-transparent via-gray-200/80 dark:via-white/10 to-transparent" />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
