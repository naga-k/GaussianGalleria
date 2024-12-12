CREATE TABLE IF NOT EXISTS "splats" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"splat" text,
	"video" text,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp
);
