/*
  Warnings:

  - A unique constraint covering the columns `[public_id]` on the table `files` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "files_public_id_key" ON "files"("public_id");
