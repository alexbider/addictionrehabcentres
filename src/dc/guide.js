// Renders source guide blocks (headings, paragraphs, lists, tables, images) with the design's guide styles.
// Used by the Province and City views. Returns the React nodes and the table of contents (h1–h3).
export function buildGuide(R, blocks) {
  const toc = [];
  const used = {};
  const idFor = (t) => {
    const base = String(t).toLowerCase().replace(/&amp;|&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'section';
    used[base] = (used[base] || 0) + 1;
    return used[base] > 1 ? base + '-' + used[base] : base;
  };
  const bodyStyle = { fontSize: '17px', lineHeight: '1.75', color: '#3b4d63', overflowWrap: 'anywhere' };
  const nodes = blocks.map((b, i) => {
      if (/^h[1-6]$/.test(b.type)) {
        const id = idFor(b.text);
        const lvl = b.type === 'h1' || b.type === 'h2' ? 2 : b.type === 'h3' ? 3 : 4;
        if (lvl <= 3) toc.push({ label: b.text, href: '#' + id });
        const st = lvl === 2 ? { fontSize: '38px', lineHeight: '1.12' } : lvl === 3 ? { fontSize: '26px', marginTop: '10px' } : { fontSize: '20px', marginTop: '6px' };
        return R('h' + lvl, { key: i, id, style: st, 'data-rc-lg': lvl === 2 ? '1' : undefined, dangerouslySetInnerHTML: { __html: b.html } });
      }
      if (b.type === 'p' || b.type === 'text') return R('p', { key: i, style: bodyStyle, dangerouslySetInnerHTML: { __html: b.html ?? b.text } });
      if (b.type === 'blockquote') return R('blockquote', { key: i, style: { ...bodyStyle, borderLeft: '4px solid #0890E8', paddingLeft: '18px', margin: 0 }, dangerouslySetInnerHTML: { __html: b.html } });
      if (b.type === 'ul' || b.type === 'ol')
        return R(b.type, { key: i, style: { ...bodyStyle, paddingLeft: '24px', listStyle: b.type === 'ul' ? 'disc' : 'decimal', display: 'flex', flexDirection: 'column', gap: '6px' } }, ...b.items.map((it, k) => R('li', { key: k, dangerouslySetInnerHTML: { __html: it.html } })));
      if (b.type === 'table') return R('div', { key: i, className: 'cp-table', style: { overflowX: 'auto' }, dangerouslySetInnerHTML: { __html: b.html } });
      if (b.type === 'image') return R('img', { key: i, src: b.src, alt: b.alt, width: b.width || undefined, height: b.height || undefined, loading: 'lazy', style: { width: '100%', height: 'auto', display: 'block', borderRadius: '18px' } });
      return null;
    });
  return { nodes, toc };
}
