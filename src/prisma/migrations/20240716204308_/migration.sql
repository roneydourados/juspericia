/*
  Warnings:

  - Added the required column `surname` to the `patients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "surname" VARCHAR(200) NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
