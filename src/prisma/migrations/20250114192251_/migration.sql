/*
  Warnings:

  - Added the required column `expired_at` to the `sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "expired_at" DATE NOT NULL;
