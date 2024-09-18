/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `benefit_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `consultations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `patient_consultations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `patients_consultation_reports` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `profiles` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `report_models` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `report_purposes` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `schedules` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[public_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "address" ADD COLUMN     "public_id" VARCHAR(40);

-- AlterTable
ALTER TABLE "benefit_types" ADD COLUMN     "public_id" VARCHAR(40);

-- AlterTable
ALTER TABLE "consultations" ADD COLUMN     "public_id" VARCHAR(40);

-- AlterTable
ALTER TABLE "patient_consultations" ADD COLUMN     "public_id" VARCHAR(40);

-- AlterTable
ALTER TABLE "patients_consultation_reports" ADD COLUMN     "public_id" VARCHAR(40);

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "public_id" VARCHAR(40);

-- AlterTable
ALTER TABLE "report_models" ADD COLUMN     "public_id" VARCHAR(40);

-- AlterTable
ALTER TABLE "report_purposes" ADD COLUMN     "public_id" VARCHAR(40);

-- AlterTable
ALTER TABLE "schedules" ADD COLUMN     "public_id" VARCHAR(40);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "public_id" VARCHAR(40);

-- CreateIndex
CREATE UNIQUE INDEX "address_public_id_key" ON "address"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "benefit_types_public_id_key" ON "benefit_types"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "consultations_public_id_key" ON "consultations"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "patient_consultations_public_id_key" ON "patient_consultations"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_consultation_reports_public_id_key" ON "patients_consultation_reports"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_public_id_key" ON "profiles"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_models_public_id_key" ON "report_models"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_purposes_public_id_key" ON "report_purposes"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_public_id_key" ON "schedules"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_public_id_key" ON "users"("public_id");
