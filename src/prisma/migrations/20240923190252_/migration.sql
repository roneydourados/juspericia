-- AlterTable
ALTER TABLE "user_credit_salt" ADD COLUMN     "public_id" VARCHAR(50);

-- CreateIndex
CREATE INDEX "user_credit_salt_idx_public_id" ON "user_credit_salt"("public_id");
