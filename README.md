# Addiction Rehab Centres Canada — Next.js

A 1:1 port of the *Addiction Rehab Centers Redesign* design files (24 `.dc.html` pages) to Next.js 16 (App Router) + React 19.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Routes

| Design file | Route |
|---|---|
| Home | `/` |
| Alcohol | `/alcohol` |
| Auth | `/auth` (`?mode=login`, `?mode=signup`, `&type=therapist`) |
| Blog | `/blog` |
| BlogPost | `/blog/how-long-does-alcohol-detox-take` |
| Centre / CentreOnboarding | `/centre`, `/centre-onboarding` |
| City / Province | `/city`, `/province` |
| ClaimListing / ClaimTherapist | `/claim-listing`, `/claim-therapist` |
| Contact / Intervention / Drug | `/contact`, `/intervention`, `/drug` |
| JoinDirectory / Promote | `/join-directory`, `/promote` |
| ProviderDashboard | `/provider-dashboard` (client-only) |
| Therapists, TherapistsCity, TherapistsProvince, TherapistProfile, TherapistOnboarding | `/therapists`, `/therapists-city`, `/therapists-province`, `/therapist-profile`, `/therapist-onboarding` |
| Menu Options (header design board) | `/menu-options` |

Each design page is a single example (one city, one centre, one article). Turning them into data-driven
templates (`/[province]`, `/[city]`, `/centre/[slug]` …) is the natural next step.

## How it is organised

```
src/app/                 routes (page.tsx = metadata + <Root/>), layout, global CSS
  dc-pseudo.css          hover / focus / active states from the design
  responsive.css         small-screen rules (see below)
src/views/*.jsx          one file per design page (+ SiteHeader), each has:
                           • class Component  – the page's logic: state, handlers, data (renderVals)
                           • template()       – the page's markup (JSX, styles inline as in the design)
src/dc/runtime.jsx       tiny host that connects logic → template (setState, lifecycle, <a> → next/link)
public/assets/           images, logos, canada-map.json
public/image-slot.js     the design's photo-placeholder element (used by two slots on Home)
```

Copy and content live in `src/views/*.jsx` (text in the templates; data arrays in each `Component`).
The site header is `src/views/SiteHeader.jsx`, used by every page.

## Responsive behaviour

* Several pages switch layout from JavaScript (`vw` in each page's logic), exactly as the design does. The page is
  hidden for the instant between server HTML and hydration so a phone never flashes the desktop layout.
* The design left some layouts fixed-width. `src/app/responsive.css` adds media-query rules (≤1000px, ≤640px, ≤420px)
  that stack grids, tighten padding and scale big headings. Desktop is untouched. Hooks (`data-cols`, `data-rc-*`)
  on the markup mark what each rule targets.
* Second pass (all pages): sliders, pricing/comparison tables, hero mock-ups, the radial "where you appear" diagram,
  CTA banners and search-result rows now adapt at <=1000 / <=640 / <=520px (see sections 8a-8m in `responsive.css`).
  Wide tables scroll sideways inside their card instead of squashing.
* Checked at 1440, 1024, 768, 600, 390, 360 and 320px: no sideways scrolling on any page.

## Things to know

* **Placeholders** ("photo · …", "portrait", "logo", `Therapist name`) are in the design and are kept as-is.
  The two Home photo slots (`<image-slot>`) accept a `src` attribute for a real image.
* **Images from addictionrehabcenters.ca** on Alcohol and Intervention are hotlinked as in the design.
* **Forms** are front-end only (as in the design): Contact/Alcohol/etc. show their success state; nothing is sent.
  Sign-in and the provider dashboard store demo data in the browser.
* **Fonts** (Jost, Figtree) are self-hosted via `@fontsource`.
* Pages without a `<title>` in the design use the site name; set per-page titles in each `page.tsx`.
* HTML `required` / `multiple` now work as written (the design's runtime ignored them).

## Environment variables

Every variable is documented in `.env.example` (no secrets are committed). The ones the public site uses today:

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production origin used for canonicals, sitemap and schema (default `https://addictionrehabcenters.ca`). |
| `REDIRECT_PREVIEW_TO_CANONICAL` | `true` = every `*.vercel.app` request is 301'd to the production domain (turn on once the domain is attached). |
| `NEXT_PUBLIC_GA_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_SMARTSUPP_KEY` | Analytics IDs (defaults = the old site's IDs). Scripts only load in a production build on the `.ca` host. |
| `GOOGLE_PLACES_API_KEY` | **To enable reviews: add `GOOGLE_PLACES_API_KEY`** and a Google `place_id` per centre (`src/data/place-ids.json`, later the admin). Ratings, review counts and review text are shown only when they come from the Places API (cached 24 h, "Powered by Google"). Without them nothing about reviews is rendered. |
| `SHOW_SAMPLE_DATA` | `true` shows the design's demo ratings/prices/badges (for comparing with the design files only). Default `false`; never set in production. |
| `ENABLE_DESIGN_ROUTES` | `1` serves `/claim-design/` and `/promote-design/` in a production build (they are 404 otherwise; `next dev` always serves them for `audit/scripts/compare-design.mjs`). |

## Tests

```bash
npm run build && npm start -- -p 3300
npm run test:cards      # card heights and "Call now" / "View centre" y-offsets at 1440 / 1024 / 768 / 390
npm run test:lightbox   # gallery lightbox: click, next, previous, arrows, swipe, Esc, focus trap
python3 audit/seo/arc_check.py http://localhost:3300      # SEO migration acceptance test
node audit/scripts/crawl-site.mjs http://localhost:3300   # 404 links, broken images, missing canonical/title/description, orphans
```

## Backend (accounts, dashboard, admin, forms)

Everything under `src/server`, `src/db`, `src/app/api`, `src/app/admin` and `src/app/provider-dashboard` needs a database; without one the public site is unchanged and the forms show an honest error. See `audit/22-backend-audit.md`.

```bash
# production (Supabase; see audit/23-supabase-setup.md): set DATABASE_URL, DIRECT_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, AUTH_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, RESEND_API_KEY …, then
npm run db:migrate           # applies drizzle/*.sql and creates the master admin
# local development without any service (embedded Postgres):
ARC_LOCAL_DB=.data/dev ARC_SEED_ADMIN_EMAIL=admin@example.test ARC_SEED_ADMIN_PASSWORD='…' ENABLE_DEV_OUTBOX=1 npm run dev
npm run test:e2e             # sign-up → claim → edit → approve → public page (needs `npm run build` first)
```

## Provider dashboards

`/provider-dashboard/` (centre accounts) and `/therapist-dashboard/` (therapist accounts) are the *Provider Dashboard* design with real data.
`/dashboard/` and sign-in send each account to its own dashboard; approving an onboarding submission sets the account type.

* Markup is generated from the design; the logic class is the design's own, wired to `src/server/dashboard-data.ts` (first paint) and
  `/api/dashboard/workspace` (facilities, partners, reports, tasks, campaigns, calendar; therapist clients, appointments, waitlist, invoices),
  `/api/dashboard/leads` (stages, notes, e-mail replies, bookings, manual leads), `/api/dashboard/team`, `/api/provider/*`, `/api/therapist/profile`, Stripe.
* Listing analytics come from `/api/track` (anonymous daily counters on centre and therapist pages; bots ignored).
* Run `npm run db:migrate` once after deploying (migration `0002_dashboard`).
* Test: start a server with the embedded database (see above), then `node tests/e2e/dashboard.mjs http://localhost:3400`.
