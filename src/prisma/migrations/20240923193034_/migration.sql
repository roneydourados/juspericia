/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `user_credit_salt` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_credit_salt_idx_public_id";

-- CreateIndex
CREATE UNIQUE INDEX "user_credit_salt_public_id_key" ON "user_credit_salt"("public_id");
