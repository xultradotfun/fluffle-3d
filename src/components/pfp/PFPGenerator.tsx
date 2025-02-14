"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { NFTInput } from "@/components/nft/NFTInput";
import type { NFTTrait } from "@/utils/nftLoader";

export function PFPGenerator() {
  const [selectedNFT, setSelectedNFT] = useState<{
    id: string;
    traits: NFTTrait;
  } | null>(null);
  const [error, setError] = useState("");

  const handleNFTLoad = (id: string, _urls: string[], traits: NFTTrait) => {
    setSelectedNFT({ id, traits });
    setError("");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">PFP Generator</h2>
          <p className="text-gray-400 text-sm">
            Create unique profile pictures from your Fluffle NFTs.
          </p>
        </div>
        {selectedNFT && (
          <Badge variant="primary" size="md">
            NFT #{selectedNFT.id} Selected
          </Badge>
        )}
      </div>

      {/* NFT Selection */}
      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                Select Your NFT
              </h3>
              <p className="text-sm text-gray-400">
                Enter your Fluffle NFT ID to get started
              </p>
            </div>
          </div>

          <NFTInput
            onLoad={handleNFTLoad}
            onError={setError}
            loadedIds={selectedNFT ? [selectedNFT.id] : []}
            maxNFTs={1}
          />

          {error && (
            <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>
      </Card>

      {/* Style Options */}
      {selectedNFT && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preview Card */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Preview</h3>
                  <p className="text-sm text-gray-400">
                    See how your PFP will look
                  </p>
                </div>
              </div>

              <div className="aspect-square rounded-xl bg-white/5 border border-white/10">
                {/* Preview will go here */}
              </div>
            </div>
          </Card>

          {/* Style Options Card */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Style Options
                  </h3>
                  <p className="text-sm text-gray-400">Customize your PFP</p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Style options will go here */}
                <div className="opacity-60 select-none">
                  <p className="text-center text-sm text-gray-400 mt-8">
                    Style options coming soon!
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <Button disabled>Generate PFP</Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Empty State */}
      {!selectedNFT && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6 ring-1 ring-white/10">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            No NFT Selected
          </h3>
          <p className="text-gray-400 max-w-sm mx-auto">
            Select a Fluffle NFT above to start generating your custom profile
            picture.
          </p>
        </div>
      )}
    </div>
  );
}
