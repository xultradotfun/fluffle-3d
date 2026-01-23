/**
 * Standardized error handling utilities for Fluffle application
 * Ensures consistent error responses across all API endpoints
 */

import { NextResponse } from "next/server";
import { ENV } from "./constants";

// Standardized error response format
export interface ErrorResponse {
  error: string;
  details?: string;
  code?: string;
  timestamp: string;
}

// Common error types
export const ERROR_CODES = {
  // Authentication errors
  NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
  INVALID_TOKEN: "INVALID_TOKEN",
  TOKEN_EXPIRED: "TOKEN_EXPIRED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  SERVER_MEMBERSHIP_REQUIRED: "SERVER_MEMBERSHIP_REQUIRED",
  USER_NOT_FOUND: "USER_NOT_FOUND",
  USER_DATA_MISMATCH: "USER_DATA_MISMATCH",

  // Validation errors
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_PARAMETERS: "MISSING_PARAMETERS",
  INVALID_USER_ID: "INVALID_USER_ID",
  INVALID_PROJECT_ID: "INVALID_PROJECT_ID",
  INVALID_VOTE_TYPE: "INVALID_VOTE_TYPE",

  // Rate limiting errors
  RATE_LIMIT_EXCEEDED: "RATE_LIMIT_EXCEEDED",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",

  // Business logic errors
  ALREADY_VOTED: "ALREADY_VOTED",
  PROJECT_NOT_FOUND: "PROJECT_NOT_FOUND",

  // External API errors
  EXTERNAL_API_ERROR: "EXTERNAL_API_ERROR",
  DISCORD_API_ERROR: "DISCORD_API_ERROR",

  // Generic errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  NOT_FOUND: "NOT_FOUND",
  INVALID_REQUEST: "INVALID_REQUEST",
} as const;

/**
 * Create standardized error response
 */
export function createErrorResponse(
  error: string,
  status: number,
  details?: string,
  code?: string
): NextResponse {
  const errorResponse: ErrorResponse = {
    error,
    timestamp: new Date().toISOString(),
    ...(details && { details }),
    ...(code && { code }),
  };

  return NextResponse.json(errorResponse, {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Pre-built error responses for common scenarios
 */
export const ErrorResponses = {
  // Authentication errors (401)
  notAuthenticated: (details?: string) =>
    createErrorResponse(
      "Authentication required",
      401,
      details || "No valid authentication provided",
      ERROR_CODES.NOT_AUTHENTICATED
    ),

  invalidToken: (details?: string) =>
    createErrorResponse(
      "Invalid authentication token",
      401,
      details || "Token is invalid or expired",
      ERROR_CODES.INVALID_TOKEN
    ),

  tokenExpired: () =>
    createErrorResponse(
      "Authentication token expired",
      401,
      "Please refresh your authentication",
      ERROR_CODES.TOKEN_EXPIRED
    ),

  // Authorization errors (403)
  insufficientPermissions: (details?: string) =>
    createErrorResponse(
      "Insufficient permissions",
      403,
      details || "User does not have required permissions",
      ERROR_CODES.INSUFFICIENT_PERMISSIONS
    ),

  serverMembershipRequired: () =>
    createErrorResponse(
      "Server membership required",
      403,
      "Must be a member of the required Discord server",
      ERROR_CODES.SERVER_MEMBERSHIP_REQUIRED
    ),

  userDataMismatch: () =>
    createErrorResponse(
      "User data mismatch",
      403,
      "Authentication data does not match user profile",
      ERROR_CODES.USER_DATA_MISMATCH
    ),

  // Validation errors (400)
  invalidInput: (details: string) =>
    createErrorResponse(
      "Invalid input",
      400,
      details,
      ERROR_CODES.INVALID_INPUT
    ),

  missingParameters: (parameters: string[]) =>
    createErrorResponse(
      "Missing required parameters",
      400,
      `Required parameters: ${parameters.join(", ")}`,
      ERROR_CODES.MISSING_PARAMETERS
    ),

  invalidUserId: () =>
    createErrorResponse(
      "Invalid user ID",
      400,
      "User ID must be a valid Discord ID (17-20 digits)",
      ERROR_CODES.INVALID_USER_ID
    ),

  invalidProjectId: () =>
    createErrorResponse(
      "Invalid project ID",
      400,
      "Project ID must be a positive number",
      ERROR_CODES.INVALID_PROJECT_ID
    ),

  // Rate limiting errors (429)
  rateLimitExceeded: (retryAfter: number) =>
    NextResponse.json(
      {
        error: "Rate limit exceeded",
        details: "Too many requests. Please try again later.",
        code: ERROR_CODES.RATE_LIMIT_EXCEEDED,
        timestamp: new Date().toISOString(),
        retryAfter,
      },
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": retryAfter.toString(),
        },
      }
    ),

  // Not found errors (404)
  notFound: (resource?: string) =>
    createErrorResponse(
      "Not found",
      404,
      resource ? `${resource} not found` : "Requested resource not found",
      ERROR_CODES.NOT_FOUND
    ),

  userNotFound: () =>
    createErrorResponse(
      "User not found",
      404,
      "User not found in database",
      ERROR_CODES.USER_NOT_FOUND
    ),

  // Conflict errors (409)
  alreadyVoted: () =>
    createErrorResponse(
      "Already voted",
      409,
      "User has already voted on this project",
      ERROR_CODES.ALREADY_VOTED
    ),

  // Server errors (500)
  internalError: (details?: string) =>
    createErrorResponse(
      "Internal server error",
      500,
      details || "An unexpected error occurred",
      ERROR_CODES.INTERNAL_ERROR
    ),

  externalApiError: (service: string, details?: string) =>
    createErrorResponse(
      "External API error",
      500,
      details || `Failed to communicate with ${service}`,
      ERROR_CODES.EXTERNAL_API_ERROR
    ),
};

/**
 * Error logging utility
 */
export function logError(error: any, context?: string) {
  const timestamp = new Date().toISOString();
  const contextStr = context ? ` [${context}]` : "";

  if (error instanceof Error) {
    console.error(`${timestamp}${contextStr} Error:`, error.message);
    if (ENV.NODE_ENV === "development") {
      console.error("Stack:", error.stack);
    }
  } else {
    console.error(`${timestamp}${contextStr} Unknown error:`, error);
  }
}
