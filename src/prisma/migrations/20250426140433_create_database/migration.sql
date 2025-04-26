-- CreateEnum
CREATE TYPE "ProfileType" AS ENUM ('ADMIN', 'ADVOGADO', 'MEDICO');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CREDIT_CARD', 'BOLETO', 'PIX');

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
    "public_id" VARCHAR(40),

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "benefit_types" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "public_id" VARCHAR(40),

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
    "public_id" VARCHAR(40),

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "file_category" VARCHAR(30) NOT NULL,
    "file_name" VARCHAR(300) NOT NULL,
    "file_server_name" VARCHAR(300) NOT NULL,
    "public_id" VARCHAR(40),

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
    "public_id" VARCHAR(40),

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
    "value_credit" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "public_id" VARCHAR(40),
    "is_telemedicine" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "patient_consultations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patients_consultation_reports" (
    "id" SERIAL NOT NULL,
    "public_id" VARCHAR(40),
    "user_id" INTEGER NOT NULL,
    "patient_consultation_id" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',
    "report_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ,
    "user_deleted" VARCHAR(255),

    CONSTRAINT "patients_consultation_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "profiles" (
    "id" SERIAL NOT NULL,
    "profile_name" VARCHAR(50) NOT NULL,
    "public_id" VARCHAR(40),
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
    "public_id" VARCHAR(40),

    CONSTRAINT "report_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_purposes" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "public_id" VARCHAR(40),

    CONSTRAINT "report_purposes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schedules" (
    "id" SERIAL NOT NULL,
    "medic_id" INTEGER,
    "patient_consultation_id" INTEGER,
    "schedule_date" VARCHAR(10) NOT NULL,
    "schedule_hour" VARCHAR(5) NOT NULL,
    "atendiment_start" VARCHAR(40),
    "atendiment_end" VARCHAR(40),
    "title" VARCHAR(200) NOT NULL,
    "user_schedule" VARCHAR(200) NOT NULL,
    "public_id" VARCHAR(40),
    "status" VARCHAR(20) NOT NULL DEFAULT 'active',

    CONSTRAINT "schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_package_history" (
    "id" SERIAL NOT NULL,
    "public_id" VARCHAR(40),
    "package_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "action" TEXT NOT NULL DEFAULT 'created',
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_package_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_packages" (
    "id" SERIAL NOT NULL,
    "public_id" VARCHAR(40),
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url_image" TEXT NOT NULL,
    "value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'active',
    "due_days" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_parameters" (
    "id" SERIAL NOT NULL,
    "public_id" VARCHAR(40),
    "points_per_indication" INTEGER NOT NULL,
    "points_exchange" INTEGER NOT NULL,
    "points_exchange_value" DECIMAL(18,2) NOT NULL,
    "days_points_expire" INTEGER NOT NULL,
    "comission_value" DECIMAL(18,2) NOT NULL,
    "days_credit_expire" INTEGER NOT NULL,
    "suport_whatsapp" VARCHAR(20),

    CONSTRAINT "system_parameters_pkey" PRIMARY KEY ("id")
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
    "public_id" VARCHAR(40),
    "medic_consultation_value" DECIMAL(18,2) DEFAULT 0,
    "medic_consultation_type" CHAR(1) DEFAULT 'V',
    "customer_id" VARCHAR(40),
    "whatsapp" VARCHAR(20),
    "medic_hour_end" VARCHAR(5),
    "medic_hour_start" VARCHAR(5),
    "medic_query_interval" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_credits" (
    "id" SERIAL NOT NULL,
    "public_id" VARCHAR(40),
    "owner_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "credit_date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expire_date" DATE NOT NULL,
    "value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "salt" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "category" VARCHAR(20) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "transaction_receipt_url" TEXT,
    "invoice_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_indications" (
    "id" SERIAL NOT NULL,
    "public_id" VARCHAR(40),
    "userId" INTEGER NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(1000) NOT NULL,
    "whatsapp" VARCHAR(20) NOT NULL,
    "status" VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    "points" INTEGER NOT NULL DEFAULT 0,
    "expiredAt" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_indications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_credit_log" (
    "id" SERIAL NOT NULL,
    "user_credit_id" INTEGER NOT NULL,
    "history" TEXT NOT NULL,
    "type" CHAR(1) NOT NULL DEFAULT 'D',
    "value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_credit_log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" SERIAL NOT NULL,
    "sale_id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,
    "date_created" DATE NOT NULL,
    "due_date" DATE NOT NULL,
    "original_due_date" DATE,
    "description" TEXT NOT NULL,
    "nosso_numero" TEXT,
    "value" DECIMAL(18,2) NOT NULL,
    "net_value" DECIMAL(18,2) NOT NULL DEFAULT 0,
    "billing_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "confirmed_date" DATE,
    "payment_date" DATE,
    "transaction_receipt_url" TEXT,
    "invoice_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "local_status" TEXT NOT NULL DEFAULT 'pending',
    "expired_at" DATE,
    "public_id" VARCHAR(40),
    "category" VARCHAR(40),
    "package_id" INTEGER,
    "solicitation_id" INTEGER,

    CONSTRAINT "sales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_tokens" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "address_public_id_key" ON "address"("public_id");

-- CreateIndex
CREATE INDEX "address_idx_owner_id" ON "address"("owner_id");

-- CreateIndex
CREATE INDEX "address_idx_address_category" ON "address"("address_category");

-- CreateIndex
CREATE INDEX "address_idx_address_city" ON "address"("address_city");

-- CreateIndex
CREATE INDEX "address_idx_address_state" ON "address"("address_state");

-- CreateIndex
CREATE UNIQUE INDEX "benefit_types_public_id_key" ON "benefit_types"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "consultations_public_id_key" ON "consultations"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "files_public_id_key" ON "files"("public_id");

-- CreateIndex
CREATE INDEX "files_idx_owner_id" ON "files"("owner_id");

-- CreateIndex
CREATE INDEX "files_idx_file_category" ON "files"("file_category");

-- CreateIndex
CREATE INDEX "files_idx_public_id" ON "files"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "patients_cpf_key" ON "patients"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "patients_rg_key" ON "patients"("rg");

-- CreateIndex
CREATE UNIQUE INDEX "patients_public_id_key" ON "patients"("public_id");

-- CreateIndex
CREATE INDEX "patients_idx_name" ON "patients"("name");

-- CreateIndex
CREATE INDEX "patients_idx_email" ON "patients"("email");

-- CreateIndex
CREATE INDEX "patients_idx_cpf" ON "patients"("cpf");

-- CreateIndex
CREATE INDEX "patients_idx_user_id" ON "patients"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "patient_consultations_public_id_key" ON "patient_consultations"("public_id");

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
CREATE INDEX "patient_consultations_idx_public_id" ON "patient_consultations"("public_id");

-- CreateIndex
CREATE INDEX "patient_consultations_idx_status" ON "patient_consultations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "patients_consultation_reports_public_id_key" ON "patients_consultation_reports"("public_id");

-- CreateIndex
CREATE INDEX "patients_consultation_reports_idx_patient_consultation_id" ON "patients_consultation_reports"("patient_consultation_id");

-- CreateIndex
CREATE INDEX "patients_consultation_reports_idx_user_id" ON "patients_consultation_reports"("user_id");

-- CreateIndex
CREATE INDEX "patients_consultation_reports_idx_status" ON "patients_consultation_reports"("status");

-- CreateIndex
CREATE INDEX "patients_consultation_reports_idx_report_date" ON "patients_consultation_reports"("report_date");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_public_id_key" ON "profiles"("public_id");

-- CreateIndex
CREATE INDEX "profile_routes_idx_profile_id" ON "profile_routes"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_models_public_id_key" ON "report_models"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "report_purposes_public_id_key" ON "report_purposes"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "schedules_public_id_key" ON "schedules"("public_id");

-- CreateIndex
CREATE INDEX "schedules_idx_medic_id" ON "schedules"("medic_id");

-- CreateIndex
CREATE INDEX "schedules_idx_patient_consultation_id" ON "schedules"("patient_consultation_id");

-- CreateIndex
CREATE INDEX "schedules_idx_schedule_date" ON "schedules"("schedule_date");

-- CreateIndex
CREATE INDEX "schedules_idx_status" ON "schedules"("status");

-- CreateIndex
CREATE UNIQUE INDEX "service_package_history_public_id_key" ON "service_package_history"("public_id");

-- CreateIndex
CREATE INDEX "service_package_history_idx_user_id" ON "service_package_history"("user_id");

-- CreateIndex
CREATE INDEX "service_package_history_idx_package_id" ON "service_package_history"("package_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_packages_public_id_key" ON "service_packages"("public_id");

-- CreateIndex
CREATE INDEX "service_packages_status_index" ON "service_packages"("status");

-- CreateIndex
CREATE UNIQUE INDEX "system_parameters_public_id_key" ON "system_parameters"("public_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_public_id_key" ON "users"("public_id");

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
CREATE UNIQUE INDEX "user_credits_public_id_key" ON "user_credits"("public_id");

-- CreateIndex
CREATE INDEX "user_credits_idx_credit_date" ON "user_credits"("credit_date");

-- CreateIndex
CREATE INDEX "user_credits_idx_user_id" ON "user_credits"("user_id");

-- CreateIndex
CREATE INDEX "user_credits_idx_category" ON "user_credits"("category");

-- CreateIndex
CREATE INDEX "user_credits_idx_owner_id" ON "user_credits"("owner_id");

-- CreateIndex
CREATE INDEX "user_credits_idx_status" ON "user_credits"("status");

-- CreateIndex
CREATE UNIQUE INDEX "user_indications_public_id_key" ON "user_indications"("public_id");

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

-- CreateIndex
CREATE INDEX "user_log_credits_idx_created_at" ON "user_credit_log"("created_at");

-- CreateIndex
CREATE INDEX "user_log_credits_idx_user_credit_id" ON "user_credit_log"("user_credit_id");

-- CreateIndex
CREATE UNIQUE INDEX "sales_public_id_key" ON "sales"("public_id");

-- CreateIndex
CREATE INDEX "sales_idx_id" ON "sales"("user_id");

-- CreateIndex
CREATE INDEX "sales_idx_sale_id" ON "sales"("sale_id");

-- CreateIndex
CREATE INDEX "sales_idx_date_created" ON "sales"("date_created");

-- CreateIndex
CREATE INDEX "sales_idx_local_status" ON "sales"("local_status");

-- CreateIndex
CREATE INDEX "sales_idx_public_id" ON "sales"("public_id");

-- CreateIndex
CREATE INDEX "sales_idx_category" ON "sales"("category");

-- CreateIndex
CREATE INDEX "sales_idx_package_id" ON "sales"("package_id");

-- CreateIndex
CREATE INDEX "sales_idx_solicitation_id" ON "sales"("solicitation_id");

-- CreateIndex
CREATE INDEX "user_tokens_user_id_index" ON "user_tokens"("user_id");

-- CreateIndex
CREATE INDEX "user_tokens_expiresAt_index" ON "user_tokens"("expires_at");

-- AddForeignKey
ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_medic_id_fkey" FOREIGN KEY ("medic_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "consultations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_report_purpose_id_fkey" FOREIGN KEY ("report_purpose_id") REFERENCES "report_purposes"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_benefit_type_id_fkey" FOREIGN KEY ("benefit_type_id") REFERENCES "benefit_types"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patients_consultation_reports" ADD CONSTRAINT "patients_consultation_reports_patient_consultation_id_fkey" FOREIGN KEY ("patient_consultation_id") REFERENCES "patient_consultations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "patients_consultation_reports" ADD CONSTRAINT "patients_consultation_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "profile_routes" ADD CONSTRAINT "profile_routes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_medic_id_fkey" FOREIGN KEY ("medic_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "schedules" ADD CONSTRAINT "schedules_patient_consultation_id_fkey" FOREIGN KEY ("patient_consultation_id") REFERENCES "patient_consultations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "service_package_history" ADD CONSTRAINT "service_package_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "user_credit_log" ADD CONSTRAINT "user_credit_log_user_credit_id_fkey" FOREIGN KEY ("user_credit_id") REFERENCES "user_credits"("id") ON DELETE CASCADE ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_solicitation_id_fkey" FOREIGN KEY ("solicitation_id") REFERENCES "patient_consultations"("id") ON DELETE RESTRICT ON UPDATE RESTRICT;
