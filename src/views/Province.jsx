'use client';
// Generated from Province.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = { menu: null, tab: 0, slide: 0, faq: 0, shown: 12, filter: 'All' };
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

    return {
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
    cities,
    cityCount,
    count,
    faqs,
    filters,
    footerCols,
    hasMore,
    iconPhoneSm,
    iconShield,
    listings,
    loadMore,
    otherProvinces,
    province,
    reviewerName,
    reviewerRole,
    shownCount,
    toc,
    trust,
    updated,
    updatedLong,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="provinces" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        <section
          data-screen-label="Province Hero"
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
              <span style={{ color: '#10233a', fontWeight: '500' }}>{$i(province)} Rehabs</span>
            </nav>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: '56px', alignItems: 'center' }}
              data-cols="1.15fr .85fr"
              data-rc-gap="1"
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
                  Rehabs by province
                </span>
                <h1 style={{ fontSize: '54px', lineHeight: '1.05', color: '#10233a' }} data-rc-lg="1">
                  {$i(province)} Rehabs
                </h1>
                <h2 style={{ font: '400 22px/1.45 Figtree,sans-serif', color: '#516378' }}>
                  {$i(count)} Best Rehab Centres in {$i(province)}
                </h2>
                <p style={{ fontSize: '16.5px', lineHeight: '1.65', color: '#3b4d63', maxWidth: '600px' }}>
                  Browse the {$i(count)} best rehab centres in {$i(province)} with reviews, locations and phone numbers
                  — from publicly funded detox to private residential treatment. Not sure which one fits? Our free
                  helpline will walk you through it.
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
                    href="#listings"
                    style={{
                      font: '600 16px Jost,sans-serif',
                      color: '#10233a',
                      background: '#fff',
                      border: '1px solid #dbe6f0',
                      padding: '14px 22px',
                      borderRadius: '12px',
                    }}
                  >
                    Browse all {$i(count)} centres
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
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>{$i(count)}</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>Centres listed</div>
                  </div>
                  <div>
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>{$i(cityCount)}</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>{'Cities & towns'}</div>
                  </div>
                  <div>
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>24/7</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>Free helpline</div>
                  </div>
                  <div>
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>{$i(updated)}</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>Last updated</div>
                  </div>
                </div>
              </div>
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    aspectRatio: '4/3',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                    display: 'grid',
                    placeItems: 'start center',
                    paddingTop: '24px',
                    boxShadow: '0 40px 80px -40px rgba(16,35,58,.45)',
                  }}
                >
                  <span
                    style={{
                      font: '500 12px ui-monospace,Menlo,monospace',
                      color: '#516378',
                      background: 'rgba(255,255,255,.85)',
                      padding: '6px 10px',
                      borderRadius: '6px',
                    }}
                  >
                    province photo · {$i(province)} landscape
                  </span>
                </div>
                <div
                  style={{
                    position: 'absolute',
                    left: '-24px',
                    bottom: '28px',
                    background: '#fff',
                    border: '1px solid #e3ecf4',
                    borderRadius: '16px',
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    boxShadow: '0 20px 40px -24px rgba(16,35,58,.35)',
                  }}
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
                    {$i(iconShield)}
                  </span>
                  <div>
                    <div style={{ font: '600 14px Jost,sans-serif' }}>Independently listed</div>
                    <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>Centres verify their own details</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="Why trust us" style={{ background: '#fff', borderBottom: '1px solid #e9eff5' }}>
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
              <h3 style={{ fontSize: '20px' }}>Why trust Addiction Rehab Centres</h3>
              <p style={{ fontSize: '14px', color: '#6b7f95', lineHeight: '1.5' }}>
                A Canadian directory and free helpline — we point you to the right centre, not the highest bidder.
              </p>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '14px' }}
              data-cols="repeat(auto-fit,minmax(240px,1fr))"
            >
              {$list(trust).map((t, $index) => (
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
        <section id="listings" data-screen-label="Listings" style={{ background: '#f7fafd' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 32px 72px' }} data-rc-wrap="1">
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap',
                marginBottom: '22px',
              }}
            >
              <div>
                <span
                  style={{
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#0890E8',
                  }}
                >
                  Directory
                </span>
                <h2 style={{ fontSize: '36px', marginTop: '8px' }} data-rc-lg="1">
                  {$i(count)} Rehab Centres in {$i(province)}
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#6b7f95' }}>
                Sort by{' '}
                <select
                  style={{
                    appearance: 'none',
                    border: '1px solid #dbe6f0',
                    background: '#fff',
                    borderRadius: '10px',
                    padding: '9px 14px',
                    font: '500 14px Figtree,sans-serif',
                    color: '#10233a',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option>Relevance</option>
                  <option>Most reviewed</option>
                  <option>Featured first</option>
                  <option>A – Z</option>
                </select>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: '28px',
                padding: '12px',
                background: '#fff',
                border: '1px solid #e3ecf4',
                borderRadius: '16px',
              }}
            >
              {$list(filters).map((f, $index) => (
                <Fragment key={$index}>
                  <button
                    onClick={f?.toggle}
                    style={$css(
                      `appearance:none;cursor:pointer;font:500 13.5px Figtree,sans-serif;padding:8px 14px;border-radius:999px;border:1px solid ${f?.border ?? ''};background:${f?.bg ?? ''};color:${f?.color ?? ''};transition:all .15s;white-space:nowrap`,
                    )}
                  >
                    {$i(f?.label)}
                  </button>
                </Fragment>
              ))}
              <span
                style={{
                  marginLeft: 'auto',
                  alignSelf: 'center',
                  fontSize: '13px',
                  color: '#6b7f95',
                  paddingRight: '6px',
                }}
              >
                Showing {$i(shownCount)} of {$i(count)}
              </span>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '22px' }}
              data-cols="repeat(3,1fr)"
            >
              {$list(listings).map((c, $index) => (
                <Fragment key={$index}>
                  <article
                    className="scpn"
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '22px',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform .2s,box-shadow .2s',
                    }}
                  >
                    <$A
                      href={c?.href}
                      style={{
                        position: 'relative',
                        display: 'block',
                        aspectRatio: '16/10',
                        background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                      }}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          inset: '0',
                          display: 'grid',
                          placeItems: 'start center',
                          paddingTop: '52px',
                          font: '500 11.5px ui-monospace,Menlo,monospace',
                          color: '#516378',
                        }}
                      >
                        {$i(c?.photo)}
                      </span>
                      <span style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '6px' }}>
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
                      <span
                        style={{
                          position: 'absolute',
                          right: '14px',
                          bottom: '14px',
                          background: '#fff',
                          borderRadius: '10px',
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          boxShadow: '0 8px 20px -10px rgba(16,35,58,.4)',
                        }}
                      >
                        <span
                          style={{
                            font: '700 12px Figtree,sans-serif',
                            background: 'conic-gradient(#4285F4 0 25%,#34A853 25% 50%,#FBBC05 50% 75%,#EA4335 75%)',
                            color: 'transparent',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                          }}
                        >
                          G
                        </span>
                        <span style={{ color: '#F5A623', fontSize: '12px', letterSpacing: '1px' }}>★★★★★</span>
                        <span style={{ font: '600 13px Jost,sans-serif', color: '#10233a' }}>{$i(c?.rating)}</span>
                      </span>
                    </$A>
                    <div
                      style={{
                        padding: '20px 20px 22px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '9px',
                        flex: '1',
                      }}
                    >
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {$list(c?.tags).map((tg, $index) => (
                          <Fragment key={$index}>
                            <span
                              style={{
                                font: '500 11.5px Figtree,sans-serif',
                                color: '#1f3550',
                                background: '#eef4f9',
                                padding: '4px 9px',
                                borderRadius: '999px',
                              }}
                            >
                              {$i(tg)}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                      <h3 style={{ fontSize: '19px', lineHeight: '1.25' }}>
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
                      <p style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#3b4d63' }}>{$i(c?.excerpt)}</p>
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '14px',
                          borderTop: '1px solid #edf2f7',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '10px',
                        }}
                      >
                        <span style={{ fontSize: '13px', color: '#6b7f95' }}>
                          {$i(c?.googleReviews)} Google reviews · {$i(c?.reviews)}
                        </span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <$A
                            className="scp7"
                            href="tel:+18558854747"
                            style={{
                              font: '600 13px Jost,sans-serif',
                              color: '#0890E8',
                              border: '1.5px solid #0890E8',
                              padding: '7px 12px',
                              borderRadius: '9px',
                            }}
                          >
                            Call
                          </$A>
                          <$A
                            className="scp7"
                            href={c?.href}
                            style={{
                              font: '600 13px Jost,sans-serif',
                              color: '#fff',
                              background: '#10233a',
                              padding: '7px 12px',
                              borderRadius: '9px',
                            }}
                          >
                            View
                          </$A>
                        </div>
                      </div>
                    </div>
                  </article>
                </Fragment>
              ))}
            </div>
            {hasMore ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '36px' }}>
                  <button
                    className="scp2"
                    onClick={loadMore}
                    style={{
                      appearance: 'none',
                      cursor: 'pointer',
                      font: '600 16px Jost,sans-serif',
                      color: '#10233a',
                      background: '#fff',
                      border: '1px solid #dbe6f0',
                      padding: '14px 28px',
                      borderRadius: '12px',
                      transition: 'all .18s',
                    }}
                  >
                    Load more centres
                  </button>
                </div>
              </>
            ) : null}
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
                <h3 style={{ fontSize: '24px', color: '#fff' }}>
                  Need help choosing between these {$i(count)} centres?
                </h3>
                <p style={{ fontSize: '15px', opacity: '.9', marginTop: '6px', lineHeight: '1.5' }}>
                  Tell us a bit about your situation and we'll shortlist the {$i(province)} programs that fit — free,
                  confidential, any time of day.
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
        <section data-screen-label="Cities" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '64px 32px' }} data-rc-wrap="1">
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: '24px',
                marginBottom: '24px',
              }}
            >
              <div>
                <span
                  style={{
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#0890E8',
                  }}
                >
                  Browse by city
                </span>
                <h2 style={{ fontSize: '32px', marginTop: '8px' }}>Rehab Centres by City in {$i(province)}</h2>
              </div>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '12px' }}
              data-cols="repeat(5,1fr)"
            >
              {$list(cities).map((ct, $index) => (
                <Fragment key={$index}>
                  <$A
                    className="scph"
                    href={ct?.href}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 16px',
                      border: '1px solid #e3ecf4',
                      borderRadius: '14px',
                      color: '#10233a',
                      background: '#f7fafd',
                      transition: 'border-color .18s',
                    }}
                  >
                    <span style={{ font: '500 15px Figtree,sans-serif' }}>{$i(ct?.name)}</span>
                    <span
                      style={{
                        font: '600 12px Jost,sans-serif',
                        color: '#0890E8',
                        background: '#eaf5fd',
                        padding: '3px 8px',
                        borderRadius: '999px',
                      }}
                    >
                      {$i(ct?.n)}
                    </span>
                  </$A>
                </Fragment>
              ))}
            </div>
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
                  {$list(toc).map((t, $index) => (
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
                  <span>Last updated {$i(updatedLong)}</span>
                  <span>Est. reading time 4 minutes</span>
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
                {$i(province)} treatment guide
              </span>
              <h2 id="guide" style={{ fontSize: '38px', lineHeight: '1.12' }} data-rc-lg="1">
                Addiction Treatment Centres in {$i(province)}
              </h2>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Are you searching for the best addiction treatment centre in Alberta? Look no further. There is a range
                of organizations providing drug and alcohol rehab, some even providing private addiction treatment to
                individuals struggling with substance abuse issues. Alberta provides numerous excellent options for
                those seeking assistance on their road to recovery, from state-funded centres to private operations.
                Researching different offerings and weighing cost/benefit ratios can be immensely helpful when selecting
                an appropriate facility. With assistance from friends and family members, it may become much simpler to
                comprehend your individual needs and make an informed decision regarding the best course of action in
                your particular case.
              </p>
              <h3 id="finding-help" style={{ fontSize: '26px', marginTop: '10px' }}>
                Finding the Right Help for Drug and Alcohol Addiction
              </h3>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Drug and alcohol addiction is a significant problem in Alberta, and it affects individuals and families
                from all walks of life. The good news is that there are many addiction treatment centres in Alberta that
                can help individuals overcome their addictions and lead a sober life. These centres offer a range of
                services, including drug rehab, alcohol rehab, detox, mental health services, and group therapy. In this
                article, we will explore the different types of addiction treatment centres in Alberta and how to find
                the right one for you or your loved one.
              </p>
              <h3 id="drug-alcohol-rehab" style={{ fontSize: '26px', marginTop: '10px' }}>
                Drug Rehab and Alcohol Rehab
              </h3>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Drug rehab and alcohol rehab are the most common types of addiction treatment centres in Alberta. These
                centres offer a range of services, including detox, individual and group therapy, and aftercare support.
                The goal of drug and alcohol rehab is to help individuals overcome their addiction, develop coping
                skills, and lead a sober life.
              </p>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Drug rehab and alcohol rehab centres offer different programs, including inpatient and outpatient
                programs. Inpatient programs are best suited for individuals who require round-the-clock care and
                support. These programs provide a safe and supportive environment where individuals can focus on their
                recovery without distractions. Outpatient programs are best suited for individuals who have a supportive
                home environment and can manage their addiction while attending therapy and other services.
              </p>
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', margin: '6px 0' }}
                data-cols="1fr 1fr"
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
                    Inpatient
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#3b4d63' }}>
                    Round-the-clock care in a residential setting. Best when you need distance from triggers and full
                    focus on recovery.
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
                    Outpatient
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#3b4d63' }}>
                    Therapy and support while living at home. Best with a stable, supportive environment and daily
                    obligations to keep.
                  </p>
                </div>
              </div>
              <h3 id="alcohol-rehab" style={{ fontSize: '26px', marginTop: '10px' }}>
                Alcohol Rehab Alberta
              </h3>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                <$A href="https://addictionrehabcenters.ca/alcohol-drug-rehab-centres-in-alberta/">Alcohol Rehab</$A>{' '}
                Alberta is a specialized type of addiction treatment centre that focuses on alcohol addiction. These
                centres offer a range of services, including detox, individual and group therapy, and aftercare support.
                Alcohol rehab Alberta centres may also provide support for individuals with co-occurring mental health
                conditions, such as depression and anxiety.
              </p>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Alcohol rehab Alberta centres offer different programs, including inpatient and outpatient programs.
                Inpatient programs are best suited for individuals who require round-the-clock care and support.
                Outpatient programs are best suited for individuals who have a supportive home environment and can
                manage their addiction while attending therapy and other services.
              </p>
              <h3 id="detox" style={{ fontSize: '26px', marginTop: '10px' }}>
                Alberta Detox Centres
              </h3>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Alberta detox centres provide medically supervised detox services to individuals who are physically
                dependent on drugs or alcohol. Detox is the first step in addiction treatment and involves the process
                of removing harmful substances from the body. Detox can be a challenging and uncomfortable process, and
                it is best done under the supervision of trained medical professionals.
              </p>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Alberta detox centres offer different types of detox programs, including medical detox and social detox.
                Medical detox involves the use of medications to manage withdrawal symptoms, while social detox involves
                the use of non-medical interventions, such as counselling and support groups.
              </p>
              <h3 id="calgary" style={{ fontSize: '26px', marginTop: '10px' }}>
                Calgary Rehab Centre
              </h3>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Calgary Rehab Centre is a specialized addiction treatment centre located in Calgary, Alberta. This
                centre offers a range of services, including inpatient and outpatient programs, detox, individual and
                group therapy, and aftercare support. Calgary rehab centre also provides specialized programs for
                individuals with co-occurring mental health conditions, such as depression and anxiety.
              </p>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Calgary rehab centre offers a range of programs to suit different needs and preferences. Inpatient
                programs are best suited for individuals who require round-the-clock care and support. Outpatient
                programs are best suited for individuals who have a supportive home environment and can manage their
                addiction while attending therapy and other services.
              </p>
              <h3 id="detox-near-me" style={{ fontSize: '26px', marginTop: '10px' }}>
                <$A
                  className="scp0"
                  href="https://addictionrehabcenters.ca/detox-centres-in-canada/"
                  style={{ color: '#10233a' }}
                >
                  Detox Centres Near Me
                </$A>
              </h3>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Detox centres near me are addiction treatment centres located near your home or workplace. These centres
                provide detox services to individuals who are physically dependent on drugs or alcohol. Detox centres
                near me offer different types of detox programs, including medical detox and social detox. Detox centres
                near me may also provide support services, such as counselling and support groups.
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
                  <li>
                    {
                      'Alberta Health Services — Addiction & Mental Health services (public programs, detox, community clinics)'
                    }
                  </li>
                  <li>Health Canada — Get help with substance use</li>
                  <li>
                    <$A href="https://addictionrehabcenters.ca/detox-centres-in-canada/">Detox Centres in Canada</$A> ·{' '}
                    <$A href="https://addictionrehabcenters.ca/how-to-choose-a-drug-rehab-program-that-works-for-you/">
                      How to choose a drug rehab program
                    </$A>
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
                Frequently asked questions about rehab in {$i(province)}
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.65', color: '#516378' }}>
                Straight answers to what people ask us most on the helpline. Still unsure? Call — it's free and
                confidential.
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
        <section data-screen-label="Other Provinces" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px' }} data-rc-wrap="1">
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: '24px',
                marginBottom: '28px',
              }}
            >
              <div>
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
                <h2 style={{ fontSize: '32px', marginTop: '8px' }}>Rehabs in Other Provinces</h2>
              </div>
              <$A
                href="https://addictionrehabcenters.ca/rehab/"
                style={{ font: '600 15px Jost,sans-serif', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                All locations{' '}
                <span
                  style={{
                    display: 'inline-block',
                    width: '7px',
                    height: '7px',
                    borderRight: '1.5px solid currentColor',
                    borderTop: '1.5px solid currentColor',
                    transform: 'rotate(45deg)',
                  }}
                />
              </$A>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '14px' }}
              data-cols="repeat(4,1fr)"
            >
              {$list(otherProvinces).map((loc, $index) => (
                <Fragment key={$index}>
                  <$A
                    className="scp1b"
                    href={loc?.href}
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '16px',
                      padding: '16px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      color: '#10233a',
                      transition: 'transform .18s,border-color .18s',
                    }}
                  >
                    <span
                      style={{
                        font: '600 12px Jost,sans-serif',
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
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
  province: 'Alberta',
  totalCentres: 44,
  authorName: 'Editorial Team',
  reviewerName: 'Clinical Reviewer (name, credentials)',
};
const View = createDC('Province', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} responsive {...props} />;
}
