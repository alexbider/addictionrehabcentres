import fs from 'node:fs';

const drafts = ['/therapists', '/therapists-province', '/therapists-city', '/therapist-profile', '/claim-therapist', '/therapist-onboarding', '/join-directory', '/auth', '/provider-dashboard', '/centre-onboarding', '/menu-options', '/alcohol', '/centre', '/city', '/drug', '/province']; // keep in sync with src/lib/drafts.ts

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The footer's copyright year is fixed at build time (no hard-coded year).
  env: { NEXT_PUBLIC_BUILD_YEAR: String(new Date().getFullYear()) },
  // The global stylesheet is small (27 KB): inlining it removes a render-blocking request.
  experimental: { inlineCss: true },
  // The source site serves every page with a trailing slash (non-slash URLs 301 to it) — keep that behaviour.
  trailingSlash: true,
  // Trailing-slash, case, host, legacy-URL and src/lib/redirects.json redirects are all computed in src/proxy.ts so every URL needs ONE hop at most.
  skipTrailingSlashRedirect: true,
  // Draft design pages: never indexed (also sent as a header, besides the meta tag).
  async headers() {
    return drafts.flatMap((d) => [d, d + '/']).map((source) => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }));
  },
};

export default nextConfig;
