import fs from 'node:fs';
import path from 'node:path';

/** One real, published centre (from public/assets/search-index.json, built from content/centre__*.json). Used wherever a design shows centre cards. */
export type RealCentre = {
  name: string;
  href: string; // real published route, trailing slash
  city: string;
  province: string; // two-letter code
  provinceName: string;
  address: string;
  phone: string;
  tags: string[];
  type: string; // best-fit short type label from the centre's own tags
  excerpt: string;
  image: { src: string; alt: string; width: number | null; height: number | null } | null;
};

type Rec = { n: string; u: string; c: string; p: string; a: string; g?: string; d: string; ty?: string; i?: string; w?: number; h?: number; t?: string; k?: string };

export const PROVINCE_NAMES: Record<string, string> = { AB: 'Alberta', BC: 'British Columbia', MB: 'Manitoba', NB: 'New Brunswick', NL: 'Newfoundland and Labrador', NS: 'Nova Scotia', NT: 'Northwest Territories', NU: 'Nunavut', ON: 'Ontario', PE: 'Prince Edward Island', QC: 'Quebec', SK: 'Saskatchewan', YT: 'Yukon' };

let cache: Rec[] | null = null;
const recs = (): Rec[] => (cache ??= JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public/assets/search-index.json'), 'utf8')));

const TYPE_RE = /(residential|outpatient|detox|holistic|private|12 step|sober living|assessment|aftercare|intervention)/i;
const toCentre = (r: Rec): RealCentre => {
  const tags = (r.g ?? '').split('|').filter(Boolean);
  const type = tags.find((t) => TYPE_RE.test(t)) ?? tags[0] ?? 'Treatment Centre';
  return {
    name: r.n, href: r.u, city: r.c, province: r.p, provinceName: PROVINCE_NAMES[r.p] ?? r.p, address: r.a.replace(/,?\s*Canada$/, ''), phone: r.k ?? '',
    tags, type, excerpt: r.d,
    image: r.i ? { src: r.i, alt: r.t || r.n, width: r.w ?? null, height: r.h ?? null } : null,
  };
};
/** The image belongs to the centre when its folder is the centre's own (a few source centres reuse another centre's stock photo). */
const ownImage = (r: Rec) => !!r.i && r.i.split('/')[3] === r.u.replace(/\//g, '');

export type Query = { city?: string; province?: string; withImage?: boolean; ownImageOnly?: boolean; minWidth?: number; exclude?: string[]; limit?: number };
/** Real published centres matching a city and/or province (code), alphabetical; never repeats a centre; optionally only those with their own photo. */
export function realCentres(q: Query = {}): RealCentre[] {
  const ex = new Set(q.exclude ?? []);
  const out = recs()
    .filter((r) => (!q.city || r.c.toLowerCase() === q.city.toLowerCase()) && (!q.province || r.p === q.province) && !ex.has(r.u))
    .filter((r) => (!q.withImage || !!r.i) && (!q.ownImageOnly || ownImage(r)) && (!q.minWidth || (r.w ?? 0) >= q.minWidth))
    .sort((a, b) => a.n.localeCompare(b.n))
    .map(toCentre);
  return q.limit ? out.slice(0, q.limit) : out;
}

export function centreByRoute(route: string): RealCentre | null {
  const r = recs().find((x) => x.u === route);
  return r ? toCentre(r) : null;
}
