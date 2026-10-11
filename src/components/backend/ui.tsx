import type { CSSProperties, ReactNode } from 'react';
import PageShell from '@/components/PageShell';
import SiteFooter from '@/views/SiteFooter';

/** Small building blocks for the signed-in pages (provider dashboard, admin), in the site's design language. */
export const colors = { ink: '#10233a', body: '#3b4d63', muted: '#5d7188', line: '#e3ecf4', bg: '#f7fafd', blue: '#0890E8', deepBlue: '#0670b8', red: '#9b1c1c', green: '#1d6b3f' };

export function Shell({ title, subtitle, nav, children, active = '' }: { title: string; subtitle?: string; nav?: { href: string; label: string; current?: boolean }[]; children: ReactNode; active?: string }) {
  return (
    <PageShell active={active}>
      <main style={{ background: colors.bg, padding: '40px 16px 72px', flex: 1 }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <h1 style={{ fontSize: 'clamp(28px,4vw,40px)', color: colors.ink }}>{title}</h1>
          {subtitle ? <p style={{ color: colors.muted, marginTop: 6, fontSize: 16 }}>{subtitle}</p> : null}
          {nav?.length ? (
            <nav aria-label="Sections" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '22px 0 26px' }}>
              {nav.map((n) => (
                <a key={n.href} href={n.href} aria-current={n.current ? 'page' : undefined} style={{ padding: '10px 16px', borderRadius: 999, border: `1px solid ${n.current ? colors.blue : '#dbe6f0'}`, background: n.current ? '#eaf5fd' : '#fff', color: colors.ink, font: '600 14px Jost,sans-serif', minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>{n.label}</a>
              ))}
            </nav>
          ) : <div style={{ height: 22 }} />}
          {children}
        </div>
      </main>
      <SiteFooter />
    </PageShell>
  );
}

export const card: CSSProperties = { background: '#fff', border: `1px solid ${colors.line}`, borderRadius: 22, padding: 24 };
export function Card({ title, children, style }: { title?: string; children: ReactNode; style?: CSSProperties }) {
  return <section style={{ ...card, ...style }}>{title ? <h2 style={{ fontSize: 22, marginBottom: 14, color: colors.ink }}>{title}</h2> : null}{children}</section>;
}
export const Notice = ({ kind = 'info', children }: { kind?: 'info' | 'error' | 'ok'; children: ReactNode }) => (
  <p role={kind === 'error' ? 'alert' : 'status'} style={{ margin: '0 0 16px', padding: '12px 14px', borderRadius: 12, fontSize: 15, background: kind === 'error' ? '#fdecec' : kind === 'ok' ? '#e9f8ef' : '#eaf5fd', color: kind === 'error' ? colors.red : kind === 'ok' ? colors.green : colors.deepBlue }}>{children}</p>
);
export const th: CSSProperties = { textAlign: 'left', font: '600 11.5px Figtree,sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', color: colors.muted, padding: '10px 12px', borderBottom: `1px solid ${colors.line}`, whiteSpace: 'nowrap' };
export const td: CSSProperties = { padding: '12px', borderBottom: '1px solid #f0f4f8', verticalAlign: 'top', fontSize: 14.5, color: colors.body };
export function Table({ head, rows, empty = 'Nothing here yet.' }: { head: string[]; rows: ReactNode[][]; empty?: string }) {
  if (!rows.length) return <p style={{ color: colors.muted }}>{empty}</p>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
        <thead><tr>{head.map((h) => <th key={h} style={th}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={td}>{c}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}
export const btn = (kind: 'primary' | 'ghost' | 'danger' = 'primary'): CSSProperties => ({ padding: '10px 16px', borderRadius: 10, border: kind === 'primary' ? '1.5px solid #10233a' : kind === 'danger' ? '1.5px solid #9b1c1c' : '1.5px solid #0890E8', background: kind === 'primary' ? '#10233a' : '#fff', color: kind === 'primary' ? '#fff' : kind === 'danger' ? '#9b1c1c' : '#0670b8', font: '600 14px Jost,sans-serif', cursor: 'pointer', minHeight: 44 });
export const input: CSSProperties = { width: '100%', padding: '11px 13px', borderRadius: 12, border: '1px solid #cfdceb', font: '500 15.5px Figtree,sans-serif', color: colors.ink, background: '#fff' };
export const fmtDate = (d: Date | string | null | undefined) => (d ? new Date(d).toLocaleString('en-CA', { dateStyle: 'medium', timeStyle: 'short' }) : '');
