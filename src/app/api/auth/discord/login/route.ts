import { NextResponse } from "next/server";
import { getBaseUrl } from "@/utils/baseUrl";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const REDIRECT_URI = `${getBaseUrl()}/api/auth/discord/callback`;

export async function GET(request: Request) {
  if (!DISCORD_CLIENT_ID) {
    return new NextResponse("Discord client ID not configured", {
      status: 500,
    });
  }

  const { searchParams } = new URL(request.url);
  const returnTo = searchParams.get("returnTo") || "/#ecosystem";

  // Generate a random state and combine with return URL
  const randomState = Math.random().toString(36).substring(7);
  const state = JSON.stringify({ random: randomState, returnTo });

  const params = new URLSearchParams({
    client_id: DISCORD_CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "identify guilds",
    state: state,
  });

  const discordUrl = `https://discord.com/api/oauth2/authorize?${params.toString()}`;
  console.log("Redirecting to Discord:", discordUrl);

  return NextResponse.redirect(discordUrl);
}
