"use client";

import { useState } from "react";
import VRMViewer from "./VRMViewer";
import { loadNFTModels } from "@/utils/nftLoader";
import type { NFTTrait } from "@/utils/nftLoader";

interface NFTLoaderProps {
  onLoad?: (id: string, urls: string[], traits: NFTTrait) => void;
  onError?: (error: string) => void;
}

export function NFTInput({ onLoad, onError }: NFTLoaderProps) {
  const [nftIds, setNftIds] = useState("");
  const [loading, setLoading] = useState(false);

  const validateAndParseIds = (
    input: string
  ): { validIds: string[]; errors: string[] } => {
    const ids = input
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const errors: string[] = [];
    const validIds: string[] = [];
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

      // Check for duplicates
      if (seenIds.has(id)) {
        errors.push(`Duplicate NFT ID: ${num}`);
        return;
      }

      seenIds.add(id);
      validIds.push(id);
    });

    return { validIds, errors };
  };

  const handleLoadNFTs = async () => {
    if (!nftIds.trim()) return;

    const { validIds, errors } = validateAndParseIds(nftIds);

    if (errors.length > 0) {
      onError?.(errors.join(". "));
      return;
    }

    if (validIds.length === 0) {
      onError?.("No valid NFT IDs provided");
      return;
    }

    setLoading(true);
    try {
      for (const id of validIds) {
        const { urls, traits } = await loadNFTModels(id);
        onLoad?.(id, urls, traits);
      }
      setNftIds(""); // Clear input after successful load
    } catch (err) {
      onError?.(
        err instanceof Error ? err.message : "Failed to load NFT models"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading && nftIds.trim()) {
      handleLoadNFTs();
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="nft-ids"
            className="text-sm font-medium text-foreground"
          >
            Load NFTs
          </label>
          <span className="text-xs text-muted-foreground">
            Enter IDs between 0-4999, separate multiple with commas
          </span>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              id="nft-ids"
              type="text"
              value={nftIds}
              onChange={(e) => setNftIds(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. 979, 1426, 2000"
              className="w-full bg-card border border-input rounded-xl px-4 py-3 text-[#ededed] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
              disabled={loading}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg
                  className="animate-spin h-5 w-5 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              </div>
            )}
          </div>
          <button
            onClick={handleLoadNFTs}
            disabled={loading || !nftIds.trim()}
            className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
          >
            Load
          </button>
        </div>
      </div>
    </div>
  );
}

interface NFTViewerProps {
  id: string;
  urls: string[];
  traits: NFTTrait;
  onRemove?: (id: string) => void;
}

export function NFTViewer({ id, urls, traits, onRemove }: NFTViewerProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#1a1a1a] to-[#111] border border-white/10 transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.5)]">
      {/* Dismiss Button */}
      {onRemove && (
        <button
          onClick={() => onRemove(id)}
          className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/80 backdrop-blur-sm border border-white/10 hover:bg-black hover:border-blue-500/50 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          title="Remove NFT"
        >
          <svg
            className="w-4 h-4 text-gray-400 hover:text-blue-400 transition-colors"
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
        </button>
      )}

      {/* Header Section */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">#{id}</h3>
            <div className="h-4 w-[1px] bg-white/20"></div>
            <span className="text-sm text-gray-400 font-medium">Fluffle</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/20 px-2.5 py-1 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/30">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
            </svg>
            3D Model
          </span>
        </div>
      </div>

      {/* VRM Viewer Section */}
      <div className="relative aspect-square w-full bg-[radial-gradient(circle_at_center,#1a1a1a,#111)] group-hover:bg-[radial-gradient(circle_at_center,#1a1a1a,#0f0f0f)] transition-all duration-300">
        <VRMViewer modelUrls={urls} />
        <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/10"></div>
      </div>

      {/* Traits Section */}
      <div className="p-6 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center gap-2 mb-5">
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/5">
            <svg
              className="w-3.5 h-3.5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M4 7.2L12 3l8 4.2v9.6L12 21l-8-4.2V7.2zm2 1.5v6.6l6 3.2 6-3.2V8.7l-6-3.2-6 3.2z" />
            </svg>
            <span className="text-xs font-semibold text-blue-400/90 uppercase tracking-wider">
              Traits
            </span>
          </div>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        <div className="space-y-2">
          {Object.entries(traits)
            .filter(
              ([key, value]) =>
                key.endsWith("_display_name") &&
                typeof value === "string" &&
                value !== "-1"
            )
            .map(([key, value]) => (
              <div
                key={key}
                className="group/trait flex items-center px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 hover:border-blue-500/20 transition-all duration-200"
              >
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium text-gray-400 group-hover/trait:text-blue-400 transition-colors break-words">
                    {key
                      .replace(/_display_name$/, "")
                      .replace(/([A-Z])/g, " $1")
                      .trim()
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </span>
                </div>
                <div className="ml-3 flex-shrink-0">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/5 text-xs font-medium text-white group-hover/trait:bg-blue-500/10 group-hover/trait:border-blue-500/20 transition-all whitespace-nowrap">
                    {value}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
