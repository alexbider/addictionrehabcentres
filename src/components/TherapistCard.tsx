import Link from 'next/link';
import './centre-card.css';
import { HELPLINE_TEL } from './CentreCard';

export type TherapistCardProps = {
  name: string;
  /** Real published profile page; without it there is no "View profile" button. */
  href?: string | null;
  credentials?: string;
  location?: string;
  bio?: string;
  tags?: string[];
  /** Owner-supplied portrait only (never a copied photo); initials are shown otherwise. */
  photo?: { src: string; alt: string } | null;
  phone?: string | null;
  /** Shown only when the therapist published it. */
  fee?: string | null;
  note?: string | null;
};

const telOf = (p?: string | null) => { const d = String(p ?? '').replace(/\D/g, ''); return d.length === 11 && d[0] === '1' ? 'tel:+' + d : d.length === 10 ? 'tel:+1' + d : ''; };
const initials = (n: string) => n.replace(/\b(Dr|Mr|Mrs|Ms|Mx)\.?\s/i, '').split(/\s+/).slice(0, 2).map((w) => w[0] ?? '').join('').toUpperCase();

/** The one therapist card. Same shell, spacing and pinned button row as <CentreCard>; every optional part renders only when it has a value. */
export default function TherapistCard({ name, href, credentials, location, bio, tags, photo, phone, fee, note }: TherapistCardProps) {
  const tel = telOf(phone);
  return (
    <article className="cc cc-th" data-centre-card data-therapist-card>
      <div className="cc-th-head">
        <div className="cc-th-photo" aria-hidden={photo ? undefined : true}>{photo ? /* eslint-disable-next-line @next/next/no-img-element */ <img src={photo.src} alt={photo.alt} loading="lazy" /> : initials(name)}</div>
        <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <h3 className="cc-th-name">{href ? <Link href={href} prefetch={false}>{name}</Link> : name}</h3>
          <div className="cc-th-cred">{credentials ?? ''}</div>
          <p className="cc-loc">{location ?? ''}</p>
        </div>
      </div>
      <p className="cc-text" style={{ WebkitLineClamp: 3 }}>{bio ?? ''}</p>
      <div className="cc-tags">{(tags ?? []).slice(0, 3).map((t) => <span key={t} className="cc-tag">{t}</span>)}</div>
      <div className="cc-foot">
        {fee || note ? <span className="cc-foot-note">{fee ? <strong style={{ font: '600 15px Jost,sans-serif', color: '#10233a' }}>{fee}</strong> : null}{fee && note ? ' · ' : ''}{note ?? ''}</span> : null}
        <div className="cc-actions">
          <a className="cc-btn cc-btn-call" href={tel || HELPLINE_TEL}>Call now</a>
          {href ? <Link className="cc-btn cc-btn-view" href={href} prefetch={false}>View profile</Link> : null}
        </div>
      </div>
    </article>
  );
}
