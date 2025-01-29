/*
  Warnings:

  - You are about to drop the column `deletedDate` on the `service_packages` table. All the data in the column will be lost.
  - You are about to drop the column `userDeleted` on the `service_packages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "service_packages" DROP COLUMN "deletedDate",
DROP COLUMN "userDeleted",
ADD COLUMN     "deleted_date" DATE,
ADD COLUMN     "user_deleted" TEXT;
