-- Supabase exposes every table in the public schema through its REST API with the public anon key.
-- This app only talks to the database from the server (direct Postgres connection, which bypasses RLS), so every table gets
-- row level security with NO policies: the anon and authenticated API roles can read and write nothing.
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "sessions" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "email_tokens" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "rate_limits" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "centres" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "centre_members" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "claims" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "centre_profiles" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "centre_profile_revisions" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "leads" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "onboarding_submissions" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "therapists" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "therapist_profiles" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "removal_requests" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "invites" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "media" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "audit_log" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "data_sources" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "import_runs" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "settings" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "page_seo" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE "outbox" ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated';
  END IF;
END $$;
