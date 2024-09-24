-- AlterTable
ALTER TABLE "patients_consultation_reports" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'active';

-- CreateIndex
CREATE INDEX "patients_consultation_reports_idx_status" ON "patients_consultation_reports"("status");
