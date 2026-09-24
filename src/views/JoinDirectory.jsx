'use client';
// Generated from JoinDirectory.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = { menu: null, tab: 0, slide: 0, faq: 0, t: 0, plan: 1, annual: false, anat: 0 };
  componentDidMount() {
    // count-up for hero metrics (~1.4s, ease-out cubic); falls back to final values if anything stalls
    const start = Date.now();
    this._timer = setInterval(() => {
      const p = Math.min(1, (Date.now() - start) / 1400);
      this.setState({ t: 1 - Math.pow(1 - p, 3) });
      if (p >= 1) clearInterval(this._timer);
    }, 40);
    this._fallback = setTimeout(() => {
      if (this.state.t < 1) this.setState({ t: 1 });
    }, 2500);
  }
  componentWillUnmount() {
    clearInterval(this._timer);
    clearTimeout(this._fallback);
  }
  sliderRef = React.createRef();
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
      doc: this.icon([{ t: 'rect', a: { x: 5, y: 3, width: 14, height: 18, rx: 2 } }, 'M9 8h6', 'M9 12h6', 'M9 16h4'], {
        width: 20,
        height: 20,
      }),
      shield: this.icon(['M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z', 'M9 12l2 2 4-4']),
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
        photo: 'photo · drug-rehab.jpg',
        body: 'Rehabilitation Centre Toronto: The symptoms of drug addiction are designed to keep you using. The "reality" drug addiction convinces you of is not real at all. The world doesn\'t have to be miserable, and you don\'t have to spend your life as an addict. Let us help you chart a course to permanent, content sobriety at our state-of-the-art drug rehab facilities.',
      },
      {
        title: 'Alcohol Rehab',
        icon: ic.glass,
        cta: 'Find An Alcohol Rehab',
        photo: 'photo · alcohol-rehab.jpg',
        body: 'Let us show you how you can live in an alcohol-saturated world without giving in to temptation. All you need to do is avoid drinking. This might seem challenging, even impossible, at first, but we can show you how to achieve sobriety that lasts a lifetime. We can help you get out of the cycle of alcohol addiction with Alcohol Rehab Program.',
      },
      {
        title: 'Prescription Drug Rehab',
        icon: ic.rx,
        cta: 'Find A Prescription Drug Rehab',
        photo: 'photo · prescription-drugs.jpg',
        body: "The prescription drug rehabilitation process begins with detoxing from prescription drugs. In most cases, this will mean quitting cold turkey, but if you have a medical condition, you might steadily taper down your dose instead. We'll work with you to manage the symptoms of detox, and offer a steady stream of encouragement as you cope with cravings.",
      },
      {
        title: 'Dual Diagnosis',
        icon: ic.dual,
        cta: 'Find A Dual Diagnosis Center',
        photo: 'photo · Dual-Diagnosis-1.jpg',
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
    const tabs = tabData.map((t, i) => ({
      label: t.label,
      select: () => this.setState({ tab: i }),
      bg: i === tab ? '#0890E8' : 'transparent',
      color: i === tab ? '#fff' : '#3b4d63',
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

    // ---- Join the directory page data ----
    const { faq, t, plan, annual, anat } = this.state;
    const cu = (n) => Math.round(n * t).toLocaleString('en-CA');
    const heroSeries = [28, 36, 40, 44, 52, 58, 55, 66, 72, 70, 81, 86, 92, 100];
    const heroBars = heroSeries.map((v, i) => ({
      h: v + '%',
      c: i === heroSeries.length - 1 ? '#0890E8' : '#cfe6f9',
      d: i * 40 + 'ms',
    }));
    const star = this.icon(['M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z']);
    const bolt = this.icon(['M13 2L4 14h7l-1 8 9-12h-7l1-8z']);
    const planDefs = [
      [
        'Professional',
        '$19.95',
        'Everything you need to be found and contacted.',
        ic.person,
        [
          'Credential-verified profile',
          'Listed in the national directory',
          'Shown on your province & city pages',
          'Message, call and website buttons',
          'Up to 8 specialties & concerns',
          'Basic profile stats',
        ],
        'Start with Professional',
        false,
      ],
      [
        'Featured',
        '$49.95',
        'Stand out at the top of your city.',
        star,
        [
          'Everything in Professional',
          'Featured placement at the top of your city',
          'Highlighted card with Featured badge',
          'Priority in concern filters & search',
          'Video introduction on your profile',
          'Monthly analytics report',
        ],
        'Get Featured',
        true,
      ],
      [
        'Featured Plus',
        '$79.95',
        'Maximum reach across the network.',
        bolt,
        [
          'Everything in Featured',
          'Featured in your province + up to 3 cities',
          'Shown on rehab centre & substance pages',
          'Homepage therapists spotlight eligibility',
          'Client reviews module',
          'Priority support & profile writing help',
        ],
        'Go Featured Plus',
        false,
      ],
    ];
    const annualPrice = (p) => '$' + (Math.round(parseFloat(p.slice(1)) * 10 * 100) / 100 / 12).toFixed(2);
    const heroPlans = planDefs.map(([name, price], i) => ({
      name,
      price,
      pick: () => {
        this.setState({ plan: i });
        const el = document.getElementById('plans');
        if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 100, behavior: 'smooth' });
      },
      bg: plan === i ? '#10233a' : '#fff',
      color: plan === i ? '#fff' : '#10233a',
      border: plan === i ? '#10233a' : '#e3ecf4',
    }));
    const plans = planDefs.map(([name, price, tag, icon, features, cta, popular], i) => {
      const on = plan === i;
      return {
        name,
        tag,
        icon,
        features,
        cta,
        popular,
        price: annual ? annualPrice(price) : price,
        per: '/month',
        note: annual ? 'Billed annually · ' + price + ' monthly value' : 'Billed monthly · cancel any time',
        pick: () => this.setState({ plan: i }),
        bg: on ? '#10233a' : '#fff',
        color: on ? '#fff' : '#10233a',
        border: on ? '#10233a' : '#e3ecf4',
        muted: on ? '#b7c7d8' : '#6b7f95',
        rule: on ? 'rgba(255,255,255,.14)' : '#edf2f7',
        tick: '#0890E8',
        iconBg: on ? 'rgba(255,255,255,.12)' : '#eaf5fd',
        iconColor: on ? '#7cc4f5' : '#0890E8',
        shadow: on ? '0 40px 80px -40px rgba(16,35,58,.6)' : 'none',
        scale: on ? 'translateY(-6px)' : 'none',
        btnBg: on ? '#0890E8' : '#fff',
        btnColor: on ? '#fff' : '#0890E8',
        btnBorder: '#0890E8',
      };
    });
    const reach = [
      ['Placeholder', 'monthly visitors researching addiction & mental-health support'],
      ['13', 'provinces & territories with directory pages'],
      ['3', 'featured therapists max per city — never crowded'],
      ['48 hrs', 'from sign-up to a live, verified profile'],
    ].map(([v, label]) => ({ v, label }));
    const whyJoin = [
      [
        ic.pin,
        'High-intent visitors',
        'People here are actively searching for help — not browsing. They arrive from Google looking for addiction, trauma and mental-health support in their city.',
      ],
      [
        ic.shield,
        'Verified means trusted',
        'Every profile is checked against the provincial college registry. Clients see the badge; you get credibility before the first call.',
      ],
      [
        ic.phone,
        'Direct enquiries',
        'Message, call and website buttons on your card and profile. Enquiries go straight to you — no middleman, no referral fee.',
      ],
      [
        ic.dual,
        'Alongside treatment centres',
        'The only Canadian directory where therapists sit next to rehab centres, so people leaving or avoiding residential care find you.',
      ],
      [
        ic.doc,
        'Content that ranks',
        'Your profile links from clinically reviewed guides and city pages that already rank, lending authority to your listing.',
      ],
      [
        ic.heart,
        'Priced for solo practice',
        'From $19.95 a month — less than one session — with no contracts, no setup fee and no per-lead charges.',
      ],
    ].map(([icon, title, body]) => ({ icon, title, body }));
    const spokeDefs = [
      ['Directory', 'Find a Therapist · national list', ic.person, false],
      ['Province', 'e.g. Therapists in Ontario', ic.pin, false],
      ['City', 'e.g. Therapists in Toronto', ic.pin, false],
      ['Concern', 'e.g. Trauma & PTSD', ic.heart, false],
      ['Rehab pages', 'Centre & substance pages', ic.leaf, true],
      ['Homepage', 'Therapists spotlight', ic.maple, true],
    ];
    const spokes = spokeDefs.map(([label, eg, icon, featured], i) => {
      const ang = -Math.PI / 2 + i * ((2 * Math.PI) / 6);
      const x = 310 + Math.cos(ang) * 245,
        y = 310 + Math.sin(ang) * 245;
      return {
        label,
        eg,
        icon,
        featured,
        border: featured ? 'rgba(216,32,40,.55)' : 'rgba(255,255,255,.16)',
        x: x.toFixed(1),
        y: y.toFixed(1),
        px: ((x / 620) * 100).toFixed(2) + '%',
        py: ((y / 620) * 100).toFixed(2) + '%',
        d: i * 0.5 + 's',
      };
    });
    const pathSteps = ['Your profile', 'Ontario', 'Toronto', 'Addiction', 'Rehab centre page'].map((label, i, arr) => ({
      label,
      arrow: i < arr.length - 1,
      color: i === 0 ? '#fff' : '#d9ebf9',
      bg: i === 0 ? '#0890E8' : 'rgba(255,255,255,.06)',
      border: i === 0 ? '#0890E8' : 'rgba(255,255,255,.16)',
    }));
    const anatomyDefs = [
      ['Portrait & headline', 'A real photo and one clear sentence about who you help.'],
      ['Verified credentials', 'College, registration number and designation — checked by us.'],
      ['Specialties & concerns', 'Up to 8 tags that power search and filters.'],
      ['Fees & insurance', 'Session fee, sliding scale and receipt details up front.'],
      ['Availability', 'New-client status, hours and session format.'],
      ['Direct contact', 'Message, call and website — enquiries go straight to you.'],
    ];
    const anatomy = anatomyDefs.map(([title, body], i) => {
      const on = anat === i;
      return {
        n: i + 1,
        title,
        body,
        pick: () => this.setState({ anat: i }),
        bg: on ? '#eaf5fd' : '#fff',
        border: on ? '#0890E8' : '#e3ecf4',
        numBg: on ? '#0890E8' : '#f1f6fb',
        numColor: on ? '#fff' : '#516378',
      };
    });
    const hl = (i) => (anat === i ? '#0890E8' : 'transparent');
    const demoTags = ['Addiction', 'Alcohol use', 'Trauma & PTSD', 'Anxiety', 'Couples', 'Family support'];
    const steps = [
      ['01', 'Create your account', 'Name, designation, province and the plan you want. Ten minutes.'],
      ['02', 'We verify you', 'We check your registration with your provincial college — usually within 48 hours.'],
      [
        '03',
        'Build your profile',
        'Add your photo, specialties, fees, availability and a short introduction or video.',
      ],
      ['04', 'Receive enquiries', 'Clients message or call you directly. Track views and enquiries in your dashboard.'],
    ].map(([n, title, body]) => ({ n, title, body }));
    const compareHead = planDefs.map((p, i) => ({
      label: p[0],
      price: p[1] + '/mo',
      color: p[6] ? '#0890E8' : '#10233a',
    }));
    const compareRows = [
      ['Credential-verified profile', '✓', '✓', '✓'],
      ['National directory listing', '✓', '✓', '✓'],
      ['Province & city pages', '✓', '✓', '✓'],
      ['Message, call & website buttons', '✓', '✓', '✓'],
      ['Specialties & concern tags', '8', '12', 'Unlimited'],
      ['Featured placement', '—', 'Top of 1 city', 'Province + 3 cities'],
      ['Featured badge on card', '—', '✓', '✓'],
      ['Video introduction', '—', '✓', '✓'],
      ['Rehab centre & substance pages', '—', '—', '✓'],
      ['Homepage spotlight eligibility', '—', '—', '✓'],
      ['Client reviews module', '—', '—', '✓'],
      ['Analytics', 'Basic', 'Monthly report', 'Monthly report'],
      ['Support', 'Email', 'Email', 'Priority + profile help'],
    ].map(([label, ...cells]) => ({
      label,
      cells: cells.map((v) => ({ v, color: v === '—' ? '#b7c7d8' : v === '✓' ? '#0890E8' : '#1f3550' })),
    }));
    const testimonials = [
      {
        quote: 'Testimonial — a short, specific quote about enquiries received since listing.',
        name: 'Therapist name, RP',
        place: 'Toronto, Ontario',
      },
      {
        quote: 'Testimonial — a short, specific quote about the verification badge or client fit.',
        name: 'Therapist name, RSW',
        place: 'Vancouver, British Columbia',
      },
      {
        quote: 'Testimonial — a short, specific quote about value for money vs other directories.',
        name: 'Therapist name, R.Psych',
        place: 'Calgary, Alberta',
      },
    ];
    const trust = [
      [
        ic.shield,
        'Every profile is verified',
        'We confirm registration with the relevant provincial college before any profile goes live, and re-check annually.',
      ],
      [
        star,
        'Featured is always labelled',
        'Featured profiles carry a visible badge. Paid placement never changes verification status or hides organic listings.',
      ],
      [
        ic.heart,
        'Clients come first',
        'Our free 24/7 helpline and clinically reviewed guides exist for people seeking help. Your listing is part of that ecosystem.',
      ],
    ].map(([icon, title, body]) => ({ icon, title, body }));
    const faqData = [
      [
        'Who can join the directory?',
        'Registered psychotherapists, psychologists, clinical counsellors, social workers and certified addiction counsellors who hold current registration with a Canadian provincial college or recognized certifying body.',
      ],
      [
        'How does verification work?',
        'After sign-up we check your name and registration number against your college\u2019s public registry. Most profiles are verified within 48 hours. You are not charged until verification is complete.',
      ],
      [
        'What does Featured actually do?',
        'Featured profiles appear in a labelled block at the top of your city page, get a highlighted card with a Featured badge, and rank first in concern filters. Featured Plus extends this to your province, up to three cities, and rehab centre and substance pages.',
      ],
      [
        'How many Featured therapists are there per city?',
        'A maximum of three, so Featured placement stays genuinely visible. When a city is full you can join the waitlist.',
      ],
      [
        'Do you charge per lead or take a referral fee?',
        'No. You pay a flat monthly subscription. Every message and call goes directly to you at no extra cost.',
      ],
      [
        'Can I offer online-only sessions?',
        'Yes. Set your session format to online and choose the provinces you are licensed to practise in. You will appear on those province pages.',
      ],
      [
        'Can I cancel or change plans?',
        'Any time. Upgrades take effect immediately; downgrades and cancellations apply at the end of the current billing period. Annual plans include two months free and can be cancelled with a pro-rated refund of unused full months.',
      ],
      [
        'Is this only for addiction therapists?',
        'No. Addiction is our largest audience, but people also search for trauma, anxiety, depression, couples and family support. Your specialties determine where you appear.',
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
    const selP = planDefs[plan];

    return {
      heroViews: cu(486),
      heroMsgs: cu(23),
      heroCalls: cu(11),
      heroBars,
      heroPlans,
      reach,
      whyJoin,
      spokes,
      pathSteps,
      plans,
      setMonthly: () => this.setState({ annual: false }),
      setAnnual: () => this.setState({ annual: true }),
      monthlyBg: annual ? 'transparent' : '#10233a',
      monthlyColor: annual ? '#516378' : '#fff',
      annualBg: annual ? '#10233a' : 'transparent',
      annualColor: annual ? '#fff' : '#516378',
      anatomy,
      demoTags,
      hl1: hl(0),
      hl2: hl(1),
      hl3: hl(2),
      hl4: hl(3),
      hl5: hl(4),
      hl6: hl(5),
      steps,
      compareHead,
      compareRows,
      testimonials,
      trust,
      faqs,
      selectedPlanLabel: selP[0] + ' — ' + selP[1],
      selectedPlanPrice: selP[1],
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
      locations,
      centres,
      programs,
      sliderRef: this.sliderRef,
      onSlideScroll,
      slideDots,
      slidePos: slide + 1 + ' / ' + pages,
      slidePrev: () => this.slideTo(slide - 1, centres.length),
      slideNext: () => this.slideTo(slide + 1, centres.length),
      topRating: this.props.topRating ?? '5.0',
      topReviews: this.props.topReviews ?? '92',
      tabs,
      activeTab: tabData[tab],
      kinds,
      footerCols,
    };
  }
}

/* ───────────────────────── markup ───────────────────────── */
function template(v) {
  const {
    anatomy,
    annualBg,
    annualColor,
    compareHead,
    compareRows,
    demoTags,
    faqs,
    footerCols,
    heroBars,
    heroCalls,
    heroMsgs,
    heroPlans,
    heroViews,
    hl1,
    hl3,
    hl4,
    hl5,
    hl6,
    monthlyBg,
    monthlyColor,
    pathSteps,
    plans,
    reach,
    selectedPlanLabel,
    selectedPlanPrice,
    setAnnual,
    setMonthly,
    spokes,
    steps,
    testimonials,
    trust,
    whyJoin,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="therapists" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        <section
          data-screen-label="Hero"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(1100px 560px at 80% -10%,#dbeefb 0%,rgba(219,238,251,0) 60%),#f7fafd',
            borderBottom: '1px solid #e9eff5',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '80px 32px 88px',
              display: 'grid',
              gridTemplateColumns: '1.05fr .95fr',
              gap: '56px',
              alignItems: 'center',
            }}
            data-cols="1.05fr .95fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                {'For therapists & counsellors'}
              </span>
              <h1 style={{ fontSize: '58px', lineHeight: '1.03', color: '#10233a' }} data-rc-lg="1">
                Grow Your Practice With Addiction Rehab Centres
              </h1>
              <p style={{ fontSize: '19px', lineHeight: '1.55', color: '#516378', maxWidth: '560px' }}>
                Create a professional profile for <strong style={{ color: '#10233a' }}>$19.95/month</strong>. Get
                discovered by people searching for mental health and addiction support across Canada.
              </p>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3,1fr)',
                  gap: '8px',
                  background: '#fff',
                  border: '1px solid #dbe6f0',
                  borderRadius: '16px',
                  padding: '8px',
                  boxShadow: '0 20px 50px -30px rgba(16,35,58,.35)',
                  maxWidth: '560px',
                }}
                data-cols="repeat(3,1fr)"
              >
                {$list(heroPlans).map((hp, $index) => (
                  <Fragment key={$index}>
                    <button
                      className="scpj"
                      onClick={hp?.pick}
                      style={$css(
                        `appearance:none;cursor:pointer;border:1.5px solid ${hp?.border ?? ''};background:${hp?.bg ?? ''};color:${hp?.color ?? ''};border-radius:11px;padding:12px 10px;display:flex;flex-direction:column;align-items:center;gap:3px;transition:all .18s`,
                      )}
                    >
                      <span style={{ font: '600 12.5px Figtree,sans-serif', letterSpacing: '.02em' }}>
                        {$i(hp?.name)}
                      </span>
                      <span style={{ font: '600 20px/1 Jost,sans-serif', fontVariantNumeric: 'tabular-nums' }}>
                        {$i(hp?.price)}
                      </span>
                      <span style={{ fontSize: '11px', opacity: '.7' }}>per month</span>
                    </button>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '2px' }}>
                <$A
                  className="scp1"
                  href={'/auth?mode=signup&type=therapist'}
                  style={{
                    font: '600 16px Jost,sans-serif',
                    color: '#fff',
                    background: '#0890E8',
                    padding: '15px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 24px -12px rgba(8,144,232,.6)',
                  }}
                >
                  Create My Profile
                </$A>
                <$A
                  className="scp2"
                  href="#plans"
                  style={{
                    font: '600 16px Jost,sans-serif',
                    color: '#10233a',
                    background: '#fff',
                    border: '1px solid #dbe6f0',
                    padding: '15px 24px',
                    borderRadius: '12px',
                  }}
                >
                  Compare Plans
                </$A>
              </div>
              <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#6b7f95' }}>
                <span
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    background: '#e9f8ef',
                    color: '#2fb46b',
                    display: 'grid',
                    placeItems: 'center',
                    font: '700 10px Jost,sans-serif',
                  }}
                >
                  ✓
                </span>
                Cancel any time · Live within 48 hours of credential check · No setup fee
              </p>
            </div>
            <div style={{ position: 'relative', height: '620px' }}>
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  top: '0',
                  width: '66%',
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '24px',
                  overflow: 'hidden',
                  boxShadow: '0 40px 80px -30px rgba(16,35,58,.4)',
                  animation: 'floatY 6s ease-in-out infinite',
                }}
              >
                <div
                  style={{ padding: '22px', display: 'grid', gridTemplateColumns: '76px 1fr', gap: '16px' }}
                  data-cols="76px 1fr"
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '76px',
                      height: '76px',
                      borderRadius: '18px',
                      background: 'repeating-linear-gradient(135deg,#dfeaf3 0 10px,#eaf2f8 10px 20px)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <span style={{ font: '500 10px ui-monospace,Menlo,monospace', color: '#516378' }}>portrait</span>
                    <span
                      style={{
                        position: 'absolute',
                        right: '-6px',
                        bottom: '-6px',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        background: '#2fb46b',
                        border: '2px solid #fff',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          width: '9px',
                          height: '5px',
                          borderLeft: '2px solid #fff',
                          borderBottom: '2px solid #fff',
                          transform: 'rotate(-45deg)',
                          marginTop: '-2px',
                        }}
                      />
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', minWidth: '0' }}>
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
                    <div style={{ font: '600 19px Jost,sans-serif' }}>Your Name, RP</div>
                    <div style={{ fontSize: '13px', color: '#0890E8', fontWeight: '500' }}>
                      Registered Psychotherapist (CRPO)
                    </div>
                    <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>{'Toronto, ON · In person & online'}</div>
                  </div>
                </div>
                <div style={{ padding: '0 22px 22px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        font: '500 11.5px Figtree,sans-serif',
                        color: '#1f3550',
                        background: '#eef4f9',
                        padding: '4px 9px',
                        borderRadius: '999px',
                      }}
                    >
                      Addiction
                    </span>
                    <span
                      style={{
                        font: '500 11.5px Figtree,sans-serif',
                        color: '#1f3550',
                        background: '#eef4f9',
                        padding: '4px 9px',
                        borderRadius: '999px',
                      }}
                    >
                      {'Trauma & PTSD'}
                    </span>
                    <span
                      style={{
                        font: '500 11.5px Figtree,sans-serif',
                        color: '#1f3550',
                        background: '#eef4f9',
                        padding: '4px 9px',
                        borderRadius: '999px',
                      }}
                    >
                      Couples
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '12px',
                      borderTop: '1px solid #edf2f7',
                    }}
                  >
                    <div>
                      <div style={{ font: '600 15px Jost,sans-serif' }}>
                        $160 <span style={{ font: '400 12px Figtree,sans-serif', color: '#6b7f95' }}>/ session</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#2fb46b', fontWeight: '500' }}>Accepting new clients</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <span
                        style={{
                          font: '600 13px Jost,sans-serif',
                          color: '#0890E8',
                          border: '1.5px solid #0890E8',
                          height: '34px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0 12px',
                          borderRadius: '9px',
                        }}
                      >
                        Message
                      </span>
                      <span
                        style={{
                          font: '600 13px Jost,sans-serif',
                          color: '#fff',
                          background: '#10233a',
                          height: '34px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          padding: '0 12px',
                          borderRadius: '9px',
                        }}
                      >
                        View
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  bottom: '0',
                  width: '58%',
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '22px',
                  padding: '20px',
                  boxShadow: '0 40px 80px -40px rgba(16,35,58,.35)',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3,1fr)',
                  gap: '12px',
                }}
                data-cols="repeat(3,1fr)"
              >
                <div
                  style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <span
                    style={{
                      font: '600 11.5px Figtree,sans-serif',
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Your last 30 days
                  </span>
                  <span
                    style={{
                      fontSize: '11px',
                      color: '#6b7f95',
                      background: '#f1f6fb',
                      padding: '3px 8px',
                      borderRadius: '999px',
                    }}
                  >
                    Example
                  </span>
                </div>
                <div>
                  <div style={{ font: '600 24px Jost,sans-serif', fontVariantNumeric: 'tabular-nums' }}>
                    {$i(heroViews)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7f95' }}>Profile views</div>
                </div>
                <div>
                  <div style={{ font: '600 24px Jost,sans-serif', fontVariantNumeric: 'tabular-nums' }}>
                    {$i(heroMsgs)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7f95' }}>Messages</div>
                </div>
                <div>
                  <div style={{ font: '600 24px Jost,sans-serif', fontVariantNumeric: 'tabular-nums' }}>
                    {$i(heroCalls)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7f95' }}>Calls</div>
                </div>
                <div
                  style={{
                    gridColumn: '1/-1',
                    height: '64px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '5px',
                    paddingTop: '4px',
                  }}
                >
                  {$list(heroBars).map((bar, $index) => (
                    <Fragment key={$index}>
                      <span
                        style={$css(
                          `flex:1;height:${bar?.h ?? ''};border-radius:4px 4px 0 0;background:${bar?.c ?? ''};transform-origin:bottom;animation:barGrow .7s cubic-bezier(.2,.8,.2,1) both;animation-delay:${bar?.d ?? ''}`,
                        )}
                      />
                    </Fragment>
                  ))}
                </div>
              </div>
              <div
                style={{
                  position: 'absolute',
                  left: '0',
                  bottom: '0',
                  maxWidth: '38%',
                  background: '#10233a',
                  color: '#fff',
                  borderRadius: '14px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  boxShadow: '0 20px 40px -20px rgba(16,35,58,.6)',
                  animation: 'fadeUp .6s ease-out both',
                  animationDelay: '.6s',
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
                <span style={{ font: '500 13px Figtree,sans-serif' }}>New message from a client in Toronto</span>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="Reach" style={{ background: '#fff', borderBottom: '1px solid #e9eff5' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '34px 32px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
              gap: '16px',
            }}
            data-cols="repeat(4,minmax(0,1fr))"
            data-rc-wrap="1"
          >
            {$list(reach).map((rc, $index) => (
              <Fragment key={$index}>
                <div
                  style={{
                    display: 'flex',
                    gap: '14px',
                    alignItems: 'center',
                    padding: '6px 0',
                    borderLeft: '1px solid #e3ecf4',
                    paddingLeft: '20px',
                  }}
                >
                  <div
                    style={{
                      font: '600 34px/1 Jost,sans-serif',
                      color: '#0890E8',
                      fontVariantNumeric: 'tabular-nums',
                      minWidth: '110px',
                    }}
                  >
                    {$i(rc?.v)}
                  </div>
                  <div style={{ fontSize: '13.5px', color: '#516378', lineHeight: '1.4' }}>{$i(rc?.label)}</div>
                </div>
              </Fragment>
            ))}
          </div>
        </section>
        <section data-screen-label="Why join" style={{ background: '#f7fafd' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px' }} data-rc-wrap="1">
            <div style={{ maxWidth: '680px', marginBottom: '40px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Why join
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                Be found by the people who need you most
              </h2>
              <p style={{ fontSize: '16.5px', lineHeight: '1.6', color: '#516378', marginTop: '12px' }}>
                People arrive here already looking for help with addiction, trauma, anxiety and family stress. Your
                profile puts you in front of them at the exact moment they decide to reach out.
              </p>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '16px' }}
              data-cols="repeat(3,minmax(0,1fr))"
            >
              {$list(whyJoin).map((wj, $index) => (
                <Fragment key={$index}>
                  <div
                    className="scp1n"
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '22px',
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      transition: 'transform .2s,border-color .2s,box-shadow .2s',
                    }}
                  >
                    <span
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '13px',
                        background: '#eaf5fd',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {$i(wj?.icon)}
                    </span>
                    <h3 style={{ fontSize: '20px' }}>{$i(wj?.title)}</h3>
                    <p style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#516378' }}>{$i(wj?.body)}</p>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section
          data-screen-label="Where you appear"
          style={{ background: '#10233a', color: '#fff', overflow: 'hidden', position: 'relative' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: '0',
              background: 'radial-gradient(700px 500px at 70% 50%,rgba(8,144,232,.22),rgba(8,144,232,0) 70%)',
            }}
          />
          <div
            style={{
              position: 'relative',
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '96px 32px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '48px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            data-rc-wrap="1"
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                flex: '1 1 380px',
                minWidth: '0',
                maxWidth: '520px',
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
                Where your profile can appear
              </span>
              <h2 style={{ fontSize: '42px', lineHeight: '1.08', color: '#fff' }} data-rc-lg="1">
                One Profile. Every Page That Matters.
              </h2>
              <p style={{ fontSize: '16.5px', lineHeight: '1.65', color: '#b7c7d8', maxWidth: '460px' }}>
                Your profile is listed in the therapist directory and surfaces on province, city and concern pages.
                Featured plans extend you onto rehab centre pages, substance guides and the homepage spotlight.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                <span
                  style={{
                    font: '600 11px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#7fa0bf',
                  }}
                >
                  Example path
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                  {$list(pathSteps).map((ps, $index) => (
                    <Fragment key={$index}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }}>
                        <span
                          style={$css(
                            `font:500 13px Figtree,sans-serif;color:${ps?.color ?? ''};background:${ps?.bg ?? ''};border:1px solid ${ps?.border ?? ''};padding:6px 10px;border-radius:999px;white-space:nowrap`,
                          )}
                        >
                          {$i(ps?.label)}
                        </span>
                        {ps?.arrow ? (
                          <>
                            <span
                              style={{
                                width: '6px',
                                height: '6px',
                                borderRight: '1.5px solid #7fa0bf',
                                borderTop: '1.5px solid #7fa0bf',
                                transform: 'rotate(45deg)',
                              }}
                            />
                          </>
                        ) : null}
                      </span>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3,auto)',
                  gap: '24px',
                  marginTop: '10px',
                  paddingTop: '18px',
                  borderTop: '1px solid rgba(255,255,255,.12)',
                  justifyContent: 'start',
                }}
                data-cols="repeat(3,auto)"
              >
                <div>
                  <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>6</div>
                  <div style={{ fontSize: '12.5px', color: '#b7c7d8', marginTop: '4px' }}>Page types</div>
                </div>
                <div>
                  <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>3</div>
                  <div style={{ fontSize: '12.5px', color: '#b7c7d8', marginTop: '4px' }}>Featured per city</div>
                </div>
                <div>
                  <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>1</div>
                  <div style={{ fontSize: '12.5px', color: '#b7c7d8', marginTop: '4px' }}>Dashboard for it all</div>
                </div>
              </div>
            </div>
            <div
              style={{
                position: 'relative',
                flex: '1 1 560px',
                minWidth: '560px',
                maxWidth: '620px',
                aspectRatio: '1/1',
                margin: '0 auto',
              }}
            >
              <svg
                viewBox="0 0 620 620"
                style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', overflow: 'visible' }}
              >
                <circle cx="310" cy="310" r="245" fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1" />
                <circle
                  cx="310"
                  cy="310"
                  r="120"
                  fill="none"
                  stroke="rgba(255,255,255,.06)"
                  strokeWidth="1"
                  strokeDasharray="4 6"
                />
                {$list(spokes).map((sp, $index) => (
                  <Fragment key={$index}>
                    <line x1="310" y1="310" x2={sp?.x} y2={sp?.y} stroke="rgba(124,196,245,.35)" strokeWidth="1.5" />
                    <line
                      x1="310"
                      y1="310"
                      x2={sp?.x}
                      y2={sp?.y}
                      stroke="#7cc4f5"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="6 260"
                      style={$css(`animation:dashFlow 3.2s linear infinite;animation-delay:${sp?.d ?? ''}`)}
                    />
                  </Fragment>
                ))}
              </svg>
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: '29%',
                  aspectRatio: '1/1',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle at 40% 35%,#3aa8f2,#0890E8 60%,#0670b8)',
                  display: 'grid',
                  placeItems: 'center',
                  textAlign: 'center',
                  boxShadow:
                    '0 0 0 14px rgba(8,144,232,.15),0 0 0 28px rgba(8,144,232,.07),0 30px 60px -20px rgba(8,144,232,.8)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    alignItems: 'center',
                    padding: '0 16px',
                  }}
                >
                  <span
                    style={{
                      font: '600 10.5px Figtree,sans-serif',
                      letterSpacing: '.16em',
                      textTransform: 'uppercase',
                      opacity: '.85',
                    }}
                  >
                    List
                  </span>
                  <span style={{ font: '600 18px/1.15 Jost,sans-serif' }}>YOUR PRACTICE</span>
                </div>
              </div>
              {$list(spokes).map((sp, $index) => (
                <Fragment key={$index}>
                  <div
                    className="scp1o"
                    style={$css(
                      `position:absolute;left:${sp?.px ?? ''};top:${sp?.py ?? ''};transform:translate(-50%,-50%);width:26%;min-width:140px;background:rgba(16,35,58,.85);backdrop-filter:blur(8px);border:1px solid ${sp?.border ?? ''};border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;transition:border-color .2s,background .2s`,
                    )}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: '#7cc4f5', display: 'flex', flexShrink: '0' }}>{$i(sp?.icon)}</span>
                        <span style={{ font: '600 14px Jost,sans-serif', color: '#fff' }}>{$i(sp?.label)}</span>
                      </span>
                      {sp?.featured ? (
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
                        </>
                      ) : null}
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#b7c7d8', lineHeight: '1.35' }}>{$i(sp?.eg)}</span>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section id="plans" data-screen-label="Plans" style={{ background: '#f7fafd' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px' }} data-rc-wrap="1">
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap',
                marginBottom: '40px',
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
                  Plans
                </span>
                <h2 style={{ fontSize: '38px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                  Simple monthly pricing
                </h2>
                <p style={{ fontSize: '16px', color: '#516378', marginTop: '12px' }}>
                  Every plan includes a credential-verified profile. Upgrade or cancel any time.
                </p>
              </div>
              <div
                style={{
                  display: 'flex',
                  background: '#fff',
                  border: '1px solid #dbe6f0',
                  borderRadius: '12px',
                  padding: '4px',
                  gap: '4px',
                }}
              >
                <button
                  onClick={setMonthly}
                  style={$css(
                    `appearance:none;cursor:pointer;border:0;border-radius:9px;padding:9px 16px;font:600 13.5px Figtree,sans-serif;background:${monthlyBg ?? ''};color:${monthlyColor ?? ''};transition:all .18s`,
                  )}
                >
                  Monthly
                </button>
                <button
                  onClick={setAnnual}
                  style={$css(
                    `appearance:none;cursor:pointer;border:0;border-radius:9px;padding:9px 16px;font:600 13.5px Figtree,sans-serif;background:${annualBg ?? ''};color:${annualColor ?? ''};display:flex;align-items:center;gap:8px;transition:all .18s`,
                  )}
                >
                  Annual{' '}
                  <span
                    style={{
                      font: '600 10.5px Jost,sans-serif',
                      letterSpacing: '.06em',
                      color: '#fff',
                      background: '#2fb46b',
                      padding: '3px 7px',
                      borderRadius: '999px',
                    }}
                  >
                    2 MONTHS FREE
                  </span>
                </button>
              </div>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,minmax(0,1fr))',
                gap: '16px',
                alignItems: 'stretch',
              }}
              data-cols="repeat(3,minmax(0,1fr))"
            >
              {$list(plans).map((pl, $index) => (
                <Fragment key={$index}>
                  <div
                    onMouseEnter={pl?.pick}
                    style={$css(
                      `position:relative;background:${pl?.bg ?? ''};color:${pl?.color ?? ''};border:1.5px solid ${pl?.border ?? ''};border-radius:24px;padding:30px 28px;display:flex;flex-direction:column;gap:18px;box-shadow:${pl?.shadow ?? ''};transform:${pl?.scale ?? ''};transition:transform .25s,box-shadow .25s,border-color .2s`,
                    )}
                  >
                    {pl?.popular ? (
                      <>
                        <span
                          style={{
                            position: 'absolute',
                            top: '-13px',
                            left: '28px',
                            background: '#D82028',
                            color: '#fff',
                            font: '600 11px Jost,sans-serif',
                            letterSpacing: '.08em',
                            padding: '5px 10px',
                            borderRadius: '999px',
                          }}
                        >
                          MOST POPULAR
                        </span>
                      </>
                    ) : null}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span
                          style={$css(
                            `width:38px;height:38px;border-radius:11px;background:${pl?.iconBg ?? ''};color:${pl?.iconColor ?? ''};display:grid;place-items:center`,
                          )}
                        >
                          {$i(pl?.icon)}
                        </span>
                        <div style={{ font: '600 18px Jost,sans-serif' }}>{$i(pl?.name)}</div>
                      </div>
                      <p style={$css(`font-size:13.5px;line-height:1.5;color:${pl?.muted ?? ''}`)}>{$i(pl?.tag)}</p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
                        <span style={{ font: '600 42px/1 Jost,sans-serif', fontVariantNumeric: 'tabular-nums' }}>
                          {$i(pl?.price)}
                        </span>
                        <span style={$css(`font-size:14px;color:${pl?.muted ?? ''}`)}>{$i(pl?.per)}</span>
                      </div>
                      <div style={$css(`font-size:12.5px;color:${pl?.muted ?? ''};height:16px`)}>{$i(pl?.note)}</div>
                    </div>
                    <ul
                      style={$css(
                        `display:flex;flex-direction:column;gap:10px;flex:1;padding-top:16px;border-top:1px solid ${pl?.rule ?? ''}`,
                      )}
                    >
                      {$list(pl?.features).map((ft, $index) => (
                        <Fragment key={$index}>
                          <li
                            style={{
                              display: 'flex',
                              gap: '10px',
                              alignItems: 'flex-start',
                              fontSize: '14px',
                              lineHeight: '1.45',
                            }}
                          >
                            <span
                              style={$css(
                                `width:18px;height:18px;border-radius:50%;background:${pl?.tick ?? ''};color:#fff;display:grid;place-items:center;font:700 10px Jost,sans-serif;flex-shrink:0;margin-top:1px`,
                              )}
                            >
                              ✓
                            </span>
                            {$i(ft)}
                          </li>
                        </Fragment>
                      ))}
                    </ul>
                    <$A
                      className="scp1p"
                      href={'/auth?mode=signup&type=therapist'}
                      style={$css(
                        `font:600 15px Jost,sans-serif;color:${pl?.btnColor ?? ''};background:${pl?.btnBg ?? ''};border:1.5px solid ${pl?.btnBorder ?? ''};padding:13px;border-radius:12px;text-align:center`,
                      )}
                    >
                      {$i(pl?.cta)}
                    </$A>
                  </div>
                </Fragment>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: '#6b7f95', marginTop: '16px', textAlign: 'center' }}>
              Prices in CAD, plus applicable taxes. Featured placements are limited to three per city and are clearly
              labelled.
            </p>
          </div>
        </section>
        <section data-screen-label="Your profile" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '88px 32px',
              display: 'grid',
              gridTemplateColumns: '1fr 1.1fr',
              gap: '64px',
              alignItems: 'center',
            }}
            data-cols="1fr 1.1fr"
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
                Your profile
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12' }} data-rc-lg="1">
                Everything a client needs to say yes
              </h2>
              <p style={{ fontSize: '16.5px', lineHeight: '1.65', color: '#516378' }}>
                A complete, verified profile that answers the questions people actually have before they reach out — who
                you are, what you help with, what it costs and how to book.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
                {$list(anatomy).map((an, $index) => (
                  <Fragment key={$index}>
                    <button
                      onMouseEnter={an?.pick}
                      onClick={an?.pick}
                      style={$css(
                        `appearance:none;cursor:pointer;text-align:left;border:1px solid ${an?.border ?? ''};background:${an?.bg ?? ''};border-radius:14px;padding:14px 16px;display:grid;grid-template-columns:28px 1fr;gap:12px;align-items:center;transition:all .18s`,
                      )}
                    >
                      <span
                        style={$css(
                          `width:28px;height:28px;border-radius:50%;background:${an?.numBg ?? ''};color:${an?.numColor ?? ''};display:grid;place-items:center;font:600 12.5px Jost,sans-serif`,
                        )}
                      >
                        {$i(an?.n)}
                      </span>
                      <div>
                        <div style={{ font: '600 15px Jost,sans-serif', color: '#10233a' }}>{$i(an?.title)}</div>
                        <div style={{ fontSize: '13px', color: '#6b7f95', lineHeight: '1.45', marginTop: '2px' }}>
                          {$i(an?.body)}
                        </div>
                      </div>
                    </button>
                  </Fragment>
                ))}
              </div>
            </div>
            <div
              style={{
                position: 'relative',
                background: '#f7fafd',
                border: '1px solid #e3ecf4',
                borderRadius: '28px',
                padding: '28px',
                boxShadow: '0 40px 80px -50px rgba(16,35,58,.35)',
              }}
            >
              <div
                style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '22px', overflow: 'hidden' }}
              >
                <div
                  style={$css(
                    `padding:22px;display:grid;grid-template-columns:96px 1fr;gap:18px;border:2px solid ${hl1 ?? ''};border-radius:22px 22px 0 0;transition:border-color .2s`,
                  )}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '96px',
                      height: '96px',
                      borderRadius: '20px',
                      background: 'repeating-linear-gradient(135deg,#dfeaf3 0 10px,#eaf2f8 10px 20px)',
                      display: 'grid',
                      placeItems: 'center',
                    }}
                  >
                    <span style={{ font: '500 10px ui-monospace,Menlo,monospace', color: '#516378' }}>portrait</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <div style={{ font: '600 22px Jost,sans-serif' }}>Your Name, RP, MA</div>
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
                        Verified · CRPO #00000
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#0890E8', fontWeight: '500' }}>
                      Registered Psychotherapist · 12 years experience
                    </div>
                    <div style={{ fontSize: '13px', color: '#6b7f95' }}>
                      {'Toronto, ON · In person & online · English, French'}
                    </div>
                  </div>
                </div>
                <div style={{ padding: '0 22px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div
                    style={$css(
                      `display:flex;gap:6px;flex-wrap:wrap;padding:8px;border:2px solid ${hl3 ?? ''};border-radius:14px;transition:border-color .2s`,
                    )}
                  >
                    {$list(demoTags).map((dt, $index) => (
                      <Fragment key={$index}>
                        <span
                          style={{
                            font: '500 12px Figtree,sans-serif',
                            color: '#1f3550',
                            background: '#eef4f9',
                            padding: '5px 10px',
                            borderRadius: '999px',
                          }}
                        >
                          {$i(dt)}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} data-cols="1fr 1fr">
                    <div
                      style={$css(
                        `border:2px solid ${hl4 ?? ''};border-radius:14px;padding:12px 14px;background:#f7fafd;transition:border-color .2s`,
                      )}
                    >
                      <div
                        style={{
                          font: '600 11px Figtree,sans-serif',
                          letterSpacing: '.1em',
                          textTransform: 'uppercase',
                          color: '#6b7f95',
                        }}
                      >
                        Fees
                      </div>
                      <div style={{ font: '600 17px Jost,sans-serif', marginTop: '4px' }}>
                        $160 <span style={{ font: '400 12px Figtree,sans-serif', color: '#6b7f95' }}>/ 50 min</span>
                      </div>
                      <div style={{ fontSize: '12px', color: '#516378', marginTop: '2px' }}>
                        Sliding scale · Insurance receipts
                      </div>
                    </div>
                    <div
                      style={$css(
                        `border:2px solid ${hl5 ?? ''};border-radius:14px;padding:12px 14px;background:#f7fafd;transition:border-color .2s`,
                      )}
                    >
                      <div
                        style={{
                          font: '600 11px Figtree,sans-serif',
                          letterSpacing: '.1em',
                          textTransform: 'uppercase',
                          color: '#6b7f95',
                        }}
                      >
                        Availability
                      </div>
                      <div style={{ font: '600 17px Jost,sans-serif', marginTop: '4px', color: '#2fb46b' }}>
                        Accepting clients
                      </div>
                      <div style={{ fontSize: '12px', color: '#516378', marginTop: '2px' }}>Evenings · Weekends</div>
                    </div>
                  </div>
                  <div
                    style={$css(
                      `display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;padding:8px;border:2px solid ${hl6 ?? ''};border-radius:14px;transition:border-color .2s`,
                    )}
                  >
                    <span
                      style={{
                        font: '600 14px Jost,sans-serif',
                        color: '#fff',
                        background: '#0890E8',
                        height: '42px',
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '10px',
                      }}
                    >
                      Message
                    </span>
                    <span
                      style={{
                        font: '600 14px Jost,sans-serif',
                        color: '#10233a',
                        border: '1.5px solid #dbe6f0',
                        height: '42px',
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '10px',
                      }}
                    >
                      Call
                    </span>
                    <span
                      style={{
                        font: '600 14px Jost,sans-serif',
                        color: '#10233a',
                        border: '1.5px solid #dbe6f0',
                        height: '42px',
                        display: 'grid',
                        placeItems: 'center',
                        borderRadius: '10px',
                      }}
                    >
                      Website
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="How it works" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px' }} data-rc-wrap="1">
            <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                How it works
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                Live in 48 hours
              </h2>
            </div>
            <div
              style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}
              data-cols="repeat(4,1fr)"
            >
              <span
                style={{
                  position: 'absolute',
                  left: '6%',
                  right: '6%',
                  top: '26px',
                  height: '1px',
                  background: '#dbe6f0',
                }}
              />
              {$list(steps).map((st, $index) => (
                <Fragment key={$index}>
                  <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <span
                      style={{
                        width: '52px',
                        height: '52px',
                        borderRadius: '50%',
                        background: '#0890E8',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        font: '600 16px Jost,sans-serif',
                        boxShadow: '0 0 0 8px #f7fafd',
                      }}
                    >
                      {$i(st?.n)}
                    </span>
                    <h3 style={{ fontSize: '19px' }}>{$i(st?.title)}</h3>
                    <p style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#516378' }}>{$i(st?.body)}</p>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section data-screen-label="Plan comparison" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px' }} data-rc-wrap="1">
            <div style={{ maxWidth: '640px', marginBottom: '36px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Compare
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                What's included
              </h2>
            </div>
            <div style={{ border: '1px solid #e3ecf4', borderRadius: '20px', overflow: 'hidden' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.8fr repeat(3,1fr)',
                  background: '#f7fafd',
                  borderBottom: '1px solid #e3ecf4',
                }}
                data-cols="1.8fr repeat(3,1fr)"
              >
                <span
                  style={{
                    padding: '16px 20px',
                    font: '600 11.5px Figtree,sans-serif',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: '#6b7f95',
                  }}
                >
                  Feature
                </span>
                {$list(compareHead).map((c, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={{
                        padding: '14px 12px',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                    >
                      <span style={$css(`font:600 14px Jost,sans-serif;color:${c?.color ?? ''}`)}>{$i(c?.label)}</span>
                      <span style={{ fontSize: '12px', color: '#6b7f95' }}>{$i(c?.price)}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
              {$list(compareRows).map((r, $index) => (
                <Fragment key={$index}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.8fr repeat(3,1fr)',
                      borderBottom: '1px solid #f0f4f8',
                      alignItems: 'center',
                    }}
                    data-cols="1.8fr repeat(3,1fr)"
                  >
                    <span style={{ padding: '13px 20px', fontSize: '14px', color: '#1f3550' }}>{$i(r?.label)}</span>
                    {$list(r?.cells).map((c, $index) => (
                      <Fragment key={$index}>
                        <span
                          style={$css(
                            `padding:13px 12px;text-align:center;font:500 13.5px Figtree,sans-serif;color:${c?.color ?? ''};font-variant-numeric:tabular-nums`,
                          )}
                        >
                          {$i(c?.v)}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section data-screen-label="Testimonials" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px' }} data-rc-wrap="1">
            <div style={{ maxWidth: '640px', marginBottom: '36px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Therapists on the platform
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                What members say
              </h2>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }}
              data-cols="repeat(3,1fr)"
            >
              {$list(testimonials).map((tm, $index) => (
                <Fragment key={$index}>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '22px',
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '18px',
                    }}
                  >
                    <div style={{ display: 'flex', gap: '3px', color: '#f5b301' }}>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                      <span>★</span>
                    </div>
                    <p style={{ font: '500 17px/1.5 Jost,sans-serif', color: '#10233a', flex: '1' }}>
                      "{$i(tm?.quote)}"
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        paddingTop: '14px',
                        borderTop: '1px solid #edf2f7',
                      }}
                    >
                      <span
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '50%',
                          background: 'repeating-linear-gradient(135deg,#dfeaf3 0 6px,#eaf2f8 6px 12px)',
                          flexShrink: '0',
                        }}
                      />
                      <div>
                        <div style={{ font: '600 15px Jost,sans-serif' }}>{$i(tm?.name)}</div>
                        <div style={{ fontSize: '13px', color: '#6b7f95' }}>{$i(tm?.place)}</div>
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section data-screen-label="Trust" style={{ background: '#eaf5fd', borderTop: '1px solid #d5e8f7' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px' }} data-rc-wrap="1">
            <div style={{ maxWidth: '720px', margin: '0 auto 40px', textAlign: 'center' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Our commitment
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                A directory people can trust — so they trust you
              </h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                gap: '16px',
                maxWidth: '1000px',
                margin: '0 auto',
              }}
              data-cols="repeat(3,1fr)"
              data-rc-wrap="1"
            >
              {$list(trust).map((tr, $index) => (
                <Fragment key={$index}>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #d5e8f7',
                      borderRadius: '22px',
                      padding: '28px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#0890E8',
                        color: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {$i(tr?.icon)}
                    </span>
                    <h3 style={{ fontSize: '19px' }}>{$i(tr?.title)}</h3>
                    <p style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#516378' }}>{$i(tr?.body)}</p>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section id="faq" data-screen-label="FAQ" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '88px 32px',
              display: 'grid',
              gridTemplateColumns: '.8fr 1.2fr',
              gap: '64px',
              alignItems: 'start',
            }}
            data-cols=".8fr 1.2fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div style={{ position: 'sticky', top: '130px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
              <h2 style={{ fontSize: '38px', lineHeight: '1.12' }} data-rc-lg="1">
                Questions therapists ask
              </h2>
              <$A
                className="scp7"
                href="mailto:info@addictionrehabcenters.ca"
                style={{
                  alignSelf: 'flex-start',
                  font: '600 15px Jost,sans-serif',
                  color: '#0890E8',
                  border: '1.5px solid #0890E8',
                  padding: '11px 18px',
                  borderRadius: '10px',
                }}
              >
                Email our team
              </$A>
            </div>
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
                        padding: '20px 22px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        font: '600 17px Jost,sans-serif',
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
                            padding: '0 22px 22px',
                            fontSize: '15.5px',
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
        <section id="signup" data-screen-label="Sign up" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px 0' }} data-rc-wrap="1">
            <div
              style={{
                background: 'linear-gradient(135deg,#0f5fa8,#0890E8)',
                borderRadius: '30px 30px 0 0',
                padding: '64px 56px',
                color: '#fff',
                display: 'grid',
                gridTemplateColumns: '1.1fr .9fr',
                gap: '48px',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
              data-cols="1.1fr .9fr"
              data-rc-gap="1"
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
                <h2 style={{ fontSize: '40px', lineHeight: '1.1', color: '#fff' }} data-rc-lg="1">
                  Start growing your practice today
                </h2>
                <p style={{ fontSize: '17px', lineHeight: '1.55', opacity: '.92', maxWidth: '520px' }}>
                  Create your profile in about ten minutes. We verify your registration, then you're live across
                  Canada's most visited addiction and mental-health directory.
                </p>
                <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', marginTop: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                        font: '700 10px Jost,sans-serif',
                      }}
                    >
                      ✓
                    </span>
                    From $19.95/month
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                        font: '700 10px Jost,sans-serif',
                      }}
                    >
                      ✓
                    </span>
                    Cancel any time
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                    <span
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        background: '#fff',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                        font: '700 10px Jost,sans-serif',
                      }}
                    >
                      ✓
                    </span>
                    No setup fee
                  </span>
                </div>
              </div>
              <form
                action="#"
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
                <div style={{ font: '600 19px Jost,sans-serif' }}>Create your profile</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} data-cols="1fr 1fr">
                  <input
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
                    placeholder="Designation (e.g. RP, RSW)"
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
                <input
                  type="email"
                  placeholder="Work email"
                  style={{
                    border: '1px solid #dbe6f0',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    font: '500 14px Figtree,sans-serif',
                    outline: 'none',
                    width: '100%',
                  }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} data-cols="1fr 1fr">
                  <select
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
                    <option>Ontario</option>
                    <option>British Columbia</option>
                    <option>Alberta</option>
                    <option>Quebec</option>
                    <option>Manitoba</option>
                    <option>Saskatchewan</option>
                    <option>Nova Scotia</option>
                    <option>New Brunswick</option>
                    <option>Other</option>
                  </select>
                  <select
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
                    <option>{$i(selectedPlanLabel)}</option>
                    <option>Professional — $19.95</option>
                    <option>Featured — $49.95</option>
                    <option>Featured Plus — $79.95</option>
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
                  Continue — {$i(selectedPlanPrice)}
                  /month
                </button>
                <p style={{ fontSize: '12px', color: '#6b7f95', lineHeight: '1.5', textAlign: 'center' }}>
                  You won't be charged until your credentials are verified.{' '}
                  <$A href="https://addictionrehabcenters.ca/terms-of-use/">Terms</$A> ·{' '}
                  <$A href="https://addictionrehabcenters.ca/privacy-policy/">Privacy</$A>
                </p>
              </form>
            </div>
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
                href="https://addictionrehabcenters.ca/"
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
                <$A
                  className="scpe"
                  href="https://addictionrehabcenters.ca/promote-your-centre/"
                  style={{ color: '#b7c7d8' }}
                >
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
  '\nhtml,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\n@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@keyframes barGrow{from{transform:scaleY(0)}to{transform:scaleY(1)}}\n@keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(8,144,232,.45)}70%{box-shadow:0 0 0 10px rgba(8,144,232,0)}}\n@keyframes dashFlow{from{stroke-dashoffset:266}to{stroke-dashoffset:0}}\n@keyframes floatY{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important}}\n';
export const css = [ownCss, SiteHeader_css].filter(Boolean).join('\n');
export const defaults = {};
const View = createDC('JoinDirectory', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} responsive {...props} />;
}
