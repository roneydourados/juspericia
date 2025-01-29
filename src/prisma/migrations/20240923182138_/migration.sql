/*
  Warnings:

  - Changed the type of `expired_at` on the `user_credit_salt` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "user_credit_salt" DROP COLUMN "expired_at",
ADD COLUMN     "expired_at" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "user_credit_salt_idx_expired_at" ON "user_credit_salt"("expired_at");
