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
  // Photos uploaded by centres live on Vercel Blob; next/image (the lightbox) may optimise them.
  images: { remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }] },
  async headers() {
    const draftHeaders = drafts.flatMap((d) => [d, d + '/']).map((source) => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }));
    // Security headers on every response (CSP is not set: the analytics and design runtime use inline scripts; add one with nonces before enabling it).
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(self)' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
    ];
    return [{ source: '/:path*', headers: security }, ...draftHeaders];
  },
};

export default nextConfig;
