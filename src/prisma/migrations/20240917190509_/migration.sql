/*
  Warnings:

  - You are about to drop the column `user_id` on the `schedules` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "schedules_idx_user_id";

-- AlterTable
ALTER TABLE "schedules" DROP COLUMN "user_id",
ADD COLUMN     "medic_id" INTEGER;

-- CreateIndex
CREATE INDEX "schedules_idx_medic_id" ON "schedules"("medic_id");
