/**
 * Media and formatting utilities for mint cards
 * Extracted from TestnetMintCard for reusability
 */

/**
 * Format dates for mint display
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

/**
 * Check if image URL is animated (GIF, WEBP)
 */
export const isAnimatedImage = (url: string): boolean => {
  const ext = url.split(".").pop()?.toLowerCase();
  return ext === "gif" || ext === "webp";
};

/**
 * Check if media is a video based on URL or media type
 */
export const isVideo = (url: string, mediaType?: string): boolean => {
  if (mediaType && mediaType.startsWith("video/")) {
    return true;
  }

  const ext = url.split(".").pop()?.toLowerCase();
  return ext === "mp4" || ext === "webm" || ext === "mov";
};

/**
 * Get media URL for IPFS or regular URLs
 */
export const getMediaUrl = (media: { type: string; url: string }): string => {
  if (media.url.startsWith("http")) {
    return media.url;
  }
  // For relative URLs from Rarible
  return `https://testnet.rarible.fun${media.url}`;
};

/**
 * Calculate time remaining until a timestamp
 */
export const calculateTimeLeft = (timestamp: number) => {
  const difference = timestamp * 1000 - Date.now();

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
