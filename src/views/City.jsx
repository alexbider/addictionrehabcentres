'use client';
// Generated from City.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = { menu: null, tab: 0, slide: 0, faq: 0, shown: 12, filter: 'All', vw: 1280 };
  componentDidMount() {
    this.setState({ vw: window.innerWidth });
    this._onR = () => this.setState({ vw: window.innerWidth });
    window.addEventListener('resize', this._onR);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._onR);
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
      shield: this.icon(['M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z', 'M9 12l2 2 4-4'], {
        width: 18,
        height: 18,
      }),
      check: this.icon([{ t: 'circle', a: { cx: 12, cy: 12, r: 8.5 } }, 'M8.5 12l2.5 2.5 4.5-5'], {
        width: 18,
        height: 18,
      }),
      doc: this.icon([{ t: 'rect', a: { x: 5, y: 3, width: 14, height: 18, rx: 2 } }, 'M9 8h6', 'M9 12h6', 'M9 16h4'], {
        width: 18,
        height: 18,
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

    // ---- Province page data (Alberta) ----
    const province = this.props.province ?? 'Alberta';
    const raw = [
      [
        'Niwichihaw Aboriginal Addiction Counselling Service',
        'niwichihaw-aboriginal-addiction-counselling-service',
        '4805 48 St, Red Deer, AB T4N 1S6',
        'Niwichihaw Aboriginal Addiction Counselling…',
        '0 Reviews',
        0,
        'Red Deer',
        ['Counselling', 'Indigenous'],
      ],
      [
        'Venture Academy',
        'alcohol-treatment-program',
        '1810 25 Ave, Delburne, AB T0M 0V0',
        'The drug and alcohol treatment program for teens…',
        '0 Reviews',
        0,
        'Delburne',
        ['Residential', 'Youth'],
      ],
      [
        'Pee Kis Kwe Tan (Let\u2019s Talk) Society',
        'alcohol-and-drug-addiction',
        'Wabasca-Desmarais, AB T0G',
        'The Pee Kis Kwe Tan (Let\u2019s Talk) Society accepts…',
        '0 Reviews',
        1,
        'Wabasca-Desmarais',
        ['Residential', 'Indigenous'],
      ],
      [
        'Bonnyville Indian M\u00e9tis Rehabilitation Centre',
        'bonnyville-indian-metis-rehabilitation-centre',
        'Bonnyville, AB T9N 2J4',
        'The Adult Co-Ed Residential program is based on…',
        '0 Reviews',
        0,
        'Bonnyville',
        ['Residential', 'Indigenous'],
      ],
      [
        'Simon House Recovery Centre',
        'simon-house-recovery-centre',
        '5819 Bowness Rd NW, Calgary, AB T3B 0C5',
        'Simon House Recovery House is a drug and alcohol…',
        '1 Review',
        0,
        'Calgary',
        ['Residential', 'Men'],
      ],
      [
        'Alcove Addiction Recovery For Women',
        'alcove-addiction-recovery-for-women',
        '1941 42 Ave SW, Calgary, AB T2T 2M6',
        'Youville is a residential treatment center that…',
        '1 Review',
        0,
        'Calgary',
        ['Residential', 'Women'],
      ],
      [
        'Wood\u2019s Homes \u2013 Parkdale Campus',
        'woods-homes-parkdale-campus',
        '805 37 St NW, Calgary, AB T2N 4N8',
        'Wood\u2019s Homes is a non-profit, multi-service…',
        '0 Reviews',
        0,
        'Calgary',
        ['Youth', 'Mental health'],
      ],
      [
        'Recovery Acres Calgary',
        'alcohol-and-drug-recovery-centre',
        '1835 27 Ave SW, Calgary, AB T2T 1H6',
        'One of Calgary Alberta\u2019s finest, 1835 House…',
        '0 Reviews',
        0,
        'Calgary',
        ['Residential', 'Men'],
      ],
      [
        'Teen Challenge Canada \u2014 Alberta Men\u2019s Centre',
        'teen-challenge-alberta',
        '146024 208 St W, Priddis, AB T0L 1W0',
        'Teen Challenge is a faith-based, 12-month residential…',
        '0 Reviews',
        0,
        'Priddis',
        ['Residential', 'Faith-based'],
      ],
      [
        'Thorpe Recovery Centre',
        'thorpe-recovery-centre',
        '4204 54 Ave, Lloydminster, AB T9V 2R6',
        'The Walter A. "Slim" Thorpe Recovery Centre…',
        '0 Reviews',
        0,
        'Lloydminster',
        ['Residential', 'Detox'],
      ],
      [
        'Recovery Acres Society',
        'recovery-acres-society',
        '6329 118 Ave NW, Edmonton, AB T5W 1G2',
        'Recovery Acres is a men-only rehabilitation…',
        '0 Reviews',
        0,
        'Edmonton',
        ['Residential', 'Men'],
      ],
      [
        'Alberta Adolescent Recovery Centre',
        'alberta-adolescent-recovery-centre',
        '303 Forge Rd SE, Calgary, AB T2H 0S9',
        'The Alberta Adolescent Recovery Centre (AARC)…',
        '0 Reviews',
        0,
        'Calgary',
        ['Youth', 'Residential'],
      ],
      [
        'Foothills Detox Centre',
        'foothills-detox-centre',
        '810 18 St, Fort Macleod, AB T0L 0Z0',
        'Foothills Detox Centre is a residential-based…',
        '0 Reviews',
        0,
        'Fort Macleod',
        ['Detox'],
      ],
      [
        'Fresh Start Recovery Centre',
        'fresh-start-recovery-centre',
        '411 41 Ave NE, Calgary, AB T2E 2N4',
        'The Fresh Start Recovery Centre offers male…',
        '0 Reviews',
        0,
        'Calgary',
        ['Residential', 'Men'],
      ],
      [
        'Mcdougall House',
        'drug-rehab-center-2',
        '11070 108 St NW, Edmonton, AB T5H 3A9',
        'McDougall House Association is an Alberta-based…',
        '0 Reviews',
        0,
        'Edmonton',
        ['Residential', 'Women'],
      ],
      [
        'Mark Amy Treatment Centre',
        'mark-amy-treatment-centre',
        '9914 King St, Fort McMurray, AB T9H 5A8',
        'The Mark Amy Treatment Center offers a 28-day…',
        '0 Reviews',
        1,
        'Fort McMurray',
        ['Residential', 'Indigenous'],
      ],
      [
        'Kapown Treatment Centre',
        'kapown-treatment-centre',
        'Grouard, AB T0G 1C0',
        'Kapown Center is a residential treatment facility…',
        '0 Reviews',
        0,
        'Grouard',
        ['Residential', 'Indigenous'],
      ],
      [
        'Young Spirit Winds',
        'young-spirit-winds',
        'Maskwacis, AB T0C 1N0',
        'Young Spirit Winds Child Treatment Program\u2019s…',
        '1 Review',
        0,
        'Maskwacis',
        ['Youth', 'Indigenous'],
      ],
      [
        'Victorian Order Of Nurses For Canada',
        'victorian-order-of-nurses-for-canada-rehab-centres',
        '3030 13 Ave SE #105, Medicine Hat, AB T1B 1E3',
        'Their program includes detoxification of the…',
        '0 Reviews',
        0,
        'Medicine Hat',
        ['Detox', 'Outpatient'],
      ],
      [
        'Safe Harbour Society',
        'drug-rehab-center',
        '5246 53 Ave, Red Deer, AB T4N 5K2',
        'This facility provides a supportive rehabilitation…',
        '1 Review',
        0,
        'Red Deer',
        ['Detox', 'Shelter'],
      ],
      [
        'Live Free Calgary',
        'live-free-calgary',
        'Calgary, AB',
        'Live Free Addiction Services Canada accommodates…',
        '0 Reviews',
        0,
        'Calgary',
        ['Outpatient'],
      ],
      [
        'Our House Edmonton',
        'our-house-edmonton',
        '22210 Stony Plain Rd, Edmonton, AB T5S 2C3',
        'Our House Addiction is a residential all-male…',
        '0 Reviews',
        0,
        'Edmonton',
        ['Residential', 'Men'],
      ],
      [
        'Canadawide Mobile',
        'canadawide-mobile',
        '9815 Main St, Fort McMurray, AB T9H 1T7',
        'Mobile Forensic Collection for substance abuse…',
        '0 Reviews',
        0,
        'Fort McMurray',
        ['Assessment'],
      ],
      [
        'Horizon House',
        'horizon-house',
        '4916 50 St, Red Deer, AB T4N 1X7',
        'Horizon House is a 25-bed Community Residential…',
        '0 Reviews',
        0,
        'Red Deer',
        ['Residential'],
      ],
    ];
    // Google rating / review count are sample values until wired to the backend.
    const all = raw.map((r, i) => ({
      name: r[0],
      href: B + r[1] + '/',
      address: r[2] + ', Canada',
      excerpt: r[3],
      reviews: r[4],
      featured: !!r[5],
      verified: i % 4 === 0,
      city: r[6],
      tags: r[7],
      photo: 'photo · ' + r[1] + '.jpg',
      rating: (4.3 + ((i * 3) % 7) / 10).toFixed(1),
      googleReviews: 12 + ((i * 37) % 90),
    }));
    const total = this.props.totalCentres ?? 44; // total in the province; only the first page of listings is loaded here
    const { faq, shown, filter } = this.state;
    const filterNames = [
      'All',
      'Residential',
      'Detox',
      'Outpatient',
      'Men',
      'Women',
      'Youth',
      'Indigenous',
      'Faith-based',
    ];
    const filtered = filter === 'All' ? all : all.filter((c) => c.tags.includes(filter));
    const listings = filtered.slice(0, shown);
    const filters = filterNames.map((f) => ({
      label: f,
      toggle: () => this.setState({ filter: f, shown: 12 }),
      bg: f === filter ? '#0890E8' : '#fff',
      color: f === filter ? '#fff' : '#1f3550',
      border: f === filter ? '#0890E8' : '#dbe6f0',
    }));
    const cityMap = {};
    all.forEach((c) => {
      cityMap[c.city] = (cityMap[c.city] || 0) + 1;
    });
    const cities = Object.entries(cityMap)
      .sort((x, y) => y[1] - x[1])
      .map(([name, n]) => ({ name, n, href: B + 'alberta-rehabs/#' + name.toLowerCase().replace(/\s+/g, '-') }));
    const trust = [
      {
        icon: ic.shield,
        title: 'Independent directory',
        body: 'We list centres across Canada; placement is never sold as a ranking.',
      },
      {
        icon: ic.check,
        title: 'Centre-verified details',
        body: 'Providers claim and update their own listings, addresses and phone numbers.',
      },
      {
        icon: ic.phone,
        title: 'Free 24/7 helpline',
        body: 'Real people who know the ' + province + ' system, any hour of the day.',
      },
      {
        icon: ic.doc,
        title: 'Reviewed & updated',
        body: 'Guide content reviewed by a clinical advisor and refreshed regularly.',
      },
    ];
    const faqData = [
      [
        'How many rehab centres are there in ' + province + '?',
        'We currently list ' +
          total +
          ' addiction treatment centres in ' +
          province +
          ', ranging from publicly funded detox and community programs to private residential rehab. Listings are updated as centres claim and verify their details.',
      ],
      [
        'Are there free or publicly funded rehab programs in ' + province + '?',
        'Yes. Alberta Health Services operates publicly funded detox, residential and community addiction programs, and several non-profit societies offer low-cost or subsidized beds. Private centres charge fees that vary by program length and level of care. Our helpline can help you understand which options you qualify for.',
      ],
      [
        'How long does rehab last?',
        'Most residential programs run 28 to 90 days; some long-term and faith-based programs run 6 to 12 months. Detox alone usually takes 3 to 10 days. The right length depends on the substance, how long you have been using, and whether there are co-occurring mental health conditions.',
      ],
      [
        'What is the difference between detox and rehab?',
        'Detox is the medically supervised first step of clearing substances from the body and managing withdrawal. Rehab is the treatment that follows — therapy, education, relapse-prevention and aftercare planning. Many ' +
          province +
          ' centres offer both under one roof; others focus on one stage.',
      ],
      [
        'How do I choose the right centre in ' + province + '?',
        'Consider the level of care you need (detox, inpatient, outpatient), the location, cost and funding, program length, and whether the centre specializes in your situation — for example men-only, women-only, youth, Indigenous or faith-based programs. Use the filters above, or call us and we will shortlist for you.',
      ],
      [
        'Can you help me get into a centre today?',
        'Often, yes. Call 1-855-885-4747 any time. We will talk through your circumstances and contact centres with immediate availability on your behalf. The service is free and confidential.',
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
    const toc = [
      ['Overview', '#guide'],
      ['Finding the right help', '#finding-help'],
      ['Drug & alcohol rehab', '#drug-alcohol-rehab'],
      ['Alcohol rehab', '#alcohol-rehab'],
      ['Detox centres', '#detox'],
      ['Calgary rehab centre', '#calgary'],
      ['Detox centres near me', '#detox-near-me'],
      ['FAQ', '#faq'],
    ].map(([label, href]) => ({ label, href }));
    const otherProvinces = locations.filter((l) => l.code !== 'AB');

    // ---- City page data (Toronto) ----
    const city = this.props.city ?? 'Toronto';
    const cityProvince = 'Ontario';
    const year = this.props.year ?? '2025';
    const cityRaw = [
      [
        'Metamorphosis Centre for Change',
        'metamorphosis-centre-for-change',
        'Wasaga Beach, ON',
        'Wasaga Beach',
        'Metamorphosis Centre for Change: A Philosophy of Transformation. Metamorphosis Centre for Change aims to transform their clients rather than simply aiding in their recovery from addiction. The centre\u2019s philosophy is to help clients create a new version of themselves.',
        '2 Reviews',
        0,
        0,
        ['Residential', 'Mental health', 'Private'],
        'From $— / 30 days',
        '30 – 90 days',
      ],
      [
        'Bellwood Health Services',
        'bellwood-health-services',
        '175 Brentcliffe Rd, Toronto, ON M4G 0C5',
        'Toronto',
        'Bellwood Health Services is a Toronto-based institution that provides an addiction treatment program based on Dr. Gordon Bell\u2019s treatment model. Their treatment is holistic and based on abstinence.',
        '0 Reviews',
        1,
        1,
        ['Residential', 'Holistic', 'Abstinence-based'],
        'Contact for pricing',
        'Varies',
      ],
      [
        'Addiction Centre Toronto',
        'addiction-centre-toronto',
        '193 Colborne St, Brantford, ON N3T 2G8',
        'Brantford',
        'Addiction Centre Toronto is a reputable addiction treatment and rehabilitation center. They offer 30-day, 60-day, or 90-day programs for those suffering from drug addiction or alcoholism. Their personalized substance abuse treatment programs are…',
        '0 Reviews',
        0,
        0,
        ['Residential', 'Drug & alcohol'],
        'Contact for pricing',
        '30 / 60 / 90 days',
      ],
      [
        'Renascent Treatment Centre',
        'renascent',
        '90 Colston Ave, Whitby, ON L1M 1C1',
        'Whitby',
        'Renascent provides four gender-specific residential homes for substance abuse and eating disorders, each with a 12-step comprehensive treatment approach. Renascent can help clients with everything from detox to aftercare.',
        '0 Reviews',
        0,
        0,
        ['Residential', '12-step', 'Gender-specific'],
        'Contact for pricing',
        'Detox to aftercare',
      ],
      [
        'UMATTERCARE – Mental Health and Addiction Services',
        'umattercare-mental-health-and-addiction-services',
        '97 Bonnyview Dr, Etobicoke, ON M8Y 3G8',
        'Etobicoke',
        'UMATTERCARE, located in Toronto, Ontario, offers personalized care to individuals struggling with addiction and mental health issues. Their holistic approach aims to address the mind, body, and spirit, allowing them to effectively treat the root cause.',
        '0 Reviews',
        0,
        0,
        ['Holistic', 'Mental health'],
        'Contact for pricing',
        'Personalized',
      ],
      [
        'Addiction Rehab Toronto',
        'addiction-rehab-toronto',
        '4 Warrendale Ct, Etobicoke, ON M9V 1P9',
        'Etobicoke',
        'Addiction Rehab Toronto is one of the premier addiction treatment centres in Toronto, with a long-standing reputation for providing effective and high-quality rehabilitation services to those in need. They offer various types of addiction recovery treatment.',
        '3 Reviews',
        1,
        1,
        ['Residential', 'Detox', 'Aftercare'],
        'Contact for pricing',
        '30 – 90 days',
      ],
      [
        'Field Trip Health Toronto',
        'field-trip-health-toronto',
        '30 Duncan St Suite 400, Toronto, ON M5V 2C3',
        'Toronto',
        'Field Trip Health Toronto: Revolutionizing Mental Health Treatment. Field Trip Health Toronto is a forward-thinking mental health clinic that offers medication-assisted therapy (MAT) to individuals struggling with severe depression, anxiety, and PTSD.',
        '0 Reviews',
        0,
        0,
        ['Outpatient', 'Medication-assisted', 'Mental health'],
        'Contact for pricing',
        'Outpatient sessions',
      ],
      [
        'Centre slot 8 — add from backend',
        '#',
        'Toronto, ON',
        'Toronto',
        'Description added from the backend.',
        '0 Reviews',
        0,
        0,
        ['Residential'],
        'Contact for pricing',
        '—',
      ],
    ];
    // Google rating / review counts are sample values until wired to the backend.
    const ranked = cityRaw.map((r, i) => ({
      n: i + 1,
      id: 'centre-' + (i + 1),
      anchor: '#centre-' + (i + 1),
      name: r[0],
      href: r[1] === '#' ? '#' : B + r[1] + '/',
      address: r[2] + ', Canada',
      cityShort: r[3] + ', ON',
      excerpt: r[4],
      reviews: r[5],
      featured: !!r[6],
      verified: !!r[7],
      tags: r[8],
      tagLine: r[8].join(' · '),
      price: r[9],
      length: r[10],
      photo: 'photo · ' + r[1] + '.jpg',
      rating: (4.4 + ((i * 3) % 6) / 10).toFixed(1),
      googleReviews: 18 + ((i * 41) % 120),
      category: cityProvince + ' Rehabs',
      catHref: B + 'listing-category/ontario-rehabs/',
      numBg: i < 3 ? '#10233a' : '#eaf5fd',
      numColor: i < 3 ? '#fff' : '#0890E8',
      rankBg:
        [
          'linear-gradient(160deg,#ffd76a,#e9a826)',
          'linear-gradient(160deg,#f1f4f8,#b9c4d0)',
          'linear-gradient(160deg,#f2c29a,#c07a45)',
        ][i] || 'linear-gradient(160deg,#1aa0f0,#0a6fc0)',
      rankInk: i === 0 ? '#5a3a00' : i === 1 ? '#2a3a4c' : i === 2 ? '#4a2508' : '#fff',
      rankGlow: ['rgba(200,140,20,.7)', 'rgba(90,110,130,.6)', 'rgba(150,80,30,.6)'][i] || 'rgba(8,112,190,.6)',
      rankLabel: ['Top pick', 'Runner-up', 'Third place'][i] || 'of ' + cityRaw.length,
    }));
    const criteria = [
      {
        icon: ic.check,
        title: 'Verified listing',
        body: 'Claimed and verified centres rank higher; details are confirmed directly with the provider.',
      },
      {
        icon: ic.shield,
        title: 'Licensing & accreditation',
        body: 'Ontario licensing and recognized accreditation where applicable.',
      },
      {
        icon: ic.doc,
        title: 'Program range',
        body: 'Detox, residential, outpatient and aftercare — breadth and clarity of what is offered.',
      },
      {
        icon: ic.heart,
        title: 'Client reviews',
        body: 'Reviews on our site and Google, weighted for recency and volume.',
      },
    ];
    const cityFaqData = [
      [
        'How many rehab centres are in ' + city + '?',
        'This ranking covers the ' +
          cityRaw.length +
          ' best-rated centres serving ' +
          city +
          ' and the Greater Toronto Area, including nearby facilities in Etobicoke, Whitby and Brantford. Our full Ontario directory lists many more — call us if none of these fit.',
      ],
      [
        'How much does rehab cost in ' + city + '?',
        'Private residential programs in the GTA typically range from a few thousand dollars for shorter stays to $20,000+ for 30-day programs with medical detox; publicly funded options through Ontario Health and CAMH are free but may have wait times. Each listing above shows indicative pricing — call the centre or our helpline to confirm.',
      ],
      [
        'Is there free or OHIP-covered rehab in ' + city + '?',
        'Yes. Publicly funded withdrawal management and residential treatment are available in ' +
          city +
          ' through providers such as CAMH and ConnexOntario referrals. Wait times vary. Private centres are not covered by OHIP but may be covered by extended health benefits or EAP plans.',
      ],
      [
        'How long does rehab last?',
        'Most residential programs run 30 to 90 days; detox alone is usually 3 to 10 days. Several ' +
          city +
          ' centres also offer outpatient and aftercare programs that continue for months after residential treatment.',
      ],
      [
        'What is the difference between detox and rehab?',
        'Detox is the medically supervised first step of clearing substances from the body and managing withdrawal. Rehab is the treatment that follows — therapy, education, relapse prevention and aftercare planning. Some centres in this list offer both; others focus on one stage.',
      ],
      [
        'Can you help me get into a ' + city + ' centre today?',
        'Often, yes. Call 1-855-885-4747 any time. We will talk through your circumstances and contact centres with immediate availability on your behalf. The service is free and confidential.',
      ],
    ];
    const cityFaqs = cityFaqData.map(([question, answer], i) => ({
      question,
      answer,
      open: i === faq,
      toggle: () => this.setState({ faq: faq === i ? -1 : i }),
      border: i === faq ? '#0890E8' : '#e3ecf4',
      rot: i === faq ? 'rotate(45deg)' : 'rotate(0deg)',
    }));
    const cityToc = [
      ['The ranking', '#ranked'],
      ['Benefits of rehab in ' + city, '#benefits'],
      ['Detoxification', '#detox'],
      ['Therapy options', '#therapy'],
      ['Aftercare planning', '#aftercare'],
      ['FAQ', '#faq'],
    ].map(([label, href]) => ({ label, href }));
    const nearby = [
      { label: 'Ontario Rehabs', href: B + 'ontario-rehabs/', code: 'ON' },
      { label: 'Ottawa Rehabs', href: B + 'ottawa-rehabs/', code: 'OTT' },
      { label: 'Montreal Rehabs', href: B + 'montreal-rehabs/', code: 'MTL' },
      { label: 'Vancouver Rehabs', href: B + '7-best-drug-alcohol-rehab-centres-in-vancouver-2025/', code: 'VAN' },
    ];
    const popularTypes = [
      ['Detox Centres', 'detox-centres-in-canada'],
      ['Residential Rehabs', 'residential-drug-rehabs-in-canada'],
      ['Outpatient Rehab', 'outpatient-drug-rehab-centers'],
      ['Medical Detox', 'medical-detox-in-canada'],
      ['12 Step Programs', '12-steps-programs'],
      ['Men Only Rehabs', 'men-only-drug-rehabs-in-canada'],
      ['Women Only Rehabs', 'women-only-rehab-centers-in-canada'],
      ['Adolescent Rehab', 'adolescent-drug-rehab-center'],
      ['Holistic Services', 'holistic-services-in-canada'],
      ['Alcohol Addiction', 'addiction-by-alcohol'],
    ].map(([label, p]) => ({ label, href: B + p + '/' }));

    return {
      city,
      cityProvince,
      provinceHref: B + 'ontario-rehabs/',
      year,
      rankCount: this.props.cityCount ?? cityRaw.length,
      cityUpdated: 'Jun 2025',
      cityUpdatedLong: 'June 6, 2025',
      verifiedCount: ranked.filter((r) => r.verified).length,
      reviewTotal: ranked.reduce((s, r) => s + parseInt(r.reviews), 0) + '+',
      rankCols: this.state.vw >= 900 ? '340px minmax(0,1fr)' : 'minmax(0,1fr)',
      rankStatCols: this.state.vw >= 560 ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
      ranked,
      criteria,
      cityFaqs,
      cityToc,
      nearby,
      popularTypes,
      province,
      count: total,
      cityCount: Object.keys(cityMap).length,
      updated: 'Mar 2026',
      updatedLong: 'March 28, 2026',
      authorName: this.props.authorName ?? 'Editorial Team',
      authorRole: 'Addiction Rehab Centres Canada',
      reviewerName: this.props.reviewerName ?? 'Clinical Reviewer (name, credentials)',
      reviewerRole: 'Registered addiction counsellor',
      iconPhoneSm: ic.phone,
      iconShield: ic.shield,
      trust,
      filters,
      listings,
      shownCount: listings.length,
      hasMore: shown < filtered.length,
      loadMore: () => this.setState({ shown: shown + 12 }),
      cities,
      toc,
      faqs,
      otherProvinces,
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
    authorName,
    authorRole,
    city,
    cityFaqs,
    cityProvince,
    cityToc,
    cityUpdated,
    cityUpdatedLong,
    criteria,
    footerCols,
    iconPhoneSm,
    nearby,
    popularTypes,
    provinceHref,
    rankCols,
    rankCount,
    rankStatCols,
    ranked,
    reviewTotal,
    reviewerName,
    reviewerRole,
    verifiedCount,
    year,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="provinces" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        <section
          data-screen-label="City Hero"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(1000px 500px at 85% -10%,#dbeefb 0%,rgba(219,238,251,0) 60%),#f7fafd',
            borderBottom: '1px solid #e9eff5',
          }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 32px 56px' }} data-rc-wrap="1">
            <nav
              aria-label="Breadcrumb"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13.5px',
                color: '#6b7f95',
                marginBottom: '36px',
                flexWrap: 'wrap',
              }}
            >
              <$A className="scp0" href="https://addictionrehabcenters.ca/" style={{ color: '#6b7f95' }}>
                Home
              </$A>
              <span style={{ opacity: '.5' }}>/</span>
              <$A className="scp0" href="https://addictionrehabcenters.ca/rehab/" style={{ color: '#6b7f95' }}>
                Rehabs By Provinces
              </$A>
              <span style={{ opacity: '.5' }}>/</span>
              <$A className="scp0" href={provinceHref} style={{ color: '#6b7f95' }}>
                {$i(cityProvince)} Rehabs
              </$A>
              <span style={{ opacity: '.5' }}>/</span>
              <span style={{ color: '#10233a', fontWeight: '500' }}>{$i(city)} Rehabs</span>
            </nav>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: '56px', alignItems: 'start' }}
              data-cols="1.1fr .9fr"
              data-rc-gap="1"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#D82028',
                      background: '#fdecec',
                      padding: '6px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    Ranked list · {$i(year)}
                  </span>
                  <span
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#0890E8',
                      background: '#eaf5fd',
                      padding: '6px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    Updated {$i(cityUpdated)}
                  </span>
                </div>
                <h1 style={{ fontSize: '52px', lineHeight: '1.05', color: '#10233a' }} data-rc-lg="1">
                  {$i(rankCount)} Best Rehab Centres in {$i(city)} {$i(year)}{' '}
                  <span style={{ color: '#0890E8' }}>(With Pricing)</span>
                </h1>
                <h2 style={{ font: '400 22px/1.45 Figtree,sans-serif', color: '#516378' }}>
                  Addiction Rehab Centres {$i(city)}
                </h2>
                <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63', maxWidth: '620px' }}>
                  Looking for the best rehab centres in Toronto in 2025? Look no further than our comprehensive list of
                  the 8 top-rated facilities. Whether you're seeking addiction treatment, mental health support, or a
                  combination of both, our carefully curated selection of rehab centres offers the highest quality care
                  and resources to help you achieve your goals. Don't wait any longer to get the help you need – explore
                  our list now and take the first step towards a healthier, happier life.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <$A
                    className="scp1"
                    href="tel:+18558854747"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      font: '600 16px Jost,sans-serif',
                      color: '#fff',
                      background: '#0890E8',
                      padding: '14px 22px',
                      borderRadius: '12px',
                      boxShadow: '0 10px 24px -12px rgba(8,144,232,.6)',
                    }}
                  >
                    {$i(iconPhoneSm)}
                    Call 1-855-885-4747
                  </$A>
                  <$A
                    className="scp2"
                    href="#ranked"
                    style={{
                      font: '600 16px Jost,sans-serif',
                      color: '#10233a',
                      background: '#fff',
                      border: '1px solid #dbe6f0',
                      padding: '14px 22px',
                      borderRadius: '12px',
                    }}
                  >
                    See the ranking
                  </$A>
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: '28px',
                    flexWrap: 'wrap',
                    marginTop: '12px',
                    paddingTop: '20px',
                    borderTop: '1px solid #e3ecf4',
                  }}
                >
                  <div>
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>{$i(rankCount)}</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>Centres ranked</div>
                  </div>
                  <div>
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>{$i(verifiedCount)}</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>Verified listings</div>
                  </div>
                  <div>
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>{$i(reviewTotal)}</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>Client reviews</div>
                  </div>
                  <div>
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>24/7</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>Free helpline</div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '24px',
                  padding: '24px',
                  boxShadow: '0 40px 80px -50px rgba(16,35,58,.4)',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <h3 style={{ fontSize: '17px' }}>At a glance</h3>
                  <span style={{ fontSize: '12.5px', color: '#6b7f95' }}>Jump to a centre</span>
                </div>
                <ol style={{ margin: '0', padding: '0', listStyle: 'none', display: 'flex', flexDirection: 'column' }}>
                  {$list(ranked).map((r, $index) => (
                    <Fragment key={$index}>
                      <li>
                        <$A
                          className="scp13"
                          href={r?.anchor}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '30px 1fr auto',
                            gap: '12px',
                            alignItems: 'center',
                            padding: '10px 8px',
                            borderRadius: '10px',
                            color: '#10233a',
                            borderTop: '1px solid #f0f4f8',
                          }}
                          data-cols="30px 1fr auto"
                        >
                          <span
                            style={$css(
                              `font:600 13px Jost,sans-serif;width:30px;height:30px;border-radius:9px;background:${r?.numBg ?? ''};color:${r?.numColor ?? ''};display:grid;place-items:center`,
                            )}
                          >
                            {$i(r?.n)}
                          </span>
                          <span style={{ display: 'flex', flexDirection: 'column', minWidth: '0' }}>
                            <span
                              style={{
                                font: '600 14.5px Jost,sans-serif',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {$i(r?.name)}
                            </span>
                            <span style={{ fontSize: '12px', color: '#6b7f95' }}>{$i(r?.cityShort)}</span>
                          </span>
                          <span
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              font: '600 13px Jost,sans-serif',
                            }}
                          >
                            <span style={{ color: '#F5A623', fontSize: '12px' }}>★</span>
                            {$i(r?.rating)}
                          </span>
                        </$A>
                      </li>
                    </Fragment>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="How we ranked" style={{ background: '#fff', borderBottom: '1px solid #e9eff5' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '36px 32px',
              display: 'flex',
              flexDirection: 'column',
              gap: '22px',
            }}
            data-rc-wrap="1"
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px', flexWrap: 'wrap' }}>
              <h3 style={{ fontSize: '20px' }}>How we ranked these {$i(city)} centres</h3>
              <p style={{ fontSize: '14px', color: '#6b7f95', lineHeight: '1.5' }}>
                No centre pays for a rank. Placement reflects the criteria below, re-checked at every update.
              </p>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '14px' }}
              data-cols="repeat(auto-fit,minmax(240px,1fr))"
            >
              {$list(criteria).map((t, $index) => (
                <Fragment key={$index}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      padding: '16px',
                      border: '1px solid #e3ecf4',
                      borderRadius: '16px',
                      background: '#f7fafd',
                    }}
                  >
                    <span
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        background: '#fff',
                        border: '1px solid #e3ecf4',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: '0',
                      }}
                    >
                      {$i(t?.icon)}
                    </span>
                    <div>
                      <div style={{ font: '600 14.5px Jost,sans-serif', color: '#10233a' }}>{$i(t?.title)}</div>
                      <div style={{ fontSize: '13px', color: '#6b7f95', lineHeight: '1.45', marginTop: '3px' }}>
                        {$i(t?.body)}
                      </div>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section id="ranked" data-screen-label="Ranked list" style={{ background: '#f7fafd' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 32px 72px' }} data-rc-wrap="1">
            <div style={{ marginBottom: '28px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                The ranking
              </span>
              <h2 style={{ fontSize: '36px', marginTop: '8px' }} data-rc-lg="1">
                {$i(rankCount)} Best Rehab Centres in {$i(city)}
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {$list(ranked).map((c, $index) => (
                <Fragment key={$index}>
                  <article
                    className="scp14"
                    id={c?.id}
                    style={$css(
                      `background:#fff;border:1px solid #e3ecf4;border-radius:24px;overflow:hidden;display:grid;grid-template-columns:${rankCols ?? ''};transition:box-shadow .25s ease,transform .25s cubic-bezier(.23,1,.32,1)`,
                    )}
                    data-rc-dyn="1"
                  >
                    <$A
                      href={c?.href}
                      style={{
                        position: 'relative',
                        display: 'block',
                        minHeight: '260px',
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
                        {$i(c?.photo)}
                      </span>
                      <span
                        style={{
                          position: 'absolute',
                          inset: '0',
                          background: 'linear-gradient(180deg,rgba(16,35,58,.28) 0%,rgba(16,35,58,0) 40%)',
                          pointerEvents: 'none',
                        }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: '16px',
                          left: '16px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          height: '44px',
                          padding: '0 14px 0 6px',
                          borderRadius: '14px',
                          background: 'rgba(255,255,255,.94)',
                          backdropFilter: 'blur(10px)',
                          WebkitBackdropFilter: 'blur(10px)',
                          boxShadow: '0 10px 24px -12px rgba(16,35,58,.55)',
                        }}
                      >
                        <span
                          style={$css(
                            `width:32px;height:32px;border-radius:10px;background:${c?.rankBg ?? ''};color:${c?.rankInk ?? ''};display:grid;place-items:center;font:700 16px/1 Jost,sans-serif;box-shadow:inset 0 1px 0 rgba(255,255,255,.45),0 4px 10px -4px ${c?.rankGlow ?? ''}`,
                          )}
                        >
                          {$i(c?.n)}
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '0', lineHeight: '1.1' }}>
                          <span
                            style={{
                              font: '600 9.5px Figtree,sans-serif',
                              letterSpacing: '.14em',
                              textTransform: 'uppercase',
                              color: '#6b7f95',
                            }}
                          >
                            Rank
                          </span>
                          <span style={{ font: '600 13.5px Jost,sans-serif', color: '#10233a', whiteSpace: 'nowrap' }}>
                            {$i(c?.rankLabel)}
                          </span>
                        </span>
                      </span>
                      <span
                        style={{
                          position: 'absolute',
                          top: '16px',
                          right: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          alignItems: 'flex-end',
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
                          </>
                        ) : null}
                      </span>
                    </$A>
                    <div
                      style={{
                        padding: '26px 28px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        minWidth: '0',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '16px',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '0' }}>
                          <$A
                            href={c?.catHref}
                            style={{
                              font: '600 12px Figtree,sans-serif',
                              letterSpacing: '.1em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {$i(c?.category)}
                          </$A>
                          <h3 style={{ fontSize: '24px', lineHeight: '1.2' }}>
                            <$A className="scp0" href={c?.href} style={{ color: '#10233a' }}>
                              {$i(c?.name)}
                            </$A>
                          </h3>
                          <p
                            style={{
                              fontSize: '13.5px',
                              color: '#6b7f95',
                              display: 'flex',
                              gap: '7px',
                              alignItems: 'center',
                            }}
                          >
                            <span
                              style={{
                                width: '7px',
                                height: '7px',
                                border: '1.5px solid #6b7f95',
                                borderRadius: '50% 50% 50% 0',
                                transform: 'rotate(-45deg)',
                                flexShrink: '0',
                              }}
                            />
                            {$i(c?.address)}
                          </p>
                        </div>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#fff',
                            border: '1px solid #e6eef6',
                            borderRadius: '999px',
                            padding: '7px 14px',
                            flexShrink: '0',
                            boxShadow: '0 6px 14px -10px rgba(16,35,58,.25)',
                          }}
                        >
                          <span
                            style={{
                              font: '700 13px Figtree,sans-serif',
                              background: 'conic-gradient(#4285F4 0 25%,#34A853 25% 50%,#FBBC05 50% 75%,#EA4335 75%)',
                              color: 'transparent',
                              WebkitBackgroundClip: 'text',
                              backgroundClip: 'text',
                            }}
                          >
                            G
                          </span>
                          <span style={{ color: '#F5A623', fontSize: '13px', letterSpacing: '1px' }}>★★★★★</span>
                          <span style={{ font: '600 14px Jost,sans-serif', color: '#10233a' }}>{$i(c?.rating)}</span>
                          <span style={{ fontSize: '12.5px', color: '#6b7f95' }}>({$i(c?.googleReviews)})</span>
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {$list(c?.tags).map((tg, $index) => (
                          <Fragment key={$index}>
                            <span
                              style={{
                                font: '500 12.5px Figtree,sans-serif',
                                color: '#0a5d96',
                                background: '#eaf5fd',
                                border: '1px solid #d6eafa',
                                padding: '5px 11px',
                                borderRadius: '999px',
                              }}
                            >
                              {$i(tg)}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                      <p style={{ fontSize: '15.5px', lineHeight: '1.65', color: '#3b4d63' }}>{$i(c?.excerpt)}</p>
                      <div
                        style={$css(`display:grid;grid-template-columns:${rankStatCols ?? ''};gap:12px;margin-top:4px`)}
                        data-rc-dyn="1"
                      >
                        <div
                          style={{ background: '#f7fafd', borderRadius: '12px', padding: '12px 14px', minWidth: '0' }}
                        >
                          <div
                            style={{
                              font: '600 11px Figtree,sans-serif',
                              letterSpacing: '.1em',
                              textTransform: 'uppercase',
                              color: '#6b7f95',
                            }}
                          >
                            Pricing
                          </div>
                          <div style={{ font: '600 14.5px Jost,sans-serif', marginTop: '3px' }}>{$i(c?.price)}</div>
                        </div>
                        <div
                          style={{ background: '#f7fafd', borderRadius: '12px', padding: '12px 14px', minWidth: '0' }}
                        >
                          <div
                            style={{
                              font: '600 11px Figtree,sans-serif',
                              letterSpacing: '.1em',
                              textTransform: 'uppercase',
                              color: '#6b7f95',
                            }}
                          >
                            Program length
                          </div>
                          <div style={{ font: '600 14.5px Jost,sans-serif', marginTop: '3px' }}>{$i(c?.length)}</div>
                        </div>
                        <div
                          style={{ background: '#f7fafd', borderRadius: '12px', padding: '12px 14px', minWidth: '0' }}
                        >
                          <div
                            style={{
                              font: '600 11px Figtree,sans-serif',
                              letterSpacing: '.1em',
                              textTransform: 'uppercase',
                              color: '#6b7f95',
                            }}
                          >
                            Site reviews
                          </div>
                          <div style={{ font: '600 14.5px Jost,sans-serif', marginTop: '3px' }}>{$i(c?.reviews)}</div>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '14px',
                          borderTop: '1px solid #edf2f7',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '12px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ fontSize: '13px', color: '#6b7f95' }}>
                          Details verified with the centre · Updated {$i(cityUpdated)}
                        </span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <$A
                            className="scp15 scpy"
                            href="tel:+18558854747"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              height: '42px',
                              font: '600 14px Jost,sans-serif',
                              color: '#0a5d96',
                              background: '#eaf5fd',
                              padding: '0 16px 0 6px',
                              borderRadius: '999px',
                              transition: 'background .15s ease,transform .12s ease-out',
                            }}
                          >
                            <span
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '50%',
                                background: '#D82028',
                                color: '#fff',
                                display: 'grid',
                                placeItems: 'center',
                              }}
                            >
                              {$i(iconPhoneSm)}
                            </span>
                            Call for availability
                          </$A>
                          <$A
                            className="scp1 scpy"
                            href={c?.href}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '8px',
                              height: '42px',
                              font: '600 14px Jost,sans-serif',
                              color: '#fff',
                              background: '#0890E8',
                              padding: '0 18px',
                              borderRadius: '999px',
                              transition: 'background .15s ease,transform .12s ease-out',
                            }}
                          >
                            View centre
                            <svg width="15" height="15" viewBox="0 0 24 24">
                              <path
                                d="M5 12h14M13 6l6 6-6 6"
                                style={{
                                  fill: 'none',
                                  stroke: 'currentColor',
                                  strokeWidth: '2.2',
                                  strokeLinecap: 'round',
                                  strokeLinejoin: 'round',
                                }}
                              />
                            </svg>
                          </$A>
                        </div>
                      </div>
                    </div>
                  </article>
                </Fragment>
              ))}
            </div>
            <div
              style={{
                marginTop: '56px',
                background: 'linear-gradient(135deg,#0f5fa8,#0890E8)',
                borderRadius: '24px',
                padding: '32px 36px',
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                gap: '28px',
                alignItems: 'center',
                color: '#fff',
              }}
              data-cols="1fr auto"
            >
              <div>
                <h3 style={{ fontSize: '24px', color: '#fff' }}>Not sure which {$i(city)} centre is right for you?</h3>
                <p style={{ fontSize: '15px', opacity: '.9', marginTop: '6px', lineHeight: '1.5' }}>
                  We'll ask a few questions, check availability and funding, and connect you directly. Free and
                  confidential, 24/7.
                </p>
              </div>
              <$A
                className="scp5"
                href="tel:+18558854747"
                style={{
                  font: '600 17px Jost,sans-serif',
                  color: '#0f5fa8',
                  background: '#fff',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  whiteSpace: 'nowrap',
                }}
              >
                Call 1-855-885-4747
              </$A>
            </div>
          </div>
        </section>
        <section data-screen-label="Compare" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 32px' }} data-rc-wrap="1">
            <div style={{ marginBottom: '24px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Side by side
              </span>
              <h2 style={{ fontSize: '32px', marginTop: '8px' }}>Compare {$i(city)} rehab centres</h2>
            </div>
            <div style={{ border: '1px solid #e3ecf4', borderRadius: '20px', overflow: 'hidden', background: '#fff' }}>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '44px 1.6fr 1.2fr 1.4fr 1fr .8fr',
                  gap: '16px',
                  padding: '14px 20px',
                  background: '#f7fafd',
                  borderBottom: '1px solid #e3ecf4',
                  font: '600 11.5px Figtree,sans-serif',
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: '#6b7f95',
                }}
                data-cols="44px 1.6fr 1.2fr 1.4fr 1fr .8fr"
              >
                <span>#</span>
                <span>Centre</span>
                <span>Location</span>
                <span>Programs</span>
                <span>Pricing</span>
                <span>Rating</span>
              </div>
              {$list(ranked).map((c, $index) => (
                <Fragment key={$index}>
                  <$A
                    className="scp16"
                    href={c?.href}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '44px 1.6fr 1.2fr 1.4fr 1fr .8fr',
                      gap: '16px',
                      padding: '16px 20px',
                      borderBottom: '1px solid #f0f4f8',
                      alignItems: 'center',
                      color: '#10233a',
                      fontSize: '14.5px',
                    }}
                    data-cols="44px 1.6fr 1.2fr 1.4fr 1fr .8fr"
                  >
                    <span style={{ font: '600 13px Jost,sans-serif', color: '#0890E8' }}>{$i(c?.n)}</span>
                    <span style={{ font: '600 15px Jost,sans-serif' }}>{$i(c?.name)}</span>
                    <span style={{ color: '#516378' }}>{$i(c?.cityShort)}</span>
                    <span style={{ color: '#516378' }}>{$i(c?.tagLine)}</span>
                    <span style={{ color: '#516378' }}>{$i(c?.price)}</span>
                    <span
                      style={{ display: 'flex', alignItems: 'center', gap: '5px', font: '600 14px Jost,sans-serif' }}
                    >
                      <span style={{ color: '#F5A623' }}>★</span>
                      {$i(c?.rating)}
                      <span style={{ font: '400 12.5px Figtree,sans-serif', color: '#6b7f95' }}>
                        ({$i(c?.googleReviews)})
                      </span>
                    </span>
                  </$A>
                </Fragment>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: '#6b7f95', marginTop: '12px' }}>
              Pricing is indicative and confirmed with each centre at the time of update; programs and fees change —
              call to confirm.
            </p>
          </div>
        </section>
        <section data-screen-label="Guide" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '80px 32px',
              display: 'grid',
              gridTemplateColumns: '300px 1fr',
              gap: '64px',
              alignItems: 'start',
            }}
            data-cols="300px 1fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <aside style={{ position: 'sticky', top: '130px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '20px', padding: '22px' }}>
                <div
                  style={{
                    font: '600 11.5px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#6b7f95',
                    marginBottom: '12px',
                  }}
                >
                  On this page
                </div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {$list(cityToc).map((t, $index) => (
                    <Fragment key={$index}>
                      <li>
                        <$A
                          className="scp0"
                          href={t?.href}
                          style={{
                            font: '500 14px Figtree,sans-serif',
                            color: '#1f3550',
                            display: 'flex',
                            gap: '10px',
                            alignItems: 'center',
                          }}
                        >
                          <span
                            style={{
                              width: '5px',
                              height: '5px',
                              borderRadius: '50%',
                              background: '#0890E8',
                              opacity: '.6',
                            }}
                          />
                          {$i(t?.label)}
                        </$A>
                      </li>
                    </Fragment>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '20px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                }}
              >
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'repeating-linear-gradient(135deg,#dfeaf3 0 6px,#eaf2f8 6px 12px)',
                      flexShrink: '0',
                    }}
                  />
                  <div>
                    <div
                      style={{
                        font: '600 11px Figtree,sans-serif',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        color: '#6b7f95',
                      }}
                    >
                      Written by
                    </div>
                    <div style={{ font: '600 14.5px Jost,sans-serif' }}>{$i(authorName)}</div>
                    <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>{$i(authorRole)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      background: 'repeating-linear-gradient(135deg,#dfeaf3 0 6px,#eaf2f8 6px 12px)',
                      flexShrink: '0',
                    }}
                  />
                  <div>
                    <div
                      style={{
                        font: '600 11px Figtree,sans-serif',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        color: '#6b7f95',
                      }}
                    >
                      Medically reviewed by
                    </div>
                    <div style={{ font: '600 14.5px Jost,sans-serif' }}>{$i(reviewerName)}</div>
                    <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>{$i(reviewerRole)}</div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    color: '#6b7f95',
                    borderTop: '1px solid #edf2f7',
                    paddingTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <span>Last updated {$i(cityUpdatedLong)}</span>
                  <span>Est. reading time 3 minutes</span>
                </div>
              </div>
            </aside>
            <article style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '760px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                {$i(city)} treatment guide
              </span>
              <h2 id="benefits" style={{ fontSize: '38px', lineHeight: '1.12' }} data-rc-lg="1">
                The Benefits of Rehab Centres in {$i(city)}
              </h2>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Addiction is defined as a chronic, relapsing disorder characterized by compulsive drug seeking and use.
                Treatment for addiction often involves detoxification, which is the process of removing harmful toxins
                from the body. Drug and alcohol rehab centres in Toronto provide detoxification services as well as
                therapy options that can help individuals struggling with addiction to gain control over their lives
                again. In this blog post, we will explore what detoxification is and how it works, different types of
                therapy available at rehab centres in Toronto, and aftercare planning upon leaving a treatment centre.
              </p>
              <h3 id="detox" style={{ fontSize: '26px', marginTop: '10px' }}>
                Detoxification: the first step
              </h3>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Detoxification is the first step in the recovery process for many individuals struggling with addiction.
                It is an intense process that helps rid the body of substances that have built up over time and are
                impacting physical health. Detoxification typically takes place under medical supervision and can be
                done in either an inpatient or outpatient setting. During detoxification, individuals may experience
                withdrawal symptoms such as nausea, vomiting, headaches, fatigue, insomnia or irritability; therefore it
                is important to seek medical supervision when undergoing this process.
              </p>
              <h3 id="therapy" style={{ fontSize: '26px', marginTop: '10px' }}>
                Therapy options at {$i(city)} rehab centres
              </h3>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                After detoxification has been completed successfully, individuals can begin participating in various
                forms of therapy at rehab centres in Toronto. Group therapy provides a safe space for participants to
                share experiences related to their substance use issues with others who are also working towards
                recovery. Individual therapy allows clients to work one-on-one with a therapist to focus on personal
                goals related to their recovery journey. Cognitive Behavioral Therapy (CBT) focuses on helping clients
                identify patterns of behavior that lead them back into using substances and teaching them skills on how
                to break these patterns so they can stay sober long-term. Holistic treatments such as yoga, meditation
                or art therapy are also offered at some rehab centres in Toronto and provide additional tools for people
                looking to maintain sobriety after completing treatment programs.
              </p>
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '16px', margin: '6px 0' }}
                data-cols="repeat(2,1fr)"
              >
                <div style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '18px', padding: '22px' }}>
                  <div
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#0890E8',
                      marginBottom: '8px',
                    }}
                  >
                    Group therapy
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#3b4d63' }}>
                    A safe space to share experiences with others working towards recovery.
                  </p>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '18px', padding: '22px' }}>
                  <div
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#0890E8',
                      marginBottom: '8px',
                    }}
                  >
                    Individual therapy
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#3b4d63' }}>
                    One-on-one work with a therapist on personal recovery goals.
                  </p>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '18px', padding: '22px' }}>
                  <div
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#0890E8',
                      marginBottom: '8px',
                    }}
                  >
                    CBT
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#3b4d63' }}>
                    Identify the patterns that lead back to use and learn skills to break them.
                  </p>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '18px', padding: '22px' }}>
                  <div
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#0890E8',
                      marginBottom: '8px',
                    }}
                  >
                    Holistic
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#3b4d63' }}>
                    Yoga, meditation or art therapy as additional tools for lasting sobriety.
                  </p>
                </div>
              </div>
              <h3 id="aftercare" style={{ fontSize: '26px', marginTop: '10px' }}>
                Aftercare planning
              </h3>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Once individuals have completed their treatment program at a rehab centre in Toronto, it is important
                for them to create an aftercare plan that includes continued support from family members or friends as
                well as ongoing access to self-help groups such as Alcoholics Anonymous (AA). Setting up an aftercare
                plan prior to leaving a rehabilitation centre ensures that clients have access to resources they need
                while transitioning back into everyday life outside of the treatment facility. Additionally, having a
                comprehensive aftercare plan helps prevent relapse down the road by providing ongoing support throughout
                the recovery journey.
              </p>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Drug and alcohol rehab centres in Toronto offer a variety of services designed specifically to assist
                people struggling with addiction to regain control over their lives again through detoxification
                services and therapeutic programs tailored to each individual's needs upon entering treatment
                facilities. A successful recovery journey requires more than just completing a program at a rehab
                centre; it also includes creating an effective aftercare plan that includes continued support from
                family members or friends along with regular participation in self-help groups like AA or SMART Recovery
                meetings so that clients remain accountable throughout their sobriety journey even when they have left
                treatment facilities behind them. With proper planning before leaving a treatment centre—as well as
                continued commitment—anyone recovering from addiction has the potential for long-term success!
              </p>
              <div
                style={{
                  marginTop: '10px',
                  padding: '20px 22px',
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div
                  style={{
                    font: '600 11.5px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#6b7f95',
                  }}
                >
                  {'Sources & further reading'}
                </div>
                <ul
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '14px',
                    lineHeight: '1.5',
                    color: '#3b4d63',
                  }}
                >
                  <li>CAMH (Centre for Addiction and Mental Health), Toronto — addiction services and access</li>
                  <li>ConnexOntario — 24/7 provincial mental health and addiction navigation</li>
                  <li>
                    <$A href="https://addictionrehabcenters.ca/detox-centres-in-canada/">Detox Centres in Canada</$A> ·{' '}
                    <$A href="https://addictionrehabcenters.ca/aa-support-group/">AA Support Groups</$A> ·{' '}
                    <$A href="https://addictionrehabcenters.ca/ontario-rehabs/">All Ontario Rehabs</$A>
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </section>
        <section id="faq" data-screen-label="FAQ" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '80px 32px',
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
                Rehab in {$i(city)}: your questions answered
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.65', color: '#516378' }}>
                What people ask us most about treatment in {$i(city)}. Still unsure? Call — it's free and confidential.
              </p>
              <$A
                className="scp7"
                href="tel:+18558854747"
                style={{
                  alignSelf: 'flex-start',
                  font: '600 15px Jost,sans-serif',
                  color: '#0890E8',
                  border: '1.5px solid #0890E8',
                  padding: '11px 18px',
                  borderRadius: '10px',
                }}
              >
                Ask us directly
              </$A>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {$list(cityFaqs).map((q, $index) => (
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
        <section data-screen-label="Nearby" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '72px 32px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
            }}
            data-cols="1fr 1fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div>
              {' '}
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Nearby
              </span>
              <h2 style={{ fontSize: '28px', marginTop: '8px', marginBottom: '20px' }}>Rehabs near {$i(city)}</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} data-cols="1fr 1fr">
                {$list(nearby).map((loc, $index) => (
                  <Fragment key={$index}>
                    <$A
                      className="scph"
                      href={loc?.href}
                      style={{
                        background: '#fff',
                        border: '1px solid #e3ecf4',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        color: '#10233a',
                        transition: 'border-color .18s',
                      }}
                    >
                      <span
                        style={{
                          font: '600 12px Jost,sans-serif',
                          width: '34px',
                          height: '34px',
                          borderRadius: '9px',
                          background: '#eaf5fd',
                          color: '#0890E8',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        {$i(loc?.code)}
                      </span>
                      <span style={{ font: '500 15px Figtree,sans-serif' }}>{$i(loc?.label)}</span>
                    </$A>
                  </Fragment>
                ))}
              </div>
            </div>
            <div>
              {' '}
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                By need
              </span>
              <h2 style={{ fontSize: '28px', marginTop: '8px', marginBottom: '20px' }}>
                Popular types of rehab in {$i(city)}
              </h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {$list(popularTypes).map((p, $index) => (
                  <Fragment key={$index}>
                    <$A
                      className="scp2"
                      href={p?.href}
                      style={{
                        font: '500 14px Figtree,sans-serif',
                        color: '#1f3550',
                        background: '#fff',
                        border: '1px solid #e3ecf4',
                        padding: '10px 14px',
                        borderRadius: '999px',
                      }}
                    >
                      {$i(p?.label)}
                    </$A>
                  </Fragment>
                ))}
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
  '\nhtml,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\n@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n';
export const css = [ownCss, SiteHeader_css].filter(Boolean).join('\n');
export const defaults = {
  city: 'Toronto',
  year: '2025',
  cityCount: 8,
  authorName: 'Editorial Team',
  reviewerName: 'Clinical Reviewer (name, credentials)',
};
const View = createDC('City', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} responsive {...props} />;
}
