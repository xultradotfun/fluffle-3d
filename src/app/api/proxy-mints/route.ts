import { NextResponse } from "next/server";

// Helper function to check if a collection is on MegaETH
const isMegaETHCollection = (collection: any): boolean => {
  if (!collection?.chain?.chain_id) return false;
  const chainId = collection.chain.chain_id;
  return chainId === 6342 || String(chainId) === "6342";
};

export async function GET() {
  try {
    const apiUrl = "https://kingdomly.app/api/fetchPartnerMints";
    const apiKey = process.env.KINGDOMLY_API_KEY;

    if (!apiKey) {
      console.error(
        "[Proxy] API key is missing. Please set KINGDOMLY_API_KEY in your environment variables."
      );
      return NextResponse.json(
        { error: "API key configuration is missing" },
        { status: 500 }
      );
    } else {
      console.log(
        "[Proxy] Using API key:",
        apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4)
      );
    }

    console.log(`[Proxy] Fetching mints from: ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "API-Key": apiKey,
        Accept: "application/json",
        "Cache-Control": "no-cache",
      },
      redirect: "follow",
      next: { revalidate: 0 },
    });

    if (!response.ok) {
      console.error(`[Proxy] API responded with status: ${response.status}`);
      return NextResponse.json(
        { error: `API responded with status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log(
      `[Proxy] Successfully retrieved ${
        Array.isArray(data) ? data.length : 0
      } mints`
    );

    // Filter for MegaETH collections and structure the response
    if (data && data.partnerCollections) {
      const filteredData = {
        partnerCollections: {
          live: (data.partnerCollections.live || []).filter(
            isMegaETHCollection
          ),
          upcoming: (data.partnerCollections.upcoming || []).filter(
            isMegaETHCollection
          ),
          sold_out: (data.partnerCollections.sold_out || []).filter(
            isMegaETHCollection
          ),
        },
      };

      console.log("[Proxy] MegaETH collections found:", {
        live: filteredData.partnerCollections.live.length,
        upcoming: filteredData.partnerCollections.upcoming.length,
        sold_out: filteredData.partnerCollections.sold_out.length,
      });

      return NextResponse.json(filteredData);
    }

    // If data structure is different, try to filter at top level
    if (Array.isArray(data)) {
      const filteredData = {
        partnerCollections: {
          live: data.filter(isMegaETHCollection),
          upcoming: [],
          sold_out: [],
        },
      };

      console.log(
        "[Proxy] MegaETH collections found:",
        filteredData.partnerCollections.live.length
      );
      return NextResponse.json(filteredData);
    }

    // If we can't process the data, return empty collections
    return NextResponse.json({
      partnerCollections: {
        live: [],
        upcoming: [],
        sold_out: [],
      },
    });
  } catch (error) {
    console.error("[Proxy] Error fetching mints:", error);
    return NextResponse.json(
      { error: "Failed to fetch mints" },
      { status: 500 }
    );
  }
}
