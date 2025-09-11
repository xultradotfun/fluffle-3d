import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
import { DISCORD_CONFIG, JWT_CONFIG } from "@/lib/constants";
import { validateUserData, validateServerMembership } from "@/lib/validation";
import { ErrorResponses, logError } from "@/lib/errors";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

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
      return ErrorResponses.notAuthenticated();
    }

    // Verify Discord token is still valid
    const tokenResponse = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    if (!tokenResponse.ok) {
      return ErrorResponses.invalidToken("Discord token validation failed");
    }

    const user = JSON.parse(userData.value);

    // Verify user data format
    if (!validateUserData(user)) {
      return ErrorResponses.invalidInput("Invalid user data format");
    }

    // Verify server membership
    if (!validateServerMembership(user.guildIds)) {
      return ErrorResponses.serverMembershipRequired();
    }

    // Get user from database to get latest roles
    const dbUser = await prisma.discordUser.findUnique({
      where: { id: user.id },
      select: { id: true, username: true, roles: true },
    });

    if (!dbUser) {
      return ErrorResponses.userNotFound();
    }

    // Verify username matches to prevent ID spoofing
    if (dbUser.username !== user.username) {
      return ErrorResponses.userDataMismatch();
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
      JWT_CONFIG.SECRET
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
    logError(error, "auth-token-generation");
    return ErrorResponses.internalError("Failed to generate auth token");
  }
}
