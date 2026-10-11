import type { Block } from '@/lib/content';
import { getPageByRoute } from '@/lib/content';
import { centreByRoute, realCentres, type RealCentre } from '@/lib/centres';
import { SHOW_SAMPLE_DATA } from '@/lib/rollout';
import { PLANS_CONFIRMED } from '@/config/plans';

type Img = { src: string; alt: string; width: number | null; height: number | null };
export type PromoteData = {
  title: string; headline: string; intro: string;
  heroImg: Img | null; aboutHeading: string; about: string[]; aboutImg: Img | null;
  whyHeading: string; benefits: { title: string; body: string }[]; whyImg: Img | null;
  progHeading: string; progText: string; progImg: Img | null;
  /** Real published centres for the design's sample cards (hero card, "Sponsored vs organic" mock-up, testimonial logos). */
  heroCentre: RealCentre | null; sponsored: RealCentre[]; organic: RealCentre[]; testimonialCentres: Record<string, RealCentre | null>;
  showSample: boolean;
  /** Plan and placement prices are shown only once the client has confirmed them (src/config/plans.ts). */
  showPrices: boolean;
};
const toImg = (b: Block | undefined): Img | null => (b && b.type === 'image' ? { src: b.src, alt: b.alt ?? '', width: Number(b.width) || null, height: Number(b.height) || null } : null);

/** /promote/ content = the source page /promote-your-centre/ (exact text and images), mapped onto the Promote design's sections. */
export function promoteData(): PromoteData | null {
  const page = getPageByRoute('/promote/');
  if (!page) return null;
  const b = page.blocks ?? [];
  const text = (x: Block | undefined) => (x && 'text' in x ? (x as { text: string }).text : '');
  const imgs = b.filter((x) => x.type === 'image');
  const idx = (pred: (x: Block) => boolean) => b.findIndex(pred);
  const iAbout = idx((x) => x.type === 'h3' && /about us/i.test(text(x)));
  const iWhy = idx((x) => x.type === 'h3' && /why list/i.test(text(x)));
  const iTesti = idx((x) => x.type === 'h3' && /testimonial/i.test(text(x)));
  const iProg = idx((x) => x.type === 'h3' && /promote your treatment/i.test(text(x)));
  const h1s = b.filter((x) => x.type === 'h1');
  const hero = b.slice(0, iAbout);
  const aboutParas = b.slice(iAbout + 1, iWhy).filter((x) => x.type === 'p').map(text);
  const whyParas = b.slice(iWhy + 1, iTesti).filter((x) => x.type === 'p').map(text);
  const benefits: { title: string; body: string }[] = [];
  for (let i = 0; i + 1 < whyParas.length; i += 2) benefits.push({ title: whyParas[i], body: whyParas[i + 1] });
  return {
    title: text(h1s[0]), headline: text(h1s[1]), intro: text(hero.find((x) => x.type === 'p')),
    heroImg: toImg(imgs[0]), aboutHeading: text(b[iAbout]), about: aboutParas, aboutImg: toImg(imgs[1]),
    whyHeading: text(b[iWhy]), benefits, whyImg: toImg(imgs[2]),
    progHeading: text(b[iProg]), progText: text(b.slice(iProg + 1).find((x) => x.type === 'p')), progImg: toImg(imgs[3]),
    ...mockCentres(),
    showSample: SHOW_SAMPLE_DATA,
    showPrices: PLANS_CONFIRMED,
  };
}

/** The design's sample cards are Toronto centres: take real Toronto centres that have their own photo (hero card 1, sponsored mock-up 3, organic list 3). */
function mockCentres() {
  const t = realCentres({ city: 'Toronto', ownImageOnly: true, minWidth: 500 });
  const [heroCentre, ...rest] = t;
  return {
    heroCentre: heroCentre ?? null,
    sponsored: rest.slice(0, 3),
    organic: rest.slice(3, 6),
    testimonialCentres: Object.fromEntries(['/metamorphosis-centre-for-change/', '/inspire-change-wellness-center/'].map((r) => [r, centreByRoute(r)])),
  };
}
