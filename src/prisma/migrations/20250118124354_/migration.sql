/*
  Warnings:

  - You are about to drop the `ServicePackages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ServicePackages";

-- CreateTable
CREATE TABLE "service_packages" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url_image" TEXT NOT NULL,
    "value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_packages_pkey" PRIMARY KEY ("id")
);
