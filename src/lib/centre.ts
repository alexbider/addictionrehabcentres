import type { Block, Page } from '@/lib/content';
import { categoryRoute } from '@/lib/provinces';
import { getPublished, isPublishedRoute } from '@/lib/content';

/** Centres on the approved Centre view: the 4 prototypes plus the batches built so far (alphabetical by slug, `centre__` removed). */
const PROTOTYPES = ['another-road-addiction-recovery-centre', 'peace-country-wilderness-program', 'canadawide-mobile', 'blue-skies-recovery'];
export const BATCH_SIZE = 200; // batch 1 = first 100 published centres; raise to 200, 300, 391 for the next batches
let viewSlugs: Set<string> | null = null;
export function centreOnView(slug: string): boolean {
  if (!viewSlugs) {
    const all = getPublished().filter((e) => e.type === 'centre').map((e) => e.slug.replace(/^centre__/, '')).sort();
    viewSlugs = new Set([...PROTOTYPES, ...all.slice(0, BATCH_SIZE)]);
  }
  return viewSlugs.has(slug.replace(/^centre__/, ''));
}

export type CentreData = {
  name: string;
  categories: string[];
  catHref: string | null;
  phoneText: string;
  phoneHref: string;
  website: string;
  address: string;
  gallery: { src: string; alt: string }[];
  body: Block[];
  specs: { heading: string; items: string[]; text: string }[];
  email: string;
  social: Record<string, string>;
  tags: { heading: string; items: string[] };
  hours: { heading: string; rows: [string, string][] };
  info: string[];
  faqHeading: string;
  faqs: { question: string; answerBlocks: Block[] }[];
};

/** Centre page JSON → props for the approved Centre view. Only real source fields: name, address, phone, website, category,
 *  email, social, tags, hours, FAQ, info items, specialties/amenities, about body, gallery, videos. Ratings, review counts, Google review
 *  text and the sponsor ad are never passed. */
export function centreData(page: Page): CentreData {
  const c = page.centre!;
  const cat = c.categories[0];
  const catRoute = cat ? categoryRoute[cat] : undefined;
  return {
    name: c.name,
    categories: c.categories,
    catHref: catRoute && isPublishedRoute(catRoute) ? catRoute : null,
    phoneText: c.phone_text,
    phoneHref: c.phone_href ? 'tel:' + c.phone_href.replace(/^tel:/, '').replace(/[^\d+]/g, '') : '',
    website: c.website,
    address: c.address,
    gallery: c.gallery.map((g) => ({ src: g.src, alt: g.alt })),
    body: c.about_blocks,
    specs: c.specialty_groups,
    email: c.email,
    social: c.social,
    tags: c.tags,
    hours: c.hours,
    info: [...new Set(c.info_items.map((i) => i.value || i.label))],
    faqHeading: c.faq_heading,
    faqs: c.faqs.map((q) => ({ question: q.question, answerBlocks: q.answer_blocks })),
  };
}
