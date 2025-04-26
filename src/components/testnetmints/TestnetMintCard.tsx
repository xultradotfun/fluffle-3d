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
    year: "numeric",
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

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setShowTooltip(!showTooltip)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-700 hover:bg-gray-600 focus:outline-none transition-colors"
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
        >
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      </button>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute z-50 bottom-full right-0 mb-2 min-w-[240px] bg-gray-800 rounded-md shadow-lg border border-gray-700 text-white text-xs overflow-hidden"
        >
          {/* Header */}
          <div className="px-3 py-2 bg-gray-700 border-b border-gray-600">
            <h4 className="font-medium text-white">Vote Breakdown</h4>
          </div>

          {/* Content */}
          <div className="p-2">
            <div className="space-y-1">
              {Object.entries(breakdown).map(([role, counts]) => (
                <div
                  key={role}
                  className="flex justify-between items-center py-1"
                >
                  <span className="font-medium text-white truncate mr-2">
                    {role}
                  </span>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-green-400 font-medium whitespace-nowrap">
                      ▲ {counts.up}
                    </span>
                    <span className="text-gray-500 mx-0.5">/</span>
                    <span className="text-red-400 font-medium whitespace-nowrap">
                      ▼ {counts.down}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrow */}
          <div className="absolute bottom-[-8px] right-[6px] transform rotate-45 h-4 w-4 bg-gray-800 border-r border-b border-gray-700"></div>
        </div>
      )}
    </div>
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
        badgeClass: "bg-gray-700 text-gray-100",
        text: "SOLD OUT",
      };
    } else if (isMintLive) {
      return {
        badgeClass: "bg-green-600 text-white",
        text: "LIVE",
      };
    } else {
      return {
        badgeClass: "bg-amber-500 text-white",
        text: "UPCOMING",
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
    <Card className="overflow-hidden border-0 bg-gray-900/95 rounded-lg shadow-md">
      {/* Header section with image */}
      <div className="relative">
        {/* Status indicators */}
        <div className="absolute top-3 left-3 z-10">
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.badgeClass}`}
          >
            {statusConfig.text}
            {isMintLive && (
              <span className="ml-1.5 h-2 w-2 rounded-full bg-white inline-block animate-pulse"></span>
            )}
          </div>
        </div>

        {/* Countdown for upcoming projects */}
        {isUpcoming &&
          timeLeft &&
          timeLeft.days + timeLeft.hours + timeLeft.minutes + timeLeft.seconds >
            0 && (
            <div className="absolute top-3 right-3 z-10 bg-black/60 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
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

        {/* Header Image */}
        <div className="relative h-40 w-full overflow-hidden">
          <Image
            src={headerImgUrl || "/placeholder-header.png"}
            alt={`${name} header`}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80"></div>
        </div>

        {/* Social links in banner */}
        <div className="absolute bottom-3 right-3 z-10 flex gap-2">
          {twitter && twitter !== "" && (
            <Link
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-7 h-7 bg-blue-500/80 hover:bg-blue-600/90 text-white rounded-full transition-colors"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Link>
          )}

          {discord && discord !== "" && (
            <Link
              href={discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-7 h-7 bg-indigo-500/80 hover:bg-indigo-600/90 text-white rounded-full transition-colors"
              aria-label="Discord"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
                <path d="M15 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"></path>
                <path d="M8.6 19.5 5 17.4l.3-2.9c-.3-.2-1-1.3-1.5-2.5-.8-1.7-.8-3.8 0-6 2-5 6-5 8.1-5h.2c2.2 0 6.1 0 8.1 5 .5 1.3.8 2.5.8 3.8.1 1.3-.4 2.5-.9 3.4l-.6 1 .4 2.8-4.4 2.5"></path>
                <path d="M8.5 14.5s1.5 2 3.5 2 3.5-2 3.5-2"></path>
                <path d="M7 17c2 2 6.5 2.5 10 0"></path>
              </svg>
            </Link>
          )}

          {website && website !== "" && (
            <Link
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-7 h-7 bg-gray-500/80 hover:bg-gray-600/90 text-white rounded-full transition-colors"
              aria-label="Website"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
                <path d="M2 12h20"></path>
                <path d="M12 2v20"></path>
              </svg>
            </Link>
          )}
        </div>

        {/* Profile image */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 h-16 w-16 rounded-full overflow-hidden border-2 border-gray-900 shadow-lg">
          <Image
            src={profileImgUrl || "/placeholder-profile.png"}
            alt={`${name} profile`}
            width={64}
            height={64}
            className="object-cover"
          />
        </div>
      </div>

      {/* Content section */}
      <div className="flex flex-col px-4 pt-10 pb-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-center mb-1 text-white">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-400 mb-3 line-clamp-2 text-center">
          {description}
        </p>

        {/* Stat grid */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="bg-gray-800/80 rounded-lg p-2">
            <div className="text-xs text-gray-400 uppercase">SUPPLY</div>
            <div className="text-lg font-bold text-white">
              {totalSupply.toLocaleString()}
            </div>
          </div>
          <div className="bg-gray-800/80 rounded-lg p-2">
            <div className="text-xs text-gray-400 uppercase">MINT DATE</div>
            <div className="text-sm font-bold text-white">
              {formatDate(mintDate)}
            </div>
          </div>
        </div>

        {/* Footer section with votes and CTA */}
        <div className="mt-auto flex flex-col gap-3">
          {/* Voting Section */}
          <div className="flex items-center justify-between p-3 border-t border-gray-800 pt-3">
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
                <div className="bg-gray-800/80 rounded-full flex overflow-hidden shadow-sm border border-gray-700">
                  {/* Upvote */}
                  <div className="flex items-center border-r border-gray-700">
                    <div
                      className={`flex items-center justify-center px-2 py-1 ${
                        votes.userVote === "up"
                          ? "text-green-500 bg-green-500/10"
                          : "text-green-500"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
                      className={`flex items-center justify-center px-2 py-1 ${
                        votes.userVote === "down"
                          ? "text-red-500 bg-red-500/10"
                          : "text-red-500"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
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
                  <VoteBreakdownTooltip breakdown={voteBreakdown} />
                )}
              </div>
            ) : (
              <div className="text-sm text-gray-400 font-medium">
                Unavailable
              </div>
            )}
          </div>

          {/* CTA Button */}
          <Link
            href={mintLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative overflow-hidden rounded-lg font-medium py-2.5 px-4 text-center flex items-center justify-center ${
              isMintLive ? "bg-blue-600 text-white" : "bg-gray-700 text-white"
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
                  className="ml-2"
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
                  className="ml-2"
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
