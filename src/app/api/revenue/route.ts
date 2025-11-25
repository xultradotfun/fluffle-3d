import { NextResponse } from "next/server";
import { WHITELISTED_CHAINS } from "@/data/revenue-chains";

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
  try {
    const response = await fetch(
      "https://api.llama.fi/overview/fees?excludeTotalDataChart=true&excludeTotalDataChartBreakdown=true&dataType=dailyRevenue",
      {
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch data from DefiLlama");
    }

    const data = await response.json();

    // Filter for chains and map to our format
    const chains = data.protocols
      .filter((p: any) => {
        const isChain = p.category === "Chain" || p.category === "L1" || p.category === "Rollup";
        const isWhitelisted = WHITELISTED_CHAINS.includes(p.name);
        return isChain && isWhitelisted;
      })
      .map((chain: any) => ({
        name: chain.name,
        logo: chain.logo,
        total24h: chain.total24h || 0,
        total30d: chain.total30d || 0,
      }))
      .sort((a: any, b: any) => b.total24h - a.total24h);

    return NextResponse.json(chains);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}
