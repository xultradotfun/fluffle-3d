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
      throw new Error(`Failed to get access token: ${errorData}`);
    }

    const tokenData = await tokenResponse.json();

    // Get user data
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Failed to get user data");
    }

    const userData = await userResponse.json();

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
      throw new Error("Failed to get guilds data");
    }

    const guildsData = await guildsResponse.json();

    // Check if user is in the required server
    const isInServer = guildsData.some(
      (guild: { id: string }) => guild.id === DISCORD_CONFIG.REQUIRED_SERVER_ID
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
    } catch {
      // Invalid state, use default returnTo
    }

    // Create the response first with auth_success parameter
    const redirectUrl = new URL(returnTo, request.url);
    redirectUrl.searchParams.set('auth_success', '1');
    const response = NextResponse.redirect(redirectUrl);

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
