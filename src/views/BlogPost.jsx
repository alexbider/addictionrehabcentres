'use client';
// Generated from BlogPost.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = {
    ttsOk: false,
    menu: null,
    progress: 0,
    active: 'key-takeaways',
    faq: 0,
    copied: false,
    kind: null,
    slide: 0,
    tts: 'idle',
    ttsIdx: 0,
    ttsRate: 1,
  };
  sliderRef = React.createRef();
  perView = 3;
  sectionIds = ['key-takeaways', 'what-is-detox', 'timeline', 'medical-detox', 'after-detox', 'choosing', 'faq'];
  faqData = [];

  componentDidMount() {
    this._onResize = () => this.setState({ vw: document.documentElement.clientWidth || window.innerWidth });
    window.addEventListener('resize', this._onResize);
    this._onResize();
    this.setState({ ttsOk: 'speechSynthesis' in window });
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(this._onResize);
      this._ro.observe(document.documentElement);
    }
    requestAnimationFrame(this._onResize);
    setTimeout(this._onResize, 300);
    this._onScroll = () => {
      const art = document.querySelector('article');
      if (!art) return;
      const r = art.getBoundingClientRect(),
        vh = window.innerHeight;
      const p = Math.max(0, Math.min(1, (vh * 0.6 - r.top) / r.height));
      let active = this.state.active;
      for (const id of this.sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 160) active = id;
      }
      if (Math.abs(p - this.state.progress) > 0.005 || active !== this.state.active)
        this.setState({ progress: p, active });
    };
    window.addEventListener('scroll', this._onScroll, { passive: true });
    this._onScroll();
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._onResize);
    this._ro?.disconnect();
    clearTimeout(this._copyT);
    this.ttsStop();
  }

  // ---- Audio reader (Web Speech API). Reads ONLY the <article> element, skipping anything marked data-no-read
  // (player, CTAs, tags, author bio, sources, disclaimer) and the collapsed FAQ answers not in the DOM.
  ttsChunks() {
    const art = document.querySelector('article');
    if (!art) return [];
    const chunks = [];
    const walk = (el) => {
      for (const node of el.childNodes) {
        if (node.nodeType !== 1) continue;
        if (node.hasAttribute('data-no-read') || node.tagName === 'BUTTON' || node.tagName === 'SVG') continue;
        const tag = node.tagName;
        if (
          /^(H[1-6]|P|LI|BLOCKQUOTE|FIGCAPTION)$/.test(tag) ||
          (tag === 'DIV' &&
            node.children.length &&
            [...node.children].every((c) => /^(DIV|SPAN|P)$/.test(c.tagName) && !c.children.length))
        ) {
          const text = node.innerText.replace(/\s+/g, ' ').trim();
          if (text.length > 1)
            chunks.push({ text: /^H[1-6]$/.test(tag) ? text + '.' : text, heading: /^H[1-6]$/.test(tag) });
          continue;
        }
        walk(node);
      }
    };
    walk(art);
    // FAQ answers may be collapsed (not in DOM) — append from data so the whole article is read.
    const faqStart = chunks.findIndex((c) => c.heading && /frequently asked/i.test(c.text));
    if (faqStart >= 0) {
      const faqChunks = [];
      this.faqData.forEach(([q, a]) => {
        faqChunks.push({ text: q, heading: true }, { text: a });
      });
      const nextIdx = chunks.findIndex((c, i) => i > faqStart && c.heading);
      chunks.splice(faqStart + 1, (nextIdx > 0 ? nextIdx : chunks.length) - faqStart - 1, ...faqChunks);
    }
    return chunks;
  }
  ttsSpeak(i) {
    const chunks = this._chunks;
    if (!chunks || i >= chunks.length) {
      this.setState({ tts: 'done', ttsIdx: chunks ? chunks.length : 0 });
      return;
    }
    const u = new SpeechSynthesisUtterance(chunks[i].text);
    u.rate = this.state.ttsRate;
    u.lang = 'en-CA';
    const v =
      speechSynthesis
        .getVoices()
        .find((v) => /en-(CA|US|GB)/.test(v.lang) && /Google|Samantha|Karen|Daniel|Natural/i.test(v.name)) ||
      speechSynthesis.getVoices().find((v) => v.lang.startsWith('en'));
    if (v) u.voice = v;
    u.onend = () => {
      if (this.state.tts === 'playing' && this._chunks === chunks) this.ttsSpeak(i + 1);
    };
    u.onerror = (e) => {
      if (e.error !== 'interrupted' && e.error !== 'canceled') this.setState({ tts: 'idle' });
    };
    this._utter = u;
    this.setState({ ttsIdx: i, tts: 'playing' });
    speechSynthesis.speak(u);
  }
  ttsStart(from) {
    if (typeof speechSynthesis === 'undefined') return;
    speechSynthesis.cancel();
    this._chunks = this.ttsChunks();
    this._words = this._chunks.reduce((n, c) => n + c.text.split(' ').length, 0);
    this.ttsSpeak(from ?? 0);
  }
  ttsStop() {
    if (typeof speechSynthesis !== 'undefined') speechSynthesis.cancel();
    this.setState({ tts: 'idle', ttsIdx: 0 });
  }

  slideTo(i, total) {
    const el = this.sliderRef.current;
    if (!el) return;
    const pages = Math.max(1, Math.ceil(total / this.perView));
    const page = Math.max(0, Math.min(pages - 1, i));
    el.scrollTo({ left: page * el.clientWidth, behavior: 'smooth' });
    this.setState({ slide: page });
  }
  icon(paths, extra) {
    const R = React.createElement;
    return R(
      'svg',
      {
        width: 20,
        height: 20,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        ...(extra || {}),
      },
      ...paths.map((d, i) => (typeof d === 'string' ? R('path', { key: i, d }) : R(d.t, { key: i, ...d.a }))),
    );
  }

  renderVals() {
    const B = 'https://addictionrehabcenters.ca/';
    const { menu, progress, active, faq, copied, slide } = this.state;
    const kind = this.state.kind ?? this.props.featuredKind ?? 'centres';
    const ic = {
      pin: this.icon([
        'M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z',
        { t: 'circle', a: { cx: 12, cy: 10, r: 2.5 } },
      ]),
      pill: this.icon(['M10.5 3.5l10 10a4.95 4.95 0 0 1-7 7l-10-10a4.95 4.95 0 0 1 7-7z', 'M8.5 8.5l7 7']),
      glass: this.icon(['M7 3h10l-1 9a4 4 0 0 1-8 0L7 3z', 'M12 16v5', 'M9 21h6']),
      hands: this.icon(['M4 13l4-4 3 3', 'M20 13l-4-4-3 3', 'M4 13v5l5 3h6l5-3v-5', 'M12 12v4']),
      more: this.icon([
        { t: 'circle', a: { cx: 5, cy: 12, r: 1.5 } },
        { t: 'circle', a: { cx: 12, cy: 12, r: 1.5 } },
        { t: 'circle', a: { cx: 19, cy: 12, r: 1.5 } },
      ]),
      person: this.icon([{ t: 'circle', a: { cx: 12, cy: 8, r: 4 } }, 'M4 21a8 8 0 0 1 16 0']),
      shield: this.icon(['M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z', 'M9 12l2 2 4-4'], {
        width: 14,
        height: 14,
        strokeWidth: 2,
      }),
      clock: this.icon([{ t: 'circle', a: { cx: 12, cy: 12, r: 8 } }, 'M12 8v4l3 2'], { width: 15, height: 15 }),
      link: this.icon(
        ['M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1', 'M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1'],
        { width: 15, height: 15 },
      ),
      check: this.icon(['M5 12l5 5 9-10'], { width: 16, height: 16, strokeWidth: 2 }),
      checkSm: this.icon(['M5 12l5 5 9-10'], { width: 15, height: 15, strokeWidth: 2.2 }),
      plus: this.icon(['M12 6v12', 'M6 12h12'], { width: 14, height: 14, strokeWidth: 2 }),
      alert: this.icon(['M12 7v6', 'M12 16.5v.5'], { width: 13, height: 13, strokeWidth: 2.2 }),
      phone: this.icon(
        ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'],
        { width: 22, height: 22 },
      ),
      phoneSm: this.icon(
        ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'],
        { width: 16, height: 16 },
      ),
      headphones: this.icon(['M4 14v-2a8 8 0 0 1 16 0v2', 'M4 14h3v6H4z', 'M17 14h3v6h-3z'], { width: 16, height: 16 }),
      play: React.createElement(
        'svg',
        { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor' },
        React.createElement('path', { d: 'M8 5.5v13l11-6.5z' }),
      ),
      pause: React.createElement(
        'svg',
        { width: 20, height: 20, viewBox: '0 0 24 24', fill: 'currentColor' },
        React.createElement('rect', { x: 6, y: 5, width: 4, height: 14, rx: 1 }),
        React.createElement('rect', { x: 14, y: 5, width: 4, height: 14, rx: 1 }),
      ),
    };
    // Audio reader values
    const { tts, ttsIdx, ttsRate } = this.state;
    const chunks = this._chunks || [];
    const totalWords = this._words || 1550,
      wordsDone = chunks.slice(0, ttsIdx).reduce((n, c) => n + c.text.split(' ').length, 0);
    const ttsPct = tts === 'done' ? 100 : chunks.length ? Math.round((wordsDone / totalWords) * 100) : 0;
    const fmt = (s) => Math.floor(s / 60) + ':' + String(Math.round(s % 60)).padStart(2, '0');
    const totalSec = totalWords / (2.6 * ttsRate),
      doneSec = (totalSec * ttsPct) / 100;
    const ttsSupported = !!this.state.ttsOk;
    const ttsToggle = () => {
      if (tts === 'playing') {
        speechSynthesis.pause();
        this.setState({ tts: 'paused' });
      } else if (tts === 'paused') {
        speechSynthesis.resume();
        this.setState({ tts: 'playing' });
      } else this.ttsStart(0);
    };
    const ttsRates = [0.85, 1, 1.25].map((r) => ({
      label: r === 1 ? '1×' : r + '×',
      pick: () => {
        this.setState({ ttsRate: r }, () => {
          if (this.state.tts === 'playing' || this.state.tts === 'paused') {
            speechSynthesis.cancel();
            this.ttsSpeak(this.state.ttsIdx);
          }
        });
      },
      bg: ttsRate === r ? '#fff' : 'transparent',
      color: ttsRate === r ? '#10233a' : '#6b7f95',
      shadow: ttsRate === r ? '0 2px 8px -2px rgba(16,35,58,.2)' : 'none',
    }));
    const ttsSeek = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const p = (e.clientX - r.left) / r.width;
      if (!this._chunks) {
        this._chunks = this.ttsChunks();
        this._words = this._chunks.reduce((n, c) => n + c.text.split(' ').length, 0);
      }
      let acc = 0,
        idx = 0;
      for (let i = 0; i < this._chunks.length; i++) {
        acc += this._chunks[i].text.split(' ').length;
        if (acc / this._words >= p) {
          idx = i;
          break;
        }
      }
      speechSynthesis.cancel();
      this.ttsSpeak(idx);
    };
    const nowChunk = chunks[ttsIdx];
    const L = (arr) =>
      arr.map((s) => {
        const [label, p] = s.split('|');
        return { label, href: B + p + '/' };
      });
    const provinces = [
      { label: 'Alberta Rehabs', href: B + 'alberta-rehabs/' },
      {
        label: 'British Columbia Rehabs',
        href: B + 'british-columbia-rehabs/',
        children: [{ label: 'Vancouver Rehabs', href: B + '7-best-drug-alcohol-rehab-centres-in-vancouver-2025/' }],
      },
      { label: 'Manitoba Rehabs', href: B + 'manitoba-rehabs/' },
      { label: 'New Brunswick Rehabs', href: B + 'new-brunswick-rehabs/' },
      { label: 'Newfoundland and Labrador Rehabs', href: B + 'newfoundland-and-labrador-rehabs/' },
      { label: 'Northwest Territories Rehabs', href: B + 'northwest-territories-rehabs/' },
      { label: 'Nova Scotia Rehabs', href: B + 'nova-scotia-rehabs/' },
      {
        label: 'Ontario Rehabs',
        href: B + 'ontario-rehabs/',
        children: [
          { label: 'Toronto Rehabs', href: B + 'toronto-rehabs/' },
          { label: 'Ottawa Rehabs', href: B + 'ottawa-rehabs/' },
        ],
      },
      { label: 'Prince Edward Island Rehabs', href: B + 'prince-edward-island-rehabs/' },
      { label: 'Saskatchewan Rehabs', href: B + 'saskatchewan-rehabs/' },
      {
        label: 'Quebec Rehabs',
        href: B + 'drug-alcohol-rehabs-in-quebec/',
        children: [{ label: 'Montreal Rehabs', href: B + 'montreal-rehabs/' }],
      },
    ];
    const drugs = L([
      'Benzodiazepine Addiction|benzodiazepine-addiction',
      'Cocaine Addiction|cocaine-addiction',
      'Ecstasy Addiction|ecstasy-addiction',
      'GHB Addiction|ghb-addiction',
      'Heroin Addiction|heroin-addiction',
      'Ketamine Addiction|ketamine-addiction',
      'Lortab Addiction|lortab-addiction',
      'LSD Addiction|lsd-addiction',
      'Marijuana Addiction|marijuana-addiction',
      'Methadone Addiction|methadone-addiction',
      'Mescaline Addiction|mescaline',
      'Opioids Addiction|opioids-addiction',
      'Opium Addiction|opium-addiction',
      'Oxycodone Addiction|oxycodone-addiction',
      'PCP Addiction|pcp-addiction',
      'Percocet Treatment|percocet-treatment',
      'Prescription drugs Addiction Canada|prescription-drugs-addiction',
      'Ritalin Addiction Canada|ritalin-addiction',
      'Steroids Addiction|steroids-addiction',
      'Street Drugs Addiction|street-drugs-addiction',
      'Tranquilisers Addiction|tranquilisers-addiction',
      'Vicodin Addiction|vicodin-addiction',
    ]);
    const menus = {
      provinces: {
        title: 'Rehabs By Provinces',
        sub: 'Treatment centres across every province and territory',
        icon: ic.pin,
        cols: 'repeat(3,1fr)',
        links: provinces,
      },
      drugs: {
        title: 'Addiction By Drugs',
        sub: 'Learn about specific substances and how they are treated',
        icon: ic.pill,
        cols: 'repeat(4,1fr)',
        links: drugs,
      },
      alcohol: {
        title: 'Alcohol Addiction',
        sub: 'Understanding and treating alcohol dependence',
        icon: ic.glass,
        cols: 'repeat(2,1fr)',
        links: L([
          'Alcohol Addiction|addiction-by-alcohol',
          'Am I An Alcoholic?|am-i-an-alcoholic',
          'AA Support Group|aa-support-group',
          'Detox Centres in Canada|detox-centres-in-canada',
        ]),
      },
      intervention: {
        title: 'Intervention',
        sub: 'Help a loved one take the first step',
        icon: ic.hands,
        cols: 'repeat(2,1fr)',
        links: L([
          'Intervention|intervention',
          'Drugs and Alcohol Intervention|drugs-and-alcohol-intervention',
          'Drug Intervention Treatment Centres|drug-intervention-treatment-centres',
        ]),
      },
      therapists: {
        title: 'Find a Therapist',
        sub: 'Registered psychotherapists, psychologists and addiction counsellors',
        icon: ic.person,
        cols: 'repeat(3,1fr)',
        links: [
          {
            label: 'Therapist Directory',
            href: '/therapists',
            children: [{ label: 'Example profile', href: '/therapist-profile' }],
          },
          {
            label: 'Therapists in Ontario',
            href: '/therapists-province',
            children: [
              { label: 'Toronto', href: '/therapists-city' },
              { label: 'Ottawa', href: '/therapists-city' },
            ],
          },
          {
            label: 'Therapists in British Columbia',
            href: '/therapists-province',
            children: [{ label: 'Vancouver', href: '/therapists-city' }],
          },
          {
            label: 'Therapists in Alberta',
            href: '/therapists-province',
            children: [
              { label: 'Calgary', href: '/therapists-city' },
              { label: 'Edmonton', href: '/therapists-city' },
            ],
          },
          {
            label: 'Therapists in Quebec',
            href: '/therapists-province',
            children: [{ label: 'Montreal', href: '/therapists-city' }],
          },
          { label: 'Join the directory', href: '/join-directory' },
        ],
      },
      more: {
        title: 'More',
        sub: 'Resources, answers and ways to work with us',
        icon: ic.more,
        cols: 'repeat(2,1fr)',
        links: [
          {
            label: 'Blog',
            href: '/blog',
            children: [{ label: 'Example article', href: '/blog/how-long-does-alcohol-detox-take' }],
          },
          { label: 'FAQ', href: B + 'faqs/' },
          { label: 'Promote Your Centre', href: '/promote' },
          { label: 'Contact Us', href: '/contact' },
        ],
      },
    };
    const navItems = [
      ['provinces', 'Rehabs By Provinces'],
      ['drugs', 'Addiction By Drugs'],
      ['alcohol', 'Alcohol Addiction'],
      ['intervention', 'Intervention'],
      ['therapists', 'Find a Therapist'],
      ['more', 'More'],
    ].map(([k, label]) => ({
      label,
      open: () => this.setState({ menu: k }),
      bg: menu === k ? '#eaf5fd' : 'transparent',
      chev: menu === k ? 'rotate(-135deg) translateY(-2px)' : 'rotate(45deg)',
    }));
    const m = menu ? menus[menu] : null;

    const tocDefs = [
      ['key-takeaways', 'Key takeaways'],
      ['what-is-detox', 'What alcohol detox actually is'],
      ['timeline', 'The day-by-day timeline'],
      ['medical-detox', 'When medical detox is non-negotiable'],
      ['after-detox', 'What happens after day 7'],
      ['choosing', 'Choosing a detox centre in Canada'],
      ['faq', 'Frequently asked questions'],
    ];
    const toc = tocDefs.map(([id, label]) => {
      const on = active === id;
      return {
        href: '#' + id,
        label,
        border: on ? '#0890E8' : 'transparent',
        color: on ? '#0890E8' : '#516378',
        weight: on ? 600 : 500,
      };
    });
    const T = (when, sub, body, tag, level) => ({
      when,
      sub,
      body,
      tag,
      bg: level === 2 ? '#fff5f5' : '#fff',
      tagBg: level === 2 ? '#fdecec' : level === 1 ? '#fff3e0' : '#e8f7ee',
      tagColor: level === 2 ? '#D82028' : level === 1 ? '#b8600a' : '#1f8a4c',
    });
    const timeline = [
      T(
        '6–12 hours',
        'after last drink',
        'Anxiety, shaky hands, sweating, nausea, headache, insomnia. Blood pressure and pulse begin to climb.',
        'MILD',
        0,
      ),
      T(
        '12–24 hours',
        'day one',
        'Symptoms intensify. Some people experience visual, auditory or tactile hallucinations while remaining fully aware.',
        'MODERATE',
        1,
      ),
      T(
        '24–48 hours',
        'highest seizure risk',
        'Withdrawal seizures, when they occur, cluster here. Tremor, sweating and agitation usually peak.',
        'HIGH RISK',
        2,
      ),
      T(
        '48–72 hours',
        'delirium tremens window',
        'Delirium tremens can begin: severe confusion, fever, racing heart, profound agitation. A medical emergency.',
        'HIGH RISK',
        2,
      ),
      T(
        'Days 4–7',
        'tapering off',
        'Physical symptoms fade steadily. Sleep, appetite and mood start to normalise. Medication tapers end.',
        'IMPROVING',
        0,
      ),
    ];
    const faqDefs = (this.faqData = [
      [
        'Can I detox from alcohol at home?',
        'Only after a medical assessment. People with a history of seizures, heavy daily drinking, or other health conditions should detox under supervision. Home detox programs with daily nurse check-ins exist in most provinces for lower-risk cases.',
      ],
      [
        'How long do alcohol cravings last after detox?',
        'Physical withdrawal ends within about a week, but cravings, sleep disruption and low mood can persist for weeks to months. This post-acute phase is when structured treatment and peer support matter most.',
      ],
      [
        'Is alcohol detox covered by provincial health plans?',
        'Publicly funded withdrawal management beds exist in every province, though wait times vary widely. Private detox is paid out of pocket or through extended health benefits, typically $2,500–$8,000 for a 5–7 day stay.',
      ],
    ]);
    const faqs = faqDefs.map(([q, a], i) => {
      const open = faq === i;
      return {
        q,
        a,
        open,
        toggle: () => this.setState({ faq: open ? -1 : i }),
        border: open ? '#0890E8' : '#e3ecf4',
        rot: open ? 'rotate(45deg)' : 'none',
      };
    });

    const main = {
      name: 'Metamorphosis Centre for Change',
      category: 'Residential · Medical detox',
      rating: '4.9',
      reviews: 128,
      address: 'Wasaga Beach, ON',
      phone: '705-996-6522',
      tel: 'tel:+17059966522',
      photo: 'photo · Metamorphosis-Centre-for-Change.jpg',
      body: 'A private residential facility on Georgian Bay offering physician-led medical detox followed by 30, 60 or 90-day residential programs. Dual-diagnosis care and family programming included.',
      perks: [
        '24/7 nursing & on-call physician',
        'Detox → residential, one admission',
        'Dual-diagnosis programming',
        'Extended-benefits receipts provided',
      ],
    };
    const C = (name, address, excerpt, rating, reviews, verified) => ({
      name,
      address,
      excerpt,
      rating,
      reviews,
      verified,
      category: 'Residential treatment',
      href: '/centre',
      cta: 'View centre',
      photo: 'photo · ' + name.toLowerCase().replace(/[^a-z]+/g, '-') + '.jpg',
    });
    const centres = [
      C(
        'Sunshine Coast Health Centre',
        'Powell River, BC',
        'Men-only residential program with medical detox and psychiatric care.',
        '4.8',
        94,
        true,
      ),
      C(
        'GreeneStone Muskoka',
        'Bala, ON',
        'Lakeside residential treatment with medically supervised detox.',
        '4.7',
        76,
        true,
      ),
      C(
        'Trafalgar Addiction Treatment Centres',
        'Erin, ON',
        'Residential and virtual programs; trauma-informed and dual-diagnosis.',
        '4.6',
        112,
        true,
      ),
      C(
        'Edgewood Treatment Centre',
        'Nanaimo, BC',
        'Long-established 12-step residential centre with medical detox on site.',
        '4.5',
        88,
        false,
      ),
      C(
        'Cedars at Cobble Hill',
        'Cobble Hill, BC',
        'Medically supervised detox and 45–90 day residential care on Vancouver Island.',
        '4.8',
        63,
        true,
      ),
      C(
        'Aurora Recovery Centre',
        'Gimli, MB',
        'Residential treatment on Lake Winnipeg with detox and family program.',
        '4.6',
        57,
        true,
      ),
      C(
        'Simcoe Addiction & Mental Health',
        'Vaughan, ON',
        'Private residential treatment with concurrent mental health care near Toronto.',
        '4.7',
        141,
        true,
      ),
      C(
        'Clinique Nouveau Départ',
        'Montréal, QC',
        'Bilingual private detox and residential treatment in Montréal.',
        '4.5',
        49,
        false,
      ),
      C(
        'Andy Hilton Recovery Centre',
        'Calgary, AB',
        'Residential program with detox referrals and strong aftercare in Calgary.',
        '4.6',
        72,
        true,
      ),
      C(
        'Ledgehill Treatment Centre',
        'Lawrencetown, NS',
        'Gender-specific residential treatment in Nova Scotia’s Annapolis Valley.',
        '4.7',
        38,
        true,
      ),
    ];
    const Th = (name, cred, address, excerpt, rating, reviews) => ({
      name,
      address,
      excerpt,
      rating,
      reviews,
      verified: true,
      category: cred,
      href: '/therapist-profile',
      cta: 'View profile',
      photo: 'portrait · ' + name.toLowerCase().replace(/[^a-z]+/g, '-') + '.jpg',
    });
    const therapists = [
      Th(
        'Dr. Amara Osei',
        'Clinical Psychologist',
        'Toronto, ON',
        'Alcohol use disorder, trauma and relapse prevention. In-person and virtual.',
        '5.0',
        41,
      ),
      Th(
        'Jonathan Reyes, RP',
        'Registered Psychotherapist',
        'Ottawa, ON',
        'CBT and motivational interviewing for early recovery.',
        '4.9',
        33,
      ),
      Th(
        'Marie-Claude Lévesque',
        'Psychologue',
        'Montréal, QC',
        'Bilingual addiction counselling and family therapy.',
        '4.9',
        27,
      ),
      Th(
        'Dr. Kevin Wong',
        'Addiction Psychiatrist',
        'Vancouver, BC',
        'Medication-assisted treatment and dual diagnosis.',
        '4.8',
        52,
      ),
      Th(
        'Sandra Blackwell, MSW',
        'Registered Social Worker',
        'Calgary, AB',
        'Family systems and supporting partners of people in recovery.',
        '4.9',
        29,
      ),
      Th(
        'Priya Nair, RN',
        'Addictions Nurse Counsellor',
        'Mississauga, ON',
        'Withdrawal planning and post-detox support.',
        '5.0',
        18,
      ),
      Th(
        'Daniel Oduya, CCAC',
        'Certified Addiction Counsellor',
        'Edmonton, AB',
        'Men’s groups, relapse planning and peer support links.',
        '4.7',
        24,
      ),
      Th(
        'Dr. Hannah Fischer',
        'Clinical Psychologist',
        'Halifax, NS',
        'Trauma-focused therapy (EMDR) alongside addiction care.',
        '4.9',
        22,
      ),
      Th(
        'Luis Fernandes, RP',
        'Registered Psychotherapist',
        'Hamilton, ON',
        'Virtual-first practice for shift workers and rural clients.',
        '4.8',
        31,
      ),
      Th(
        'Grace Thunderbird, MSW',
        'Registered Social Worker',
        'Winnipeg, MB',
        'Culturally grounded, land-based recovery approaches.',
        '5.0',
        16,
      ),
    ];
    const items = kind === 'centres' ? centres : therapists;
    const kinds = [
      ['centres', 'Rehab centres'],
      ['therapists', 'Therapists'],
    ].map(([k, label]) => ({
      label,
      pick: () => {
        this.setState({ kind: k, slide: 0 });
        const el = this.sliderRef.current;
        if (el) el.scrollTo({ left: 0 });
      },
      bg: kind === k ? '#fff' : 'transparent',
      color: kind === k ? '#10233a' : '#6b7f95',
      shadow: kind === k ? '0 2px 8px -2px rgba(16,35,58,.2)' : 'none',
    }));
    const pages = Math.ceil(items.length / this.perView);
    const slideDots = Array.from({ length: pages }, (_, i) => ({
      go: () => this.slideTo(i, items.length),
      w: slide === i ? '28px' : '8px',
      bg: slide === i ? '#0890E8' : '#dbe6f0',
    }));

    const related = [
      { title: 'Am I Drinking Too Much? 10 Honest Questions to Ask Yourself', read: 5 },
      { title: 'Inpatient vs. Outpatient Rehab in Canada: Which Is Right for You?', read: 8 },
      { title: 'Is Rehab Covered by OHIP? Public vs. Private Treatment Explained', read: 7 },
    ];
    const relatedCards = [
      {
        title: 'Am I Drinking Too Much? 10 Honest Questions to Ask Yourself',
        category: 'Alcohol',
        excerpt: 'Not a diagnosis — a mirror. The screening questions clinicians use, in plain language.',
        date: 'Jul 10, 2026',
        read: 5,
      },
      {
        title: 'Inpatient vs. Outpatient Rehab in Canada: Which Is Right for You?',
        category: 'Treatment Guides',
        excerpt: 'Cost, time away from work, success rates and who each model suits — compared side by side.',
        date: 'Aug 14, 2026',
        read: 8,
      },
      {
        title: 'Supporting a Partner in Early Recovery: A Practical Guide',
        category: 'Family & Intervention',
        excerpt: 'Boundaries, triggers, and the difference between supporting and enabling.',
        date: 'Jun 26, 2026',
        read: 7,
      },
    ];
    const footerCols = [
      {
        title: 'Types of Services',
        links: L([
          'Detox Centres in Canada|detox-centres-in-canada',
          'Drug Rehabilitation in Canada|drug-rehabilitation-in-canada',
          '12 Step Program for Drug Rehab & Alcohol Treatment|12-steps-programs',
          'Home Detox in Canada|home-detox-in-canada',
          'Long Term Drug Rehab Canada|long-term-drug-rehab-canada',
          'Medical Detox in Canada|medical-detox-in-canada',
          'Outpatient Drug Rehab Centers|outpatient-drug-rehab-centers',
          'Residential Drug Rehabs in Canada|residential-drug-rehabs-in-canada',
          'Short Term Drug Rehab in Canada|short-term-drug-rehab-in-canada',
          'Substance Abuse & Addiction|substance-abuse-addiction',
          '30 Days Treatment by Canadian Provinces|30-days-treatment-by-canadian-provinces',
        ]),
      },
      {
        title: 'Special Services',
        links: L([
          'Adolescent Drug Rehab|adolescent-drug-rehab-center',
          'Christian Faith-Based Rehabs in Canada|christian-faith-based-rehabs-in-canada',
          'Drug & Alcohol Assessments in Canada|drug-alcohol-assessments-in-canada',
          'Raam Clinic|raam-clinic',
          'Drugs and Alcohol Intervention|drugs-and-alcohol-intervention',
          'First Nation Drug & Alcohol Rehab|first-nation-drug-alcohol-rehabs',
          'Holistic Services in Canada|holistic-services-in-canada',
          'Men Only Drug Rehabs in Canada|men-only-drug-rehabs-in-canada',
          'Pregnant Women Services in Canada|pregnant-women-addiction-services-in-canada',
          'Women Only Rehab Centres in Canada|women-only-rehab-centers-in-canada',
        ]),
      },
      {
        title: 'Other Services',
        links: L([
          'AA Support Group|aa-support-group',
          'Drug Support Groups in Canada|drug-support-groups-in-canada',
          'DUI in Canada|dui-in-canada',
          'DUI Lawyers in Canada|dui-lawyers-in-canada',
          'Prevention & Education Programs|prevention-education-programs',
          'Shelter Services in Canada|shelter-services-in-canada',
        ]),
      },
    ];
    const vw = this.state.vw || 0 || 1280;
    const narrow = vw < 1100,
      tight = vw < 1000;
    const showToc = (this.props.showToc ?? true) && !narrow;
    const bodyCols = narrow ? 'minmax(0,1fr)' : showToc ? '200px minmax(480px,1fr) 320px' : 'minmax(480px,1fr) 320px';
    const pct = Math.round(progress * 100);
    return {
      navItems,
      menuOpen: !!m,
      closeMenu: () => this.setState({ menu: null }),
      menuTitle: m?.title,
      menuSub: m?.sub,
      menuIcon: m?.icon,
      menuCols: m?.cols || '1fr',
      menuLinks: m?.links || [],
      iconShield: ic.shield,
      iconClock: ic.clock,
      iconLink: ic.link,
      iconCheck: ic.check,
      iconCheckSm: ic.checkSm,
      iconPlus: ic.plus,
      iconAlert: ic.alert,
      iconPhone: ic.phone,
      iconPhoneSm: ic.phoneSm,
      ttsSupported,
      ttsToggle,
      ttsStop: () => this.ttsStop(),
      ttsSeek,
      ttsRates,
      ttsPct,
      ttsPctStr: ttsPct + '%',
      ttsIcon: tts === 'playing' ? ic.pause : ic.play,
      ttsAria: tts === 'playing' ? 'Pause' : 'Play article audio',
      iconHeadphones: ic.headphones,
      ttsTitle:
        tts === 'idle'
          ? 'Listen to this article'
          : tts === 'done'
            ? 'Finished'
            : tts === 'paused'
              ? 'Paused'
              : 'Now reading',
      ttsBorder: tts === 'playing' ? '#0890E8' : '#e3ecf4',
      ttsTime: (tts === 'idle' ? '0:00' : fmt(doneSec)) + ' / ' + fmt(totalSec),
      ttsNow:
        tts === 'idle'
          ? 'Article only — skips ads, tags, author bio and sources. Uses your device voice.'
          : nowChunk
            ? (nowChunk.heading ? '§ ' : '') + nowChunk.text.slice(0, 110) + (nowChunk.text.length > 110 ? '…' : '')
            : tts === 'done'
              ? 'You reached the end of the article.'
              : '',
      readMin: 9,
      progress: pct + '%',
      progressLabel:
        pct >= 100
          ? 'Finished — nice work'
          : pct + '% read · ' + Math.max(1, Math.round(9 * (1 - progress))) + ' min left',
      showToc,
      bodyCols,
      sideStyle: narrow ? 'static' : 'sticky',
      sideCols: narrow ? 'repeat(auto-fit,minmax(280px,1fr))' : '1fr',
      timelineCols: tight ? '1fr' : '150px 1fr auto',
      metaDir: tight ? 'column' : 'row',
      metaAlign: tight ? 'flex-start' : 'center',
      toc,
      timeline,
      faqs,
      tags: ['Alcohol detox', 'Withdrawal', 'Medical detox', 'Delirium tremens', 'Ontario'],
      copyLink: () => {
        try {
          navigator.clipboard?.writeText(location.href);
        } catch (e) {}
        this.setState({ copied: true });
        clearTimeout(this._copyT);
        this._copyT = setTimeout(() => this.setState({ copied: false }), 2000);
      },
      copyLabel: copied ? 'Copied' : 'Copy link',
      copyBg: copied ? '#e8f7ee' : '#fff',
      copyColor: copied ? '#1f8a4c' : '#10233a',
      copyBorder: copied ? '#2fb46b' : '#dbe6f0',
      main,
      related,
      relatedCards,
      footerCols,
      kinds,
      items,
      sliderTitle: kind === 'centres' ? '10 featured detox & rehab centres' : '10 featured addiction therapists',
      sliderRef: this.sliderRef,
      slidePos: slide + 1 + ' / ' + pages,
      slidePrev: () => this.slideTo(slide - 1, items.length),
      slideNext: () => this.slideTo(slide + 1, items.length),
      slideDots,
      onSlideScroll: (e) => {
        const el = e.currentTarget;
        const p = Math.round(el.scrollLeft / el.clientWidth);
        if (p !== slide) this.setState({ slide: p });
      },
    };
  }
}

/* ───────────────────────── markup ───────────────────────── */
function template(v) {
  const {
    bodyCols,
    copyBg,
    copyBorder,
    copyColor,
    copyLabel,
    copyLink,
    faqs,
    footerCols,
    iconAlert,
    iconCheck,
    iconCheckSm,
    iconClock,
    iconHeadphones,
    iconLink,
    iconPhone,
    iconPhoneSm,
    iconPlus,
    iconShield,
    items,
    kinds,
    main,
    metaAlign,
    metaDir,
    onSlideScroll,
    progress,
    progressLabel,
    readMin,
    related,
    relatedCards,
    showToc,
    sideCols,
    sideStyle,
    slideDots,
    slideNext,
    slidePos,
    slidePrev,
    sliderRef,
    sliderTitle,
    tags,
    timeline,
    timelineCols,
    toc,
    ttsAria,
    ttsBorder,
    ttsIcon,
    ttsNow,
    ttsPct,
    ttsPctStr,
    ttsRates,
    ttsSeek,
    ttsStop,
    ttsSupported,
    ttsTime,
    ttsTitle,
    ttsToggle,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="more" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        <section
          data-screen-label="Article Header"
          style={{
            background: 'radial-gradient(900px 420px at 90% -10%,#dbeefb 0%,rgba(219,238,251,0) 60%),#f7fafd',
            borderBottom: '1px solid #e9eff5',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '36px 32px 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
            }}
            data-rc-wrap="1"
          >
            <nav
              aria-label="Breadcrumb"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13.5px',
                color: '#6b7f95',
                flexWrap: 'wrap',
              }}
            >
              <$A className="scp0" href="/" style={{ color: '#6b7f95' }}>
                Home
              </$A>
              <span style={{ opacity: '.5' }}>/</span>
              <$A className="scp0" href="/blog" style={{ color: '#6b7f95' }}>
                Blog
              </$A>
              <span style={{ opacity: '.5' }}>/</span>
              <$A className="scp0" href="/blog" style={{ color: '#6b7f95' }}>
                Alcohol
              </$A>
              <span style={{ opacity: '.5' }}>/</span>
              <span style={{ color: '#10233a', fontWeight: '500' }}>How Long Does Alcohol Detox Take?</span>
            </nav>
            <div style={{ maxWidth: '860px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <$A
                  href="/blog"
                  style={{
                    background: '#eaf5fd',
                    color: '#0890E8',
                    font: '600 11.5px Jost,sans-serif',
                    letterSpacing: '.08em',
                    padding: '6px 11px',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                  }}
                >
                  Alcohol
                </$A>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#fff',
                    border: '1px solid #e3ecf4',
                    color: '#1f3550',
                    font: '600 11.5px Jost,sans-serif',
                    letterSpacing: '.04em',
                    padding: '5px 10px',
                    borderRadius: '999px',
                  }}
                >
                  <span style={{ color: '#2fb46b' }}>{$i(iconShield)}</span>
                  MEDICALLY REVIEWED
                </span>
              </div>
              <h1 style={{ fontSize: '48px', lineHeight: '1.08' }} data-rc-lg="1">
                How Long Does Alcohol Detox Take? A Day-by-Day Timeline
              </h1>
              <p style={{ font: '400 19px/1.55 Figtree,sans-serif', color: '#516378' }}>
                Most people finish acute alcohol withdrawal within a week. What happens inside that week — and who needs
                a doctor in the room — varies far more than most guides admit.
              </p>
            </div>
            <div
              style={$css(
                `display:flex;flex-direction:${metaDir ?? ''};align-items:${metaAlign ?? ''};justify-content:space-between;gap:20px;padding-bottom:28px`,
              )}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: '#10233a',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      font: '600 14px Jost,sans-serif',
                    }}
                  >
                    SM
                  </span>
                  <div style={{ lineHeight: '1.3' }}>
                    <$A
                      className="scp0"
                      href="#author"
                      style={{ font: '600 14.5px Figtree,sans-serif', color: '#10233a' }}
                    >
                      Dr. Sarah Mitchell
                    </$A>
                    <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>
                      Addiction Medicine Physician · Reviewed by Priya Nair, RN
                    </div>
                  </div>
                </div>
                <span style={{ width: '1px', height: '28px', background: '#dbe6f0' }} />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    fontSize: '13.5px',
                    color: '#6b7f95',
                    flexWrap: 'wrap',
                  }}
                >
                  <time dateTime="2026-08-28">Published Aug 28, 2026</time>
                  <span style={{ opacity: '.5' }}>·</span>
                  <time dateTime="2026-09-01">Updated Sep 1, 2026</time>
                  <span style={{ opacity: '.5' }}>·</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {$i(iconClock)}
                    {$i(readMin)} min read
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '13px', color: '#6b7f95', marginRight: '4px' }}>Share</span>
                <$A
                  className="scp2"
                  href="#"
                  aria-label="Share on Facebook"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid #dbe6f0',
                    background: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#10233a',
                    font: '600 15px Jost,sans-serif',
                  }}
                >
                  f
                </$A>
                <$A
                  className="scp2"
                  href="#"
                  aria-label="Share on X"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid #dbe6f0',
                    background: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#10233a',
                    font: '600 14px Jost,sans-serif',
                  }}
                >
                  X
                </$A>
                <$A
                  className="scp2"
                  href="#"
                  aria-label="Share on LinkedIn"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid #dbe6f0',
                    background: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#10233a',
                    font: '600 14px Jost,sans-serif',
                  }}
                >
                  in
                </$A>
                <button
                  className="scpj"
                  onClick={copyLink}
                  aria-label="Copy link"
                  style={$css(
                    `appearance:none;cursor:pointer;height:40px;padding:0 14px;border-radius:10px;border:1px solid ${copyBorder ?? ''};background:${copyBg ?? ''};color:${copyColor ?? ''};display:flex;align-items:center;gap:7px;font:600 13.5px Jost,sans-serif;transition:all .18s`,
                  )}
                >
                  {$i(iconLink)}
                  {$i(copyLabel)}
                </button>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="Hero Image" style={{ background: '#fff' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }} data-rc-wrap="1">
            <figure style={{ margin: '-1px 0 0', transform: 'translateY(-1px)' }}>
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '21/9',
                  borderRadius: '0 0 28px 28px',
                  overflow: 'hidden',
                  background: '#eaf2f8',
                  boxShadow: '0 40px 80px -50px rgba(16,35,58,.45)',
                }}
              >
                <img
                  src="/assets/img/blog-alcohol-detox.jpg"
                  alt="Nurse checking on a patient in a Canadian medical detox room"
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <figcaption style={{ fontSize: '13px', color: '#6b7f95', padding: '12px 4px 0' }}>
                Medical detox units monitor blood pressure, pulse and symptoms on a fixed schedule for the first 72
                hours.
              </figcaption>
            </figure>
          </div>
        </section>
        <section data-screen-label="Article Body" style={{ background: '#fff' }}>
          <div
            style={$css(
              `max-width:1280px;margin:0 auto;padding:48px 32px 72px;display:grid;grid-template-columns:${bodyCols ?? ''};gap:48px;align-items:start`,
            )}
            data-rc-dyn="1"
          >
            {showToc ? (
              <>
                <aside
                  style={{ position: 'sticky', top: '124px', display: 'flex', flexDirection: 'column', gap: '18px' }}
                >
                  <div
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    In this article
                  </div>
                  <ol
                    style={{
                      margin: '0',
                      padding: '0',
                      listStyle: 'none',
                      display: 'flex',
                      flexDirection: 'column',
                      borderLeft: '2px solid #e9eff5',
                    }}
                  >
                    {$list(toc).map((t, $index) => (
                      <Fragment key={$index}>
                        <li style={{ marginLeft: '-2px' }}>
                          <$A
                            className="scp0"
                            href={t?.href}
                            style={$css(
                              `display:block;padding:7px 0 7px 16px;border-left:2px solid ${t?.border ?? ''};font:${t?.weight ?? ''} 14px/1.35 Figtree,sans-serif;color:${t?.color ?? ''};transition:all .18s`,
                            )}
                          >
                            {$i(t?.label)}
                          </$A>
                        </li>
                      </Fragment>
                    ))}
                  </ol>
                  <div
                    style={{
                      background: '#f7fafd',
                      border: '1px solid #e3ecf4',
                      borderRadius: '16px',
                      padding: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        font: '600 12px Figtree,sans-serif',
                        color: '#6b7f95',
                        letterSpacing: '.08em',
                        textTransform: 'uppercase',
                      }}
                    >
                      Progress
                    </span>
                    <div style={{ height: '6px', borderRadius: '999px', background: '#e3ecf4', overflow: 'hidden' }}>
                      <div
                        style={$css(
                          `height:100%;width:${progress ?? ''};background:#0890E8;border-radius:999px;transition:width .1s linear`,
                        )}
                      />
                    </div>
                    <span style={{ fontSize: '13px', color: '#516378' }}>{$i(progressLabel)}</span>
                  </div>
                </aside>
              </>
            ) : null}
            <article
              style={{
                minWidth: '0',
                display: 'flex',
                flexDirection: 'column',
                gap: '28px',
                fontSize: '17.5px',
                lineHeight: '1.75',
                color: '#3b4d63',
              }}
            >
              {ttsSupported ? (
                <>
                  <div
                    data-no-read="true"
                    role="region"
                    aria-label="Listen to this article"
                    style={$css(
                      `background:#fff;border:1px solid ${ttsBorder ?? ''};border-radius:18px;padding:14px 16px;display:flex;align-items:center;gap:14px;flex-wrap:wrap;box-shadow:0 20px 40px -32px rgba(16,35,58,.35);transition:border-color .2s`,
                    )}
                  >
                    <button
                      className="scpc"
                      onClick={ttsToggle}
                      aria-label={ttsAria}
                      style={{
                        appearance: 'none',
                        border: '0',
                        cursor: 'pointer',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: '#0890E8',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: '0',
                        boxShadow: '0 8px 18px -8px rgba(8,144,232,.7)',
                        transition: 'background .18s',
                      }}
                    >
                      {$i(ttsIcon)}
                    </button>
                    <div style={{ flex: '1', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          fontSize: '13.5px',
                        }}
                      >
                        <span
                          style={{
                            font: '600 14px Jost,sans-serif',
                            color: '#10233a',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          {$i(iconHeadphones)}
                          {$i(ttsTitle)}
                        </span>
                        <span style={{ color: '#6b7f95', fontVariantNumeric: 'tabular-nums' }}>{$i(ttsTime)}</span>
                      </div>
                      <div
                        onClick={ttsSeek}
                        role="slider"
                        aria-label="Playback position"
                        aria-valuemin="0"
                        aria-valuemax="100"
                        aria-valuenow={ttsPct}
                        style={{
                          height: '6px',
                          borderRadius: '999px',
                          background: '#e3ecf4',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          position: 'relative',
                        }}
                      >
                        <div
                          style={$css(
                            `height:100%;width:${ttsPctStr ?? ''};background:linear-gradient(90deg,#0890E8,#0f5fa8);border-radius:999px;transition:width .3s linear`,
                          )}
                        />
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#6b7f95', lineHeight: '1.35', minHeight: '17px' }}>
                        {$i(ttsNow)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: '0' }}>
                      <button
                        className="scp2"
                        onClick={ttsStop}
                        aria-label="Stop"
                        style={{
                          appearance: 'none',
                          cursor: 'pointer',
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          border: '1px solid #dbe6f0',
                          background: '#fff',
                          color: '#10233a',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            width: '12px',
                            height: '12px',
                            background: 'currentColor',
                            borderRadius: '2px',
                            display: 'block',
                          }}
                        />
                      </button>
                      <div
                        style={{
                          display: 'flex',
                          gap: '2px',
                          background: '#f7fafd',
                          border: '1px solid #e3ecf4',
                          borderRadius: '10px',
                          padding: '3px',
                        }}
                      >
                        {$list(ttsRates).map((r, $index) => (
                          <Fragment key={$index}>
                            <button
                              onClick={r?.pick}
                              style={$css(
                                `appearance:none;border:0;cursor:pointer;height:32px;padding:0 10px;border-radius:7px;background:${r?.bg ?? ''};color:${r?.color ?? ''};font:600 12.5px Jost,sans-serif;box-shadow:${r?.shadow ?? ''};transition:all .18s`,
                              )}
                            >
                              {$i(r?.label)}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              ) : null}
              <div
                style={{
                  background: '#f7fafd',
                  border: '1px solid #e3ecf4',
                  borderRadius: '20px',
                  padding: '26px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <h2
                  id="key-takeaways"
                  style={{ fontSize: '18px', color: '#10233a', display: 'flex', alignItems: 'center', gap: '10px' }}
                >
                  <span
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '9px',
                      background: '#eaf5fd',
                      color: '#0890E8',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {$i(iconCheck)}
                  </span>
                  Key takeaways
                </h2>
                <ul
                  style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '16px', lineHeight: '1.6' }}
                >
                  <li style={{ display: 'flex', gap: '10px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#0890E8',
                        flexShrink: '0',
                        marginTop: '10px',
                      }}
                    />
                    Acute alcohol withdrawal typically lasts <strong style={{ color: '#10233a' }}>5 to 7 days</strong>;
                    symptoms usually peak between 24 and 72 hours.
                  </li>
                  <li style={{ display: 'flex', gap: '10px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#0890E8',
                        flexShrink: '0',
                        marginTop: '10px',
                      }}
                    />
                    Seizures and delirium tremens are rare but life-threatening. Heavy daily drinkers should not detox
                    alone.
                  </li>
                  <li style={{ display: 'flex', gap: '10px' }}>
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: '#0890E8',
                        flexShrink: '0',
                        marginTop: '10px',
                      }}
                    />
                    Detox is the start of treatment, not the treatment. Plan what happens on day 8 before day 1.
                  </li>
                </ul>
              </div>
              <h2
                id="what-is-detox"
                style={{ fontSize: '30px', lineHeight: '1.2', color: '#10233a', marginTop: '8px' }}
              >
                What alcohol detox actually is
              </h2>
              <p>
                Detoxification is the period in which your body clears alcohol and readjusts to functioning without it.
                Because alcohol is a central nervous system depressant, the brain compensates for chronic use by
                becoming more excitable. Remove the alcohol and that excitability has nowhere to go — which is what
                produces the tremor, racing heart, sweating and anxiety of withdrawal.
              </p>
              <p>
                How long that takes depends on how much you drank, for how long, your age, liver health and whether you
                have withdrawn before. Previous withdrawals matter more than most people expect: each episode can make
                the next one more severe, a pattern clinicians call <em>kindling</em>.
              </p>
              <h2 id="timeline" style={{ fontSize: '30px', lineHeight: '1.2', color: '#10233a', marginTop: '8px' }}>
                The day-by-day timeline
              </h2>
              <p>
                The ranges below reflect what withdrawal management teams in Canada typically observe. Your experience
                may be milder or faster — or, if you drink heavily every day, more intense.
              </p>
              <div style={{ border: '1px solid #e3ecf4', borderRadius: '20px', overflow: 'hidden' }}>
                {$list(timeline).map((t, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={$css(
                        `display:grid;grid-template-columns:${timelineCols ?? ''};gap:12px 20px;align-items:center;padding:18px 22px;border-top:1px solid #edf2f7;background:${t?.bg ?? ''}`,
                      )}
                      data-rc-dyn="1"
                    >
                      <p style={{ margin: '0' }}>
                        <span style={{ display: 'block', font: '600 15px Jost,sans-serif', color: '#10233a' }}>
                          {$i(t?.when)}
                        </span>
                        <span style={{ display: 'block', fontSize: '12.5px', color: '#6b7f95' }}>{$i(t?.sub)}</span>
                      </p>
                      <p style={{ fontSize: '15.5px', lineHeight: '1.55', color: '#3b4d63' }}>{$i(t?.body)}</p>
                      <span
                        data-no-read="true"
                        style={$css(
                          `font:600 11px Jost,sans-serif;letter-spacing:.06em;padding:5px 10px;border-radius:999px;background:${t?.tagBg ?? ''};color:${t?.tagColor ?? ''};white-space:nowrap;justify-self:start`,
                        )}
                      >
                        {$i(t?.tag)}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <aside
                data-no-read="true"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '18px',
                  alignItems: 'center',
                  background: 'linear-gradient(160deg,#0f5fa8,#0890E8)',
                  borderRadius: '20px',
                  padding: '22px 26px',
                  color: '#fff',
                }}
              >
                <span
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,.15)',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {$i(iconPhone)}
                </span>
                <div style={{ flex: '1', minWidth: '220px' }}>
                  <div style={{ font: '600 18px Jost,sans-serif', lineHeight: '1.2' }}>
                    Not sure if you need medical detox?
                  </div>
                  <div style={{ fontSize: '14.5px', opacity: '.9', marginTop: '4px' }}>
                    Our line is free, confidential and answered by real people, 24/7.
                  </div>
                </div>
                <$A
                  className="scp5"
                  href="tel:+18558854747"
                  style={{
                    font: '600 15px Jost,sans-serif',
                    color: '#0f5fa8',
                    background: '#fff',
                    padding: '12px 18px',
                    borderRadius: '10px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Call 1-855-885-4747
                </$A>
              </aside>
              <h2
                id="medical-detox"
                style={{ fontSize: '30px', lineHeight: '1.2', color: '#10233a', marginTop: '8px' }}
              >
                When medical detox is non-negotiable
              </h2>
              <p>
                Alcohol is one of very few substances where withdrawal itself can kill. The risk is not evenly
                distributed — most people have an uncomfortable week — but some warning signs mean home detox is off the
                table:
              </p>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '4px' }}>
                <li style={{ display: 'flex', gap: '12px' }}>
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#fdecec',
                      color: '#D82028',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: '0',
                      marginTop: '5px',
                    }}
                  >
                    {$i(iconAlert)}
                  </span>
                  <span>A previous withdrawal seizure or episode of delirium tremens</span>
                </li>
                <li style={{ display: 'flex', gap: '12px' }}>
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#fdecec',
                      color: '#D82028',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: '0',
                      marginTop: '5px',
                    }}
                  >
                    {$i(iconAlert)}
                  </span>
                  <span>Drinking daily for months or years, especially first thing in the morning</span>
                </li>
                <li style={{ display: 'flex', gap: '12px' }}>
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#fdecec',
                      color: '#D82028',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: '0',
                      marginTop: '5px',
                    }}
                  >
                    {$i(iconAlert)}
                  </span>
                  <span>Heart disease, liver disease, epilepsy, pregnancy or age over 60</span>
                </li>
                <li style={{ display: 'flex', gap: '12px' }}>
                  <span
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '50%',
                      background: '#fdecec',
                      color: '#D82028',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: '0',
                      marginTop: '5px',
                    }}
                  >
                    {$i(iconAlert)}
                  </span>
                  <span>Also using benzodiazepines, opioids or other sedatives</span>
                </li>
              </ul>
              <p>
                In a supervised setting, staff score symptoms on a fixed schedule (most Canadian units use the CIWA-Ar
                scale) and give medication — usually a benzodiazepine taper — before symptoms escalate. Thiamine is
                given routinely to prevent Wernicke's encephalopathy. None of this is available at home.
              </p>
              <blockquote
                style={{
                  margin: '0',
                  borderLeft: '0',
                  padding: '28px 32px',
                  background: '#f7fafd',
                  borderRadius: '20px',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '18px',
                }}
                data-cols="auto 1fr"
              >
                <span style={{ font: '700 64px/0.8 Jost,sans-serif', color: '#0890E8', opacity: '.35' }}>“</span>
                <div>
                  <p style={{ font: '500 21px/1.45 Jost,sans-serif', color: '#10233a' }}>
                    The people who get into trouble are almost never the ones who think they might. Assessment first,
                    detox second.
                  </p>
                  <footer style={{ marginTop: '12px', fontSize: '14px', color: '#6b7f95' }}>
                    — Dr. Sarah Mitchell
                  </footer>
                </div>
              </blockquote>
              <h2 id="after-detox" style={{ fontSize: '30px', lineHeight: '1.2', color: '#10233a', marginTop: '8px' }}>
                What happens after day 7
              </h2>
              <p>
                Physical withdrawal ends. Psychological withdrawal does not. Sleep disruption, low mood, irritability
                and cravings can persist for weeks — a phase sometimes called post-acute withdrawal. This is the window
                in which most relapses happen, and it is precisely why detox on its own has poor long-term outcomes.
              </p>
              <p>
                A good detox program will already have arranged your next step before you leave: residential treatment,
                an intensive outpatient program, counselling, or at minimum a peer-support meeting the same week. If a
                centre discharges you with a pamphlet and a handshake, that is a red flag.
              </p>
              <h2 id="choosing" style={{ fontSize: '30px', lineHeight: '1.2', color: '#10233a', marginTop: '8px' }}>
                Choosing a detox centre in Canada
              </h2>
              <p>
                Every province funds withdrawal management beds, though wait times range from same-day to several weeks.
                Private detox is faster and typically includes a smoother hand-off into treatment; expect to pay between
                $2,500 and $8,000 for a 5–7 day medically supervised stay. Questions worth asking any centre:
              </p>
              <ol style={{ margin: '0', paddingLeft: '22px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <li>Is a physician or nurse practitioner on site or on call 24 hours?</li>
                <li>How are withdrawal symptoms monitored and how often?</li>
                <li>What happens on discharge — is treatment already booked?</li>
                <li>Can you accommodate co-occurring mental health conditions?</li>
              </ol>
              <p>
                Browse{' '}
                <$A href="https://addictionrehabcenters.ca/detox-centres-in-canada/">detox centres across Canada</$A>,
                or call us and we will narrow it down with you.
              </p>
              <h2 id="faq" style={{ fontSize: '30px', lineHeight: '1.2', color: '#10233a', marginTop: '8px' }}>
                Frequently asked questions
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {$list(faqs).map((f, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={$css(
                        `border:1px solid ${f?.border ?? ''};border-radius:16px;background:#fff;transition:border-color .18s`,
                      )}
                    >
                      <button
                        data-no-read="true"
                        onClick={f?.toggle}
                        aria-expanded={f?.open}
                        style={{
                          appearance: 'none',
                          border: '0',
                          background: 'transparent',
                          cursor: 'pointer',
                          width: '100%',
                          textAlign: 'left',
                          padding: '18px 22px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '16px',
                          font: '600 17px Jost,sans-serif',
                          color: '#10233a',
                          minHeight: '44px',
                        }}
                      >
                        {$i(f?.q)}
                        <span
                          style={$css(
                            `width:28px;height:28px;border-radius:8px;background:#eaf5fd;color:#0890E8;display:grid;place-items:center;flex-shrink:0;transform:${f?.rot ?? ''};transition:transform .2s`,
                          )}
                        >
                          {$i(iconPlus)}
                        </span>
                      </button>
                      {f?.open ? (
                        <>
                          <p
                            data-no-read="true"
                            style={{
                              padding: '0 22px 20px',
                              fontSize: '16px',
                              lineHeight: '1.65',
                              color: '#3b4d63',
                              animation: 'fadeUp .2s ease-out',
                            }}
                          >
                            {$i(f?.a)}
                          </p>
                        </>
                      ) : null}
                    </div>
                  </Fragment>
                ))}
              </div>
              <div
                data-no-read="true"
                style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', paddingTop: '8px' }}
              >
                <span style={{ fontSize: '13.5px', color: '#6b7f95', marginRight: '4px' }}>Tags</span>
                {$list(tags).map((t, $index) => (
                  <Fragment key={$index}>
                    <$A
                      className="scp2"
                      href="/blog"
                      style={{
                        font: '500 13px Figtree,sans-serif',
                        color: '#1f3550',
                        background: '#f7fafd',
                        border: '1px solid #e3ecf4',
                        padding: '7px 12px',
                        borderRadius: '999px',
                      }}
                    >
                      {$i(t)}
                    </$A>
                  </Fragment>
                ))}
              </div>
              <div
                id="author"
                data-no-read="true"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '20px',
                  alignItems: 'start',
                  background: '#f7fafd',
                  border: '1px solid #e3ecf4',
                  borderRadius: '22px',
                  padding: '26px',
                }}
                data-cols="auto 1fr"
              >
                <span
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: '#10233a',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    font: '600 20px Jost,sans-serif',
                  }}
                >
                  SM
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '19px' }}>Dr. Sarah Mitchell, MD, CCFP(AM)</h3>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#2fb46b',
                        font: '600 12px Figtree,sans-serif',
                      }}
                    >
                      {$i(iconShield)}
                      Verified author
                    </span>
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#3b4d63' }}>
                    Addiction medicine physician with 14 years in withdrawal management and community practice in
                    Ontario. Sarah writes our clinical guides and reviews every medical claim on this site.
                  </p>
                  <div style={{ display: 'flex', gap: '16px', font: '600 14px Jost,sans-serif' }}>
                    <$A href="#">All articles</$A>
                    <$A href="#">Editorial policy</$A>
                  </div>
                </div>
              </div>
              <details
                data-no-read="true"
                style={{
                  border: '1px solid #e3ecf4',
                  borderRadius: '16px',
                  padding: '0 22px',
                  fontSize: '14.5px',
                  color: '#516378',
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    padding: '16px 0',
                    font: '600 15px Jost,sans-serif',
                    color: '#10233a',
                    listStyle: 'none',
                  }}
                >
                  {'Sources & references'}
                </summary>
                <ol
                  style={{
                    margin: '0 0 18px',
                    paddingLeft: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    lineHeight: '1.5',
                  }}
                >
                  <li>Canadian Centre on Substance Use and Addiction — alcohol withdrawal management guidance.</li>
                  <li>
                    BC Centre on Substance Use — Provincial Guideline for the Clinical Management of High-Risk Drinking
                    and Alcohol Use Disorder (2019).
                  </li>
                  <li>
                    Sullivan JT et al. Assessment of alcohol withdrawal: the revised CIWA-Ar.{' '}
                    <em>British Journal of Addiction</em>, 1989.
                  </li>
                </ol>
              </details>
              <p data-no-read="true" style={{ fontSize: '13px', lineHeight: '1.55', color: '#8a9bb0' }}>
                This article is for information only and is not a substitute for medical advice. If you or someone else
                is having a seizure, severe confusion or hallucinations during withdrawal, call 911.
              </p>
            </article>
            <aside
              style={$css(
                `position:${sideStyle ?? ''};top:124px;display:grid;grid-template-columns:${sideCols ?? ''};gap:20px;align-items:start`,
              )}
              data-rc-dyn="1"
            >
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  boxShadow: '0 30px 60px -40px rgba(16,35,58,.35)',
                }}
              >
                <$A
                  href="/centre"
                  style={{
                    position: 'relative',
                    display: 'block',
                    aspectRatio: '16/10',
                    background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                  }}
                >
                  {' '}
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '28px',
                      padding: '0 11px 0 8px',
                      borderRadius: '999px',
                      background: 'rgba(16,35,58,.62)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255,255,255,.18)',
                      color: '#fff',
                      font: '600 12.5px Figtree,sans-serif',
                      letterSpacing: '.01em',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 6px 16px -8px rgba(0,0,0,.5)',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" style={{ flexShrink: '0' }}>
                      <path
                        d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9z"
                        style={{ fill: '#F5B83D' }}
                      />
                    </svg>
                    Featured
                  </span>{' '}
                  <span
                    style={{
                      position: 'absolute',
                      left: '12px',
                      bottom: '10px',
                      font: '500 10.5px ui-monospace,Menlo,monospace',
                      color: '#516378',
                      background: 'rgba(255,255,255,.85)',
                      padding: '3px 6px',
                      borderRadius: '5px',
                    }}
                  >
                    {$i(main?.photo)}
                  </span>
                </$A>
                <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                  <span
                    style={{
                      font: '600 11.5px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#0890E8',
                    }}
                  >
                    {$i(main?.category)}
                  </span>
                  <h3 style={{ fontSize: '19px', lineHeight: '1.25' }}>
                    <$A className="scp0" href="/centre" style={{ color: '#10233a' }}>
                      {$i(main?.name)}
                    </$A>
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                    <span
                      style={{
                        font: '700 12px Figtree,sans-serif',
                        background: 'conic-gradient(#4285F4 0 25%,#34A853 25% 50%,#FBBC05 50% 75%,#EA4335 75%)',
                        color: 'transparent',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                      }}
                    >
                      G
                    </span>
                    <span style={{ color: '#F5A623', fontSize: '12px', letterSpacing: '1px' }}>★★★★★</span>
                    <span style={{ font: '600 13px Jost,sans-serif', color: '#10233a' }}>{$i(main?.rating)}</span>
                    <span style={{ fontSize: '12.5px', color: '#6b7f95' }}>· {$i(main?.reviews)} reviews</span>
                  </div>
                  <p
                    style={{ fontSize: '13.5px', color: '#6b7f95', display: 'flex', gap: '7px', alignItems: 'center' }}
                  >
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        border: '1.5px solid #6b7f95',
                        borderRadius: '50% 50% 50% 0',
                        transform: 'rotate(-45deg)',
                        flexShrink: '0',
                      }}
                    />
                    {$i(main?.address)}
                  </p>
                  <$A
                    className="scp1"
                    href={main?.tel}
                    style={{
                      marginTop: '6px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      font: '600 15px Jost,sans-serif',
                      color: '#fff',
                      background: '#0890E8',
                      height: '44px',
                      borderRadius: '10px',
                    }}
                  >
                    {$i(iconPhoneSm)}
                    Call {$i(main?.phone)}
                  </$A>
                </div>
              </div>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '22px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <h3 style={{ fontSize: '16px' }}>Related reading</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {$list(related).map((r, $index) => (
                    <Fragment key={$index}>
                      <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                        <span
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '10px',
                            flexShrink: '0',
                            background: 'repeating-linear-gradient(135deg,#dfeaf3 0 8px,#eaf2f8 8px 16px)',
                          }}
                        />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <$A
                            className="scp0"
                            href="/blog/how-long-does-alcohol-detox-take"
                            style={{ font: '500 14px/1.4 Figtree,sans-serif', color: '#1f3550' }}
                          >
                            {$i(r?.title)}
                          </$A>
                          <span style={{ fontSize: '12.5px', color: '#6b7f95' }}>{$i(r?.read)} min read</span>
                        </div>
                      </li>
                    </Fragment>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  background: '#10233a',
                  borderRadius: '22px',
                  padding: '22px',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <span
                  style={{
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#7cc4f5',
                  }}
                >
                  Own a centre?
                </span>
                <h3 style={{ fontSize: '18px', color: '#fff', lineHeight: '1.25' }}>
                  Be the featured centre readers see on this article
                </h3>
                <$A className="scpe" href="/promote" style={{ font: '600 14px Jost,sans-serif', color: '#7cc4f5' }}>
                  Promote your centre →
                </$A>
              </div>
            </aside>
          </div>
        </section>
        <section data-screen-label="Main Featured Business" style={{ background: '#10233a', color: '#fff' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '80px 32px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '56px',
              alignItems: 'center',
            }}
            data-cols="1fr 1fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#7cc4f5',
                }}
              >
                Featured centre for this topic
              </span>
              <h2 style={{ fontSize: '40px', lineHeight: '1.1', color: '#fff' }} data-rc-lg="1">
                {$i(main?.name)}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '8px 12px',
                  }}
                >
                  <span
                    style={{
                      font: '700 14px Figtree,sans-serif',
                      background: 'conic-gradient(#4285F4 0 25%,#34A853 25% 50%,#FBBC05 50% 75%,#EA4335 75%)',
                      color: 'transparent',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                    }}
                  >
                    G
                  </span>
                  <span style={{ color: '#F5A623', fontSize: '14px', letterSpacing: '1px' }}>★★★★★</span>
                  <span style={{ font: '600 15px Jost,sans-serif', color: '#10233a' }}>{$i(main?.rating)}</span>
                </span>
                <span style={{ fontSize: '14.5px', color: '#b7c7d8' }}>
                  {$i(main?.reviews)} Google reviews · {$i(main?.address)}
                </span>
              </div>
              <p style={{ fontSize: '17px', lineHeight: '1.7', color: '#b7c7d8' }}>{$i(main?.body)}</p>
              <ul
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '10px 20px',
                  fontSize: '15px',
                  color: '#fff',
                }}
                data-cols="1fr 1fr"
              >
                {$list(main?.perks).map((p, $index) => (
                  <Fragment key={$index}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
                      <span style={{ color: '#2fb46b' }}>{$i(iconCheckSm)}</span>
                      {$i(p)}
                    </li>
                  </Fragment>
                ))}
              </ul>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px', flexWrap: 'wrap' }}>
                <$A
                  className="scpr"
                  href={main?.tel}
                  style={{
                    font: '600 16px Jost,sans-serif',
                    color: '#10233a',
                    background: '#fff',
                    padding: '14px 22px',
                    borderRadius: '12px',
                  }}
                >
                  Call for a Free Consultation
                </$A>
                <$A className="scpe" href="/centre" style={{ font: '600 15px Jost,sans-serif', color: '#7cc4f5' }}>
                  View full listing →
                </$A>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  aspectRatio: '4/3',
                  borderRadius: '24px',
                  background: 'repeating-linear-gradient(135deg,#1c3352 0 14px,#223c5e 14px 28px)',
                  display: 'grid',
                  placeItems: 'center',
                  border: '1px solid rgba(255,255,255,.08)',
                }}
              >
                <span
                  style={{
                    font: '500 12px ui-monospace,Menlo,monospace',
                    color: '#b7c7d8',
                    background: 'rgba(16,35,58,.8)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                  }}
                >
                  {$i(main?.photo)}
                </span>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: '-24px',
                  bottom: '28px',
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 20px 40px -24px rgba(0,0,0,.6)',
                }}
              >
                <span
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#eaf5fd',
                    color: '#0890E8',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {$i(iconClock)}
                </span>
                <div>
                  <div style={{ font: '600 14px Jost,sans-serif', color: '#10233a' }}>Admissions in 24–48h</div>
                  <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>Medical detox on site</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          data-screen-label="Featured Businesses Slider"
          style={{ background: '#fff', borderTop: '1px solid #e9eff5', overflow: 'hidden' }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 32px 64px' }} data-rc-wrap="1">
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: '24px',
                marginBottom: '28px',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <span
                  style={{
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#0890E8',
                  }}
                >
                  Hand-picked for readers of this article
                </span>
                <h2 style={{ fontSize: '36px', marginTop: '10px' }} data-rc-lg="1">
                  {$i(sliderTitle)}
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    background: '#f7fafd',
                    border: '1px solid #e3ecf4',
                    borderRadius: '12px',
                    padding: '4px',
                  }}
                >
                  {$list(kinds).map((k, $index) => (
                    <Fragment key={$index}>
                      <button
                        onClick={k?.pick}
                        style={$css(
                          `appearance:none;border:0;cursor:pointer;height:38px;padding:0 16px;border-radius:9px;background:${k?.bg ?? ''};color:${k?.color ?? ''};font:600 14px Jost,sans-serif;box-shadow:${k?.shadow ?? ''};transition:all .18s`,
                        )}
                      >
                        {$i(k?.label)}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <span style={{ fontSize: '14px', color: '#6b7f95', whiteSpace: 'nowrap' }}>{$i(slidePos)}</span>
                <button
                  className="scp2"
                  onClick={slidePrev}
                  aria-label="Previous"
                  style={{
                    appearance: 'none',
                    cursor: 'pointer',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    border: '1px solid #dbe6f0',
                    background: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#10233a',
                    transition: 'border-color .18s',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderLeft: '1.5px solid currentColor',
                      borderBottom: '1.5px solid currentColor',
                      transform: 'rotate(45deg)',
                      marginLeft: '3px',
                    }}
                  />
                </button>
                <button
                  className="scp2"
                  onClick={slideNext}
                  aria-label="Next"
                  style={{
                    appearance: 'none',
                    cursor: 'pointer',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    border: '1px solid #dbe6f0',
                    background: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#10233a',
                    transition: 'border-color .18s',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRight: '1.5px solid currentColor',
                      borderTop: '1.5px solid currentColor',
                      transform: 'rotate(45deg)',
                      marginRight: '3px',
                    }}
                  />
                </button>
              </div>
            </div>
            <div
              ref={sliderRef}
              onScroll={onSlideScroll}
              style={{
                display: 'grid',
                gridAutoFlow: 'column',
                gridAutoColumns: 'calc((100% - 48px)/3)',
                gap: '24px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                paddingBottom: '8px',
                margin: '0 -32px',
                paddingLeft: '32px',
                paddingRight: '32px',
              }}
            >
              {$list(items).map((c, $index) => (
                <Fragment key={$index}>
                  <article
                    className="scpn"
                    style={{
                      scrollSnapAlign: 'start',
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '22px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform .2s,box-shadow .2s',
                    }}
                  >
                    <$A
                      href={c?.href}
                      style={{
                        position: 'relative',
                        display: 'block',
                        aspectRatio: '16/10',
                        background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          inset: '0',
                          display: 'grid',
                          placeItems: 'start center',
                          paddingTop: '48px',
                          font: '500 11px ui-monospace,Menlo,monospace',
                          color: '#516378',
                        }}
                      >
                        {$i(c?.photo)}
                      </span>
                      <span style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '6px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            height: '28px',
                            padding: '0 11px 0 8px',
                            borderRadius: '999px',
                            background: 'rgba(16,35,58,.62)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,.18)',
                            color: '#fff',
                            font: '600 12.5px Figtree,sans-serif',
                            letterSpacing: '.01em',
                            whiteSpace: 'nowrap',
                            boxShadow: '0 6px 16px -8px rgba(0,0,0,.5)',
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" style={{ flexShrink: '0' }}>
                            <path
                              d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9z"
                              style={{ fill: '#F5B83D' }}
                            />
                          </svg>
                          Featured
                        </span>
                        {c?.verified ? (
                          <>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                height: '28px',
                                padding: '0 11px 0 7px',
                                borderRadius: '999px',
                                background: 'rgba(255,255,255,.96)',
                                color: '#10233a',
                                font: '600 12.5px Figtree,sans-serif',
                                letterSpacing: '.01em',
                                whiteSpace: 'nowrap',
                                boxShadow: '0 6px 16px -8px rgba(0,0,0,.45)',
                              }}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" style={{ flexShrink: '0' }}>
                                <path
                                  d="M12 1.8l2.4 1.8 3-.2.9 2.9 2.5 1.7-.9 2.9.9 2.9-2.5 1.7-.9 2.9-3-.2L12 20.2l-2.4-1.8-3 .2-.9-2.9-2.5-1.7.9-2.9-.9-2.9 2.5-1.7.9-2.9 3 .2z"
                                  style={{ fill: '#0890E8' }}
                                />
                                <path
                                  d="M8.2 11.3l2.6 2.6 5-5"
                                  style={{
                                    fill: 'none',
                                    stroke: '#fff',
                                    strokeWidth: '2.2',
                                    strokeLinecap: 'round',
                                    strokeLinejoin: 'round',
                                  }}
                                />
                              </svg>
                              Verified
                            </span>
                          </>
                        ) : null}
                      </span>
                      <span
                        style={{
                          position: 'absolute',
                          right: '14px',
                          bottom: '14px',
                          background: '#fff',
                          borderRadius: '10px',
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          boxShadow: '0 8px 20px -10px rgba(16,35,58,.4)',
                        }}
                      >
                        <span
                          style={{
                            font: '700 12px Figtree,sans-serif',
                            background: 'conic-gradient(#4285F4 0 25%,#34A853 25% 50%,#FBBC05 50% 75%,#EA4335 75%)',
                            color: 'transparent',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                          }}
                        >
                          G
                        </span>
                        <span style={{ color: '#F5A623', fontSize: '12px', letterSpacing: '1px' }}>★★★★★</span>
                        <span style={{ font: '600 13px Jost,sans-serif', color: '#10233a' }}>{$i(c?.rating)}</span>
                      </span>
                    </$A>
                    <div
                      style={{
                        padding: '20px 22px 22px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '9px',
                        flex: '1',
                      }}
                    >
                      <span
                        style={{
                          font: '600 12px Figtree,sans-serif',
                          letterSpacing: '.1em',
                          textTransform: 'uppercase',
                          color: '#0890E8',
                        }}
                      >
                        {$i(c?.category)}
                      </span>
                      <h3 style={{ fontSize: '20px', lineHeight: '1.25' }}>
                        <$A className="scp0" href={c?.href} style={{ color: '#10233a' }}>
                          {$i(c?.name)}
                        </$A>
                      </h3>
                      <p
                        style={{
                          fontSize: '13.5px',
                          color: '#6b7f95',
                          display: 'flex',
                          gap: '7px',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            width: '7px',
                            height: '7px',
                            border: '1.5px solid #6b7f95',
                            borderRadius: '50% 50% 50% 0',
                            transform: 'rotate(-45deg)',
                            flexShrink: '0',
                          }}
                        />
                        {$i(c?.address)}
                      </p>
                      <p style={{ fontSize: '14.5px', lineHeight: '1.55', color: '#3b4d63' }}>{$i(c?.excerpt)}</p>
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '14px',
                          borderTop: '1px solid #edf2f7',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '13.5px', color: '#6b7f95' }}>{$i(c?.reviews)} reviews</span>
                        <$A href={c?.href} style={{ font: '600 14px Jost,sans-serif' }}>
                          {$i(c?.cta)} →
                        </$A>
                      </div>
                    </div>
                  </article>
                </Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
              {$list(slideDots).map((d, $index) => (
                <Fragment key={$index}>
                  <button
                    onClick={d?.go}
                    aria-label="Go to slide"
                    style={$css(
                      `appearance:none;border:0;cursor:pointer;height:8px;width:${d?.w ?? ''};border-radius:999px;background:${d?.bg ?? ''};transition:width .2s,background .2s;padding:0`,
                    )}
                  />
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section data-screen-label="Related Articles" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px' }} data-rc-wrap="1">
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: '24px',
                marginBottom: '28px',
              }}
            >
              <div>
                <span
                  style={{
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#0890E8',
                  }}
                >
                  Keep reading
                </span>
                <h2 style={{ fontSize: '34px', marginTop: '10px' }} data-rc-lg="1">
                  Related articles
                </h2>
              </div>
              <$A
                href="/blog"
                style={{ font: '600 15px Jost,sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                All articles{' '}
                <span
                  style={{
                    display: 'inline-block',
                    width: '7px',
                    height: '7px',
                    borderRight: '1.5px solid currentColor',
                    borderTop: '1.5px solid currentColor',
                    transform: 'rotate(45deg)',
                  }}
                />
              </$A>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}
              data-cols="repeat(3,1fr)"
            >
              {$list(relatedCards).map((p, $index) => (
                <Fragment key={$index}>
                  <article
                    className="scpn"
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '22px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform .2s,box-shadow .2s',
                    }}
                  >
                    <$A
                      href="/blog/how-long-does-alcohol-detox-take"
                      aria-label={p?.title}
                      style={{
                        position: 'relative',
                        display: 'block',
                        aspectRatio: '16/9',
                        background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '14px',
                          left: '14px',
                          background: '#fff',
                          color: '#1f3550',
                          font: '600 11px Jost,sans-serif',
                          letterSpacing: '.06em',
                          padding: '5px 10px',
                          borderRadius: '999px',
                          textTransform: 'uppercase',
                        }}
                      >
                        {$i(p?.category)}
                      </span>
                    </$A>
                    <div
                      style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '9px', flex: '1' }}
                    >
                      <h3 style={{ fontSize: '19px', lineHeight: '1.28' }}>
                        <$A className="scp0" href="/blog/how-long-does-alcohol-detox-take" style={{ color: '#10233a' }}>
                          {$i(p?.title)}
                        </$A>
                      </h3>
                      <p style={{ fontSize: '14.5px', lineHeight: '1.55', color: '#516378' }}>{$i(p?.excerpt)}</p>
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '12px',
                          fontSize: '13px',
                          color: '#6b7f95',
                          display: 'flex',
                          gap: '8px',
                        }}
                      >
                        <span>{$i(p?.date)}</span>
                        <span style={{ opacity: '.5' }}>·</span>
                        <span>{$i(p?.read)} min read</span>
                      </div>
                    </div>
                  </article>
                </Fragment>
              ))}
            </div>
            <nav
              aria-label="Adjacent articles"
              style={{ marginTop: '36px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}
              data-cols="1fr 1fr"
            >
              <$A
                className="scph"
                href="/blog/how-long-does-alcohol-detox-take"
                style={{
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '18px',
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  color: '#10233a',
                }}
              >
                <span
                  style={{
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: '#6b7f95',
                  }}
                >
                  ← Previous
                </span>
                <span style={{ font: '600 17px Jost,sans-serif' }}>
                  Am I Drinking Too Much? 10 Honest Questions to Ask Yourself
                </span>
              </$A>
              <$A
                className="scph"
                href="/blog/how-long-does-alcohol-detox-take"
                style={{
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '18px',
                  padding: '20px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  color: '#10233a',
                  textAlign: 'right',
                }}
              >
                <span
                  style={{
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: '#6b7f95',
                  }}
                >
                  Next →
                </span>
                <span style={{ font: '600 17px Jost,sans-serif' }}>
                  How to Stage an Intervention Without Losing Your Loved One
                </span>
              </$A>
            </nav>
          </div>
        </section>
        <footer data-screen-label="Footer" style={{ background: '#10233a', color: '#b7c7d8' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '72px 32px 32px',
              display: 'grid',
              gridTemplateColumns: '1.3fr 1fr 1fr 1fr',
              gap: '48px',
            }}
            data-cols="1.3fr 1fr 1fr 1fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <$A
                href="/"
                style={{
                  display: 'inline-block',
                  background: '#fff',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  alignSelf: 'flex-start',
                }}
              >
                <img
                  src="/assets/logo.png"
                  alt="Addiction Rehab Centres Canada"
                  style={{ height: '44px', display: 'block' }}
                />
              </$A>
              <h4 style={{ fontSize: '18px', color: '#fff' }}>We Are Available 24/7</h4>
              <p style={{ fontSize: '15px' }}>
                Call Us:{' '}
                <$A href="tel:+1-855-885-4747" style={{ color: '#7cc4f5', fontWeight: '600' }}>
                  +1-855-885-4747
                </$A>
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <$A
                  className="scpd"
                  href="https://www.facebook.com/Addiction-Rehab-Centres-Canada-772760289732512/"
                  aria-label="Facebook"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,.14)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    font: '600 15px Jost,sans-serif',
                  }}
                >
                  f
                </$A>
                <$A
                  className="scpd"
                  href={
                    'https://www.google.com/search?ludocid=17732523544542585825&q=Addiction%20Rehab%20Centres%20Canada'
                  }
                  aria-label="Google"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,.14)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#fff',
                    font: '600 15px Jost,sans-serif',
                  }}
                >
                  G
                </$A>
              </div>
            </div>
            {$list(footerCols).map((col, $index) => (
              <Fragment key={$index}>
                <div>
                  <h4
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: '#7cc4f5',
                      marginBottom: '18px',
                    }}
                  >
                    {$i(col?.title)}
                  </h4>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    {$list(col?.links).map((l, $index) => (
                      <Fragment key={$index}>
                        <li>
                          <$A
                            className="scpe"
                            href={l?.href}
                            style={{ fontSize: '14.5px', color: '#b7c7d8', lineHeight: '1.4' }}
                          >
                            {$i(l?.label)}
                          </$A>
                        </li>
                      </Fragment>
                    ))}
                  </ul>
                </div>
              </Fragment>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.1)' }}>
            <div
              style={{
                maxWidth: '1280px',
                margin: '0 auto',
                padding: '22px 32px',
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '16px',
                fontSize: '13.5px',
              }}
              data-rc-wrap="1"
            >
              <span>© 2025 Addiction Rehab Centres Canada</span>
              <div style={{ display: 'flex', gap: '22px', flexWrap: 'wrap' }}>
                <$A
                  className="scpe"
                  href="https://addictionrehabcenters.ca/privacy-policy/"
                  style={{ color: '#b7c7d8' }}
                >
                  Privacy Policy
                </$A>
                <$A className="scpe" href="https://addictionrehabcenters.ca/terms-of-use/" style={{ color: '#b7c7d8' }}>
                  Terms of Use
                </$A>
                <$A className="scpe" href="/promote" style={{ color: '#b7c7d8' }}>
                  Promote Your Centre
                </$A>
                <$A className="scpe" href="https://addictionrehabcenters.ca/llms.txt" style={{ color: '#b7c7d8' }}>
                  Hey Ai, Learn About Us
                </$A>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export const ownCss =
  '\nhtml,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;scroll-behavior:smooth}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\narticle h2[id]{scroll-margin-top:130px}\n@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}html{scroll-behavior:auto}}\n';
export const css = [ownCss, SiteHeader_css].filter(Boolean).join('\n');
export const defaults = { featuredKind: 'centres', showToc: true };
const View = createDC('BlogPost', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} responsive {...props} />;
}
