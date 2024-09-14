CREATE TABLE IF NOT EXISTS "address" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" integer NOT NULL,
	"address_category" varchar(30) NOT NULL,
	"address_zipcode" varchar(20),
	"address_city" varchar(100),
	"address_district" varchar(100),
	"address_street" varchar(100),
	"address_number" varchar(10),
	"address_state" char(2),
	"address_complement" varchar(100)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "benefit_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "consultations" (
	"id" serial PRIMARY KEY NOT NULL,
	"consultation_name" varchar(200) NOT NULL,
	"created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(3) NOT NULL,
	"value" numeric(18, 2) NOT NULL,
	"value_antecipation_24" numeric(18, 2) DEFAULT '0' NOT NULL,
	"value_antecipation_48" numeric(18, 2) DEFAULT '0' NOT NULL,
	"value_antecipation_72" numeric(18, 2) DEFAULT '0' NOT NULL,
	"value_credit" numeric(18, 2) NOT NULL,
	"value_packet" numeric(18, 2) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"owner_id" integer NOT NULL,
	"file_category" varchar(30) NOT NULL,
	"file_name" varchar(300) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patient_consultations" (
	"id" serial PRIMARY KEY NOT NULL,
	"patient_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"medic_id" integer,
	"consultation_id" integer NOT NULL,
	"content" text NOT NULL,
	"benefit_type_id" integer NOT NULL,
	"proccess_number" varchar(30),
	"process_situation" varchar(2),
	"report_purpose_id" integer NOT NULL,
	"status" varchar(30) DEFAULT 'open' NOT NULL,
	"tip_value" numeric(18, 2) DEFAULT '0' NOT NULL,
	"date_close" date,
	"date_open" date DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"rate" integer DEFAULT 0,
	"date_antecipation" date,
	"date_correction" date
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patients" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(1000),
	"mother_name" varchar(200),
	"phone" varchar(20),
	"cpf" varchar(30) NOT NULL,
	"rg" varchar(30) NOT NULL,
	"status" varchar(1) DEFAULT 'A' NOT NULL,
	"sexy" char(1) NOT NULL,
	"created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"surname" varchar(200) NOT NULL,
	"updated_at" timestamp(3) NOT NULL,
	"birth_date" varchar(10) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "patients_consultation_reports" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"patient_consultation_id" integer NOT NULL,
	"report_model_id" integer,
	"content" text NOT NULL,
	"date_limit_correction" date NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile_routes" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer NOT NULL,
	"title" varchar(200) NOT NULL,
	"to" varchar(300) NOT NULL,
	"icon" varchar(100) NOT NULL,
	"visible" boolean DEFAULT true NOT NULL,
	"is_menu" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_name" varchar(50) NOT NULL,
	"type" "ProfileType" DEFAULT 'ADVOGADO' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "report_models" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "report_purposes" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"patient_consultation_id" integer,
	"start" varchar(30) NOT NULL,
	"end" varchar(30) NOT NULL,
	"title" varchar(200) NOT NULL,
	"content" text NOT NULL,
	"class" varchar(30) NOT NULL,
	"background" boolean DEFAULT false NOT NULL,
	"split" varchar(30) NOT NULL,
	"allDay" boolean DEFAULT false NOT NULL,
	"deletable" boolean DEFAULT true NOT NULL,
	"resizable" boolean DEFAULT true NOT NULL,
	"user_schedule" varchar(200) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_log_credits" (
	"id" serial PRIMARY KEY NOT NULL,
	"created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"user_id" integer NOT NULL,
	"history" text NOT NULL,
	"old_value" numeric(18, 2) DEFAULT '0' NOT NULL,
	"input_value" numeric(18, 2) DEFAULT '0' NOT NULL,
	"output_value" numeric(18, 2) DEFAULT '0' NOT NULL,
	"salt_value" numeric(18, 2) DEFAULT '0' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL,
	"email" varchar(1000) NOT NULL,
	"password" text NOT NULL,
	"phone" varchar(20),
	"cpf_cnpj" varchar(30),
	"oab" varchar(10),
	"oab_uf" char(2),
	"crm" varchar(10),
	"crm_uf" char(2),
	"profile_id" integer NOT NULL,
	"created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"office_name" varchar(200),
	"active" boolean DEFAULT true NOT NULL,
	"office_cnpj" varchar(30),
	"office_email" varchar(1000),
	"office_phone" varchar(20)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_consultation_id_fkey" FOREIGN KEY ("consultation_id") REFERENCES "public"."consultations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_report_purpose_id_fkey" FOREIGN KEY ("report_purpose_id") REFERENCES "public"."report_purposes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_benefit_type_id_fkey" FOREIGN KEY ("benefit_type_id") REFERENCES "public"."benefit_types"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patient_consultations" ADD CONSTRAINT "patient_consultations_medic_id_fkey" FOREIGN KEY ("medic_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients" ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients_consultation_reports" ADD CONSTRAINT "patients_consultation_reports_patient_consultation_id_fkey" FOREIGN KEY ("patient_consultation_id") REFERENCES "public"."patient_consultations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients_consultation_reports" ADD CONSTRAINT "patients_consultation_reports_report_model_id_fkey" FOREIGN KEY ("report_model_id") REFERENCES "public"."report_models"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "patients_consultation_reports" ADD CONSTRAINT "patients_consultation_reports_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile_routes" ADD CONSTRAINT "profile_routes_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedules" ADD CONSTRAINT "schedules_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "schedules" ADD CONSTRAINT "schedules_patient_consultation_id_fkey" FOREIGN KEY ("patient_consultation_id") REFERENCES "public"."patient_consultations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_log_credits" ADD CONSTRAINT "user_log_credits_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "address_idx_address_category" ON "address" USING btree ("address_category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "address_idx_address_city" ON "address" USING btree ("address_city");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "address_idx_address_state" ON "address" USING btree ("address_state");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "address_idx_owner_id" ON "address" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "files_idx_file_category" ON "files" USING btree ("file_category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "files_idx_owner_id" ON "files" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "patients_cpf_key" ON "patients" USING btree ("cpf");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patients_idx_cpf" ON "patients" USING btree ("cpf");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patients_idx_email" ON "patients" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "patients_idx_name" ON "patients" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "patients_rg_key" ON "patients" USING btree ("rg");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "schedules_idx_end" ON "schedules" USING btree ("end");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "schedules_idx_start" ON "schedules" USING btree ("start");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "schedules_idx_user_id" ON "schedules" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_log_credits_idx_created_at" ON "user_log_credits" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_idx_active" ON "users" USING btree ("active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_idx_cpf_cnpj" ON "users" USING btree ("cpf_cnpj");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_idx_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_idx_name" ON "users" USING btree ("name");