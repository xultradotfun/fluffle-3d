import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useEffect, useState, useMemo, useRef } from "react";

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
}: {
  breakdown?: Record<string, { up: number; down: number }>;
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip]);

  if (!breakdown || Object.keys(breakdown).length === 0) return null;

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
    <div className="relative inline-block">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 focus:outline-none transition-all duration-200 shadow-sm border border-gray-600/30 hover:border-gray-500/50 transform hover:scale-105"
        aria-label="Vote breakdown information"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="10"
          height="10"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-90"
        >
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      </button>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute z-50 bottom-full right-0 mb-2 min-w-[260px] bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg shadow-xl border border-gray-700/70 text-white text-xs overflow-hidden transform origin-bottom-right transition-all duration-200 animate-fadeIn"
          style={{
            boxShadow:
              "0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.1) inset",
          }}
        >
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
                    <span className="text-gray-500 mx-0.5 opacity-60">/</span>
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
          <div className="absolute bottom-[-8px] right-[6px] transform rotate-45 h-4 w-4 bg-gray-900 border-r border-b border-gray-700/70 shadow-lg"></div>
        </div>
      )}
    </div>
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
    <Card className="overflow-hidden border-0 bg-gradient-to-b from-gray-900/95 to-gray-900/90 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
      {/* Header section with image */}
      <div className="relative">
        {/* Status indicators */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center shadow-sm ${statusConfig.badgeClass}`}
          >
            {statusConfig.icon}
            {statusConfig.text}
            {isMintLive && (
              <span className="ml-1.5 h-2 w-2 rounded-full bg-white inline-block animate-pulse shadow-glow"></span>
            )}
          </div>

          {/* Marketplace source icon */}
          <div className="w-7 h-7 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-sm">
            <Image
              src={
                source === "kingdomly"
                  ? "/kingdomlylogo.png"
                  : "/rariblelogo.png"
              }
              alt={`${source} marketplace`}
              width={20}
              height={20}
              className="rounded-full"
            />
          </div>
        </div>

        {/* Countdown for upcoming projects */}
        {isUpcoming &&
          timeLeft &&
          timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds >
            0 && (
            <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
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
          )}

        {/* Header Image with improved gradient overlay */}
        <div className="relative h-40 w-full overflow-hidden">
          <MediaDisplay
            url={headerImgUrl}
            fallbackUrl={profileImgUrl}
            alt={`${name} header`}
            isHeader={true}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90"></div>
        </div>

        {/* Social links in banner with hover effects */}
        <div className="absolute bottom-3 right-3 z-10 flex gap-2">
          {twitter && twitter !== "" && (
            <Link
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-7 h-7 bg-blue-500/80 hover:bg-blue-600 text-white rounded-full transition-all duration-200 shadow-sm hover:shadow hover:scale-105"
              aria-label="Twitter"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M21.543 7.104c.015.211.015.423.015.636 0 6.507-4.954 14.01-14.01 14.01v-.003A13.94 13.94 0 0 1 0 19.539a9.88 9.88 0 0 0 7.287-2.041 4.93 4.93 0 0 1-4.6-3.42 4.916 4.916 0 0 0 2.223-.084A4.926 4.926 0 0 1 .96 9.167v-.062a4.887 4.887 0 0 0 2.235.616A4.928 4.928 0 0 1 1.67 3.148 13.98 13.98 0 0 0 11.82 8.292a4.929 4.929 0 0 1 8.39-4.49 9.868 9.868 0 0 0 3.128-1.196 4.941 4.941 0 0 1-2.165 2.724A9.828 9.828 0 0 0 24 4.555a10.019 10.019 0 0 1-2.457 2.549z" />
              </svg>
            </Link>
          )}

          {/* Other social links with same hover effect pattern */}
          {discord && discord !== "" && (
            <Link
              href={discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-7 h-7 bg-indigo-500/80 hover:bg-indigo-600 text-white rounded-full transition-all duration-200 shadow-sm hover:shadow hover:scale-105"
              aria-label="Discord"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
            </Link>
          )}
        </div>

        {/* Profile image with enhanced styling */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 h-16 w-16 rounded-full overflow-hidden border-2 border-gray-900 shadow-lg ring-2 ring-blue-500/30 transition-all duration-300 hover:ring-blue-500/50">
          <MediaDisplay
            url={profileImgUrl}
            fallbackUrl="/placeholder-profile.png"
            alt={`${name} profile`}
            className="!static"
          />
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-col px-4 pt-10 pb-4">
        {/* Title with hover effect */}
        <h3 className="text-xl font-bold text-center mb-1 text-white leading-tight transition-colors duration-200 hover:text-blue-400">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-4 line-clamp-2 text-center">
          {description}
        </p>

        {/* Stat grid with improved styling */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-gray-800/80 rounded-lg p-3 flex flex-col hover:bg-gray-800/95 transition-colors duration-200">
            <div className="flex items-center mb-1">
              <svg
                className="w-3.5 h-3.5 text-blue-400 mr-1.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                <line x1="7" y1="7" x2="7.01" y2="7"></line>
              </svg>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                SUPPLY
              </div>
            </div>
            <div className="text-base font-bold text-white">
              {totalSupply ? totalSupply.toLocaleString() : "-"}
            </div>
          </div>
          <div className="bg-gray-800/80 rounded-lg p-3 flex flex-col hover:bg-gray-800/95 transition-colors duration-200">
            <div className="flex items-center mb-1">
              <svg
                className="w-3.5 h-3.5 text-blue-400 mr-1.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <div className="text-xs text-gray-400 uppercase tracking-wide">
                MINT DATE
              </div>
            </div>
            <div className="text-base font-bold text-white">
              {formatDate(mintDate)}
            </div>
          </div>
        </div>

        {/* Footer section with votes and CTA */}
        <div className="mt-auto flex flex-col gap-3">
          {/* Voting Section with improved styling */}
          <div className="flex items-center justify-between p-3 border-t border-gray-800/50 pt-3">
            <div className="flex gap-1.5 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"></path>
              </svg>
              <span className="text-sm text-gray-300 font-medium">
                Fluffle Score:
              </span>
            </div>

            {votes ? (
              <div className="flex items-center gap-2">
                {/* Vote buttons in a pill shape */}
                <div className="bg-gray-800/90 rounded-lg flex overflow-hidden shadow-sm border border-gray-700/50">
                  {/* Upvote */}
                  <div className="flex items-center border-r border-gray-700/50">
                    <div
                      className={`flex items-center justify-center px-2.5 py-1.5 ${
                        votes.userVote === "up"
                          ? "bg-gradient-to-r from-green-500/20 to-green-600/10 text-green-400"
                          : "text-green-500 hover:bg-gray-700/30"
                      } transition-colors duration-150`}
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
                      <span className="ml-1 text-sm font-medium">
                        {votes.upvotes}
                      </span>
                    </div>
                  </div>

                  {/* Downvote */}
                  <div className="flex items-center">
                    <div
                      className={`flex items-center justify-center px-2.5 py-1.5 ${
                        votes.userVote === "down"
                          ? "bg-gradient-to-r from-red-500/20 to-red-600/10 text-red-400"
                          : "text-red-500 hover:bg-gray-700/30"
                      } transition-colors duration-150`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill={
                          votes.userVote === "down" ? "currentColor" : "none"
                        }
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
                      <span className="ml-1 text-sm font-medium">
                        {votes.downvotes}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Use the separate component for tooltip - moved to the right of the vote buttons */}
                {hasVoteBreakdown && (
                  <div className="flex items-center justify-center w-7 h-7 bg-gray-800/90 shadow-sm hover:bg-gray-700/80 transition-colors duration-150 rounded-lg border border-gray-700/50">
                    <VoteBreakdownTooltip breakdown={voteBreakdown} />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-400 font-medium px-3 py-1.5 bg-gray-800/80 rounded-lg border border-gray-700/30">
                Unavailable
              </div>
            )}
          </div>

          {/* CTA Button with improved styling and animation */}
          <Link
            href={mintLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative overflow-hidden rounded-lg font-medium py-2.5 px-4 text-center flex items-center justify-center transition-all duration-200 shadow-sm 
              ${
                isMintLive
                  ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-blue-500/20 hover:shadow-lg hover:translate-y-[-1px]"
                  : "bg-gradient-to-r from-gray-700 to-gray-600 text-white hover:shadow-gray-700/20 hover:shadow-lg hover:translate-y-[-1px]"
              }`}
          >
            {isMintLive ? (
              <>
                <span>Mint Now</span>
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
                  className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </>
            ) : (
              <>
                <span>View Collection</span>
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
                  className="ml-2 transition-transform duration-200 group-hover:translate-x-1"
                >
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </>
            )}
          </Link>
        </div>
      </div>
    </Card>
  );
}
