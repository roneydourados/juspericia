-- CreateTable
CREATE TABLE "user_indications" (
    "id" SERIAL NOT NULL,
    "public_id" VARCHAR(40) NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(1000) NOT NULL,
    "whatsapp" VARCHAR(20) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'A',
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_indications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_indications_idx_user_id" ON "user_indications"("userId");

-- CreateIndex
CREATE INDEX "user_indications_idx_public_id" ON "user_indications"("public_id");

-- CreateIndex
CREATE INDEX "user_indications_idx_status" ON "user_indications"("status");

-- CreateIndex
CREATE INDEX "user_indications_idx_name" ON "user_indications"("name");

-- CreateIndex
CREATE INDEX "user_indications_idx_email" ON "user_indications"("email");
