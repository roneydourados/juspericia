-- CreateIndex
CREATE INDEX "sales_idx_public_id" ON "sales"("public_id");

-- CreateIndex
CREATE INDEX "sales_idx_category" ON "sales"("category");

-- CreateIndex
CREATE INDEX "sales_idx_package_id" ON "sales"("package_id");

-- CreateIndex
CREATE INDEX "sales_idx_solicitation_id" ON "sales"("solicitation_id");
