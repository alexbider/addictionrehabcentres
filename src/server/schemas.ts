import { z } from 'zod';

const text = (max: number) => z.string().trim().max(max);
const required = (max: number, msg = 'Required') => z.string().trim().min(1, msg).max(max, 'Too long');
export const email = z.string().trim().toLowerCase().email('Enter a valid email address').max(200);
export const phone = z.string().trim().max(40).regex(/^[0-9+()\-.\s]*$/, 'Enter a valid phone number').optional().or(z.literal(''));
export const password = z.string().min(10, 'Use at least 10 characters').max(200);
const slug = z.string().trim().min(1).max(160).regex(/^[a-z0-9][a-z0-9_-]*$/, 'Invalid centre');

/** Fields shared by every public form: honeypot (must stay empty) and the page the form was on. */
const base = { company_website: z.string().max(0).optional().or(z.literal('')), sourcePath: z.string().trim().max(300).optional(), turnstile: z.string().max(4000).optional() };

export const formSchemas = {
  contact: z.object({ ...base, name: required(120), email, phone, topic: text(80).optional(), org: text(160).optional(), message: required(5000) }),
  callback: z.object({ ...base, centreSlug: slug.optional(), who: text(60).optional(), payment: text(80).optional(), setting: text(80).optional(), when: text(80).optional(), province: text(80).optional(), substance: text(80).optional(), name: required(120), phone: z.string().trim().min(7, 'Enter a valid phone number').max(40).regex(/^[0-9+()\-.\s]*$/, 'Enter a valid phone number'), email: email.optional().or(z.literal('')), ack: z.literal(true, { error: 'Please confirm to continue' }) }),
  promote: z.object({ ...base, name: required(120), email, phone, org: text(160).optional(), message: text(5000).optional() }),
  subscribe: z.object({ ...base, email }),
  claim: z.object({ ...base, centreSlug: slug, name: required(120), email, phone, roleTitle: text(120).optional(), message: text(3000).optional() }),
  centreOnboarding: z.object({ ...base, email, payload: z.record(z.string(), z.unknown()) }),
  therapistOnboarding: z.object({ ...base, email, payload: z.record(z.string(), z.unknown()), invite: z.string().max(200).optional() }),
  enquiry: z.object({ ...base, therapistSlug: slug, name: required(120), email, phone, message: required(3000) }),
  removal: z.object({ ...base, therapistSlug: slug, name: text(120).optional(), email, reason: text(2000).optional() }),
} as const;

export type FormKind = keyof typeof formSchemas;

export const authSchemas = {
  signup: z.object({ ...base, name: required(120), email, password, role: z.enum(['provider', 'therapist']).default('provider') }),
  login: z.object({ ...base, email, password: z.string().min(1).max(200) }),
  forgot: z.object({ ...base, email }),
  reset: z.object({ token: z.string().min(20).max(200), password }),
  resend: z.object({ ...base, email }),
};

/** What a provider may change on a centre page. Every field is optional; a missing/empty field means "show nothing". */
const list = z.array(z.string().trim().min(1).max(120)).max(60);
export const profileSchema = z.object({
  description: text(8000).optional(),
  phone: phone,
  email: z.string().trim().toLowerCase().email().max(200).optional().or(z.literal('')),
  website: z.string().trim().max(300).url().optional().or(z.literal('')),
  social: z.object({ facebook: z.string().trim().url().max(300).optional().or(z.literal('')), instagram: z.string().trim().url().max(300).optional().or(z.literal('')), youtube: z.string().trim().url().max(300).optional().or(z.literal('')), linkedin: z.string().trim().url().max(300).optional().or(z.literal('')), twitter: z.string().trim().url().max(300).optional().or(z.literal('')) }).partial().optional(),
  programs: list.optional(),
  amenities: list.optional(),
  insurance: list.optional(),
  programLength: text(80).optional(),
  pricing: z.array(z.object({ label: required(120), price: required(80), note: text(200).optional() })).max(20).optional(),
  hours: z.array(z.object({ day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']), hours: required(60) })).max(7).optional(),
  photos: z.array(z.object({ url: z.string().url().max(500), alt: text(200).default('') })).max(30).optional(),
  /** Intake status chosen in the dashboard; shown on the public page. */
  availability: z.enum(['available', 'waitlist', 'full']).optional(),
});
export type CentreProfile = z.infer<typeof profileSchema>;

/** What a therapist may edit on their own profile (same keys as the onboarding form). Empty values are dropped. */
const tlist = z.array(z.string().trim().min(1).max(80)).max(30);
export const therapistProfileSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: phone,
  website: z.string().trim().url().max(300).optional().or(z.literal('')),
  desig: z.string().trim().max(20).optional(),
  years: z.string().trim().max(3).optional(),
  city: z.string().trim().max(80).optional(),
  prov: z.string().trim().length(2).optional(),
  modes: tlist.optional(), langs: tlist.optional(), clients: tlist.optional(), concerns: tlist.optional(), approaches: tlist.optional(), payments: tlist.optional(),
  accepting: z.boolean().optional(),
  tagline: z.string().trim().max(200).optional(),
  bio: z.string().trim().max(6000).optional(),
  fee: z.string().trim().regex(/^(\d{2,4})?$/, 'Enter whole dollars, e.g. 150').optional(),
  couples: z.string().trim().regex(/^(\d{2,4})?$/, 'Enter whole dollars, e.g. 200').optional(),
  sliding: z.boolean().optional(),
  consult: z.boolean().optional(),
});
export type TherapistProfileInput = z.infer<typeof therapistProfileSchema>;
