# 22 — Backend audit (Phase 4A) and what was built (Phase 4B)

## 4A. What existed before Phase 4 (read from the code on 2026-10-11)

Your understanding was **correct**: only front-end views existed.

| Area | State before |
|---|---|
| Database | None. No ORM, no connection string, no migrations. All centre data is static JSON in `content/` built from the WordPress export. |
| Auth | None. `src/views/Auth.jsx` was a client-side mock: "signing in" wrote the e-mail to `localStorage` after a 0.7 s timer; any password worked; "forgot password" only flipped a message. No sessions, no roles. |
| Provider dashboard | `/provider-dashboard` was a client-only mock (`ProviderDashboardClient`, sample numbers, `localStorage`). No data was read or saved. |
| Master admin | None. |
| API routes | None (`src/app/api` did not exist). The only server code was `src/proxy.ts`. |
| Subscriptions / payments | None. The design's plan prices and card-number fields were rendered, kept in React state, and discarded. No Stripe package, no processor. |
| E-mail | None. No provider, no sender. |
| Env vars | Only `NEXT_PUBLIC_SITE_URL` and `PRODUCTION_HOSTS`. No `FORM_ENDPOINT`. |

### Every form and what it did

| Form (page) | Before |
|---|---|
| Contact (`/contact/`) | Showed "Message sent" and **sent nothing**. |
| Callback request "Let us help you" on Alcohol / Intervention pages | Showed success and **sent nothing**. |
| Callback request on every drug page and every centre page | A real `<form>` with no action and unnamed fields: pressing the button reloaded the page. **Nothing sent, no confirmation.** |
| Claim listing (`/claim-listing/`) | 4-step wizard, ended on "Payment received — claim under review" after collecting a card number in the browser. **Nothing sent, nothing charged.** |
| Centre onboarding (`/centre-onboarding/`) | 6 steps, last step collected card details, ended on "Your subscription is active". Draft saved to `localStorage` only. **Nothing sent.** |
| Therapist onboarding | Same pattern as centre onboarding. **Nothing sent.** |
| Sign in / Sign up / Forgot password | Mock (see above). |
| Blog "monthly digest" subscribe | Design-sample route only (not on the live blog). |
| Search boxes (header, home, `/search/`, blog) | Work: they navigate to `/search/` or filter in the browser. |
| Draft design pages (`/join-directory`, `/claim-therapist`, `/therapist-profile`) | Sample content, not linked, noindex; not wired. |

## 4B. What was built

* **Database**: Postgres through Drizzle (`src/db/schema.ts`, SQL migrations in `drizzle/`). `DATABASE_URL` (Neon or Supabase via the Vercel Marketplace) in production; an embedded Postgres (PGlite, `ARC_LOCAL_DB=<dir>`) for local work and the e2e test; **no database → every backend feature switches off and the static site works as before**. Tables: users, sessions, email_tokens, rate_limits, centres, centre_members, claims, centre_profiles, centre_profile_revisions, subscriptions, leads, onboarding_submissions, therapists, therapist_profiles, removal_requests, invites, media, audit_log, data_sources, import_runs, settings, page_seo, outbox.
* **Auth**: e-mail + password (scrypt, parameters stored with the hash), random session tokens (only the SHA-256 is stored, httpOnly cookie), e-mail confirmation, password reset (tokens hashed, 2 h), per-IP and per-account rate limits in the database, generic answers (no account enumeration), roles `master_admin`, `provider`, `therapist`.
* **Forms** (`/api/forms/{contact,callback,promote,subscribe,claim,centreOnboarding,therapistOnboarding,removal}`): same-origin + JSON-only (CSRF), zod validation with per-field errors, honeypot, Turnstile when `TURNSTILE_SECRET_KEY` is set, rate limit, saved to the database, e-mail to the admin (`ADMIN_NOTIFY_EMAIL`) and a confirmation to the sender (Resend). **The success message appears only after the row is saved; if the database or the save fails the form shows an error with the helpline number.**
* **Provider dashboard** (`/provider-dashboard/`): own centres, claims, enquiries (leads), plan & billing, and a page editor (description, contact, social, programs, amenities, insurance, program length, pricing rows with "Updated <date>", hours, photo uploads). Fields left empty are removed, so the public page renders nothing for them.
* **Moderation**: edits are stored as revisions; master-admin setting "review first" (default) or "publish immediately".
* **Public pages**: static content + approved `centre_profiles` overrides (`src/lib/profile-merge.ts`); the page is regenerated on approval with `revalidatePath` (ISR). `dynamicParams` must be `true` on `[slug]` for that to work in Next 16.
* **Master admin** (`/admin/`): claims (approve/reject, e-mails the claimant), moderation queue, centres (search + edit any page), onboarding submissions (approve as draft), therapists, invites, leads (+ CSV export), users (role, disable), subscriptions, imports (sources and runs), per-page SEO overrides (title / description / no-index, no-index pages leave the sitemap), audit log, settings.
* **Payments**: Stripe Checkout, customer portal and webhook (`/api/stripe/*`) behind `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_<PLAN>`. Without them the plans page says "Coming soon" with disabled buttons. Plan names/prices are placeholders in `src/config/plans.ts`; **no prices are defined by us**. The card-number steps of the claim and onboarding wizards were **removed** (claiming/listing is free; plans are chosen later in the dashboard), and the Promote page's plan, placement and founding-partner prices are hidden until `PLANS_CONFIRMED` is true.
* **Security**: CSRF check on cookie-authenticated JSON endpoints, RBAC re-checked in every route handler and server action, zod on every input, uploads sniffed by magic bytes and re-encoded with sharp (EXIF stripped, 6 MB cap, 30 photos per centre), CSV export defuses spreadsheet formulas, security headers on every response (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, COOP, HSTS), `.env.example` documents every variable, no secrets in git. Not done: a Content-Security-Policy (the analytics and the design runtime use inline scripts; needs nonces).
* **Tests**: `npm run test:e2e` (Playwright, embedded DB): sign-up → e-mail confirmation → claim → admin approves → provider edits → held for review → admin approves → public page shows the change (and the "Updated" date next to pricing) → emptying a field hides it again; plus access-control checks. 20 checks pass.
* **Header**: "Sign in" → `/login/`, "Find a Therapist" → `/therapists/` (desktop and mobile menu).

## Needs the client
Database creation (Neon/Supabase), `AUTH_SECRET`, the admin account (`ADMIN_EMAIL`/`ADMIN_PASSWORD` + `npm run db:migrate`), Resend account and sending domain, Stripe account + plan prices/names, Turnstile keys (optional), Vercel Blob token, moderation decision.
