CREATE TABLE IF NOT EXISTS "teste" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(200) NOT NULL
);
--> statement-breakpoint
-- DROP TABLE "_prisma_migrations";--> statement-breakpoint
-- ALTER TABLE "user_log_credits" ALTER COLUMN "old_value" SET DEFAULT '0';--> statement-breakpoint
-- ALTER TABLE "user_log_credits" ALTER COLUMN "input_value" SET DEFAULT '0';--> statement-breakpoint
-- ALTER TABLE "user_log_credits" ALTER COLUMN "output_value" SET DEFAULT '0';--> statement-breakpoint
-- ALTER TABLE "user_log_credits" ALTER COLUMN "salt_value" SET DEFAULT '0';--> statement-breakpoint
-- ALTER TABLE "patient_consultations" ALTER COLUMN "tip_value" SET DEFAULT '0';--> statement-breakpoint
-- ALTER TABLE "consultations" ADD COLUMN "value_antecipation" numeric(18, 2) NOT NULL;--> statement-breakpoint
-- ALTER TABLE "patient_consultations" DROP COLUMN IF EXISTS "created_at";--> statement-breakpoint
-- ALTER TABLE "patient_consultations" DROP COLUMN IF EXISTS "reason_correction";--> statement-breakpoint
-- ALTER TABLE "patient_consultations" DROP COLUMN IF EXISTS "updated_at";--> statement-breakpoint
-- ALTER TABLE "patient_consultations" DROP COLUMN IF EXISTS "antecipation_value";--> statement-breakpoint
-- ALTER TABLE "patient_consultations" DROP COLUMN IF EXISTS "consultation_value";--> statement-breakpoint
-- ALTER TABLE "consultations" DROP COLUMN IF EXISTS "value_antecipation_24";--> statement-breakpoint
-- ALTER TABLE "consultations" DROP COLUMN IF EXISTS "value_antecipation_48";--> statement-breakpoint
-- ALTER TABLE "consultations" DROP COLUMN IF EXISTS "value_antecipation_72";