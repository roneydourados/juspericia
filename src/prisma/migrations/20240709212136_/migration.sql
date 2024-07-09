-- CreateEnum
CREATE TYPE "ProfileType" AS ENUM ('ADMIN', 'ADVOGADO', 'MEDICO');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CREDIT_CARD', 'BOLETO', 'PIX');

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "profile_name" VARCHAR(50) NOT NULL,
    "type" "ProfileType" NOT NULL DEFAULT 'ADVOGADO',

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(1000) NOT NULL,
    "password" TEXT NOT NULL,
    "phone" VARCHAR(20),
    "cpf_cnpj" VARCHAR(30),
    "oab" VARCHAR(10),
    "oab_uf" CHAR(2),
    "crm" VARCHAR(10),
    "crm_uf" CHAR(2),
    "profile_id" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "address_category" VARCHAR(30) NOT NULL,
    "address_zipcode" VARCHAR(20),
    "address_city" VARCHAR(100),
    "address_district" VARCHAR(100),
    "address_street" VARCHAR(100),
    "address_number" VARCHAR(10),
    "address_state" CHAR(2),
    "address_complement" VARCHAR(100),

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_models" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "report_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "file_category" VARCHAR(30) NOT NULL,
    "file_name" VARCHAR(300) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profile_routes" (
    "id" SERIAL NOT NULL,
    "profile_id" INTEGER NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "to" VARCHAR(300) NOT NULL,
    "icon" VARCHAR(100) NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "is_menu" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "profile_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,

    CONSTRAINT "benefit_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_purposes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,

    CONSTRAINT "report_purposes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultations" (
    "id" SERIAL NOT NULL,
    "consultation_name" VARCHAR(200) NOT NULL,
    "consutation_value" DECIMAL(18,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultation_packets" (
    "id" SERIAL NOT NULL,
    "consultation_packet_name" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultation_packets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultations_packets_items" (
    "id" SERIAL NOT NULL,
    "consultation_packet_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "consultation_id" INTEGER NOT NULL,
    "consultation_value" DECIMAL(18,2) NOT NULL,
    "consultation_packet_value" DECIMAL(18,2) NOT NULL,
    "consultation_packet_total" DECIMAL(18,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "consultations_packets_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_consultation_packets" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "consultation_packet_id" INTEGER NOT NULL,
    "consultation_packet_name" VARCHAR(200) NOT NULL,
    "consultation_packet_total" DECIMAL(18,2) NOT NULL,
    "status" CHAR(1) NOT NULL DEFAULT 'P',
    "payment_type" "PaymentType" NOT NULL DEFAULT 'CREDIT_CARD',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_consultation_packets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_consultation_packet_items" (
    "id" SERIAL NOT NULL,
    "user_consultation_packet_id" INTEGER NOT NULL,
    "consultation_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "quantity_used" INTEGER NOT NULL DEFAULT 0,
    "unit_value" DECIMAL(18,2) NOT NULL,
    "total" DECIMAL(18,2) NOT NULL,

    CONSTRAINT "users_consultation_packet_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users_consultation_packet_logs" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "user_consultation_packet_item_id" INTEGER NOT NULL,
    "user_consultation_packet_id" INTEGER NOT NULL,
    "consultation_id" INTEGER NOT NULL,
    "history" TEXT NOT NULL,
    "other_quantity" INTEGER NOT NULL DEFAULT 0,
    "input_quantity" INTEGER NOT NULL DEFAULT 0,
    "quantity_used" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_consultation_packet_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(1000) NOT NULL,
    "mother_name" VARCHAR(200),
    "phone" VARCHAR(20),
    "cpf" VARCHAR(30) NOT NULL,
    "rg" VARCHAR(30) NOT NULL,
    "birth_date" DATE NOT NULL,
    "proccess_number" VARCHAR(30),
    "benefit_type_id" INTEGER NOT NULL,
    "report_purpose_id" INTEGER NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_consultations" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "medic_id" INTEGER,
    "consultation_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "content" TEXT NOT NULL,

    CONSTRAINT "patient_consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients_consultation_reports" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "patient_consultation_id" INTEGER NOT NULL,
    "report_model_id" INTEGER,
    "content" TEXT NOT NULL,
    "date_limit_correction" DATE NOT NULL,

    CONSTRAINT "patients_consultation_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "patient_consultation_id" INTEGER,
    "start" VARCHAR(30) NOT NULL,
    "end" VARCHAR(30) NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,
    "class" VARCHAR(30) NOT NULL,
    "background" BOOLEAN NOT NULL DEFAULT false,
    "split" VARCHAR(30) NOT NULL,
    "allDay" BOOLEAN NOT NULL DEFAULT false,
    "deletable" BOOLEAN NOT NULL DEFAULT true,
    "resizable" BOOLEAN NOT NULL DEFAULT true,
    "user_schedule" VARCHAR(200) NOT NULL,

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_idx_name" ON "users"("name");

-- CreateIndex
CREATE INDEX "users_idx_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_idx_cpf_cnpj" ON "users"("cpf_cnpj");

-- CreateIndex
CREATE INDEX "users_idx_is_active" ON "users"("is_active");

-- CreateIndex
CREATE INDEX "address_idx_owner_id" ON "address"("owner_id");

-- CreateIndex
CREATE INDEX "address_idx_address_category" ON "address"("address_category");

-- CreateIndex
CREATE INDEX "files_idx_owner_id" ON "files"("owner_id");

-- CreateIndex
CREATE INDEX "files_idx_file_category" ON "files"("file_category");

-- CreateIndex
CREATE UNIQUE INDEX "patients_email_key" ON "patients"("email");

-- CreateIndex
CREATE INDEX "patients_idx_name" ON "patients"("name");

-- CreateIndex
CREATE INDEX "patients_idx_email" ON "patients"("email");

-- CreateIndex
CREATE INDEX "patients_idx_cpf" ON "patients"("cpf");

-- CreateIndex
CREATE INDEX "schedules_idx_user_id" ON "schedules"("user_id");

-- CreateIndex
CREATE INDEX "schedules_idx_start" ON "schedules"("start");

-- CreateIndex
CREATE INDEX "schedules_idx_end" ON "schedules"("end");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "profile_routes" ADD CONSTRAINT "profile_routes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultations_packets_items" ADD CONSTRAINT "consultations_packets_items_consultation_packet_id_fkey" FOREIGN KEY ("consultation_packet_id") REFERENCES "consultation_packets"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "consultations_packets_items" ADD CONSTRAINT "consultations_packets_items_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_consultation_packets" ADD CONSTRAINT "users_consultation_packets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_consultation_packet_items" ADD CONSTRAINT "users_consultation_packet_items_user_consultation_packet_i_fkey" FOREIGN KEY ("user_consultation_packet_id") REFERENCES "users_consultation_packets"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_consultation_packet_items" ADD CONSTRAINT "users_consultation_packet_items_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_consultation_packet_logs" ADD CONSTRAINT "users_consultation_packet_logs_user_consultation_packet_id_fkey" FOREIGN KEY ("user_consultation_packet_id") REFERENCES "users_consultation_packets"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_consultation_packet_logs" ADD CONSTRAINT "users_consultation_packet_logs_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users_consultation_packet_logs" ADD CONSTRAINT "users_consultation_packet_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_report_purpose_id_fkey" FOREIGN KEY ("report_purpose_id") REFERENCES "report_purposes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_benefit_type_id_fkey" FOREIGN KEY ("benefit_type_id") REFERENCES "benefit_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients_consultation_reports" ADD CONSTRAINT "patients_consultation_reports_patient_consultation_id_fkey" FOREIGN KEY ("patient_consultation_id") REFERENCES "patient_consultations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients_consultation_reports" ADD CONSTRAINT "patients_consultation_reports_report_model_id_fkey" FOREIGN KEY ("report_model_id") REFERENCES "report_models"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "patients_consultation_reports" ADD CONSTRAINT "patients_consultation_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_patient_consultation_id_fkey" FOREIGN KEY ("patient_consultation_id") REFERENCES "patient_consultations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
