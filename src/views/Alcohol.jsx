'use client';
// Generated from Alcohol.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = { menu: null, who: 1, sent: false, faq: 0, active: 'what', w: 1280 };
  componentDidMount() {
    this._ro = new ResizeObserver(() => {
      const w = document.documentElement.clientWidth;
      if (Math.abs(w - this.state.w) > 8) this.setState({ w });
    });
    this._ro.observe(document.documentElement);
    this.setState({ w: document.documentElement.clientWidth });
    this._onScroll = () => {
      const ids = ['what', 'types', 'provinces', 'effects', 'signs', 'treatment', 'faq'];
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
    const { menu, who, sent, faq, active, w } = this.state;
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
      question: this.icon([
        { t: 'circle', a: { cx: 12, cy: 12, r: 9 } },
        'M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7',
        'M12 17v.5',
      ]),
      group: this.icon([
        { t: 'circle', a: { cx: 9, cy: 8, r: 3 } },
        { t: 'circle', a: { cx: 17, cy: 9, r: 2.5 } },
        'M3 20a6 6 0 0 1 12 0',
        'M15 20a5 5 0 0 1 6-4.5',
      ]),
      drop: this.icon(['M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z']),
      home: this.icon(['M3 11l9-7 9 7', 'M5 10v10h14V10', 'M10 20v-6h4v6']),
      med: this.icon([{ t: 'rect', a: { x: 3, y: 5, width: 18, height: 14, rx: 3 } }, 'M12 9v6', 'M9 12h6']),
      bed: this.icon(['M3 18V8', 'M3 12h18v6', 'M21 18v-6', 'M3 12V9a2 2 0 0 1 2-2h6v5']),
      steps: this.icon(['M4 20h5v-4h5v-4h5V8', 'M4 20v-4h5']),
      car: this.icon([
        'M5 16l1.5-5h11L19 16',
        'M3 16h18v3H3z',
        { t: 'circle', a: { cx: 7, cy: 19, r: 1.5 } },
        { t: 'circle', a: { cx: 17, cy: 19, r: 1.5 } },
      ]),
      leaf: this.icon(['M20 4C9 4 4 10 4 20c10 0 16-5 16-16z', 'M4 20L14 10']),
      clock: this.icon([{ t: 'circle', a: { cx: 12, cy: 12, r: 9 } }, 'M12 7v5l3 2']),
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
    const alcoholLinks = [
      { label: 'Alcohol Addiction', href: '/alcohol' },
      { label: 'Am I An Alcoholic?', href: B + 'am-i-an-alcoholic/' },
      { label: 'AA Support Group', href: B + 'aa-support-group/' },
      { label: 'Detox Centres in Canada', href: B + 'detox-centres-in-canada/' },
    ];
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
        links: alcoholLinks,
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

    // ---- Pillar page data ----
    const heroChips = [
      ['Am I an alcoholic?', B + 'am-i-an-alcoholic/'],
      ['Alcohol detox', B + 'detox-centres-in-canada/'],
      ['Alcohol rehab', B + 'alcohol-rehab/'],
      ['AA support groups', B + 'aa-support-group/'],
      ['Home detox', B + 'home-detox-in-canada/'],
    ].map(([label, href]) => ({ label, href }));
    const hub = [
      {
        icon: ic.question,
        tag: 'Self-check',
        title: 'Am I An Alcoholic?',
        body: 'A short, honest self-assessment to understand where your drinking sits and whether it\u2019s time to get help.',
        cta: 'Take the assessment',
        href: B + 'am-i-an-alcoholic/',
      },
      {
        icon: ic.drop,
        tag: 'Detox',
        title: 'Detox Centres in Canada',
        body: 'Supervised alcohol withdrawal is the safest first step. Find detox centres by province and what to expect.',
        cta: 'Find a detox centre',
        href: B + 'detox-centres-in-canada/',
      },
      {
        icon: ic.leaf,
        tag: 'Treatment',
        title: 'Alcohol Rehab Programs',
        body: 'Residential and outpatient programs built for alcohol dependence — length, cost and what\u2019s included.',
        cta: 'Explore alcohol rehab',
        href: B + 'alcohol-rehab/',
      },
      {
        icon: ic.group,
        tag: 'Support',
        title: 'AA Support Groups',
        body: 'Free peer support in every province. How meetings work, and how they fit alongside formal treatment.',
        cta: 'Find a meeting',
        href: B + 'aa-support-group/',
      },
      {
        icon: ic.home,
        tag: 'Detox',
        title: 'Home Detox in Canada',
        body: 'For mild-to-moderate dependence, medically guided detox at home may be an option. Learn who qualifies.',
        cta: 'About home detox',
        href: B + 'home-detox-in-canada/',
      },
      {
        icon: ic.med,
        tag: 'Detox',
        title: 'Medical Detox',
        body: 'Hospital-grade withdrawal management for heavy, long-term drinking where seizures or DTs are a risk.',
        cta: 'About medical detox',
        href: B + 'medical-detox-in-canada/',
      },
      {
        icon: ic.steps,
        tag: 'Recovery',
        title: '12 Step Programs',
        body: 'How the 12 steps are used in alcohol treatment, and centres that build their programs around them.',
        cta: 'Learn the 12 steps',
        href: B + '12-steps-programs/',
      },
      {
        icon: ic.car,
        tag: 'Legal',
        title: 'DUI in Canada',
        body: 'Impaired-driving charges are often the wake-up call. What happens next and how treatment can help.',
        cta: 'DUI and treatment',
        href: B + 'dui-in-canada/',
      },
    ];
    const tocDefs = [
      ['what', 'What is alcohol addiction?'],
      ['types', 'Types of alcohol misuse'],
      ['provinces', 'Where the problem is worst'],
      ['effects', 'Long-term effects'],
      ['signs', 'Signs of addiction'],
      ['treatment', 'Finding treatment'],
      ['faq', 'Common questions'],
    ];
    const toc = tocDefs.map(([id, label]) => ({
      label,
      href: '#' + id,
      color: active === id ? '#0890E8' : '#3b4d63',
      bar: active === id ? '#0890E8' : 'transparent',
    }));
    const types = [
      {
        level: 'Level 1',
        color: '#2fb46b',
        title: 'Social & occasional drinking',
        body: 'Drinking at events or with friends, without cravings or consequences. Most alcohol problems begin here, which is why it\u2019s worth noticing when habits shift.',
        step: 'Awareness and self-assessment',
      },
      {
        level: 'Level 2',
        color: '#f5b301',
        title: 'Binge drinking',
        body: 'Four or more drinks (women) or five or more (men) in a sitting, usually on weekends. Blackouts, injuries and poor decisions become common.',
        step: 'Counselling or outpatient program',
      },
      {
        level: 'Level 3',
        color: '#f07b22',
        title: 'Heavy or problem drinking',
        body: 'Drinking most days, often alone or to cope. Work, finances and relationships start to suffer, and cutting down feels harder than expected.',
        step: 'Outpatient rehab or home detox',
      },
      {
        level: 'Level 4',
        color: '#D82028',
        title: 'Alcohol dependence (alcoholism)',
        body: 'Physical tolerance and withdrawal — shaking, sweating, nausea — when not drinking. Stopping suddenly can be dangerous without medical support.',
        step: 'Medical detox, then residential rehab',
      },
    ];
    const worst = [
      ['QC', 'Quebec', B + 'quebec-drug-rehab-centers/'],
      ['SK', 'Saskatchewan', B + 'saskatchewan-drug-rehab-treatment/'],
      ['AB', 'Alberta', B + 'alcohol-drug-rehab-centres-in-alberta/'],
    ].map(([code, label, href]) => ({ code, label, href }));
    const effects = [
      'Cancer of the mouth, throat, esophagus, lips and liver',
      'Permanent liver damage (cirrhosis)',
      'Brain injury and memory loss',
      'Confusion and impaired judgement',
      'Depression and anxiety',
      'Relationship and family breakdown',
    ];
    const signs = [
      'Drinking more, or for longer, than intended',
      'Wanting to cut down but not managing to',
      'Spending a lot of time drinking or recovering from it',
      'Strong cravings or urges to drink',
      'Drinking interfering with work, school or home',
      'Giving up activities you used to enjoy',
      'Needing more alcohol to get the same effect',
      'Withdrawal symptoms — shaking, sweating, nausea, insomnia',
    ].map((text, i) => ({ n: i + 1, text }));
    const treatments = [
      {
        icon: ic.med,
        title: 'Medical detox',
        body: 'Supervised withdrawal, usually 5–7 days',
        href: B + 'medical-detox-in-canada/',
      },
      {
        icon: ic.bed,
        title: 'Residential rehab',
        body: 'Live-in programs from 30 to 90+ days',
        href: B + 'residential-drug-rehabs-in-canada/',
      },
      {
        icon: ic.clock,
        title: 'Outpatient treatment',
        body: 'Structured therapy while living at home',
        href: B + 'outpatient-drug-rehab-centers/',
      },
      {
        icon: ic.home,
        title: 'Home detox',
        body: 'Medically guided, for milder dependence',
        href: B + 'home-detox-in-canada/',
      },
      {
        icon: ic.group,
        title: 'Support groups & aftercare',
        body: 'AA and long-term recovery programs',
        href: B + 'aa-support-group/',
      },
    ];
    const faqData = [
      [
        'Do I need detox before rehab?',
        'If you drink daily and experience shaking, sweating or nausea when you stop, yes — alcohol withdrawal can be dangerous and should be medically supervised. Our specialists can tell you within a few minutes whether detox is likely to be needed.',
      ],
      [
        'How long does alcohol rehab take?',
        'Detox typically lasts 5–7 days. Residential programs run 30, 60 or 90 days; outpatient programs are usually 8–12 weeks. Longer stays are linked to better long-term outcomes for alcohol dependence.',
      ],
      [
        'Is alcohol treatment covered in Canada?',
        'Publicly funded detox and outpatient programs exist in every province, though waitlists vary. Private residential rehab is paid out of pocket or through extended health benefits. We can explain what is available where you live.',
      ],
      [
        'Can I help a family member who won\u2019t admit there is a problem?',
        'Yes. Many families start with a professionally guided intervention. Our Intervention guide explains how it works, and we can connect you with centres that have trained interventionists.',
      ],
      [
        'What is the difference between AA and rehab?',
        'AA is free peer support that many people attend for years. Rehab is structured clinical treatment — detox, therapy and medical care — over a set period. Most treatment plans use both.',
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
      heroChips,
      hub,
      toc,
      types,
      worst,
      effects,
      signs,
      treatments,
      faqs,
      locations,
      footerCols,
      forWho,
      sent,
      notSent: !sent,
      submit: (e) => {
        e.preventDefault();
        this.setState({ sent: true });
      },
      showToc: !narrow && (this.props.showToc ?? true),
      heroCols: mid ? '1fr' : '1.05fr .95fr',
      h1Size: mobile ? '44px' : '64px',
      hubCols: mobile ? '1fr' : mid ? 'repeat(2,1fr)' : narrow ? 'repeat(3,1fr)' : 'repeat(4,1fr)',
      articleCols: narrow || !(this.props.showToc ?? true) ? '1fr' : '260px minmax(0,1fr)',
      splitCols: mid ? '1fr' : '1.15fr .85fr',
      splitColsRev: mid ? '1fr' : '.85fr 1.15fr',
      imgOrder: mid ? '2' : '0',
      typeCols: mobile ? '1fr' : 'repeat(2,1fr)',
      signCols: mobile ? '1fr' : 'repeat(2,1fr)',
      ctaCols: mid ? '1fr' : '1.4fr .6fr',
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
    effects,
    faqs,
    fieldCols,
    footCols,
    footerCols,
    forWho,
    h1Size,
    helpCols,
    helpPad,
    heroChips,
    heroCols,
    hub,
    hubCols,
    iconPhone,
    imgOrder,
    locations,
    notSent,
    provCols,
    sent,
    showToc,
    signCols,
    signs,
    splitCols,
    splitColsRev,
    submit,
    toc,
    treatments,
    typeCols,
    types,
    worst,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="alcohol" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
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
              <span style={{ color: '#10233a', fontWeight: '500' }}>Alcohol Addiction</span>
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
                Alcohol addiction · Treatment centres across Canada
              </span>
              <h1 style={$css(`font-size:${h1Size ?? ''};line-height:1.04;color:#10233a`)}>Alcohol Addiction</h1>
              <p style={{ fontSize: '19px', lineHeight: '1.6', color: '#516378' }}>
                Understand alcohol addiction, recognise the signs, and find the right detox, rehab and support program
                for you or someone you love — anywhere in Canada.
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
                  Find An Alcohol Rehab
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
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
                {$list(heroChips).map((hc, $index) => (
                  <Fragment key={$index}>
                    <$A
                      className="scp2"
                      href={hc?.href}
                      style={{
                        font: '500 13px Figtree,sans-serif',
                        color: '#1f3550',
                        background: '#fff',
                        border: '1px solid #dbe6f0',
                        padding: '7px 12px',
                        borderRadius: '999px',
                      }}
                    >
                      {$i(hc?.label)}
                    </$A>
                  </Fragment>
                ))}
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
                  src="https://addictionrehabcenters.ca/wp-content/uploads/2022/02/alcohol-addiction.jpg"
                  alt="Alcohol addiction"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} data-cols="1fr 1fr">
                <div
                  style={{
                    background: '#10233a',
                    color: '#fff',
                    borderRadius: '18px',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{ font: '600 36px/1 Jost,sans-serif', color: '#7cc4f5', fontVariantNumeric: 'tabular-nums' }}
                  >
                    4.1%
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.45', color: '#d9e6f2' }}>
                    of Canadians suffer from alcohol addiction
                  </span>
                </div>
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #e3ecf4',
                    borderRadius: '18px',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <span
                    style={{ font: '600 36px/1 Jost,sans-serif', color: '#0890E8', fontVariantNumeric: 'tabular-nums' }}
                  >
                    20–24
                  </span>
                  <span style={{ fontSize: '13px', lineHeight: '1.45', color: '#516378' }}>
                    the age group where it is most common
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section
          id="topics"
          data-screen-label="Alcohol topics"
          style={{ background: '#fff', borderBottom: '1px solid #e9eff5' }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px' }} data-rc-wrap="1">
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap',
                marginBottom: '32px',
              }}
            >
              <div style={{ maxWidth: '640px' }}>
                <span
                  style={{
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#0890E8',
                  }}
                >
                  Explore
                </span>
                <h2 style={{ fontSize: '36px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                  Everything about alcohol addiction, in one place
                </h2>
                <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#516378', marginTop: '12px' }}>
                  Start with the question you have right now. Each guide links to verified treatment centres across
                  Canada.
                </p>
              </div>
            </div>
            <div style={$css(`display:grid;grid-template-columns:${hubCols ?? ''};gap:14px`)} data-rc-dyn="1">
              {$list(hub).map((hb, $index) => (
                <Fragment key={$index}>
                  <$A
                    className="scp3"
                    href={hb?.href}
                    style={{
                      background: '#f7fafd',
                      border: '1px solid #e3ecf4',
                      borderRadius: '20px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      color: '#10233a',
                      transition: 'transform .2s,border-color .2s,box-shadow .2s',
                      minWidth: '0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        {$i(hb?.icon)}
                      </span>
                      <span
                        style={{
                          font: '600 10.5px Figtree,sans-serif',
                          letterSpacing: '.1em',
                          textTransform: 'uppercase',
                          color: '#6b7f95',
                          background: '#fff',
                          border: '1px solid #e3ecf4',
                          padding: '4px 8px',
                          borderRadius: '999px',
                        }}
                      >
                        {$i(hb?.tag)}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '18px', lineHeight: '1.25' }}>{$i(hb?.title)}</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.55', color: '#516378', flex: '1' }}>{$i(hb?.body)}</p>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        font: '600 14px Jost,sans-serif',
                        color: '#0890E8',
                      }}
                    >
                      {$i(hb?.cta)}
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
        <section data-screen-label="Article" style={{ background: '#f7fafd' }}>
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
                    style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '18px', padding: '20px' }}
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
                      On this page
                    </span>{' '}
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '12px' }}>
                      {$list(toc).map((t, $index) => (
                        <Fragment key={$index}>
                          <li>
                            <$A
                              className="scp4"
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
                      Free · Confidential · 24/7
                    </span>
                    <h3 style={{ fontSize: '19px', color: '#fff', lineHeight: '1.25' }}>
                      Worried about your drinking?
                    </h3>
                    <p style={{ fontSize: '13.5px', lineHeight: '1.5', opacity: '.9' }}>
                      Talk to an addiction specialist about detox, rehab and what's covered where you live.
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
                    Alcohol Addiction: What is it?
                  </h2>
                  <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                    This is a very distinctive problem that can be easily understood as it usually starts in occasional
                    and social drinking. It also starts with the common idea that drinking alcohol can help overcome
                    problems. There are also cases when a person drinks alcohol as a way to escape a specific mental or
                    physical condition. However, none of these problems or conditions is going to be resolved by simply
                    drinking alcohol — instead, a particular situation will only become worse along with its negative
                    and devastating effects.
                  </p>
                  <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                    As of today, Canada has{' '}
                    <strong>4.1 percent of its population suffering from alcohol addiction</strong>. While this
                    statistic came out in 1994, authorities are greatly alarmed due to the continuing stability of this
                    social menace. Alcohol addiction is commonly seen among Canadians who are 20 to 24 years old. Many
                    of these alcoholics said that their work, finances and personal life were greatly affected because
                    of their addiction to alcohol.
                  </p>
                </div>
                <div style={{ borderRadius: '22px', overflow: 'hidden', aspectRatio: '4/5', background: '#dfeaf3' }}>
                  <img
                    src="https://addictionrehabcenters.ca/wp-content/uploads/2022/02/effects-of-alcoholism.jpg"
                    alt="Effects of alcoholism"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              </div>
              <div id="types" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '720px' }}>
                  <span
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: '#0890E8',
                    }}
                  >
                    Patterns of drinking
                  </span>
                  <h2 style={{ fontSize: '34px', lineHeight: '1.12' }} data-rc-lg="1">
                    Types of alcohol misuse
                  </h2>
                  <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                    Alcohol problems sit on a spectrum. Knowing where you or a loved one falls helps decide whether
                    outpatient support, home detox or residential rehab is the right first step.
                  </p>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${typeCols ?? ''};gap:12px`)} data-rc-dyn="1">
                  {$list(types).map((ty, $index) => (
                    <Fragment key={$index}>
                      <div
                        style={$css(
                          `background:#fff;border:1px solid #e3ecf4;border-radius:20px;padding:24px;display:flex;flex-direction:column;gap:10px;border-top:4px solid ${ty?.color ?? ''}`,
                        )}
                      >
                        <span
                          style={$css(
                            `font:600 11.5px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:${ty?.color ?? ''}`,
                          )}
                        >
                          {$i(ty?.level)}
                        </span>
                        <h3 style={{ fontSize: '19px' }}>{$i(ty?.title)}</h3>
                        <p style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#516378', flex: '1' }}>
                          {$i(ty?.body)}
                        </p>
                        <span
                          style={{
                            fontSize: '13px',
                            color: '#6b7f95',
                            paddingTop: '10px',
                            borderTop: '1px solid #edf2f7',
                          }}
                        >
                          <strong style={{ color: '#3b4d63' }}>Usual first step:</strong> {$i(ty?.step)}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div
                id="provinces"
                style={$css(
                  `background:#10233a;color:#fff;border-radius:24px;padding:36px;display:grid;grid-template-columns:${splitCols ?? ''};gap:32px;align-items:center;position:relative;overflow:hidden`,
                )}
                data-rc-dyn="1"
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '0',
                    background: 'radial-gradient(500px 300px at 90% 10%,rgba(8,144,232,.3),rgba(8,144,232,0) 70%)',
                  }}
                />
                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <span
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: '#7cc4f5',
                    }}
                  >
                    Where the problem is worst
                  </span>
                  <h2 style={{ fontSize: '28px', lineHeight: '1.15', color: '#fff' }}>
                    Quebec, Saskatchewan and Alberta
                  </h2>
                  <p style={{ fontSize: '15.5px', lineHeight: '1.65', color: '#b7c7d8' }}>
                    <$A href="https://addictionrehabcenters.ca/quebec-drug-rehab-centers/" style={{ color: '#7cc4f5' }}>
                      Quebec
                    </$A>
                    ,{' '}
                    <$A
                      href="https://addictionrehabcenters.ca/saskatchewan-drug-rehab-treatment/"
                      style={{ color: '#7cc4f5' }}
                    >
                      Saskatchewan
                    </$A>{' '}
                    and{' '}
                    <$A
                      href="https://addictionrehabcenters.ca/alcohol-drug-rehab-centres-in-alberta/"
                      style={{ color: '#7cc4f5' }}
                    >
                      Alberta
                    </$A>{' '}
                    are the{' '}
                    <$A
                      href="https://addictionrehabcenters.ca/30-days-treatment-by-canadian-provinces/"
                      style={{ color: '#7cc4f5' }}
                    >
                      provinces in Canada
                    </$A>{' '}
                    with the worst problem in terms of alcohol addiction. It is in these provinces where many people are
                    suffering from alcohol addiction and they are not getting the appropriate help and assistance they
                    need. Many of them also aren't fully aware of options that can help them in dealing with their
                    addiction safely and effectively.
                  </p>
                </div>
                <div
                  style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}
                  data-cols="repeat(3,1fr)"
                >
                  {$list(worst).map((wp, $index) => (
                    <Fragment key={$index}>
                      <$A
                        className="scp6"
                        href={wp?.href}
                        style={{
                          background: 'rgba(255,255,255,.06)',
                          border: '1px solid rgba(255,255,255,.14)',
                          borderRadius: '16px',
                          padding: '18px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: '8px',
                          color: '#fff',
                          textAlign: 'center',
                          transition: 'all .18s',
                        }}
                      >
                        <span style={{ font: '600 22px Jost,sans-serif', color: '#7cc4f5' }}>{$i(wp?.code)}</span>
                        <span style={{ font: '500 13px Figtree,sans-serif', lineHeight: '1.3' }}>{$i(wp?.label)}</span>
                        <span style={{ fontSize: '11.5px', color: '#b7c7d8' }}>View rehabs</span>
                      </$A>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div
                id="effects"
                style={$css(`display:grid;grid-template-columns:${splitColsRev ?? ''};gap:40px;align-items:center`)}
                data-rc-dyn="1"
              >
                <div
                  style={$css(
                    `border-radius:22px;overflow:hidden;aspect-ratio:4/3;background:#dfeaf3;order:${imgOrder ?? ''}`,
                  )}
                >
                  <img
                    src="https://addictionrehabcenters.ca/wp-content/uploads/2022/02/alcohol-addiction-treatment.jpg"
                    alt="Long-term effects of alcoholism"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '34px', lineHeight: '1.12' }} data-rc-lg="1">
                    The Long-Term Effects of Alcoholism
                  </h2>
                  <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                    Heavy use or doses of alcohol for a long span of time can cause serious damage to certain parts of
                    the body. <strong>Liver and brain impairment can become a permanent problem.</strong> This becomes
                    even worse when an alcoholic is deprived of a healthy diet. Emotional problems like depression and
                    relationship issues are more likely to take place, too.
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }} data-cols="1fr 1fr">
                    {$list(effects).map((ef, $index) => (
                      <Fragment key={$index}>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            background: '#fff',
                            border: '1px solid #e3ecf4',
                            borderRadius: '12px',
                            padding: '10px 12px',
                            font: '500 13.5px Figtree,sans-serif',
                            color: '#1f3550',
                          }}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: '#D82028',
                              flexShrink: '0',
                            }}
                          />
                          {$i(ef)}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div id="signs" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '720px' }}>
                  <span
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: '#0890E8',
                    }}
                  >
                    Recognising the problem
                  </span>
                  <h2 style={{ fontSize: '34px', lineHeight: '1.12' }} data-rc-lg="1">
                    Signs of alcohol addiction
                  </h2>
                  <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                    If several of these sound familiar, it's worth taking our short self-assessment or speaking with a
                    specialist.
                  </p>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${signCols ?? ''};gap:10px`)} data-rc-dyn="1">
                  {$list(signs).map((sg, $index) => (
                    <Fragment key={$index}>
                      <div
                        style={{
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'flex-start',
                          background: '#fff',
                          border: '1px solid #e3ecf4',
                          borderRadius: '14px',
                          padding: '14px 16px',
                        }}
                      >
                        <span
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '50%',
                            background: '#eaf5fd',
                            color: '#0890E8',
                            display: 'grid',
                            placeItems: 'center',
                            font: '600 11px Jost,sans-serif',
                            flexShrink: '0',
                          }}
                        >
                          {$i(sg?.n)}
                        </span>
                        <span style={{ fontSize: '14.5px', lineHeight: '1.5', color: '#3b4d63' }}>{$i(sg?.text)}</span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <$A
                  className="scp7"
                  href="https://addictionrehabcenters.ca/am-i-an-alcoholic/"
                  style={{
                    alignSelf: 'flex-start',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    font: '600 15px Jost,sans-serif',
                    color: '#0890E8',
                    border: '1.5px solid #0890E8',
                    padding: '12px 18px',
                    borderRadius: '10px',
                  }}
                >
                  Take the "Am I an alcoholic?" self-assessment
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRight: '1.5px solid currentColor',
                      borderTop: '1.5px solid currentColor',
                      transform: 'rotate(45deg)',
                    }}
                  />
                </$A>
              </div>
              <div id="treatment" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div
                  style={$css(`display:grid;grid-template-columns:${splitCols ?? ''};gap:40px;align-items:start`)}
                  data-rc-dyn="1"
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <h2 style={{ fontSize: '34px', lineHeight: '1.12' }} data-rc-lg="1">
                      Finding a Treatment for Alcohol Addiction
                    </h2>
                    <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                      In Canada, there are numerous places where one can get the kind of treatment needed for a
                      particular type of addiction such as alcohol addiction. Settings for{' '}
                      <$A href="https://addictionrehabcenters.ca/alcohol-addiction-treatment/">
                        alcohol addiction treatment and rehabilitation
                      </$A>{' '}
                      usually come with different settings and these include{' '}
                      <$A href="https://addictionrehabcenters.ca/outpatient-drug-rehab-centers/">outpatient</$A>,{' '}
                      <$A href="https://addictionrehabcenters.ca/residential-drug-rehabs-in-canada/">residential</$A>{' '}
                      and others. Contacting a professional addiction counsellor will give you an idea if detox is
                      something that you need to fight off addiction.
                    </p>
                    <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                      At{' '}
                      <strong>
                        <$A href="/">Addiction Rehab Centres Canada</$A>
                      </strong>
                      , different programs are offered to patients with different needs. Our rehabilitation centres are
                      staffed with professionals who work dedicatedly to ensure the well-being and long-term recovery of
                      every patient. Apart from our holistic approach, we also come with programs that focus on much
                      more than just treating one's addiction. In fact, we also offer a good number of treatment
                      programs that will help sustain{' '}
                      <$A href="https://addictionrehabcenters.ca/long-term-drug-rehab-canada/">long-term</$A> success in
                      the recovery process of every patient.
                    </p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {$list(treatments).map((tr, $index) => (
                      <Fragment key={$index}>
                        <$A
                          className="scp8"
                          href={tr?.href}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '40px 1fr auto',
                            gap: '14px',
                            alignItems: 'center',
                            background: '#fff',
                            border: '1px solid #e3ecf4',
                            borderRadius: '16px',
                            padding: '14px 16px',
                            color: '#10233a',
                            transition: 'all .18s',
                          }}
                          data-cols="40px 1fr auto"
                        >
                          <span
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '11px',
                              background: '#eaf5fd',
                              color: '#0890E8',
                              display: 'grid',
                              placeItems: 'center',
                            }}
                          >
                            {$i(tr?.icon)}
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                            <span style={{ font: '600 15px Jost,sans-serif' }}>{$i(tr?.title)}</span>
                            <span style={{ fontSize: '12.5px', color: '#6b7f95', lineHeight: '1.4' }}>
                              {$i(tr?.body)}
                            </span>
                          </div>
                          <span
                            style={{
                              width: '6px',
                              height: '6px',
                              borderRight: '1.5px solid #0890E8',
                              borderTop: '1.5px solid #0890E8',
                              transform: 'rotate(45deg)',
                            }}
                          />
                        </$A>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
              <div id="faq" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '30px', lineHeight: '1.12' }}>Common questions about alcohol addiction</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {$list(faqs).map((q, $index) => (
                    <Fragment key={$index}>
                      <div
                        style={$css(
                          `background:#fff;border:1px solid ${q?.border ?? ''};border-radius:18px;overflow:hidden;transition:border-color .2s`,
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
                              `width:28px;height:28px;border-radius:50%;background:#f7fafd;border:1px solid #dbe6f0;display:grid;place-items:center;flex-shrink:0;color:#0890E8;font:500 18px Figtree,sans-serif;line-height:1;transform:${q?.rot ?? ''};transition:transform .2s`,
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
                    Ready to talk about treatment?
                  </h2>
                  <p style={{ fontSize: '15.5px', lineHeight: '1.6', opacity: '.92' }}>
                    Our specialists will help you compare alcohol detox and rehab programs near you — free, confidential
                    and with no obligation.
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
            </article>
          </div>
        </section>
        <section
          data-screen-label="Call strip"
          style={{ background: '#fff', borderTop: '1px solid #e9eff5', borderBottom: '1px solid #e9eff5' }}
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
        <section data-screen-label="Provinces" style={{ background: '#f7fafd' }}>
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
                Alcohol Rehab Centres By Provinces
              </h2>
            </div>
            <div style={$css(`display:grid;grid-template-columns:${provCols ?? ''};gap:10px`)} data-rc-dyn="1">
              {$list(locations).map((lc, $index) => (
                <Fragment key={$index}>
                  <$A
                    className="scpb"
                    href={lc?.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: '#fff',
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
          style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}
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
const View = createDC('Alcohol', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} {...props} />;
}
