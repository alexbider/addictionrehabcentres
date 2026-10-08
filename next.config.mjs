import fs from 'node:fs';

const drafts = ['/therapists', '/therapists-province', '/therapists-city', '/therapist-profile', '/claim-therapist', '/therapist-onboarding', '/join-directory', '/auth', '/provider-dashboard', '/centre-onboarding', '/menu-options', '/alcohol', '/centre', '/city', '/drug', '/province']; // keep in sync with src/lib/drafts.ts

const approved = JSON.parse(fs.readFileSync(new URL('./src/lib/redirects.json', import.meta.url), 'utf8'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The global stylesheet is small (27 KB): inlining it removes a render-blocking request.
  experimental: { inlineCss: true },
  // The source site serves every page with a trailing slash (non-slash URLs 301 to it) — keep that behaviour.
  trailingSlash: true,
  async rewrites() {
    // Yoast's sitemap URL (listed in the source robots.txt) keeps working without a redirect.
    return [{ source: '/sitemap_index.xml', destination: '/sitemap.xml' }];
  },
  // 301 redirects for URLs that cannot exist in the new structure go here ONLY after approval — see audit/06-url-exceptions.md.
  // Draft design pages: never indexed (also sent as a header, besides the meta tag).
  async headers() {
    return drafts.flatMap((d) => [d, d + '/']).map((source) => ({ source, headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }));
  },
  async redirects() {
    return approved.map(({ source, destination }) => ({ source, destination, statusCode: 301 }));
  },
};

export default nextConfig;
