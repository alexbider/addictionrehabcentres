import type { Metadata } from 'next';
import AdminShell from '../AdminShell';
import { Card, btn } from '@/components/backend/ui';
import { getModerationMode } from '@/server/profile';
import { setModeration } from '../actions';

export const metadata: Metadata = { title: 'Settings · Admin', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <AdminShell current="settings" title="Settings">
      {async () => {
        const mode = await getModerationMode();
        return (
          <Card title="Provider edits">
            <p style={{ marginTop: 0, color: '#3b4d63' }}>Decide whether edits from centre owners go live immediately or wait in the moderation queue first.</p>
            <form action={setModeration} style={{ display: 'flex', flexDirection: 'column', gap: 10, maxWidth: 520 }}>
              <label><input type="radio" name="mode" value="review" defaultChecked={mode === 'review'} /> Review first (recommended): edits appear after an admin approves them</label>
              <label><input type="radio" name="mode" value="instant" defaultChecked={mode === 'instant'} /> Publish immediately: edits go live when saved (still logged and reversible)</label>
              <div><button style={btn('primary')}>Save setting</button></div>
            </form>
          </Card>
        );
      }}
    </AdminShell>
  );
}
