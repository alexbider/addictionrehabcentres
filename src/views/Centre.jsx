'use client';
// Generated from Centre.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = { menu: null, tab: 0, slide: 0, faq: 0, who: 'Yourself', funding: 'Self-pay', ack: false, priceTab: 0 };
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

    // ---- Drug page data (Benzodiazepine) ----
    const drug = this.props.drug ?? 'Benzodiazepine';
    const drugLower = drug.toLowerCase();
    const { faq, who } = this.state;
    const effects = [
      'Depression',
      'Rage',
      'Agitation',
      'Suicidal thoughts',
      'Impaired driving',
      'Multiple-drug dependence',
    ];
    const effectCards = [
      {
        icon: ic.heart,
        title: 'Mood',
        body: 'Depression, rage and agitation — conditions that worsen the longer the drug is taken.',
      },
      {
        icon: ic.pill,
        title: 'Risk',
        body: 'Third most common factor in Ontario traffic accidents (1992); dangerous when mixed with other drugs.',
      },
      {
        icon: ic.person,
        title: 'Who is affected',
        body: 'Prescribed more often to women; 22.5% of elderly studied (1998) combined it with other medication.',
      },
    ];
    const drugFaqData = [
      [
        'What is ' + drugLower + ' addiction?',
        drug +
          ' is a prescription medicine that can cause dependence in two ways: through recreational use, or through long-term use of a legitimately prescribed medication. Dependence means the body needs the drug to function normally and withdrawal appears when it is reduced or stopped.',
      ],
      [
        'What are the signs of ' + drugLower + ' dependence?',
        'Needing higher doses for the same effect, taking it outside the prescribed schedule, anxiety or insomnia between doses, and mood changes such as depression, rage or agitation. Seeking prescriptions from more than one doctor is another common sign.',
      ],
      [
        'Is it safe to stop taking ' + drugLower + 's on my own?',
        'No. Stopping abruptly can cause severe withdrawal, including seizures. ' +
          drug +
          ' withdrawal should be managed with a medically supervised taper — either through your physician or a medical detox program. Call our helpline and we will connect you with one.',
      ],
      [
        'How long does ' + drugLower + ' withdrawal and treatment take?',
        'A supervised taper commonly runs several weeks to a few months depending on dose and duration of use. Residential programs of 30 to 90 days often follow or run alongside the taper, with outpatient counselling and aftercare continuing afterwards.',
      ],
      [
        'What treatment settings are available in Canada?',
        'Outpatient tapering with counselling, medical detox units, and residential rehab centres. Many centres listed on this site treat prescription-drug dependence; publicly funded options exist in every province, and private centres offer faster admission.',
      ],
      [
        'How do I get help today?',
        'Call 1-855-885-4747 any time. We will talk through your situation, help you understand the options near you, and contact centres with availability on your behalf. The service is free and confidential.',
      ],
    ];
    const drugFaqs = drugFaqData.map(([question, answer], i) => ({
      question,
      answer,
      open: i === faq,
      toggle: () => this.setState({ faq: faq === i ? -1 : i }),
      border: i === faq ? '#0890E8' : '#e3ecf4',
      rot: i === faq ? 'rotate(45deg)' : 'rotate(0deg)',
    }));
    const drugToc = [
      [drug + ' addiction in Canada', '#canada'],
      ['Adverse effects', '#effects'],
      ['Finding the right treatment', '#treatment'],
      ['FAQ', '#faq'],
    ].map(([label, href]) => ({ label, href }));
    const whoOptions = ['Yourself', 'Loved One'].map((label) => ({
      label,
      select: () => this.setState({ who: label }),
      border: who === label ? '#0890E8' : '#dbe6f0',
      bg: who === label ? '#eaf5fd' : '#fff',
      color: who === label ? '#0890E8' : '#1f3550',
    }));
    const otherDrugs = drugs.filter((d) => !d.label.startsWith(drug));
    const { funding, ack } = this.state;
    const fundingOptions = [
      'Self-pay',
      'Extended health benefits',
      'Employer / EAP plan',
      'I need publicly funded care',
    ].map((label) => {
      const on = funding === label;
      return {
        label,
        select: () => this.setState({ funding: label }),
        border: on ? '#0890E8' : '#dbe6f0',
        bg: on ? '#eaf5fd' : '#fff',
        color: on ? '#0890E8' : '#1f3550',
        dot: on ? '#0890E8' : '#b7c7d8',
        dotFill: on ? '#0890E8' : 'transparent',
      };
    });
    const needsPublic = funding === 'I need publicly funded care';
    const submitDisabled = !ack;
    const substanceOptions = [
      'Alcohol',
      ...drugs.map((d) => d.label.replace(/ (Addiction|Treatment)( Canada)?$/, '')),
      'Methamphetamine',
      'Other / not sure',
    ];
    const substance = this.state.substance ?? (substanceOptions.includes(drug) ? drug : 'Other / not sure');

    // ---- Centre page data (Metamorphosis Centre for Change) ----
    const centreName = this.props.centreName ?? 'Metamorphosis Centre for Change';
    const centreProvince = 'Ontario';
    const centreAddress = 'Wasaga Beach, ON, Canada';
    const claimed = this.props.claimed ?? true;
    const glance = [
      { k: 'Level of care', v: 'Residential · Detox · Hybrid · Online' },
      { k: 'Program length', v: '4 – 12 weeks' },
      { k: 'Setting', v: 'Beachfront resort-style home' },
      { k: 'Ownership', v: 'Family owned & operated' },
    ];
    const services = [
      'Interventions',
      'Nurse services',
      'Withdrawal management',
      'Mental health support',
      'Family programs & counseling',
      'Lifetime aftercare',
      'Evidence-based reporting',
      'Luxury amenities',
      'Life coaching',
      'Red Seal Chef menus',
    ];
    const programElements = [
      'One-on-one counseling',
      'Group therapy',
      'Meditation introduction',
      'Physical exercise',
      'Outside sober activities',
    ];
    const pillars = [
      {
        n: '01',
        kicker: 'The setting',
        title: 'The Resort-Style Home of Metamorphosis Centre for Change',
        photo: 'photo · Metamorphosis-Centre-for-Change-5.jpg',
        body: 'The centre is located in a peaceful retreat by the beach. Clients can enjoy swimming and water activities during their stay. The retreat-style home offers green scenery, hammocks, a firepit, and other quiet places on the grounds for rest. Clients can enjoy the scenic environment while undergoing their transformation. The environment is conducive for healing and growth.',
      },
      {
        n: '02',
        kicker: 'After you leave',
        title: 'The Aftercare Options of Metamorphosis Centre for Change',
        photo: 'photo · Metamorphosis-Centre-for-Change-9.jpg',
        body: 'Metamorphosis Centre for Change offers aftercare options for clients. Clients can choose to continue with the same therapist they had on-site to experience a seamless continuation of their recovery journey. Family sessions can also be done even after leaving the centre. The centre\u2019s staff is committed to helping clients throughout the entire process of recovery from addiction.',
      },
      {
        n: '03',
        kicker: 'The people',
        title: 'A Family Owned and Operated Centre for Change',
        photo: 'photo · Metamorphosis-Centre-for-Change-12.jpg',
        body: 'Metamorphosis Centre for Change is a family-owned and operated centre that has a passion for serving those seeking treatment. Some of the staff members have their personal stories of recovery, enabling them to approach their work with love and empathy. The staff shares a \u201cgive all they got\u201d approach because their hearts are in it.',
      },
    ].map((p, i) => ({ ...p, cols: 'minmax(160px,.8fr) minmax(0,1.4fr)', dir: i % 2 ? 'rtl' : 'ltr' }));
    const serviceGroups = [
      {
        title: 'Clinical care',
        color: '#0890E8',
        items: [
          ['Interventions', ic.hands],
          ['Nurse services', ic.rx],
          ['Withdrawal management', ic.pill],
          ['Mental health support', ic.dual],
        ],
      },
      {
        title: 'Family & continuity',
        color: '#D82028',
        items: [
          ['Family programs & counseling', ic.heart],
          ['Lifetime aftercare', ic.shield],
          ['Evidence-based reporting', ic.doc],
          ['Life coaching', ic.person],
        ],
      },
      {
        title: 'Living well',
        color: '#2fb46b',
        items: [
          ['Luxury amenities', ic.leaf],
          ['Red Seal Chef menus', ic.glass],
        ],
      },
    ].map((g) => ({ ...g, items: g.items.map(([label, icon]) => ({ label, icon })) }));
    const programSteps = [
      {
        n: '01',
        icon: ic.person,
        label: 'One-on-one counseling',
        body: 'Private sessions to understand the emotions driving the addiction.',
      },
      {
        n: '02',
        icon: ic.hands,
        label: 'Group therapy',
        body: 'Learn from the perspectives of others on the same path.',
      },
      {
        n: '03',
        icon: ic.leaf,
        label: 'Meditation introduction',
        body: 'Daily practice to settle the mind and manage cravings.',
      },
      {
        n: '04',
        icon: ic.heart,
        label: 'Physical exercise',
        body: 'Gym, beach and movement to rebuild body and routine.',
      },
      {
        n: '05',
        icon: ic.pin,
        label: 'Outside activities',
        body: 'Sober outings that model an alcohol- and drug-free lifestyle.',
      },
    ];
    const facility = [
      { icon: ic.doc, k: '20,000 sq ft, 2 storeys', v: 'Wheelchair accessible throughout' },
      { icon: ic.check, k: 'Private ensuite rooms', v: 'Three-piece bathroom and own thermostat' },
      { icon: ic.leaf, k: 'Beach access', v: 'Swimming and water activities on site' },
      { icon: ic.heart, k: 'Grounds for rest', v: 'Hammocks, firepit, quiet green spaces' },
      { icon: ic.person, k: 'Red Seal Chef', v: 'Menus prepared on site' },
      { icon: ic.shield, k: 'Nurse & withdrawal support', v: 'Medical detox available (5-day minimum)' },
    ];
    const sectionTabs = [
      ['About', '#about'],
      ['Overview', '#overview'],
      ['Programs & Pricing', '#pricing'],
      ['Team', '#team'],
      ['Reviews', '#reviews'],
      ['Location', '#location'],
      ['FAQ', '#faq'],
    ].map(([label, href]) => ({ label, href }));
    const priceData = [
      {
        label: 'Inpatient',
        cols: '1.4fr 1fr 1fr 1fr 1fr 1.2fr',
        head: ['Room type', '4 week', '6 week', '8 week', '12 week', 'Extension / wk'],
        rows: [
          ['Shared (2–4 ppl)', '$19,900', '$27,200', '$34,600', '$50,300', '$4,975'],
          ['Semi-Private (1–2 ppl)', '$24,100', '$33,500', '$43,000', '$62,900', '$6,025'],
          ['Private (1 person)', '$28,300', '$39,800', '$51,400', '$75,500', '$7,075'],
        ],
        note: 'Inpatient Programming (HST exempt). Extensions billed per week at the room-type rate.',
      },
      {
        label: 'Hybrid (In + Out)',
        cols: '1.4fr 1fr 1fr 1fr 1.2fr 1.2fr',
        head: [
          'Room type',
          '2 in / 2 out',
          '2 in / 4 out',
          '2 in / 6 out',
          'Inpatient ext. / wk',
          'Outpatient ext. / wk',
        ],
        rows: [
          ['Shared (2–4 ppl)', '$14,175', '$18,375', '$22,575', '$4,975', '$2,100'],
          ['Semi-Private (1–2 ppl)', '$16,275', '$20,475', '$24,675', '$6,025', '$2,100'],
          ['Private (1 person)', '$18,375', '$22,575', '$26,775', '$7,075', '$2,100'],
        ],
        note: 'Hybrid Programming combines weeks in residence with weeks of outpatient care.',
      },
      {
        label: 'Online Outpatient',
        cols: '1fr 1fr',
        head: ['Duration', 'Cost'],
        rows: [
          ['4 week', '$8,925'],
          ['6 week', '$13,125'],
        ],
        note: 'Online Outpatient Programming — delivered remotely.',
      },
      {
        label: 'Medical Detox',
        cols: '1fr 1fr',
        head: ['Duration', 'Cost'],
        rows: [
          ['5-day minimum', '$5,000'],
          ['Per extra day', '$1,000'],
        ],
        note: 'Medical Detox is nurse-supported withdrawal management on site.',
      },
      {
        label: 'Enhanced Aftercare',
        cols: '.8fr 1.6fr 1fr 1fr .8fr',
        head: ['Option', 'Therapy sessions', 'Counseling sessions', 'VIP groups', 'Cost'],
        rows: [
          ['Option A', '18 with Master Psychotherapist', '12 weekly', '3 months', '$5,250'],
          ['Option B', '36 with Master Psychotherapist', '24 weekly', '3 months', '$10,500'],
        ],
        note: 'Enhanced Aftercare extends support after discharge; standard aftercare with your on-site therapist is included.',
      },
    ];
    const pt = this.state.priceTab;
    const priceTabs = priceData.map((p, i) => ({
      label: p.label,
      select: () => this.setState({ priceTab: i }),
      bg: i === pt ? '#0890E8' : 'transparent',
      color: i === pt ? '#fff' : '#3b4d63',
    }));
    const active = priceData[pt];
    const priceCells = active.rows.flatMap((r) =>
      r.map((v, j) => ({
        v,
        font: j === 0 ? '600 14.5px Jost,sans-serif' : '500 14.5px Figtree,sans-serif',
        color: j === 0 ? '#10233a' : '#3b4d63',
      })),
    );
    const team = [
      { name: 'Team member — add from centre', role: 'Medical Director', cred: 'M.D., CCFP (verify with CPSO)' },
      { name: 'Team member — add from centre', role: 'Psychiatrist', cred: 'M.D., FRCPC' },
      { name: 'Team member — add from centre', role: 'Registered Psychotherapist', cred: 'RP (CRPO)' },
      { name: 'Team member — add from centre', role: 'Addictions Counsellor', cred: 'CCAC / ICADC' },
    ];
    const ratingBars = [
      [5, 84],
      [4, 11],
      [3, 3],
      [2, 1],
      [1, 1],
    ].map(([n, pct]) => ({ n, w: pct + '%', pct: pct + '%' }));
    const reviewsList = [
      {
        initials: 'JM',
        name: 'Former client',
        meta: 'Reviewed on Google · sample',
        stars: '★★★★★',
        text: 'Sample review text — pull the two site reviews and top Google reviews from the backend. Keep full text, reviewer initials and date for authenticity.',
      },
      {
        initials: 'DK',
        name: 'Family member',
        meta: 'Reviewed on this site · sample',
        stars: '★★★★★',
        text: 'Sample review text — the family aftercare calls were mentioned as a highlight. Replace with real review content.',
      },
    ];
    const serving = [
      'Toronto|toronto-rehabs',
      'Ottawa|ottawa-rehabs',
      'Barrie & Simcoe County|ontario-rehabs',
      'Greater Toronto Area|toronto-rehabs',
      'Hamilton|ontario-rehabs',
      'London|ontario-rehabs',
      'Quebec|drug-alcohol-rehabs-in-quebec',
      'Across Canada|rehab',
    ].map((s) => {
      const [label, p] = s.split('|');
      return { label, href: B + p + '/' };
    });
    const centreFaqData = [
      [
        'How much does ' + centreName + ' cost?',
        'Inpatient programs start at $19,900 for 4 weeks in a shared room and range up to $75,500 for a 12-week private room. Hybrid, online outpatient ($8,925 for 4 weeks), medical detox ($5,000 for 5 days) and enhanced aftercare are priced separately. All services are HST exempt.',
      ],
      [
        'How long is treatment?',
        'Inpatient stays run 4, 6, 8 or 12 weeks with weekly extensions available. Hybrid programs combine 2 weeks in residence with 2–6 weeks of outpatient care, and online outpatient runs 4 or 6 weeks.',
      ],
      [
        'Does the centre offer medical detox?',
        'Yes. Nurse-supported withdrawal management is available on site with a 5-day minimum ($5,000) and $1,000 per additional day.',
      ],
      [
        'Where is the centre located and how do I get there?',
        centreName +
          ' is in Wasaga Beach, Ontario, on Nottawasaga Bay — roughly two hours north of Toronto by car. Airport transfers can be arranged for clients travelling from further away.',
      ],
      [
        'What happens after I leave?',
        'Clients can continue with the same therapist they worked with on site, and family sessions can continue after discharge. Enhanced Aftercare packages add 18 or 36 sessions with a Master Psychotherapist plus weekly counseling and VIP groups for 3 months.',
      ],
      [
        'Is this a private, paid centre? Can I use my benefits?',
        'Yes — ' +
          centreName +
          ' is a private, fee-based residential centre. Many clients use extended health benefits, employer or EAP plans, or self-pay. Call the centre or our helpline to check what your plan covers.',
      ],
    ];
    const centreFaqs = centreFaqData.map(([question, answer], i) => ({
      question,
      answer,
      open: i === faq,
      toggle: () => this.setState({ faq: faq === i ? -1 : i }),
      border: i === faq ? '#0890E8' : '#e3ecf4',
      rot: i === faq ? 'rotate(45deg)' : 'rotate(0deg)',
    }));

    return {
      centreName,
      centreProvince,
      centreAddress,
      photoCount: 21,
      siteReviews: 2,
      centreUpdated: 'Nov 2025',
      centreUpdatedLong: 'November 27, 2025',
      fromPrice: '$19,900',
      claimed,
      unclaimed: !claimed,
      monthlyVisitors: '10,000+',
      verifyNote: claimed
        ? 'Programs, pricing and services on this page were confirmed directly with ' +
          centreName +
          ' on ' +
          'November 27, 2025' +
          '. Report an error and we will re-verify within 48 hours.'
        : 'This listing has not been claimed. Details come from public sources and the centre\u2019s website and may be out of date. If you represent ' +
          centreName +
          ', claim the listing to verify and update it.',
      claimBenefits: [
        { icon: ic.check, title: 'Verified badge', body: 'Show visitors the centre stands behind its information.' },
        {
          icon: ic.doc,
          title: 'Control your content',
          body: 'Edit programs, pricing, photos, video and team profiles any time.',
        },
        {
          icon: ic.heart,
          title: 'Respond to reviews',
          body: 'Reply publicly and flag reviews that break our guidelines.',
        },
        {
          icon: ic.phone,
          title: 'Direct callbacks',
          body: 'Callback requests from this page route straight to your intake team.',
        },
        {
          icon: ic.shield,
          title: 'Rank higher',
          body: 'Claimed, complete listings appear above unclaimed ones in every list.',
        },
        { icon: ic.pin, title: 'Insights', body: 'See views, calls and clicks for your listing each month.' },
      ],
      glance,
      services,
      programElements,
      pillars,
      serviceGroups,
      serviceCount: services.length,
      programSteps,
      facility,
      sectionTabs,
      priceTabs,
      priceCols: active.cols,
      priceHead: active.head,
      priceCells,
      priceNote: active.note,
      team,
      ratingBars,
      reviewsList,
      serving,
      centreFaqs,
      iconGrid: ic.dual,
      iconLeaf: ic.leaf,
      drug,
      drugLower,
      effects,
      effectCards,
      drugFaqs,
      drugToc,
      whoOptions,
      otherDrugs,
      fundingOptions,
      needsPublic,
      ack,
      substanceOptions,
      substance,
      setSubstance: (e) => this.setState({ substance: e.target.value }),
      toggleAck: () => this.setState({ ack: !ack }),
      ackBorder: ack ? '#0890E8' : '#dbe6f0',
      ackBg: ack ? '#eaf5fd' : '#f7fafd',
      ackBoxBorder: ack ? '#0890E8' : '#b7c7d8',
      ackBoxBg: ack ? '#0890E8' : '#fff',
      ackMark: ack ? '✓' : '',
      submitDisabled,
      submitCursor: submitDisabled ? 'not-allowed' : 'pointer',
      submitBg: submitDisabled ? '#b7c7d8' : '#0890E8',
      submitLabel: submitDisabled ? 'Confirm the checkbox to continue' : 'Request my callback',
      authorName: this.props.authorName ?? 'Editorial Team',
      reviewerName: this.props.reviewerName ?? 'Clinical Reviewer (name, credentials)',
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
    ack,
    ackBg,
    ackBorder,
    ackBoxBg,
    ackBoxBorder,
    ackMark,
    centreAddress,
    centreFaqs,
    centreName,
    centreProvince,
    centreUpdated,
    centres,
    claimBenefits,
    claimed,
    facility,
    footerCols,
    fromPrice,
    fundingOptions,
    glance,
    iconGrid,
    iconPhone,
    monthlyVisitors,
    needsPublic,
    onSlideScroll,
    photoCount,
    pillars,
    priceCells,
    priceCols,
    priceHead,
    priceNote,
    priceTabs,
    programSteps,
    ratingBars,
    reviewerName,
    reviewsList,
    sectionTabs,
    serviceCount,
    serviceGroups,
    serving,
    setSubstance,
    siteReviews,
    slideDots,
    slideNext,
    slidePos,
    slidePrev,
    sliderRef,
    submitBg,
    submitCursor,
    submitDisabled,
    submitLabel,
    substance,
    substanceOptions,
    team,
    toggleAck,
    topRating,
    topReviews,
    unclaimed,
    verifyNote,
    whoOptions,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="provinces" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        <section data-screen-label="Centre Hero" style={{ background: '#fff', borderBottom: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 32px 0' }} data-rc-wrap="1">
            <nav
              aria-label="Breadcrumb"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13.5px',
                color: '#6b7f95',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}
            >
              <$A className="scp0" href="https://addictionrehabcenters.ca/" style={{ color: '#6b7f95' }}>
                Home
              </$A>
              <span style={{ opacity: '.5' }}>/</span>
              <$A className="scp0" href="https://addictionrehabcenters.ca/ontario-rehabs/" style={{ color: '#6b7f95' }}>
                {$i(centreProvince)} Rehabs
              </$A>
              <span style={{ opacity: '.5' }}>/</span>
              <$A className="scp0" href="https://addictionrehabcenters.ca/toronto-rehabs/" style={{ color: '#6b7f95' }}>
                Toronto Rehabs
              </$A>
              <span style={{ opacity: '.5' }}>/</span>
              <span style={{ color: '#10233a', fontWeight: '500' }}>{$i(centreName)}</span>
            </nav>
            <div
              style={{
                position: 'relative',
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                gridTemplateRows: '1fr 1fr',
                gap: '10px',
                height: '440px',
              }}
              data-cols="2fr 1fr 1fr"
            >
              <div style={{ gridRow: '1/3' }}>
                <div
                  style={{
                    aspectRatio: 'auto',
                    borderRadius: '16px',
                    background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                    display: 'grid',
                    placeItems: 'center',
                    overflow: 'hidden',
                    height: '100%',
                  }}
                >
                  <span
                    style={{
                      font: '500 11.5px ui-monospace,Menlo,monospace',
                      color: '#516378',
                      background: 'rgba(255,255,255,.85)',
                      padding: '5px 9px',
                      borderRadius: '6px',
                    }}
                  >
                    photo · Metamorphosis-Centre-for-Change-15.jpg
                  </span>
                </div>
              </div>
              <div
                style={{
                  aspectRatio: 'auto',
                  borderRadius: '16px',
                  background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                  display: 'grid',
                  placeItems: 'center',
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                <span
                  style={{
                    font: '500 11.5px ui-monospace,Menlo,monospace',
                    color: '#516378',
                    background: 'rgba(255,255,255,.85)',
                    padding: '5px 9px',
                    borderRadius: '6px',
                  }}
                >
                  photo · -1.jpg
                </span>
              </div>
              <div
                style={{
                  aspectRatio: 'auto',
                  borderRadius: '16px',
                  background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                  display: 'grid',
                  placeItems: 'center',
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                <span
                  style={{
                    font: '500 11.5px ui-monospace,Menlo,monospace',
                    color: '#516378',
                    background: 'rgba(255,255,255,.85)',
                    padding: '5px 9px',
                    borderRadius: '6px',
                  }}
                >
                  photo · -18.jpg
                </span>
              </div>
              <div
                style={{
                  aspectRatio: 'auto',
                  borderRadius: '16px',
                  background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                  display: 'grid',
                  placeItems: 'center',
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                <span
                  style={{
                    font: '500 11.5px ui-monospace,Menlo,monospace',
                    color: '#516378',
                    background: 'rgba(255,255,255,.85)',
                    padding: '5px 9px',
                    borderRadius: '6px',
                  }}
                >
                  photo · -2.jpg
                </span>
              </div>
              <div
                style={{
                  aspectRatio: 'auto',
                  borderRadius: '16px',
                  background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                  display: 'grid',
                  placeItems: 'center',
                  overflow: 'hidden',
                  height: '100%',
                }}
              >
                <span
                  style={{
                    font: '500 11.5px ui-monospace,Menlo,monospace',
                    color: '#516378',
                    background: 'rgba(255,255,255,.85)',
                    padding: '5px 9px',
                    borderRadius: '6px',
                  }}
                >
                  photo · -3.jpg
                </span>
              </div>
              <button
                className="scp2"
                style={{
                  position: 'absolute',
                  right: '16px',
                  bottom: '16px',
                  appearance: 'none',
                  cursor: 'pointer',
                  font: '600 14px Jost,sans-serif',
                  color: '#10233a',
                  background: '#fff',
                  border: '1px solid #dbe6f0',
                  padding: '10px 16px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 10px 24px -14px rgba(16,35,58,.5)',
                }}
              >
                {$i(iconGrid)}
                Show all {$i(photoCount)} photos
              </button>
              <span style={{ position: 'absolute', left: '16px', top: '16px', display: 'flex', gap: '6px' }}>
                {claimed ? (
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
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        height: '28px',
                        padding: '0 12px 0 9px',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg,#f7c04a,#e0922a)',
                        color: '#fff',
                        font: '600 12.5px Figtree,sans-serif',
                        letterSpacing: '.01em',
                        whiteSpace: 'nowrap',
                        textShadow: '0 1px 1px rgba(120,60,0,.35)',
                        boxShadow: '0 6px 16px -8px rgba(160,90,10,.7),inset 0 1px 0 rgba(255,255,255,.35)',
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" style={{ flexShrink: '0' }}>
                        <path d="M7 3h10v5a5 5 0 0 1-10 0z" style={{ fill: '#fff' }} />
                        <path
                          d="M7 5H4.5a2.5 2.5 0 0 0 2.6 3.5M17 5h2.5a2.5 2.5 0 0 1-2.6 3.5M12 13v4M8.5 21h7M9.5 17h5v4h-5z"
                          style={{
                            fill: 'none',
                            stroke: '#fff',
                            strokeWidth: '1.9',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                          }}
                        />
                      </svg>
                      Top rated
                    </span>
                  </>
                ) : null}
                {unclaimed ? (
                  <>
                    <span
                      style={{
                        background: '#fff',
                        color: '#6b7f95',
                        font: '600 11px Jost,sans-serif',
                        letterSpacing: '.04em',
                        padding: '6px 10px',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#b7c7d8' }} />
                      UNCLAIMED LISTING
                    </span>
                  </>
                ) : null}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0,1fr) minmax(300px,380px)',
                gap: '48px',
                padding: '32px 0 0',
                alignItems: 'start',
              }}
              data-cols="minmax(0,1fr) minmax(300px,380px)"
              data-rc-gap="1"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
                  <span
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '18px',
                      border: '1px solid #e3ecf4',
                      background: 'repeating-linear-gradient(135deg,#dfeaf3 0 8px,#eaf2f8 8px 16px)',
                      flexShrink: '0',
                      display: 'grid',
                      placeItems: 'center',
                      font: '500 10px ui-monospace,monospace',
                      color: '#516378',
                    }}
                  >
                    logo
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <$A
                      href="https://addictionrehabcenters.ca/listing-category/ontario-rehabs/"
                      style={{ font: '600 12px Figtree,sans-serif', letterSpacing: '.1em', textTransform: 'uppercase' }}
                    >
                      {$i(centreProvince)} Rehabs · Residential
                    </$A>
                    <h1 style={{ fontSize: '40px', lineHeight: '1.08' }} data-rc-lg="1">
                      {$i(centreName)}
                    </h1>
                    <p
                      style={{
                        fontSize: '14.5px',
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
                      {$i(centreAddress)}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#f7fafd',
                      border: '1px solid #e3ecf4',
                      borderRadius: '12px',
                      padding: '8px 12px',
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
                    <span style={{ font: '600 14px Jost,sans-serif', color: '#10233a' }}>{$i(topRating)}</span>
                    <span style={{ fontSize: '12.5px', color: '#6b7f95' }}>({$i(topReviews)} Google reviews)</span>
                  </span>
                  <$A className="scp0" href="#reviews" style={{ fontSize: '14px', color: '#516378' }}>
                    {$i(siteReviews)} reviews on this site
                  </$A>
                  <span style={{ fontSize: '14px', color: '#516378' }}>·</span>
                  {claimed ? (
                    <>
                      <span style={{ fontSize: '14px', color: '#516378' }}>
                        Details verified with the centre · Updated {$i(centreUpdated)}
                      </span>
                    </>
                  ) : null}
                  {unclaimed ? (
                    <>
                      <span style={{ fontSize: '14px', color: '#6b7f95' }}>
                        Details from public sources · not yet confirmed by the centre
                      </span>
                    </>
                  ) : null}
                </div>
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '12px', marginTop: '6px' }}
                  data-cols="repeat(4,1fr)"
                >
                  {$list(glance).map((g, $index) => (
                    <Fragment key={$index}>
                      <div
                        style={{
                          background: '#f7fafd',
                          border: '1px solid #e3ecf4',
                          borderRadius: '14px',
                          padding: '14px 16px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '4px',
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
                          {$i(g?.k)}
                        </span>
                        <span style={{ font: '600 15px Jost,sans-serif', color: '#10233a', lineHeight: '1.3' }}>
                          {$i(g?.v)}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
              <aside
                style={{
                  position: 'sticky',
                  top: '130px',
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '22px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  boxShadow: '0 30px 60px -40px rgba(16,35,58,.35)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span
                    style={{
                      font: '600 11.5px Figtree,sans-serif',
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    From
                  </span>
                  <span style={{ font: '600 26px Jost,sans-serif' }}>
                    {$i(fromPrice)}{' '}
                    <span style={{ font: '400 13px Figtree,sans-serif', color: '#6b7f95' }}>
                      / 4 weeks · HST exempt
                    </span>
                  </span>
                </div>
                <$A
                  className="scp1"
                  href="tel:+17059966522"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    font: '600 16px Jost,sans-serif',
                    color: '#fff',
                    background: '#0890E8',
                    padding: '14px',
                    borderRadius: '12px',
                  }}
                >
                  {$i(iconPhone)}
                  Call centre · 705-996-6522
                </$A>
                <$A
                  className="scp2"
                  href="#callback"
                  style={{
                    font: '600 15px Jost,sans-serif',
                    color: '#10233a',
                    background: '#fff',
                    border: '1.5px solid #dbe6f0',
                    padding: '12px',
                    borderRadius: '12px',
                    textAlign: 'center',
                  }}
                >
                  Request a callback
                </$A>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }} data-cols="1fr 1fr">
                  <$A
                    className="scps"
                    href="#"
                    style={{
                      font: '500 13.5px Figtree,sans-serif',
                      color: '#516378',
                      border: '1px solid #e3ecf4',
                      padding: '10px',
                      borderRadius: '10px',
                      textAlign: 'center',
                    }}
                  >
                    Visit website
                  </$A>
                  <$A
                    className="scps"
                    href="#"
                    style={{
                      font: '500 13.5px Figtree,sans-serif',
                      color: '#516378',
                      border: '1px solid #e3ecf4',
                      padding: '10px',
                      borderRadius: '10px',
                      textAlign: 'center',
                    }}
                  >
                    Save to wishlist
                  </$A>
                </div>
                <div
                  style={{
                    borderTop: '1px solid #edf2f7',
                    paddingTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '13px',
                    color: '#516378',
                  }}
                >
                  <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2fb46b' }} />
                    Free, confidential help choosing — 1-855-885-4747
                  </span>
                  <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0890E8' }} />
                    Private, fee-based residential centre
                  </span>
                </div>
                {unclaimed ? (
                  <>
                    <div
                      style={{
                        marginTop: '4px',
                        background: '#f7fafd',
                        border: '1px dashed #b7c7d8',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <div style={{ font: '600 14px Jost,sans-serif', color: '#10233a' }}>Is this your centre?</div>
                      <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#516378' }}>
                        Claim this free listing to update details, add photos and pricing, respond to reviews and
                        receive callbacks directly.
                      </p>
                      <$A
                        className="scpa"
                        href="https://addictionrehabcenters.ca/claim-your-listing/"
                        style={{
                          font: '600 14px Jost,sans-serif',
                          color: '#0890E8',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        Claim this listing{' '}
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
                  </>
                ) : null}
              </aside>
            </div>
            <nav
              style={{
                display: 'flex',
                gap: '4px',
                marginTop: '28px',
                borderTop: '1px solid #e9eff5',
                overflowX: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {$list(sectionTabs).map((t, $index) => (
                <Fragment key={$index}>
                  <$A
                    className="scpt"
                    href={t?.href}
                    style={{
                      font: '500 14.5px Figtree,sans-serif',
                      color: '#516378',
                      padding: '16px 14px',
                      borderBottom: '2px solid transparent',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {$i(t?.label)}
                  </$A>
                </Fragment>
              ))}
            </nav>
          </div>
        </section>
        <section id="about" data-screen-label="About" style={{ background: '#f7fafd' }}>
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '72px 32px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '48px',
              alignItems: 'flex-start',
            }}
            data-rc-wrap="1"
          >
            <article
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '22px',
                flex: '1 1 560px',
                minWidth: '0',
                maxWidth: '800px',
              }}
            >
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                About
              </span>
              <h2 style={{ fontSize: '34px', lineHeight: '1.12' }} data-rc-lg="1">
                {$i(centreName)}: A Philosophy of Transformation
              </h2>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Metamorphosis Centre for Change aims to transform their clients rather than simply aiding in their
                recovery from addiction. The centre's philosophy is to help clients create a new version of themselves
                by shedding the layers that led to addiction. They believe that self-actualization comes from the
                journey and the lessons learned along the way. The program is likened to a cocoon where transformation
                begins. The centre's staff is passionate about providing their clients with a successful journey to a
                more fulfilling future. Choosing Metamorphosis means choosing a lasting positive change in their life.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '6px' }}>
                {$list(pillars).map((p, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={$css(
                        `display:grid;grid-template-columns:${p?.cols ?? ''};gap:28px;align-items:center;background:#fff;border:1px solid #e3ecf4;border-radius:22px;padding:22px;direction:${p?.dir ?? ''}`,
                      )}
                      data-rc-dyn="1"
                    >
                      <div
                        style={{
                          direction: 'ltr',
                          aspectRatio: '4/3',
                          borderRadius: '16px',
                          background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                          display: 'grid',
                          placeItems: 'center',
                          overflow: 'hidden',
                        }}
                      >
                        <span
                          style={{
                            font: '500 11.5px ui-monospace,Menlo,monospace',
                            color: '#516378',
                            background: 'rgba(255,255,255,.85)',
                            padding: '5px 9px',
                            borderRadius: '6px',
                          }}
                        >
                          {$i(p?.photo)}
                        </span>
                      </div>
                      <div style={{ direction: 'ltr', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span
                            style={{
                              font: '600 12px Jost,sans-serif',
                              color: '#0890E8',
                              background: '#eaf5fd',
                              padding: '4px 9px',
                              borderRadius: '999px',
                              letterSpacing: '.06em',
                            }}
                          >
                            {$i(p?.n)}
                          </span>
                          <span
                            style={{
                              font: '600 11.5px Figtree,sans-serif',
                              letterSpacing: '.12em',
                              textTransform: 'uppercase',
                              color: '#6b7f95',
                            }}
                          >
                            {$i(p?.kicker)}
                          </span>
                        </div>
                        <h3 style={{ fontSize: '22px', lineHeight: '1.2' }}>{$i(p?.title)}</h3>
                        <p style={{ fontSize: '15.5px', lineHeight: '1.65', color: '#3b4d63' }}>{$i(p?.body)}</p>
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div
                style={{
                  position: 'relative',
                  aspectRatio: '16/9',
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: '#10233a',
                  display: 'grid',
                  placeItems: 'center',
                  marginTop: '6px',
                }}
              >
                <span
                  style={{
                    position: 'absolute',
                    inset: '0',
                    background: 'repeating-linear-gradient(135deg,#1c3352 0 14px,#223c5e 14px 28px)',
                  }}
                />
                <span
                  style={{
                    position: 'relative',
                    width: '72px',
                    height: '72px',
                    borderRadius: '50%',
                    background: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    boxShadow: '0 20px 40px -20px rgba(0,0,0,.6)',
                  }}
                >
                  <span
                    style={{
                      width: '0',
                      height: '0',
                      borderLeft: '22px solid #0890E8',
                      borderTop: '13px solid transparent',
                      borderBottom: '13px solid transparent',
                      marginLeft: '6px',
                    }}
                  />
                </span>
                <span
                  style={{
                    position: 'absolute',
                    left: '18px',
                    bottom: '16px',
                    font: '500 12px ui-monospace,Menlo,monospace',
                    color: '#b7c7d8',
                    background: 'rgba(16,35,58,.7)',
                    padding: '6px 10px',
                    borderRadius: '6px',
                  }}
                >
                  video · Vimeo 1079322589 · Centre tour
                </span>
              </div>
              <h2 id="overview" style={{ fontSize: '30px', lineHeight: '1.15', marginTop: '16px' }}>
                {$i(centreName)} — Center Overview
              </h2>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                The clinical team at Metamorphosis centre for change understands that breaking addiction is not just
                about quitting substances or harmful behavior. Addiction is a complex problem that affects individuals'
                emotional, mental, and physical states. At the center, the approach to treatment is holistic and
                considers all aspects of an individual's life. The residential facility offers interventions, nurse
                services, withdrawal management services, mental health support, family programs and counseling,
                lifetime aftercare, evidence-based statistical reporting, luxury amenities, life coaching, and menus
                prepared by a Red Seal Chef. The aim is to equip individuals with the skills required to successfully
                live a life without addiction.
              </p>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '22px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <h3 style={{ fontSize: '20px' }}>What's included in your stay</h3>
                  <span style={{ fontSize: '13px', color: '#6b7f95' }}>
                    {$i(serviceCount)} services · all included in program fees
                  </span>
                </div>
                {$list(serviceGroups).map((g, $index) => (
                  <Fragment key={$index}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <span
                        style={$css(
                          `font:600 11.5px Figtree,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:${g?.color ?? ''}`,
                        )}
                      >
                        {$i(g?.title)}
                      </span>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))',
                          gap: '10px',
                        }}
                        data-cols="repeat(auto-fill,minmax(170px,1fr))"
                      >
                        {$list(g?.items).map((it, $index) => (
                          <Fragment key={$index}>
                            <div
                              className="scpu"
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '11px',
                                padding: '12px 14px',
                                borderRadius: '14px',
                                background: '#f7fafd',
                                border: '1px solid #e3ecf4',
                                transition: 'border-color .18s,transform .18s',
                              }}
                            >
                              <span
                                style={$css(
                                  `width:34px;height:34px;border-radius:10px;background:#fff;border:1px solid #e3ecf4;color:${g?.color ?? ''};display:grid;place-items:center;flex-shrink:0`,
                                )}
                              >
                                {$i(it?.icon)}
                              </span>
                              <span
                                style={{ font: '600 13.5px Jost,sans-serif', color: '#10233a', lineHeight: '1.25' }}
                              >
                                {$i(it?.label)}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </Fragment>
                ))}
              </div>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Metamorphosis's clinical team recognizes that each individual's addiction is unique; therefore,
                treatment requires a personalized approach. The facility's program includes one on one counseling, group
                therapy, meditation introduction, physical exercise, and participation in outside activities that
                promote an alcohol and drug-free lifestyle. Clients stay in a 20,000 sq ft, 2-story wheelchair
                accessible building, each room with its own thermostat, ensuite three-piece bathroom, and spacious
                living quarters. Situated in the stunning town of Wasaga Beach, the center provides a serene and
                tranquil environment for recovery. At Metamorphosis, the focus is to understand the emotions driving the
                addiction, providing clients with long-term strategies for a successful addiction-free life.
              </p>
              <div
                style={{
                  background: '#10233a',
                  borderRadius: '22px',
                  padding: '28px',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '22px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    gap: '12px',
                    flexWrap: 'wrap',
                  }}
                >
                  <h3 style={{ fontSize: '20px', color: '#fff' }}>Your program, week by week</h3>
                  <span style={{ fontSize: '13px', color: '#b7c7d8' }}>Five elements woven through every stay</span>
                </div>
                <div
                  style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '14px' }}
                  data-cols="repeat(5,1fr)"
                >
                  <span
                    style={{
                      position: 'absolute',
                      left: '8%',
                      right: '8%',
                      top: '19px',
                      height: '1px',
                      background: 'rgba(255,255,255,.18)',
                    }}
                  />
                  {$list(programSteps).map((st, $index) => (
                    <Fragment key={$index}>
                      <div
                        style={{
                          position: 'relative',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '12px',
                          alignItems: 'flex-start',
                        }}
                      >
                        <span
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: '#0890E8',
                            color: '#fff',
                            display: 'grid',
                            placeItems: 'center',
                            font: '600 13px Jost,sans-serif',
                            boxShadow: '0 0 0 6px #10233a',
                          }}
                        >
                          {$i(st?.n)}
                        </span>
                        <span style={{ color: '#7cc4f5' }}>{$i(st?.icon)}</span>
                        <div style={{ font: '600 15px Jost,sans-serif', color: '#fff', lineHeight: '1.3' }}>
                          {$i(st?.label)}
                        </div>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#b7c7d8' }}>{$i(st?.body)}</p>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </article>
            <aside
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                position: 'sticky',
                top: '130px',
                flex: '1 1 300px',
                maxWidth: '380px',
              }}
            >
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e3ecf4',
                  borderRadius: '20px',
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
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
                  Facility at a glance
                </div>
                {$list(facility).map((fac, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={{
                        display: 'flex',
                        gap: '12px',
                        alignItems: 'flex-start',
                        padding: '10px 0',
                        borderTop: '1px solid #f0f4f8',
                      }}
                    >
                      <span
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '9px',
                          background: '#eaf5fd',
                          color: '#0890E8',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: '0',
                        }}
                      >
                        {$i(fac?.icon)}
                      </span>
                      <div>
                        <div style={{ font: '600 14px Jost,sans-serif' }}>{$i(fac?.k)}</div>
                        <div style={{ fontSize: '13px', color: '#6b7f95', lineHeight: '1.45' }}>{$i(fac?.v)}</div>
                      </div>
                    </div>
                  </Fragment>
                ))}
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
                      Listing reviewed by
                    </div>
                    <div style={{ font: '600 14.5px Jost,sans-serif' }}>{$i(reviewerName)}</div>
                    <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>Addiction Rehab Centres Canada</div>
                  </div>
                </div>
                <p style={{ fontSize: '13px', lineHeight: '1.55', color: '#516378' }}>{$i(verifyNote)}</p>
              </div>
            </aside>
          </div>
        </section>
        <section
          id="pricing"
          data-screen-label={'Programs & Pricing'}
          style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px' }} data-rc-wrap="1">
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: '24px',
                flexWrap: 'wrap',
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
                  Programs cost
                </span>
                <h2 style={{ fontSize: '34px', marginTop: '8px' }} data-rc-lg="1">
                  {'Programs & Pricing'}
                </h2>
                <p style={{ fontSize: '15px', color: '#6b7f95', marginTop: '8px' }}>
                  Our services are HST exempt. Prices in CAD, confirmed with the centre {$i(centreUpdated)}.
                </p>
              </div>
              <$A
                className="scp7"
                href="tel:+17059966522"
                style={{
                  font: '600 15px Jost,sans-serif',
                  color: '#0890E8',
                  border: '1.5px solid #0890E8',
                  padding: '11px 18px',
                  borderRadius: '10px',
                }}
              >
                Confirm pricing with the centre
              </$A>
            </div>
            <div
              style={{ background: '#f7fafd', border: '1px solid #e3ecf4', borderRadius: '24px', overflow: 'hidden' }}
            >
              <div
                style={{
                  display: 'flex',
                  gap: '4px',
                  padding: '10px',
                  borderBottom: '1px solid #e9eff5',
                  overflowX: 'auto',
                  background: '#fff',
                }}
              >
                {$list(priceTabs).map((t, $index) => (
                  <Fragment key={$index}>
                    <button
                      onClick={t?.select}
                      style={$css(
                        `appearance:none;border:0;cursor:pointer;white-space:nowrap;font:500 14.5px Figtree,sans-serif;padding:11px 18px;border-radius:12px;background:${t?.bg ?? ''};color:${t?.color ?? ''};transition:all .18s`,
                      )}
                    >
                      {$i(t?.label)}
                    </button>
                  </Fragment>
                ))}
              </div>
              <div style={{ padding: '28px' }}>
                <div
                  style={$css(
                    `display:grid;grid-template-columns:${priceCols ?? ''};gap:0;background:#fff;border:1px solid #e3ecf4;border-radius:16px;overflow:hidden`,
                  )}
                  data-rc-dyn="1"
                >
                  {$list(priceHead).map((c, $index) => (
                    <Fragment key={$index}>
                      <div
                        style={{
                          padding: '14px 16px',
                          background: '#f1f6fb',
                          font: '600 11.5px Figtree,sans-serif',
                          letterSpacing: '.08em',
                          textTransform: 'uppercase',
                          color: '#6b7f95',
                          borderBottom: '1px solid #e3ecf4',
                        }}
                      >
                        {$i(c)}
                      </div>
                    </Fragment>
                  ))}
                  {$list(priceCells).map((c, $index) => (
                    <Fragment key={$index}>
                      <div
                        style={$css(
                          `padding:15px 16px;font:${c?.font ?? ''};color:${c?.color ?? ''};border-bottom:1px solid #f0f4f8;font-variant-numeric:tabular-nums`,
                        )}
                      >
                        {$i(c?.v)}
                      </div>
                    </Fragment>
                  ))}
                </div>
                <p style={{ fontSize: '13.5px', color: '#6b7f95', marginTop: '14px', lineHeight: '1.5' }}>
                  {$i(priceNote)}
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="team" data-screen-label="Team" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px' }} data-rc-wrap="1">
            <div style={{ marginBottom: '24px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Who will care for you
              </span>
              <h2 style={{ fontSize: '34px', marginTop: '8px' }} data-rc-lg="1">
                Meet the clinical team
              </h2>
              <p style={{ fontSize: '15px', color: '#6b7f95', marginTop: '8px', maxWidth: '620px' }}>
                Credentials are supplied by the centre and checked against provincial registries where available.
              </p>
            </div>
            <div
              style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }}
              data-cols="repeat(4,1fr)"
            >
              {$list(team).map((m, $index) => (
                <Fragment key={$index}>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '20px',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'repeating-linear-gradient(135deg,#dfeaf3 0 8px,#eaf2f8 8px 16px)',
                      }}
                    />
                    <div>
                      <div style={{ font: '600 16px Jost,sans-serif' }}>{$i(m?.name)}</div>
                      <div style={{ fontSize: '13.5px', color: '#0890E8', fontWeight: '500', marginTop: '2px' }}>
                        {$i(m?.role)}
                      </div>
                      <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>{$i(m?.cred)}</div>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <section
          id="reviews"
          data-screen-label="Reviews"
          style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '72px 32px',
              display: 'grid',
              gridTemplateColumns: '320px 1fr',
              gap: '48px',
              alignItems: 'start',
            }}
            data-cols="320px 1fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div
              style={{
                position: 'sticky',
                top: '130px',
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
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Reviews
              </span>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                <span style={{ font: '600 48px/1 Jost,sans-serif' }}>{$i(topRating)}</span>
                <span style={{ color: '#F5A623', fontSize: '18px', letterSpacing: '2px' }}>★★★★★</span>
              </div>
              <p style={{ fontSize: '13.5px', color: '#6b7f95' }}>
                {$i(topReviews)} Google reviews · {$i(siteReviews)} on this site
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {$list(ratingBars).map((r, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '14px 1fr 34px',
                        gap: '10px',
                        alignItems: 'center',
                        fontSize: '12.5px',
                        color: '#6b7f95',
                      }}
                      data-cols="14px 1fr 34px"
                    >
                      <span>{$i(r?.n)}</span>
                      <span
                        style={{
                          height: '6px',
                          borderRadius: '999px',
                          background: '#e3ecf4',
                          overflow: 'hidden',
                          display: 'block',
                        }}
                      >
                        <span style={$css(`display:block;height:100%;width:${r?.w ?? ''};background:#F5A623`)} />
                      </span>
                      <span style={{ textAlign: 'right' }}>{$i(r?.pct)}</span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <$A
                className="scp7"
                href="#"
                style={{
                  font: '600 15px Jost,sans-serif',
                  color: '#fff',
                  background: '#10233a',
                  padding: '12px',
                  borderRadius: '12px',
                  textAlign: 'center',
                  marginTop: '4px',
                }}
              >
                Write a review
              </$A>
              <p style={{ fontSize: '12px', color: '#6b7f95', lineHeight: '1.5' }}>
                Reviews are from former clients and families. We moderate for authenticity and never remove reviews at a
                centre's request.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {$list(reviewsList).map((r, $index) => (
                <Fragment key={$index}>
                  <article
                    style={{
                      background: '#fff',
                      border: '1px solid #e3ecf4',
                      borderRadius: '20px',
                      padding: '22px 24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}
                    >
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            background: '#eaf5fd',
                            color: '#0890E8',
                            display: 'grid',
                            placeItems: 'center',
                            font: '600 14px Jost,sans-serif',
                          }}
                        >
                          {$i(r?.initials)}
                        </span>
                        <div>
                          <div style={{ font: '600 15px Jost,sans-serif' }}>{$i(r?.name)}</div>
                          <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>{$i(r?.meta)}</div>
                        </div>
                      </div>
                      <span style={{ color: '#F5A623', fontSize: '14px', letterSpacing: '1px' }}>{$i(r?.stars)}</span>
                    </div>
                    <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#3b4d63' }}>{$i(r?.text)}</p>
                  </article>
                </Fragment>
              ))}
              <$A
                href="#"
                style={{
                  alignSelf: 'flex-start',
                  font: '600 14.5px Jost,sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                Read all reviews on Google{' '}
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
          </div>
        </section>
        <section
          id="location"
          data-screen-label="Location"
          style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '72px 32px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '48px',
              alignItems: 'start',
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
                Location
              </span>
              <h2 style={{ fontSize: '34px', lineHeight: '1.12' }} data-rc-lg="1">
                {$i(centreName)} in Wasaga Beach, {$i(centreProvince)}
              </h2>
              <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>
                Set on Wasaga Beach along Nottawasaga Bay, the centre is a short walk from the water and about two hours
                north of Toronto. Airport transfers can be arranged for clients travelling from the GTA and beyond.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} data-cols="1fr 1fr">
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #e3ecf4',
                    borderRadius: '14px',
                    padding: '14px 16px',
                  }}
                >
                  <div
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Address
                  </div>
                  <div style={{ font: '600 14.5px Jost,sans-serif', marginTop: '4px', lineHeight: '1.4' }}>
                    {$i(centreAddress)}
                  </div>
                </div>
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #e3ecf4',
                    borderRadius: '14px',
                    padding: '14px 16px',
                  }}
                >
                  <div
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Phone
                  </div>
                  <$A
                    className="scp0"
                    href="tel:+17059966522"
                    style={{ display: 'block', font: '600 14.5px Jost,sans-serif', marginTop: '4px', color: '#10233a' }}
                  >
                    705-996-6522
                  </$A>
                </div>
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #e3ecf4',
                    borderRadius: '14px',
                    padding: '14px 16px',
                  }}
                >
                  <div
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    From Toronto
                  </div>
                  <div style={{ font: '600 14.5px Jost,sans-serif', marginTop: '4px' }}>≈ 2 hrs by car</div>
                </div>
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #e3ecf4',
                    borderRadius: '14px',
                    padding: '14px 16px',
                  }}
                >
                  <div
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Admissions
                  </div>
                  <div style={{ font: '600 14.5px Jost,sans-serif', marginTop: '4px' }}>7 days a week</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <span
                  style={{
                    font: '600 11.5px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    color: '#6b7f95',
                  }}
                >
                  Serving clients from
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {$list(serving).map((s, $index) => (
                    <Fragment key={$index}>
                      <$A
                        className="scp2"
                        href={s?.href}
                        style={{
                          font: '500 13.5px Figtree,sans-serif',
                          color: '#1f3550',
                          background: '#fff',
                          border: '1px solid #e3ecf4',
                          padding: '7px 12px',
                          borderRadius: '999px',
                        }}
                      >
                        {$i(s?.label)}
                      </$A>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
            <div
              style={{
                position: 'relative',
                aspectRatio: '4/3',
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'repeating-linear-gradient(135deg,#dfeaf3 0 14px,#eaf2f8 14px 28px)',
                display: 'grid',
                placeItems: 'center',
                border: '1px solid #e3ecf4',
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
                map · Google Maps embed · Wasaga Beach, ON
              </span>
              <$A
                className="scp2"
                href="#"
                style={{
                  position: 'absolute',
                  right: '16px',
                  bottom: '16px',
                  font: '600 14px Jost,sans-serif',
                  color: '#10233a',
                  background: '#fff',
                  border: '1px solid #dbe6f0',
                  padding: '10px 16px',
                  borderRadius: '10px',
                }}
              >
                Get directions
              </$A>
            </div>
          </div>
        </section>
        <section
          id="callback"
          data-screen-label="Request a callback"
          style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '72px 32px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '56px',
              alignItems: 'start',
            }}
            data-cols="1fr 1fr"
            data-rc-gap="1"
            data-rc-wrap="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', position: 'sticky', top: '130px' }}>
              <span
                style={{
                  font: '600 12px Figtree,sans-serif',
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  color: '#0890E8',
                }}
              >
                Let Us Help You
              </span>
              <h2 style={{ fontSize: '36px', lineHeight: '1.12' }} data-rc-lg="1">
                Is this for yourself or a loved one?
              </h2>
              <p style={{ fontSize: '16.5px', lineHeight: '1.65', color: '#516378' }}>
                Tell us who needs help and we'll check availability at {$i(centreName)} — or suggest an alternative if
                it isn't the right fit.
              </p>
            </div>
            <form
              style={{
                background: '#fff',
                border: '1px solid #e3ecf4',
                borderRadius: '24px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '18px',
                boxShadow: '0 30px 60px -40px rgba(16,35,58,.35)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <h3 style={{ fontSize: '18px' }}>Request a confidential callback</h3>
                <span
                  style={{
                    font: '600 11px Figtree,sans-serif',
                    letterSpacing: '.08em',
                    textTransform: 'uppercase',
                    color: '#D82028',
                    background: '#fdecec',
                    padding: '5px 9px',
                    borderRadius: '999px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Private paid rehabs
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  background: '#fff8e6',
                  border: '1px solid #f5dd9a',
                  borderRadius: '14px',
                  padding: '14px 16px',
                }}
              >
                <span
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '9px',
                    background: '#fff',
                    border: '1px solid #f0d27a',
                    color: '#b7791f',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: '0',
                    font: '700 14px Jost,sans-serif',
                  }}
                >
                  $
                </span>
                <p style={{ fontSize: '13.5px', lineHeight: '1.55', color: '#5c4a12' }}>
                  The centres we connect you with are <strong>private, fee-based treatment providers</strong>. Programs
                  are typically paid for by self-pay, extended health benefits or employer plans.
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                  style={{
                    font: '600 11px Figtree,sans-serif',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: '#6b7f95',
                  }}
                >
                  Who needs help?
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }} data-cols="1fr 1fr">
                  {$list(whoOptions).map((w, $index) => (
                    <Fragment key={$index}>
                      <button
                        type="button"
                        onClick={w?.select}
                        style={$css(
                          `appearance:none;cursor:pointer;font:600 15px Jost,sans-serif;padding:14px;border-radius:14px;border:1.5px solid ${w?.border ?? ''};background:${w?.bg ?? ''};color:${w?.color ?? ''};transition:all .15s`,
                        )}
                      >
                        {$i(w?.label)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span
                  style={{
                    font: '600 11px Figtree,sans-serif',
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: '#6b7f95',
                  }}
                >
                  How will treatment be paid for?
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }} data-cols="1fr 1fr">
                  {$list(fundingOptions).map((f, $index) => (
                    <Fragment key={$index}>
                      <button
                        type="button"
                        onClick={f?.select}
                        style={$css(
                          `appearance:none;cursor:pointer;text-align:left;font:500 14px Figtree,sans-serif;padding:12px 14px;border-radius:12px;border:1.5px solid ${f?.border ?? ''};background:${f?.bg ?? ''};color:${f?.color ?? ''};display:flex;align-items:center;gap:10px;transition:all .15s`,
                        )}
                      >
                        <span
                          style={$css(
                            `width:16px;height:16px;border-radius:50%;border:1.5px solid ${f?.dot ?? ''};display:grid;place-items:center;flex-shrink:0`,
                          )}
                        >
                          <span style={$css(`width:8px;height:8px;border-radius:50%;background:${f?.dotFill ?? ''}`)} />
                        </span>
                        {$i(f?.label)}
                      </button>
                    </Fragment>
                  ))}
                </div>
                {needsPublic ? (
                  <>
                    <p
                      style={{
                        fontSize: '13px',
                        lineHeight: '1.5',
                        color: '#516378',
                        background: '#f7fafd',
                        border: '1px solid #e3ecf4',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        animation: 'fadeUp .2s ease-out',
                      }}
                    >
                      Good to know: publicly funded detox and treatment exist in every province, often with wait times.
                      We'll send you the right provincial intake line and free resources rather than a private centre.
                    </p>
                  </>
                ) : null}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} data-cols="1fr 1fr">
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Preferred setting
                  </span>
                  <select
                    style={{
                      appearance: 'none',
                      border: '1px solid #dbe6f0',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      font: '500 14.5px Figtree,sans-serif',
                      color: '#10233a',
                      outline: 'none',
                      background: '#f7fafd',
                      cursor: 'pointer',
                    }}
                  >
                    <option>Not sure yet</option>
                    <option>Residential (live-in)</option>
                    <option>Medical detox</option>
                    <option>Outpatient</option>
                  </select>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    When?
                  </span>
                  <select
                    style={{
                      appearance: 'none',
                      border: '1px solid #dbe6f0',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      font: '500 14.5px Figtree,sans-serif',
                      color: '#10233a',
                      outline: 'none',
                      background: '#f7fafd',
                      cursor: 'pointer',
                    }}
                  >
                    <option>As soon as possible</option>
                    <option>Within 30 days</option>
                    <option>Just exploring options</option>
                  </select>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Province
                  </span>
                  <select
                    style={{
                      appearance: 'none',
                      border: '1px solid #dbe6f0',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      font: '500 14.5px Figtree,sans-serif',
                      color: '#10233a',
                      outline: 'none',
                      background: '#f7fafd',
                      cursor: 'pointer',
                    }}
                  >
                    <option>Select a province</option>
                    <option>Alberta</option>
                    <option>British Columbia</option>
                    <option>Manitoba</option>
                    <option>New Brunswick</option>
                    <option>Newfoundland and Labrador</option>
                    <option>Nova Scotia</option>
                    <option>Ontario</option>
                    <option>Prince Edward Island</option>
                    <option>Quebec</option>
                    <option>Saskatchewan</option>
                  </select>
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Substance <span style={{ color: '#D82028' }}>*</span>
                  </span>
                  <select
                    value={$val(substance)}
                    onChange={setSubstance}
                    style={{
                      appearance: 'none',
                      border: '1px solid #dbe6f0',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      font: '500 14.5px Figtree,sans-serif',
                      color: '#10233a',
                      outline: 'none',
                      background: '#f7fafd',
                      cursor: 'pointer',
                    }}
                  >
                    {$list(substanceOptions).map((s, $index) => (
                      <Fragment key={$index}>
                        <option value={$val(s)}>{$i(s)}</option>
                      </Fragment>
                    ))}
                  </select>
                </label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }} data-cols="1fr 1fr 1fr">
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    First name <span style={{ color: '#D82028' }}>*</span>
                  </span>
                  <input
                    type="text"
                    required={true}
                    autoComplete="given-name"
                    placeholder="Your first name"
                    style={{
                      border: '1px solid #dbe6f0',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      font: '500 14.5px Figtree,sans-serif',
                      color: '#10233a',
                      outline: 'none',
                      background: '#f7fafd',
                    }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Phone <span style={{ color: '#D82028' }}>*</span>
                  </span>
                  <input
                    type="tel"
                    required={true}
                    autoComplete="tel"
                    placeholder="(___) ___-____"
                    style={{
                      border: '1px solid #dbe6f0',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      font: '500 14.5px Figtree,sans-serif',
                      color: '#10233a',
                      outline: 'none',
                      background: '#f7fafd',
                    }}
                  />
                </label>
                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span
                    style={{
                      font: '600 11px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Email <span style={{ color: '#D82028' }}>*</span>
                  </span>
                  <input
                    type="email"
                    required={true}
                    autoComplete="email"
                    placeholder="you@example.com"
                    style={{
                      border: '1px solid #dbe6f0',
                      borderRadius: '12px',
                      padding: '12px 14px',
                      font: '500 14.5px Figtree,sans-serif',
                      color: '#10233a',
                      outline: 'none',
                      background: '#f7fafd',
                    }}
                  />
                </label>
              </div>
              <button
                type="button"
                onClick={toggleAck}
                aria-pressed={ack}
                style={$css(
                  `appearance:none;cursor:pointer;text-align:left;display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:14px;border:1.5px solid ${ackBorder ?? ''};background:${ackBg ?? ''};transition:all .15s`,
                )}
              >
                <span
                  style={$css(
                    `width:22px;height:22px;border-radius:7px;border:1.5px solid ${ackBoxBorder ?? ''};background:${ackBoxBg ?? ''};display:grid;place-items:center;flex-shrink:0;margin-top:1px;color:#fff;font:700 13px Jost,sans-serif`,
                  )}
                >
                  {$i(ackMark)}
                </span>
                <span style={{ fontSize: '13.5px', lineHeight: '1.55', color: '#1f3550' }}>
                  I understand the centres recommended are <strong>private, fee-based providers</strong>, that Addiction
                  Rehab Centres Canada is a free referral helpline, and that my details may be shared with a matched
                  centre only after I agree. <span style={{ color: '#D82028' }}>*</span>
                </span>
              </button>
              <button
                className="scpc"
                type="submit"
                disabled={submitDisabled}
                style={$css(
                  `appearance:none;border:0;cursor:${submitCursor ?? ''};font:600 16px Jost,sans-serif;color:#fff;background:${submitBg ?? ''};padding:15px;border-radius:12px;transition:background .18s`,
                )}
              >
                {$i(submitLabel)}
              </button>
              <p style={{ fontSize: '12.5px', color: '#6b7f95', textAlign: 'center' }}>
                Confidential · No obligation · A specialist calls back within the hour, 24/7
              </p>
            </form>
          </div>
        </section>
        {unclaimed ? (
          <>
            <section id="claim" data-screen-label="Claim this listing" style={{ background: '#10233a', color: '#fff' }}>
              <div
                style={{
                  maxWidth: '1280px',
                  margin: '0 auto',
                  padding: '72px 32px',
                  display: 'grid',
                  gridTemplateColumns: '1.1fr .9fr',
                  gap: '56px',
                  alignItems: 'center',
                }}
                data-cols="1.1fr .9fr"
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
                    For {$i(centreName)}
                  </span>
                  <h2 style={{ fontSize: '36px', lineHeight: '1.12', color: '#fff' }} data-rc-lg="1">
                    Do you own or manage this centre? Claim your free listing.
                  </h2>
                  <p style={{ fontSize: '16.5px', lineHeight: '1.65', color: '#b7c7d8' }}>
                    This page was built from public information and has not been confirmed by the centre. Claiming takes
                    a few minutes and gives you full control of how {$i(centreName)} appears to the{' '}
                    {$i(monthlyVisitors)} people who search this site every month.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <$A
                      className="scpr"
                      href="https://addictionrehabcenters.ca/claim-your-listing/"
                      style={{
                        font: '600 16px Jost,sans-serif',
                        color: '#10233a',
                        background: '#fff',
                        padding: '14px 22px',
                        borderRadius: '12px',
                      }}
                    >
                      Claim this listing — free
                    </$A>
                    <$A
                      className="scpv"
                      href="https://addictionrehabcenters.ca/promote-your-centre/"
                      style={{
                        font: '600 16px Jost,sans-serif',
                        color: '#fff',
                        border: '1.5px solid rgba(255,255,255,.5)',
                        padding: '14px 22px',
                        borderRadius: '12px',
                      }}
                    >
                      See premium options
                    </$A>
                  </div>
                  <p style={{ fontSize: '13px', color: '#7fa0bf' }}>
                    Verification by phone or business email · No credit card required
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} data-cols="1fr 1fr">
                  {$list(claimBenefits).map((cb, $index) => (
                    <Fragment key={$index}>
                      <div
                        style={{
                          background: 'rgba(255,255,255,.06)',
                          border: '1px solid rgba(255,255,255,.12)',
                          borderRadius: '16px',
                          padding: '18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <span
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '10px',
                            background: 'rgba(8,144,232,.2)',
                            color: '#7cc4f5',
                            display: 'grid',
                            placeItems: 'center',
                          }}
                        >
                          {$i(cb?.icon)}
                        </span>
                        <div style={{ font: '600 15px Jost,sans-serif', color: '#fff' }}>{$i(cb?.title)}</div>
                        <p style={{ fontSize: '13px', lineHeight: '1.5', color: '#b7c7d8' }}>{$i(cb?.body)}</p>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : null}
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
                Questions about {$i(centreName)}
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.65', color: '#516378' }}>
                Answers confirmed with the centre. Still unsure? Call — it's free and confidential.
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
              {$list(centreFaqs).map((q, $index) => (
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
          data-screen-label="Sponsored Centres"
          style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5', overflow: 'hidden' }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px 72px' }} data-rc-wrap="1">
            <div
              style={{
                display: 'flex',
                alignItems: 'end',
                justifyContent: 'space-between',
                gap: '24px',
                marginBottom: '32px',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#0890E8',
                  }}
                >
                  You may also consider <span style={{ display: 'none' }}>Ad disclosure</span>
                </span>
                <h2 style={{ fontSize: '38px', marginTop: '10px' }} data-rc-lg="1">
                  Other Rehab Centres in {$i(centreProvince)}
                </h2>
                <p style={{ fontSize: '15px', color: '#6b7f95', marginTop: '8px', maxWidth: '640px' }}>
                  Comparing options is normal. Every centre below is listed independently; call us and we will help you
                  weigh them.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '14px', color: '#6b7f95', marginRight: '6px', whiteSpace: 'nowrap' }}>
                  {$i(slidePos)}
                </span>
                <button
                  className="scp2"
                  onClick={slidePrev}
                  aria-label="Previous"
                  style={{
                    appearance: 'none',
                    cursor: 'pointer',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    border: '1px solid #dbe6f0',
                    background: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#10233a',
                    transition: 'border-color .18s,background .18s',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderLeft: '1.5px solid currentColor',
                      borderBottom: '1.5px solid currentColor',
                      transform: 'rotate(45deg)',
                      marginLeft: '3px',
                    }}
                  />
                </button>
                <button
                  className="scp2"
                  onClick={slideNext}
                  aria-label="Next"
                  style={{
                    appearance: 'none',
                    cursor: 'pointer',
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    border: '1px solid #dbe6f0',
                    background: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#10233a',
                    transition: 'border-color .18s,background .18s',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRight: '1.5px solid currentColor',
                      borderTop: '1.5px solid currentColor',
                      transform: 'rotate(45deg)',
                      marginRight: '3px',
                    }}
                  />
                </button>
              </div>
            </div>
            <div
              ref={sliderRef}
              onScroll={onSlideScroll}
              style={{
                display: 'grid',
                gridAutoFlow: 'column',
                gridAutoColumns: 'calc((100% - 48px)/3)',
                gap: '24px',
                overflowX: 'auto',
                scrollSnapType: 'x mandatory',
                scrollBehavior: 'smooth',
                scrollbarWidth: 'none',
                paddingBottom: '8px',
                margin: '0 -32px',
                paddingLeft: '32px',
                paddingRight: '32px',
              }}
            >
              {$list(centres).map((c, $index) => (
                <Fragment key={$index}>
                  <article
                    className="scpn"
                    style={{
                      scrollSnapAlign: 'start',
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
                        padding: '22px 22px 24px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        flex: '1',
                      }}
                    >
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
                      <h3 style={{ fontSize: '21px', lineHeight: '1.25' }}>
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
                      <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#3b4d63' }}>{$i(c?.excerpt)}</p>
                      <div
                        style={{
                          marginTop: 'auto',
                          paddingTop: '14px',
                          borderTop: '1px solid #edf2f7',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span style={{ fontSize: '13.5px', color: '#6b7f95' }}>
                          {$i(c?.googleReviews)} Google reviews
                        </span>
                        <$A href={c?.href} style={{ font: '600 14px Jost,sans-serif' }}>
                          View centre →
                        </$A>
                      </div>
                    </div>
                  </article>
                </Fragment>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
              {$list(slideDots).map((d, $index) => (
                <Fragment key={$index}>
                  <button
                    onClick={d?.go}
                    aria-label="Go to slide"
                    style={$css(
                      `appearance:none;border:0;cursor:pointer;height:8px;width:${d?.w ?? ''};border-radius:999px;background:${d?.bg ?? ''};transition:width .2s,background .2s;padding:0`,
                    )}
                  />
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
  centreName: 'Metamorphosis Centre for Change',
  claimed: true,
  topRating: '5.0',
  topReviews: '92',
  reviewerName: 'Clinical Reviewer (name, credentials)',
};
const View = createDC('Centre', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} responsive {...props} />;
}
