import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loadNFTModels } from "@/utils/nftLoader";
import type { NFTTrait } from "@/utils/nftLoader";

interface NFTInputProps {
  onLoad?: (id: string, urls: string[], traits: NFTTrait) => void;
  onError?: (error: string) => void;
}

export function NFTInput({ onLoad, onError }: NFTInputProps) {
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
    <div className="flex gap-3">
      <Input
        id="nft-ids"
        value={nftIds}
        onChange={(e) => setNftIds(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="e.g. 979, 1426, 2000"
        disabled={loading}
        label="Load NFTs"
        helperText="Enter IDs between 0-4999, separate multiple with commas"
      />
      <Button
        onClick={handleLoadNFTs}
        disabled={loading || !nftIds.trim()}
        isLoading={loading}
      >
        Load
      </Button>
    </div>
  );
}
