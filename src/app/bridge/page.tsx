"use client";

import { colors } from "@/lib/colors";
import { getClipPath } from "@/lib/sizes";
import { BorderedBox } from "@/components/ui/BorderedBox";
import PageHeader from "@/components/layout/PageHeader";
import Hero from "@/components/layout/Hero";
import { ViewSwitcher } from "@/components/layout/ViewSwitcher";
import { ExternalLink, ArrowUpRight, Zap, Shield, Globe } from "lucide-react";

interface Bridge {
  name: string;
  description: string;
  url: string;
  assets: string;
  tags: string[];
  featured?: boolean;
}

const FEATURED_BRIDGES: Bridge[] = [
  {
    name: "Rabbithole",
    description:
      "LiFi-powered aggregator with fast cross-chain swaps, Lombard BTC bridging, and Halliday fiat onramping. The all-in-one portal for getting onto MegaETH.",
    url: "https://www.rabbithole.megaeth.com",
    assets: "Onchain & Fiat",
    tags: ["Aggregator", "Fiat", "BTC"],
    featured: true,
  },
  {
    name: "Stargate",
    description:
      "Cheap, secure and fast cross-chain bridging powered by LayerZero. Supports bridging out of MegaETH.",
    url: "https://stargate.finance/transfer",
    assets: "ETH, USDM, USDT0",
    tags: ["Bridge In & Out", "LayerZero"],
    featured: true,
  },
  {
    name: "DeBridge",
    description:
      "Instant, near-zero slippage bridge for bridging in and out of MegaETH across 25+ chains.",
    url: "https://app.debridge.com/r/32848",
    assets: "Solana Assets",
    tags: ["Bridge In & Out", "Solana"],
    featured: true,
  },
  {
    name: "Canonical Bridge",
    description:
      "The L1 deposit contract for MegaETH. Send any amount of ETH via native transfer. Takes ~30 min. For devs and power users.",
    url: "https://docs.megaeth.com/frontier#using-the-canonical-bridge",
    assets: "ETH",
    tags: ["Official", "Native"],
  },
  {
    name: "Jumper",
    description:
      "Powered by LiFi with the same liquidity aggregation, plus support for bridging out of MegaETH.",
    url: "https://jumper.exchange/",
    assets: "Multi-asset",
    tags: ["Bridge In & Out", "Aggregator"],
  },
  {
    name: "Lombard",
    description: "BTC to BTC.b bridging on their own dedicated frontend.",
    url: "https://www.lombard.finance/app/bridge/",
    assets: "BTC",
    tags: ["BTC"],
  },
];

interface Partner {
  name: string;
  url: string;
  note?: string;
}

const PARTNERS: Partner[] = [
  { name: "Across", url: "https://app.across.to/bridge-and-swap" },
  { name: "Relay", url: "https://relay.link/bridge" },
  {
    name: "Hyperlane",
    url: "https://nexus.hyperlane.xyz/?token=ezETH&destination=megaeth",
    note: "Renzo ezETH",
  },
  { name: "Wormhole", url: "https://portalbridge.com/" },
  { name: "XSwap", url: "https://xswap.link/bridge", note: "CCIP" },
  { name: "Interport", url: "https://app.interport.fi", note: "CCIP" },
  { name: "Gas.zip", url: "https://www.gas.zip/" },
  {
    name: "WarpX",
    url: "https://wheelx.fi/?to_chain=4326&to_token=0xFAfDdbb3FC7688494971a79cc65DCa3EF82079E7",
  },
  { name: "Avail", url: "https://fastbridge.availproject.org/megaeth" },
];

function TagBadge({ label, icon }: { label: string; icon?: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider"
      style={{
        backgroundColor: colors.foreground,
        color: colors.pink,
        clipPath: getClipPath("xs"),
      }}
    >
      {icon}
      {label}
    </span>
  );
}

function BridgeCard({ bridge }: { bridge: Bridge }) {
  const isFeatured = bridge.featured;

  return (
    <a
      href={bridge.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <BorderedBox
        cornerSize="lg"
        borderColor={isFeatured ? "pink" : "dark"}
        bgColor="dark"
        className="relative overflow-hidden transition-all duration-200"
      >
            {/* Hover overlay */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
              style={{ backgroundColor: "rgba(243, 128, 205, 0.05)" }}
            />

            <div className="relative p-5">
              {/* Header row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <h3
                    className="text-lg font-black uppercase tracking-tight truncate"
                    style={{ color: colors.background }}
                  >
                    {bridge.name}
                  </h3>
                  <ArrowUpRight
                    className="w-4 h-4 flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200"
                    style={{ color: colors.pink }}
                    strokeWidth={3}
                  />
                </div>
                <div
                  className="flex-shrink-0 px-2 py-0.5 text-[10px] font-black uppercase"
                  style={{
                    backgroundColor: isFeatured ? colors.pink : colors.background,
                    color: colors.foreground,
                    clipPath: getClipPath(3),
                  }}
                >
                  {bridge.assets}
                </div>
              </div>

              {/* Description */}
              <p
                className="text-xs font-bold leading-relaxed mb-4"
                style={{ color: colors.mutedLight }}
              >
                {bridge.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {bridge.tags.map((tag) => (
                  <TagBadge
                    key={tag}
                    label={tag}
                    icon={
                      tag === "Official" ? (
                        <Shield className="w-2.5 h-2.5" strokeWidth={3} />
                      ) : tag === "Aggregator" ? (
                        <Globe className="w-2.5 h-2.5" strokeWidth={3} />
                      ) : tag.includes("Bridge In & Out") ? (
                        <Zap className="w-2.5 h-2.5" strokeWidth={3} />
                      ) : undefined
                    }
                  />
                ))}
              </div>
            </div>
      </BorderedBox>
    </a>
  );
}

function PartnerLink({ partner }: { partner: Partner }) {
  return (
    <a
      href={partner.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-2 px-4 py-3 transition-all duration-150 hover:bg-white/5"
    >
      <span
        className="text-xs font-black uppercase flex-1"
        style={{ color: colors.background }}
      >
        {partner.name}
      </span>
      {partner.note && (
        <span
          className="text-[9px] font-bold uppercase px-1.5 py-0.5"
          style={{ backgroundColor: colors.border, color: colors.mutedLight }}
        >
          {partner.note}
        </span>
      )}
      <ExternalLink
        className="w-3 h-3 opacity-30 group-hover:opacity-100 transition-opacity"
        style={{ color: colors.pink }}
        strokeWidth={3}
      />
    </a>
  );
}

export default function BridgePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.background }}>
      <Hero />
      <ViewSwitcher activeView="bridge" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-32 py-8 pb-24">
        <PageHeader
          title="BRIDGE TO MEGAETH"
          description="Official, aggregator & asset-specific bridges to get onto MegaETH"
        />

        {/* Featured / Main Bridges */}
        <div className="mt-8">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-2 h-2"
              style={{ backgroundColor: colors.pink }}
            />
            <h2
              className="text-sm font-black uppercase tracking-wide"
              style={{ color: colors.foreground }}
            >
              Bridges
            </h2>
            <div
              className="flex-1 h-[2px]"
              style={{ backgroundColor: colors.foreground }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURED_BRIDGES.map((bridge) => (
              <BridgeCard key={bridge.name} bridge={bridge} />
            ))}
          </div>
        </div>

        {/* Partner Bridges */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-2 h-2"
              style={{ backgroundColor: colors.foreground }}
            />
            <h2
              className="text-sm font-black uppercase tracking-wide"
              style={{ color: colors.foreground }}
            >
              More Bridge Partners
            </h2>
            <div
              className="flex-1 h-[2px]"
              style={{ backgroundColor: colors.foreground }}
            />
          </div>

          <BorderedBox
            cornerSize="lg"
            borderColor="dark"
            bgColor="dark"
            className="p-2"
          >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {PARTNERS.map((partner) => (
                    <PartnerLink key={partner.name} partner={partner} />
                  ))}
                </div>
          </BorderedBox>
        </div>
      </div>
    </div>
  );
}
