-- CreateTable
CREATE TABLE "service_package_history" (
    "id" SERIAL NOT NULL,
    "public_id" TEXT,
    "package_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'created',
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_package_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_package_history_idx_user_id" ON "service_package_history"("user_id");

-- CreateIndex
CREATE INDEX "service_package_history_idx_package_id" ON "service_package_history"("package_id");
