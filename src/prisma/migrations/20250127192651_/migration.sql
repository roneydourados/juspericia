/*
  Warnings:

  - Added the required column `expire_date` to the `user_credits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "service_packages" ADD COLUMN     "due_days" INTEGER;

-- AlterTable
ALTER TABLE "user_credits" ADD COLUMN     "expire_date" DATE NOT NULL;
