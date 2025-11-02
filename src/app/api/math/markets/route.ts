import { NextResponse } from "next/server";
import tokensConfig from "@/data/math-tokens.json";

export const dynamic = "force-dynamic";

interface MarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  fully_diluted_valuation: number;
}

interface ApiResponse {
  success: boolean;
  markets: {
    [key: string]: MarketData;
  };
  meta?: {
    refreshed: string[];
    cached: { [key: string]: boolean };
    timestamp: number;
  };
}

export async function GET() {
  try {
    const tokens = tokensConfig.tokens.join(",");
    const baseUrl = process.env.TOKEN_PRICE_API;

    if (!baseUrl) {
      throw new Error("TOKEN_PRICE_API environment variable is not set");
    }

    const apiUrl = `${baseUrl}/api/markets?tokens=${tokens}`;

    // Fetch both CoinGecko data and Hyperliquid data in parallel
    const [cgResponse, hlResponse] = await Promise.all([
      fetch(apiUrl, {
        next: { revalidate: 60 }, // Cache for 60 seconds
      }),
      fetch("https://api.hyperliquid.xyz/info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "allMids" }),
        next: { revalidate: 10 }, // Cache for 10 seconds for live updates
      }),
    ]);

    if (!cgResponse.ok) {
      throw new Error(
        `CoinGecko API responded with status: ${cgResponse.status}`
      );
    }

    const data: ApiResponse = await cgResponse.json();

    // Add MEGA premarket data if available
    if (hlResponse.ok) {
      const hlData = await hlResponse.json();
      const megaPrice = parseFloat(hlData.MEGA || "0");
      const megaFdv = megaPrice * 10_000_000_000; // Price * 10 billion = FDV

      if (megaPrice > 0) {
        data.markets["mega-premarket"] = {
          id: "mega-premarket",
          symbol: "PREMARKET",
          name: "Premarket",
          image: "/math-tokens/live.webp",
          current_price: megaPrice,
          market_cap: megaFdv,
          fully_diluted_valuation: megaFdv,
        };
      }
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching market data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch market data",
        markets: {},
      },
      { status: 500 }
    );
  }
}
