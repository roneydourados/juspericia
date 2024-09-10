-- AlterTable
ALTER TABLE "patient_consultations" ADD COLUMN     "antecipation_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
ADD COLUMN     "consultation_value" DECIMAL(18,2) NOT NULL DEFAULT 0;
