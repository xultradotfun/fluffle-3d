import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { voteCache } from "@/lib/voteCache";
import { getHighestRole } from "@/lib/constants";
import { isAllowedBaseUrl } from "@/utils/baseUrl";

const REQUIRED_SERVER_ID = "1219739501673451551";
const VOTE_TYPES = ["up", "down"] as const;
type VoteType = (typeof VOTE_TYPES)[number];

interface VoteRequest {
  twitter: string;
  vote: VoteType;
  userId: string;
}

interface VoteData {
  userId: string;
  type: string;
  roleId: string;
  roleName: string;
}

interface ProjectData {
  id: number;
  twitter: string;
  name: string;
  votes: VoteData[];
}

// Constants for rate limiting
const RATE_LIMIT = {
  USER: {
    MAX_VOTES: 15,
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

function isValidVoteType(vote: string): vote is VoteType {
  return VOTE_TYPES.includes(vote as VoteType);
}

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

    // Verify server membership
    if (!user.guildIds.includes(REQUIRED_SERVER_ID)) {
      throw new Error(
        "Must be a member of the required Discord server to vote"
      );
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

  if (userLimit.count >= RATE_LIMIT.USER.MAX_VOTES) {
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

// Add input validation utilities
function sanitizeTwitterHandle(handle: string): string {
  return handle.trim().replace(/[^a-zA-Z0-9_]/g, "");
}

function validateVoteRequest(body: any): body is VoteRequest {
  if (!body || typeof body !== "object") return false;

  const { twitter, vote, userId } = body;

  if (typeof twitter !== "string" || !twitter.trim()) return false;
  if (typeof userId !== "string" || !userId.trim()) return false;
  if (!isValidVoteType(vote)) return false;

  // Additional validation rules
  if (twitter.length > 50) return false; // Reasonable max length
  if (userId.length > 30) return false; // Discord IDs are shorter

  return true;
}

// Add security headers utility
const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

export async function GET() {
  try {
    // Check cache first
    const cachedData = voteCache.get();
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
          "X-Cache": "HIT",
          ...securityHeaders,
        },
      });
    }

    // Get user ID from cookies if available
    const cookieStore = cookies();
    const userData = cookieStore.get("discord_user");
    const userId = userData ? JSON.parse(userData.value).id : null;

    // Optimized query: Get projects with aggregated vote counts and user votes in one query
    const projects = await prisma.project.findMany({
      select: {
        id: true,
        twitter: true,
        name: true,
        votes: {
          select: {
            userId: true,
            type: true,
            roleName: true,
          },
        },
      },
    });

    // Get unique voter count efficiently
    const uniqueVoters = await prisma.vote.groupBy({
      by: ["userId"],
    });

    // Process the data efficiently
    const voteCounts = projects.map((project) => {
      // Group votes by role and type
      const votesByRole: Record<string, { up: number; down: number }> = {};
      let upvotes = 0;
      let downvotes = 0;
      let userVote: string | null = null;

      project.votes.forEach((vote) => {
        // Count total votes
        if (vote.type === "up") upvotes++;
        else if (vote.type === "down") downvotes++;

        // Track user's vote
        if (userId && vote.userId === userId) {
          userVote = vote.type;
        }

        // Group by role
        if (!votesByRole[vote.roleName]) {
          votesByRole[vote.roleName] = { up: 0, down: 0 };
        }
        if (vote.type === "up" || vote.type === "down") {
          votesByRole[vote.roleName][vote.type]++;
        }
      });

      return {
        twitter: project.twitter,
        name: project.name,
        votes: {
          upvotes,
          downvotes,
          userVote,
          breakdown: votesByRole,
        },
      };
    });

    // Get total vote count efficiently
    const totalVotesCount = await prisma.vote.count();

    const response = {
      projects: voteCounts,
      stats: {
        uniqueVoters: uniqueVoters.length,
        totalVotes: totalVotesCount,
      },
    };

    // Cache the response
    voteCache.set(response);

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
        "X-Cache": "MISS",
        ...securityHeaders,
      },
    });
  } catch (error) {
    console.error("Failed to fetch votes:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch votes" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...securityHeaders,
        },
      }
    );
  }
}

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
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid JSON payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!validateVoteRequest(body)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Sanitize inputs
    const twitter = sanitizeTwitterHandle(body.twitter);
    const { vote, userId } = body;

    // Verify user authentication and server membership with enhanced security
    const user = await verifyUserAuth(cookieStore);

    // Verify userId matches authenticated user
    if (userId !== user.id) {
      return new NextResponse(
        JSON.stringify({
          error: "User ID mismatch",
          message:
            "The provided user ID does not match your authenticated session.",
        }),
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

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
          },
        }
      );
    }

    // Get user data from database to check roles
    const dbUser = await prisma.discordUser.findUnique({
      where: { id: userId },
    });

    if (!dbUser) {
      return new NextResponse(
        JSON.stringify({ error: "User not found in database" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the highest role for the user
    const highestRole = getHighestRole(dbUser.roles);
    if (!highestRole) {
      return new NextResponse(
        JSON.stringify({ error: "User does not have required roles" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get or create project and handle vote in a single transaction
    const result = await prisma.$transaction(async (tx) => {
      let project = await tx.project.findUnique({
        where: { twitter },
        select: { id: true },
      });

      if (!project) {
        project = await tx.project.create({
          data: {
            twitter,
            name: twitter,
          },
          select: { id: true },
        });
      }

      const existingVote = await tx.vote.findUnique({
        where: {
          userId_projectId: {
            userId: userId,
            projectId: project.id,
          },
        },
      });

      if (existingVote) {
        if (existingVote.type === vote) {
          // Delete the vote if clicking the same button
          await tx.vote.delete({
            where: {
              userId_projectId: {
                userId: userId,
                projectId: project.id,
              },
            },
          });
        } else {
          // Update existing vote with new type and role info
          await tx.vote.update({
            where: {
              userId_projectId: {
                userId: userId,
                projectId: project.id,
              },
            },
            data: {
              type: vote,
              roleId: highestRole.id,
              roleName: highestRole.name,
            },
          });
        }
      } else {
        // Create new vote with role info
        await tx.vote.create({
          data: {
            userId,
            type: vote,
            projectId: project.id,
            roleId: highestRole.id,
            roleName: highestRole.name,
          },
        });
      }

      // Get updated vote counts with role breakdown in the same transaction
      const votes = await tx.vote.findMany({
        where: { projectId: project.id },
        select: {
          userId: true,
          type: true,
          roleId: true,
          roleName: true,
        },
      });

      return votes;
    });

    // Calculate vote counts by role
    const votesByRole = result.reduce(
      (acc: Record<string, { up: number; down: number }>, vote) => {
        if (!acc[vote.roleName]) {
          acc[vote.roleName] = { up: 0, down: 0 };
        }
        acc[vote.roleName][vote.type as VoteType]++;
        return acc;
      },
      {}
    );

    const totalVotes = {
      upvotes: result.filter((v) => v.type === "up").length,
      downvotes: result.filter((v) => v.type === "down").length,
      userVote: userId
        ? result.find((v) => v.userId === userId)?.type || null
        : null,
      breakdown: votesByRole,
    };

    // Invalidate the cache since votes have changed
    voteCache.invalidate();

    return NextResponse.json(totalVotes, {
      headers: {
        ...securityHeaders,
      },
    });
  } catch (error) {
    console.error("Failed to process vote:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to process vote" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...securityHeaders,
        },
      }
    );
  }
}
