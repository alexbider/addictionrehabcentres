'use client';
// Generated from CentreOnboarding.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';
import SiteFooter from './SiteFooter';
import { postJson } from '@/lib/form-client';
import { Honeypot, FormError } from '@/components/FormBits';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  static KEY = 'arc-centre-onboarding-draft';
  blank = {
    centre: '',
    contact: '',
    role: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    city: '',
    prov: 'ON',
    care: [],
    substances: [],
    serve: [],
    length: '',
    setting: '',
    services: [],
    therapies: [],
    amenities: [],
    tagline: '',
    about: '',
    priceFrom: '',
    priceTo: '',
    callPricing: false,
    payments: [],
    accreditation: [],
    detoxOnSite: false,
  };
  state = {
    vw: 1280,
    step: 1,
    maxStep: 1,
    tried: {},
    d: this.blank,
    photos: [],
    terms: false,
    sending: false,
    formError: '',
    formFields: null,
    done: false,
    saved: false,
  };
  topRef = React.createRef();
  componentDidMount() {
    this.setState({ vw: window.innerWidth });
    this._r = () => this.setState({ vw: window.innerWidth });
    window.addEventListener('resize', this._r);
    try {
      const raw = localStorage.getItem(Component.KEY);
      if (raw) {
        const o = JSON.parse(raw);
        this.setState({
          d: { ...this.blank, ...(o.d || {}) },
          step: o.step || 1,
          maxStep: o.maxStep || 1,
          saved: true,
        });
      }
    } catch (e) {}

    try {
      const u = JSON.parse(localStorage.getItem('arc-auth-user') || 'null');
      if (u && u.signedIn) {
        this.setState((s) => ({
          user: u,
          d: { ...s.d, contact: s.d.contact || u.name || '', email: s.d.email || u.email || '' },
        }));
      }
    } catch (e) {}
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._r);
  }
  componentDidUpdate(pp, ps) {
    const s = this.state;
    if (ps.d !== s.d || ps.step !== s.step) {
      try {
        localStorage.setItem(Component.KEY, JSON.stringify({ d: s.d, step: s.step, maxStep: s.maxStep }));
      } catch (e) {}
      if (!s.saved) this.setState({ saved: true });
    }
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
        strokeWidth: 1.8,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        ...(extra || {}),
      },
      ...paths.map((p, i) => (typeof p === 'string' ? R('path', { key: i, d: p }) : R(p.t, { key: i, ...p.a }))),
    );
  }
  toTop() {
    const el = this.topRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 110, behavior: 'smooth' });
  }
  set(k, v) {
    this.setState((s) => ({ d: { ...s.d, [k]: v } }));
  }

  renderVals() {
    const B = '/';
    const { vw, step, maxStep, tried, d, photos, terms, done, saved, sending, formError, formFields } = this.state;
    const wide = vw >= 1060,
      mid = vw >= 700;
    const provs = [
      ['AB', 'Alberta'],
      ['BC', 'British Columbia'],
      ['MB', 'Manitoba'],
      ['NB', 'New Brunswick'],
      ['NL', 'Newfoundland and Labrador'],
      ['NS', 'Nova Scotia'],
      ['NT', 'Northwest Territories'],
      ['NU', 'Nunavut'],
      ['ON', 'Ontario'],
      ['PE', 'Prince Edward Island'],
      ['QC', 'Quebec'],
      ['SK', 'Saskatchewan'],
      ['YT', 'Yukon'],
    ];
    const provName = (provs.find((p) => p[0] === d.prov) || [0, ''])[1];
    const digits = (x) => x.replace(/\D/g, '');
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email);
    const v = {
      1: {
        centre: !d.centre.trim() ? 'Enter your centre\u2019s name.' : '',
        contact: !d.contact.trim() ? 'Enter a contact name.' : '',
        email: !emailOk ? 'Enter a valid email.' : '',
        phone: digits(d.phone).length < 10 ? 'Enter the centre\u2019s phone number.' : '',
        address: !d.address.trim() ? 'Enter the street address.' : '',
        city: !d.city.trim() ? 'Enter the city.' : '',
      },
      2: {
        care: !d.care.length ? 'Choose at least one level of care.' : '',
        substances: !d.substances.length ? 'Choose at least one substance you treat.' : '',
      },
      3: { services: !d.services.length ? 'Choose at least one service.' : '' },
      4: {
        tagline: !d.tagline.trim() ? 'Add a short headline.' : '',
        about: d.about.trim().length < 200 ? 'Write at least 200 characters about your centre.' : '',
      },
      5: {
        price:
          !d.callPricing && !/^\d{3,6}$/.test(digits(d.priceFrom))
            ? 'Enter a starting price or choose "Call for pricing".'
            : '',
      },
      6: { terms: !terms ? 'x' : '' },
    };
    const stepOk = (n) => Object.values(v[n]).every((x) => !x);
    const err = (n, k) => tried[n] && v[n][k];
    const go = (n) => {
      this.setState({ step: n, maxStep: Math.max(maxStep, n), done: false });
      this.toTop();
    };
    const next = () => {
      if (!stepOk(step)) {
        this.setState({ tried: { ...tried, [step]: true } });
        return;
      }
      if (step === 6) {
        // Saved on the server (onboarding_submissions) before the confirmation appears; reviewed by an admin, free to list.
        const hp = document.querySelector('input[name=company_website]');
        this.setState({ sending: true, formError: '', formFields: null });
        postJson('/api/forms/centreOnboarding', { email: d.email, payload: d, company_website: hp ? hp.value : '' }).then((r) => {
          if (!r.ok) {
            this.setState({ sending: false, formError: r.error || 'Your submission was not sent.', formFields: r.fields || null });
            return;
          }
          this.setState({ sending: false, done: true });
          try {
            localStorage.removeItem(Component.KEY);
          } catch (e) {}
          this.toTop();
        });
        return;
      }
      go(step + 1);
    };

    const names = ['Basics', 'Care', 'Services', 'Your story', 'Pricing', 'Review'];
    const heads = [
      ['Centre basics', 'Where you are and how people reach you. This appears at the top of your listing.'],
      ['Care & programs', 'Help people filter to the right fit. Tap to select — you can change these any time.'],
      ['Services & facility', 'What clients get while they\u2019re with you.'],
      ['Your story', 'The words families read first when choosing a centre. You can add photos from your dashboard once the listing is approved.'],
      ['Pricing & accreditation', 'Transparent pricing and credentials build trust with families.'],
      ['Review & submit', 'Listing is free. Our team reviews your details before the page is published.'],
    ];
    const steps = names.map((label, i) => {
      const n = i + 1,
        cur = n === step && !done,
        past = done || (n !== step && n <= maxStep && stepOk(n)),
        reach = n <= maxStep && !done;
      return {
        label,
        mark: past && !cur ? '\u2713' : String(n),
        go: () => {
          if (reach) go(n);
        },
        cursor: reach ? 'pointer' : 'default',
        bar: past || cur ? '#0890E8' : '#e6eef6',
        dotBg: past && !cur ? '#0890E8' : cur ? '#fff' : '#f5f8fb',
        dotColor: past && !cur ? '#fff' : cur ? '#0890E8' : '#9aabbd',
        dotBorder: past || cur ? '#0890E8' : '#e3ecf4',
        labelColor: cur ? '#10233a' : past ? '#1f3550' : '#9aabbd',
        labelDisplay: vw >= 1180 ? 'block' : cur ? 'block' : 'none',
      };
    });

    const F = (n, k, label, o = {}) => {
      const bad = err(n, o.errKey || k);
      const kind = o.kind || 'input';
      return {
        label,
        value: d[k],
        onChange: (e) => this.set(k, o.fmt ? o.fmt(e.target.value) : e.target.value),
        placeholder: o.ph || '',
        type: o.type || 'text',
        mode: o.mode || 'text',
        span: o.full ? '1 / -1' : 'auto',
        isInput: kind === 'input',
        isSelect: kind === 'select',
        isArea: kind === 'area',
        options: o.options || [],
        pre: o.pre || '',
        preDisplay: o.pre ? 'block' : 'none',
        padL: o.pre ? '4px' : '16px',
        count: o.count || '',
        countColor: o.countColor || '#6b7f95',
        err: v[n][o.errKey || k] || '',
        errDisplay: bad ? 'block' : 'none',
        border: bad ? '#e0787c' : '#dbe6f0',
      };
    };
    const aboutLen = d.about.trim().length;
    const fieldsBy = {
      1: [
        F(1, 'centre', 'Centre name', { ph: 'e.g. Lakeside Recovery Centre', full: true }),
        F(1, 'contact', 'Your name', { ph: 'Jane Doe' }),
        F(1, 'role', 'Your role (optional)', { ph: 'Admissions Director' }),
        F(1, 'email', 'Email', { type: 'email', ph: 'admissions@yourcentre.ca' }),
        F(1, 'phone', 'Centre phone', { type: 'tel', ph: '(555) 555-5555' }),
        F(1, 'website', 'Website (optional)', { ph: 'yourcentre.ca', full: true }),
        F(1, 'address', 'Street address', { ph: '123 Main St', full: true }),
        F(1, 'city', 'City', { ph: 'e.g. Toronto' }),
        F(1, 'prov', 'Province', { kind: 'select', options: provs.map(([a, b]) => ({ v: a, l: b })) }),
      ],
      2: [
        F(2, 'length', 'Typical program length', {
          kind: 'select',
          options: [
            ['', 'Select'],
            ['Under 2 weeks', 'Under 2 weeks'],
            ['2 – 4 weeks', '2 – 4 weeks'],
            ['4 – 8 weeks', '4 – 8 weeks'],
            ['4 – 12 weeks', '4 – 12 weeks'],
            ['3 months +', '3 months +'],
            ['Varies by client', 'Varies by client'],
          ].map(([a, b]) => ({ v: a, l: b })),
        }),
        F(2, 'setting', 'Setting (optional)', { ph: 'e.g. Lakeside retreat, urban clinic' }),
      ],
      4: [
        F(4, 'tagline', 'Headline', {
          ph: 'e.g. Private residential treatment on the shores of Lake Simcoe',
          full: true,
          count: d.tagline.length + ' / 100',
        }),
        F(4, 'about', 'About your centre', {
          kind: 'area',
          full: true,
          ph: 'Your approach, who you help, what a typical day looks like, and what happens after discharge.',
          count: aboutLen < 200 ? 200 - aboutLen + ' more characters needed' : aboutLen + ' characters',
          countColor: aboutLen < 200 ? '#6b7f95' : '#1f8a52',
        }),
      ],
      5: d.callPricing
        ? []
        : [
            F(5, 'priceFrom', 'Price from', {
              pre: '$',
              mode: 'numeric',
              ph: '8,000',
              errKey: 'price',
              fmt: (x) => digits(x).slice(0, 6),
            }),
            F(5, 'priceTo', 'Price to (optional)', {
              pre: '$',
              mode: 'numeric',
              ph: '25,000',
              errKey: 'none',
              fmt: (x) => digits(x).slice(0, 6),
            }),
          ],
    };
    fieldsBy[5].forEach((f) => {
      if (f.label === 'Price to (optional)') {
        f.err = '';
        f.errDisplay = 'none';
        f.border = '#dbe6f0';
      }
    });
    const fields = fieldsBy[step] || [];

    const chips = (k, opts) =>
      opts.map((label) => {
        const on = d[k].includes(label);
        return {
          label,
          pressed: on ? 'true' : 'false',
          toggle: () => this.set(k, on ? d[k].filter((x) => x !== label) : [...d[k], label]),
          bg: on ? '#0890E8' : '#fff',
          color: on ? '#fff' : '#1f3550',
          border: on ? '#0890E8' : '#dbe6f0',
          tickDisplay: on ? 'flex' : 'none',
          padL: on ? '11px' : '15px',
        };
      });
    const G = (n, k, title, opts, req) => ({
      title,
      chips: chips(k, opts),
      count: d[k].length ? d[k].length + ' selected' : '',
      err: req ? v[n][k] : '',
      errDisplay: req && err(n, k) ? 'block' : 'none',
    });
    const groupsBy = {
      2: [
        G(
          2,
          'care',
          'Levels of care',
          [
            'Residential',
            'Medical detox',
            'Outpatient',
            'Intensive outpatient',
            'Day program',
            'Online',
            'Sober living',
          ],
          true,
        ),
        G(
          2,
          'substances',
          'Substances treated',
          [
            'Alcohol',
            'Opioids',
            'Fentanyl',
            'Cocaine',
            'Meth',
            'Cannabis',
            'Prescription drugs',
            'Benzodiazepines',
            'Gambling',
          ],
          true,
        ),
        G(
          2,
          'serve',
          'Who you serve',
          ['Adults', 'Men only', 'Women only', 'Youth', 'Seniors', 'LGBTQ+', 'Indigenous clients', 'Professionals'],
          false,
        ),
      ],
      3: [
        G(
          3,
          'services',
          'Services',
          [
            'Interventions',
            'Nurse services',
            'Withdrawal management',
            'Mental health support',
            'Dual diagnosis',
            'Family programs & counselling',
            'Aftercare',
            'Life coaching',
          ],
          true,
        ),
        G(
          3,
          'therapies',
          'Therapies',
          [
            'One-on-one counselling',
            'Group therapy',
            'CBT',
            'DBT',
            'Trauma-informed care',
            '12-step',
            'Non 12-step',
            'Mindfulness & meditation',
            'Physical exercise',
          ],
          false,
        ),
        G(
          3,
          'amenities',
          'Facility & amenities',
          [
            'Private rooms',
            'Shared rooms',
            'Wheelchair accessible',
            'Chef-prepared meals',
            'Gym',
            'Pool or beach access',
            'Outdoor grounds',
            'Pet friendly',
          ],
          false,
        ),
      ],
      5: [
        G(
          5,
          'payments',
          'Payment options',
          ['Private pay', 'Extended health benefits', 'Financing available', 'EAP referrals', 'Workplace programs'],
          false,
        ),
        G(
          5,
          'accreditation',
          'Accreditation & memberships',
          [
            'Accreditation Canada',
            'CARF',
            'Canadian Centre on Substance Use and Addiction member',
            'Provincially licensed',
          ],
          false,
        ),
      ],
    };
    const groups = groupsBy[step] || [];
    const tg = (k, title, body) => {
      const on = d[k];
      return {
        title,
        body,
        toggle: () => this.set(k, !on),
        track: on ? '#0890E8' : '#cfdceb',
        knob: on ? '21px' : '3px',
        border: on ? '#b9dcf6' : '#e6eef6',
        bg: on ? '#f3f9fe' : '#fff',
      };
    };
    const toggles =
      step === 5
        ? [
            tg('callPricing', 'Call for pricing', 'Hide prices and invite families to call.'),
            tg('detoxOnSite', 'Detox on site', 'Show a medical detox badge on your listing.'),
          ]
        : [];

    const tiles = [];
    for (let i = 0; i < 6; i++) {
      const p = photos[i];
      tiles.push(
        p
          ? {
              filled: true,
              empty: false,
              isCover: i === 0,
              bg: 'url(' + p + ')',
              border: 'transparent',
              borderStyle: 'solid',
              remove: () => this.setState((s) => ({ photos: s.photos.filter((_, j) => j !== i) })),
              label: '',
            }
          : {
              filled: false,
              empty: i === photos.length,
              isCover: false,
              bg: i === photos.length ? '#f9fbfd' : '#f5f8fb',
              border: i === photos.length ? '#b9d6ee' : '#e6eef6',
              borderStyle: 'dashed',
              remove: null,
              label: i === 0 ? 'Add cover photo' : 'Add photo',
            },
      );
    }

    const setP = (k, fmt) => (e) => {
      const val = fmt(e.target.value);
      this.setState((s) => ({ pay: { ...s.pay, [k]: val } }));
    };

    const muted = '#9aabbd';
    const fmtMoney = (x) => '$' + Number(digits(x)).toLocaleString('en-CA');
    const price = d.callPricing
      ? 'Call for pricing'
      : d.priceFrom
        ? fmtMoney(d.priceFrom) + (d.priceTo ? ' \u2013 ' + fmtMoney(d.priceTo) : '+')
        : '';
    const gl = (k, val) => ({ k, v: val || '\u2014', color: val ? '#10233a' : muted });
    const pvGlance = [
      gl('Level of care', d.care.slice(0, 3).join(' \u00b7 ')),
      gl('Program length', d.length),
      gl('Setting', d.setting.trim()),
      gl('Pricing', price),
    ];
    const chipSrc = [...(d.detoxOnSite ? ['Detox on site'] : []), ...d.substances, ...d.services];
    const pvChips = chipSrc
      .slice(0, 6)
      .map((label, i) => ({
        label,
        bg: i < d.substances.length + (d.detoxOnSite ? 1 : 0) ? '#eaf5fd' : '#f3f8f5',
        color: i < d.substances.length + (d.detoxOnSite ? 1 : 0) ? '#0a5d96' : '#1f6b44',
        border: i < d.substances.length + (d.detoxOnSite ? 1 : 0) ? '#d6eafa' : '#d7ecdf',
      }));
    if (chipSrc.length > 6)
      pvChips.push({ label: '+' + (chipSrc.length - 6) + ' more', bg: '#f5f8fb', color: '#516378', border: '#e6eef6' });
    if (!pvChips.length)
      pvChips.push({ label: 'Substances & services appear here', bg: '#f5f8fb', color: muted, border: '#e6eef6' });

    const checks = [
      ['Centre basics', stepOk(1)],
      ['Care & programs', stepOk(2)],
      ['Services', stepOk(3)],
      ['Headline & description', stepOk(4)],
      ['Pricing', stepOk(5)],
    ];
    const strength = Math.round((checks.filter((c) => c[1]).length / checks.length) * 100);
    const L = (arr) =>
      arr.map((x) => {
        const [label, p] = x.split('|');
        return { label, href: B + p + '/' };
      });

    return {
      introPad: mid ? '52px 32px 44px' : '32px 20px 28px',
      h1Size: vw >= 1100 ? '50px' : mid ? '42px' : '34px',
      saveLabel: this.state.user
        ? 'Signed in as ' + this.state.user.email + (saved ? ' · Draft saved' : '')
        : saved
          ? 'Draft saved on this device'
          : 'Progress saves automatically',
      authCta: !this.state.user,
      topRef: this.topRef,
      bodyPad: mid ? '36px 32px 88px' : '20px 14px 56px',
      bodyCols: wide ? 'minmax(0,1fr) 360px' : 'minmax(0,1fr)',
      panelPad: mid ? '32px' : '22px 18px',
      asidePos: wide ? 'sticky' : 'static',
      twoCols: mid ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      threeCols: mid ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
      steps,
      showHead: !done,
      stepKicker: 'Step ' + step + ' of 6',
      stepTitle: heads[step - 1][0],
      stepSub: heads[step - 1][1],
      hasFields: !done && fields.length > 0,
      fields,
      d,
      hasGroups: !done && groups.length > 0,
      groups,
      hasToggles: !done && toggles.length > 0,
      toggles,
      isS4: step === 4 && !done,
      photoTiles: tiles,
      photoCols: mid ? 'repeat(3,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))',
      photoCount: photos.length + ' / 6',
      onPhotos: (e) => {
        const fs = Array.from(e.target.files || []);
        if (!fs.length) return;
        this.setState((s) => ({ photos: [...s.photos, ...fs.map((f) => URL.createObjectURL(f))].slice(0, 6) }));
        e.target.value = '';
      },
      isS6: step === 6 && !done,
      toggleTerms: () => this.setState({ terms: !terms }),
      termsBg: terms ? '#0890E8' : '#fff',
      termsBorder: terms ? '#0890E8' : err(6, 'terms') ? '#e0787c' : '#cfdceb',
      payErrDisplay: tried[6] && step === 6 && !terms ? 'block' : 'none',
      payErrText: 'Please confirm and accept the terms to submit.',
      isDone: done,
      showNav: !done,
      doneTitle: (d.centre.trim() || 'Your centre') + ' is submitted',
      nextSteps: [
        {
          n: '1',
          t: 'We review your listing',
          b: 'Our team checks your licensing and contact details.',
        },
        {
          n: '2',
          t: 'Your listing goes live',
          b: 'Once approved, it appears on your province and city pages.',
        },
        {
          n: '3',
          t: 'Manage from your dashboard',
          b: 'Update details, add photos and pricing, and see enquiries.',
        },
      ],
      editAgain: () => this.setState({ done: false, step: 1 }),
      back: () => go(Math.max(1, step - 1)),
      backVis: step > 1 ? 'visible' : 'hidden',
      next,
      nextLabel: step === 6 ? (sending ? 'Sending…' : 'Submit for review') : 'Continue to ' + names[step].toLowerCase(),
      nextBg: step === 6 ? '#D82028' : '#0890E8',
      nextShadow: step === 6 ? '0 14px 28px -14px rgba(216,32,40,.7)' : 'none',
      lockDisplay: 'none',
      strengthPct: strength + '%',
      strengthColor: strength >= 80 ? '#2fb46b' : strength >= 40 ? '#0890E8' : '#F5A623',
      coverBg: photos[0]
        ? 'url(' + photos[0] + ')'
        : 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
      noCover: !photos[0],
      pvStatus: done ? 'Waiting for review' : 'Draft',
      pvStatusDot: done ? '#F5B83D' : '#b7c7d8',
      pvPhotos: photos.length + ' photos',
      pvPhotosDisplay: photos.length > 1 ? 'inline-flex' : 'none',
      pvCategory: provName + ' Rehabs',
      pvName: d.centre.trim() || 'Your centre name',
      pvNameColor: d.centre.trim() ? '#10233a' : muted,
      pvAddress:
        d.address.trim() || d.city.trim()
          ? [d.address.trim(), d.city.trim() ? d.city.trim() + ', ' + d.prov : ''].filter(Boolean).join(', ')
          : 'Street address, City',
      pvTag: d.tagline.trim() || 'Your headline tells families what makes your centre different.',
      pvTagColor: d.tagline.trim() ? '#1f3550' : muted,
      pvGlance,
      pvChips,
      checklist: checks.map(([label, ok]) => ({
        label,
        color: ok ? '#1f3550' : '#6b7f95',
        dotBg: ok ? '#2fb46b' : '#fff',
        dotBorder: ok ? '#2fb46b' : '#cfdceb',
      })),
      footerCols: [
        {
          title: 'Types of Services',
          links: L([
            'Detox Centres in Canada|detox-centres-in-canada',
            'Drug Rehabilitation in Canada|drug-rehabilitation-in-canada',
            'Residential Drug Rehabs|residential-drug-rehabs-in-canada',
            'Outpatient Drug Rehab|outpatient-drug-rehab-centers',
          ]),
        },
        {
          title: 'Special Services',
          links: L([
            'Adolescent Drug Rehab|adolescent-drug-rehab-center',
            'Christian Faith-Based Rehabs|christian-faith-based-rehabs-in-canada',
            'Drug & Alcohol Assessments|drug-alcohol-assessments',
            'Dual Diagnosis|dual-diagnosis',
          ]),
        },
        {
          title: 'For Providers',
          links: [
            { label: 'List Your Centre', href: '/centre-onboarding/' },
            { label: 'Claim Your Listing', href: '/claim-listing' },
            { label: 'Create a Therapist Profile', href: '/auth?mode=signup&type=therapist' },
            { label: 'Promote Your Centre', href: '/promote' },
          ],
        },
      ],
      footGrid: wide ? 'minmax(0,1.25fr) repeat(3,minmax(0,1fr))' : mid ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      iconCheckSm: this.icon(['M5 12.5l4.5 4.5L19 7.5'], { width: 13, height: 13, strokeWidth: 3 }),
      iconCheckTiny: this.icon(['M5 12.5l4.5 4.5L19 7.5'], { width: 10, height: 10, strokeWidth: 3.4 }),
      iconCheckLg: this.icon(['M5 12.5l4.5 4.5L19 7.5'], { width: 36, height: 36, strokeWidth: 2.6 }),
      iconArrow: this.icon(['M5 12h14', 'M13 6l6 6-6 6'], { width: 16, height: 16, strokeWidth: 2 }),
      iconLock: this.icon(
        [{ t: 'rect', a: { x: 5, y: 11, width: 14, height: 10, rx: 2 } }, 'M8 11V8a4 4 0 0 1 8 0v3'],
        { width: 15, height: 15, strokeWidth: 2 },
      ),
      iconShield: this.icon(['M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z', 'M9 12l2 2 4-4'], {
        width: 18,
        height: 18,
        strokeWidth: 2,
      }),
      iconUpload: this.icon(['M12 16V4', 'M7 9l5-5 5 5', 'M5 20h14'], { width: 18, height: 18, strokeWidth: 2 }),
      iconPinSm: this.icon(
        ['M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z', { t: 'circle', a: { cx: 12, cy: 10, r: 2.5 } }],
        { width: 14, height: 14, strokeWidth: 2 },
      ),
      iconPhoneTop: this.icon(
        ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'],
        { width: 16, height: 16, strokeWidth: 2 },
      ),
      iconMaple: this.icon(
        [
          'M12 3l1.8 3.5 3.2-1-1 3.5 3.5 1.5-3 2.5 2 3-4-.5-.5 3.5-2-2.5-2 2.5-.5-3.5-4 .5 2-3-3-2.5 3.5-1.5-1-3.5 3.2 1z',
        ],
        { width: 18, height: 18, strokeWidth: 1.4 },
      ),
    };
  }
}

/* ───────────────────────── markup ───────────────────────── */
function template(v) {
  const {
    asidePos,
    authCta,
    back,
    backVis,
    bodyCols,
    bodyPad,
    checklist,
    coverBg,
    d,
    doneTitle,
    editAgain,
    fields,
    footGrid,
    footerCols,
    groups,
    h1Size,
    hasFields,
    hasGroups,
    hasToggles,
    iconArrow,
    iconCheckLg,
    iconCheckSm,
    iconCheckTiny,
    iconLock,
    iconMaple,
    iconPhoneTop,
    iconPinSm,
    iconShield,
    iconUpload,
    introPad,
    isDone,
    isS4,
    isS6,
    lockDisplay,
    next,
    nextBg,
    nextLabel,
    nextShadow,
    nextSteps,
    noCover,
    onPhotos,
    panelPad,
    payCols,
    payErrDisplay,
    payErrText,
    photoCols,
    photoCount,
    photoTiles,
    pvAddress,
    pvCategory,
    pvChips,
    pvGlance,
    pvName,
    pvNameColor,
    pvPhotos,
    pvPhotosDisplay,
    pvStatus,
    pvStatusDot,
    pvTag,
    pvTagColor,
    saveLabel,
    showHead,
    showNav,
    stepKicker,
    stepSub,
    stepTitle,
    steps,
    strengthColor,
    strengthPct,
    termsBg,
    termsBorder,
    threeCols,
    toggleTerms,
    toggles,
    topRef,
    twoCols,
  } = v;
  return (
    <>
      <div data-design-exact="" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        <section
          data-screen-label="Centre onboarding intro"
          style={{
            background: 'radial-gradient(900px 480px at 85% -20%,#d6ecfb 0%,rgba(214,236,251,0) 60%),#f7fafd',
            borderBottom: '1px solid #e9eff5',
          }}
        >
          <div
            style={$css(
              `max-width:1280px;margin:0 auto;padding:${introPad ?? ''};display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:24px`,
            )}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '700px' }}>
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
                    background: '#0890E8',
                    boxShadow: '0 0 0 4px rgba(8,144,232,.18)',
                  }}
                />
                List your treatment centre
              </span>
              <h1 style={$css(`font:600 ${h1Size ?? ''}/1.06 Jost,sans-serif;color:#10233a`)}>
                Create your centre's <span style={{ color: '#0890E8' }}>verified profile</span>
              </h1>
              <p style={{ fontSize: '17.5px', lineHeight: '1.6', color: '#516378' }}>
                Six short steps. Watch your listing take shape on the right as you go — your progress saves
                automatically.
              </p>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 14px 8px 8px',
                borderRadius: '999px',
                background: '#fff',
                border: '1px solid #e6eef6',
                boxShadow: '0 10px 24px -18px rgba(16,35,58,.35)',
              }}
            >
              <span
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: '#e6f4ec',
                  color: '#1f8a52',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {$i(iconCheckSm)}
              </span>
              <span style={{ font: '500 14px Figtree,sans-serif', color: '#1f3550' }}>{$i(saveLabel)}</span>
              {authCta ? (
                <>
                  <$A
                    href="/auth?mode=login"
                    style={{ font: '600 14px Jost,sans-serif', paddingLeft: '10px', borderLeft: '1px solid #e6eef6' }}
                  >
                    Log in
                  </$A>
                </>
              ) : null}
            </div>
          </div>
        </section>
        <section
          data-screen-label="Centre onboarding builder"
          ref={topRef}
          style={{ background: '#f7fafd', flex: '1' }}
        >
          <div
            style={$css(
              `max-width:1280px;margin:0 auto;padding:${bodyPad ?? ''};display:grid;grid-template-columns:${bodyCols ?? ''};gap:28px;align-items:start`,
            )}
            data-rc-dyn="1"
          >
            <div
              style={$css(
                `background:#fff;border:1px solid #e6eef6;border-radius:32px;padding:${panelPad ?? ''};box-shadow:0 24px 50px -40px rgba(16,35,58,.35);min-width:0;display:flex;flex-direction:column;gap:28px`,
              )}
            >
              <ol
                style={{
                  listStyle: 'none',
                  margin: '0',
                  padding: '0',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6,minmax(0,1fr))',
                  gap: '8px',
                }}
                data-cols="repeat(6,minmax(0,1fr))"
              >
                {$list(steps).map((st, $index) => (
                  <Fragment key={$index}>
                    <li style={{ display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '0' }}>
                      <span
                        style={$css(
                          `height:4px;border-radius:4px;background:${st?.bar ?? ''};transition:background .3s ease`,
                        )}
                      />
                      <button
                        onClick={st?.go}
                        style={$css(
                          `appearance:none;border:0;background:transparent;padding:0;cursor:${st?.cursor ?? ''};text-align:left;display:flex;align-items:center;gap:8px;min-width:0`,
                        )}
                      >
                        <span
                          style={$css(
                            `width:28px;height:28px;border-radius:50%;background:${st?.dotBg ?? ''};color:${st?.dotColor ?? ''};border:1.5px solid ${st?.dotBorder ?? ''};display:grid;place-items:center;font:600 13px Jost,sans-serif;flex-shrink:0;transition:background .25s ease,color .25s ease,border-color .25s ease`,
                          )}
                        >
                          {$i(st?.mark)}
                        </span>
                        <span
                          style={$css(
                            `display:${st?.labelDisplay ?? ''};font:600 13.5px Figtree,sans-serif;color:${st?.labelColor ?? ''};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`,
                          )}
                        >
                          {$i(st?.label)}
                        </span>
                      </button>
                    </li>
                  </Fragment>
                ))}
              </ol>
              {showHead ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span
                      style={{
                        font: '600 12px Figtree,sans-serif',
                        letterSpacing: '.12em',
                        textTransform: 'uppercase',
                        color: '#0890E8',
                      }}
                    >
                      {$i(stepKicker)}
                    </span>
                    <h2 style={{ fontSize: '28px' }}>{$i(stepTitle)}</h2>
                    <p style={{ fontSize: '15.5px', color: '#516378' }}>{$i(stepSub)}</p>
                  </div>
                </>
              ) : null}
              {hasFields ? (
                <>
                  <div
                    style={$css(
                      `display:grid;grid-template-columns:${twoCols ?? ''};gap:16px;animation:obFade .3s ease-out`,
                    )}
                    data-rc-dyn="1"
                  >
                    {$list(fields).map((f, $index) => (
                      <Fragment key={$index}>
                        <label
                          style={$css(
                            `display:flex;flex-direction:column;gap:7px;min-width:0;grid-column:${f?.span ?? ''}`,
                          )}
                        >
                          <span style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                            <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>
                              {$i(f?.label)}
                            </span>
                            <span style={$css(`font:500 12.5px Figtree,sans-serif;color:${f?.countColor ?? ''}`)}>
                              {$i(f?.count)}
                            </span>
                          </span>
                          {f?.isInput ? (
                            <>
                              <span
                                style={$css(
                                  `display:flex;align-items:center;height:50px;border-radius:14px;border:1.5px solid ${f?.border ?? ''};background:#fff;overflow:hidden`,
                                )}
                              >
                                <span
                                  style={$css(
                                    `display:${f?.preDisplay ?? ''};padding:0 2px 0 16px;font:600 15.5px Jost,sans-serif;color:#6b7f95`,
                                  )}
                                >
                                  {$i(f?.pre)}
                                </span>
                                <input
                                  type={f?.type}
                                  value={$val(f?.value)}
                                  onChange={f?.onChange}
                                  placeholder={f?.placeholder}
                                  inputMode={f?.mode}
                                  style={$css(
                                    `flex:1;min-width:0;height:100%;border:0;outline:none;padding:0 16px 0 ${f?.padL ?? ''};font:500 15.5px Figtree,sans-serif;color:#10233a;background:transparent`,
                                  )}
                                />
                              </span>
                            </>
                          ) : null}
                          {f?.isSelect ? (
                            <>
                              <select
                                value={$val(f?.value)}
                                onChange={f?.onChange}
                                style={$css(
                                  `height:50px;padding:0 14px;border-radius:14px;border:1.5px solid ${f?.border ?? ''};background:#fff;font:500 15.5px Figtree,sans-serif;color:#10233a;outline:none`,
                                )}
                              >
                                {$list(f?.options).map((o, $index) => (
                                  <Fragment key={$index}>
                                    <option value={$val(o?.v)}>{o?.l}</option>
                                  </Fragment>
                                ))}
                              </select>
                            </>
                          ) : null}
                          {f?.isArea ? (
                            <>
                              <textarea
                                className="scpf"
                                value={$val(f?.value)}
                                onChange={f?.onChange}
                                rows="7"
                                maxLength="2000"
                                placeholder={f?.placeholder}
                                style={$css(
                                  `padding:14px 16px;border-radius:14px;border:1.5px solid ${f?.border ?? ''};background:#fff;font:500 15.5px/1.6 Figtree,sans-serif;color:#10233a;outline:none;resize:vertical`,
                                )}
                              />
                            </>
                          ) : null}
                          <span
                            style={$css(
                              `display:${f?.errDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`,
                            )}
                          >
                            {$i(f?.err)}
                          </span>
                        </label>
                      </Fragment>
                    ))}
                  </div>
                </>
              ) : null}
              {isS4 ? (
                <>
                  <p style={{ fontSize: '14px', color: '#516378', margin: 0 }}>Photos are added from your dashboard after your listing is approved, so they are uploaded to your own account.</p>
                </>
              ) : null}
              {hasGroups ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '22px', animation: 'obFade .3s ease-out' }}
                  >
                    {$list(groups).map((g, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'baseline',
                              justifyContent: 'space-between',
                              gap: '10px',
                            }}
                          >
                            <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>
                              {$i(g?.title)}
                            </span>
                            <span style={{ font: '500 12.5px Figtree,sans-serif', color: '#6b7f95' }}>
                              {$i(g?.count)}
                            </span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {$list(g?.chips).map((c, $index) => (
                              <Fragment key={$index}>
                                <button
                                  className="scpx"
                                  onClick={c?.toggle}
                                  aria-pressed={c?.pressed}
                                  style={$css(
                                    `appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:7px;height:40px;padding:0 15px 0 ${c?.padL ?? ''};border-radius:999px;border:1.5px solid ${c?.border ?? ''};background:${c?.bg ?? ''};color:${c?.color ?? ''};font:500 14px Figtree,sans-serif;transition:background .15s ease,border-color .15s ease,color .15s ease,transform .12s ease-out`,
                                  )}
                                >
                                  <span style={$css(`display:${c?.tickDisplay ?? ''}`)}>{$i(iconCheckSm)}</span>
                                  {$i(c?.label)}
                                </button>
                              </Fragment>
                            ))}
                          </div>
                          <span
                            style={$css(
                              `display:${g?.errDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`,
                            )}
                          >
                            {$i(g?.err)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </>
              ) : null}
              {hasToggles ? (
                <>
                  <div style={$css(`display:grid;grid-template-columns:${twoCols ?? ''};gap:10px`)} data-rc-dyn="1">
                    {$list(toggles).map((t, $index) => (
                      <Fragment key={$index}>
                        <button
                          onClick={t?.toggle}
                          style={$css(
                            `appearance:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 16px;border-radius:18px;border:1.5px solid ${t?.border ?? ''};background:${t?.bg ?? ''};text-align:left;transition:border-color .15s ease,background .15s ease`,
                          )}
                        >
                          <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ font: '600 15px Jost,sans-serif', color: '#10233a' }}>{$i(t?.title)}</span>
                            <span style={{ fontSize: '13px', color: '#516378' }}>{$i(t?.body)}</span>
                          </span>
                          <span
                            style={$css(
                              `width:44px;height:26px;border-radius:999px;background:${t?.track ?? ''};position:relative;flex-shrink:0;transition:background .2s ease`,
                            )}
                          >
                            <span
                              style={$css(
                                `position:absolute;top:3px;left:${t?.knob ?? ''};width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(16,35,58,.25);transition:left .2s cubic-bezier(.23,1,.32,1)`,
                              )}
                            />
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </>
              ) : null}
              {isS6 ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', animation: 'obFade .3s ease-out' }}>
                    <p style={{ fontSize: '15.5px', lineHeight: '1.6', color: '#3b4d63', margin: 0 }}>
                      Check the details in the preview, then submit. There is nothing to pay. Our team reviews every new listing; once it is approved you can sign in to edit your page, add photos and pricing, and see enquiries.
                    </p>
                    <button
                      onClick={toggleTerms}
                      style={{ appearance: 'none', border: '0', background: 'transparent', padding: '0', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '12px', textAlign: 'left' }}
                    >
                      <span
                        style={$css(
                          `width:22px;height:22px;border-radius:7px;border:1.5px solid ${termsBorder ?? ''};background:${termsBg ?? ''};color:#fff;display:grid;place-items:center;flex-shrink:0;margin-top:1px`,
                        )}
                      >
                        {$i(iconCheckSm)}
                      </span>
                      <span style={{ fontSize: '14.5px', lineHeight: '1.5', color: '#3b4d63' }}>
                        I'm authorized to list this centre and agree to the{' '}
                        <$A href="/terms-of-use" style={{ fontWeight: '600' }}>Terms of Use</$A>.
                      </span>
                    </button>
                    <span style={$css(`display:${payErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d;margin-top:-14px`)}>{$i(payErrText)}</span>
                    <Honeypot />
                    <FormError message={formError} fields={formFields} />
                  </div>
                </>
              ) : null}
              {isDone ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      gap: '16px',
                      padding: '20px 0 10px',
                      animation: 'obFade .35s ease-out',
                    }}
                  >
                    <span
                      style={{
                        width: '76px',
                        height: '76px',
                        borderRadius: '50%',
                        background: '#e6f4ec',
                        color: '#1f8a52',
                        display: 'grid',
                        placeItems: 'center',
                        animation: 'obPop .5s cubic-bezier(.23,1,.32,1)',
                      }}
                    >
                      {$i(iconCheckLg)}
                    </span>
                    <h2 style={{ fontSize: '32px' }}>{$i(doneTitle)}</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#516378', maxWidth: '540px' }}>
                      We saved your listing and sent a confirmation to {$i(d?.email)}. Our team will review it and
                      email you the result.
                    </p>
                    <ol
                      style={$css(
                        `list-style:none;margin:10px 0 0;padding:0;display:grid;grid-template-columns:${threeCols ?? ''};gap:10px;width:100%;text-align:left`,
                      )}
                      data-rc-dyn="1"
                    >
                      {$list(nextSteps).map((ns, $index) => (
                        <Fragment key={$index}>
                          <li
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '8px',
                              padding: '18px',
                              borderRadius: '20px',
                              background: '#f7fafd',
                              border: '1px solid #e6eef6',
                            }}
                          >
                            <span
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '10px',
                                background: '#0890E8',
                                color: '#fff',
                                display: 'grid',
                                placeItems: 'center',
                                font: '600 14px Jost,sans-serif',
                              }}
                            >
                              {$i(ns?.n)}
                            </span>
                            <span style={{ font: '600 15.5px Jost,sans-serif', color: '#10233a' }}>{$i(ns?.t)}</span>
                            <span style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#516378' }}>{$i(ns?.b)}</span>
                          </li>
                        </Fragment>
                      ))}
                    </ol>
                    <div
                      style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        marginTop: '8px',
                      }}
                    >
                      <$A
                        className="scp1"
                        href="/dashboard"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '48px',
                          padding: '0 22px',
                          borderRadius: '999px',
                          background: '#0890E8',
                          color: '#fff',
                          font: '600 15px Jost,sans-serif',
                        }}
                      >
                        Go to your dashboard
                        {$i(iconArrow)}
                      </$A>
                      <$A
                        className="scp2"
                        href="/twelve-mile-recovery/"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '48px',
                          padding: '0 22px',
                          borderRadius: '999px',
                          background: '#fff',
                          color: '#1f3550',
                          border: '1.5px solid #dbe6f0',
                          font: '600 15px Jost,sans-serif',
                        }}
                      >
                        View an example listing
                        {$i(iconArrow)}
                      </$A>
                      <button
                        className="scp2"
                        onClick={editAgain}
                        style={{
                          appearance: 'none',
                          cursor: 'pointer',
                          height: '48px',
                          padding: '0 20px',
                          borderRadius: '999px',
                          border: '1.5px solid #dbe6f0',
                          background: '#fff',
                          color: '#1f3550',
                          font: '600 15px Jost,sans-serif',
                        }}
                      >
                        Keep editing
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
              {showNav ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '12px',
                      flexWrap: 'wrap',
                      paddingTop: '18px',
                      borderTop: '1px solid #edf2f7',
                    }}
                  >
                    <button
                      className="scp2"
                      onClick={back}
                      style={$css(
                        `appearance:none;cursor:pointer;height:48px;padding:0 20px;border-radius:999px;border:1.5px solid #dbe6f0;background:#fff;color:#1f3550;font:600 15px Jost,sans-serif;visibility:${backVis ?? ''}`,
                      )}
                    >
                      Back
                    </button>
                    <button
                      className="scpy"
                      onClick={next}
                      style={$css(
                        `appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:52px;padding:0 24px;border-radius:999px;background:${nextBg ?? ''};color:#fff;font:600 15.5px Jost,sans-serif;box-shadow:${nextShadow ?? ''};transition:background .15s ease,transform .12s ease-out`,
                      )}
                    >
                      <span style={$css(`display:${lockDisplay ?? ''}`)}>{$i(iconLock)}</span>
                      {$i(nextLabel)}
                      {$i(iconArrow)}
                    </button>
                  </div>
                </>
              ) : null}
            </div>
            <aside
              style={$css(
                `position:${asidePos ?? ''};top:130px;display:flex;flex-direction:column;gap:14px;min-width:0`,
              )}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                  padding: '0 6px',
                }}
              >
                <span
                  style={{
                    font: '600 11.5px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#6b7f95',
                  }}
                >
                  Live preview
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    font: '600 13px Figtree,sans-serif',
                    color: '#1f3550',
                  }}
                >
                  Listing strength{' '}
                  <span style={$css(`font:600 13px Jost,sans-serif;color:${strengthColor ?? ''}`)}>
                    {$i(strengthPct)}
                  </span>
                </span>
              </div>
              <span
                style={{
                  height: '6px',
                  borderRadius: '6px',
                  background: '#e6eef6',
                  overflow: 'hidden',
                  margin: '-4px 6px 0',
                }}
              >
                <span
                  style={$css(
                    `display:block;height:100%;width:${strengthPct ?? ''};background:${strengthColor ?? ''};border-radius:6px;transition:width .4s cubic-bezier(.23,1,.32,1),background .3s ease`,
                  )}
                />
              </span>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e6eef6',
                  borderRadius: '28px',
                  overflow: 'hidden',
                  boxShadow: '0 30px 60px -40px rgba(16,35,58,.45)',
                }}
              >
                <div
                  style={$css(
                    `position:relative;aspect-ratio:16/9;background:${coverBg ?? ''};background-size:cover;background-position:center`,
                  )}
                >
                  <span
                    style={{
                      position: 'absolute',
                      inset: '0',
                      background: 'linear-gradient(180deg,rgba(16,35,58,.3),rgba(16,35,58,0) 45%)',
                    }}
                  />
                  {noCover ? (
                    <>
                      <span
                        style={{
                          position: 'absolute',
                          inset: '0',
                          display: 'grid',
                          placeItems: 'center',
                          font: '500 13px Figtree,sans-serif',
                          color: '#6b7f95',
                        }}
                      >
                        Your cover photo
                      </span>
                    </>
                  ) : null}
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '26px',
                      padding: '0 10px 0 8px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,.94)',
                      color: '#10233a',
                      font: '600 12px Figtree,sans-serif',
                      boxShadow: '0 6px 16px -8px rgba(0,0,0,.45)',
                    }}
                  >
                    <span style={$css(`width:7px;height:7px;border-radius:50%;background:${pvStatusDot ?? ''}`)} />
                    {$i(pvStatus)}
                  </span>
                  <span
                    style={$css(
                      `position:absolute;right:12px;bottom:12px;height:24px;padding:0 9px;border-radius:999px;background:rgba(16,35,58,.7);color:#fff;font:600 11.5px Figtree,sans-serif;display:${pvPhotosDisplay ?? ''};align-items:center`,
                    )}
                  >
                    {$i(pvPhotos)}
                  </span>
                </div>
                <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span
                      style={{
                        font: '600 11.5px Figtree,sans-serif',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        color: '#0890E8',
                      }}
                    >
                      {$i(pvCategory)}
                    </span>
                    <span style={$css(`font:600 21px/1.2 Jost,sans-serif;color:${pvNameColor ?? ''}`)}>
                      {$i(pvName)}
                    </span>
                    <span
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7f95' }}
                    >
                      <span style={{ display: 'flex', color: '#0890E8' }}>{$i(iconPinSm)}</span>
                      {$i(pvAddress)}
                    </span>
                  </div>
                  <p style={$css(`font:500 15px/1.5 Jost,sans-serif;color:${pvTagColor ?? ''}`)}>{$i(pvTag)}</p>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2,minmax(0,1fr))',
                      gap: '1px',
                      background: '#edf2f7',
                      border: '1px solid #edf2f7',
                      borderRadius: '16px',
                      overflow: 'hidden',
                    }}
                    data-cols="repeat(2,minmax(0,1fr))"
                  >
                    {$list(pvGlance).map((gl, $index) => (
                      <Fragment key={$index}>
                        <div
                          style={{
                            background: '#fff',
                            padding: '10px 12px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            minWidth: '0',
                          }}
                        >
                          <span
                            style={{
                              font: '600 10.5px Figtree,sans-serif',
                              letterSpacing: '.1em',
                              textTransform: 'uppercase',
                              color: '#6b7f95',
                            }}
                          >
                            {$i(gl?.k)}
                          </span>
                          <span
                            style={$css(
                              `font:600 13.5px Jost,sans-serif;color:${gl?.color ?? ''};overflow-wrap:anywhere`,
                            )}
                          >
                            {$i(gl?.v)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {$list(pvChips).map((pc, $index) => (
                      <Fragment key={$index}>
                        <span
                          style={$css(
                            `font:500 12.5px Figtree,sans-serif;padding:5px 10px;border-radius:999px;background:${pc?.bg ?? ''};color:${pc?.color ?? ''};border:1px solid ${pc?.border ?? ''}`,
                          )}
                        >
                          {$i(pc?.label)}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }} data-cols="1fr 1fr">
                    <span
                      style={{
                        height: '42px',
                        borderRadius: '999px',
                        background: '#0890E8',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        font: '600 14px Jost,sans-serif',
                      }}
                    >
                      Call centre
                    </span>
                    <span
                      style={{
                        height: '42px',
                        borderRadius: '999px',
                        border: '1.5px solid #dbe6f0',
                        color: '#1f3550',
                        display: 'grid',
                        placeItems: 'center',
                        font: '600 14px Jost,sans-serif',
                      }}
                    >
                      Website
                    </span>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e6eef6',
                  borderRadius: '22px',
                  padding: '16px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                <span style={{ font: '600 13.5px Jost,sans-serif', color: '#10233a' }}>To finish your listing</span>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                  {$list(checklist).map((ck, $index) => (
                    <Fragment key={$index}>
                      <li
                        style={$css(
                          `display:flex;align-items:center;gap:9px;font-size:13.5px;color:${ck?.color ?? ''}`,
                        )}
                      >
                        <span
                          style={$css(
                            `width:18px;height:18px;border-radius:50%;background:${ck?.dotBg ?? ''};border:1.5px solid ${ck?.dotBorder ?? ''};color:#fff;display:grid;place-items:center;flex-shrink:0`,
                          )}
                        >
                          {$i(iconCheckTiny)}
                        </span>
                        {$i(ck?.label)}
                      </li>
                    </Fragment>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>
        <SiteFooter />
      </div>
    </>
  );
}

export const ownCss =
  '\nhtml,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\ninput,select,button,textarea{font-family:inherit}\ninput::placeholder,textarea::placeholder{color:#8a9bb0}\n@keyframes topCallRing{0%{transform:scale(1);opacity:.7}70%,100%{transform:scale(1.7);opacity:0}}\n@keyframes obFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@keyframes obPop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}\n';
export const css = [ownCss, SiteHeader_css].filter(Boolean).join('\n');
export const defaults = {};
const View = createDC('CentreOnboarding', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} responsive {...props} />;
}
