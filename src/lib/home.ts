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
      name, city: cityOf(address), href, excerpt,
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
  // "Top Rated Rehab" row of the source: one centre (Metamorphosis Centre for Change).
  const topRow = page.rows.find((r) => r.columns.some((c) => c.blocks.some((b) => b.type === 'h2' && /top rated/i.test(b.text))));
  const topFlat = topRow?.columns.flatMap((c) => c.blocks) ?? [];
  const topName = (topFlat.filter((b) => b.type === 'h2')[1] as { text: string } | undefined)?.text ?? '';
  const topLink = topFlat.find((b) => b.type === 'link') as { new_href?: string; href?: string } | undefined;
  const topPara = topFlat.find((b) => b.type === 'p') as { text: string } | undefined;
  const topHref = (topLink?.new_href || topLink?.href || '').replace(/^https?:\/\/[^/]+/, '');
  const top: HomeCentre[] = [];
  if (topName) {
    const cp = getPageByRoute('/' + topName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '/');
    top.push(centreFor(cp?.route ?? topHref, topName, cp?.centre?.address ?? '', topPara?.text ?? '', imgOf(topFlat.find((b) => b.type === 'image'))));
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
