/*
  Warnings:

  - You are about to alter the column `process_situation` on the `patient_consultations` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `VarChar(2)`.

*/
-- AlterTable
ALTER TABLE "patient_consultations" ALTER COLUMN "process_situation" SET DATA TYPE VARCHAR(2);
