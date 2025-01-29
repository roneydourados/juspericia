/*
  Warnings:

  - You are about to drop the column `deleted_date` on the `service_packages` table. All the data in the column will be lost.
  - You are about to drop the column `user_deleted` on the `service_packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "service_packages" DROP COLUMN "deleted_date",
DROP COLUMN "user_deleted";
