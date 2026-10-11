import type { Metadata } from 'next';
import { asc } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from '../AdminShell';
import { Card, Table, btn, input } from '@/components/backend/ui';
import { saveSeo } from '../actions';

export const metadata: Metadata = { title: 'SEO · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="seo" title="Page SEO overrides">
      {async () => {
        const db = await requireDb();
        const rows = await db.select().from(schema.pageSeo).orderBy(asc(schema.pageSeo.path));
        return (
          <div style={{ display: 'grid', gap: 22 }}>
            <Card title="Add or change an override">
              <p style={{ marginTop: 0, color: '#3b4d63' }}>Leave title and description empty to keep the page&apos;s own. “No index” removes the page from the sitemap and adds a robots meta tag. Saving every field empty and unticked deletes the override. Changes appear when the page is next regenerated (immediately for the page you save).</p>
              <form action={saveSeo} style={{ display: 'grid', gap: 12, maxWidth: 720 }}>
                <label>Path (starts and ends with /)<input name="path" required placeholder="/twelve-mile-recovery/" style={input} /></label>
                <label>Title<input name="title" maxLength={200} style={input} /></label>
                <label>Meta description<textarea name="description" maxLength={400} rows={3} style={input} /></label>
                <label><input type="checkbox" name="noindex" /> No index</label>
                <div><button style={btn('primary')}>Save override</button></div>
              </form>
            </Card>
            <Card title="Current overrides"><Table head={['Path', 'Title', 'Description', 'No index']} empty="No overrides." rows={rows.map((r) => [r.path, r.title ?? '', r.description ?? '', r.noindex ? 'Yes' : ''])} /></Card>
          </div>
        );
      }}
    </AdminShell>
  );
}
