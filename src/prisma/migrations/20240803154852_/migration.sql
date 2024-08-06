-- AlterTable
ALTER TABLE "patient_consultations" ADD COLUMN     "date_close" DATE,
ADD COLUMN     "date_open" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'open';
