import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Security headers for all responses
const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

// Whitelist of project IDs allowed to use this endpoint
const ALLOWED_PROJECT_IDS = new Set([27, 92, 94]); // valhalla, megatruther, badbunnz

// Input sanitization utilities
function sanitizeUserId(userId: string): string {
  // Remove any non-numeric characters as Discord IDs are numeric
  return userId.trim().replace(/[^0-9]/g, "");
}

function validateUserId(userId: string): boolean {
  // Discord IDs are numeric and typically 17-20 digits
  return /^\d{17,20}$/.test(userId);
}

function validateAndParseProjectId(projectId: string): number | null {
  const parsed = parseInt(projectId.trim());
  // Ensure it's a positive integer within reasonable bounds
  if (isNaN(parsed) || parsed <= 0 || parsed > 1000000) {
    return null;
  }
  return parsed;
}

export async function GET(request: Request) {
  try {
    // Get userId and projectId from URL params
    const { searchParams } = new URL(request.url);
    const rawUserId = searchParams.get("userId");
    const rawProjectId = searchParams.get("projectId");

    // Validate required parameters
    if (!rawUserId || !rawProjectId) {
      return new NextResponse(
        JSON.stringify({
          error: "Missing required parameters",
          details: "Both userId and projectId are required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...securityHeaders,
          },
        }
      );
    }

    // Sanitize and validate userId
    const userId = sanitizeUserId(rawUserId);
    if (!validateUserId(userId)) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid userId",
          details: "userId must be a valid Discord ID",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...securityHeaders,
          },
        }
      );
    }

    // Validate and parse projectId
    const projectIdNum = validateAndParseProjectId(rawProjectId);
    if (projectIdNum === null) {
      return new NextResponse(
        JSON.stringify({
          error: "Invalid projectId",
          details: "projectId must be a positive number",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            ...securityHeaders,
          },
        }
      );
    }

    // Check if project is allowed to use this endpoint
    if (!ALLOWED_PROJECT_IDS.has(projectIdNum)) {
      return new NextResponse(
        JSON.stringify({
          error: "Unauthorized project",
          details: "This project is not authorized to use this endpoint",
        }),
        {
          status: 403,
          headers: {
            "Content-Type": "application/json",
            ...securityHeaders,
          },
        }
      );
    }

    // Check if user has upvoted the project
    const vote = await prisma.vote.findUnique({
      where: {
        userId_projectId: {
          userId: userId,
          projectId: projectIdNum,
        },
      },
      select: {
        type: true,
      },
    });

    // Return whether the user has upvoted (type === "up")
    return NextResponse.json(
      {
        hasUpvoted: vote?.type === "up",
      },
      {
        headers: {
          "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
          ...securityHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Failed to check upvote status:", error);
    return new NextResponse(
      JSON.stringify({
        error: "Failed to check upvote status",
        details: "An internal error occurred while checking the vote status",
      }),
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
