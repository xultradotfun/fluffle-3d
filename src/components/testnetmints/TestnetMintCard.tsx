import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

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
}

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
  const [isHovered, setIsHovered] = useState(false);

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

  const hasTimeLeft =
    timeLeft.days > 0 ||
    timeLeft.hours > 0 ||
    timeLeft.minutes > 0 ||
    timeLeft.seconds > 0;

  // Status config based on mint status
  const getStatusConfig = () => {
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
  };

  const statusConfig = getStatusConfig();

  return (
    <Card className="overflow-hidden border-0 bg-gray-900/95 rounded-lg shadow-md">
      {/* Header section with image */}
      <div className="relative">
        {/* Status indicator */}
        <div className="absolute top-3 left-3 z-10">
          <div
            className={`px-4 py-1 rounded-full text-xs font-bold ${statusConfig.badgeClass}`}
          >
            {statusConfig.text}
            {isMintLive && (
              <span className="ml-1.5 h-2 w-2 rounded-full bg-white inline-block animate-pulse"></span>
            )}
          </div>
        </div>

        {/* Chain Badge */}
        <div className="absolute top-3 right-3 z-10">
          <Badge className="bg-black/70 text-white border-0 font-medium px-3 py-1 rounded-full">
            {chain.includes("Testnet") ? "Testnet" : chain}
          </Badge>
        </div>

        {/* Twitter link in banner (if available) */}
        {twitter && twitter !== "" && (
          <div className="absolute bottom-3 right-3 z-10">
            <Link
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-8 h-8 bg-blue-500/80 hover:bg-blue-600/90 text-white rounded-full transition-colors"
              aria-label="Twitter"
            >
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
              >
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </Link>
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

        {/* Mint groups */}
        {mintGroups.length > 0 && (
          <div className="space-y-2 mb-3">
            {mintGroups.map((group, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-800/80"
              >
                <div>
                  <div className="font-medium text-white">{group.name}</div>
                  <div className="text-xs text-gray-400">
                    {group.size.toLocaleString()} items
                  </div>
                </div>
                <div className="text-blue-400 font-bold">{group.price} ETH</div>
              </div>
            ))}
          </div>
        )}

        {/* Footer section with action and social links */}
        <div className="mt-auto">
          {/* Social links */}
          {((discord && discord !== "") ||
            (website && website !== "") ||
            (telegram && telegram !== "")) && (
            <div className="flex justify-center gap-4 mb-3">
              {discord && discord !== "" && (
                <Link
                  href={discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-indigo-400 transition-colors"
                  aria-label="Discord"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="12" r="1"></circle>
                    <circle cx="15" cy="12" r="1"></circle>
                    <path d="M7.5 7.5c3.5-1 5.5-1 9 0"></path>
                    <path d="M7.5 16.5c3.5 1 5.5 1 9 0"></path>
                    <path d="M15.5 17c0 1 1.5 3 2 3 1.5 0 2.833-1.667 3.5-3 .667-1.667.5-5.833 0-7-1.5-3.5-3-4.5-3-4.5"></path>
                    <path d="M8.5 17c0 1-1.356 3-1.832 3-1.429 0-2.698-1.667-3.333-3-.635-1.667-.476-5.833 0-7C4.762 6.5 6.258 5.5 6.258 5.5"></path>
                    <path d="M12 4c-2.667 0-8 1.333-8 10s5.333 10 8 10c2.667 0 8-1.333 8-10s-5.333-10-8-10Z"></path>
                  </svg>
                </Link>
              )}
              {website && website !== "" && (
                <Link
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                  aria-label="Website"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </Link>
              )}
              {telegram && telegram !== "" && (
                <Link
                  href={telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-400 transition-colors"
                  aria-label="Telegram"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21.5 4.5L2.5 12.5L11.5 14.5L14.5 21.5L21.5 4.5" />
                    <path d="M11.5 14.5L16.5 10.5" />
                  </svg>
                </Link>
              )}
            </div>
          )}

          {/* CTA Button */}
          <Link
            href={mintLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`relative overflow-hidden rounded-lg font-medium py-2.5 px-4 text-center flex items-center justify-center ${
              isSoldOut
                ? "bg-gray-700 text-white"
                : isMintLive
                ? "bg-blue-600 text-white"
                : "bg-amber-600 text-white"
            }`}
          >
            {isSoldOut ? (
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
            ) : isMintLive ? (
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
                <span>Get Notified</span>
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
                  <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
                  <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
                </svg>
              </>
            )}
          </Link>
        </div>
      </div>
    </Card>
  );
}
