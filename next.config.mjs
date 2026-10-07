import fs from 'node:fs';

const approved = JSON.parse(fs.readFileSync(new URL('./src/lib/redirects.json', import.meta.url), 'utf8'));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The source site serves every page with a trailing slash (non-slash URLs 301 to it) — keep that behaviour.
  trailingSlash: true,
  async rewrites() {
    // Yoast's sitemap URL (listed in the source robots.txt) keeps working without a redirect.
    return [{ source: '/sitemap_index.xml', destination: '/sitemap.xml' }];
  },
  // 301 redirects for URLs that cannot exist in the new structure go here ONLY after approval — see audit/06-url-exceptions.md.
  async redirects() {
    return approved.map(({ source, destination }) => ({ source, destination, statusCode: 301 }));
  },
};

export default nextConfig;
