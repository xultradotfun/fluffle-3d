import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getBaseUrl } from "@/utils/baseUrl";
import { DISCORD_CONFIG, ENV } from "@/lib/constants";
import { ErrorResponses, logError } from "@/lib/errors";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return ErrorResponses.invalidInput("No authorization code provided");
  }

  if (!DISCORD_CONFIG.CLIENT_ID || !DISCORD_CONFIG.CLIENT_SECRET) {
    return ErrorResponses.internalError("Discord credentials not configured");
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
        client_id: DISCORD_CONFIG.CLIENT_ID,
        client_secret: DISCORD_CONFIG.CLIENT_SECRET,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: `${getBaseUrl()}/api/auth/discord/callback`,
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
      (guild: any) => guild.id === DISCORD_CONFIG.REQUIRED_SERVER_ID
    );
    let hasRequiredRole = false;

    if (isInServer) {
      // Get member data for the required server
      const memberResponse = await fetch(
        `https://discord.com/api/v10/guilds/${DISCORD_CONFIG.REQUIRED_SERVER_ID}/members/${userData.id}`,
        {
          headers: {
            Authorization: `Bot ${DISCORD_CONFIG.BOT_TOKEN}`,
          },
        }
      );

      if (memberResponse.ok) {
        const memberData = await memberResponse.json();
        hasRequiredRole = memberData.roles.includes(
          DISCORD_CONFIG.REQUIRED_ROLE_ID
        );
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

    // Get the return URL from state
    const state = searchParams.get("state");
    let returnTo = "/#ecosystem"; // Default fallback

    try {
      if (state) {
        const stateData = JSON.parse(state);
        returnTo = stateData.returnTo || returnTo;
      }
    } catch (error) {
      console.error("Failed to parse state:", error);
    }

    // Create the response first
    const response = NextResponse.redirect(new URL(returnTo, request.url));

    // Store only relevant guild IDs - secure and space-efficient
    const relevantGuildIds = isInServer
      ? [DISCORD_CONFIG.REQUIRED_SERVER_ID]
      : [];

    const minimalUserData = {
      id: userData.id,
      username: userData.username,
      discriminator: userData.discriminator,
      avatar: userData.avatar,
      guildIds: relevantGuildIds, // Only store guilds we care about
      hasRequiredRole,
    };

    // Set cookies with minimal data - environment-aware security settings
    const isProduction = ENV.NODE_ENV === "production";
    const baseUrl = getBaseUrl();
    const isHttps = baseUrl.startsWith("https://");

    const cookieOptions = {
      httpOnly: true,
      secure: isHttps, // Use secure cookies for HTTPS, regular for HTTP
      sameSite: "lax" as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      // Add domain for production to ensure cookies work across subdomains
      ...(isProduction &&
        isHttps && {
          domain: baseUrl.includes("vercel.app") ? undefined : ".fluffle.tools",
        }),
    };

    response.cookies.set({
      name: "discord_access_token",
      value: tokenData.access_token,
      ...cookieOptions,
    });

    response.cookies.set({
      name: "discord_user",
      value: JSON.stringify(minimalUserData),
      ...cookieOptions,
    });

    console.log("Auth successful, redirecting with cookies set");
    console.log("Cookie configuration:", {
      isProduction,
      baseUrl,
      isHttps,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
    });
    console.log("Cookie values:", {
      access_token: tokenData.access_token.substring(0, 10) + "...",
      user_data: JSON.stringify(minimalUserData).substring(0, 50) + "...",
      user_data_length: JSON.stringify(minimalUserData).length,
      user_id: userData.id,
      username: userData.username,
    });

    return response;
  } catch (error) {
    logError(error, "discord-oauth-callback");

    const frontendUrl =
      ENV.NODE_ENV === "development"
        ? "http://localhost:3000"
        : "https://fluffle.tools";

    // Redirect to frontend with error instead of JSON response
    return NextResponse.redirect(`${frontendUrl}/?auth_error=1`);
  }
}
