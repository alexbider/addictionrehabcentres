# Supabase setup

## What the app uses (answer to "which client / auth library")
| Part | What is used | Supabase-compatible? |
|---|---|---|
| Database client | **Drizzle ORM** + the `postgres` (postgres.js) driver, plain SQL migrations in `drizzle/` | Yes: Supabase *is* Postgres. Nothing Supabase-specific is needed except the connection strings. |
| Login | **Own e-mail/password auth** (scrypt hashes, random session tokens in a `sessions` table, e-mail confirmation and reset via Resend). Not Auth.js, not Supabase Auth. | Works on Supabase Postgres as is. I did **not** switch to Supabase Auth: it would mean rewriting sign-up/confirm/reset/roles/sessions (all tested by `npm run test:e2e`) and could not be tested without your project. It can be done later; the `users` table stays the place for roles. |
| File storage | **Supabase Storage** (public bucket, uploaded server-side with the service-role key). Fallbacks: Vercel Blob, then local disk (dev only). | Yes |
| Security on Supabase | Migration `0001_enable_rls.sql` turns on Row Level Security (no policies) on all 23 tables and revokes `anon`/`authenticated`, so the public anon key can read nothing. The app connects with the Postgres connection string, which bypasses RLS. | Yes |

## Environment variables
| Variable | Where to get it | Needed for |
|---|---|---|
| `DATABASE_URL` | Supabase > Project Settings > Database > Connection string > **Transaction pooler** (port 6543). Replace `[YOUR-PASSWORD]`. | the running app (Vercel) |
| `DIRECT_URL` | Same page > **Direct connection** (port 5432) or **Session pooler**. | `npm run db:migrate` only |
| `SUPABASE_URL` | Project Settings > API > Project URL (`https://<ref>.supabase.co`) | photo uploads |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings > API > `service_role` key. **Secret**: server only, never `NEXT_PUBLIC_`. | photo uploads |
| `SUPABASE_STORAGE_BUCKET` | `centre-photos` (default) | photo uploads |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | your choice (password at least 10 characters) | creating the first master admin |
| `AUTH_SECRET` | any long random string (`openssl rand -base64 32`) | hashing IPs stored with leads |
| `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFY_EMAIL` | Resend | confirmation / reset / notification e-mails |
| `NEXT_PUBLIC_SITE_URL`, `APP_ORIGIN` | `https://addictionrehabcenters.ca` | links in e-mails |

No `NEXT_PUBLIC_SUPABASE_*` variables are used (the browser never talks to Supabase). Everything is optional for building: with none set the site builds and runs, and the forms answer "temporarily unavailable".

## Step by step
1. **Create the project** at supabase.com > New project (region: Canada Central if offered). Save the database password.
2. **Storage bucket**: Storage > New bucket > name `centre-photos` > tick **Public bucket** > Create. (No policies are needed: uploads use the service-role key.) Optional: bucket settings > file size limit 6 MB, allowed types `image/webp`.
3. **Copy the secrets** from the table above into Vercel (Project > Settings > Environment Variables, Production and Preview) and into a local `.env.local`.
4. **Run the migrations** (creates the 23 tables and turns on RLS) from your machine:
   ```bash
   DIRECT_URL='postgresql://postgres:<password>@db.<ref>.supabase.co:5432/postgres' \
   ADMIN_EMAIL='you@yourdomain.ca' ADMIN_PASSWORD='a-long-password' \
   npm run db:migrate
   ```
   The same command (or `npm run db:migrate` with the variables in `.env.local` exported) can be re-run any time; applied migrations are skipped.
   *Alternative without Node:* open Supabase > SQL Editor and paste `drizzle/0000_init.sql`, then `drizzle/0001_enable_rls.sql`. (You would then create the admin as in step 5b.)
5. **First master admin**
   a. Easiest: the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you passed in step 4 are created as a verified `master_admin`. If that e-mail already has an account, it is promoted to `master_admin` instead. Sign in at `/login/`, you land on `/admin/`. Remove `ADMIN_PASSWORD` from your shell/history afterwards.
   b. Promote a normal account later: sign up at `/signup/`, confirm the e-mail, then in Supabase > SQL Editor run
      `update users set role = 'master_admin' where email = 'you@yourdomain.ca';`
6. **Deploy** on Vercel (env vars from step 3). Check: `/admin/` redirects to `/login/`; after signing in as admin, `/admin/settings/` loads; as a provider (after an approved claim) upload a photo in the dashboard and confirm it appears in Storage > `centre-photos`.
7. **Turn on e-mail** (Resend) before real users sign up, otherwise confirmation links are only logged in the `outbox` table.

## Notes
* Use the **pooled** string for `DATABASE_URL`: it works with serverless functions. The code already disables prepared statements and requires TLS for `*.supabase.co`.
* Local development needs no Supabase: set `ARC_LOCAL_DB=.data/dev` to use an embedded Postgres (see README).
* To run the e2e test: `npm run build && npm run test:e2e` (embedded database, no Supabase touched).
