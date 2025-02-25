"use client";
import { useState, useEffect, useRef } from "react";

export default function Hero() {
  const [logoNumber, setLogoNumber] = useState("01");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const preloadedImages = useRef<HTMLImageElement[]>([]);

  // Preload all images on mount
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

    return () => clearInterval(interval);
  }, [logoNumber]);

  return (
    <section className="relative overflow-hidden py-8">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/5 dark:to-indigo-500/5" />
        <div className="absolute inset-y-0 right-1/2 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-500/5 dark:to-transparent" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4">
        <div className="relative flex flex-col items-center">
          {/* Title Section */}
          <div className="text-center space-y-6 mb-8">
            {/* Logo and Title */}
            <div className="inline-flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm flex items-center justify-center">
                <div
                  className={`transition-all duration-150 ${
                    isTransitioning
                      ? "-rotate-180 scale-75 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  }`}
                >
                  <img
                    src={`/icons/logo-${logoNumber}.png`}
                    alt="Fluffle Logo"
                    className="w-9 h-9 object-contain brightness-0 dark:invert"
                  />
                </div>
              </div>
              <h1 className="text-5xl font-black tracking-tight bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-gray-300 bg-clip-text text-transparent">
                Fluffle Tools
              </h1>
            </div>

            {/* Description */}
            <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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
          </div>

          {/* Stats and Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {/* Stats Group */}
            <div className="flex items-center gap-4 p-1.5 rounded-2xl bg-white dark:bg-card border border-gray-200 dark:border-border shadow-sm dark:shadow-none">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/10 border border-blue-100 dark:border-white/10">
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  5,000
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Rabbits
                </span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 border border-indigo-100 dark:border-white/10">
                <span className="text-base font-semibold text-gray-900 dark:text-white">
                  16
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Tribes
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <a
                href="https://opensea.io/collection/megaeth-nft-1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 hover:border-blue-300 dark:hover:border-blue-500/30 transition-all group"
              >
                <svg
                  className="w-5 h-5 text-blue-600 dark:text-blue-400"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 0C5.374 0 0 5.374 0 12s5.374 12 12 12 12-5.374 12-12S18.629 0 12 0ZM5.92 12.403l.051-.081 3.123-4.884a.107.107 0 0 1 .187.014c.52 1.169.972 2.623.76 3.528-.088.372-.335.876-.614 1.342a2.405 2.405 0 0 1-.117.199.106.106 0 0 1-.09.045H6.013a.106.106 0 0 1-.091-.163zm13.914 1.68a.109.109 0 0 1-.065.101c-.243.103-1.07.485-1.414.962-.878 1.222-1.548 2.97-3.048 2.97H9.053a4.019 4.019 0 0 1-4.013-4.028v-.072c0-.058.048-.106.108-.106h3.485c.07 0 .12.063.115.132-.026.226.017.459.125.67.206.42.636.682 1.099.682h1.726v-1.347H9.99a.11.11 0 0 1-.089-.173l.063-.09c.16-.231.391-.586.621-.992.156-.274.308-.566.43-.86.024-.052.043-.107.065-.16.033-.094.067-.182.091-.269a4.57 4.57 0 0 0 .065-.223c.057-.25.081-.514.081-.787 0-.108-.004-.221-.014-.327-.005-.117-.02-.235-.034-.352a3.415 3.415 0 0 0-.048-.312 6.494 6.494 0 0 0-.098-.468l-.014-.06c-.03-.108-.056-.21-.09-.317a11.824 11.824 0 0 0-.328-.972 5.212 5.212 0 0 0-.142-.355c-.072-.178-.146-.339-.213-.49a3.564 3.564 0 0 1-.094-.197 4.658 4.658 0 0 0-.103-.213c-.024-.053-.053-.104-.072-.152l-.211-.388c-.029-.053.019-.118.077-.101l1.32.357h.01l.173.05.192.054.07.019v-.783c0-.379.302-.686.679-.686a.66.66 0 0 1 .477.202.69.69 0 0 1 .2.484V6.65l.141.039c.01.005.022.01.031.017.034.024.084.062.147.147.05.038.103.086.165.137a10.351 10.351 0 0 1 .574.504c.214.199.454.432.684.691.065.074.127.146.192.226.062.079.132.156.19.232.079.104.16.212.235.324.033.053.074.108.105.161.096.142.178.288.257.435.034.067.067.141.096.213.089.197.159.396.202.598a.65.65 0 0 1 .029.132v.01c.014.057.019.12.024.184a2.057 2.057 0 0 1-.106.874c-.031.084-.06.17-.098.254-.075.17-.161.343-.264.502-.034.06-.075.122-.113.182-.043.063-.089.123-.127.18a3.89 3.89 0 0 1-.173.221c-.053.072-.106.144-.166.209-.081.098-.16.19-.245.278-.048.058-.1.118-.156.17-.052.06-.108.113-.156.161-.084.084-.15.147-.208.202l-.137.122a.102.102 0 0 1-.072.03h-1.051v1.346h1.322c.295 0 .576-.104.804-.298.077-.067.415-.36.816-.802a.094.094 0 0 1 .05-.03l3.65-1.057a.108.108 0 0 1 .138.103z" />
                </svg>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-400 group-hover:text-blue-800 dark:group-hover:text-blue-300">
                  View Collection
                </span>
              </a>
              <a
                href="https://twitter.com/0x_ultra"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-white/5 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 transition-all group"
              >
                <svg
                  className="w-5 h-5 text-gray-700 dark:text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-white group-hover:text-gray-900 dark:group-hover:text-white">
                  Follow @0x_ultra
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
