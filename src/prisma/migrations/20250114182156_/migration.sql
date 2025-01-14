-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "local_status" TEXT NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE INDEX "sales_idx_local_status" ON "sales"("local_status");
