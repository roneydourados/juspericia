-- AlterTable
ALTER TABLE "service_packages" ADD COLUMN     "deletedDate" DATE,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "userDeleted" TEXT;
