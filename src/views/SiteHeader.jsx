'use client';
// Generated from SiteHeader.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = {
    menu: this.props.previewOpen || null,
    shown: this.props.previewOpen || 'provinces',
    tab: 0,
    hovNav: null,
    mob: false,
    mobSec: null,
    w: 1280,
    hov: null,
    pos: {},
  };
  rootRef = React.createRef();
  navRef = React.createRef();
  contentRef = React.createRef();
  tabRef = React.createRef();
  btn = {};
  btnRefs = {};
  componentDidMount() {
    const r = this.rootRef.current;
    this._r = () => {
      const w = r ? r.clientWidth : document.documentElement.clientWidth;
      if (w !== this.state.w) this.setState({ w });
      this.measure();
    };
    this._k = (e) => {
      if (e.key === 'Escape' && !this.props.previewOpen) this.setState({ menu: null, mob: false });
    };
    this._r();
    if (window.ResizeObserver && r) {
      this._ro = new ResizeObserver(this._r);
      this._ro.observe(r);
    } else window.addEventListener('resize', this._r);
    window.addEventListener('keydown', this._k);
    setTimeout(() => this.measure(), 80);
    if (document.fonts) document.fonts.ready.then(() => this.measure());
  }
  componentWillUnmount() {
    if (this._ro) this._ro.disconnect();
    window.removeEventListener('resize', this._r);
    window.removeEventListener('keydown', this._k);
    clearTimeout(this._open);
    clearTimeout(this._close);
  }
  componentDidUpdate(pp, ps) {
    if (ps.w >= 1100 !== this.state.w >= 1100) setTimeout(() => this.measure(), 0);
    const ez = 'cubic-bezier(.23,1,.32,1)';
    const a = ps.menu,
      b = this.state.menu,
      el = this.contentRef.current;
    if (a && b && a !== b && el && el.animate) {
      const K = Object.keys(this.menus || {}),
        dir = K.indexOf(b) > K.indexOf(a) ? 1 : -1;
      el.animate(
        [
          { opacity: 0, transform: `translateX(${dir * 16}px)` },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 260, easing: ez },
      );
    } else if (ps.tab !== this.state.tab && a === b && this.tabRef.current && this.tabRef.current.animate) {
      this.tabRef.current.animate(
        [
          { opacity: 0, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'none' },
        ],
        { duration: 220, easing: ez },
      );
    }
  }
  measure() {
    const r = this.rootRef.current,
      nv = this.navRef.current;
    if (!r || !nv) return;
    const rr = r.getBoundingClientRect(),
      nr = nv.getBoundingClientRect(),
      pos = {};
    Object.keys(this.btn).forEach((k) => {
      const b = this.btn[k];
      if (!b || !b.isConnected) return;
      const br = b.getBoundingClientRect();
      pos[k] = { x: br.left - nr.left, w: br.width, cx: br.left - rr.left + br.width / 2 };
    });
    if (JSON.stringify(pos) !== JSON.stringify(this.state.pos)) this.setState({ pos });
  }
  bref(k) {
    return (
      this.btnRefs[k] ||
      (this.btnRefs[k] = (el) => {
        this.btn[k] = el;
      })
    );
  }
  openMenu(k) {
    clearTimeout(this._close);
    clearTimeout(this._open);
    if (this.state.menu !== k) this.setState({ menu: k, shown: k, tab: 0 });
  }

  icon(spec, size, sw) {
    const R = React.createElement,
      s = size || 20;
    const paths = spec.d || spec,
      fi = spec.f === undefined ? 0 : spec.f;
    const el = (d, i, extra) =>
      typeof d === 'string' ? R('path', { key: i, d, ...extra }) : R(d[0], { key: i, ...d[1], ...extra });
    const kids = [];
    if (fi !== null && paths[fi])
      kids.push(el(paths[fi], 'f', { fill: 'currentColor', fillOpacity: 0.22, stroke: 'none' }));
    paths.forEach((d, i) => kids.push(el(d, i)));
    return R(
      'svg',
      {
        width: s,
        height: s,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: sw || 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      },
      ...kids,
    );
  }

  renderVals() {
    const B = 'https://addictionrehabcenters.ca/';
    const { menu, shown, tab, hovNav, mob, mobSec, w, pos, hov } = this.state;
    const active = this.props.active,
      layout = this.props.layout || 'columns',
      pinned = !!this.props.previewOpen;
    const N = (d) => ({ d, f: null });
    const P = {
      pin: ['M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z', ['circle', { cx: 12, cy: 10, r: 2.5 }]],
      pill: ['M10.5 3.5l10 10a4.95 4.95 0 0 1-7 7l-10-10a4.95 4.95 0 0 1 7-7z', 'M8.5 8.5l7 7'],
      zap: ['M13 2L4 14h7l-1 8 9-12h-7z'],
      moon: ['M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z'],
      eye: ['M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z', ['circle', { cx: 12, cy: 12, r: 3 }]],
      leaf: ['M20 4C9 4 4 10 4 20c10 0 16-5 16-16z', 'M4 20L14 10'],
      glass: ['M7 3h10l-1 9a4 4 0 0 1-8 0L7 3z', 'M12 16v5', 'M9 21h6'],
      question: [
        ['circle', { cx: 12, cy: 12, r: 9 }],
        'M9.5 9.2a2.5 2.5 0 1 1 3.4 2.3c-.6.3-.9.8-.9 1.5v.5',
        'M12 16.8h.01',
      ],
      drop: ['M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z'],
      med: [['rect', { x: 3.5, y: 3.5, width: 17, height: 17, rx: 5 }], 'M12 8v8', 'M8 12h8'],
      home: { d: ['M3 11l9-7 9 7', 'M5 9.5V20h14V9.5', 'M10 20v-5h4v5'], f: 1 },
      bed: {
        d: ['M3 18V6', 'M3 14h18v4H3z', 'M21 14v-1.5A3.5 3.5 0 0 0 17.5 9H11v5', ['circle', { cx: 7, cy: 11, r: 1.8 }]],
        f: 1,
      },
      group: [
        ['circle', { cx: 9, cy: 8, r: 3 }],
        'M3 20a6 6 0 0 1 12 0',
        'M16 5.2a3 3 0 0 1 0 5.6',
        'M21 20a6 6 0 0 0-3.5-5.4',
      ],
      steps: { d: ['M3 20h4v-4h4v-4h4V8h4V4h2v16z'], f: 0 },
      car: {
        d: [
          'M5 13l1.8-4.5A2 2 0 0 1 8.7 7h6.6a2 2 0 0 1 1.9 1.5L19 13',
          ['rect', { x: 3, y: 13, width: 18, height: 5, rx: 2 }],
          'M6 18v2',
          'M18 18v2',
        ],
        f: 1,
      },
      hands: { d: ['M4 13v5l5 3h6l5-3v-5', 'M4 13l4-4 3 3', 'M20 13l-4-4-3 3', 'M12 12v4'], f: 0 },
      chat: ['M4 5h16v11H9l-5 4z', 'M8 10h8', 'M8 13h5'],
      building: [
        'M4 21V6l8-3v18z',
        'M12 9h8v12',
        'M3 21h18',
        'M8 8h.01',
        'M8 12h.01',
        'M8 16h.01',
        'M16 13h.01',
        'M16 17h.01',
      ],
      mountain: ['M2 20l7-12 4 6 2.5-3.5L22 20z'],
      wave: N(['M2 9c2.5-2 4.5-2 7 0s4.5 2 7 0 4-2 6 0', 'M2 15c2.5-2 4.5-2 7 0s4.5 2 7 0 4-2 6 0']),
      snow: N(['M12 2v20', 'M3.3 7l17.4 10', 'M3.3 17L20.7 7', 'M9.5 3.5L12 6l2.5-2.5', 'M9.5 20.5L12 18l2.5 2.5']),
      person: [['circle', { cx: 12, cy: 8, r: 4 }], 'M4 21a8 8 0 0 1 16 0'],
      idcard: [
        ['rect', { x: 3, y: 5, width: 18, height: 14, rx: 3 }],
        ['circle', { cx: 9, cy: 11, r: 2 }],
        'M6 16a3 3 0 0 1 6 0',
        'M15 10h3',
        'M15 13h3',
      ],
      userPlus: [['circle', { cx: 10, cy: 8, r: 4 }], 'M3 21a7 7 0 0 1 11-5.7', 'M19 14v6', 'M16 17h6'],
      book: ['M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z', 'M4 19V5', 'M9 7h6', 'M9 11h4'],
      faq: [['circle', { cx: 12, cy: 12, r: 9 }], 'M12 8v5', 'M12 16.5h.01'],
      megaphone: ['M3 10v4h4l7 4V6l-7 4z', 'M17 9.5a3.5 3.5 0 0 1 0 5', 'M19.5 7a7 7 0 0 1 0 10'],
      shield: ['M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', 'M8.5 12l2.5 2.5 4.5-5'],
      mail: [['rect', { x: 3, y: 5, width: 18, height: 14, rx: 3 }], 'M3 7l9 6 9-6'],
      search: [['circle', { cx: 11, cy: 11, r: 7 }], 'M20 20l-4-4'],
      phone: ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'],
      heart: [
        'M12 20s-7.5-4.6-9.3-9.2C1.5 7.6 3.6 4.5 6.8 4.5c2 0 3.5 1.1 5.2 3 1.7-1.9 3.2-3 5.2-3 3.2 0 5.3 3.1 4.1 6.3C19.5 15.4 12 20 12 20z',
      ],
      arrow: N(['M5 12h14', 'M13 6l6 6-6 6']),
      chev: N(['M6 9l6 6 6-6']),
      star: ['M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z'],
      sparkle: ['M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7z'],
      burger: N(['M4 8h16', 'M4 16h16']),
      close: N(['M6 6l12 12', 'M18 6L6 18']),
    };
    const ic = (k, s, sw) => this.icon(P[k], s, sw);
    const L = (arr) =>
      arr.map((s) => {
        const [label, p] = s.split('|');
        return { label, href: B + p + '/' };
      });
    const pv = (code, label, p) => ({ code, label, href: B + p + '/' });
    const city = (label, href) => ({ icon: 'pin', label, href });

    const menus = (this.menus = {
      provinces: {
        label: 'Rehabs by Province',
        icon: 'pin',
        c: ['#e3f1e8', '#3f9a6b', '#236a45'],
        title: 'Rehabs by Province',
        sub: 'Treatment centres in every province and territory.',
        all: ['All rehab centres', B + 'rehab/search/'],
        cols: 3,
        feat: {
          icon: 'search',
          eyebrow: 'Quick search',
          title: 'Find a centre near you',
          text: 'Search by city, province or the kind of help you need.',
          search: 'City or province',
          img: '/assets/img/menu-1.jpg',
          ph: 'Photo: a calm, welcoming treatment centre',
        },
        groups: [
          {
            title: 'Western Canada',
            icon: 'mountain',
            items: [
              pv('BC', 'British Columbia', 'british-columbia-rehabs'),
              pv('AB', 'Alberta', 'alberta-rehabs'),
              pv('SK', 'Saskatchewan', 'saskatchewan-rehabs'),
              pv('MB', 'Manitoba', 'manitoba-rehabs'),
            ],
          },
          {
            title: 'Central Canada',
            icon: 'building',
            items: [pv('ON', 'Ontario', 'ontario-rehabs'), pv('QC', 'Quebec', 'drug-alcohol-rehabs-in-quebec')],
          },
          {
            title: 'Atlantic Canada',
            icon: 'wave',
            items: [
              pv('NS', 'Nova Scotia', 'nova-scotia-rehabs'),
              pv('NB', 'New Brunswick', 'new-brunswick-rehabs'),
              pv('PE', 'Prince Edward Island', 'prince-edward-island-rehabs'),
              pv('NL', 'Newfoundland & Labrador', 'newfoundland-and-labrador-rehabs'),
            ],
          },
          {
            title: 'Northern Canada',
            icon: 'snow',
            items: [
              pv('NT', 'Northwest Territories', 'northwest-territories-rehabs'),
              pv('YT', 'Yukon', 'rehab/yukon-drug-rehab-treatments'),
              pv('NU', 'Nunavut', 'nunavut-drug-rehab-centers'),
            ],
          },
          {
            title: 'Popular cities',
            icon: 'star',
            items: [
              city('Toronto', B + 'toronto-rehabs/'),
              city('Vancouver', B + '7-best-drug-alcohol-rehab-centres-in-vancouver-2025/'),
              city('Montreal', B + 'montreal-rehabs/'),
              city('Ottawa', B + 'ottawa-rehabs/'),
            ],
          },
        ],
      },
      drugs: {
        label: 'Drug Addiction',
        icon: 'pill',
        c: ['#ece8f9', '#7361cf', '#4b3a9e'],
        title: 'Addiction by Drug',
        sub: 'Effects, signs of dependence and treatment for each substance.',
        all: ['Drug rehab in Canada', B + 'drug-rehabilitation-in-canada/'],
        cols: 3,
        feat: {
          icon: 'book',
          eyebrow: 'Guide',
          title: 'Drug rehabilitation in Canada',
          text: 'How treatment works, what to expect and how to choose the right program.',
          cta: ['Read the guide', B + 'drug-rehabilitation-in-canada/'],
          img: '/assets/img/menu-2.jpg',
          ph: 'Photo: counsellor and client in conversation',
        },
        groups: [
          {
            title: 'Opioids',
            icon: 'pill',
            items: L([
              'Heroin|heroin-addiction',
              'Opioids|opioids-addiction',
              'Oxycodone|oxycodone-addiction',
              'Percocet|percocet-treatment',
              'Vicodin|vicodin-addiction',
              'Lortab|lortab-addiction',
              'Methadone|methadone-addiction',
              'Opium|opium-addiction',
            ]),
          },
          {
            title: 'Stimulants',
            icon: 'zap',
            items: L(['Cocaine|cocaine-addiction', 'Ecstasy (MDMA)|ecstasy-addiction', 'Ritalin|ritalin-addiction']),
          },
          {
            title: 'Sedatives',
            icon: 'moon',
            items: L([
              'Benzodiazepines|benzodiazepine-addiction',
              'Tranquilisers|tranquilisers-addiction',
              'GHB|ghb-addiction',
            ]),
          },
          {
            title: 'Hallucinogens',
            icon: 'eye',
            items: L(['LSD|lsd-addiction', 'Ketamine|ketamine-addiction', 'PCP|pcp-addiction', 'Mescaline|mescaline']),
          },
          {
            title: 'Other substances',
            icon: 'leaf',
            items: L([
              'Marijuana|marijuana-addiction',
              'Prescription drugs|prescription-drugs-addiction',
              'Street drugs|street-drugs-addiction',
              'Steroids|steroids-addiction',
            ]),
          },
        ],
      },
      alcohol: {
        label: 'Alcohol Addiction',
        icon: 'glass',
        c: ['#fbeeda', '#cf8a2b', '#86520f'],
        title: 'Alcohol Addiction',
        sub: 'Recognise the signs, detox safely and find lasting support.',
        all: ['Complete alcohol guide', '/alcohol'],
        cols: 3,
        feat: {
          icon: 'question',
          eyebrow: '2-minute self-check',
          title: 'Am I an Alcoholic?',
          text: 'Answer a few honest questions about your drinking and see where you stand.',
          cta: ['Take the self-check', B + 'am-i-an-alcoholic/'],
          img: '/assets/img/menu-3.jpg',
          ph: 'Photo: morning light, a quiet moment of reflection',
        },
        groups: [
          {
            title: 'Understand',
            icon: 'glass',
            items: [
              { icon: 'glass', label: 'Alcohol Addiction', desc: 'Signs, effects and treatment', href: '/alcohol' },
              {
                icon: 'question',
                label: 'Am I an Alcoholic?',
                desc: 'A short, honest self-check',
                href: B + 'am-i-an-alcoholic/',
              },
              {
                icon: 'car',
                label: 'DUI in Canada',
                desc: 'Impaired driving and treatment',
                href: B + 'dui-in-canada/',
              },
            ],
          },
          {
            title: 'Detox & treatment',
            icon: 'med',
            items: [
              {
                icon: 'drop',
                label: 'Detox Centres',
                desc: 'Supervised withdrawal by province',
                href: B + 'detox-centres-in-canada/',
              },
              {
                icon: 'med',
                label: 'Medical Detox',
                desc: 'For heavy, long-term drinking',
                href: B + 'medical-detox-in-canada/',
              },
              {
                icon: 'home',
                label: 'Home Detox',
                desc: 'Guided detox for milder cases',
                href: B + 'home-detox-in-canada/',
              },
              {
                icon: 'bed',
                label: 'Alcohol Rehab',
                desc: 'Residential & outpatient programs',
                href: B + 'alcohol-rehab/',
              },
            ],
          },
          {
            title: 'Support & recovery',
            icon: 'group',
            items: [
              {
                icon: 'group',
                label: 'AA Support Groups',
                desc: 'Free peer meetings nationwide',
                href: B + 'aa-support-group/',
              },
              {
                icon: 'steps',
                label: '12 Step Programs',
                desc: 'How the steps guide recovery',
                href: B + '12-steps-programs/',
              },
            ],
          },
        ],
      },
      intervention: {
        label: 'Intervention',
        icon: 'hands',
        c: ['#fce6df', '#d9694d', '#a13f28'],
        title: 'Intervention',
        sub: 'Help a loved one accept treatment, with a plan and a professional.',
        all: ['Intervention guide', '/intervention'],
        cols: 2,
        feat: {
          icon: 'chat',
          eyebrow: 'Speak to someone',
          title: 'Planning an intervention?',
          text: 'An advisor can talk you through next steps and connect you with a professional interventionist.',
          cta: ['Request a call-back', '/contact'],
          img: '/assets/img/menu-4.jpg',
          ph: 'Photo: family members supporting each other',
        },
        groups: [
          {
            title: 'Plan an intervention',
            icon: 'hands',
            items: [
              {
                icon: 'hands',
                label: 'How Intervention Works',
                desc: 'The process, step by step',
                href: '/intervention',
              },
              {
                icon: 'drop',
                label: 'Drug & Alcohol Intervention',
                desc: 'Approaches for substance use',
                href: B + 'drugs-and-alcohol-intervention/',
              },
            ],
          },
          {
            title: 'Get professional help',
            icon: 'building',
            items: [
              {
                icon: 'building',
                label: 'Intervention Centres',
                desc: 'Centres offering intervention services',
                href: B + 'drug-intervention-treatment-centres/',
              },
              { icon: 'chat', label: 'Talk to an Advisor', desc: 'Free, confidential guidance', href: '/contact' },
            ],
          },
        ],
      },
      therapists: {
        label: 'Find a Therapist',
        icon: 'person',
        c: ['#e2f0fb', '#0890E8', '#0a5d96'],
        title: 'Find a Therapist',
        sub: 'Psychotherapists, psychologists and addiction counsellors.',
        all: ['Browse the directory', '/therapists'],
        cols: 3,
        feat: {
          icon: 'userPlus',
          eyebrow: 'For professionals',
          title: 'List your practice',
          text: 'Join the directory and get referrals from people looking for addiction support.',
          cta: ['Join the directory', '/join-directory'],
          img: '/assets/img/menu-5.jpg',
          ph: 'Photo: therapist in a warm, bright office',
        },
        groups: [
          {
            title: 'Directory',
            icon: 'search',
            items: [
              {
                icon: 'search',
                label: 'Therapist Directory',
                desc: 'Search by city, issue or approach',
                href: '/therapists',
              },
              {
                icon: 'idcard',
                label: 'Example Profile',
                desc: 'See what a listing includes',
                href: '/therapist-profile',
              },
              { icon: 'userPlus', label: 'Join the Directory', desc: 'List your practice', href: '/join-directory' },
            ],
          },
          {
            title: 'By province',
            icon: 'pin',
            items: [
              { code: 'ON', label: 'Ontario', href: '/therapists-province' },
              { code: 'BC', label: 'British Columbia', href: '/therapists-province' },
              { code: 'AB', label: 'Alberta', href: '/therapists-province' },
              { code: 'QC', label: 'Quebec', href: '/therapists-province' },
            ],
          },
          {
            title: 'Popular cities',
            icon: 'star',
            items: ['Toronto', 'Vancouver', 'Montreal', 'Calgary'].map((c) => city(c, '/therapists-city')),
          },
        ],
      },
      more: {
        label: 'Resources',
        icon: 'book',
        c: ['#dff1ef', '#2a9990', '#186a64'],
        title: 'Resources',
        sub: 'Guides, answers and ways for providers to work with us.',
        all: ['Contact our team', '/contact'],
        cols: 2,
        feat: {
          icon: 'sparkle',
          eyebrow: 'From the blog',
          title: 'Recovery guides & news',
          text: 'Practical articles for people in recovery and the families supporting them.',
          cta: ['Visit the blog', '/blog'],
          img: '/assets/img/menu-6.jpg',
          ph: 'Photo: someone reading, cup of tea',
        },
        groups: [
          {
            title: 'Learn',
            icon: 'book',
            items: [
              { icon: 'book', label: 'Blog', desc: 'Recovery guides and news', href: '/blog' },
              { icon: 'faq', label: 'FAQ', desc: 'Costs, coverage and what to expect', href: B + 'faqs/' },
              { icon: 'mail', label: 'Contact Us', desc: 'Call, email or request a call-back', href: '/contact' },
            ],
          },
          {
            title: 'For treatment centres',
            icon: 'megaphone',
            items: [
              {
                icon: 'megaphone',
                label: 'Promote Your Centre',
                desc: 'Reach families searching for care',
                href: '/promote',
              },
              {
                icon: 'shield',
                label: 'Claim Your Listing',
                desc: 'Verify and update your centre',
                href: '/claim-listing',
              },
              {
                icon: 'megaphone',
                label: 'List Your Centre',
                desc: 'Create a verified profile',
                href: '/auth?mode=signup&type=centre',
              },
            ],
          },
        ],
      },
    });
    const keys = Object.keys(menus);
    const mapItem = (it, key, C) => {
      const on = hov === key,
        rich = !!it.desc,
        hasIcon = !!it.icon;
      return {
        label: it.label,
        href: it.href,
        desc: it.desc || '',
        code: it.code || '',
        icon: hasIcon ? ic(it.icon, rich ? 21 : 17) : null,
        hover: () => this.setState({ hov: key }),
        unhover: () => this.setState((s) => (s.hov === key ? { hov: null } : null)),
        bg: on ? C[0] + '99' : 'transparent',
        labelColor: on ? C[2] : '#10233a',
        tile: rich ? '46px' : '40px',
        tileSm: rich ? '42px' : '30px',
        tileBg: on ? C[1] : it.code ? '#f5efe6' : C[0],
        tileColor: on ? '#fff' : it.code ? '#4a3f35' : C[1],
        cardBg: on ? '#fff' : 'rgba(255,255,255,.6)',
        cardBorder: on ? C[0] : '#f0e9df',
        cardShadow: on ? '0 14px 30px -18px rgba(58,44,30,.45)' : 'none',
        cardPad: rich ? '12px 14px 12px 12px' : '10px 14px 10px 10px',
        arrowOp: on ? '1' : '0',
        arrowX: on ? '0' : '-6px',
        pad: rich ? '8px 10px' : '5px 10px',
        font: rich ? '600 14.5px/1.3 Figtree,sans-serif' : '500 14.5px/1.4 Figtree,sans-serif',
      };
    };
    const mapGroups = (M, mk) =>
      M.groups.map((gr, gi) => ({
        title: gr.title,
        icon: ic(gr.icon, 16),
        items: gr.items.map((it, ii) => mapItem(it, mk + gi + '-' + ii, M.c)),
      }));

    const desktop = w >= 1100,
      open = desktop && !!menu;
    const m = menus[shown] || menus.provinces,
      f = m.feat,
      C = m.c;
    const indKey = menu || hovNav,
      ip = indKey && pos[indKey];
    const navItems = keys.map((k) => {
      const on = menu === k,
        cur = active === k,
        Ck = menus[k].c;
      return {
        label: menus[k].label,
        ref: this.bref(k),
        expanded: on ? 'true' : 'false',
        enter: () => {
          clearTimeout(this._close);
          this.setState({ hovNav: k });
          if (this.state.menu) this.openMenu(k);
          else {
            clearTimeout(this._open);
            this._open = setTimeout(() => this.openMenu(k), 90);
          }
        },
        click: () => (this.state.menu === k && !pinned ? this.setState({ menu: null }) : this.openMenu(k)),
        color: on || hovNav === k ? Ck[2] : '#10233a',
        dot: cur && !on ? '1' : '0',
        dotColor: Ck[1],
        chev: on ? 'rotate(180deg)' : 'none',
      };
    });
    const safeTab = Math.min(tab, m.groups.length - 1);
    const tabs = m.groups.map((g, i) => {
      const on = i === safeTab;
      return {
        title: g.title,
        icon: ic(g.icon, 18),
        select: () => {
          if (this.state.tab !== i) this.setState({ tab: i });
        },
        bg: on ? '#fff' : 'transparent',
        shadow: on ? '0 10px 24px -16px rgba(58,44,30,.5)' : 'none',
        color: on ? C[2] : '#3e3a36',
        tileBg: on ? C[1] : 'rgba(255,255,255,.7)',
        tileColor: on ? '#fff' : C[1],
        chevOp: on ? '1' : '0',
        chevX: on ? '0' : '-4px',
      };
    });
    const tabItems = m.groups[safeTab].items.map((it, ii) => mapItem(it, shown + 't' + safeTab + '-' + ii, C));
    const mobSections = keys.map((k) => {
      const o = mobSec === k,
        M = menus[k];
      return {
        label: M.label,
        icon: ic(M.icon, 21),
        open: o,
        groups: mapGroups(M, 'm' + k),
        allLabel: M.all[0],
        allHref: M.all[1],
        toggle: () => this.setState({ mobSec: o ? null : k }),
        chev: o ? 'rotate(180deg)' : 'none',
        tint: M.c[0],
        ink: M.c[1],
        deep: M.c[2],
        cardBg: o ? '#fff' : 'transparent',
        cardBorder: o ? '#f0e9df' : 'transparent',
      };
    });
    const narrow = w < 1240,
      featW = narrow ? '280px' : '310px',
      isTabs = layout !== 'columns';

    return {
      claimHref: this.props.active === 'therapists' ? '/claim-therapist' : '/claim-listing',
      rootRef: this.rootRef,
      navRef: this.navRef,
      contentRef: this.contentRef,
      tabRef: this.tabRef,
      desktop,
      mobile: !desktop,
      showTopLinks: w >= 760,
      navItems,
      enterRoot: () => clearTimeout(this._close),
      leaveRoot: () => {
        clearTimeout(this._open);
        if (pinned) {
          this.setState({ hovNav: null });
          return;
        }
        this._close = setTimeout(() => this.setState({ menu: null, hovNav: null }), 160);
      },
      leaveNav: () => {
        clearTimeout(this._open);
        if (!this.state.menu) this.setState({ hovNav: null });
      },
      indW: ip ? ip.w + 'px' : '0px',
      indTf: ip ? `translateX(${ip.x}px)` : 'translateX(0)',
      indOp: ip ? '1' : '0',
      indBg: indKey ? menus[indKey].c[0] : '#f5efe6',
      caretX: pos[shown] ? pos[shown].cx + 'px' : '50%',
      scrimOp: open && !pinned ? '1' : '0',
      panelOp: open ? '1' : '0',
      panelVis: open ? 'visible' : 'hidden',
      panelPe: open ? 'auto' : 'none',
      panelTf: open ? 'none' : 'translateY(-8px) scale(.995)',
      panelTr: open
        ? 'opacity .2s ease-out, transform .26s cubic-bezier(.23,1,.32,1), visibility 0s'
        : 'opacity .14s ease-out, transform .14s ease-out, visibility 0s linear .14s',
      mTint: C[0],
      mInk: C[1],
      mDeep: C[2],
      menuTitle: m.title,
      menuSub: m.sub,
      menuIcon: ic(m.icon, 26),
      menuAllLabel: m.all[0],
      menuAllHref: m.all[1],
      layoutTabs: isTabs,
      layoutCols: !isTabs,
      tabs,
      tabItems,
      bodyCols: isTabs ? `${narrow ? '210px' : '236px'} minmax(0,1fr) ${featW}` : `minmax(0,1fr) ${featW}`,
      menuColCount: String(narrow ? Math.min(m.cols, 2) : m.cols),
      menuGroups: mapGroups(m, shown),
      photoH: isTabs ? '150px' : '170px',
      feats: keys.map((k) => ({
        slot: 'menu-photo-' + k,
        ph: menus[k].feat.ph,
        src: menus[k].feat.img,
        alt: menus[k].feat.ph.replace(/^Photo: /, ''),
        display: k === shown ? 'block' : 'none',
      })),
      featIcon: ic(f.icon, 14),
      featEyebrow: f.eyebrow,
      featTitle: f.title,
      featText: f.text,
      featSearch: !!f.search,
      featPlaceholder: f.search || '',
      featCta: !!f.cta,
      featCtaLabel: f.cta ? f.cta[0] : '',
      featHref: f.cta ? f.cta[1] : '#',
      mobOpen: !desktop && mob,
      toggleMob: () => this.setState({ mob: !mob }),
      burgerIcon: ic(mob ? 'close' : 'burger', 20),
      burgerBg: mob ? '#10233a' : '#fff',
      burgerColor: mob ? '#fff' : '#10233a',
      mobSections,
      iconArrowSm: ic('arrow', 15),
      iconPhone: ic('phone', 16),
      iconPhoneSm: ic('phone', 12, 2),
      iconSearch: ic('search', 17),
      iconSearchDuo: ic('search', 17, 2),
      iconChev: ic('chev', 14, 2),
      iconHeart: ic('heart', 15),
      iconHeartLg: ic('heart', 22),
    };
  }
}

/* ───────────────────────── markup ───────────────────────── */
function template(v) {
  const {
    bodyCols,
    burgerBg,
    burgerColor,
    burgerIcon,
    caretX,
    claimHref,
    contentRef,
    desktop,
    enterRoot,
    featCta,
    featCtaLabel,
    featEyebrow,
    featHref,
    featIcon,
    featPlaceholder,
    featSearch,
    featText,
    featTitle,
    feats,
    iconArrowSm,
    iconChev,
    iconHeart,
    iconHeartLg,
    iconPhone,
    iconPhoneSm,
    iconSearch,
    iconSearchDuo,
    indBg,
    indOp,
    indTf,
    indW,
    layoutCols,
    layoutTabs,
    leaveNav,
    leaveRoot,
    mDeep,
    mInk,
    mTint,
    menuAllHref,
    menuAllLabel,
    menuColCount,
    menuGroups,
    menuIcon,
    menuSub,
    menuTitle,
    mobOpen,
    mobSections,
    mobile,
    navItems,
    navRef,
    panelOp,
    panelPe,
    panelTf,
    panelTr,
    panelVis,
    photoH,
    rootRef,
    scrimOp,
    showTopLinks,
    tabItems,
    tabRef,
    tabs,
    toggleMob,
  } = v;
  return (
    <>
      <div
        ref={rootRef}
        style={{
          position: 'relative',
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(14px)',
          borderBottom: '1px solid #efe7dc',
        }}
        onMouseLeave={leaveRoot}
        onMouseEnter={enterRoot}
      >
        <div style={{ background: 'linear-gradient(90deg,#0a5d96 0%,#0890E8 100%)', color: '#fff' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '0 24px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              font: '500 13px Figtree,sans-serif',
            }}
            data-rc-wrap="1"
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                minWidth: '0',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              <span style={{ display: 'flex', color: '#ff8a8f', flexShrink: '0' }}>{$i(iconHeart)}</span>
              You're not alone. Free, confidential support, 24/7.
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              {showTopLinks ? (
                <>
                  <$A className="scpe" href={claimHref} style={{ color: '#e3f1fc', whiteSpace: 'nowrap' }}>
                    Claim Your Listing
                  </$A>
                  <$A className="scpe" href="/auth?mode=login" style={{ color: '#e3f1fc', whiteSpace: 'nowrap' }}>
                    Sign in
                  </$A>
                </>
              ) : null}
              <$A
                className="scp1z"
                href="tel:1-855-885-4747"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '7px',
                  color: '#10233a',
                  font: '600 13.5px Jost,sans-serif',
                  whiteSpace: 'nowrap',
                  background: '#fff',
                  border: '1px solid rgba(255,255,255,.6)',
                  borderRadius: '999px',
                  height: '28px',
                  padding: '0 12px 0 5px',
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: '#D82028',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {$i(iconPhoneSm)}
                </span>
                1-855-885-4747
              </$A>
            </div>
          </div>
        </div>
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0 24px',
            height: '76px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
          data-rc-wrap="1"
        >
          <$A href="/" style={{ display: 'flex', alignItems: 'center', flexShrink: '0' }}>
            <img
              src="/assets/logo.png"
              alt="Addiction Rehab Centres Canada"
              style={{ height: '46px', width: 'auto', display: 'block' }}
            />
          </$A>
          {desktop ? (
            <>
              <nav
                ref={navRef}
                onMouseLeave={leaveNav}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px',
                  marginLeft: 'auto',
                  padding: '4px',
                }}
              >
                <span
                  style={$css(
                    `position:absolute;left:0;top:4px;height:42px;border-radius:999px;background:${indBg ?? ''};width:${indW ?? ''};transform:${indTf ?? ''};opacity:${indOp ?? ''};transition:transform .28s cubic-bezier(.23,1,.32,1),width .28s cubic-bezier(.23,1,.32,1),opacity .15s ease,background .2s ease;pointer-events:none`,
                  )}
                />
                {$list(navItems).map((n, $index) => (
                  <Fragment key={$index}>
                    <button
                      className="scpy"
                      ref={n?.ref}
                      onMouseEnter={n?.enter}
                      onClick={n?.click}
                      onFocus={n?.enter}
                      aria-expanded={n?.expanded}
                      style={$css(
                        `appearance:none;border:0;background:transparent;color:${n?.color ?? ''};font:500 14.5px Figtree,sans-serif;padding:0 14px;height:42px;border-radius:999px;cursor:pointer;display:flex;align-items:center;gap:6px;white-space:nowrap;position:relative;transition:color .15s ease,transform .12s ease-out`,
                      )}
                    >
                      {$i(n?.label)}
                      <span
                        style={$css(
                          `display:flex;opacity:.6;transform:${n?.chev ?? ''};transition:transform .24s cubic-bezier(.23,1,.32,1)`,
                        )}
                      >
                        {$i(iconChev)}
                      </span>
                      <span
                        style={$css(
                          `position:absolute;left:50%;bottom:4px;width:5px;height:5px;margin-left:-2.5px;border-radius:50%;background:${n?.dotColor ?? ''};opacity:${n?.dot ?? ''}`,
                        )}
                      />
                    </button>
                  </Fragment>
                ))}
              </nav>
              <$A
                className="scp1 scpy"
                href="https://addictionrehabcenters.ca/rehab/search/"
                style={{
                  flexShrink: '0',
                  font: '600 14.5px Jost,sans-serif',
                  color: '#fff',
                  background: '#0890E8',
                  height: '46px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '0 20px 0 16px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 10px 20px -10px rgba(8,144,232,.8),inset 0 1px 0 rgba(255,255,255,.2)',
                  transition: 'background .15s ease,transform .12s ease-out',
                }}
              >
                {$i(iconSearchDuo)}
                Find a Rehab
              </$A>
            </>
          ) : null}
          {mobile ? (
            <>
              <$A
                className="scp1 scpy"
                href="https://addictionrehabcenters.ca/rehab/search/"
                style={{
                  marginLeft: 'auto',
                  font: '600 14px Jost,sans-serif',
                  color: '#fff',
                  background: '#0890E8',
                  height: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '0 16px 0 13px',
                  borderRadius: '999px',
                  whiteSpace: 'nowrap',
                }}
              >
                {$i(iconSearchDuo)}
                Find a Rehab
              </$A>
              <button
                className="scp10"
                onClick={toggleMob}
                aria-label="Menu"
                aria-expanded={mobOpen}
                style={$css(
                  `appearance:none;border:1px solid #e8dfd2;background:${burgerBg ?? ''};color:${burgerColor ?? ''};width:46px;height:46px;border-radius:50%;display:grid;place-items:center;cursor:pointer;flex-shrink:0;transition:background .15s ease,color .15s ease,transform .12s ease-out`,
                )}
              >
                {$i(burgerIcon)}
              </button>
            </>
          ) : null}
        </div>
        {desktop ? (
          <>
            <div
              style={$css(
                `position:absolute;left:0;right:0;top:100%;height:100vh;background:rgba(58,44,30,.18);opacity:${scrimOp ?? ''};transition:opacity .2s ease;pointer-events:none`,
              )}
            />
            <div
              style={$css(
                `position:absolute;left:0;right:0;top:100%;opacity:${panelOp ?? ''};visibility:${panelVis ?? ''};transform:${panelTf ?? ''};transform-origin:top center;transition:${panelTr ?? ''};pointer-events:${panelPe ?? ''}`,
              )}
            >
              <div
                style={$css(
                  `position:absolute;top:-7px;left:${caretX ?? ''};width:14px;height:14px;background:#fff;border-left:1px solid #efe7dc;border-top:1px solid #efe7dc;border-top-left-radius:3px;transform:translateX(-7px) rotate(45deg);transition:left .28s cubic-bezier(.23,1,.32,1);z-index:2`,
                )}
              />
              <div
                style={{
                  background: '#fff',
                  borderTop: '1px solid #efe7dc',
                  borderBottomLeftRadius: '28px',
                  borderBottomRightRadius: '28px',
                  boxShadow: '0 40px 80px -30px rgba(58,44,30,.35)',
                }}
              >
                <div
                  ref={contentRef}
                  style={{
                    maxWidth: '1280px',
                    margin: '0 auto',
                    padding: '26px 24px 22px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '22px',
                  }}
                  data-rc-wrap="1"
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '0' }}>
                      <span
                        style={$css(
                          `width:52px;height:52px;border-radius:18px;background:${mTint ?? ''};color:${mInk ?? ''};display:grid;place-items:center;flex-shrink:0`,
                        )}
                      >
                        {$i(menuIcon)}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: '0' }}>
                        <h3 style={{ font: '600 22px/1.15 Jost,sans-serif', color: '#10233a', margin: '0' }}>
                          {$i(menuTitle)}
                        </h3>
                        <p
                          style={{
                            font: '400 14.5px/1.5 Figtree,sans-serif',
                            color: '#5d6b7a',
                            margin: '0',
                            textWrap: 'pretty',
                          }}
                        >
                          {$i(menuSub)}
                        </p>
                      </div>
                    </div>
                    <$A
                      className="scp20 scpy"
                      href={menuAllHref}
                      style={$css(
                        `flex-shrink:0;display:inline-flex;align-items:center;gap:8px;height:40px;padding:0 16px;border-radius:999px;background:#fff;border:1px solid #ece3d6;font:600 13.5px Jost,sans-serif;color:${mDeep ?? ''};white-space:nowrap;transition:border-color .15s ease,transform .12s ease-out`,
                      )}
                    >
                      {$i(menuAllLabel)}
                      {$i(iconArrowSm)}
                    </$A>
                  </div>
                  <div
                    style={$css(`display:grid;grid-template-columns:${bodyCols ?? ''};gap:22px;align-items:stretch`)}
                    data-rc-dyn="1"
                  >
                    {layoutTabs ? (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            padding: '6px',
                            background: '#f5efe6',
                            borderRadius: '22px',
                            alignSelf: 'start',
                          }}
                        >
                          {$list(tabs).map((t, $index) => (
                            <Fragment key={$index}>
                              <button
                                onMouseEnter={t?.select}
                                onFocus={t?.select}
                                onClick={t?.select}
                                style={$css(
                                  `appearance:none;border:0;cursor:pointer;text-align:left;display:flex;align-items:center;gap:12px;padding:8px 12px 8px 8px;border-radius:16px;background:${t?.bg ?? ''};box-shadow:${t?.shadow ?? ''};color:${t?.color ?? ''};transition:background .18s ease,box-shadow .18s ease,color .15s ease`,
                                )}
                              >
                                <span
                                  style={$css(
                                    `width:36px;height:36px;border-radius:12px;background:${t?.tileBg ?? ''};color:${t?.tileColor ?? ''};display:grid;place-items:center;flex-shrink:0;transition:background .18s ease,color .18s ease`,
                                  )}
                                >
                                  {$i(t?.icon)}
                                </span>
                                <span
                                  style={{ flex: '1', font: '600 14.5px/1.25 Figtree,sans-serif', color: 'inherit' }}
                                >
                                  {$i(t?.title)}
                                </span>
                                <span
                                  style={$css(
                                    `display:flex;opacity:${t?.chevOp ?? ''};transform:translateX(${t?.chevX ?? ''});transition:opacity .15s ease,transform .2s cubic-bezier(.23,1,.32,1)`,
                                  )}
                                >
                                  {$i(iconArrowSm)}
                                </span>
                              </button>
                            </Fragment>
                          ))}
                        </div>
                        <div
                          ref={tabRef}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
                            gap: '8px',
                            alignContent: 'start',
                            minWidth: '0',
                          }}
                          data-cols="repeat(2,minmax(0,1fr))"
                        >
                          {$list(tabItems).map((it, $index) => (
                            <Fragment key={$index}>
                              <$A
                                href={it?.href}
                                onMouseEnter={it?.hover}
                                onMouseLeave={it?.unhover}
                                style={$css(
                                  `display:flex;align-items:center;gap:13px;padding:${it?.cardPad ?? ''};border-radius:18px;background:${it?.cardBg ?? ''};border:1px solid ${it?.cardBorder ?? ''};box-shadow:${it?.cardShadow ?? ''};color:#10233a;transition:background .18s ease,border-color .18s ease,box-shadow .18s ease`,
                                )}
                              >
                                {it?.icon ? (
                                  <>
                                    <span
                                      style={$css(
                                        `width:${it?.tile ?? ''};height:${it?.tile ?? ''};border-radius:14px;background:${it?.tileBg ?? ''};color:${it?.tileColor ?? ''};display:grid;place-items:center;flex-shrink:0;transition:background .18s ease,color .18s ease`,
                                      )}
                                    >
                                      {$i(it?.icon)}
                                    </span>
                                  </>
                                ) : null}
                                {it?.code ? (
                                  <>
                                    <span
                                      style={$css(
                                        `width:40px;height:40px;border-radius:14px;background:${it?.tileBg ?? ''};color:${it?.tileColor ?? ''};font:600 12px Jost,sans-serif;letter-spacing:.05em;display:grid;place-items:center;flex-shrink:0;transition:background .18s ease,color .18s ease`,
                                      )}
                                    >
                                      {$i(it?.code)}
                                    </span>
                                  </>
                                ) : null}
                                <span
                                  style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '2px',
                                    minWidth: '0',
                                    flex: '1',
                                  }}
                                >
                                  <span
                                    style={$css(
                                      `font:600 15px/1.3 Figtree,sans-serif;color:${it?.labelColor ?? ''};transition:color .15s ease`,
                                    )}
                                  >
                                    {$i(it?.label)}
                                  </span>
                                  {it?.desc ? (
                                    <>
                                      <span style={{ font: '400 13px/1.45 Figtree,sans-serif', color: '#6f7b87' }}>
                                        {$i(it?.desc)}
                                      </span>
                                    </>
                                  ) : null}
                                </span>
                                <span
                                  style={$css(
                                    `display:flex;color:${mInk ?? ''};opacity:${it?.arrowOp ?? ''};transform:translateX(${it?.arrowX ?? ''});transition:opacity .15s ease,transform .2s cubic-bezier(.23,1,.32,1)`,
                                  )}
                                >
                                  {$i(iconArrowSm)}
                                </span>
                              </$A>
                            </Fragment>
                          ))}
                        </div>
                      </>
                    ) : null}
                    {layoutCols ? (
                      <>
                        <div style={$css(`column-count:${menuColCount ?? ''};column-gap:20px;min-width:0`)}>
                          {$list(menuGroups).map((g, $index) => (
                            <Fragment key={$index}>
                              <div
                                style={{
                                  breakInside: 'avoid',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '2px',
                                  marginBottom: '14px',
                                  background: '#fff',
                                  border: '1px solid #f0e9df',
                                  borderRadius: '22px',
                                  padding: '14px 8px 8px',
                                }}
                              >
                                <div
                                  style={$css(
                                    `display:flex;align-items:center;gap:9px;padding:0 10px 8px;color:${mInk ?? ''}`,
                                  )}
                                >
                                  {' '}
                                  {$i(g?.icon)}
                                  <span
                                    style={{
                                      font: '600 12px Figtree,sans-serif',
                                      letterSpacing: '.1em',
                                      textTransform: 'uppercase',
                                      color: '#7a6a58',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {$i(g?.title)}
                                  </span>
                                </div>
                                {$list(g?.items).map((it, $index) => (
                                  <Fragment key={$index}>
                                    <$A
                                      href={it?.href}
                                      onMouseEnter={it?.hover}
                                      onMouseLeave={it?.unhover}
                                      style={$css(
                                        `display:flex;align-items:center;gap:12px;padding:${it?.pad ?? ''};border-radius:14px;background:${it?.bg ?? ''};color:#10233a;transition:background .15s ease`,
                                      )}
                                    >
                                      {it?.icon ? (
                                        <>
                                          <span
                                            style={$css(
                                              `width:${it?.tileSm ?? ''};height:${it?.tileSm ?? ''};border-radius:12px;background:${it?.tileBg ?? ''};color:${it?.tileColor ?? ''};display:grid;place-items:center;flex-shrink:0;transition:background .15s ease,color .15s ease`,
                                            )}
                                          >
                                            {$i(it?.icon)}
                                          </span>
                                        </>
                                      ) : null}
                                      {it?.code ? (
                                        <>
                                          <span
                                            style={$css(
                                              `width:34px;height:28px;border-radius:10px;background:${it?.tileBg ?? ''};color:${it?.tileColor ?? ''};font:600 11px Jost,sans-serif;letter-spacing:.05em;display:grid;place-items:center;flex-shrink:0;transition:background .15s ease,color .15s ease`,
                                            )}
                                          >
                                            {$i(it?.code)}
                                          </span>
                                        </>
                                      ) : null}
                                      <span
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          gap: '1px',
                                          minWidth: '0',
                                          flex: '1',
                                        }}
                                      >
                                        <span
                                          style={$css(
                                            `font:${it?.font ?? ''};color:${it?.labelColor ?? ''};transition:color .15s ease`,
                                          )}
                                        >
                                          {$i(it?.label)}
                                        </span>
                                        {it?.desc ? (
                                          <>
                                            <span
                                              style={{ font: '400 13px/1.45 Figtree,sans-serif', color: '#6f7b87' }}
                                            >
                                              {$i(it?.desc)}
                                            </span>
                                          </>
                                        ) : null}
                                      </span>
                                      <span
                                        style={$css(
                                          `display:flex;color:${mInk ?? ''};opacity:${it?.arrowOp ?? ''};transform:translateX(${it?.arrowX ?? ''});transition:opacity .15s ease,transform .2s cubic-bezier(.23,1,.32,1)`,
                                        )}
                                      >
                                        {$i(iconArrowSm)}
                                      </span>
                                    </$A>
                                  </Fragment>
                                ))}
                              </div>
                            </Fragment>
                          ))}
                        </div>
                      </>
                    ) : null}
                    <aside
                      style={{
                        background: '#fff',
                        border: '1px solid #f0e9df',
                        borderRadius: '26px',
                        padding: '10px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        boxShadow: '0 20px 40px -28px rgba(58,44,30,.35)',
                      }}
                    >
                      <div
                        style={$css(
                          `position:relative;height:${photoH ?? ''};border-radius:18px;overflow:hidden;background:${mTint ?? ''}`,
                        )}
                      >
                        {$list(feats).map((f, $index) => (
                          <Fragment key={$index}>
                            <div style={$css(`position:absolute;inset:0;display:${f?.display ?? ''}`)}>
                              <img
                                src={f?.src}
                                alt={f?.alt}
                                style={{
                                  width: '100%',
                                  height: '100%',
                                  objectFit: 'cover',
                                  display: 'block',
                                  borderRadius: '18px',
                                }}
                              />
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '2px 8px 8px' }}>
                        <span
                          style={$css(
                            `align-self:flex-start;display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 11px 0 8px;border-radius:999px;background:${mTint ?? ''};color:${mDeep ?? ''};font:600 12px Figtree,sans-serif`,
                          )}
                        >
                          {$i(featIcon)}
                          {$i(featEyebrow)}
                        </span>
                        <h4
                          style={{
                            font: '600 20px/1.2 Jost,sans-serif',
                            color: '#10233a',
                            margin: '0',
                            textWrap: 'balance',
                          }}
                        >
                          {$i(featTitle)}
                        </h4>
                        <p
                          style={{
                            font: '400 14px/1.55 Figtree,sans-serif',
                            color: '#5d6b7a',
                            margin: '0',
                            textWrap: 'pretty',
                          }}
                        >
                          {$i(featText)}
                        </p>
                        {featSearch ? (
                          <>
                            <form
                              action="https://addictionrehabcenters.ca/rehab/search/"
                              method="get"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#f7f2ea',
                                border: '1px solid #ece3d6',
                                borderRadius: '999px',
                                padding: '4px 4px 4px 14px',
                                marginTop: '2px',
                              }}
                            >
                              <span style={{ display: 'flex', color: '#7a6a58' }}>{$i(iconSearch)}</span>
                              <input
                                name="s"
                                placeholder={featPlaceholder}
                                style={{
                                  flex: '1',
                                  minWidth: '0',
                                  border: '0',
                                  outline: 'none',
                                  background: 'transparent',
                                  font: '500 14px Figtree,sans-serif',
                                  color: '#10233a',
                                  height: '36px',
                                }}
                              />
                              <button
                                className="scp21 scpy"
                                type="submit"
                                style={$css(
                                  `appearance:none;border:0;background:${mInk ?? ''};color:#fff;font:600 13.5px Jost,sans-serif;height:36px;padding:0 16px;border-radius:999px;cursor:pointer;transition:filter .15s ease,transform .12s ease-out`,
                                )}
                              >
                                Search
                              </button>
                            </form>
                          </>
                        ) : null}
                        {featCta ? (
                          <>
                            <$A
                              className="scp22 scpy"
                              href={featHref}
                              style={$css(
                                `align-self:flex-start;margin-top:2px;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:${mDeep ?? ''};color:#fff;font:600 14px Jost,sans-serif;transition:filter .15s ease,transform .12s ease-out`,
                              )}
                            >
                              {$i(featCtaLabel)}
                              {$i(iconArrowSm)}
                            </$A>
                          </>
                        ) : null}
                      </div>
                    </aside>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '20px',
                      background: '#f5efe6',
                      borderRadius: '22px',
                      padding: '12px 12px 12px 16px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: '0' }}>
                      <span
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: '#fff',
                          color: '#3f9a6b',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: '0',
                        }}
                      >
                        {$i(iconHeartLg)}
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '0' }}>
                        <span style={{ font: '600 15.5px Jost,sans-serif', color: '#10233a' }}>
                          Not sure where to start? Talk to someone who understands.
                        </span>
                        <span style={{ font: '400 13.5px Figtree,sans-serif', color: '#6f5f4e' }}>
                          Free, confidential advice from our team, day or night.
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: '0' }}>
                      <$A
                        className="scp23"
                        href="/contact"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          height: '44px',
                          padding: '0 16px',
                          borderRadius: '999px',
                          font: '600 14px Jost,sans-serif',
                          color: '#10233a',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        Request a call-back
                      </$A>
                      <$A
                        className="scp24 scpy"
                        href="tel:+18558854747"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '9px',
                          height: '44px',
                          padding: '0 18px 0 6px',
                          borderRadius: '999px',
                          background: '#10233a',
                          color: '#fff',
                          font: '600 15px Jost,sans-serif',
                          whiteSpace: 'nowrap',
                          transition: 'background .15s ease,transform .12s ease-out',
                        }}
                      >
                        <span
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            background: '#D82028',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {$i(iconPhone)}
                        </span>
                        1-855-885-4747
                      </$A>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}
        {mobOpen ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: '0',
                right: '0',
                top: '100%',
                background: '#fff',
                borderTop: '1px solid #efe7dc',
                borderBottomLeftRadius: '24px',
                borderBottomRightRadius: '24px',
                boxShadow: '0 40px 70px -40px rgba(58,44,30,.45)',
                maxHeight: 'calc(100vh - 114px)',
                overflowY: 'auto',
                animation: 'shMobIn .22s cubic-bezier(.23,1,.32,1)',
              }}
            >
              <div
                style={{
                  maxWidth: '720px',
                  margin: '0 auto',
                  padding: '16px 18px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <form
                  action="https://addictionrehabcenters.ca/rehab/search/"
                  method="get"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#fff',
                    border: '1px solid #ece3d6',
                    borderRadius: '999px',
                    padding: '0 6px 0 16px',
                    height: '52px',
                    marginBottom: '6px',
                  }}
                >
                  <span style={{ display: 'flex', color: '#7a6a58' }}>{$i(iconSearch)}</span>
                  <input
                    name="s"
                    placeholder="Search rehabs by city or province"
                    style={{
                      flex: '1',
                      minWidth: '0',
                      border: '0',
                      outline: 'none',
                      background: 'transparent',
                      font: '500 15px Figtree,sans-serif',
                      color: '#10233a',
                      height: '44px',
                    }}
                  />
                </form>
                {$list(mobSections).map((s, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={$css(
                        `background:${s?.cardBg ?? ''};border:1px solid ${s?.cardBorder ?? ''};border-radius:20px;transition:background .18s ease`,
                      )}
                    >
                      <button
                        onClick={s?.toggle}
                        style={{
                          appearance: 'none',
                          border: '0',
                          background: 'transparent',
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 14px 10px 10px',
                          minHeight: '60px',
                          cursor: 'pointer',
                          textAlign: 'left',
                        }}
                      >
                        <span
                          style={$css(
                            `width:42px;height:42px;border-radius:14px;background:${s?.tint ?? ''};color:${s?.ink ?? ''};display:grid;place-items:center;flex-shrink:0`,
                          )}
                        >
                          {$i(s?.icon)}
                        </span>
                        <span style={{ flex: '1', font: '600 16px Jost,sans-serif', color: '#10233a' }}>
                          {$i(s?.label)}
                        </span>
                        <span
                          style={$css(
                            `display:flex;color:#7a6a58;transform:${s?.chev ?? ''};transition:transform .24s cubic-bezier(.23,1,.32,1)`,
                          )}
                        >
                          {$i(iconChev)}
                        </span>
                      </button>
                      {s?.open ? (
                        <>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '14px',
                              padding: '0 16px 16px 64px',
                              animation: 'shMobIn .2s cubic-bezier(.23,1,.32,1)',
                            }}
                          >
                            {$list(s?.groups).map((g, $index) => (
                              <Fragment key={$index}>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                  <span
                                    style={{
                                      font: '600 11.5px Figtree,sans-serif',
                                      letterSpacing: '.1em',
                                      textTransform: 'uppercase',
                                      color: '#7a6a58',
                                      paddingBottom: '2px',
                                    }}
                                  >
                                    {$i(g?.title)}
                                  </span>
                                  {$list(g?.items).map((it, $index) => (
                                    <Fragment key={$index}>
                                      <$A
                                        className="scp0"
                                        href={it?.href}
                                        style={{
                                          font: '500 15px Figtree,sans-serif',
                                          color: '#1f3550',
                                          padding: '10px 0',
                                        }}
                                      >
                                        {$i(it?.label)}
                                      </$A>
                                    </Fragment>
                                  ))}
                                </div>
                              </Fragment>
                            ))}
                            <$A
                              href={s?.allHref}
                              style={$css(
                                `display:inline-flex;align-items:center;gap:8px;font:600 14px Jost,sans-serif;color:${s?.deep ?? ''}`,
                              )}
                            >
                              {$i(s?.allLabel)}
                              {$i(iconArrowSm)}
                            </$A>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </Fragment>
                ))}
                <$A
                  className="scp24 scpg"
                  href="tel:+18558854747"
                  style={{
                    marginTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    height: '56px',
                    borderRadius: '999px',
                    background: '#10233a',
                    color: '#fff',
                    font: '600 16px Jost,sans-serif',
                  }}
                >
                  <span
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: '#D82028',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {$i(iconPhone)}
                  </span>
                  Call 1-855-885-4747 · Free 24/7
                </$A>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export const ownCss =
  '\n*{box-sizing:border-box}\na{text-decoration:none}\n@keyframes shMobIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}\n';
export const css = [ownCss].filter(Boolean).join('\n');
export const defaults = { layout: 'columns', active: '' };
const View = createDC('SiteHeader', Component, template);
export default View;
