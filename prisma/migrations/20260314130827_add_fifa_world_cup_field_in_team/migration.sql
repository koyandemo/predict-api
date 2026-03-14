/*
  Warnings:

  - You are about to drop the column `continental` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `group_name` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `isHost` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `participations` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `ranking` on the `Match` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "continental",
DROP COLUMN "group_name",
DROP COLUMN "isHost",
DROP COLUMN "participations",
DROP COLUMN "ranking";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "continental" TEXT,
ADD COLUMN     "isHost" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "participations" INTEGER,
ADD COLUMN     "ranking" INTEGER;
