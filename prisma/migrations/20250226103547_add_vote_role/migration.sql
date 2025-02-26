/*
  Warnings:

  - Added the required column `roleId` to the `Vote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `roleName` to the `Vote` table without a default value. This is not possible if the table is not empty.

*/
-- First add the columns as nullable
ALTER TABLE "Vote" ADD COLUMN "roleId" TEXT;
ALTER TABLE "Vote" ADD COLUMN "roleName" TEXT;

-- Update existing votes with MiniETH role (lowest tier)
UPDATE "Vote" 
SET "roleId" = '1227046192316285041',
    "roleName" = 'MiniETH'
WHERE "roleId" IS NULL;

-- Make the columns required
ALTER TABLE "Vote" ALTER COLUMN "roleId" SET NOT NULL;
ALTER TABLE "Vote" ALTER COLUMN "roleName" SET NOT NULL;
