"use client";

import { useState } from "react";
import { NFTInput, NFTViewer } from "@/components/NFTLoader";
import type { NFTTrait } from "@/utils/nftLoader";

interface ViewerData {
  id: string;
  urls: string[];
  traits: NFTTrait;
  timestamp: number;
}

export default function Home() {
  const [viewers, setViewers] = useState<ViewerData[]>([]);
  const [error, setError] = useState("");

  const handleNFTLoad = (id: string, urls: string[], traits: NFTTrait) => {
    setViewers((prev) => [
      ...prev,
      { id, urls, traits, timestamp: Date.now() },
    ]);
    setError("");
  };

  const handleNFTError = (error: string) => {
    setError(error);
  };

  const handleRemoveViewer = (id: string, timestamp?: number) => {
    setViewers((prev) =>
      prev.filter(
        (viewer) => !(viewer.id === id && viewer.timestamp === timestamp)
      )
    );
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-20">
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.primary.100/0.1),transparent)]" />
        <div className="absolute inset-y-0 right-1/2 -z-10 mr-16 w-[200%] origin-bottom-left skew-x-[-30deg] bg-background shadow-xl shadow-primary/10 ring-1 ring-primary/10" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
              3D NFT Viewer
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Explore your NFTs in stunning 3D. View models, animations, and
              traits in an interactive environment.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="relative -mt-10 z-10">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl bg-card shadow-lg ring-1 ring-primary/5">
            <div className="p-6">
              <NFTInput onLoad={handleNFTLoad} onError={handleNFTError} />
              {error && (
                <div className="mt-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive-foreground">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-16 flex-grow">
        {viewers.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-foreground">Your NFTs</h2>
              <span className="inline-flex items-center rounded-full bg-secondary px-4 py-1.5 text-sm text-secondary-foreground ring-1 ring-inset ring-secondary/30">
                {viewers.length} loaded
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {viewers.map(({ id, urls, traits, timestamp }) => (
                <NFTViewer
                  key={`${id}-${timestamp}`}
                  id={id}
                  urls={urls}
                  traits={traits}
                  onRemove={() => handleRemoveViewer(id, timestamp)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6">
              <svg
                className="w-10 h-10 text-secondary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No NFTs Loaded
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Enter an NFT ID above to view its 3D model and traits. You can
              load multiple NFTs at once.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-8 bg-background mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">3D NFT Viewer</span>
            <a
              href="https://github.com/yourusername/your-repo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
