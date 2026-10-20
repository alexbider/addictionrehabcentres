'use client';
// Generated from Centre.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';
import SiteFooter from './SiteFooter';
import { postJson } from '@/lib/form-client';
import { Honeypot, FormError } from '@/components/FormBits';
import CentreCard from '@/components/CentreCard';
import GalleryGrid from '@/components/GalleryGrid';
import { buildBody, clean } from '@/dc/guide';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  componentDidMount() {
    const set = () => {
      const h = document.querySelector('[data-sc-name="SiteHeader"]');
      if (h) document.documentElement.style.setProperty('--hdr', Math.round(h.getBoundingClientRect().height) + 'px');
    };
    set();
    window.addEventListener('resize', set);
    this._hdr = set;
    setTimeout(set, 300);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._hdr);
  }
  state = { menu: null, tab: 0, slide: 0, faq: 0, who: 'Yourself', funding: 'Self-pay', ack: false, cbSent: false, cbSending: false, cbError: '', cbFields: null, priceTab: 0 };
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
    const B = '/';
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
      { label: 'Yukon Rehabs', href: B + 'yukon-drug-rehab-treatments/', code: 'YT' },
    ];

    // Up to 10 centres — populated from the backend later. Google rating/review counts are sample values.
    const centres = [
      {
        name: 'Inspire Change Wellness Center',
        href: B + 'inspire-change-wellness-center/',
        category: 'British Columbia Rehabs',
        catHref: B + 'british-columbia-rehabs/',
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
        catHref: B + 'ontario-rehabs/',
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
        catHref: B + 'ontario-rehabs/',
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
        excerpt: 'Call for current programs and availability.',
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
        excerpt: 'Call for current programs and availability.',
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
        excerpt: 'Call for current programs and availability.',
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

    // Real centre (props.data): every design section is filled from the view model built in src/lib/centre.ts
    // (real source data first, then the design's own sample values behind SHOW_SAMPLE_DATA, then neutral written text).
    // Without props.data (the /centre/ design sample route) the design's own sample content is shown.
    const D = this.props.data || null;
    const sample = !D;
    const M = D ? D.m : null;
    const showSample = sample || !!M.showSample;
    const P17 = { fontSize: '17px', lineHeight: '1.75', color: '#3b4d63' };
    const paras = (blocks) => (blocks || []).map((x, i) => R('p', { key: i, style: P17, dangerouslySetInnerHTML: { __html: clean(x.html ?? x.text) } }));
    const stripe = (a, b2, w) => 'repeating-linear-gradient(135deg,' + a + ' 0 ' + w + 'px,' + b2 + ' ' + w + 'px ' + 2 * w + 'px)';
    // ---- design defaults for the sample route
    let live = {
      showSample: true,
      cityCrumb: { label: 'Toronto Rehabs', href: '/toronto-rehabs/' },
      galleryNode: null,
      logoNode: null,
      fromOn: true,
      fromSub: '/ 4 weeks · HST exempt',
      callLabel: 'Call centre · 705-996-6522',
      aboutH2: centreName + ': A Philosophy of Transformation',
      introNodes: [
        R('p', { key: 'i0', style: P17 }, "Metamorphosis Centre for Change aims to transform their clients rather than simply aiding in their recovery from addiction. The centre's philosophy is to help clients create a new version of themselves by shedding the layers that led to addiction. They believe that self-actualization comes from the journey and the lessons learned along the way. The program is likened to a cocoon where transformation begins. The centre's staff is passionate about providing their clients with a successful journey to a more fulfilling future. Choosing Metamorphosis means choosing a lasting positive change in their life."),
      ],
      videoNode: R('div', { style: { position: 'relative', aspectRatio: '16/9', borderRadius: '20px', overflow: 'hidden', background: '#10233a', display: 'grid', placeItems: 'center', marginTop: '6px' } },
        R('span', { style: { position: 'absolute', inset: '0', background: stripe('#1c3352', '#223c5e', 14) } }),
        R('span', { style: { position: 'relative', width: '72px', height: '72px', borderRadius: '50%', background: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 20px 40px -20px rgba(0,0,0,.6)' } },
          R('span', { style: { width: '0', height: '0', borderLeft: '22px solid #0890E8', borderTop: '13px solid transparent', borderBottom: '13px solid transparent', marginLeft: '6px' } })),
        R('span', { style: { position: 'absolute', left: '18px', bottom: '16px', font: '500 12px ui-monospace,Menlo,monospace', color: '#b7c7d8', background: 'rgba(16,35,58,.7)', padding: '6px 10px', borderRadius: '6px' } }, 'video · Vimeo 1079322589 · Centre tour')),
      overviewNodes: [
        R('p', { key: 'o0', style: P17 }, "The clinical team at Metamorphosis centre for change understands that breaking addiction is not just about quitting substances or harmful behavior. Addiction is a complex problem that affects individuals' emotional, mental, and physical states. At the center, the approach to treatment is holistic and considers all aspects of an individual's life. The residential facility offers interventions, nurse services, withdrawal management services, mental health support, family programs and counseling, lifetime aftercare, evidence-based statistical reporting, luxury amenities, life coaching, and menus prepared by a Red Seal Chef. The aim is to equip individuals with the skills required to successfully live a life without addiction."),
      ],
      afterNodes: [
        R('p', { key: 'a0', style: P17 }, "Metamorphosis's clinical team recognizes that each individual's addiction is unique; therefore, treatment requires a personalized approach. The facility's program includes one on one counseling, group therapy, meditation introduction, physical exercise, and participation in outside activities that promote an alcohol and drug-free lifestyle. Clients stay in a 20,000 sq ft, 2-story wheelchair accessible building, each room with its own thermostat, ensuite three-piece bathroom, and spacious living quarters. Situated in the stunning town of Wasaga Beach, the center provides a serene and tranquil environment for recovery. At Metamorphosis, the focus is to understand the emotions driving the addiction, providing clients with long-term strategies for a successful addiction-free life."),
      ],
      serviceCaption: services.length + ' services · all included in program fees',
      stepsTitle: 'Your program, week by week',
      stepsSub: 'Five elements woven through every stay',
      avatarNode: R('span', { style: { width: '46px', height: '46px', borderRadius: '50%', background: stripe('#dfeaf3', '#eaf2f8', 6), flexShrink: '0' } }),
      locHeading: centreName + ' in Wasaga Beach, ' + centreProvince,
      locIntro: 'Set on Wasaga Beach along Nottawasaga Bay, the centre is a short walk from the water and about two hours north of Toronto. Airport transfers can be arranged for clients travelling from the GTA and beyond.',
      locCells: [{ k: 'Address', v: centreAddress }, { k: 'Phone', v: '705-996-6522', href: 'tel:+17059966522' }, { k: 'From Toronto', v: '≈ 2 hrs by car' }, { k: 'Admissions', v: '7 days a week' }],
      locMapNode: R('div', { style: { position: 'relative', aspectRatio: '4/3', borderRadius: '24px', overflow: 'hidden', background: stripe('#dfeaf3', '#eaf2f8', 14), display: 'grid', placeItems: 'center', border: '1px solid #e3ecf4' } },
        R('span', { style: { font: '500 12px ui-monospace,Menlo,monospace', color: '#516378', background: 'rgba(255,255,255,.85)', padding: '6px 10px', borderRadius: '6px' } }, 'map · Google Maps embed · Wasaga Beach, ON'),
        R('a', { className: 'scp2', href: '#', style: { position: 'absolute', right: '16px', bottom: '16px', font: '600 14px Jost,sans-serif', color: '#10233a', background: '#fff', border: '1px solid #dbe6f0', padding: '10px 16px', borderRadius: '10px' } }, 'Get directions')),
      locSocial: null,
      directionsHref: '#',
      priceCaption: 'Our services are HST exempt. Prices in CAD, confirmed with the centre Nov 2025.',
      priceCta: 'Confirm pricing with the centre',
      priceCtaHref: 'tel:+17059966522',
      faqIntro: "Answers confirmed with the centre. Still unsure? Call — it's free and confidential.",
      othersHeading: 'Other Rehab Centres in ' + centreProvince,
    };
    let liveBase = {};
    if (D) {
      const imgOf = (x, i, extra) => R('img', { src: x.src, alt: x.alt || '', width: x.width || undefined, height: x.height || undefined, loading: i === 0 ? 'eager' : 'lazy', fetchPriority: i === 0 ? 'high' : undefined, style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block', ...(extra || {}) } });
      // ---- hero gallery: the centre's real photos in the design's 2fr/1fr/1fr grid (fewer than 5 photos: the same grid with fewer tiles)
      // The hero grid and its "Show all photos" button open the lightbox (src/components/GalleryGrid.tsx).
      const unclaimedBadge = R('span', { key: 'badge', style: { position: 'absolute', left: '16px', top: '16px', display: 'flex', gap: '6px', pointerEvents: 'none' } },
        R('span', { style: { background: '#fff', color: '#6b7f95', font: '600 11px Jost,sans-serif', letterSpacing: '.04em', padding: '6px 10px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '5px' } },
          R('span', { style: { width: '6px', height: '6px', borderRadius: '50%', background: '#b7c7d8' } }), 'UNCLAIMED LISTING'));
      const galleryNode = M.images.length ? R(GalleryGrid, { images: M.images, photoIcon: ic.dual }, unclaimedBadge) : null;
      // ---- body: intro, overview, the rest of the article
      const article = buildBody(R, M.rest, { columns: true }).nodes;
      // ---- video: the centre's own embed when it has one
      let videoNode = null;
      if (M.video) {
        const src = M.video.provider === 'vimeo' ? 'https://player.vimeo.com/video/' + M.video.id : 'https://www.youtube-nocookie.com/embed/' + M.video.id;
        videoNode = R('div', { style: { position: 'relative', aspectRatio: '16/9', borderRadius: '20px', overflow: 'hidden', background: '#10233a', marginTop: '6px' } },
          R('iframe', { src, title: 'Video: ' + D.name, loading: 'lazy', allow: 'accelerometer; encrypted-media; picture-in-picture', allowFullScreen: true, referrerPolicy: 'strict-origin-when-cross-origin', style: { position: 'absolute', inset: '0', width: '100%', height: '100%', border: 0 } }));
      }
      const toIcon = (g) => ({ ...g, items: g.items.map((it) => ({ ...it, icon: ic[it.icon] || ic.check })) });
      // ---- map of the real address
      const q = encodeURIComponent(M.location.mapQuery);
      const mapNode = R('div', { style: { position: 'relative', aspectRatio: '4/3', borderRadius: '24px', overflow: 'hidden', background: '#eaf2f8', border: '1px solid #e3ecf4' } },
        R('iframe', { src: 'https://www.google.com/maps?q=' + q + '&output=embed', title: 'Map: ' + M.location.mapQuery, loading: 'lazy', referrerPolicy: 'no-referrer-when-downgrade', style: { position: 'absolute', inset: '0', width: '100%', height: '100%', border: 0, display: 'block' } }),
        R('a', { className: 'scp2', href: M.location.directionsHref, target: '_blank', rel: 'noopener noreferrer', style: { position: 'absolute', right: '16px', bottom: '16px', font: '600 14px Jost,sans-serif', color: '#10233a', background: '#fff', border: '1px solid #dbe6f0', padding: '10px 16px', borderRadius: '10px' } }, 'Get directions'));
      const soc = { facebook: 'Facebook', twitter: 'Twitter', instagram: 'Instagram', youtube: 'YouTube', pinterest: 'Pinterest', linkedin: 'LinkedIn' };
      const socials = Object.entries(D.social || {}).filter(([, u]) => u);
      const attrOf = (h) => (D.linkAttrs && D.linkAttrs[(() => { try { const u = new URL(h); return u.host.replace(/^www\./, '').toLowerCase() + u.pathname.replace(/\/$/, '') + u.search; } catch { return h; } })()]) || {};
      const locSocial = socials.length
        ? R('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
            R('span', { style: { font: '600 11.5px Figtree,sans-serif', letterSpacing: '.12em', textTransform: 'uppercase', color: '#6b7f95' } }, 'Follow'),
            R('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } }, ...socials.map(([k, u]) => R('a', { key: k, className: 'scps', href: u, target: attrOf(u).target || undefined, rel: attrOf(u).rel || undefined, style: { font: '500 13.5px Figtree,sans-serif', color: '#1f3550', background: '#fff', border: '1px solid #e3ecf4', padding: '7px 12px', borderRadius: '999px' } }, soc[k] || k))))
        : null;
      // ---- FAQ
      const faqsLive = M.faqs.map((f, i) => ({
        question: f.question,
        answer: f.answerBlocks ? R('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } }, ...buildBody(R, f.answerBlocks, { columns: true }).nodes) : f.answer,
        open: i === faq,
        toggle: () => this.setState({ faq: faq === i ? -1 : i }),
        border: i === faq ? '#0890E8' : '#e3ecf4',
        rot: i === faq ? 'rotate(45deg)' : 'rotate(0deg)',
      }));
      // ---- other centres: real centres of the same province (same city first), real photo, real link
      const othersLive = M.others.map((x) => ({ ...x, photo: '', catHref: x.catHref || undefined }));
      const pagesLive = Math.max(1, Math.ceil(othersLive.length / this.perView));
      const { slide: sl } = this.state;
      // ---- pricing / team / reviews: the design's sample values behind SHOW_SAMPLE_DATA; neutral text without them
      const noSample = !showSample;
      const ownerPrice = M.pricing
        ? { priceTabs: [{ label: 'Pricing', select: () => {}, bg: '#0890E8', color: '#fff' }], priceCols: '1.4fr 1fr', priceHead: ['Program', 'Cost'], priceCells: M.pricing.rows.flatMap((r) => [{ v: r.label, font: '600 14.5px Jost,sans-serif', color: '#10233a' }, { v: r.price + (r.note ? ' · ' + r.note : ''), font: '500 14.5px Figtree,sans-serif', color: '#3b4d63' }]), priceNote: 'Pricing entered by the centre.' + (M.pricing.updated ? ' Updated ' + M.pricing.updated + '.' : '') + ' Confirm current fees with ' + D.name + '.' }
        : null;
      const priceLive0 = noSample
        ? { priceTabs: [{ label: 'Pricing', select: () => {}, bg: '#0890E8', color: '#fff' }], priceCols: '1fr 1fr', priceHead: ['Item', 'As listed'], priceCells: [{ v: 'Cost', font: '600 14.5px Jost,sans-serif', color: '#10233a' }, { v: M.fromPrice || '', font: '500 14.5px Figtree,sans-serif', color: '#3b4d63' }, ...((M.glance.find((g) => g.k === 'Program length') || {}).v ? [{ v: 'Program length', font: '600 14.5px Jost,sans-serif', color: '#10233a' }, { v: M.glance.find((g) => g.k === 'Program length').v, font: '500 14.5px Figtree,sans-serif', color: '#3b4d63' }] : [])], priceNote: 'Shown as listed for this centre; fees can change, so confirm current pricing with ' + D.name + '.' }
        : { priceNote: active.note + ' Fees depend on the program and length of stay; confirm current fees with ' + D.name + '.' };
      const priceLive = ownerPrice && noSample ? ownerPrice : priceLive0;
      liveBase = {
        sectionTabs: sectionTabs.filter((t) => (t.label !== 'Reviews' || !!M.reviews) && (t.label !== 'Programs & Pricing' || showSample || !!M.fromPrice)),
        centres: othersLive,
        slideDots: Array.from({ length: pagesLive }, (_, i) => ({ go: () => this.slideTo(i, othersLive.length), w: i === sl ? '28px' : '8px', bg: i === sl ? '#0890E8' : '#dbe6f0' })),
        slidePos: sl + 1 + ' / ' + pagesLive,
        slidePrev: () => this.slideTo(sl - 1, othersLive.length),
        slideNext: () => this.slideTo(sl + 1, othersLive.length),
        centreFaqs: faqsLive,
        glance: M.glance,
        serviceGroups: M.serviceGroups.map(toIcon),
        serviceCount: M.serviceCount,
        pillars: [], // the design's three generic paragraphs (setting / aftercare / people) are filler, not centre data
        programSteps: [
          { n: '01', icon: ic.phone, label: 'Reach out', body: 'Call the centre or our free helpline, or request a callback.' },
          { n: '02', icon: ic.person, label: 'Talk it through', body: 'A short, confidential conversation about your situation and goals.' },
          { n: '03', icon: ic.check, label: 'Check fit and funding', body: 'Confirm availability, program options and how treatment may be paid for.' },
          { n: '04', icon: ic.pin, label: 'Plan your admission', body: 'Agree a start date and what to bring.' },
          { n: '05', icon: ic.heart, label: 'Begin treatment', body: 'Start the program with support from the care team.' },
        ],
        facility: M.facility.map((f) => ({ ...f, icon: ic[f.icon] || ic.check })),
        verifyNote: 'This listing has not been claimed. Details come from public sources and the centre’s website and may be out of date. If you represent ' + D.name + ', claim the listing to verify and update it.',
        ...priceLive,
      };
      live = {
        claimed: false,
        showSample,
        cityCrumb: M.cityCrumb,
        galleryNode,
        logoNode: M.logo ? R('img', { src: M.logo.src, alt: '', width: 72, height: 72, loading: 'eager', style: { width: '72px', height: '72px', borderRadius: '18px', border: '1px solid #e3ecf4', objectFit: 'cover', flexShrink: '0', display: 'block' } }) : null,
        fromOn: showSample || !!M.fromPrice,
        fromSub: M.fromPrice ? '' : '/ 4 weeks · HST exempt',
        callLabel: D.phoneText ? 'Call centre · ' + D.phoneText : 'Call our helpline · 1-855-885-4747',
        aboutH2: 'About ' + D.name,
        introNodes: paras(M.intro),
        videoNode,
        overviewNodes: paras(M.overviewFirst),
        afterNodes: article,
        serviceCaption: M.serviceCount + ' services & programs listed',
        stepsTitle: 'What to expect when you contact ' + D.name,
        stepsSub: 'Five steps from first call to admission',
        avatarNode: R('span', { style: { width: '46px', height: '46px', borderRadius: '50%', background: '#eaf5fd', color: '#0890E8', display: 'grid', placeItems: 'center', flexShrink: '0' } }, ic.shield),
        locHeading: M.location.heading,
        locIntro: M.location.intro,
        locCells: M.location.cells,
        locMapNode: mapNode,
        locSocial,
        directionsHref: M.location.directionsHref,
        priceOn: showSample || !!M.fromPrice,
        priceCaption: showSample ? 'Example prices in CAD from the design. Confirm current fees directly with ' + D.name + '.' : M.pricing ? 'Pricing entered by ' + D.name + '.' : 'The cost listed for ' + D.name + '.',
        priceCta: 'Confirm pricing with the centre',
        priceCtaHref: D.phoneHref || 'tel:+18558854747',
        faqIntro: D.faqs && D.faqs.length ? "Answers come from the centre's own listing. Still unsure? Call — it's free and confidential." : "Common questions answered. Still unsure? Call — it's free and confidential.",
        othersHeading: M.othersHeading,
      };
    }
    // ---- design profile (content/centre-profiles/<slug>.json): every design section from curated centre data
    const PF = M && M.profile ? M.profile : null;
    let pf = { pfOn: false };
    if (PF) {
      const pT = (t, i) => R('p', { key: i, style: P17 }, t);
      const telOf = (t) => { const d = String(t || '').replace(/\D/g, ''); return d ? 'tel:+' + (d.length === 10 ? '1' + d : d) : ''; };
      const tel = telOf(PF.phone) || D.phoneHref || 'tel:+18558854747';
      const priceTabsPF = PF.pricing ? PF.pricing.tabs : [];
      const ptI = Math.min(this.state.priceTab, Math.max(0, priceTabsPF.length - 1));
      const actPF = priceTabsPF[ptI] || null;
      const vid = PF.video;
      const videoPF = vid
        ? R('div', { style: { position: 'relative', aspectRatio: '16/9', borderRadius: '20px', overflow: 'hidden', background: '#10233a', marginTop: '6px' } },
            R('iframe', { src: vid.provider === 'vimeo' ? 'https://player.vimeo.com/video/' + vid.id + '?dnt=1' : 'https://www.youtube-nocookie.com/embed/' + vid.id, title: 'Video: ' + D.name + ' centre tour', loading: 'lazy', allow: 'autoplay; fullscreen; picture-in-picture; encrypted-media', allowFullScreen: true, referrerPolicy: 'strict-origin-when-cross-origin', style: { position: 'absolute', inset: '0', width: '100%', height: '100%', border: 0 } }))
        : live.videoNode;
      const mapQ = encodeURIComponent(PF.address || D.address || D.name);
      const dirHref = 'https://www.google.com/maps/dir/?api=1&destination=' + mapQ;
      const mapPF = R('div', { style: { position: 'relative', aspectRatio: '4/3', borderRadius: '24px', overflow: 'hidden', background: '#eaf2f8', border: '1px solid #e3ecf4' } },
        R('iframe', { src: 'https://www.google.com/maps?q=' + mapQ + '&output=embed', title: 'Map: ' + (PF.address || D.name), loading: 'lazy', referrerPolicy: 'no-referrer-when-downgrade', style: { position: 'absolute', inset: '0', width: '100%', height: '100%', border: 0, display: 'block' } }),
        R('a', { className: 'scp2', href: dirHref, target: '_blank', rel: 'noopener noreferrer', style: { position: 'absolute', right: '16px', bottom: '16px', font: '600 14px Jost,sans-serif', color: '#10233a', background: '#fff', border: '1px solid #dbe6f0', padding: '10px 16px', borderRadius: '10px' } }, 'Get directions'));
      const initials = (n) => n.replace(/^(Dr\.?\s+)/i, '').split(/\s+/).filter(Boolean).map((w) => w[0]).slice(0, 2).join('').toUpperCase();
      const details = PF.details;
      const detailsNode = details
        ? R('div', { style: { background: '#fff', border: '1px solid #e3ecf4', borderRadius: '22px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' } },
            R('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' } },
              R('h3', { style: { fontSize: '20px' } }, details.title),
              details.caption ? R('span', { style: { fontSize: '13px', color: '#6b7f95' } }, details.caption) : null),
            ...details.groups.map((g, gi) => R('div', { key: gi, style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
              R('span', { style: { font: '600 11.5px Figtree,sans-serif', letterSpacing: '.12em', textTransform: 'uppercase', color: g.color } }, g.title),
              R('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '8px' } },
                ...g.items.map((it, ii) => R('span', { key: ii, style: { font: '500 13.5px Figtree,sans-serif', color: '#1f3550', background: '#f7fafd', border: '1px solid #e3ecf4', padding: '7px 12px', borderRadius: '999px' } }, it))))))
        : null;
      const g = PF.google;
      const cnt = M.reviews ? M.reviews.count : g ? g.count : null;
      const rat = M.reviews ? M.reviews.rating : g ? g.rating : null;
      const pill = { display: 'inline-flex', alignItems: 'center', gap: '5px', height: '28px', borderRadius: '999px', font: '600 12.5px Figtree,sans-serif', letterSpacing: '.01em', whiteSpace: 'nowrap' };
      const badgeVerified = R('span', { key: 'v', style: { ...pill, padding: '0 11px 0 7px', background: 'rgba(255,255,255,.96)', color: '#10233a', boxShadow: '0 6px 16px -8px rgba(0,0,0,.45)' } },
        R('svg', { width: 16, height: 16, viewBox: '0 0 24 24', style: { flexShrink: 0 }, 'aria-hidden': true },
          R('path', { d: 'M12 1.8l2.4 1.8 3-.2.9 2.9 2.5 1.7-.9 2.9.9 2.9-2.5 1.7-.9 2.9-3-.2L12 20.2l-2.4-1.8-3 .2-.9-2.9-2.5-1.7.9-2.9-.9-2.9 2.5-1.7.9-2.9 3 .2z', style: { fill: '#0890E8' } }),
          R('path', { d: 'M8.2 11.3l2.6 2.6 5-5', style: { fill: 'none', stroke: '#fff', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round' } })), 'Verified');
      const badgeTop = R('span', { key: 't', style: { ...pill, gap: '6px', padding: '0 12px 0 9px', background: 'linear-gradient(135deg,#f7c04a,#e0922a)', color: '#fff', textShadow: '0 1px 1px rgba(120,60,0,.35)', boxShadow: '0 6px 16px -8px rgba(160,90,10,.7),inset 0 1px 0 rgba(255,255,255,.35)' } },
        R('svg', { width: 15, height: 15, viewBox: '0 0 24 24', style: { flexShrink: 0 }, 'aria-hidden': true },
          R('path', { d: 'M7 3h10v5a5 5 0 0 1-10 0z', style: { fill: '#fff' } }),
          R('path', { d: 'M7 5H4.5a2.5 2.5 0 0 0 2.6 3.5M17 5h2.5a2.5 2.5 0 0 1-2.6 3.5M12 13v4M8.5 21h7M9.5 17h5v4h-5z', style: { fill: 'none', stroke: '#fff', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' } })), 'Top rated');
      const topRatedPF = !!((M.reviews ? M.reviews.rating : g ? g.rating : 0) >= 4.7 && (M.reviews ? M.reviews.count : g ? g.count : 0) >= 50);
      const badgesPF = PF.verified ? R('span', { key: 'badge', style: { position: 'absolute', left: '16px', top: '16px', display: 'flex', gap: '6px', pointerEvents: 'none' } }, badgeVerified, topRatedPF ? badgeTop : null) : null;
      pf = {
        pfOn: true,
        galleryNode: M.images.length ? R(GalleryGrid, { images: M.images, photoIcon: ic.dual }, badgesPF) : live.galleryNode,
        claimed: !!PF.verified,
        unclaimed: !PF.verified,
        verifiedLabel: PF.verifiedLabel || 'Details verified with the centre',
        centreUpdated: PF.updated || 'Nov 2025',
        centreAddress: PF.addressShort || PF.address || D.address,
        catLine: PF.catLine || live.catLine,
        phoneHref: tel,
        callLabel: 'Call centre · ' + (PF.phone || D.phoneText),
        fromOn: !!PF.fromPrice,
        fromPrice: PF.fromPrice,
        fromSub: PF.fromSub || '',
        privateNote: PF.privateNote || '',
        glance: PF.glance || M.glance,
        facility: (PF.facility || []).map((f) => ({ ...f, icon: ic[f.icon] || ic.check })),
        aboutH2: PF.aboutH2 || live.aboutH2,
        introNodes: (PF.intro || []).map(pT),
        pillars: (PF.pillars || []).map((p, i) => ({ ...p, photo: p.photoImg ? '' : 'photo', photoImg: p.photoImg || null, cols: 'minmax(160px,.8fr) minmax(0,1.4fr)', dir: i % 2 ? 'rtl' : 'ltr' })),
        videoNode: videoPF,
        overviewH2: PF.overviewH2 || '',
        overviewNodes: (PF.overview || []).map(pT),
        serviceGroups: (PF.services || []).map((sg) => ({ title: sg.title, color: sg.color, items: sg.items.map(([label, icon]) => ({ label, icon: ic[icon] || ic.check })) })),
        serviceCount: (PF.services || []).reduce((n, sg) => n + sg.items.length, 0),
        serviceCaption: PF.serviceCaption || '',
        afterNodes: (PF.afterOverview || []).map(pT),
        detailsNode,
        stepsOn: !!PF.steps,
        stepsTitle: PF.steps ? PF.steps.title : '',
        stepsSub: PF.steps ? PF.steps.sub : '',
        programSteps: PF.steps ? PF.steps.items.map((st, i) => ({ n: String(i + 1).padStart(2, '0'), icon: ic[st.icon] || ic.check, label: st.label, body: st.body })) : [],
        reviewerOn: !!PF.reviewer,
        reviewerName: PF.reviewer ? PF.reviewer.name : '',
        reviewerOrg: PF.reviewer && PF.reviewer.org ? PF.reviewer.org : 'Addiction Rehab Centres Canada',
        avatarNode: R('span', { style: { width: '46px', height: '46px', borderRadius: '50%', background: '#eaf5fd', color: '#0890E8', display: 'grid', placeItems: 'center', flexShrink: '0' } }, ic.shield),
        verifyNote: PF.verifyNote || live.verifyNote,
        priceOn: !!actPF,
        priceCaption: PF.pricing && PF.pricing.caption ? PF.pricing.caption : '',
        priceCtaHref: tel,
        priceTabs: priceTabsPF.map((p, i) => ({ label: p.label, select: () => this.setState({ priceTab: i }), bg: i === ptI ? '#0890E8' : 'transparent', color: i === ptI ? '#fff' : '#3b4d63' })),
        priceCols: actPF ? actPF.cols : '1fr',
        priceHead: actPF ? actPF.head : [],
        priceCells: actPF ? actPF.rows.flatMap((r) => r.map((v2, j) => ({ v: v2, font: j === 0 ? '600 14.5px Jost,sans-serif' : '500 14.5px Figtree,sans-serif', color: j === 0 ? '#10233a' : '#3b4d63' }))) : [],
        priceNote: actPF ? actPF.note || '' : '',
        team: PF.team || null,
        teamCards: PF.team ? PF.team.members.map((t) => ({ ...t, initials: initials(t.name) })) : [],
        reviewsOn: !!(cnt || (M.reviews && M.reviews.reviews.length)),
        reviewCount: cnt,
        reviewRating: rat ? Number(rat).toFixed(1) : '',
        reviewStars: rat ? '★★★★★'.slice(0, Math.round(rat)) : '',
        reviewHref: M.reviews && M.reviews.mapsUri ? M.reviews.mapsUri : g && g.mapsUrl ? g.mapsUrl : '',
        reviewWrite: M.reviews && M.reviews.writeReviewUri ? M.reviews.writeReviewUri : g && g.writeUrl ? g.writeUrl : '',
        reviewAsOf: !M.reviews && g && g.asOf ? g.asOf : '',
        topRated: !!(rat && cnt && rat >= 4.7 && cnt >= 50),
        locHeading: PF.location ? PF.location.heading : live.locHeading,
        locIntro: PF.location ? PF.location.intro : live.locIntro,
        locCells: PF.location ? PF.location.cells : live.locCells,
        serving: PF.location ? PF.location.serving.map(([label, href]) => ({ label, href })) : serving,
        locMapNode: mapPF,
        directionsHref: dirHref,
        centreFaqs: (PF.faqs || []).map((f, i) => ({ question: f.q, answer: f.a, open: i === faq, toggle: () => this.setState({ faq: faq === i ? -1 : i }), border: i === faq ? '#0890E8' : '#e3ecf4', rot: i === faq ? 'rotate(45deg)' : 'rotate(0deg)' })),
        faqIntro: PF.faqIntro || live.faqIntro,
        othersSub: PF.othersSub || '',
        othersLink: PF.othersLink || null,
        sectionTabs: [['About', '#about'], ['Overview', '#overview'], ['Programs & Pricing', '#pricing'], ['Team', '#team'], ['Reviews', '#reviews'], ['Location', '#location'], ['FAQ', '#faq']]
          .filter(([l]) => (l !== 'Programs & Pricing' || !!actPF) && (l !== 'Team' || !!PF.team) && (l !== 'Reviews' || !!cnt))
          .map(([label, href]) => ({ label, href })),
      };
    }
    let galleryNode = null,
      bodyNodes = [],
      specAside = null,
      contactExtra = null,
      locNode = null,
      liveTabs = [],
      liveFaqs = [];
    const base = {
      sample,
      centreName: D ? D.name : centreName,
      centreAddress: D ? D.address : centreAddress,
      catHref: D ? (M.provinceCrumb ? M.provinceCrumb.href : '') : '/ontario-rehabs/',
      catOn: !D || !!M.provinceCrumb,
      catLabel: D ? (M.provinceCrumb ? M.provinceCrumb.label : '') : centreProvince + ' Rehabs',
      catLine: D ? M.catLine : centreProvince + ' Rehabs · Residential',
      catLineOn: !D || !!M.catLine,
      addrOn: !D || !!D.address,
      phoneHref: D ? D.phoneHref || 'tel:+18558854747' : 'tel:+17059966522',
      phoneText: D ? D.phoneText : '',
      phoneOn: true,
      siteHref: D ? D.website : '#',
      siteRel: D ? ((D.linkAttrs && D.linkAttrs[(() => { try { const u = new URL(D.website); return u.host.replace(/^www\./, '').toLowerCase() + u.pathname.replace(/\/$/, '') + u.search; } catch { return D.website; } })()]) || {}).rel || undefined : undefined,
      siteTarget: D ? ((D.linkAttrs && D.linkAttrs[(() => { try { const u = new URL(D.website); return u.host.replace(/^www\./, '').toLowerCase() + u.pathname.replace(/\/$/, '') + u.search; } catch { return D.website; } })()]) || {}).target || undefined : undefined,
      siteOn: !D || !!D.website,
      asideOn: true,
      tabsOn: true,
      locNode,
      aboutOn: true,
      galleryNode,
      bodyNodes,
      specAside,
      unclaimed: D ? true : !claimed,
      centreProvince: D ? M.provinceName : centreProvince,
      photoCount: D ? M.photoCount : 21,
      reviewCount: D ? (M.reviews ? M.reviews.count : null) : null,
      reviewRating: D && M.reviews ? M.reviews.rating.toFixed(1) : '',
      reviewsOn: D ? !!M.reviews : true,
      priceOn: true,
      claimHref: D ? '/claim-listing/?centre=' + encodeURIComponent(D.slug || '') : '/claim-listing/',
      reviewItems: D && M.reviews ? M.reviews.reviews : [],
      reviewWrite: D && M.reviews ? M.reviews.writeReviewUri : '',
      reviewHref: D ? (M.reviews && M.reviews.mapsUri ? M.reviews.mapsUri : '') : 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(this.props.centreName ?? 'Metamorphosis Centre for Change Wasaga Beach'),
      centreUpdated: 'Nov 2025',
      centreUpdatedLong: 'November 27, 2025',
      fromPrice: D ? M.fromPrice || '$19,900' : '$19,900',
      claimed,
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
      serving,
      centreFaqs,
      faqOn: true,
      faqHeading: D ? D.faqHeading || '' : '',
      glanceOn: true,
      contactExtra,
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
      cbSent: this.state.cbSent,
      cbSending: this.state.cbSending,
      cbError: this.state.cbError,
      cbFields: this.state.cbFields,
      // The callback request is saved on the server; the success message only appears after it was saved.
      onCallback: async (e) => {
        e.preventDefault();
        if (!ack) return;
        const fd = new FormData(e.currentTarget);
        this.setState({ cbSending: true, cbError: '', cbFields: null });
        const r = await postJson('/api/forms/callback', {
          centreSlug: window.location.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '__'),  who: this.state.who, payment: this.state.funding,
          setting: fd.get('setting') || '', when: fd.get('when') || '', province: fd.get('province') && fd.get('province') !== 'Select a province' ? fd.get('province') : '', substance: fd.get('substance') && fd.get('substance') !== '*' ? fd.get('substance') : '',
          name: fd.get('name') || '', phone: fd.get('phone') || '', email: fd.get('email') || '', ack: true, company_website: fd.get('company_website') || '',
        });
        if (!r.ok) this.setState({ cbSending: false, cbError: r.error || 'Your request was not sent.', cbFields: r.fields || null });
        else this.setState({ cbSending: false, cbSent: true });
      },

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
      reviewerName: this.props.reviewerName ?? 'Editorial team',
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
      tabs,
      activeTab: tabData[tab],
      kinds,
      footerCols,
    };
    return { ...base, ...live, ...liveBase, ...pf };
  }
}

/* ───────────────────────── markup ───────────────────────── */
function template(v) {
  const {
    sample,
    iconPerson,
    showSample,
    cityCrumb,
    logoNode,
    fromOn,
    fromSub,
    callLabel,
    aboutH2,
    introNodes,
    videoNode,
    overviewNodes,
    afterNodes,
    serviceCaption,
    stepsTitle,
    stepsSub,
    avatarNode,
    locHeading,
    locIntro,
    locCells,
    locMapNode,
    locSocial,
    directionsHref,
    priceCaption,
    priceCta,
    priceCtaHref,
    faqIntro,
    othersHeading,
    tabsOn,
    locNode,
    glanceOn,
    contactExtra,
    faqOn,
    faqHeading,
    catHref,
    catLabel,
    catOn,
    catLine,
    catLineOn,
    addrOn,
    phoneHref,
    phoneText,
    phoneOn,
    siteHref,
    siteRel,
    siteTarget,
    siteOn,
    asideOn,
    aboutOn,
    galleryNode,
    bodyNodes,
    specAside,
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
    reviewerName,
    sectionTabs,
    serviceCount,
    serviceGroups,
    serving,
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
    cbSent,
    cbSending,
    cbError,
    cbFields,
    onCallback,
    reviewCount,
    reviewHref,
    reviewRating,
    reviewsOn,
    priceOn,
    claimHref,
    reviewItems,
    reviewWrite,
    unclaimed,
    verifyNote,
    whoOptions,
    pfOn, verifiedLabel, privateNote, overviewH2, detailsNode, stepsOn, reviewerOn, reviewerOrg, team, teamCards, reviewStars, reviewAsOf, topRated, othersSub, othersLink,
  } = v;
  return (
    <>
      <div data-design-exact="" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
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
              <$A className="scp0" href="/" style={{ color: '#6b7f95' }}>
                Home
              </$A>
              {catOn ? (
              <>
              <span style={{ opacity: '.5' }}>/</span>
              {catHref ? (
              <$A className="scp0" href={catHref} style={{ color: '#6b7f95' }}>
                {$i(catLabel)}
              </$A>
              ) : (
              <span style={{ color: '#6b7f95' }}>{$i(catLabel)}</span>
              )}
              </>
              ) : null}
              {cityCrumb ? (
              <>
              <span style={{ opacity: '.5' }}>/</span>
              <$A className="scp0" href={cityCrumb.href} style={{ color: '#6b7f95' }}>
                {$i(cityCrumb.label)}
              </$A>
              </>
              ) : null}
              <span style={{ opacity: '.5' }}>/</span>
              <span style={{ color: '#10233a', fontWeight: '500' }}>{$i(centreName)}</span>
            </nav>
            {!sample ? galleryNode : (
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
                    {!pfOn || topRated ? (
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
                    ) : null}
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
            )}
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
                  {!sample ? logoNode : (
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
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {catLineOn ? (
                    <$A
                      href={catHref}
                      style={{ font: '600 12px Figtree,sans-serif', letterSpacing: '.1em', textTransform: 'uppercase' }}
                    >
                      {$i(catLine)}
                    </$A>
                    ) : null}
                    <h1 style={{ fontSize: '40px', lineHeight: '1.08' }} data-rc-lg="1">
                      {$i(centreName)}
                    </h1>
                    {addrOn ? (
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
                    ) : null}
                  </div>
                </div>
                <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  {pfOn && reviewCount ? (
                  <>
                  <$A
                    href="#reviews"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #e3ecf4', borderRadius: '12px', padding: '8px 12px' }}
                  >
                    <span style={{ font: '700 13px Figtree,sans-serif', background: 'conic-gradient(#4285F4 0 25%,#34A853 25% 50%,#FBBC05 50% 75%,#EA4335 75%)', color: 'transparent', WebkitBackgroundClip: 'text', backgroundClip: 'text' }}>G</span>
                    <span style={{ color: '#F5A623', fontSize: '14px', letterSpacing: '1px' }} aria-hidden="true">{reviewStars}</span>
                    <span style={{ font: '600 15px Jost,sans-serif', color: '#10233a' }}>{$i(reviewRating)}</span>
                    <span style={{ fontSize: '13px', color: '#6b7f95' }}>({$i(reviewCount)} Google reviews)</span>
                  </$A>
                  </>
                  ) : null}
                  {!pfOn && reviewCount ? (
                  <>
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
                    <span style={{ font: '600 14px Jost,sans-serif', color: '#10233a' }}>{$i(reviewRating ? '★ ' + reviewRating + ' · ' + reviewCount : reviewCount)}</span>
                    <span style={{ fontSize: '12.5px', color: '#6b7f95' }}>Google reviews</span>
                  </span>
                  <span style={{ fontSize: '14px', color: '#516378' }}>·</span>
                  </>
                  ) : null}
                  {claimed ? (
                    <>
                      <span style={{ fontSize: '14px', color: '#516378' }}>
                        {verifiedLabel || 'Details verified with the centre'} · Updated {$i(centreUpdated)}
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
                </>
                {glanceOn ? (
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
                        {g?.k ? (
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
                        ) : null}
                        <span style={{ font: '600 15px Jost,sans-serif', color: '#10233a', lineHeight: '1.3' }}>
                          {$i(g?.v)}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                ) : null}

              </div>
              {asideOn ? (
              <aside
                style={{
                  position: 'sticky',
                  top: 'calc(var(--hdr,115px) + 24px)',
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
                {fromOn ? (
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
                    <span style={{ font: '400 13px Figtree,sans-serif', color: '#6b7f95' }}>{fromSub}</span>
                  </span>
                </div>
                ) : null}
                {phoneOn ? (
                <$A
                  className="scp1"
                  href={phoneHref}
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
                  {callLabel}
                </$A>
                ) : null}
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
                  {siteOn ? (
                  <$A
                    className="scps"
                    href={siteHref}
                    rel={siteRel}
                    target={siteTarget}
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
                  ) : null}
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
                      gridColumn: siteOn ? undefined : '1 / -1',
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
                  {showSample || privateNote ? (
                  <span style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0890E8' }} />
                    {privateNote || 'Private, fee-based residential centre'}
                  </span>
                  ) : null}
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
                        Claim this free listing to update details, add photos and pricing, and see enquiries from this page.
                      </p>
                      <$A
                        className="scpa"
                        href={claimHref}
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
              ) : null}
            </div>
            {tabsOn ? (
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
            ) : null}
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
              <>
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
                {$i(aboutH2)}
              </h2>
              {introNodes}
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
                        {p?.photoImg ? (
                          <img
                            src={p.photoImg.src}
                            alt={p.photoImg.alt}
                            width={p.photoImg.width || undefined}
                            height={p.photoImg.height || undefined}
                            loading="lazy"
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        ) : (
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
                        )}
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
              {videoNode}
              <h2 id="overview" style={{ fontSize: '30px', lineHeight: '1.15', marginTop: '16px' }}>
                {overviewH2 ? $i(overviewH2) : <>{$i(centreName)} — Center Overview</>}
              </h2>
              {overviewNodes}
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
                    {$i(serviceCaption)}
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
              {afterNodes}
              {sample || stepsOn ? (
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
                  <h3 style={{ fontSize: '20px', color: '#fff' }}>{$i(stepsTitle)}</h3>
                  <span style={{ fontSize: '13px', color: '#b7c7d8' }}>{$i(stepsSub)}</span>
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
              ) : null}
              {detailsNode}
              </>
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
                      <div style={{ minWidth: '0' }}>
                        <div style={{ font: '600 14px Jost,sans-serif' }}>{$i(fac?.k)}</div>
                        <div style={{ fontSize: '13px', color: '#6b7f95', lineHeight: '1.45', overflowWrap: 'anywhere' }}>{$i(fac?.v)}</div>
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
                {sample || reviewerOn ? (
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  {avatarNode}
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
                    <div style={{ fontSize: '12.5px', color: '#6b7f95' }}>{reviewerOrg || 'Addiction Rehab Centres Canada'}</div>
                  </div>
                </div>
                ) : null}
                <p style={{ fontSize: '13px', lineHeight: '1.55', color: '#516378' }}>{$i(verifyNote)}</p>
              </div>
            </aside>
          </div>
        </section>
        <>
        {priceOn ? (
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
                  {$i(priceCaption)}
                </p>
              </div>
              <$A
                className="scp7"
                href={priceCtaHref}
                style={{
                  font: '600 15px Jost,sans-serif',
                  color: '#0890E8',
                  border: '1.5px solid #0890E8',
                  padding: '11px 18px',
                  borderRadius: '10px',
                }}
              >
                {priceCta}
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
                  data-rc-table="1"
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
        ) : null}
        {team && teamCards && teamCards.length ? (
        <section id="team" data-screen-label="Team" style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px' }} data-rc-wrap="1">
            <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap', marginBottom: '24px' }}>
              <div>
                <span style={{ font: '600 12px Figtree,sans-serif', letterSpacing: '.14em', textTransform: 'uppercase', color: '#0890E8' }}>{team.kicker || 'Who will care for you'}</span>
                <h2 style={{ fontSize: '34px', marginTop: '8px' }} data-rc-lg="1">{team.title}</h2>
                {team.sub ? <p style={{ fontSize: '15px', color: '#6b7f95', marginTop: '8px', maxWidth: '540px', lineHeight: '1.5' }}>{team.sub}</p> : null}
              </div>
              {team.moreHref ? (
                <$A className="scp7" href={team.moreHref} target="_blank" rel="noopener noreferrer nofollow" style={{ font: '600 15px Jost,sans-serif', color: '#0890E8', border: '1.5px solid #0890E8', padding: '11px 18px', borderRadius: '10px' }}>
                  {team.moreLabel || 'See the full team'}
                </$A>
              ) : null}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '16px' }} data-cols="repeat(4,1fr)">
              {teamCards.map((t, $index) => (
                <div key={$index} style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '20px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {t.photo ? (
                    <img src={t.photo} alt={t.name} width={64} height={64} loading="lazy" style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', marginBottom: '14px' }} />
                  ) : (
                    <span aria-hidden="true" style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#eaf5fd', color: '#0890E8', display: 'grid', placeItems: 'center', font: '600 20px Jost,sans-serif', marginBottom: '14px' }}>{t.initials}</span>
                  )}
                  <div style={{ font: '600 16px Jost,sans-serif', color: '#10233a' }}>{t.name}</div>
                  <div style={{ fontSize: '13.5px', color: '#0890E8' }}>{t.role}</div>
                  {t.cred ? <div style={{ fontSize: '13px', color: '#6b7f95' }}>{t.cred}</div> : null}
                </div>
              ))}
            </div>
          </div>
        </section>
        ) : null}
        {reviewsOn ? (
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
              {pfOn && reviewRating ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ font: '600 52px/1 Jost,sans-serif', color: '#10233a' }}>{$i(reviewRating)}</span>
                  <span style={{ color: '#F5A623', fontSize: '20px', letterSpacing: '2px' }} aria-label={reviewRating + ' out of 5 stars'}>{reviewStars}</span>
                </div>
              ) : null}
              {reviewCount ? (
                pfOn ? <p style={{ fontSize: '13.5px', color: '#5d7188' }}>{$i(reviewCount)} Google reviews</p>
                : <p style={{ fontSize: '13.5px', color: '#5d7188' }}>{$i(reviewRating)} ★ · {$i(reviewCount)} Google reviews</p>
              ) : null}
              {reviewWrite ? (
              <$A
                className="scp7"
                href={reviewWrite}
                target="_blank"
                rel="noopener"
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
              ) : null}
              <p style={{ fontSize: '12px', color: '#5d7188', lineHeight: '1.5' }}>{reviewAsOf ? 'Rating and review count from the centre\u2019s Google Business Profile, ' + reviewAsOf + '. Reviews are written by former clients and families on Google.' : 'Powered by Google'}</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {$list(reviewItems).map((r, $index) => (
                <article key={$index} style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '20px', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ font: '600 16px Jost,sans-serif', color: '#10233a' }}>
                      {r.authorUri ? <a href={r.authorUri} target="_blank" rel="noopener noreferrer">{r.author}</a> : r.author}
                    </span>
                    <span style={{ fontSize: '13px', color: '#5d7188' }}>
                      <span style={{ color: '#F5A623' }} aria-label={r.rating + ' out of 5 stars'}>{'★'.repeat(Math.round(r.rating))}</span> {r.when}
                    </span>
                  </div>
                  <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#3b4d63', margin: 0 }}>{r.text}</p>
                </article>
              ))}
              {pfOn && !(reviewItems && reviewItems.length) && reviewWrite ? (
                <article style={{ background: '#fff', border: '1px solid #e3ecf4', borderRadius: '20px', padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span style={{ font: '600 16px Jost,sans-serif', color: '#10233a' }}>Have you or a loved one stayed at {centreName}?</span>
                  <p style={{ fontSize: '15px', lineHeight: '1.65', color: '#3b4d63', margin: 0 }}>
                    A few honest lines about the staff, the program and life after discharge help the next family decide. Reviews go straight to the centre{'\u2019'}s Google profile.
                  </p>
                  <$A href={reviewWrite} target="_blank" rel="noopener" style={{ alignSelf: 'flex-start', font: '600 14.5px Jost,sans-serif', color: '#0890E8' }}>Write a review on Google</$A>
                </article>
              ) : null}
              {reviewHref ? (
              <$A
                href={reviewHref}
                target="_blank"
                rel="noopener"
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
              ) : null}
            </div>
          </div>
        </section>
        ) : null}
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
                {$i(locHeading)}
              </h2>
              <p style={{ fontSize: '16.5px', lineHeight: '1.7', color: '#3b4d63' }}>{$i(locIntro)}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} data-cols="1fr 1fr">
                {$list(locCells).map((cell, $index) => (
                  <Fragment key={$index}>
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #e3ecf4',
                        borderRadius: '14px',
                        padding: '14px 16px',
                        minWidth: '0',
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
                        {$i(cell?.k)}
                      </div>
                      {cell?.href ? (
                        <$A
                          className="scp0"
                          href={cell.href}
                          style={{ display: 'block', font: '600 14.5px Jost,sans-serif', marginTop: '4px', color: '#10233a', overflowWrap: 'anywhere' }}
                        >
                          {$i(cell?.v)}
                        </$A>
                      ) : (
                        <div style={{ font: '600 14.5px Jost,sans-serif', marginTop: '4px', lineHeight: cell?.k === 'Address' ? '1.4' : undefined, overflowWrap: 'anywhere' }}>
                          {$i(cell?.v)}
                        </div>
                      )}
                    </div>
                  </Fragment>
                ))}
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
              {locSocial}
            </div>
            {locMapNode}
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
            {cbSent ? (
              <div role="status" style={{ background: '#e9f8ef', border: '1px solid #bfe6cf', borderRadius: '24px', padding: '28px', color: '#1d6b3f' }}>
                <h3 style={{ fontSize: '22px' }}>Thank you. We received your request.</h3>
                <p style={{ fontSize: '15.5px', marginTop: '8px' }}>We will contact you by phone or email. If this is urgent, call 1-855-885-4747 any time.</p>
              </div>
            ) : (
            <form
              onSubmit={onCallback}
              data-callback-form
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
              <Honeypot />
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
                    name="setting"
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
                    name="when"
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
                    name="province"
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
                    name="substance"
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
                        <option value={$val(s)}>{s}</option>
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
                    name="name"
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
                    name="phone"
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
                    name="email"
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
              <FormError message={cbError} fields={cbFields} />
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
                Confidential · No obligation
              </p>
            </form>
            )}
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
                    a few minutes and gives you full control of how {$i(centreName)} appears on this site.
                  </p>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '4px' }}>
                    <$A
                      className="scpr"
                      href={claimHref}
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
                      href="/promote"
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
        </>
        {faqOn ? (
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
                <>Questions about {$i(centreName)}</>
              </h2>
              <>
              <p style={{ fontSize: '16px', lineHeight: '1.65', color: '#516378' }}>{$i(faqIntro)}</p>
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
              </>
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
        ) : null}
        <>
        <section
          data-screen-label="Sponsored Centres"
          style={{ background: '#f7fafd', borderTop: '1px solid #e9eff5', overflow: 'hidden' }}
        >
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '88px 32px 72px' }} data-rc-wrap="1">
            <div data-rc-headrow="1"
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
                  {$i(othersHeading)}
                </h2>
                <p style={{ fontSize: '15px', color: '#6b7f95', marginTop: '8px', maxWidth: '640px' }}>
                  {othersSub || 'Comparing options is normal. Every centre below is listed independently; call us and we will help you weigh them.'}
                  {othersLink ? <> <$A href={othersLink.href} style={{ color: '#0890E8', fontWeight: 600 }}>{othersLink.label}</$A></> : null}
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
              data-rc-slider="1"
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
                <div key={$index + '-' + (c?.href || '')} style={{ scrollSnapAlign: 'start', display: 'flex', minWidth: 0 }}>
                  <CentreCard
                    name={c?.name}
                    href={c?.href}
                    image={c?.image}
                    location={c?.address}
                    tags={c?.category ? [c.category] : []}
                    excerpt={c?.excerpt}
                    phone={c?.phone}
                    rating={showSample ? { value: c?.rating, count: c?.googleReviews } : null}
                    badges={showSample ? [c?.featured ? 'Featured' : '', c?.verified ? 'Verified' : ''].filter(Boolean) : []}
                  />
                </div>
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
        </>
        <SiteFooter />
      </div>
    </>
  );
}

export const ownCss =
  '\nhtml,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\n@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n';
const ctrCss =
  '.ctr-side{position:sticky;top:calc(var(--hdr,115px) + 24px);align-self:flex-start;max-height:calc(100vh - var(--hdr,115px) - 48px);overflow-y:auto}' +
  '@media(max-width:999px){.ctr-side{position:static;max-height:none;overflow:visible;flex:1 1 100%!important;max-width:none!important}}' +
  '.ctr-cols{column-gap:36px}@media(min-width:768px){.ctr-cols{column-count:2}}@media(min-width:1100px){.ctr-cols3{column-count:3}}' +
  '#about h2 strong,#about h3 strong,#about h4 strong,#about h5 strong,#about h6 strong{font-weight:inherit}';
export const css = [ownCss, ctrCss, SiteHeader_css].filter(Boolean).join('\n');
export const defaults = {
  centreName: 'Metamorphosis Centre for Change',
  claimed: true,
  reviewerName: 'Editorial team',
};
const View = createDC('Centre', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} responsive {...props} />;
}
