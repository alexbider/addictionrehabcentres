'use client';
// Generated from TherapistOnboarding.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  static KEY = 'arc-therapist-onboarding-draft';
  blank = {
    name: '',
    email: '',
    phone: '',
    desig: '',
    reg: '',
    years: '',
    city: '',
    prov: 'ON',
    modes: [],
    langs: ['English'],
    clients: [],
    concerns: [],
    approaches: [],
    accepting: true,
    tagline: '',
    bio: '',
    fee: '',
    couples: '',
    sliding: false,
    consult: true,
    payments: [],
  };
  state = {
    vw: 1280,
    step: 1,
    maxStep: 1,
    tried: {},
    d: this.blank,
    photo: '',
    plan: 'Featured',
    annual: false,
    pay: { card: '', exp: '', cvc: '', postal: '' },
    terms: false,
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
          plan: o.plan || 'Featured',
          annual: !!o.annual,
          saved: true,
        });
      }
    } catch (e) {}

    try {
      const u = JSON.parse(localStorage.getItem('arc-auth-user') || 'null');
      if (u && u.signedIn) {
        this.setState((s) => ({
          user: u,
          d: { ...s.d, name: s.d.name || u.name || '', email: s.d.email || u.email || '' },
        }));
      }
    } catch (e) {}
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._r);
  }
  componentDidUpdate(pp, ps) {
    const s = this.state;
    if (ps.d !== s.d || ps.step !== s.step || ps.plan !== s.plan || ps.annual !== s.annual) {
      try {
        localStorage.setItem(
          Component.KEY,
          JSON.stringify({ d: s.d, step: s.step, maxStep: s.maxStep, plan: s.plan, annual: s.annual }),
        );
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
    const B = 'https://addictionrehabcenters.ca/';
    const { vw, step, maxStep, tried, d, photo, plan, annual, pay, terms, done, saved } = this.state;
    const wide = vw >= 1060,
      mid = vw >= 700;
    const planLimit = plan === 'Professional' ? 8 : 20;

    const desigs = [
      ['RP', 'Registered Psychotherapist', 'CRPO'],
      ['C.Psych', 'Psychologist', 'CPO'],
      ['R.Psych', 'Registered Psychologist', 'Provincial college'],
      ['RSW', 'Registered Social Worker', 'Provincial college'],
      ['RCC', 'Registered Clinical Counsellor', 'BCACC'],
      ['CCC', 'Canadian Certified Counsellor', 'CCPA'],
      ['CCAC', 'Certified Addiction Counsellor', 'CACCF'],
      ['Other', 'Other regulated designation', 'Your regulator'],
    ];
    const dObj = desigs.find((x) => x[0] === d.desig);
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

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email);
    const specCount = d.concerns.length + d.approaches.length;
    const v = {
      1: {
        name: !d.name.trim() ? 'Enter your full name.' : '',
        email: !emailOk ? 'Enter a valid email.' : '',
        desig: !d.desig ? 'x' : '',
        reg: d.reg.trim().length < 3 ? 'x' : '',
      },
      2: {
        city: !d.city.trim() ? 'x' : '',
        modes: !d.modes.length ? 'Choose at least one session type.' : '',
        concerns: !d.concerns.length ? 'Choose at least one concern you work with.' : '',
        limit: specCount > planLimit ? 'x' : '',
      },
      3: { tagline: !d.tagline.trim() ? 'x' : '', bio: d.bio.trim().length < 120 ? 'x' : '' },
      4: { fee: !/^\d{2,4}$/.test(d.fee.trim()) ? 'Enter your fee for an individual session.' : '' },
    };
    const digits = (x) => x.replace(/\D/g, '');
    const payErr = {
      card: digits(pay.card).length < 15 ? 'Enter a valid card number.' : '',
      exp: !/^(0[1-9]|1[0-2])\/\d{2}$/.test(pay.exp) ? 'Use MM/YY.' : '',
      cvc: digits(pay.cvc).length < 3 ? 'Enter the CVC.' : '',
      postal: pay.postal.trim().length < 3 ? 'Enter your postal code.' : '',
    };
    v[5] = { ...payErr, terms: !terms ? 'x' : '' };
    const stepOk = (n) => Object.values(v[n]).every((x) => !x);
    const t = tried[step];
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
      if (step === 5) {
        this.setState({ done: true });
        try {
          localStorage.removeItem(Component.KEY);
        } catch (e) {}
        this.toTop();
        return;
      }
      go(step + 1);
    };

    const names = ['About you', 'Practice', 'Profile', 'Fees', 'Plan & pay'];
    const steps = names.map((label, i) => {
      const n = i + 1,
        cur = n === step && !done,
        past = done || n < step || (n <= maxStep && n !== step && stepOk(n)),
        reach = n <= maxStep && !done;
      return {
        label,
        mark: past && !cur ? '✓' : String(n),
        go: () => {
          if (reach) go(n);
        },
        cursor: reach ? 'pointer' : 'default',
        bar: past || cur ? '#0890E8' : '#e6eef6',
        dotBg: past && !cur ? '#0890E8' : cur ? '#fff' : '#f5f8fb',
        dotColor: past && !cur ? '#fff' : cur ? '#0890E8' : '#9aabbd',
        dotBorder: past || cur ? '#0890E8' : '#e3ecf4',
        labelColor: cur ? '#10233a' : past ? '#1f3550' : '#9aabbd',
        labelDisplay: mid ? 'block' : cur ? 'block' : 'none',
      };
    });

    const field = (n, k, label, type, placeholder) => {
      const bad = err(n, k);
      return {
        label,
        type,
        placeholder,
        value: d[k],
        onChange: (e) => this.set(k, e.target.value),
        err: v[n][k],
        errDisplay: bad ? 'block' : 'none',
        border: bad ? '#e0787c' : '#dbe6f0',
      };
    };
    const s1Fields = [
      field(1, 'name', 'Full name', 'text', 'e.g. Maya Chen'),
      field(1, 'email', 'Email', 'email', 'you@yourpractice.ca'),
      field(1, 'phone', 'Phone (optional)', 'tel', '(555) 555-5555'),
    ];
    const designations = desigs.map(([code, name]) => {
      const on = d.desig === code;
      return {
        code,
        name,
        pressed: on ? 'true' : 'false',
        select: () => this.set('desig', code),
        border: on ? '#0890E8' : err(1, 'desig') ? '#e0787c' : '#e6eef6',
        bg: on ? '#f3f9fe' : '#fff',
      };
    });

    const chipGroup = (k, opts, opt = {}) =>
      opts.map((label) => {
        const on = d[k].includes(label);
        const full = opt.full && !on;
        return {
          label,
          pressed: on ? 'true' : 'false',
          toggle: () => {
            if (full) return;
            this.set(k, on ? d[k].filter((x) => x !== label) : [...d[k], label]);
          },
          bg: on ? '#0890E8' : '#fff',
          color: on ? '#fff' : '#1f3550',
          border: on ? '#0890E8' : '#dbe6f0',
          tickDisplay: on ? 'flex' : 'none',
          padL: on ? '11px' : '15px',
          op: full ? '.45' : '1',
        };
      });
    const atLimit = specCount >= planLimit;
    const s2Groups = [
      {
        title: 'Session types',
        chips: chipGroup('modes', ['In person', 'Online', 'Phone']),
        count: '',
        countColor: '#6b7f95',
        err: v[2].modes,
        errDisplay: err(2, 'modes') ? 'block' : 'none',
      },
      {
        title: 'Concerns you work with',
        chips: chipGroup(
          'concerns',
          [
            'Addiction',
            'Alcohol use',
            'Anxiety',
            'Depression',
            'Trauma and PTSD',
            'Relationship issues',
            'Grief',
            'Gambling',
            'Eating disorders',
            'Family conflict',
          ],
          { full: atLimit },
        ),
        count: specCount + ' / ' + planLimit + ' specialties',
        countColor: atLimit ? '#c0262d' : '#6b7f95',
        err: v[2].concerns,
        errDisplay: err(2, 'concerns') ? 'block' : 'none',
      },
      {
        title: 'Approaches',
        chips: chipGroup(
          'approaches',
          [
            'Cognitive Behavioural (CBT)',
            'Motivational Interviewing',
            'DBT',
            'EMDR',
            'Mindfulness-based',
            'Harm reduction',
            'Family systems',
            '12-step informed',
          ],
          { full: atLimit },
        ),
        count: plan === 'Professional' ? 'Professional plan: up to 8 in total' : '',
        countColor: '#6b7f95',
        err: '',
        errDisplay: 'none',
      },
      {
        title: 'Who you work with',
        chips: chipGroup('clients', ['Adults', 'Young adults (18–25)', 'Teens', 'Couples', 'Families', 'Seniors']),
        count: '',
        countColor: '#6b7f95',
        err: '',
        errDisplay: 'none',
      },
      {
        title: 'Languages',
        chips: chipGroup('langs', [
          'English',
          'French',
          'Punjabi',
          'Mandarin',
          'Cantonese',
          'Spanish',
          'Arabic',
          'Tagalog',
        ]),
        count: '',
        countColor: '#6b7f95',
        err: '',
        errDisplay: 'none',
      },
    ];

    const feeFields = [
      {
        label: 'Individual session',
        unit: 'per 50 min',
        placeholder: '160',
        value: d.fee,
        onChange: (e) => this.set('fee', digits(e.target.value).slice(0, 4)),
        err: v[4].fee,
        errDisplay: err(4, 'fee') ? 'block' : 'none',
        border: err(4, 'fee') ? '#e0787c' : '#dbe6f0',
      },
      {
        label: 'Couples / family session',
        unit: 'per 75 min',
        placeholder: 'Optional',
        value: d.couples,
        onChange: (e) => this.set('couples', digits(e.target.value).slice(0, 4)),
        err: '',
        errDisplay: 'none',
        border: '#dbe6f0',
      },
    ];
    const tog = (k, title, body) => {
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
    const feeToggles = [
      tog('consult', 'Free consultation', 'Offer a short intro call at no cost.'),
      tog('sliding', 'Sliding scale', 'Reduced fees for clients who need them.'),
    ];
    const s4Groups = [
      {
        title: 'Payment & coverage',
        chips: chipGroup('payments', [
          'Extended health benefits',
          'EAP programs',
          'Direct billing',
          'Credit card',
          'E-transfer',
        ]),
      },
    ];

    const planDefs = [
      [
        'Professional',
        19.95,
        [
          'Credential-verified profile',
          'Province & city page listing',
          'Message, call and website buttons',
          'Up to 8 specialties',
        ],
      ],
      [
        'Featured',
        49.95,
        [
          'Everything in Professional',
          'Featured placement at the top of your city',
          'Video introduction',
          'Monthly analytics report',
        ],
      ],
      [
        'Featured Plus',
        79.95,
        [
          'Everything in Featured',
          'Province + up to 3 cities',
          'Rehab & substance page placements',
          'Client reviews module',
        ],
      ],
    ];
    const money = (n) => '$' + n.toFixed(2);
    const plans = planDefs.map(([name, price, features]) => {
      const on = plan === name;
      const shown = annual ? (price * 10) / 12 : price;
      return {
        name,
        features,
        price: money(shown),
        billedNote: annual ? 'Billed ' + money(price * 10) + ' yearly' : 'Billed monthly',
        popular: name === 'Featured',
        pressed: on ? 'true' : 'false',
        select: () => this.setState({ plan: name }),
        border: on ? '#0890E8' : '#e6eef6',
        bg: on ? '#f3f9fe' : '#fff',
        shadow: on ? '0 18px 36px -24px rgba(8,144,232,.55)' : 'none',
        radioBorder: on ? '#0890E8' : '#cfdceb',
        radioFill: on ? '#0890E8' : 'transparent',
      };
    });
    const pObj = planDefs.find((p) => p[0] === plan);
    const charge = annual ? money(pObj[1] * 10) + '/yr' : money(pObj[1]) + '/mo';
    const billing = [
      ['Monthly', false],
      ['Annual', true],
    ].map(([label, a]) => ({
      label,
      save: a,
      select: () => this.setState({ annual: a }),
      bg: annual === a ? '#fff' : 'transparent',
      color: annual === a ? '#10233a' : '#6b7f95',
      shadow: annual === a ? '0 4px 10px -4px rgba(16,35,58,.25)' : 'none',
    }));
    const setP = (k, fmt) => (e) => {
      const val = fmt(e.target.value);
      this.setState((s) => ({ pay: { ...s.pay, [k]: val } }));
    };
    const payFields = [
      [
        'card',
        'Card number',
        '1234 1234 1234 1234',
        'numeric',
        '1 / -1',
        (x) =>
          digits(x)
            .slice(0, 16)
            .replace(/(\d{4})(?=\d)/g, '$1 '),
      ],
      [
        'exp',
        'Expiry',
        'MM/YY',
        'numeric',
        'span 1',
        (x) => {
          const q = digits(x).slice(0, 4);
          return q.length > 2 ? q.slice(0, 2) + '/' + q.slice(2) : q;
        },
      ],
      ['cvc', 'CVC', '123', 'numeric', 'span 1', (x) => digits(x).slice(0, 4)],
      ['postal', 'Postal code', 'M5V 2C3', 'text', 'span 2', (x) => x.toUpperCase().slice(0, 7)],
    ].map(([k, label, placeholder, mode, span, fmt]) => {
      const bad = err(5, k);
      return {
        label,
        placeholder,
        mode,
        span,
        value: pay[k],
        onChange: setP(k, fmt),
        err: payErr[k],
        errDisplay: bad ? 'block' : 'none',
        border: bad ? '#e0787c' : '#dbe6f0',
      };
    });
    const payBad = payErr.card || payErr.exp || payErr.cvc || payErr.postal;

    const initials = d.name.trim()
      ? d.name
          .trim()
          .split(/\s+/)
          .slice(0, 2)
          .map((w) => w[0])
          .join('')
          .toUpperCase()
      : '?';
    const provName = (provs.find((p) => p[0] === d.prov) || [0, ''])[1];
    const muted = '#9aabbd';
    const pvChips = [...d.concerns, ...d.approaches]
      .slice(0, 6)
      .map((label, i) => ({
        label,
        bg: i < d.concerns.length ? '#eaf5fd' : '#fdeceb',
        color: i < d.concerns.length ? '#0a5d96' : '#a3161d',
        border: i < d.concerns.length ? '#d6eafa' : '#f3c9c6',
      }));
    const extra = specCount - 6;
    if (extra > 0) pvChips.push({ label: '+' + extra + ' more', bg: '#f5f8fb', color: '#516378', border: '#e6eef6' });
    if (!pvChips.length)
      pvChips.push({ label: 'Your specialties appear here', bg: '#f5f8fb', color: muted, border: '#e6eef6' });
    const gl = (k, val) => ({ k, v: val || '—', color: val ? '#10233a' : muted });
    const pvGlance = [
      gl('Sessions', d.modes.join(' & ')),
      gl('Experience', d.years),
      gl('Languages', d.langs.join(', ')),
      gl('Clients', d.clients.slice(0, 3).join(', ')),
    ];

    const checks = [
      ['Name & credentials', stepOk(1)],
      ['Practice & specialties', stepOk(2)],
      ['Profile photo', !!photo],
      ['Headline & bio', stepOk(3)],
      ['Fees', stepOk(4)],
    ];
    const strength = Math.round((checks.filter((c) => c[1]).length / checks.length) * 100);
    const checklist = checks.map(([label, ok]) => ({
      label,
      color: ok ? '#1f3550' : '#6b7f95',
      dotBg: ok ? '#2fb46b' : '#fff',
      dotBorder: ok ? '#2fb46b' : '#cfdceb',
    }));

    const tagLen = d.tagline.length,
      bioLen = d.bio.trim().length;
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
      desigCols: vw >= 1180 ? 'repeat(4,minmax(0,1fr))' : mid ? 'repeat(3,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))',
      steps,
      isS1: step === 1 && !done,
      isS2: step === 2 && !done,
      isS3: step === 3 && !done,
      isS4: step === 4 && !done,
      isS5: step === 5 && !done,
      isDone: done,
      showNav: !done,
      s1Fields,
      designations,
      desigErrDisplay: err(1, 'desig') ? 'block' : 'none',
      d,
      regLabel: dObj ? dObj[2] + ' registration #' : 'Registration #',
      setReg: (e) => this.set('reg', e.target.value),
      regBorder: err(1, 'reg') ? '#e0787c' : '#dbe6f0',
      regErrDisplay: err(1, 'reg') ? 'block' : 'none',
      setYears: (e) => this.set('years', e.target.value),
      setCity: (e) => this.set('city', e.target.value),
      cityBorder: err(2, 'city') ? '#e0787c' : '#dbe6f0',
      cityErrDisplay: err(2, 'city') ? 'block' : 'none',
      setProv: (e) => this.set('prov', e.target.value),
      provOpts: provs.map(([v2, l]) => ({ v: v2, l })),
      s2Groups,
      toggleAccepting: () => this.set('accepting', !d.accepting),
      accTrack: d.accepting ? '#2fb46b' : '#cfdceb',
      accKnob: d.accepting ? '23px' : '3px',
      hasPhoto: !!photo,
      photoBg: photo ? 'url(' + photo + ')' : 'transparent',
      initials,
      photoBtn: photo ? 'Change photo' : 'Upload photo',
      onPhoto: (e) => {
        const f = e.target.files && e.target.files[0];
        if (f) this.setState({ photo: URL.createObjectURL(f) });
      },
      setTagline: (e) => this.set('tagline', e.target.value),
      tagCount: tagLen + ' / 100',
      tagCountColor: tagLen > 90 ? '#c07a00' : '#6b7f95',
      tagBorder: err(3, 'tagline') ? '#e0787c' : '#dbe6f0',
      tagErrDisplay: err(3, 'tagline') ? 'block' : 'none',
      setBio: (e) => this.set('bio', e.target.value),
      bioCount: bioLen < 120 ? 120 - bioLen + ' more characters needed' : bioLen + ' characters',
      bioCountColor: bioLen < 120 ? '#6b7f95' : '#1f8a52',
      bioBorder: err(3, 'bio') ? '#e0787c' : '#dbe6f0',
      bioErrDisplay: err(3, 'bio') ? 'block' : 'none',
      tips: [
        'Open with who you help and the change they can expect.',
        'Describe what a first session feels like in plain language.',
        'Mention practical details — online availability, wait times, languages.',
      ],
      feeFields,
      feeToggles,
      s4Groups,
      billing,
      plans,
      planCols: mid ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
      payFields,
      payCols: mid ? 'repeat(4,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))',
      chargeLabel: charge,
      toggleTerms: () => this.setState({ terms: !terms }),
      termsBg: terms ? '#0890E8' : '#fff',
      termsBorder: terms ? '#0890E8' : err(5, 'terms') ? '#e0787c' : '#cfdceb',
      payErrDisplay: t && step === 5 && (payBad || !terms) ? 'block' : 'none',
      payErrText: payBad ? 'Please complete your payment details.' : 'Please accept the terms to publish.',
      back: () => go(Math.max(1, step - 1)),
      backVis: step > 1 ? 'visible' : 'hidden',
      next,
      nextLabel:
        step === 5
          ? 'Pay ' + charge.replace('/mo', '').replace('/yr', '') + ' & publish'
          : 'Continue to ' + names[step].toLowerCase(),
      nextBg: step === 5 ? '#D82028' : '#0890E8',
      nextShadow: step === 5 ? '0 14px 28px -14px rgba(216,32,40,.7)' : 'none',
      lockDisplay: step === 5 ? 'flex' : 'none',
      firstName: d.name.trim().split(' ')[0] || 'there',
      planName: plan,
      nextSteps: [
        {
          n: '1',
          t: 'We verify your registration',
          b: 'We check your number with your regulator. If there is any issue, we refund you in full.',
        },
        {
          n: '2',
          t: 'Your profile goes live',
          b: 'Once approved, your profile appears on your province and city pages.',
        },
        { n: '3', t: 'Start receiving enquiries', b: 'Clients can message or call you directly from your profile.' },
      ],
      editAgain: () => this.setState({ done: false, step: 1 }),
      strengthPct: strength + '%',
      strengthColor: strength >= 80 ? '#2fb46b' : strength >= 40 ? '#0890E8' : '#F5A623',
      pvStatus: done ? 'Pending verification' : 'Draft',
      pvStatusDot: done ? '#F5B83D' : '#b7c7d8',
      pvFeatured: plan !== 'Professional',
      pvName: d.name.trim() || 'Your name',
      pvNameColor: d.name.trim() ? '#10233a' : muted,
      pvCred: dObj ? dObj[0] + ' — ' + dObj[1] + (d.reg ? ' · #' + d.reg : '') : 'Your designation',
      pvLoc:
        (d.city.trim() ? d.city.trim() + ', ' + d.prov : provName) + (d.accepting ? ' · Accepting new clients' : ''),
      pvTag: d.tagline.trim() || 'Your headline tells clients how you can help.',
      pvTagColor: d.tagline.trim() ? '#1f3550' : muted,
      pvGlance,
      pvChips,
      pvFee: d.fee ? '$' + d.fee : '—',
      pvFeeColor: d.fee ? '#10233a' : muted,
      pvConsult: d.consult,
      checklist,
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
            { label: 'Claim Your Listing', href: '/claim-listing' },
            { label: 'Claim a Therapist Profile', href: '/claim-therapist' },
            { label: 'Create a Therapist Profile', href: '/auth?mode=signup&type=therapist' },
            { label: 'Contact Us', href: '/contact' },
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
      iconUpload: this.icon(['M12 16V4', 'M7 9l5-5 5 5', 'M5 20h14'], { width: 16, height: 16, strokeWidth: 2 }),
      iconBulb: this.icon(
        ['M9 18h6', 'M10 21h4', 'M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z'],
        { width: 17, height: 17, strokeWidth: 2 },
      ),
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
    accKnob,
    accTrack,
    asidePos,
    authCta,
    back,
    backVis,
    billing,
    bioBorder,
    bioCount,
    bioCountColor,
    bioErrDisplay,
    bodyCols,
    bodyPad,
    chargeLabel,
    checklist,
    cityBorder,
    cityErrDisplay,
    d,
    desigCols,
    desigErrDisplay,
    designations,
    editAgain,
    feeFields,
    feeToggles,
    firstName,
    footGrid,
    footerCols,
    h1Size,
    iconArrow,
    iconBulb,
    iconCheckLg,
    iconCheckSm,
    iconCheckTiny,
    iconLock,
    iconMaple,
    iconPhoneTop,
    iconPinSm,
    iconShield,
    iconUpload,
    initials,
    introPad,
    isDone,
    isS1,
    isS2,
    isS3,
    isS4,
    isS5,
    lockDisplay,
    next,
    nextBg,
    nextLabel,
    nextShadow,
    nextSteps,
    onPhoto,
    panelPad,
    payCols,
    payErrDisplay,
    payErrText,
    payFields,
    photoBg,
    photoBtn,
    planCols,
    planName,
    plans,
    provOpts,
    pvChips,
    pvConsult,
    pvCred,
    pvFeatured,
    pvFee,
    pvFeeColor,
    pvGlance,
    pvLoc,
    pvName,
    pvNameColor,
    pvStatus,
    pvStatusDot,
    pvTag,
    pvTagColor,
    regBorder,
    regErrDisplay,
    regLabel,
    s1Fields,
    s2Groups,
    s4Groups,
    saveLabel,
    setBio,
    setCity,
    setProv,
    setReg,
    setTagline,
    setYears,
    showNav,
    steps,
    strengthColor,
    strengthPct,
    tagBorder,
    tagCount,
    tagCountColor,
    tagErrDisplay,
    termsBg,
    termsBorder,
    threeCols,
    tips,
    toggleAccepting,
    toggleTerms,
    topRef,
    twoCols,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="therapists" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        <section
          data-screen-label="Onboarding intro"
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '680px' }}>
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
                Join the therapist directory
              </span>
              <h1 style={$css(`font:600 ${h1Size ?? ''}/1.06 Jost,sans-serif;color:#10233a`)}>
                Build your profile in <span style={{ color: '#0890E8' }}>five short steps</span>
              </h1>
              <p style={{ fontSize: '17.5px', lineHeight: '1.6', color: '#516378' }}>
                Fill in each section and watch your profile come together on the right. Your progress saves as you go.
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
        <section data-screen-label="Onboarding builder" ref={topRef} style={{ background: '#f7fafd', flex: '1' }}>
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
                  gridTemplateColumns: 'repeat(5,minmax(0,1fr))',
                  gap: '8px',
                }}
                data-cols="repeat(5,minmax(0,1fr))"
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
                          `appearance:none;border:0;background:transparent;padding:0;cursor:${st?.cursor ?? ''};text-align:left;display:flex;align-items:center;gap:9px;min-width:0`,
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
                            `display:${st?.labelDisplay ?? ''};font:600 14px Figtree,sans-serif;color:${st?.labelColor ?? ''};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`,
                          )}
                        >
                          {$i(st?.label)}
                        </span>
                      </button>
                    </li>
                  </Fragment>
                ))}
              </ol>
              {isS1 ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'obFade .3s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span
                        style={{
                          font: '600 12px Figtree,sans-serif',
                          letterSpacing: '.12em',
                          textTransform: 'uppercase',
                          color: '#0890E8',
                        }}
                      >
                        Step 1 of 5
                      </span>
                      <h2 style={{ fontSize: '28px' }}>About you</h2>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>
                        Your name and credentials appear at the top of your profile. We check your registration before
                        your profile goes live.
                      </p>
                    </div>
                    <div style={$css(`display:grid;grid-template-columns:${twoCols ?? ''};gap:16px`)} data-rc-dyn="1">
                      {$list(s1Fields).map((f, $index) => (
                        <Fragment key={$index}>
                          <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', minWidth: '0' }}>
                            <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>
                              {$i(f?.label)}
                            </span>
                            <input
                              className="scpf"
                              type={f?.type}
                              value={$val(f?.value)}
                              onChange={f?.onChange}
                              placeholder={f?.placeholder}
                              style={$css(
                                `height:50px;padding:0 16px;border-radius:14px;border:1.5px solid ${f?.border ?? ''};background:#fff;font:500 15.5px Figtree,sans-serif;color:#10233a;outline:none;transition:border-color .15s ease,box-shadow .15s ease`,
                              )}
                            />
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>Your designation</span>
                      <div
                        style={$css(`display:grid;grid-template-columns:${desigCols ?? ''};gap:8px`)}
                        data-rc-dyn="1"
                      >
                        {$list(designations).map((dg, $index) => (
                          <Fragment key={$index}>
                            <button
                              className="scpg"
                              onClick={dg?.select}
                              aria-pressed={dg?.pressed}
                              style={$css(
                                `appearance:none;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:3px;padding:12px 14px;border-radius:16px;border:1.5px solid ${dg?.border ?? ''};background:${dg?.bg ?? ''};transition:border-color .15s ease,background .15s ease,transform .12s ease-out`,
                              )}
                            >
                              <span style={{ font: '600 15px Jost,sans-serif', color: '#10233a' }}>{$i(dg?.code)}</span>
                              <span style={{ fontSize: '12.5px', lineHeight: '1.35', color: '#516378' }}>
                                {$i(dg?.name)}
                              </span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      <span
                        style={$css(
                          `display:${desigErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`,
                        )}
                      >
                        Choose your designation.
                      </span>
                    </div>
                    <div style={$css(`display:grid;grid-template-columns:${twoCols ?? ''};gap:16px`)} data-rc-dyn="1">
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', minWidth: '0' }}>
                        <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>{$i(regLabel)}</span>
                        <input
                          className="scpf"
                          value={$val(d?.reg)}
                          onChange={setReg}
                          placeholder="Registration number"
                          style={$css(
                            `height:50px;padding:0 16px;border-radius:14px;border:1.5px solid ${regBorder ?? ''};background:#fff;font:500 15.5px Figtree,sans-serif;color:#10233a;outline:none`,
                          )}
                        />
                        <span
                          style={$css(
                            `display:${regErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`,
                          )}
                        >
                          Enter your registration number.
                        </span>
                      </label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', minWidth: '0' }}>
                        <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>
                          Years in practice
                        </span>
                        <select
                          value={$val(d?.years)}
                          onChange={setYears}
                          style={{
                            height: '50px',
                            padding: '0 14px',
                            borderRadius: '14px',
                            border: '1.5px solid #dbe6f0',
                            background: '#fff',
                            font: '500 15.5px Figtree,sans-serif',
                            color: '#10233a',
                            outline: 'none',
                          }}
                        >
                          <option value="">Select</option>
                          <option value="Under 2 years">Under 2 years</option>
                          <option value="2–5 years">2–5 years</option>
                          <option value="5–10 years">5–10 years</option>
                          <option value="10+ years">10+ years</option>
                          <option value="20+ years">20+ years</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </>
              ) : null}
              {isS2 ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'obFade .3s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span
                        style={{
                          font: '600 12px Figtree,sans-serif',
                          letterSpacing: '.12em',
                          textTransform: 'uppercase',
                          color: '#0890E8',
                        }}
                      >
                        Step 2 of 5
                      </span>
                      <h2 style={{ fontSize: '28px' }}>Your practice</h2>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>
                        Help clients find you in search and filters. Tap to select — you can change these any time.
                      </p>
                    </div>
                    <div style={$css(`display:grid;grid-template-columns:${twoCols ?? ''};gap:16px`)} data-rc-dyn="1">
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', minWidth: '0' }}>
                        <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>City</span>
                        <input
                          className="scpf"
                          value={$val(d?.city)}
                          onChange={setCity}
                          placeholder="e.g. Toronto"
                          style={$css(
                            `height:50px;padding:0 16px;border-radius:14px;border:1.5px solid ${cityBorder ?? ''};background:#fff;font:500 15.5px Figtree,sans-serif;color:#10233a;outline:none`,
                          )}
                        />
                        <span
                          style={$css(
                            `display:${cityErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`,
                          )}
                        >
                          Enter the city you practise in.
                        </span>
                      </label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', minWidth: '0' }}>
                        <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>Province</span>
                        <select
                          value={$val(d?.prov)}
                          onChange={setProv}
                          style={{
                            height: '50px',
                            padding: '0 14px',
                            borderRadius: '14px',
                            border: '1.5px solid #dbe6f0',
                            background: '#fff',
                            font: '500 15.5px Figtree,sans-serif',
                            color: '#10233a',
                            outline: 'none',
                          }}
                        >
                          {$list(provOpts).map((po, $index) => (
                            <Fragment key={$index}>
                              <option value={$val(po?.v)}>{$i(po?.l)}</option>
                            </Fragment>
                          ))}
                        </select>
                      </label>
                    </div>
                    {$list(s2Groups).map((g, $index) => (
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
                            <span style={$css(`font:500 12.5px Figtree,sans-serif;color:${g?.countColor ?? ''}`)}>
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
                                    `appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:7px;height:40px;padding:0 15px 0 ${c?.padL ?? ''};border-radius:999px;border:1.5px solid ${c?.border ?? ''};background:${c?.bg ?? ''};color:${c?.color ?? ''};font:500 14px Figtree,sans-serif;opacity:${c?.op ?? ''};transition:background .15s ease,border-color .15s ease,color .15s ease,transform .12s ease-out`,
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
                    <button
                      onClick={toggleAccepting}
                      style={{
                        appearance: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        padding: '16px 18px',
                        borderRadius: '18px',
                        border: '1.5px solid #e6eef6',
                        background: '#f9fbfd',
                        textAlign: 'left',
                      }}
                    >
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <span style={{ font: '600 15px Jost,sans-serif', color: '#10233a' }}>
                          Accepting new clients
                        </span>
                        <span style={{ fontSize: '13.5px', color: '#516378' }}>
                          Shown as a green status on your profile.
                        </span>
                      </span>
                      <span
                        style={$css(
                          `width:48px;height:28px;border-radius:999px;background:${accTrack ?? ''};position:relative;flex-shrink:0;transition:background .2s ease`,
                        )}
                      >
                        <span
                          style={$css(
                            `position:absolute;top:3px;left:${accKnob ?? ''};width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(16,35,58,.25);transition:left .2s cubic-bezier(.23,1,.32,1)`,
                          )}
                        />
                      </span>
                    </button>
                  </div>
                </>
              ) : null}
              {isS3 ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'obFade .3s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span
                        style={{
                          font: '600 12px Figtree,sans-serif',
                          letterSpacing: '.12em',
                          textTransform: 'uppercase',
                          color: '#0890E8',
                        }}
                      >
                        Step 3 of 5
                      </span>
                      <h2 style={{ fontSize: '28px' }}>Your profile</h2>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>
                        This is what clients read first. Write the way you'd speak in a first session.
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '18px',
                        flexWrap: 'wrap',
                        padding: '16px',
                        borderRadius: '20px',
                        border: '1.5px dashed #cfdceb',
                        background: '#f9fbfd',
                      }}
                    >
                      <span
                        style={{
                          width: '84px',
                          height: '84px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          background: '#eaf5fd',
                          color: '#0890E8',
                          display: 'grid',
                          placeItems: 'center',
                          font: '600 26px Jost,sans-serif',
                          flexShrink: '0',
                          position: 'relative',
                        }}
                      >
                        {$i(initials)}
                        <span
                          style={$css(
                            `position:absolute;inset:0;background:${photoBg ?? ''};background-size:cover;background-position:center`,
                          )}
                        />
                      </span>
                      <div
                        style={{ flex: '1', minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '4px' }}
                      >
                        <span style={{ font: '600 15.5px Jost,sans-serif', color: '#10233a' }}>Profile photo</span>
                        <span style={{ fontSize: '13.5px', lineHeight: '1.45', color: '#516378' }}>
                          A friendly, well-lit headshot. Profiles with a photo get noticeably more enquiries.
                        </span>
                      </div>
                      <label
                        className="scpc"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '44px',
                          padding: '0 18px',
                          borderRadius: '999px',
                          background: '#0890E8',
                          color: '#fff',
                          font: '600 14.5px Jost,sans-serif',
                          cursor: 'pointer',
                          transition: 'background .15s ease',
                        }}
                      >
                        {$i(iconUpload)}
                        {$i(photoBtn)}
                        <input type="file" accept="image/*" onChange={onPhoto} style={{ display: 'none' }} />
                      </label>
                    </div>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                        <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>Headline</span>
                        <span style={$css(`font:500 12.5px Figtree,sans-serif;color:${tagCountColor ?? ''}`)}>
                          {$i(tagCount)}
                        </span>
                      </span>
                      <input
                        className="scpf"
                        value={$val(d?.tagline)}
                        onChange={setTagline}
                        maxLength="100"
                        placeholder="e.g. Helping adults and families move from problem drinking to steady recovery"
                        style={$css(
                          `height:50px;padding:0 16px;border-radius:14px;border:1.5px solid ${tagBorder ?? ''};background:#fff;font:500 15.5px Figtree,sans-serif;color:#10233a;outline:none`,
                        )}
                      />
                      <span
                        style={$css(`display:${tagErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`)}
                      >
                        Add a short headline.
                      </span>
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                        <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>About you</span>
                        <span style={$css(`font:500 12.5px Figtree,sans-serif;color:${bioCountColor ?? ''}`)}>
                          {$i(bioCount)}
                        </span>
                      </span>
                      <textarea
                        className="scpf"
                        value={$val(d?.bio)}
                        onChange={setBio}
                        rows="7"
                        maxLength="1500"
                        placeholder="Who do you work with? What does a first session look like? What should someone know before reaching out?"
                        style={$css(
                          `padding:14px 16px;border-radius:14px;border:1.5px solid ${bioBorder ?? ''};background:#fff;font:500 15.5px/1.6 Figtree,sans-serif;color:#10233a;outline:none;resize:vertical`,
                        )}
                      />
                      <span
                        style={$css(`display:${bioErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`)}
                      >
                        Write at least 120 characters so clients get a feel for you.
                      </span>
                    </label>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        padding: '16px 18px',
                        borderRadius: '18px',
                        background: '#f3f9fe',
                        border: '1px solid #d6eafa',
                      }}
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          font: '600 14.5px Jost,sans-serif',
                          color: '#0a5d96',
                        }}
                      >
                        {$i(iconBulb)}
                        Writing tips
                      </span>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {$list(tips).map((tp, $index) => (
                          <Fragment key={$index}>
                            <li
                              style={{
                                display: 'flex',
                                gap: '8px',
                                fontSize: '14px',
                                lineHeight: '1.5',
                                color: '#1f3550',
                              }}
                            >
                              <span
                                style={{
                                  width: '5px',
                                  height: '5px',
                                  borderRadius: '50%',
                                  background: '#0890E8',
                                  marginTop: '8px',
                                  flexShrink: '0',
                                }}
                              />
                              {$i(tp)}
                            </li>
                          </Fragment>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : null}
              {isS4 ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'obFade .3s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span
                        style={{
                          font: '600 12px Figtree,sans-serif',
                          letterSpacing: '.12em',
                          textTransform: 'uppercase',
                          color: '#0890E8',
                        }}
                      >
                        Step 4 of 5
                      </span>
                      <h2 style={{ fontSize: '28px' }}>{'Fees & availability'}</h2>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>
                        Clear pricing builds trust. Leave anything you don't offer blank.
                      </p>
                    </div>
                    <div style={$css(`display:grid;grid-template-columns:${twoCols ?? ''};gap:16px`)} data-rc-dyn="1">
                      {$list(feeFields).map((f, $index) => (
                        <Fragment key={$index}>
                          <label style={{ display: 'flex', flexDirection: 'column', gap: '7px', minWidth: '0' }}>
                            <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>
                              {$i(f?.label)}
                            </span>
                            <span
                              style={$css(
                                `display:flex;align-items:center;height:50px;border-radius:14px;border:1.5px solid ${f?.border ?? ''};background:#fff;overflow:hidden`,
                              )}
                            >
                              <span
                                style={{
                                  padding: '0 4px 0 16px',
                                  font: '600 15.5px Jost,sans-serif',
                                  color: '#6b7f95',
                                }}
                              >
                                $
                              </span>
                              <input
                                value={$val(f?.value)}
                                onChange={f?.onChange}
                                inputMode="numeric"
                                placeholder={f?.placeholder}
                                style={{
                                  flex: '1',
                                  minWidth: '0',
                                  height: '100%',
                                  border: '0',
                                  outline: 'none',
                                  padding: '0 12px 0 2px',
                                  font: '500 15.5px Figtree,sans-serif',
                                  color: '#10233a',
                                  background: 'transparent',
                                }}
                              />
                              <span
                                style={{ padding: '0 16px', fontSize: '13px', color: '#6b7f95', whiteSpace: 'nowrap' }}
                              >
                                {$i(f?.unit)}
                              </span>
                            </span>
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
                    <div style={$css(`display:grid;grid-template-columns:${twoCols ?? ''};gap:10px`)} data-rc-dyn="1">
                      {$list(feeToggles).map((t, $index) => (
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
                    {$list(s4Groups).map((g, $index) => (
                      <Fragment key={$index}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>
                            {$i(g?.title)}
                          </span>
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
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </>
              ) : null}
              {isS5 ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '24px', animation: 'obFade .3s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span
                        style={{
                          font: '600 12px Figtree,sans-serif',
                          letterSpacing: '.12em',
                          textTransform: 'uppercase',
                          color: '#0890E8',
                        }}
                      >
                        Step 5 of 5
                      </span>
                      <h2 style={{ fontSize: '28px' }}>{'Choose a plan & publish'}</h2>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>
                        Your subscription starts today. We check your registration next — if we can't approve your
                        profile, we refund you in full.
                      </p>
                    </div>
                    <div
                      style={{
                        alignSelf: 'flex-start',
                        display: 'inline-flex',
                        padding: '4px',
                        borderRadius: '999px',
                        background: '#f1f5f9',
                        border: '1px solid #e6eef6',
                      }}
                    >
                      {$list(billing).map((b, $index) => (
                        <Fragment key={$index}>
                          <button
                            onClick={b?.select}
                            style={$css(
                              `appearance:none;border:0;cursor:pointer;height:38px;padding:0 16px;border-radius:999px;background:${b?.bg ?? ''};color:${b?.color ?? ''};box-shadow:${b?.shadow ?? ''};font:600 14px Figtree,sans-serif;display:inline-flex;align-items:center;gap:8px;transition:background .2s ease,color .2s ease`,
                            )}
                          >
                            {$i(b?.label)}
                            {b?.save ? (
                              <>
                                <span
                                  style={{
                                    font: '600 11px Figtree,sans-serif',
                                    padding: '3px 7px',
                                    borderRadius: '999px',
                                    background: '#e6f4ec',
                                    color: '#1f8a52',
                                  }}
                                >
                                  2 months free
                                </span>
                              </>
                            ) : null}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div style={$css(`display:grid;grid-template-columns:${planCols ?? ''};gap:12px`)} data-rc-dyn="1">
                      {$list(plans).map((p, $index) => (
                        <Fragment key={$index}>
                          <button
                            className="scp18 scpg"
                            onClick={p?.select}
                            aria-pressed={p?.pressed}
                            style={$css(
                              `appearance:none;cursor:pointer;text-align:left;position:relative;display:flex;flex-direction:column;gap:12px;padding:20px;border-radius:22px;border:1.5px solid ${p?.border ?? ''};background:${p?.bg ?? ''};box-shadow:${p?.shadow ?? ''};transition:border-color .2s ease,background .2s ease,box-shadow .2s ease,transform .15s ease-out`,
                            )}
                          >
                            {p?.popular ? (
                              <>
                                <span
                                  style={{
                                    position: 'absolute',
                                    top: '-11px',
                                    right: '16px',
                                    height: '22px',
                                    padding: '0 10px',
                                    borderRadius: '999px',
                                    background: '#D82028',
                                    color: '#fff',
                                    font: '600 11px Figtree,sans-serif',
                                    letterSpacing: '.06em',
                                    textTransform: 'uppercase',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                  }}
                                >
                                  Most popular
                                </span>
                              </>
                            ) : null}
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '8px',
                              }}
                            >
                              <span style={{ font: '600 17px Jost,sans-serif', color: '#10233a' }}>{$i(p?.name)}</span>
                              <span
                                style={$css(
                                  `width:20px;height:20px;border-radius:50%;border:1.5px solid ${p?.radioBorder ?? ''};display:grid;place-items:center`,
                                )}
                              >
                                <span
                                  style={$css(
                                    `width:10px;height:10px;border-radius:50%;background:${p?.radioFill ?? ''}`,
                                  )}
                                />
                              </span>
                            </span>
                            <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                              <span style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                                <span style={{ font: '600 30px/1 Jost,sans-serif', color: '#10233a' }}>
                                  {$i(p?.price)}
                                </span>
                                <span style={{ fontSize: '14px', color: '#6b7f95' }}>/mo</span>
                              </span>
                              <span style={{ fontSize: '12.5px', color: '#6b7f95' }}>{$i(p?.billedNote)}</span>
                            </span>
                            <ul
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '7px',
                                borderTop: '1px solid #edf2f7',
                                paddingTop: '12px',
                              }}
                            >
                              {$list(p?.features).map((ft, $index) => (
                                <Fragment key={$index}>
                                  <li
                                    style={{
                                      display: 'flex',
                                      alignItems: 'flex-start',
                                      gap: '8px',
                                      fontSize: '13.5px',
                                      lineHeight: '1.4',
                                      color: '#3b4d63',
                                    }}
                                  >
                                    <span style={{ display: 'flex', color: '#0890E8', marginTop: '1px' }}>
                                      {$i(iconCheckSm)}
                                    </span>
                                    {$i(ft)}
                                  </li>
                                </Fragment>
                              ))}
                            </ul>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        padding: '20px',
                        borderRadius: '22px',
                        background: '#f7fafd',
                        border: '1px solid #e6eef6',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ font: '600 16px Jost,sans-serif', color: '#10233a' }}>Payment details</span>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            font: '500 13px Figtree,sans-serif',
                            color: '#516378',
                          }}
                        >
                          <span style={{ display: 'flex', color: '#1f8a52' }}>{$i(iconLock)}</span>
                          Secure, encrypted checkout
                        </span>
                      </div>
                      <div style={$css(`display:grid;grid-template-columns:${payCols ?? ''};gap:12px`)} data-rc-dyn="1">
                        {$list(payFields).map((f, $index) => (
                          <Fragment key={$index}>
                            <label
                              style={$css(
                                `display:flex;flex-direction:column;gap:7px;min-width:0;grid-column:${f?.span ?? ''}`,
                              )}
                            >
                              <span style={{ font: '600 13px Figtree,sans-serif', color: '#1f3550' }}>
                                {$i(f?.label)}
                              </span>
                              <input
                                className="scpf"
                                value={$val(f?.value)}
                                onChange={f?.onChange}
                                placeholder={f?.placeholder}
                                inputMode={f?.mode}
                                style={$css(
                                  `height:50px;padding:0 16px;border-radius:14px;border:1.5px solid ${f?.border ?? ''};background:#fff;font:500 15.5px Figtree,sans-serif;color:#10233a;outline:none`,
                                )}
                              />
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
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '14px 16px',
                          borderRadius: '16px',
                          background: '#e9f6ef',
                          border: '1px solid #cfead9',
                        }}
                      >
                        <span
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '11px',
                            background: '#1f8a52',
                            color: '#fff',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: '0',
                          }}
                        >
                          {$i(iconShield)}
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ font: '600 14.5px Jost,sans-serif', color: '#10233a' }}>
                            Full refund if we can't verify you
                          </span>
                          <span style={{ fontSize: '13.5px', lineHeight: '1.45', color: '#3b5a48' }}>
                            If there's any issue approving your registration, we return your payment in full.
                          </span>
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={toggleTerms}
                      style={{
                        appearance: 'none',
                        border: '0',
                        background: 'transparent',
                        padding: '0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={$css(
                          `width:22px;height:22px;border-radius:7px;border:1.5px solid ${termsBorder ?? ''};background:${termsBg ?? ''};color:#fff;display:grid;place-items:center;flex-shrink:0;margin-top:1px;transition:background .15s ease,border-color .15s ease`,
                        )}
                      >
                        {$i(iconCheckSm)}
                      </span>
                      <span style={{ fontSize: '14.5px', lineHeight: '1.5', color: '#3b4d63' }}>
                        I agree to the{' '}
                        <$A href="https://addictionrehabcenters.ca/terms-of-use/" style={{ fontWeight: '600' }}>
                          Terms of Use
                        </$A>{' '}
                        and authorize a {$i(chargeLabel)} charge starting today, refunded in full if my profile isn't
                        approved.
                      </span>
                    </button>
                    <span
                      style={$css(
                        `display:${payErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d;margin-top:-14px`,
                      )}
                    >
                      {$i(payErrText)}
                    </span>
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
                    <h2 style={{ fontSize: '32px' }}>You're in, {$i(firstName)}</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#516378', maxWidth: '520px' }}>
                      Your {$i(planName)} subscription is active and your receipt is on its way to {$i(d?.email)}. We're
                      checking your registration now — if there's any issue, we'll refund you in full.
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
                        href="/provider-dashboard"
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
                        href="/therapist-profile"
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
                        View an example profile
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
                  Profile strength{' '}
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
                  style={{
                    position: 'relative',
                    height: '84px',
                    background:
                      'radial-gradient(260px 120px at 90% 0%,rgba(255,255,255,.25),rgba(255,255,255,0) 70%),linear-gradient(135deg,#0a6fc0,#0890E8)',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '26px',
                      padding: '0 10px 0 8px',
                      borderRadius: '999px',
                      background: 'rgba(255,255,255,.18)',
                      border: '1px solid rgba(255,255,255,.28)',
                      color: '#fff',
                      font: '600 12px Figtree,sans-serif',
                    }}
                  >
                    <span style={$css(`width:7px;height:7px;border-radius:50%;background:${pvStatusDot ?? ''}`)} />
                    {$i(pvStatus)}
                  </span>
                  {pvFeatured ? (
                    <>
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          left: '12px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          height: '26px',
                          padding: '0 10px 0 7px',
                          borderRadius: '999px',
                          background: 'rgba(16,35,58,.55)',
                          border: '1px solid rgba(255,255,255,.18)',
                          color: '#fff',
                          font: '600 12px Figtree,sans-serif',
                        }}
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24">
                          <path
                            d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9z"
                            style={{ fill: '#F5B83D' }}
                          />
                        </svg>
                        Featured
                      </span>
                    </>
                  ) : null}
                </div>
                <div
                  style={{
                    padding: '0 20px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    marginTop: '-40px',
                  }}
                >
                  <span
                    style={{
                      position: 'relative',
                      width: '84px',
                      height: '84px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: '#eaf5fd',
                      color: '#0890E8',
                      border: '4px solid #fff',
                      display: 'grid',
                      placeItems: 'center',
                      font: '600 26px Jost,sans-serif',
                      boxShadow: '0 10px 20px -12px rgba(16,35,58,.5)',
                    }}
                  >
                    {$i(initials)}
                    <span
                      style={$css(
                        `position:absolute;inset:0;background:${photoBg ?? ''};background-size:cover;background-position:center`,
                      )}
                    />
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={$css(`font:600 21px/1.2 Jost,sans-serif;color:${pvNameColor ?? ''}`)}>
                      {$i(pvName)}
                    </span>
                    <span style={{ font: '500 13.5px Figtree,sans-serif', color: '#0a5d96' }}>{$i(pvCred)}</span>
                    <span
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6b7f95' }}
                    >
                      <span style={{ display: 'flex', color: '#0890E8' }}>{$i(iconPinSm)}</span>
                      {$i(pvLoc)}
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
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '10px',
                      padding: '12px 14px',
                      borderRadius: '16px',
                      background: '#f7fafd',
                    }}
                  >
                    <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                      <span
                        style={{
                          font: '600 10.5px Figtree,sans-serif',
                          letterSpacing: '.1em',
                          textTransform: 'uppercase',
                          color: '#6b7f95',
                        }}
                      >
                        Individual session
                      </span>
                      <span style={$css(`font:600 18px Jost,sans-serif;color:${pvFeeColor ?? ''}`)}>{$i(pvFee)}</span>
                    </span>
                    {pvConsult ? (
                      <>
                        <span
                          style={{
                            font: '600 12px Figtree,sans-serif',
                            padding: '5px 10px',
                            borderRadius: '999px',
                            background: '#e6f4ec',
                            color: '#1f8a52',
                          }}
                        >
                          Free consultation
                        </span>
                      </>
                    ) : null}
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
                      Message
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
                      Call
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
                <span style={{ font: '600 13.5px Jost,sans-serif', color: '#10233a' }}>To finish your profile</span>
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
  '\nhtml,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\ninput,select,button,textarea{font-family:inherit}\ninput::placeholder,textarea::placeholder{color:#8a9bb0}\n@keyframes topCallRing{0%{transform:scale(1);opacity:.7}70%,100%{transform:scale(1.7);opacity:0}}\n@keyframes obFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@keyframes obPop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}\n';
export const css = [ownCss, SiteHeader_css].filter(Boolean).join('\n');
export const defaults = {};
const View = createDC('TherapistOnboarding', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} {...props} />;
}
