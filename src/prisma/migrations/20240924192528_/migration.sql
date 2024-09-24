-- AlterTable
ALTER TABLE "patients_consultation_reports" ADD COLUMN     "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;
