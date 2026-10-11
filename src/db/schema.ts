import { sql } from 'drizzle-orm';
import { boolean, index, integer, jsonb, pgEnum, pgTable, primaryKey, text, timestamp, uniqueIndex, uuid } from 'drizzle-orm/pg-core';

/** Roles: master_admin and provider (centre owner) and therapist; everybody else is the public (no account). */
export const roleEnum = pgEnum('role', ['master_admin', 'provider', 'therapist']);
export const claimStatus = pgEnum('claim_status', ['pending', 'approved', 'rejected']);
export const revisionStatus = pgEnum('revision_status', ['pending', 'approved', 'rejected', 'superseded']);

const id = () => uuid('id').primaryKey().default(sql`gen_random_uuid()`);
const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();

export const users = pgTable('users', {
  id: id(),
  email: text('email').notNull(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull().default(''),
  role: roleEnum('role').notNull().default('provider'),
  emailVerifiedAt: timestamp('email_verified_at', { withTimezone: true }),
  disabledAt: timestamp('disabled_at', { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex('users_email_idx').on(t.email)]);

/** Server-side sessions: the cookie holds a random token, only its SHA-256 is stored. */
export const sessions = pgTable('sessions', {
  tokenHash: text('token_hash').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  ip: text('ip'),
  userAgent: text('user_agent'),
  createdAt: createdAt(),
}, (t) => [index('sessions_user_idx').on(t.userId)]);

export const emailTokens = pgTable('email_tokens', {
  id: id(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(), // 'verify' | 'reset'
  tokenHash: text('token_hash').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [uniqueIndex('email_tokens_hash_idx').on(t.tokenHash)]);

export const rateLimits = pgTable('rate_limits', {
  key: text('key').primaryKey(),
  count: integer('count').notNull().default(0),
  windowStart: timestamp('window_start', { withTimezone: true }).notNull().defaultNow(),
});

/** Registry of centres the backend knows about. Static centres (from content/) get a row when claimed/edited; imported or onboarded centres start as drafts. */
export const centres = pgTable('centres', {
  slug: text('slug').primaryKey(), // the public path without slashes, e.g. "twelve-mile-recovery"
  name: text('name').notNull(),
  province: text('province'),
  city: text('city'),
  source: text('source').notNull().default('static'), // 'static' | 'onboarding' | 'import'
  status: text('status').notNull().default('published'), // 'published' | 'draft'
  createdAt: createdAt(),
});

/** Which user manages which centre (created when a claim is approved). */
export const centreMembers = pgTable('centre_members', {
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  centreSlug: text('centre_slug').notNull().references(() => centres.slug, { onDelete: 'cascade' }),
  role: text('role').notNull().default('owner'),
  createdAt: createdAt(),
}, (t) => [primaryKey({ columns: [t.userId, t.centreSlug] })]);

export const claims = pgTable('claims', {
  id: id(),
  centreSlug: text('centre_slug').notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  claimantName: text('claimant_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  roleTitle: text('role_title'),
  message: text('message'),
  status: claimStatus('status').notNull().default('pending'),
  reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  reviewNote: text('review_note'),
  createdAt: createdAt(),
}, (t) => [index('claims_centre_idx').on(t.centreSlug), index('claims_status_idx').on(t.status)]);

/** Approved, public, owner-supplied overrides of a centre page. Only fields present in `data` are rendered. */
export const centreProfiles = pgTable('centre_profiles', {
  centreSlug: text('centre_slug').primaryKey().references(() => centres.slug, { onDelete: 'cascade' }),
  data: jsonb('data').notNull().default({}),
  pricingUpdatedAt: timestamp('pricing_updated_at', { withTimezone: true }),
  updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Every edit a provider submits. Applied immediately or held for the admin, depending on the moderation setting. */
export const centreProfileRevisions = pgTable('centre_profile_revisions', {
  id: id(),
  centreSlug: text('centre_slug').notNull().references(() => centres.slug, { onDelete: 'cascade' }),
  data: jsonb('data').notNull(),
  status: revisionStatus('status').notNull().default('pending'),
  submittedBy: uuid('submitted_by').references(() => users.id, { onDelete: 'set null' }),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
  reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  reviewNote: text('review_note'),
}, (t) => [index('revisions_status_idx').on(t.status), index('revisions_centre_idx').on(t.centreSlug)]);

/** Subscription state mirrored from Stripe webhooks (plan prices live in src/config/plans.ts, never invented here). */
export const subscriptions = pgTable('subscriptions', {
  id: id(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  centreSlug: text('centre_slug').references(() => centres.slug, { onDelete: 'set null' }),
  planKey: text('plan_key').notNull(),
  status: text('status').notNull(), // Stripe status: active | trialing | past_due | canceled | incomplete …
  stripeCustomerId: text('stripe_customer_id'),
  stripeSubscriptionId: text('stripe_subscription_id'),
  currentPeriodEnd: timestamp('current_period_end', { withTimezone: true }),
  createdAt: createdAt(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => [uniqueIndex('subs_stripe_idx').on(t.stripeSubscriptionId), index('subs_user_idx').on(t.userId)]);

export const leads = pgTable('leads', {
  id: id(),
  type: text('type').notNull(), // 'contact' | 'callback' | 'claim-help' | 'promote' | 'enquiry' | 'subscribe'
  centreSlug: text('centre_slug'),
  name: text('name'),
  email: text('email'),
  phone: text('phone'),
  message: text('message'),
  payload: jsonb('payload').notNull().default({}),
  sourcePath: text('source_path'),
  status: text('status').notNull().default('new'), // 'new' | 'handled'
  ipHash: text('ip_hash'),
  createdAt: createdAt(),
}, (t) => [index('leads_type_idx').on(t.type), index('leads_centre_idx').on(t.centreSlug)]);

export const onboardingSubmissions = pgTable('onboarding_submissions', {
  id: id(),
  kind: text('kind').notNull(), // 'centre' | 'therapist'
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  email: text('email'),
  payload: jsonb('payload').notNull(),
  status: text('status').notNull().default('pending'), // 'pending' | 'approved' | 'rejected'
  centreSlug: text('centre_slug'),
  therapistId: uuid('therapist_id'),
  reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  createdAt: createdAt(),
}, (t) => [index('onboarding_status_idx').on(t.status)]);

export const therapists = pgTable('therapists', {
  id: id(),
  slug: text('slug').notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  status: text('status').notNull().default('draft'), // 'draft' | 'pending' | 'published' | 'removed'
  source: text('source').notNull().default('self'), // 'self' | 'invite' | 'import' | 'content'
  createdAt: createdAt(),
}, (t) => [uniqueIndex('therapists_slug_idx').on(t.slug)]);

export const therapistProfiles = pgTable('therapist_profiles', {
  therapistId: uuid('therapist_id').primaryKey().references(() => therapists.id, { onDelete: 'cascade' }),
  data: jsonb('data').notNull().default({}),
  /** 'owner' = written by the therapist; 'needs_review' = admin must review before it shows; 'approved' */
  descriptionStatus: text('description_status').notNull().default('needs_review'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const removalRequests = pgTable('removal_requests', {
  id: id(),
  therapistSlug: text('therapist_slug').notNull(),
  name: text('name'),
  email: text('email').notNull(),
  reason: text('reason'),
  status: text('status').notNull().default('new'),
  createdAt: createdAt(),
});

export const invites = pgTable('invites', {
  id: id(),
  email: text('email').notNull(),
  kind: text('kind').notNull(), // 'therapist' | 'centre'
  centreSlug: text('centre_slug'),
  prefill: jsonb('prefill').notNull().default({}),
  tokenHash: text('token_hash').notNull(),
  invitedBy: uuid('invited_by').references(() => users.id, { onDelete: 'set null' }),
  usedAt: timestamp('used_at', { withTimezone: true }),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: createdAt(),
}, (t) => [uniqueIndex('invites_hash_idx').on(t.tokenHash)]);

export const media = pgTable('media', {
  id: id(),
  ownerUserId: uuid('owner_user_id').references(() => users.id, { onDelete: 'set null' }),
  centreSlug: text('centre_slug'),
  therapistId: uuid('therapist_id'),
  url: text('url').notNull(),
  pathname: text('pathname').notNull(),
  contentType: text('content_type').notNull(),
  bytes: integer('bytes').notNull(),
  alt: text('alt').notNull().default(''),
  createdAt: createdAt(),
});

export const auditLog = pgTable('audit_log', {
  id: id(),
  actorUserId: uuid('actor_user_id'),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: text('entity_id'),
  data: jsonb('data').notNull().default({}),
  ip: text('ip'),
  createdAt: createdAt(),
}, (t) => [index('audit_entity_idx').on(t.entity, t.entityId)]);

/** Where bulk data may come from. Nothing is imported from a source that is not ALLOWED (see audit/import/SOURCES.md). */
export const dataSources = pgTable('data_sources', {
  id: id(),
  name: text('name').notNull(),
  url: text('url'),
  licence: text('licence'),
  classification: text('classification').notNull().default('needs-permission'), // 'allowed' | 'needs-permission' | 'prohibited'
  notes: text('notes'),
  createdAt: createdAt(),
});

export const importRuns = pgTable('import_runs', {
  id: id(),
  sourceId: uuid('source_id').references(() => dataSources.id, { onDelete: 'set null' }),
  status: text('status').notNull().default('review'), // 'review' | 'approved' | 'rejected' | 'merged'
  counts: jsonb('counts').notNull().default({}),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  finishedAt: timestamp('finished_at', { withTimezone: true }),
});

export const settings = pgTable('settings', {
  key: text('key').primaryKey(),
  value: jsonb('value').notNull(),
});

/** Per-page SEO overrides edited in the admin. */
export const pageSeo = pgTable('page_seo', {
  path: text('path').primaryKey(),
  title: text('title'),
  description: text('description'),
  noindex: boolean('noindex').notNull().default(false),
  updatedBy: uuid('updated_by').references(() => users.id, { onDelete: 'set null' }),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/** Outgoing e-mail log; also the only "mailbox" in local development (no RESEND_API_KEY). */
export const outbox = pgTable('outbox', {
  id: id(),
  toEmail: text('to_email').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  status: text('status').notNull().default('queued'), // 'sent' | 'logged' | 'failed'
  error: text('error'),
  createdAt: createdAt(),
});
