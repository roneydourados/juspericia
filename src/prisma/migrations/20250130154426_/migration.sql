-- CreateTable
CREATE TABLE "system_parameters" (
    "id" SERIAL NOT NULL,
    "public_id" VARCHAR(40) NOT NULL,
    "points_per_indication" INTEGER NOT NULL,
    "points_exchange" INTEGER NOT NULL,
    "points_exchange_value" DECIMAL(18,2) NOT NULL,
    "days_points_expire" INTEGER NOT NULL,
    "comission_value" DECIMAL(18,2) NOT NULL,
    "days_credit_expire" INTEGER NOT NULL,

    CONSTRAINT "system_parameters_pkey" PRIMARY KEY ("id")
);
