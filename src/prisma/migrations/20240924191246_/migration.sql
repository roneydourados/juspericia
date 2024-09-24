/*
  Warnings:

  - You are about to drop the column `date_limit_correction` on the `patients_consultation_reports` table. All the data in the column will be lost.
  - You are about to drop the column `report_model_id` on the `patients_consultation_reports` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "patients_consultation_reports_idx_report_model_id";

-- AlterTable
ALTER TABLE "patients_consultation_reports" DROP COLUMN "date_limit_correction",
DROP COLUMN "report_model_id",
ADD COLUMN     "reportModelId" INTEGER;
