import fs from 'node:fs';
import path from 'node:path';
import type { Page } from '@/lib/content';
import { getPublished } from '@/lib/content';
import { categoryRoute } from '@/lib/provinces';
import { isPublishedRoute } from '@/lib/content';
import { centreByRoute, realCentres, type RealCentre } from '@/lib/centres';
import { SHOW_SAMPLE_DATA } from '@/lib/rollout';
import { legacyData, type LegacyData } from '@/lib/legacy';

export type DrugModel = {
  showSample: boolean; drug: string; isProvince: boolean; crumbMid: string; tag: string;
  h2: string; heroHtml: string; stats: { v: string; l: string }[]; effects: string[];
  centres: { name: string; href: string; category: string; catHref: string | null; address: string; excerpt: string; image: { src: string; alt: string; width: number | null; height: number | null } | null; rating: string; googleReviews: number; featured: boolean; verified: boolean }[];
  centresHeading: string; matched: number;
  faqs: { question: string; answer: string }[];
  sources: string[]; residential: string; outpatient: string; helpLine: string;
};
export type DrugData = LegacyData & { m: DrugModel };

const SYN: Record<string, string[]> = {
  benzodiazepine: ['benzodiazepine', 'benzo'], marijuana: ['marijuana', 'cannabis'], heroin: ['heroin', 'opioid'], opioids: ['opioid', 'fentanyl', 'heroin'],
  cocaine: ['cocaine', 'crack'], meth: ['methamphetamine', 'meth '], prescription: ['prescription'], oxycodone: ['oxycodone', 'opioid'], percocet: ['percocet', 'opioid'],
  vicodin: ['vicodin', 'opioid'], lortab: ['lortab', 'opioid'], methadone: ['methadone', 'opioid'], opium: ['opium', 'opioid'], ecstasy: ['ecstasy', 'mdma'],
  ketamine: ['ketamine'], ghb: ['ghb'], lsd: ['lsd', 'hallucinogen'], pcp: ['pcp'], mescaline: ['mescaline', 'hallucinogen'], ritalin: ['ritalin', 'stimulant'],
  steroids: ['steroid'], street: ['street drug'], tranquilisers: ['tranquil', 'benzodiazepine'], tranquilizers: ['tranquil', 'benzodiazepine'],
};
const SAMPLE_RATINGS: [string, number, boolean, boolean][] = [['4.9', 128, true, true], ['4.8', 64, false, false], ['5.0', 92, false, false], ['4.9', 41, false, true], ['4.7', 57, false, false], ['4.8', 33, false, false], ['4.9', 48, false, true], ['4.8', 26, false, false], ['5.0', 71, false, false]];
const strip = (h: string) => h.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const wholeWords = (t: string, max: number) => { t = t.replace(/\s+/g, ' ').trim(); if (t.length <= max) return t; return t.slice(0, max).replace(/\s+\S*$/, '').replace(/[,;:\-–—(]+$/, '') + '…'; };

let corpus: { route: string; text: string }[] | null = null;
function centreCorpus() {
  if (corpus) return corpus;
  corpus = getPublished().filter((e) => e.type === 'centre').map((e) => {
    const c = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'content', e.slug + '.json'), 'utf8')).centre;
    const text = [c.name, ...c.tags.items, ...c.specialty_groups.flatMap((g: { items: string[] }) => g.items), ...c.about_blocks.map((b: { text?: string }) => b.text ?? '')].join(' ').toLowerCase();
    return { route: e.route, text };
  });
  return corpus;
}
/** Real centres whose own listing mentions the substance, most mentions first; topped up with other drug-treatment centres so the slider is never short. */
function centresFor(terms: string[], n: number): { list: RealCentre[]; matched: number } {
  const scored = centreCorpus().map((c) => ({ route: c.route, n: terms.reduce((t, w) => t + (c.text.split(w).length - 1), 0) })).filter((x) => x.n > 0).sort((a, b) => b.n - a.n || a.route.localeCompare(b.route));
  const picked: RealCentre[] = [];
  for (const s of scored) { const r = centreByRoute(s.route); if (r && r.image) picked.push(r); if (picked.length >= n) break; }
  const matched = scored.length;
  if (picked.length < n) {
    const have = new Set(picked.map((p) => p.href));
    const pool = realCentres({ withImage: true, ownImageOnly: true }).filter((c) => !have.has(c.href));
    const byProv = new Map<string, RealCentre[]>();
    pool.forEach((c) => byProv.set(c.province, [...(byProv.get(c.province) ?? []), c]));
    const lists = [...byProv.values()].sort((a, b) => b.length - a.length);
    for (let round = 0; picked.length < n && round < 6; round++) for (const l of lists) { if (picked.length >= n) break; if (l[round]) picked.push(l[round]); }
  }
  return { list: picked.slice(0, n), matched };
}

export function drugData(page: Page): DrugData {
  const L = legacyData(page);
  const isProvince = page.page_type === 'province';
  const drug = isProvince ? page.h1 : page.h1.replace(/\s+(Addiction|Treatment)(\s+Canada)?$/i, '').trim();
  const key = drug.toLowerCase().split(/[\s&]+/)[0];
  const terms = SYN[key] ?? [drug.toLowerCase()];
  const { list, matched } = centresFor(terms, 9);
  const firstP = L.article.findIndex((b) => b.type === 'p' && 'html' in b);
  const heroHtml = firstP > -1 ? (L.article[firstP] as { html: string }).html : '';
  const article = firstP > -1 ? L.article.filter((_, i) => i !== firstP) : L.article;
  const h2b = article.find((b) => b.type === 'h2' && /dependence|treatment|what is/i.test((b as { text: string }).text));
  const centres = list.map((c, i) => {
    const cat = c.provinceName + ' Rehabs'; const cr = categoryRoute[cat];
    const [rating, googleReviews, featured, verified] = SAMPLE_RATINGS[i % SAMPLE_RATINGS.length];
    return { name: c.name, href: c.href, category: cat, catHref: cr && isPublishedRoute(cr) ? cr : null, address: c.address, excerpt: wholeWords(c.excerpt, 110), image: c.image, rating, googleReviews, featured, verified };
  });
  const D = drug;
  const m: DrugModel = {
    showSample: SHOW_SAMPLE_DATA, drug: D, isProvince,
    crumbMid: isProvince ? 'Rehabs By Provinces' : 'Addiction By Drugs', tag: isProvince ? 'Rehabs by province' : 'Addiction by drugs',
    h2: h2b ? (h2b as { text: string }).text : isProvince ? 'Drug and alcohol treatment in Canada' : `${D} Dependence and Treatment: What is ${D}?`,
    heroHtml,
    stats: [{ v: String(Math.max(matched, list.length)), l: isProvince ? 'Centres across Canada' : `Centres that mention ${D.toLowerCase()}` }, { v: '13', l: 'Provinces and territories covered' }, { v: '24/7', l: 'Free, confidential helpline' }],
    effects: ['Dependence', 'Withdrawal symptoms', 'Mood changes', 'Impaired judgement', 'Strained relationships', 'Health problems'],
    centres, centresHeading: isProvince ? `Treatment Centres in Canada` : `Centres Treating ${D} Addiction`, matched,
    faqs: [
      { question: `What is ${D.toLowerCase()} addiction?`, answer: `${D} addiction is a pattern of continued use despite harm to health, relationships or work. Dependence means the body has adapted and withdrawal can appear when use is reduced or stopped. Treatment is available, and recovery is possible.` },
      { question: `What are the signs of ${D.toLowerCase()} dependence?`, answer: 'Needing more of the substance for the same effect, using it despite problems, being unable to cut down, withdrawal when not using, and spending more time getting and using it. If several of these apply, speak with a doctor or call our helpline.' },
      { question: `Is it safe to stop using ${D.toLowerCase()} on my own?`, answer: 'Stopping some substances suddenly can be dangerous or uncomfortable. It is safest to be assessed by a doctor or a medical detox program first. Call our helpline and we will connect you with one.' },
      { question: `How long does ${D.toLowerCase()} treatment take?`, answer: 'It depends on the substance, how long it was used and the setting. Detox usually takes several days to a couple of weeks; residential programs often run 30 to 90 days, and outpatient counselling and aftercare can continue for months afterwards.' },
      { question: 'What treatment settings are available in Canada?', answer: 'Medical detox units, residential rehab centres and outpatient programs. Publicly funded options exist in every province, often with wait times; private centres usually offer faster admission.' },
      { question: 'How do I get help today?', answer: 'Call 1-855-885-4747 any time. We will talk through your situation, help you understand the options near you, and contact centres with availability on your behalf. The service is free and confidential.' },
    ],
    sources: ['Health Canada — Substance use and addiction: information and getting help', 'Canadian Centre on Substance Use and Addiction (CCSA) — research and guidance'],
    residential: '24/7 support in a residential setting, away from everyday triggers — often recommended for long-term or heavy use.',
    outpatient: 'Counselling and support while living at home — suited to stable, lower-risk situations with a supportive environment.',
    helpLine: `Tell us who needs help and we’ll point you to the right program — detox, residential care, or outpatient support.`,
  };
  return { ...L, article, m };
}
