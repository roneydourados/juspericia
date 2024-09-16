ALTER TABLE "patients" ALTER COLUMN "created_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "updated_at" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "patients" ALTER COLUMN "updated_at" DROP NOT NULL;