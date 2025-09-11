import { NextResponse } from "next/server";
import { getBaseUrl } from "@/utils/baseUrl";
import { DISCORD_CONFIG } from "@/lib/constants";
import { ErrorResponses } from "@/lib/errors";

export async function GET(request: Request) {
  if (!DISCORD_CONFIG.CLIENT_ID) {
    return ErrorResponses.internalError("Discord client ID not configured");
  }

  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo") || "/#ecosystem";

  // Generate a random state and combine with return URL
  const randomState = Math.random().toString(36).substring(7);
  const state = JSON.stringify({ random: randomState, returnTo });

  const params = new URLSearchParams({
    client_id: DISCORD_CONFIG.CLIENT_ID,
    redirect_uri: `${getBaseUrl()}/api/auth/discord/callback`,
    response_type: "code",
    scope: "identify guilds",
    state: state,
  });

  const discordUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  console.log("Redirecting to Discord:", discordUrl);

  return NextResponse.redirect(discordUrl);
}
