'use client';
// Generated from Intervention.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = { menu: null, who: 1, sent: false, active: 'what', w: 1280 };
  componentDidMount() {
    this._ro = new ResizeObserver(() => {
      const w = document.documentElement.clientWidth;
      if (Math.abs(w - this.state.w) > 8) this.setState({ w });
    });
    this._ro.observe(document.documentElement);
    this.setState({ w: document.documentElement.clientWidth });
    this._onScroll = () => {
      const ids = ['what', 'planning', 'location', 'procedure', 'after', 'fail', 'reading'];
      let cur = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 180) cur = id;
      }
      if (cur !== this.state.active) this.setState({ active: cur });
    };
    window.addEventListener('scroll', this._onScroll, { passive: true });
  }
  componentWillUnmount() {
    this._ro && this._ro.disconnect();
    window.removeEventListener('scroll', this._onScroll);
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
    const { menu, who, sent, active, w } = this.state;
    const narrow = w < 1100,
      mid = w < 900,
      mobile = w < 680;
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
      phone: this.icon(['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z']),
      person: this.icon([{ t: 'circle', a: { cx: 12, cy: 8, r: 4 } }, 'M4 21a8 8 0 0 1 16 0']),
      clock: this.icon([{ t: 'circle', a: { cx: 12, cy: 12, r: 9 } }, 'M12 7v5l3 2'], { width: 22, height: 22 }),
      shield: this.icon(['M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z', 'M9 12l2 2 4-4'], {
        width: 22,
        height: 22,
      }),
      check: this.icon([{ t: 'circle', a: { cx: 12, cy: 12, r: 9 } }, 'M8 12l3 3 5-6'], { width: 22, height: 22 }),
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
    const locations = [
      ...provinces.map((p) => ({ label: p.label, href: p.href, code: p.code })),
      { label: 'Nunavut Rehabs', href: B + 'nunavut-drug-rehab-centers/', code: 'NU' },
      { label: 'Yukon Rehabs', href: B + 'rehab/yukon-drug-rehab-treatments/', code: 'YT' },
    ];

    // ---- Page data ----
    const tocDefs = [
      ['what', 'What is an Intervention?'],
      ['planning', 'Planning Your Intervention'],
      ['location', 'Location and Setup'],
      ['procedure', 'The Intervention Procedure'],
      ['after', 'After the Intervention'],
      ['fail', "What if it Doesn't Work?"],
      ['reading', 'Further Reading'],
    ];
    const toc = tocDefs.map(([id, label]) => ({
      label,
      href: '#' + id,
      color: active === id ? '#0890E8' : '#3b4d63',
      bar: active === id ? '#0890E8' : 'transparent',
    }));
    const whoList = [
      { mark: '✓', bg: '#2fb46b', text: 'Those closest to the addict who are fully committed to getting them help' },
      { mark: '✓', bg: '#2fb46b', text: 'A trained interventionist who is not personally invested in the outcome' },
      {
        mark: '✕',
        bg: '#D82028',
        text: 'Anyone who does not believe addiction is a disease or that treatment is needed',
      },
      { mark: '✕', bg: '#D82028', text: 'People who have not been personally affected by the addiction' },
    ];
    const steps = [
      [
        'The introduction',
        'During this phase, someone – usually the interventionist – explains to the addict that he or she is at an intervention, and the people present would like to discuss the addiction.',
      ],
      [
        'Discussing the effects of the addiction',
        'Each member of the group shares the specific ways in which the addict\u2019s choices have harmed him or her. The goal is not to make the addict feel bad, but to draw their attention to specific, irrefutable instances of harm caused by the addiction. The process usually begins with the person least close to the addict, then closes with the person the group thinks will have the most emotional impact – often a child or spouse.',
      ],
      [
        'Encouraging the addict to seek help',
        'During this phase, the interventionist or a member of the group will explain that addiction is a disease, and then encourage the addict to seek help. In most cases, the group will have already selected a facility, so all the addict has to do to get help is agree to pursue treatment.',
      ],
      [
        'Outlining the consequences for refusing help',
        'An intervention is a chance for each member of the group to stop enabling the addiction. This means every person must outline how his or her relationship to the addict will change if help is refused. Without these consequences, loved ones will remain in the trap of the addiction, and can continually be manipulated. Common consequences include withdrawal of shelter or financial support, or cessation of contact with the addict.',
      ],
    ].map(([title, body], i) => ({ n: '0' + (i + 1), title, body }));
    const reading = [
      ['Find an Interventionist', B + 'drug-intervention-treatment-centres/'],
      ['Drug Rehab Program', B + 'drug-rehab/'],
      ['Prescription Drug Rehab', B + 'prescription-drug-rehab/'],
      ['Alcohol Rehab', B + 'alcohol-rehab/'],
      ['Understanding Drug Addiction', B + 'understanding-addiction-to-drugs/'],
      ['Drug Addiction: Symptoms & Signs', B + 'drug-addiction-symptoms-signs/'],
      ['Am I an Addict?', B + 'am-i-an-addict/'],
    ].map(([label, href]) => ({ label, href }));
    const forWho = ['Yourself', 'Loved One'].map((label, i) => ({
      label,
      pick: () => this.setState({ who: i }),
      bg: who === i ? '#10233a' : 'transparent',
      color: who === i ? '#fff' : '#516378',
    }));

    return {
      navItems,
      menuOpen: !!m,
      closeMenu: () => this.setState({ menu: null }),
      menuTitle: m?.title,
      menuSub: m?.sub,
      menuIcon: m?.icon,
      menuCols: m?.cols || '1fr',
      menuLinks: m?.links || [],
      iconPhone: ic.phone,
      iconClock: ic.clock,
      iconShield: ic.shield,
      iconCheck: ic.check,
      toc,
      whoList,
      steps,
      reading,
      locations,
      footerCols,
      forWho,
      services: [
        'Connect you with a trained interventionist',
        'Match your loved one to a rehab centre',
        'Help plan the conversation and next steps',
        'Free, confidential guidance — 24/7',
      ],
      sent,
      notSent: !sent,
      submit: (e) => {
        e.preventDefault();
        this.setState({ sent: true });
      },
      showToc: !narrow && (this.props.showToc ?? true),
      heroCols: mid ? '1fr' : '1.05fr .95fr',
      h1Size: mobile ? '44px' : '64px',
      articleCols: narrow || !(this.props.showToc ?? true) ? '1fr' : '260px minmax(0,1fr)',
      splitCols: mid ? '1fr' : '1.15fr .85fr',
      splitColsRev: mid ? '1fr' : '.85fr 1.15fr',
      imgOrder: mid ? '2' : '0',
      stepCols: mobile ? '1fr' : '52px 1fr',
      ctaCols: mid ? '1fr' : '1.4fr .6fr',
      readCols: mobile ? '1fr' : mid ? 'repeat(2,1fr)' : 'repeat(3,1fr)',
      provCols: mobile ? '1fr' : mid ? 'repeat(2,1fr)' : narrow ? 'repeat(3,1fr)' : 'repeat(4,1fr)',
      helpCols: mid ? '1fr' : '1.1fr .9fr',
      helpPad: mobile ? '40px 24px' : '64px 56px',
      fieldCols: mobile ? '1fr' : '1fr 1fr',
      footCols: mobile ? '1fr' : mid ? '1fr 1fr' : '1.3fr 1fr 1fr 1fr',
    };
  }
}

/* ───────────────────────── markup ───────────────────────── */
function template(v) {
  const {
    articleCols,
    ctaCols,
    fieldCols,
    footCols,
    footerCols,
    forWho,
    h1Size,
    helpCols,
    helpPad,
    heroCols,
    iconCheck,
    iconClock,
    iconPhone,
    iconShield,
    imgOrder,
    locations,
    notSent,
    provCols,
    readCols,
    reading,
    sent,
    services,
    showToc,
    splitCols,
    splitColsRev,
    stepCols,
    steps,
    submit,
    toc,
    whoList,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="intervention" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        <section
          data-screen-label="Hero"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(1000px 520px at 85% -10%,#dbeefb 0%,rgba(219,238,251,0) 60%),#f7fafd',
            borderBottom: '1px solid #e9eff5',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '36px 32px 0' }} data-rc-wrap="1">
            <nav
              aria-label="Breadcrumb"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                color: '#6b7f95',
                flexWrap: 'wrap',
              }}
            >
              <$A className="scp0" href="/" style={{ color: '#6b7f95' }}>
                Home
              </$A>
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRight: '1.5px solid #b7c7d8',
                  borderTop: '1.5px solid #b7c7d8',
                  transform: 'rotate(45deg)',
                }}
              />
              <span style={{ color: '#10233a', fontWeight: '500' }}>Intervention</span>
            </nav>
          </div>
          <div
            style={$css(
              `max-width:1280px;margin:0 auto;padding:40px 32px 72px;display:grid;grid-template-columns:${heroCols ?? ''};gap:56px;align-items:center`,
            )}
            data-rc-dyn="1"
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
                Intervention services · Canada-wide
              </span>
              <h1 style={$css(`font-size:${h1Size ?? ''};line-height:1.04;color:#10233a`)}>Intervention</h1>
              <p style={{ fontSize: '19px', lineHeight: '1.6', color: '#516378' }}>
                One of the tragic realities of{' '}
                <$A href="https://addictionrehabcenters.ca/understanding-addiction-to-drugs/">drug addiction</$A> is
                that addicts are often the last to know that they have a problem. And by then, it may be too late. The
                loved ones of addicts are frequently terrified about what will happen next, and rightly so.
              </p>
              <p style={{ fontSize: '17px', lineHeight: '1.6', color: '#516378' }}>
                Interventions are staged in order to grab the attention of an addict, convince him or her to seek help,
                and establish clear consequences for a refusal to pursue professional help.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                <$A
                  className="scp1"
                  href="https://addictionrehabcenters.ca/rehab/"
                  style={{
                    font: '600 17px Jost,sans-serif',
                    color: '#fff',
                    background: '#0890E8',
                    padding: '15px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 24px -12px rgba(8,144,232,.6)',
                  }}
                >
                  Find A Drug Rehab
                </$A>
                <$A
                  className="scp2"
                  href="tel:+18558854747"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    font: '600 17px Jost,sans-serif',
                    color: '#10233a',
                    background: '#fff',
                    border: '1px solid #dbe6f0',
                    padding: '15px 24px',
                    borderRadius: '12px',
                  }}
                >
                  {$i(iconPhone)}
                  1-855-885-4747
                </$A>
              </div>
            </div>
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                style={{
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 40px 80px -40px rgba(16,35,58,.45)',
                  aspectRatio: '4/3',
                  background: '#dfeaf3',
                }}
              >
                <img
                  src="https://addictionrehabcenters.ca/wp-content/uploads/2022/02/addicted-to-benzodiazepine.jpg"
                  alt="A family gathered for an intervention"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div
                style={{
                  background: '#10233a',
                  color: '#fff',
                  borderRadius: '18px',
                  padding: '20px 22px',
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr',
                  gap: '18px',
                  alignItems: 'center',
                  boxShadow: '0 20px 40px -24px rgba(16,35,58,.6)',
                }}
                data-cols="auto 1fr"
              >
                <div
                  style={{ font: '600 44px/1 Jost,sans-serif', color: '#7cc4f5', fontVariantNumeric: 'tabular-nums' }}
                >
                  2×
                </div>
                <p style={{ fontSize: '14.5px', lineHeight: '1.5', color: '#d9e6f2' }}>
                  <strong style={{ color: '#fff' }}>
                    Addiction-related deaths have more than doubled since the 1980s
                  </strong>
                  , with about a quarter of deaths now directly attributable to some form of addiction.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="Article" style={{ background: '#fff' }}>
          <div
            style={$css(
              `max-width:1280px;margin:0 auto;padding:72px 32px;display:grid;grid-template-columns:${articleCols ?? ''};gap:56px;align-items:start`,
            )}
            data-rc-dyn="1"
          >
            {showToc ? (
              <>
                <aside
                  style={{ position: 'sticky', top: '130px', display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '18px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: '0 30px 60px -45px rgba(16,35,58,.35)',
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
                      How we help
                    </span>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {$list(services).map((sv, $index) => (
                        <Fragment key={$index}>
                          <li
                            style={{
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'flex-start',
                              fontSize: '14px',
                              lineHeight: '1.45',
                              color: '#3b4d63',
                            }}
                          >
                            <span
                              style={{
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: '#0890E8',
                                color: '#fff',
                                display: 'grid',
                                placeItems: 'center',
                                font: '700 10px Jost,sans-serif',
                                flexShrink: '0',
                                marginTop: '1px',
                              }}
                            >
                              ✓
                            </span>
                            {$i(sv)}
                          </li>
                        </Fragment>
                      ))}
                    </ul>
                    <$A
                      className="scp1"
                      href="#help"
                      style={{
                        display: 'inline-flex',
                        justifyContent: 'center',
                        font: '600 15px Jost,sans-serif',
                        color: '#fff',
                        background: '#0890E8',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        marginTop: '2px',
                      }}
                    >
                      Request a call back
                    </$A>
                  </div>
                  <div
                    style={{
                      background: '#f7fafd',
                      border: '1px solid #e3ecf4',
                      borderRadius: '18px',
                      padding: '20px',
                    }}
                  >
                    {' '}
                    <span
                      style={{
                        font: '600 11.5px Figtree,sans-serif',
                        letterSpacing: '.12em',
                        textTransform: 'uppercase',
                        color: '#6b7f95',
                      }}
                    >
                      Guide
                    </span>{' '}
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '12px' }}>
                      {$list(toc).map((t, $index) => (
                        <Fragment key={$index}>
                          <li>
                            <$A
                              className="scp1j"
                              href={t?.href}
                              style={$css(
                                `display:block;font:500 14px Figtree,sans-serif;color:${t?.color ?? ''};padding:8px 10px;border-radius:8px;border-left:2px solid ${t?.bar ?? ''};line-height:1.35;transition:all .15s`,
                              )}
                            >
                              {$i(t?.label)}
                            </$A>
                          </li>
                        </Fragment>
                      ))}
                    </ul>
                  </div>
                  <div
                    style={{
                      background: 'linear-gradient(160deg,#0f5fa8,#0890E8)',
                      borderRadius: '18px',
                      padding: '22px',
                      color: '#fff',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <span
                      style={{
                        font: '500 11.5px Figtree,sans-serif',
                        letterSpacing: '.14em',
                        textTransform: 'uppercase',
                        opacity: '.85',
                      }}
                    >
                      Talk to a specialist
                    </span>
                    <h3 style={{ fontSize: '19px', color: '#fff', lineHeight: '1.25' }}>Need an interventionist?</h3>
                    <p style={{ fontSize: '13.5px', lineHeight: '1.5', opacity: '.9' }}>
                      We can connect you with a rehab centre that has trained interventionists on staff.
                    </p>
                    <$A
                      className="scp5"
                      href="tel:+18558854747"
                      style={{
                        display: 'inline-flex',
                        justifyContent: 'center',
                        font: '600 15px Jost,sans-serif',
                        color: '#0f5fa8',
                        background: '#fff',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        marginTop: '4px',
                      }}
                    >
                      Call 1-855-885-4747
                    </$A>
                  </div>
                </aside>
              </>
            ) : null}
            <article style={{ display: 'flex', flexDirection: 'column', gap: '64px', minWidth: '0' }}>
              <div
                id="what"
                style={$css(`display:grid;grid-template-columns:${splitCols ?? ''};gap:40px;align-items:center`)}
                data-rc-dyn="1"
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '34px', lineHeight: '1.12' }} data-rc-lg="1">
                    What is an Intervention?
                  </h2>
                  <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                    Addiction often begins with peer pressure to try alcohol or drugs. Interventions attempt to harness
                    the power of peer pressure to achieve something more positive. During an intervention,{' '}
                    <strong>the people closest to the individual describe how the addiction has affected them</strong>.
                    They appeal to the addict to seek help, and state the consequences to the relationship if help is
                    not accepted. For example, a wife might talk about how her husband's addiction has affected their
                    children, and state that she will file for divorce if he is unwilling to seek help.
                  </p>
                  <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                    Interventions are controversial, because they corner a vulnerable person who may not react in
                    predictable ways. Some families fear that an intervention will destroy their relationship with the
                    addict, or that the addict will respond with violence or destruction of property.
                  </p>
                  <div
                    style={{
                      background: '#eaf5fd',
                      border: '1px solid #d5e8f7',
                      borderRadius: '16px',
                      padding: '18px 20px',
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'flex-start',
                    }}
                  >
                    <span style={{ color: '#0890E8', flexShrink: '0', marginTop: '2px' }}>{$i(iconCheck)}</span>
                    <p style={{ font: '500 15.5px/1.6 Figtree,sans-serif', color: '#10233a' }}>
                      Research shows that, when done properly, <strong>interventions work</strong> — particularly for
                      addicts who have a history of relapse.
                    </p>
                  </div>
                </div>
                <div style={{ borderRadius: '22px', overflow: 'hidden', aspectRatio: '4/5', background: '#dfeaf3' }}>
                  <img
                    src="https://addictionrehabcenters.ca/wp-content/uploads/2022/02/benzodiazepine-prescribed.jpg"
                    alt="What is an intervention"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>
              <div id="planning" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: '#0890E8',
                    }}
                  >
                    Planning your intervention
                  </span>
                  <h2 style={{ fontSize: '34px', lineHeight: '1.12' }} data-rc-lg="1">
                    The Planning Stages
                  </h2>
                </div>
                <div
                  style={$css(`display:grid;grid-template-columns:${splitCols ?? ''};gap:40px;align-items:start`)}
                  data-rc-dyn="1"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                      The intervention should include only those people closest to the addict, who are fully committed
                      to getting the addict help. People who do not believe that addiction is a disease, who do not
                      think the addict needs treatment, or who have not been personally affected by the addiction, have
                      no place at the intervention. If you have any doubts about including someone in the intervention,
                      consider asking them how they plan to react if the addict chooses not to seek help.
                    </p>
                    <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                      Ideally, you should <strong>work with a trained interventionist</strong> who is not personally
                      invested in the outcome, and who has the professional training to bring order to the procedure. In
                      many cases, the presence of an expert who is seen as an authority figure will encourage a volatile
                      addict to stick around.
                    </p>
                    <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                      You should plan each and every step of the intervention prior to diving in, to minimize the risk
                      of unexpected developments or an angry outburst by the addict.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div
                      style={{ borderRadius: '22px', overflow: 'hidden', aspectRatio: '4/3', background: '#dfeaf3' }}
                    >
                      <img
                        src="https://addictionrehabcenters.ca/wp-content/uploads/2022/02/Planning-Your-Intervention.jpg"
                        alt="Planning your intervention"
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    </div>
                    <div
                      style={{
                        background: '#f7fafd',
                        border: '1px solid #e3ecf4',
                        borderRadius: '18px',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
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
                        Who should be in the room
                      </span>
                      <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {$list(whoList).map((wl, $index) => (
                          <Fragment key={$index}>
                            <li
                              style={{
                                display: 'flex',
                                gap: '10px',
                                alignItems: 'flex-start',
                                fontSize: '14px',
                                lineHeight: '1.45',
                                color: '#3b4d63',
                              }}
                            >
                              <span
                                style={$css(
                                  `width:18px;height:18px;border-radius:50%;background:${wl?.bg ?? ''};color:#fff;display:grid;place-items:center;font:700 11px Jost,sans-serif;flex-shrink:0;margin-top:1px`,
                                )}
                              >
                                {$i(wl?.mark)}
                              </span>
                              {$i(wl?.text)}
                            </li>
                          </Fragment>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="location"
                style={$css(`display:grid;grid-template-columns:${splitColsRev ?? ''};gap:40px;align-items:center`)}
                data-rc-dyn="1"
              >
                <div
                  style={$css(
                    `border-radius:22px;overflow:hidden;aspect-ratio:4/3;background:#dfeaf3;order:${imgOrder ?? ''}`,
                  )}
                >
                  <img
                    src="https://addictionrehabcenters.ca/wp-content/uploads/2022/02/Intervention-Location-and-Setup.jpg"
                    alt="Intervention location and setup"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '34px', lineHeight: '1.12' }} data-rc-lg="1">
                    Intervention Location and Setup
                  </h2>
                  <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                    In almost all cases, the intervention should be staged without prior knowledge on the part of the
                    addict. This guarantees the individual's presence, and the element of surprise can encourage him or
                    her to stay, if for no other reason than to satisfy his or her curiosity.
                  </p>
                  <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                    Select a location that is comfortable and safe. Avoid places where there is little privacy, or where
                    children or loud pets have to be sequestered in another room. Have basic comforts like water and
                    snacks on hand, and make sure the room is at a comfortable temperature.
                  </p>
                  <blockquote
                    style={{
                      margin: '0',
                      padding: '18px 22px',
                      borderLeft: '3px solid #0890E8',
                      background: '#f7fafd',
                      borderRadius: '0 16px 16px 0',
                      font: '500 17px/1.55 Jost,sans-serif',
                      color: '#10233a',
                    }}
                  >
                    The goal of an intervention is to make the addict uncomfortable with his or her choices — not just
                    generally uncomfortable!
                  </blockquote>
                </div>
              </div>
              <div id="procedure" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '720px' }}>
                  <span
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: '#0890E8',
                    }}
                  >
                    Step by step
                  </span>
                  <h2 style={{ fontSize: '34px', lineHeight: '1.12' }} data-rc-lg="1">
                    The Intervention Procedure
                  </h2>
                  <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                    Effective interventions follow a very specific protocol. Talk to your interventionist if you have
                    any questions, and remember that each situation is different.{' '}
                    <strong>Rely upon your interventionist's experience, training, and wisdom</strong> if she or he
                    recommends a different procedure.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {$list(steps).map((st, $index) => (
                    <Fragment key={$index}>
                      <div
                        className="scp1k"
                        style={$css(
                          `display:grid;grid-template-columns:${stepCols ?? ''};gap:20px;align-items:start;background:#f7fafd;border:1px solid #e3ecf4;border-radius:20px;padding:24px;transition:border-color .2s,box-shadow .2s`,
                        )}
                        data-rc-dyn="1"
                      >
                        <span
                          style={{
                            width: '52px',
                            height: '52px',
                            borderRadius: '50%',
                            background: '#0890E8',
                            color: '#fff',
                            display: 'grid',
                            placeItems: 'center',
                            font: '600 17px Jost,sans-serif',
                          }}
                        >
                          {$i(st?.n)}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <h3 style={{ fontSize: '20px' }}>{$i(st?.title)}</h3>
                          <p style={{ fontSize: '15.5px', lineHeight: '1.65', color: '#3b4d63' }}>{$i(st?.body)}</p>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div
                  style={$css(`display:grid;grid-template-columns:${splitCols ?? ''};gap:24px;align-items:center`)}
                  data-rc-dyn="1"
                >
                  <div
                    style={{ borderRadius: '22px', overflow: 'hidden', aspectRatio: '16/10', background: '#dfeaf3' }}
                  >
                    <img
                      src="https://addictionrehabcenters.ca/wp-content/uploads/2022/02/Discussing-the-effects-of-the-addiction.jpg"
                      alt="Discussing the effects of the addiction"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                    From there, it is up to the addict to decide whether or not to accept treatment. You should not
                    argue with the addict or become angry; simply listen to his or her thoughts, and calmly move
                    forward. Recognize that no addict can be forced to get clean; your loved one will only pursue
                    sobriety when he or she is fully ready.
                  </p>
                </div>
              </div>
              <div style={$css(`display:grid;grid-template-columns:${splitCols ?? ''};gap:16px`)} data-rc-dyn="1">
                <div
                  id="after"
                  style={{
                    background: '#f7fafd',
                    border: '1px solid #e3ecf4',
                    borderRadius: '22px',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
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
                    {$i(iconClock)}
                  </span>
                  <h2 style={{ fontSize: '26px', lineHeight: '1.15' }}>After the Intervention</h2>
                  <p style={{ fontSize: '15.5px', lineHeight: '1.65', color: '#3b4d63' }}>
                    All you can do after the intervention is wait and hope that the intervention has worked.{' '}
                    <strong>Many addicts initially decline treatment</strong>, but subsequently change their minds.
                    Don't lose hope, but remember that you can be happy and whole even if your loved one refuses help.
                  </p>
                </div>
                <div
                  id="fail"
                  style={{
                    background: '#10233a',
                    color: '#fff',
                    borderRadius: '22px',
                    padding: '28px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <span
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,.1)',
                      color: '#7cc4f5',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    {$i(iconShield)}
                  </span>
                  <h2 style={{ fontSize: '26px', lineHeight: '1.15', color: '#fff' }}>
                    What if the Intervention Doesn't Work?
                  </h2>
                  <p style={{ fontSize: '15.5px', lineHeight: '1.65', color: '#b7c7d8' }}>
                    Not all interventions work, but for the addict to have any chance of recovering, you must adhere to
                    the consequences you stipulated for refusal of help. Going back on what you said during the
                    intervention will enable the individual to continue with his or her addiction.{' '}
                    <strong style={{ color: '#fff' }}>
                      Ultimately, the purpose of an intervention is to make staying addicted seem like the more
                      difficult choice than seeking help.
                    </strong>{' '}
                    Therefore, it is imperative that loved ones do not make it easy for the addict to avoid treatment.
                  </p>
                </div>
              </div>
              <div
                style={$css(
                  `background:linear-gradient(135deg,#0f5fa8,#0890E8);border-radius:24px;padding:40px;color:#fff;display:grid;grid-template-columns:${ctaCols ?? ''};gap:28px;align-items:center;position:relative;overflow:hidden`,
                )}
                data-rc-dyn="1"
              >
                <div
                  style={{
                    position: 'absolute',
                    right: '-100px',
                    top: '-100px',
                    width: '320px',
                    height: '320px',
                    borderRadius: '50%',
                    border: '60px solid rgba(255,255,255,.08)',
                  }}
                />
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <h2 style={{ fontSize: '30px', lineHeight: '1.15', color: '#fff' }}>
                    We can help you find a rehab centre with trained interventionists
                  </h2>
                  <p style={{ fontSize: '15.5px', lineHeight: '1.6', opacity: '.92' }}>
                    If you have a loved one struggling with an addiction,{' '}
                    <strong style={{ color: '#fff' }}>Addiction Rehab Centres Canada</strong> can help you find a rehab
                    centre that has trained interventionists.
                  </p>
                </div>
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <$A
                    className="scp5"
                    href="/contact"
                    style={{
                      display: 'inline-flex',
                      justifyContent: 'center',
                      font: '600 16px Jost,sans-serif',
                      color: '#0f5fa8',
                      background: '#fff',
                      padding: '14px 20px',
                      borderRadius: '12px',
                    }}
                  >
                    Contact Us Today
                  </$A>
                  <$A
                    className="scp9"
                    href="tel:+18558854747"
                    style={{
                      display: 'inline-flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '8px',
                      font: '600 16px Jost,sans-serif',
                      color: '#fff',
                      border: '1.5px solid rgba(255,255,255,.4)',
                      padding: '13px 20px',
                      borderRadius: '12px',
                    }}
                  >
                    {$i(iconPhone)}
                    1-855-885-4747
                  </$A>
                </div>
              </div>
              <div id="reading" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <h2 style={{ fontSize: '26px', lineHeight: '1.15' }}>Further Reading</h2>
                <div style={$css(`display:grid;grid-template-columns:${readCols ?? ''};gap:10px`)} data-rc-dyn="1">
                  {$list(reading).map((rd, $index) => (
                    <Fragment key={$index}>
                      <$A
                        className="scp1l"
                        href={rd?.href}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          background: '#f7fafd',
                          border: '1px solid #e3ecf4',
                          borderRadius: '14px',
                          padding: '14px 16px',
                          font: '500 14.5px Figtree,sans-serif',
                          color: '#1f3550',
                          transition: 'all .18s',
                        }}
                      >
                        {$i(rd?.label)}
                        <span
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRight: '1.5px solid #0890E8',
                            borderTop: '1.5px solid #0890E8',
                            transform: 'rotate(45deg)',
                            flexShrink: '0',
                          }}
                        />
                      </$A>
                    </Fragment>
                  ))}
                </div>
              </div>
            </article>
          </div>
        </section>
        <section
          data-screen-label="Call strip"
          style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5', borderBottom: '1px solid #e9eff5' }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '28px 32px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px 28px',
              textAlign: 'center',
            }}
            data-rc-wrap="1"
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                font: '500 17px Jost,sans-serif',
                color: '#10233a',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#2fb46b',
                  animation: 'pulseDot 2s infinite',
                }}
              />
              Talk To One Of Our Specialists By Calling
            </span>
            <$A className="scpa" href="tel:+18558854747" style={{ font: '600 24px Jost,sans-serif', color: '#0890E8' }}>
              1-855-885-4747
            </$A>
          </div>
        </section>
        <section data-screen-label="Provinces" style={{ background: '#fff' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 32px' }} data-rc-wrap="1">
            <div style={{ maxWidth: '640px', marginBottom: '32px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Across Canada
              </span>
              <h2 style={{ fontSize: '36px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                Drug Rehab Centres By Provinces
              </h2>
            </div>
            <div style={$css(`display:grid;grid-template-columns:${provCols ?? ''};gap:10px`)} data-rc-dyn="1">
              {$list(locations).map((lc, $index) => (
                <Fragment key={$index}>
                  <$A
                    className="scp1m"
                    href={lc?.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: '#f7fafd',
                      border: '1px solid #e3ecf4',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      color: '#1f3550',
                      font: '500 14.5px Figtree,sans-serif',
                      transition: 'all .18s',
                    }}
                  >
                    <span
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: '#eaf5fd',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                        font: '600 12px Jost,sans-serif',
                        flexShrink: '0',
                      }}
                    >
                      {$i(lc?.code)}
                    </span>
                    {$i(lc?.label)}
                  </$A>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section
          id="help"
          data-screen-label="Let us help"
          style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 32px 0' }} data-rc-wrap="1">
            <div
              style={$css(
                `background:linear-gradient(135deg,#0f5fa8,#0890E8);border-radius:30px 30px 0 0;padding:${helpPad ?? ''};color:#fff;display:grid;grid-template-columns:${helpCols ?? ''};gap:48px;align-items:center;position:relative;overflow:hidden`,
              )}
              data-rc-dyn="1"
            >
              <div
                style={{
                  position: 'absolute',
                  right: '-120px',
                  top: '-120px',
                  width: '420px',
                  height: '420px',
                  borderRadius: '50%',
                  border: '80px solid rgba(255,255,255,.07)',
                }}
              />
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <span
                  style={{
                    font: '500 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    opacity: '.85',
                  }}
                >
                  Let Us Help You
                </span>
                <h2 style={{ fontSize: '40px', lineHeight: '1.1', color: '#fff' }} data-rc-lg="1">
                  Is this for yourself or a loved one?
                </h2>
                <p style={{ fontSize: '17px', lineHeight: '1.55', opacity: '.92', maxWidth: '520px' }}>
                  Tell us a little about the situation and a specialist will call you back — discreetly, at a time that
                  works for you.
                </p>
              </div>
              {notSent ? (
                <>
                  <form
                    onSubmit={submit}
                    style={{
                      position: 'relative',
                      background: '#fff',
                      borderRadius: '22px',
                      padding: '26px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      color: '#10233a',
                      boxShadow: '0 40px 80px -40px rgba(16,35,58,.6)',
                    }}
                  >
                    <div style={{ font: '600 19px Jost,sans-serif' }}>Request a call back</div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '8px',
                        background: '#f7fafd',
                        border: '1px solid #dbe6f0',
                        borderRadius: '12px',
                        padding: '6px',
                      }}
                      data-cols="1fr 1fr"
                    >
                      {$list(forWho).map((fw, $index) => (
                        <Fragment key={$index}>
                          <button
                            type="button"
                            onClick={fw?.pick}
                            style={$css(
                              `appearance:none;cursor:pointer;border:0;border-radius:9px;padding:11px;font:600 14px Figtree,sans-serif;background:${fw?.bg ?? ''};color:${fw?.color ?? ''};transition:all .18s`,
                            )}
                          >
                            {$i(fw?.label)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div style={$css(`display:grid;grid-template-columns:${fieldCols ?? ''};gap:10px`)} data-rc-dyn="1">
                      <input
                        required
                        name="name"
                        placeholder="Full name"
                        style={{
                          border: '1px solid #dbe6f0',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          font: '500 14px Figtree,sans-serif',
                          outline: 'none',
                          width: '100%',
                        }}
                      />
                      <input
                        required
                        type="tel"
                        name="phone"
                        placeholder="Phone number"
                        style={{
                          border: '1px solid #dbe6f0',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          font: '500 14px Figtree,sans-serif',
                          outline: 'none',
                          width: '100%',
                        }}
                      />
                    </div>
                    <div style={$css(`display:grid;grid-template-columns:${fieldCols ?? ''};gap:10px`)} data-rc-dyn="1">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email (optional)"
                        style={{
                          border: '1px solid #dbe6f0',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          font: '500 14px Figtree,sans-serif',
                          outline: 'none',
                          width: '100%',
                        }}
                      />
                      <select
                        name="province"
                        style={{
                          border: '1px solid #dbe6f0',
                          borderRadius: '10px',
                          padding: '12px 14px',
                          font: '500 14px Figtree,sans-serif',
                          outline: 'none',
                          background: '#fff',
                          color: '#10233a',
                          width: '100%',
                        }}
                      >
                        <option>Province</option>
                        <option>Alberta</option>
                        <option>British Columbia</option>
                        <option>Manitoba</option>
                        <option>New Brunswick</option>
                        <option>Newfoundland and Labrador</option>
                        <option>Northwest Territories</option>
                        <option>Nova Scotia</option>
                        <option>Nunavut</option>
                        <option>Ontario</option>
                        <option>Prince Edward Island</option>
                        <option>Quebec</option>
                        <option>Saskatchewan</option>
                        <option>Yukon</option>
                      </select>
                    </div>
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
                        padding: '14px',
                        borderRadius: '12px',
                        marginTop: '4px',
                      }}
                    >
                      Submit
                    </button>
                    <p style={{ fontSize: '12px', color: '#6b7f95', lineHeight: '1.5', textAlign: 'center' }}>
                      Confidential — we never leave details in a voicemail.{' '}
                      <$A href="https://addictionrehabcenters.ca/terms-of-use/">Terms</$A> ·{' '}
                      <$A href="https://addictionrehabcenters.ca/privacy-policy/">Privacy</$A>
                    </p>
                  </form>
                </>
              ) : null}
              {sent ? (
                <>
                  <div
                    style={{
                      position: 'relative',
                      background: '#fff',
                      borderRadius: '22px',
                      padding: '32px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      color: '#10233a',
                      boxShadow: '0 40px 80px -40px rgba(16,35,58,.6)',
                      animation: 'fadeUp .25s ease-out',
                    }}
                  >
                    <span
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: '#2fb46b',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          width: '16px',
                          height: '9px',
                          borderLeft: '2.5px solid #fff',
                          borderBottom: '2.5px solid #fff',
                          transform: 'rotate(-45deg)',
                          marginTop: '-4px',
                        }}
                      />
                    </span>
                    <h3 style={{ fontSize: '24px' }}>Thanks — we'll call you shortly.</h3>
                    <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#516378' }}>
                      A specialist will reach out at the number you provided. If you'd rather talk now, the helpline is
                      open 24/7.
                    </p>
                    <$A
                      className="scp1"
                      href="tel:+18558854747"
                      style={{
                        alignSelf: 'flex-start',
                        font: '600 15px Jost,sans-serif',
                        color: '#fff',
                        background: '#0890E8',
                        padding: '12px 18px',
                        borderRadius: '10px',
                      }}
                    >
                      Call 1-855-885-4747
                    </$A>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </section>
        <footer data-screen-label="Footer" style={{ background: '#10233a', color: '#b7c7d8', marginTop: 'auto' }}>
          <div
            style={$css(
              `max-width:1280px;margin:0 auto;padding:72px 32px 32px;display:grid;grid-template-columns:${footCols ?? ''};gap:48px`,
            )}
            data-rc-dyn="1"
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
  '\nhtml,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;scroll-behavior:smooth}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\nstrong{color:#10233a;font-weight:600}\ninput,select{font-family:Figtree,Helvetica,Arial,sans-serif}\ninput:focus,select:focus{border-color:#0890E8!important;box-shadow:0 0 0 3px rgba(8,144,232,.15)}\n@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(47,180,107,.45)}70%{box-shadow:0 0 0 10px rgba(47,180,107,0)}}\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important}}\n';
export const css = [ownCss, SiteHeader_css].filter(Boolean).join('\n');
export const defaults = { showToc: true };
const View = createDC('Intervention', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} {...props} />;
}
