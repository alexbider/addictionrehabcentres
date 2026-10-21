CREATE TABLE IF NOT EXISTS "provider_workspaces" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"kind" text NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "provider_workspaces_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "listing_stats" (
	"entity" text NOT NULL,
	"slug" text NOT NULL,
	"kind" text NOT NULL,
	"key" text DEFAULT '' NOT NULL,
	"day" text NOT NULL,
	"count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "listing_stats_entity_slug_kind_key_day_pk" PRIMARY KEY("entity","slug","kind","key","day")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "listing_stats_slug_idx" ON "listing_stats" USING btree ("entity","slug","day");
--> statement-breakpoint
ALTER TABLE "provider_workspaces" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "listing_stats" ENABLE ROW LEVEL SECURITY;
