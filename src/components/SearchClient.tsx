'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Root as CityView } from '@/views/City';
import options from '@/lib/search-options.json';
import { prepare, run, type Rec, type Query } from '@/lib/search';

type Link = { label: string; href: string | null; heading: boolean };
const PAGE = 12;
const readUrl = (): Query => {
  const u = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
  const clean = (v: string | null, allowed?: string[]) => { const s = (v ?? '').slice(0, 120); return allowed && !allowed.includes(s) ? '' : s; };
  return { q: clean(u.get('q')), province: clean(u.get('province'), options.provinces.map((o) => o.value)), type: clean(u.get('type'), options.types.map((o) => o.value)), sort: u.get('sort') === 'az' ? 'az' : 'relevance' };
};
const toUrl = (f: Query) => {
  const u = new URLSearchParams();
  if (f.q) u.set('q', f.q);
  if (f.province) u.set('province', f.province);
  if (f.type) u.set('type', f.type);
  if (f.sort === 'az') u.set('sort', 'az');
  const s = u.toString();
  return '/search/' + (s ? '?' + s : '');
};

export default function SearchClient({ others, othersHeading, suggestProvinces, suggestCities }: { others: Link[]; othersHeading: string; suggestProvinces: { label: string; href: string | null }[]; suggestCities: { label: string; href: string; key: string }[] }) {
  const [f, setF] = useState<Query>({ q: '', province: '', type: '', sort: 'relevance' });
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<'init' | 'loading' | 'ready' | 'error'>('init');
  const [recs, setRecs] = useState<Rec[] | null>(null);
  const [shown, setShown] = useState(PAGE);
  const slugToCode = useMemo(() => Object.fromEntries(options.provinces.map((o) => [o.value, o.code])), []);

  useEffect(() => {
    const q = readUrl();
    setF(q); setDraft(q.q); setStatus('loading');
    fetch('/assets/search-index.json').then((r) => r.json()).then((d: Rec[]) => { setRecs(d); setStatus('ready'); }).catch(() => setStatus('error'));
    const pop = () => { const x = readUrl(); setF(x); setDraft(x.q); setShown(PAGE); };
    window.addEventListener('popstate', pop);
    return () => window.removeEventListener('popstate', pop);
  }, []);

  const prepared = useMemo(() => (recs ? prepare(recs) : []), [recs]);
  const results = useMemo(() => (recs ? run(prepared, f, slugToCode) : []), [recs, prepared, f, slugToCode]);

  const set = useCallback((patch: Partial<Query>) => {
    setF((cur) => { const next = { ...cur, ...patch }; window.history.pushState(null, '', toUrl(next)); return next; });
    setShown(PAGE);
  }, []);

  const label = (v: string, list: { value: string; label: string }[]) => list.find((o) => o.value === v)?.label ?? v;
  const chips = [
    ...(f.q ? [{ key: 'q', label: 'Search: ' + f.q, remove: () => { setDraft(''); set({ q: '' }); } }] : []),
    ...(f.province ? [{ key: 'p', label: label(f.province, options.provinces), remove: () => set({ province: '' }) }] : []),
    ...(f.type ? [{ key: 't', label: label(f.type, options.types), remove: () => set({ type: '' }) }] : []),
  ];
  const count = results.length;
  const ready = status === 'ready';
  const empty = !ready || count === 0;
  const emptyTitle = status === 'ready' ? 'No centres match your search' : status === 'error' ? 'The search could not be loaded' : status === 'loading' ? 'Searching…' : 'Search the directory';
  const emptyText = status === 'ready'
    ? 'Try fewer or different words, another spelling, or remove a filter. You can also browse by province or city below, or call the free helpline and we will help you find a centre.'
    : status === 'error' ? 'Please reload the page or browse by province below. The free helpline is open 24/7.'
    : status === 'loading' ? 'Looking through the directory.'
    : 'Searching needs JavaScript, which is switched off or still loading. You can browse every province below or call the free helpline.';

  const data = {
    h1: 'Search results',
    h2: ready ? `${count} ${count === 1 ? 'centre' : 'centres'} found` : status === 'error' ? '' : 'Searching the directory',
    listHeading: '', listIntro: [] as string[], guide: [], provinceLabel: '', provinceHref: null, othersHeading, others, popular: [], pager: null,
    cards: results.slice(0, shown).map((r) => ({
      name: r.n, href: r.u, address: [r.a].filter(Boolean).join(''), excerpt: r.d, category: r.g.split('|').slice(0, 4).join(' · '), catHref: null,
      image: r.i ? { src: r.i, alt: r.t || r.n, width: r.w ?? null, height: r.h ?? null } : null,
      phone: r.k ?? '', tags: r.g.split('|').filter(Boolean),
    })),
    search: {
      q: f.q, draft, setDraft, province: f.province, type: f.type, sort: f.sort, count,
      provinces: options.provinces, types: options.types, chips, set,
      submit: () => set({ q: draft.trim() }), clear: () => { setDraft(''); setF((c) => { const n = { q: '', province: '', type: '', sort: c.sort }; window.history.pushState(null, '', toUrl(n)); return n; }); setShown(PAGE); },
      empty, emptyTitle, emptyText, suggestProvinces, suggestCities,
      hasMore: ready && count > shown, remaining: Math.min(PAGE, count - shown), more: () => setShown((s) => s + PAGE),
    },
  };
  return <CityView data={data as never} />;
}
