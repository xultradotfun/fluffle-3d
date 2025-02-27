import { NextResponse } from "next/server";
import { getBaseUrl } from "@/utils/baseUrl";

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const REDIRECT_URI = `${getBaseUrl()}/api/auth/discord/callback`;

export async function GET() {
  if (!DISCORD_CLIENT_ID) {
    return new NextResponse("Discord client ID not configured", {
      status: 500,
    });
  }

  // Generate a random state
  const state = Math.random().toString(36).substring(7);

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
