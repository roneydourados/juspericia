-- AlterTable
ALTER TABLE "patients_consultation_reports" ADD COLUMN     "deleted_at" TIMESTAMPTZ,
ADD COLUMN     "user_deleted" VARCHAR(255);
