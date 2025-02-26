/*
  Warnings:

  - Changed the type of `type` on the `Vote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VoteType" AS ENUM ('up', 'down');

-- AlterTable
ALTER TABLE "Vote" DROP COLUMN "type",
ADD COLUMN     "type" "VoteType" NOT NULL;
