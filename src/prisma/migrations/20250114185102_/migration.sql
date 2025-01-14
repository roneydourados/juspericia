/*
  Warnings:

  - You are about to drop the column `sale_id` on the `user_credit_log` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_credit_log" DROP COLUMN "sale_id";

-- AlterTable
ALTER TABLE "user_credit_salt" ADD COLUMN     "sale_id" INTEGER;
