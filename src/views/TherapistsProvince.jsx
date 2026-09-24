'use client';
// Generated from TherapistsProvince.dc.html — layout, styles and copy are a 1:1 port of the design.
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

    // ---- Therapists page data ----
    const thFilterNames = [
      'All',
      'Addiction',
      'Alcohol use',
      'Anxiety',
      'Depression',
      'Trauma & PTSD',
      'Couples',
      'Online',
      'In person',
    ];
    const thFilter = this.state.thFilter ?? 'All';
    const thRaw = [
      [
        'Therapist name',
        'RP, MA — Registered Psychotherapist (CRPO)',
        'Toronto, ON',
        'In person & online',
        'Works with adults navigating alcohol and substance use, using CBT and motivational interviewing.',
        ['Addiction', 'Alcohol use', 'Anxiety', 'In person', 'Online'],
        '$160',
        'Accepting new clients',
      ],
      [
        'Therapist name',
        'R.Psych — Registered Psychologist (CAP)',
        'Calgary, AB',
        'Online',
        'Trauma-informed care for people in early recovery and their families.',
        ['Trauma & PTSD', 'Addiction', 'Online'],
        '$220',
        'Accepting new clients',
      ],
      [
        'Therapist name',
        'MSW, RSW — Registered Social Worker (OCSWSSW)',
        'Ottawa, ON',
        'In person & online',
        'Couples and family therapy where addiction has strained relationships.',
        ['Couples', 'Addiction', 'In person', 'Online'],
        '$150',
        'Waitlist · 2 weeks',
      ],
      [
        'Therapist name',
        'RCC — Registered Clinical Counsellor (BCACC)',
        'Vancouver, BC',
        'In person',
        'Harm-reduction approach to substance use, anxiety and depression.',
        ['Addiction', 'Depression', 'Anxiety', 'In person'],
        '$140',
        'Accepting new clients',
      ],
      [
        'Therapist name',
        'CCAC — Canadian Certified Addiction Counsellor',
        'Winnipeg, MB',
        'Online',
        'Relapse-prevention planning and aftercare support following residential treatment.',
        ['Addiction', 'Alcohol use', 'Online'],
        '$120',
        'Accepting new clients',
      ],
      [
        'Therapist name',
        'Psychologue — OPQ',
        'Montréal, QC',
        'In person & online',
        'Bilingual therapy (FR/EN) for depression, anxiety and problem drinking.',
        ['Depression', 'Alcohol use', 'In person', 'Online'],
        '$180',
        'Waitlist · 1 week',
      ],
    ];
    const thAll = thRaw.map((r, i) => ({
      name: r[0],
      cred: r[1],
      city: r[2],
      mode: r[3],
      bio: r[4],
      tags: r[5].filter((t) => !['In person', 'Online'].includes(t)),
      all: r[5],
      fee: r[6],
      avail: r[7],
      availColor: r[7].startsWith('Accepting') ? '#2fb46b' : '#b7791f',
      verified: true,
    }));
    const therapists = thFilter === 'All' ? thAll : thAll.filter((t) => t.all.includes(thFilter));
    const thFilters = thFilterNames.map((f) => ({
      label: f,
      toggle: () => this.setState({ thFilter: f }),
      bg: f === thFilter ? '#0890E8' : '#fff',
      color: f === thFilter ? '#fff' : '#1f3550',
      border: f === thFilter ? '#0890E8' : '#dbe6f0',
    }));
    const dirTabs = [
      ['Therapists', '#', true],
      ['Treatment Centres', B + 'rehab/', false],
      ['Support Groups', B + 'drug-support-groups-in-canada/', false],
    ].map(([label, href, on]) => ({ label, href, bg: on ? '#0890E8' : 'transparent', color: on ? '#fff' : '#516378' }));
    const heroTherapists = thAll
      .slice(0, 4)
      .map((t, i) => ({ name: t.name, cred: t.cred.split(' — ')[0], offset: i % 2 ? '18px' : '0' }));
    const thTrust = [
      {
        icon: ic.shield,
        title: 'College-registered only',
        body: 'CRPO, CAP, OCSWSSW, BCACC, OPQ and other provincial regulators — checked before listing.',
      },
      {
        icon: ic.check,
        title: 'Verified profiles',
        body: 'Therapists confirm their own fees, availability and specialties.',
      },
      {
        icon: ic.doc,
        title: 'Clear fees, no surprises',
        body: 'Per-session pricing and sliding-scale options shown up front.',
      },
      { icon: ic.phone, title: 'Free helpline', body: 'Not sure who to see? Call and we will help you choose.' },
    ];
    const thProvinces = [
      ...provinces.map((p) => ({ label: p.label.replace(' Rehabs', ''), href: '#', code: p.code })),
      { label: 'Yukon', href: '#', code: 'YT' },
    ];
    const thCityList = [
      'Barrie|ON',
      'Brampton|ON',
      'Calgary|AB',
      'Dartmouth|NS',
      'Edmonton|AB',
      'Fredericton|NB',
      'Guelph|ON',
      'Halifax|NS',
      'Hamilton|ON',
      'Kelowna|BC',
      'Kitchener|ON',
      'London|ON',
      'Mississauga|ON',
      'Montréal|QC',
      'Oakville|ON',
      'Ottawa|ON',
      'Regina|SK',
      'Saskatoon|SK',
      "St John's|NL",
      'Surrey|BC',
      'Toronto|ON',
      'Vancouver|BC',
      'Vaughan|ON',
      'Victoria|BC',
      'Winnipeg|MB',
    ].map((s) => {
      const [name, prov] = s.split('|');
      return { name, prov };
    });
    const concernGroups = [
      {
        icon: ic.heart,
        title: 'Mental Health Concerns',
        items: [
          'Addiction',
          'Alcohol use',
          'Eating Disorders',
          'Depression',
          'Anxiety',
          'Obsessive-Compulsive (OCD)',
          'Anger Management',
          'ADHD',
          'Autism',
        ],
      },
      {
        icon: ic.hands,
        title: 'Life Stages & Family Dynamics',
        items: [
          'Grief',
          'Life Coaching',
          'Career Guidance',
          'Couples Therapy',
          'Family Therapy',
          'Marriage Counselling',
          'Teens',
          'Children',
        ],
      },
      {
        icon: ic.leaf,
        title: 'Specialty Therapies & Issues',
        items: [
          'Trauma and PTSD',
          'Cognitive Behavioural (CBT)',
          'Psychoanalytic',
          'EMDR',
          'Dialectical Behavior (DBT)',
          'Somatic',
          'Sex Therapy',
          'Motivational Interviewing',
        ],
      },
    ];
    const compareCards = [
      {
        icon: ic.person,
        title: 'See a therapist when…',
        points: [
          'You want ongoing support while keeping work and family routines',
          'Use is a concern but withdrawal is not medically risky',
          'You are stepping down after residential treatment',
          'A loved one\u2019s addiction is affecting you',
        ],
        cta: 'Browse therapists',
        href: '#therapists',
      },
      {
        icon: ic.pin,
        title: 'Consider a treatment centre when…',
        points: [
          'You need medically supervised detox',
          'Home is full of triggers or unsafe',
          'Outpatient help has not held',
          'You need structure, 24/7 support and a reset',
        ],
        cta: 'Find a rehab centre',
        href: B + 'rehab/',
      },
    ];
    const thFaqData = [
      [
        'What is the difference between a psychotherapist, psychologist and addiction counsellor?',
        'Psychologists hold a doctoral or master\u2019s degree and can assess and diagnose; psychotherapists and social workers provide talk therapy and are regulated by provincial colleges; certified addiction counsellors specialize in substance use and recovery planning. All three can help with addiction — the right fit depends on your needs and budget.',
      ],
      [
        'How much does therapy cost in Canada?',
        'Most private sessions range from about $120 to $250. Psychologists are typically at the higher end. Many therapists offer sliding-scale fees, and extended health benefits often cover registered providers — check your plan for which designations are eligible.',
      ],
      [
        'Is therapy covered by provincial health care?',
        'Therapy with a psychiatrist or through a hospital or community program is covered; private therapists generally are not, though employer benefits and EAP plans often reimburse them. Publicly funded counselling is available in every province, sometimes with wait times.',
      ],
      [
        'Can I see a therapist online?',
        'Yes. Most listed therapists offer secure video sessions, and many are licensed to see clients anywhere in their province. Use the "Online" filter above.',
      ],
      [
        'How do you verify therapists?',
        'We confirm current registration with the relevant provincial college or certifying body before a profile is published, and re-check annually. Verified profiles carry the green badge.',
      ],
      [
        'Should I see a therapist or go to rehab?',
        'If you need medical detox, are in an unsafe environment, or outpatient support has not held, a treatment centre is usually the better first step. Otherwise a therapist is a strong, flexible option. Our free helpline can help you decide.',
      ],
    ];
    const thFaqs = thFaqData.map(([question, answer], i) => ({
      question,
      answer,
      open: i === faq,
      toggle: () => this.setState({ faq: faq === i ? -1 : i }),
      border: i === faq ? '#0890E8' : '#e3ecf4',
      rot: i === faq ? 'rotate(45deg)' : 'rotate(0deg)',
    }));

    // ---- Location page data ----
    const locName = this.props.locName ?? 'Ontario';
    const locProvince = 'Ontario';
    const locCollege = 'CRPO, CPO & OCSWSSW';
    const locIntro =
      'Browse registered psychotherapists, psychologists, social workers and certified addiction counsellors across Ontario, from Toronto and Ottawa to Hamilton, London and Barrie — in person or online anywhere in the province.';
    const locSub = [
      'Toronto|210',
      'Ottawa|84',
      'Hamilton|41',
      'London|33',
      'Mississauga|41',
      'Kitchener|22',
      'Barrie|18',
      'Brampton|24',
      'Guelph|14',
      'Oakville|15',
      'Vaughan|16',
      'Windsor|12',
    ].map((s) => {
      const [name, n] = s.split('|');
      return { name, n };
    });
    const locFacts = [
      {
        icon: ic.shield,
        k: 'Who regulates therapists here',
        v: 'Psychotherapists — CRPO; psychologists — CPO; social workers — OCSWSSW.',
      },
      { icon: ic.doc, k: 'Typical fees', v: '$140 – $220 per 50-minute session; many offer sliding scale.' },
      {
        icon: ic.check,
        k: 'Coverage',
        v: 'Extended health plans often reimburse RP, RSW and psychologist sessions. OHIP covers psychiatrists and hospital programs.',
      },
      {
        icon: ic.phone,
        k: 'Free public options',
        v: 'ConnexOntario 1-866-531-2600 for publicly funded counselling and addiction services.',
      },
    ];
    const locGuide = [
      {
        h: 'Check the designation',
        p:
          'In ' +
          locProvince +
          ', "therapist" is not a protected title on its own. Look for a registered designation — RP, C.Psych, RSW or CCAC — and the registration number, which you can verify with the college. Every profile on this site has been checked.',
      },
      {
        h: 'Decide between in person and online',
        p:
          'Online therapy is available from any registered ' +
          locProvince +
          ' therapist regardless of city, which widens your options and often shortens wait times. In-person sessions can be better for some people and for family or couples work.',
      },
      {
        h: 'Ask about addiction experience',
        p: 'Not every therapist works with substance use. Filter for Addiction or Alcohol use above, and ask about approaches such as motivational interviewing, CBT and relapse-prevention planning. If you may need medical detox, call our helpline first.',
      },
    ];
    const locAvgFee = '$170',
      locOnlinePct = '86%';
    return {
      locName,
      locProvince,
      locCollege,
      locIntro,
      locSub,
      locFacts,
      locGuide,
      locAvgFee,
      locOnlinePct,
      dirTabs,
      heroTherapists,
      thCount: this.props.thCount ?? 320,
      thCities: thCityList.length,
      thTrust,
      thFilters,
      therapists,
      thShown: therapists.length,
      thProvinces,
      thCityList,
      concernGroups,
      compareCards,
      thFaqs,
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
    compareCards,
    concernGroups,
    footerCols,
    iconShield,
    locAvgFee,
    locCollege,
    locFacts,
    locGuide,
    locIntro,
    locName,
    locOnlinePct,
    locSub,
    reviewerName,
    thCount,
    thFaqs,
    thFilters,
    thShown,
    thTrust,
    therapists,
    updated,
    updatedLong,
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
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '28px 32px 64px' }} data-rc-wrap="1">
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
              <$A className="scp0" href="/therapists" style={{ color: '#6b7f95' }}>
                Find a Therapist
              </$A>
              <span style={{ opacity: '.5' }}>/</span>
              <span style={{ color: '#10233a', fontWeight: '500' }}>{$i(locName)}</span>
            </nav>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: '56px', alignItems: 'center' }}
              data-cols="1.1fr .9fr"
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
                  Therapists by province
                </span>
                <h1 style={{ fontSize: '54px', lineHeight: '1.05', color: '#10233a' }} data-rc-lg="1">
                  {'Therapists & Addiction Counsellors in'} <span style={{ color: '#0890E8' }}>{$i(locName)}</span>
                </h1>
                <p style={{ fontSize: '17px', lineHeight: '1.6', color: '#516378', maxWidth: '600px' }}>
                  {$i(locIntro)}
                </p>
                <form
                  action="#"
                  style={{
                    background: '#fff',
                    border: '1px solid #dbe6f0',
                    borderRadius: '16px',
                    padding: '8px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr auto',
                    gap: '8px',
                    boxShadow: '0 20px 50px -30px rgba(16,35,58,.35)',
                  }}
                  data-cols="1fr 1fr auto"
                >
                  <label
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '2px',
                      minHeight: '56px',
                      padding: '6px 14px',
                      borderRadius: '10px',
                    }}
                  >
                    <span
                      style={{
                        font: '600 11px Figtree,sans-serif',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        color: '#6b7f95',
                      }}
                    >
                      Concern
                    </span>
                    <select
                      style={{
                        appearance: 'none',
                        border: '0',
                        background: 'transparent',
                        font: '500 15px Figtree,sans-serif',
                        color: '#10233a',
                        outline: 'none',
                        padding: '0',
                        cursor: 'pointer',
                      }}
                    >
                      <option>Any concern</option>
                      <option>Addiction</option>
                      <option>Alcohol use</option>
                      <option>Anxiety</option>
                      <option>Depression</option>
                      <option>Trauma and PTSD</option>
                      <option>Couples therapy</option>
                    </select>
                  </label>
                  <label
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '2px',
                      minHeight: '56px',
                      padding: '6px 14px',
                      borderLeft: '1px solid #e9eff5',
                      borderRadius: '10px',
                    }}
                  >
                    <span
                      style={{
                        font: '600 11px Figtree,sans-serif',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        color: '#6b7f95',
                      }}
                    >
                      Session
                    </span>
                    <select
                      style={{
                        appearance: 'none',
                        border: '0',
                        background: 'transparent',
                        font: '500 15px Figtree,sans-serif',
                        color: '#10233a',
                        outline: 'none',
                        padding: '0',
                        cursor: 'pointer',
                      }}
                    >
                      <option>In person or online</option>
                      <option>In person</option>
                      <option>Online (video)</option>
                    </select>
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
                      padding: '0 22px',
                      borderRadius: '11px',
                      whiteSpace: 'nowrap',
                      minHeight: '56px',
                    }}
                  >
                    Search {$i(locName)}
                  </button>
                </form>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
                    gap: '20px',
                    paddingTop: '18px',
                    borderTop: '1px solid #e3ecf4',
                  }}
                  data-cols="repeat(4,minmax(0,1fr))"
                >
                  <div>
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>{$i(thCount)}</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>
                      Therapists in {$i(locName)}
                    </div>
                  </div>
                  <div>
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>{$i(locAvgFee)}</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>Typical session fee</div>
                  </div>
                  <div>
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>{$i(locOnlinePct)}</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>Offer online sessions</div>
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
                    photo · {$i(locName)} landscape
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
                    <div style={{ font: '600 14px Jost,sans-serif' }}>Registered with {$i(locCollege)}</div>
                    <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>Every listed professional</div>
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
              <h3 style={{ fontSize: '20px' }}>Every profile is credential-checked</h3>
              <p style={{ fontSize: '14px', color: '#6b7f95', lineHeight: '1.5' }}>
                We confirm registration with the relevant provincial college before a therapist goes live.
              </p>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4,minmax(0,1fr))',
                gap: '14px',
                alignItems: 'stretch',
              }}
              data-cols="repeat(4,minmax(0,1fr))"
            >
              {$list(thTrust).map((t, $index) => (
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
        <section id="therapists" data-screen-label="Featured therapists" style={{ background: '#f7fafd' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px' }} data-rc-wrap="1">
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
                  {'Addiction counsellors & therapists in Canada'}
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
                  <option>Availability</option>
                  <option>Lowest fee</option>
                  <option>Most reviewed</option>
                </select>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '16px',
                marginBottom: '28px',
                padding: '12px',
                background: '#fff',
                border: '1px solid #e3ecf4',
                borderRadius: '16px',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
                {$list(thFilters).map((f, $index) => (
                  <Fragment key={$index}>
                    <button
                      onClick={f?.toggle}
                      style={$css(
                        `appearance:none;cursor:pointer;font:500 13.5px Figtree,sans-serif;padding:8px 14px;border-radius:999px;border:1px solid ${f?.border ?? ''};background:${f?.bg ?? ''};color:${f?.color ?? ''};transition:all .15s;white-space:nowrap;height:36px;display:inline-flex;align-items:center`,
                      )}
                    >
                      {$i(f?.label)}
                    </button>
                  </Fragment>
                ))}
              </div>
              <span
                style={{
                  fontSize: '13px',
                  color: '#6b7f95',
                  paddingRight: '6px',
                  whiteSpace: 'nowrap',
                  flexShrink: '0',
                }}
              >
                Showing {$i(thShown)} of {$i(thCount)}
              </span>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: '20px' }}
              data-cols="repeat(auto-fill,minmax(320px,1fr))"
            >
              {$list(therapists).map((th, $index) => (
                <Fragment key={$index}>
                  <article
                    className="scpm"
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '22px',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      transition: 'transform .2s,box-shadow .2s',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '72px minmax(0,1fr)',
                        gap: '16px',
                        alignItems: 'start',
                      }}
                      data-cols="72px minmax(0,1fr)"
                    >
                      <div
                        style={{
                          position: 'relative',
                          width: '72px',
                          height: '72px',
                          borderRadius: '16px',
                          background: 'repeating-linear-gradient(135deg,#dfeaf3 0 10px,#eaf2f8 10px 20px)',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <span style={{ font: '500 10px ui-monospace,Menlo,monospace', color: '#516378' }}>
                          portrait
                        </span>
                        {th?.verified ? (
                          <>
                            <span
                              title="Credentials verified"
                              style={{
                                position: 'absolute',
                                right: '-6px',
                                bottom: '-6px',
                                width: '22px',
                                height: '22px',
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
                          </>
                        ) : null}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: '0' }}>
                        <h3 style={{ fontSize: '18px', lineHeight: '1.2' }}>
                          <$A className="scp0" href="#" style={{ color: '#10233a' }}>
                            {$i(th?.name)}
                          </$A>
                        </h3>
                        <div
                          style={{
                            fontSize: '13px',
                            color: '#0890E8',
                            fontWeight: '500',
                            lineHeight: '1.35',
                            display: '-webkit-box',
                            WebkitLineClamp: '2',
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {$i(th?.cred)}
                        </div>
                        <p
                          style={{
                            fontSize: '13px',
                            color: '#6b7f95',
                            display: 'flex',
                            gap: '7px',
                            alignItems: 'center',
                            lineHeight: '1.4',
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
                          <span>
                            {$i(th?.city)} · {$i(th?.mode)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: '14px',
                        lineHeight: '1.55',
                        color: '#3b4d63',
                        minHeight: '44px',
                        display: '-webkit-box',
                        WebkitLineClamp: '2',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {$i(th?.bio)}
                    </p>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', minHeight: '26px' }}>
                      {$list(th?.tags).map((tg, $index) => (
                        <Fragment key={$index}>
                          <span
                            style={{
                              font: '500 11.5px Figtree,sans-serif',
                              color: '#1f3550',
                              background: '#eef4f9',
                              padding: '0 9px',
                              height: '26px',
                              display: 'inline-flex',
                              alignItems: 'center',
                              borderRadius: '999px',
                            }}
                          >
                            {$i(tg)}
                          </span>
                        </Fragment>
                      ))}
                    </div>
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
                      <div style={{ minWidth: '0' }}>
                        <div style={{ font: '600 15px Jost,sans-serif', lineHeight: '1.2' }}>
                          {$i(th?.fee)}
                          <span style={{ font: '400 12px Figtree,sans-serif', color: '#6b7f95' }}> / session</span>
                        </div>
                        <div
                          style={$css(
                            `font-size:12px;color:${th?.availColor ?? ''};font-weight:500;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis`,
                          )}
                        >
                          {$i(th?.avail)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: '0' }}>
                        <$A
                          className="scp7"
                          href="#"
                          style={{
                            font: '600 13px Jost,sans-serif',
                            color: '#0890E8',
                            border: '1.5px solid #0890E8',
                            height: '36px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0 12px',
                            borderRadius: '9px',
                          }}
                        >
                          Message
                        </$A>
                        <$A
                          className="scp7"
                          href="#"
                          style={{
                            font: '600 13px Jost,sans-serif',
                            color: '#fff',
                            background: '#10233a',
                            height: '36px',
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0 12px',
                            borderRadius: '9px',
                          }}
                        >
                          View
                        </$A>
                      </div>
                    </div>
                  </article>
                </Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '36px' }}>
              <$A
                className="scp2"
                href="#"
                style={{
                  font: '600 16px Jost,sans-serif',
                  color: '#10233a',
                  background: '#fff',
                  border: '1px solid #dbe6f0',
                  padding: '14px 28px',
                  borderRadius: '12px',
                }}
              >
                Load more therapists
              </$A>
            </div>
          </div>
        </section>
        <section data-screen-label="Nearby" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '72px 32px',
              display: 'grid',
              gridTemplateColumns: '1.4fr 1fr',
              gap: '48px',
              alignItems: 'start',
            }}
            data-cols="1.4fr 1fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div>
              <div>
                <span
                  style={{
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#0890E8',
                  }}
                >
                  Cities in {$i(locName)}
                </span>
                <h2 style={{ fontSize: '30px', marginTop: '8px', marginBottom: '20px' }}>
                  Therapists by city in {$i(locName)}
                </h2>
              </div>
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: '8px' }}
                data-cols="repeat(auto-fill,minmax(170px,1fr))"
              >
                {$list(locSub).map((ct, $index) => (
                  <Fragment key={$index}>
                    <$A
                      className="scp2"
                      href="#"
                      style={{
                        font: '500 14px Figtree,sans-serif',
                        color: '#1f3550',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #e3ecf4',
                        background: '#f7fafd',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '6px',
                        minHeight: '44px',
                      }}
                    >
                      <span>{$i(ct?.name)}</span>
                      <span
                        style={{
                          font: '600 12px Jost,sans-serif',
                          color: '#0890E8',
                          background: '#eaf5fd',
                          padding: '2px 7px',
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
            <div
              style={{
                background: '#f7fafd',
                border: '1px solid #e3ecf4',
                borderRadius: '22px',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
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
                Good to know in {$i(locName)}
              </span>
              {$list(locFacts).map((lf, $index) => (
                <Fragment key={$index}>
                  <div
                    style={{
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                      padding: '10px 0',
                      borderTop: '1px solid #e3ecf4',
                    }}
                  >
                    <span
                      style={{
                        width: '30px',
                        height: '30px',
                        borderRadius: '9px',
                        background: '#fff',
                        border: '1px solid #e3ecf4',
                        color: '#0890E8',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: '0',
                      }}
                    >
                      {$i(lf?.icon)}
                    </span>
                    <div>
                      <div style={{ font: '600 14px Jost,sans-serif' }}>{$i(lf?.k)}</div>
                      <div style={{ fontSize: '13px', color: '#6b7f95', lineHeight: '1.45' }}>{$i(lf?.v)}</div>
                    </div>
                  </div>
                </Fragment>
              ))}
              <$A href="/therapists" style={{ font: '600 14px Jost,sans-serif', marginTop: '4px' }}>
                {'All provinces & cities →'}
              </$A>
            </div>
          </div>
        </section>
        <section data-screen-label="By concern" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px' }} data-rc-wrap="1">
            <div style={{ maxWidth: '640px', marginBottom: '32px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                By concern
              </span>
              <h2 style={{ fontSize: '36px', marginTop: '8px' }} data-rc-lg="1">
                Find therapists that can help with…
              </h2>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '16px' }}
              data-cols="repeat(3,minmax(0,1fr))"
            >
              {$list(concernGroups).map((cg, $index) => (
                <Fragment key={$index}>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '22px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                        {$i(cg?.icon)}
                      </span>
                      <h3 style={{ fontSize: '18px' }}>{$i(cg?.title)}</h3>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {$list(cg?.items).map((it, $index) => (
                        <Fragment key={$index}>
                          <$A
                            className="scp2"
                            href="#"
                            style={{
                              font: '500 13.5px Figtree,sans-serif',
                              color: '#1f3550',
                              background: '#f7fafd',
                              border: '1px solid #e3ecf4',
                              padding: '7px 12px',
                              borderRadius: '999px',
                            }}
                          >
                            {$i(it)}
                          </$A>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section data-screen-label="Therapist or rehab" style={{ background: '#10233a', color: '#fff' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '80px 32px',
              display: 'grid',
              gridTemplateColumns: '.9fr 1.1fr',
              gap: '56px',
              alignItems: 'center',
            }}
            data-cols=".9fr 1.1fr"
            data-rc-gap="1"
            data-rc-wrap="1"
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
                Not sure where to start?
              </span>
              <h2 style={{ fontSize: '38px', lineHeight: '1.12', color: '#fff' }} data-rc-lg="1">
                Therapist or treatment centre?
              </h2>
              <p style={{ fontSize: '16.5px', lineHeight: '1.65', color: '#b7c7d8' }}>
                Both can be the right first step. A counsellor fits ongoing support while you keep your routine; a
                treatment centre fits when you need structure, detox or distance from triggers. Our helpline will talk
                it through with you — free, 24/7.
              </p>
              <$A
                className="scpr"
                href="tel:+18558854747"
                style={{
                  alignSelf: 'flex-start',
                  font: '600 16px Jost,sans-serif',
                  color: '#10233a',
                  background: '#fff',
                  padding: '14px 22px',
                  borderRadius: '12px',
                }}
              >
                Call 1-855-885-4747
              </$A>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }} data-cols="1fr 1fr">
              {$list(compareCards).map((cc, $index) => (
                <Fragment key={$index}>
                  <div
                    style={{
                      background: 'rgba(255,255,255,.06)',
                      border: '1px solid rgba(255,255,255,.14)',
                      borderRadius: '20px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <span style={{ color: '#7cc4f5' }}>{$i(cc?.icon)}</span>
                    <h3 style={{ fontSize: '20px', color: '#fff' }}>{$i(cc?.title)}</h3>
                    <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {$list(cc?.points).map((pt, $index) => (
                        <Fragment key={$index}>
                          <li
                            style={{
                              display: 'flex',
                              gap: '9px',
                              fontSize: '14px',
                              color: '#d9ebf9',
                              lineHeight: '1.45',
                            }}
                          >
                            <span
                              style={{
                                width: '5px',
                                height: '5px',
                                borderRadius: '50%',
                                background: '#7cc4f5',
                                flexShrink: '0',
                                marginTop: '7px',
                              }}
                            />
                            {$i(pt)}
                          </li>
                        </Fragment>
                      ))}
                    </ul>
                    <$A
                      className="scpe"
                      href={cc?.href}
                      style={{ marginTop: 'auto', font: '600 14px Jost,sans-serif', color: '#7cc4f5' }}
                    >
                      {$i(cc?.cta)} →
                    </$A>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section data-screen-label="For professionals" style={{ background: '#fff' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px' }} data-rc-wrap="1">
            <div
              style={{
                background: 'linear-gradient(135deg,#0f5fa8,#0890E8)',
                borderRadius: '28px',
                padding: '44px 48px',
                color: '#fff',
                display: 'grid',
                gridTemplateColumns: '1.2fr .8fr',
                gap: '32px',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
              }}
              data-cols="1.2fr .8fr"
            >
              <div
                style={{
                  position: 'absolute',
                  right: '-100px',
                  top: '-100px',
                  width: '360px',
                  height: '360px',
                  borderRadius: '50%',
                  border: '70px solid rgba(255,255,255,.08)',
                }}
              />
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <span
                  style={{
                    font: '600 11.5px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    opacity: '.85',
                  }}
                >
                  Are you a mental health professional?
                </span>
                <h2 style={{ fontSize: '34px', lineHeight: '1.12', color: '#fff' }} data-rc-lg="1">
                  Join the directory and reach people looking for help
                </h2>
                <p style={{ fontSize: '15.5px', lineHeight: '1.6', opacity: '.92', maxWidth: '520px' }}>
                  Registered psychotherapists, psychologists, social workers and addiction counsellors can list a
                  verified profile, set availability and receive enquiries directly.
                </p>
              </div>
              <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <$A
                  className="scp5"
                  href="/join-directory"
                  style={{
                    font: '600 17px Jost,sans-serif',
                    color: '#0f5fa8',
                    background: '#fff',
                    padding: '15px 24px',
                    borderRadius: '13px',
                    textAlign: 'center',
                  }}
                >
                  Sign up and get listed
                </$A>
                <$A
                  className="scpv"
                  href="/join-directory#plans"
                  style={{
                    font: '600 15px Jost,sans-serif',
                    color: '#fff',
                    border: '1.5px solid rgba(255,255,255,.5)',
                    padding: '13px 24px',
                    borderRadius: '13px',
                    textAlign: 'center',
                  }}
                >
                  See plans for providers
                </$A>
              </div>
            </div>
          </div>
        </section>
        <section data-screen-label="Guide" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '72px 32px',
              display: 'grid',
              gridTemplateColumns: '300px 1fr',
              gap: '64px',
              alignItems: 'start',
            }}
            data-cols="300px 1fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <aside
              style={{
                position: 'sticky',
                top: '130px',
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
                    Medically reviewed by
                  </div>
                  <div style={{ font: '600 14.5px Jost,sans-serif' }}>{$i(reviewerName)}</div>
                  <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>Registered psychotherapist</div>
                </div>
              </div>
              <div style={{ fontSize: '12.5px', color: '#6b7f95', borderTop: '1px solid #edf2f7', paddingTop: '12px' }}>
                Last updated {$i(updatedLong)}
              </div>
            </aside>
            <article style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '760px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                {$i(locName)} guide
              </span>
              <h2 style={{ fontSize: '36px', lineHeight: '1.12' }} data-rc-lg="1">
                Finding the right therapist in {$i(locName)}
              </h2>
              {$list(locGuide).map((g, $index) => (
                <Fragment key={$index}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h3 style={{ fontSize: '24px', marginTop: '6px' }}>{$i(g?.h)}</h3>
                    <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>{$i(g?.p)}</p>
                  </div>
                </Fragment>
              ))}
            </article>
          </div>
        </section>
        <section id="faq" data-screen-label="FAQ" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
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
                Finding a therapist in {$i(locName)}
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.65', color: '#516378' }}>
                Reviewed by our clinical advisor. Still unsure? Call — it's free and confidential.
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
              {$list(thFaqs).map((q, $index) => (
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
export const defaults = { locName: 'Ontario', thCount: 640 };
const View = createDC('TherapistsProvince', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} responsive {...props} />;
}
