/*
  Warnings:

  - Added the required column `scheduleHour` to the `schedules` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `scheduleDate` on the `schedules` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "scheduleHour" VARCHAR(5) NOT NULL,
DROP COLUMN "scheduleDate",
ADD COLUMN     "scheduleDate" VARCHAR(10) NOT NULL;
