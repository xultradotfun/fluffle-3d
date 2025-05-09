import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

// Helper function to format dates
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

interface MintGroup {
  name: string;
  size: number;
  price: number;
  startTime: number;
  endTime?: number;
}

// Add vote data interface
interface VoteData {
  upvotes: number;
  downvotes: number;
  userVote: string | null;
  breakdown: Record<string, { up: number; down: number }>;
}

interface TestnetMintProps {
  name: string;
  description: string;
  profileImgUrl: string;
  headerImgUrl: string;
  totalSupply: number;
  mintTimestamp: number;
  mintLink: string;
  twitter?: string;
  discord?: string;
  website?: string;
  telegram?: string;
  mintGroups: MintGroup[];
  chain: string;
  status?: "live" | "upcoming" | "sold_out";
  ecosystemProject?: any;
  votes?: VoteData;
  source: "kingdomly" | "rarible";
}

// Simple component to display vote breakdown with a custom tooltip
const VoteBreakdownTooltip = ({
  breakdown,
  className,
  children,
}: {
  breakdown?: Record<string, { up: number; down: number }>;
  className?: string;
  children: React.ReactNode;
}) => {
  if (!breakdown || Object.keys(breakdown).length === 0) return children;

  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({
    x: 0,
    y: 0,
    shift: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipWidth = 260; // Width of the tooltip

  useEffect(() => {
    if (isHovered && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // Calculate the ideal center position
      let xPos = rect.left + rect.width / 2;
      let shift = 0;

      // Check if tooltip would go off-screen to the right
      if (xPos + tooltipWidth / 2 > viewportWidth - 16) {
        // Calculate how much we need to shift left to keep 16px margin
        shift = xPos + tooltipWidth / 2 - (viewportWidth - 16);
        xPos -= shift;
      }
      // Check if tooltip would go off-screen to the left
      else if (xPos - tooltipWidth / 2 < 16) {
        // Calculate how much we need to shift right to keep 16px margin
        shift = 16 - (xPos - tooltipWidth / 2);
        xPos += shift;
      }

      setTooltipPosition({
        x: xPos,
        y: rect.top - 8,
        shift: shift,
      });
    }
  }, [isHovered]);

  // Calculate trusted score (sum of all roles except MiniETH)
  const trustedScore = Object.entries(breakdown).reduce(
    (total, [role, counts]) => {
      if (role.toLowerCase() !== "minieth") {
        return total + (counts.up - counts.down);
      }
      return total;
    },
    0
  );

  return (
    <>
      <div
        ref={containerRef}
        className="inline-block"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </div>
      {isHovered &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed z-[100] pointer-events-none"
            style={{
              left: `${tooltipPosition.x}px`,
              top: `${tooltipPosition.y}px`,
              transform: "translate(-50%, -100%)",
            }}
          >
            <div className="w-[260px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-xl border border-gray-700/70 text-white text-xs overflow-hidden">
              {/* Header */}
              <div className="px-3 py-2.5 bg-gradient-to-r from-blue-900/40 to-blue-800/30 border-b border-gray-700/80">
                <div className="flex items-center">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="w-3.5 h-3.5 text-blue-400 mr-1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <h4 className="font-medium text-white tracking-wide">
                    Vote Breakdown
                  </h4>
                </div>
              </div>

              {/* Content */}
              <div className="p-3 bg-gradient-to-b from-transparent to-black/20">
                <div className="space-y-2">
                  {Object.entries(breakdown).map(([role, counts]) => (
                    <div
                      key={role}
                      className="flex justify-between items-center py-1.5 px-2 rounded-md hover:bg-white/5 transition-colors duration-150"
                    >
                      <span className="font-medium text-white truncate mr-3">
                        {role}
                      </span>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="flex items-center text-green-400 font-medium whitespace-nowrap">
                          <svg
                            className="w-3 h-3 mr-1 opacity-90"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="m5 15 7-7 7 7" />
                          </svg>
                          {counts.up}
                        </span>
                        <span className="text-gray-500 mx-0.5 opacity-60">
                          /
                        </span>
                        <span className="flex items-center text-red-400 font-medium whitespace-nowrap">
                          <svg
                            className="w-3 h-3 mr-1 opacity-90"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                          >
                            <path d="m19 9-7 7-7-7" />
                          </svg>
                          {counts.down}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Trusted score section */}
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <div className="flex justify-between items-center py-1.5 px-2 rounded-md bg-blue-500/10 border border-blue-400/20">
                    <div className="flex items-center">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="w-3.5 h-3.5 text-blue-400 mr-1.5"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                      <span className="font-medium text-blue-300">
                        Trusted Score:
                      </span>
                    </div>
                    <span
                      className={`font-bold text-sm ${
                        trustedScore > 0
                          ? "text-green-400"
                          : trustedScore < 0
                          ? "text-red-400"
                          : "text-gray-400"
                      }`}
                    >
                      {trustedScore > 0 ? "+" : ""}
                      {trustedScore}
                    </span>
                  </div>
                  <div className="mt-2 text-[10px] text-gray-400 opacity-60 italic text-center">
                    Sum of all roles excluding MiniETH
                  </div>
                </div>
              </div>

              {/* Arrow */}
              <div
                className="absolute bottom-[-8px] transform rotate-45 h-4 w-4 bg-gray-900 border-r border-b border-gray-700/70 shadow-lg"
                style={{
                  left: `calc(50% + ${tooltipPosition.shift}px)`,
                }}
              ></div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

// Add a helper function to check if URL is for animated content
const isAnimatedImage = (url: string): boolean => {
  const ext = url.split(".").pop()?.toLowerCase();
  return ext === "gif" || ext === "webp";
};

// Add a helper function to check if URL is for video content
const isVideo = (url: string): boolean => {
  const ext = url.split(".").pop()?.toLowerCase();
  return ext === "mp4" || ext === "webm" || ext === "mov";
};

// Add a MediaDisplay component to handle different media types
const MediaDisplay = ({
  url,
  alt,
  className,
  fallbackUrl,
  isHeader = false,
}: {
  url: string;
  alt: string;
  className?: string;
  fallbackUrl?: string;
  isHeader?: boolean;
}) => {
  // If this is a header and we have no URL but have a fallback, create a blurred background
  if (isHeader && !url && fallbackUrl) {
    return (
      <div className="relative w-full h-full">
        {/* Blurred background image */}
        <Image
          src={fallbackUrl}
          alt={alt}
          fill
          className={cn("object-cover scale-110", className)}
          unoptimized={isAnimatedImage(fallbackUrl)}
          style={{ filter: "blur(20px) brightness(0.7)" }}
        />
        {/* Centered profile image */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 relative">
            <Image
              src={fallbackUrl}
              alt={alt}
              fill
              className="object-cover rounded-lg"
              unoptimized={isAnimatedImage(fallbackUrl)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (isVideo(url)) {
    return (
      <video
        src={url}
        className={className}
        autoPlay
        loop
        muted
        playsInline
        style={{ objectFit: "cover" }}
      />
    );
  }

  return (
    <Image
      src={url || fallbackUrl || "/placeholder-header.png"}
      alt={alt}
      fill
      className={cn(
        "object-cover transition-transform duration-700 hover:scale-105",
        className
      )}
      unoptimized={isAnimatedImage(url || fallbackUrl || "")}
    />
  );
};

export function TestnetMintCard({
  name,
  description,
  profileImgUrl,
  headerImgUrl,
  totalSupply,
  mintTimestamp,
  mintLink,
  twitter,
  discord,
  website,
  telegram,
  mintGroups,
  chain,
  status,
  ecosystemProject,
  votes,
  source,
}: TestnetMintProps) {
  // Use timestamp for fallback only if status is not provided
  const isMintLive =
    status === "live" ||
    (status === undefined && Date.now() >= mintTimestamp * 1000);
  const isSoldOut = status === "sold_out";
  const mintDate = new Date(mintTimestamp * 1000);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const isUpcoming =
    status === "upcoming" ||
    (status === undefined && !isMintLive && timeLeft.days > 0);

  // Memoize status config to prevent unnecessary recalculations
  const statusConfig = useMemo(() => {
    if (isSoldOut) {
      return {
        badgeClass:
          "bg-gradient-to-r from-gray-700 to-gray-600 border border-gray-600/50 text-gray-100",
        text: "SOLD OUT",
        icon: (
          <svg
            className="w-3 h-3 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 4H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
            <path d="M16 2v4"></path>
            <path d="M8 2v4"></path>
            <path d="M3 10h18"></path>
          </svg>
        ),
      };
    } else if (isMintLive) {
      return {
        badgeClass:
          "bg-gradient-to-r from-green-600 to-green-500 border border-green-500/50 text-white",
        text: "LIVE",
        icon: (
          <svg
            className="w-3 h-3 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        ),
      };
    } else {
      return {
        badgeClass:
          "bg-gradient-to-r from-amber-600 to-amber-500 border border-amber-500/50 text-white",
        text: "UPCOMING",
        icon: (
          <svg
            className="w-3 h-3 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        ),
      };
    }
  }, [isSoldOut, isMintLive]);

  // Calculate time until mint
  useEffect(() => {
    if (mintTimestamp * 1000 <= Date.now()) return;

    const calculateTimeLeft = () => {
      const difference = mintTimestamp * 1000 - Date.now();
      if (difference <= 0) {
        return {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [mintTimestamp]);

  // Ensure we have direct access to breakdown data without excessive checks
  const voteBreakdown = votes?.breakdown;
  const hasVoteBreakdown =
    !!voteBreakdown && Object.keys(voteBreakdown).length > 0;

  return (
    <Card className="relative bg-white dark:bg-gray-900 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Header Image */}
      <div className="relative aspect-[3/1] w-full overflow-hidden rounded-t-xl">
        <MediaDisplay
          url={headerImgUrl}
          fallbackUrl={profileImgUrl}
          alt={`${name} header`}
          isHeader={true}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30"></div>

        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <div
            className={`
              inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium
              backdrop-blur-sm shadow-sm border transition-all duration-300
              ${
                isSoldOut
                  ? "bg-gray-900/70 border-gray-700/50 text-gray-200"
                  : isMintLive
                  ? "bg-green-500/70 border-green-400/50 text-white"
                  : "bg-amber-500/70 border-amber-400/50 text-white"
              }
            `}
          >
            {isSoldOut ? (
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : isMintLive ? (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
            ) : (
              <svg
                className="w-3 h-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            )}
            {statusConfig.text}
          </div>
        </div>

        {/* Source Logo */}
        <div className="absolute top-3 right-3 z-10">
          <div className="w-7 h-7 rounded-lg bg-white/90 dark:bg-gray-800/90 shadow-lg flex items-center justify-center backdrop-blur-sm">
            <Image
              src={
                source === "kingdomly"
                  ? "/kingdomlylogo.png"
                  : "/rariblelogo.png"
              }
              alt={`${source} marketplace`}
              width={20}
              height={20}
              className="rounded-sm"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2">
          {twitter && (
            <Link
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#1DA1F2] text-white/90 hover:text-white transition-all duration-200 flex items-center justify-center backdrop-blur-sm border border-white/20 hover:border-transparent hover:scale-105 hover:shadow-[0_0_10px_rgba(29,161,242,0.5)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z" />
              </svg>
            </Link>
          )}
          {discord && (
            <Link
              href={discord}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 rounded-lg bg-white/10 hover:bg-[#5865F2] text-white/90 hover:text-white transition-all duration-200 flex items-center justify-center backdrop-blur-sm border border-white/20 hover:border-transparent hover:scale-105 hover:shadow-[0_0_10px_rgba(88,101,242,0.5)]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </Link>
          )}
        </div>

        {/* Countdown Timer */}
        {isUpcoming &&
          timeLeft &&
          timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds >
            0 && (
            <div className="absolute bottom-3 right-3 z-10">
              <div className="bg-black/70 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-amber-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-xs font-medium text-white">
                  {timeLeft.days > 0 && `${timeLeft.days}d `}
                  {timeLeft.hours > 0 && `${timeLeft.hours}h `}
                  {timeLeft.minutes > 0 && `${timeLeft.minutes}m `}
                  {timeLeft.days === 0 &&
                    timeLeft.hours === 0 &&
                    `${timeLeft.seconds}s`}
                </span>
              </div>
            </div>
          )}
      </div>

      {/* Content Section */}
      <div className="p-4">
        {/* Collection Info */}
        <div className="flex items-start gap-3">
          {/* Profile Image */}
          <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg flex-shrink-0 border-2 border-white dark:border-gray-800">
            <MediaDisplay
              url={profileImgUrl}
              fallbackUrl="/placeholder-profile.png"
              alt={`${name} profile`}
              className="!static"
            />
          </div>

          {/* Title and Description */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              {name}
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[40px]">
              {description}
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
              Supply
            </div>
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              {totalSupply ? totalSupply.toLocaleString() : "-"}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
            <div className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-1">
              Mint Date
            </div>
            <div className="text-base font-semibold text-gray-900 dark:text-white">
              {formatDate(mintDate)}
            </div>
          </div>
        </div>

        {/* CTA and Voting Section */}
        <div className="mt-6 flex items-center gap-3 relative">
          <Link
            href={mintLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex-1 inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-medium transition-all duration-300
              relative group overflow-hidden backdrop-blur-sm
              ${
                !isMintLive
                  ? "bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700/80"
                  : `${
                      source === "kingdomly"
                        ? "bg-[#1B3A27]/5 dark:bg-[#1B3A27]/10"
                        : "bg-[#FFE600]/5 dark:bg-[#FFE600]/10"
                    }
                  before:absolute before:inset-0 before:rounded-xl before:transition-all before:duration-300
                  ${
                    source === "kingdomly"
                      ? "before:bg-gradient-to-r before:from-[#C5A05C]/20 before:to-[#1B3A27]/20 before:group-hover:from-[#C5A05C]/30 before:group-hover:to-[#1B3A27]/30"
                      : "before:bg-gradient-to-r before:from-[#FFE600]/20 before:to-[#FFE600]/20 before:group-hover:from-[#FFE600]/30 before:group-hover:to-[#FFE600]/30"
                  }
                  after:absolute after:inset-0 after:rounded-xl after:transition-all after:duration-300
                  ${
                    source === "kingdomly"
                      ? "after:shadow-[0_0_15px_rgba(197,160,92,0.2)] after:group-hover:shadow-[0_0_25px_rgba(197,160,92,0.3)]"
                      : "after:shadow-[0_0_15px_rgba(255,230,0,0.15)] after:group-hover:shadow-[0_0_25px_rgba(255,230,0,0.25)]"
                  }`
              }`}
          >
            {isMintLive ? (
              <>
                <span
                  className={`relative z-10 font-semibold ${
                    source === "kingdomly"
                      ? "text-[#C5A05C] dark:text-[#C5A05C] group-hover:text-[#C5A05C]"
                      : "text-[#FFE600] dark:text-[#FFE600] group-hover:text-[#FFE600] dark:group-hover:text-[#FFE600]"
                  }`}
                >
                  Mint Now
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`relative z-10 ml-2 transition-transform duration-300 group-hover:translate-x-0.5 ${
                    source === "kingdomly"
                      ? "text-[#C5A05C] group-hover:text-[#C5A05C]"
                      : "text-[#FFE600] group-hover:text-[#FFE600]"
                  }`}
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </>
            ) : (
              <>
                <span className="relative z-10 text-gray-700 dark:text-gray-300">
                  View Collection
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative z-10 ml-2 text-gray-500 dark:text-gray-400 transition-transform duration-300 group-hover:translate-x-0.5"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </>
            )}
          </Link>

          {votes && (
            <div className="flex items-center gap-2">
              <VoteBreakdownTooltip breakdown={voteBreakdown}>
                <div className="flex overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700">
                  <button
                    className={`flex items-center px-3 py-3 gap-1 transition-colors duration-200 ${
                      votes.userVote === "up"
                        ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                        : "hover:bg-green-50/50 dark:hover:bg-green-900/10 text-green-600/60 dark:text-green-400/60"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill={votes.userVote === "up" ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 15l7-7 7 7"
                      />
                    </svg>
                    <span className="text-sm font-medium">{votes.upvotes}</span>
                  </button>
                  <div className="w-px bg-gray-200 dark:bg-gray-700" />
                  <button
                    className={`flex items-center px-3 py-3 gap-1 transition-colors duration-200 ${
                      votes.userVote === "down"
                        ? "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                        : "hover:bg-red-50/50 dark:hover:bg-red-900/10 text-red-600/60 dark:text-red-400/60"
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill={votes.userVote === "down" ? "currentColor" : "none"}
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                    <span className="text-sm font-medium">
                      {votes.downvotes}
                    </span>
                  </button>
                </div>
              </VoteBreakdownTooltip>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
