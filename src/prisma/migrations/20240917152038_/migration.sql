/*
  Warnings:

  - You are about to drop the column `allDay` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `background` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `class` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `deletable` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `end` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `resizable` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `split` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `start` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `scheduleDate` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "schedules_idx_end";

-- DropIndex
DROP INDEX "schedules_idx_start";

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "allDay",
DROP COLUMN "background",
DROP COLUMN "class",
DROP COLUMN "content",
DROP COLUMN "deletable",
DROP COLUMN "end",
DROP COLUMN "resizable",
DROP COLUMN "split",
DROP COLUMN "start",
ADD COLUMN     "scheduleDate" TIMESTAMPTZ NOT NULL;
