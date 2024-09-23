-- CreateTable
CREATE TABLE "user_credit_payment" (
    "id" SERIAL NOT NULL,
    "user_credit_salt_id" INTEGER NOT NULL,
    "payment_form" VARCHAR(30) NOT NULL,
    "value" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "charge_id" VARCHAR(50),
    "status" VARCHAR(30) NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_credit_payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_credit_payment_idx_user_credit_salt_id" ON "user_credit_payment"("user_credit_salt_id");

-- CreateIndex
CREATE INDEX "user_credit_payment_idx_status" ON "user_credit_payment"("status");
