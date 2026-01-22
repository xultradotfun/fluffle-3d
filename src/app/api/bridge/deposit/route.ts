import { NextRequest, NextResponse } from "next/server";

const BRIDGE_API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(`${BRIDGE_API_URL}/deposit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 409) {
        return NextResponse.json(
          {
            success: true,
            message: data.error || "Deposit already recorded",
          },
          { status: 200 }
        );
      }
      return NextResponse.json(
        { error: data.error || "Failed to submit deposit" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Bridge deposit error:", error);
    return NextResponse.json(
      { error: "Failed to submit deposit" },
      { status: 500 }
    );
  }
}
