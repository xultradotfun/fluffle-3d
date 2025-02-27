import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const REQUIRED_SERVER_ID = "1219739501673451551";
const REQUIRED_ROLE_ID = "1227046192316285041";

export async function GET() {
  try {
    const cookieStore = cookies();
    const userData = cookieStore.get("discord_user");
    const accessToken = cookieStore.get("discord_access_token");

    console.log("Checking auth status...");
    console.log("Cookies present:", {
      userData: !!userData,
      accessToken: !!accessToken,
    });

    if (!userData || !accessToken) {
      console.log("Missing required cookies");
      return new NextResponse(JSON.stringify({ error: "Not authenticated" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const user = JSON.parse(userData.value);
    console.log("User authenticated:", {
      id: user.id,
      username: user.username,
      guildCount: user.guildIds?.length || 0,
    });

    // Verify the data format
    if (!user.id || !user.username || !Array.isArray(user.guildIds)) {
      throw new Error("Invalid user data format");
    }

    // Get user data from database
    const dbUser = await prisma.discordUser.findUnique({
      where: { id: user.id },
    });

    // Check if user is in the required server and has the required role
    const isServerMember = user.guildIds.includes(REQUIRED_SERVER_ID);
    const hasRequiredRole = dbUser?.roles.includes(REQUIRED_ROLE_ID) ?? false;
    const canVote = isServerMember && hasRequiredRole;

    console.log("Authorization check:", {
      isServerMember,
      hasRequiredRole,
      canVote,
      requiredServer: REQUIRED_SERVER_ID,
      requiredRole: REQUIRED_ROLE_ID,
      storedRoles: dbUser?.roles,
    });

    return NextResponse.json({
      ...user,
      canVote,
      roles: dbUser?.roles ?? [],
    });
  } catch (error) {
    console.error("Error processing user data:", error);
    return new NextResponse(JSON.stringify({ error: "Invalid user data" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
