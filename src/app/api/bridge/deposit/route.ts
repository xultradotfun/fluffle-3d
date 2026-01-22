import { NextRequest, NextResponse } from "next/server";

const BRIDGE_API_URL = process.env.NEXT_PUBLIC_API_URL;

// Community Gas Bridge limits - designed to fund gas, not for large transfers
const MIN_DEPOSIT_WEI = BigInt(150000000000000); // 0.00015 ETH
const MAX_DEPOSIT_WEI = BigInt(1500000000000000); // 0.0015 ETH

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate amount
    if (body.amountWei) {
      const amountWei = BigInt(body.amountWei);
      
      if (amountWei < MIN_DEPOSIT_WEI) {
        return NextResponse.json(
          { error: `Deposit amount too low. Minimum: 0.00015 ETH` },
          { status: 400 }
        );
      }
      
      if (amountWei > MAX_DEPOSIT_WEI) {
        return NextResponse.json(
          { error: `Deposit amount too high. Maximum: 0.0015 ETH` },
          { status: 400 }
        );
      }
    }

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
