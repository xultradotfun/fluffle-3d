import { NextResponse } from "next/server";

const BRIDGE_API_URL = process.env.NEXT_PUBLIC_BRIDGE_API_URL;

export async function GET() {
  try {
    const bridgeUrl = `${BRIDGE_API_URL}/health`;
    console.log("🔗 Fetching bridge health from:", bridgeUrl);
    console.log("🔑 BRIDGE_API_URL env:", process.env.NEXT_PUBLIC_BRIDGE_API_URL);
    
    const response = await fetch(bridgeUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store", // Ensure fresh data
    });

    if (!response.ok) {
      console.error("❌ Bridge health response not OK:", response.status);
      throw new Error(`Failed to fetch health status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Bridge health data:", data);
    
    // Verify we got the right data structure
    if (!data.chains || !data.chains.arbitrum) {
      console.error("⚠️ Invalid bridge health response - missing chains data");
      return NextResponse.json(
        { error: "Invalid bridge health response format" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("💥 Bridge health error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bridge health status" },
      { status: 500 }
    );
  }
}
