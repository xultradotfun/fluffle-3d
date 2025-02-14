"use client";

export default function Hero() {
  return (
    <section className="relative overflow-hidden py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,rgba(59,130,246,0.08),transparent)]" />
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <h1 className="text-3xl font-bold text-white">Fluffle 3D Viewer</h1>
          <a
            href="https://opensea.io/collection/fluffle"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-blue-500/10 px-3 py-1 text-sm font-medium text-blue-400 ring-1 ring-blue-500/20 hover:bg-blue-500/20 transition-colors"
          >
            View on OpenSea
          </a>
        </div>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Enter your Fluffle NFT ID below to view it in 3D. Experience your
          character with full animations and interactive controls.
        </p>
        <div className="mt-4 flex items-center justify-center gap-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span>5,000 NFTs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span>100+ Traits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
            <span>VRM Models</span>
          </div>
        </div>
      </div>
    </section>
  );
}
