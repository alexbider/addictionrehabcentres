/** Pure search over the slim index (public/assets/search-index.json). Case- and accent-insensitive, partial words, all words must match, province abbreviations. */
export type Rec = { n: string; u: string; c: string; p: string; a: string; g: string; d: string; ty: string; i?: string; w?: number; h?: number; t?: string; k?: string };
export const PROVINCE_CODES: Record<string, string> = { AB: 'Alberta', BC: 'British Columbia', MB: 'Manitoba', NB: 'New Brunswick', NL: 'Newfoundland and Labrador', NT: 'Northwest Territories', NS: 'Nova Scotia', NU: 'Nunavut', ON: 'Ontario', PE: 'Prince Edward Island', QC: 'Quebec', SK: 'Saskatchewan', YT: 'Yukon' };

export const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
export const words = (s: string) => norm(s).split(/[^a-z0-9]+/).filter(Boolean);

type Prep = { rec: Rec; name: string[]; city: string[]; prov: string[]; tags: string[]; addr: string[]; desc: string[] };
export function prepare(recs: Rec[]): Prep[] {
  return recs.map((rec) => ({
    rec, name: words(rec.n), city: words(rec.c), prov: [...words(PROVINCE_CODES[rec.p] || ''), norm(rec.p)], tags: words(rec.g.replace(/\|/g, ' ')), addr: words(rec.a), desc: words(rec.d),
  }));
}
const hit = (tok: string, ws: string[]) => (tok.length <= 2 ? ws.includes(tok) : ws.some((w) => w.startsWith(tok)));
const WEIGHT: [keyof Omit<Prep, 'rec'>, number][] = [['name', 100], ['city', 60], ['prov', 40], ['tags', 20], ['addr', 10], ['desc', 5]];

export type Query = { q: string; province: string; type: string; sort: string };
export function run(index: Prep[], f: Query, provinceCodeBySlug: Record<string, string>): Rec[] {
  const toks = words(f.q);
  const code = f.province ? provinceCodeBySlug[f.province] : '';
  const out: { rec: Rec; score: number }[] = [];
  for (const p of index) {
    if (f.province && p.rec.p !== code) continue;
    if (f.type && !p.rec.ty.split(',').includes(f.type)) continue;
    let score = 0;
    let ok = true;
    for (const t of toks) {
      let best = 0;
      for (const [k, w] of WEIGHT) if (best < w && hit(t, p[k] as string[])) best = w;
      if (!best) { ok = false; break; }
      score += best;
    }
    if (ok) out.push({ rec: p.rec, score });
  }
  if (f.sort === 'az' || !toks.length) out.sort((a, b) => a.rec.n.localeCompare(b.rec.n));
  else out.sort((a, b) => b.score - a.score || a.rec.n.localeCompare(b.rec.n));
  return out.map((x) => x.rec);
}
