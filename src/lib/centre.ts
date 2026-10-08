import type { Block, Page } from '@/lib/content';
import { categoryRoute } from '@/lib/provinces';
import { isPublishedRoute } from '@/lib/content';

/** Centres rebuilt on the approved Centre view so far (prototype; the other centres still use CentrePage). */
export const CENTRE_VIEW_SLUGS = new Set([
  'centre__another-road-addiction-recovery-centre',
  'centre__peace-country-wilderness-program',
  'centre__canadawide-mobile',
  'centre__blue-skies-recovery',
]);

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
};

/** Centre page JSON → props for the approved Centre view. Only real source fields: name, address, phone, website, category,
 *  specialties/amenities, about body, gallery, videos. Ratings, reviews (incl. Google review text), hours, FAQ, tags, social, email,
 *  price items and the sponsor ad are not passed. */
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
  };
}
