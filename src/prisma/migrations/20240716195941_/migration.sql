/*
  Warnings:

  - You are about to drop the column `consutation_value` on the `consultations` table. All the data in the column will be lost.
  - You are about to drop the column `benefit_type_id` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `proccess_number` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the column `report_purpose_id` on the `patients` table. All the data in the column will be lost.
  - You are about to drop the `users_consultation_packet_logs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `value` to the `consultations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value_antecipation` to the `consultations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value_credit` to the `consultations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `benefit_type_id` to the `patient_consultations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `report_purpose_id` to the `patient_consultations` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_benefit_type_id_fkey";

-- DropForeignKey
ALTER TABLE "patients" DROP CONSTRAINT "patients_report_purpose_id_fkey";

-- DropForeignKey
ALTER TABLE "users_consultation_packet_logs" DROP CONSTRAINT "users_consultation_packet_logs_consultation_id_fkey";

-- DropForeignKey
ALTER TABLE "users_consultation_packet_logs" DROP CONSTRAINT "users_consultation_packet_logs_user_consultation_packet_id_fkey";

-- DropForeignKey
ALTER TABLE "users_consultation_packet_logs" DROP CONSTRAINT "users_consultation_packet_logs_user_id_fkey";

-- AlterTable
ALTER TABLE "consultations" DROP COLUMN "consutation_value",
ADD COLUMN     "value" DECIMAL(18,2) NOT NULL,
ADD COLUMN     "value_antecipation" DECIMAL(18,2) NOT NULL,
ADD COLUMN     "value_credit" DECIMAL(18,2) NOT NULL;

-- AlterTable
ALTER TABLE "patient_consultations" ADD COLUMN     "benefit_type_id" INTEGER NOT NULL,
ADD COLUMN     "proccess_number" VARCHAR(30),
ADD COLUMN     "process_situation" VARCHAR(30),
ADD COLUMN     "report_purpose_id" INTEGER NOT NULL,
ADD COLUMN     "status" VARCHAR(30) NOT NULL DEFAULT 'P',
ADD COLUMN     "tip_value" DECIMAL(18,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "patients" DROP COLUMN "benefit_type_id",
DROP COLUMN "proccess_number",
DROP COLUMN "report_purpose_id",
ALTER COLUMN "status" SET DATA TYPE VARCHAR(1);

-- DropTable
DROP TABLE "users_consultation_packet_logs";

-- CreateTable
CREATE TABLE "user_log_credits" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "history" TEXT NOT NULL,
    "old_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "input_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "output_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "salt_value" DECIMAL(18,2) NOT NULL DEFAULT 0,

    CONSTRAINT "user_log_credits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_log_credits_idx_created_at" ON "user_log_credits"("created_at");

-- AddForeignKey
ALTER TABLE "user_log_credits" ADD CONSTRAINT "user_log_credits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_report_purpose_id_fkey" FOREIGN KEY ("report_purpose_id") REFERENCES "report_purposes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_benefit_type_id_fkey" FOREIGN KEY ("benefit_type_id") REFERENCES "benefit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
