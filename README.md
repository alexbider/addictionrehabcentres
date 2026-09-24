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
* Checked at 1440, 768, 390, 360 and 320px: no sideways scrolling on any page.

## Things to know

* **Placeholders** ("photo · …", "portrait", "logo", `Therapist name`) are in the design and are kept as-is.
  The two Home photo slots (`<image-slot>`) accept a `src` attribute for a real image.
* **Images from addictionrehabcenters.ca** on Alcohol and Intervention are hotlinked as in the design.
* **Forms** are front-end only (as in the design): Contact/Alcohol/etc. show their success state; nothing is sent.
  Sign-in and the provider dashboard store demo data in the browser.
* **Fonts** (Jost, Figtree) are self-hosted via `@fontsource`.
* Pages without a `<title>` in the design use the site name; set per-page titles in each `page.tsx`.
* HTML `required` / `multiple` now work as written (the design's runtime ignored them).
