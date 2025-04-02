import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { isAllowedBaseUrl } from "@/utils/baseUrl";

// Constants for rate limiting
const RATE_LIMIT = {
  USER: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 300000, // 5 minutes
  },
  IP: {
    MAX_REQUESTS: 100,
    WINDOW_MS: 300000, // 5 minutes
  },
  CLEANUP_INTERVAL_MS: 3600000, // 1 hour
};

// Rate limiting maps with expiry timestamps
const userRateLimits = new Map<string, { count: number; expiresAt: number }>();
const ipRateLimits = new Map<string, { count: number; expiresAt: number }>();

// Clear expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of userRateLimits.entries()) {
    if (now >= data.expiresAt) {
      userRateLimits.delete(key);
    }
  }
  for (const [key, data] of ipRateLimits.entries()) {
    if (now >= data.expiresAt) {
      ipRateLimits.delete(key);
    }
  }
}, RATE_LIMIT.CLEANUP_INTERVAL_MS);

// Add Discord API verification
async function verifyDiscordToken(accessToken: string): Promise<boolean> {
  try {
    const response = await fetch("https://discord.com/api/v10/users/@me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function verifyUserAuth(cookieStore: ReturnType<typeof cookies>) {
  const userData = cookieStore.get("discord_user");
  const accessToken = cookieStore.get("discord_access_token");

  if (!userData || !accessToken) {
    throw new Error("Not authenticated");
  }

  try {
    // Verify the access token is valid with Discord
    const isValidToken = await verifyDiscordToken(accessToken.value);
    if (!isValidToken) {
      throw new Error("Invalid Discord token");
    }

    const user = JSON.parse(userData.value);

    // Verify the user data format
    if (!user.id || !user.username || !Array.isArray(user.guildIds)) {
      throw new Error("Invalid user data format");
    }

    // Verify the user exists in our database and has the claimed ID
    const dbUser = await prisma.discordUser.findUnique({
      where: { id: user.id },
      select: { id: true, username: true },
    });

    if (!dbUser) {
      throw new Error("User not found in database");
    }

    // Verify the username matches to prevent ID spoofing
    if (dbUser.username !== user.username) {
      throw new Error("User data mismatch");
    }

    return user;
  } catch (error) {
    throw new Error("Invalid user data");
  }
}

function checkUserRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = userRateLimits.get(userId);

  if (!userLimit || now >= userLimit.expiresAt) {
    userRateLimits.set(userId, {
      count: 1,
      expiresAt: now + RATE_LIMIT.USER.WINDOW_MS,
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT.USER.MAX_REQUESTS) {
    return false;
  }

  userLimit.count++;
  return true;
}

function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const ipLimit = ipRateLimits.get(ip);

  if (!ipLimit || now >= ipLimit.expiresAt) {
    ipRateLimits.set(ip, {
      count: 1,
      expiresAt: now + RATE_LIMIT.IP.WINDOW_MS,
    });
    return true;
  }

  if (ipLimit.count >= RATE_LIMIT.IP.MAX_REQUESTS) {
    return false;
  }

  ipLimit.count++;
  return true;
}

// Security headers
const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

// GET: Fetch user's completed tasks
export async function GET() {
  try {
    const cookieStore = cookies();
    const headersList = headers();

    // Get IP address
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    // Check IP rate limit first
    if (!checkIpRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests from this IP. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "300",
            ...securityHeaders,
          },
        }
      );
    }

    // Enhanced CSRF protection
    const origin = headersList.get("origin");
    const referer = headersList.get("referer");

    if (!origin || !referer || !isAllowedBaseUrl(origin)) {
      console.log("Security check failed:", { origin, referer });
      return new NextResponse(
        JSON.stringify({ error: "Invalid request origin" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...securityHeaders },
        }
      );
    }

    const user = await verifyUserAuth(cookieStore);

    // Check user rate limit
    if (!checkUserRateLimit(user.id)) {
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "300",
            ...securityHeaders,
          },
        }
      );
    }

    const completions = await prisma.bingoTaskCompletion.findMany({
      where: {
        userId: user.id,
      },
      select: {
        taskId: true,
        completedAt: true,
      },
    });

    return NextResponse.json(
      { completedTasks: completions || [] },
      { headers: securityHeaders }
    );
  } catch (error) {
    console.error("Detailed error in bingo progress:", error);
    return NextResponse.json(
      {
        completedTasks: [],
        error:
          error instanceof Error ? error.message : "Failed to fetch progress",
      },
      { status: 500, headers: securityHeaders }
    );
  }
}

// POST: Mark a task as completed
export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const headersList = headers();

    // Get IP address
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    // Check IP rate limit first
    if (!checkIpRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests from this IP. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "300",
            ...securityHeaders,
          },
        }
      );
    }

    // Enhanced CSRF protection
    const origin = headersList.get("origin");
    const referer = headersList.get("referer");

    if (!origin || !referer || !isAllowedBaseUrl(origin)) {
      console.log("Security check failed:", { origin, referer });
      return new NextResponse(
        JSON.stringify({ error: "Invalid request origin" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...securityHeaders },
        }
      );
    }

    const user = await verifyUserAuth(cookieStore);

    // Check user rate limit
    if (!checkUserRateLimit(user.id)) {
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "300",
            ...securityHeaders,
          },
        }
      );
    }

    const { taskId } = await request.json();

    if (!taskId || typeof taskId !== "string") {
      return NextResponse.json(
        { error: "Task ID is required and must be a string" },
        { status: 400, headers: securityHeaders }
      );
    }

    const completion = await prisma.bingoTaskCompletion.create({
      data: {
        userId: user.id,
        taskId,
      },
      select: {
        taskId: true,
        completedAt: true,
      },
    });

    return NextResponse.json({ completion }, { headers: securityHeaders });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Task already completed" },
        { status: 409, headers: securityHeaders }
      );
    }
    console.error("Error marking task as completed:", error);
    return NextResponse.json(
      { error: "Failed to mark task as completed" },
      { status: 500, headers: securityHeaders }
    );
  }
}

// DELETE: Remove a task completion
export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies();
    const headersList = headers();

    // Get IP address
    const forwardedFor = headersList.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0] : "unknown";

    // Check IP rate limit first
    if (!checkIpRateLimit(ip)) {
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests from this IP. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "300",
            ...securityHeaders,
          },
        }
      );
    }

    // Enhanced CSRF protection
    const origin = headersList.get("origin");
    const referer = headersList.get("referer");

    if (!origin || !referer || !isAllowedBaseUrl(origin)) {
      console.log("Security check failed:", { origin, referer });
      return new NextResponse(
        JSON.stringify({ error: "Invalid request origin" }),
        {
          status: 403,
          headers: { "Content-Type": "application/json", ...securityHeaders },
        }
      );
    }

    const user = await verifyUserAuth(cookieStore);

    // Check user rate limit
    if (!checkUserRateLimit(user.id)) {
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": "300",
            ...securityHeaders,
          },
        }
      );
    }

    const { taskId } = await request.json();

    if (!taskId || typeof taskId !== "string") {
      return NextResponse.json(
        { error: "Task ID is required and must be a string" },
        { status: 400, headers: securityHeaders }
      );
    }

    await prisma.bingoTaskCompletion.delete({
      where: {
        userId_taskId: {
          userId: user.id,
          taskId,
        },
      },
    });

    return NextResponse.json({ success: true }, { headers: securityHeaders });
  } catch (error) {
    console.error("Error removing task completion:", error);
    return NextResponse.json(
      { error: "Failed to remove task completion" },
      { status: 500, headers: securityHeaders }
    );
  }
}
