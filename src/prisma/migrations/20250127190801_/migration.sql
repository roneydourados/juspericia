/*
  Warnings:

  - You are about to drop the column `salt` on the `sales` table. All the data in the column will be lost.
  - You are about to drop the column `sale_id` on the `user_credit_log` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `user_credit_log` table. All the data in the column will be lost.
  - Added the required column `user_credit_id` to the `user_credit_log` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_log_credits_idx_sale_id";

-- DropIndex
DROP INDEX "user_log_credits_idx_user_id";

-- AlterTable
ALTER TABLE "sales" DROP COLUMN "salt";

-- AlterTable
ALTER TABLE "user_credit_log" DROP COLUMN "sale_id",
DROP COLUMN "user_id",
ADD COLUMN     "user_credit_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "user_credits" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "credit_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "salt" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "category" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_credits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_credits_idx_credit_date" ON "user_credits"("credit_date");

-- CreateIndex
CREATE INDEX "user_credits_idx_user_id" ON "user_credits"("user_id");

-- CreateIndex
CREATE INDEX "user_credits_idx_category" ON "user_credits"("category");

-- CreateIndex
CREATE INDEX "user_credits_idx_owner_id" ON "user_credits"("owner_id");

-- CreateIndex
CREATE INDEX "user_log_credits_idx_user_credit_id" ON "user_credit_log"("user_credit_id");
