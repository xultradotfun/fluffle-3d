import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

const JWT_SECRET =
  process.env.JWT_SECRET || "fluffle-default-secret-change-in-production";
const REQUIRED_SERVER_ID = "1219739501673451551";

/**
 * GET /api/auth/token
 * Generate JWT token for authenticated user to use with backend
 */
export async function GET() {
  try {
    const cookieStore = cookies();
    const userData = cookieStore.get("discord_user");
    const accessToken = cookieStore.get("discord_access_token");

    if (!userData || !accessToken) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Verify Discord token is still valid
    const tokenResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    if (!tokenResponse.ok) {
      return NextResponse.json(
        { error: "Invalid Discord token" },
        { status: 401 }
      );
    }

    const user = JSON.parse(userData.value);

    // Verify user data format
    if (!user.id || !user.username || !Array.isArray(user.guildIds)) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    // Verify server membership
    if (!user.guildIds.includes(REQUIRED_SERVER_ID)) {
      return NextResponse.json(
        { error: "Server membership required" },
        { status: 403 }
      );
    }

    // Get user from database to get latest roles
    const dbUser = await prisma.discordUser.findUnique({
      where: { id: user.id },
      select: { id: true, username: true, roles: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }

    // Verify username matches to prevent ID spoofing
    if (dbUser.username !== user.username) {
      return NextResponse.json(
        { error: "User data mismatch" },
        { status: 403 }
      );
    }

    // Create JWT token with user info
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        roles: dbUser.roles,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour expiry
      },
      JWT_SECRET
    );

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        roles: dbUser.roles,
      },
    });
  } catch (error) {
    console.error("Error generating auth token:", error);
    return NextResponse.json(
      { error: "Failed to generate auth token" },
      { status: 500 }
    );
  }
}
