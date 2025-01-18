-- CreateTable
CREATE TABLE "ServicePackages" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url_image" TEXT NOT NULL,
    "value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServicePackages_pkey" PRIMARY KEY ("id")
);
