import type { Metadata } from 'next';
import { desc } from 'drizzle-orm';
import { requireDb, schema } from '@/db';
import AdminShell from '../AdminShell';
import { Card, Table, btn, fmtDate, input } from '@/components/backend/ui';
import { inviteByEmail } from '../actions';

export const metadata: Metadata = { title: 'Invites · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="invites" title="Invite a therapist or centre">
      {async () => {
        const db = await requireDb();
        const rows = await db.select().from(schema.invites).orderBy(desc(schema.invites.createdAt)).limit(100);
        return (
          <div style={{ display: 'grid', gap: 22 }}>
            <Card title="Send an invite">
              <p style={{ marginTop: 0, color: '#3b4d63' }}>The person gets a link to create or claim their own profile. Everything published is written or approved by them.</p>
              <form action={inviteByEmail} style={{ display: 'grid', gap: 12, maxWidth: 560 }}>
                <label>Email<input name="email" type="email" required style={input} /></label>
                <label>Name (optional)<input name="name" style={input} /></label>
                <label>For<select name="kind" style={input}><option value="therapist">A therapist profile</option><option value="centre">A centre listing</option></select></label>
                <label>Centre page (for a centre invite, e.g. twelve-mile-recovery)<input name="centreSlug" style={input} /></label>
                <div><button style={btn('primary')}>Send invite</button></div>
              </form>
            </Card>
            <Card title="Sent invites"><Table head={['To', 'For', 'Sent', 'Used']} empty="None yet." rows={rows.map((r) => [r.email, r.kind + (r.centreSlug ? ` · ${r.centreSlug}` : ''), fmtDate(r.createdAt), r.usedAt ? fmtDate(r.usedAt) : ''])} /></Card>
          </div>
        );
      }}
    </AdminShell>
  );
}
