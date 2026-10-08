import Link from 'next/link';
import type { Block, Page } from '@/lib/content';
import { Blk } from './blocks';
import PageShell from './PageShell';
import SiteFooter from '@/views/SiteFooter';
import ProvincesNav from './ProvincesNav';
import { getRoutes } from '@/lib/content';
import { categorySlug } from '@/lib/blog';

/**
 * Blog post layout (article header → featured image → body), styled like the BlogPost design. Only what the source has is
 * rendered: category, date, title, image and body. No author, reviewer, table of contents, timeline, FAQ block or form is added.
 */
export default function PostPage({ page }: { page: Page }) {
  const blocks = page.blocks ?? [];
  const h1 = blocks.findIndex((b) => b.type === 'h1');
  const lead = h1 > 0 ? blocks.slice(0, h1) : [];
  const hero = lead.find((b): b is Extract<Block, { type: 'image' }> => b.type === 'image');
  const body = blocks.slice(h1 >= 0 ? h1 + 1 : 0);
  const cats = page.post?.categories ?? [];
  return (
    <PageShell routes={getRoutes()}>
      <style dangerouslySetInnerHTML={{ __html: '.post-body img{max-width:100%;height:auto;border-radius:14px}.post-body a{text-decoration:underline;text-underline-offset:2px}.post-body table{border-collapse:collapse;width:100%;min-width:520px}.post-body th,.post-body td{border:1px solid #dbe6f0;padding:10px 12px;text-align:left;font-size:15px;line-height:1.5;color:#3b4d63;vertical-align:top}.post-body th{background:#eaf5fd;color:#10233a}.post-body .cp-table{overflow-x:auto;margin:0 0 22px;-webkit-overflow-scrolling:touch}' }} />
      <main>
        <article>
          <header style={{ background: 'radial-gradient(1000px 500px at 85% -10%,#dbeefb 0%,rgba(219,238,251,0) 60%),#f7fafd', borderBottom: '1px solid #e9eff5' }}>
            <div style={{ maxWidth: '860px', margin: '0 auto', padding: '56px 32px 40px' }} data-rc-wrap="1">
              <nav aria-label="Breadcrumb" style={{ fontSize: '13.5px', color: '#6b7f95', marginBottom: '22px' }}>
                <Link className="scp0" href="/blog/" style={{ color: '#6b7f95' }}>Blog</Link>
              </nav>
              {cats.length > 0 && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  {cats.map((c) => (
                    <Link key={c} href={`/blog/?category=${categorySlug(c)}`} style={{ font: '600 12px Figtree,sans-serif', letterSpacing: '.08em', textTransform: 'uppercase', color: '#0890E8', background: '#eaf5fd', padding: '6px 10px', borderRadius: '999px' }}>{c}</Link>
                  ))}
                </div>
              )}
              <h1 style={{ fontSize: '46px', lineHeight: 1.1, color: '#10233a' }} data-rc-lg="1">{page.h1}</h1>
              {page.post?.date_label && <p style={{ marginTop: '16px', fontSize: '15px', color: '#6b7f95' }}><time dateTime={page.post.published}>{page.post.date_label}</time></p>}
            </div>
          </header>
          {hero && (
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '36px 32px 0' }} data-rc-wrap="1">
              <img src={hero.src} alt={hero.alt} width={hero.width ?? undefined} height={hero.height ?? undefined} style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '20px' }} />
            </div>
          )}
          <div className="post-body" style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 32px 72px' }} data-rc-wrap="1">
            {body.map((b, i) => (b.type === 'h1' ? <Blk key={i} b={{ ...b, type: 'h2' }} /> : <Blk key={i} b={b} />))}
          </div>
        </article>
      </main>
      <ProvincesNav />
      <SiteFooter />
    </PageShell>
  );
}
