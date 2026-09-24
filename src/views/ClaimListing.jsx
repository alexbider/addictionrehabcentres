'use client';
// Generated from ClaimListing.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = {
    pay: { card: '', exp: '', cvc: '', postal: '' },
    tried4b: false,
    vw: 1280,
    query: '',
    focus: false,
    step: 1,
    sel: null,
    plan: 'Growth',
    method: 'email',
    auth: false,
    terms: false,
    tried2: false,
    tried4: false,
    form: { name: '', role: '', email: '', phone: '' },
  };
  flowRef = React.createRef();
  componentDidMount() {
    this.setState({ vw: window.innerWidth });
    this._r = () => this.setState({ vw: window.innerWidth });
    window.addEventListener('resize', this._r);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._r);
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
      ...paths.map((d, i) => (typeof d === 'string' ? R('path', { key: i, d }) : R(d.t, { key: i, ...d.a }))),
    );
  }
  toFlow() {
    const el = this.flowRef.current;
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  }
  go(step) {
    this.setState({ step });
    this.toFlow();
  }

  renderVals() {
    const B = 'https://addictionrehabcenters.ca/';
    const { vw, query, focus, step, sel, plan, method, auth, terms, tried2, tried4, form } = this.state;
    const wide = vw >= 1000,
      mid = vw >= 700;
    const listings = [
      ['Metamorphosis Centre for Change', 'Wasaga Beach, ON', false],
      ['Bellwood Health Services', '175 Brentcliffe Rd, Toronto, ON', true],
      ['Addiction Centre Toronto', '193 Colborne St, Brantford, ON', false],
      ['Renascent Treatment Centre', '90 Colston Ave, Whitby, ON', false],
      ['UMATTERCARE – Mental Health and Addiction Services', '97 Bonnyview Dr, Etobicoke, ON', false],
      ['Addiction Rehab Toronto', '4 Warrendale Ct, Etobicoke, ON', false],
      ['Field Trip Health Toronto', '30 Duncan St Suite 400, Toronto, ON', true],
    ].map(([name, address, claimed], i) => ({
      i,
      name,
      address,
      claimed,
      initials: name
        .replace(/[^A-Za-z ]/g, '')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase(),
    }));
    const q = query.trim().toLowerCase();
    const match = listings.filter((l) => !q || (l.name + ' ' + l.address).toLowerCase().includes(q));
    const pick = (l) => () => {
      if (l.claimed) return;
      this.setState({ sel: l.i, focus: false, step: 2, tried2: false });
      this.toFlow();
    };
    const row = (l) => {
      const on = sel === l.i;
      return {
        ...l,
        pick: pick(l),
        claimable: !l.claimed,
        status: l.claimed ? 'Claimed' : 'Unclaimed',
        statusBg: l.claimed ? '#eef2f6' : '#eaf5fd',
        statusColor: l.claimed ? '#6b7f95' : '#0a5d96',
        tileBg: l.claimed ? '#eef2f6' : '#eaf5fd',
        tileColor: l.claimed ? '#8a9bb0' : '#0890E8',
        rowBg: on ? '#f3f9fe' : '#fff',
        rowBorder: on ? '#0890E8' : '#e6eef6',
        btnBg: on ? '#10233a' : '#0890E8',
        btnColor: '#fff',
        btnLabel: on ? 'Selected' : 'Claim this listing',
      };
    };
    const results = match.slice(0, 5).map(row);
    const s = sel != null ? listings[sel] : null;

    const planDefs = [
      ['Verified', '$199', ['Verified badge', 'Enhanced profile', 'Photos & video', 'Calls & lead tracking']],
      [
        'Local',
        '$399',
        ['Everything in Verified', '1 City sponsorship', '1 Substance sponsorship', '1 Treatment sponsorship'],
      ],
      ['Growth', '$699', ['1 Province, 2 Cities', '2 Substances', '2 Treatment/Condition pages', 'Advanced analytics']],
      [
        'Premium',
        '$1,299',
        ['Up to 4 cities', '4 substances', '5 content placements', 'Priority sponsorship visibility'],
      ],
    ];
    const plans = planDefs.map(([name, price, features]) => {
      const on = plan === name;
      return {
        name,
        price,
        features,
        popular: name === 'Growth',
        pressed: on ? 'true' : 'false',
        select: () => this.setState({ plan: name }),
        border: on ? '#0890E8' : '#e6eef6',
        bg: on ? '#f3f9fe' : '#fff',
        shadow: on ? '0 18px 36px -24px rgba(8,144,232,.55)' : 'none',
        radioBorder: on ? '#0890E8' : '#cfdceb',
        radioFill: on ? '#0890E8' : 'transparent',
      };
    });
    const planObj = planDefs.find((p) => p[0] === plan);

    const setF = (k) => (e) => {
      const v = e.target.value;
      this.setState((st) => ({ form: { ...st.form, [k]: v } }));
    };
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    const errs = {
      name: !form.name.trim() ? 'Enter your full name.' : '',
      role: !form.role.trim() ? 'Enter your role at the centre.' : '',
      email: !emailOk ? 'Enter a valid work email.' : '',
      phone: '',
    };
    const fields = [
      ['name', 'Full name', 'text', 'Jane Doe'],
      ['role', 'Role / title', 'text', 'Clinical Director'],
      ['email', 'Work email', 'email', 'you@yourcentre.ca'],
      ['phone', 'Phone (optional)', 'tel', '(555) 555-5555'],
    ].map(([k, label, type, placeholder]) => {
      const bad = tried2 && errs[k];
      return {
        label,
        type,
        placeholder,
        value: form[k],
        onChange: setF(k),
        err: errs[k],
        errDisplay: bad ? 'block' : 'none',
        border: bad ? '#e0787c' : '#dbe6f0',
      };
    });
    const ic = {
      mail: this.icon([{ t: 'rect', a: { x: 3, y: 5, width: 18, height: 14, rx: 2 } }, 'M3 7l9 6 9-6']),
      phone: this.icon(['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z']),
      doc: this.icon(['M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z', 'M14 3v5h5', 'M9 13h6', 'M9 17h4']),
      edit: this.icon(['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4'], { width: 16, height: 16 }),
      badge: this.icon(['M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z', 'M9 12l2 2 4-4'], { width: 16, height: 16 }),
      chart: this.icon(['M4 20V10', 'M10 20V4', 'M16 20v-7', 'M22 20H2'], { width: 16, height: 16 }),
      camera: this.icon(
        [
          { t: 'rect', a: { x: 3, y: 7, width: 18, height: 13, rx: 2 } },
          'M8 7l2-3h4l2 3',
          { t: 'circle', a: { cx: 12, cy: 13.5, r: 3.5 } },
        ],
        { width: 16, height: 16 },
      ),
    };
    const methods = [
      ['email', 'Work email', "We send a code to an address at your centre's domain.", ic.mail],
      ['phone', 'Phone call', 'We call the number listed for the centre.', ic.phone],
      ['doc', 'Document', 'Upload a business licence or letter on letterhead.', ic.doc],
    ].map(([k, title, body, icon]) => {
      const on = method === k;
      return {
        title,
        body,
        icon,
        pressed: on ? 'true' : 'false',
        select: () => this.setState({ method: k }),
        border: on ? '#0890E8' : '#e6eef6',
        bg: on ? '#f3f9fe' : '#fff',
        radioBorder: on ? '#0890E8' : '#cfdceb',
        radioFill: on ? '#0890E8' : 'transparent',
      };
    });
    const methodLabel = { email: 'Work email code', phone: 'Phone call to listed number', doc: 'Document upload' }[
      method
    ];

    const pay = this.state.pay;
    const setP = (k, fmt) => (e) => {
      const v = fmt(e.target.value);
      this.setState((st) => ({ pay: { ...st.pay, [k]: v } }));
    };
    const digits = (v) => v.replace(/\D/g, '');
    const payErr = {
      card: digits(pay.card).length < 15 ? 'Enter a valid card number.' : '',
      exp: !/^(0[1-9]|1[0-2])\/\d{2}$/.test(pay.exp) ? 'Use MM/YY.' : '',
      cvc: digits(pay.cvc).length < 3 ? 'Enter the CVC.' : '',
      postal: pay.postal.trim().length < 3 ? 'Enter your postal code.' : '',
    };
    const payFields = [
      [
        'card',
        'Card number',
        '1234 1234 1234 1234',
        'numeric',
        '1 / -1',
        (v) =>
          digits(v)
            .slice(0, 16)
            .replace(/(\d{4})(?=\d)/g, '$1 '),
      ],
      [
        'exp',
        'Expiry',
        'MM/YY',
        'numeric',
        'span 1',
        (v) => {
          const d = digits(v).slice(0, 4);
          return d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
        },
      ],
      ['cvc', 'CVC', '123', 'numeric', 'span 1', (v) => digits(v).slice(0, 4)],
      ['postal', 'Postal code', 'M5V 2C3', 'text', 'span 2', (v) => v.toUpperCase().slice(0, 7)],
    ].map(([k, label, placeholder, mode, span, fmt]) => {
      const bad = this.state.tried4 && payErr[k];
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
    const done = step === 5;
    const stepNames = ['Find listing', 'Your details', 'Plan', 'Pay'];
    const steps = stepNames.map((label, i) => {
      const n = i + 1,
        cur = n === step,
        past = n < step || done,
        reach = n <= step && !done && (n === 1 || s);
      return {
        label,
        mark: past ? '✓' : String(n),
        go: () => {
          if (reach && n < step) this.go(n);
        },
        disabled: !(reach && n < step),
        cursor: reach && n < step ? 'pointer' : 'default',
        bar: past || cur ? '#0890E8' : '#e6eef6',
        dotBg: past ? '#0890E8' : cur ? '#fff' : '#f5f8fb',
        dotColor: past ? '#fff' : cur ? '#0890E8' : '#9aabbd',
        dotBorder: past || cur ? '#0890E8' : '#e3ecf4',
        labelColor: cur ? '#10233a' : past ? '#1f3550' : '#9aabbd',
        labelDisplay: mid ? 'block' : cur ? 'block' : 'none',
      };
    });

    const next2 = () => {
      if (errs.name || errs.role || errs.email || !auth) {
        this.setState({ tried2: true });
        return;
      }
      this.go(3);
    };
    const review = [
      ['Listing', s ? s.name + ' · ' + s.address : '', 1],
      ['Name', form.name + (form.role ? ' · ' + form.role : ''), 2],
      ['Email', form.email, 2],
      ['Phone', form.phone || 'Not provided', 2],
      ['Verification', methodLabel, 2],
      ['Subscription', plan + ' · ' + (planObj ? planObj[1] : '') + '/mo', 3],
    ].map(([k, v, st], i) => ({ k, v, edit: () => this.go(st), line: i ? '#edf2f7' : 'transparent' }));
    const unlockDefs = [
      ['Verified badge', ic.badge],
      ['Edit details', ic.edit],
      ['Photos & video', ic.camera],
      ['Lead tracking', ic.chart],
    ];
    const unlocks = unlockDefs.map(([label, icon]) => ({
      label,
      icon,
      bg: done ? '#eaf5fd' : '#f5f8fb',
      color: done ? '#0a5d96' : '#6b7f95',
      iconColor: done ? '#0890E8' : '#9aabbd',
    }));

    const L = (arr) =>
      arr.map((x) => {
        const [label, p] = x.split('|');
        return { label, href: B + p + '/' };
      });
    const footerCols = [
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
          { label: 'Promote Your Centre', href: '/promote' },
          { label: 'Join the Therapist Directory', href: '/join-directory' },
          { label: 'Contact Us', href: '/contact' },
        ],
      },
    ];

    return {
      heroCols: wide ? 'minmax(0,1.05fr) minmax(0,.95fr)' : 'minmax(0,1fr)',
      heroPad: mid ? '72px 32px 88px' : '44px 20px 56px',
      h1Size: vw >= 1100 ? '60px' : mid ? '48px' : '38px',
      showPreview: wide,
      query,
      onQuery: (e) => this.setState({ query: e.target.value, focus: true }),
      onSearchFocus: () => this.setState({ focus: true }),
      onSearchBlur: () => setTimeout(() => this.setState({ focus: false }), 120),
      onSearchGo: () => {
        this.setState({ focus: false, step: sel != null ? step : 1 });
        this.toFlow();
      },
      searchBorder: focus ? '#0890E8' : '#e3ecf4',
      searchShadow: focus
        ? '0 0 0 5px rgba(8,144,232,.12),0 24px 40px -28px rgba(16,35,58,.35)'
        : '0 24px 40px -30px rgba(16,35,58,.35)',
      showDrop: focus && q.length > 0,
      results,
      noResults: q.length > 0 && match.length === 0,
      resultsLabel: match.length + (match.length === 1 ? ' listing' : ' listings') + ' found',
      perks: ['Get the Verified badge', 'Edit your centre details', 'Full refund if not verified'],
      pvName: s ? s.name : 'Your centre name',
      pvAddress: s ? s.address : 'City, Province',
      pvBadge: done ? 'Verified' : 'Unclaimed listing',
      pvBadgeBg: done ? 'rgba(255,255,255,.96)' : 'rgba(255,255,255,.85)',
      pvBadgeColor: done ? '#10233a' : '#516378',
      pvSealDisplay: done ? 'flex' : 'none',
      pvDotDisplay: done ? 'none' : 'block',
      pvFilter: done ? 'none' : 'saturate(.55)',
      unlocks,
      flowRef: this.flowRef,
      flowCols: wide ? 'minmax(0,1fr) 320px' : 'minmax(0,1fr)',
      flowPad: mid ? '56px 32px 88px' : '32px 16px 56px',
      panelPad: mid ? '32px' : '22px 18px',
      asidePos: wide ? 'sticky' : 'static',
      steps,
      isStep1: step === 1,
      isStep2: step === 2 && !!s,
      isStep3: step === 3,
      isStep4: step === 4,
      isDone: done,
      allResults: match.map(row),
      noAll: match.length === 0,
      selName: s ? s.name : '',
      fields,
      formCols: mid ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      methods,
      methodCols: mid ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
      toggleAuth: () => this.setState({ auth: !auth }),
      authBg: auth ? '#0890E8' : '#fff',
      authBorder: auth ? '#0890E8' : tried2 && !auth ? '#e0787c' : '#cfdceb',
      authErrDisplay: tried2 && !auth ? 'block' : 'none',
      back: () => this.go(Math.max(1, step - 1)),
      next2,
      next3: () => this.go(4),
      plans,
      planCols: vw >= 1180 ? 'repeat(4,minmax(0,1fr))' : mid ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      review,
      reviewCols: mid ? '150px minmax(0,1fr)' : 'minmax(0,1fr)',
      toggleTerms: () => this.setState({ terms: !terms }),
      termsBg: terms ? '#0890E8' : '#fff',
      termsBorder: terms ? '#0890E8' : tried4 && !terms ? '#e0787c' : '#cfdceb',
      termsErrDisplay:
        tried4 && (!terms || payErr.card || payErr.exp || payErr.cvc || payErr.postal) ? 'block' : 'none',
      submit: () => {
        const payBad = payErr.card || payErr.exp || payErr.cvc || payErr.postal;
        if (!terms || payBad) {
          this.setState({ tried4: true });
          return;
        }
        this.go(5);
      },
      payFields,
      payCols: mid ? 'repeat(4,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))',
      termsErr: !terms ? 'Please accept the terms to pay.' : 'Please complete your payment details.',
      iconLock: this.icon(
        [{ t: 'rect', a: { x: 5, y: 11, width: 14, height: 10, rx: 2 } }, 'M8 11V8a4 4 0 0 1 8 0v3'],
        { width: 15, height: 15, strokeWidth: 2 },
      ),
      firstName: form.name.trim().split(' ')[0] || 'there',
      planName: plan,
      form,
      nextSteps: [
        {
          n: '1',
          t: 'We verify ownership',
          b: 'Our team checks your details using the verification method you chose.',
        },
        {
          n: '2',
          t: 'Approved or refunded',
          b: 'Once approved, we email you access. If there is any issue, we refund your payment in full.',
        },
        {
          n: '3',
          t: 'Your listing goes Verified',
          b: 'Update your profile, add photos and start tracking calls and leads.',
        },
      ],
      nextCols: mid ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
      restart: () => {
        this.setState({
          pay: { card: '', exp: '', cvc: '', postal: '' },
          step: 1,
          sel: null,
          query: '',
          auth: false,
          terms: false,
          tried2: false,
          tried4: false,
          form: { name: '', role: '', email: '', phone: '' },
        });
        this.toFlow();
      },
      asName: s ? s.name : 'No listing selected',
      asAddress: s ? s.address : 'Search above to begin',
      asInitials: s ? s.initials : '?',
      asTileBg: s ? '#eaf5fd' : '#f5f8fb',
      asTileColor: s ? '#0890E8' : '#9aabbd',
      asPlan: plan,
      asPrice: planObj ? planObj[1] : '',
      footerCols,
      footGrid: wide ? 'minmax(0,1.25fr) repeat(3,minmax(0,1fr))' : mid ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      iconSearch: this.icon([{ t: 'circle', a: { cx: 11, cy: 11, r: 7 } }, 'M20 20l-3.5-3.5']),
      iconCheckSm: this.icon(['M5 12.5l4.5 4.5L19 7.5'], { width: 13, height: 13, strokeWidth: 3 }),
      iconCheckLg: this.icon(['M5 12.5l4.5 4.5L19 7.5'], { width: 36, height: 36, strokeWidth: 2.6 }),
      iconArrow: this.icon(['M5 12h14', 'M13 6l6 6-6 6'], { width: 16, height: 16, strokeWidth: 2 }),
      iconPinSm: this.icon(
        ['M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z', { t: 'circle', a: { cx: 12, cy: 10, r: 2.5 } }],
        { width: 14, height: 14, strokeWidth: 2 },
      ),
      iconShield: this.icon(['M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z', 'M9 12l2 2 4-4'], {
        width: 18,
        height: 18,
        strokeWidth: 2,
      }),
      iconShieldSm: this.icon(['M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z', 'M9 12l2 2 4-4'], {
        width: 15,
        height: 15,
        strokeWidth: 2,
      }),
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
    allResults,
    asAddress,
    asInitials,
    asName,
    asPlan,
    asPrice,
    asTileBg,
    asTileColor,
    asidePos,
    authBg,
    authBorder,
    authErrDisplay,
    back,
    fields,
    firstName,
    flowCols,
    flowPad,
    flowRef,
    footGrid,
    footerCols,
    form,
    formCols,
    h1Size,
    heroCols,
    heroPad,
    iconArrow,
    iconCheckLg,
    iconCheckSm,
    iconLock,
    iconMaple,
    iconPhoneTop,
    iconPinSm,
    iconSearch,
    iconShield,
    iconShieldSm,
    isDone,
    isStep1,
    isStep2,
    isStep3,
    isStep4,
    methodCols,
    methods,
    next2,
    next3,
    nextCols,
    nextSteps,
    noAll,
    noResults,
    onQuery,
    onSearchBlur,
    onSearchFocus,
    onSearchGo,
    panelPad,
    payCols,
    payFields,
    perks,
    planCols,
    planName,
    plans,
    pvAddress,
    pvBadge,
    pvBadgeBg,
    pvBadgeColor,
    pvDotDisplay,
    pvFilter,
    pvName,
    pvSealDisplay,
    query,
    restart,
    results,
    resultsLabel,
    review,
    reviewCols,
    searchBorder,
    searchShadow,
    selName,
    showDrop,
    showPreview,
    steps,
    submit,
    termsBg,
    termsBorder,
    termsErr,
    termsErrDisplay,
    toggleAuth,
    toggleTerms,
    unlocks,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        <section
          data-screen-label="Claim hero"
          style={{
            position: 'relative',
            background:
              'radial-gradient(900px 520px at 85% -10%,#d6ecfb 0%,rgba(214,236,251,0) 60%),radial-gradient(600px 400px at 0% 100%,rgba(216,32,40,.05),rgba(216,32,40,0) 70%),#f7fafd',
            borderBottom: '1px solid #e9eff5',
            zIndex: '5',
          }}
        >
          <div
            style={$css(
              `max-width:1280px;margin:0 auto;padding:${heroPad ?? ''};display:grid;grid-template-columns:${heroCols ?? ''};gap:56px;align-items:center`,
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
                    background: '#0890E8',
                    boxShadow: '0 0 0 4px rgba(8,144,232,.18)',
                  }}
                />
                For treatment centres
              </span>
              <h1 style={$css(`font:600 ${h1Size ?? ''}/1.04 Jost,sans-serif;color:#10233a`)}>
                Claim your centre's <span style={{ color: '#0890E8' }}>listing</span>
              </h1>
              <p style={{ fontSize: '19px', lineHeight: '1.6', color: '#516378', maxWidth: '540px' }}>
                Find your centre, confirm you represent it, and choose a subscription to take control of your profile on
                Addiction Rehab Centres Canada.
              </p>
              <div style={{ position: 'relative', maxWidth: '600px' }}>
                <div
                  style={$css(
                    `display:flex;align-items:center;gap:10px;height:64px;padding:0 8px 0 20px;background:#fff;border:1.5px solid ${searchBorder ?? ''};border-radius:20px;box-shadow:${searchShadow ?? ''};transition:border-color .15s ease,box-shadow .2s ease`,
                  )}
                >
                  <span style={{ display: 'flex', color: '#6b7f95', flexShrink: '0' }}>{$i(iconSearch)}</span>
                  <input
                    value={$val(query)}
                    onChange={onQuery}
                    onFocus={onSearchFocus}
                    onBlur={onSearchBlur}
                    placeholder="Search by centre name or city"
                    aria-label="Search for your listing"
                    style={{
                      flex: '1',
                      minWidth: '0',
                      height: '100%',
                      border: '0',
                      outline: 'none',
                      background: 'transparent',
                      font: '500 17px Figtree,sans-serif',
                      color: '#10233a',
                    }}
                  />
                  <button
                    className="scpc scpy"
                    onClick={onSearchGo}
                    style={{
                      appearance: 'none',
                      border: '0',
                      cursor: 'pointer',
                      height: '48px',
                      padding: '0 20px',
                      borderRadius: '14px',
                      background: '#0890E8',
                      color: '#fff',
                      font: '600 15px Jost,sans-serif',
                      flexShrink: '0',
                      transition: 'background .15s ease,transform .12s ease-out',
                    }}
                  >
                    Search
                  </button>
                </div>
                {showDrop ? (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        left: '0',
                        right: '0',
                        top: 'calc(100% + 8px)',
                        background: '#fff',
                        border: '1px solid #e6eef6',
                        borderRadius: '20px',
                        padding: '8px',
                        boxShadow: '0 30px 60px -30px rgba(16,35,58,.4)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        animation: 'clFade .18s ease-out',
                        zIndex: '10',
                      }}
                    >
                      <div
                        style={{
                          padding: '6px 12px 8px',
                          font: '600 11px Figtree,sans-serif',
                          letterSpacing: '.12em',
                          textTransform: 'uppercase',
                          color: '#6b7f95',
                        }}
                      >
                        {$i(resultsLabel)}
                      </div>
                      {$list(results).map((r, $index) => (
                        <Fragment key={$index}>
                          <button
                            className="scp17"
                            onMouseDown={r?.pick}
                            style={{
                              appearance: 'none',
                              border: '0',
                              cursor: 'pointer',
                              textAlign: 'left',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '10px 12px',
                              borderRadius: '14px',
                              background: 'transparent',
                              transition: 'background .15s ease',
                            }}
                          >
                            <span
                              style={$css(
                                `width:40px;height:40px;border-radius:12px;background:${r?.tileBg ?? ''};color:${r?.tileColor ?? ''};display:grid;place-items:center;font:600 13px Jost,sans-serif;flex-shrink:0`,
                              )}
                            >
                              {$i(r?.initials)}
                            </span>
                            <span
                              style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}
                            >
                              <span
                                style={{
                                  font: '600 15px Jost,sans-serif',
                                  color: '#10233a',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {$i(r?.name)}
                              </span>
                              <span
                                style={{
                                  font: '500 13px Figtree,sans-serif',
                                  color: '#6b7f95',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {$i(r?.address)}
                              </span>
                            </span>
                            <span
                              style={$css(
                                `flex-shrink:0;font:600 12px Figtree,sans-serif;padding:5px 10px;border-radius:999px;background:${r?.statusBg ?? ''};color:${r?.statusColor ?? ''}`,
                              )}
                            >
                              {$i(r?.status)}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                      {noResults ? (
                        <>
                          <div
                            style={{ padding: '14px 12px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}
                          >
                            <span style={{ font: '600 15px Jost,sans-serif', color: '#10233a' }}>
                              No listing matches “{$i(query)}”
                            </span>
                            <span style={{ fontSize: '14px', color: '#516378' }}>
                              Try the centre's city, or{' '}
                              <$A href={'/auth?mode=signup&type=centre'} style={{ fontWeight: '600' }}>
                                add your centre to the directory
                              </$A>
                              .
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 22px' }}>
                {$list(perks).map((pk, $index) => (
                  <Fragment key={$index}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        font: '500 14.5px Figtree,sans-serif',
                        color: '#1f3550',
                      }}
                    >
                      <span
                        style={{
                          width: '22px',
                          height: '22px',
                          borderRadius: '50%',
                          background: '#e6f4ec',
                          color: '#1f8a52',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {$i(iconCheckSm)}
                      </span>
                      {$i(pk)}
                    </span>
                  </Fragment>
                ))}
              </div>
            </div>
            {showPreview ? (
              <>
                <div style={{ position: 'relative', minWidth: '0', padding: '12px 0' }}>
                  <div
                    style={{
                      position: 'absolute',
                      right: '-30px',
                      top: '-10px',
                      width: '300px',
                      height: '300px',
                      borderRadius: '50%',
                      border: '56px solid rgba(8,144,232,.07)',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      background: '#fff',
                      border: '1px solid #e6eef6',
                      borderRadius: '28px',
                      padding: '10px',
                      boxShadow: '0 40px 80px -44px rgba(16,35,58,.45)',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        aspectRatio: '16/9',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        background: '#eaf2f8',
                      }}
                    >
                      <img
                        src="/assets/img/home-hero.jpg"
                        alt=""
                        style={$css(
                          `position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block;filter:${pvFilter ?? ''};transition:filter .5s ease`,
                        )}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          inset: '0',
                          background: 'linear-gradient(180deg,rgba(16,35,58,.25),rgba(16,35,58,0) 45%)',
                        }}
                      />
                      <span
                        style={$css(
                          `position:absolute;top:14px;left:14px;display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 11px 0 8px;border-radius:999px;background:${pvBadgeBg ?? ''};color:${pvBadgeColor ?? ''};font:600 12.5px Figtree,sans-serif;box-shadow:0 6px 16px -8px rgba(0,0,0,.45);transition:background .3s ease,color .3s ease`,
                        )}
                      >
                        <span style={$css(`display:${pvSealDisplay ?? ''}`)}>
                          <svg width="16" height="16" viewBox="0 0 24 24">
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
                        </span>
                        <span
                          style={$css(
                            `display:${pvDotDisplay ?? ''};width:7px;height:7px;border-radius:50%;background:#9aabbd`,
                          )}
                        />
                        {$i(pvBadge)}
                      </span>
                      <div
                        style={{
                          position: 'absolute',
                          left: '14px',
                          right: '14px',
                          bottom: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 14px 10px 10px',
                          background: 'rgba(16,35,58,.82)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          border: '1px solid rgba(255,255,255,.14)',
                          color: '#fff',
                          borderRadius: '16px',
                          boxShadow: '0 14px 30px -16px rgba(0,0,0,.6)',
                        }}
                      >
                        <span
                          style={{
                            width: '32px',
                            height: '32px',
                            borderRadius: '10px',
                            background: '#0890E8',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: '0',
                          }}
                        >
                          {$i(iconShield)}
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '1px', minWidth: '0' }}>
                          <span style={{ font: '600 14px Jost,sans-serif' }}>Verified by our team after payment</span>
                          <span style={{ font: '500 12px Figtree,sans-serif', color: '#b7c7d8' }}>
                            Full refund if we can't approve your claim
                          </span>
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '18px 14px 12px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ font: '600 20px Jost,sans-serif', color: '#10233a' }}>{$i(pvName)}</span>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '14px',
                            color: '#6b7f95',
                          }}
                        >
                          <span style={{ display: 'flex', color: '#0890E8' }}>{$i(iconPinSm)}</span>
                          {$i(pvAddress)}
                        </span>
                      </div>
                      <div
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: '8px' }}
                        data-cols="repeat(2,minmax(0,1fr))"
                      >
                        {$list(unlocks).map((u, $index) => (
                          <Fragment key={$index}>
                            <span
                              style={$css(
                                `display:flex;align-items:center;gap:9px;padding:10px 12px;border-radius:14px;background:${u?.bg ?? ''};font:500 13.5px Figtree,sans-serif;color:${u?.color ?? ''};transition:background .3s ease,color .3s ease`,
                              )}
                            >
                              <span style={$css(`display:flex;color:${u?.iconColor ?? ''}`)}>{$i(u?.icon)}</span>
                              {$i(u?.label)}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>
        <section id="claim-flow" data-screen-label="Claim flow" ref={flowRef} style={{ background: '#f7fafd' }}>
          <div
            style={$css(
              `max-width:1280px;margin:0 auto;padding:${flowPad ?? ''};display:grid;grid-template-columns:${flowCols ?? ''};gap:28px;align-items:start`,
            )}
            data-rc-dyn="1"
          >
            <div
              style={$css(
                `background:#fff;border:1px solid #e6eef6;border-radius:32px;padding:${panelPad ?? ''};box-shadow:0 24px 50px -40px rgba(16,35,58,.35);min-width:0;display:flex;flex-direction:column;gap:30px`,
              )}
            >
              <ol
                style={{
                  listStyle: 'none',
                  margin: '0',
                  padding: '0',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
                  gap: '8px',
                }}
                data-cols="repeat(4,minmax(0,1fr))"
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
                        disabled={st?.disabled}
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
              {isStep1 ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'clFade .3s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h2 style={{ fontSize: '28px' }}>Find your listing</h2>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>
                        Select your centre from the directory. Listings marked Claimed are already managed by a verified
                        owner.
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        height: '52px',
                        padding: '0 16px',
                        background: '#f7fafd',
                        border: '1.5px solid #e3ecf4',
                        borderRadius: '16px',
                      }}
                    >
                      <span style={{ display: 'flex', color: '#6b7f95' }}>{$i(iconSearch)}</span>
                      <input
                        value={$val(query)}
                        onChange={onQuery}
                        placeholder="Filter by centre name or city"
                        aria-label="Filter listings"
                        style={{
                          flex: '1',
                          minWidth: '0',
                          height: '100%',
                          border: '0',
                          outline: 'none',
                          background: 'transparent',
                          font: '500 15.5px Figtree,sans-serif',
                          color: '#10233a',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {$list(allResults).map((r, $index) => (
                        <Fragment key={$index}>
                          <div
                            style={$css(
                              `display:flex;align-items:center;gap:14px;padding:12px 12px 12px 14px;border-radius:18px;border:1px solid ${r?.rowBorder ?? ''};background:${r?.rowBg ?? ''};transition:border-color .15s ease,background .15s ease`,
                            )}
                          >
                            <span
                              style={$css(
                                `width:44px;height:44px;border-radius:13px;background:${r?.tileBg ?? ''};color:${r?.tileColor ?? ''};display:grid;place-items:center;font:600 14px Jost,sans-serif;flex-shrink:0`,
                              )}
                            >
                              {$i(r?.initials)}
                            </span>
                            <span
                              style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}
                            >
                              <span style={{ font: '600 16px Jost,sans-serif', color: '#10233a' }}>{$i(r?.name)}</span>
                              <span style={{ fontSize: '13.5px', color: '#6b7f95' }}>{$i(r?.address)}</span>
                            </span>
                            {r?.claimable ? (
                              <>
                                <button
                                  className="scpy"
                                  onClick={r?.pick}
                                  style={$css(
                                    `appearance:none;border:0;cursor:pointer;height:40px;padding:0 16px;border-radius:999px;background:${r?.btnBg ?? ''};color:${r?.btnColor ?? ''};font:600 14px Jost,sans-serif;flex-shrink:0;transition:background .15s ease,transform .12s ease-out`,
                                  )}
                                >
                                  {$i(r?.btnLabel)}
                                </button>
                              </>
                            ) : null}
                            {r?.claimed ? (
                              <>
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    flexShrink: '0',
                                    font: '600 13px Figtree,sans-serif',
                                    color: '#6b7f95',
                                  }}
                                >
                                  <span style={{ display: 'flex', color: '#0890E8' }}>{$i(iconShieldSm)}</span>
                                  Claimed ·{' '}
                                  <$A href="/contact" style={{ fontWeight: '600' }}>
                                    Dispute
                                  </$A>
                                </span>
                              </>
                            ) : null}
                          </div>
                        </Fragment>
                      ))}
                      {noAll ? (
                        <>
                          <div
                            style={{
                              padding: '22px',
                              borderRadius: '18px',
                              background: '#f7fafd',
                              border: '1px dashed #cfdceb',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '6px',
                            }}
                          >
                            <span style={{ font: '600 16px Jost,sans-serif' }}>We couldn't find that centre</span>
                            <span style={{ fontSize: '14.5px', color: '#516378' }}>
                              It may not be listed yet.{' '}
                              <$A href={'/auth?mode=signup&type=centre'} style={{ fontWeight: '600' }}>
                                Add your centre to the directory
                              </$A>
                              .
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </>
              ) : null}
              {isStep2 ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '22px', animation: 'clFade .3s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h2 style={{ fontSize: '28px' }}>Confirm you represent this centre</h2>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>
                        We use these details to verify ownership of{' '}
                        <strong style={{ color: '#10233a' }}>{$i(selName)}</strong>.
                      </p>
                    </div>
                    <div style={$css(`display:grid;grid-template-columns:${formCols ?? ''};gap:16px`)} data-rc-dyn="1">
                      {$list(fields).map((f, $index) => (
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
                      <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>
                        How should we verify you?
                      </span>
                      <div
                        style={$css(`display:grid;grid-template-columns:${methodCols ?? ''};gap:10px`)}
                        data-rc-dyn="1"
                      >
                        {$list(methods).map((m, $index) => (
                          <Fragment key={$index}>
                            <button
                              className="scpg"
                              onClick={m?.select}
                              aria-pressed={m?.pressed}
                              style={$css(
                                `appearance:none;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:6px;padding:16px;border-radius:18px;border:1.5px solid ${m?.border ?? ''};background:${m?.bg ?? ''};transition:border-color .15s ease,background .15s ease,transform .12s ease-out`,
                              )}
                            >
                              <span
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '8px',
                                }}
                              >
                                <span style={{ display: 'flex', color: '#0890E8' }}>{$i(m?.icon)}</span>
                                <span
                                  style={$css(
                                    `width:18px;height:18px;border-radius:50%;border:1.5px solid ${m?.radioBorder ?? ''};display:grid;place-items:center`,
                                  )}
                                >
                                  <span
                                    style={$css(
                                      `width:8px;height:8px;border-radius:50%;background:${m?.radioFill ?? ''}`,
                                    )}
                                  />
                                </span>
                              </span>
                              <span style={{ font: '600 15px Jost,sans-serif', color: '#10233a' }}>{$i(m?.title)}</span>
                              <span style={{ fontSize: '13px', lineHeight: '1.45', color: '#516378' }}>
                                {$i(m?.body)}
                              </span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={toggleAuth}
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
                          `width:22px;height:22px;border-radius:7px;border:1.5px solid ${authBorder ?? ''};background:${authBg ?? ''};color:#fff;display:grid;place-items:center;flex-shrink:0;margin-top:1px;transition:background .15s ease,border-color .15s ease`,
                        )}
                      >
                        {$i(iconCheckSm)}
                      </span>
                      <span style={{ fontSize: '14.5px', lineHeight: '1.5', color: '#3b4d63' }}>
                        I confirm I'm authorized to manage this listing on behalf of {$i(selName)}.
                      </span>
                    </button>
                    <span
                      style={$css(
                        `display:${authErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d;margin-top:-14px`,
                      )}
                    >
                      Please confirm you're authorized to continue.
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap',
                        paddingTop: '6px',
                        borderTop: '1px solid #edf2f7',
                      }}
                    >
                      <button
                        className="scp2"
                        onClick={back}
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
                        Back
                      </button>
                      <button
                        className="scpc scpy"
                        onClick={next2}
                        style={{
                          appearance: 'none',
                          border: '0',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '48px',
                          padding: '0 22px',
                          borderRadius: '999px',
                          background: '#0890E8',
                          color: '#fff',
                          font: '600 15px Jost,sans-serif',
                          transition: 'background .15s ease,transform .12s ease-out',
                        }}
                      >
                        Continue to plans
                        {$i(iconArrow)}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
              {isStep3 ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '22px', animation: 'clFade .3s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h2 style={{ fontSize: '28px' }}>Choose your subscription</h2>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>
                        A subscription is required to claim and manage a listing. Pick the plan that fits your centre.
                      </p>
                    </div>
                    <div style={$css(`display:grid;grid-template-columns:${planCols ?? ''};gap:12px`)} data-rc-dyn="1">
                      {$list(plans).map((p, $index) => (
                        <Fragment key={$index}>
                          <button
                            className="scp18 scpg"
                            onClick={p?.select}
                            aria-pressed={p?.pressed}
                            style={$css(
                              `appearance:none;cursor:pointer;text-align:left;position:relative;display:flex;flex-direction:column;gap:14px;padding:20px;border-radius:22px;border:1.5px solid ${p?.border ?? ''};background:${p?.bg ?? ''};box-shadow:${p?.shadow ?? ''};transition:border-color .2s ease,background .2s ease,box-shadow .2s ease,transform .15s ease-out`,
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
                            <span style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
                              <span style={{ font: '600 32px/1 Jost,sans-serif', color: '#10233a' }}>
                                {$i(p?.price)}
                              </span>
                              <span style={{ fontSize: '14px', color: '#6b7f95' }}>/mo</span>
                            </span>
                            <ul
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '7px',
                                borderTop: '1px solid #edf2f7',
                                paddingTop: '14px',
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
                        alignItems: 'center',
                        gap: '12px',
                        padding: '14px 18px',
                        borderRadius: '18px',
                        background: '#f7fafd',
                        border: '1px solid #e6eef6',
                        flexWrap: 'wrap',
                      }}
                    >
                      <span style={{ fontSize: '14.5px', color: '#3b4d63', flex: '1', minWidth: '220px' }}>
                        Multiple locations or national reach? The National plan starts from $2,500/mo.
                      </span>
                      <$A
                        href="/promote"
                        style={{
                          font: '600 14.5px Jost,sans-serif',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        Talk to our team
                        {$i(iconArrow)}
                      </$A>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap',
                        paddingTop: '6px',
                        borderTop: '1px solid #edf2f7',
                      }}
                    >
                      <button
                        className="scp2"
                        onClick={back}
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
                        Back
                      </button>
                      <button
                        className="scpc scpy"
                        onClick={next3}
                        style={{
                          appearance: 'none',
                          border: '0',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '48px',
                          padding: '0 22px',
                          borderRadius: '999px',
                          background: '#0890E8',
                          color: '#fff',
                          font: '600 15px Jost,sans-serif',
                          transition: 'background .15s ease,transform .12s ease-out',
                        }}
                      >
                        Continue to payment
                        {$i(iconArrow)}
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
              {isStep4 ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '22px', animation: 'clFade .3s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h2 style={{ fontSize: '28px' }}>{'Review & pay'}</h2>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>
                        Your subscription starts today. Our team then verifies your ownership — if we can't approve the
                        claim, we refund your payment in full.
                      </p>
                    </div>
                    <div style={{ border: '1px solid #e6eef6', borderRadius: '20px', overflow: 'hidden' }}>
                      {$list(review).map((rv, $index) => (
                        <Fragment key={$index}>
                          <div
                            style={$css(
                              `display:grid;grid-template-columns:${reviewCols ?? ''};gap:4px 16px;padding:14px 18px;border-top:1px solid ${rv?.line ?? ''};align-items:center`,
                            )}
                            data-rc-dyn="1"
                          >
                            <span
                              style={{
                                font: '600 12px Figtree,sans-serif',
                                letterSpacing: '.1em',
                                textTransform: 'uppercase',
                                color: '#6b7f95',
                              }}
                            >
                              {$i(rv?.k)}
                            </span>
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                minWidth: '0',
                              }}
                            >
                              <span
                                style={{
                                  font: '500 15.5px Figtree,sans-serif',
                                  color: '#10233a',
                                  minWidth: '0',
                                  overflowWrap: 'anywhere',
                                }}
                              >
                                {$i(rv?.v)}
                              </span>
                              <button
                                onClick={rv?.edit}
                                style={{
                                  appearance: 'none',
                                  border: '0',
                                  background: 'transparent',
                                  cursor: 'pointer',
                                  font: '600 13.5px Jost,sans-serif',
                                  color: '#0890E8',
                                  flexShrink: '0',
                                  padding: '4px 0',
                                }}
                              >
                                Edit
                              </button>
                            </span>
                          </div>
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
                            If there's any issue approving your claim, we return your payment in full.
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
                        and authorize a {$i(asPrice)}
                        /mo subscription charge starting today, refunded in full if the claim isn't approved.
                      </span>
                    </button>
                    <span
                      style={$css(
                        `display:${termsErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d;margin-top:-14px`,
                      )}
                    >
                      {$i(termsErr)}
                    </span>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap',
                        paddingTop: '6px',
                        borderTop: '1px solid #edf2f7',
                      }}
                    >
                      <button
                        className="scp2"
                        onClick={back}
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
                        Back
                      </button>
                      <button
                        className="scp19 scpy"
                        onClick={submit}
                        style={{
                          appearance: 'none',
                          border: '0',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '52px',
                          padding: '0 26px',
                          borderRadius: '999px',
                          background: '#D82028',
                          color: '#fff',
                          font: '600 16px Jost,sans-serif',
                          boxShadow: '0 14px 28px -14px rgba(216,32,40,.7)',
                          transition: 'background .15s ease,transform .12s ease-out',
                        }}
                      >
                        <span style={{ display: 'flex' }}>{$i(iconLock)}</span>
                        Pay {$i(asPrice)} {'& submit claim'}
                      </button>
                    </div>
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
                      animation: 'clFade .35s ease-out',
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
                        animation: 'clPop .5s cubic-bezier(.23,1,.32,1)',
                      }}
                    >
                      {$i(iconCheckLg)}
                    </span>
                    <h2 style={{ fontSize: '32px' }}>Payment received — claim under review</h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#516378', maxWidth: '520px' }}>
                      Thanks, {$i(firstName)}. Your {$i(planName)} subscription for{' '}
                      <strong style={{ color: '#10233a' }}>{$i(selName)}</strong> is active and your receipt has been
                      sent to {$i(form?.email)}. If we can't verify your ownership, we'll refund you in full.
                    </p>
                    <ol
                      style={$css(
                        `list-style:none;margin:10px 0 0;padding:0;display:grid;grid-template-columns:${nextCols ?? ''};gap:10px;width:100%;text-align:left`,
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
                    <button
                      className="scp2"
                      onClick={restart}
                      style={{
                        appearance: 'none',
                        cursor: 'pointer',
                        marginTop: '8px',
                        height: '46px',
                        padding: '0 20px',
                        borderRadius: '999px',
                        border: '1.5px solid #dbe6f0',
                        background: '#fff',
                        color: '#1f3550',
                        font: '600 15px Jost,sans-serif',
                      }}
                    >
                      Claim another listing
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
                  background: '#fff',
                  border: '1px solid #e6eef6',
                  borderRadius: '26px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  boxShadow: '0 24px 50px -40px rgba(16,35,58,.35)',
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
                  Your claim
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span
                    style={$css(
                      `width:46px;height:46px;border-radius:14px;background:${asTileBg ?? ''};color:${asTileColor ?? ''};display:grid;place-items:center;font:600 15px Jost,sans-serif;flex-shrink:0`,
                    )}
                  >
                    {$i(asInitials)}
                  </span>
                  <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                    <span style={{ font: '600 15.5px Jost,sans-serif', color: '#10233a' }}>{$i(asName)}</span>
                    <span style={{ fontSize: '13px', color: '#6b7f95' }}>{$i(asAddress)}</span>
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', borderTop: '1px solid #edf2f7' }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '10px',
                      padding: '12px 0',
                      borderBottom: '1px solid #edf2f7',
                      fontSize: '14px',
                    }}
                  >
                    <span style={{ color: '#6b7f95' }}>Plan</span>
                    <span style={{ font: '600 14.5px Jost,sans-serif', color: '#10233a' }}>{$i(asPlan)}</span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: '10px',
                      padding: '12px 0 4px',
                      fontSize: '14px',
                    }}
                  >
                    <span style={{ color: '#6b7f95' }}>Due today</span>
                    <span style={{ font: '600 20px Jost,sans-serif', color: '#10233a' }}>{$i(asPrice)}</span>
                  </div>
                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      font: '500 12.5px Figtree,sans-serif',
                      color: '#1f8a52',
                    }}
                  >
                    <span style={{ display: 'flex' }}>{$i(iconShieldSm)}</span>
                    Refunded in full if not verified
                  </span>
                </div>
              </div>
              <$A
                className="scpe scpg"
                href="tel:+18558854747"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '22px',
                  background: '#10233a',
                  color: '#fff',
                  transition: 'transform .12s ease-out',
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
                  <span style={{ font: '500 12.5px Figtree,sans-serif', color: '#9fb3c8' }}>
                    Questions about claiming?
                  </span>
                  <span style={{ font: '600 16px Jost,sans-serif' }}>1-855-885-4747</span>
                </span>
              </$A>
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
  '\nhtml,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\ninput,select,button{font-family:inherit}\ninput::placeholder{color:#8a9bb0}\n@keyframes topCallRing{0%{transform:scale(1);opacity:.7}70%,100%{transform:scale(1.7);opacity:0}}\n@keyframes clFade{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@keyframes clPop{0%{transform:scale(.6);opacity:0}60%{transform:scale(1.08);opacity:1}100%{transform:scale(1)}}\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}\n';
export const css = [ownCss, SiteHeader_css].filter(Boolean).join('\n');
export const defaults = {};
const View = createDC('ClaimListing', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} {...props} />;
}
