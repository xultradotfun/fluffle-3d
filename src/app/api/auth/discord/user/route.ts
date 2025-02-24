import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const REQUIRED_SERVER_ID = "1219739501673451551";

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

    // Check if user is in the required server
    const isServerMember = user.guildIds.includes(REQUIRED_SERVER_ID);
    console.log("Server membership:", {
      isServerMember,
      requiredServer: REQUIRED_SERVER_ID,
    });

    return NextResponse.json({
      ...user,
      canVote: isServerMember,
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
