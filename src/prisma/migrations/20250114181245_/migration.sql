/*
  Warnings:

  - You are about to drop the `user_sales` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "user_sales";

-- CreateTable
CREATE TABLE "sales" (
    "id" SERIAL NOT NULL,
    "sale_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date_created" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "original_due_date" DATE,
    "description" TEXT NOT NULL,
    "nosso_numero" TEXT,
    "value" DECIMAL(18,2) NOT NULL,
    "net_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "billing_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "confirmed_date" DATE,
    "payment_date" DATE,
    "transaction_receipt_url" TEXT,
    "invoice_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "sales_idx_id" ON "sales"("user_id");

-- CreateIndex
CREATE INDEX "sales_idx_sale_id" ON "sales"("sale_id");

-- CreateIndex
CREATE INDEX "sales_idx_date_created" ON "sales"("date_created");
