import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the hostname from the request
  const hostname = request.headers.get("host");

  // Check if the request is coming from bingo.fluffle.tools
  if (hostname === "bingo.fluffle.tools") {
    // Create the redirect URL
    const redirectUrl = new URL("/#bingo", "https://fluffle.tools");

    // Return the redirect response
    return NextResponse.redirect(redirectUrl);
  }

  // For all other requests, continue as normal
  return NextResponse.next();
}

// Configure the middleware to run on all paths
export const config = {
  matcher: "/:path*",
};
