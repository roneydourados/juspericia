/*
  Warnings:

  - You are about to drop the column `scheduleDate` on the `schedules` table. All the data in the column will be lost.
  - You are about to drop the column `scheduleHour` on the `schedules` table. All the data in the column will be lost.
  - Added the required column `schedule_date` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Added the required column `schedule_hour` to the `schedules` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "schedules_idx_schedule_date";

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "scheduleDate",
DROP COLUMN "scheduleHour",
ADD COLUMN     "schedule_date" VARCHAR(10) NOT NULL,
ADD COLUMN     "schedule_hour" VARCHAR(5) NOT NULL;

-- CreateIndex
CREATE INDEX "schedules_idx_schedule_date" ON "schedules"("schedule_date");
