'use client';
// Generated from Drug.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = { menu: null, tab: 0, slide: 0, faq: 0, who: 'Yourself', funding: 'Self-pay', ack: false };
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
        photo: '/assets/img/prog-drug.jpg',
        body: 'Rehabilitation Centre Toronto: The symptoms of drug addiction are designed to keep you using. The "reality" drug addiction convinces you of is not real at all. The world doesn\'t have to be miserable, and you don\'t have to spend your life as an addict. Let us help you chart a course to permanent, content sobriety at our state-of-the-art drug rehab facilities.',
      },
      {
        title: 'Alcohol Rehab',
        icon: ic.glass,
        cta: 'Find An Alcohol Rehab',
        photo: '/assets/img/prog-alcohol.jpg',
        body: 'Let us show you how you can live in an alcohol-saturated world without giving in to temptation. All you need to do is avoid drinking. This might seem challenging, even impossible, at first, but we can show you how to achieve sobriety that lasts a lifetime. We can help you get out of the cycle of alcohol addiction with Alcohol Rehab Program.',
      },
      {
        title: 'Prescription Drug Rehab',
        icon: ic.rx,
        cta: 'Find A Prescription Drug Rehab',
        photo: '/assets/img/prog-rx.jpg',
        body: "The prescription drug rehabilitation process begins with detoxing from prescription drugs. In most cases, this will mean quitting cold turkey, but if you have a medical condition, you might steadily taper down your dose instead. We'll work with you to manage the symptoms of detox, and offer a steady stream of encouragement as you cope with cravings.",
      },
      {
        title: 'Dual Diagnosis',
        icon: ic.dual,
        cta: 'Find A Dual Diagnosis Center',
        photo: '/assets/img/prog-dual.jpg',
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

    return {
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
    authorName,
    centres,
    drug,
    drugFaqs,
    drugLower,
    drugToc,
    effectCards,
    effects,
    footerCols,
    fundingOptions,
    iconPhone,
    locations,
    needsPublic,
    onSlideScroll,
    otherDrugs,
    reviewerName,
    setSubstance,
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
    toggleAck,
    whoOptions,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="drugs" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        <section
          data-screen-label="Drug Hero"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(1000px 500px at 85% -10%,#dbeefb 0%,rgba(219,238,251,0) 60%),#f7fafd',
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
              <span style={{ color: '#6b7f95' }}>Addiction By Drugs</span>
              <span style={{ opacity: '.5' }}>/</span>
              <span style={{ color: '#10233a', fontWeight: '500' }}>{$i(drug)} Addiction</span>
            </nav>
            <div
              style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: '56px', alignItems: 'center' }}
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
                      color: '#0890E8',
                      background: '#eaf5fd',
                      padding: '6px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    Addiction by drugs
                  </span>
                  <span
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#2fb46b',
                      background: '#e9f8ef',
                      padding: '6px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    Medically reviewed
                  </span>
                </div>
                <h1 style={{ fontSize: '54px', lineHeight: '1.05', color: '#10233a' }} data-rc-lg="1">
                  {$i(drug)} Addiction
                </h1>
                <h2 style={{ font: '400 22px/1.45 Figtree,sans-serif', color: '#516378' }}>
                  {$i(drug)} Dependence and Treatment: What is {$i(drug)}?
                </h2>
                <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63', maxWidth: '620px' }}>
                  <$A href="https://addictionrehabcenters.ca/benzodiazepine-addiction/">Benzodiazepine</$A> is a{' '}
                  <$A href="https://addictionrehabcenters.ca/prescription-drugs-addiction/">prescription medicine</$A>{' '}
                  that can cause addiction. A person can become addicted to this kind of drug in two ways: either he
                  gets addicted to it due to its recreational use or he develops benzodiazepine addiction or dependence
                  as a prescribed medicine. In Canada, benzodiazepine addiction is a common problem. It has been
                  discovered that drivers with fatal injuries have benzodiazepine running through their system and the
                  ill-effects of this drug is seen in many Canadian provinces today.
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
                    {$i(iconPhone)}
                    Talk to a specialist
                  </$A>
                  <$A
                    className="scp2"
                    href="https://addictionrehabcenters.ca/rehab/"
                    style={{
                      font: '600 16px Jost,sans-serif',
                      color: '#10233a',
                      background: '#fff',
                      border: '1px solid #dbe6f0',
                      padding: '14px 22px',
                      borderRadius: '12px',
                    }}
                  >
                    Find A Drug Rehab
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
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>35.9%</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>
                      Quebec — highest provincial rate
                    </div>
                  </div>
                  <div>
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>18.2%</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>Prairies — lowest rate</div>
                  </div>
                  <div>
                    <div style={{ font: '600 24px Jost,sans-serif', lineHeight: '1' }}>22.5%</div>
                    <div style={{ fontSize: '13px', color: '#6b7f95', marginTop: '4px' }}>
                      Of elderly studied (1998) took benzos with other drugs
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    position: 'relative',
                    aspectRatio: '4/3',
                    borderRadius: '28px',
                    overflow: 'hidden',
                    background: '#eaf2f8',
                    boxShadow: '0 40px 80px -40px rgba(16,35,58,.45)',
                  }}
                >
                  <img
                    src="/assets/img/drug-benzo-hero.jpg"
                    alt="Woman talking with a doctor about tapering her medication"
                    loading="lazy"
                    style={{
                      position: 'absolute',
                      inset: '0',
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                </div>
                <div
                  style={{
                    background: '#fff',
                    border: '1px solid #e3ecf4',
                    borderRadius: '18px',
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
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
                    Common adverse effects of {$i(drugLower)} addiction
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {$list(effects).map((e, $index) => (
                      <Fragment key={$index}>
                        <span
                          style={{
                            font: '500 13.5px Figtree,sans-serif',
                            color: '#1f3550',
                            background: '#f7fafd',
                            border: '1px solid #e3ecf4',
                            padding: '7px 12px',
                            borderRadius: '999px',
                          }}
                        >
                          {$i(e)}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                  <p style={{ fontSize: '12.5px', color: '#6b7f95', lineHeight: '1.5' }}>
                    If you or someone you know is having suicidal thoughts, call or text 9-8-8 (Canada) or go to the
                    nearest emergency department.
                  </p>
                </div>
              </div>
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
                  Sponsored{' '}
                  <span
                    style={{
                      font: '500 10.5px Figtree,sans-serif',
                      letterSpacing: '.06em',
                      color: '#6b7f95',
                      background: '#eef4f9',
                      padding: '3px 7px',
                      borderRadius: '999px',
                      textTransform: 'none',
                    }}
                  >
                    Ad disclosure
                  </span>
                </span>
                <h2 style={{ fontSize: '38px', marginTop: '10px' }} data-rc-lg="1">
                  Centres Treating {$i(drug)} Addiction
                </h2>
                <p style={{ fontSize: '15px', color: '#6b7f95', marginTop: '8px', maxWidth: '640px' }}>
                  These centres pay to appear here. Sponsorship never changes our editorial content or helpline advice —
                  we still verify every listing.
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
        <section data-screen-label="Effects" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
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
                  {$list(drugToc).map((t, $index) => (
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
                  background: '#f7fafd',
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
                    <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>Addiction Rehab Centres Canada</div>
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
                    <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>Addiction medicine physician</div>
                  </div>
                </div>
                <div
                  style={{
                    fontSize: '12.5px',
                    color: '#6b7f95',
                    borderTop: '1px solid #e3ecf4',
                    paddingTop: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <span>Last updated March 3, 2026</span>
                  <span>Est. reading time 3 minutes</span>
                </div>
              </div>
              <$A
                className="scpe"
                href="tel:+18558854747"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  background: 'linear-gradient(160deg,#0f5fa8,#0890E8)',
                  borderRadius: '20px',
                  padding: '22px',
                  color: '#fff',
                }}
              >
                <span
                  style={{
                    font: '500 11.5px Figtree,sans-serif',
                    letterSpacing: '.12em',
                    textTransform: 'uppercase',
                    opacity: '.85',
                  }}
                >
                  Free helpline · 24/7
                </span>
                <span style={{ font: '600 20px Jost,sans-serif' }}>1-855-885-4747</span>
                <span style={{ fontSize: '13px', opacity: '.9' }}>Talk to one of our specialists</span>
              </$A>
            </aside>
            <article style={{ display: 'flex', flexDirection: 'column', gap: '22px', maxWidth: '760px' }}>
              <h2 id="canada" style={{ fontSize: '36px', lineHeight: '1.12' }} data-rc-lg="1">
                {$i(drug)} addiction in Canada
              </h2>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                Quebec is one of the{' '}
                <$A href="https://addictionrehabcenters.ca/30-days-treatment-by-canadian-provinces/">
                  provinces in Canada
                </$A>{' '}
                that comes with a large number of addictions that are associated with the use of benzodiazepine. Quebec
                has a rate of 35.9 percent, the highest among all provinces, and Prairies with 18.2 percent being the
                lowest. Surprisingly, studies have shown that benzodiazepine is commonly prescribed to women so this is
                a clear indication that in Canada, it is the women who are more prone to benzodiazepine addiction.
              </p>
              <div
                style={{
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '16/8',
                  borderRadius: '20px',
                  background: '#eaf2f8',
                  margin: '6px 0',
                }}
              >
                <img
                  src="/assets/img/drug-benzo-effect.jpg"
                  alt="Stressed woman resting her head on her hand at a desk"
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                In 1992, people who were involved in traffic accidents have been found with benzodiazepine in their
                systems, making benzodiazepine addiction as a third most common reasons for traffic accidents in
                Ontario. It was also in the year 1998 when a study was conducted among elderly and it was found out that
                22.5 percent of these fellows were taking benzodiazepine along with other kinds of drugs, which can be
                very dangerous as it can cause multiple drug addiction.
              </p>
              <h3 id="effects" style={{ fontSize: '26px', marginTop: '10px' }}>
                Adverse effects of {$i(drugLower)} addiction
              </h3>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                When someone becomes addicted to benzodiazepine, adverse effects are often expected and these can be
                very dangerous. Some of the commonly known adverse effects of benzodiazepine addiction include
                depression, rage and agitation. These are all conditions that become much worse when a person takes
                benzodiazepine. In some cases, suicidal thoughts are a common effect.
              </p>
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', margin: '6px 0' }}
                data-cols="repeat(3,1fr)"
              >
                {$list(effectCards).map((e, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={{
                        background: '#f7fafd',
                        border: '1px solid #e3ecf4',
                        borderRadius: '18px',
                        padding: '20px',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          background: '#fff',
                          border: '1px solid #e3ecf4',
                          color: '#D82028',
                          display: 'grid',
                          placeItems: 'center',
                          marginBottom: '12px',
                        }}
                      >
                        {$i(e?.icon)}
                      </div>
                      <div style={{ font: '600 16px Jost,sans-serif' }}>{$i(e?.title)}</div>
                      <p style={{ fontSize: '14px', lineHeight: '1.55', color: '#516378', marginTop: '4px' }}>
                        {$i(e?.body)}
                      </p>
                    </div>
                  </Fragment>
                ))}
              </div>
              <h2 id="treatment" style={{ fontSize: '36px', lineHeight: '1.12', marginTop: '16px' }} data-rc-lg="1">
                On Finding the Right Treatment for {$i(drug)} Addiction
              </h2>
              <div
                style={{
                  overflow: 'hidden',
                  position: 'relative',
                  aspectRatio: '16/8',
                  borderRadius: '20px',
                  background: '#eaf2f8',
                }}
              >
                <img
                  src="/assets/img/drug-benzo-treatment.jpg"
                  alt="Women sharing in a group session at a treatment centre"
                  loading="lazy"
                  style={{
                    position: 'absolute',
                    inset: '0',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
              </div>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                As of the present days, there are many rehabilitation centers that are scattered in Canada and the all
                offer ways to help a patient recover from his{' '}
                <$A href="https://addictionrehabcenters.ca/drug-rehabilitation-in-canada/">addiction</$A>. These
                rehabilitation centers often come with various types of programs and procedures to meet the respective
                need and requirement of every patient. In addition, these centers are also staffed with professionals
                who work in a dedicated and persistent manner to help every patient recover and get back to his normal
                life.
              </p>
              <p style={{ fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' }}>
                There are several places wherein you can find help and assistance in relation to benzodiazepine
                addiction. In fact, there are different settings for drug rehabilitation centers and these usually
                include outpatient, residential, and others. We at{' '}
                <$A href="https://addictionrehabcenters.ca/">
                  <strong>Addiction Rehab Centres Canada</strong>
                </$A>{' '}
                offers safe and effective programs that can help our patients overcome their addiction. We also offer
                substantial pieces of advice rendered by our professional counselors. This way, you will get the proper
                assessment and the best option for you or your loved one.
              </p>
              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', margin: '6px 0' }}
                data-cols="1fr 1fr"
              >
                <div
                  style={{ background: '#f7fafd', border: '1px solid #e3ecf4', borderRadius: '18px', padding: '22px' }}
                >
                  <div
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.1em',
                      textTransform: 'uppercase',
                      color: '#0890E8',
                      marginBottom: '8px',
                    }}
                  >
                    Residential
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: '1.6', color: '#3b4d63' }}>
                    Medically supervised tapering and 24/7 support away from triggers — recommended for long-term or
                    high-dose use.
                  </p>
                </div>
                <div
                  style={{ background: '#f7fafd', border: '1px solid #e3ecf4', borderRadius: '18px', padding: '22px' }}
                >
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
                    Gradual taper with your physician plus counselling while living at home — suited to stable,
                    lower-dose situations.
                  </p>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '20px',
                  flexWrap: 'wrap',
                  background: '#10233a',
                  borderRadius: '20px',
                  padding: '24px 26px',
                  color: '#fff',
                  marginTop: '6px',
                }}
              >
                <div>
                  <div style={{ font: '600 20px Jost,sans-serif', color: '#fff' }}>Talk To One Of Our Specialists</div>
                  <div style={{ fontSize: '14px', color: '#b7c7d8', marginTop: '4px' }}>
                    Free, confidential, 24 hours a day.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <$A
                    className="scpr"
                    href="tel:1-855-885-4747"
                    style={{
                      font: '600 15px Jost,sans-serif',
                      color: '#10233a',
                      background: '#fff',
                      padding: '12px 18px',
                      borderRadius: '10px',
                    }}
                  >
                    Call 1-855-885-4747
                  </$A>
                  <$A
                    className="scpv"
                    href="https://addictionrehabcenters.ca/contact/"
                    style={{
                      font: '600 15px Jost,sans-serif',
                      color: '#fff',
                      border: '1.5px solid rgba(255,255,255,.5)',
                      padding: '12px 18px',
                      borderRadius: '10px',
                    }}
                  >
                    Contact Us Today
                  </$A>
                </div>
              </div>
              <div
                style={{
                  marginTop: '10px',
                  padding: '20px 22px',
                  background: '#f7fafd',
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
                  <li>Health Canada — Benzodiazepines: risks, dependence and safe tapering guidance</li>
                  <li>CAMH — Benzodiazepines: information for patients and families</li>
                  <li>
                    <$A href="https://addictionrehabcenters.ca/prescription-drugs-addiction/">
                      Prescription Drugs Addiction
                    </$A>{' '}
                    · <$A href="https://addictionrehabcenters.ca/medical-detox-in-canada/">Medical Detox in Canada</$A>{' '}
                    · <$A href="https://addictionrehabcenters.ca/tranquilisers-addiction/">Tranquilisers Addiction</$A>
                  </li>
                </ul>
              </div>
            </article>
          </div>
        </section>
        <section data-screen-label="Let Us Help You" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
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
                Tell us who needs help and we'll point you to the right {$i(drugLower)} program — a medically supervised
                taper, residential care, or outpatient support.
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
                {$i(drug)} addiction: your questions answered
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
              {$list(drugFaqs).map((q, $index) => (
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
        <section data-screen-label="Provinces" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
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
                  Find help near you
                </span>
                <h2 style={{ fontSize: '32px', marginTop: '8px' }}>Drug Rehab Centres By Provinces</h2>
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
              {$list(locations).map((loc, $index) => (
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
        <section data-screen-label="Other Drugs" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
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
                Explore
              </span>
              <h2 style={{ fontSize: '32px', marginTop: '8px' }}>Other Addictions By Drugs</h2>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {$list(otherDrugs).map((d, $index) => (
                <Fragment key={$index}>
                  <$A
                    className="scp2"
                    href={d?.href}
                    style={{
                      font: '500 14px Figtree,sans-serif',
                      color: '#1f3550',
                      background: '#f7fafd',
                      border: '1px solid #e3ecf4',
                      padding: '10px 14px',
                      borderRadius: '999px',
                    }}
                  >
                    {$i(d?.label)}
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
  drug: 'Benzodiazepine',
  authorName: 'Editorial Team',
  reviewerName: 'Clinical Reviewer (name, credentials)',
};
const View = createDC('Drug', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} responsive {...props} />;
}
