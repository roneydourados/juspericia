-- AlterTable
ALTER TABLE "user_log_credits" ADD COLUMN     "credit_salt_id" INTEGER;

-- CreateTable
CREATE TABLE "user_credit_salt" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "salt" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "salt_category" VARCHAR(30) NOT NULL,
    "expired_at" VARCHAR(25) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,

    CONSTRAINT "user_credit_salt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_credit_salt_idx_user_id" ON "user_credit_salt"("user_id");

-- CreateIndex
CREATE INDEX "user_credit_salt_idx_salt_category" ON "user_credit_salt"("salt_category");

-- CreateIndex
CREATE INDEX "user_credit_salt_idx_expired_at" ON "user_credit_salt"("expired_at");

-- CreateIndex
CREATE INDEX "user_log_credits_idx_credit_salt_id" ON "user_log_credits"("credit_salt_id");
