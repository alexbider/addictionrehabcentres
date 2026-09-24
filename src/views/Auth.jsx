'use client';
// Generated from Auth.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  static USER = 'arc-auth-user';
  state = {
    vw: 1280,
    mode: 'login',
    type: null,
    name: '',
    email: '',
    pw: '',
    showPw: false,
    remember: true,
    terms: false,
    tried: false,
    busy: false,
    sent: false,
  };
  componentDidMount() {
    this.setState({ vw: window.innerWidth });
    this._r = () => this.setState({ vw: window.innerWidth });
    window.addEventListener('resize', this._r);
    try {
      const q = new URLSearchParams(window.location.search);
      const mode = q.get('mode'),
        type = q.get('type');
      const next = {};
      if (mode === 'signup' || mode === 'login') next.mode = mode;
      if (type === 'centre' || type === 'therapist') {
        next.type = type;
        if (!mode) next.mode = 'signup';
      }
      this.setState(next);
    } catch (e) {}
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._r);
    clearTimeout(this._t);
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
  mode(m) {
    this.setState({ mode: m, tried: false, busy: false, sent: false, pw: '' });
  }

  renderVals() {
    const { vw, mode, type, name, email, pw, showPw, remember, terms, tried, busy, sent } = this.state;
    const wide = vw >= 980;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const score = [
      pw.length >= 8,
      /[A-Z]/.test(pw) && /[a-z]/.test(pw),
      /\d/.test(pw),
      /[^A-Za-z0-9]/.test(pw) || pw.length >= 12,
    ].filter(Boolean).length;
    const pwOk = pw.length >= 8;
    const barColor = ['#e0787c', '#F5A623', '#0890E8', '#2fb46b'][Math.max(0, score - 1)];
    const bad = (x) => tried && x;
    const isC = type === 'centre',
      isT = type === 'therapist';
    const dest = isC ? '/centre-onboarding' : '/therapist-onboarding';
    const ic = {
      building: this.icon([
        'M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16',
        'M16 9h2a2 2 0 0 1 2 2v10',
        'M8 7h4',
        'M8 11h4',
        'M8 15h4',
        'M2 21h20',
      ]),
      person: this.icon([{ t: 'circle', a: { cx: 12, cy: 8, r: 4 } }, 'M4 21a8 8 0 0 1 16 0']),
      edit: this.icon(['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4']),
      home: this.icon(['M3 11l9-7 9 7', 'M5 10v10h14V10']),
      shield: this.icon(['M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z', 'M9 12l2 2 4-4']),
    };
    const types = [
      ['centre', 'Treatment centre', 'List a rehab, detox or outpatient program.', ic.building],
      ['therapist', 'Therapist', 'Psychotherapists, psychologists, counsellors.', ic.person],
    ].map(([k, title, body, icon]) => {
      const on = type === k;
      return {
        title,
        body,
        icon,
        pressed: on ? 'true' : 'false',
        select: () => this.setState({ type: k }),
        border: on ? '#0890E8' : bad(!type) ? '#e0787c' : '#e3ecf4',
        bg: on ? '#f3f9fe' : '#fff',
        shadow: on ? '0 14px 28px -20px rgba(8,144,232,.6)' : 'none',
        iconBg: on ? '#0890E8' : '#eaf5fd',
        iconColor: on ? '#fff' : '#0890E8',
        radioBorder: on ? '#0890E8' : '#cfdceb',
        radioFill: on ? '#0890E8' : 'transparent',
      };
    });

    const finish = (user, href) => {
      this.setState({ busy: true });
      try {
        localStorage.setItem(Component.USER, JSON.stringify(user));
      } catch (e) {}
      this._t = setTimeout(() => {
        if (href) window.location.href = href;
        else this.setState({ busy: false, mode: 'welcome' });
      }, 700);
    };
    const submitLogin = (e) => {
      e && e.preventDefault && e.preventDefault();
      if (!emailOk || !pw) {
        this.setState({ tried: true });
        return;
      }
      let prev = {};
      try {
        prev = JSON.parse(localStorage.getItem(Component.USER) || '{}');
      } catch (err) {}
      finish({ ...prev, email, signedIn: true });
    };
    const submitSignup = (e) => {
      e && e.preventDefault && e.preventDefault();
      if (!type || !name.trim() || !emailOk || !pwOk || !terms) {
        this.setState({ tried: true });
        return;
      }
      finish({ name: name.trim(), email, type, signedIn: true }, dest);
    };

    let stored = {};
    try {
      stored = JSON.parse(localStorage.getItem(Component.USER) || '{}');
    } catch (e) {}
    const hasDraft = (k) => {
      try {
        return !!localStorage.getItem(k);
      } catch (e) {
        return false;
      }
    };
    const destinations = [];
    if (stored.type === 'centre' || hasDraft('arc-centre-onboarding-draft'))
      destinations.push({
        title: 'Continue your centre listing',
        body: 'Pick up where you left off.',
        href: '/centre-onboarding',
        icon: ic.building,
      });
    if (stored.type === 'therapist' || hasDraft('arc-therapist-onboarding-draft'))
      destinations.push({
        title: 'Continue your therapist profile',
        body: 'Pick up where you left off.',
        href: '/therapist-onboarding',
        icon: ic.person,
      });
    if (!destinations.length)
      destinations.push(
        {
          title: 'Create a centre listing',
          body: 'Start your verified centre profile.',
          href: '/centre-onboarding',
          icon: ic.building,
        },
        {
          title: 'Create a therapist profile',
          body: 'Start your directory profile.',
          href: '/therapist-onboarding',
          icon: ic.person,
        },
      );
    destinations.unshift({
      title: 'Go to your dashboard',
      body: 'Leads, calendar, analytics and your listing.',
      href: '/provider-dashboard',
      icon: ic.home,
    });
    destinations.push({ title: 'Go to the homepage', body: 'Browse the directory.', href: '/', icon: ic.home });
    destinations.forEach((x, i) => {
      x.border = i === 0 ? '#b9dcf6' : '#e6eef6';
      x.bg = i === 0 ? '#f3f9fe' : '#fff';
    });

    const brand =
      mode === 'signup'
        ? isT
          ? [
              'Reach people looking for the right therapist',
              [
                'College-verified profile',
                'Shown on your province & city pages',
                'Clients message or call you directly',
              ],
              '/assets/img/menu-5.jpg',
            ]
          : [
              'Get your centre in front of families searching for care',
              ['Verified badge families trust', 'Your programs, photos and pricing', 'Call and lead tracking'],
              '/assets/img/menu-1.jpg',
            ]
        : [
            'Manage your listing on Canada\u2019s addiction treatment directory',
            ['Update details any time', 'See calls and enquiries', 'Keep your profile verified'],
            '/assets/img/home-hero.jpg',
          ];

    return {
      pageCols: wide ? 'minmax(0,.95fr) minmax(0,1.05fr)' : 'minmax(0,1fr)',
      showBrand: wide,
      showSmallLogo: !wide,
      mainPad: vw >= 640 ? '28px 40px' : '20px',
      brandTitle: brand[0],
      brandPoints: brand[1],
      brandBg: 'url(' + brand[2] + ')',
      showTabs: mode === 'login' || mode === 'signup',
      tabs: [
        ['login', 'Log in'],
        ['signup', 'Sign up'],
      ].map(([k, label]) => ({
        label,
        sel: mode === k ? 'true' : 'false',
        select: () => this.mode(k),
        bg: mode === k ? '#fff' : 'transparent',
        color: mode === k ? '#10233a' : '#516378',
        shadow: mode === k ? '0 6px 14px -8px rgba(16,35,58,.35)' : 'none',
      })),
      isLogin: mode === 'login',
      isSignup: mode === 'signup',
      isForgot: mode === 'forgot',
      isWelcome: mode === 'welcome',
      email,
      setEmail: (e) => this.setState({ email: e.target.value }),
      emailBorder: bad(!emailOk) ? '#e0787c' : '#dbe6f0',
      emailErrDisplay: bad(!emailOk) ? 'block' : 'none',
      pw,
      setPw: (e) => this.setState({ pw: e.target.value }),
      pwType: showPw ? 'text' : 'password',
      togglePw: () => this.setState({ showPw: !showPw }),
      pwToggleLabel: showPw ? 'Hide' : 'Show',
      pwBorder: bad(mode === 'signup' ? !pwOk : !pw) ? '#e0787c' : '#dbe6f0',
      loginPwErrDisplay: bad(!pw) ? 'block' : 'none',
      pwBars: [0, 1, 2, 3].map((i) => ({ bg: pw && i < score ? barColor : '#e6eef6' })),
      pwHint: !pw
        ? 'Use 8+ characters with a mix of letters, numbers and symbols.'
        : !pwOk
          ? 'Too short — use at least 8 characters.'
          : ['Weak', 'Fair', 'Good', 'Strong'][score - 1] + ' password',
      pwHintColor: bad(!pwOk) ? '#c0262d' : pw && pwOk ? barColor : '#6b7f95',
      toggleRemember: () => this.setState({ remember: !remember }),
      remBg: remember ? '#0890E8' : '#fff',
      remBorder: remember ? '#0890E8' : '#cfdceb',
      submitLogin,
      loginBtn: busy ? 'Signing in…' : 'Log in',
      spinDisplay: busy ? 'block' : 'none',
      toForgot: () => this.mode('forgot'),
      toLogin: () => this.mode('login'),
      toSignup: () => this.mode('signup'),
      forgotSub: sent
        ? 'If an account exists for ' + email + ', a reset link is on its way.'
        : 'Enter the email you signed up with and we\u2019ll send you a reset link.',
      forgotForm: !sent,
      forgotSent: sent,
      sendReset: () => {
        if (!emailOk) {
          this.setState({ tried: true });
          return;
        }
        this.setState({ sent: true });
      },
      types,
      typeCols: vw >= 420 ? '1fr 1fr' : '1fr',
      typeErrDisplay: bad(!type) ? 'block' : 'none',
      hasType: !!type,
      claimHint: isC ? 'Is your centre already listed?' : 'Already in our directory?',
      claimLink: isC ? 'Claim your listing instead' : 'Claim your profile instead',
      claimHref: isC ? '/claim-listing' : '/claim-therapist',
      name,
      setName: (e) => this.setState({ name: e.target.value }),
      nameBorder: bad(!name.trim()) ? '#e0787c' : '#dbe6f0',
      nameErrDisplay: bad(!name.trim()) ? 'block' : 'none',
      emailLabel: isC ? 'Work email' : 'Email',
      emailPh: isC ? 'admissions@yourcentre.ca' : 'you@yourpractice.ca',
      toggleTerms: () => this.setState({ terms: !terms }),
      termsBg: terms ? '#0890E8' : '#fff',
      termsBorder: terms ? '#0890E8' : bad(!terms) ? '#e0787c' : '#cfdceb',
      submitSignup,
      signupBtn: busy
        ? 'Creating account…'
        : isC
          ? 'Create account & list my centre'
          : isT
            ? 'Create account & build my profile'
            : 'Create account',
      flowSteps: [
        ['1', 'Account'],
        ['2', isC ? 'Centre profile' : 'Your profile'],
        ['3', 'Subscribe'],
      ].map(([n, label], i) => ({
        n,
        label,
        bg: i === 0 ? '#0890E8' : '#e6eef6',
        color: i === 0 ? '#fff' : '#6b7f95',
      })),
      destinations,
      signOut: () => {
        try {
          localStorage.removeItem(Component.USER);
        } catch (e) {}
        this.setState({ mode: 'login', pw: '' });
      },
      iconCheckSm: this.icon(['M5 12.5l4.5 4.5L19 7.5'], { width: 13, height: 13, strokeWidth: 3 }),
      iconArrow: this.icon(['M5 12h14', 'M13 6l6 6-6 6'], { width: 16, height: 16, strokeWidth: 2 }),
      iconBack: this.icon(['M19 12H5', 'M11 18l-6-6 6-6'], { width: 16, height: 16, strokeWidth: 2 }),
      iconLock: this.icon(
        [{ t: 'rect', a: { x: 5, y: 11, width: 14, height: 10, rx: 2 } }, 'M8 11V8a4 4 0 0 1 8 0v3'],
        { width: 16, height: 16, strokeWidth: 2 },
      ),
      iconMail: this.icon([{ t: 'rect', a: { x: 3, y: 5, width: 18, height: 14, rx: 2 } }, 'M3 7l9 6 9-6'], {
        width: 18,
        height: 18,
        strokeWidth: 2,
      }),
    };
  }
}

/* ───────────────────────── markup ───────────────────────── */
function template(v) {
  const {
    brandBg,
    brandPoints,
    brandTitle,
    claimHint,
    claimHref,
    claimLink,
    destinations,
    email,
    emailBorder,
    emailErrDisplay,
    emailLabel,
    emailPh,
    flowSteps,
    forgotForm,
    forgotSent,
    forgotSub,
    hasType,
    iconArrow,
    iconBack,
    iconCheckSm,
    iconLock,
    iconMail,
    isForgot,
    isLogin,
    isSignup,
    isWelcome,
    loginBtn,
    loginPwErrDisplay,
    mainPad,
    name,
    nameBorder,
    nameErrDisplay,
    pageCols,
    pw,
    pwBars,
    pwBorder,
    pwHint,
    pwHintColor,
    pwToggleLabel,
    pwType,
    remBg,
    remBorder,
    sendReset,
    setEmail,
    setName,
    setPw,
    showBrand,
    showSmallLogo,
    showTabs,
    signOut,
    signupBtn,
    spinDisplay,
    submitLogin,
    submitSignup,
    tabs,
    termsBg,
    termsBorder,
    toForgot,
    toLogin,
    toSignup,
    togglePw,
    toggleRemember,
    toggleTerms,
    typeCols,
    typeErrDisplay,
    types,
  } = v;
  return (
    <>
      <div
        style={$css(`min-height:100vh;display:grid;grid-template-columns:${pageCols ?? ''};background:#f7fafd`)}
        data-rc-dyn="1"
      >
        {showBrand ? (
          <>
            <aside
              data-screen-label="Auth brand panel"
              style={{
                position: 'sticky',
                overflow: 'hidden',
                background: '#10233a',
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '40px 44px',
                minHeight: '100vh',
                top: '0',
                height: '100vh',
              }}
            >
              <span
                style={$css(
                  `position:absolute;inset:0;background:${brandBg ?? ''};background-size:cover;background-position:center;opacity:.42`,
                )}
              />
              <span
                style={{
                  position: 'absolute',
                  inset: '0',
                  background:
                    'linear-gradient(180deg,rgba(16,35,58,.55) 0%,rgba(16,35,58,.2) 40%,rgba(10,60,110,.92) 100%)',
                }}
              />
              <$A href="/" style={{ position: 'relative', alignSelf: 'flex-start' }}>
                <img
                  src="/assets/logo-white.png"
                  alt="Addiction Rehab Centres Canada"
                  style={{ height: '52px', width: 'auto', display: 'block' }}
                />
              </$A>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '20px',
                  maxWidth: '460px',
                }}
              >
                <h2 style={{ font: '600 38px/1.12 Jost,sans-serif', color: '#fff' }} data-rc-lg="1">
                  {$i(brandTitle)}
                </h2>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {$list(brandPoints).map((bp, $index) => (
                    <Fragment key={$index}>
                      <li
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          font: '500 16px Figtree,sans-serif',
                          color: '#e3f1fc',
                        }}
                      >
                        <span
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,.16)',
                            border: '1px solid rgba(255,255,255,.28)',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: '0',
                          }}
                        >
                          {$i(iconCheckSm)}
                        </span>
                        {$i(bp)}
                      </li>
                    </Fragment>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  font: '500 13.5px Figtree,sans-serif',
                  color: '#b7c7d8',
                }}
              >
                <span style={{ display: 'flex' }}>{$i(iconLock)}</span>
                Your details are encrypted and never shared.{' '}
              </div>
            </aside>
          </>
        ) : null}
        <main
          data-screen-label="Auth form"
          style={$css(`display:flex;flex-direction:column;min-height:100vh;padding:${mainPad ?? ''}`)}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            {showSmallLogo ? (
              <>
                <$A href="/">
                  <img
                    src="/assets/logo.png"
                    alt="Addiction Rehab Centres Canada"
                    style={{ height: '40px', width: 'auto', display: 'block' }}
                  />
                </$A>
              </>
            ) : null}
            <$A
              className="scp0"
              href="/"
              style={{
                marginLeft: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                font: '600 14px Jost,sans-serif',
                color: '#516378',
              }}
            >
              {$i(iconBack)}
              Back to site
            </$A>
          </div>
          <div
            style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 0' }}
          >
            <div style={{ width: '100%', maxWidth: '460px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {showTabs ? (
                <>
                  <div
                    role="tablist"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      padding: '5px',
                      borderRadius: '999px',
                      background: '#eaf0f6',
                    }}
                    data-cols="1fr 1fr"
                  >
                    {$list(tabs).map((t, $index) => (
                      <Fragment key={$index}>
                        <button
                          role="tab"
                          aria-selected={t?.sel}
                          onClick={t?.select}
                          style={$css(
                            `appearance:none;border:0;cursor:pointer;height:44px;border-radius:999px;background:${t?.bg ?? ''};color:${t?.color ?? ''};box-shadow:${t?.shadow ?? ''};font:600 15px Jost,sans-serif;transition:background .2s ease,color .2s ease,box-shadow .2s ease`,
                          )}
                        >
                          {$i(t?.label)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </>
              ) : null}
              {isLogin ? (
                <>
                  <form
                    onSubmit={submitLogin}
                    style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'auFade .25s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h1 style={{ fontSize: '32px' }}>Welcome back</h1>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>
                        Log in to manage your centre or therapist profile.
                      </p>
                    </div>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>Email</span>
                      <input
                        className="scpf"
                        type="email"
                        autoComplete="email"
                        value={$val(email)}
                        onChange={setEmail}
                        placeholder="you@example.ca"
                        style={$css(
                          `height:52px;padding:0 16px;border-radius:14px;border:1.5px solid ${emailBorder ?? ''};background:#fff;font:500 15.5px Figtree,sans-serif;color:#10233a;outline:none`,
                        )}
                      />
                      <span
                        style={$css(
                          `display:${emailErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`,
                        )}
                      >
                        Enter a valid email.
                      </span>
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                        <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>Password</span>
                        <button
                          type="button"
                          onClick={toForgot}
                          style={{
                            appearance: 'none',
                            border: '0',
                            background: 'transparent',
                            padding: '0',
                            cursor: 'pointer',
                            font: '600 13px Figtree,sans-serif',
                            color: '#0890E8',
                          }}
                        >
                          Forgot password?
                        </button>
                      </span>
                      <span
                        style={$css(
                          `display:flex;align-items:center;height:52px;border-radius:14px;border:1.5px solid ${pwBorder ?? ''};background:#fff;overflow:hidden`,
                        )}
                      >
                        <input
                          type={pwType}
                          autoComplete="current-password"
                          value={$val(pw)}
                          onChange={setPw}
                          placeholder="Your password"
                          style={{
                            flex: '1',
                            minWidth: '0',
                            height: '100%',
                            border: '0',
                            outline: 'none',
                            padding: '0 16px',
                            font: '500 15.5px Figtree,sans-serif',
                            color: '#10233a',
                            background: 'transparent',
                          }}
                        />
                        <button
                          type="button"
                          onClick={togglePw}
                          aria-label="Show or hide password"
                          style={{
                            appearance: 'none',
                            border: '0',
                            background: 'transparent',
                            cursor: 'pointer',
                            padding: '0 14px',
                            height: '100%',
                            color: '#6b7f95',
                            font: '600 13px Figtree,sans-serif',
                          }}
                        >
                          {$i(pwToggleLabel)}
                        </button>
                      </span>
                      <span
                        style={$css(
                          `display:${loginPwErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`,
                        )}
                      >
                        Enter your password.
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={toggleRemember}
                      style={{
                        appearance: 'none',
                        border: '0',
                        background: 'transparent',
                        padding: '0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={$css(
                          `width:20px;height:20px;border-radius:6px;border:1.5px solid ${remBorder ?? ''};background:${remBg ?? ''};color:#fff;display:grid;place-items:center`,
                        )}
                      >
                        {$i(iconCheckSm)}
                      </span>
                      <span style={{ fontSize: '14.5px', color: '#3b4d63' }}>Keep me signed in</span>
                    </button>
                    <button
                      className="scpc scpg"
                      type="submit"
                      style={{
                        appearance: 'none',
                        border: '0',
                        cursor: 'pointer',
                        height: '54px',
                        borderRadius: '999px',
                        background: '#0890E8',
                        color: '#fff',
                        font: '600 16px Jost,sans-serif',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: 'background .15s ease,transform .12s ease-out',
                      }}
                    >
                      <span
                        style={$css(
                          `display:${spinDisplay ?? ''};width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:auSpin .7s linear infinite`,
                        )}
                      />
                      {$i(loginBtn)}
                    </button>
                    <p style={{ textAlign: 'center', fontSize: '14.5px', color: '#516378' }}>
                      New here?{' '}
                      <button
                        type="button"
                        onClick={toSignup}
                        style={{
                          appearance: 'none',
                          border: '0',
                          background: 'transparent',
                          padding: '0',
                          cursor: 'pointer',
                          font: '600 14.5px Figtree,sans-serif',
                          color: '#0890E8',
                        }}
                      >
                        Create an account
                      </button>
                    </p>
                  </form>
                </>
              ) : null}
              {isForgot ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'auFade .25s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h1 style={{ fontSize: '32px' }}>Reset your password</h1>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>{$i(forgotSub)}</p>
                    </div>
                    {forgotForm ? (
                      <>
                        <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                          <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>Email</span>
                          <input
                            className="scpf"
                            type="email"
                            value={$val(email)}
                            onChange={setEmail}
                            placeholder="you@example.ca"
                            style={$css(
                              `height:52px;padding:0 16px;border-radius:14px;border:1.5px solid ${emailBorder ?? ''};background:#fff;font:500 15.5px Figtree,sans-serif;color:#10233a;outline:none`,
                            )}
                          />
                          <span
                            style={$css(
                              `display:${emailErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`,
                            )}
                          >
                            Enter a valid email.
                          </span>
                        </label>
                        <button
                          className="scpc"
                          onClick={sendReset}
                          style={{
                            appearance: 'none',
                            border: '0',
                            cursor: 'pointer',
                            height: '54px',
                            borderRadius: '999px',
                            background: '#0890E8',
                            color: '#fff',
                            font: '600 16px Jost,sans-serif',
                          }}
                        >
                          Send reset link
                        </button>
                      </>
                    ) : null}
                    {forgotSent ? (
                      <>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '16px 18px',
                            borderRadius: '18px',
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
                            {$i(iconMail)}
                          </span>
                          <span style={{ fontSize: '14.5px', lineHeight: '1.5', color: '#1f3550' }}>
                            Check your inbox for a link to choose a new password.
                          </span>
                        </div>
                      </>
                    ) : null}
                    <button
                      onClick={toLogin}
                      style={{
                        appearance: 'none',
                        border: '0',
                        background: 'transparent',
                        padding: '0',
                        cursor: 'pointer',
                        alignSelf: 'center',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        font: '600 14.5px Jost,sans-serif',
                        color: '#0890E8',
                      }}
                    >
                      {$i(iconBack)}
                      Back to log in
                    </button>
                  </div>
                </>
              ) : null}
              {isSignup ? (
                <>
                  <form
                    onSubmit={submitSignup}
                    style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'auFade .25s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h1 style={{ fontSize: '32px' }}>Create your account</h1>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>
                        Tell us who you are — we'll take you straight to building your profile.
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>I'm signing up as</span>
                      <div
                        style={$css(`display:grid;grid-template-columns:${typeCols ?? ''};gap:10px`)}
                        data-rc-dyn="1"
                      >
                        {$list(types).map((ty, $index) => (
                          <Fragment key={$index}>
                            <button
                              className="scpg"
                              type="button"
                              onClick={ty?.select}
                              aria-pressed={ty?.pressed}
                              style={$css(
                                `appearance:none;cursor:pointer;text-align:left;display:flex;flex-direction:column;gap:10px;padding:16px;border-radius:20px;border:1.5px solid ${ty?.border ?? ''};background:${ty?.bg ?? ''};box-shadow:${ty?.shadow ?? ''};transition:border-color .15s ease,background .15s ease,box-shadow .2s ease,transform .12s ease-out`,
                              )}
                            >
                              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span
                                  style={$css(
                                    `width:40px;height:40px;border-radius:12px;background:${ty?.iconBg ?? ''};color:${ty?.iconColor ?? ''};display:grid;place-items:center;transition:background .15s ease,color .15s ease`,
                                  )}
                                >
                                  {$i(ty?.icon)}
                                </span>
                                <span
                                  style={$css(
                                    `width:20px;height:20px;border-radius:50%;border:1.5px solid ${ty?.radioBorder ?? ''};display:grid;place-items:center`,
                                  )}
                                >
                                  <span
                                    style={$css(
                                      `width:10px;height:10px;border-radius:50%;background:${ty?.radioFill ?? ''}`,
                                    )}
                                  />
                                </span>
                              </span>
                              <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                <span style={{ font: '600 16px Jost,sans-serif', color: '#10233a' }}>
                                  {$i(ty?.title)}
                                </span>
                                <span style={{ fontSize: '13px', lineHeight: '1.4', color: '#516378' }}>
                                  {$i(ty?.body)}
                                </span>
                              </span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      <span
                        style={$css(`display:${typeErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`)}
                      >
                        Choose an account type.
                      </span>
                      {hasType ? (
                        <>
                          <span style={{ fontSize: '13.5px', color: '#516378' }}>
                            {$i(claimHint)}{' '}
                            <$A href={claimHref} style={{ fontWeight: '600' }}>
                              {$i(claimLink)}
                            </$A>
                          </span>
                        </>
                      ) : null}
                    </div>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>Your full name</span>
                      <input
                        className="scpf"
                        autoComplete="name"
                        value={$val(name)}
                        onChange={setName}
                        placeholder="Jane Doe"
                        style={$css(
                          `height:52px;padding:0 16px;border-radius:14px;border:1.5px solid ${nameBorder ?? ''};background:#fff;font:500 15.5px Figtree,sans-serif;color:#10233a;outline:none`,
                        )}
                      />
                      <span
                        style={$css(`display:${nameErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`)}
                      >
                        Enter your name.
                      </span>
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>{$i(emailLabel)}</span>
                      <input
                        className="scpf"
                        type="email"
                        autoComplete="email"
                        value={$val(email)}
                        onChange={setEmail}
                        placeholder={emailPh}
                        style={$css(
                          `height:52px;padding:0 16px;border-radius:14px;border:1.5px solid ${emailBorder ?? ''};background:#fff;font:500 15.5px Figtree,sans-serif;color:#10233a;outline:none`,
                        )}
                      />
                      <span
                        style={$css(
                          `display:${emailErrDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`,
                        )}
                      >
                        Enter a valid email.
                      </span>
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      <span style={{ font: '600 13.5px Figtree,sans-serif', color: '#1f3550' }}>Create a password</span>
                      <span
                        style={$css(
                          `display:flex;align-items:center;height:52px;border-radius:14px;border:1.5px solid ${pwBorder ?? ''};background:#fff;overflow:hidden`,
                        )}
                      >
                        <input
                          type={pwType}
                          autoComplete="new-password"
                          value={$val(pw)}
                          onChange={setPw}
                          placeholder="At least 8 characters"
                          style={{
                            flex: '1',
                            minWidth: '0',
                            height: '100%',
                            border: '0',
                            outline: 'none',
                            padding: '0 16px',
                            font: '500 15.5px Figtree,sans-serif',
                            color: '#10233a',
                            background: 'transparent',
                          }}
                        />
                        <button
                          type="button"
                          onClick={togglePw}
                          aria-label="Show or hide password"
                          style={{
                            appearance: 'none',
                            border: '0',
                            background: 'transparent',
                            cursor: 'pointer',
                            padding: '0 14px',
                            height: '100%',
                            color: '#6b7f95',
                            font: '600 13px Figtree,sans-serif',
                          }}
                        >
                          {$i(pwToggleLabel)}
                        </button>
                      </span>
                      <span
                        style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '4px' }}
                        data-cols="repeat(4,1fr)"
                      >
                        {$list(pwBars).map((b, $index) => (
                          <Fragment key={$index}>
                            <span
                              style={$css(
                                `height:4px;border-radius:4px;background:${b?.bg ?? ''};transition:background .2s ease`,
                              )}
                            />
                          </Fragment>
                        ))}
                      </span>
                      <span style={$css(`font:500 12.5px Figtree,sans-serif;color:${pwHintColor ?? ''}`)}>
                        {$i(pwHint)}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={toggleTerms}
                      style={{
                        appearance: 'none',
                        border: '0',
                        background: 'transparent',
                        padding: '0',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={$css(
                          `width:20px;height:20px;border-radius:6px;border:1.5px solid ${termsBorder ?? ''};background:${termsBg ?? ''};color:#fff;display:grid;place-items:center;flex-shrink:0;margin-top:1px`,
                        )}
                      >
                        {$i(iconCheckSm)}
                      </span>
                      <span style={{ fontSize: '14px', lineHeight: '1.5', color: '#3b4d63' }}>
                        I agree to the{' '}
                        <$A href="https://addictionrehabcenters.ca/terms-of-use/" style={{ fontWeight: '600' }}>
                          Terms of Use
                        </$A>{' '}
                        and{' '}
                        <$A href="https://addictionrehabcenters.ca/privacy-policy/" style={{ fontWeight: '600' }}>
                          Privacy Policy
                        </$A>
                        .
                      </span>
                    </button>
                    <button
                      className="scpc scpg"
                      type="submit"
                      style={{
                        appearance: 'none',
                        border: '0',
                        cursor: 'pointer',
                        height: '54px',
                        borderRadius: '999px',
                        background: '#0890E8',
                        color: '#fff',
                        font: '600 16px Jost,sans-serif',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        transition: 'background .15s ease,transform .12s ease-out',
                      }}
                    >
                      <span
                        style={$css(
                          `display:${spinDisplay ?? ''};width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:auSpin .7s linear infinite`,
                        )}
                      />
                      {$i(signupBtn)}
                      {$i(iconArrow)}
                    </button>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        justifyContent: 'center',
                        flexWrap: 'wrap',
                        fontSize: '13px',
                        color: '#6b7f95',
                      }}
                    >
                      {$list(flowSteps).map((fs, $index) => (
                        <Fragment key={$index}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={$css(
                                `width:18px;height:18px;border-radius:50%;background:${fs?.bg ?? ''};color:${fs?.color ?? ''};display:grid;place-items:center;font:600 10.5px Jost,sans-serif`,
                              )}
                            >
                              {$i(fs?.n)}
                            </span>
                            {$i(fs?.label)}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <p style={{ textAlign: 'center', fontSize: '14.5px', color: '#516378' }}>
                      Already have an account?{' '}
                      <button
                        type="button"
                        onClick={toLogin}
                        style={{
                          appearance: 'none',
                          border: '0',
                          background: 'transparent',
                          padding: '0',
                          cursor: 'pointer',
                          font: '600 14.5px Figtree,sans-serif',
                          color: '#0890E8',
                        }}
                      >
                        Log in
                      </button>
                    </p>
                  </form>
                </>
              ) : null}
              {isWelcome ? (
                <>
                  <div
                    style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'auFade .25s ease-out' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h1 style={{ fontSize: '32px' }}>You're signed in</h1>
                      <p style={{ fontSize: '15.5px', color: '#516378' }}>
                        Signed in as {$i(email)}. Where would you like to go?
                      </p>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {$list(destinations).map((ds, $index) => (
                        <Fragment key={$index}>
                          <$A
                            className="scph scpi"
                            href={ds?.href}
                            style={$css(
                              `display:flex;align-items:center;gap:14px;padding:16px;border-radius:20px;border:1.5px solid ${ds?.border ?? ''};background:${ds?.bg ?? ''};color:#10233a;transition:border-color .15s ease,transform .12s ease-out`,
                            )}
                          >
                            <span
                              style={{
                                width: '42px',
                                height: '42px',
                                borderRadius: '13px',
                                background: '#eaf5fd',
                                color: '#0890E8',
                                display: 'grid',
                                placeItems: 'center',
                                flexShrink: '0',
                              }}
                            >
                              {$i(ds?.icon)}
                            </span>
                            <span
                              style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}
                            >
                              <span style={{ font: '600 16px Jost,sans-serif' }}>{$i(ds?.title)}</span>
                              <span style={{ fontSize: '13.5px', color: '#516378' }}>{$i(ds?.body)}</span>
                            </span>
                            <span style={{ display: 'flex', color: '#0890E8' }}>{$i(iconArrow)}</span>
                          </$A>
                        </Fragment>
                      ))}
                    </div>
                    <button
                      onClick={signOut}
                      style={{
                        appearance: 'none',
                        border: '0',
                        background: 'transparent',
                        padding: '0',
                        cursor: 'pointer',
                        alignSelf: 'center',
                        font: '600 14px Jost,sans-serif',
                        color: '#6b7f95',
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '6px 18px',
              fontSize: '13px',
              color: '#6b7f95',
            }}
          >
            <span>© 2025 Addiction Rehab Centres Canada</span>
            <$A className="scp0" href="https://addictionrehabcenters.ca/privacy-policy/" style={{ color: '#6b7f95' }}>
              Privacy
            </$A>
            <$A className="scp0" href="https://addictionrehabcenters.ca/terms-of-use/" style={{ color: '#6b7f95' }}>
              Terms
            </$A>
            <$A className="scp0" href="tel:+18558854747" style={{ color: '#6b7f95' }}>
              Help: 1-855-885-4747
            </$A>
          </div>
        </main>
      </div>
    </>
  );
}

export const ownCss =
  '\nhtml,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\ninput,button{font-family:inherit}\ninput::placeholder{color:#8a9bb0}\n@keyframes auFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}\n@keyframes auSpin{to{transform:rotate(360deg)}}\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n';
export const css = [ownCss].filter(Boolean).join('\n');
export const defaults = {};
const View = createDC('Auth', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} {...props} />;
}
