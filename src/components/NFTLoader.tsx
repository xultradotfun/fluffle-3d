"use client";

import { useState } from "react";
import VRMViewer from "./VRMViewer";
import NFTTraits from "./NFTTraits";
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
    <div className="group relative bg-[#111] rounded-xl overflow-hidden border border-white/10 transition-all hover:border-white/20 hover:shadow-lg">
      {onRemove && (
        <button
          onClick={() => onRemove(id)}
          className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
          title="Remove NFT"
        >
          <svg
            className="w-4 h-4 text-[#ededed]"
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
      <div className="p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-[#ededed]">NFT #{id}</h2>
          <span className="inline-flex items-center rounded-full bg-blue-500/15 px-2.5 py-0.5 text-xs font-semibold text-blue-400 ring-1 ring-blue-500/25">
            VRM Model
          </span>
        </div>
        <div className="relative bg-[#1a1a1a] rounded-lg overflow-hidden shadow-inner ring-1 ring-white/5">
          <div className="aspect-square w-full">
            <VRMViewer modelUrls={urls} />
          </div>
        </div>
        <NFTTraits id={id} traits={traits} />
      </div>
    </div>
  );
}
