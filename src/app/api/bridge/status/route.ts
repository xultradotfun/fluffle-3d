import { NextRequest, NextResponse } from "next/server";

const BRIDGE_API_URL = process.env.NEXT_PUBLIC_BRIDGE_API_URL;

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const arbTx = searchParams.get("arbTx");

    if (!arbTx) {
      return NextResponse.json(
        { error: "Missing arbTx parameter" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${BRIDGE_API_URL}/status?arbTx=${arbTx}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.error || "Failed to fetch deposit status" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Bridge status error:", error);
    return NextResponse.json(
      { error: "Failed to fetch deposit status" },
      { status: 500 }
    );
  }
}
