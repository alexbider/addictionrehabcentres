import type { Metadata } from 'next';
import { desc, eq } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import { getPublished } from '@/lib/content';
import AdminShell from '../AdminShell';
import { Card, Table, btn, input } from '@/components/backend/ui';
import { routeToSlug } from '@/lib/slug';

export const metadata: Metadata = { title: 'Centres · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  return (
    <AdminShell current="centres" title="Centres">
      {async () => {
        const q = ((await searchParams).q || '').trim().toLowerCase();
        const db = await requireDb();
        const known = await db.select().from(schema.centres).orderBy(desc(schema.centres.createdAt)).limit(100);
        const withProfile = new Set((await db.select({ s: schema.centreProfiles.centreSlug }).from(schema.centreProfiles)).map((r) => r.s));
        const found = q ? getPublished().filter((e) => e.type === 'centre' && (e.route.includes(q) || e.title.toLowerCase().includes(q))).slice(0, 40) : [];
        return (
          <div style={{ display: 'grid', gap: 22 }}>
            <Card title="Find a centre page">
              <form style={{ display: 'flex', gap: 8, maxWidth: 520 }}><input name="q" defaultValue={q} placeholder="Name or URL" aria-label="Search centres" style={input} /><button style={btn('primary')}>Search</button></form>
              {q ? <div style={{ marginTop: 14 }}><Table head={['Centre', 'Page', '']} empty="No centre matches." rows={found.map((e) => [e.title, <a key="p" href={e.route}>{e.route}</a>, <a key="e" href={`/admin/centres/${routeToSlug(e.route)}/`} style={{ ...btn('ghost'), display: 'inline-flex', alignItems: 'center' }}>Edit</a>])} /></div> : null}
            </Card>
            <Card title="Centres with an account, claim or draft">
              <Table head={['Centre', 'Source', 'Status', 'Owner edits', '']} empty="None yet."
                rows={known.map((c) => [c.name, c.source, c.status, withProfile.has(c.slug) ? 'Yes' : '', <a key="e" href={`/admin/centres/${c.slug}/`}>Edit</a>])} />
            </Card>
          </div>
        );
      }}
    </AdminShell>
  );
}
