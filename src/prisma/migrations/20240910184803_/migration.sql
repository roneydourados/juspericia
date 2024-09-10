/*
  Warnings:

  - You are about to drop the column `value_antecipation` on the `consultations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "consultations" DROP COLUMN "value_antecipation",
ADD COLUMN     "value_antecipation_24" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "value_antecipation_48" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "value_antecipation_72" DECIMAL(18,2) NOT NULL DEFAULT 0;
