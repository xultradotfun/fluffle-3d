"use client";

import { useState, useEffect } from "react";
import { apiClient, API_ENDPOINTS } from "@/lib/api";
import CountUp from "@/components/ui/CountUp";

export function EcosystemHeader() {
  const [stats, setStats] = useState({
    uniqueVoters: 0,
    totalVotes: 0,
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiClient.get(API_ENDPOINTS.VOTES.LIST);
        if (data.stats) {
          setStats(data.stats);
          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Failed to fetch vote stats:", error);
        setIsLoaded(true); // Still show animation even if fetch fails
      }
    };

    fetchStats();
  }, []);

  const clipMain =
    "polygon(24px 0, 100% 0, 100% calc(100% - 24px), calc(100% - 24px) 100%, 0 100%, 0 24px)";
  const clipStat = "polygon(16px 0, 100% 0, 100% 100%, 0 100%, 0 16px)";

  return (
    <div className="space-y-6">
      {/* Main Header with Video Background */}
      <div
        className="relative overflow-hidden"
        style={{
          clipPath:
            "polygon(24px 0, calc(100% - 48px) 0, 100% 48px, 100% 100%, 0 100%, 0 24px)",
        }}
      >
        {/* Video Background */}
        <video
          loop
          muted
          autoPlay
          playsInline
          className="absolute top-0 right-0 w-full h-full object-cover"
          poster="/ui/oversubscription.webp"
        >
          <source src="/ui/oversubscription.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
        <div
          className="absolute top-0 right-0 w-full h-full"
          style={{ backgroundColor: "rgba(25, 25, 26, 0.5)" }}
        />

        {/* Content */}
        <div className="relative p-8" style={{ color: "#fff" }}>
          <div className="flex items-center gap-3 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="68"
              height="68"
              viewBox="0 0 68 68"
              fill="none"
              className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px]"
            >
              <path
                d="M34 0C34.6638 18.4957 49.5043 33.3362 68 34C49.5043 34.6638 34.6638 49.5043 34 68C33.3362 49.5043 18.4957 34.6638 0 34C18.4957 33.3362 33.3362 18.4957 34 0Z"
                fill="white"
              ></path>
            </svg>
            <h2 className="text-4xl sm:text-5xl font-black uppercase leading-none pt-2">
              ECOSYSTEM
            </h2>
          </div>
          <p className="text-base font-bold uppercase max-w-3xl ml-[calc(0.75rem+12px)]">
            DISCOVER AND VOTE ON PROJECTS BUILDING ON{" "}
            <span className="bg-pink text-foreground px-2 py-1">MEGAETH</span>
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Stat 1 */}
        <div style={{ clipPath: clipStat }}>
          <div style={{ backgroundColor: "#19191a", padding: "2px" }}>
            <div className="bg-[#e0e0e0] p-4" style={{ clipPath: clipStat }}>
              <div className="text-3xl sm:text-4xl font-black font-data mb-1">
                {isLoaded ? (
                  <CountUp
                    from={0}
                    to={stats.uniqueVoters}
                    separator=","
                    direction="up"
                    duration={1.5}
                  />
                ) : (
                  "..."
                )}
              </div>
              <div className="text-xs font-bold uppercase text-gray-600">
                [VOTERS]
              </div>
            </div>
          </div>
        </div>

        {/* Stat 2 */}
        <div style={{ clipPath: clipStat }}>
          <div style={{ backgroundColor: "#19191a", padding: "2px" }}>
            <div className="bg-[#e0e0e0] p-4" style={{ clipPath: clipStat }}>
              <div className="text-3xl sm:text-4xl font-black font-data mb-1">
                {isLoaded ? (
                  <CountUp
                    from={0}
                    to={stats.totalVotes}
                    separator=","
                    direction="up"
                    duration={1.5}
                  />
                ) : (
                  "..."
                )}
              </div>
              <div className="text-xs font-bold uppercase text-gray-600">
                [TOTAL VOTES]
              </div>
            </div>
          </div>
        </div>

        {/* Stat 3 */}
        <div style={{ clipPath: clipStat }}>
          <div style={{ backgroundColor: "#19191a", padding: "2px" }}>
            <div className="bg-[#e0e0e0] p-4" style={{ clipPath: clipStat }}>
              <div className="text-3xl sm:text-4xl font-black font-data mb-1">
                <CountUp
                  from={0}
                  to={100}
                  separator=","
                  direction="up"
                  duration={1.5}
                />
                +
              </div>
              <div className="text-xs font-bold uppercase text-gray-600">
                [PROJECTS]
              </div>
            </div>
          </div>
        </div>

        {/* Stat 4 */}
        <div style={{ clipPath: clipStat }}>
          <div style={{ backgroundColor: "#19191a", padding: "2px" }}>
            <div className="bg-[#e0e0e0] p-4" style={{ clipPath: clipStat }}>
              <div className="text-3xl sm:text-4xl font-black font-data mb-1">
                <CountUp
                  from={0}
                  to={12}
                  separator=","
                  direction="up"
                  duration={1.5}
                />
              </div>
              <div className="text-xs font-bold uppercase text-gray-600">
                [CATEGORIES]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
