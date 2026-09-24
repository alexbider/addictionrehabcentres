'use client';
// Generated from ProviderDashboard.dc.html — layout, styles and copy are a 1:1 port of the design.
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val, $chk, $styleVal, $hostStyle } from '@/dc/runtime';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  state = {
    vw: 1280,
    view: 'overview',
    range: 30,
    hover: -1,
    q: '',
    leadView: 'board',
    leads: null,
    openId: null,
    drag: null,
    dropOn: null,
    reply: '',
    note: '',
    ai: false,
    gcal: 'connected',
    extra: [],
    status: 'available',
    openSec: null,
    prof: null,
    notifOpen: false,
    notifRead: false,
    toast: '',
    notifs: { email: true, sms: true, digest: true, reviews: false },
    user: null,
  };
  componentDidMount() {
    this.setState({ vw: window.innerWidth });
    this._r = () => this.setState({ vw: window.innerWidth });
    window.addEventListener('resize', this._r);
    try {
      const u = JSON.parse(localStorage.getItem('arc-auth-user') || 'null');
      if (u) this.setState({ user: u });
    } catch (e) {}
    const type = this.props.providerType || (this.state.user && this.state.user.type) || 'centre';
    this.setState({ leads: this.seedLeads(type), prof: this.seedProfile(type) });
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this._r);
    clearTimeout(this._tt);
  }
  icon(paths, extra) {
    const R = React.createElement;
    return R(
      'svg',
      {
        width: 18,
        height: 18,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.9,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        ...(extra || {}),
      },
      ...paths.map((p, i) => (typeof p === 'string' ? R('path', { key: i, d: p }) : R(p.t, { key: i, ...p.a }))),
    );
  }
  flash(t) {
    clearTimeout(this._tt);
    this.setState({ toast: t });
    this._tt = setTimeout(() => this.setState({ toast: '' }), 2200);
  }
  seedLeads(type) {
    const c = type !== 'therapist';
    const L = (id, name, stage, interest, source, ago, hrs, score, phone, email, msg, extra) => ({
      id,
      name,
      stage,
      interest,
      source,
      ago,
      hrs,
      score,
      phone,
      email,
      message: msg,
      timeline: [{ k: 'in', t: 'Enquiry received via ' + source, when: ago }],
      ...(extra || {}),
    });
    return c
      ? [
          L(
            1,
            'Sarah Thompson',
            'new',
            'Residential · Alcohol',
            'Profile message',
            '12 min ago',
            0.2,
            92,
            '(416) 555-0182',
            'sarah.t@example.com',
            'Looking for a 30-day residential program for my husband, starting as soon as possible. Do you have availability this month and do you accept extended health benefits?',
            { who: 'Spouse', insurance: 'Extended health', urgency: 'This week' },
          ),
          L(
            2,
            'Mark D.',
            'new',
            'Medical detox · Opioids',
            'Toronto Rehabs page',
            '1 hr ago',
            1,
            88,
            '(647) 555-0114',
            'mark.d@example.com',
            'Need detox for fentanyl. How fast can someone be admitted?',
            { who: 'Self', insurance: 'Private pay', urgency: 'Today' },
          ),
          L(
            3,
            'Priya K.',
            'contacted',
            'Outpatient · Cocaine',
            'Call tracking',
            'Yesterday',
            26,
            74,
            '(905) 555-0147',
            'priya.k@example.com',
            'Called about evening outpatient options while continuing to work.',
            { who: 'Self', insurance: 'EAP', urgency: 'Within a month' },
          ),
          L(
            4,
            'Daniel R.',
            'contacted',
            'Residential · Alcohol',
            'Alcohol Addiction page',
            '2 days ago',
            50,
            68,
            '(416) 555-0199',
            'daniel.r@example.com',
            'Researching options for my brother. What does a typical day look like?',
            { who: 'Family', insurance: 'Unknown', urgency: 'Researching' },
          ),
          L(
            5,
            'Emily W.',
            'booked',
            'Residential · Dual diagnosis',
            'Profile message',
            '3 days ago',
            72,
            85,
            '(289) 555-0120',
            'emily.w@example.com',
            'Anxiety and drinking. Would like to tour before deciding.',
            { who: 'Self', insurance: 'Extended health', urgency: 'This week' },
          ),
          L(
            6,
            'James O.',
            'booked',
            'Medical detox · Alcohol',
            'Google Business',
            '4 days ago',
            96,
            79,
            '(647) 555-0133',
            'james.o@example.com',
            'Assessment requested for Thursday.',
            { who: 'Self', insurance: 'Private pay', urgency: 'This week' },
          ),
          L(
            7,
            'Linda M.',
            'admitted',
            'Residential · Prescription drugs',
            'Ontario Rehabs page',
            '1 week ago',
            170,
            90,
            '(416) 555-0171',
            'linda.m@example.com',
            'Admitted after assessment.',
            { who: 'Self', insurance: 'Extended health', urgency: '—' },
          ),
          L(
            8,
            'Chris P.',
            'lost',
            'Outpatient · Cannabis',
            'Profile message',
            '2 weeks ago',
            340,
            41,
            '(905) 555-0108',
            'chris.p@example.com',
            'Chose a program closer to home.',
            { who: 'Self', insurance: 'Unknown', urgency: '—' },
          ),
        ]
      : [
          L(
            1,
            'Alex N.',
            'new',
            'Individual · Anxiety & alcohol',
            'Profile message',
            '20 min ago',
            0.3,
            90,
            '(416) 555-0152',
            'alex.n@example.com',
            'Looking for evening online sessions. Do you have availability next week and do you offer a free consult?',
            { who: 'Self', insurance: 'Extended health', urgency: 'This week' },
          ),
          L(
            2,
            'Jordan B.',
            'new',
            'Couples · Recovery support',
            'Toronto Therapists page',
            '2 hrs ago',
            2,
            81,
            '(647) 555-0160',
            'jordan.b@example.com',
            'My partner is 3 months sober and we want support as a couple.',
            { who: 'Couple', insurance: 'Private pay', urgency: 'Within a month' },
          ),
          L(
            3,
            'Maria S.',
            'contacted',
            'Individual · Trauma',
            'Call tracking',
            'Yesterday',
            26,
            72,
            '(905) 555-0131',
            'maria.s@example.com',
            'Asked about EMDR and sliding scale.',
            { who: 'Self', insurance: 'Sliding scale', urgency: 'Researching' },
          ),
          L(
            4,
            'Tom H.',
            'booked',
            'Free consultation',
            'Profile message',
            '3 days ago',
            72,
            84,
            '(416) 555-0177',
            'tom.h@example.com',
            'Booked a 15-minute intro call.',
            { who: 'Self', insurance: 'EAP', urgency: 'This week' },
          ),
          L(
            5,
            'Nina P.',
            'admitted',
            'Individual · Relapse prevention',
            'Ontario Therapists page',
            '1 week ago',
            170,
            88,
            '(289) 555-0199',
            'nina.p@example.com',
            'Weekly sessions started.',
            { who: 'Self', insurance: 'Extended health', urgency: '—' },
          ),
          L(
            6,
            'Sam R.',
            'lost',
            'Family · Intervention',
            'Profile message',
            '2 weeks ago',
            340,
            45,
            '(905) 555-0116',
            'sam.r@example.com',
            'Went with an in-person family program.',
            { who: 'Family', insurance: 'Unknown', urgency: '—' },
          ),
        ];
  }
  seedProfile(type) {
    return type !== 'therapist'
      ? {
          name: 'Lakeside Recovery Centre',
          headline: 'Private residential treatment on the shores of Lake Simcoe',
          about:
            'Lakeside Recovery Centre offers private residential and medical detox programs in a quiet lakeside setting. Clients work one-on-one with counsellors and join daily group sessions, with family programming and aftercare planned from day one.',
          services: ['Residential', 'Medical detox', 'Family programs', 'Aftercare'],
          price: '$12,000 – $28,000',
          phone: '(705) 555-0140',
          photos: 4,
        }
      : {
          name: 'Maya Chen',
          headline: 'Helping adults move from problem drinking to steady recovery',
          about:
            'I work with adults navigating alcohol and substance use, anxiety and the stress that often comes with them. Sessions are practical and collaborative, drawing on CBT and motivational interviewing.',
          services: ['Addiction', 'Alcohol use', 'Anxiety', 'CBT'],
          price: '$160 per session',
          phone: '(416) 555-0102',
          photos: 1,
        };
  }

  renderVals() {
    const {
      vw,
      view,
      range,
      hover,
      q,
      leadView,
      openId,
      drag,
      dropOn,
      reply,
      note,
      ai,
      gcal,
      extra,
      status,
      openSec,
      notifOpen,
      notifRead,
      toast,
      notifs,
      user,
    } = this.state;
    const leads = this.state.leads || [];
    const prof = this.state.prof || this.seedProfile('centre');
    const type = this.props.providerType || (user && user.type) || 'centre';
    const isC = type !== 'therapist';
    const wide = vw >= 1200,
      mid = vw >= 760,
      sideOn = vw >= 760,
      sideWide = vw >= 1100;
    const go = (v) => () => {
      this.setState({ view: v, notifOpen: false });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const ic = {
      home: this.icon(['M3 11l9-7 9 7', 'M5 10v10h14V10']),
      users: this.icon([
        { t: 'circle', a: { cx: 9, cy: 8, r: 3.5 } },
        'M2.5 20a6.5 6.5 0 0 1 13 0',
        'M16 4.5a3.5 3.5 0 0 1 0 7',
        'M18 14a6.5 6.5 0 0 1 3.5 6',
      ]),
      cal: this.icon([{ t: 'rect', a: { x: 3, y: 5, width: 18, height: 16, rx: 3 } }, 'M3 10h18', 'M8 3v4', 'M16 3v4']),
      chart: this.icon(['M4 20V10', 'M10 20V4', 'M16 20v-7', 'M22 20H2']),
      edit: this.icon(['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4']),
      card: this.icon([{ t: 'rect', a: { x: 2.5, y: 5, width: 19, height: 14, rx: 3 } }, 'M2.5 10h19']),
      gear: this.icon([
        { t: 'circle', a: { cx: 12, cy: 12, r: 3 } },
        'M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
      ]),
      eye: this.icon([
        'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z',
        { t: 'circle', a: { cx: 12, cy: 12, r: 3 } },
      ]),
      phone: this.icon(['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z']),
      msg: this.icon(['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z']),
      mail: this.icon([{ t: 'rect', a: { x: 3, y: 5, width: 18, height: 14, rx: 2 } }, 'M3 7l9 6 9-6']),
      globe: this.icon([
        { t: 'circle', a: { cx: 12, cy: 12, r: 9 } },
        'M3 12h18',
        'M12 3a14 14 0 0 1 0 18',
        'M12 3a14 14 0 0 0 0 18',
      ]),
      note: this.icon(['M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z', 'M14 3v5h5']),
      move: this.icon(['M5 12h14', 'M13 6l6 6-6 6']),
      star: this.icon(['M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z']),
    };
    const sm = (p) => this.icon(p, { width: 12, height: 12, strokeWidth: 2.2 });
    const stages = [
      ['new', 'New', '#0890E8', '#eaf5fd', '#0a5d96'],
      ['contacted', 'Contacted', '#F5A623', '#fff6e5', '#8a5a00'],
      ['booked', isC ? 'Assessment booked' : 'Consult booked', '#8b5cf6', '#f1ebfe', '#5b34b8'],
      ['admitted', isC ? 'Admitted' : 'Client', '#2fb46b', '#e6f4ec', '#1f8a52'],
      ['lost', 'Closed', '#9aabbd', '#f1f4f7', '#516378'],
    ];
    const stageOf = (k) => stages.find((s) => s[0] === k) || stages[0];
    const avPal = [
      ['#eaf5fd', '#0890E8'],
      ['#fdeceb', '#D82028'],
      ['#e6f4ec', '#1f8a52'],
      ['#fff6e5', '#b07400'],
      ['#f1ebfe', '#6d45d0'],
    ];
    const scoreSty = (s) =>
      s >= 85 ? ['#fdeceb', '#c0262d'] : s >= 70 ? ['#fff6e5', '#9a6400'] : ['#f1f4f7', '#516378'];
    const openLead = (id) => () => this.setState({ openId: id, reply: '', note: '', notifOpen: false });
    const decorate = (l, i) => {
      const [sb, sc] = scoreSty(l.score);
      const st = stageOf(l.stage);
      const av = avPal[l.id % avPal.length];
      return {
        ...l,
        initials: l.name
          .split(/\s+/)
          .map((w) => w[0])
          .join('')
          .slice(0, 2)
          .toUpperCase(),
        avBg: av[0],
        avColor: av[1],
        scoreBg: sb,
        scoreColor: sc,
        stageLabel: st[1],
        stageBg: st[3],
        stageColor: st[4],
        stage: st[1],
        stageKey: l.stage,
        open: openLead(l.id),
        drag: (e) => {
          try {
            e.dataTransfer.setData('text/plain', String(l.id));
          } catch (err) {}
          this.setState({ drag: l.id });
        },
        srcIcon: sm(
          l.source.includes('Call')
            ? ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z']
            : l.source.includes('message')
              ? ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z']
              : [{ t: 'circle', a: { cx: 12, cy: 12, r: 9 } }, 'M3 12h18'],
        ),
        overdueDisplay: l.stage === 'new' && l.hrs > 0.5 ? 'inline' : 'none',
      };
    };
    const ql = q.trim().toLowerCase();
    const filtered = leads.filter(
      (l) => !ql || (l.name + ' ' + l.interest + ' ' + l.source).toLowerCase().includes(ql),
    );
    const moveLead = (id, stage, why) =>
      this.setState((s) => ({
        leads: s.leads.map((l) =>
          l.id === id
            ? {
                ...l,
                stage,
                timeline: [
                  { k: 'move', t: 'Moved to ' + stageOf(stage)[1] + (why ? ' · ' + why : ''), when: 'Just now' },
                  ...l.timeline,
                ],
              }
            : l,
        ),
      }));
    const board = stages.map(([k, label, color]) => {
      const cards = filtered.filter((l) => l.stage === k).map(decorate);
      const on = dropOn === k;
      return {
        label,
        color,
        count: String(cards.length),
        cards,
        bg: on ? '#eaf5fd' : 'rgba(231,237,244,.7)',
        border: on ? '#0890E8' : 'transparent',
        over: (e) => {
          e.preventDefault();
          if (dropOn !== k) this.setState({ dropOn: k });
        },
        leave: () => {
          if (dropOn === k) this.setState({ dropOn: null });
        },
        drop: (e) => {
          e.preventDefault();
          const id = drag;
          this.setState({ drag: null, dropOn: null });
          if (id != null) {
            moveLead(id, k);
            this.flash('Lead moved to ' + label);
          }
        },
      };
    });

    const newCount = leads.filter((l) => l.stage === 'new').length;
    const nav = [
      ['overview', 'Overview', ic.home, ''],
      ['leads', 'Leads', ic.users, newCount ? String(newCount) : ''],
      ['calendar', 'Calendar', ic.cal, ''],
      ['analytics', 'Analytics', ic.chart, ''],
      ['profile', isC ? 'Listing' : 'Profile', ic.edit, ''],
      ['billing', 'Billing', ic.card, ''],
      ['settings', 'Settings', ic.gear, ''],
    ].map(([k, label, icon, badge]) => ({
      label,
      icon,
      badge,
      go: go(k),
      bg: view === k ? (sideOn ? 'linear-gradient(135deg,#1aa0f0,#0a74c9)' : '#0890E8') : 'transparent',
      shadow:
        view === k && sideOn ? '0 10px 22px -12px rgba(8,144,232,.9),inset 0 1px 0 rgba(255,255,255,.25)' : 'none',
      color: view === k ? '#fff' : sideOn ? '#b7c7d8' : '#dbe6f0',
      labelDisplay: sideWide ? 'block' : 'none',
      badgeDisplay: badge && sideWide ? 'inline-flex' : 'none',
      justify: sideWide ? 'flex-start' : 'center',
    }));

    // chart
    const N = range === 7 ? 7 : range === 90 ? 45 : 30;
    const seed = (i, a, b) => {
      const x = Math.sin(i * 12.9898 + a * 78.233) * 43758.5453;
      return (x - Math.floor(x)) * b;
    };
    const views = Array.from({ length: N }, (_, i) =>
      Math.round(110 + i * 1.6 + Math.sin(i / 3) * 22 + seed(i, 1, 30) + (i % 7 === 5 || i % 7 === 6 ? -18 : 0)),
    );
    const lds = views.map((v, i) => Math.max(0, Math.round(v / 42 + seed(i, 2, 2.4) - 0.8)));
    const maxV = Math.max(...views) * 1.12,
      maxL = Math.max(...lds, 1) * 2.2;
    const W = 600,
      H = 200,
      step = W / N;
    const px = (i) => i * step + step / 2,
      py = (v) => H - (v / maxV) * H;
    const line = views.map((v, i) => (i ? 'L' : 'M') + px(i).toFixed(1) + ',' + py(v).toFixed(1)).join('');
    const area = line + 'L' + px(N - 1).toFixed(1) + ',' + H + 'L' + px(0).toFixed(1) + ',' + H + 'Z';
    const bw = Math.max(3, step * 0.42);
    const bars = lds.map((l, i) => {
      const h = (l / maxL) * H;
      return {
        x: (px(i) - bw / 2).toFixed(1),
        y: (H - h).toFixed(1),
        w: bw.toFixed(1),
        h: h.toFixed(1),
        fill: hover === i ? '#D82028' : 'rgba(216,32,40,.55)',
      };
    });
    const hits = views.map((_, i) => ({
      x: (i * step).toFixed(1),
      w: step.toFixed(1),
      enter: () => this.setState({ hover: i }),
    }));
    const dayLabel = (i) => {
      const d = new Date();
      d.setDate(d.getDate() - (N - 1 - i) * (range === 90 ? 2 : 1));
      return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
    };
    const sumV = views.reduce((a, b) => a + b, 0),
      sumL = lds.reduce((a, b) => a + b, 0);
    const spark = (arr) => {
      const mx = Math.max(...arr),
        mn = Math.min(...arr);
      const n = arr.length;
      const pts = arr.map((v, i) => [(i / (n - 1)) * 120, 30 - ((v - mn) / (mx - mn || 1)) * 26]);
      const l = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('');
      return { line: l, area: l + 'L120,32L0,32Z' };
    };
    const mult = range === 7 ? 0.24 : range === 90 ? 2.9 : 1;
    const calls = Math.round(sumL * 0.45 * (isC ? 1 : 0.6)),
      msgs = Math.round(sumL * 0.55);
    const kpis = [
      [
        'Profile views',
        (range === 90 ? sumV * 2 : sumV).toLocaleString('en-CA'),
        '+18%',
        ic.eye,
        '#0890E8',
        '#eaf5fd',
        views,
      ],
      [
        isC ? 'Calls' : 'Calls',
        String(Math.round(calls * (range === 90 ? 2 : 1))),
        '+9%',
        ic.phone,
        '#D82028',
        '#fdeceb',
        lds.map((x, i) => x + seed(i, 3, 2)),
      ],
      [
        'Messages',
        String(Math.round(msgs * (range === 90 ? 2 : 1))),
        '+24%',
        ic.msg,
        '#8b5cf6',
        '#f1ebfe',
        lds.map((x, i) => x + seed(i, 4, 3)),
      ],
      [
        'Avg. reply time',
        isC ? '38 min' : '2.1 hrs',
        '−12%',
        ic.star,
        '#2fb46b',
        '#e6f4ec',
        views.map((v, i) => 200 - v + seed(i, 5, 20)),
      ],
    ].map(([label, value, delta, icon, color, tint, arr], i) => ({
      label,
      value,
      delta,
      icon,
      color,
      tint,
      wash: tint,
      delay: i * 60 + 'ms',
      ...spark(arr),
      deltaBg: '#e6f4ec',
      deltaColor: '#1f8a52',
    }));

    const hot = leads
      .filter((l) => l.stage === 'new' || l.stage === 'contacted')
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(decorate);
    const bookedEvents = [
      { d: 1, h: 10, title: isC ? 'Assessment · Emily W.' : 'Consult · Tom H.', sub: 'Video call', kind: 'booked' },
      {
        d: 3,
        h: 14,
        title: isC ? 'Assessment · James O.' : 'Session · Nina P.',
        sub: isC ? 'On site' : 'Online',
        kind: 'booked',
      },
      { d: 0, h: 9, title: 'Team huddle', sub: 'Google Calendar', kind: 'gcal' },
      { d: 2, h: 12, title: 'Lunch', sub: 'Google Calendar', kind: 'gcal' },
      { d: 4, h: 15, title: isC ? 'Facility tour' : 'Supervision', sub: 'Google Calendar', kind: 'gcal' },
      { d: 2, h: 16, title: 'Blocked', sub: 'Unavailable', kind: 'block' },
    ]
      .filter((e) => gcal === 'connected' || e.kind !== 'gcal')
      .concat(extra);
    const days = Array.from({ length: 5 }, (_, i) => {
      const d = new Date();
      const dow = d.getDay();
      d.setDate(d.getDate() - ((dow + 6) % 7) + i);
      return d;
    });
    const todayIdx = (new Date().getDay() + 6) % 7;
    const evSty = {
      booked: ['#eaf5fd', '#b9dcf6', '#0a5d96', '#3b7fb3'],
      gcal: ['#f1f4f7', '#dde4ec', '#1f3550', '#6b7f95'],
      block: ['repeating-linear-gradient(135deg,#f7f9fb 0 6px,#eef2f6 6px 12px)', '#e3eaf2', '#6b7f95', '#8a9bb0'],
      hold: ['#fff6e5', '#f6dfae', '#8a5a00', '#a07a2a'],
    };
    const upcoming = bookedEvents
      .filter((e) => e.kind === 'booked' || e.kind === 'hold')
      .sort((a, b) => a.d - b.d || a.h - b.h)
      .slice(0, 3)
      .map((e) => ({
        dow: days[e.d].toLocaleDateString('en-CA', { weekday: 'short' }),
        time: (e.h > 12 ? e.h - 12 : e.h) + (e.h >= 12 ? 'p' : 'a'),
        title: e.title,
        meta: e.sub,
        tint: evSty[e.kind][0],
        color: evSty[e.kind][2],
      }));
    const calRows = Array.from({ length: 10 }, (_, r) => {
      const h = 8 + r;
      return {
        label: (h > 12 ? h - 12 : h) + (h >= 12 ? ' pm' : ' am'),
        cells: days.map((_, d) => {
          const ev = bookedEvents.find((e) => e.d === d && e.h === h);
          const s = ev ? evSty[ev.kind] : null;
          return {
            has: !!ev,
            title: ev ? ev.title : '',
            sub: ev ? ev.sub : '',
            evBg: s ? s[0] : '',
            evBorder: s ? s[1] : '',
            evColor: s ? s[2] : '',
            evSub: s ? s[3] : '',
            cursor: ev ? 'default' : 'copy',
            bg: d === todayIdx ? '#fbfdff' : '#fff',
            add: () => {
              if (ev) return;
              this.setState((st) => ({
                extra: [
                  ...st.extra,
                  {
                    d,
                    h,
                    title: isC ? 'Open assessment slot' : 'Open consult slot',
                    sub: 'Bookable from your listing',
                    kind: 'hold',
                  },
                ],
              }));
              this.flash('Slot added — clients can book it from your listing');
            },
          };
        }),
      };
    });

    const srcData = isC
      ? [
          ['Your listing page', 38, '#0890E8'],
          ['City & province pages', 27, '#10233a'],
          ['Substance pages', 16, '#D82028'],
          ['Call tracking', 12, '#2fb46b'],
          ['Google Business', 7, '#F5A623'],
        ]
      : [
          ['Your profile page', 44, '#0890E8'],
          ['City pages', 29, '#10233a'],
          ['Concern filters', 15, '#D82028'],
          ['Call tracking', 8, '#2fb46b'],
          ['Rehab pages', 4, '#F5A623'],
        ];
    const sources = srcData.map(([label, p, color]) => ({ label, pct: p + '%', color }));
    const checks = [
      ['Add at least 6 photos', prof.photos >= 6, 'profile'],
      ['Connect Google Calendar', gcal === 'connected', 'calendar'],
      ['Reply to new leads', newCount === 0, 'leads'],
      ['Add a video introduction', false, 'profile'],
    ];
    const strength = Math.round(
      62 + (prof.photos >= 6 ? 12 : 0) + (gcal === 'connected' ? 10 : 0) + (newCount === 0 ? 8 : 0),
    );
    const todo = checks
      .filter((c) => !c[1])
      .slice(0, 3)
      .map(([label, , v]) => ({ label, go: go(v) }));

    const crmStats = [
      ['Open leads', String(leads.filter((l) => ['new', 'contacted', 'booked'].includes(l.stage)).length), '#10233a'],
      ['Awaiting reply', String(newCount), newCount ? '#c0262d' : '#1f8a52'],
      [
        isC ? 'Admitted (30d)' : 'New clients (30d)',
        String(leads.filter((l) => l.stage === 'admitted').length),
        '#1f8a52',
      ],
      [
        'Win rate',
        Math.round(
          (leads.filter((l) => l.stage === 'admitted').length /
            Math.max(1, leads.filter((l) => ['admitted', 'lost'].includes(l.stage)).length)) *
            100,
        ) + '%',
        '#0890E8',
      ],
    ].map(([k, v, color]) => ({ k, v, color }));

    const cur = leads.find((l) => l.id === openId);
    const ld = cur ? decorate(cur) : {};
    const firstName = ((user && user.name) || (isC ? 'Jane Doe' : prof.name)).split(' ')[0];
    const tpls = isC
      ? [
          [
            'Availability',
            'Thank you for reaching out. We currently have availability and can arrange an assessment as early as this week. What time works best for a call?',
          ],
          [
            'Coverage',
            'Many clients use extended health benefits toward treatment. If you share your provider, our admissions team can confirm what may be covered.',
          ],
          [
            'Book assessment',
            'We would be glad to set up a confidential assessment. You can pick a time that suits you here, or reply with a few options.',
          ],
        ]
      : [
          [
            'Availability',
            'Thanks for getting in touch. I have openings next week, including evenings online. Would a free 15-minute consultation be helpful first?',
          ],
          [
            'Fees',
            'Individual sessions are $160, and I keep a small number of sliding-scale spots. Receipts include my registration number for insurance.',
          ],
          [
            'Book consult',
            'I would be happy to meet for a free 15-minute consult. Let me know a couple of times that work for you.',
          ],
        ];
    const aiDraft = async () => {
      if (!cur || ai) return;
      this.setState({ ai: true });
      const prompt =
        'You are the admissions coordinator at ' +
        prof.name +
        (isC ? ', a private addiction treatment centre in Canada' : ', a registered therapist in Canada') +
        '. Write a warm, concise, professional reply email (max 110 words, no subject line, no placeholders in brackets) to ' +
        cur.name.split(' ')[0] +
        ' who wrote: "' +
        cur.message +
        '". Their interest: ' +
        cur.interest +
        '. Offer a next step. Sign off as ' +
        firstName +
        '.';
      let text = '';
      try {
        text = await window.claude.complete(prompt);
      } catch (e) {
        text =
          'Hi ' +
          cur.name.split(' ')[0] +
          ',\n\nThank you for reaching out — it takes courage. ' +
          tpls[0][1] +
          '\n\nWarmly,\n' +
          firstName;
      }
      this.setState({ ai: false, reply: (text || '').trim() });
    };
    const sendReply = () => {
      if (!cur || !reply.trim()) {
        this.flash('Write a reply first');
        return;
      }
      this.setState((s) => ({
        reply: '',
        leads: s.leads.map((l) =>
          l.id === cur.id
            ? {
                ...l,
                stage: l.stage === 'new' ? 'contacted' : l.stage,
                timeline: [{ k: 'mail', t: 'Email sent to ' + l.email, when: 'Just now' }, ...l.timeline],
              }
            : l,
        ),
      }));
      this.flash('Email sent to ' + cur.name);
    };
    const addNote = () => {
      if (!cur || !note.trim()) return;
      this.setState((s) => ({
        note: '',
        leads: s.leads.map((l) =>
          l.id === cur.id ? { ...l, timeline: [{ k: 'note', t: note.trim(), when: 'Just now' }, ...l.timeline] } : l,
        ),
      }));
    };
    const tlIcon = {
      in: [ic.msg, '#eaf5fd', '#0890E8'],
      move: [ic.move, '#f1ebfe', '#6d45d0'],
      mail: [ic.mail, '#e6f4ec', '#1f8a52'],
      note: [ic.note, '#fff6e5', '#b07400'],
      cal: [ic.cal, '#eaf5fd', '#0890E8'],
    };
    const bookFor = () => {
      if (!cur) return;
      const slot = {
        d: Math.min(4, todayIdx + 1),
        h: 11,
        title: (isC ? 'Assessment · ' : 'Consult · ') + cur.name,
        sub: gcal === 'connected' ? 'Synced to Google Calendar' : 'Video call',
        kind: 'booked',
      };
      this.setState((s) => ({
        extra: [...s.extra, slot],
        leads: s.leads.map((l) =>
          l.id === cur.id
            ? {
                ...l,
                stage: 'booked',
                timeline: [
                  {
                    k: 'cal',
                    t: 'Booked for ' + days[slot.d].toLocaleDateString('en-CA', { weekday: 'long' }) + ' 11:00 am',
                    when: 'Just now',
                  },
                  ...l.timeline,
                ],
              }
            : l,
        ),
      }));
      this.flash('Booked' + (gcal === 'connected' ? ' and added to Google Calendar' : ''));
    };

    const secDefs = isC
      ? [
          [
            'basics',
            'Centre details',
            ic.home,
            [
              ['name', 'Centre name'],
              ['phone', 'Admissions phone'],
            ],
          ],
          [
            'story',
            'Headline & description',
            ic.edit,
            [
              ['headline', 'Headline'],
              ['about', 'About', true],
            ],
          ],
          [
            'services',
            'Programs & services',
            ic.users,
            [],
            ['Residential', 'Medical detox', 'Outpatient', 'Family programs', 'Aftercare', 'Dual diagnosis', 'Online'],
          ],
          ['photos', 'Photos & video', ic.eye, []],
          ['pricing', 'Pricing', ic.card, [['price', 'Price range']]],
        ]
      : [
          [
            'basics',
            'Name & contact',
            ic.home,
            [
              ['name', 'Display name'],
              ['phone', 'Phone'],
            ],
          ],
          [
            'story',
            'Headline & bio',
            ic.edit,
            [
              ['headline', 'Headline'],
              ['about', 'About you', true],
            ],
          ],
          [
            'services',
            'Specialties',
            ic.users,
            [],
            ['Addiction', 'Alcohol use', 'Anxiety', 'Depression', 'Trauma', 'CBT', 'EMDR'],
          ],
          ['photos', 'Photo & video intro', ic.eye, []],
          ['pricing', 'Fees', ic.card, [['price', 'Session fee']]],
        ];
    const sections = secDefs.map(([k, title, icon, fs, chipOpts]) => {
      const open = openSec === k;
      const summary =
        k === 'services'
          ? prof.services.join(', ')
          : k === 'photos'
            ? prof.photos + ' photo' + (prof.photos === 1 ? '' : 's') + ' · no video yet'
            : fs
                .map((f) => prof[f[0]])
                .filter(Boolean)
                .join(' · ');
      const needs = k === 'photos' && prof.photos < 6;
      return {
        title,
        icon,
        summary,
        open,
        border: open ? '#0890E8' : '#e3eaf2',
        chev: open ? 'rotate(-135deg)' : 'rotate(45deg)',
        tag: needs ? 'Needs attention' : 'Complete',
        tagBg: needs ? '#fff6e5' : '#e6f4ec',
        tagColor: needs ? '#8a5a00' : '#1f8a52',
        toggle: () => this.setState({ openSec: open ? null : k }),
        save: () => {
          this.setState({ openSec: null });
          this.flash('Changes saved and live');
        },
        fields: fs.map(([fk, label, areaF]) => ({
          label,
          value: prof[fk],
          isArea: !!areaF,
          isInput: !areaF,
          onChange: (e) => {
            const v = e.target.value;
            this.setState((s) => ({ prof: { ...s.prof, [fk]: v } }));
          },
        })),
        hasChips: !!chipOpts,
        chips: (chipOpts || []).map((label) => {
          const on = prof.services.includes(label);
          return {
            label,
            toggle: () =>
              this.setState((s) => ({
                prof: {
                  ...s.prof,
                  services: on ? s.prof.services.filter((x) => x !== label) : [...s.prof.services, label],
                },
              })),
            bg: on ? '#0890E8' : '#fff',
            color: on ? '#fff' : '#1f3550',
            border: on ? '#0890E8' : '#dbe6f0',
          };
        }),
        hasPhotos: k === 'photos',
        photos: Array.from({ length: 6 }, (_, i) =>
          i < prof.photos
            ? {
                bg:
                  'url(/assets/img/' +
                  ['menu-1', 'home-hero', 'blog-inpatient', 'menu-3', 'home-program', 'prog-drug'][i] +
                  '.jpg)',
                bs: 'solid',
                label: '',
              }
            : { bg: '#f9fbfd', bs: 'dashed', label: i === prof.photos ? '+ Add' : '' },
        ),
      };
    });
    const statusDefs = isC
      ? [
          ['available', 'Beds available', 'Shown as a green badge on your listing', '#2fb46b'],
          ['waitlist', 'Waitlist', 'Families can join your waitlist', '#F5A623'],
          ['full', 'Currently full', 'Leads still come in for future dates', '#9aabbd'],
        ]
      : [
          ['available', 'Accepting new clients', 'Shown as a green badge on your profile', '#2fb46b'],
          ['waitlist', 'Waitlist', 'New clients can join your waitlist', '#F5A623'],
          ['full', 'Not accepting', 'Your profile stays visible', '#9aabbd'],
        ];

    const planName = isC ? 'Verified' : 'Featured',
      planPrice = isC ? '$199' : '$49.95';
    const upDefs = isC
      ? [
          ['Local', '$399/mo', ['1 City sponsorship', '1 Substance sponsorship', '1 Treatment sponsorship']],
          ['Growth', '$699/mo', ['1 Province + 2 Cities', '2 Substances', 'Advanced analytics']],
          ['Premium', '$1,299/mo', ['Up to 4 cities', '5 content placements', 'Priority visibility']],
        ]
      : [
          ['Professional', '$19.95/mo', ['Verified profile', 'City & province listing', 'Up to 8 specialties']],
          ['Featured', '$49.95/mo', ['Top of your city', 'Video introduction', 'Monthly analytics']],
          ['Featured Plus', '$79.95/mo', ['Province + 3 cities', 'Rehab & substance pages', 'Client reviews module']],
        ];
    const upgrades = upDefs.map(([name, price, features]) => {
      const current = name === planName;
      return {
        name,
        price,
        features,
        border: current ? '#0890E8' : '#e3eaf2',
        bg: current ? '#f3f9fe' : '#fff',
        btn: current ? 'Current plan' : 'Switch to ' + name,
        btnBg: current ? '#eaf5fd' : '#0890E8',
        btnColor: current ? '#0a5d96' : '#fff',
        pick: () =>
          this.flash(current ? 'This is your current plan' : 'Plan change requested — prorated on your next invoice'),
      };
    });
    const renew = new Date();
    renew.setMonth(renew.getMonth() + 1, 1);
    const invoices = [0, 1, 2, 3].map((i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - i, 1);
      return {
        date: d.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' }),
        desc: planName + ' subscription',
        amt: planPrice,
        dl: () => this.flash('Invoice downloaded'),
      };
    });

    const tog = (k, t, b) => ({
      t,
      b,
      track: notifs[k] ? '#0890E8' : '#cfdceb',
      knob: notifs[k] ? '21px' : '3px',
      toggle: () => this.setState((s) => ({ notifs: { ...s.notifs, [k]: !s.notifs[k] } })),
    });
    const heatHours = ['8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p'];
    const heat = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, di) => ({
      d,
      cells: heatHours.map((h, hi) => {
        const v = Math.max(
          0,
          Math.min(
            1,
            0.25 +
              Math.sin((hi + 2) / 3.2) * 0.35 +
              (di < 5 ? 0.15 : -0.1) +
              seed(di * 12 + hi, 7, 0.35) -
              0.12 +
              (hi >= 9 ? 0.18 : 0),
          ),
        );
        return { bg: 'rgba(8,144,232,' + (0.08 + v * 0.85).toFixed(2) + ')', t: d + ' ' + h };
      }),
    }));
    const funnelDefs = isC
      ? [
          ['Listing views', sumV],
          ['Contact clicks', Math.round(sumV * 0.11)],
          ['Leads', sumL],
          ['Assessments', Math.round(sumL * 0.42)],
          ['Admissions', Math.round(sumL * 0.21)],
        ]
      : [
          ['Profile views', sumV],
          ['Contact clicks', Math.round(sumV * 0.12)],
          ['Enquiries', sumL],
          ['Consults', Math.round(sumL * 0.5)],
          ['New clients', Math.round(sumL * 0.3)],
        ];
    const fMax = funnelDefs[0][1];
    const funnel = funnelDefs.map(([k, v], i) => ({
      k,
      v: v.toLocaleString('en-CA'),
      h: Math.max(8, Math.sqrt(v / fMax) * 100) + '%',
      bg: ['#0890E8', '#2a9fec', '#5bb4f0', '#8b5cf6', '#2fb46b'][i],
      rate: i ? Math.round((v / funnelDefs[i - 1][1]) * 100) + '% of previous' : '',
    }));
    const pageDefs = isC
      ? [
          ['Toronto Rehabs', 'City page', 812, 'Organic'],
          ['Alcohol Addiction', 'Substance page', 486, 'Organic'],
          ['Ontario Rehabs', 'Province page', 402, 'Organic'],
          ['Medical Detox in Canada', 'Treatment page', 233, 'Upgrade to sponsor'],
          ['Homepage · Top rated', 'Homepage', 118, 'Organic'],
        ]
      : [
          ['Therapists in Toronto', 'City page', 640, 'Featured'],
          ['Anxiety filter', 'Concern filter', 322, 'Organic'],
          ['Therapists in Ontario', 'Province page', 288, 'Organic'],
          ['Alcohol Addiction', 'Substance page', 91, 'Featured Plus'],
          ['Therapist directory', 'Directory', 77, 'Organic'],
        ];
    const pages = pageDefs.map(([page, kind, v, tag]) => ({
      page,
      kind,
      views: v.toLocaleString('en-CA'),
      tag,
      tagBg: tag === 'Organic' ? '#f1f4f7' : '#eaf5fd',
      tagColor: tag === 'Organic' ? '#516378' : '#0a5d96',
    }));
    const sTerms = isC
      ? [
          ['rehab toronto', 184],
          ['alcohol detox ontario', 131],
          ['residential treatment', 96],
          ['fentanyl detox', 74],
          ['private rehab', 61],
          ['dual diagnosis', 42],
          ['couples rehab', 28],
          ['luxury rehab', 19],
        ]
      : [
          ['therapist toronto', 162],
          ['addiction counsellor', 118],
          ['anxiety therapy online', 94],
          ['cbt therapist', 66],
          ['couples therapy', 41],
          ['emdr toronto', 33],
          ['sliding scale', 27],
          ['grief counselling', 12],
        ];
    const tMax = sTerms[0][1];
    const searches = sTerms.map(([term, n]) => {
      const r = n / tMax;
      return {
        term,
        n: String(n),
        size: (13 + r * 4).toFixed(1) + 'px',
        bg: 'rgba(8,144,232,' + (0.06 + r * 0.16).toFixed(2) + ')',
        color: r > 0.5 ? '#0a5d96' : '#1f3550',
      };
    });

    const notifList = [
      {
        t: 'New lead: ' + (leads[0] ? leads[0].name : ''),
        b: leads[0] ? leads[0].interest + ' · ' + leads[0].ago : '',
        icon: ic.users,
        iconBg: '#fdeceb',
        iconColor: '#D82028',
        go: () => {
          this.setState({ view: 'leads', notifOpen: false, openId: leads[0] && leads[0].id });
        },
      },
      {
        t: 'Missed call tracked',
        b: '(647) 555-0114 · 1 hr ago',
        icon: ic.phone,
        iconBg: '#fff6e5',
        iconColor: '#b07400',
        go: go('leads'),
      },
      {
        t: 'Your listing reached ' + Math.round(sumV / 100) * 100 + ' views',
        b: 'Last 30 days',
        icon: ic.chart,
        iconBg: '#eaf5fd',
        iconColor: '#0890E8',
        go: go('analytics'),
      },
      {
        t: 'Invoice paid',
        b: planName + ' · ' + planPrice,
        icon: ic.card,
        iconBg: '#e6f4ec',
        iconColor: '#1f8a52',
        go: go('billing'),
      },
    ].map((n) => ({ ...n, bg: notifRead ? '#fff' : '#f7fbff' }));

    const hr = new Date().getHours();
    const tableColsV = mid ? 'minmax(0,1.3fr) minmax(0,1.2fr) minmax(0,1fr) auto 48px' : 'minmax(0,1fr) auto 40px';
    return {
      shellCols: sideOn ? (sideWide ? '252px minmax(0,1fr)' : '80px minmax(0,1fr)') : 'minmax(0,1fr)',
      showSide: sideOn,
      sideWide,
      sidePad: sideWide ? '16px' : '12px',
      logoJustify: sideWide ? 'flex-start' : 'center',
      logoSrc: '/assets/logo-white.png',
      logoH: sideWide ? '40px' : '22px',
      sideLabelDisplay: sideWide ? 'inline' : 'none',
      nav,
      orgName: prof.name,
      userPad: sideWide ? '10px' : '6px',
      goBilling: go('billing'),
      goCalendar: go('calendar'),
      goLeads: go('leads'),
      planName,
      planPrice,
      iconHelp: this.icon([
        { t: 'circle', a: { cx: 12, cy: 12, r: 9 } },
        'M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14',
        'M12 17.5v.01',
      ]),
      showMobileNav: !sideOn,
      mainPadX: mid ? '28px' : '16px',
      mainPad: mid ? '26px 28px 60px' : '18px 16px 48px',
      searchDisplay: mid ? 'flex' : 'none',
      demoDisplay: vw >= 1000 ? 'inline-flex' : 'none',
      q,
      setQ: (e) => this.setState({ q: e.target.value, view: view === 'leads' ? view : 'leads' }),
      gcalDot: gcal === 'connected' ? '#2fb46b' : '#9aabbd',
      gcalAnim: gcal === 'connected' ? 'pdPulse 2.4s infinite' : 'none',
      gcalLabel: gcal === 'connected' ? 'Calendar synced' : 'Calendar off',
      gcalLabelDisplay: vw >= 900 ? 'inline' : 'none',
      toggleNotif: () => this.setState({ notifOpen: !notifOpen }),
      notifOpen,
      notifs: notifList,
      notifDot: notifRead ? 'none' : 'block',
      clearNotif: () => this.setState({ notifRead: true }),
      initials: firstName.slice(0, 1).toUpperCase() + (isC ? 'L' : 'C'),
      h1Size: mid ? '30px' : '26px',
      today: new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' }),
      dayPart: hr < 12 ? 'morning' : hr < 18 ? 'afternoon' : 'evening',
      firstName,
      ranges: [
        [7, '7 days'],
        [30, '30 days'],
        [90, '90 days'],
      ].map(([r, label]) => ({
        label,
        select: () => this.setState({ range: r, hover: -1 }),
        bg: range === r ? '#10233a' : 'transparent',
        color: range === r ? '#fff' : '#516378',
      })),
      isOverview: view === 'overview',
      isLeads: view === 'leads',
      isCalendar: view === 'calendar',
      isAnalytics: view === 'analytics',
      isProfile: view === 'profile',
      isBilling: view === 'billing',
      isSettings: view === 'settings',
      bannerCols: vw >= 980 ? 'minmax(0,1fr) auto' : 'minmax(0,1fr)',
      verifyTitle: prof.name + ' is live and Verified',
      verifyBody: 'Verified badge active · Next annual re-check in 11 months',
      verifySteps: [
        ['Paid', true],
        ['Verified', true],
        ['Live', true],
      ].map(([label]) => ({ label, bg: 'rgba(255,255,255,.12)', color: '#fff', dot: '#2fb46b' })),
      kpiCols: wide ? 'repeat(4,minmax(0,1fr))' : vw >= 560 ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      kpis,
      twoWide: wide ? 'minmax(0,1.65fr) minmax(0,1fr)' : 'minmax(0,1fr)',
      threeCols: wide ? 'repeat(3,minmax(0,1fr))' : mid ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      twoEven: vw >= 1000 ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      grid: [40, 90, 140, 190].map((y) => ({ y: String(y) })),
      bars,
      hits,
      chartLine: line,
      chartArea: area,
      hoverX: hover >= 0 ? px(hover).toFixed(1) : '-10',
      hoverOp: hover >= 0 ? '1' : '0',
      tipLeft: hover >= 0 ? Math.min(88, Math.max(12, (px(hover) / W) * 100)) + '%' : '50%',
      tipDate: hover >= 0 ? dayLabel(hover) : '',
      tipViews: hover >= 0 ? String(views[hover]) : '',
      tipLeads: hover >= 0 ? String(lds[hover]) : '',
      hotLeads: hot,
      upcoming,
      sources,
      strengthPct: Math.min(100, strength) + '%',
      strengthColor: strength >= 85 ? '#2fb46b' : '#0890E8',
      strengthOffset: String(113 - (113 * Math.min(100, strength)) / 100),
      todo,
      leadSummary: newCount
        ? newCount + ' new lead' + (newCount === 1 ? '' : 's') + ' waiting for a reply. Drag cards between stages.'
        : 'You\u2019re all caught up. Drag cards between stages.',
      leadViews: [
        ['board', 'Pipeline'],
        ['table', 'List'],
      ].map(([k, label]) => ({
        label,
        select: () => this.setState({ leadView: k }),
        bg: leadView === k ? '#10233a' : 'transparent',
        color: leadView === k ? '#fff' : '#516378',
      })),
      isBoard: leadView === 'board',
      isTable: leadView === 'table',
      board,
      boardCols: vw >= 1300 ? 'repeat(5,minmax(0,1fr))' : 'repeat(5,240px)',
      crmStats,
      leadRows: filtered.map(decorate),
      tableCols: tableColsV,
      tableExtra: mid ? 'block' : 'none',
      exportCsv: () => this.flash('Exported ' + leads.length + ' leads to CSV'),
      addLead: () => {
        const id = Date.now() % 100000;
        this.setState((s) => ({
          leads: [
            {
              id,
              name: 'New walk-in lead',
              stage: 'new',
              interest: isC ? 'Residential · To confirm' : 'Individual · To confirm',
              source: 'Added manually',
              ago: 'Just now',
              hrs: 0,
              score: 60,
              phone: '—',
              email: '—',
              message: 'Added manually from the dashboard.',
              who: '—',
              insurance: '—',
              urgency: '—',
              timeline: [{ k: 'in', t: 'Lead added manually', when: 'Just now' }],
            },
            ...s.leads,
          ],
          openId: id,
          view: 'leads',
        }));
      },
      gcalSub:
        gcal === 'connected'
          ? 'Two-way sync on · bookings added automatically'
          : gcal === 'syncing'
            ? 'Connecting…'
            : 'Not connected',
      gcalSubColor: gcal === 'connected' ? '#1f8a52' : '#6b7f95',
      gcalBtn: gcal === 'connected' ? 'Disconnect' : gcal === 'syncing' ? 'Connecting' : 'Connect',
      gcalBtnBg: gcal === 'connected' ? '#f1f4f7' : '#0890E8',
      gcalBtnColor: gcal === 'connected' ? '#1f3550' : '#fff',
      gcalSpin: gcal === 'syncing' ? 'block' : 'none',
      toggleGcal: () => {
        if (gcal === 'connected') {
          this.setState({ gcal: 'off' });
          this.flash('Google Calendar disconnected');
        } else if (gcal === 'off') {
          this.setState({ gcal: 'syncing' });
          setTimeout(() => {
            this.setState({ gcal: 'connected' });
            this.flash('Google Calendar connected');
          }, 1100);
        }
      },
      calDays: days.map((d, i) => ({
        dow: d.toLocaleDateString('en-CA', { weekday: 'short' }),
        date: String(d.getDate()),
        color: i === todayIdx ? '#0890E8' : '#10233a',
      })),
      calRows,
      calLegend: [
        ['Bookings from leads', 'booked'],
        ['Google Calendar', 'gcal'],
        ['Open slots', 'hold'],
        ['Unavailable', 'block'],
      ].map(([label, k]) => ({ label, bg: evSty[k][0], border: evSty[k][1] })),
      funnel,
      funnelCols: vw >= 900 ? 'repeat(5,minmax(0,1fr))' : 'repeat(3,minmax(0,1fr))',
      pages,
      searches,
      heat,
      heatHours,
      insight: isC
        ? 'Most enquiries arrive weekday evenings. Turning on SMS alerts helps you reply while families are still deciding.'
        : 'Evening online availability is the most-searched combination for your city. Consider opening one more evening slot.',
      publicHref: isC ? '/centre' : '/therapist-profile',
      sections,
      photoCols: mid ? 'repeat(6,minmax(0,1fr))' : 'repeat(3,minmax(0,1fr))',
      statusCols: vw >= 900 ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
      statusOpts: statusDefs.map(([k, label, body, dot]) => {
        const on = status === k;
        return {
          label,
          body,
          dot,
          anim: on && k === 'available' ? 'pdPulse 2.4s infinite' : 'none',
          border: on ? dot : '#e3eaf2',
          bg: on ? '#fff' : '#fbfcfd',
          select: () => {
            this.setState({ status: k });
            this.flash('Status updated on your listing: ' + label);
          },
        };
      }),
      renewDate: renew.toLocaleDateString('en-CA', { month: 'long', day: 'numeric' }),
      cardLabel: 'Visa ending 4242',
      upgrades,
      upgradeCols: vw >= 1300 ? 'repeat(3,minmax(0,1fr))' : vw >= 640 ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
      invoices,
      cancelSub: () => this.flash('Contact support to cancel — we\u2019ll confirm within one business day'),
      notifSettings: [
        tog('email', 'Email me new leads', 'Instant email for every enquiry'),
        tog('sms', 'Text me urgent leads', 'SMS when a lead scores 85+'),
        tog('digest', 'Weekly performance digest', 'Views, leads and tips every Monday'),
        tog('reviews', 'New review alerts', 'Know when someone reviews you'),
      ],
      integrations: [
        [
          'G',
          'Google Calendar',
          gcal === 'connected' ? 'Connected · two-way sync' : 'Not connected',
          gcal === 'connected',
        ],
        ['GB', 'Google Business Profile', 'Import reviews & track calls', false],
        ['Z', 'Zapier', 'Send leads to your own CRM', false],
      ].map(([mark, name, sub, on]) => ({
        mark,
        name,
        sub,
        subColor: on ? '#1f8a52' : '#6b7f95',
        btn: on ? 'Manage' : 'Connect',
        btnBg: on ? '#fff' : '#0890E8',
        btnColor: on ? '#1f3550' : '#fff',
        btnBorder: on ? '#e3eaf2' : '#0890E8',
        toggle: () => {
          if (name === 'Google Calendar') {
            this.setState({ view: 'calendar' });
          } else this.flash(name + ' connection started');
        },
      })),
      team: isC
        ? [
            {
              i: firstName.slice(0, 1),
              n: (user && user.name) || 'Jane Doe',
              e: (user && user.email) || 'admissions@lakeside.ca',
              r: 'Owner',
            },
            { i: 'R', n: 'Robert L.', e: 'intake@lakeside.ca', r: 'Admissions' },
          ]
        : [
            {
              i: firstName.slice(0, 1),
              n: (user && user.name) || prof.name,
              e: (user && user.email) || 'maya@example.ca',
              r: 'Owner',
            },
          ],
      inviteTeam: () => this.flash('Invite sent'),
      drawerOpen: !!cur,
      drawerW: vw >= 600 ? '480px' : '100%',
      ld,
      closeLead: () => this.setState({ openId: null }),
      quick: cur
        ? [
            ['Call', 'tel:' + cur.phone, ic.phone, '#fdeceb', '#c0262d', null],
            ['Email', 'mailto:' + cur.email, ic.mail, '#eaf5fd', '#0a5d96', null],
            [
              isC ? 'Book' : 'Book',
              '#',
              ic.cal,
              '#f1ebfe',
              '#5b34b8',
              (e) => {
                e.preventDefault();
                bookFor();
              },
            ],
            [
              'Won',
              '#',
              ic.star,
              '#e6f4ec',
              '#1f8a52',
              (e) => {
                e.preventDefault();
                moveLead(cur.id, 'admitted');
                this.flash('Marked as ' + stageOf('admitted')[1]);
              },
            ],
          ].map(([label, href, icon, bg, color, act]) => ({ label, href, icon, bg, color, act: act || (() => {}) }))
        : [],
      ldStages: stages.map(([k, label, color]) => {
        const on = cur && cur.stage === k;
        return {
          label,
          select: () => cur && moveLead(cur.id, k),
          bg: on ? color : '#fff',
          color: on ? '#fff' : '#1f3550',
          border: on ? color : '#e3eaf2',
        };
      }),
      ldFacts: cur
        ? [
            ['Phone', cur.phone],
            ['Email', cur.email],
            ['Enquiring for', cur.who || '—'],
            ['Payment', cur.insurance || '—'],
            ['Urgency', cur.urgency || '—'],
            ['Interest', cur.interest],
          ].map(([k, v]) => ({ k, v }))
        : [],
      reply,
      setReply: (e) => this.setState({ reply: e.target.value }),
      aiDraft,
      aiLabel: ai ? 'Drafting…' : 'Draft with AI',
      aiSpin: ai ? 'block' : 'none',
      aiIcon: ai ? 'none' : 'flex',
      templates: tpls.map(([label, text]) => ({
        label,
        use: () =>
          this.setState({
            reply: 'Hi ' + (cur ? cur.name.split(' ')[0] : '') + ',\n\n' + text + '\n\nWarmly,\n' + firstName,
          }),
      })),
      sendReply,
      note,
      setNote: (e) => this.setState({ note: e.target.value }),
      addNote,
      ldTimeline: cur
        ? cur.timeline.map((t) => {
            const x = tlIcon[t.k] || tlIcon.in;
            return { t: t.t, when: t.when, icon: x[0], bg: x[1], color: x[2] };
          })
        : [],
      toastOn: !!toast,
      toast,
      iconSearch: this.icon([{ t: 'circle', a: { cx: 11, cy: 11, r: 7 } }, 'M20 20l-3.5-3.5']),
      iconBell: this.icon(['M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8', 'M10.3 21a1.9 1.9 0 0 0 3.4 0']),
      iconShield: this.icon(['M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z', 'M9 12l2 2 4-4'], {
        width: 22,
        height: 22,
      }),
      iconCheckTiny: this.icon(['M5 12.5l4.5 4.5L19 7.5'], { width: 11, height: 11, strokeWidth: 3.2 }),
      iconCheckTiny2: this.icon(['M5 12.5l4.5 4.5L19 7.5'], { width: 12, height: 12, strokeWidth: 3 }),
      iconArrowSm: this.icon(['M5 12h14', 'M13 6l6 6-6 6'], { width: 15, height: 15, strokeWidth: 2.2 }),
      iconDownload: this.icon(['M12 4v12', 'M7 11l5 5 5-5', 'M5 20h14'], { width: 16, height: 16, strokeWidth: 2 }),
      iconPlus: this.icon(['M12 5v14', 'M5 12h14'], { width: 16, height: 16, strokeWidth: 2.2 }),
      iconEye: ic.eye,
      iconDoc: ic.note,
      iconSpark: this.icon(
        [
          'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z',
          'M19 17l.7 1.8 1.8.7-1.8.7L19 22l-.7-1.8-1.8-.7 1.8-.7z',
        ],
        { width: 15, height: 15, strokeWidth: 2 },
      ),
    };
  }
}

/* ───────────────────────── markup ───────────────────────── */
function template(v) {
  const {
    addLead,
    addNote,
    aiDraft,
    aiIcon,
    aiLabel,
    aiSpin,
    bannerCols,
    bars,
    board,
    boardCols,
    calDays,
    calLegend,
    calRows,
    cancelSub,
    cardLabel,
    chartArea,
    chartLine,
    clearNotif,
    closeLead,
    crmStats,
    dayPart,
    demoDisplay,
    drawerOpen,
    drawerW,
    exportCsv,
    firstName,
    funnel,
    funnelCols,
    gcalAnim,
    gcalBtn,
    gcalBtnBg,
    gcalBtnColor,
    gcalDot,
    gcalLabel,
    gcalLabelDisplay,
    gcalSpin,
    gcalSub,
    gcalSubColor,
    goBilling,
    goCalendar,
    goLeads,
    grid,
    h1Size,
    heat,
    heatHours,
    hits,
    hotLeads,
    hoverOp,
    hoverX,
    iconArrowSm,
    iconBell,
    iconCheckTiny,
    iconCheckTiny2,
    iconDoc,
    iconDownload,
    iconEye,
    iconHelp,
    iconPlus,
    iconSearch,
    iconShield,
    iconSpark,
    initials,
    insight,
    integrations,
    inviteTeam,
    invoices,
    isAnalytics,
    isBilling,
    isBoard,
    isCalendar,
    isLeads,
    isOverview,
    isProfile,
    isSettings,
    isTable,
    kpiCols,
    kpis,
    ld,
    ldFacts,
    ldStages,
    ldTimeline,
    leadRows,
    leadSummary,
    leadViews,
    logoH,
    logoJustify,
    mainPad,
    mainPadX,
    nav,
    note,
    notifDot,
    notifOpen,
    notifSettings,
    notifs,
    orgName,
    pages,
    photoCols,
    planName,
    planPrice,
    publicHref,
    q,
    quick,
    ranges,
    renewDate,
    reply,
    searchDisplay,
    searches,
    sections,
    sendReply,
    setNote,
    setQ,
    setReply,
    shellCols,
    showMobileNav,
    showSide,
    sideLabelDisplay,
    sidePad,
    sideWide,
    sources,
    statusCols,
    statusOpts,
    strengthColor,
    strengthOffset,
    strengthPct,
    tableCols,
    tableExtra,
    team,
    templates,
    threeCols,
    tipDate,
    tipLeads,
    tipLeft,
    tipViews,
    toast,
    toastOn,
    today,
    todo,
    toggleGcal,
    toggleNotif,
    twoEven,
    twoWide,
    upcoming,
    upgradeCols,
    upgrades,
    userPad,
    verifyBody,
    verifySteps,
    verifyTitle,
  } = v;
  return (
    <>
      <div
        style={$css(
          `min-height:100vh;display:grid;grid-template-columns:${shellCols ?? ''};background:radial-gradient(900px 520px at 100% -10%,rgba(8,144,232,.10),rgba(8,144,232,0) 60%),radial-gradient(700px 480px at 30% 110%,rgba(216,32,40,.05),rgba(216,32,40,0) 60%),#f3f6fa`,
        )}
        data-rc-dyn="1"
      >
        {showSide ? (
          <>
            <aside
              data-screen-label="Dashboard sidebar"
              style={$css(
                `position:sticky;top:0;height:100vh;background:radial-gradient(420px 260px at 0% 0%,rgba(8,144,232,.28),rgba(8,144,232,0) 70%),linear-gradient(180deg,#12294a 0%,#0c1b2f 100%);color:#b7c7d8;box-shadow:inset -1px 0 0 rgba(255,255,255,.06);display:flex;flex-direction:column;gap:22px;padding:22px ${sidePad ?? ''};overflow-y:auto`,
              )}
            >
              <$A
                href="/"
                style={$css(`display:flex;align-items:center;justify-content:${logoJustify ?? ''};min-height:44px`)}
              >
                <img
                  src="/assets/logo-white.png"
                  alt="Addiction Rehab Centres Canada"
                  style={$css(`height:${logoH ?? ''};width:auto;display:block`)}
                />
              </$A>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {$list(nav).map((n, $index) => (
                  <Fragment key={$index}>
                    <button
                      className="scpy scp1s"
                      onClick={n?.go}
                      title={n?.label}
                      style={$css(
                        `appearance:none;border:0;cursor:pointer;display:flex;align-items:center;gap:12px;height:44px;padding:0 12px;border-radius:12px;background:${n?.bg ?? ''};color:${n?.color ?? ''};box-shadow:${n?.shadow ?? ''};font:600 14.5px Figtree,sans-serif;text-align:left;justify-content:${n?.justify ?? ''};transition:background .18s ease,color .18s ease,box-shadow .2s ease,transform .12s ease-out`,
                      )}
                    >
                      <span style={{ display: 'flex', flexShrink: '0' }}>{$i(n?.icon)}</span>
                      <span style={$css(`display:${n?.labelDisplay ?? ''};flex:1`)}>{$i(n?.label)}</span>
                      <span
                        style={$css(
                          `display:${n?.badgeDisplay ?? ''};min-width:22px;height:22px;padding:0 7px;border-radius:999px;background:#D82028;color:#fff;font:600 11.5px Jost,sans-serif;align-items:center;justify-content:center`,
                        )}
                      >
                        {$i(n?.badge)}
                      </span>
                    </button>
                  </Fragment>
                ))}
              </nav>
              {sideWide ? (
                <>
                  <div
                    style={{
                      marginTop: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      padding: '16px',
                      borderRadius: '20px',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,.08)',
                      background: 'linear-gradient(160deg,rgba(8,144,232,.28),rgba(8,144,232,.08))',
                      border: '1px solid rgba(124,196,245,.25)',
                    }}
                  >
                    <span
                      style={{
                        font: '600 12px Figtree,sans-serif',
                        letterSpacing: '.1em',
                        textTransform: 'uppercase',
                        color: '#7cc4f5',
                      }}
                    >
                      {$i(planName)} plan
                    </span>
                    <span style={{ font: '600 16px/1.3 Jost,sans-serif', color: '#fff' }}>
                      {'Get sponsored placement on city & substance pages'}
                    </span>
                    <button
                      onClick={goBilling}
                      style={{
                        appearance: 'none',
                        border: '0',
                        cursor: 'pointer',
                        height: '38px',
                        borderRadius: '999px',
                        background: '#fff',
                        color: '#0a5d96',
                        font: '600 13.5px Jost,sans-serif',
                      }}
                    >
                      See upgrade options
                    </button>
                  </div>
                </>
              ) : null}
              <div
                style={$css(
                  `display:flex;align-items:center;gap:10px;justify-content:${logoJustify ?? ''};padding:${userPad ?? ''};border-radius:16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)`,
                )}
              >
                <span
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '11px',
                    background: 'linear-gradient(135deg,#1aa0f0,#0a6fc0)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    font: '600 13px Jost,sans-serif',
                    flexShrink: '0',
                  }}
                >
                  {$i(initials)}
                </span>
                <span style={$css(`display:${sideLabelDisplay ?? ''};min-width:0;flex-direction:column`)}>
                  <span
                    style={{
                      display: 'block',
                      font: '600 14px Jost,sans-serif',
                      color: '#fff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {$i(orgName)}
                  </span>
                  <span style={{ display: 'block', font: '500 12px Figtree,sans-serif', color: '#9fb3c8' }}>
                    {$i(planName)} · Verified
                  </span>
                </span>
              </div>
              <$A
                className="scpe"
                href="tel:+18558854747"
                style={$css(
                  `display:flex;align-items:center;gap:10px;justify-content:${logoJustify ?? ''};color:#b7c7d8;font:500 13px Figtree,sans-serif`,
                )}
              >
                <span style={{ display: 'flex' }}>{$i(iconHelp)}</span>
                <span style={$css(`display:${sideLabelDisplay ?? ''}`)}>Provider support</span>
              </$A>
            </aside>
          </>
        ) : null}
        <div style={{ minWidth: '0', display: 'flex', flexDirection: 'column' }}>
          <header
            style={$css(
              `position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:14px;height:72px;padding:0 ${mainPadX ?? ''};background:rgba(246,249,252,.78);backdrop-filter:blur(16px) saturate(1.4);-webkit-backdrop-filter:blur(16px) saturate(1.4);border-bottom:1px solid rgba(227,234,242,.8)`,
            )}
          >
            {showMobileNav ? (
              <>
                <$A href="/">
                  <img
                    src="/assets/logo.png"
                    alt="Addiction Rehab Centres Canada"
                    style={{ height: '34px', width: 'auto', display: 'block' }}
                  />
                </$A>
              </>
            ) : null}
            <div
              style={$css(
                `display:${searchDisplay ?? ''};align-items:center;gap:10px;flex:1;max-width:420px;height:44px;padding:0 14px;border-radius:14px;background:#fff;border:1px solid #e3eaf2`,
              )}
            >
              {' '}
              <span style={{ display: 'flex', color: '#6b7f95' }}>{$i(iconSearch)}</span>{' '}
              <input
                value={$val(q)}
                onChange={setQ}
                placeholder="Search leads by name, program or source"
                style={{
                  flex: '1',
                  minWidth: '0',
                  border: '0',
                  outline: 'none',
                  background: 'transparent',
                  font: '500 14.5px Figtree,sans-serif',
                  color: '#10233a',
                }}
              />{' '}
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={$css(
                  `display:${demoDisplay ?? ''};height:28px;padding:0 10px;border-radius:999px;background:#fff6e5;border:1px solid #f6dfae;color:#8a5a00;font:600 12px Figtree,sans-serif;align-items:center`,
                )}
              >
                Demo data
              </span>
              <button
                onClick={goCalendar}
                title="Google Calendar sync"
                style={{
                  appearance: 'none',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: '12px',
                  background: '#fff',
                  border: '1px solid #e3eaf2',
                  color: '#1f3550',
                  font: '600 13px Figtree,sans-serif',
                }}
              >
                <span
                  style={$css(
                    `width:8px;height:8px;border-radius:50%;background:${gcalDot ?? ''};animation:${gcalAnim ?? ''}`,
                  )}
                />
                <span style={$css(`display:${gcalLabelDisplay ?? ''}`)}>{$i(gcalLabel)}</span>
              </button>
              <button
                onClick={toggleNotif}
                aria-label="Notifications"
                style={{
                  appearance: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: '#fff',
                  border: '1px solid #e3eaf2',
                  color: '#1f3550',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {$i(iconBell)}
                <span
                  style={$css(
                    `position:absolute;top:6px;right:6px;width:9px;height:9px;border-radius:50%;background:#D82028;border:2px solid #fff;display:${notifDot ?? ''}`,
                  )}
                />
              </button>
              <span
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: '#0890E8',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  font: '600 14px Jost,sans-serif',
                }}
              >
                {$i(initials)}
              </span>
            </div>
            {notifOpen ? (
              <>
                <div
                  style={$css(
                    `position:absolute;right:${mainPadX ?? ''};top:66px;width:340px;max-width:calc(100vw - 32px);background:#fff;border:1px solid #e3eaf2;border-radius:20px;padding:8px;box-shadow:0 30px 60px -30px rgba(16,35,58,.45);animation:pdFade .18s ease-out`,
                  )}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '8px 10px',
                    }}
                  >
                    <span style={{ font: '600 15px Jost,sans-serif' }}>Notifications</span>
                    <button
                      onClick={clearNotif}
                      style={{
                        appearance: 'none',
                        border: '0',
                        background: 'transparent',
                        cursor: 'pointer',
                        font: '600 12.5px Figtree,sans-serif',
                        color: '#0890E8',
                      }}
                    >
                      Mark all read
                    </button>
                  </div>
                  {$list(notifs).map((nt, $index) => (
                    <Fragment key={$index}>
                      <button
                        className="scp17"
                        onClick={nt?.go}
                        style={$css(
                          `appearance:none;border:0;cursor:pointer;width:100%;text-align:left;display:flex;gap:12px;padding:10px;border-radius:14px;background:${nt?.bg ?? ''}`,
                        )}
                      >
                        <span
                          style={$css(
                            `width:34px;height:34px;border-radius:11px;background:${nt?.iconBg ?? ''};color:${nt?.iconColor ?? ''};display:grid;place-items:center;flex-shrink:0`,
                          )}
                        >
                          {$i(nt?.icon)}
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                          <span style={{ font: '600 14px Figtree,sans-serif', color: '#10233a' }}>{$i(nt?.t)}</span>
                          <span style={{ fontSize: '12.5px', color: '#6b7f95' }}>{$i(nt?.b)}</span>
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
              </>
            ) : null}
          </header>
          {showMobileNav ? (
            <>
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  padding: '10px 16px',
                  background: '#10233a',
                  scrollbarWidth: 'none',
                }}
              >
                {$list(nav).map((n, $index) => (
                  <Fragment key={$index}>
                    <button
                      onClick={n?.go}
                      style={$css(
                        `appearance:none;border:0;cursor:pointer;flex-shrink:0;display:inline-flex;align-items:center;gap:8px;height:38px;padding:0 14px;border-radius:999px;background:${n?.bg ?? ''};color:${n?.color ?? ''};font:600 13.5px Figtree,sans-serif`,
                      )}
                    >
                      {$i(n?.label)}
                    </button>
                  </Fragment>
                ))}
              </div>
            </>
          ) : null}
          <main style={$css(`padding:${mainPad ?? ''};display:flex;flex-direction:column;gap:22px;min-width:0`)}>
            {isOverview ? (
              <>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '22px', animation: 'pdFade .3s ease-out' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ font: '500 14px Figtree,sans-serif', color: '#6b7f95' }}>{$i(today)}</span>
                      <h1 style={$css(`font-size:${h1Size ?? ''};letter-spacing:-.02em`)}>
                        Good {$i(dayPart)},{' '}
                        <span
                          style={{
                            background: 'linear-gradient(90deg,#0a6fc0,#0890E8)',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                          }}
                        >
                          {$i(firstName)}
                        </span>
                      </h1>
                    </div>
                    <div
                      style={{
                        display: 'inline-flex',
                        padding: '4px',
                        borderRadius: '999px',
                        background: '#fff',
                        border: '1px solid #e6edf5',
                        boxShadow: '0 8px 20px -16px rgba(16,35,58,.35)',
                      }}
                    >
                      {$list(ranges).map((r, $index) => (
                        <Fragment key={$index}>
                          <button
                            onClick={r?.select}
                            style={$css(
                              `appearance:none;border:0;cursor:pointer;height:34px;padding:0 14px;border-radius:999px;background:${r?.bg ?? ''};color:${r?.color ?? ''};font:600 13px Figtree,sans-serif`,
                            )}
                          >
                            {$i(r?.label)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div
                    style={$css(
                      `display:grid;grid-template-columns:${bannerCols ?? ''};gap:16px;align-items:center;padding:18px 20px;border-radius:22px;background:radial-gradient(420px 200px at 90% 0%,rgba(124,196,245,.35),rgba(124,196,245,0) 70%),linear-gradient(120deg,#10233a 0%,#0a4f86 70%,#0a6fc0 100%);color:#fff;position:relative;overflow:hidden;box-shadow:0 24px 50px -32px rgba(10,79,134,.8)`,
                    )}
                    data-rc-dyn="1"
                  >
                    <span
                      style={{
                        position: 'absolute',
                        right: '-60px',
                        top: '-60px',
                        width: '220px',
                        height: '220px',
                        borderRadius: '50%',
                        border: '40px solid rgba(255,255,255,.06)',
                      }}
                    />
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <span
                        style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '14px',
                          background: 'rgba(255,255,255,.14)',
                          display: 'grid',
                          placeItems: 'center',
                          flexShrink: '0',
                        }}
                      >
                        {$i(iconShield)}
                      </span>
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <span style={{ font: '600 17px Jost,sans-serif' }}>{$i(verifyTitle)}</span>
                        <span style={{ fontSize: '14px', color: '#b7c7d8' }}>{$i(verifyBody)}</span>
                      </span>
                    </div>
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {$list(verifySteps).map((vs, $index) => (
                        <Fragment key={$index}>
                          <span
                            style={$css(
                              `display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 11px 0 7px;border-radius:999px;background:${vs?.bg ?? ''};font:600 12.5px Figtree,sans-serif;color:${vs?.color ?? ''};white-space:nowrap`,
                            )}
                          >
                            <span
                              style={$css(
                                `width:16px;height:16px;border-radius:50%;background:${vs?.dot ?? ''};display:grid;place-items:center;color:#fff`,
                              )}
                            >
                              {$i(iconCheckTiny)}
                            </span>
                            {$i(vs?.label)}
                          </span>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={$css(`display:grid;grid-template-columns:${kpiCols ?? ''};gap:14px`)} data-rc-dyn="1">
                    {$list(kpis).map((k, $index) => (
                      <Fragment key={$index}>
                        <div
                          className="scp1t"
                          style={$css(
                            `position:relative;overflow:hidden;background:linear-gradient(180deg,${k?.wash ?? ''} 0%,#fff 58%);border:1px solid #e6edf5;border-radius:24px;padding:18px 18px 14px;display:flex;flex-direction:column;gap:10px;min-width:0;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);animation:pdFade .45s cubic-bezier(.23,1,.32,1) both;animation-delay:${k?.delay ?? ''};transition:transform .2s cubic-bezier(.23,1,.32,1),box-shadow .2s ease`,
                          )}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '8px',
                            }}
                          >
                            <span
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                font: '600 13px Figtree,sans-serif',
                                color: '#516378',
                              }}
                            >
                              <span
                                style={$css(
                                  `width:28px;height:28px;border-radius:9px;background:${k?.tint ?? ''};color:${k?.color ?? ''};display:grid;place-items:center`,
                                )}
                              >
                                {$i(k?.icon)}
                              </span>
                              {$i(k?.label)}
                            </span>
                            <span
                              style={$css(
                                `font:600 12px Figtree,sans-serif;padding:3px 8px;border-radius:999px;background:${k?.deltaBg ?? ''};color:${k?.deltaColor ?? ''}`,
                              )}
                            >
                              {$i(k?.delta)}
                            </span>
                          </div>
                          <span
                            style={{ font: '600 34px/1 Jost,sans-serif', color: '#10233a', letterSpacing: '-.02em' }}
                          >
                            {$i(k?.value)}
                          </span>
                          <svg
                            viewBox="0 0 120 32"
                            preserveAspectRatio="none"
                            style={{ width: '100%', height: '32px', display: 'block' }}
                          >
                            <path d={k?.area} style={$css(`fill:${k?.tint ?? ''}`)} />
                            <path
                              d={k?.line}
                              style={$css(
                                `fill:none;stroke:${k?.color ?? ''};stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke`,
                              )}
                            />
                          </svg>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={$css(`display:grid;grid-template-columns:${twoWide ?? ''};gap:16px`)} data-rc-dyn="1">
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #e6edf5',
                        borderRadius: '26px',
                        boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        minWidth: '0',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <h3 style={{ fontSize: '18px' }}>{'Profile views & leads'}</h3>
                        <div
                          style={{
                            display: 'flex',
                            gap: '14px',
                            font: '500 12.5px Figtree,sans-serif',
                            color: '#516378',
                          }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span
                              style={{ width: '10px', height: '3px', borderRadius: '2px', background: '#0890E8' }}
                            />
                            Views
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#D82028' }} />
                            Leads
                          </span>
                        </div>
                      </div>
                      <div style={{ position: 'relative' }}>
                        <svg
                          viewBox="0 0 600 200"
                          preserveAspectRatio="none"
                          style={{ width: '100%', height: '220px', display: 'block', overflow: 'visible' }}
                        >
                          {$list(grid).map((g, $index) => (
                            <Fragment key={$index}>
                              <line
                                x1="0"
                                x2="600"
                                y1={g?.y}
                                y2={g?.y}
                                style={{ stroke: '#edf2f7', strokeWidth: '1' }}
                              />
                            </Fragment>
                          ))}
                          {$list(bars).map((b, $index) => (
                            <Fragment key={$index}>
                              <rect
                                x={b?.x}
                                y={b?.y}
                                width={b?.w}
                                height={b?.h}
                                rx="3"
                                style={$css(`fill:${b?.fill ?? ''};transition:fill .15s ease`)}
                              />
                            </Fragment>
                          ))}
                          <path d={chartArea} style={{ fill: 'url(#pdArea)' }} />
                          <path
                            d={chartLine}
                            style={{
                              fill: 'none',
                              stroke: '#0890E8',
                              strokeWidth: '2.5',
                              strokeLinecap: 'round',
                              strokeLinejoin: 'round',
                              strokeDasharray: '1400',
                              animation: 'pdDraw 1.2s cubic-bezier(.23,1,.32,1) both',
                              vectorEffect: 'non-scaling-stroke',
                            }}
                          />
                          <defs>
                            <linearGradient id="pdArea" x1="0" x2="0" y1="0" y2="1">
                              <stop offset="0" style={{ stopColor: '#0890E8', stopOpacity: '.22' }} />
                              <stop offset="1" style={{ stopColor: '#0890E8', stopOpacity: '0' }} />
                            </linearGradient>
                          </defs>
                          <line
                            x1={hoverX}
                            x2={hoverX}
                            y1="0"
                            y2="200"
                            style={$css(`stroke:#10233a;stroke-width:1;stroke-dasharray:3 3;opacity:${hoverOp ?? ''}`)}
                          />
                          {$list(hits).map((h, $index) => (
                            <Fragment key={$index}>
                              <rect
                                x={h?.x}
                                y="0"
                                width={h?.w}
                                height="200"
                                onMouseEnter={h?.enter}
                                style={{ fill: 'transparent', cursor: 'crosshair' }}
                              />
                            </Fragment>
                          ))}
                        </svg>
                        <div
                          style={$css(
                            `position:absolute;top:0;left:${tipLeft ?? ''};transform:translateX(-50%);opacity:${hoverOp ?? ''};pointer-events:none;background:#10233a;color:#fff;border-radius:12px;padding:8px 12px;display:flex;flex-direction:column;gap:2px;white-space:nowrap;transition:opacity .15s ease;box-shadow:0 12px 24px -12px rgba(16,35,58,.6)`,
                          )}
                        >
                          <span style={{ font: '600 12px Figtree,sans-serif', color: '#9fd3f8' }}>{$i(tipDate)}</span>
                          <span style={{ font: '600 13.5px Jost,sans-serif' }}>
                            {$i(tipViews)} views · {$i(tipLeads)} leads
                          </span>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #e6edf5',
                        borderRadius: '26px',
                        boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        minWidth: '0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '18px' }}>Hot leads</h3>
                        <button
                          onClick={goLeads}
                          style={{
                            appearance: 'none',
                            border: '0',
                            background: 'transparent',
                            cursor: 'pointer',
                            font: '600 13.5px Jost,sans-serif',
                            color: '#0890E8',
                          }}
                        >
                          View all
                        </button>
                      </div>
                      {$list(hotLeads).map((l, $index) => (
                        <Fragment key={$index}>
                          <button
                            className="scpw scpi"
                            onClick={l?.open}
                            style={{
                              appearance: 'none',
                              border: '0',
                              cursor: 'pointer',
                              textAlign: 'left',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '10px',
                              borderRadius: '16px',
                              background: '#f9fbfd',
                              transition: 'background .15s ease,transform .12s ease-out',
                            }}
                          >
                            <span
                              style={$css(
                                `width:40px;height:40px;border-radius:12px;background:${l?.avBg ?? ''};color:${l?.avColor ?? ''};display:grid;place-items:center;font:600 14px Jost,sans-serif;flex-shrink:0`,
                              )}
                            >
                              {$i(l?.initials)}
                            </span>
                            <span
                              style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}
                            >
                              <span style={{ font: '600 14.5px Jost,sans-serif', color: '#10233a' }}>
                                {$i(l?.name)}
                              </span>
                              <span
                                style={{
                                  fontSize: '12.5px',
                                  color: '#6b7f95',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {$i(l?.interest)} · {$i(l?.ago)}
                              </span>
                            </span>
                            <span
                              style={$css(
                                `font:700 13px Jost,sans-serif;padding:4px 9px;border-radius:999px;background:${l?.scoreBg ?? ''};color:${l?.scoreColor ?? ''}`,
                              )}
                            >
                              {$i(l?.score)}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={$css(`display:grid;grid-template-columns:${threeCols ?? ''};gap:16px`)} data-rc-dyn="1">
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #e6edf5',
                        borderRadius: '26px',
                        boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        minWidth: '0',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 style={{ fontSize: '18px' }}>Upcoming</h3>
                        <button
                          onClick={goCalendar}
                          style={{
                            appearance: 'none',
                            border: '0',
                            background: 'transparent',
                            cursor: 'pointer',
                            font: '600 13.5px Jost,sans-serif',
                            color: '#0890E8',
                          }}
                        >
                          Calendar
                        </button>
                      </div>
                      {$list(upcoming).map((u, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span
                              style={$css(
                                `width:48px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;padding:6px 0;border-radius:12px;background:${u?.tint ?? ''};color:${u?.color ?? ''}`,
                              )}
                            >
                              <span
                                style={{
                                  font: '600 10.5px Figtree,sans-serif',
                                  letterSpacing: '.08em',
                                  textTransform: 'uppercase',
                                }}
                              >
                                {$i(u?.dow)}
                              </span>
                              <span style={{ font: '600 18px/1.1 Jost,sans-serif' }}>{$i(u?.time)}</span>
                            </span>
                            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                              <span style={{ font: '600 14.5px Jost,sans-serif' }}>{$i(u?.title)}</span>
                              <span style={{ fontSize: '12.5px', color: '#6b7f95' }}>{$i(u?.meta)}</span>
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #e6edf5',
                        borderRadius: '26px',
                        boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        minWidth: '0',
                      }}
                    >
                      <h3 style={{ fontSize: '18px' }}>Where leads come from</h3>
                      {$list(sources).map((s, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                              <span style={{ color: '#1f3550', fontWeight: '500' }}>{$i(s?.label)}</span>
                              <span style={{ font: '600 13.5px Jost,sans-serif' }}>{$i(s?.pct)}</span>
                            </div>
                            <span
                              style={{ height: '8px', borderRadius: '8px', background: '#eef3f8', overflow: 'hidden' }}
                            >
                              <span
                                style={$css(
                                  `display:block;height:100%;width:${s?.pct ?? ''};background:${s?.color ?? ''};border-radius:8px`,
                                )}
                              />
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #e6edf5',
                        borderRadius: '26px',
                        boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        minWidth: '0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <svg
                          viewBox="0 0 44 44"
                          style={{ width: '64px', height: '64px', flexShrink: '0', transform: 'rotate(-90deg)' }}
                        >
                          <circle
                            cx="22"
                            cy="22"
                            r="18"
                            style={{ fill: 'none', stroke: '#eef3f8', strokeWidth: '5' }}
                          />
                          <circle
                            cx="22"
                            cy="22"
                            r="18"
                            style={$css(
                              `fill:none;stroke:${strengthColor ?? ''};stroke-width:5;stroke-linecap:round;stroke-dasharray:113;stroke-dashoffset:${strengthOffset ?? ''};transition:stroke-dashoffset .6s cubic-bezier(.23,1,.32,1)`,
                            )}
                          />
                        </svg>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                          <span style={{ font: '600 24px/1 Jost,sans-serif' }}>{$i(strengthPct)}</span>
                          <span style={{ fontSize: '13px', color: '#6b7f95' }}>Profile strength</span>
                        </span>
                      </div>
                      {$list(todo).map((td, $index) => (
                        <Fragment key={$index}>
                          <button
                            className="scp1u"
                            onClick={td?.go}
                            style={{
                              appearance: 'none',
                              border: '0',
                              cursor: 'pointer',
                              textAlign: 'left',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10px',
                              padding: '10px 12px',
                              borderRadius: '14px',
                              background: '#f9fbfd',
                              font: '500 13.5px Figtree,sans-serif',
                              color: '#1f3550',
                            }}
                          >
                            <span
                              style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                background: '#F5A623',
                                flexShrink: '0',
                              }}
                            />
                            <span style={{ flex: '1' }}>{$i(td?.label)}</span>
                            <span style={{ display: 'flex', color: '#0890E8' }}>{$i(iconArrowSm)}</span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {isLeads ? (
              <>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'pdFade .3s ease-out' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h1 style={$css(`font-size:${h1Size ?? ''}`)}>Leads</h1>
                      <p style={{ fontSize: '15px', color: '#516378' }}>{$i(leadSummary)}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          padding: '4px',
                          borderRadius: '999px',
                          background: '#fff',
                          border: '1px solid #e6edf5',
                          boxShadow: '0 8px 20px -16px rgba(16,35,58,.35)',
                        }}
                      >
                        {$list(leadViews).map((lv, $index) => (
                          <Fragment key={$index}>
                            <button
                              onClick={lv?.select}
                              style={$css(
                                `appearance:none;border:0;cursor:pointer;height:34px;padding:0 14px;border-radius:999px;background:${lv?.bg ?? ''};color:${lv?.color ?? ''};font:600 13px Figtree,sans-serif`,
                              )}
                            >
                              {$i(lv?.label)}
                            </button>
                          </Fragment>
                        ))}
                      </div>
                      <button
                        onClick={exportCsv}
                        style={{
                          appearance: 'none',
                          cursor: 'pointer',
                          height: '42px',
                          padding: '0 16px',
                          borderRadius: '999px',
                          border: '1px solid #e3eaf2',
                          background: '#fff',
                          color: '#1f3550',
                          font: '600 13.5px Jost,sans-serif',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {$i(iconDownload)}
                        Export CSV
                      </button>
                      <button
                        className="scpc scpy"
                        onClick={addLead}
                        style={{
                          appearance: 'none',
                          border: '0',
                          cursor: 'pointer',
                          height: '42px',
                          padding: '0 16px',
                          borderRadius: '999px',
                          background: '#0890E8',
                          color: '#fff',
                          font: '600 13.5px Jost,sans-serif',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                        }}
                      >
                        {$i(iconPlus)}
                        Add lead
                      </button>
                    </div>
                  </div>
                  <div style={$css(`display:grid;grid-template-columns:${kpiCols ?? ''};gap:12px`)} data-rc-dyn="1">
                    {$list(crmStats).map((cs, $index) => (
                      <Fragment key={$index}>
                        <div
                          style={{
                            background: '#fff',
                            border: '1px solid #e6edf5',
                            borderRadius: '20px',
                            padding: '16px 18px',
                            boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                          }}
                        >
                          <span
                            style={{
                              font: '600 12px Figtree,sans-serif',
                              letterSpacing: '.08em',
                              textTransform: 'uppercase',
                              color: '#6b7f95',
                            }}
                          >
                            {$i(cs?.k)}
                          </span>
                          <span style={$css(`font:600 24px Jost,sans-serif;color:${cs?.color ?? ''}`)}>
                            {$i(cs?.v)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  {isBoard ? (
                    <>
                      <div
                        style={$css(
                          `display:grid;grid-template-columns:${boardCols ?? ''};gap:12px;overflow-x:auto;padding-bottom:6px`,
                        )}
                        data-rc-dyn="1"
                      >
                        {$list(board).map((col, $index) => (
                          <Fragment key={$index}>
                            <div
                              onDragOver={col?.over}
                              onDrop={col?.drop}
                              onDragLeave={col?.leave}
                              style={$css(
                                `display:flex;flex-direction:column;gap:10px;padding:12px;border-radius:20px;background:${col?.bg ?? ''};border:1.5px dashed ${col?.border ?? ''};min-height:380px;min-width:220px;transition:background .15s ease,border-color .15s ease;box-shadow:inset 0 1px 0 rgba(255,255,255,.7)`,
                              )}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '2px 4px',
                                }}
                              >
                                <span
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    font: '600 14px Jost,sans-serif',
                                  }}
                                >
                                  <span
                                    style={$css(
                                      `width:9px;height:9px;border-radius:3px;background:${col?.color ?? ''}`,
                                    )}
                                  />
                                  {$i(col?.label)}
                                </span>
                                <span style={{ font: '600 12.5px Figtree,sans-serif', color: '#6b7f95' }}>
                                  {$i(col?.count)}
                                </span>
                              </div>
                              {$list(col?.cards).map((l, $index) => (
                                <Fragment key={$index}>
                                  <div
                                    className="scp1v"
                                    draggable="true"
                                    onDragStart={l?.drag}
                                    onClick={l?.open}
                                    style={{
                                      cursor: 'grab',
                                      background: '#fff',
                                      border: '1px solid #e3eaf2',
                                      borderRadius: '16px',
                                      padding: '12px',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '8px',
                                      boxShadow: '0 6px 14px -12px rgba(16,35,58,.4)',
                                      transition: 'transform .12s ease-out,box-shadow .15s ease',
                                    }}
                                  >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <span
                                        style={$css(
                                          `width:32px;height:32px;border-radius:10px;background:${l?.avBg ?? ''};color:${l?.avColor ?? ''};display:grid;place-items:center;font:600 12.5px Jost,sans-serif;flex-shrink:0`,
                                        )}
                                      >
                                        {$i(l?.initials)}
                                      </span>
                                      <span
                                        style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}
                                      >
                                        <span
                                          style={{
                                            font: '600 14px Jost,sans-serif',
                                            color: '#10233a',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                          }}
                                        >
                                          {$i(l?.name)}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#6b7f95' }}>{$i(l?.ago)}</span>
                                      </span>
                                      <span
                                        style={$css(
                                          `font:700 12px Jost,sans-serif;padding:3px 7px;border-radius:999px;background:${l?.scoreBg ?? ''};color:${l?.scoreColor ?? ''}`,
                                        )}
                                      >
                                        {$i(l?.score)}
                                      </span>
                                    </div>
                                    <span style={{ fontSize: '13px', lineHeight: '1.4', color: '#3b4d63' }}>
                                      {$i(l?.interest)}
                                    </span>
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '6px',
                                      }}
                                    >
                                      <span
                                        style={{
                                          display: 'inline-flex',
                                          alignItems: 'center',
                                          gap: '5px',
                                          font: '500 11.5px Figtree,sans-serif',
                                          color: '#516378',
                                          padding: '3px 8px',
                                          borderRadius: '999px',
                                          background: '#f3f6fa',
                                        }}
                                      >
                                        {$i(l?.srcIcon)}
                                        {$i(l?.source)}
                                      </span>
                                      <span
                                        style={$css(
                                          `display:${l?.overdueDisplay ?? ''};font:600 11.5px Figtree,sans-serif;color:#c0262d`,
                                        )}
                                      >
                                        Reply due
                                      </span>
                                    </div>
                                  </div>
                                </Fragment>
                              ))}
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                  {isTable ? (
                    <>
                      <div
                        style={{
                          background: '#fff',
                          border: '1px solid #e6edf5',
                          borderRadius: '24px',
                          boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={$css(
                            `display:grid;grid-template-columns:${tableCols ?? ''};gap:12px;padding:12px 18px;background:#f9fbfd;border-bottom:1px solid #edf2f7;font:600 11.5px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b7f95`,
                          )}
                          data-rc-dyn="1"
                        >
                          <span>Lead</span>
                          <span style={$css(`display:${tableExtra ?? ''}`)}>Interest</span>
                          <span style={$css(`display:${tableExtra ?? ''}`)}>Source</span>
                          <span>Stage</span>
                          <span>Score</span>
                        </div>
                        {$list(leadRows).map((l, $index) => (
                          <Fragment key={$index}>
                            <button
                              className="scp1c"
                              onClick={l?.open}
                              style={$css(
                                `appearance:none;border:0;border-bottom:1px solid #f0f4f8;cursor:pointer;width:100%;text-align:left;display:grid;grid-template-columns:${tableCols ?? ''};gap:12px;align-items:center;padding:12px 18px;background:#fff`,
                              )}
                              data-rc-dyn="1"
                            >
                              <span style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: '0' }}>
                                <span
                                  style={$css(
                                    `width:34px;height:34px;border-radius:10px;background:${l?.avBg ?? ''};color:${l?.avColor ?? ''};display:grid;place-items:center;font:600 12.5px Jost,sans-serif;flex-shrink:0`,
                                  )}
                                >
                                  {$i(l?.initials)}
                                </span>
                                <span style={{ display: 'flex', flexDirection: 'column', minWidth: '0' }}>
                                  <span style={{ font: '600 14px Jost,sans-serif', color: '#10233a' }}>
                                    {$i(l?.name)}
                                  </span>
                                  <span style={{ fontSize: '12px', color: '#6b7f95' }}>{$i(l?.ago)}</span>
                                </span>
                              </span>
                              <span style={$css(`display:${tableExtra ?? ''};font-size:13.5px;color:#3b4d63`)}>
                                {$i(l?.interest)}
                              </span>
                              <span style={$css(`display:${tableExtra ?? ''};font-size:13px;color:#516378`)}>
                                {$i(l?.source)}
                              </span>
                              <span
                                style={$css(
                                  `justify-self:start;display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:999px;background:${l?.stageBg ?? ''};color:${l?.stageColor ?? ''};font:600 12px Figtree,sans-serif`,
                                )}
                              >
                                {$i(l?.stage)}
                              </span>
                              <span style={$css(`font:700 13px Jost,sans-serif;color:${l?.scoreColor ?? ''}`)}>
                                {$i(l?.score)}
                              </span>
                            </button>
                          </Fragment>
                        ))}
                      </div>
                    </>
                  ) : null}
                </div>
              </>
            ) : null}
            {isCalendar ? (
              <>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'pdFade .3s ease-out' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h1 style={$css(`font-size:${h1Size ?? ''}`)}>Calendar</h1>
                      <p style={{ fontSize: '15px', color: '#516378' }}>
                        Assessments, consultations and tours. Click an open slot to add a booking.
                      </p>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '8px 10px 8px 14px',
                        borderRadius: '16px',
                        background: '#fff',
                        border: '1px solid #e3eaf2',
                      }}
                    >
                      <span style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
                        <span style={{ font: '600 14px Jost,sans-serif' }}>Google Calendar</span>
                        <span style={$css(`font-size:12.5px;color:${gcalSubColor ?? ''}`)}>{$i(gcalSub)}</span>
                      </span>
                      <button
                        onClick={toggleGcal}
                        style={$css(
                          `appearance:none;border:0;cursor:pointer;height:36px;padding:0 14px;border-radius:999px;background:${gcalBtnBg ?? ''};color:${gcalBtnColor ?? ''};font:600 13px Jost,sans-serif;display:inline-flex;align-items:center;gap:8px`,
                        )}
                      >
                        <span
                          style={$css(
                            `display:${gcalSpin ?? ''};width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:pdSpin .7s linear infinite`,
                          )}
                        />
                        {$i(gcalBtn)}
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #e6edf5',
                      borderRadius: '24px',
                      boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                      overflow: 'auto',
                    }}
                  >
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '64px repeat(5,minmax(120px,1fr))',
                        minWidth: '700px',
                      }}
                      data-cols="64px repeat(5,minmax(120px,1fr))"
                    >
                      <span style={{ borderBottom: '1px solid #edf2f7' }} />
                      {$list(calDays).map((cd, $index) => (
                        <Fragment key={$index}>
                          <span
                            style={{
                              padding: '12px',
                              borderBottom: '1px solid #edf2f7',
                              borderLeft: '1px solid #f0f4f8',
                              display: 'flex',
                              alignItems: 'baseline',
                              gap: '6px',
                            }}
                          >
                            <span
                              style={{
                                font: '600 12px Figtree,sans-serif',
                                letterSpacing: '.08em',
                                textTransform: 'uppercase',
                                color: '#6b7f95',
                              }}
                            >
                              {$i(cd?.dow)}
                            </span>
                            <span style={$css(`font:600 18px Jost,sans-serif;color:${cd?.color ?? ''}`)}>
                              {$i(cd?.date)}
                            </span>
                          </span>
                        </Fragment>
                      ))}
                      {$list(calRows).map((cr, $index) => (
                        <Fragment key={$index}>
                          <span
                            style={{
                              height: '56px',
                              padding: '4px 10px 0 0',
                              textAlign: 'right',
                              font: '500 12px Figtree,sans-serif',
                              color: '#8a9bb0',
                              borderBottom: '1px solid #f4f7fa',
                            }}
                          >
                            {$i(cr?.label)}
                          </span>
                          {$list(cr?.cells).map((cc, $index) => (
                            <Fragment key={$index}>
                              <div
                                className="scp1w"
                                onClick={cc?.add}
                                style={$css(
                                  `position:relative;height:56px;border-left:1px solid #f0f4f8;border-bottom:1px solid #f4f7fa;cursor:${cc?.cursor ?? ''};background:${cc?.bg ?? ''}`,
                                )}
                              >
                                {cc?.has ? (
                                  <>
                                    <div
                                      style={$css(
                                        `position:absolute;inset:3px 4px;border-radius:10px;background:${cc?.evBg ?? ''};border-left:0;padding:6px 8px;display:flex;flex-direction:column;gap:1px;overflow:hidden;box-shadow:inset 0 0 0 1px ${cc?.evBorder ?? ''}`,
                                      )}
                                    >
                                      <span
                                        style={$css(
                                          `font:600 12.5px Jost,sans-serif;color:${cc?.evColor ?? ''};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`,
                                        )}
                                      >
                                        {$i(cc?.title)}
                                      </span>
                                      <span
                                        style={$css(
                                          `font-size:11px;color:${cc?.evSub ?? ''};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`,
                                        )}
                                      >
                                        {$i(cc?.sub)}
                                      </span>
                                    </div>
                                  </>
                                ) : null}
                              </div>
                            </Fragment>
                          ))}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      gap: '16px',
                      flexWrap: 'wrap',
                      font: '500 13px Figtree,sans-serif',
                      color: '#516378',
                    }}
                  >
                    {$list(calLegend).map((lg, $index) => (
                      <Fragment key={$index}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '7px' }}>
                          <span
                            style={$css(
                              `width:12px;height:12px;border-radius:4px;background:${lg?.bg ?? ''};box-shadow:inset 0 0 0 1px ${lg?.border ?? ''}`,
                            )}
                          />
                          {$i(lg?.label)}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            {isAnalytics ? (
              <>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'pdFade .3s ease-out' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h1 style={$css(`font-size:${h1Size ?? ''}`)}>Analytics</h1>
                    <p style={{ fontSize: '15px', color: '#516378' }}>
                      How families find you, and what makes them reach out.
                    </p>
                  </div>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #e6edf5',
                      borderRadius: '26px',
                      boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                      padding: '22px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '16px',
                    }}
                  >
                    <h3 style={{ fontSize: '18px' }}>Conversion funnel · last 30 days</h3>
                    <div
                      style={$css(`display:grid;grid-template-columns:${funnelCols ?? ''};gap:10px;align-items:end`)}
                      data-rc-dyn="1"
                    >
                      {$list(funnel).map((fn, $index) => (
                        <Fragment key={$index}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '0' }}>
                            <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end' }}>
                              <span
                                style={$css(
                                  `display:block;width:100%;height:${fn?.h ?? ''};border-radius:14px 14px 6px 6px;background:${fn?.bg ?? ''};transition:height .6s cubic-bezier(.23,1,.32,1)`,
                                )}
                              />
                            </div>
                            <span style={{ font: '600 22px/1 Jost,sans-serif' }}>{$i(fn?.v)}</span>
                            <span style={{ fontSize: '13px', color: '#516378' }}>{$i(fn?.k)}</span>
                            <span style={{ font: '600 12px Figtree,sans-serif', color: '#1f8a52' }}>
                              {$i(fn?.rate)}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={$css(`display:grid;grid-template-columns:${twoEven ?? ''};gap:16px`)} data-rc-dyn="1">
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #e6edf5',
                        borderRadius: '26px',
                        boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        minWidth: '0',
                      }}
                    >
                      <h3 style={{ fontSize: '18px' }}>Top pages sending visitors</h3>
                      {$list(pages).map((pg, $index) => (
                        <Fragment key={$index}>
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: 'minmax(0,1fr) auto auto',
                              gap: '14px',
                              alignItems: 'center',
                              padding: '10px 0',
                              borderBottom: '1px solid #f0f4f8',
                            }}
                            data-cols="minmax(0,1fr) auto auto"
                          >
                            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: '0' }}>
                              <span
                                style={{
                                  font: '600 14px Jost,sans-serif',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {$i(pg?.page)}
                              </span>
                              <span style={{ fontSize: '12px', color: '#6b7f95' }}>{$i(pg?.kind)}</span>
                            </span>
                            <span style={{ font: '600 14px Jost,sans-serif' }}>{$i(pg?.views)}</span>
                            <span
                              style={$css(
                                `font:600 12px Figtree,sans-serif;padding:3px 8px;border-radius:999px;background:${pg?.tagBg ?? ''};color:${pg?.tagColor ?? ''}`,
                              )}
                            >
                              {$i(pg?.tag)}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #e6edf5',
                        borderRadius: '26px',
                        boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                        minWidth: '0',
                      }}
                    >
                      <h3 style={{ fontSize: '18px' }}>What people searched</h3>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {$list(searches).map((sr, $index) => (
                          <Fragment key={$index}>
                            <span
                              style={$css(
                                `display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 12px;border-radius:999px;background:${sr?.bg ?? ''};color:${sr?.color ?? ''};font:500 ${sr?.size ?? ''} Figtree,sans-serif`,
                              )}
                            >
                              {$i(sr?.term)}
                              <span style={{ font: '600 11.5px Jost,sans-serif', opacity: '.7' }}>{$i(sr?.n)}</span>
                            </span>
                          </Fragment>
                        ))}
                      </div>
                      <div
                        style={{
                          marginTop: '6px',
                          display: 'flex',
                          gap: '12px',
                          padding: '14px',
                          borderRadius: '16px',
                          background: '#f3f9fe',
                          border: '1px solid #d6eafa',
                        }}
                      >
                        <span
                          style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '11px',
                            background: '#0890E8',
                            color: '#fff',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: '0',
                          }}
                        >
                          {$i(iconSpark)}
                        </span>
                        <span style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <span style={{ font: '600 14.5px Jost,sans-serif' }}>Insight</span>
                          <span style={{ fontSize: '13.5px', lineHeight: '1.5', color: '#1f3550' }}>{$i(insight)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: '#fff',
                      border: '1px solid #e6edf5',
                      borderRadius: '26px',
                      boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                      padding: '20px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                    }}
                  >
                    <h3 style={{ fontSize: '18px' }}>When enquiries arrive</h3>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '44px repeat(12,minmax(0,1fr))',
                        gap: '4px',
                        alignItems: 'center',
                      }}
                      data-cols="44px repeat(12,minmax(0,1fr))"
                    >
                      <span />
                      {$list(heatHours).map((hh, $index) => (
                        <Fragment key={$index}>
                          <span style={{ font: '500 11px Figtree,sans-serif', color: '#8a9bb0', textAlign: 'center' }}>
                            {$i(hh)}
                          </span>
                        </Fragment>
                      ))}
                      {$list(heat).map((hr, $index) => (
                        <Fragment key={$index}>
                          <span style={{ font: '600 12px Figtree,sans-serif', color: '#516378' }}>{$i(hr?.d)}</span>
                          {$list(hr?.cells).map((hc, $index) => (
                            <Fragment key={$index}>
                              <span
                                title={hc?.t}
                                style={$css(`height:26px;border-radius:7px;background:${hc?.bg ?? ''}`)}
                              />
                            </Fragment>
                          ))}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {isProfile ? (
              <>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'pdFade .3s ease-out' }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <h1 style={$css(`font-size:${h1Size ?? ''}`)}>Your listing</h1>
                      <p style={{ fontSize: '15px', color: '#516378' }}>Changes go live instantly after saving.</p>
                    </div>
                    <$A
                      className="scp2"
                      href={publicHref}
                      style={{
                        height: '42px',
                        padding: '0 16px',
                        borderRadius: '999px',
                        border: '1px solid #e3eaf2',
                        background: '#fff',
                        color: '#1f3550',
                        font: '600 13.5px Jost,sans-serif',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      {$i(iconEye)}
                      View public listing
                    </$A>
                  </div>
                  <div style={$css(`display:grid;grid-template-columns:${statusCols ?? ''};gap:12px`)} data-rc-dyn="1">
                    {$list(statusOpts).map((so, $index) => (
                      <Fragment key={$index}>
                        <button
                          onClick={so?.select}
                          style={$css(
                            `appearance:none;cursor:pointer;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px;border:1.5px solid ${so?.border ?? ''};background:${so?.bg ?? ''};transition:border-color .15s ease,background .15s ease`,
                          )}
                        >
                          <span
                            style={$css(
                              `width:12px;height:12px;border-radius:50%;background:${so?.dot ?? ''};animation:${so?.anim ?? ''};flex-shrink:0`,
                            )}
                          />
                          <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ font: '600 15px Jost,sans-serif', color: '#10233a' }}>{$i(so?.label)}</span>
                            <span style={{ fontSize: '12.5px', color: '#516378' }}>{$i(so?.body)}</span>
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {$list(sections).map((sec, $index) => (
                      <Fragment key={$index}>
                        <div
                          style={$css(
                            `background:#fff;border:1px solid ${sec?.border ?? ''};border-radius:20px;overflow:hidden;transition:border-color .15s ease`,
                          )}
                        >
                          <button
                            onClick={sec?.toggle}
                            style={{
                              appearance: 'none',
                              border: '0',
                              cursor: 'pointer',
                              width: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '14px',
                              padding: '16px 18px',
                              background: '#fff',
                              textAlign: 'left',
                            }}
                          >
                            <span
                              style={{
                                width: '36px',
                                height: '36px',
                                borderRadius: '11px',
                                background: '#eaf5fd',
                                color: '#0890E8',
                                display: 'grid',
                                placeItems: 'center',
                                flexShrink: '0',
                              }}
                            >
                              {$i(sec?.icon)}
                            </span>
                            <span
                              style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}
                            >
                              <span style={{ font: '600 16px Jost,sans-serif', color: '#10233a' }}>
                                {$i(sec?.title)}
                              </span>
                              <span
                                style={{
                                  fontSize: '13px',
                                  color: '#6b7f95',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {$i(sec?.summary)}
                              </span>
                            </span>
                            <span
                              style={$css(
                                `font:600 12px Figtree,sans-serif;padding:4px 9px;border-radius:999px;background:${sec?.tagBg ?? ''};color:${sec?.tagColor ?? ''}`,
                              )}
                            >
                              {$i(sec?.tag)}
                            </span>
                            <span
                              style={$css(
                                `width:8px;height:8px;border-right:2px solid #6b7f95;border-bottom:2px solid #6b7f95;transform:${sec?.chev ?? ''};transition:transform .2s ease;margin:0 4px`,
                              )}
                            />
                          </button>
                          {sec?.open ? (
                            <>
                              <div
                                style={{
                                  padding: '4px 18px 18px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '14px',
                                  animation: 'pdFade .2s ease-out',
                                }}
                              >
                                {$list(sec?.fields).map((f, $index) => (
                                  <Fragment key={$index}>
                                    <label style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                                      <span style={{ font: '600 13px Figtree,sans-serif', color: '#1f3550' }}>
                                        {$i(f?.label)}
                                      </span>
                                      {f?.isArea ? (
                                        <>
                                          <textarea
                                            className="scpf"
                                            value={$val(f?.value)}
                                            onChange={f?.onChange}
                                            rows="5"
                                            style={{
                                              padding: '12px 14px',
                                              borderRadius: '14px',
                                              border: '1.5px solid #dbe6f0',
                                              font: '500 15px/1.6 Figtree,sans-serif',
                                              color: '#10233a',
                                              outline: 'none',
                                              resize: 'vertical',
                                            }}
                                          />
                                        </>
                                      ) : null}
                                      {f?.isInput ? (
                                        <>
                                          <input
                                            className="scpf"
                                            value={$val(f?.value)}
                                            onChange={f?.onChange}
                                            style={{
                                              height: '48px',
                                              padding: '0 14px',
                                              borderRadius: '14px',
                                              border: '1.5px solid #dbe6f0',
                                              font: '500 15px Figtree,sans-serif',
                                              color: '#10233a',
                                              outline: 'none',
                                            }}
                                          />
                                        </>
                                      ) : null}
                                    </label>
                                  </Fragment>
                                ))}
                                {sec?.hasChips ? (
                                  <>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                      {$list(sec?.chips).map((c, $index) => (
                                        <Fragment key={$index}>
                                          <button
                                            onClick={c?.toggle}
                                            style={$css(
                                              `appearance:none;cursor:pointer;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid ${c?.border ?? ''};background:${c?.bg ?? ''};color:${c?.color ?? ''};font:500 13.5px Figtree,sans-serif`,
                                            )}
                                          >
                                            {$i(c?.label)}
                                          </button>
                                        </Fragment>
                                      ))}
                                    </div>
                                  </>
                                ) : null}
                                {sec?.hasPhotos ? (
                                  <>
                                    <div
                                      style={$css(`display:grid;grid-template-columns:${photoCols ?? ''};gap:8px`)}
                                      data-rc-dyn="1"
                                    >
                                      {$list(sec?.photos).map((ph, $index) => (
                                        <Fragment key={$index}>
                                          <span
                                            style={$css(
                                              `aspect-ratio:4/3;border-radius:12px;background:${ph?.bg ?? ''};background-size:cover;background-position:center;border:1.5px ${ph?.bs ?? ''} #cfdceb;display:grid;place-items:center;font:600 12px Jost,sans-serif;color:#0890E8`,
                                            )}
                                          >
                                            {$i(ph?.label)}
                                          </span>
                                        </Fragment>
                                      ))}
                                    </div>
                                  </>
                                ) : null}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                  <button
                                    onClick={sec?.toggle}
                                    style={{
                                      appearance: 'none',
                                      cursor: 'pointer',
                                      height: '40px',
                                      padding: '0 16px',
                                      borderRadius: '999px',
                                      border: '1px solid #e3eaf2',
                                      background: '#fff',
                                      color: '#1f3550',
                                      font: '600 13.5px Jost,sans-serif',
                                    }}
                                  >
                                    Close
                                  </button>
                                  <button
                                    className="scpc scpy"
                                    onClick={sec?.save}
                                    style={{
                                      appearance: 'none',
                                      border: '0',
                                      cursor: 'pointer',
                                      height: '40px',
                                      padding: '0 18px',
                                      borderRadius: '999px',
                                      background: '#0890E8',
                                      color: '#fff',
                                      font: '600 13.5px Jost,sans-serif',
                                    }}
                                  >
                                    Save changes
                                  </button>
                                </div>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
            {isBilling ? (
              <>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'pdFade .3s ease-out' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h1 style={$css(`font-size:${h1Size ?? ''}`)}>Billing</h1>
                    <p style={{ fontSize: '15px', color: '#516378' }}>
                      Manage your subscription, payment method and invoices.
                    </p>
                  </div>
                  <div style={$css(`display:grid;grid-template-columns:${twoWide ?? ''};gap:16px`)} data-rc-dyn="1">
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #e6edf5',
                        borderRadius: '26px',
                        boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                        padding: '22px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '12px',
                          flexWrap: 'wrap',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <span
                            style={{
                              font: '600 12px Figtree,sans-serif',
                              letterSpacing: '.1em',
                              textTransform: 'uppercase',
                              color: '#6b7f95',
                            }}
                          >
                            Current plan
                          </span>
                          <span style={{ font: '600 26px Jost,sans-serif' }}>
                            {$i(planName)} · {$i(planPrice)}
                            /mo
                          </span>
                          <span style={{ fontSize: '14px', color: '#516378' }}>
                            Renews {$i(renewDate)} · {$i(cardLabel)}
                          </span>
                        </div>
                        <span
                          style={{
                            height: '28px',
                            padding: '0 11px',
                            borderRadius: '999px',
                            background: '#e6f4ec',
                            color: '#1f8a52',
                            font: '600 12.5px Figtree,sans-serif',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          Active
                        </span>
                      </div>
                      <div
                        style={$css(`display:grid;grid-template-columns:${upgradeCols ?? ''};gap:10px`)}
                        data-rc-dyn="1"
                      >
                        {$list(upgrades).map((up, $index) => (
                          <Fragment key={$index}>
                            <div
                              style={$css(
                                `display:flex;flex-direction:column;gap:10px;padding:16px;border-radius:18px;border:1.5px solid ${up?.border ?? ''};background:${up?.bg ?? ''}`,
                              )}
                            >
                              <span
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'baseline',
                                  gap: '6px',
                                }}
                              >
                                <span style={{ font: '600 16px Jost,sans-serif' }}>{$i(up?.name)}</span>
                                <span style={{ font: '600 16px Jost,sans-serif' }}>{$i(up?.price)}</span>
                              </span>
                              <ul style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                {$list(up?.features).map((uf, $index) => (
                                  <Fragment key={$index}>
                                    <li style={{ display: 'flex', gap: '7px', fontSize: '13px', color: '#3b4d63' }}>
                                      <span style={{ display: 'flex', color: '#0890E8', marginTop: '2px' }}>
                                        {$i(iconCheckTiny2)}
                                      </span>
                                      {$i(uf)}
                                    </li>
                                  </Fragment>
                                ))}
                              </ul>
                              <button
                                onClick={up?.pick}
                                style={$css(
                                  `appearance:none;border:0;cursor:pointer;margin-top:auto;height:38px;border-radius:999px;background:${up?.btnBg ?? ''};color:${up?.btnColor ?? ''};font:600 13.5px Jost,sans-serif`,
                                )}
                              >
                                {$i(up?.btn)}
                              </button>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #e6edf5',
                        borderRadius: '26px',
                        boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                        padding: '22px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '12px',
                      }}
                    >
                      <h3 style={{ fontSize: '18px' }}>Invoices</h3>
                      {$list(invoices).map((iv, $index) => (
                        <Fragment key={$index}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '10px 0',
                              borderBottom: '1px solid #f0f4f8',
                            }}
                          >
                            <span
                              style={{
                                width: '34px',
                                height: '34px',
                                borderRadius: '10px',
                                background: '#f3f6fa',
                                color: '#516378',
                                display: 'grid',
                                placeItems: 'center',
                              }}
                            >
                              {$i(iconDoc)}
                            </span>
                            <span style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                              <span style={{ font: '600 14px Jost,sans-serif' }}>{$i(iv?.date)}</span>
                              <span style={{ fontSize: '12px', color: '#6b7f95' }}>{$i(iv?.desc)}</span>
                            </span>
                            <span style={{ font: '600 14px Jost,sans-serif' }}>{$i(iv?.amt)}</span>
                            <button
                              onClick={iv?.dl}
                              aria-label="Download invoice"
                              style={{
                                appearance: 'none',
                                border: '0',
                                background: 'transparent',
                                cursor: 'pointer',
                                color: '#0890E8',
                                display: 'flex',
                              }}
                            >
                              {$i(iconDownload)}
                            </button>
                          </div>
                        </Fragment>
                      ))}
                      <button
                        onClick={cancelSub}
                        style={{
                          appearance: 'none',
                          border: '0',
                          background: 'transparent',
                          cursor: 'pointer',
                          alignSelf: 'flex-start',
                          marginTop: '6px',
                          font: '600 13px Figtree,sans-serif',
                          color: '#6b7f95',
                        }}
                      >
                        Cancel subscription
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
            {isSettings ? (
              <>
                <div
                  style={{ display: 'flex', flexDirection: 'column', gap: '18px', animation: 'pdFade .3s ease-out' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <h1 style={$css(`font-size:${h1Size ?? ''}`)}>Settings</h1>
                    <p style={{ fontSize: '15px', color: '#516378' }}>Notifications, integrations and your team.</p>
                  </div>
                  <div style={$css(`display:grid;grid-template-columns:${twoEven ?? ''};gap:16px`)} data-rc-dyn="1">
                    <div
                      style={{
                        background: '#fff',
                        border: '1px solid #e6edf5',
                        borderRadius: '26px',
                        boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                        padding: '20px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                      }}
                    >
                      <h3 style={{ fontSize: '18px', marginBottom: '6px' }}>Lead notifications</h3>
                      {$list(notifSettings).map((ns, $index) => (
                        <Fragment key={$index}>
                          <button
                            onClick={ns?.toggle}
                            style={{
                              appearance: 'none',
                              border: '0',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '14px',
                              padding: '12px 0',
                              background: 'transparent',
                              textAlign: 'left',
                              borderBottom: '1px solid #f0f4f8',
                            }}
                          >
                            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ font: '600 14.5px Jost,sans-serif', color: '#10233a' }}>{$i(ns?.t)}</span>
                              <span style={{ fontSize: '13px', color: '#516378' }}>{$i(ns?.b)}</span>
                            </span>
                            <span
                              style={$css(
                                `width:44px;height:26px;border-radius:999px;background:${ns?.track ?? ''};position:relative;flex-shrink:0;transition:background .2s ease`,
                              )}
                            >
                              <span
                                style={$css(
                                  `position:absolute;top:3px;left:${ns?.knob ?? ''};width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(16,35,58,.25);transition:left .2s cubic-bezier(.23,1,.32,1)`,
                                )}
                              />
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div
                        style={{
                          background: '#fff',
                          border: '1px solid #e6edf5',
                          borderRadius: '26px',
                          boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <h3 style={{ fontSize: '18px', marginBottom: '4px' }}>Integrations</h3>
                        {$list(integrations).map((ig, $index) => (
                          <Fragment key={$index}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '10px 0',
                                borderBottom: '1px solid #f0f4f8',
                              }}
                            >
                              <span
                                style={{
                                  width: '38px',
                                  height: '38px',
                                  borderRadius: '11px',
                                  background: '#f3f6fa',
                                  color: '#1f3550',
                                  display: 'grid',
                                  placeItems: 'center',
                                  font: '700 13px Jost,sans-serif',
                                }}
                              >
                                {$i(ig?.mark)}
                              </span>
                              <span style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1px' }}>
                                <span style={{ font: '600 14.5px Jost,sans-serif' }}>{$i(ig?.name)}</span>
                                <span style={$css(`font-size:12.5px;color:${ig?.subColor ?? ''}`)}>{$i(ig?.sub)}</span>
                              </span>
                              <button
                                onClick={ig?.toggle}
                                style={$css(
                                  `appearance:none;cursor:pointer;height:34px;padding:0 14px;border-radius:999px;border:1px solid ${ig?.btnBorder ?? ''};background:${ig?.btnBg ?? ''};color:${ig?.btnColor ?? ''};font:600 13px Jost,sans-serif`,
                                )}
                              >
                                {$i(ig?.btn)}
                              </button>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      <div
                        style={{
                          background: '#fff',
                          border: '1px solid #e6edf5',
                          borderRadius: '26px',
                          boxShadow: '0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)',
                          padding: '20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <h3 style={{ fontSize: '18px' }}>Team</h3>
                          <button
                            onClick={inviteTeam}
                            style={{
                              appearance: 'none',
                              border: '0',
                              background: 'transparent',
                              cursor: 'pointer',
                              font: '600 13.5px Jost,sans-serif',
                              color: '#0890E8',
                            }}
                          >
                            + Invite
                          </button>
                        </div>
                        {$list(team).map((tm, $index) => (
                          <Fragment key={$index}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span
                                style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '11px',
                                  background: '#eaf5fd',
                                  color: '#0890E8',
                                  display: 'grid',
                                  placeItems: 'center',
                                  font: '600 13px Jost,sans-serif',
                                }}
                              >
                                {$i(tm?.i)}
                              </span>
                              <span style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                                <span style={{ font: '600 14px Jost,sans-serif' }}>{$i(tm?.n)}</span>
                                <span style={{ fontSize: '12.5px', color: '#6b7f95' }}>{$i(tm?.e)}</span>
                              </span>
                              <span
                                style={{
                                  font: '600 12px Figtree,sans-serif',
                                  padding: '3px 9px',
                                  borderRadius: '999px',
                                  background: '#f3f6fa',
                                  color: '#516378',
                                }}
                              >
                                {$i(tm?.r)}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </main>
        </div>
        {drawerOpen ? (
          <>
            <div
              onClick={closeLead}
              style={{
                position: 'fixed',
                inset: '0',
                background: 'rgba(16,35,58,.35)',
                zIndex: '60',
                animation: 'pdFade .15s ease-out',
              }}
            />
            <aside
              data-screen-label="Lead detail"
              style={$css(
                `position:fixed;top:0;right:0;bottom:0;width:${drawerW ?? ''};background:#fff;z-index:61;display:flex;flex-direction:column;box-shadow:-30px 0 60px -30px rgba(16,35,58,.45);animation:pdSlide .25s cubic-bezier(.23,1,.32,1)`,
              )}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '20px 22px',
                  borderBottom: '1px solid #edf2f7',
                }}
              >
                <span
                  style={$css(
                    `width:48px;height:48px;border-radius:14px;background:${ld?.avBg ?? ''};color:${ld?.avColor ?? ''};display:grid;place-items:center;font:600 16px Jost,sans-serif`,
                  )}
                >
                  {$i(ld?.initials)}
                </span>
                <span style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <span style={{ font: '600 19px Jost,sans-serif' }}>{$i(ld?.name)}</span>
                  <span style={{ fontSize: '13px', color: '#6b7f95' }}>
                    {$i(ld?.source)} · {$i(ld?.ago)}
                  </span>
                </span>
                <span
                  style={$css(
                    `font:700 14px Jost,sans-serif;padding:5px 10px;border-radius:999px;background:${ld?.scoreBg ?? ''};color:${ld?.scoreColor ?? ''}`,
                  )}
                  title="Lead score"
                >
                  {$i(ld?.score)}
                </span>
                <button
                  onClick={closeLead}
                  aria-label="Close"
                  style={{
                    appearance: 'none',
                    border: '0',
                    background: '#f3f6fa',
                    cursor: 'pointer',
                    width: '36px',
                    height: '36px',
                    borderRadius: '11px',
                    font: '600 18px/1 Jost,sans-serif',
                    color: '#1f3550',
                  }}
                >
                  ×
                </button>
              </div>
              <div
                style={{
                  flex: '1',
                  overflowY: 'auto',
                  padding: '18px 22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '18px',
                }}
              >
                <div
                  style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '8px' }}
                  data-cols="repeat(4,minmax(0,1fr))"
                >
                  {$list(quick).map((qa, $index) => (
                    <Fragment key={$index}>
                      <$A
                        className="scp1x"
                        href={qa?.href}
                        onClick={qa?.act}
                        style={$css(
                          `display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px;border-radius:16px;background:${qa?.bg ?? ''};color:${qa?.color ?? ''};font:600 12.5px Figtree,sans-serif;text-align:center`,
                        )}
                      >
                        {$i(qa?.icon)}
                        {$i(qa?.label)}
                      </$A>
                    </Fragment>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <span
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Stage
                  </span>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {$list(ldStages).map((st, $index) => (
                      <Fragment key={$index}>
                        <button
                          onClick={st?.select}
                          style={$css(
                            `appearance:none;cursor:pointer;height:34px;padding:0 12px;border-radius:999px;border:1.5px solid ${st?.border ?? ''};background:${st?.bg ?? ''};color:${st?.color ?? ''};font:600 13px Figtree,sans-serif`,
                          )}
                        >
                          {$i(st?.label)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1px',
                    background: '#edf2f7',
                    border: '1px solid #edf2f7',
                    borderRadius: '16px',
                    overflow: 'hidden',
                  }}
                  data-cols="1fr 1fr"
                >
                  {$list(ldFacts).map((lf, $index) => (
                    <Fragment key={$index}>
                      <div
                        style={{
                          background: '#fff',
                          padding: '10px 12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          minWidth: '0',
                        }}
                      >
                        <span
                          style={{
                            font: '600 10.5px Figtree,sans-serif',
                            letterSpacing: '.1em',
                            textTransform: 'uppercase',
                            color: '#6b7f95',
                          }}
                        >
                          {$i(lf?.k)}
                        </span>
                        <span style={{ font: '600 13.5px Jost,sans-serif', overflowWrap: 'anywhere' }}>
                          {$i(lf?.v)}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    padding: '14px',
                    borderRadius: '16px',
                    background: '#f7fafd',
                    border: '1px solid #edf2f7',
                  }}
                >
                  <span
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Their message
                  </span>
                  <p style={{ fontSize: '14.5px', lineHeight: '1.6', color: '#1f3550' }}>{$i(ld?.message)}</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <span
                      style={{
                        font: '600 12px Figtree,sans-serif',
                        letterSpacing: '.08em',
                        textTransform: 'uppercase',
                        color: '#6b7f95',
                      }}
                    >
                      Reply
                    </span>
                    <button
                      onClick={aiDraft}
                      style={{
                        appearance: 'none',
                        border: '0',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        height: '32px',
                        padding: '0 12px',
                        borderRadius: '999px',
                        background: 'linear-gradient(135deg,#0a6fc0,#0890E8)',
                        color: '#fff',
                        font: '600 12.5px Jost,sans-serif',
                      }}
                    >
                      <span
                        style={$css(
                          `display:${aiSpin ?? ''};width:12px;height:12px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:pdSpin .7s linear infinite`,
                        )}
                      />
                      <span style={$css(`display:${aiIcon ?? ''}`)}>{$i(iconSpark)}</span>
                      {$i(aiLabel)}
                    </button>
                  </div>
                  <textarea
                    className="scpf"
                    value={$val(reply)}
                    onChange={setReply}
                    rows="5"
                    placeholder="Write a reply or use a template…"
                    style={{
                      padding: '12px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid #dbe6f0',
                      font: '500 14.5px/1.55 Figtree,sans-serif',
                      color: '#10233a',
                      outline: 'none',
                      resize: 'vertical',
                    }}
                  />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {$list(templates).map((tp, $index) => (
                      <Fragment key={$index}>
                        <button
                          className="scp2"
                          onClick={tp?.use}
                          style={{
                            appearance: 'none',
                            cursor: 'pointer',
                            height: '30px',
                            padding: '0 11px',
                            borderRadius: '999px',
                            border: '1px solid #e3eaf2',
                            background: '#fff',
                            color: '#1f3550',
                            font: '500 12.5px Figtree,sans-serif',
                          }}
                        >
                          {$i(tp?.label)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <button
                    className="scpc scpy"
                    onClick={sendReply}
                    style={{
                      appearance: 'none',
                      border: '0',
                      cursor: 'pointer',
                      alignSelf: 'flex-end',
                      height: '42px',
                      padding: '0 18px',
                      borderRadius: '999px',
                      background: '#0890E8',
                      color: '#fff',
                      font: '600 14px Jost,sans-serif',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    Send email
                    {$i(iconArrowSm)}
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <span
                    style={{
                      font: '600 12px Figtree,sans-serif',
                      letterSpacing: '.08em',
                      textTransform: 'uppercase',
                      color: '#6b7f95',
                    }}
                  >
                    Activity
                  </span>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      className="scp1y"
                      value={$val(note)}
                      onChange={setNote}
                      placeholder="Add a private note…"
                      style={{
                        flex: '1',
                        minWidth: '0',
                        height: '42px',
                        padding: '0 14px',
                        borderRadius: '12px',
                        border: '1.5px solid #dbe6f0',
                        font: '500 14px Figtree,sans-serif',
                        outline: 'none',
                      }}
                    />
                    <button
                      onClick={addNote}
                      style={{
                        appearance: 'none',
                        border: '0',
                        cursor: 'pointer',
                        height: '42px',
                        padding: '0 14px',
                        borderRadius: '12px',
                        background: '#10233a',
                        color: '#fff',
                        font: '600 13.5px Jost,sans-serif',
                      }}
                    >
                      Add
                    </button>
                  </div>
                  <ol
                    style={{ listStyle: 'none', margin: '0', padding: '0', display: 'flex', flexDirection: 'column' }}
                  >
                    {$list(ldTimeline).map((tl, $index) => (
                      <Fragment key={$index}>
                        <li
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '28px 1fr',
                            gap: '10px',
                            paddingBottom: '14px',
                            position: 'relative',
                          }}
                          data-cols="28px 1fr"
                        >
                          <span
                            style={$css(
                              `width:28px;height:28px;border-radius:9px;background:${tl?.bg ?? ''};color:${tl?.color ?? ''};display:grid;place-items:center`,
                            )}
                          >
                            {$i(tl?.icon)}
                          </span>
                          <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingTop: '3px' }}>
                            <span style={{ font: '500 13.5px Figtree,sans-serif', color: '#1f3550' }}>{$i(tl?.t)}</span>
                            <span style={{ fontSize: '12px', color: '#8a9bb0' }}>{$i(tl?.when)}</span>
                          </span>
                        </li>
                      </Fragment>
                    ))}
                  </ol>
                </div>
              </div>
            </aside>
          </>
        ) : null}
        {toastOn ? (
          <>
            <div
              style={{
                position: 'fixed',
                left: '50%',
                bottom: '24px',
                transform: 'translateX(-50%)',
                zIndex: '80',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 18px 12px 12px',
                borderRadius: '16px',
                background: '#10233a',
                color: '#fff',
                font: '500 14px Figtree,sans-serif',
                boxShadow: '0 20px 40px -20px rgba(16,35,58,.7)',
                animation: 'pdFade .2s ease-out',
              }}
            >
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#2fb46b',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                {$i(iconCheckTiny)}
              </span>
              {$i(toast)}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

export const ownCss =
  '\nhtml,body{margin:0;padding:0;background:#f3f6fa;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\ninput,select,button,textarea{font-family:inherit}\ninput::placeholder,textarea::placeholder{color:#8a9bb0}\n@keyframes pdFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}\n@keyframes pdSlide{from{transform:translateX(24px);opacity:0}to{transform:none;opacity:1}}\n@keyframes pdPulse{0%{box-shadow:0 0 0 0 rgba(47,180,107,.5)}70%{box-shadow:0 0 0 8px rgba(47,180,107,0)}100%{box-shadow:0 0 0 0 rgba(47,180,107,0)}}\n@keyframes pdDraw{from{stroke-dashoffset:1400}to{stroke-dashoffset:0}}\n@keyframes pdSpin{to{transform:rotate(360deg)}}\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n';
export const css = [ownCss].filter(Boolean).join('\n');
export const defaults = { providerType: 'centre' };
const View = createDC('ProviderDashboard', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={defaults} css={css} {...props} />;
}
