/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `user_credits` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `public_id` to the `user_credits` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_credits" ADD COLUMN     "public_id" VARCHAR(40) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_credits_public_id_key" ON "user_credits"("public_id");
