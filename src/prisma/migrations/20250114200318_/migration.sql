/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `sales` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "public_id" VARCHAR(40);

-- CreateIndex
CREATE UNIQUE INDEX "sales_public_id_key" ON "sales"("public_id");
