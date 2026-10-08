import fs from 'node:fs';
import path from 'node:path';
import type { Block, Page } from '@/lib/content';
import { getPage, getPageByRoute } from '@/lib/content';

type Img = { src: string; alt: string; width: number | null; height: number | null };
export type HomeCentre = { name: string; city: string; href: string; excerpt: string; tel: string; phone: string; img: Img | null };
export type HomeData = {
  heroImg: Img | null;
  aboutImg: Img | null;
  programImg: Img | null;
  ctaImg: Img | null;
  programImgs: (Img | null)[];
  tabImgs: (Img | null)[];
  tabBodies: string[];
  top: HomeCentre[];
  featured: HomeCentre[];
};

const imgOf = (b: Block | undefined): Img | null => (b && b.type === 'image' ? { src: b.src, alt: b.alt ?? '', width: Number(b.width) || null, height: Number(b.height) || null } : null);

/** Whole-word excerpt: cut at a word boundary and end with an ellipsis. */
function ww(t: string, max = 170): string {
  t = t.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return t.slice(0, max).replace(/\s+\S*$/, '').replace(/[,;:\-\u2013\u2014(]+$/, '') + '\u2026';
}

function cityOf(address: string): string {
  const parts = address.split(',').map((x) => x.trim()).filter((x) => x && x !== 'Canada');
  return parts.length >= 2 ? parts[parts.length - 2] + ', ' + parts[parts.length - 1].split(' ')[0] : address;
}

/** Real data for the Home view (src/views/Home.jsx): the source home page's own images and featured centres (phone and photo from each centre's page). */
export function homeData(): HomeData | null {
  const page: Page | null = getPage('home');
  if (!page) return null;
  const blocks = page.rows.flatMap((r) => r.columns.flatMap((c) => c.blocks));
  const imgs = blocks.filter((b) => b.type === 'image');
  const by = (stem: string) => imgOf(imgs.find((b) => b.type === 'image' && b.src.toLowerCase().includes(stem.toLowerCase())));
  const centreFor = (href: string, name: string, address: string, excerpt: string, fallback: Img | null): HomeCentre => {
    const cp = getPageByRoute(href);
    const c = cp?.centre;
    const g = c?.gallery?.[0];
    return {
      name, city: cityOf(address), href, excerpt: ww(excerpt.replace(/\s*(\+?1?[-\s]?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4})\s*$/, '')),
      tel: c?.phone_href || 'tel:+18558854747', phone: c?.phone_text || '1-855-885-4747',
      img: g ? { src: g.src, alt: g.alt || name, width: g.width ?? null, height: g.height ?? null } : fallback,
    };
  };
  const cards = blocks.flatMap((b) => (b.type === 'centre-cards' ? b.items : []));
  const seen = new Set<string>();
  const featured: HomeCentre[] = [];
  for (const it of cards) {
    if (seen.has(it.href)) continue;
    seen.add(it.href);
    featured.push(centreFor(it.href, it.name, it.address, it.excerpt, it.image ? { ...it.image, width: it.image.width ?? null, height: it.image.height ?? null } : null));
  }
  // Section B ("Featured treatment centres across Canada"): exactly 3 real centres from 3 different provinces, none of them among the first 3 of section A.
  // Real card image (>= 600 px wide), a full description (>= 120 characters), a phone number; provinces with the most centres first, longest description first.
  type Rec = { n: string; u: string; c: string; p: string; a: string; d: string; i?: string; w?: number; h?: number; t?: string; k?: string };
  const recs: Rec[] = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/assets/search-index.json'), 'utf8'));
  const firstThree = new Set(featured.slice(0, 3).map((f) => f.href));
  const good = recs.filter((r) => r.i && (r.w ?? 0) >= 600 && r.d.length >= 120 && r.k && r.a && !firstThree.has(r.u));
  const byProvB = new Map<string, Rec[]>();
  for (const r of good) byProvB.set(r.p, [...(byProvB.get(r.p) ?? []), r]);
  const orderB = [...byProvB.entries()].sort((a, b) => b[1].length - a[1].length).map(([p, l]) => [p, l.sort((x, y) => y.d.length - x.d.length || x.n.localeCompare(y.n))] as const);
  const asCard = (r: Rec): HomeCentre => ({ name: r.n, city: r.a.replace(/,?\s*Canada$/, ''), href: r.u, excerpt: r.d, tel: 'tel:' + (r.k ?? '+18558854747').replace(/^tel:/, ''), phone: r.k ?? '1-855-885-4747', img: { src: r.i!, alt: r.t || r.n, width: r.w ?? null, height: r.h ?? null } });
  const top: HomeCentre[] = orderB.slice(0, 3).map(([, l]) => asCard(l[0]));
  const topHrefs = new Set(top.map((t) => t.href));
  // Fill up to 20: real centres with a card image (>= 600 px wide), a full description (>= 120 characters) and a phone number,
  // taken round-robin across provinces (provinces with the most centres first, longest description first within a province).
  const MAX = 20;
  if (featured.length < MAX) {
    const have = new Set(featured.map((f) => f.href));
    const ok = recs.filter((r) => !have.has(r.u) && !topHrefs.has(r.u) && r.i && (r.w ?? 0) >= 600 && r.d.length >= 120 && r.k);
    const byProv = new Map<string, Rec[]>();
    for (const r of ok) byProv.set(r.p, [...(byProv.get(r.p) ?? []), r]);
    const order = [...byProv.entries()].sort((a, b) => b[1].length - a[1].length).map(([p, l]) => [p, l.sort((x, y) => y.d.length - x.d.length || x.n.localeCompare(y.n))] as const);
    for (let round = 0; featured.length < MAX && round < 10; round++) {
      for (const [, list] of order) {
        const r = list[round];
        if (!r || featured.length >= MAX) continue;
        const parts = r.a.split(',').map((x) => x.trim()).filter((x) => x && x !== 'Canada');
        featured.push({ name: r.n, city: r.c ? `${r.c}, ${r.p}` : parts.slice(-2).join(', '), href: r.u, excerpt: r.d, tel: 'tel:' + (r.k ?? '+18558854747').replace(/^tel:/, ''), phone: r.k ?? '1-855-885-4747', img: { src: r.i!, alt: r.t || r.n, width: r.w ?? null, height: r.h ?? null } });
      }
    }
  }
  const tabs = blocks.find((b) => b.type === 'tabs');
  const tabImgs = tabs && tabs.type === 'tabs' ? tabs.tabs.map((t) => imgOf(t.blocks.find((b) => b.type === 'image'))) : [];
  const tabBodies = tabs && tabs.type === 'tabs' ? tabs.tabs.map((t) => t.blocks.filter((b) => b.type === 'p').map((b) => (b as { text: string }).text).join(' ')) : [];
  return {
    tabBodies,
    heroImg: by('addiction-rehab-centers-canada.webp'),
    aboutImg: by('Addiction-rehab-centers-in-Canada'),
    programImg: by('Addiction-rehab-program'),
    ctaImg: by('addiction-rehab-canada.webp'),
    programImgs: [by('drug-rehab'), by('alcohol-rehab'), by('prescription-drugs'), by('Dual-Diagnosis')],
    tabImgs,
    top,
    featured,
  };
}
