/*
  Warnings:

  - Added the required column `sexy` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "sexy" CHAR(1) NOT NULL;
