-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CREDIT_CARD', 'BOLETO', 'PIX');

-- CreateEnum
CREATE TYPE "ProfileType" AS ENUM ('ADMIN', 'ADVOGADO', 'MEDICO');

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
CREATE TABLE "benefit_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,

    CONSTRAINT "benefit_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "consultations" (
    "id" SERIAL NOT NULL,
    "consultation_name" VARCHAR(200) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "value" DECIMAL(18,2) NOT NULL,
    "value_credit" DECIMAL(18,2) NOT NULL,
    "value_packet" DECIMAL(18,2) NOT NULL,
    "value_antecipation_24" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "value_antecipation_48" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "value_antecipation_72" DECIMAL(18,2) NOT NULL DEFAULT 0,

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "patients" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(1000),
    "mother_name" VARCHAR(200),
    "phone" VARCHAR(20),
    "cpf" VARCHAR(30) NOT NULL,
    "rg" VARCHAR(30) NOT NULL,
    "status" VARCHAR(1) NOT NULL DEFAULT 'A',
    "sexy" CHAR(1) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "surname" VARCHAR(200) NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "birth_date" VARCHAR(10) NOT NULL,

    CONSTRAINT "patients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patient_consultations" (
    "id" SERIAL NOT NULL,
    "patient_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "medic_id" INTEGER,
    "consultation_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "benefit_type_id" INTEGER NOT NULL,
    "proccess_number" VARCHAR(30),
    "process_situation" VARCHAR(2),
    "report_purpose_id" INTEGER NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'open',
    "tip_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "date_close" DATE,
    "date_open" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "rate" INTEGER DEFAULT 0,
    "date_antecipation" DATE,
    "date_correction" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason_correction" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "antecipation_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "consultation_value" DECIMAL(18,2) NOT NULL DEFAULT 0,

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
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "profile_name" VARCHAR(50) NOT NULL,
    "type" "ProfileType" NOT NULL DEFAULT 'ADVOGADO',

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "report_models" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "report_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_purposes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,

    CONSTRAINT "report_purposes_pkey" PRIMARY KEY ("id")
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "office_name" VARCHAR(200),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "office_cnpj" VARCHAR(30),
    "office_email" VARCHAR(1000),
    "office_phone" VARCHAR(20),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_log_credits" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" INTEGER NOT NULL,
    "history" TEXT NOT NULL,
    "old_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "input_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "output_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "salt_value" DECIMAL(18,2) NOT NULL DEFAULT 0,

    CONSTRAINT "user_log_credits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "address_idx_owner_id" ON "address"("owner_id");

-- CreateIndex
CREATE INDEX "address_idx_address_category" ON "address"("address_category");

-- CreateIndex
CREATE INDEX "address_idx_address_city" ON "address"("address_city");

-- CreateIndex
CREATE INDEX "address_idx_address_state" ON "address"("address_state");

-- CreateIndex
CREATE INDEX "files_idx_owner_id" ON "files"("owner_id");

-- CreateIndex
CREATE INDEX "files_idx_file_category" ON "files"("file_category");

-- CreateIndex
CREATE UNIQUE INDEX "patients_cpf_key" ON "patients"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "patients_rg_key" ON "patients"("rg");

-- CreateIndex
CREATE INDEX "patients_idx_name" ON "patients"("name");

-- CreateIndex
CREATE INDEX "patients_idx_email" ON "patients"("email");

-- CreateIndex
CREATE INDEX "patients_idx_cpf" ON "patients"("cpf");

-- CreateIndex
CREATE INDEX "patients_idx_user_id" ON "patients"("user_id");

-- CreateIndex
CREATE INDEX "patient_consultations_idx_medic_id" ON "patient_consultations"("medic_id");

-- CreateIndex
CREATE INDEX "patient_consultations_idx_patient_id" ON "patient_consultations"("patient_id");

-- CreateIndex
CREATE INDEX "patient_consultations_idx_consultation_id" ON "patient_consultations"("consultation_id");

-- CreateIndex
CREATE INDEX "patient_consultations_idx_report_purpose_id" ON "patient_consultations"("report_purpose_id");

-- CreateIndex
CREATE INDEX "patient_consultations_idx_benefit_type_id" ON "patient_consultations"("benefit_type_id");

-- CreateIndex
CREATE INDEX "patients_consultation_reports_idx_patient_consultation_id" ON "patients_consultation_reports"("patient_consultation_id");

-- CreateIndex
CREATE INDEX "patients_consultation_reports_idx_report_model_id" ON "patients_consultation_reports"("report_model_id");

-- CreateIndex
CREATE INDEX "patients_consultation_reports_idx_user_id" ON "patients_consultation_reports"("user_id");

-- CreateIndex
CREATE INDEX "profile_routes_idx_profile_id" ON "profile_routes"("profile_id");

-- CreateIndex
CREATE INDEX "schedules_idx_user_id" ON "schedules"("user_id");

-- CreateIndex
CREATE INDEX "schedules_idx_start" ON "schedules"("start");

-- CreateIndex
CREATE INDEX "schedules_idx_end" ON "schedules"("end");

-- CreateIndex
CREATE INDEX "schedules_idx_patient_consultation_id" ON "schedules"("patient_consultation_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_idx_name" ON "users"("name");

-- CreateIndex
CREATE INDEX "users_idx_email" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_idx_cpf_cnpj" ON "users"("cpf_cnpj");

-- CreateIndex
CREATE INDEX "users_idx_active" ON "users"("active");

-- CreateIndex
CREATE INDEX "users_idx_profile_id" ON "users"("profile_id");

-- CreateIndex
CREATE INDEX "user_log_credits_idx_created_at" ON "user_log_credits"("created_at");

-- CreateIndex
CREATE INDEX "user_log_credits_idx_user_id" ON "user_log_credits"("user_id");
