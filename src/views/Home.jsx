'use client';
// Generated from Home.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = {
    menu: null,
    tab: 0,
    slide: 0,
    topIn: false,
    topHov: null,
    vw: 1280,
    adOpen: null,
    callHov: null,
    fcHov: null,
    fcCall: null,
    locIn: false,
    locHov: null,
    locCity: null,
    map: null,
    tabHov: null,
  };
  locRef = React.createRef();
  atPanelRef = React.createRef();
  componentDidUpdate(pp, ps) {
    const el = this.atPanelRef.current;
    if (ps.tab !== this.state.tab && el && el.animate)
      el.animate(
        [
          { opacity: 0, transform: 'translateY(8px)', filter: 'blur(3px)' },
          { opacity: 1, transform: 'none', filter: 'blur(0)' },
        ],
        { duration: 320, easing: 'cubic-bezier(.23,1,.32,1)' },
      );
  }
  sliderRef = React.createRef();
  topRef = React.createRef();
  componentDidMount() {
    this._rs = () => {
      const w = document.documentElement.clientWidth;
      if (w !== this.state.vw) this.setState({ vw: w });
    };
    this._rs();
    window.addEventListener('resize', this._rs);
    const el = this.topRef.current;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || !window.IntersectionObserver || reduce) {
      this.setState({ topIn: true, locIn: true });
      fetch('/assets/canada-map.json')
        .then((r) => r.json())
        .then((map) => this.setState({ map }))
        .catch(() => {});
      return;
    }
    this._io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          this.setState({ topIn: true });
          this._io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    this._io.observe(el);
    fetch('/assets/canada-map.json')
      .then((r) => r.json())
      .then((map) => this.setState({ map }))
      .catch(() => {});
    const le = this.locRef.current;
    if (le) {
      this._io2 = new IntersectionObserver(
        (es) => {
          if (es.some((e) => e.isIntersecting)) {
            this.setState({ locIn: true });
            this._io2.disconnect();
          }
        },
        { threshold: 0.12 },
      );
      this._io2.observe(le);
    } else this.setState({ locIn: true });
  }
  componentWillUnmount() {
    if (this._io) this._io.disconnect();
    if (this._io2) this._io2.disconnect();
    window.removeEventListener('resize', this._rs);
  }
  perView = 3;
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
    const R = React.createElement;
    const B = 'https://addictionrehabcenters.ca/';
    const { menu, tab } = this.state;
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
      heart: this.icon(['M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z'], {
        width: 22,
        height: 22,
      }),
      maple: this.icon(
        [
          'M12 3l1.8 3.5 3.2-1-1 3.5 3.5 1.5-3 2.5 2 3-4-.5-.5 3.5-2-2.5-2 2.5-.5-3.5-4 .5 2-3-3-2.5 3.5-1.5-1-3.5 3.2 1z',
        ],
        { width: 18, height: 18, strokeWidth: 1.4 },
      ),
      phone: this.icon(['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z']),
      mail: this.icon([{ t: 'rect', a: { x: 3, y: 5, width: 18, height: 14, rx: 2 } }, 'M3 7l9 6 9-6']),
      person: this.icon([{ t: 'circle', a: { cx: 12, cy: 8, r: 4 } }, 'M4 21a8 8 0 0 1 16 0'], {
        width: 28,
        height: 28,
      }),
      hands2: this.icon(['M4 13l4-4 3 3', 'M20 13l-4-4-3 3', 'M4 13v5l5 3h6l5-3v-5', 'M12 12v4'], {
        width: 28,
        height: 28,
      }),
      leaf: this.icon(['M20 4C9 4 4 10 4 20c10 0 16-5 16-16z', 'M4 20L14 10'], { width: 22, height: 22 }),
      rx: this.icon(
        [{ t: 'rect', a: { x: 4, y: 3, width: 16, height: 18, rx: 2 } }, 'M9 8h6', 'M12 5v6', 'M8 15h8', 'M8 18h5'],
        { width: 22, height: 22 },
      ),
      dual: this.icon(
        [
          { t: 'circle', a: { cx: 9, cy: 12, r: 6 } },
          { t: 'circle', a: { cx: 15, cy: 12, r: 6 } },
        ],
        { width: 22, height: 22 },
      ),
    };

    const provinces = [
      { label: 'Alberta Rehabs', href: B + 'alberta-rehabs/', code: 'AB' },
      {
        label: 'British Columbia Rehabs',
        href: B + 'british-columbia-rehabs/',
        code: 'BC',
        children: [{ label: 'Vancouver Rehabs', href: B + '7-best-drug-alcohol-rehab-centres-in-vancouver-2025/' }],
      },
      { label: 'Manitoba Rehabs', href: B + 'manitoba-rehabs/', code: 'MB' },
      { label: 'New Brunswick Rehabs', href: B + 'new-brunswick-rehabs/', code: 'NB' },
      { label: 'Newfoundland and Labrador Rehabs', href: B + 'newfoundland-and-labrador-rehabs/', code: 'NL' },
      { label: 'Northwest Territories Rehabs', href: B + 'northwest-territories-rehabs/', code: 'NT' },
      { label: 'Nova Scotia Rehabs', href: B + 'nova-scotia-rehabs/', code: 'NS' },
      {
        label: 'Ontario Rehabs',
        href: B + 'ontario-rehabs/',
        code: 'ON',
        children: [
          { label: 'Toronto Rehabs', href: B + 'toronto-rehabs/' },
          { label: 'Ottawa Rehabs', href: B + 'ottawa-rehabs/' },
        ],
      },
      { label: 'Prince Edward Island Rehabs', href: B + 'prince-edward-island-rehabs/', code: 'PE' },
      { label: 'Saskatchewan Rehabs', href: B + 'saskatchewan-rehabs/', code: 'SK' },
      {
        label: 'Quebec Rehabs',
        href: B + 'drug-alcohol-rehabs-in-quebec/',
        code: 'QC',
        children: [{ label: 'Montreal Rehabs', href: B + 'montreal-rehabs/' }],
      },
    ];
    const drugs = [
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
    ].map((s) => {
      const [label, p] = s.split('|');
      return { label, href: B + p + '/' };
    });

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
        links: [
          { label: 'Alcohol Addiction', href: '/alcohol' },
          { label: 'Am I An Alcoholic?', href: B + 'am-i-an-alcoholic/' },
          { label: 'AA Support Group', href: B + 'aa-support-group/' },
          { label: 'Detox Centres in Canada', href: B + 'detox-centres-in-canada/' },
        ],
      },
      intervention: {
        title: 'Intervention',
        sub: 'Help a loved one take the first step',
        icon: ic.hands,
        cols: 'repeat(2,1fr)',
        links: [
          { label: 'Intervention', href: '/intervention' },
          { label: 'Drugs and Alcohol Intervention', href: B + 'drugs-and-alcohol-intervention/' },
          { label: 'Drug Intervention Treatment Centres', href: B + 'drug-intervention-treatment-centres/' },
        ],
      },
      therapists: {
        title: 'Find a Therapist',
        sub: 'Registered psychotherapists, psychologists and addiction counsellors',
        icon: this.icon([{ t: 'circle', a: { cx: 12, cy: 8, r: 4 } }, 'M4 21a8 8 0 0 1 16 0']),
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
          { label: 'Promote Your Centre', href: B + 'promote-your-centre/' },
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

    const locations = [
      ...provinces.map((p) => ({ label: p.label, href: p.href, code: p.code })),
      { label: 'Nunavut Rehabs', href: B + 'nunavut-drug-rehab-centers/', code: 'NU' },
      { label: 'Yukon Rehabs', href: B + 'rehab/yukon-drug-rehab-treatments/', code: 'YT' },
    ];

    // Up to 10 centres — populated from the backend later. Google rating/review counts are sample values.
    const centres = [
      {
        name: 'Inspire Change Wellness Center',
        href: B + 'inspire-change-wellness-center/',
        category: 'British Columbia Rehabs',
        catHref: B + 'listing-category/british-columbia-rehabs/',
        address: '15216 North Bluff Rd, White Rock, BC V4B 0A7, Canada',
        excerpt:
          'Welcome to Inspire Change Wellness. We offer addiction treatment services and mental health care for…',
        rating: '4.9',
        googleReviews: 128,
        featured: true,
        verified: true,
        photo: 'photo · Inspire-Change-Wellness-Center.jpg',
      },
      {
        name: 'Rose City Recovery Addiction Treatment Centre',
        href: B + 'rose-city-recovery-addiction-treatment-centre/',
        category: 'Ontario Rehabs',
        catHref: B + 'listing-category/ontario-rehabs/',
        address: '371 Niagara St, Welland, ON L3C 1L1, Canada',
        excerpt:
          'Rose City Recovery is a leading addiction treatment center in Welland, Ontario, dedicated to providi…',
        rating: '4.8',
        googleReviews: 64,
        featured: false,
        verified: false,
        photo: 'photo · Rose-City-Recovery.webp',
      },
      {
        name: 'Metamorphosis Centre for Change',
        href: B + 'metamorphosis-centre-for-change/',
        category: 'Ontario Rehabs',
        catHref: B + 'listing-category/ontario-rehabs/',
        address: 'Wasaga Beach, ON, Canada',
        excerpt:
          'Metamorphosis Centre for Change: A Philosophy of Transformation. Metamorphosis Centre for Change aims…',
        rating: '5.0',
        googleReviews: 92,
        featured: false,
        verified: false,
        photo: 'photo · Metamorphosis-Centre-for-Change.webp',
      },
      {
        name: 'Centre slot 4',
        href: '#',
        category: 'Alberta Rehabs',
        catHref: B + 'alberta-rehabs/',
        address: 'Calgary, AB, Canada',
        excerpt: 'Description added from the backend…',
        rating: '4.9',
        googleReviews: 41,
        featured: false,
        verified: true,
        photo: 'photo · centre-4.jpg',
      },
      {
        name: 'Centre slot 5',
        href: '#',
        category: 'Quebec Rehabs',
        catHref: B + 'drug-alcohol-rehabs-in-quebec/',
        address: 'Montreal, QC, Canada',
        excerpt: 'Description added from the backend…',
        rating: '4.7',
        googleReviews: 57,
        featured: false,
        verified: false,
        photo: 'photo · centre-5.jpg',
      },
      {
        name: 'Centre slot 6',
        href: '#',
        category: 'Nova Scotia Rehabs',
        catHref: B + 'nova-scotia-rehabs/',
        address: 'Halifax, NS, Canada',
        excerpt: 'Description added from the backend…',
        rating: '4.8',
        googleReviews: 33,
        featured: false,
        verified: false,
        photo: 'photo · centre-6.jpg',
      },
    ];
    // Top 3 by Google rating — sample values until connected to the backend.
    const { topIn, topHov, adOpen, callHov } = this.state;
    const ad = !!adOpen;
    const adVals = {
      adShow: () => this.setState({ adOpen: true }),
      adHide: () => this.setState({ adOpen: null }),
      adToggle: () => this.setState((s) => ({ adOpen: s.adOpen ? null : true })),
      adExpanded: ad ? 'true' : 'false',
      adOp: ad ? '1' : '0',
      adVis: ad ? 'visible' : 'hidden',
      adTf: ad ? 'none' : 'translateY(-4px) scale(.96)',
      adTr: ad
        ? 'opacity .16s ease-out, transform .2s cubic-bezier(.23,1,.32,1), visibility 0s'
        : 'opacity .12s ease-out, transform .12s ease-out, visibility 0s linear .12s',
    };
    const top = [
      {
        name: 'Metamorphosis Centre for Change',
        city: 'Wasaga Beach, ON',
        href: B + 'metamorphosis-centre-for-change/',
        rating: this.props.topRating ?? '5.0',
        reviews: this.props.topReviews ?? '92',
        tel: 'tel:+17059966522',
        phone: '705-996-6522',
        excerpt:
          'A premier private residential treatment facility dedicated to transforming lives through compassionate, comprehensive care.',
      },
      {
        name: 'Inspire Change Wellness Center',
        city: 'White Rock, BC',
        href: B + 'inspire-change-wellness-center/',
        rating: '4.9',
        reviews: '128',
        tel: 'tel:+18558854747',
        phone: '1-855-885-4747',
        excerpt: 'Welcome to Inspire Change Wellness. We offer addiction treatment services and mental health care.',
      },
      {
        name: 'Rose City Recovery',
        city: 'Welland, ON',
        href: B + 'rose-city-recovery-addiction-treatment-centre/',
        rating: '4.8',
        reviews: '64',
        tel: 'tel:+18558854747',
        phone: '1-855-885-4747',
        excerpt: 'Rose City Recovery is a leading addiction treatment center in Welland, Ontario.',
      },
    ];
    const medals = [
      ['linear-gradient(145deg,#ffe29a,#e8a93a)', '#5a3a05'],
      ['linear-gradient(145deg,#f4f7fa,#b9c4cf)', '#2c3a48'],
      ['linear-gradient(145deg,#f6cfa8,#c07a45)', '#4a2710'],
    ];
    const topCentres = top.map((c, i) => {
      const on = topHov === i,
        r = parseFloat(c.rating) || 0;
      return {
        ...c,
        slot: 'home-top-rated-' + (i + 1),
        ph: 'Photo: ' + c.name,
        callLabel: i === 0 ? 'Call ' + c.name : 'Call our free helpline',
        enter: () => this.setState({ topHov: i }),
        leave: () => this.setState((s) => (s.topHov === i ? { topHov: null } : null)),
        op: topIn ? '1' : '0',
        tf: topIn ? 'none' : 'translateY(36px) scale(.98)',
        delay: 0.12 + i * 0.12 + 's',
        lift: on ? 'translateY(-6px)' : 'none',
        border: on ? '#cfe4f5' : '#e6eef6',
        btnBg: on ? '#0670b8' : '#0890E8',
        shadow: on ? '0 36px 60px -30px rgba(16,35,58,.35)' : '0 18px 36px -28px rgba(16,35,58,.25)',
        zoom: on ? 'scale(1.05)' : 'scale(1)',
        titleColor: on ? '#0890E8' : '#10233a',
        arrowTf: on ? 'translateX(3px)' : 'none',
        callEnter: () => this.setState({ callHov: i }),
        callLeave: () => this.setState((s) => (s.callHov === i ? { callHov: null } : null)),
        callBg: callHov === i ? '#D82028' : '#fff',
        callColor: callHov === i ? '#fff' : '#10233a',
        callBorder: callHov === i ? '#D82028' : '#f3d6d4',
        callIconBg: callHov === i ? 'rgba(255,255,255,.2)' : '#fdeceb',
        callIconColor: callHov === i ? '#fff' : '#D82028',
        wiggle: callHov === i ? 'topCallWiggle .7s ease-in-out' : 'none',
        ringDelay: i * 0.4 + 's',
        medalBg: medals[i][0],
        medalInk: medals[i][1],
        medalTf: topIn ? 'scale(1) rotate(0deg)' : 'scale(.6) rotate(-25deg)',
        medalDelay: 0.45 + i * 0.12 + 's',
        shine: topIn ? 'translateX(260%) skewX(-20deg)' : 'translateX(-160%) skewX(-20deg)',
        shineDelay: 0.8 + i * 0.12 + 's',
        starClip: topIn ? 'inset(0 ' + (100 - (r / 5) * 100).toFixed(1) + '% 0 0)' : 'inset(0 100% 0 0)',
        starDelay: 0.6 + i * 0.12 + 's',
      };
    });
    const { locIn, locHov, locCity, map } = this.state;
    const byCode = {};
    locations.forEach((l) => {
      byCode[l.code] = l;
    });
    const regionDefs = [
      { title: 'Western Canada', codes: ['BC', 'AB', 'SK', 'MB'], fill: '#d3eadb' },
      { title: 'Central Canada', codes: ['ON', 'QC'], fill: '#d2e7f8' },
      { title: 'Atlantic Canada', codes: ['NB', 'NS', 'PE', 'NL'], fill: '#cfe9e6' },
      { title: 'Northern Canada', codes: ['YT', 'NT', 'NU'], fill: '#e2ddf5' },
    ];
    const fillOf = {};
    regionDefs.forEach((r) =>
      r.codes.forEach((c) => {
        fillOf[c] = r.fill;
      }),
    );
    const setHov = (k) => () => this.setState({ locHov: k });
    const clrHov = (k) => () => this.setState((s) => (s.locHov === k ? { locHov: null } : null));
    const regions = regionDefs.map((rg) => ({
      title: rg.title,
      swatch: rg.fill,
      items: rg.codes
        .filter((c) => byCode[c])
        .map((c) => {
          const l = byCode[c],
            on = locHov === c;
          return {
            code: c,
            label: l.label.replace(/ Rehabs$/, ''),
            href: l.href,
            enter: setHov(c),
            leave: clrHov(c),
            bg: on ? '#eaf5fd' : 'transparent',
            tileBg: on ? '#0890E8' : '#f5f9fd',
            tileColor: on ? '#fff' : '#1f3550',
            labelColor: on ? '#0a5d96' : '#10233a',
            arrowOp: on ? '1' : '0',
            arrowX: on ? '0' : '-6px',
          };
        }),
    }));
    const cityHref = {};
    provinces.forEach((p) =>
      (p.children || []).forEach((c) => {
        cityHref[c.label.replace(/ Rehabs$/, '')] = c.href;
      }),
    );
    const popCities = ['Toronto', 'Vancouver', 'Montreal', 'Ottawa']
      .filter((n) => cityHref[n])
      .map((n) => {
        const on = locCity === n;
        return {
          label: n,
          href: cityHref[n],
          enter: () => this.setState({ locCity: n }),
          leave: () => this.setState((s) => (s.locCity === n ? { locCity: null } : null)),
          bg: on ? '#fdeceb' : '#f5f9fd',
          border: on ? '#f3c9c6' : 'transparent',
          color: on ? '#b1161d' : '#1f3550',
        };
      });
    const provs = map ? map.provinces : [];
    const minLon = -141,
      lonSpan = 88;
    const mapProvs = provs.map((p) => {
      const on = locHov === p.code,
        dim = locHov && !on;
      return {
        d: p.d,
        enter: setHov(p.code),
        go: () => {
          const l = byCode[p.code];
          if (l) window.location.href = l.href;
        },
        fill: on ? '#0890E8' : fillOf[p.code] || '#e6eef6',
        op: locIn ? (dim ? '.55' : '1') : '0',
        tf: locIn ? (on ? 'translateY(-6px)' : 'none') : 'translateY(14px)',
        filter: on ? 'drop-shadow(0 10px 12px rgba(8,100,170,.35))' : 'none',
        delay: locIn && this._mapRevealed ? '0s' : (0.2 + ((p.lon - minLon) / lonSpan) * 0.7).toFixed(2) + 's',
      };
    });
    if (locIn && map && !this._mapRevealed)
      setTimeout(() => {
        this._mapRevealed = true;
      }, 1600);
    const labelPos = { PE: [884, 636], NS: [906, 678], NB: [835, 668], NU: [470, 430], NL: [945, 552] };
    const mapLabels = provs.map((p) => {
      const [x, y] = labelPos[p.code] || [p.cx, p.cy];
      return {
        code: p.code,
        x: String(x),
        y: String(y),
        color: locHov === p.code ? '#fff' : '#1f3550',
        op: locIn ? (p.code === 'PE' ? '0' : '1') : '0',
        delay: '0.9s',
      };
    });
    const mapCities = (map ? map.cities : []).map((c, i) => ({
      x: String(c.x),
      y: String(c.y),
      r: locCity === c.name ? '9' : '6',
      op: locIn ? '1' : '0',
      delay: i * 0.5 + 's',
    }));
    const hp = locHov && provs.find((p) => p.code === locHov);
    const tip = hp ? labelPos[hp.code] || [hp.cx, hp.cy] : null;
    const { fcHov, fcCall } = this.state;
    const centreCards = centres.map((c, i) => {
      const on = fcHov === i,
        ch = fcCall === i,
        r = parseFloat(c.rating) || 0;
      const parts = c.address
        .split(',')
        .map((x) => x.trim())
        .filter((x) => x && x !== 'Canada');
      const city =
        parts.length >= 2 ? parts[parts.length - 2] + ', ' + parts[parts.length - 1].split(' ')[0] : c.address;
      return {
        name: c.name,
        href: c.href,
        excerpt: c.excerpt,
        rating: c.rating,
        reviews: String(c.googleReviews),
        featured: c.featured,
        verified: c.verified,
        city,
        slot: 'home-featured-' + (i + 1),
        ph: 'Photo: ' + c.name,
        tel: 'tel:+18558854747',
        callLabel: 'Call our free helpline about ' + c.name,
        enter: () => this.setState({ fcHov: i }),
        leave: () => this.setState((s) => (s.fcHov === i ? { fcHov: null } : null)),
        lift: on ? 'translateY(-6px)' : 'none',
        border: on ? '#cfe4f5' : '#e6eef6',
        btnBg: on ? '#0670b8' : '#0890E8',
        shadow: on ? '0 30px 50px -30px rgba(16,35,58,.35)' : '0 14px 30px -26px rgba(16,35,58,.25)',
        zoom: on ? 'scale(1.05)' : 'scale(1)',
        titleColor: on ? '#0890E8' : '#10233a',
        arrowTf: on ? 'translateX(3px)' : 'none',
        starClip: 'inset(0 ' + (100 - (r / 5) * 100).toFixed(1) + '% 0 0)',
        callEnter: () => this.setState({ fcCall: i }),
        callLeave: () => this.setState((s) => (s.fcCall === i ? { fcCall: null } : null)),
        callBg: ch ? '#D82028' : '#fff',
        callColor: ch ? '#fff' : '#10233a',
        callBorder: ch ? '#D82028' : '#f3d6d4',
        callIconBg: ch ? 'rgba(255,255,255,.2)' : '#fdeceb',
        callIconColor: ch ? '#fff' : '#D82028',
        wiggle: ch ? 'topCallWiggle .7s ease-in-out' : 'none',
        ringDelay: (i % 3) * 0.4 + 0.2 + 's',
      };
    });
    const { slide } = this.state;
    const pages = Math.max(1, Math.ceil(centres.length / this.perView));
    const slideDots = Array.from({ length: pages }, (_, i) => ({
      go: () => this.slideTo(i, centres.length),
      w: i === slide ? '28px' : '8px',
      bg: i === slide ? '#0890E8' : '#dbe6f0',
    }));
    const onSlideScroll = (e) => {
      const el = e.currentTarget;
      const pg = Math.round(el.scrollLeft / el.clientWidth);
      if (pg !== this.state.slide) this.setState({ slide: pg });
    };

    const programs = [
      {
        title: 'Drug Addiction Rehab Toronto',
        icon: ic.leaf,
        cta: 'Find A Drug Rehab',
        photo: '/assets/img/prog-drug.jpg',
        body: 'Rehabilitation Centre Toronto: The symptoms of drug addiction are designed to keep you using. The "reality" drug addiction convinces you of is not real at all. The world doesn\'t have to be miserable, and you don\'t have to spend your life as an addict. Let us help you chart a course to permanent, content sobriety at our state-of-the-art drug rehab facilities.',
      },
      {
        title: 'Alcohol Rehab',
        icon: ic.glass,
        cta: 'Find An Alcohol Rehab',
        photo: '/assets/img/prog-alcohol.jpg',
        body: 'Let us show you how you can live in an alcohol-saturated world without giving in to temptation. All you need to do is avoid drinking. This might seem challenging, even impossible, at first, but we can show you how to achieve sobriety that lasts a lifetime. We can help you get out of the cycle of alcohol addiction with Alcohol Rehab Program.',
      },
      {
        title: 'Prescription Drug Rehab',
        icon: ic.rx,
        cta: 'Find A Prescription Drug Rehab',
        photo: '/assets/img/prog-rx.jpg',
        body: "The prescription drug rehabilitation process begins with detoxing from prescription drugs. In most cases, this will mean quitting cold turkey, but if you have a medical condition, you might steadily taper down your dose instead. We'll work with you to manage the symptoms of detox, and offer a steady stream of encouragement as you cope with cravings.",
      },
      {
        title: 'Dual Diagnosis',
        icon: ic.dual,
        cta: 'Find A Dual Diagnosis Center',
        photo: '/assets/img/prog-dual.jpg',
        body: "The clinical term for a mental illness that occurs alongside a drug or alcohol addiction is dual diagnosis. If you're truly committed to last sobriety, you need to treat both. At Toronto Addiction Rehab Centres, we specialize in helping people chart a course out of the darkness of mental illness and addiction, and into the light of sobriety and sound mental health.",
      },
    ].map((p, i) => ({ ...p, dir: i % 2 ? 'rtl' : 'ltr' }));

    const tabData = [
      {
        label: 'Marijuana Addiction',
        href: B + 'marijuana-addiction/',
        photo: 'photo · Marijuana-Addiction.jpg',
        body: 'When someone abuses marijuana and craves for it to keep himself going then this is called marijuana addiction. In other words, a person is not capable functioning normally without a dose of cannabis…',
      },
      {
        label: 'Heroin Addiction',
        href: B + 'heroin-addiction/',
        photo: 'photo · Heroin-Addiction.jpg',
        body: "Heroin addiction is known as one of the most common drug-related problems in Canada through the years. In 2004, a survey was conducted and it appeared that 1 percent of the country's population…",
      },
      {
        label: 'Cocaine Addiction',
        href: B + 'cocaine-addiction/',
        photo: 'photo · Cocain-Addiction.jpg',
        body: "Cocaine addiction is one of the most common problems not only in Canada but in many different parts of the world today. In 2004, about 10.6 of the country's population said that they had made use of cocaine…",
      },
      {
        label: 'Opioids Addiction',
        href: B + 'opioids-addiction/',
        photo: 'photo · Opioids-Addiction.jpg',
        body: 'Opioid addiction comes with many familiar stories and one of these is the story of a person who has almost everything in this life: a great career, loving family, money, etc. Then all of a sudden, an accident happened and this has…',
      },
      {
        label: 'Meth Addiction',
        href: B + 'meth-addiction/',
        photo: 'photo · Meth-Addiction.jpg',
        body: 'Methamphetamine (Meth) addiction is a very massive and significant drug-related problem not only in Canada but all over the world as well. It happens when a person develops tolerance to methyl amphetamine that actually…',
      },
      {
        label: 'Prescription Drug Addiction',
        href: B + 'prescription-drugs-addiction/',
        photo: 'photo · Prescription-Drug-Addiction.jpg',
        body: 'Prescription drugs are legal drugs which are commonly prescribed and used due to their medicinal value. Unfortunately, there are people who abuse these drugs, using them for recreational purposes instead of treating illnesses…',
      },
    ];
    const vwT = this.state.vw,
      wideT = vwT >= 1000,
      tabHov = this.state.tabHov;
    const tabs = tabData.map((t, i) => {
      const on = i === tab,
        hv = tabHov === i && !on;
      return {
        label: t.label,
        num: String(i + 1).padStart(2, '0'),
        pressed: on ? 'true' : 'false',
        select: () => this.setState({ tab: i }),
        hover: () => this.setState({ tabHov: i }),
        unhover: () => this.setState((s) => (s.tabHov === i ? { tabHov: null } : null)),
        bg: on ? '#fff' : hv ? 'rgba(255,255,255,.6)' : 'transparent',
        shadow: on ? '0 10px 24px -14px rgba(16,35,58,.35)' : 'none',
        color: on ? '#0a5d96' : '#3b4d63',
        numColor: on ? '#0890E8' : '#9aabbd',
        arrowDisplay: wideT ? 'flex' : 'none',
        arrowOp: on ? '1' : '0',
        arrowX: on ? '0' : '-6px',
      };
    });
    const trImgs = [
      '/assets/img/tr-marijuana.jpg',
      '/assets/img/tr-heroin.jpg',
      '/assets/img/tr-cocaine.jpg',
      '/assets/img/tr-opioids.jpg',
      '/assets/img/tr-meth.jpg',
      '/assets/img/tr-rx.jpg',
    ];
    const atSlots = tabData.map((t, i) => ({
      src: trImgs[i],
      alt: t.label + ' treatment',
      display: i === tab ? 'block' : 'none',
    }));

    const kinds = [
      [
        'Intervention',
        'professional interventionists meet with addicts and their loved ones to discuss how the addiction has impacted them and their relationships.',
      ],
      [
        'Inpatient rehab',
        'sometimes the best thing for an addict is to be removed from the "real world" so that the sole focus can be on recovery.',
      ],
      [
        'Continuing care',
        'when a rehab program comes to an end, a continuing care program will support the addict through his or her long term sobriety goals.',
      ],
      [
        'Therapy',
        "group therapy allows the addict to learn from the perspectives of others; group therapy provides the benefit of other peoples' perspectives.",
      ],
      [
        'Medical detox',
        'addicts can be placed in the care of a doctor, who supervises the process of withdrawal, which can be frightening and dangerous.',
      ],
    ].map(([title, body], i) => ({ n: '0' + (i + 1), title, body }));

    const L = (arr) =>
      arr.map((s) => {
        const [label, p] = s.split('|');
        return { label, href: B + p + '/' };
      });
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

    return {
      navItems,
      menuOpen: !!m,
      closeMenu: () => this.setState({ menu: null }),
      menuTitle: m?.title,
      menuSub: m?.sub,
      menuIcon: m?.icon,
      menuCols: m?.cols || '1fr',
      menuLinks: m?.links || [],
      iconHeart: ic.heart,
      iconMaple: ic.maple,
      iconPhone: ic.phone,
      iconMail: ic.mail,
      iconPerson: ic.person,
      iconHands: ic.hands2,
      livesCount: this.props.livesCount ?? '11.2k',
      treatmentsCount: this.props.treatmentsCount ?? '30',
      locations,
      centres,
      programs,
      sliderRef: this.sliderRef,
      onSlideScroll,
      slideDots,
      slidePos: slide + 1 + ' / ' + pages,
      slidePrev: () => this.slideTo(slide - 1, centres.length),
      slideNext: () => this.slideTo(slide + 1, centres.length),
      topRef: this.topRef,
      topCentres,
      locRef: this.locRef,
      regions,
      popCities,
      locGrid: this.state.vw >= 1000 ? 'minmax(0,.92fr) minmax(0,1.08fr)' : 'minmax(0,1fr)',
      locListCols: this.state.vw >= 520 ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      locHeadOp: locIn ? '1' : '0',
      locHeadTf: locIn ? 'none' : 'translateY(16px)',
      locMapOp: locIn ? '1' : '0',
      locMapTf: locIn ? 'none' : 'translateY(20px) scale(.98)',
      mapReady: !!map,
      mapLoading: !map,
      mapProvs,
      mapLabels,
      mapCities,
      mapLeave: () => this.setState({ locHov: null }),
      tipX: tip ? tip[0] / 10 + '%' : '50%',
      tipY: tip ? tip[1] / 8.5 + '%' : '50%',
      tipOp: hp ? '1' : '0',
      tipScale: hp ? '1' : '.94',
      tipName: hp ? (byCode[hp.code] ? byCode[hp.code].label.replace(/ Rehabs$/, '') : hp.name) : '',
      hintOp: locHov ? '0' : '1',
      iconStarFill: React.createElement(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 24 24' },
        React.createElement('path', {
          d: 'M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9z',
          fill: '#F5B83D',
        }),
      ),
      iconSeal: React.createElement(
        'svg',
        { width: 16, height: 16, viewBox: '0 0 24 24' },
        React.createElement('path', {
          d: 'M12 1.8l2.4 1.8 3-.2.9 2.9 2.5 1.7-.9 2.9.9 2.9-2.5 1.7-.9 2.9-3-.2L12 20.2l-2.4-1.8-3 .2-.9-2.9-2.5-1.7.9-2.9-.9-2.9 2.5-1.7.9-2.9 3 .2z',
          fill: '#0890E8',
        }),
        React.createElement('path', {
          d: 'M8.2 11.3l2.6 2.6 5-5',
          fill: 'none',
          stroke: '#fff',
          strokeWidth: 2.2,
          strokeLinecap: 'round',
          strokeLinejoin: 'round',
        }),
      ),
      centreCards,
      slideCol: this.state.vw < 680 ? '85%' : 'calc((100% - 48px)/3)',
      callText: this.state.vw >= 1180 || this.state.vw < 680 ? 'Call now' : 'Call',
      viewText: this.state.vw >= 1180 || this.state.vw < 680 ? 'View centre' : 'View',
      ...adVals,
      topCols:
        this.state.vw >= 1000
          ? 'repeat(3,minmax(0,1fr))'
          : this.state.vw >= 680
            ? 'repeat(3,minmax(0,1fr))'
            : 'minmax(0,1fr)',
      topHeadOp: topIn ? '1' : '0',
      topHeadTf: topIn ? 'none' : 'translateY(16px)',
      iconPinSm: this.icon(
        ['M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z', { t: 'circle', a: { cx: 12, cy: 10, r: 2.5 } }],
        { width: 14, height: 14, strokeWidth: 2 },
      ),
      iconArrowTop: this.icon(['M5 12h14', 'M13 6l6 6-6 6'], { width: 16, height: 16, strokeWidth: 2 }),
      iconPhoneTop: this.icon(
        ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'],
        { width: 16, height: 16, strokeWidth: 2 },
      ),
      tabs,
      activeTab: { ...tabData[tab], num: String(tab + 1).padStart(2, '0') },
      tabCount: String(tabData.length).padStart(2, '0'),
      atSlots,
      atPanelRef: this.atPanelRef,
      atHeadCols: wideT ? 'minmax(0,1fr) auto' : 'minmax(0,1fr)',
      atStatAlign: wideT ? 'end' : 'start',
      atCardCols: vwT >= 860 ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      atTabCols: wideT ? '300px minmax(0,1fr)' : 'minmax(0,1fr)',
      atTabDir: wideT ? 'column' : 'row',
      atPanelCols: vwT >= 760 ? 'minmax(0,.9fr) minmax(0,1.1fr)' : 'minmax(0,1fr)',
      kinds,
      footerCols,
      hopeCols: this.state.vw >= 960 ? 'minmax(0,1fr) minmax(0,1fr)' : 'minmax(0,1fr)',
      hopeGap: this.state.vw >= 960 ? '72px' : '32px',
      hopeH2: this.state.vw >= 640 ? '48px' : '34px',
      hopeBodyPad: this.state.vw >= 960 ? '52px' : '0',
      ctaCols: this.state.vw >= 960 ? 'minmax(0,.85fr) minmax(0,1.15fr)' : 'minmax(0,1fr)',
      ctaImgH: this.state.vw >= 960 ? '100%' : '280px',
      ctaFadeDir: this.state.vw >= 960 ? '90deg' : '180deg',
      ctaPad: this.state.vw >= 640 ? '56px' : '32px 24px',
      ctaH2: this.state.vw >= 640 ? '38px' : '30px',
      footGrid:
        this.state.vw >= 1000
          ? 'minmax(0,1.25fr) repeat(3,minmax(0,1fr))'
          : this.state.vw >= 680
            ? 'repeat(2,minmax(0,1fr))'
            : 'minmax(0,1fr)',
    };
  }
}

/* ───────────────────────── markup ───────────────────────── */
function template(v) {
  const {
    activeTab,
    adExpanded,
    adHide,
    adOp,
    adShow,
    adTf,
    adToggle,
    adTr,
    adVis,
    atCardCols,
    atHeadCols,
    atPanelCols,
    atPanelRef,
    atSlots,
    atStatAlign,
    atTabCols,
    atTabDir,
    callText,
    centreCards,
    ctaCols,
    ctaFadeDir,
    ctaH2,
    ctaImgH,
    ctaPad,
    footGrid,
    footerCols,
    hintOp,
    hopeBodyPad,
    hopeCols,
    hopeGap,
    hopeH2,
    iconArrowTop,
    iconHands,
    iconHeart,
    iconMail,
    iconMaple,
    iconPerson,
    iconPhone,
    iconPhoneTop,
    iconPinSm,
    iconSeal,
    iconStarFill,
    kinds,
    livesCount,
    locGrid,
    locHeadOp,
    locHeadTf,
    locListCols,
    locMapOp,
    locMapTf,
    locRef,
    mapCities,
    mapLabels,
    mapLeave,
    mapLoading,
    mapProvs,
    mapReady,
    onSlideScroll,
    popCities,
    programs,
    regions,
    slideCol,
    slideDots,
    slideNext,
    slidePos,
    slidePrev,
    sliderRef,
    tabCount,
    tabs,
    tipName,
    tipOp,
    tipScale,
    tipX,
    tipY,
    topCentres,
    topCols,
    topHeadOp,
    topHeadTf,
    topRef,
    treatmentsCount,
    viewText,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        <section
          data-screen-label="Hero"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background:
              'linear-gradient(180deg,rgba(255,255,255,0) 55%,#fff 100%),radial-gradient(1200px 600px at 80% -10%,#dbeefb 0%,rgba(219,238,251,0) 60%),#f7fafd',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '72px 32px 64px',
              display: 'grid',
              gridTemplateColumns: '1.1fr .9fr',
              gap: '56px',
              alignItems: 'center',
            }}
            data-cols="1.1fr .9fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  alignSelf: 'flex-start',
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '999px',
                  padding: '7px 14px 7px 8px',
                  font: '500 13px Figtree,sans-serif',
                  color: '#1f3550',
                }}
              >
                <span
                  style={{
                    background: '#D82028',
                    color: '#fff',
                    borderRadius: '999px',
                    padding: '3px 9px',
                    font: '600 11px Jost,sans-serif',
                    letterSpacing: '.08em',
                  }}
                >
                  HELP NOW
                </span>{' '}
                For immediate treatment help call{' '}
                <$A href="tel:+18558854747" style={{ fontWeight: '600' }}>
                  1-855-885-4747
                </$A>
              </div>
              <h1 style={{ fontSize: '58px', lineHeight: '1.04', fontWeight: '600', color: '#10233a' }} data-rc-lg="1">
                {'Find the Best Drug & Alcohol Rehab Centres in'} <span style={{ color: '#0890E8' }}>Canada</span>
              </h1>
              <h2 style={{ font: '400 20px/1.5 Figtree,sans-serif', color: '#516378', maxWidth: '560px' }}>
                {'Find The Best Alcohol & Drug Addiction Centres in Canada'}
              </h2>
              <form
                action="https://addictionrehabcenters.ca/rehab/search/"
                style={{
                  marginTop: '6px',
                  background: '#fff',
                  border: '1px solid #dbe6f0',
                  borderRadius: '16px',
                  padding: '8px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr auto',
                  gap: '8px',
                  boxShadow: '0 20px 50px -30px rgba(16,35,58,.35)',
                }}
                data-cols="1fr 1fr auto"
              >
                <label
                  className="scp1c"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '2px',
                    minHeight: '56px',
                    padding: '6px 14px',
                    borderRadius: '10px',
                  }}
                >
                  <span
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Location
                  </span>
                  <select
                    style={{
                      appearance: 'none',
                      border: '0',
                      background: 'transparent',
                      font: '500 15px Figtree,sans-serif',
                      color: '#10233a',
                      outline: 'none',
                      padding: '0',
                      cursor: 'pointer',
                    }}
                  >
                    <option>Anywhere in Canada</option>
                    <option>Alberta</option>
                    <option>British Columbia</option>
                    <option>Manitoba</option>
                    <option>New Brunswick</option>
                    <option>Newfoundland and Labrador</option>
                    <option>Northwest Territories</option>
                    <option>Nova Scotia</option>
                    <option>Ontario</option>
                    <option>Prince Edward Island</option>
                    <option>Quebec</option>
                    <option>Saskatchewan</option>
                    <option>Yukon</option>
                    <option>Nunavut</option>
                  </select>
                </label>
                <label
                  className="scp1c"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '2px',
                    minHeight: '56px',
                    padding: '6px 14px',
                    borderLeft: '1px solid #e9eff5',
                    borderRadius: '10px',
                  }}
                >
                  <span
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Treatment for
                  </span>
                  <select
                    style={{
                      appearance: 'none',
                      border: '0',
                      background: 'transparent',
                      font: '500 15px Figtree,sans-serif',
                      color: '#10233a',
                      outline: 'none',
                      padding: '0',
                      cursor: 'pointer',
                    }}
                  >
                    <option>Any addiction</option>
                    <option>Alcohol</option>
                    <option>Drugs</option>
                    <option>Prescription drugs</option>
                    <option>Dual diagnosis</option>
                    <option>Intervention</option>
                    <option>Detox</option>
                  </select>
                </label>
                <button
                  className="scpc"
                  type="submit"
                  style={{
                    appearance: 'none',
                    border: '0',
                    cursor: 'pointer',
                    font: '600 16px Jost,sans-serif',
                    color: '#fff',
                    background: '#0890E8',
                    padding: '0 22px',
                    borderRadius: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    whiteSpace: 'nowrap',
                    minHeight: '56px',
                    transition: 'background .18s',
                  }}
                >
                  <span
                    style={{
                      width: '14px',
                      height: '14px',
                      border: '2px solid #fff',
                      borderRadius: '50%',
                      display: 'inline-block',
                      flexShrink: '0',
                    }}
                  />
                  Start Your Journey{' '}
                </button>
              </form>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '14px',
                    background: '#eaf5fd',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#0890E8',
                  }}
                >
                  {$i(iconHeart)}
                </div>
                <div>
                  <div style={{ font: '600 26px Jost,sans-serif', lineHeight: '1', color: '#10233a' }}>
                    {$i(livesCount)} Lives
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7f95' }}>have already changed</div>
                </div>
                <div style={{ width: '1px', height: '36px', background: '#e3ecf4', margin: '0 6px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#516378' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#2fb46b' }} />
                  Available 24 hours, 7 days
                </div>
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '1/1',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  background: '#eaf2f8',
                  boxShadow: '0 40px 80px -40px rgba(16,35,58,.45)',
                }}
              >
                <img
                  src="/assets/img/home-hero.jpg"
                  alt="Residential treatment centre in the Canadian forest at golden hour"
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
              <div
                style={{
                  position: 'absolute',
                  left: '-28px',
                  bottom: '36px',
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '16px',
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  boxShadow: '0 20px 40px -24px rgba(16,35,58,.35)',
                }}
              >
                <span
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: '#fdecec',
                    color: '#D82028',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {$i(iconMaple)}
                </span>
                <div>
                  <div style={{ font: '600 14px Jost,sans-serif' }}>Coast to coast</div>
                  <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>
                    {'Centres in all 13 provinces & territories'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          data-screen-label="Top Rated Rehabs"
          ref={topRef}
          style={{
            position: 'relative',
            overflow: 'hidden',
            background:
              'radial-gradient(640px 380px at 8% 0%,rgba(8,144,232,.08),rgba(8,144,232,0) 70%),radial-gradient(560px 360px at 96% 30%,rgba(245,166,35,.07),rgba(245,166,35,0) 70%),#fff',
            color: '#10233a',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '0',
              right: '0',
              bottom: '0',
              height: '220px',
              background: 'linear-gradient(180deg,rgba(255,255,255,0),#fff 85%)',
              pointerEvents: 'none',
              zIndex: '0',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: '0',
              backgroundImage: 'radial-gradient(rgba(16,35,58,.07) 1px,transparent 1.2px)',
              backgroundSize: '22px 22px',
              WebkitMaskImage: 'radial-gradient(70% 60% at 85% 10%,#000,transparent)',
              maskImage: 'radial-gradient(70% 60% at 85% 10%,#000,transparent)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-140px',
              right: '6%',
              width: '380px',
              height: '380px',
              borderRadius: '50%',
              border: '1px solid rgba(8,144,232,.12)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '-70px',
              right: 'calc(6% + 70px)',
              width: '240px',
              height: '240px',
              borderRadius: '50%',
              border: '1px dashed rgba(8,144,232,.16)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '30%',
              left: '-160px',
              width: '420px',
              height: '420px',
              borderRadius: '50%',
              background: 'radial-gradient(circle,rgba(47,180,107,.06),rgba(47,180,107,0) 70%)',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'relative',
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '88px 32px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '44px',
            }}
            data-rc-wrap="1"
          >
            <div
              style={$css(
                `display:flex;align-items:flex-end;justify-content:space-between;gap:32px;flex-wrap:wrap;opacity:${topHeadOp ?? ''};transform:${topHeadTf ?? ''};transition:opacity .6s ease-out,transform .7s cubic-bezier(.23,1,.32,1)`,
              )}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '640px' }}>
                <span
                  style={{
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '30px',
                    padding: '0 13px 0 9px',
                    borderRadius: '999px',
                    background: '#fff7e8',
                    border: '1px solid #f6e3bf',
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#8a5a0b',
                  }}
                >
                  <span style={{ color: '#F5B83D', fontSize: '13px', letterSpacing: '0' }}>★</span>
                  Top Rated Rehabs
                </span>
                <h2
                  style={{ fontSize: '40px', lineHeight: '1.1', color: '#10233a', margin: '0', textWrap: 'balance' }}
                  data-rc-lg="1"
                >
                  Featured treatment centres across Canada
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }} onMouseEnter={adShow} onMouseLeave={adHide}>
                  {' '}
                  <button
                    className="scp1d scpy"
                    onClick={adToggle}
                    onFocus={adShow}
                    onBlur={adHide}
                    aria-expanded={adExpanded}
                    aria-label="About these ads"
                    style={{
                      appearance: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      height: '46px',
                      padding: '0 14px 0 16px',
                      borderRadius: '999px',
                      border: '1px solid #e3ecf4',
                      background: '#f5f9fd',
                      color: '#516378',
                      font: '700 12px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      transition: 'border-color .15s ease,transform .12s ease-out',
                    }}
                  >
                    AD
                    <span
                      style={{
                        width: '17px',
                        height: '17px',
                        borderRadius: '50%',
                        border: '1.5px solid currentColor',
                        display: 'grid',
                        placeItems: 'center',
                        font: '700 10.5px Georgia,serif',
                        letterSpacing: '0',
                        lineHeight: '1',
                      }}
                    >
                      i
                    </span>
                  </button>{' '}
                  <div
                    role="tooltip"
                    style={$css(
                      `position:absolute;top:calc(100% + 10px);left:0;z-index:5;width:min(280px,calc(100vw - 64px));background:#fff;border:1px solid #e3ecf4;border-radius:14px;padding:13px 15px;box-shadow:0 18px 36px -14px rgba(16,35,58,.35);font:400 13.5px/1.5 Figtree,sans-serif;color:#516378;text-wrap:pretty;text-align:left;transform-origin:top left;opacity:${adOp ?? ''};transform:${adTf ?? ''};visibility:${adVis ?? ''};transition:${adTr ?? ''}`,
                    )}
                  >
                    <strong
                      style={{
                        display: 'block',
                        font: '600 14px Jost,sans-serif',
                        color: '#10233a',
                        marginBottom: '3px',
                      }}
                    >
                      Sponsored listings
                    </strong>
                    These centres pay to be featured here. Placement is not an endorsement or a ranking. Ratings come
                    from Google reviews.
                  </div>
                </div>
                <$A
                  className="scp1e scpy"
                  href="https://addictionrehabcenters.ca/rehab/search/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '46px',
                    padding: '0 20px',
                    borderRadius: '999px',
                    border: '1px solid #d6e2ee',
                    background: '#fff',
                    font: '600 15px Jost,sans-serif',
                    color: '#10233a',
                    whiteSpace: 'nowrap',
                    transition: 'background .15s ease,border-color .15s ease,transform .12s ease-out',
                  }}
                >
                  See all centres
                  <span style={{ fontSize: '18px', lineHeight: '1' }}>→</span>
                </$A>
              </div>
            </div>
            <div style={$css(`display:grid;grid-template-columns:${topCols ?? ''};gap:24px`)} data-rc-dyn="1">
              {$list(topCentres).map((c, $index) => (
                <Fragment key={$index}>
                  <div
                    style={$css(
                      `opacity:${c?.op ?? ''};transform:${c?.tf ?? ''};transition:opacity .6s ease-out ${c?.delay ?? ''},transform .8s cubic-bezier(.23,1,.32,1) ${c?.delay ?? ''};display:flex;min-width:0`,
                    )}
                  >
                    <article
                      onMouseEnter={c?.enter}
                      onMouseLeave={c?.leave}
                      style={$css(
                        `position:relative;flex:1;min-width:0;display:flex;flex-direction:column;background:#fff;color:#10233a;border:1px solid ${c?.border ?? ''};border-radius:28px;padding:10px;box-shadow:${c?.shadow ?? ''};transform:${c?.lift ?? ''};transition:transform .35s cubic-bezier(.23,1,.32,1),box-shadow .35s ease,border-color .25s ease`,
                      )}
                    >
                      <$A
                        href={c?.href}
                        style={{
                          position: 'relative',
                          display: 'block',
                          aspectRatio: '16/11',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          background: '#eaf2f8',
                          isolation: 'isolate',
                        }}
                      >
                        <div
                          style={$css(
                            `position:absolute;inset:0;transform:${c?.zoom ?? ''};transition:transform .8s cubic-bezier(.23,1,.32,1)`,
                          )}
                        >
                          <image-slot id={c?.slot} shape="rect" placeholder={c?.ph} />
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            inset: 'auto 0 0 0',
                            height: '55%',
                            background: 'linear-gradient(0deg,rgba(16,35,58,.6),rgba(16,35,58,0))',
                            pointerEvents: 'none',
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            left: '12px',
                            right: '12px',
                            bottom: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            pointerEvents: 'none',
                          }}
                        >
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: 'rgba(255,255,255,.16)',
                              backdropFilter: 'blur(10px)',
                              WebkitBackdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255,255,255,.28)',
                              color: '#fff',
                              font: '600 12.5px Figtree,sans-serif',
                              padding: '6px 11px 6px 9px',
                              borderRadius: '999px',
                              whiteSpace: 'nowrap',
                              minWidth: '0',
                            }}
                          >
                            {$i(iconPinSm)}
                            <span style={{ minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {$i(c?.city)}
                            </span>
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: '#fff',
                              color: '#10233a',
                              font: '700 13.5px Jost,sans-serif',
                              padding: '5px 11px 5px 6px',
                              borderRadius: '999px',
                              boxShadow: '0 6px 14px -6px rgba(0,0,0,.4)',
                              whiteSpace: 'nowrap',
                              flexShrink: '0',
                            }}
                          >
                            <span
                              style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: '#f5f9fd',
                                display: 'grid',
                                placeItems: 'center',
                                font: '700 12px Figtree,sans-serif',
                              }}
                            >
                              <span
                                style={{
                                  background:
                                    'conic-gradient(#4285F4 0 25%,#34A853 25% 50%,#FBBC05 50% 75%,#EA4335 75%)',
                                  color: 'transparent',
                                  WebkitBackgroundClip: 'text',
                                  backgroundClip: 'text',
                                }}
                              >
                                G
                              </span>
                            </span>
                            <span style={{ color: '#F5A623', fontSize: '13px', lineHeight: '1' }}>★</span>
                            {$i(c?.rating)}{' '}
                          </span>
                        </span>
                      </$A>
                      <div
                        style={{
                          padding: '18px 14px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          flex: '1',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              position: 'relative',
                              display: 'inline-block',
                              fontSize: '14px',
                              letterSpacing: '1.5px',
                              lineHeight: '1',
                            }}
                          >
                            <span style={{ color: '#e3e8ee' }}>★★★★★</span>
                            <span
                              style={$css(
                                `position:absolute;inset:0;color:#F5A623;clip-path:${c?.starClip ?? ''};transition:clip-path 1s cubic-bezier(.23,1,.32,1) ${c?.starDelay ?? ''}`,
                              )}
                            >
                              ★★★★★
                            </span>
                          </span>
                          <span style={{ font: '500 13px Figtree,sans-serif', color: '#6b7f95' }}>
                            {$i(c?.reviews)} Google reviews
                          </span>
                        </div>
                        <h3 style={{ font: '600 22px/1.2 Jost,sans-serif', margin: '0', textWrap: 'balance' }}>
                          <$A href={c?.href} style={$css(`color:${c?.titleColor ?? ''};transition:color .15s ease`)}>
                            {$i(c?.name)}
                          </$A>
                        </h3>
                        <p
                          style={{
                            fontSize: '15px',
                            lineHeight: '1.6',
                            color: '#516378',
                            margin: '0',
                            textWrap: 'pretty',
                            display: '-webkit-box',
                            WebkitLineClamp: '3',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {$i(c?.excerpt)}
                        </p>
                      </div>
                      <div
                        style={{
                          marginTop: 'auto',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px',
                          background: '#f5f9fd',
                          borderRadius: '999px',
                        }}
                      >
                        <$A
                          className="scpy"
                          href={c?.tel}
                          aria-label={c?.callLabel}
                          onMouseEnter={c?.callEnter}
                          onMouseLeave={c?.callLeave}
                          style={$css(
                            `flex:1;min-width:0;display:inline-flex;align-items:center;justify-content:center;gap:9px;height:46px;padding:0 14px 0 8px;border-radius:999px;background:${c?.callBg ?? ''};color:${c?.callColor ?? ''};border:1px solid ${c?.callBorder ?? ''};font:600 14.5px Jost,sans-serif;white-space:nowrap;transition:background .2s ease,color .2s ease,border-color .2s ease,transform .12s ease-out`,
                          )}
                        >
                          <span
                            style={$css(
                              `position:relative;width:32px;height:32px;border-radius:50%;background:${c?.callIconBg ?? ''};color:${c?.callIconColor ?? ''};display:grid;place-items:center;flex-shrink:0;transition:background .2s ease,color .2s ease`,
                            )}
                          >
                            <span
                              style={$css(
                                `position:absolute;inset:0;border-radius:50%;border:2px solid #D82028;animation:topCallRing 2.8s cubic-bezier(.23,1,.32,1) infinite ${c?.ringDelay ?? ''};pointer-events:none`,
                              )}
                            />
                            <span style={$css(`display:flex;animation:${c?.wiggle ?? ''}`)}>{$i(iconPhoneTop)}</span>
                          </span>
                          {$i(callText)}{' '}
                        </$A>
                        <$A
                          className="scpe scpy"
                          href={c?.href}
                          style={$css(
                            `flex:1;min-width:0;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:46px;padding:0 14px;border-radius:999px;background:${c?.btnBg ?? ''};color:#fff;font:600 14.5px Jost,sans-serif;white-space:nowrap;transition:background .2s ease,transform .12s ease-out`,
                          )}
                        >
                          {$i(viewText)}
                          <span
                            style={$css(
                              `display:flex;transform:${c?.arrowTf ?? ''};transition:transform .3s cubic-bezier(.23,1,.32,1)`,
                            )}
                          >
                            {$i(iconArrowTop)}
                          </span>
                        </$A>
                      </div>
                    </article>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section data-screen-label="Intro" style={{ background: '#fff' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '88px 32px',
              display: 'grid',
              gridTemplateColumns: '.9fr 1.1fr',
              gap: '64px',
              alignItems: 'start',
            }}
            data-cols=".9fr 1.1fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div style={{ position: 'sticky', top: '100px' }}>
              <div
                style={{
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '4/5',
                  borderRadius: '24px',
                  background: '#eaf2f8',
                }}
              >
                <img
                  src="/assets/img/home-about.jpg"
                  alt="Counsellor and client talking in a sunlit lounge"
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
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Who we are
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12' }} data-rc-lg="1">
                {'Drug Rehab Center & Alcohol Addiction Services in Canada'}
              </h2>
              <p style={{ fontSize: '17px', lineHeight: '1.7', color: '#3b4d63' }}>
                For many addicts, one of the most difficult parts of recovering is admitting that they need help. If you
                have taken that crucial step, it is very important that the help you need is available to you.
                Sometimes, though, the problem is not a lack of an available treatment program. It is the fact that
                there are so many programs out there that all appear to do different things. A person with addiction
                already has a lot to deal with without having to sift through all of the information and make one of the
                most critical decisions of a lifetime.
              </p>
              <h3 style={{ fontSize: '24px', marginTop: '8px' }}>Where do we fit in?</h3>
              <p style={{ fontSize: '17px', lineHeight: '1.7', color: '#3b4d63' }}>
                <strong style={{ color: '#10233a' }}>Detox Centers in Toronto</strong>: Addiction Treatment Centres
                Ontario is there to take the burden of information overload away from the addict. No matter where you
                are in Canada, we will talk to you to find out a bit about you and your circumstances. Together, we will
                figure out what kind of addiction treatment would be the best fit for you, and we will go out and find a
                program that will work for you. This service is available at any time of the day or night, so help is
                available not when it's convenient for us, but when you need it the most.
              </p>
              <div
                style={{
                  marginTop: '10px',
                  background: '#f7fafd',
                  border: '1px solid #e3ecf4',
                  borderRadius: '20px',
                  padding: '24px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '20px',
                }}
                data-cols="1fr 1fr"
              >
                <div style={{ gridColumn: '1/-1', font: '600 16px Jost,sans-serif', color: '#10233a' }}>
                  {'Call Addiction Treatment Centres Now to Find Your Alcohol & Drug Rehab Centre Toronto'}
                </div>
                <$A
                  className="scpj"
                  href="tel:+18558854747"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    background: '#fff',
                    border: '1px solid #e3ecf4',
                    borderRadius: '14px',
                    padding: '16px',
                  }}
                >
                  <span
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: '#eaf5fd',
                      color: '#0890E8',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {$i(iconPhone)}
                  </span>
                  <span>
                    <span
                      style={{
                        display: 'block',
                        font: '600 11px Figtree,sans-serif',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        color: '#6b7f95',
                      }}
                    >
                      Phone
                    </span>
                    <span style={{ font: '600 17px Jost,sans-serif', color: '#10233a' }}>1-855-885-4747</span>
                  </span>
                </$A>
                <$A
                  className="scpj"
                  href="mailto:info@addictionrehabcenters.ca"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    background: '#fff',
                    border: '1px solid #e3ecf4',
                    borderRadius: '14px',
                    padding: '16px',
                  }}
                >
                  <span
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: '#eaf5fd',
                      color: '#0890E8',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {$i(iconMail)}
                  </span>
                  <span>
                    <span
                      style={{
                        display: 'block',
                        font: '600 11px Figtree,sans-serif',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        color: '#6b7f95',
                      }}
                    >
                      Email
                    </span>
                    <span style={{ font: '600 16px Jost,sans-serif', color: '#10233a' }}>
                      info@addictionrehabcenters.ca
                    </span>
                  </span>
                </$A>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="Featured Residential Centers" style={{ background: '#fff', overflow: 'hidden' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px 72px' }} data-rc-wrap="1">
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: '24px',
                marginBottom: '32px',
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
                  Hand-picked
                </span>
                <h2 style={{ fontSize: '38px', marginTop: '10px' }} data-rc-lg="1">
                  Featured Residential Centers
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', color: '#6b7f95', marginRight: '6px', whiteSpace: 'nowrap' }}>
                  {$i(slidePos)}
                </span>
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
                    transition: 'border-color .18s,background .18s',
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
                    transition: 'border-color .18s,background .18s',
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
              style={$css(
                `display:grid;grid-auto-flow:column;grid-auto-columns:${slideCol ?? ''};gap:24px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;scrollbar-width:none;padding-top:12px;padding-bottom:24px;margin:-12px -32px 0;padding-left:32px;padding-right:32px`,
              )}
            >
              {$list(centreCards).map((c, $index) => (
                <Fragment key={$index}>
                  <article
                    onMouseEnter={c?.enter}
                    onMouseLeave={c?.leave}
                    style={$css(
                      `scroll-snap-align:start;position:relative;flex:1;min-width:0;display:flex;flex-direction:column;background:#fff;color:#10233a;border:1px solid ${c?.border ?? ''};border-radius:28px;padding:10px;box-shadow:${c?.shadow ?? ''};transform:${c?.lift ?? ''};transition:transform .35s cubic-bezier(.23,1,.32,1),box-shadow .35s ease,border-color .25s ease`,
                    )}
                  >
                    <$A
                      href={c?.href}
                      style={{
                        position: 'relative',
                        display: 'block',
                        aspectRatio: '16/11',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        background: '#eaf2f8',
                        isolation: 'isolate',
                      }}
                    >
                      <div
                        style={$css(
                          `position:absolute;inset:0;transform:${c?.zoom ?? ''};transition:transform .8s cubic-bezier(.23,1,.32,1)`,
                        )}
                      >
                        <image-slot id={c?.slot} shape="rect" placeholder={c?.ph} />
                      </div>
                      <div
                        style={{
                          position: 'absolute',
                          inset: 'auto 0 0 0',
                          height: '55%',
                          background: 'linear-gradient(0deg,rgba(16,35,58,.6),rgba(16,35,58,0))',
                          pointerEvents: 'none',
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          display: 'flex',
                          gap: '6px',
                          pointerEvents: 'none',
                        }}
                      >
                        {c?.featured ? (
                          <>
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
                                boxShadow: '0 6px 16px -8px rgba(0,0,0,.5)',
                              }}
                            >
                              {$i(iconStarFill)}
                              Featured
                            </span>
                          </>
                        ) : null}
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
                                boxShadow: '0 6px 16px -8px rgba(0,0,0,.45)',
                              }}
                            >
                              {$i(iconSeal)}
                              Verified
                            </span>
                          </>
                        ) : null}
                      </span>
                      <span
                        style={{
                          position: 'absolute',
                          left: '12px',
                          right: '12px',
                          bottom: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          pointerEvents: 'none',
                        }}
                      >
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(255,255,255,.16)',
                            backdropFilter: 'blur(10px)',
                            WebkitBackdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,.28)',
                            color: '#fff',
                            font: '600 12.5px Figtree,sans-serif',
                            padding: '6px 11px 6px 9px',
                            borderRadius: '999px',
                            whiteSpace: 'nowrap',
                            minWidth: '0',
                          }}
                        >
                          {$i(iconPinSm)}
                          <span style={{ minWidth: '0', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {$i(c?.city)}
                          </span>
                        </span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#fff',
                            color: '#10233a',
                            font: '700 13.5px Jost,sans-serif',
                            padding: '5px 11px 5px 6px',
                            borderRadius: '999px',
                            boxShadow: '0 6px 14px -6px rgba(0,0,0,.4)',
                            whiteSpace: 'nowrap',
                            flexShrink: '0',
                          }}
                        >
                          <span
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: '#f5f9fd',
                              display: 'grid',
                              placeItems: 'center',
                              font: '700 12px Figtree,sans-serif',
                            }}
                          >
                            <span
                              style={{
                                background: 'conic-gradient(#4285F4 0 25%,#34A853 25% 50%,#FBBC05 50% 75%,#EA4335 75%)',
                                color: 'transparent',
                                WebkitBackgroundClip: 'text',
                                backgroundClip: 'text',
                              }}
                            >
                              G
                            </span>
                          </span>
                          <span style={{ color: '#F5A623', fontSize: '13px', lineHeight: '1' }}>★</span>
                          {$i(c?.rating)}{' '}
                        </span>
                      </span>
                    </$A>
                    <div
                      style={{
                        padding: '18px 14px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        flex: '1',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            position: 'relative',
                            display: 'inline-block',
                            fontSize: '14px',
                            letterSpacing: '1.5px',
                            lineHeight: '1',
                          }}
                        >
                          <span style={{ color: '#e3e8ee' }}>★★★★★</span>
                          <span
                            style={$css(
                              `position:absolute;inset:0;color:#F5A623;clip-path:${c?.starClip ?? ''};transition:clip-path 1s cubic-bezier(.23,1,.32,1)`,
                            )}
                          >
                            ★★★★★
                          </span>
                        </span>
                        <span style={{ font: '500 13px Figtree,sans-serif', color: '#6b7f95' }}>
                          {$i(c?.reviews)} Google reviews
                        </span>
                      </div>
                      <h3 style={{ font: '600 22px/1.2 Jost,sans-serif', margin: '0', textWrap: 'balance' }}>
                        <$A href={c?.href} style={$css(`color:${c?.titleColor ?? ''};transition:color .15s ease`)}>
                          {$i(c?.name)}
                        </$A>
                      </h3>
                      <p
                        style={{
                          fontSize: '15px',
                          lineHeight: '1.6',
                          color: '#516378',
                          margin: '0',
                          textWrap: 'pretty',
                          display: '-webkit-box',
                          WebkitLineClamp: '3',
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {$i(c?.excerpt)}
                      </p>
                    </div>
                    <div
                      style={{
                        marginTop: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        background: '#f5f9fd',
                        borderRadius: '999px',
                      }}
                    >
                      <$A
                        className="scpy"
                        href={c?.tel}
                        aria-label={c?.callLabel}
                        onMouseEnter={c?.callEnter}
                        onMouseLeave={c?.callLeave}
                        style={$css(
                          `flex:1;min-width:0;display:inline-flex;align-items:center;justify-content:center;gap:9px;height:46px;padding:0 14px 0 8px;border-radius:999px;background:${c?.callBg ?? ''};color:${c?.callColor ?? ''};border:1px solid ${c?.callBorder ?? ''};font:600 14.5px Jost,sans-serif;white-space:nowrap;transition:background .2s ease,color .2s ease,border-color .2s ease,transform .12s ease-out`,
                        )}
                      >
                        <span
                          style={$css(
                            `position:relative;width:32px;height:32px;border-radius:50%;background:${c?.callIconBg ?? ''};color:${c?.callIconColor ?? ''};display:grid;place-items:center;flex-shrink:0;transition:background .2s ease,color .2s ease`,
                          )}
                        >
                          <span
                            style={$css(
                              `position:absolute;inset:0;border-radius:50%;border:2px solid #D82028;animation:topCallRing 2.8s cubic-bezier(.23,1,.32,1) infinite ${c?.ringDelay ?? ''};pointer-events:none`,
                            )}
                          />
                          <span style={$css(`display:flex;animation:${c?.wiggle ?? ''}`)}>{$i(iconPhoneTop)}</span>
                        </span>
                        {$i(callText)}{' '}
                      </$A>
                      <$A
                        className="scpe scpy"
                        href={c?.href}
                        style={$css(
                          `flex:1;min-width:0;display:inline-flex;align-items:center;justify-content:center;gap:8px;height:46px;padding:0 14px;border-radius:999px;background:${c?.btnBg ?? ''};color:#fff;font:600 14.5px Jost,sans-serif;white-space:nowrap;transition:background .2s ease,transform .12s ease-out`,
                        )}
                      >
                        {$i(viewText)}
                        <span
                          style={$css(
                            `display:flex;transform:${c?.arrowTf ?? ''};transition:transform .3s cubic-bezier(.23,1,.32,1)`,
                          )}
                        >
                          {$i(iconArrowTop)}
                        </span>
                      </$A>
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
        <section
          data-screen-label="Locations"
          ref={locRef}
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(180deg,#fff 0,#f7fafd 160px,#f7fafd 100%)',
          }}
        >
          <div
            style={$css(
              `position:relative;max-width:1280px;margin:0 auto;padding:88px 32px;display:grid;grid-template-columns:${locGrid ?? ''};gap:48px;align-items:center`,
            )}
            data-rc-dyn="1"
          >
            <div
              style={$css(
                `display:flex;flex-direction:column;gap:26px;min-width:0;opacity:${locHeadOp ?? ''};transform:${locHeadTf ?? ''};transition:opacity .6s ease-out,transform .7s cubic-bezier(.23,1,.32,1)`,
              )}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span
                  style={{
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    height: '30px',
                    padding: '0 13px 0 9px',
                    borderRadius: '999px',
                    background: '#eaf5fd',
                    border: '1px solid #d6eafa',
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#0a5d96',
                  }}
                >
                  {$i(iconPinSm)}
                  Browse by province
                </span>
                <h2
                  style={{ fontSize: '40px', lineHeight: '1.1', margin: '0', color: '#10233a', textWrap: 'balance' }}
                  data-rc-lg="1"
                >
                  Top Related Treatment Locations
                </h2>
              </div>
              <div
                style={$css(
                  `background:#fff;border:1px solid #e6eef6;border-radius:26px;padding:18px;display:grid;grid-template-columns:${locListCols ?? ''};gap:18px 16px;box-shadow:0 14px 30px -26px rgba(16,35,58,.25)`,
                )}
                data-rc-dyn="1"
              >
                {$list(regions).map((r, $index) => (
                  <Fragment key={$index}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 10px 6px' }}>
                        <span style={$css(`width:9px;height:9px;border-radius:3px;background:${r?.swatch ?? ''}`)} />
                        <span
                          style={{
                            font: '600 11.5px Figtree,sans-serif',
                            letterSpacing: '.12em',
                            textTransform: 'uppercase',
                            color: '#6b7f95',
                          }}
                        >
                          {$i(r?.title)}
                        </span>
                      </div>
                      {$list(r?.items).map((p, $index) => (
                        <Fragment key={$index}>
                          <$A
                            href={p?.href}
                            onMouseEnter={p?.enter}
                            onMouseLeave={p?.leave}
                            onFocus={p?.enter}
                            onBlur={p?.leave}
                            style={$css(
                              `display:flex;align-items:center;gap:11px;height:46px;padding:0 10px;border-radius:13px;background:${p?.bg ?? ''};color:#10233a;transition:background .18s ease`,
                            )}
                          >
                            <span
                              style={$css(
                                `width:36px;height:28px;border-radius:9px;background:${p?.tileBg ?? ''};color:${p?.tileColor ?? ''};font:600 11.5px Jost,sans-serif;letter-spacing:.05em;display:grid;place-items:center;flex-shrink:0;transition:background .18s ease,color .18s ease`,
                              )}
                            >
                              {$i(p?.code)}
                            </span>
                            <span
                              style={$css(
                                `flex:1;min-width:0;font:500 15px Figtree,sans-serif;color:${p?.labelColor ?? ''};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .15s ease`,
                              )}
                            >
                              {$i(p?.label)}
                            </span>
                            <span
                              style={$css(
                                `display:flex;color:#0890E8;opacity:${p?.arrowOp ?? ''};transform:translateX(${p?.arrowX ?? ''});transition:opacity .15s ease,transform .22s cubic-bezier(.23,1,.32,1)`,
                              )}
                            >
                              {$i(iconArrowTop)}
                            </span>
                          </$A>
                        </Fragment>
                      ))}
                    </div>
                  </Fragment>
                ))}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  flexWrap: 'wrap',
                  background: '#fff',
                  border: '1px solid #e6eef6',
                  borderRadius: '22px',
                  padding: '10px 10px 10px 18px',
                  boxShadow: '0 14px 30px -26px rgba(16,35,58,.25)',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    font: '600 14px Jost,sans-serif',
                    color: '#10233a',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '9px',
                      background: '#fdeceb',
                      color: '#D82028',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {$i(iconPinSm)}
                  </span>
                  Popular cities
                </span>
                <span style={{ width: '1px', height: '24px', background: '#e6eef6' }} />
                <div
                  style={{
                    flex: '1',
                    minWidth: '0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    flexWrap: 'wrap',
                  }}
                >
                  {$list(popCities).map((c, $index) => (
                    <Fragment key={$index}>
                      <$A
                        className="scpy"
                        href={c?.href}
                        onMouseEnter={c?.enter}
                        onMouseLeave={c?.leave}
                        style={$css(
                          `display:inline-flex;align-items:center;height:36px;padding:0 13px;border-radius:999px;background:${c?.bg ?? ''};border:1px solid ${c?.border ?? ''};color:${c?.color ?? ''};font:500 14px Figtree,sans-serif;transition:background .15s ease,border-color .15s ease,color .15s ease,transform .12s ease-out`,
                        )}
                      >
                        {$i(c?.label)}
                      </$A>
                    </Fragment>
                  ))}
                </div>
                <$A
                  className="scp1 scpy"
                  href="https://addictionrehabcenters.ca/rehab/"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '40px',
                    padding: '0 16px',
                    borderRadius: '999px',
                    background: '#0890E8',
                    color: '#fff',
                    font: '600 14px Jost,sans-serif',
                    whiteSpace: 'nowrap',
                    transition: 'background .15s ease,transform .12s ease-out',
                  }}
                >
                  All locations
                  {$i(iconArrowTop)}
                </$A>
              </div>
            </div>
            <div
              style={$css(
                `position:relative;min-width:0;opacity:${locMapOp ?? ''};transform:${locMapTf ?? ''};transition:opacity .7s ease-out .15s,transform .9s cubic-bezier(.23,1,.32,1) .15s`,
              )}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: '6% 4% 0',
                  borderRadius: '50%',
                  background: 'radial-gradient(closest-side,rgba(8,144,232,.12),rgba(8,144,232,0))',
                  pointerEvents: 'none',
                }}
              />
              <div style={{ position: 'relative', aspectRatio: '1000/850' }} onMouseLeave={mapLeave}>
                {mapReady ? (
                  <>
                    <svg
                      viewBox="0 0 1000 850"
                      style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', overflow: 'visible' }}
                      role="img"
                      aria-label="Map of Canada's provinces and territories"
                    >
                      {$list(mapProvs).map((m, $index) => (
                        <Fragment key={$index}>
                          <path
                            d={m?.d}
                            onMouseEnter={m?.enter}
                            onClick={m?.go}
                            style={$css(
                              `fill:${m?.fill ?? ''};stroke:#fff;stroke-width:1.4;stroke-linejoin:round;cursor:pointer;transform-box:fill-box;transform-origin:center;opacity:${m?.op ?? ''};transform:${m?.tf ?? ''};filter:${m?.filter ?? ''};transition:fill .25s ease,opacity .5s ease-out ${m?.delay ?? ''},transform .6s cubic-bezier(.23,1,.32,1) ${m?.delay ?? ''},filter .25s ease`,
                            )}
                          />
                        </Fragment>
                      ))}
                      {$list(mapLabels).map((l, $index) => (
                        <Fragment key={$index}>
                          <text
                            x={l?.x}
                            y={l?.y}
                            style={$css(
                              `font:600 17px Jost,sans-serif;letter-spacing:.04em;fill:${l?.color ?? ''};text-anchor:middle;dominant-baseline:middle;pointer-events:none;opacity:${l?.op ?? ''};transition:fill .2s ease,opacity .4s ease-out ${l?.delay ?? ''}`,
                            )}
                          >
                            {$i(l?.code)}
                          </text>
                        </Fragment>
                      ))}
                      {$list(mapCities).map((c, $index) => (
                        <Fragment key={$index}>
                          <g
                            style={$css(
                              `pointer-events:none;opacity:${c?.op ?? ''};transition:opacity .4s ease-out 1s`,
                            )}
                          >
                            <circle
                              cx={c?.x}
                              cy={c?.y}
                              r="7"
                              style={$css(
                                `fill:#D82028;transform-box:fill-box;transform-origin:center;animation:locPinPulse 2.6s cubic-bezier(.23,1,.32,1) infinite ${c?.delay ?? ''}`,
                              )}
                            />
                            <circle
                              cx={c?.x}
                              cy={c?.y}
                              r={c?.r}
                              style={{ fill: '#D82028', stroke: '#fff', strokeWidth: '2.5', transition: 'r .2s ease' }}
                            />
                          </g>
                        </Fragment>
                      ))}
                    </svg>
                    <div
                      style={$css(
                        `position:absolute;left:${tipX ?? ''};top:${tipY ?? ''};transform:translate(-50%,calc(-100% - 14px)) scale(${tipScale ?? ''});transform-origin:bottom center;opacity:${tipOp ?? ''};transition:left .3s cubic-bezier(.23,1,.32,1),top .3s cubic-bezier(.23,1,.32,1),opacity .15s ease,transform .2s cubic-bezier(.23,1,.32,1);pointer-events:none;z-index:2`,
                      )}
                    >
                      <div
                        style={{
                          background: '#10233a',
                          color: '#fff',
                          borderRadius: '12px',
                          padding: '9px 13px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '1px',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 14px 28px -12px rgba(16,35,58,.6)',
                        }}
                      >
                        <span style={{ font: '600 14.5px Jost,sans-serif' }}>{$i(tipName)}</span>
                        <span style={{ font: '500 12px Figtree,sans-serif', color: '#9fd3f8' }}>
                          Click to view rehabs →
                        </span>
                      </div>
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          background: '#10233a',
                          transform: 'rotate(45deg)',
                          margin: '-7px auto 0',
                          borderRadius: '2px',
                        }}
                      />
                    </div>
                  </>
                ) : null}
                {mapLoading ? (
                  <>
                    <div style={{ position: 'absolute', inset: '8%', borderRadius: '40%', background: '#eef4fa' }} />
                  </>
                ) : null}
              </div>
              <div
                style={$css(
                  `position:absolute;left:0;bottom:-6px;display:flex;align-items:center;gap:8px;font:500 13px Figtree,sans-serif;color:#6b7f95;opacity:${hintOp ?? ''};transition:opacity .2s ease`,
                )}
              >
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#0890E8',
                    boxShadow: '0 0 0 4px rgba(8,144,232,.15)',
                  }}
                />
                Hover a province to explore
              </div>
            </div>
          </div>
        </section>
        <section
          data-screen-label="Programs"
          style={{ background: 'linear-gradient(180deg,#f7fafd 0,#f7fafd calc(100% - 160px),#fff 100%)' }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '40px 32px 48px',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            }}
            data-rc-wrap="1"
          >
            {$list(programs).map((p, $index) => (
              <Fragment key={$index}>
                <div
                  style={$css(
                    `display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center;background:#fff;border:1px solid #e3ecf4;border-radius:28px;padding:40px;direction:${p?.dir ?? ''}`,
                  )}
                >
                  <div
                    style={{
                      overflow: 'hidden',
                      position: 'relative',
                      aspectRatio: '5/4',
                      borderRadius: '20px',
                      background: '#eaf2f8',
                      direction: 'ltr',
                    }}
                  >
                    <img
                      src={p?.photo}
                      alt=""
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', direction: 'ltr' }}>
                    <span
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#eaf5fd',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {$i(p?.icon)}
                    </span>
                    <h2 style={{ fontSize: '32px', lineHeight: '1.15' }}>{$i(p?.title)}</h2>
                    <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>{$i(p?.body)}</p>
                    <$A
                      className="scp7"
                      href="https://addictionrehabcenters.ca/rehab/"
                      style={{
                        alignSelf: 'flex-start',
                        font: '600 15px Jost,sans-serif',
                        color: '#0890E8',
                        border: '1.5px solid #0890E8',
                        padding: '11px 18px',
                        borderRadius: '10px',
                        marginTop: '4px',
                      }}
                    >
                      {$i(p?.cta)}
                    </$A>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </section>
        <section data-screen-label="Drug Addiction" style={{ background: '#fff' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '88px 32px',
              display: 'grid',
              gridTemplateColumns: '1.15fr .85fr',
              gap: '64px',
              alignItems: 'start',
            }}
            data-cols="1.15fr .85fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Drug Addiction
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12' }} data-rc-lg="1">
                Find The Best <$A href="https://addictionrehabcenters.ca/ontario-rehabs/">Ontario Rehab Centres</$A>:
                Drug Rehab Ontario
              </h2>
              <p style={{ fontSize: '17px', lineHeight: '1.7', color: '#3b4d63' }}>
                <$A href="https://addictionrehabcenters.ca/">Drug Addiction Canada</$A> is the country's reliable source
                of information and advice regarding drug and alcohol addiction. It caters to services that help patients
                overcome their addiction in the safe and most effective way possible.
              </p>
              <p style={{ fontSize: '17px', lineHeight: '1.7', color: '#3b4d63' }}>
                Our primary goal is to provide you with the best advice so that you and your family will have a
                fulfilling life that's free from drugs and alcohol. Today, many addicts and families deal with the
                traumatic effects of drug and{' '}
                <$A href="https://addictionrehabcenters.ca/addiction-by-alcohol/">alcohol addiction</$A> and as a result
                they all tend to lose their hope. Significantly, there are many elements that affect hopelessness. For
                example, an addict may have tried a{' '}
                <$A href="https://addictionrehabcenters.ca/about-us/">rehab treatment</$A> once or even more but have
                returned to the same vice right after the completion of their rehab treatment.
              </p>
              <$A
                className="scp1"
                href="https://addictionrehabcenters.ca/contact/"
                style={{
                  alignSelf: 'flex-start',
                  font: '600 16px Jost,sans-serif',
                  color: '#fff',
                  background: '#0890E8',
                  padding: '13px 22px',
                  borderRadius: '11px',
                  marginTop: '6px',
                }}
              >
                Learn More About Drug Addiction Canada
              </$A>
            </div>
            <article
              style={{ border: '1px solid #e3ecf4', borderRadius: '24px', overflow: 'hidden', background: '#f7fafd' }}
            >
              <$A
                href="https://addictionrehabcenters.ca/inspire-change-wellness-center/"
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
                    inset: '0',
                    display: 'grid',
                    placeItems: 'end center',
                    paddingBottom: '14px',
                    font: '500 11.5px ui-monospace,Menlo,monospace',
                    color: '#516378',
                  }}
                >
                  photo · Inspire-Change-Wellness-Center.jpg
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
                </span>
              </$A>
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <$A
                  href="https://addictionrehabcenters.ca/listing-category/british-columbia-rehabs/"
                  style={{ font: '600 12px Figtree,sans-serif', letterSpacing: '.1em', textTransform: 'uppercase' }}
                >
                  British Columbia Rehabs
                </$A>
                <h3 style={{ fontSize: '24px' }}>
                  <$A
                    href="https://addictionrehabcenters.ca/inspire-change-wellness-center/"
                    style={{ color: '#10233a' }}
                  >
                    Inspire Change Wellness Center
                  </$A>
                </h3>
                <p style={{ fontSize: '13.5px', color: '#6b7f95' }}>
                  15216 North Bluff Rd, White Rock, BC V4B 0A7, Canada
                </p>
                <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#3b4d63' }}>
                  Welcome to Inspire Change Wellness. We offer addiction treatment services and mental health care for
                  those struggling with substance abuse, drug and alcohol addiction, opioid use disorder, and other
                  substance use services. Our addiction recovery program is the gold standard in the industry. We
                  welcome you and your family to our centre for men.
                </p>
                <span
                  style={{ fontSize: '13.5px', color: '#6b7f95', paddingTop: '10px', borderTop: '1px solid #e3ecf4' }}
                >
                  1 Review
                </span>
              </div>
            </article>
          </div>
        </section>
        <section
          data-screen-label="Addiction Treatments"
          style={{ background: 'linear-gradient(180deg,#fff 0,#f7fafd 160px,#f7fafd calc(100% - 160px),#fff 100%)' }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '88px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
            data-rc-wrap="1"
          >
            <div
              style={$css(
                `display:grid;grid-template-columns:${atHeadCols ?? ''};gap:32px;align-items:end;margin-bottom:12px`,
              )}
              data-rc-dyn="1"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '760px' }}>
                <span
                  style={{
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    height: '30px',
                    padding: '0 13px',
                    borderRadius: '999px',
                    background: '#eaf5fd',
                    border: '1px solid #d6eafa',
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#0a5d96',
                  }}
                >
                  Addiction Treatments
                </span>
                <p style={{ font: '500 26px/1.4 Jost,sans-serif', color: '#10233a', margin: '0', textWrap: 'pretty' }}>
                  At{' '}
                  <$A href="https://addictionrehabcenters.ca/" style={{ color: '#0890E8' }}>
                    <strong>Drug Addiction Canada</strong>
                  </$A>
                  , we make sure that every patient will get the chance to enjoy a normal and fuller life once more – a
                  life that's free from drugs and alcohol.
                </p>
              </div>
              <div
                style={$css(
                  `justify-self:${atStatAlign ?? ''};display:flex;align-items:center;gap:14px;background:#fff;border:1px solid #e6eef6;border-radius:22px;padding:16px 22px;box-shadow:0 14px 30px -26px rgba(16,35,58,.25)`,
                )}
              >
                <span style={{ font: '600 52px/1 Jost,sans-serif', color: '#0890E8' }}>{$i(treatmentsCount)}</span>
                <span style={{ font: '500 14.5px/1.35 Figtree,sans-serif', color: '#516378', maxWidth: '110px' }}>
                  treatment types listed
                </span>
              </div>
            </div>
            <div style={$css(`display:grid;grid-template-columns:${atCardCols ?? ''};gap:24px`)} data-rc-dyn="1">
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#fff',
                  border: '1px solid #e6eef6',
                  borderRadius: '28px',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '22px',
                  boxShadow: '0 14px 30px -26px rgba(16,35,58,.25)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-90px',
                    right: '-90px',
                    width: '240px',
                    height: '240px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle,#e6f3fd,rgba(255,255,255,0) 70%)',
                    pointerEvents: 'none',
                  }}
                />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
                  <span
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '18px',
                      background: '#e6f3fd',
                      color: '#0890E8',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: '0',
                    }}
                  >
                    {$i(iconPerson)}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
                    <h2 style={{ fontSize: '26px', lineHeight: '1.2', margin: '0' }}>Struggling With Addiction?</h2>
                    <p
                      style={{
                        fontSize: '15.5px',
                        lineHeight: '1.55',
                        color: '#516378',
                        margin: '0',
                        textWrap: 'pretty',
                      }}
                    >
                      Learn how addiction starts and what you can do to overcome it
                    </p>
                  </div>
                </div>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <$A
                    className="scp1f"
                    href="https://addictionrehabcenters.ca/am-i-an-addict/"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minHeight: '52px',
                      padding: '0 8px 0 16px',
                      borderRadius: '14px',
                      background: '#f7fafd',
                      border: '1px solid transparent',
                      color: '#10233a',
                      font: '500 15.5px Figtree,sans-serif',
                      transition: 'background .18s ease,border-color .18s ease,color .15s ease',
                    }}
                  >
                    <span style={{ flex: '1', minWidth: '0' }}>Are You Addicted?</span>
                    <span
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: '0',
                        boxShadow: '0 2px 6px -2px rgba(16,35,58,.18)',
                      }}
                    >
                      {$i(iconArrowTop)}
                    </span>
                  </$A>
                  <$A
                    className="scp1f"
                    href="https://addictionrehabcenters.ca/am-i-an-alcoholic/"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minHeight: '52px',
                      padding: '0 8px 0 16px',
                      borderRadius: '14px',
                      background: '#f7fafd',
                      border: '1px solid transparent',
                      color: '#10233a',
                      font: '500 15.5px Figtree,sans-serif',
                      transition: 'background .18s ease,border-color .18s ease,color .15s ease',
                    }}
                  >
                    <span style={{ flex: '1', minWidth: '0' }}>Am I An Alcoholic?</span>
                    <span
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: '0',
                        boxShadow: '0 2px 6px -2px rgba(16,35,58,.18)',
                      }}
                    >
                      {$i(iconArrowTop)}
                    </span>
                  </$A>
                  <$A
                    className="scp1f"
                    href="https://addictionrehabcenters.ca/how-to-choose-a-drug-rehab-program-that-works-for-you/"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minHeight: '52px',
                      padding: '0 8px 0 16px',
                      borderRadius: '14px',
                      background: '#f7fafd',
                      border: '1px solid transparent',
                      color: '#10233a',
                      font: '500 15.5px Figtree,sans-serif',
                      transition: 'background .18s ease,border-color .18s ease,color .15s ease',
                    }}
                  >
                    <span style={{ flex: '1', minWidth: '0' }}>How to Choose a Drug Rehab Program</span>
                    <span
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: '0',
                        boxShadow: '0 2px 6px -2px rgba(16,35,58,.18)',
                      }}
                    >
                      {$i(iconArrowTop)}
                    </span>
                  </$A>
                </div>
              </div>
              <div
                style={{
                  position: 'relative',
                  overflow: 'hidden',
                  background: '#fff',
                  border: '1px solid #e6eef6',
                  borderRadius: '28px',
                  padding: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '22px',
                  boxShadow: '0 14px 30px -26px rgba(16,35,58,.25)',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-90px',
                    right: '-90px',
                    width: '240px',
                    height: '240px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle,#fdeceb,rgba(255,255,255,0) 70%)',
                    pointerEvents: 'none',
                  }}
                />
                <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: '18px' }}>
                  <span
                    style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '18px',
                      background: '#fdeceb',
                      color: '#D82028',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: '0',
                    }}
                  >
                    {$i(iconHands)}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
                    <h2 style={{ fontSize: '26px', lineHeight: '1.2', margin: '0' }}>For Loved Ones</h2>
                    <p
                      style={{
                        fontSize: '15.5px',
                        lineHeight: '1.55',
                        color: '#516378',
                        margin: '0',
                        textWrap: 'pretty',
                      }}
                    >
                      Find out what you can do to help them get back on track
                    </p>
                  </div>
                </div>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <$A
                    className="scp1g"
                    href="#"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minHeight: '52px',
                      padding: '0 8px 0 16px',
                      borderRadius: '14px',
                      background: '#f7fafd',
                      border: '1px solid transparent',
                      color: '#10233a',
                      font: '500 15.5px Figtree,sans-serif',
                      transition: 'background .18s ease,border-color .18s ease,color .15s ease',
                    }}
                  >
                    <span style={{ flex: '1', minWidth: '0' }}>Understanding Your Loved One's Addiction</span>
                    <span
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#D82028',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: '0',
                        boxShadow: '0 2px 6px -2px rgba(16,35,58,.18)',
                      }}
                    >
                      {$i(iconArrowTop)}
                    </span>
                  </$A>
                  <$A
                    className="scp1g"
                    href="#"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minHeight: '52px',
                      padding: '0 8px 0 16px',
                      borderRadius: '14px',
                      background: '#f7fafd',
                      border: '1px solid transparent',
                      color: '#10233a',
                      font: '500 15.5px Figtree,sans-serif',
                      transition: 'background .18s ease,border-color .18s ease,color .15s ease',
                    }}
                  >
                    <span style={{ flex: '1', minWidth: '0' }}>How to Stage an Intervention</span>
                    <span
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#D82028',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: '0',
                        boxShadow: '0 2px 6px -2px rgba(16,35,58,.18)',
                      }}
                    >
                      {$i(iconArrowTop)}
                    </span>
                  </$A>
                  <$A
                    className="scp1g"
                    href="#"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      minHeight: '52px',
                      padding: '0 8px 0 16px',
                      borderRadius: '14px',
                      background: '#f7fafd',
                      border: '1px solid transparent',
                      color: '#10233a',
                      font: '500 15.5px Figtree,sans-serif',
                      transition: 'background .18s ease,border-color .18s ease,color .15s ease',
                    }}
                  >
                    <span style={{ flex: '1', minWidth: '0' }}>Payment Options for Treatment</span>
                    <span
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#D82028',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: '0',
                        boxShadow: '0 2px 6px -2px rgba(16,35,58,.18)',
                      }}
                    >
                      {$i(iconArrowTop)}
                    </span>
                  </$A>
                </div>
              </div>
            </div>
            <div
              style={$css(
                `margin-top:28px;background:#fff;border:1px solid #e6eef6;border-radius:32px;padding:12px;display:grid;grid-template-columns:${atTabCols ?? ''};gap:12px;box-shadow:0 24px 50px -40px rgba(16,35,58,.35)`,
              )}
              data-rc-dyn="1"
            >
              <div
                style={$css(
                  `display:flex;flex-direction:${atTabDir ?? ''};gap:4px;background:#f5f9fd;border-radius:24px;padding:8px;overflow-x:auto;scrollbar-width:none`,
                )}
              >
                {$list(tabs).map((t, $index) => (
                  <Fragment key={$index}>
                    <button
                      className="scpg"
                      onClick={t?.select}
                      onMouseEnter={t?.hover}
                      onMouseLeave={t?.unhover}
                      aria-pressed={t?.pressed}
                      style={$css(
                        `appearance:none;border:0;cursor:pointer;text-align:left;white-space:nowrap;display:flex;align-items:center;gap:12px;min-height:52px;padding:0 14px 0 12px;border-radius:16px;background:${t?.bg ?? ''};box-shadow:${t?.shadow ?? ''};color:${t?.color ?? ''};flex-shrink:0;transition:background .2s ease,box-shadow .2s ease,color .15s ease,transform .12s ease-out`,
                      )}
                    >
                      <span
                        style={$css(
                          `font:600 12px Jost,sans-serif;letter-spacing:.06em;color:${t?.numColor ?? ''};width:22px;transition:color .15s ease`,
                        )}
                      >
                        {$i(t?.num)}
                      </span>
                      <span style={{ flex: '1', font: '600 15px Figtree,sans-serif' }}>{$i(t?.label)}</span>
                      <span
                        style={$css(
                          `display:${t?.arrowDisplay ?? ''};color:#0890E8;opacity:${t?.arrowOp ?? ''};transform:translateX(${t?.arrowX ?? ''});transition:opacity .15s ease,transform .22s cubic-bezier(.23,1,.32,1)`,
                        )}
                      >
                        {$i(iconArrowTop)}
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
              <div
                ref={atPanelRef}
                style={$css(
                  `display:grid;grid-template-columns:${atPanelCols ?? ''};gap:32px;padding:16px;align-items:center;min-width:0`,
                )}
                data-rc-dyn="1"
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '4/3',
                    borderRadius: '22px',
                    overflow: 'hidden',
                    background: '#eaf2f8',
                  }}
                >
                  {$list(atSlots).map((p, $index) => (
                    <Fragment key={$index}>
                      <img
                        src={p?.src}
                        alt={p?.alt}
                        loading="lazy"
                        style={$css(
                          `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:${p?.display ?? ''}`,
                        )}
                      />
                    </Fragment>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0' }}>
                  <span
                    style={{
                      alignSelf: 'flex-start',
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    {$i(activeTab?.num)} / {$i(tabCount)}
                  </span>
                  <h3 style={{ font: '600 32px/1.15 Jost,sans-serif', margin: '0', color: '#10233a' }}>
                    {$i(activeTab?.label)}
                  </h3>
                  <p style={{ fontSize: '17px', lineHeight: '1.7', color: '#3b4d63', margin: '0', textWrap: 'pretty' }}>
                    {$i(activeTab?.body)}
                  </p>
                  <$A
                    className="scp1 scpy"
                    href={activeTab?.href}
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: '6px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      height: '48px',
                      padding: '0 8px 0 20px',
                      borderRadius: '999px',
                      background: '#0890E8',
                      color: '#fff',
                      font: '600 15px Jost,sans-serif',
                      transition: 'background .15s ease,transform .12s ease-out',
                    }}
                  >
                    Learn more
                    <span
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,.2)',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {$i(iconArrowTop)}
                    </span>
                  </$A>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="Kind of Rehab" style={{ background: '#fff' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px' }} data-rc-wrap="1">
            <h2 style={{ font: '500 26px/1.4 Jost,sans-serif', maxWidth: '900px', color: '#10233a' }} data-rc-wrap="1">
              A big part of choosing a rehab program is knowing exactly what kind of program is needed. Some of the
              programs that we refer clients to include the following:
            </h2>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '.9fr 1.1fr',
                gap: '56px',
                marginTop: '44px',
                alignItems: 'start',
              }}
              data-cols=".9fr 1.1fr"
              data-rc-gap="1"
            >
              <div
                style={{
                  overflow: 'hidden',
                  position: 'sticky',
                  top: '100px',
                  aspectRatio: '4/5',
                  borderRadius: '24px',
                  background: '#eaf2f8',
                }}
              >
                <img
                  src="/assets/img/home-program.jpg"
                  alt="Group therapy session in a bright room"
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
              <div>
                <h3 style={{ fontSize: '32px', marginBottom: '24px' }}>Knowing What Kind of Addiction Rehab is Best</h3>
                <ol style={{ margin: '0', padding: '0', listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
                  {$list(kinds).map((k, $index) => (
                    <Fragment key={$index}>
                      <li
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '44px 1fr',
                          gap: '20px',
                          padding: '22px 0',
                          borderTop: '1px solid #e9eff5',
                        }}
                        data-cols="44px 1fr"
                      >
                        <span
                          style={{
                            font: '600 14px Jost,sans-serif',
                            color: '#0890E8',
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            background: '#eaf5fd',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {$i(k?.n)}
                        </span>
                        <div>
                          <h4 style={{ fontSize: '19px', marginBottom: '6px' }}>{$i(k?.title)}</h4>
                          <p style={{ fontSize: '16px', lineHeight: '1.65', color: '#3b4d63' }}>{$i(k?.body)}</p>
                        </div>
                      </li>
                    </Fragment>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section
          data-screen-label="Detox"
          style={{ background: 'linear-gradient(180deg,#fff 0,#f7fafd 160px,#f7fafd calc(100% - 160px),#fff 100%)' }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '88px 32px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '64px',
              alignItems: 'start',
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
                  color: '#0890E8',
                }}
              >
                Detox
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12' }} data-rc-lg="1">
                Drug and Alcohol Detox Centers in Canada
              </h2>
              <p style={{ fontSize: '17px', lineHeight: '1.7', color: '#3b4d63' }}>
                When someone undergoes a detox procedure this simply means that he is undergoing a procedure wherein he
                is safely and effectively removed from drug and{' '}
                <$A href="https://addictionrehabcenters.ca/addiction-by-alcohol/">alcohol addiction</$A>.{' '}
                <$A href="https://addictionrehabcenters.ca/detox-centres-in-canada/">Detox programs</$A> in the country
                come in two ways: the regular or standard detox and the medical detox.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '20px',
                  padding: '26px',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '18px',
                }}
                data-cols="auto 1fr"
              >
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#0890E8',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    font: '600 15px Jost,sans-serif',
                  }}
                >
                  ✓
                </span>
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '6px' }}>Medical Detox</h3>
                  <p style={{ fontSize: '16px', lineHeight: '1.65', color: '#3b4d63' }}>
                    This particular type of{' '}
                    <$A href="https://addictionrehabcenters.ca/detox-centres-in-canada/">detox</$A> entails getting off
                    someone from certain medications such as pain killers,{' '}
                    <$A href="https://addictionrehabcenters.ca/benzodiazepine-addiction/">benzodiazepine</$A>, etc.
                    Severe cases of alcoholism also need medical attention to help an alcoholic quit drinking.
                  </p>
                </div>
              </div>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '20px',
                  padding: '26px',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '18px',
                }}
                data-cols="auto 1fr"
              >
                <span
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#0890E8',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    font: '600 15px Jost,sans-serif',
                  }}
                >
                  ✓
                </span>
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '6px' }}>Regular or Standard Detox</h3>
                  <p style={{ fontSize: '16px', lineHeight: '1.65', color: '#3b4d63' }}>
                    This type of detox procedure is for patients that do not necessarily require medical attention so as
                    to remove drugs within their system. A person who is addicted to{' '}
                    <$A href="https://addictionrehabcenters.ca/marijuana-addiction/">marijuana</$A>,{' '}
                    <$A href="https://addictionrehabcenters.ca/cocaine-addiction/">cocaine</$A>,{' '}
                    <$A href="https://addictionrehabcenters.ca/meth-addiction/">methamphetamine</$A>, club drugs and
                    others needs this type of detox.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="Hope" style={{ background: '#fff' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px 0' }} data-rc-wrap="1">
            <div
              style={$css(
                `display:grid;grid-template-columns:${hopeCols ?? ''};gap:${hopeGap ?? ''};align-items:start`,
              )}
              data-rc-dyn="1"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', minWidth: '0' }}>
                <span
                  style={{
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '30px',
                    padding: '0 13px 0 10px',
                    borderRadius: '999px',
                    background: '#eaf5fd',
                    border: '1px solid #d6eafa',
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#0a5d96',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#2fb46b',
                      boxShadow: '0 0 0 4px rgba(47,180,107,.18)',
                    }}
                  />
                  There is a way forward
                </span>
                <h2
                  style={$css(`font:600 ${hopeH2 ?? ''}/1.08 Jost,sans-serif;margin:0;color:#10233a;text-wrap:balance`)}
                >
                  Hope for Drug and <span style={{ color: '#0890E8' }}>Alcohol Addicts</span>
                </h2>
                <figure
                  style={{
                    margin: '8px 0 0',
                    position: 'relative',
                    padding: '26px 28px 26px 30px',
                    borderRadius: '24px',
                    background: 'linear-gradient(160deg,#f3f9fe,#eaf5fd)',
                    border: '1px solid #d6eafa',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '-18px',
                      left: '24px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: '#0890E8',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      font: '700 30px/1 Georgia,serif',
                      paddingTop: '10px',
                      boxShadow: '0 10px 20px -10px rgba(8,144,232,.7)',
                    }}
                  >
                    “
                  </span>
                  <blockquote
                    style={{ margin: '0', font: '500 21px/1.45 Jost,sans-serif', color: '#10233a', textWrap: 'pretty' }}
                  >
                    With us, everyone can have the assurance to get back to their normal life – a life that's fruitful,
                    prosperous, and free from drugs and alcohol.
                  </blockquote>
                </figure>
              </div>
              <div
                style={$css(`display:flex;flex-direction:column;gap:18px;min-width:0;padding-top:${hopeBodyPad ?? ''}`)}
              >
                <p style={{ fontSize: '18px', lineHeight: '1.75', color: '#3b4d63', margin: '0', textWrap: 'pretty' }}>
                  <strong style={{ color: '#10233a' }}>Alcohol Rehab Toronto</strong>: There is actually hope for those
                  who are seeking an effective and realistic way of{' '}
                  <$A href="https://addictionrehabcenters.ca/faqs/">treating addiction</$A>. There is actually a precise
                  program where various kinds of therapies are encapsulated to suit every patient's need.
                </p>
                <p style={{ fontSize: '18px', lineHeight: '1.75', color: '#3b4d63', margin: '0', textWrap: 'pretty' }}>
                  However, it is important to talk to a trusted authority first before getting into a particular
                  treatment program. To get that hope, it is important to talk to us and we will lead you in the right
                  direction based on what you specifically need – a life free from drugs and{' '}
                  <$A href="https://addictionrehabcenters.ca/addiction-by-alcohol/">alcohol</$A>.
                </p>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    marginTop: '6px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e6eef6',
                  }}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#0890E8',
                      boxShadow: '0 0 0 5px rgba(8,144,232,.15)',
                      flexShrink: '0',
                    }}
                  />
                  <span style={{ font: '500 15.5px Figtree,sans-serif', color: '#10233a' }}>
                    Your first step starts with one conversation.
                  </span>
                </div>
              </div>
            </div>
            <div
              data-screen-label="Ready CTA"
              style={$css(
                `margin:56px 0 72px;position:relative;border-radius:36px;overflow:hidden;background:#0a6fc0;display:grid;grid-template-columns:${ctaCols ?? ''};box-shadow:0 50px 90px -50px rgba(8,90,160,.6)`,
              )}
              data-rc-dyn="1"
            >
              <div style={$css(`position:relative;min-height:${ctaImgH ?? ''};overflow:hidden`)}>
                <img
                  src="/assets/img/menu-4.jpg"
                  alt="A mother hugging her adult son on the porch"
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
                <div
                  style={$css(
                    `position:absolute;inset:0;background:linear-gradient(${ctaFadeDir ?? ''},rgba(10,111,192,0) 55%,rgba(10,111,192,.95) 100%)`,
                  )}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '20px',
                    bottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 16px 10px 10px',
                    borderRadius: '18px',
                    background: 'rgba(255,255,255,.95)',
                    boxShadow: '0 18px 30px -16px rgba(16,35,58,.5)',
                  }}
                >
                  <span
                    style={{
                      position: 'relative',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#2fb46b',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#fff',
                      flexShrink: '0',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '50%',
                        border: '2px solid #2fb46b',
                        animation: 'topCallRing 2.8s cubic-bezier(.23,1,.32,1) infinite',
                      }}
                    />
                    {$i(iconPhoneTop)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{ font: '600 14.5px Jost,sans-serif', color: '#10233a' }}>Advisors available now</span>
                    <span style={{ font: '500 12.5px Figtree,sans-serif', color: '#516378' }}>
                      {'Free & confidential, 24/7'}
                    </span>
                  </span>
                </div>
              </div>
              <div
                style={$css(
                  `position:relative;padding:${ctaPad ?? ''};display:flex;flex-direction:column;gap:22px;color:#fff;background:radial-gradient(420px 300px at 100% 0%,rgba(255,255,255,.14),rgba(255,255,255,0) 70%),linear-gradient(160deg,#0a6fc0 0%,#0890E8 100%)`,
                )}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: '-70px',
                    bottom: '-70px',
                    width: '260px',
                    height: '260px',
                    borderRadius: '50%',
                    border: '48px solid rgba(255,255,255,.07)',
                    pointerEvents: 'none',
                  }}
                />
                <span
                  style={{
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    height: '30px',
                    padding: '0 13px 0 10px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,.14)',
                    border: '1px solid rgba(255,255,255,.22)',
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#fff',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#7ef0b0',
                      boxShadow: '0 0 0 4px rgba(126,240,176,.25)',
                    }}
                  />
                  Ready when you are
                </span>
                <h2
                  style={$css(
                    `position:relative;font:600 ${ctaH2 ?? ''}/1.12 Jost,sans-serif;color:#fff;margin:0;text-wrap:balance`,
                  )}
                >
                  <$A href="https://addictionrehabcenters.ca/contact/" style={{ color: '#fff' }}>
                    {'Discover All Addiction Rehabs & Treatments: Detox Centre Toronto'}
                  </$A>
                </h2>
                <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      height: '32px',
                      padding: '0 12px 0 9px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,.12)',
                      border: '1px solid rgba(255,255,255,.18)',
                      font: '500 13.5px Figtree,sans-serif',
                      color: '#fff',
                    }}
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#0a6fc0',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" style={{ flexShrink: '0' }}>
                        <path
                          d="M5 12.5l4.5 4.5L19 7.5"
                          style={{
                            fill: 'none',
                            stroke: 'currentColor',
                            strokeWidth: '2.6',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                          }}
                        />
                      </svg>
                    </span>
                    Free assessment
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      height: '32px',
                      padding: '0 12px 0 9px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,.12)',
                      border: '1px solid rgba(255,255,255,.18)',
                      font: '500 13.5px Figtree,sans-serif',
                      color: '#fff',
                    }}
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#0a6fc0',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" style={{ flexShrink: '0' }}>
                        <path
                          d="M5 12.5l4.5 4.5L19 7.5"
                          style={{
                            fill: 'none',
                            stroke: 'currentColor',
                            strokeWidth: '2.6',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                          }}
                        />
                      </svg>
                    </span>
                    No obligation
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '7px',
                      height: '32px',
                      padding: '0 12px 0 9px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,.12)',
                      border: '1px solid rgba(255,255,255,.18)',
                      font: '500 13.5px Figtree,sans-serif',
                      color: '#fff',
                    }}
                  >
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#0a6fc0',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" style={{ flexShrink: '0' }}>
                        <path
                          d="M5 12.5l4.5 4.5L19 7.5"
                          style={{
                            fill: 'none',
                            stroke: 'currentColor',
                            strokeWidth: '2.6',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                          }}
                        />
                      </svg>
                    </span>
                    Private, accredited centres
                  </span>
                </div>
                <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '6px' }}>
                  <$A
                    className="scp1h scpy"
                    href="tel:+18558854747"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '12px',
                      height: '60px',
                      padding: '0 24px 0 8px',
                      borderRadius: '999px',
                      background: '#fff',
                      color: '#0a5d96',
                      boxShadow: '0 18px 34px -18px rgba(0,0,0,.45)',
                      transition: 'transform .15s ease-out,box-shadow .2s ease',
                    }}
                  >
                    <span
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: '#D82028',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {$i(iconPhoneTop)}
                    </span>
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                      <span style={{ font: '500 12px Figtree,sans-serif', color: '#516378' }}>Call now</span>
                      <span style={{ font: '600 18px Jost,sans-serif' }}>1-855-885-4747</span>
                    </span>
                  </$A>
                  <$A
                    className="scp1i scpy"
                    href="https://addictionrehabcenters.ca/rehab/search/"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      height: '60px',
                      padding: '0 24px',
                      borderRadius: '999px',
                      border: '1.5px solid rgba(255,255,255,.55)',
                      color: '#fff',
                      font: '600 16px Jost,sans-serif',
                      transition: 'background .15s ease,border-color .15s ease,transform .12s ease-out',
                    }}
                  >
                    Search all centres
                    {$i(iconArrowTop)}
                  </$A>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div style={{ background: '#fff', paddingTop: '24px' }}>
          <footer
            data-screen-label="Footer"
            style={{
              position: 'relative',
              overflow: 'hidden',
              background:
                'radial-gradient(700px 360px at 0% 0%,rgba(8,144,232,.22),rgba(8,144,232,0) 65%),radial-gradient(520px 320px at 100% 100%,rgba(216,32,40,.10),rgba(216,32,40,0) 65%),#10233a',
              color: '#b7c7d8',
              borderRadius: '40px 40px 0 0',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '0',
                backgroundImage: 'radial-gradient(rgba(255,255,255,.06) 1px,transparent 1.2px)',
                backgroundSize: '24px 24px',
                WebkitMaskImage: 'radial-gradient(60% 70% at 100% 0%,#000,transparent)',
                maskImage: 'radial-gradient(60% 70% at 100% 0%,#000,transparent)',
                pointerEvents: 'none',
              }}
            />
            <div
              style={$css(
                `position:relative;max-width:1280px;margin:0 auto;padding:72px 32px 40px;display:grid;grid-template-columns:${footGrid ?? ''};gap:48px 40px`,
              )}
              data-rc-dyn="1"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', minWidth: '0' }}>
                <$A href="/" style={{ alignSelf: 'flex-start', display: 'block' }}>
                  <img
                    src="/assets/logo-white.png"
                    alt="Addiction Rehab Centres Canada"
                    style={{ height: '58px', width: 'auto', display: 'block' }}
                  />
                </$A>
                <p
                  style={{
                    fontSize: '15px',
                    lineHeight: '1.6',
                    color: '#b7c7d8',
                    margin: '0',
                    maxWidth: '320px',
                    textWrap: 'pretty',
                  }}
                >
                  We Are Available 24/7. Free, confidential help finding the right treatment in Canada.
                </p>
                <$A
                  className="scpz scpg"
                  href="tel:+1-855-885-4747"
                  style={{
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '8px 20px 8px 8px',
                    borderRadius: '999px',
                    background: 'rgba(255,255,255,.06)',
                    border: '1px solid rgba(255,255,255,.12)',
                    color: '#fff',
                    transition: 'background .18s ease,border-color .18s ease,transform .12s ease-out',
                  }}
                >
                  <span
                    style={{
                      position: 'relative',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#D82028',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: '0',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        inset: '0',
                        borderRadius: '50%',
                        border: '2px solid #D82028',
                        animation: 'topCallRing 2.8s cubic-bezier(.23,1,.32,1) infinite',
                      }}
                    />
                    {$i(iconPhoneTop)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                    <span style={{ font: '500 12px Figtree,sans-serif', color: '#9fb3c8' }}>Call us, day or night</span>
                    <span style={{ font: '600 17px Jost,sans-serif', letterSpacing: '.01em' }}>+1-855-885-4747</span>
                  </span>
                </$A>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <$A
                    className="scpd scp10"
                    href="https://www.facebook.com/Addiction-Rehab-Centres-Canada-772760289732512/"
                    aria-label="Facebook"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.12)',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#fff',
                      transition: 'background .18s ease,border-color .18s ease,transform .12s ease-out',
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24">
                      <path
                        d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.5V21z"
                        style={{ fill: 'currentColor' }}
                      />
                    </svg>
                  </$A>
                  <$A
                    className="scpd scp10"
                    href={
                      'https://www.google.com/search?ludocid=17732523544542585825&q=Addiction%20Rehab%20Centres%20Canada'
                    }
                    aria-label="Google"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.12)',
                      display: 'grid',
                      placeItems: 'center',
                      color: '#fff',
                      transition: 'background .18s ease,border-color .18s ease,transform .12s ease-out',
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24">
                      <path
                        d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.7h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z"
                        style={{ fill: 'currentColor' }}
                      />
                      <path
                        d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.8-5.6-4.1H3.1v2.6A10 10 0 0 0 12 22z"
                        style={{ fill: 'currentColor', opacity: '.85' }}
                      />
                      <path
                        d="M6.4 14c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V7.4H3.1a10 10 0 0 0 0 9.2z"
                        style={{ fill: 'currentColor', opacity: '.7' }}
                      />
                      <path
                        d="M12 6c1.5 0 2.8.5 3.8 1.5l2.9-2.9A10 10 0 0 0 3.1 7.4L6.4 10C7.2 7.7 9.4 6 12 6z"
                        style={{ fill: 'currentColor', opacity: '.85' }}
                      />
                    </svg>
                  </$A>
                </div>
              </div>
              {$list(footerCols).map((col, $index) => (
                <Fragment key={$index}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: '0' }}>
                    <h4
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        font: '600 12px Figtree,sans-serif',
                        letterSpacing: '.14em',
                        textTransform: 'uppercase',
                        color: '#fff',
                        margin: '0',
                      }}
                    >
                      <span style={{ width: '18px', height: '2px', borderRadius: '2px', background: '#0890E8' }} />
                      {$i(col?.title)}
                    </h4>
                    <ul
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        listStyle: 'none',
                        margin: '0',
                        padding: '0',
                      }}
                    >
                      {$list(col?.links).map((l, $index) => (
                        <Fragment key={$index}>
                          <li>
                            <$A
                              className="scp11"
                              href={l?.href}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '5px 0',
                                fontSize: '14.5px',
                                color: '#b7c7d8',
                                lineHeight: '1.4',
                                transition: 'color .15s ease,transform .2s cubic-bezier(.23,1,.32,1)',
                              }}
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
            <div
              style={{ position: 'relative', maxWidth: '1280px', margin: '0 auto', padding: '0 32px' }}
              data-rc-wrap="1"
            >
              <div
                style={{
                  borderTop: '1px solid rgba(255,255,255,.1)',
                  padding: '22px 0 26px',
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '14px 24px',
                  fontSize: '13.5px',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  {$i(iconMaple)}© 2025 Addiction Rehab Centres Canada
                </span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <$A
                    className="scp12"
                    href="https://addictionrehabcenters.ca/privacy-policy/"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      color: '#b7c7d8',
                      transition: 'background .15s ease,color .15s ease',
                    }}
                  >
                    Privacy Policy
                  </$A>
                  <$A
                    className="scp12"
                    href="https://addictionrehabcenters.ca/terms-of-use/"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      color: '#b7c7d8',
                      transition: 'background .15s ease,color .15s ease',
                    }}
                  >
                    Terms of Use
                  </$A>
                  <$A
                    className="scp12"
                    href="https://addictionrehabcenters.ca/promote-your-centre/"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      color: '#b7c7d8',
                      transition: 'background .15s ease,color .15s ease',
                    }}
                  >
                    Promote Your Centre
                  </$A>
                  <$A
                    className="scp12"
                    href="https://addictionrehabcenters.ca/llms.txt"
                    style={{
                      padding: '6px 12px',
                      borderRadius: '999px',
                      color: '#b7c7d8',
                      transition: 'background .15s ease,color .15s ease',
                    }}
                  >
                    Hey Ai, Learn About Us
                  </$A>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}

export const ownCss =
  '\n@keyframes locPinPulse{0%{transform:scale(1);opacity:.5}70%,100%{transform:scale(3.2);opacity:0}}\n@keyframes topCallRing{0%{transform:scale(1);opacity:.55}70%,100%{transform:scale(1.7);opacity:0}}\n@keyframes topCallWiggle{0%,100%{transform:rotate(0)}20%{transform:rotate(-14deg)}40%{transform:rotate(12deg)}60%{transform:rotate(-8deg)}80%{transform:rotate(5deg)}}\n@media (prefers-reduced-motion:reduce){[style*="topCallRing"],[style*="topCallWiggle"]{animation:none!important}}\nhtml,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\n@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n';
export const css = [ownCss, SiteHeader_css].filter(Boolean).join('\n');
export const defaults = { livesCount: '11.2k', treatmentsCount: '30', topRating: '5.0', topReviews: '92' };
const View = createDC('Home', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} imageSlot responsive {...props} />;
}
