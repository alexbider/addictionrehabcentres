import Link from 'next/link';
import './centre-card.css';

export type CardImage = { src: string; alt: string; width?: number | string | null; height?: number | string | null };
export type CentreCardProps = {
  name: string;
  /** Real published centre page; without it the card has no "View centre" button and the name is plain text. */
  href?: string | null;
  image?: CardImage | null;
  /** First images of a page (above the fold) load eagerly. */
  eager?: boolean;
  location?: string;
  tags?: string[];
  excerpt?: string;
  /** The centre's own phone (digits and +); the free helpline is dialled when the centre has none listed. */
  phone?: string | null;
  /** Optional, shown only when real data exists: */
  rating?: { value: string; count?: number | null } | null;
  badges?: string[];
  note?: string | null;
};

export const HELPLINE_TEL = 'tel:+18558854747';
const telOf = (p?: string | null) => { const d = String(p ?? '').replace(/\D/g, ''); return d.length === 11 && d[0] === '1' ? 'tel:+' + d : d.length === 10 ? 'tel:+1' + d : HELPLINE_TEL; };

/** The one centre card used everywhere: fixed image ratio, name clamped to 2 lines, excerpt to 3, buttons pinned to the bottom edge so
 *  "Call now" / "View centre" sit on the same line in every card of a row. Optional parts render only when they have a value. */
export default function CentreCard({ name, href, image, eager, location, tags, excerpt, phone, rating, badges, note }: CentreCardProps) {
  const shownTags = (tags ?? []).filter(Boolean).slice(0, 2);
  return (
    <article className="cc" data-centre-card>
      {(() => {
        const media = (
          <>
            {image?.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cc-photo" src={image.src} alt={image.alt || name} width={Number(image.width) || undefined} height={Number(image.height) || undefined} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : undefined} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="cc-fallback" src="/assets/logo.png" alt="" width={600} height={200} loading="eager" />
            )}
            {badges?.length ? <span className="cc-badges">{badges.map((b) => <span key={b} className="cc-badge">{b}</span>)}</span> : null}
            {rating?.value ? <span className="cc-rating"><span style={{ color: '#F5A623' }}>★</span>{rating.value}{rating.count ? <span style={{ font: '500 12px Figtree,sans-serif', color: '#5d7188' }}>({rating.count})</span> : null}</span> : null}
          </>
        );
        // The picture links to the centre like its name does; it is hidden from keyboard/screen-reader users because the name link already does the job.
        return href ? <Link className="cc-media" href={href} prefetch={false} tabIndex={-1} aria-hidden="true">{media}</Link> : <div className="cc-media">{media}</div>;
      })()}
      <div className="cc-body">
        <div className="cc-tags">{shownTags.map((t) => <span key={t} className="cc-tag">{t}</span>)}</div>
        <h3 className="cc-name">{href ? <Link href={href} prefetch={false}>{name}</Link> : name}</h3>
        <p className="cc-loc">{location ?? ''}</p>
        <p className="cc-text">{excerpt ?? ''}</p>
        <div className="cc-foot">
          {note ? <span className="cc-foot-note">{note}</span> : null}
          <div className="cc-actions">
            <a className="cc-btn cc-btn-call" href={telOf(phone)}>Call now</a>
            {href ? <Link className="cc-btn cc-btn-view" href={href} prefetch={false}>View centre</Link> : null}
          </div>
        </div>
      </div>
    </article>
  );
}
