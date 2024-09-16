ALTER TABLE "users" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
--ALTER TABLE "patient_consultations" ADD COLUMN "created_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
--ALTER TABLE "patient_consultations" ADD COLUMN "reason_correction" text;--> statement-breakpoint
--ALTER TABLE "patient_consultations" ADD COLUMN "updated_at" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL;--> statement-breakpoint
--ALTER TABLE "patient_consultations" ADD COLUMN "antecipation_value" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
--ALTER TABLE "patient_consultations" ADD COLUMN "consultation_value" numeric(18, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users" USING btree ("email");