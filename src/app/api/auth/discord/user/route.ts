import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { DISCORD_CONFIG } from "@/lib/constants";
import { validateUserData, validateServerMembership } from "@/lib/validation";
import { ErrorResponses, logError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userData = cookieStore.get("discord_user");
    const accessToken = cookieStore.get("discord_access_token");

    if (!userData || !accessToken) {
      return ErrorResponses.notAuthenticated("No authentication cookies found");
    }

    const user = JSON.parse(userData.value);

    // Verify the data format
    if (!validateUserData(user)) {
      return ErrorResponses.invalidInput("Invalid user data format");
    }

    // Get user data from database
    const dbUser = await prisma.discordUser.findUnique({
      where: { id: user.id },
    });

    // Check if user is in the required server and has the required role
    const isServerMember = validateServerMembership(user.guildIds);
    const hasRequiredRole =
      dbUser?.roles.includes(DISCORD_CONFIG.REQUIRED_ROLE_ID) ?? false;
    const canVote = isServerMember && hasRequiredRole;

    return NextResponse.json({
      ...user,
      canVote,
      roles: dbUser?.roles ?? [],
    });
  } catch (error) {
    logError(error, "discord-user-check");
    return ErrorResponses.internalError(
      error instanceof Error
        ? error.message
        : "Failed to check user authentication"
    );
  }
}
