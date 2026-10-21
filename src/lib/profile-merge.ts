import type { Block, Page } from './content';
import type { CentreProfile } from '@/server/schemas';

/** Owner-supplied data that has no slot in the WordPress export (shown only when present). */
export type ProfileExtra = {
  pricing: { label: string; price: string; note?: string }[];
  pricingUpdated: string | null; // "October 10, 2026"
  programs: string[];
  amenities: string[];
  insurance: string[];
  programLength: string | null;
  availability: 'available' | 'waitlist' | 'full' | null;
};

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const digits = (p: string) => p.replace(/[^\d+]/g, '');
const fmt = (d: Date) => d.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

/**
 * Static content + approved overrides: returns a copy of the centre page where every field the owner filled in replaces the export's value,
 * plus the extra owner-only fields. A field the owner left empty changes nothing, so it keeps showing the export's value or nothing at all.
 */
export function mergeProfile(page: Page, profile: { data: CentreProfile; pricingUpdatedAt: Date | null } | null): { page: Page; extra: ProfileExtra | null } {
  if (!profile || !page.centre) return { page, extra: null };
  const p = profile.data;
  const c = { ...page.centre };
  if (p.description) {
    const paras = p.description.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean);
    c.about_blocks = paras.map((t): Block => ({ type: 'p', text: t, html: esc(t).replace(/\n/g, '<br>') }));
  }
  if (p.phone) { c.phone_text = p.phone; c.phone_href = 'tel:' + digits(p.phone); }
  if (p.email) c.email = p.email;
  if (p.website) { c.website = p.website; c.website_text = p.website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''); }
  if (p.social && Object.keys(p.social).length) c.social = { ...c.social, ...p.social };
  if (p.hours?.length) c.hours = { heading: c.hours?.heading || 'Business Hours', rows: p.hours.map((h) => [h.day, h.hours] as [string, string]) };
  if (p.photos?.length) c.gallery = [...p.photos.map((x) => ({ src: x.url, alt: x.alt, width: null, height: null })), ...c.gallery];
  const extra: ProfileExtra = {
    pricing: p.pricing ?? [],
    pricingUpdated: p.pricing?.length && profile.pricingUpdatedAt ? fmt(profile.pricingUpdatedAt) : null,
    programs: p.programs ?? [], amenities: p.amenities ?? [], insurance: p.insurance ?? [], programLength: p.programLength ?? null, availability: p.availability ?? null,
  };
  return { page: { ...page, centre: c }, extra };
}
