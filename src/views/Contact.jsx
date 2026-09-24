'use client';
// Generated from Contact.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = { menu: null, topic: 0, sent: false, faq: 0, w: 1280 };
  componentDidMount() {
    this._ro = new ResizeObserver(() => {
      const w = document.documentElement.clientWidth;
      if (Math.abs(w - this.state.w) > 8) this.setState({ w });
    });
    this._ro.observe(document.documentElement);
    this.setState({ w: document.documentElement.clientWidth });
  }
  componentWillUnmount() {
    this._ro && this._ro.disconnect();
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
    const { menu, topic, sent, faq, w } = this.state;
    const narrow = w < 1000,
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
      heart: this.icon(['M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z']),
      phone: this.icon(['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z']),
      mail: this.icon([{ t: 'rect', a: { x: 3, y: 5, width: 18, height: 14, rx: 2 } }, 'M3 7l9 6 9-6']),
      chat: this.icon(['M21 12a8 8 0 0 1-8 8H6l-3 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z', 'M8 12h8', 'M8 9h5']),
      person: this.icon([{ t: 'circle', a: { cx: 12, cy: 8, r: 4 } }, 'M4 21a8 8 0 0 1 16 0']),
      building: this.icon([
        { t: 'rect', a: { x: 4, y: 3, width: 16, height: 18, rx: 2 } },
        'M9 7h2',
        'M13 7h2',
        'M9 11h2',
        'M13 11h2',
        'M9 15h2',
        'M13 15h2',
        'M10 21v-3h4v3',
      ]),
      clock: this.icon([{ t: 'circle', a: { cx: 12, cy: 12, r: 9 } }, 'M12 7v5l3 2']),
      search: this.icon([{ t: 'circle', a: { cx: 11, cy: 11, r: 6 } }, 'M20 20l-4-4']),
      doc: this.icon([{ t: 'rect', a: { x: 5, y: 3, width: 14, height: 18, rx: 2 } }, 'M9 8h6', 'M9 12h6', 'M9 16h4']),
      star: this.icon(['M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z']),
      alert: this.icon(['M12 3l10 18H2L12 3z', 'M12 10v4', 'M12 17.5v.5']),
      maple: this.icon(
        [
          'M12 3l1.8 3.5 3.2-1-1 3.5 3.5 1.5-3 2.5 2 3-4-.5-.5 3.5-2-2.5-2 2.5-.5-3.5-4 .5 2-3-3-2.5 3.5-1.5-1-3.5 3.2 1z',
        ],
        { strokeWidth: 1.4 },
      ),
    };

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

    // ---- Contact page data ----
    const email = this.props.email ?? 'info@addictionrehabcenters.ca';
    const channels = [
      {
        label: 'Call the helpline',
        value: '1-855-885-4747',
        note: 'Free, confidential, 24 hours a day, 7 days a week.',
        href: 'tel:+18558854747',
        icon: ic.phone,
        iconBg: '#0890E8',
        iconColor: '#fff',
      },
      {
        label: 'Email us',
        value: email,
        note: 'Best for listings, partnerships and general questions.',
        href: 'mailto:' + email,
        icon: ic.mail,
        iconBg: '#eaf5fd',
        iconColor: '#0890E8',
      },
      {
        label: 'Send a message',
        value: 'Use the form below',
        note: 'Tell us what you need and we reply within one business day.',
        href: '#message',
        icon: ic.chat,
        iconBg: '#eaf5fd',
        iconColor: '#0890E8',
      },
    ];
    const topicDefs = [
      {
        label: 'Help for me or a loved one',
        sub: 'Treatment options, costs, next steps',
        icon: ic.heart,
        ph: 'Tell us a little about the situation — who needs help, where you are, and what kind of support you\u2019re looking for. Share only what you\u2019re comfortable with.',
        urgent: true,
      },
      {
        label: 'Treatment centre listing',
        sub: 'Claim, update or promote a centre',
        icon: ic.building,
        ph: 'Which centre is this about, and what would you like to change or add?',
        org: 'Centre name',
        orgPh: 'e.g. Rose City Recovery',
      },
      {
        label: 'Therapist profile',
        sub: 'Join, verify or edit a profile',
        icon: ic.person,
        ph: 'Tell us your designation and province, and what you need help with.',
        org: 'Practice or designation',
        orgPh: 'e.g. Jane Doe, RP (CRPO)',
      },
      {
        label: 'Media, research or other',
        sub: 'Press, data requests, feedback',
        icon: ic.doc,
        ph: 'How can we help?',
        org: 'Organization',
        orgPh: 'e.g. CBC News',
      },
    ];
    const topics = topicDefs.map((t, i) => {
      const on = topic === i;
      return {
        label: t.label,
        sub: t.sub,
        icon: t.icon,
        pick: () => this.setState({ topic: i }),
        bg: on ? '#eaf5fd' : '#fff',
        border: on ? '#0890E8' : '#e3ecf4',
        iconBg: on ? '#0890E8' : '#f1f6fb',
        iconColor: on ? '#fff' : '#516378',
      };
    });
    const cur = topicDefs[topic];
    const details = [
      {
        label: 'Helpline',
        value: '1-855-885-4747',
        note: 'Toll-free across Canada · 24/7',
        href: 'tel:+18558854747',
        icon: ic.phone,
      },
      { label: 'Email', value: email, note: 'Monitored Monday to Friday', href: 'mailto:' + email, icon: ic.mail },
      {
        label: 'Centres & partners',
        value: 'Promote your centre',
        note: 'Plans, featured placement and claims',
        href: '/promote',
        icon: ic.building,
      },
      {
        label: 'Serving',
        value: 'All provinces and territories',
        note: 'Canada-wide directory',
        href: B,
        icon: ic.maple,
      },
    ];
    const sla = [
      ['Helpline call', 'Answered live, 24/7', '#2fb46b'],
      ['Message about treatment', 'Same day', '#0890E8'],
      ['Listing or profile request', '1 business day', '#0890E8'],
      ['Media & other', '2 business days', '#516378'],
    ].map(([label, value, color]) => ({ label, value, color }));
    const quickPaths = [
      {
        icon: ic.search,
        title: 'Find a rehab near you',
        body: 'Browse verified treatment centres by province and city, with programs, photos and reviews.',
        cta: 'Search centres',
        href: B + 'rehab/search/',
      },
      {
        icon: ic.person,
        title: 'Find a therapist',
        body: 'Registered psychotherapists, psychologists and addiction counsellors — in person or online.',
        cta: 'Browse therapists',
        href: '/therapists',
      },
      {
        icon: ic.building,
        title: 'List or promote a centre',
        body: 'Claim your free listing or compare Extended and Sponsored plans to reach more families.',
        cta: 'See plans',
        href: '/promote',
      },
      {
        icon: ic.doc,
        title: 'Read the FAQ',
        body: 'Costs, coverage, how long treatment takes and what to expect on day one.',
        cta: 'Common questions',
        href: B + 'faqs/',
      },
    ];
    const expect = [
      ['01', 'We listen', 'You talk, we listen. No forms to fill, no judgement — just tell us what\u2019s going on.'],
      [
        '02',
        'We ask a few questions',
        'Substance, location, budget, timing. Enough to narrow things down, nothing more.',
      ],
      [
        '03',
        'We give you options',
        'Two or three programs that genuinely fit, and why. You decide — there\u2019s no fee and no obligation.',
      ],
      [
        '04',
        'We stay in touch',
        'If you want, we\u2019ll follow up and help with admissions, travel or talking to family.',
      ],
    ].map(([n, title, body]) => ({ n, title, body }));
    const faqData = [
      [
        'Is the helpline really free?',
        'Yes. Calls are toll-free from anywhere in Canada and there is no charge for our guidance. We are not paid by the caller at any point.',
      ],
      [
        'Is my information confidential?',
        'Completely. We never share your name or details with a treatment centre unless you ask us to make an introduction. Callbacks are discreet and we do not leave details in voicemails.',
      ],
      [
        'Can I contact you on behalf of a family member?',
        'Absolutely — many of our calls come from parents, partners and friends. We can explain the options, help you plan a conversation, and connect you with intervention support if needed.',
      ],
      [
        'I run a treatment centre. Who do I speak to?',
        'Choose “Treatment centre listing” in the form above or email us directly. We can claim or update your listing, correct details, or walk you through promoted placement.',
      ],
      [
        'Do you offer help in French?',
        'Oui. Our helpline can assist in English and French, and we list bilingual and French-language programs, particularly in Quebec, New Brunswick and Ontario.',
      ],
    ];
    const faqs = faqData.map(([question, answer], i) => ({
      question,
      answer,
      open: i === faq,
      toggle: () => this.setState({ faq: faq === i ? -1 : i }),
      border: i === faq ? '#0890E8' : '#e3ecf4',
      rot: i === faq ? 'rotate(45deg)' : 'rotate(0deg)',
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
      iconAlert: ic.alert,
      channels,
      topics,
      details,
      sla,
      quickPaths,
      expect,
      faqs,
      footerCols,
      showUrgent: !!cur.urgent && !sent,
      showOrg: !!cur.org,
      orgLabel: cur.org || '',
      orgPlaceholder: cur.orgPh || '',
      msgPlaceholder: cur.ph,
      sent,
      notSent: !sent,
      submit: (e) => {
        e.preventDefault();
        this.setState({ sent: true });
      },
      reset: () => this.setState({ sent: false }),
      heroCols: narrow ? '1fr' : '1.1fr .9fr',
      h1Size: mobile ? '40px' : narrow ? '48px' : '56px',
      cardCols: mobile ? '1fr' : narrow ? 'repeat(3,1fr)' : '1fr',
      formCols: narrow ? '1fr' : '1.15fr .85fr',
      topicCols: mobile ? '1fr' : 'repeat(2,1fr)',
      fieldCols: mobile ? '1fr' : '1fr 1fr',
      asidePos: narrow ? 'static' : 'sticky',
      pathCols: mobile ? '1fr' : narrow ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
      expectCols: narrow ? '1fr' : '.8fr 1.2fr',
      faqCols: narrow ? '1fr' : '.8fr 1.2fr',
      footCols: mobile ? '1fr' : narrow ? '1fr 1fr' : '1.3fr 1fr 1fr 1fr',
    };
  }
}

/* ───────────────────────── markup ───────────────────────── */
function template(v) {
  const {
    asidePos,
    cardCols,
    channels,
    details,
    expect,
    expectCols,
    faqCols,
    faqs,
    fieldCols,
    footCols,
    footerCols,
    formCols,
    h1Size,
    heroCols,
    iconAlert,
    iconPhone,
    msgPlaceholder,
    notSent,
    orgPlaceholder,
    pathCols,
    quickPaths,
    reset,
    sent,
    showOrg,
    showUrgent,
    sla,
    submit,
    topicCols,
    topics,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="more" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
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
              <span style={{ color: '#10233a', fontWeight: '500' }}>Contact Us</span>
            </nav>
          </div>
          <div
            style={$css(
              `max-width:1280px;margin:0 auto;padding:40px 32px 72px;display:grid;grid-template-columns:${heroCols ?? ''};gap:48px;align-items:end`,
            )}
            data-rc-dyn="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '640px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Contact us
              </span>
              <h1 style={$css(`font-size:${h1Size ?? ''};line-height:1.04;color:#10233a`)}>
                Talk to a real person, whenever you're ready.
              </h1>
              <p style={{ fontSize: '19px', lineHeight: '1.55', color: '#516378' }}>
                Whether you're looking for help for yourself or someone you love, run a treatment centre, or just have a
                question — we answer every call and every message.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                <$A
                  className="scp1"
                  href="tel:+18558854747"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    font: '600 17px Jost,sans-serif',
                    color: '#fff',
                    background: '#0890E8',
                    padding: '15px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 24px -12px rgba(8,144,232,.6)',
                  }}
                >
                  <span
                    style={{ display: 'flex', animation: 'ring 3s ease-in-out infinite', transformOrigin: '50% 20%' }}
                  >
                    {$i(iconPhone)}
                  </span>
                  Call 1-855-885-4747
                </$A>
                <$A
                  className="scp2"
                  href="#message"
                  style={{
                    font: '600 17px Jost,sans-serif',
                    color: '#10233a',
                    background: '#fff',
                    border: '1px solid #dbe6f0',
                    padding: '15px 24px',
                    borderRadius: '12px',
                  }}
                >
                  Send a message
                </$A>
              </div>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#6b7f95' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#2fb46b',
                    animation: 'pulseDot 2s infinite',
                  }}
                />
                Helpline open now · Free · Confidential · Canada-wide
              </p>
            </div>
            <div style={$css(`display:grid;grid-template-columns:${cardCols ?? ''};gap:12px`)} data-rc-dyn="1">
              {$list(channels).map((ch, $index) => (
                <Fragment key={$index}>
                  <$A
                    className="scp1a"
                    href={ch?.href}
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '20px',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      color: '#10233a',
                      transition: 'transform .2s,border-color .2s,box-shadow .2s',
                      minWidth: '0',
                    }}
                  >
                    <span
                      style={$css(
                        `width:42px;height:42px;border-radius:12px;background:${ch?.iconBg ?? ''};color:${ch?.iconColor ?? ''};display:grid;place-items:center`,
                      )}
                    >
                      {$i(ch?.icon)}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <span
                        style={{
                          font: '600 11.5px Figtree,sans-serif',
                          letterSpacing: '.1em',
                          textTransform: 'uppercase',
                          color: '#6b7f95',
                        }}
                      >
                        {$i(ch?.label)}
                      </span>
                      <span style={{ font: '600 17px Jost,sans-serif', wordBreak: 'break-word' }}>{$i(ch?.value)}</span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#516378', lineHeight: '1.45' }}>{$i(ch?.note)}</span>
                  </$A>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section
          id="message"
          data-screen-label="Message form"
          style={{ background: '#fff', borderBottom: '1px solid #e9eff5' }}
        >
          <div
            style={$css(
              `max-width:1280px;margin:0 auto;padding:80px 32px;display:grid;grid-template-columns:${formCols ?? ''};gap:56px;align-items:start`,
            )}
            data-rc-dyn="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span
                  style={{
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#0890E8',
                  }}
                >
                  Send a message
                </span>
                <h2 style={{ fontSize: '36px', lineHeight: '1.12' }} data-rc-lg="1">
                  What can we help with?
                </h2>
                <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#516378' }}>
                  Pick the option that fits and we'll route your message to the right person.
                </p>
              </div>
              <div style={$css(`display:grid;grid-template-columns:${topicCols ?? ''};gap:8px`)} data-rc-dyn="1">
                {$list(topics).map((tp, $index) => (
                  <Fragment key={$index}>
                    <button
                      className="scpj"
                      type="button"
                      onClick={tp?.pick}
                      style={$css(
                        `appearance:none;cursor:pointer;text-align:left;border:1.5px solid ${tp?.border ?? ''};background:${tp?.bg ?? ''};border-radius:14px;padding:14px 14px;display:flex;flex-direction:column;gap:8px;transition:all .18s;color:#10233a`,
                      )}
                    >
                      <span
                        style={$css(
                          `width:32px;height:32px;border-radius:9px;background:${tp?.iconBg ?? ''};color:${tp?.iconColor ?? ''};display:grid;place-items:center`,
                        )}
                      >
                        {$i(tp?.icon)}
                      </span>
                      <span style={{ font: '600 14.5px Jost,sans-serif', lineHeight: '1.25' }}>{$i(tp?.label)}</span>
                      <span style={{ fontSize: '12.5px', color: '#6b7f95', lineHeight: '1.4' }}>{$i(tp?.sub)}</span>
                    </button>
                  </Fragment>
                ))}
              </div>
              {showUrgent ? (
                <>
                  <div
                    style={{
                      display: 'flex',
                      gap: '14px',
                      alignItems: 'flex-start',
                      background: '#fdecec',
                      border: '1px solid #f5c2c5',
                      borderRadius: '14px',
                      padding: '14px 16px',
                      animation: 'fadeUp .2s ease-out',
                    }}
                  >
                    <span style={{ color: '#D82028', flexShrink: '0', marginTop: '1px' }}>{$i(iconAlert)}</span>
                    <p style={{ fontSize: '14px', lineHeight: '1.55', color: '#7a1a1f' }}>
                      If someone is in immediate danger or has overdosed, call <strong>911</strong> now. For urgent
                      treatment guidance, our helpline is faster than this form —{' '}
                      <$A href="tel:+18558854747" style={{ fontWeight: '600', color: '#D82028' }}>
                        call 1-855-885-4747
                      </$A>
                      .
                    </p>
                  </div>
                </>
              ) : null}
              {sent ? (
                <>
                  <div
                    style={{
                      background: '#e9f8ef',
                      border: '1px solid #bfe8d0',
                      borderRadius: '20px',
                      padding: '32px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
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
                    <h3 style={{ fontSize: '24px' }}>Thanks — we've got your message.</h3>
                    <p style={{ fontSize: '15.5px', lineHeight: '1.6', color: '#2b5a3d' }}>
                      We reply to most messages within one business day. If it's about treatment and you'd like to talk
                      sooner, the helpline is open now.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '4px' }}>
                      <$A
                        className="scp1"
                        href="tel:+18558854747"
                        style={{
                          font: '600 15px Jost,sans-serif',
                          color: '#fff',
                          background: '#0890E8',
                          padding: '12px 18px',
                          borderRadius: '10px',
                        }}
                      >
                        Call the helpline
                      </$A>
                      <button
                        className="scpj"
                        type="button"
                        onClick={reset}
                        style={{
                          appearance: 'none',
                          cursor: 'pointer',
                          font: '600 15px Jost,sans-serif',
                          color: '#10233a',
                          background: '#fff',
                          border: '1px solid #dbe6f0',
                          padding: '12px 18px',
                          borderRadius: '10px',
                        }}
                      >
                        Send another
                      </button>
                    </div>
                  </div>
                </>
              ) : null}
              {notSent ? (
                <>
                  <form
                    onSubmit={submit}
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '22px',
                      padding: '26px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      boxShadow: '0 40px 80px -50px rgba(16,35,58,.35)',
                    }}
                  >
                    <div style={{ font: '600 19px Jost,sans-serif' }}>Send us a message</div>
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
                        type="email"
                        name="email"
                        placeholder="Email"
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
                        type="tel"
                        name="phone"
                        placeholder="Phone (optional)"
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
                    {showOrg ? (
                      <>
                        <input
                          name="org"
                          placeholder={orgPlaceholder}
                          style={{
                            border: '1px solid #dbe6f0',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            font: '500 14px Figtree,sans-serif',
                            outline: 'none',
                            width: '100%',
                            animation: 'fadeUp .2s ease-out',
                          }}
                        />
                      </>
                    ) : null}
                    <textarea
                      required
                      name="message"
                      rows="5"
                      placeholder={msgPlaceholder}
                      style={{
                        border: '1px solid #dbe6f0',
                        borderRadius: '10px',
                        padding: '12px 14px',
                        font: '500 14px Figtree,sans-serif',
                        outline: 'none',
                        width: '100%',
                        resize: 'vertical',
                        lineHeight: '1.5',
                      }}
                    />
                    <label
                      style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'flex-start',
                        fontSize: '13px',
                        color: '#6b7f95',
                        lineHeight: '1.5',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        name="callback"
                        style={{ marginTop: '2px', width: '16px', height: '16px', accentColor: '#0890E8' }}
                      />
                      It's okay to call me back. Calls are discreet — we never leave details in a voicemail.
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
                        padding: '14px',
                        borderRadius: '12px',
                        marginTop: '4px',
                      }}
                    >
                      Send message
                    </button>
                    <p style={{ fontSize: '12px', color: '#6b7f95', lineHeight: '1.5', textAlign: 'center' }}>
                      Confidential — never shared with treatment centres without your consent.{' '}
                      <$A href="https://addictionrehabcenters.ca/terms-of-use/">Terms</$A> ·{' '}
                      <$A href="https://addictionrehabcenters.ca/privacy-policy/">Privacy</$A>
                    </p>
                  </form>
                </>
              ) : null}
            </div>
            <aside style={$css(`display:flex;flex-direction:column;gap:16px;position:${asidePos ?? ''};top:130px`)}>
              <div
                style={{
                  background: 'linear-gradient(160deg,#0f5fa8,#0890E8)',
                  borderRadius: '22px',
                  padding: '28px',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: '-70px',
                    top: '-70px',
                    width: '220px',
                    height: '220px',
                    borderRadius: '50%',
                    border: '40px solid rgba(255,255,255,.08)',
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    font: '500 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    opacity: '.85',
                  }}
                >
                  Free helpline · 24/7
                </span>
                <h3 style={{ position: 'relative', fontSize: '24px', color: '#fff', lineHeight: '1.2' }}>
                  Prefer to talk? We're here around the clock.
                </h3>
                <p style={{ position: 'relative', fontSize: '14.5px', lineHeight: '1.55', opacity: '.92' }}>
                  Our advisors listen first, then help you compare programs, understand costs and take the next step —
                  no pressure, no obligation.
                </p>
                <$A
                  className="scp5"
                  href="tel:+18558854747"
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    font: '600 17px Jost,sans-serif',
                    color: '#0f5fa8',
                    background: '#fff',
                    padding: '13px 16px',
                    borderRadius: '10px',
                    marginTop: '4px',
                  }}
                >
                  1-855-885-4747
                </$A>
              </div>
              <div
                style={{
                  background: '#f7fafd',
                  border: '1px solid #e3ecf4',
                  borderRadius: '22px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <h3 style={{ fontSize: '17px' }}>Contact details</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {$list(details).map((d, $index) => (
                    <Fragment key={$index}>
                      <li
                        style={{ display: 'grid', gridTemplateColumns: '36px 1fr', gap: '12px', alignItems: 'start' }}
                        data-cols="36px 1fr"
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
                          {$i(d?.icon)}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                          <span
                            style={{
                              font: '600 11.5px Figtree,sans-serif',
                              letterSpacing: '.08em',
                              textTransform: 'uppercase',
                              color: '#6b7f95',
                            }}
                          >
                            {$i(d?.label)}
                          </span>
                          <$A
                            className="scp0"
                            href={d?.href}
                            style={{
                              font: '500 14.5px Figtree,sans-serif',
                              color: '#10233a',
                              lineHeight: '1.4',
                              wordBreak: 'break-word',
                            }}
                          >
                            {$i(d?.value)}
                          </$A>
                          <span style={{ fontSize: '12.5px', color: '#6b7f95' }}>{$i(d?.note)}</span>
                        </div>
                      </li>
                    </Fragment>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  background: '#f7fafd',
                  border: '1px solid #e3ecf4',
                  borderRadius: '22px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <h3 style={{ fontSize: '17px' }}>Response times</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {$list(sla).map((s, $index) => (
                    <Fragment key={$index}>
                      <li
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '12px',
                          fontSize: '14px',
                          padding: '9px 0',
                          borderBottom: '1px solid #e9eff5',
                        }}
                      >
                        <span style={{ color: '#3b4d63' }}>{$i(s?.label)}</span>
                        <span
                          style={$css(`font:600 13.5px Jost,sans-serif;color:${s?.color ?? ''};white-space:nowrap`)}
                        >
                          {$i(s?.value)}
                        </span>
                      </li>
                    </Fragment>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>
        <section data-screen-label="Who we help" style={{ background: '#f7fafd' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '80px 32px' }} data-rc-wrap="1">
            <div style={{ maxWidth: '640px', marginBottom: '36px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Quick paths
              </span>
              <h2 style={{ fontSize: '36px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                You may not need to wait for a reply
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#516378', marginTop: '12px' }}>
                Many questions are answered right away on these pages.
              </p>
            </div>
            <div style={$css(`display:grid;grid-template-columns:${pathCols ?? ''};gap:14px`)} data-rc-dyn="1">
              {$list(quickPaths).map((qp, $index) => (
                <Fragment key={$index}>
                  <$A
                    className="scp1a"
                    href={qp?.href}
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '20px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      color: '#10233a',
                      transition: 'transform .2s,border-color .2s,box-shadow .2s',
                    }}
                  >
                    <span
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        background: '#eaf5fd',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {$i(qp?.icon)}
                    </span>
                    <h3 style={{ fontSize: '18px' }}>{$i(qp?.title)}</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.55', color: '#516378', flex: '1' }}>{$i(qp?.body)}</p>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        font: '600 14px Jost,sans-serif',
                        color: '#0890E8',
                      }}
                    >
                      {$i(qp?.cta)}
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRight: '1.5px solid #0890E8',
                          borderTop: '1.5px solid #0890E8',
                          transform: 'rotate(45deg)',
                        }}
                      />
                    </span>
                  </$A>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section
          data-screen-label="What to expect"
          style={{ background: '#10233a', color: '#fff', position: 'relative', overflow: 'hidden' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '0',
              background: 'radial-gradient(700px 500px at 20% 50%,rgba(8,144,232,.22),rgba(8,144,232,0) 70%)',
            }}
          />
          <div
            style={$css(
              `position:relative;max-width:1280px;margin:0 auto;padding:80px 32px;display:grid;grid-template-columns:${expectCols ?? ''};gap:48px;align-items:center`,
            )}
            data-rc-dyn="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#7cc4f5',
                }}
              >
                What happens when you call
              </span>
              <h2 style={{ fontSize: '36px', lineHeight: '1.1', color: '#fff' }} data-rc-lg="1">
                A conversation, not a sales call
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.65', color: '#b7c7d8' }}>
                Calling can feel like a big step. Here's exactly what to expect so there are no surprises.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {$list(expect).map((ex, $index) => (
                <Fragment key={$index}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1fr',
                      gap: '16px',
                      alignItems: 'start',
                      background: 'rgba(255,255,255,.05)',
                      border: '1px solid rgba(255,255,255,.1)',
                      borderRadius: '16px',
                      padding: '16px 18px',
                    }}
                    data-cols="44px 1fr"
                  >
                    <span
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: '#0890E8',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        font: '600 15px Jost,sans-serif',
                      }}
                    >
                      {$i(ex?.n)}
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <h3 style={{ fontSize: '17px', color: '#fff' }}>{$i(ex?.title)}</h3>
                      <p style={{ fontSize: '14px', lineHeight: '1.55', color: '#b7c7d8' }}>{$i(ex?.body)}</p>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section data-screen-label="FAQ" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
          <div
            style={$css(
              `max-width:1280px;margin:0 auto;padding:80px 32px;display:grid;grid-template-columns:${faqCols ?? ''};gap:56px;align-items:start`,
            )}
            data-rc-dyn="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                FAQ
              </span>
              <h2 style={{ fontSize: '36px', lineHeight: '1.12' }} data-rc-lg="1">
                Before you reach out
              </h2>
              <p style={{ fontSize: '15.5px', lineHeight: '1.6', color: '#516378' }}>
                Still have a question? <$A href="#message">Send us a message</$A> or call the helpline.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {$list(faqs).map((q, $index) => (
                <Fragment key={$index}>
                  <div
                    style={$css(
                      `background:#f7fafd;border:1px solid ${q?.border ?? ''};border-radius:18px;overflow:hidden;transition:border-color .2s`,
                    )}
                  >
                    <button
                      onClick={q?.toggle}
                      aria-expanded={q?.open}
                      style={{
                        appearance: 'none',
                        border: '0',
                        background: 'transparent',
                        width: '100%',
                        textAlign: 'left',
                        cursor: 'pointer',
                        padding: '18px 22px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        font: '600 16.5px Jost,sans-serif',
                        color: '#10233a',
                      }}
                    >
                      <span>{$i(q?.question)}</span>
                      <span
                        style={$css(
                          `width:28px;height:28px;border-radius:50%;background:#fff;border:1px solid #dbe6f0;display:grid;place-items:center;flex-shrink:0;color:#0890E8;font:500 18px Figtree,sans-serif;line-height:1;transform:${q?.rot ?? ''};transition:transform .2s`,
                        )}
                      >
                        +
                      </span>
                    </button>
                    {q?.open ? (
                      <>
                        <div
                          style={{
                            padding: '0 22px 20px',
                            fontSize: '15px',
                            lineHeight: '1.7',
                            color: '#3b4d63',
                            animation: 'fadeUp .2s ease-out',
                          }}
                        >
                          {$i(q?.answer)}
                        </div>
                      </>
                    ) : null}
                  </div>
                </Fragment>
              ))}
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
  '\nhtml,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\ninput,textarea,select{font-family:Figtree,Helvetica,Arial,sans-serif}\ninput:focus,textarea:focus,select:focus{border-color:#0890E8!important;box-shadow:0 0 0 3px rgba(8,144,232,.15)}\n@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(47,180,107,.45)}70%{box-shadow:0 0 0 10px rgba(47,180,107,0)}}\n@keyframes ring{0%,100%{transform:rotate(0)}10%{transform:rotate(-12deg)}20%{transform:rotate(10deg)}30%{transform:rotate(-8deg)}40%{transform:rotate(6deg)}50%{transform:rotate(0)}}\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important}}\n';
export const css = [ownCss, SiteHeader_css].filter(Boolean).join('\n');
export const defaults = { email: 'info@addictionrehabcenters.ca' };
const View = createDC('Contact', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} {...props} />;
}
