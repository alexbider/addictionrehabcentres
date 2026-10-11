import { getDb, schema } from '@/db';

const FROM = () => process.env.EMAIL_FROM || 'Addiction Rehab Centres Canada <no-reply@addictionrehabcenters.ca>';

/** Sends through Resend when RESEND_API_KEY is set; otherwise the message is only written to the outbox table (local development / no e-mail provider yet).
 *  Never throws: callers decide what a failed e-mail means (a saved form stays saved). Returns true when Resend accepted it. */
export async function sendEmail(to: string, subject: string, text: string, html?: string): Promise<boolean> {
  const db = await getDb();
  const key = process.env.RESEND_API_KEY;
  let status = 'logged'; let error: string | null = null;
  if (key) {
    try {
      const res = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${key}`, 'content-type': 'application/json' }, body: JSON.stringify({ from: FROM(), to: [to], subject, text, ...(html ? { html } : {}) }), signal: AbortSignal.timeout(10000) });
      status = res.ok ? 'sent' : 'failed';
      if (!res.ok) error = `${res.status} ${(await res.text()).slice(0, 300)}`;
    } catch (e) { status = 'failed'; error = e instanceof Error ? e.message : String(e); }
  }
  if (db) { try { await db.insert(schema.outbox).values({ toEmail: to, subject, body: text, status, error }); } catch { /* the log is best effort */ } }
  if (status === 'failed') console.error('[email] failed', to, subject, error);
  return status === 'sent';
}

export const adminInbox = () => (process.env.ADMIN_NOTIFY_EMAIL || '').trim();
export async function notifyAdmin(subject: string, text: string) {
  const to = adminInbox();
  if (to) await sendEmail(to, subject, text);
}
