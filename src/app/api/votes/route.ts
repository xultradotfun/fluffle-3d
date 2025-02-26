import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { voteCache } from "@/lib/voteCache";
import { getHighestRole } from "@/lib/constants";

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

// Rate limiting map: userId -> { timestamp: number, count: number }
const rateLimits = new Map<string, { timestamp: number; count: number }>();

// Clear old rate limit entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [userId, data] of rateLimits.entries()) {
    if (now - data.timestamp > 3600000) {
      // 1 hour
      rateLimits.delete(userId);
    }
  }
}, 3600000);

function isValidVoteType(vote: string): vote is VoteType {
  return VOTE_TYPES.includes(vote as VoteType);
}

async function verifyUserAuth(cookieStore: ReturnType<typeof cookies>) {
  const userData = cookieStore.get("discord_user");
  const accessToken = cookieStore.get("discord_access_token");

  if (!userData || !accessToken) {
    throw new Error("Not authenticated");
  }

  try {
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

    return user;
  } catch (error) {
    throw new Error("Invalid user data");
  }
}

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimits.get(userId);

  if (!userLimit) {
    rateLimits.set(userId, { timestamp: now, count: 1 });
    return true;
  }

  // Reset count if more than 5 minutes have passed
  if (now - userLimit.timestamp > 300000) {
    rateLimits.set(userId, { timestamp: now, count: 1 });
    return true;
  }

  // Allow max 10 votes per 5 minutes
  if (userLimit.count >= 10) {
    return false;
  }

  userLimit.count++;
  return true;
}

export async function GET() {
  try {
    // Check cache first
    const cachedData = voteCache.get();
    if (cachedData) {
      return NextResponse.json(cachedData);
    }

    // Get all projects with their votes
    const projects = await prisma.project.findMany({
      include: {
        votes: true,
      },
    });

    // Get user ID from cookies if available
    const cookieStore = cookies();
    const userData = cookieStore.get("discord_user");
    const userId = userData ? JSON.parse(userData.value).id : null;

    // Format the response with vote counts and breakdown
    const voteCounts = projects.map((project) => {
      const votesByRole = project.votes.reduce(
        (acc: Record<string, { up: number; down: number }>, vote) => {
          if (!acc[vote.roleName]) {
            acc[vote.roleName] = { up: 0, down: 0 };
          }
          if (vote.type === "up" || vote.type === "down") {
            acc[vote.roleName][vote.type]++;
          }
          return acc;
        },
        {}
      );

      const votes = {
        upvotes: project.votes.filter((vote) => vote.type === "up").length,
        downvotes: project.votes.filter((vote) => vote.type === "down").length,
        userVote: userId
          ? project.votes.find((vote) => vote.userId === userId)?.type || null
          : null,
        breakdown: votesByRole,
      };

      return {
        twitter: project.twitter,
        name: project.name,
        votes,
      };
    });

    // Cache the response
    voteCache.set(voteCounts);

    return NextResponse.json(voteCounts);
  } catch (error) {
    console.error("Failed to fetch votes:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to fetch votes" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const headersList = headers();

    // Verify CSRF protection
    const origin = headersList.get("origin");
    console.log("Request origin:", origin);
    console.log("Expected origin:", process.env.NEXT_PUBLIC_BASE_URL);

    if (origin !== process.env.NEXT_PUBLIC_BASE_URL) {
      console.log("Origin mismatch");
      return new NextResponse(JSON.stringify({ error: "Invalid origin" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse request body first
    const body = await request.json();
    console.log("Received request body:", body);

    // Validate required fields
    if (!body.twitter || !body.vote || !body.userId) {
      console.log("Missing fields:", {
        hasTwitter: !!body.twitter,
        hasVote: !!body.vote,
        hasUserId: !!body.userId,
      });
      return new NextResponse(
        JSON.stringify({
          error: "Missing required fields. Required: twitter, vote, userId",
          received: {
            twitter: body.twitter,
            vote: body.vote,
            userId: body.userId,
          },
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { twitter, vote, userId } = body as VoteRequest;
    console.log("Parsed request data:", { twitter, vote, userId });

    // Validate vote type
    console.log("Validating vote type:", vote, "Valid types:", VOTE_TYPES);
    if (!isValidVoteType(vote)) {
      console.log("Invalid vote type");
      return new NextResponse(
        JSON.stringify({
          error: "Invalid vote type",
          received: vote,
          validTypes: VOTE_TYPES,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Verify user authentication and server membership
    const user = await verifyUserAuth(cookieStore);

    // Verify userId matches authenticated user
    if (userId !== user.id) {
      return new NextResponse(JSON.stringify({ error: "User ID mismatch" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check rate limiting
    if (!checkRateLimit(user.id)) {
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
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

    // Get or create project
    let project = await prisma.project.findUnique({
      where: { twitter },
      include: {
        votes: {
          select: {
            id: true,
            userId: true,
            type: true,
            roleId: true,
            roleName: true,
          },
        },
      },
    });

    if (!project) {
      project = await prisma.project.create({
        data: {
          twitter,
          name: twitter,
        },
        include: {
          votes: {
            select: {
              id: true,
              userId: true,
              type: true,
              roleId: true,
              roleName: true,
            },
          },
        },
      });
    }

    // Check if user has already voted
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: project.id,
        },
      },
    });

    if (existingVote) {
      if (existingVote.type === vote) {
        return new NextResponse(
          JSON.stringify({ error: "You have already voted for this project" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Update existing vote with new role info
      await prisma.vote.update({
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
    } else {
      // Create new vote with role info
      await prisma.vote.create({
        data: {
          userId,
          type: vote,
          projectId: project.id,
          roleId: highestRole.id,
          roleName: highestRole.name,
        },
      });
    }

    // Get updated vote counts with role breakdown
    const votes = await prisma.vote.findMany({
      where: { projectId: project.id },
      select: {
        userId: true,
        type: true,
        roleId: true,
        roleName: true,
      },
    });

    // Calculate vote counts by role
    type VoteType = "up" | "down";
    const votesByRole = votes.reduce(
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
      upvotes: votes.filter((v) => v.type === "up").length,
      downvotes: votes.filter((v) => v.type === "down").length,
      userVote: userId
        ? votes.find((v) => v.userId === userId)?.type || null
        : null,
      breakdown: votesByRole,
    };

    // Invalidate the cache since votes have changed
    voteCache.invalidate();

    return NextResponse.json(totalVotes);
  } catch (error) {
    console.error("Failed to process vote:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to process vote" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
