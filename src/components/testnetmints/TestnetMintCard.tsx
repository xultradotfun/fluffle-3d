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
              className="flex items-center justify-center w-7 h-7 bg-blue-500/80 hover:bg-blue-600/90 text-white rounded-full transition-colors shadow-sm"
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

          {discord && discord !== "" && (
            <Link
              href={discord}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-7 h-7 bg-indigo-500/80 hover:bg-indigo-600/90 text-white rounded-full transition-colors shadow-sm"
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

          {website && website !== "" && (
            <Link
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-7 h-7 bg-gray-500/80 hover:bg-gray-600/90 text-white rounded-full transition-colors shadow-sm"
              aria-label="Website"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </Link>
          )}

          {telegram && telegram !== "" && (
            <Link
              href={telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-7 h-7 bg-blue-400/80 hover:bg-blue-500/90 text-white rounded-full transition-colors shadow-sm"
              aria-label="Telegram"
            >
              <svg
                className="w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.99432,2a10,10,0,1,0,10,10A9.99917,9.99917,0,0,0,11.99432,2Zm3.17951,15.15247a.70547.70547,0,0,1-1.002.3515l-2.71467-2.10938L9.71484,17.002a.29969.29969,0,0,1-.285.03894l.334-3.23242,5.90283-5.90283a.31193.31193,0,0,0-.37573-.49219L8.73438,12.552,5.69873,11.4502a.28978.28978,0,0,1,.00361-.54394l12.54718-4.8418a.29832.29832,0,0,1,.39844.41015Z" />
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
