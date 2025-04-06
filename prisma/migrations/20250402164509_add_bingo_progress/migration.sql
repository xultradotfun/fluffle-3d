-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "roleId" SET DATA TYPE TEXT,
ALTER COLUMN "roleName" SET DATA TYPE TEXT,
ALTER COLUMN "type" SET DATA TYPE TEXT;

-- DropEnum
DROP TYPE "VoteType";

-- CreateTable
CREATE TABLE "BingoTaskCompletion" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "taskId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BingoTaskCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BingoTaskCompletion_userId_idx" ON "BingoTaskCompletion"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "BingoTaskCompletion_userId_taskId_key" ON "BingoTaskCompletion"("userId", "taskId");
