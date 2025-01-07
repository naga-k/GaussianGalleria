CREATE TABLE IF NOT EXISTS "galleries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "splats_to_galleries" (
	"id" serial PRIMARY KEY NOT NULL,
	"splat_id" integer,
	"gallery_id" integer,
	"createdAt" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "splats_to_galleries" ADD CONSTRAINT "splats_to_galleries_splat_id_splats_id_fk" FOREIGN KEY ("splat_id") REFERENCES "public"."splats"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "splats_to_galleries" ADD CONSTRAINT "splats_to_galleries_gallery_id_galleries_id_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."galleries"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
