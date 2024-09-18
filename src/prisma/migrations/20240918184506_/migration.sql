/*
  Warnings:

  - You are about to alter the column `public_id` on the `patients` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(40)`.

*/
-- AlterTable
ALTER TABLE "patients" ALTER COLUMN "public_id" SET DATA TYPE VARCHAR(40);
