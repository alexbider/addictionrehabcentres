import type { Block } from '@/lib/content';
import { getPageByRoute } from '@/lib/content';
import { realCentres } from '@/lib/centres';

export type ClaimData = { title: string; subtitle: string; benefits: { title: string; body: string }[]; image: { src: string; alt: string; width: number | null; height: number | null } | null };

/** /claim-listing/ content = the source page /claim-your-listing/ (exact text and image). The design's claim flow (plans, prices, payment) needs facts and a backend the source does not have, so it is not shown. */
export function claimData(): ClaimData | null {
  const page = getPageByRoute('/claim-listing/');
  if (!page) return null;
  const b: Block[] = page.blocks ?? [];
  const text = (x?: Block) => (x && 'text' in x ? (x as { text: string }).text : '');
  const benefits = b.filter((x) => x.type === 'p').map((x) => {
    const html = (x as { html: string }).html;
    const m = html.match(/<b>([\s\S]*?)<\/b>/i);
    const title = m ? m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() : '';
    const body = html.replace(/<span[^>]*>[\s\S]*?<\/span>/i, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    return { title, body };
  });
  const im = b.find((x) => x.type === 'image');
  return { title: text(b.find((x) => x.type === 'h1')), subtitle: text(b.find((x) => x.type === 'h3')), benefits, image: im && im.type === 'image' ? { src: im.src, alt: im.alt ?? '', width: Number(im.width) || null, height: Number(im.height) || null } : null };
}

/** The real directory the claim flow searches: every published centre with its address and own photo (nobody has claimed a listing yet). */
export function claimCentres() {
  return realCentres({}).map((c) => ({ name: c.name, address: c.address, href: c.href, image: c.image }));
}
