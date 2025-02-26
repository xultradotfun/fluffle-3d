/*
  Warnings:

  - You are about to alter the column `roleId` on the `Vote` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(20)`.
  - You are about to alter the column `roleName` on the `Vote` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - Changed the type of `type` on the `Vote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Vote" ALTER COLUMN "roleId" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "roleName" SET DATA TYPE VARCHAR(50),
DROP COLUMN "type",
ADD COLUMN     "type" VARCHAR(4) NOT NULL;
