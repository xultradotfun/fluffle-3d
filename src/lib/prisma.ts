import { PrismaClient } from "@prisma/client";
import { ENV } from "./constants";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (ENV.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
