/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "patients_public_id_key" ON "patients"("public_id");
