'use client';
// Generated from Blog.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';
import SiteHeader, { css as SiteHeader_css } from './SiteHeader';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = { menu: null, cat: 'All', query: '', sort: 'Latest', subscribed: false, vw: 0 };
  componentDidMount() {
    this._onResize = () => this.setState({ vw: document.documentElement.clientWidth || window.innerWidth });
    window.addEventListener('resize', this._onResize);
    this._onResize();
    if (typeof ResizeObserver !== 'undefined') {
      this._ro = new ResizeObserver(this._onResize);
      this._ro.observe(document.documentElement);
    }
    requestAnimationFrame(this._onResize);
    setTimeout(this._onResize, 300);
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize);
    this._ro?.disconnect();
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
    const { menu, cat, query, sort, subscribed } = this.state;
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
      person: this.icon([{ t: 'circle', a: { cx: 12, cy: 8, r: 4 } }, 'M4 21a8 8 0 0 1 16 0']),
      mail: this.icon([{ t: 'rect', a: { x: 3, y: 5, width: 18, height: 14, rx: 2 } }, 'M3 7l9 6 9-6']),
      search: this.icon([{ t: 'circle', a: { cx: 11, cy: 11, r: 6 } }, 'M20 20l-4-4']),
      clock: this.icon([{ t: 'circle', a: { cx: 12, cy: 12, r: 8 } }, 'M12 8v4l3 2'], { width: 14, height: 14 }),
      s: (p) => this.icon(p, { width: 16, height: 16 }),
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
    const L = (arr) =>
      arr.map((s) => {
        const [label, p] = s.split('|');
        return { label, href: B + p + '/' };
      });
    const drugs = L([
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
    ]);
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
        links: L([
          'Alcohol Addiction|addiction-by-alcohol',
          'Am I An Alcoholic?|am-i-an-alcoholic',
          'AA Support Group|aa-support-group',
          'Detox Centres in Canada|detox-centres-in-canada',
        ]),
      },
      intervention: {
        title: 'Intervention',
        sub: 'Help a loved one take the first step',
        icon: ic.hands,
        cols: 'repeat(2,1fr)',
        links: L([
          'Intervention|intervention',
          'Drugs and Alcohol Intervention|drugs-and-alcohol-intervention',
          'Drug Intervention Treatment Centres|drug-intervention-treatment-centres',
        ]),
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

    // Sample posts — swap for CMS data. Dates in ISO for schema; displayed formatted.
    const P = (title, category, excerpt, author, date, read, photo) => ({
      title,
      category,
      excerpt,
      author,
      date,
      read,
      photo,
      initials: author
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2),
    });
    const posts = [
      P(
        'How Long Does Alcohol Detox Take? A Day-by-Day Timeline',
        'Alcohol',
        'What actually happens in the first 72 hours, when withdrawal peaks, and when medical detox is non-negotiable.',
        'Dr. Sarah Mitchell',
        'Aug 28, 2026',
        9,
        '/assets/img/blog-alcohol-detox.jpg',
      ),
      P(
        'How to Stage an Intervention Without Losing Your Loved One',
        'Family & Intervention',
        'A professional interventionist walks through the conversation, the plan and the mistakes families make most.',
        'Mark Delacroix',
        'Aug 21, 2026',
        11,
        '/assets/img/blog-intervention.jpg',
      ),
      P(
        'Inpatient vs. Outpatient Rehab in Canada: Which Is Right for You?',
        'Treatment Guides',
        'Cost, time away from work, success rates and who each model suits — compared side by side.',
        'Dr. Sarah Mitchell',
        'Aug 14, 2026',
        8,
        '/assets/img/blog-inpatient.jpg',
      ),
      P(
        'Fentanyl Withdrawal: Symptoms, Timeline and Safe Tapering',
        'Drugs & Opioids',
        'Why fentanyl withdrawal differs from other opioids and how Canadian clinics manage it with Suboxone and methadone.',
        'Priya Nair, RN',
        'Aug 7, 2026',
        10,
        '/assets/img/blog-fentanyl.jpg',
      ),
      P(
        'Is Rehab Covered by OHIP? Public vs. Private Treatment Explained',
        'Treatment Guides',
        'What provincial health plans actually cover, typical wait times, and how private centres price their programs.',
        'James Okafor',
        'Jul 31, 2026',
        7,
        '/assets/img/blog-ohip.jpg',
      ),
      P(
        'Dual Diagnosis: When Anxiety, Depression and Addiction Overlap',
        'Mental Health',
        'Treating one without the other rarely works. Here is how integrated programs approach both at once.',
        'Dr. Lena Bergström',
        'Jul 24, 2026',
        9,
        '/assets/img/blog-dual.jpg',
      ),
      P(
        '“I Relapsed After 14 Months.” What Recovery Really Looks Like',
        'Recovery Stories',
        'A Calgary father on relapse, shame and the second recovery that finally held.',
        'Guest contributor',
        'Jul 17, 2026',
        6,
        '/assets/img/blog-relapse-story.jpg',
      ),
      P(
        'Am I Drinking Too Much? 10 Honest Questions to Ask Yourself',
        'Alcohol',
        'Not a diagnosis — a mirror. The screening questions clinicians use, in plain language.',
        'Dr. Sarah Mitchell',
        'Jul 10, 2026',
        5,
        '/assets/img/blog-drinking.jpg',
      ),
      P(
        'Cocaine Addiction Treatment: What Works and What Doesn’t',
        'Drugs & Opioids',
        'There is no medication for cocaine dependence — which makes the right therapy model matter more.',
        'Mark Delacroix',
        'Jul 3, 2026',
        8,
        '/assets/img/blog-cocaine.jpg',
      ),
      P(
        'Supporting a Partner in Early Recovery: A Practical Guide',
        'Family & Intervention',
        'Boundaries, triggers, and the difference between supporting and enabling.',
        'Priya Nair, RN',
        'Jun 26, 2026',
        7,
        '/assets/img/blog-partner.jpg',
      ),
      P(
        'Trauma-Informed Addiction Treatment: Why It Changes Outcomes',
        'Mental Health',
        'Most people in treatment carry trauma. Programs that acknowledge it see fewer early departures.',
        'Dr. Lena Bergström',
        'Jun 19, 2026',
        9,
        '/assets/img/blog-trauma.jpg',
      ),
    ];
    const catNames = [
      'All',
      'Alcohol',
      'Drugs & Opioids',
      'Treatment Guides',
      'Mental Health',
      'Family & Intervention',
      'Recovery Stories',
    ];
    const cats = catNames.map((c) => {
      const on = cat === c;
      return {
        label: c,
        count: c === 'All' ? posts.length : posts.filter((p) => p.category === c).length,
        pick: () => this.setState({ cat: c }),
        bg: on ? '#10233a' : '#fff',
        color: on ? '#fff' : '#1f3550',
        border: on ? '#10233a' : '#dbe6f0',
        pillBg: on ? 'rgba(255,255,255,.15)' : '#eaf5fd',
        pillColor: on ? '#fff' : '#0890E8',
      };
    });
    const q = query.trim().toLowerCase();
    const filtering = cat !== 'All' || q.length > 0;
    let list = posts.filter(
      (p) =>
        (cat === 'All' || p.category === cat) &&
        (!q || (p.title + ' ' + p.excerpt + ' ' + p.category).toLowerCase().includes(q)),
    );
    if (sort === 'Popular') list = [...list].sort((a, b) => b.read - a.read);
    const lead = posts[0],
      secondary = posts.slice(1, 3);
    const listPosts = filtering ? list : posts.slice(3);
    const sorts = ['Latest', 'Popular'].map((s) => ({
      label: s,
      pick: () => this.setState({ sort: s }),
      bg: sort === s ? '#fff' : 'transparent',
      color: sort === s ? '#10233a' : '#6b7f95',
      shadow: sort === s ? '0 2px 8px -2px rgba(16,35,58,.2)' : 'none',
    }));
    const hubs = [
      {
        label: 'Alcohol',
        href: B + 'addiction-by-alcohol/',
        icon: ic.s(['M7 3h10l-1 9a4 4 0 0 1-8 0L7 3z', 'M12 16v5', 'M9 21h6']),
        count: cats[1].count,
      },
      {
        label: 'Drugs & Opioids',
        href: B + 'opioids-addiction/',
        icon: ic.s(['M10.5 3.5l10 10a4.95 4.95 0 0 1-7 7l-10-10a4.95 4.95 0 0 1 7-7z', 'M8.5 8.5l7 7']),
        count: cats[2].count,
      },
      {
        label: 'Treatment Guides',
        href: B + 'drug-rehabilitation-in-canada/',
        icon: ic.s([{ t: 'rect', a: { x: 5, y: 3, width: 14, height: 18, rx: 2 } }, 'M9 8h6', 'M9 12h6', 'M9 16h4']),
        count: cats[3].count,
      },
      {
        label: 'Mental Health',
        href: '#',
        icon: ic.s([
          { t: 'circle', a: { cx: 9, cy: 12, r: 6 } },
          { t: 'circle', a: { cx: 15, cy: 12, r: 6 } },
        ]),
        count: cats[4].count,
      },
      {
        label: 'Family & Intervention',
        href: '/intervention',
        icon: ic.s(['M4 13l4-4 3 3', 'M20 13l-4-4-3 3', 'M4 13v5l5 3h6l5-3v-5', 'M12 12v4']),
        count: cats[5].count,
      },
      {
        label: 'Recovery Stories',
        href: '#',
        icon: ic.s(['M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.5A4 4 0 0 1 19 10c0 5.6-7 10-7 10z']),
        count: cats[6].count,
      },
    ];
    const popular = [posts[0], posts[4], posts[7], posts[2]].map((p, i) => ({
      n: String(i + 1).padStart(2, '0'),
      title: p.title,
    }));
    const steps = [
      {
        n: '01',
        title: 'Recognise the problem',
        body: 'Screening questions, warning signs and how dependence differs from heavy use.',
      },
      {
        n: '02',
        title: 'Get through detox safely',
        body: 'Which substances need medical supervision and what withdrawal really feels like.',
      },
      {
        n: '03',
        title: 'Choose the right program',
        body: 'Inpatient, outpatient, 12-step, holistic — and how to tell a good centre from a glossy one.',
      },
      {
        n: '04',
        title: 'Stay well after treatment',
        body: 'Aftercare, relapse planning, therapy and how families can help without hovering.',
      },
    ];
    const pages = [1, 2, 3, '…', 12].map((n) => ({
      label: String(n),
      href: '#',
      cur: n === 1 ? 'page' : undefined,
      bg: n === 1 ? '#10233a' : '#fff',
      color: n === 1 ? '#fff' : '#10233a',
      border: n === 1 ? '#10233a' : '#dbe6f0',
    }));
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
    const vw = this.state.vw || 0 || 1280,
      narrow = vw < 1100,
      tight = vw < 900;
    return {
      mainCols: narrow ? 'minmax(0,1fr)' : 'minmax(0,1fr) 340px',
      featCols: tight ? 'minmax(0,1fr)' : 'minmax(0,1.35fr) minmax(0,1fr)',
      gridCols: tight ? '1fr' : 'repeat(2,1fr)',
      heroCols: tight ? '1fr' : '1fr auto',
      stepCols: tight ? 'repeat(2,1fr)' : 'repeat(4,1fr)',
      sideStyle: narrow ? 'static' : 'sticky',
      sideCols: narrow ? 'repeat(auto-fit,minmax(280px,1fr))' : '1fr',
      searchW: tight ? '100%' : '380px',
      navItems,
      menuOpen: !!m,
      closeMenu: () => this.setState({ menu: null }),
      menuTitle: m?.title,
      menuSub: m?.sub,
      menuIcon: m?.icon,
      menuCols: m?.cols || '1fr',
      menuLinks: m?.links || [],
      postTotal: posts.length,
      iconSearch: ic.search,
      iconClock: ic.clock,
      iconMail: ic.mail,
      query,
      onQuery: (e) => this.setState({ query: e.target.value }),
      onSearchSubmit: (e) => e.preventDefault(),
      clearAll: () => this.setState({ query: '', cat: 'All' }),
      cats,
      showFeatured: !filtering && (this.props.showFeatured ?? true),
      lead,
      secondary,
      listPosts,
      emptyList: filtering && list.length === 0,
      listKicker: filtering ? list.length + ' result' + (list.length === 1 ? '' : 's') : 'Latest',
      listTitle: filtering ? (cat !== 'All' ? cat : 'Search results') : 'Recent articles',
      sorts,
      showPager: !filtering,
      pages,
      hubs,
      popular,
      steps,
      footerCols,
      subLabel: subscribed ? 'Subscribed ✓' : 'Subscribe',
      onSubscribe: (e) => {
        e.preventDefault();
        this.setState({ subscribed: true });
      },
    };
  }
}

/* ───────────────────────── markup ───────────────────────── */
function template(v) {
  const {
    cats,
    clearAll,
    emptyList,
    featCols,
    footerCols,
    gridCols,
    heroCols,
    hubs,
    iconClock,
    iconMail,
    iconSearch,
    lead,
    listKicker,
    listPosts,
    listTitle,
    mainCols,
    onQuery,
    onSearchSubmit,
    onSubscribe,
    pages,
    popular,
    postTotal,
    query,
    searchW,
    secondary,
    showFeatured,
    showPager,
    sideCols,
    sideStyle,
    sorts,
    stepCols,
    steps,
    subLabel,
  } = v;
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <SiteHeader active="more" __hostStyle={{ position: 'sticky', top: '0', zIndex: '50' }} />
        <section
          data-screen-label="Blog Hero"
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'radial-gradient(1000px 500px at 85% -20%,#dbeefb 0%,rgba(219,238,251,0) 60%),#f7fafd',
            borderBottom: '1px solid #e9eff5',
          }}
        >
          <div
            style={{
              maxWidth: '1280px',
              margin: '0 auto',
              padding: '40px 32px 44px',
              display: 'flex',
              flexDirection: 'column',
              gap: '28px',
            }}
            data-rc-wrap="1"
          >
            <nav
              aria-label="Breadcrumb"
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: '#6b7f95' }}
            >
              <$A className="scp0" href="/" style={{ color: '#6b7f95' }}>
                Home
              </$A>
              <span style={{ opacity: '.5' }}>/</span>
              <span style={{ color: '#10233a', fontWeight: '500' }}>Blog</span>
            </nav>
            <div
              style={$css(`display:grid;grid-template-columns:${heroCols ?? ''};gap:40px;align-items:end`)}
              data-rc-dyn="1"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '720px' }}>
                <span
                  style={{
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#0890E8',
                  }}
                >
                  The Recovery Journal
                </span>
                <h1 style={{ fontSize: '50px', lineHeight: '1.06' }} data-rc-lg="1">
                  Clear answers on addiction, treatment and <span style={{ color: '#0890E8' }}>recovery in Canada</span>
                </h1>
                <p style={{ font: '400 18px/1.55 Figtree,sans-serif', color: '#516378', maxWidth: '600px' }}>
                  Practical guides written with Canadian addiction professionals — no jargon, no judgement.{' '}
                  {$i(postTotal)} articles and counting.
                </p>
              </div>
              <form
                onSubmit={onSearchSubmit}
                role="search"
                style={$css(
                  `background:#fff;border:1px solid #dbe6f0;border-radius:14px;padding:6px;display:flex;align-items:center;gap:6px;width:${searchW ?? ''};max-width:100%;box-shadow:0 20px 50px -30px rgba(16,35,58,.35)`,
                )}
              >
                <span
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#6b7f95',
                    flexShrink: '0',
                  }}
                >
                  {$i(iconSearch)}
                </span>
                <input
                  value={$val(query)}
                  onChange={onQuery}
                  type="search"
                  aria-label="Search articles"
                  placeholder="Search articles, e.g. alcohol detox"
                  style={{
                    flex: '1',
                    minWidth: '0',
                    border: '0',
                    outline: 'none',
                    background: 'transparent',
                    font: '500 15px Figtree,sans-serif',
                    color: '#10233a',
                    height: '44px',
                  }}
                />
                <button
                  className="scpc"
                  type="submit"
                  style={{
                    appearance: 'none',
                    border: '0',
                    cursor: 'pointer',
                    font: '600 14.5px Jost,sans-serif',
                    color: '#fff',
                    background: '#0890E8',
                    height: '44px',
                    padding: '0 16px',
                    borderRadius: '10px',
                    transition: 'background .18s',
                  }}
                >
                  Search
                </button>
              </form>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginTop: '4px' }}>
              {$list(cats).map((c, $index) => (
                <Fragment key={$index}>
                  <button
                    className="scpj"
                    onClick={c?.pick}
                    style={$css(
                      `appearance:none;cursor:pointer;height:38px;padding:0 16px;border-radius:999px;border:1px solid ${c?.border ?? ''};background:${c?.bg ?? ''};color:${c?.color ?? ''};font:500 14px Figtree,sans-serif;display:flex;align-items:center;gap:8px;transition:all .18s;white-space:nowrap`,
                    )}
                  >
                    {$i(c?.label)}
                    <span
                      style={$css(
                        `font:600 11.5px Jost,sans-serif;background:${c?.pillBg ?? ''};color:${c?.pillColor ?? ''};padding:2px 7px;border-radius:999px`,
                      )}
                    >
                      {$i(c?.count)}
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        {showFeatured ? (
          <>
            <section data-screen-label="Featured Articles" style={{ background: '#fff' }}>
              <div
                style={$css(
                  `max-width:1280px;margin:0 auto;padding:56px 32px 40px;display:grid;grid-template-columns:${featCols ?? ''};gap:28px`,
                )}
                data-rc-dyn="1"
              >
                <article
                  className="scpk"
                  style={{
                    position: 'relative',
                    borderRadius: '26px',
                    overflow: 'hidden',
                    background: '#10233a',
                    color: '#fff',
                    minHeight: '520px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    transition: 'transform .2s',
                  }}
                >
                  <$A
                    href="/blog/how-long-does-alcohol-detox-take"
                    aria-label={lead?.title}
                    style={{ overflow: 'hidden', position: 'absolute', inset: '0', background: '#1c3352' }}
                  >
                    <img
                      src={lead?.photo}
                      alt=""
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
                  </$A>
                  <div
                    style={{
                      position: 'absolute',
                      inset: '0',
                      background: 'linear-gradient(180deg,rgba(16,35,58,0) 30%,rgba(16,35,58,.92) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                  <div
                    style={{
                      position: 'relative',
                      padding: '36px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          background: '#D82028',
                          color: '#fff',
                          font: '600 11px Jost,sans-serif',
                          letterSpacing: '.08em',
                          padding: '5px 10px',
                          borderRadius: '999px',
                        }}
                      >
                        EDITOR'S PICK
                      </span>
                      <$A
                        href="#"
                        style={{
                          color: '#7cc4f5',
                          font: '600 12px Figtree,sans-serif',
                          letterSpacing: '.1em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {$i(lead?.category)}
                      </$A>
                    </div>
                    <h2
                      style={{ fontSize: '36px', lineHeight: '1.12', color: '#fff', maxWidth: '600px' }}
                      data-rc-lg="1"
                    >
                      <$A className="scpl" href="/blog/how-long-does-alcohol-detox-take" style={{ color: '#fff' }}>
                        {$i(lead?.title)}
                      </$A>
                    </h2>
                    <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#b7c7d8', maxWidth: '560px' }}>
                      {$i(lead?.excerpt)}
                    </p>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        marginTop: '6px',
                        fontSize: '13.5px',
                        color: '#b7c7d8',
                      }}
                    >
                      <span
                        style={{
                          width: '34px',
                          height: '34px',
                          borderRadius: '50%',
                          background: '#eaf5fd',
                          color: '#0890E8',
                          display: 'grid',
                          placeItems: 'center',
                          font: '600 13px Jost,sans-serif',
                        }}
                      >
                        {$i(lead?.initials)}
                      </span>
                      <span style={{ color: '#fff', fontWeight: '500' }}>{$i(lead?.author)}</span>
                      <span style={{ opacity: '.5' }}>·</span>
                      <span>{$i(lead?.date)}</span>
                      <span style={{ opacity: '.5' }}>·</span>
                      <span>{$i(lead?.read)} min read</span>
                    </div>
                  </div>
                </article>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {$list(secondary).map((p, $index) => (
                    <Fragment key={$index}>
                      <article
                        className="scpm"
                        style={{
                          flex: '1',
                          background: '#fff',
                          border: '1px solid #e3ecf4',
                          borderRadius: '22px',
                          padding: '22px',
                          display: 'grid',
                          gridTemplateColumns: '150px 1fr',
                          gap: '20px',
                          alignItems: 'center',
                          transition: 'transform .2s,box-shadow .2s',
                        }}
                        data-cols="150px 1fr"
                      >
                        <$A
                          href="/blog/how-long-does-alcohol-detox-take"
                          aria-label={p?.title}
                          style={{
                            display: 'block',
                            aspectRatio: '1/1',
                            borderRadius: '14px',
                            background: '#eaf2f8',
                            position: 'relative',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={p?.photo}
                            alt=""
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
                        </$A>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                          <$A
                            href="#"
                            style={{
                              font: '600 12px Figtree,sans-serif',
                              letterSpacing: '.1em',
                              textTransform: 'uppercase',
                            }}
                          >
                            {$i(p?.category)}
                          </$A>
                          <h3 style={{ fontSize: '20px', lineHeight: '1.25' }}>
                            <$A
                              className="scp0"
                              href="/blog/how-long-does-alcohol-detox-take"
                              style={{ color: '#10233a' }}
                            >
                              {$i(p?.title)}
                            </$A>
                          </h3>
                          <p style={{ fontSize: '14px', lineHeight: '1.55', color: '#516378' }}>{$i(p?.excerpt)}</p>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              fontSize: '13px',
                              color: '#6b7f95',
                            }}
                          >
                            <span>{$i(p?.date)}</span>
                            <span style={{ opacity: '.5' }}>·</span>
                            <span>{$i(p?.read)} min read</span>
                          </div>
                        </div>
                      </article>
                    </Fragment>
                  ))}
                </div>
              </div>
            </section>
          </>
        ) : null}
        <section data-screen-label="Latest Articles" style={{ background: '#fff', borderTop: '1px solid #e9eff5' }}>
          <div
            style={$css(
              `max-width:1280px;margin:0 auto;padding:56px 32px 72px;display:grid;grid-template-columns:${mainCols ?? ''};gap:48px;align-items:start`,
            )}
            data-rc-dyn="1"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: '20px' }}>
                <div>
                  <span
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.14em',
                      textTransform: 'uppercase',
                      color: '#0890E8',
                    }}
                  >
                    {$i(listKicker)}
                  </span>
                  <h2 style={{ fontSize: '32px', marginTop: '8px' }}>{$i(listTitle)}</h2>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#f7fafd',
                    border: '1px solid #e3ecf4',
                    borderRadius: '10px',
                    padding: '4px',
                  }}
                >
                  {$list(sorts).map((s, $index) => (
                    <Fragment key={$index}>
                      <button
                        onClick={s?.pick}
                        style={$css(
                          `appearance:none;border:0;cursor:pointer;height:34px;padding:0 14px;border-radius:7px;background:${s?.bg ?? ''};color:${s?.color ?? ''};font:500 13.5px Figtree,sans-serif;box-shadow:${s?.shadow ?? ''};transition:all .18s`,
                        )}
                      >
                        {$i(s?.label)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              {emptyList ? (
                <>
                  <div
                    style={{
                      border: '1px dashed #cfdce8',
                      borderRadius: '20px',
                      padding: '48px',
                      textAlign: 'center',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <h3 style={{ fontSize: '20px' }}>No articles match “{$i(query)}”</h3>
                    <p style={{ color: '#6b7f95', fontSize: '15px' }}>Try a broader term, or browse by topic above.</p>
                    <button
                      className="scp7"
                      onClick={clearAll}
                      style={{
                        appearance: 'none',
                        cursor: 'pointer',
                        marginTop: '8px',
                        border: '1.5px solid #0890E8',
                        background: '#fff',
                        color: '#0890E8',
                        font: '600 14px Jost,sans-serif',
                        padding: '10px 18px',
                        borderRadius: '10px',
                      }}
                    >
                      Clear search
                    </button>
                  </div>
                </>
              ) : null}
              <div style={$css(`display:grid;grid-template-columns:${gridCols ?? ''};gap:24px`)} data-rc-dyn="1">
                {$list(listPosts).map((p, $index) => (
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
                        animation: 'fadeUp .3s ease-out both',
                      }}
                    >
                      <$A
                        href="/blog/how-long-does-alcohol-detox-take"
                        aria-label={p?.title}
                        style={{
                          overflow: 'hidden',
                          position: 'relative',
                          display: 'block',
                          aspectRatio: '16/9',
                          background: '#eaf2f8',
                        }}
                      >
                        <img
                          src={p?.photo}
                          alt=""
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
                        <span
                          style={{
                            position: 'absolute',
                            top: '14px',
                            left: '14px',
                            background: '#fff',
                            color: '#1f3550',
                            font: '600 11px Jost,sans-serif',
                            letterSpacing: '.06em',
                            padding: '5px 10px',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                          }}
                        >
                          {$i(p?.category)}
                        </span>
                      </$A>
                      <div
                        style={{
                          padding: '22px 22px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                          flex: '1',
                        }}
                      >
                        <h3 style={{ fontSize: '20px', lineHeight: '1.28' }}>
                          <$A
                            className="scp0"
                            href="/blog/how-long-does-alcohol-detox-take"
                            style={{ color: '#10233a' }}
                          >
                            {$i(p?.title)}
                          </$A>
                        </h3>
                        <p style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#516378' }}>{$i(p?.excerpt)}</p>
                        <div
                          style={{
                            marginTop: 'auto',
                            paddingTop: '14px',
                            borderTop: '1px solid #edf2f7',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '13px',
                            color: '#6b7f95',
                          }}
                        >
                          <span
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: '#eaf5fd',
                              color: '#0890E8',
                              display: 'grid',
                              placeItems: 'center',
                              font: '600 11px Jost,sans-serif',
                            }}
                          >
                            {$i(p?.initials)}
                          </span>
                          <span style={{ color: '#1f3550', fontWeight: '500' }}>{$i(p?.author)}</span>
                          <span style={{ opacity: '.5' }}>·</span>
                          <span>{$i(p?.date)}</span>
                          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            {$i(iconClock)}
                            {$i(p?.read)} min
                          </span>
                        </div>
                      </div>
                    </article>
                  </Fragment>
                ))}
              </div>
              {showPager ? (
                <>
                  <nav
                    aria-label="Pagination"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      marginTop: '12px',
                    }}
                  >
                    <$A
                      href="#"
                      aria-label="Previous page"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        border: '1px solid #dbe6f0',
                        background: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#b7c7d8',
                        pointerEvents: 'none',
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
                    </$A>
                    {$list(pages).map((pg, $index) => (
                      <Fragment key={$index}>
                        <$A
                          className="scpj"
                          href={pg?.href}
                          aria-current={pg?.cur}
                          style={$css(
                            `min-width:44px;height:44px;padding:0 10px;border-radius:12px;border:1px solid ${pg?.border ?? ''};background:${pg?.bg ?? ''};color:${pg?.color ?? ''};display:grid;place-items:center;font:600 14px Jost,sans-serif`,
                          )}
                        >
                          {$i(pg?.label)}
                        </$A>
                      </Fragment>
                    ))}
                    <$A
                      className="scp2"
                      href="#"
                      aria-label="Next page"
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        border: '1px solid #dbe6f0',
                        background: '#fff',
                        display: 'grid',
                        placeItems: 'center',
                        color: '#10233a',
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
                    </$A>
                  </nav>
                </>
              ) : null}
            </div>
            <aside
              style={$css(
                `position:${sideStyle ?? ''};top:124px;display:grid;grid-template-columns:${sideCols ?? ''};gap:20px;align-items:start`,
              )}
              data-rc-dyn="1"
            >
              <div
                style={{
                  background: 'linear-gradient(160deg,#0f5fa8,#0890E8)',
                  borderRadius: '22px',
                  padding: '26px',
                  color: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <span
                  style={{
                    font: '500 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    opacity: '.8',
                  }}
                >
                  Free helpline · 24/7
                </span>
                <h3 style={{ fontSize: '22px', color: '#fff', lineHeight: '1.2' }}>Reading for someone you love?</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.55', opacity: '.9' }}>
                  A confidential call is often the fastest way to a clear next step.
                </p>
                <$A
                  className="scp5"
                  href="tel:+18558854747"
                  style={{
                    marginTop: '6px',
                    display: 'inline-flex',
                    justifyContent: 'center',
                    font: '600 16px Jost,sans-serif',
                    color: '#0f5fa8',
                    background: '#fff',
                    padding: '12px 16px',
                    borderRadius: '10px',
                  }}
                >
                  Call 1-855-885-4747
                </$A>
              </div>
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
                <h3 style={{ fontSize: '17px' }}>Guides by topic</h3>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  {$list(hubs).map((h, $index) => (
                    <Fragment key={$index}>
                      <li>
                        <$A
                          className="scpo"
                          href={h?.href}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '10px',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            color: '#1f3550',
                            font: '500 14.5px Figtree,sans-serif',
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span
                              style={{
                                width: '30px',
                                height: '30px',
                                borderRadius: '9px',
                                background: '#eaf5fd',
                                color: '#0890E8',
                                display: 'grid',
                                placeItems: 'center',
                              }}
                            >
                              {$i(h?.icon)}
                            </span>
                            {$i(h?.label)}
                          </span>
                          <span style={{ fontSize: '12.5px', color: '#6b7f95' }}>{$i(h?.count)}</span>
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
                  borderRadius: '22px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <h3 style={{ fontSize: '17px' }}>Most read this month</h3>
                <ol
                  style={{
                    margin: '0',
                    padding: '0',
                    listStyle: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  {$list(popular).map((p, $index) => (
                    <Fragment key={$index}>
                      <li style={{ display: 'flex', gap: '12px', alignItems: 'start' }}>
                        <span
                          style={{
                            font: '600 18px Jost,sans-serif',
                            color: '#0890E8',
                            width: '22px',
                            flexShrink: '0',
                            lineHeight: '1.3',
                          }}
                        >
                          {$i(p?.n)}
                        </span>
                        <$A
                          className="scp0"
                          href="/blog/how-long-does-alcohol-detox-take"
                          style={{ font: '500 14.5px/1.4 Figtree,sans-serif', color: '#1f3550' }}
                        >
                          {$i(p?.title)}
                        </$A>
                      </li>
                    </Fragment>
                  ))}
                </ol>
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
                <span
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: '#eaf5fd',
                    color: '#0890E8',
                    display: 'grid',
                    placeItems: 'center',
                  }}
                >
                  {$i(iconMail)}
                </span>
                <h3 style={{ fontSize: '17px' }}>Monthly recovery digest</h3>
                <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#516378' }}>
                  New guides, once a month. No spam, unsubscribe anytime.
                </p>
                <form onSubmit={onSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <input
                    type="email"
                    required
                    aria-label="Email address"
                    placeholder="you@example.com"
                    style={{
                      height: '44px',
                      border: '1px solid #dbe6f0',
                      borderRadius: '10px',
                      padding: '0 14px',
                      font: '500 14.5px Figtree,sans-serif',
                      color: '#10233a',
                      outline: 'none',
                      background: '#fff',
                    }}
                  />
                  <button
                    className="scpp"
                    type="submit"
                    style={{
                      appearance: 'none',
                      border: '0',
                      cursor: 'pointer',
                      height: '44px',
                      borderRadius: '10px',
                      background: '#10233a',
                      color: '#fff',
                      font: '600 14.5px Jost,sans-serif',
                    }}
                  >
                    {$i(subLabel)}
                  </button>
                </form>
              </div>
            </aside>
          </div>
        </section>
        <section data-screen-label="Topic Hubs" style={{ background: '#10233a', color: '#fff' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '72px 32px' }} data-rc-wrap="1">
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
                    font: '600 12px Figtree,sans-serif',
                    letterSpacing: '.14em',
                    textTransform: 'uppercase',
                    color: '#7cc4f5',
                  }}
                >
                  Start here
                </span>
                <h2 style={{ fontSize: '34px', marginTop: '10px', color: '#fff' }} data-rc-lg="1">
                  Complete guides, in the order most people need them
                </h2>
              </div>
              <$A
                className="scpe"
                href="https://addictionrehabcenters.ca/rehab/search/"
                style={{
                  font: '600 15px Jost,sans-serif',
                  color: '#7cc4f5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                }}
              >
                Find a rehab near you{' '}
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
            <div style={$css(`display:grid;grid-template-columns:${stepCols ?? ''};gap:16px`)} data-rc-dyn="1">
              {$list(steps).map((s, $index) => (
                <Fragment key={$index}>
                  <$A
                    className="scpq"
                    href="/blog/how-long-does-alcohol-detox-take"
                    style={{
                      background: 'rgba(255,255,255,.05)',
                      border: '1px solid rgba(255,255,255,.1)',
                      borderRadius: '20px',
                      padding: '24px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      color: '#fff',
                      transition: 'background .18s,transform .18s',
                    }}
                  >
                    <span style={{ font: '600 12px Jost,sans-serif', letterSpacing: '.1em', color: '#7cc4f5' }}>
                      STEP {$i(s?.n)}
                    </span>
                    <h3 style={{ fontSize: '20px', lineHeight: '1.25', color: '#fff' }}>{$i(s?.title)}</h3>
                    <p style={{ fontSize: '14px', lineHeight: '1.55', color: '#b7c7d8' }}>{$i(s?.body)}</p>
                    <span style={{ marginTop: 'auto', font: '600 13.5px Jost,sans-serif', color: '#7cc4f5' }}>
                      Read the guide →
                    </span>
                  </$A>
                </Fragment>
              ))}
            </div>
          </div>
        </section>
        <footer
          data-screen-label="Footer"
          style={{ background: '#10233a', color: '#b7c7d8', borderTop: '1px solid rgba(255,255,255,.08)' }}
        >
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
  '\nhtml,body{margin:0;padding:0;background:#f7fafd;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\ninput::placeholder{color:#8a9bb0}\n@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}\n@media (prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}\n';
export const css = [ownCss, SiteHeader_css].filter(Boolean).join('\n');
export const defaults = { showFeatured: true };
const View = createDC('Blog', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} {...props} />;
}
