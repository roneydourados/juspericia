/*
  Warnings:

  - Added the required column `expiredAt` to the `user_indications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_indications" ADD COLUMN     "expiredAt" DATE NOT NULL;
