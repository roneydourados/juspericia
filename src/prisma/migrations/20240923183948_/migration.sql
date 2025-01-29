/*
  Warnings:

  - You are about to drop the `user_log_credit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "user_log_credit";

-- CreateTable
CREATE TABLE "user_credit_log" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "credit_salt_id" INTEGER,
    "history" TEXT NOT NULL,
    "old_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "input_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "output_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "salt_value" DECIMAL(18,2) NOT NULL DEFAULT 0,

    CONSTRAINT "user_credit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_log_credits_idx_created_at" ON "user_credit_log"("created_at");

-- CreateIndex
CREATE INDEX "user_log_credits_idx_user_id" ON "user_credit_log"("user_id");

-- CreateIndex
CREATE INDEX "user_log_credits_idx_credit_salt_id" ON "user_credit_log"("credit_salt_id");
