import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { loadNFTModels } from "@/utils/nftLoader";
import type { NFTTrait } from "@/utils/nftLoader";

interface NFTInputProps {
  onLoad?: (id: string, urls: string[], traits: NFTTrait) => void;
  onError?: (error: string) => void;
  loadedIds?: string[];
}

export function NFTInput({ onLoad, onError, loadedIds = [] }: NFTInputProps) {
  const [nftIds, setNftIds] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const validateAndParseIds = (
    input: string
  ): { validIds: string[]; errors: string[]; duplicates: string[] } => {
    const ids = input
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const errors: string[] = [];
    const validIds: string[] = [];
    const duplicates: string[] = [];
    const seenIds = new Set<string>();

    ids.forEach((id) => {
      // Check if it's a valid number
      const num = parseInt(id);
      if (isNaN(num)) {
        errors.push(`"${id}" is not a valid number`);
        return;
      }

      // Check range
      if (num < 0 || num > 4999) {
        errors.push(
          `NFT ID ${num} is out of range (must be between 0 and 4999)`
        );
        return;
      }

      // Check for duplicates in current input
      if (seenIds.has(id)) {
        duplicates.push(id);
        return;
      }

      // Check if NFT is already loaded
      if (loadedIds.includes(id)) {
        duplicates.push(id);
        return;
      }

      seenIds.add(id);
      validIds.push(id);
    });

    return { validIds, errors, duplicates };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNftIds(value);
    setShowSuggestions(value.trim() !== "");

    if (value.trim()) {
      const { errors, duplicates } = validateAndParseIds(value);
      setIsValid(errors.length === 0);
    } else {
      setIsValid(null);
      setShowSuggestions(false);
    }
  };

  const handleInputFocus = () => {
    if (nftIds.trim()) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding suggestions to allow clicking them
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const handleLoadNFTs = async () => {
    if (!nftIds.trim()) return;

    const { validIds, errors, duplicates } = validateAndParseIds(nftIds);

    if (errors.length > 0) {
      onError?.(errors.join(". "));
      return;
    }

    if (duplicates.length > 0 && validIds.length === 0) {
      onError?.(`NFT ID(s) ${duplicates.join(", ")} already loaded`);
      setNftIds("");
      return;
    }

    if (validIds.length === 0) {
      onError?.("No valid NFT IDs provided");
      return;
    }

    if (duplicates.length > 0) {
      onError?.(`Skipping already loaded NFT ID(s): ${duplicates.join(", ")}`);
    }

    setLoading(true);
    try {
      for (const id of validIds) {
        const { urls, traits } = await loadNFTModels(id);
        onLoad?.(id, urls, traits);
      }
      setNftIds(""); // Clear input after successful load
      setIsValid(null);
      setShowSuggestions(false);
    } catch (err) {
      onError?.(
        err instanceof Error ? err.message : "Failed to load NFT models"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading && nftIds.trim() && isValid) {
      handleLoadNFTs();
    }
  };

  const getRandomNFTIds = () => {
    const availableIds = Array.from({ length: 5000 }, (_, i) =>
      i.toString()
    ).filter((id) => !loadedIds.includes(id));
    return availableIds
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .join(", ");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNftIds(suggestion);
    setShowSuggestions(false);
    setIsValid(true);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-white">Load NFTs</h2>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
              <svg
                className="w-3.5 h-3.5 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-xs font-medium text-gray-400">
                IDs: 0-4999
              </span>
            </div>
          </div>
          <Badge variant="secondary" size="sm" className="font-mono">
            {loadedIds.length}/5000
          </Badge>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Input
              id="nft-ids"
              value={nftIds}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder="Enter NFT IDs (e.g. 979, 1426, 2000)"
              disabled={loading}
              className={`pr-10 transition-all duration-200 ${
                isValid === true
                  ? "border-green-500/30 focus:ring-green-500/30"
                  : isValid === false
                  ? "border-red-500/30 focus:ring-red-500/30"
                  : "hover:border-blue-500/30 focus:border-blue-500/30 focus:ring-blue-500/30"
              }`}
            />
            {nftIds && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {isValid === true && (
                  <svg
                    className="w-5 h-5 text-green-500 animate-fade-in"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {isValid === false && (
                  <svg
                    className="w-5 h-5 text-red-500 animate-fade-in"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
            )}
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <svg
                className="w-3.5 h-3.5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              <span>Separate multiple IDs with commas</span>
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && (
              <div className="absolute z-50 left-0 right-0 mt-12 py-2 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-lg animate-fade-in">
                <div className="px-3 py-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-400">
                      Quick Actions
                    </span>
                    <Badge variant="secondary" size="sm">
                      Try these
                    </Badge>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => handleSuggestionClick(getRandomNFTIds())}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 group"
                    >
                      <svg
                        className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      Random NFTs
                    </button>
                    <button
                      onClick={() => handleSuggestionClick("0")}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 group"
                    >
                      <svg
                        className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                        />
                      </svg>
                      Genesis NFT (#0)
                    </button>
                    <button
                      onClick={() => handleSuggestionClick("4999")}
                      className="w-full text-left px-3 py-2 text-sm text-white hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 group"
                    >
                      <svg
                        className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      Last NFT (#4999)
                    </button>
                  </div>
                </div>
                <div className="px-3 pt-2 mt-2 border-t border-white/5">
                  <p className="text-xs text-gray-500">
                    {loadedIds.length > 0
                      ? `${loadedIds.length} NFT${
                          loadedIds.length > 1 ? "s" : ""
                        } already loaded`
                      : "No NFTs loaded yet"}
                  </p>
                </div>
              </div>
            )}
          </div>
          <Button
            onClick={handleLoadNFTs}
            disabled={loading || !nftIds.trim() || isValid === false}
            isLoading={loading}
            className="px-8"
          >
            Load
          </Button>
        </div>
      </div>
    </div>
  );
}
