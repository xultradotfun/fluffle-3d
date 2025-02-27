import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = cookies();

  // Clear Discord-related cookies
  cookieStore.delete("discord_access_token");
  cookieStore.delete("discord_user");

  return new NextResponse("Logged out successfully");
}
