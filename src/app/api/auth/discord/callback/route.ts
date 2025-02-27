import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/utils/baseUrl";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = `${getBaseUrl()}/api/auth/discord/callback`;
const REQUIRED_SERVER_ID = "1219739501673451551";
const REQUIRED_ROLE_ID = "1227046192316285041";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return new NextResponse("No code provided", { status: 400 });
  }

  if (!DISCORD_CLIENT_ID || !DISCORD_CLIENT_SECRET) {
    return new NextResponse("Discord credentials not configured", {
      status: 500,
    });
  }

  try {
    console.log("Exchanging code for token...");

    // Exchange code for access token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID,
        client_secret: DISCORD_CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
      }).toString(),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token response error:", errorData);
      throw new Error(`Failed to get access token: ${errorData}`);
    }

    const tokenData = await tokenResponse.json();
    console.log("Token exchange successful");

    // Get user data
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      const errorData = await userResponse.text();
      console.error("User data error:", errorData);
      throw new Error("Failed to get user data");
    }

    const userData = await userResponse.json();
    console.log("User data fetched successfully");

    // Get user's guilds
    const guildsResponse = await fetch(
      "https://discord.com/api/users/@me/guilds",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    if (!guildsResponse.ok) {
      const errorData = await guildsResponse.text();
      console.error("Guilds data error:", errorData);
      throw new Error("Failed to get guilds data");
    }

    const guildsData = await guildsResponse.json();
    console.log("Guilds data fetched successfully");

    // Check if user is in the required server
    const isInServer = guildsData.some(
      (guild: any) => guild.id === REQUIRED_SERVER_ID
    );
    let hasRequiredRole = false;

    if (isInServer) {
      // Get member data for the required server
      const memberResponse = await fetch(
        `https://discord.com/api/v10/guilds/${REQUIRED_SERVER_ID}/members/${userData.id}`,
        {
          headers: {
            Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          },
        }
      );

      if (memberResponse.ok) {
        const memberData = await memberResponse.json();
        hasRequiredRole = memberData.roles.includes(REQUIRED_ROLE_ID);
        console.log("Role check:", {
          hasRequiredRole,
          roles: memberData.roles,
        });

        // Store or update user data in the database
        await prisma.discordUser.upsert({
          where: { id: userData.id },
          create: {
            id: userData.id,
            username: userData.username,
            roles: memberData.roles,
            lastUpdated: new Date(),
          },
          update: {
            username: userData.username,
            roles: memberData.roles,
            lastUpdated: new Date(),
          },
        });
      } else {
        console.error(
          "Failed to fetch member data:",
          await memberResponse.text()
        );
      }
    }

    // Create the response first
    const response = NextResponse.redirect(new URL("/#ecosystem", request.url));

    // Store minimal user data
    const minimalUserData = {
      id: userData.id,
      username: userData.username,
      guildIds: guildsData.map((g: any) => g.id),
      hasRequiredRole,
    };

    // Set cookies with minimal data
    response.cookies.set({
      name: "discord_access_token",
      value: tokenData.access_token,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    response.cookies.set({
      name: "discord_user",
      value: JSON.stringify(minimalUserData),
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    console.log("Auth successful, redirecting with cookies set");
    console.log("Cookie values:", {
      access_token: tokenData.access_token.substring(0, 10) + "...",
      user_data: JSON.stringify(minimalUserData).substring(0, 50) + "...",
    });

    return response;
  } catch (error) {
    console.error("Discord auth error:", error);
    return new NextResponse(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Authentication failed",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
