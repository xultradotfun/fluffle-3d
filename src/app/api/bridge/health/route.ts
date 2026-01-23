import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const BRIDGE_API_URL = process.env.NEXT_PUBLIC_BRIDGE_API_URL;

export async function GET() {
  try {
    const response = await fetch(`${BRIDGE_API_URL}/health`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch health status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Bridge health error:", error);
    return NextResponse.json(
      { error: "Failed to fetch bridge health status" },
      { status: 500 }
    );
  }
}
