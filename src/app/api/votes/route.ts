import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

const REQUIRED_SERVER_ID = "1219739501673451551";
const VOTE_TYPES = ["up", "down"] as const;
type VoteType = (typeof VOTE_TYPES)[number];

interface VoteRequest {
  projectName: string;
  vote: VoteType;
  userId: string;
}

interface VoteCount {
  type: string;
  _count: number;
}

interface Vote {
  id: number;
  userId: string;
  type: string;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
}

interface Project {
  id: number;
  name: string;
  votes: Vote[];
  createdAt: Date;
  updatedAt: Date;
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
    // Get all projects with their votes
    const projects = (await prisma.project.findMany({
      include: { votes: true },
    })) as Project[];

    // Get user ID from cookies if available
    const cookieStore = cookies();
    const userData = cookieStore.get("discord_user");
    const userId = userData ? JSON.parse(userData.value).id : null;

    // Format the response
    const voteCounts = projects.map((project) => {
      const upvotes = project.votes.filter((v) => v.type === "up").length;
      const downvotes = project.votes.filter((v) => v.type === "down").length;
      const userVote = userId
        ? project.votes.find((v) => v.userId === userId)?.type || null
        : null;

      return {
        name: project.name,
        votes: {
          upvotes,
          downvotes,
          userVote,
        },
      };
    });

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
    if (origin !== process.env.NEXT_PUBLIC_BASE_URL) {
      return new NextResponse(JSON.stringify({ error: "Invalid origin" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify user authentication and server membership
    const user = await verifyUserAuth(cookieStore);

    // Check rate limiting
    if (!checkRateLimit(user.id)) {
      return new NextResponse(
        JSON.stringify({
          error: "Rate limit exceeded. Please try again later.",
        }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse and validate request body
    const body: VoteRequest = await request.json();
    const { projectName, vote, userId } = body;

    // Validate vote type
    if (!isValidVoteType(vote)) {
      return new NextResponse(JSON.stringify({ error: "Invalid vote type" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Verify userId matches authenticated user
    if (userId !== user.id) {
      return new NextResponse(JSON.stringify({ error: "User ID mismatch" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get or create project
    let project = (await prisma.project.findUnique({
      where: { name: projectName },
      include: { votes: true },
    })) as Project | null;

    if (!project) {
      project = (await prisma.project.create({
        data: { name: projectName },
        include: { votes: true },
      })) as Project;
    }

    // Check if user has already voted
    const existingVote = project.votes.find((v) => v.userId === userId);

    if (existingVote) {
      if (existingVote.type === vote) {
        return new NextResponse(
          JSON.stringify({ error: "You have already voted for this project" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Update existing vote
      await prisma.vote.update({
        where: { id: existingVote.id },
        data: { type: vote },
      });
    } else {
      // Create new vote
      await prisma.vote.create({
        data: {
          userId,
          type: vote,
          projectId: project.id,
        },
      });
    }

    // Get updated vote counts
    const voteCount = await prisma.vote.groupBy({
      by: ["type"],
      where: { projectId: project.id },
      _count: true,
    });

    const upvotes =
      voteCount.find((v: VoteCount) => v.type === "up")?._count ?? 0;
    const downvotes =
      voteCount.find((v: VoteCount) => v.type === "down")?._count ?? 0;

    return NextResponse.json({
      success: true,
      votes: {
        upvotes,
        downvotes,
        userVote: vote,
      },
    });
  } catch (error) {
    console.error("Failed to process vote:", error);
    const message =
      error instanceof Error ? error.message : "Failed to process vote";
    const status = message.includes("Not authenticated") ? 401 : 500;

    return new NextResponse(JSON.stringify({ error: message }), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }
}
