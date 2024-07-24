/*
  Warnings:

  - You are about to drop the column `is_active` on the `users` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "users_idx_is_active";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_active";

-- CreateIndex
CREATE INDEX "users_idx_active" ON "users"("active");
