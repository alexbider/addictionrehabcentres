'use client';
// Generated from Promote.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = { menu: null, tab: 0, slide: 0, faq: 0, t: 0, sel: ['City', 'Substance'] };
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

    // ---- Promote page data ----
    const { faq, t } = this.state;
    const cu = (n) => Math.round(n * t).toLocaleString('en-CA');
    const heroSeries = [30, 42, 38, 55, 61, 58, 70, 66, 78, 84, 80, 92, 88, 100];
    const heroBars = heroSeries.map((v, i) => ({
      h: v + '%',
      c: i === heroSeries.length - 1 ? '#0890E8' : '#cfe6f9',
      d: i * 40 + 'ms',
    }));
    const benefits = [
      { icon: ic.pin, title: 'Increase Visibility', body: 'Get discovered across relevant treatment searches.' },
      {
        icon: ic.dual,
        title: 'Reach Relevant Markets',
        body: 'Promote your centre by city, province, substance and treatment type.',
      },
      {
        icon: ic.doc,
        title: 'Build a Stronger Profile',
        body: 'Show programs, services, photos, amenities, staff and more.',
      },
      { icon: ic.heart, title: 'Measure Results', body: 'Track impressions, profile visits, calls and enquiries.' },
    ];
    const spokeDefs = [
      ['Canada', 'Homepage & national lists', ic.maple],
      ['Province', 'e.g. Ontario Rehabs', ic.pin],
      ['City', 'e.g. Toronto Rehabs', ic.pin],
      ['Substance', 'e.g. Alcohol Addiction', ic.glass],
      ['Treatment', 'e.g. Residential Treatment', ic.leaf],
      ['Condition', 'e.g. Dual Diagnosis', ic.dual],
      ['Guides', 'e.g. Cost of Rehab Guide', ic.doc],
    ];
    const spokes = spokeDefs.map(([label, eg, icon], i) => {
      const ang = -Math.PI / 2 + i * ((2 * Math.PI) / 7);
      const x = 310 + Math.cos(ang) * 245,
        y = 310 + Math.sin(ang) * 245;
      return {
        label,
        eg,
        icon,
        x: x.toFixed(1),
        y: y.toFixed(1),
        px: ((x / 620) * 100).toFixed(2) + '%',
        py: ((y / 620) * 100).toFixed(2) + '%',
        d: i * 0.45 + 's',
      };
    });
    const pathSteps = [
      'Your Centre',
      'Ontario',
      'Toronto',
      'Alcohol',
      'Residential Treatment',
      'Cost of Rehab Guide',
    ].map((label, i, arr) => ({
      label,
      arrow: i < arr.length - 1,
      color: i === 0 ? '#fff' : '#d9ebf9',
      bg: i === 0 ? '#0890E8' : 'rgba(255,255,255,.06)',
      border: i === 0 ? '#0890E8' : 'rgba(255,255,255,.16)',
    }));
    const pageTypes = [
      ['Canada', 'Homepage & national lists', ic.maple],
      ['Province', 'e.g. Ontario Rehabs', ic.pin],
      ['City', 'e.g. Toronto Rehabs', ic.pin],
      ['Substance', 'e.g. Alcohol Addiction', ic.glass],
      ['Treatment', 'e.g. Residential Treatment', ic.leaf],
      ['Condition', 'e.g. Dual Diagnosis', ic.dual],
      ['Guides', 'e.g. Cost of Rehab Guide', ic.doc],
    ].map(([label, eg, icon]) => ({ label, eg, icon }));
    const planDefs = [
      [
        'Verified',
        '$199',
        '/mo',
        ['Enhanced profile', 'Provider dashboard', 'Photos & video', 'Analytics', 'Calls & lead tracking'],
        'Get Verified',
        false,
      ],
      [
        'Local',
        '$399',
        '/mo',
        ['Everything in Verified', '1 City sponsorship', '1 Substance sponsorship', '1 Treatment sponsorship'],
        'Promote Locally',
        false,
      ],
      [
        'Growth',
        '$699',
        '/mo',
        [
          '1 Province',
          '2 Cities',
          '2 Substances',
          '2 Treatment/Condition pages',
          '2 Guide placements',
          'Advanced analytics',
        ],
        'Grow Your Visibility',
        true,
      ],
      [
        'Premium',
        '$1,299',
        '/mo',
        [
          'Up to 4 cities',
          '4 substances',
          '4 treatment/condition pages',
          '5 content placements',
          'Priority sponsorship visibility',
          'Advanced reporting',
        ],
        'Go Premium',
        false,
      ],
      [
        'National',
        '$2,500',
        '/mo',
        [
          'National exposure',
          'Multiple provinces',
          'Multi-location support',
          'Homepage eligibility',
          'Custom placements',
          'Dedicated reporting',
        ],
        'Talk to Our Team',
        false,
      ],
    ];
    const plans = planDefs.map(([name, price, per, features, cta, popular]) => ({
      name,
      price,
      per,
      features,
      cta,
      popular,
      prefix: name === 'National' ? 'From' : '',
      bg: popular ? '#10233a' : '#fff',
      color: popular ? '#fff' : '#10233a',
      border: popular ? '#10233a' : '#e3ecf4',
      muted: popular ? '#b7c7d8' : '#6b7f95',
      tick: popular ? '#0890E8' : '#0890E8',
      shadow: popular ? '0 40px 80px -40px rgba(16,35,58,.6)' : 'none',
      btnBg: popular ? '#0890E8' : '#fff',
      btnColor: popular ? '#fff' : '#0890E8',
      btnBorder: '#0890E8',
    }));
    const placements = [
      ['Homepage', '$1,000', ic.maple, 'Featured on the most visited page in the network.'],
      ['Province', '$500', ic.pin, 'Top of a province directory, e.g. Ontario Rehabs.'],
      ['City', '$200', ic.pin, 'Top of a city list, e.g. Toronto Rehabs.'],
      ['Substance', '$350', ic.glass, 'Alongside a substance guide, e.g. Alcohol Addiction.'],
      ['Condition', '$350', ic.dual, 'Alongside a condition page, e.g. Dual Diagnosis.'],
      ['Treatment', '$300', ic.leaf, 'On a treatment-type page, e.g. Residential Rehab.'],
      ['Guides', '$200', ic.doc, 'Inside educational guides, e.g. Cost of Rehab.'],
    ].map(([label, price, icon, body]) => ({ label, price, icon, body }));
    const sel = this.state.sel;
    const layout = {
      Homepage: ['1 / 3', '1 / 3'],
      Province: ['3 / 4', '1'],
      City: ['4 / 5', '1'],
      Substance: ['3 / 4', '2'],
      Condition: ['4 / 5', '2'],
      Treatment: ['1 / 3', '3'],
      Guides: ['3 / 5', '3'],
    };
    const placementCards = placements.map((p) => {
      const on = sel.includes(p.label);
      const big = p.label === 'Homepage';
      const dark = big;
      return {
        ...p,
        on,
        big,
        col: layout[p.label][0],
        row: layout[p.label][1],
        toggle: () => this.setState({ sel: on ? sel.filter((x) => x !== p.label) : [...sel, p.label] }),
        bg: dark ? 'linear-gradient(160deg,#0f5fa8,#10233a)' : on ? '#eaf5fd' : '#f7fafd',
        color: dark ? '#fff' : '#10233a',
        border: on ? '#0890E8' : dark ? '#10233a' : '#e3ecf4',
        shadow: on ? '0 20px 40px -24px rgba(8,144,232,.6)' : 'none',
        iconBg: dark ? 'rgba(255,255,255,.1)' : '#fff',
        iconBorder: dark ? 'rgba(255,255,255,.18)' : '#e3ecf4',
        iconColor: dark ? '#7cc4f5' : '#0890E8',
        muted: dark ? '#b7c7d8' : '#516378',
        rule: dark ? 'rgba(255,255,255,.14)' : '#e3ecf4',
        linkColor: dark ? '#7cc4f5' : '#0890E8',
        checkBorder: on ? '#0890E8' : dark ? 'rgba(255,255,255,.4)' : '#b7c7d8',
        checkBg: on ? '#0890E8' : 'transparent',
        mark: on ? '✓' : '',
        titleSize: big ? '26px' : '18px',
        ctaText: on ? 'Selected' : 'Add to selection',
      };
    });
    const priceNum = (s) => parseInt(s.replace(/[^0-9]/g, ''), 10);
    const selTotal =
      '$' +
      placements
        .filter((p) => sel.includes(p.label))
        .reduce((a, p) => a + priceNum(p.price), 0)
        .toLocaleString('en-CA');
    const mockSponsored = ['Sponsored Centre A', 'Sponsored Centre B', 'Sponsored Centre C'];
    const mockOrganic = ['Bellwood Health Services', 'Addiction Rehab Toronto', 'Renascent Treatment Centre'];
    const steps = [
      ['01', 'Claim & verify', 'Confirm your centre by phone or business email.'],
      ['02', 'Build your profile', 'Add programs, pricing, photos, video and your clinical team.'],
      ['03', 'Choose sponsorships', 'Pick the province, city, substance and guide pages you want.'],
      ['04', 'Track results', 'Watch impressions, calls and enquiries in your dashboard.'],
    ].map(([n, title, body]) => ({ n, title, body }));
    const kpis = [
      ['8,420', 'Sponsored Impressions', '+18% vs last month'],
      ['391', 'Profile Views', '+12%'],
      ['94', 'Website Visits', '+9%'],
      ['27', 'Calls', '+22%'],
      ['12', 'Enquiries', '+3'],
    ].map(([v, label, delta]) => ({ v, label, delta }));
    const series = [46, 52, 49, 61, 58, 70, 74, 69, 82, 88, 91, 100];
    const chartBars = series.map((v, i) => ({
      h: v + '%',
      c: i >= 9 ? '#0890E8' : '#cfe6f9',
      d: i * 50 + 'ms',
      t: 'Week ' + (i + 1),
    }));
    const topSponsors = [
      ['Toronto', 2840, 100],
      ['Alcohol Treatment', 2210, 78],
      ['Ontario', 1760, 62],
      ['Residential Treatment', 980, 35],
      ['Rehab Cost Guide', 630, 22],
    ].map(([label, v, w], i) => ({ label, v: v.toLocaleString('en-CA'), w: w + '%', d: 200 + i * 80 + 'ms' }));
    const inventory = [
      ['Toronto', 'City', 4],
      ['Ontario', 'Province', 5],
      ['Alcohol Treatment', 'Substance', 2],
      ['Residential Treatment', 'Treatment', 3],
    ].map(([label, type, used]) => {
      const full = used === 5;
      return {
        label,
        type,
        dots: [0, 1, 2, 3, 4].map((i) => (i < used ? (full ? '#10233a' : '#0890E8') : '#dbe6f0')),
        status: full ? 'Currently full' : used + ' of 5 placements reserved',
        statusColor: full ? '#6b7f95' : '#1f3550',
        cta: full ? 'Join Waitlist' : 'Reserve placement',
        ctaColor: full ? '#6b7f95' : '#0890E8',
      };
    });
    const testimonials = [
      {
        quote: 'Testimonial — collect a short, specific quote from the centre about enquiries or visibility.',
        name: 'Metamorphosis Centre for Change',
        place: 'Wasaga Beach, Ontario',
      },
      {
        quote: 'Testimonial — collect a short, specific quote from the centre about enquiries or visibility.',
        name: 'Inspire Change Wellness Center',
        place: 'White Rock, British Columbia',
      },
    ];
    const media = ['Yahoo', 'Forbes', 'Entrepreneur', 'LegitScript'];
    const founding = [
      'Priority onboarding',
      'Growth sponsorship package',
      'Early feature access',
      'Founding Partner recognition',
      '12-month rate lock',
    ];
    const aboutStats = [
      ['2015', 'Founded · Toronto, Ontario'],
      ['1,000+', 'Directory records & treatment resources across Canada'],
      ['24/7', 'Free helpline for people seeking treatment'],
      ['13', 'Provinces & territories covered'],
    ].map(([v, label]) => ({ v, label }));
    const compareHead = planDefs.map((p) => ({ label: p[0], color: p[5] ? '#0890E8' : '#10233a' }));
    const compareRows = [
      ['Monthly price', '$199', '$399', '$699', '$1,299', 'From $2,500'],
      ['Enhanced profile & dashboard', '✓', '✓', '✓', '✓', '✓'],
      ['Province sponsorships', '—', '—', '1', 'Multiple', 'Multiple'],
      ['City sponsorships', '—', '1', '2', 'Up to 4', 'Custom'],
      ['Substance sponsorships', '—', '1', '2', '4', 'Custom'],
      ['Treatment / condition pages', '—', '1', '2', '4', 'Custom'],
      ['Guide / content placements', '—', '—', '2', '5', 'Custom'],
      ['Homepage eligibility', '—', '—', '—', '—', '✓'],
      ['Analytics', 'Standard', 'Standard', 'Advanced', 'Advanced reporting', 'Dedicated reporting'],
      ['Multi-location support', '—', '—', '—', '—', '✓'],
    ].map(([label, ...cells]) => ({
      label,
      cells: cells.map((v) => ({ v, color: v === '—' ? '#b7c7d8' : v === '✓' ? '#0890E8' : '#1f3550' })),
    }));
    const promoFaqData = [
      [
        'Does sponsorship affect organic rankings?',
        'No. Sponsored placements appear in a clearly labelled block. The organic directory below is ranked independently by verification status, completeness and reviews — sponsorship never changes that order.',
      ],
      [
        'What\u2019s the difference between Verified and Sponsored?',
        'Verified means the centre has claimed its listing and confirmed its details with us — every plan includes it. Sponsored means the centre has purchased additional, labelled visibility on specific pages.',
      ],
      [
        'Can I sponsor more than one city?',
        'Yes. Local includes one city; Growth includes two, Premium up to four, and National is custom. Additional cities can be added to any plan as placements.',
      ],
      [
        'Can I advertise in a city where my centre isn\u2019t located?',
        'Yes, if you admit clients from that area. Sponsored cards always show your real location so visitors are never misled.',
      ],
      [
        'How many centres can sponsor each page?',
        'A maximum of five. When a page is full you can join the waitlist and we will notify you when a placement opens.',
      ],
      [
        'What happens when a placement is sold out?',
        'You can reserve the next available slot from the waitlist. Existing sponsors keep their placement as long as their plan is active.',
      ],
      [
        'Can I track calls and enquiries?',
        'Yes. Your provider dashboard shows impressions, profile views, website visits, tracked calls and callback enquiries, broken down by sponsorship.',
      ],
      [
        'Can I cancel my plan?',
        'Plans are monthly and can be cancelled any time; your sponsorships remain live to the end of the paid period. Founding Partner pricing requires a 12-month term in exchange for the locked rate.',
      ],
      [
        'Do you offer annual plans?',
        'Yes. Annual billing is available on every plan — talk to our team for current terms.',
      ],
    ];
    const promoFaqs = promoFaqData.map(([question, answer], i) => ({
      question,
      answer,
      open: i === faq,
      toggle: () => this.setState({ faq: faq === i ? -1 : i }),
      border: i === faq ? '#0890E8' : '#e3ecf4',
      rot: i === faq ? 'rotate(45deg)' : 'rotate(0deg)',
    }));

    return {
      heroImpressions: (Math.round(12.4 * t * 10) / 10).toFixed(1) + 'K',
      heroViews: cu(421),
      heroCalls: cu(34),
      heroBars,
      benefits,
      pageTypes,
      spokes,
      pathSteps,
      plans,
      placements,
      placementCards,
      selCount: sel.length,
      selTotal,
      selChips: sel,
      clearSel: () => this.setState({ sel: [] }),
      mockSponsored,
      mockOrganic,
      steps,
      kpis,
      chartBars,
      topSponsors,
      inventory,
      testimonials,
      media,
      founding,
      aboutStats,
      compareHead,
      compareRows,
      promoFaqs,
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
    aboutStats,
    benefits,
    chartBars,
    clearSel,
    compareHead,
    compareRows,
    footerCols,
    founding,
    heroBars,
    heroCalls,
    heroImpressions,
    heroViews,
    inventory,
    kpis,
    media,
    mockOrganic,
    mockSponsored,
    pathSteps,
    placementCards,
    plans,
    promoFaqs,
    selChips,
    selCount,
    selTotal,
    spokes,
    steps,
    testimonials,
    topSponsors,
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
              gridTemplateColumns: '1fr 1fr',
              gap: '56px',
              alignItems: 'center',
            }}
            data-cols="1fr 1fr"
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
                For treatment providers
              </span>
              <h1 style={{ fontSize: '60px', lineHeight: '1.03', color: '#10233a' }} data-rc-lg="1">
                Promote Your Rehab Centre
              </h1>
              <p style={{ fontSize: '19px', lineHeight: '1.55', color: '#516378', maxWidth: '560px' }}>
                Reach people actively searching for private addiction treatment across Canada with enhanced profiles,
                targeted sponsorships and measurable visibility.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                <$A
                  className="scp1"
                  href="#plans"
                  style={{
                    font: '600 16px Jost,sans-serif',
                    color: '#fff',
                    background: '#0890E8',
                    padding: '15px 24px',
                    borderRadius: '12px',
                    boxShadow: '0 10px 24px -12px rgba(8,144,232,.6)',
                  }}
                >
                  View Plans
                </$A>
                <$A
                  className="scp2"
                  href="#contact"
                  style={{
                    font: '600 16px Jost,sans-serif',
                    color: '#10233a',
                    background: '#fff',
                    border: '1px solid #dbe6f0',
                    padding: '15px 24px',
                    borderRadius: '12px',
                  }}
                >
                  Talk to Our Team
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
                Sponsored placements are clearly identified and never influence organic rankings.
              </p>
            </div>
            <div style={{ position: 'relative', height: '460px' }}>
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  top: '0',
                  width: '78%',
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '22px',
                  padding: '22px',
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
                    Last 30 days
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
                    Example data
                  </span>
                </div>
                <div>
                  <div style={{ font: '600 26px Jost,sans-serif', fontVariantNumeric: 'tabular-nums' }}>
                    {$i(heroImpressions)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7f95' }}>Impressions</div>
                </div>
                <div>
                  <div style={{ font: '600 26px Jost,sans-serif', fontVariantNumeric: 'tabular-nums' }}>
                    {$i(heroViews)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7f95' }}>Profile Views</div>
                </div>
                <div>
                  <div style={{ font: '600 26px Jost,sans-serif', fontVariantNumeric: 'tabular-nums' }}>
                    {$i(heroCalls)}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7f95' }}>Calls</div>
                </div>
                <div
                  style={{
                    gridColumn: '1/-1',
                    height: '70px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '5px',
                    paddingTop: '6px',
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
                  width: '66%',
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '22px',
                  overflow: 'hidden',
                  boxShadow: '0 40px 80px -30px rgba(16,35,58,.4)',
                  animation: 'floatY 6s ease-in-out infinite',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '16/8',
                    background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: '#D82028',
                      color: '#fff',
                      font: '600 11px Jost,sans-serif',
                      letterSpacing: '.08em',
                      padding: '5px 9px',
                      borderRadius: '999px',
                    }}
                  >
                    SPONSORED
                  </span>
                </div>
                <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ font: '600 17px Jost,sans-serif' }}>Centre Name</div>
                  <div style={{ fontSize: '13px', color: '#6b7f95' }}>Toronto, Ontario · Residential Treatment</div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        font: '500 11.5px Figtree,sans-serif',
                        color: '#1f3550',
                        background: '#eef4f9',
                        padding: '4px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      Alcohol
                    </span>
                    <span
                      style={{
                        font: '500 11.5px Figtree,sans-serif',
                        color: '#1f3550',
                        background: '#eef4f9',
                        padding: '4px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      Opioids
                    </span>
                    <span
                      style={{
                        font: '500 11.5px Figtree,sans-serif',
                        color: '#1f3550',
                        background: '#eef4f9',
                        padding: '4px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      Mental Health
                    </span>
                  </div>
                  <span
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: '6px',
                      font: '600 13px Jost,sans-serif',
                      color: '#fff',
                      background: '#10233a',
                      padding: '8px 12px',
                      borderRadius: '9px',
                    }}
                  >
                    View Centre
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="Benefits" style={{ background: '#fff' }}>
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
                What you get
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                Reach People Looking for Treatment
              </h2>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}
              data-cols="repeat(4,1fr)"
            >
              {$list(benefits).map((bf, $index) => (
                <Fragment key={$index}>
                  <div
                    className="scp1q"
                    style={{
                      background: '#f7fafd',
                      border: '1px solid #e3ecf4',
                      borderRadius: '20px',
                      padding: '26px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      transition: 'transform .2s,border-color .2s',
                    }}
                  >
                    <span
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#fff',
                        border: '1px solid #e3ecf4',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                      }}
                    >
                      {$i(bf?.icon)}
                    </span>
                    <h3 style={{ fontSize: '19px' }}>{$i(bf?.title)}</h3>
                    <p style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#516378' }}>{$i(bf?.body)}</p>
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
                Where your centre can appear
              </span>
              <h2 style={{ fontSize: '42px', lineHeight: '1.08', color: '#fff' }} data-rc-lg="1">
                Be Visible Where People Search
              </h2>
              <p style={{ fontSize: '16.5px', lineHeight: '1.65', color: '#b7c7d8', maxWidth: '460px' }}>
                One centre, seven kinds of pages. Sponsor the country, a province, a city, a substance, a treatment
                type, a condition or an educational guide — wherever your future clients are reading.
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
                  display: 'flex',
                  gap: '24px',
                  marginTop: '10px',
                  paddingTop: '18px',
                  borderTop: '1px solid rgba(255,255,255,.12)',
                }}
              >
                <div>
                  <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>7</div>
                  <div style={{ fontSize: '12.5px', color: '#b7c7d8', marginTop: '4px' }}>Page types</div>
                </div>
                <div>
                  <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>5</div>
                  <div style={{ fontSize: '12.5px', color: '#b7c7d8', marginTop: '4px' }}>Sponsors max per page</div>
                </div>
                <div>
                  <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>1</div>
                  <div style={{ fontSize: '12.5px', color: '#b7c7d8', marginTop: '4px' }}>Dashboard for all of it</div>
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
                    Sponsor
                  </span>
                  <span style={{ font: '600 18px/1.15 Jost,sans-serif' }}>YOUR REHAB CENTRE</span>
                </div>
              </div>
              {$list(spokes).map((sp, $index) => (
                <Fragment key={$index}>
                  <div
                    className="scp1o"
                    style={$css(
                      `position:absolute;left:${sp?.px ?? ''};top:${sp?.py ?? ''};transform:translate(-50%,-50%);width:24%;min-width:130px;background:rgba(16,35,58,.85);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.16);border-radius:16px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;transition:border-color .2s,background .2s`,
                    )}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#7cc4f5', display: 'flex', flexShrink: '0' }}>{$i(sp?.icon)}</span>
                      <span style={{ font: '600 14px Jost,sans-serif', color: '#fff' }}>{$i(sp?.label)}</span>
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
            <div style={{ maxWidth: '640px', marginBottom: '40px' }}>
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
                Choose the plan that fits your centre
              </h2>
              <p style={{ fontSize: '16px', color: '#516378', marginTop: '12px' }}>
                Monthly, cancel any time. Annual plans available — ask our team.
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
                gap: '14px',
                alignItems: 'stretch',
              }}
              data-cols="repeat(auto-fit,minmax(200px,1fr))"
            >
              {$list(plans).map((pl, $index) => (
                <Fragment key={$index}>
                  <div
                    style={$css(
                      `position:relative;min-width:0;background:${pl?.bg ?? ''};color:${pl?.color ?? ''};border:1px solid ${pl?.border ?? ''};border-radius:22px;padding:26px 22px;display:flex;flex-direction:column;gap:14px;box-shadow:${pl?.shadow ?? ''}`,
                    )}
                  >
                    {pl?.popular ? (
                      <>
                        <span
                          style={{
                            position: 'absolute',
                            top: '-12px',
                            left: '22px',
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
                    <div>
                      <div
                        style={$css(
                          `font:600 12px Figtree,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:${pl?.muted ?? ''}`,
                        )}
                      >
                        {$i(pl?.name)}
                      </div>
                      <div style={{ marginTop: '8px' }}>
                        <div style={$css(`font:500 12px Figtree,sans-serif;color:${pl?.muted ?? ''};height:14px`)}>
                          {$i(pl?.prefix)}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                          <span style={{ font: '600 32px/1 Jost,sans-serif' }}>{$i(pl?.price)}</span>
                          <span style={$css(`font-size:13px;color:${pl?.muted ?? ''}`)}>{$i(pl?.per)}</span>
                        </div>
                      </div>
                    </div>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: '1' }}>
                      {$list(pl?.features).map((ft, $index) => (
                        <Fragment key={$index}>
                          <li
                            style={{
                              display: 'flex',
                              gap: '9px',
                              alignItems: 'flex-start',
                              fontSize: '13.5px',
                              lineHeight: '1.45',
                            }}
                          >
                            <span
                              style={$css(
                                `width:16px;height:16px;border-radius:50%;background:${pl?.tick ?? ''};color:#fff;display:grid;place-items:center;font:700 9px Jost,sans-serif;flex-shrink:0;margin-top:2px`,
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
                      href="#contact"
                      style={$css(
                        `font:600 14.5px Jost,sans-serif;color:${pl?.btnColor ?? ''};background:${pl?.btnBg ?? ''};border:1.5px solid ${pl?.btnBorder ?? ''};padding:12px;border-radius:11px;text-align:center`,
                      )}
                    >
                      {$i(pl?.cta)}
                    </$A>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section data-screen-label="Placements" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px' }} data-rc-wrap="1">
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap',
                marginBottom: '36px',
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
                  Sponsorship inventory
                </span>
                <h2 style={{ fontSize: '38px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                  Sponsor the Pages That Matter to Your Centre
                </h2>
                <p style={{ fontSize: '16px', color: '#516378', marginTop: '12px' }}>
                  Tap the pages you want. Placements are add-ons to any plan; every page carries a maximum of five
                  sponsors.
                </p>
              </div>
              <span
                style={{
                  fontSize: '13px',
                  color: '#6b7f95',
                  background: '#f7fafd',
                  border: '1px solid #e3ecf4',
                  padding: '6px 12px',
                  borderRadius: '999px',
                }}
              >
                Prices per month · CAD
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
                gridAutoRows: 'minmax(150px,auto)',
                gap: '14px',
              }}
              data-cols="repeat(4,minmax(0,1fr))"
            >
              {$list(placementCards).map((pc, $index) => (
                <Fragment key={$index}>
                  <button
                    className="scpk"
                    onClick={pc?.toggle}
                    aria-pressed={pc?.on}
                    style={$css(
                      `appearance:none;cursor:pointer;text-align:left;grid-column:${pc?.col ?? ''};grid-row:${pc?.row ?? ''};position:relative;overflow:hidden;background:${pc?.bg ?? ''};color:${pc?.color ?? ''};border:1.5px solid ${pc?.border ?? ''};border-radius:22px;padding:22px;display:flex;flex-direction:column;gap:12px;transition:border-color .2s,transform .2s,box-shadow .2s;box-shadow:${pc?.shadow ?? ''}`,
                    )}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        gap: '10px',
                      }}
                    >
                      <span
                        style={$css(
                          `width:40px;height:40px;border-radius:12px;background:${pc?.iconBg ?? ''};border:1px solid ${pc?.iconBorder ?? ''};color:${pc?.iconColor ?? ''};display:grid;place-items:center`,
                        )}
                      >
                        {$i(pc?.icon)}
                      </span>
                      <span
                        style={$css(
                          `width:24px;height:24px;border-radius:50%;border:1.5px solid ${pc?.checkBorder ?? ''};background:${pc?.checkBg ?? ''};color:#fff;display:grid;place-items:center;font:700 12px Jost,sans-serif`,
                        )}
                      >
                        {$i(pc?.mark)}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <span style={$css(`font:600 ${pc?.titleSize ?? ''} Jost,sans-serif;line-height:1.15`)}>
                        {$i(pc?.label)}
                      </span>
                      <span style={$css(`font-size:13px;line-height:1.5;color:${pc?.muted ?? ''}`)}>
                        {$i(pc?.body)}
                      </span>
                    </div>
                    {pc?.big ? (
                      <>
                        <div
                          style={{
                            marginTop: 'auto',
                            background: 'rgba(255,255,255,.08)',
                            border: '1px solid rgba(255,255,255,.14)',
                            borderRadius: '14px',
                            padding: '12px',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3,1fr)',
                            gap: '8px',
                          }}
                          data-cols="repeat(3,1fr)"
                        >
                          <div
                            style={{
                              gridColumn: '1/-1',
                              font: '600 10.5px Figtree,sans-serif',
                              letterSpacing: '.12em',
                              textTransform: 'uppercase',
                              color: '#7cc4f5',
                            }}
                          >
                            Featured on the homepage
                          </div>
                          <span
                            style={{
                              height: '38px',
                              borderRadius: '8px',
                              background: 'rgba(255,255,255,.14)',
                              border: '1px solid rgba(255,255,255,.18)',
                            }}
                          />
                          <span style={{ height: '38px', borderRadius: '8px', background: '#0890E8' }} />
                          <span
                            style={{
                              height: '38px',
                              borderRadius: '8px',
                              background: 'rgba(255,255,255,.14)',
                              border: '1px solid rgba(255,255,255,.18)',
                            }}
                          />
                        </div>
                      </>
                    ) : null}
                    <div
                      style={$css(
                        `margin-top:auto;display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding-top:10px;border-top:1px solid ${pc?.rule ?? ''}`,
                      )}
                    >
                      <span style={{ font: '600 20px Jost,sans-serif', fontVariantNumeric: 'tabular-nums' }}>
                        From {$i(pc?.price)}
                        <span style={$css(`font:400 12px Figtree,sans-serif;color:${pc?.muted ?? ''}`)}>/mo</span>
                      </span>
                      <span style={$css(`font:600 12.5px Jost,sans-serif;color:${pc?.linkColor ?? ''}`)}>
                        {$i(pc?.ctaText)}
                      </span>
                    </div>
                  </button>
                </Fragment>
              ))}
            </div>
            <div
              style={{
                marginTop: '16px',
                background: '#10233a',
                color: '#fff',
                borderRadius: '20px',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
                <div>
                  <div
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      color: '#7fa0bf',
                    }}
                  >
                    Your selection
                  </div>
                  <div style={{ font: '600 18px Jost,sans-serif', marginTop: '2px' }}>{$i(selCount)} placements</div>
                </div>
                <div style={{ width: '1px', height: '36px', background: 'rgba(255,255,255,.14)' }} />
                <div>
                  <div
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      color: '#7fa0bf',
                    }}
                  >
                    Estimated from
                  </div>
                  <div
                    style={{ font: '600 26px/1 Jost,sans-serif', fontVariantNumeric: 'tabular-nums', marginTop: '2px' }}
                  >
                    {$i(selTotal)}
                    <span style={{ font: '400 13px Figtree,sans-serif', color: '#b7c7d8' }}>/mo + plan</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {$list(selChips).map((sc, $index) => (
                    <Fragment key={$index}>
                      <span
                        style={{
                          font: '500 12px Figtree,sans-serif',
                          color: '#d9ebf9',
                          background: 'rgba(255,255,255,.08)',
                          border: '1px solid rgba(255,255,255,.14)',
                          padding: '5px 9px',
                          borderRadius: '999px',
                        }}
                      >
                        {$i(sc)}
                      </span>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  className="scpe"
                  onClick={clearSel}
                  style={{
                    appearance: 'none',
                    cursor: 'pointer',
                    background: 'transparent',
                    border: '0',
                    font: '500 13.5px Figtree,sans-serif',
                    color: '#b7c7d8',
                  }}
                >
                  Clear
                </button>
                <$A
                  className="scpr"
                  href="#contact"
                  style={{
                    font: '600 15px Jost,sans-serif',
                    color: '#10233a',
                    background: '#fff',
                    padding: '12px 20px',
                    borderRadius: '11px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Reserve these placements
                </$A>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#6b7f95', marginTop: '12px' }}>
              Final pricing depends on page demand and plan. Our team confirms availability before anything is charged.
            </p>
          </div>
        </section>
        <section
          data-screen-label="Sponsored vs organic"
          style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '88px 32px',
              display: 'grid',
              gridTemplateColumns: '.8fr 1.2fr',
              gap: '56px',
              alignItems: 'center',
            }}
            data-cols=".8fr 1.2fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Transparent by design
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12' }} data-rc-lg="1">
                How sponsored placements appear
              </h2>
              <p style={{ fontSize: '16.5px', lineHeight: '1.65', color: '#516378' }}>
                Sponsored centres sit in a clearly labelled block at the top of the page. The organic directory below is
                ranked independently.
              </p>
              <div
                style={{
                  background: '#fff',
                  borderLeft: '3px solid #0890E8',
                  borderRadius: '0 14px 14px 0',
                  padding: '14px 18px',
                  fontSize: '15px',
                  lineHeight: '1.55',
                  color: '#1f3550',
                }}
              >
                Sponsorship provides additional visibility but does not change organic ranking or verification.
              </div>
            </div>
            <div
              style={{
                background: '#fff',
                border: '1px solid #e3ecf4',
                borderRadius: '24px',
                padding: '24px',
                boxShadow: '0 30px 60px -40px rgba(16,35,58,.3)',
              }}
            >
              <div style={{ font: '600 20px Jost,sans-serif', marginBottom: '16px' }}>
                Addiction Treatment Centres in Toronto
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span
                  style={{
                    font: '600 11px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#D82028',
                  }}
                >
                  Sponsored Treatment Centres
                </span>
                <span style={{ flex: '1', height: '1px', background: '#f0d5d7' }} />
              </div>
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '20px' }}
                data-cols="repeat(3,1fr)"
              >
                {$list(mockSponsored).map((m, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={{
                        border: '1px solid #f0d5d7',
                        background: '#fff8f8',
                        borderRadius: '14px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          position: 'relative',
                          aspectRatio: '16/9',
                          background: 'repeating-linear-gradient(135deg,#f3dcdd 0 10px,#f9ecec 10px 20px)',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: '8px',
                            left: '8px',
                            background: '#D82028',
                            color: '#fff',
                            font: '600 9.5px Jost,sans-serif',
                            letterSpacing: '.08em',
                            padding: '3px 7px',
                            borderRadius: '999px',
                          }}
                        >
                          SPONSORED
                        </span>
                      </div>
                      <div style={{ padding: '10px 12px' }}>
                        <div style={{ font: '600 13px Jost,sans-serif' }}>{$i(m)}</div>
                        <div style={{ fontSize: '11px', color: '#6b7f95' }}>Toronto, ON</div>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span
                  style={{
                    font: '600 11px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#6b7f95',
                  }}
                >
                  Treatment Centres in Toronto
                </span>
                <span style={{ flex: '1', height: '1px', background: '#e3ecf4' }} />
                <span style={{ fontSize: '11px', color: '#6b7f95' }}>Ranked independently</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {$list(mockOrganic).map((m, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '56px 1fr auto',
                        gap: '12px',
                        alignItems: 'center',
                        border: '1px solid #e3ecf4',
                        borderRadius: '12px',
                        padding: '8px 10px',
                      }}
                      data-cols="56px 1fr auto"
                    >
                      <span
                        style={{
                          height: '40px',
                          borderRadius: '8px',
                          background: 'repeating-linear-gradient(135deg,#dfeaf3 0 8px,#eaf2f8 8px 16px)',
                        }}
                      />
                      <div>
                        <div style={{ font: '600 13px Jost,sans-serif' }}>{$i(m)}</div>
                        <div style={{ fontSize: '11px', color: '#6b7f95' }}>Toronto, ON · Residential</div>
                      </div>
                      <span style={{ fontSize: '11px', color: '#2fb46b', fontWeight: '600' }}>Verified</span>
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="How it works" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
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
                Live in days, not months
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
                  background: '#e3ecf4',
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
                        boxShadow: '0 0 0 8px #fff',
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
        <section data-screen-label="Analytics" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px' }} data-rc-wrap="1">
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap',
                marginBottom: '36px',
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
                  Provider dashboard
                </span>
                <h2 style={{ fontSize: '38px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                  See What's Driving Results
                </h2>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  color: '#6b7f95',
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  padding: '5px 10px',
                  borderRadius: '999px',
                }}
              >
                Example dashboard data
              </span>
            </div>
            <div
              style={{
                background: '#fff',
                border: '1px solid #e3ecf4',
                borderRadius: '26px',
                padding: '28px',
                boxShadow: '0 40px 80px -50px rgba(16,35,58,.35)',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px' }}
                data-cols="repeat(5,1fr)"
              >
                {$list(kpis).map((k, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={{
                        background: '#f7fafd',
                        border: '1px solid #e3ecf4',
                        borderRadius: '16px',
                        padding: '16px 18px',
                      }}
                    >
                      <div style={{ font: '600 28px/1 Jost,sans-serif', fontVariantNumeric: 'tabular-nums' }}>
                        {$i(k?.v)}
                      </div>
                      <div style={{ fontSize: '12.5px', color: '#6b7f95', marginTop: '6px' }}>{$i(k?.label)}</div>
                      <div style={{ fontSize: '12px', color: '#2fb46b', fontWeight: '600', marginTop: '4px' }}>
                        {$i(k?.delta)}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }} data-cols="1.4fr 1fr">
                <div
                  style={{
                    border: '1px solid #e3ecf4',
                    borderRadius: '18px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ font: '600 15px Jost,sans-serif' }}>Sponsored impressions · last 12 weeks</span>
                    <span style={{ fontSize: '12px', color: '#6b7f95' }}>Weekly</span>
                  </div>
                  <div
                    style={{
                      height: '180px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: '8px',
                      borderBottom: '1px solid #e3ecf4',
                      paddingBottom: '6px',
                    }}
                  >
                    {$list(chartBars).map((bar, $index) => (
                      <Fragment key={$index}>
                        <span
                          title={bar?.t}
                          style={$css(
                            `flex:1;height:${bar?.h ?? ''};border-radius:6px 6px 0 0;background:${bar?.c ?? ''};transform-origin:bottom;animation:barGrow .8s cubic-bezier(.2,.8,.2,1) both;animation-delay:${bar?.d ?? ''}`,
                          )}
                        />
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#6b7f95' }}>
                    <span>W1</span>
                    <span>W4</span>
                    <span>W8</span>
                    <span>W12</span>
                  </div>
                </div>
                <div
                  style={{
                    border: '1px solid #e3ecf4',
                    borderRadius: '18px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <span style={{ font: '600 15px Jost,sans-serif' }}>Top Performing Sponsorships</span>
                  {$list(topSponsors).map((ts, $index) => (
                    <Fragment key={$index}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                          <span style={{ fontWeight: '500' }}>{$i(ts?.label)}</span>
                          <span style={{ color: '#6b7f95', fontVariantNumeric: 'tabular-nums' }}>{$i(ts?.v)}</span>
                        </div>
                        <span
                          style={{
                            height: '6px',
                            borderRadius: '999px',
                            background: '#eef4f9',
                            overflow: 'hidden',
                            display: 'block',
                          }}
                        >
                          <span
                            style={$css(
                              `display:block;height:100%;width:${ts?.w ?? ''};background:#0890E8;transform-origin:left;animation:barGrow .9s ease-out both;animation-delay:${ts?.d ?? ''}`,
                            )}
                          />
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="Availability" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
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
                Inventory
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                Limited Sponsorship Availability
              </h2>
              <p style={{ fontSize: '16px', color: '#516378', marginTop: '12px' }}>
                Each page carries a maximum of five sponsors so every placement stays visible.
              </p>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}
              data-cols="repeat(4,1fr)"
            >
              {$list(inventory).map((iv, $index) => (
                <Fragment key={$index}>
                  <div
                    style={{
                      background: '#f7fafd',
                      border: '1px solid #e3ecf4',
                      borderRadius: '18px',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ font: '600 17px Jost,sans-serif' }}>{$i(iv?.label)}</span>
                      <span style={{ font: '500 11px Figtree,sans-serif', color: '#6b7f95' }}>{$i(iv?.type)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {$list(iv?.dots).map((d, $index) => (
                        <Fragment key={$index}>
                          <span style={$css(`width:12px;height:12px;border-radius:50%;background:${d ?? ''}`)} />
                        </Fragment>
                      ))}
                    </div>
                    <div style={$css(`font-size:13.5px;color:${iv?.statusColor ?? ''};font-weight:500`)}>
                      {$i(iv?.status)}
                    </div>
                    <$A
                      className="scp1r"
                      href="#contact"
                      style={$css(
                        `font:600 13.5px Jost,sans-serif;color:${iv?.ctaColor ?? ''};border:1.5px solid ${iv?.ctaColor ?? ''};padding:9px 12px;border-radius:9px;text-align:center`,
                      )}
                    >
                      {$i(iv?.cta)}
                    </$A>
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
                Centres on the platform
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12', marginTop: '10px' }} data-rc-lg="1">
                What providers say
              </h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} data-cols="1fr 1fr">
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
                    <span
                      style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        border: '1px solid #e3ecf4',
                        background: 'repeating-linear-gradient(135deg,#dfeaf3 0 8px,#eaf2f8 8px 16px)',
                        display: 'grid',
                        placeItems: 'center',
                        font: '500 10px ui-monospace,monospace',
                        color: '#516378',
                      }}
                    >
                      logo
                    </span>
                    <p style={{ font: '500 18px/1.5 Jost,sans-serif', color: '#10233a' }}>"{$i(tm?.quote)}"</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: '12px' }}>
                      <div>
                        <div style={{ font: '600 15px Jost,sans-serif' }}>{$i(tm?.name)}</div>
                        <div style={{ fontSize: '13px', color: '#6b7f95' }}>{$i(tm?.place)}</div>
                      </div>
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
                        Verified centre
                      </span>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
            <div
              style={{ marginTop: '40px', display: 'flex', flexDirection: 'column', gap: '16px', alignItems: 'center' }}
            >
              <span
                style={{
                  font: '600 11.5px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#6b7f95',
                }}
              >
                As featured in
              </span>
              <div
                style={{
                  display: 'flex',
                  gap: '40px',
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  alignItems: 'center',
                  filter: 'grayscale(1)',
                  opacity: '.6',
                }}
              >
                {$list(media).map((md, $index) => (
                  <Fragment key={$index}>
                    <span style={{ font: '700 20px Jost,sans-serif', color: '#10233a', letterSpacing: '-.01em' }}>
                      {$i(md)}
                    </span>
                  </Fragment>
                ))}
              </div>
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
                Visibility Without Compromising Trust
              </h2>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                maxWidth: '900px',
                margin: '0 auto',
              }}
              data-cols="1fr 1fr"
              data-rc-wrap="1"
            >
              <div style={{ background: '#fff', border: '1px solid #d5e8f7', borderRadius: '22px', padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#0890E8',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      font: '700 14px Jost,sans-serif',
                    }}
                  >
                    ✓
                  </span>
                  <h3 style={{ fontSize: '19px' }}>Sponsorship Can Influence</h3>
                </div>
                <ul
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#1f3550' }}
                >
                  <li>Sponsored visibility</li>
                  <li>Featured advertising placements</li>
                  <li>Campaign exposure</li>
                </ul>
              </div>
              <div style={{ background: '#fff', border: '1px solid #d5e8f7', borderRadius: '22px', padding: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: '#10233a',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      font: '700 14px Jost,sans-serif',
                    }}
                  >
                    ✕
                  </span>
                  <h3 style={{ fontSize: '19px' }}>Sponsorship Does Not Influence</h3>
                </div>
                <ul
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '15px', color: '#1f3550' }}
                >
                  <li>Organic rankings</li>
                  <li>Verification status</li>
                  <li>Quality scoring</li>
                  <li>Editorial recommendations</li>
                  <li>Treatment matching</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="Founding Partner" style={{ background: '#fff' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px' }} data-rc-wrap="1">
            <div
              style={{
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg,#0f5fa8,#0890E8)',
                borderRadius: '30px',
                padding: '56px',
                color: '#fff',
                display: 'grid',
                gridTemplateColumns: '1.1fr .9fr',
                gap: '48px',
                alignItems: 'center',
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
                <span
                  style={{
                    alignSelf: 'flex-start',
                    font: '600 11.5px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    background: 'rgba(255,255,255,.15)',
                    padding: '6px 12px',
                    borderRadius: '999px',
                  }}
                >
                  Founding Partner Program
                </span>
                <h2 style={{ fontSize: '40px', lineHeight: '1.1', color: '#fff' }} data-rc-lg="1">
                  Growth Sponsor
                </h2>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '14px', flexWrap: 'wrap' }}>
                  <span style={{ font: '500 18px Jost,sans-serif', textDecoration: 'line-through', opacity: '.7' }}>
                    Regularly $699/month
                  </span>
                  <span style={{ font: '600 52px/1 Jost,sans-serif' }}>
                    $499
                    <span style={{ font: '500 18px Jost,sans-serif', opacity: '.85' }}>/month</span>
                  </span>
                </div>
                <p style={{ fontSize: '16px', lineHeight: '1.6', opacity: '.92', maxWidth: '480px' }}>
                  12-month price protection. Limited to the first 10 to 15 qualified private centres.
                </p>
                <$A
                  className="scp5"
                  href="#contact"
                  style={{
                    alignSelf: 'flex-start',
                    font: '600 16px Jost,sans-serif',
                    color: '#0f5fa8',
                    background: '#fff',
                    padding: '15px 24px',
                    borderRadius: '12px',
                  }}
                >
                  Apply as a Founding Partner
                </$A>
              </div>
              <ul style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {$list(founding).map((fp, $index) => (
                  <Fragment key={$index}>
                    <li
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'center',
                        background: 'rgba(255,255,255,.1)',
                        border: '1px solid rgba(255,255,255,.18)',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        font: '500 15px Figtree,sans-serif',
                      }}
                    >
                      <span
                        style={{
                          width: '20px',
                          height: '20px',
                          borderRadius: '50%',
                          background: '#fff',
                          color: '#0890E8',
                          display: 'grid',
                          placeItems: 'center',
                          font: '700 11px Jost,sans-serif',
                          flexShrink: '0',
                        }}
                      >
                        ✓
                      </span>
                      {$i(fp)}
                    </li>
                  </Fragment>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section
          data-screen-label="About the platform"
          style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '88px 32px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '56px',
              alignItems: 'center',
            }}
            data-cols="1fr 1fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                About the platform
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12' }} data-rc-lg="1">
                Canada's Treatment Discovery Platform
              </h2>
              <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                Founded in 2015 and based in Toronto, Addiction Rehab Centres Canada helps people and families
                understand treatment options and connect with providers across the country — through a free 24/7
                helpline, independent directory listings and clinically reviewed guides.
              </p>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '12px' }}
              data-cols="repeat(2,1fr)"
            >
              {$list(aboutStats).map((as, $index) => (
                <Fragment key={$index}>
                  <div
                    style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '18px', padding: '22px' }}
                  >
                    <div style={{ font: '600 32px/1 Jost,sans-serif', color: '#0890E8' }}>{$i(as?.v)}</div>
                    <div style={{ fontSize: '13.5px', color: '#516378', marginTop: '8px', lineHeight: '1.4' }}>
                      {$i(as?.label)}
                    </div>
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
                Plan comparison
              </h2>
            </div>
            <div style={{ border: '1px solid #e3ecf4', borderRadius: '20px', overflow: 'hidden' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.6fr repeat(5,1fr)',
                  background: '#f7fafd',
                  borderBottom: '1px solid #e3ecf4',
                }}
                data-cols="1.6fr repeat(5,1fr)"
              >
                <span
                  style={{
                    padding: '14px 18px',
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
                    <span
                      style={$css(
                        `padding:14px 12px;font:600 13px Jost,sans-serif;text-align:center;color:${c?.color ?? ''}`,
                      )}
                    >
                      {$i(c?.label)}
                    </span>
                  </Fragment>
                ))}
              </div>
              {$list(compareRows).map((r, $index) => (
                <Fragment key={$index}>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1.6fr repeat(5,1fr)',
                      borderBottom: '1px solid #f0f4f8',
                      alignItems: 'center',
                    }}
                    data-cols="1.6fr repeat(5,1fr)"
                  >
                    <span style={{ padding: '13px 18px', fontSize: '14px', color: '#1f3550' }}>{$i(r?.label)}</span>
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
                Questions providers ask
              </h2>
              <$A
                className="scp7"
                href="#contact"
                style={{
                  alignSelf: 'flex-start',
                  font: '600 15px Jost,sans-serif',
                  color: '#0890E8',
                  border: '1.5px solid #0890E8',
                  padding: '11px 18px',
                  borderRadius: '10px',
                }}
              >
                Talk to our team
              </$A>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {$list(promoFaqs).map((q, $index) => (
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
        <section
          id="contact"
          data-screen-label="Final CTA"
          style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px 0' }} data-rc-wrap="1">
            <div
              style={{
                background: '#10233a',
                borderRadius: '30px 30px 0 0',
                padding: '64px 56px',
                color: '#fff',
                display: 'grid',
                gridTemplateColumns: '1.2fr .8fr',
                gap: '40px',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
              data-cols="1.2fr .8fr"
              data-rc-gap="1"
            >
              <div
                style={{
                  position: 'absolute',
                  right: '-80px',
                  bottom: '-120px',
                  width: '360px',
                  height: '360px',
                  borderRadius: '50%',
                  border: '60px solid rgba(8,144,232,.15)',
                }}
              />
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <h2 style={{ fontSize: '40px', lineHeight: '1.1', color: '#fff' }} data-rc-lg="1">
                  Ready to Increase Your Centre's Visibility?
                </h2>
                <p style={{ fontSize: '17px', lineHeight: '1.55', color: '#b7c7d8' }}>
                  Reach people researching treatment while keeping advertising transparent and measurable.
                </p>
                <$A
                  className="scpe"
                  href="https://addictionrehabcenters.ca/claim-your-listing/"
                  style={{ font: '500 14.5px Figtree,sans-serif', color: '#7cc4f5', marginTop: '6px' }}
                >
                  Already listed? Claim your centre →
                </$A>
              </div>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <$A
                  className="scpr"
                  href="#plans"
                  style={{
                    font: '600 18px Jost,sans-serif',
                    color: '#10233a',
                    background: '#fff',
                    padding: '16px 24px',
                    borderRadius: '14px',
                    textAlign: 'center',
                  }}
                >
                  View Plans
                </$A>
                <$A
                  className="scpv"
                  href="mailto:info@addictionrehabcenters.ca"
                  style={{
                    font: '600 16px Jost,sans-serif',
                    color: '#fff',
                    border: '1.5px solid rgba(255,255,255,.5)',
                    padding: '14px 24px',
                    borderRadius: '14px',
                    textAlign: 'center',
                  }}
                >
                  Talk to Our Team
                </$A>
              </div>
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
const View = createDC('Promote', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} responsive {...props} />;
}
