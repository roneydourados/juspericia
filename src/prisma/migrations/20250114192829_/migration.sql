-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "salt" DECIMAL(18,2) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "user_credit_log" (
    "id" SERIAL NOT NULL,
    "sale_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "history" TEXT NOT NULL,
    "type" CHAR(1) NOT NULL DEFAULT 'D',
    "value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_credit_log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_log_credits_idx_created_at" ON "user_credit_log"("created_at");

-- CreateIndex
CREATE INDEX "user_log_credits_idx_user_id" ON "user_credit_log"("user_id");

-- CreateIndex
CREATE INDEX "user_log_credits_idx_sale_id" ON "user_credit_log"("sale_id");
