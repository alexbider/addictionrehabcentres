import type { Metadata } from 'next';
import SearchClient from '@/components/SearchClient';
import { isPublishedRoute, routeExists } from '@/lib/content';
import { categoryRoute, provinceNav, provinceNavItems } from '@/lib/provinces';
import options from '@/lib/search-options.json';

// Search results page: never indexed, not in the sitemap or llms.txt (see robots.ts, sitemap.ts).
export const metadata: Metadata = { title: 'Search Rehab Centres - Addiction Rehab Centers', description: 'Search addiction rehab, detox and treatment centres across Canada by name, city, province or type of treatment.', robots: { index: false, follow: true } };

export default function SearchPage() {
  const others = provinceNavItems(routeExists);
  const suggestProvinces = options.provinces.map((o) => {
    const r = categoryRoute[o.label + ' Rehabs'];
    const nav = provinceNav.links.find(([l]) => l.startsWith(o.label));
    const href = r && isPublishedRoute(r) ? r : nav && isPublishedRoute(nav[1]) ? nav[1] : null;
    return { label: o.label, href };
  });
  // the cities with the most listed centres (real city archive pages), from the build-time options file
  const cities = (options as unknown as { cities?: { label: string; href: string; n: number }[] }).cities ?? [];
  return <SearchClient others={others} othersHeading={provinceNav.heading} suggestProvinces={suggestProvinces} suggestCities={cities.slice(0, 12).map((c) => ({ label: c.label, href: c.href, key: c.href }))} />;
}
