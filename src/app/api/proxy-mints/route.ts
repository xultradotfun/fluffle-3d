import { NextResponse } from "next/server";

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

    // Log the structure of the response
    console.log("[Proxy] Response data structure:", {
      isArray: Array.isArray(data),
      topLevelKeys: data ? Object.keys(data) : [],
      hasPartnerCollections: data && data.partnerCollections ? true : false,
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[Proxy] Error fetching mints:", error);
    return NextResponse.json(
      { error: "Failed to fetch mints" },
      { status: 500 }
    );
  }
}
