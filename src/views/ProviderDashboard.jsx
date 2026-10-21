'use client';
// Provider dashboard (centre + therapist), a 1:1 port of the "Provider Dashboard" design (Provider Dashboard.html).
// Markup and styles: generated from the design template. Logic: the design's own logic class, wired to real data:
// `initial` comes from src/server/dashboard-data.ts; edits go to /api/dashboard/*, /api/provider/*, /api/therapist/* and Stripe.
/* eslint-disable */
import React, { Fragment } from 'react';
import { DCLogic, createDC, DCRoot, $A, $i, $css, $list, $val } from '@/dc/runtime';

/* ───────────────────────── component logic (state, handlers, data) ───────────────────────── */
class Component extends DCLogic {
  // Real data: `this.props.initial` is loaded on the server (src/server/dashboard-data.ts). Leads live in the leads table; everything the
  // design keeps in `op` / `th` (and the calendar, status and notification settings) is the user's workspace, saved to /api/dashboard/workspace.
  get I() { return this.props.initial || {}; }
  get W() { return this.I.workspace || {}; }
  state = { vw: typeof window !== 'undefined' ? window.innerWidth : 1280, view: 'overview', range: 30, hover: -1, q: '', leadView: 'board', leads: (this.props.initial && this.props.initial.leads) || [], openId: null, drag: null, dropOn: null, reply: '', note: '', ai: false,
    gcal: 'off', extra: Array.isArray((this.props.initial && this.props.initial.workspace || {}).events) ? this.props.initial.workspace.events : [], status: this.initialStatus(), openSec: null, prof: this.profFrom(), notifOpen: false, notifRead: false, toast: '',
    notifs: { email: true, sms: false, digest: false, reviews: false, ...((this.props.initial && this.props.initial.workspace || {}).notifs || {}), sms: false, digest: false, reviews: false }, user: (this.props.initial && this.props.initial.user) || null, op: this.opSeed(), opLoading: false, th: this.thSeed(), saving: false, saveErr: '' };
  componentDidMount() {
    this._r = () => this.setState({ vw: window.innerWidth }); window.addEventListener('resize', this._r);
    try {
      const sp = new URLSearchParams(window.location.search); const v = sp.get('view');
      const ok = ['overview', 'facilities', 'partners', 'reports', 'tasks', 'marketing', 'leads', 'calendar', 'analytics', 'profile', 'billing', 'settings', 'clients', 'availability', 'waitlist'];
      if (v && ok.includes(v)) this.setState({ view: v });
      const lead = sp.get('lead'); if (lead) this.setState({ view: 'leads', openId: lead });
      if (sp.get('success')) this.flash('Thank you. Your plan appears here as soon as Stripe confirms the payment.');
      if (sp.get('canceled')) this.flash('Checkout was cancelled. Nothing was charged.');
    } catch (e) {}
    this._saved = this.persistable();
    this._unload = () => { if (this._st) { clearTimeout(this._st); this.saveNow(true); } };
    window.addEventListener('pagehide', this._unload);
    this.opSyncSel();
  }
  componentDidUpdate() { this.opSyncSel(); this.queueSave(); }
  componentWillUnmount() { window.removeEventListener('resize', this._r); window.removeEventListener('pagehide', this._unload); clearTimeout(this._tt); clearTimeout(this._ol); if (this._st) { clearTimeout(this._st); this.saveNow(true); } }

  /* ---------- persistence ---------- */
  isT() { return this.I.type === 'therapist' || this.props.providerType === 'therapist'; }
  persistable() {
    const S = this.state, strip = (o, keys) => { const c = { ...o }; keys.forEach(k => delete c[k]); return c; };
    return { op: strip(S.op, ['dr', 'confirm', 'orgErr']), th: strip(S.th, ['dr']), events: S.extra, status: S.status, notifs: S.notifs };
  }
  queueSave() {
    const S = this.state, p = this._saved || {};
    if (p.op && S.op === this._opRef && S.th === this._thRef && S.extra === this._exRef && S.status === this._stRef && S.notifs === this._nfRef) return;
    const first = !this._opRef;
    this._opRef = S.op; this._thRef = S.th; this._exRef = S.extra; this._stRef = S.status; this._nfRef = S.notifs;
    if (first) return;
    clearTimeout(this._st); this._st = setTimeout(() => this.saveNow(false), 700);
  }
  async saveNow(beacon) {
    this._st = null;
    const data = this.persistable(), body = JSON.stringify({ data });
    if (JSON.stringify(this._saved) === JSON.stringify(data)) return;
    try {
      const res = await fetch('/api/dashboard/workspace', { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body, keepalive: !!beacon && body.length < 60000 });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) { this._saved = data; if (this.state.saveErr) this.setState({ saveErr: '' }); }
      else if (!beacon) { this.setState({ saveErr: j.error || 'Not saved' }); this.flash((j.error || 'Your changes were not saved') + ' · retrying'); clearTimeout(this._st); this._st = setTimeout(() => this.saveNow(false), 5000); }
    } catch (e) { if (!beacon) { this.flash('Offline · your changes will be saved when the connection is back'); clearTimeout(this._st); this._st = setTimeout(() => this.saveNow(false), 5000); } }
  }
  async api(url, payload) {
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, credentials: 'same-origin', body: JSON.stringify(payload) });
      const j = await res.json().catch(() => ({}));
      return { ok: res.ok && j.ok !== false, ...j, error: j.error || (res.ok ? '' : 'Something went wrong. Please try again.') };
    } catch (e) { return { ok: false, error: 'We could not reach the server. Check your connection.' }; }
  }
  initialStatus() {
    const I = (this.props && this.props.initial) || {};
    if (I.type === 'therapist') { const d = (I.therapist && I.therapist.data) || {}; return d.accepting === false ? 'full' : (I.workspace && I.workspace.status) || 'available'; }
    const raw = (I.profile && I.profile.raw) || {};
    return raw.availability || (I.workspace && I.workspace.status) || 'available';
  }
  /** The listing editor's model: the fields of the real profile the design's sections edit. */
  profFrom() {
    const I = (this.props && this.props.initial) || {};
    if (I.type === 'therapist') {
      const d = (I.therapist && I.therapist.data) || {};
      return { name: d.name || (I.user && I.user.name) || '', phone: d.phone || '', headline: d.tagline || '', about: d.bio || '', services: (d.concerns || []).slice(), price: d.fee || '', photos: 0, photoList: [], raw: d };
    }
    const P = I.profile; if (!P) return { name: 'Your centre', phone: '', email: '', website: '', about: '', services: [], price: '', photos: 0, photoList: [], raw: {} };
    const r = P.raw || {}, f = P.fallback || {};
    return { name: P.name, phone: r.phone || '', email: r.email || '', website: r.website || '', about: r.description || '', services: (r.programs || []).slice(), price: (r.pricing && r.pricing[0] && r.pricing[0].price) || '', photoList: (r.photos || []).slice(), photos: (r.photos || []).length + (f.photos || 0), raw: r, fallback: f };
  }

  thSeed() {
    // A therapist's practice records start empty and are kept in their workspace (saved as they work).
    const w = ((this.props && this.props.initial && this.props.initial.workspace) || {}).th || {};
    const arr = (k) => Array.isArray(w[k]) ? w[k] : [];
    const base = { clients: [], appts: [], invoices: [], wait: [], tasks: [], fees: [], blocks: [], log: [], dupOk: [], nextId: 1, role: 'owner', cliQ: '', cliStatus: 'all', cliSort: 'name', dupDismissed: false, sel: null, cpTab: 'overview', calMode: 'week', calOff: 0, calFmt: 'all', calRoom: 'all', buffer: '10', accept: true, invFilter: 'all', repPeriod: 'last', rem: { confirm: true, remind: true, resched: true, wait: true, pay: false }, hours: [[9, 17], [9, 17], [9, 17], [9, 17], [9, 17]], dr: null };
    const th = { ...base, ...w, clients: arr('clients'), appts: arr('appts'), invoices: arr('invoices'), wait: arr('wait'), tasks: arr('tasks'), fees: arr('fees'), blocks: arr('blocks'), log: arr('log'), dupOk: arr('dupOk'), hours: Array.isArray(w.hours) && w.hours.length === 5 ? w.hours : base.hours, rem: { ...base.rem, ...(w.rem || {}) }, dr: null };
    const d = (this.props && this.props.initial && this.props.initial.therapist && this.props.initial.therapist.data) || {};
    if (d.accepting === false) th.accept = false;
    return th;
  }
  thVals(nav) {
    const S = this.state, isT = this.isT();
    if (!isT) return { thOn: false, thIsOverview: false, thIsClients: false, thIsClient: false, thIsCal: false, thIsAvail: false, thIsWait: false, thIsBill: false, thIsTasks: false, thIsReports: false, thIsSettingsX: false, thDrOpen: false };
    const T = S.th, vw = S.vw, wide = vw >= 1100, view = S.view, role = T.role;
    const fin = role === 'owner' || role === 'billing', ids = role !== 'billing' || true;
    const up = (p) => this.setState(st => ({ th: { ...st.th, ...(typeof p === 'function' ? p(st.th) : p) } }));
    const goV = (v, extra) => () => { this.setState(st => ({ view: v, notifOpen: false, th: { ...st.th, ...(extra || {}) } })); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const money = (n) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(n);
    const tFmt = (t) => new Date(t).toLocaleTimeString('en-CA', { hour: 'numeric', minute: '2-digit' });
    const dFmt = (t) => new Date(t).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' });
    const cl = (id) => T.clients.find(c => c.id === id) || { name: 'Unknown', ch: 'Email', email: '', phone: '', status: 'inactive', id: -1 };
    const I = this.I, td = (I.therapist && I.therapist.data) || {}, uname = (S.user && S.user.name) || td.name || '';
    const thDisplay = I.therapistDisplay || td.name || uname || 'Your practice';
    const thShort = (td.name || uname || 'You').split(' ').map((x, i, a) => i === a.length - 1 ? x : x[0] + '.').join(' ');
    const practice = (I.therapist && I.therapist.practice) || td.name || uname || 'your practice';
    const feeStd = /^\d+$/.test(String(td.fee || '')) ? +td.fee : 0;
    const feeFor = (cat, dur) => cat === 'Consultation' ? (td.consult ? 0 : Math.round(feeStd * (+dur || 20) / 50)) : Math.round(feeStd * (+dur || 50) / 50);
    const logIt = (t, c) => ({ t, at: Date.now(), c: c == null ? null : c, by: T.role === 'owner' ? 'Owner' : T.role[0].toUpperCase() + T.role.slice(1) });
    const clinicTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Toronto';
    const now = Date.now(), d0 = new Date(); d0.setHours(0, 0, 0, 0); const day0 = d0.getTime(), DAY = 864e5;
    const mon = day0 - ((new Date(day0).getDay() + 6) % 7) * DAY;
    const stA = { scheduled: ['Scheduled', '#eaf5fd', '#0a5d96'], confirmed: ['Confirmed', '#e6f4ec', '#1f8a52'], arrived: ['Arrived', '#f0ecfe', '#5b3fd6'], completed: ['Completed', '#eef2f7', '#3b4d63'], cancelled: ['Cancelled', '#fdf3e1', '#a46407'], 'no-show': ['No-show', '#fdecec', '#c0262d'] };
    const stC = { inquiry: ['Inquiry', '#eaf5fd', '#0a5d96'], waitlisted: ['Waitlisted', '#fdf3e1', '#a46407'], active: ['Active', '#e6f4ec', '#1f8a52'], inactive: ['Inactive', '#eef2f7', '#516378'], archived: ['Archived', '#eef2f7', '#8a9bb0'] };
    const stW = { awaiting: ['Awaiting availability', '#eef2f7', '#3b4d63'], offered: ['Slot offered', '#eaf5fd', '#0a5d96'], response: ['Awaiting response', '#fdf3e1', '#a46407'], scheduled: ['Scheduled', '#e6f4ec', '#1f8a52'], closed: ['Closed', '#eef2f7', '#8a9bb0'] };
    const stI = { draft: ['Draft', '#eef2f7', '#516378'], issued: ['Issued', '#eaf5fd', '#0a5d96'], partial: ['Partially paid', '#fdf3e1', '#a46407'], overdue: ['Overdue', '#fdecec', '#c0262d'], paid: ['Paid', '#e6f4ec', '#1f8a52'], void: ['Voided', '#eef2f7', '#8a9bb0'] };
    const balOf = (cid) => T.invoices.filter(i => i.c === cid && !['void', 'draft', 'paid'].includes(i.status)).reduce((a, i) => a + i.total - i.paid, 0);
    const openAppt = (a) => () => up({ dr: { kind: 'appt', id: a.id, form: { status: a.status, date: new Date(a.start - new Date(a.start).getTimezoneOffset() * 6e4).toISOString().slice(0, 16) }, scope: 'this', err: '' } });
    const openForm = (kind, preset) => () => up({ dr: { kind, id: null, form: { ...(preset || {}) }, err: '' } });
    // availability
    const wh = T.hours;
    const weekAp = T.appts.filter(a => a.start >= mon && a.start < mon + 7 * DAY && a.status !== 'cancelled');
    const weekAvail = wh.map(([a, b], i) => { const booked = weekAp.filter(x => x.start >= mon + i * DAY && x.start < mon + (i + 1) * DAY).reduce((s2, x) => s2 + x.dur, 0) / 60; const tot = b - a - 1; return { day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'][i], booked, tot, pct: Math.min(100, booked / tot * 100) + '%', label: booked.toFixed(1).replace('.0', '') + ' of ' + tot + ' h booked' }; });
    const openSlots = weekAvail.reduce((s2, d, i) => s2 + (mon + (i + 1) * DAY > now ? Math.floor(d.tot - d.booked) : 0), 0);
    const todayAp = T.appts.filter(a => a.start >= day0 && a.start < day0 + DAY).sort((a, b) => a.start - b.start);
    const unconf = T.appts.filter(a => a.status === 'scheduled' && a.start > now && a.start < now + 7 * DAY);
    const awaiting = T.wait.filter(w => !['scheduled', 'closed'].includes(w.status));
    const outstanding = T.invoices.filter(i => ['issued', 'partial', 'overdue'].includes(i.status));
    const outBal = outstanding.reduce((a, i) => a + i.total - i.paid, 0);
    const openTasks = T.tasks.filter(t => t.status !== 'done' && t.due < now + 7 * DAY);
    const kp = (period, l, v, s2, go, c, size) => ({ period, l, v: String(v), s: s2, go, c: c || '#10233a', size: size || '30px' });
    const thKpis = [kp('Today', "Today's appointments", todayAp.length, todayAp.filter(a => a.status === 'confirmed').length + ' confirmed', goV('calendar', { calMode: 'day', calOff: 0 })), kp('Next 7 days', 'Unconfirmed appointments', unconf.length, 'Scheduled, not yet confirmed', goV('calendar'), unconf.length ? '#a46407' : '#10233a'), kp('This week', 'Open appointment hours', openSlots, 'Within working hours, after buffers', goV('availability'), '#1f8a52'),
      kp('Current', 'Awaiting scheduling', awaiting.length, 'On the waitlist', goV('waitlist')), fin ? kp('Current', 'Outstanding balance', money(outBal), outstanding.length + ' open invoices', goV('billing'), '#c0262d', '26px') : kp('Current', 'Outstanding balance', 'Restricted', 'Visible to owner and billing roles', () => {}, '#8a9bb0', '18px'), kp('Due within 7 days', 'Admin tasks needing attention', openTasks.length, openTasks.filter(t => t.due < now).length + ' overdue', goV('tasks'))];
    // calendar
    const calDayStart = T.calMode === 'day' ? day0 + T.calOff * DAY : mon + T.calOff * 7 * DAY;
    const nDays = T.calMode === 'day' ? 1 : 5;
    const fit = (a) => (T.calFmt === 'all' || a.fmt === T.calFmt) && (T.calRoom === 'all' || a.room === T.calRoom);
    const showName = (c) => role === 'billing' ? c.name.split(' ').map(x => x[0]).join('') + '.' : (c.pref || c.name.split(' ')[0]) + ' ' + c.name.split(' ').slice(-1)[0][0] + '.';
    const calDays = Array.from({ length: nDays }, (_, i) => { const ds = calDayStart + i * DAY, isToday = ds === day0;
      return { t: new Date(ds).toLocaleDateString('en-CA', { weekday: 'short', month: 'short', day: 'numeric' }), color: isToday ? '#0890E8' : '#1f3550', bg: isToday ? '#eaf5fd' : '#fff',
        blocks: (() => { const dow = (new Date(ds).getDay() + 6) % 7, out = []; const w2 = wh[dow];
          if (!w2) out.push({ top: '0px', h: (11 * 56) + 'px', t: 'Not working' });
          else { if (w2[0] > 9) out.push({ top: '0px', h: ((w2[0] - 9) * 56) + 'px', t: 'Not working (starts ' + w2[0] + ':00)' }); if (w2[1] < 20) out.push({ top: ((w2[1] - 9) * 56) + 'px', h: ((20 - w2[1]) * 56) + 'px', t: 'Not working' }); }
          (T.blocks || []).forEach(b => { const s0 = Math.max(b.from, ds + 9 * 36e5), e0 = Math.min(b.to, ds + 20 * 36e5); if (e0 > s0) out.push({ top: ((s0 - ds) / 36e5 - 9) * 56 + 'px', h: Math.max(20, (e0 - s0) / 36e5 * 56) + 'px', t: b.why }); });
          return out; })(),
        appts: T.appts.filter(a => a.start >= ds && a.start < ds + DAY && fit(a)).map(a => { const hh = new Date(a.start).getHours() + new Date(a.start).getMinutes() / 60; const st = stA[a.status]; return { who: showName(cl(a.c)), time: tFmt(a.start), fmt: a.fmt === 'Online' ? 'Online' : a.room, top: ((hh - 9) * 56) + 'px', h: Math.max(28, a.dur / 60 * 56 - 4) + 'px', bg: st[1], bar: st[2], open: openAppt(a) }; }) }; });
    const mStart = new Date(day0); mStart.setDate(1); mStart.setMonth(mStart.getMonth() + (T.calMode === 'month' ? T.calOff : 0));
    const gridStart = mStart.getTime() - ((mStart.getDay() + 6) % 7) * DAY;
    const thMonthCells = Array.from({ length: 35 }, (_, i) => { const ds = gridStart + i * DAY, inM = new Date(ds).getMonth() === mStart.getMonth(), n = T.appts.filter(a => a.start >= ds && a.start < ds + DAY && fit(a)).length; return { d: new Date(ds).getDate(), n: n ? n + ' appt' + (n > 1 ? 's' : '') : '', color: ds === day0 ? '#0890E8' : inM ? '#1f3550' : '#b7c3d0', bg: ds === day0 ? '#eaf5fd' : '#fff', border: ds === day0 ? '#0890E8' : '#edf2f7', go: () => up({ calMode: 'day', calOff: Math.round((ds - day0) / DAY) }) }; });
    const calLabel = T.calMode === 'month' ? mStart.toLocaleDateString('en-CA', { month: 'long', year: 'numeric' }) : T.calMode === 'day' ? new Date(calDayStart).toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' }) : 'Week of ' + new Date(calDayStart).toLocaleDateString('en-CA', { month: 'long', day: 'numeric' });
    const sel = (key, value, opts) => ({ value, opts: opts.map(x => Array.isArray(x) ? { v: x[0], t: x[1] } : { v: x, t: x }), onChange: (e) => { const v = e.target.value; up({ [key]: v }); } });
    // clients
    const q = T.cliQ.trim().toLowerCase();
    let cr = T.clients.filter(c => (T.cliStatus === 'all' ? c.status !== 'archived' : c.status === T.cliStatus) && (!q || (c.name + ' ' + c.email + ' ' + c.phone).toLowerCase().includes(q)));
    const nextAp = (cid) => T.appts.filter(a => a.c === cid && a.start > now && !['cancelled', 'no-show'].includes(a.status)).sort((a, b) => a.start - b.start)[0];
    cr = cr.slice().sort((a, b) => T.cliSort === 'next' ? ((nextAp(a.id) || { start: 9e15 }).start - (nextAp(b.id) || { start: 9e15 }).start) : T.cliSort === 'bal' ? balOf(b.id) - balOf(a.id) : a.name.localeCompare(b.name));
    const thCliRows = cr.map(c => { const n = nextAp(c.id), b = balOf(c.id); return { name: c.name, pref: c.pref ? 'Prefers “' + c.pref + '”' : ' ', contact: c.ch + ' · ' + (c.ch === 'Email' ? c.email : c.phone), status: stC[c.status][0], stBg: stC[c.status][1], stColor: stC[c.status][2], next: n ? dFmt(n.start) + ', ' + tFmt(n.start) : '—', bal: fin ? (b ? money(b) : '—') : 'Restricted', balColor: fin ? (b ? '#c0262d' : '#8a9bb0') : '#8a9bb0', open: goV('client', { sel: c.id, cpTab: 'overview' }) }; });
    let dupA = null, dupB = null;
    const live = T.clients.filter(c => c.status !== 'archived');
    for (let i = 0; i < live.length && !dupA; i++) for (let j = i + 1; j < live.length; j++) { const a = live[i], b = live[j], key = [a.id, b.id].sort().join('-'); if ((T.dupOk || []).includes(key)) continue; if ((a.phone && a.phone === b.phone) || (a.email && a.email.toLowerCase() === (b.email || '').toLowerCase())) { dupA = a; dupB = b; break; } }
    // client profile
    const cp = T.clients.find(c => c.id === T.sel) || T.clients[0] || { id: -1, name: 'No client selected', pref: '', ch: 'Email', email: '—', phone: '—', status: 'inquiry', tz: 'America/Toronto', voicemail: false, created: Date.now() };
    const cpAp = T.appts.filter(a => a.c === cp.id).sort((a, b) => b.start - a.start), cpInv = T.invoices.filter(i => i.c === cp.id);
    const tabs = [['overview', 'Overview'], ['appts', 'Appointments'], ['billing', 'Billing'], ['comms', 'Communication preferences'], ['activity', 'Administrative activity']].filter(t => fin || t[0] !== 'billing');
    let cpCols = [], cpRows = [], facts = [];
    if (T.cpTab === 'overview') { const n = nextAp(cp.id); facts = [['Preferred name', cp.pref || '—'], ['Email', cp.email], ['Phone', cp.phone], ['Assigned therapist', thDisplay], ['Scheduling preference', cp.sched || '—'], ['Next appointment', n ? dFmt(n.start) + ', ' + tFmt(n.start) : 'None booked'], ['Timezone', (cp.tz || 'America/Toronto').replace(/^[A-Za-z]+\//, '').replace(/_/g, ' ') + ((cp.tz || clinicTz) !== clinicTz ? ' (differs from clinic)' : '')], ['Outstanding actions', fin && balOf(cp.id) ? 'Balance of ' + money(balOf(cp.id)) : nextAp(cp.id) && nextAp(cp.id).status === 'scheduled' ? 'Confirm next appointment' : 'None']]; }
    if (T.cpTab === 'comms') facts = [['Approved reminder channels', cp.ch === 'SMS' ? 'SMS, Email' : cp.ch], ['Voicemail permitted', cp.voicemail ? 'Yes · name of clinic only' : 'No'], ['Payment reminders', fin ? 'Email' : 'Restricted'], ['Waitlist notices', 'Email']];
    if (T.cpTab === 'appts') { cpCols = ['Date', 'Time', 'Therapist', 'Category', 'Format', 'Attendance']; cpRows = cpAp.map(a => ({ cells: [dFmt(a.start), tFmt(a.start) + ' · ' + a.dur + ' min', thShort, a.cat, a.fmt === 'Online' ? 'Online' : 'In-person · ' + a.room, stA[a.status][0]].map((v, i) => ({ v, c: i === 5 ? stA[a.status][2] : '#1f3550', w: i === 5 ? '600' : '500' })) })); }
    if (T.cpTab === 'billing') { cpCols = ['Invoice', 'Date', 'Description', 'Total', 'Paid', 'Balance']; cpRows = cpInv.map(i => ({ cells: [i.no, dFmt(i.date), i.desc, money(i.total), money(i.paid), i.status === 'void' ? 'Voided' : money(i.total - i.paid)].map((v, k) => ({ v, c: k === 5 && i.total - i.paid > 0 && i.status !== 'void' ? '#c0262d' : '#1f3550', w: k === 5 ? '600' : '500' })) })); }
    if (T.cpTab === 'activity') { cpCols = ['When', 'Event', 'By']; cpRows = (T.log || []).filter(l => l.c === cp.id).slice(0, 50).map(l => ({ cells: [dFmt(l.at) + ', ' + tFmt(l.at), l.t, l.by || 'Owner'].map(v => ({ v, c: '#1f3550', w: '500' })) })); }
    // waitlist
    const thWaitRows = T.wait.filter(w => w.status !== 'closed').map(w => { const c = cl(w.c), st = stW[w.status], due = w.next < now + DAY;
      return { who: c.name, added: dFmt(w.added), pref: w.days + ' · ' + w.fmt + ' · ' + w.loc, staff: w.staff, next: dFmt(w.next), nextColor: due ? '#c0262d' : '#1f3550', status: st[0], stBg: st[1], stColor: st[2],
        offerLabel: w.status === 'awaiting' ? 'Offer slot' : 'Re-offer', offerOff: w.status === 'scheduled', offerOp: w.status === 'scheduled' ? '.4' : '1', convOff: w.status === 'scheduled', convOp: w.status === 'scheduled' ? '.4' : '1',
        offer: () => { up(t => ({ wait: t.wait.map(x => x.id === w.id ? { ...x, status: 'offered', next: now + 2 * DAY } : x) })); up(t => ({ log: [logIt('Slot offered from the waitlist', w.c)].concat(t.log || []).slice(0, 300) })); this.flash('Slot offer recorded for ' + c.name.split(' ')[0] + ' · contact them by ' + (c.ch || 'email').toLowerCase()); },
        convert: openForm('appt', { c: String(w.c), cat: 'Consultation', dur: '20', fmt: w.fmt === 'Either' ? 'Online' : w.fmt, repeat: 'no', waitId: w.id }) }; });
    // billing
    const fees = T.fees.filter(f => f.state === 'pending' && T.appts.find(x => x.id === f.appt)).map(f => { const a = T.appts.find(x => x.id === f.appt); const c = cl(a.c); return { who: c.name, what: 'No-show on ' + dFmt(a.start), fee: money(f.fee), apply: () => { up(t => ({ fees: t.fees.map(x => x.id === f.id ? { ...x, state: 'applied' } : x), invoices: t.invoices.concat({ id: t.nextId, no: 'INV-' + (1000 + t.nextId), c: a.c, desc: 'Missed appointment fee', date: now, total: f.fee, paid: 0, status: 'issued' }), nextId: t.nextId + 1 })); this.flash('Fee added to a new invoice'); }, waive: () => { up(t => ({ fees: t.fees.map(x => x.id === f.id ? { ...x, state: 'waived' } : x) })); this.flash('Fee waived'); } }; });
    const invR = T.invoices.filter(i => T.invFilter === 'all' || i.status === T.invFilter).sort((a, b) => b.date - a.date);
    const thInvRows = invR.map(i => { const status = ['issued', 'partial'].includes(i.status) && i.date < now - 30 * DAY ? 'overdue' : i.status; const st = stI[status], bal = i.total - i.paid, can = ['issued', 'partial', 'overdue'].includes(status), draft = i.status === 'draft'; return { no: i.no, who: cl(i.c).name, desc: i.desc, date: dFmt(i.date), status: st[0], stBg: st[1], stColor: st[2], total: money(i.total), bal: i.status === 'void' ? '—' : money(bal), balColor: bal > 0 && can ? '#c0262d' : '#516378', payOff: !can && !draft, payOp: can || draft ? '1' : '.4', payLabel: draft ? 'Issue invoice' : 'Record payment', pay: draft ? () => up({ dr: { kind: 'invoice', id: i.id, form: {}, err: '' } }) : openForm('payment', { inv: String(i.id), amt: String(Math.round(bal * 100) / 100), method: 'E-transfer' }) }; });
    const monthStart = new Date(day0); monthStart.setDate(1); const ms = monthStart.getTime();
    const invMonth = T.invoices.filter(i => i.date >= ms && i.status !== 'void' && i.status !== 'draft').reduce((a, i) => a + i.total, 0);
    const colMonth = T.invoices.filter(i => i.date >= ms).reduce((a, i) => a + i.paid, 0);
    // tasks
    const prC = { High: ['#fdecec', '#c0262d'], Medium: ['#fdf3e1', '#a46407'], Low: ['#eef2f7', '#516378'] };
    const canSee = (t) => !t.c || role !== 'billing' || t.team === 'Billing';
    const tk = (t) => { const done = t.status === 'done'; return { cat: t.cat, sub: t.team + ' · due ' + dFmt(t.due) + (t.c ? ' · ' + (canSee(t) ? showName(cl(t.c)) : 'client restricted') : ''), pr: t.pr, pBg: prC[t.pr][0], pColor: prC[t.pr][1], check: done ? '✓' : '', bg: done ? '#1f8a52' : '#fff', bc: done ? '#1f8a52' : '#cfdceb', tc: done ? '#8a9bb0' : '#10233a', strike: done ? 'line-through' : 'none', aria: done ? 'Reopen task' : 'Complete task', toggle: () => { up(x => ({ tasks: x.tasks.map(y => y.id === t.id ? { ...y, status: done ? 'todo' : 'done' } : y) })); this.flash(done ? 'Task reopened' : 'Task completed'); } }; };
    const groups = [['Overdue', '#c0262d', T.tasks.filter(t => t.status !== 'done' && t.due < now)], ['Upcoming', '#0890E8', T.tasks.filter(t => t.status !== 'done' && t.due >= now)], ['Completed', '#1f8a52', T.tasks.filter(t => t.status === 'done')]].map(([t, c, a]) => ({ t, c, n: a.length + (a.length === 1 ? ' task' : ' tasks'), items: a.sort((x, y) => x.due - y.due).map(tk), empty: !a.length }));
    // reports (aggregate, fictional)
    const rEnd = new Date(day0); rEnd.setDate(1); const pEnd = rEnd.getTime(); const rStart = new Date(rEnd); rStart.setMonth(rStart.getMonth() - (T.repPeriod === 'last' ? 1 : 3)); const pStart = rStart.getTime();
    const inP = (t) => t >= pStart && t < pEnd, pAp = T.appts.filter(a => inP(a.start));
    const firstOf = (cid) => Math.min(...T.appts.filter(a => a.c === cid && !['cancelled'].includes(a.status)).map(a => a.start));
    const workH = Math.round((pEnd - pStart) / DAY / 7 * wh.reduce((a2, w2) => a2 + (w2 ? w2[1] - w2[0] - 1 : 0), 0));
    const bookedH = pAp.filter(a => a.status !== 'cancelled').reduce((a2, a) => a2 + a.dur / 60, 0);
    const waits = T.wait.filter(w => w.status === 'scheduled' && w.done && inP(w.done)).map(w => (w.done - w.added) / DAY);
    const srcN = {}; T.clients.filter(c => c.created && inP(c.created)).forEach(c => { const k = c.src || 'Not recorded'; srcN[k] = (srcN[k] || 0) + 1; }); const srcT = Object.values(srcN).reduce((a2, b) => a2 + b, 0);
    const small = (n) => n > 0 && n < 5 ? '<5' : n;
    const R = [pAp.filter(a => !['cancelled'].includes(a.status)).length, [...new Set(pAp.map(a => a.c))].filter(c => inP(firstOf(c))).length, pAp.filter(a => a.status === 'cancelled').length, pAp.filter(a => a.status === 'no-show').length, workH ? Math.round(bookedH / workH * 100) : 0, Math.max(0, Math.round(workH - bookedH)), T.wait.filter(w => !['scheduled', 'closed'].includes(w.status)).length, waits.length ? (waits.reduce((a2, b) => a2 + b, 0) / waits.length).toFixed(1) : '—', T.invoices.filter(i => i.paidAt && inP(i.paidAt)).reduce((a2, i) => a2 + (i.paidAmt || i.paid), 0), T.invoices.filter(i => inP(i.date) && !['void', 'draft'].includes(i.status)).reduce((a2, i) => a2 + i.total, 0)];
    const thReport = [['Appointment volume', R[0], 'Completed + scheduled appointments in the period, excluding cancellations.'], ['First appointments', R[1], 'Clients whose first-ever appointment fell in the period.'], ['Cancellations', R[2], 'Late and early cancellations combined.'], ['No-shows', small(R[3]), 'Counts below 5 are hidden to protect privacy.'], ['Therapist utilization', R[4] + '%', 'Booked hours ÷ available working hours.'], ['Available capacity', R[5] + ' h', 'Open bookable hours left in the period.'], ['Waitlist size', small(R[6]), 'Open entries today.'], ['Avg. waiting time', R[7] === '—' ? '—' : R[7] + ' days', 'Days from waitlist entry to first appointment.'], ['Revenue collected', money(R[8]), 'Payments actually received. Not the same as invoiced.'], ['Revenue invoiced', money(R[9]), 'Total of issued invoices in the period.'], ['Outstanding balances', fin ? money(outBal) : 'Restricted', 'Unpaid amounts on issued invoices today.'], ['Referral sources', srcT ? Object.entries(srcN).sort((a2, b) => b[1] - a2[1]).map(([k, n]) => k + ' ' + Math.round(n / srcT * 100) + '%').join(' · ') : 'No new clients in the period', 'Share of new clients by recorded source.']].map(([l, v, def]) => ({ l, v: String(v), def }));
    // drawer
    const dr = T.dr; let dv = { thDrOpen: !!dr, thDrTitle: '', thDrFacts: [], thDrFields: [], thDrErr: false, thDrErrText: '', thDrRecur: false, thRecurOpts: [], thDrCanCancel: false, thDrSaveLabel: 'Save' };
    if (dr) { const F2 = dr.form; const fld = (k, label, type, options) => ({ label, type: type === 'select' ? 'text' : type, isInput: type !== 'select', isSelect: type === 'select', value: F2[k] == null ? '' : F2[k], options: (options || []).map(x => Array.isArray(x) ? { v: x[0], t: x[1] } : { v: x, t: x }), err: (dr.errs || {})[k] || '', errDisplay: (dr.errs || {})[k] ? 'block' : 'none', border: (dr.errs || {})[k] ? '#e0787c' : '#dbe6f0', onChange: (e) => { const v = e.target.value; up(t => ({ dr: { ...t.dr, form: { ...t.dr.form, [k]: v } } })); } });
      const cOpts = T.clients.filter(c => c.status !== 'archived').map(c => [String(c.id), c.name]);
      if (dr.kind === 'appt' && dr.id) { const a = T.appts.find(x => x.id === dr.id); dv.thDrTitle = 'Appointment'; dv.thDrFacts = [['Client', showName(cl(a.c))], ['Therapist', thDisplay], ['Category', a.cat], ['Duration', a.dur + ' min'], ['Format', a.fmt === 'Online' ? 'Online (video link sent by your telehealth tool)' : 'In-person · ' + a.room], ['Fee', fin ? money(a.fee) : 'Restricted']].map(([k, v]) => ({ k, v })); dv.thDrFields = [fld('date', 'Date & time (clinic time)', 'datetime-local'), fld('status', 'Appointment status', 'select', Object.entries(stA).map(([k, v]) => [k, v[0]]))]; dv.thDrRecur = a.rec; dv.thRecurOpts = [['this', 'This appointment'], ['future', 'This and future']].map(([k, t]) => ({ t, go: () => up(x => ({ dr: { ...x.dr, scope: k } })), bg: dr.scope === k ? '#0890E8' : '#fff', color: dr.scope === k ? '#fff' : '#1f3550', border: dr.scope === k ? '#0890E8' : '#cfdceb' })); dv.thDrCanCancel = !['cancelled', 'completed'].includes(a.status); dv.thDrSaveLabel = 'Save changes'; }
      if (dr.kind === 'appt' && !dr.id) { dv.thDrTitle = 'Book appointment'; dv.thDrFields = [fld('c', 'Client', 'select', [['', 'Choose client…']].concat(cOpts)), fld('cat', 'Appointment category', 'select', ['Consultation', 'Individual appointment', 'Extended appointment']), fld('date', 'Date & time (clinic time)', 'datetime-local'), fld('dur', 'Duration (minutes)', 'select', ['20', '50', '80']), fld('fmt', 'Format', 'select', ['In-person', 'Online']), fld('repeat', 'Repeats', 'select', [['no', 'Does not repeat'], ['weekly', 'Weekly'], ['biweekly', 'Every 2 weeks']])]; dv.thDrSaveLabel = 'Book appointment'; }
      if (dr.kind === 'client') { dv.thDrTitle = dr.id ? 'Edit client details' : 'Add client'; dv.thDrFields = [fld('name', 'Full name', 'text'), fld('pref', 'Preferred name (optional)', 'text'), fld('ch', 'Preferred contact method', 'select', ['Email', 'SMS', 'Phone']), fld('email', 'Email', 'email'), fld('phone', 'Phone', 'tel'), fld('status', 'Administrative status', 'select', Object.entries(stC).map(([k, v]) => [k, v[0]])), fld('sched', 'Scheduling preference (optional)', 'text'), fld('src', 'How they found you', 'select', [['', 'Not recorded'], 'Directory', 'Referral partner', 'Website', 'Word of mouth', 'Other'])]; dv.thDrSaveLabel = dr.id ? 'Save changes' : 'Add client'; }
      if (dr.kind === 'wait') { dv.thDrTitle = 'Add to waitlist'; dv.thDrFields = [fld('c', 'Client or prospective client', 'select', [['', 'Choose client…']].concat(cOpts)), fld('days', 'Preferred days & times', 'text'), fld('fmt', 'Format preference', 'select', ['In-person', 'Online', 'Either']), fld('next', 'Next follow-up', 'date')]; dv.thDrSaveLabel = 'Add to waitlist'; }
      if (dr.kind === 'invoice' && !dr.id) { dv.thDrTitle = 'Create invoice'; dv.thDrFields = [fld('c', 'Client', 'select', [['', 'Choose client…']].concat(cOpts)), fld('desc', 'Description', 'select', ['Individual appointment · 50 min', 'Extended appointment · 80 min', 'Consultation · 20 min', 'Late cancellation fee', 'Missed appointment fee']), fld('total', 'Amount (CAD, before tax)', 'number'), fld('tax', 'Tax', 'select', [['none', 'No tax (exempt service)'], ['hst', 'HST 13%']])]; dv.thDrSaveLabel = 'Save as draft'; }
      if (dr.kind === 'invoice' && dr.id) { const i = T.invoices.find(x => x.id === dr.id) || {}; dv.thDrTitle = 'Draft invoice · ' + (i.no || ''); dv.thDrFacts = [['Client', cl(i.c).name], ['Description', i.desc], ['Amount', money(i.total || 0)], ['Created', dFmt(i.date || now)]].map(([k, v]) => ({ k, v })); dv.thDrSaveLabel = 'Issue invoice'; }
      if (dr.kind === 'payment') { const i = T.invoices.find(x => x.id === +F2.inv) || { no: '', total: 0, paid: 0 }; dv.thDrTitle = 'Record payment · ' + i.no; dv.thDrFacts = [{ k: 'Balance due', v: money(i.total - i.paid) }]; dv.thDrFields = [fld('amt', 'Amount received', 'number'), fld('method', 'Method', 'select', ['E-transfer', 'Card terminal', 'Cash', 'Cheque'])]; dv.thDrSaveLabel = 'Record payment'; }
      if (dr.kind === 'task') { dv.thDrTitle = 'Add task'; dv.thDrFields = [fld('cat', 'Category', 'select', ['Confirm appointment', 'Contact about scheduling', 'Follow up on waitlist offer', 'Review unpaid invoice', 'Update contact details', 'Review therapist availability', 'Prepare monthly business report']), fld('team', 'Responsible', 'select', ['Owner', 'Reception', 'Billing']), fld('due', 'Due date', 'date'), fld('pr', 'Priority', 'select', ['High', 'Medium', 'Low'])]; dv.thDrSaveLabel = 'Add task'; }
      if (dr.kind === 'block') { dv.thDrTitle = 'Block time'; dv.thDrFields = [fld('from', 'From', 'datetime-local'), fld('to', 'To', 'datetime-local'), fld('why', 'Type', 'select', ['Planned leave', 'Admin time', 'Training', 'Other'])]; dv.thDrSaveLabel = 'Block time'; }
      dv.thDrErr = !!dr.err; dv.thDrErrText = dr.err;
    }
    const save = () => { const d = this.state.th.dr, f = d.form, errs = {}; let err = '';
      const req = (k, m) => { if (!String(f[k] || '').trim()) errs[k] = m || 'Required'; };
      if (d.kind === 'appt' && !d.id) { req('c', 'Choose a client'); req('date', 'Choose a date and time'); if (!errs.date) { const st = new Date(f.date).getTime(), du = +(f.dur || 50), buf = +T.buffer * 6e4; const clash = T.appts.find(a => a.status !== 'cancelled' && st < a.start + a.dur * 6e4 + buf && st + du * 6e4 + buf > a.start); if (clash) errs.date = 'Conflicts with an appointment at ' + tFmt(clash.start) + ' (incl. ' + T.buffer + '-min buffer). Choose another time.'; } }
      if (d.kind === 'client') { req('name'); if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) errs.email = 'Enter a valid email'; if (!f.email && !f.phone) errs.phone = 'Add at least an email or a phone number'; const dup = !d.id && T.clients.find(c => (f.phone && c.phone === f.phone) || (f.email && (c.email || '').toLowerCase() === String(f.email).toLowerCase())); if (dup && !d.dupOk) { err = 'Possible duplicate of ' + dup.name + '. Save again to create a separate record, or cancel and open the existing one.'; up(t => ({ dr: { ...t.dr, dupOk: true, err } })); return; } }
      if (d.kind === 'wait') { req('c', 'Choose a client'); req('days'); }
      if (d.kind === 'invoice' && !d.id) { req('c', 'Choose a client'); if (!(+f.total > 0)) errs.total = 'Enter an amount above 0'; }
      if (d.kind === 'payment') { const i = T.invoices.find(x => x.id === +f.inv) || { total: 0, paid: 0 }; if (!(+f.amt > 0)) errs.amt = 'Enter an amount above 0'; else if (+f.amt > i.total - i.paid) errs.amt = 'Can’t exceed the balance of ' + money(i.total - i.paid) + '. Record the extra as a credit instead.'; }
      if (d.kind === 'task') req('due', 'Choose a due date');
      if (d.kind === 'block') { req('from'); req('to'); if (f.from && f.to && f.to <= f.from) errs.to = 'End must be after start'; }
      if (Object.keys(errs).length) { up(t => ({ dr: { ...t.dr, errs, err: 'Fix ' + Object.keys(errs).length + (Object.keys(errs).length > 1 ? ' fields' : ' field') + ' to continue.' } })); return; }
      up(t => { const id = t.nextId; const o = { nextId: id + 1, dr: null }; const lg = [];
        if (d.kind === 'appt' && d.id) o.appts = t.appts.map(a => a.id === d.id || (d.scope === 'future' && a.rec && a.c === t.appts.find(x => x.id === d.id).c && a.start > t.appts.find(x => x.id === d.id).start) ? { ...a, status: a.id === d.id ? f.status : a.status, start: a.id === d.id && f.date ? new Date(f.date).getTime() : a.start } : a);
        if (d.kind === 'appt' && d.id) { const a0 = t.appts.find(x => x.id === d.id); lg.push(logIt('Appointment ' + (f.status !== a0.status ? 'marked ' + stA[f.status][0].toLowerCase() : 'updated') + ' · ' + dFmt(a0.start), a0.c)); if (f.status === 'no-show' && a0.status !== 'no-show' && fin && a0.fee) o.fees = (t.fees || []).concat({ id, appt: a0.id, fee: Math.round(a0.fee / 2), state: 'pending' }); }
        if (d.kind === 'appt' && !d.id) { const st0 = new Date(f.date).getTime(), du = +(f.dur || 50), cat = f.cat || 'Individual appointment', fmt = f.fmt || 'In-person', rec = f.repeat && f.repeat !== 'no', step = f.repeat === 'biweekly' ? 14 : 7;
          const series = rec ? Array.from({ length: f.repeat === 'biweekly' ? 6 : 12 }, (_, k) => st0 + k * step * DAY) : [st0];
          o.appts = t.appts.concat(series.map((st1, k) => ({ id: id + k, c: +f.c, start: st1, dur: du, cat, fmt, room: fmt === 'In-person' ? 'Office' : 'Online', status: 'scheduled', fee: feeFor(cat, du), rec: !!rec })));
          o.nextId = id + series.length;
          if (f.waitId) o.wait = t.wait.map(w => w.id === +f.waitId ? { ...w, status: 'scheduled', done: now } : w); o.clients = t.clients.map(c => c.id === +f.c && ['inquiry', 'waitlisted'].includes(c.status) ? { ...c, status: 'active' } : c);
          lg.push(logIt('Appointment booked · ' + dFmt(st0) + ', ' + tFmt(st0) + (rec ? ' (repeats ' + (step === 7 ? 'weekly' : 'every 2 weeks') + ')' : ''), +f.c)); }
        if (d.kind === 'client') { o.clients = d.id ? t.clients.map(c => c.id === d.id ? { ...c, ...f } : c) : t.clients.concat({ id, name: f.name.trim(), pref: f.pref || '', ch: f.ch || 'Email', email: f.email || '', phone: f.phone || '', status: f.status || 'inquiry', sched: f.sched || '', src: f.src || '', bal: 0, voicemail: (f.ch || '') === 'Phone', tz: clinicTz, created: now }); lg.push(logIt(d.id ? 'Contact details updated' : 'Client record created', d.id || id)); }
        if (d.kind === 'wait') { lg.push(logIt('Added to waitlist', +f.c)); o.wait = t.wait.concat({ id, c: +f.c, added: now, days: f.days, fmt: f.fmt || 'Either', loc: 'Any', staff: 'Reception', next: f.next ? new Date(f.next + 'T12:00').getTime() : now + 3 * DAY, status: 'awaiting' }); o.clients = t.clients.map(c => c.id === +f.c && c.status === 'inquiry' ? { ...c, status: 'waitlisted' } : c); }
        if (d.kind === 'invoice' && !d.id) { o.invoices = t.invoices.concat({ id, no: 'INV-' + (1000 + id), c: +f.c, desc: f.desc || 'Individual appointment · 50 min', date: now, total: Math.round(+f.total * (f.tax === 'hst' ? 1.13 : 1) * 100) / 100, paid: 0, status: 'draft' }); lg.push(logIt('Draft invoice created · INV-' + (1000 + id), +f.c)); }
        if (d.kind === 'invoice' && d.id) { o.invoices = t.invoices.map(i => i.id === d.id ? { ...i, status: 'issued', date: now } : i); const i0 = t.invoices.find(i => i.id === d.id); lg.push(logIt('Invoice issued · ' + i0.no, i0.c)); }
        if (d.kind === 'payment') { const i0 = t.invoices.find(i => i.id === +f.inv); o.invoices = t.invoices.map(i => i.id === +f.inv ? { ...i, paid: Math.round((i.paid + +f.amt) * 100) / 100, paidAt: now, paidAmt: (i.paidAmt || 0) + +f.amt, method: f.method, status: i.paid + +f.amt >= i.total ? 'paid' : 'partial' } : i); lg.push(logIt('Payment recorded · ' + money(+f.amt) + ' (' + (f.method || 'E-transfer') + ') · ' + i0.no, i0.c)); }
        if (d.kind === 'task') o.tasks = t.tasks.concat({ id, cat: f.cat || 'Confirm appointment', team: f.team || 'Reception', c: null, due: new Date(f.due + 'T12:00').getTime(), pr: f.pr || 'Medium', status: 'todo' });
        if (d.kind === 'block') { o.blocks = (t.blocks || []).concat({ id, from: new Date(f.from).getTime(), to: new Date(f.to).getTime(), why: f.why || 'Planned leave' }); lg.push(logIt('Time blocked · ' + (f.why || 'Planned leave'))); }
        if (lg.length) o.log = lg.concat(t.log || []).slice(0, 300);
        return o; });
      this.flash({ appt: d.id ? 'Appointment updated' : 'Appointment booked · reminder queued', client: d.id ? 'Client details updated' : 'Client added', wait: 'Added to waitlist', invoice: d.id ? 'Invoice issued' : 'Draft invoice saved', payment: 'Payment recorded · receipt ready', task: 'Task added', block: 'Time blocked' }[d.kind]); };
    const roles = [['owner', 'Clinic owner'], ['reception', 'Reception'], ['therapist', 'Therapist'], ['billing', 'Billing']];
    const roleNote = { owner: 'Full access, including finances and settings.', reception: 'Scheduling and contact details. Finances hidden.', therapist: 'Own clients and schedule. Finances hidden.', billing: 'Invoices and payments. Client names shortened on the calendar.' }[role];
    const thNav = [['overview', 'Overview', 'home'], ['leads', 'Enquiries', 'users'], ['clients', 'Clients', 'users'], ['calendar', 'Calendar', 'cal'], ['availability', 'Availability', 'chart'], ['waitlist', 'Waitlist', 'users'], ['billing', 'Billing & payments', 'card'], ['tasks', 'Tasks', 'chart'], ['partners', 'Referral partners', 'users'], ['reports', 'Reports', 'chart'], ['analytics', 'Analytics', 'chart'], ['profile', 'Profile', 'edit'], ['settings', 'Settings', 'gear']]
      .filter(([k]) => (k !== 'billing' || fin) && (k !== 'settings' || role === 'owner') && (k !== 'reports' || role === 'owner' || role === 'billing'));
    const tpl = nav[0] || {}; const icFrom = (k) => (nav.find(n => n.label && n.label.toLowerCase().startsWith(k)) || tpl).icon;
    const icMap = { home: icFrom('overview'), users: icFrom('enquiries'), cal: icFrom('calendar'), chart: icFrom('analytics'), card: icFrom('billing'), gear: icFrom('settings'), edit: icFrom('profile') };
    const curV = view === 'client' ? 'clients' : view;
    const navT = thNav.map(([k, label, icn]) => ({ ...tpl, k, active: curV === k, label, icon: icMap[icn], badge: k === 'leads' ? (nav.find(n => n.k === 'leads') || {}).badge || '' : k === 'tasks' && openTasks.filter(t => t.due < now).length ? String(openTasks.filter(t => t.due < now).length) : '', badgeDisplay: ((k === 'leads' && (nav.find(n => n.k === 'leads') || {}).badge) || (k === 'tasks' && openTasks.filter(t => t.due < now).length)) && tpl.labelDisplay === 'block' ? 'inline-flex' : 'none', go: k === 'partners' ? this.opGo('partners') : goV(k), bg: curV === k ? 'linear-gradient(135deg,#1aa0f0,#0a74c9)' : 'transparent', color: curV === k ? '#fff' : '#b7c7d8', shadow: curV === k ? '0 10px 22px -12px rgba(8,144,232,.9),inset 0 1px 0 rgba(255,255,255,.25)' : 'none' }));
    const rem = T.rem, remR = [['confirm', 'Appointment confirmation', 'Sent when booked', 'Your appointment with ' + practice + ' is booked for Tue, 10:00 AM. Reply C to confirm.'], ['remind', 'Upcoming reminder', '24 hours before', 'Reminder: appointment tomorrow at 10:00 AM.'], ['resched', 'Reschedule & cancellation notice', 'When changed', 'Your appointment has been moved to Thu, 2:00 PM.'], ['wait', 'Waitlist availability', 'When a slot is offered', 'A time is available on Wed at 6:00 PM. Reply to accept.'], ['pay', 'Payment reminder', '7 days after invoice', 'You have an outstanding balance. Pay or contact the clinic.']]
      .map(([k, t, when, preview]) => ({ t, when, preview, track: rem[k] ? '#0890E8' : '#cfdceb', knob: rem[k] ? '21px' : '3px', toggle: () => up(x => ({ rem: { ...x.rem, [k]: !x.rem[k] } })) }));
    const Y = '✓', N = '—';
    return { thOn: true, thRoles: roles.map(([k, t]) => ({ t, go: () => { up({ role: k }); if (k !== 'owner' && ['settings'].includes(view)) this.setState({ view: 'overview' }); }, bg: role === k ? '#fff' : 'transparent', color: role === k ? '#10233a' : '#6b7f95', shadow: role === k ? '0 2px 8px -3px rgba(16,35,58,.25)' : 'none' })), thRoleNote: roleNote,
      nav: navT, isOverview: false, isLeads: view === 'leads', isAnalytics: view === 'analytics', isBilling: false, isCalendar: false, isProfile: view === 'profile',
      thIsOverview: view === 'overview', thIsClients: view === 'clients', thIsClient: view === 'client', thIsCal: view === 'calendar', thIsAvail: view === 'availability', thIsWait: view === 'waitlist', thIsBill: view === 'billing' && fin, thIsTasks: view === 'tasks', thIsReports: view === 'reports', thIsSettingsX: view === 'settings',
      isReports: false, isTasks: false, isFacilities: false, isMarketing: false,
      thFirst: (uname || 'there').split(' ')[0], thToday: new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' }), thTz: clinicTz.replace(/^[A-Za-z]+\//, '').replace(/_/g, ' '), thName: thDisplay,
      thQuick: [['Add client', openForm('client', { ch: 'Email', status: 'inquiry' })], ['Book appointment', openForm('appt', { cat: 'Individual appointment', dur: '50', fmt: 'In-person', repeat: 'no' })], ['Add to waitlist', openForm('wait', { fmt: 'Either' })], ['Create invoice', openForm('invoice', { desc: 'Individual appointment · 50 min', tax: 'none' })], ['Create admin task', openForm('task', { cat: 'Confirm appointment', team: 'Reception', pr: 'Medium' })]].filter(([t]) => fin || t !== 'Create invoice').map(([t, go]) => ({ t, go })),
      thKpis, thCols3: wide ? 'repeat(3,minmax(0,1fr))' : vw >= 640 ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)', thCols4: wide ? 'repeat(4,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))', thSplit: wide ? 'minmax(0,1.3fr) minmax(0,1fr)' : 'minmax(0,1fr)',
      thTodayList: todayAp.map(a => ({ time: tFmt(a.start), who: showName(cl(a.c)), meta: a.cat + ' · ' + a.dur + ' min · ' + (a.fmt === 'Online' ? 'Online' : a.room), status: stA[a.status][0], stBg: stA[a.status][1], stColor: stA[a.status][2], open: openAppt(a) })), thTodayEmpty: !todayAp.length, thGoCal: goV('calendar'),
      thWeekAvail: weekAvail, thWaitDue: T.wait.filter(w => !['scheduled', 'closed'].includes(w.status) && w.next < now + 7 * DAY).map(w => ({ who: cl(w.c).name, pref: w.days + ' · follow up ' + dFmt(w.next), status: stW[w.status][0], stBg: stW[w.status][1], stColor: stW[w.status][2] })), thWaitDueEmpty: !T.wait.filter(w => !['scheduled', 'closed'].includes(w.status) && w.next < now + 7 * DAY).length, thGoWait: goV('waitlist'),
      thFin: fin, thNoFin: !fin, thFinDisplay: fin ? 'inline' : 'none', thGoBill: goV('billing'), thOwing: outstanding.sort((a, b) => a.date - b.date).slice(0, 3).map(i => ({ who: cl(i.c).name, no: i.no, date: dFmt(i.date), bal: money(i.total - i.paid), c: i.status === 'overdue' ? '#c0262d' : '#1f3550' })),
      thTrend: (() => { const ms0 = [5, 4, 3, 2, 1, 0].map(o => { const d = new Date(day0); d.setDate(1); d.setMonth(d.getMonth() - o); const e = new Date(d); e.setMonth(e.getMonth() + 1); const inM = T.appts.filter(a => a.start >= d.getTime() && a.start < e.getTime() && a.start <= now); return { o, d, c: inM.filter(a => ['completed', 'arrived', 'confirmed', 'scheduled'].includes(a.status)).length, x: inM.filter(a => a.status === 'cancelled').length, n: inM.filter(a => a.status === 'no-show').length }; }); const mx = Math.max(4, ...ms0.map(m => m.c + m.x + m.n));
        return ms0.map(({ o, d, c, x, n }) => ({ m: d.toLocaleDateString('en-CA', { month: 'short' }) + (o === 0 ? ' (to date)' : ''), ch: (c / mx * 130) + 'px', xh: (x / mx * 130) + 'px', nh: (n / mx * 130) + 'px', ct: c + ' completed · ' + x + ' cancelled · ' + n + ' no-shows' })); })(),
      thDeadlines: T.tasks.filter(t => t.status !== 'done' && t.due >= now && t.due < now + 14 * DAY).sort((a, b) => a.due - b.due).map(t => ({ cat: t.cat, sub: t.team, when: dFmt(t.due), bg: '#eaf5fd', color: '#0a5d96' })), thDeadEmpty: !T.tasks.filter(t => t.status !== 'done' && t.due >= now && t.due < now + 14 * DAY).length,
      thAddClient: openForm('client', { ch: 'Email', status: 'inquiry' }), thCliQ: T.cliQ, onThCliQ: (e) => up({ cliQ: e.target.value }), thCliStatus: sel('cliStatus', T.cliStatus, [['all', 'All (not archived)']].concat(Object.entries(stC).map(([k, v]) => [k, v[0]]))), thCliSort: sel('cliSort', T.cliSort, [['name', 'Name'], ['next', 'Next appointment']].concat(fin ? [['bal', 'Balance']] : [])),
      thCliCols: ['Client', 'Preferred contact', 'Status', 'Next appointment', 'Balance', ''], thCliRows, thCliEmpty: !thCliRows.length,
      thDupOn: !T.dupDismissed && !!dupA && !!dupB, thDupText: (dupA || {}).name + ' and ' + (dupB || {}).name + ' share the same ' + (dupA && dupB && dupA.phone && dupA.phone === dupB.phone ? 'phone number' : 'email address') + '. Records are never merged automatically.', thDupKeep: () => { const key = [dupA.id, dupB.id].sort().join('-'); up(t => ({ dupOk: (t.dupOk || []).concat(key) })); this.flash('Marked as separate clients'); }, thDupReview: goV('client', { sel: dupB ? dupB.id : null, cpTab: 'overview' }),
      thGoClients: goV('clients'), thCp: { name: cp.name, initials: cp.name.split(' ').map(x => x[0]).join('').slice(0, 2), status: stC[cp.status][0], stBg: stC[cp.status][1], stColor: stC[cp.status][2], sub: (cp.id < 0 ? 'Add a client to get started' : 'Client since ' + new Date(cp.created || now).toLocaleDateString('en-CA', { month: 'short', year: 'numeric' }) + ' · ' + cp.ch + ' preferred') },
      thCpBook: openForm('appt', { c: String(cp.id), cat: 'Individual appointment', dur: '50', fmt: 'In-person', repeat: 'no' }), thCpEdit: () => cp.id < 0 ? openForm('client', { ch: 'Email', status: 'inquiry' })() : up({ dr: { kind: 'client', id: cp.id, form: { name: cp.name, pref: cp.pref, ch: cp.ch, email: cp.email, phone: cp.phone, status: cp.status, sched: cp.sched || '', src: cp.src || '' } } }),
      thCpTabs: tabs.map(([k, t]) => ({ t, go: () => up({ cpTab: k }), bg: T.cpTab === k ? '#10233a' : 'transparent', color: T.cpTab === k ? '#fff' : '#516378' })), thCpFactsOn: ['overview', 'comms'].includes(T.cpTab), thCpListOn: ['appts', 'billing', 'activity'].includes(T.cpTab), thCpFacts: facts.map(([k, v]) => ({ k, v, c: '#10233a' })), thCpCols: cpCols, thCpRows: cpRows, thCpEmpty: !cpRows.length,
      thBook: openForm('appt', { cat: 'Individual appointment', dur: '50', fmt: 'In-person', repeat: 'no' }), thCalModes: [['day', 'Day'], ['week', 'Week'], ['month', 'Month']].map(([k, t]) => ({ t, go: () => up({ calMode: k, calOff: 0 }), bg: T.calMode === k ? '#10233a' : 'transparent', color: T.calMode === k ? '#fff' : '#516378' })),
      thCalPrev: () => up({ calOff: T.calOff - 1 }), thCalNext: () => up({ calOff: T.calOff + 1 }), thCalToday: () => up({ calOff: 0 }), thCalLabel: calLabel, thCalFmt: sel('calFmt', T.calFmt, [['all', 'All'], 'In-person', 'Online']), thCalRoom: sel('calRoom', T.calRoom, [['all', 'All'], 'Room 2', 'Online']),
      thCalGridOn: T.calMode !== 'month', thCalMonthOn: T.calMode === 'month', thCalN: nDays, thCalMinW: (56 + nDays * 140) + 'px', thCalDays: calDays, thHours: ['9 AM', '10', '11', '12 PM', '1', '2', '3', '4', '5', '6', '7'], thCalH: (11 * 56) + 'px', thMonthCells, thBufferLabel: T.buffer === '0' ? 'none' : T.buffer + ' minutes',
      thBlock: openForm('block', { why: 'Planned leave' }), thUtil: [{ period: 'This week', l: 'Booked hours', v: weekAvail.reduce((a, d) => a + d.booked, 0).toFixed(1) + ' h', s: 'Across ' + weekAp.length + ' appointments', c: '#10233a' }, { period: 'This week', l: 'Available hours', v: weekAvail.reduce((a, d) => a + d.tot - d.booked, 0).toFixed(1) + ' h', s: 'Within working hours', c: '#1f8a52' }, { period: 'This week', l: 'Utilization', v: Math.round(weekAvail.reduce((a, d) => a + d.booked, 0) / Math.max(1, weekAvail.reduce((a, d) => a + d.tot, 0)) * 100) + '%', s: 'Booked ÷ available', c: '#0890E8' }, { period: 'Weekly', l: 'Appointment capacity', v: Math.floor(weekAvail.reduce((a, d) => a + d.tot, 0) * 60 / (50 + +T.buffer)) + ' slots', s: '50-min appointments + buffer', c: '#10233a' }],
      thProfFacts: [['Business email', td.email || (S.user && S.user.email) || '—'], ['Business phone', td.phone || '—'], ['Location', [td.city, (td.modes || []).join(' & ')].filter(Boolean).join(' · ') || '—'], ['Appointment lengths', '20 · 50 · 80 min'], ['Standard fees', fin ? (feeStd ? (td.consult ? 'Free consult · ' : '') + money(feeStd) + ' · ' + money(feeFor('Extended', 80)) : 'Not set · edit your profile') : 'Restricted'], ['Buffer between appointments', T.buffer === '0' ? 'None' : T.buffer + ' minutes']].map(([k, v]) => ({ k, v })),
      thBuffer: T.buffer, thSetBuffer: (e) => { up({ buffer: e.target.value }); this.flash('Buffer updated'); }, thAcceptLabel: T.accept ? '● Accepting new clients' : '○ Not accepting new clients', thAcceptColor: T.accept ? '#1f8a52' : '#8a9bb0', thToggleAccept: () => { up({ accept: !T.accept }); this.saveTherapist({ accepting: !T.accept }, !T.accept ? 'Profile now shows: accepting new clients' : 'Profile now shows: not accepting new clients'); },
      thHoursRows: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((d, i) => ({ d, t: wh[i] ? wh[i][0] + ':00 – ' + wh[i][1] + ':00' : 'Not working', room: (td.modes || []).length ? (td.modes || []).join(' + ') : 'Office + online' })), thLeave: (T.blocks || []).filter(b => b.to > now).sort((a, b) => a.from - b.from).map(b => ({ t: b.why, d: dFmt(b.from) + (new Date(b.from).toDateString() === new Date(b.to).toDateString() ? ', ' + tFmt(b.from) + '–' + tFmt(b.to) : ' – ' + dFmt(b.to)) })), thRooms: [{ t: 'Office' + (td.city ? ' · ' + td.city : ''), s: 'Double-booking blocked (incl. buffer)' }, { t: 'Online', s: 'Use your own telehealth tool' }],
      thAddWait: openForm('wait', { fmt: 'Either' }), thWaitCols: ['Client', 'Preferences', 'Assigned', 'Next follow-up', 'Status', ''], thWaitRows, thWaitEmpty: !thWaitRows.length,
      thAddInv: openForm('invoice', { desc: 'Individual appointment · 50 min', tax: 'none' }), thCur: 'CAD', thBillStats: [{ period: 'This month', l: 'Invoiced', v: money(invMonth), s: 'Issued invoices, incl. unpaid', c: '#10233a' }, { period: 'This month', l: 'Collected', v: money(colMonth), s: 'Payments actually received', c: '#1f8a52' }, { period: 'Current', l: 'Outstanding', v: money(outBal), s: outstanding.length + ' invoices', c: '#c0262d' }, { period: 'Current', l: 'Drafts', v: String(T.invoices.filter(i => i.status === 'draft').length), s: 'Not yet issued', c: '#516378' }],
      thFeeQueueOn: fees.length > 0, thFeeQueue: fees, thInvFilter: sel('invFilter', T.invFilter, [['all', 'All']].concat(Object.entries(stI).map(([k, v]) => [k, v[0]]))), thInvCols: ['Invoice', 'Client', 'Description', 'Date', 'Status', 'Total', 'Balance', ''], thInvRows, thInvEmpty: !thInvRows.length,
      thAddTask: openForm('task', { cat: 'Confirm appointment', team: 'Reception', pr: 'Medium' }), thTaskGroups: groups,
      thRepPeriod: sel('repPeriod', T.repPeriod, [['last', 'Last month'], ['q', 'Last 3 months']]), thReport, thExport: () => { const csv = 'Metric,Value,Definition\n' + thReport.map(r => '"' + r.l + '","' + r.v + '","' + r.def + '"').join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'practice-report-aggregate.csv'; a.click(); this.flash('Aggregate report exported · no client data included'); },
      thRem: remR, thRemCols: vw >= 760 ? 'minmax(0,1fr) 160px 50px' : 'minmax(0,1fr) 50px',
      thPermCols: ['Area', 'Owner', 'Reception', 'Therapist', 'Billing'], thPerms: [['Client contact details', Y, Y, 'Own clients', 'Name + email'], ['Calendar', Y, Y, 'Own schedule', 'Shortened names'], ['Invoices & payments', Y, N, N, Y], ['Reports', Y, N, N, Y], ['Settings & permissions', Y, N, N, N], ['Exports', 'Aggregate only', N, N, 'Aggregate only']].map(([t, ...c]) => ({ t, cells: c.map(v => ({ v, c: v === N ? '#b7c3d0' : '#1f3550' })) })),
      thSec: [['Staff invitations', 'Invite by email · remove access instantly', 'Proposed', '#516378'], ['Multi-factor authentication', 'Required for all staff', 'Required', '#1f8a52'], ['Session timeout', 'Sign out after inactivity', '15 minutes', '#1f3550'], ['Access & change log', 'Who viewed or changed records', 'On', '#1f8a52'], ['Restricted exports', 'Client-level exports disabled', 'On', '#1f8a52'], ['Retention & archive', 'Archive inactive clients after', '24 months', '#1f3550'], ['Correction requests', 'Clients can ask to correct their details', 'Workflow · proposed', '#516378']].map(([t, s2, v, c]) => ({ t, s: s2, v, c })),
      thLog: (T.log || []).slice(0, 8).map(l => ({ t: (l.by || 'Owner') + ' · ' + l.t + (l.c != null && l.c >= 0 ? ' · Client ' + cl(l.c).name.split(' ').map(x => x[0]).join('') + '.' : ''), w: (() => { const m = Math.round((now - l.at) / 6e4); return m < 1 ? 'Just now' : m < 60 ? m + ' min ago' : m < 1440 ? Math.round(m / 60) + ' h ago' : m < 2880 ? 'Yesterday' : Math.round(m / 1440) + ' days ago'; })() })),
      ...dv, thDrClose: () => up({ dr: null }), thDrSave: save, thDrCancelAppt: () => { const d = T.dr; up(t => ({ appts: t.appts.map(a => a.id === d.id || (d.scope === 'future' && a.rec && a.c === t.appts.find(x => x.id === d.id).c && a.start > t.appts.find(x => x.id === d.id).start) ? { ...a, status: 'cancelled' } : a), dr: null, log: [logIt('Appointment cancelled' + (d.scope === 'future' ? ' (this and future)' : ''), (t.appts.find(x => x.id === d.id) || {}).c)].concat(t.log || []).slice(0, 300) })); this.flash(d.scope === 'future' ? 'This and future appointments cancelled' : 'Appointment cancelled · notice queued'); },
    };
  }
  opSyncSel() { requestAnimationFrame(() => document.querySelectorAll('select[data-opsel]').forEach(el => { const v = el.getAttribute('data-val'); if (v != null && el.value !== v) el.value = v; })); }
  opMods = ['facilities', 'partners', 'reports', 'tasks', 'marketing'];
  opIc() {
    if (this._oic) return this._oic;
    const I = (p) => this.icon(p);
    this._oic = { building: I(['M4 21V5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16', 'M15 9h4a1 1 0 0 1 1 1v11', 'M3 21h18', 'M8 8h3', 'M8 12h3', 'M8 16h3']), hand: I(['M7 11l3-3 3 1 4-4 4 4-6 6', 'M3 13l4-2 6 6-2 2a2 2 0 0 1-2.8 0L3 14z']), report: I(['M6 3h9l4 4v14H6z', 'M14 3v5h5', 'M9 17v-3', 'M12 17v-6', 'M15 17v-2']), tasks: I(['M9 6h11', 'M9 12h11', 'M9 18h11', 'M4 6l1 1 2-2', 'M4 12l1 1 2-2', 'M4 18l1 1 2-2']), mega: I(['M3 10v4h4l6 4V6L7 10z', 'M17 9a4 4 0 0 1 0 6']) };
    return this._oic;
  }
  opGo(k) { return () => { this.setState({ view: k, notifOpen: false, opLoading: true }); window.scrollTo({ top: 0, behavior: 'smooth' }); clearTimeout(this._ol); this._ol = setTimeout(() => this.setState({ opLoading: false }), 450); }; }
  opDay(off) { const d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + off); return d.toISOString().slice(0, 10); }
  opMonth(off) { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - off); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); }
  opSeed() {
    // A centre's business records start empty and are kept in the workspace. The organization card starts from the account.
    const I = (this.props && this.props.initial) || {}, w = ((I.workspace || {}).op) || {};
    const arr = (k) => Array.isArray(w[k]) ? w[k] : [];
    const org = { name: (I.profile && I.profile.name) || (I.centres && I.centres[0] && I.centres[0].name) || '', email: (I.user && I.user.email) || '', city: (I.profile && I.profile.city) || '', ...(w.org || {}) };
    return { facQ: '', facProg: 'all', facStatus: 'all', facSort: 'name', parQ: '', parStatus: 'all', parType: 'all', parSort: 'next', mktPeriod: 'all', mktChannel: 'all', repScope: 'Organization-wide', repSort: 'new', taskQ: '', taskCat: 'all', taskTeam: 'all', period: this.opMonth(1), currency: 'CAD', suppress: true, actType: 'Introduced facility', actOutcome: 'Completed',
      ...w, facilities: arr('facilities'), partners: arr('partners').map(p => ({ ...p, log: Array.isArray(p.log) ? p.log : [] })), reports: arr('reports'), tasks: arr('tasks'), campaigns: arr('campaigns'), nextId: w.nextId || 1, updatedAt: w.updatedAt || Date.now(),
      org, orgErr: {}, dr: null, confirm: null };
  }
  opOverdue() { const o = this.state && this.state.op; if (!o) return 0; const t = this.opDay(0); return o.tasks.filter(x => x.status !== 'done' && x.due < t).length; }
  opSet(patch) { this.setState(st => ({ op: { ...st.op, ...(typeof patch === 'function' ? patch(st.op) : patch) } })); }
  opVals() {
    const o = this.state.op, vw = this.state.vw, mid = vw >= 760, wide = vw >= 1100;
    const today = this.opDay(0);
    const cur = o.currency, money = (n) => new Intl.NumberFormat('en-CA', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(n);
    const fmtD = (iso) => new Date(iso + 'T12:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
    const fmtM = (ym) => new Date(ym + '-15T12:00:00').toLocaleDateString('en-CA', { month: 'long', year: 'numeric' });
    const fmtMs = (ym) => new Date(ym + '-15T12:00:00').toLocaleDateString('en-CA', { month: 'short' });
    const dd = (iso) => Math.round((new Date(iso + 'T12:00:00') - new Date(today + 'T12:00:00')) / 864e5);
    const small = (n) => o.suppress && n > 0 && n < 5 ? '<5' : n.toLocaleString('en-CA');
    const selObj = (value, opts, key) => ({ value, opts: opts.map(x => Array.isArray(x) ? { v: x[0], t: x[1] } : { v: x, t: x }), onChange: (e) => { const v = e.target.value; this.opSet({ [key]: v }); } });
    const set = (p) => () => this.opSet(p);
    const stF = { Operational: ['#e6f4ec', '#1f8a52'], 'Limited intake': ['#fdf3e1', '#a46407'], 'Temporarily closed': ['#eef2f7', '#516378'] };
    const stP = { active: ['#e6f4ec', '#1f8a52', 'Active'], prospect: ['#eaf5fd', '#0a5d96', 'Prospect'], paused: ['#eef2f7', '#516378', 'Paused'] };
    const capC = (f) => f.status === 'Temporarily closed' ? '#9aabbd' : f.occ >= f.cap ? '#c0262d' : f.occ / f.cap >= .85 ? '#e09b1a' : '#0890E8';
    const repOf = (scope, m) => o.reports.find(r => r.scope === scope && r.month === m);
    const prevM = (ym) => { const [y, mm] = ym.split('-').map(Number); const d = new Date(y, mm - 2, 15); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };
    const pct = (a, b) => !b ? (a ? 'new' : '0%') : (a >= b ? '+' : '−') + Math.abs(Math.round((a - b) / b * 100)) + '%';
    // dr open helpers
    const openView = (kind, id) => () => this.opSet({ dr: { kind, mode: 'view', id, form: {}, errors: {}, tried: false } });
    const blank = { facility: { name: '', city: '', program: 'Residential', cap: '', occ: '', status: 'Operational' }, partner: { name: '', type: 'Hospital', web: '', cName: '', cRole: '', email: '', phone: '', owner: 'Business development', status: 'prospect', next: this.opDay(14) }, report: { month: this.opMonth(0), scope: 'Organization-wide', inq: '', adm: '', spend: '', rev: '' }, task: { cat: 'Review capacity', team: 'Operations', due: this.opDay(7), priority: 'Medium', status: 'todo' }, campaign: { name: '', channel: 'Paid search', period: this.opMonth(0), budget: '', spend: '', inq: '', att: '' } };
    const coll = { facility: 'facilities', partner: 'partners', report: 'reports', task: 'tasks', campaign: 'campaigns' };
    const openForm = (kind, id, preset) => () => { const rec = id != null ? o[coll[kind]].find(x => x.id === id) : null; const form = rec ? Object.fromEntries(Object.keys(blank[kind]).map(k => [k, rec[k] == null ? '' : String(rec[k])])) : { ...blank[kind], ...(preset || {}) }; this.opSet({ dr: { kind, mode: 'form', id, form, errors: {}, tried: false } }); };
    // ---------- overview ----------
    const fac = o.facilities, live = fac.filter(f => f.status !== 'Temporarily closed');
    const tCap = live.reduce((a, f) => a + f.cap, 0), tOcc = live.reduce((a, f) => a + f.occ, 0);
    const pm = o.period, pr = repOf('Organization-wide', pm), pp = repOf('Organization-wide', prevM(pm));
    const kpiP = (label, key, go) => pr ? { label, kind: 'Period total', value: pr[key].toLocaleString('en-CA'), size: '28px', valColor: '#10233a', sub: pp ? pct(pr[key], pp[key]) + ' vs ' + fmtMs(prevM(pm)) : 'No prior report to compare', subColor: '#516378', go } : { label, kind: 'Period total', value: 'No report submitted', size: '17px', valColor: '#8a9bb0', sub: 'Add the ' + fmtM(pm) + ' report', subColor: '#0890E8', go };
    const goRep = this.opGo('reports');
    const opKpis = [{ label: 'Available spaces', kind: 'Current snapshot', value: (tCap - tOcc).toLocaleString('en-CA'), size: '28px', valColor: '#1f8a52', sub: tOcc + ' occupied of ' + tCap + ' total', subColor: '#516378', go: this.opGo('facilities') }, kpiP('Inquiries', 'inq', goRep), kpiP('Admissions', 'adm', goRep),
      { label: 'Active referral partners', kind: 'Current', value: String(o.partners.filter(p => p.status === 'active').length), size: '28px', valColor: '#10233a', sub: o.partners.filter(p => p.status === 'prospect').length + ' prospects · ' + o.partners.filter(p => p.status === 'paused').length + ' paused', subColor: '#516378', go: this.opGo('partners') }];
    const tm = [5, 4, 3, 2, 1, 0].map(i => this.opMonth(i)), trR = tm.map(m => repOf('Organization-wide', m)), mx = Math.max(1, ...trR.filter(Boolean).map(r => r.inq));
    const opTrend = tm.map((m, i) => { const r = trR[i]; return { m: fmtMs(m), has: !!r, none: !r, ih: r ? Math.round(r.inq / mx * 150) + 'px' : '0', ah: r ? Math.max(3, Math.round(r.adm / mx * 150)) + 'px' : '0', it: r ? r.inq + ' inquiries' : '', at: r ? r.adm + ' admissions' : '' }; });
    const opCapRows = fac.map(f => ({ name: f.name, occ: f.occ, cap: f.cap, avail: f.status === 'Temporarily closed' ? 'Closed ·' : f.cap - f.occ, availColor: f.cap - f.occ === 0 || f.status === 'Temporarily closed' ? '#c0262d' : '#1f8a52', pct: (f.cap ? f.occ / f.cap * 100 : 0) + '%', c: capC(f) }));
    const due = (iso, done) => { const n = dd(iso); return done ? ['Completed', '#e6f4ec', '#1f8a52'] : n < 0 ? ['Overdue ' + (-n) + 'd', '#fdecec', '#c0262d'] : n === 0 ? ['Due today', '#fdf3e1', '#a46407'] : ['Due in ' + n + 'd', '#fdf3e1', '#a46407']; };
    const opAttnTasks = o.tasks.filter(t => t.status !== 'done' && dd(t.due) <= 7).sort((a, b) => a.due < b.due ? -1 : 1).slice(0, 4).map(t => { const [st, bg, color] = due(t.due); return { cat: t.cat, team: t.team, due: fmtD(t.due), state: st, bg, color }; });
    const opDuePartners = o.partners.filter(p => p.status !== 'paused' && dd(p.next) <= 14).sort((a, b) => a.next < b.next ? -1 : 1).slice(0, 4).map(p => { const n = dd(p.next); return { name: p.name, type: p.type, owner: p.owner, open: openView('partner', p.id), when: n < 0 ? 'Overdue ' + (-n) + 'd' : n === 0 ? 'Today' : 'In ' + n + ' days', color: n < 0 ? '#c0262d' : '#a46407' }; });
    // ---------- facilities ----------
    const q1 = o.facQ.trim().toLowerCase();
    let fr = fac.filter(f => (!q1 || (f.name + ' ' + f.city).toLowerCase().includes(q1)) && (o.facProg === 'all' || f.program === o.facProg) && (o.facStatus === 'all' || f.status === o.facStatus));
    fr = fr.slice().sort((a, b) => o.facSort === 'avail' ? (b.cap - b.occ) - (a.cap - a.occ) : o.facSort === 'occ' ? b.occ / b.cap - a.occ / a.cap : a.name.localeCompare(b.name));
    const opFacRows = fr.map(f => { const [b, c] = stF[f.status]; return { name: f.name, city: f.city, program: f.program, occ: f.occ, cap: f.cap, avail: f.cap - f.occ, availColor: f.cap - f.occ === 0 ? '#c0262d' : '#1f8a52', pct: (f.cap ? f.occ / f.cap * 100 : 0) + '%', c: capC(f), status: f.status, stBg: b, stColor: c, updated: fmtD(f.updated), view: openView('facility', f.id), edit: (e) => { e.stopPropagation(); openForm('facility', f.id)(); } }; });
    const progs = ['Residential', 'Detox', 'Outpatient', 'Intensive outpatient', 'Sober living'], fStats = ['Operational', 'Limited intake', 'Temporarily closed'];
    // ---------- partners ----------
    const q2 = o.parQ.trim().toLowerCase();
    let prr = o.partners.filter(p => (!q2 || (p.name + ' ' + p.type + ' ' + p.owner).toLowerCase().includes(q2)) && (o.parStatus === 'all' || p.status === o.parStatus) && (o.parType === 'all' || p.type === o.parType));
    prr = prr.slice().sort((a, b) => o.parSort === 'name' ? a.name.localeCompare(b.name) : o.parSort === 'last' ? (a.last < b.last ? 1 : -1) : (a.next < b.next ? -1 : 1));
    const pTypes = ['Hospital', 'Family physician clinic', 'EAP provider', 'Addiction counselling practice', 'Community health centre', 'Employer / union', 'Legal / court program'];
    const teams = ['Business development', 'Admissions team', "Clinical director's office", 'Marketing', 'Operations', 'Leadership'];
    const opParRows = prr.map(p => { const n = dd(p.next || today); return { name: p.name, web: p.web, type: p.type, owner: p.owner, status: stP[p.status][2], stBg: stP[p.status][0], stColor: stP[p.status][1], last: fmtD(p.last), next: fmtD(p.next) + (n < 0 && p.status !== 'paused' ? ' · overdue' : ''), nextColor: n < 0 && p.status !== 'paused' ? '#c0262d' : '#1f3550', view: openView('partner', p.id) }; });
    // ---------- marketing ----------
    let cr = o.campaigns.filter(c => (o.mktPeriod === 'all' || c.period === o.mktPeriod) && (o.mktChannel === 'all' || c.channel === o.mktChannel));
    const tB = cr.reduce((a, c) => a + c.budget, 0), tS = cr.reduce((a, c) => a + c.spend, 0), tI = cr.reduce((a, c) => a + c.inq, 0);
    const opMktRows = cr.map(c => { const sup = c.att != null && o.suppress && c.att < 5; return { name: c.name, channel: c.channel, period: fmtM(c.period), budget: money(c.budget), spend: money(c.spend), spendColor: c.spend > c.budget ? '#c0262d' : '#10233a', inq: c.inq.toLocaleString('en-CA'), cpi: c.inq ? money(c.spend / c.inq) : '—', att: c.att == null ? 'Not attributable' : small(c.att), cpa: c.att == null || !c.att ? '—' : sup ? 'Hidden (<5)' : money(c.spend / c.att), attColor: c.att == null ? '#8a9bb0' : '#1f3550', edit: openForm('campaign', c.id) }; });
    const maxCpi = Math.max(1, ...cr.filter(c => c.inq).map(c => c.spend / c.inq));
    const channelsAll = ['Paid search', 'Paid social', 'Directory', 'Email', 'Offline', 'Referral events'];
    const mktMonths = [...new Set(o.campaigns.map(c => c.period))].sort().reverse();
    // ---------- reports ----------
    const scopes = ['Organization-wide'].concat(fac.map(f => f.name));
    const own = o.reports.filter(r => r.scope === o.repScope);
    const earliest = own.length ? own.map(r => r.month).sort()[0] : this.opMonth(0);
    const months = []; for (let i = 0; i < 24; i++) { const m = this.opMonth(i); months.push(m); if (m <= earliest) break; }
    if (o.repSort === 'old') months.reverse();
    const opRepRows = months.map(m => { const r = repOf(o.repScope, m), p = repOf(o.repScope, prevM(m)); if (!r) return { month: fmtM(m), scope: o.repScope, has: false, none: true, add: openForm('report', null, { month: m, scope: o.repScope }) };
      return { month: fmtM(m), scope: r.scope, has: true, none: false, inq: r.inq.toLocaleString('en-CA'), adm: small(r.adm), spend: money(r.spend), rev: money(r.rev), ratio: r.inq ? (r.adm / r.inq * 100).toFixed(1) + '%' : '—', cmp: p ? 'Inquiries ' + pct(r.inq, p.inq) + ' · Admissions ' + pct(r.adm, p.adm) : 'No prior report', cmpColor: '#516378', edit: openForm('report', r.id), del: () => this.opSet({ confirm: { kind: 'report', id: r.id } }) }; });
    const opExport = () => { const rows = o.reports.filter(r => r.scope === o.repScope).sort((a, b) => a.month < b.month ? 1 : -1); const csv = ['Month,Scope,Inquiries,Admissions,Marketing spend (' + cur + '),Revenue (' + cur + '),Inquiry-to-admission ratio'].concat(rows.map(r => [r.month, '"' + r.scope + '"', r.inq, r.adm, r.spend, r.rev, (r.inq ? (r.adm / r.inq * 100).toFixed(1) + '%' : '')].join(','))).join('\n'); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'monthly-reports-' + o.repScope.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.csv'; document.body.appendChild(a); a.click(); a.remove(); this.flash('Exported ' + rows.length + ' reports'); };
    // ---------- tasks ----------
    const cats = ['Review capacity', 'Review monthly results', 'Partner outreach', 'Review marketing budget', 'Operations meeting', 'Update facility information'];
    const q3 = o.taskQ.trim().toLowerCase();
    const tf = o.tasks.filter(t => (!q3 || (t.cat + ' ' + t.team).toLowerCase().includes(q3)) && (o.taskCat === 'all' || t.cat === o.taskCat) && (o.taskTeam === 'all' || t.team === o.taskTeam));
    const prC = { High: ['#fdecec', '#c0262d'], Medium: ['#fdf3e1', '#a46407'], Low: ['#eef2f7', '#516378'] };
    const tItem = (t) => { const done = t.status === 'done'; return { cat: t.cat, team: t.team, due: fmtD(t.due), priority: t.priority, prBg: prC[t.priority][0], prColor: prC[t.priority][1], status: t.status, check: done ? '✓' : '', boxBg: done ? '#1f8a52' : '#fff', boxBorder: done ? '#1f8a52' : '#cfdceb', titleColor: done ? '#8a9bb0' : '#10233a', strike: done ? 'line-through' : 'none', toggleLabel: done ? 'Mark as to do' : 'Mark as completed',
      toggle: () => { this.opSet(op => ({ tasks: op.tasks.map(x => x.id === t.id ? { ...x, status: done ? 'todo' : 'done' } : x) })); this.flash(done ? 'Task reopened' : 'Task completed'); }, setStatus: (e) => { const v = e.target.value; this.opSet(op => ({ tasks: op.tasks.map(x => x.id === t.id ? { ...x, status: v } : x) })); }, edit: openForm('task', t.id) }; };
    const grp = [['Overdue', '#c0262d', tf.filter(t => t.status !== 'done' && t.due < today)], ['Upcoming', '#0890E8', tf.filter(t => t.status !== 'done' && t.due >= today)], ['Completed', '#1f8a52', tf.filter(t => t.status === 'done')]];
    const opTaskGroups = grp.map(([t, c, arr]) => ({ t, c, n: arr.length + (arr.length === 1 ? ' task' : ' tasks'), items: arr.sort((a, b) => a.due < b.due ? -1 : 1).map(tItem), empty: arr.length === 0 }));
    // ---------- drawer ----------
    const dr = o.dr; let dv = { opDrOpen: !!dr, opDrIsView: false, opDrIsForm: false, opDrHasCap: false, opDrHasLog: false, opDrFacts: [], opDrLog: [], opDrFields: [], opDrNotice: false, opDrNoticeText: '', opDrHasErr: false, opDrErrSummary: '', opDrCanDelete: false, opDrCapLabel: '', opDrCapPct: '0%', opDrCapColor: '#0890E8', opDrTitle: '', opDrKicker: '', opDrSaveLabel: 'Save' };
    const kindName = { facility: 'facility', partner: 'organization', report: 'monthly report', task: 'task', campaign: 'campaign' };
    if (dr) {
      const rec = dr.id != null ? o[coll[dr.kind]].find(x => x.id === dr.id) : null;
      dv.opDrKicker = dr.mode === 'view' ? kindName[dr.kind] : (rec ? 'Edit ' : 'Add ') + kindName[dr.kind];
      dv.opDrCanDelete = !!rec && dr.kind !== 'report';
      if (dr.mode === 'view' && rec) {
        dv.opDrIsView = true;
        if (dr.kind === 'facility') { dv.opDrTitle = rec.name; dv.opDrFacts = [['City & location', rec.city], ['Program category', rec.program], ['Total capacity', rec.cap], ['Occupied spaces', rec.occ], ['Available spaces', rec.cap - rec.occ], ['Operational status', rec.status], ['Last updated', fmtD(rec.updated)]].map(([k, v]) => ({ k, v: String(v) })); dv.opDrHasCap = true; dv.opDrCapLabel = rec.occ + ' / ' + rec.cap; dv.opDrCapPct = (rec.cap ? rec.occ / rec.cap * 100 : 0) + '%'; dv.opDrCapColor = capC(rec); }
        if (dr.kind === 'partner') { dv.opDrTitle = rec.name; dv.opDrFacts = [['Organization type', rec.type], ['Website', rec.web], ['Business contact (professional only)', rec.cName + ' · ' + rec.cRole], ['Professional email', rec.email], ['Business phone', rec.phone], ['Relationship owner', rec.owner], ['Status', stP[rec.status][2]], ['Last outreach', fmtD(rec.last)], ['Next follow-up', fmtD(rec.next)]].map(([k, v]) => ({ k, v })); dv.opDrHasLog = true; dv.opDrLog = rec.log.slice().sort((a, b) => a.date < b.date ? 1 : -1).map(l => ({ type: l.type, outcome: l.outcome, date: fmtD(l.date) })); }
      } else {
        dv.opDrIsForm = true; dv.opDrTitle = rec ? (rec.name || rec.cat || fmtM(rec.month)) : 'New ' + kindName[dr.kind]; dv.opDrSaveLabel = rec ? 'Save changes' : 'Add ' + kindName[dr.kind];
        const F = dr.form, E = dr.tried ? dr.errors : {};
        const fld = (key, label, type, extra) => { const err = E[key]; const options = extra && extra.options; return { label, type: type === 'select' ? 'text' : type, isInput: type !== 'select', isSelect: type === 'select', min: '0', value: F[key], ph: (extra && extra.ph) || '', options: options ? options.map(x => Array.isArray(x) ? { v: x[0], t: x[1] } : { v: x, t: x }) : [], help: (extra && extra.help) || '', helpDisplay: extra && extra.help ? 'block' : 'none', err: err || '', errDisplay: err ? 'block' : 'none', invalid: err ? 'true' : 'false', border: err ? '#e0787c' : '#dbe6f0',
          onChange: (e) => { const v = e.target.value; this.opSet(op => ({ dr: { ...op.dr, form: { ...op.dr.form, [key]: v } } })); } }; };
        const monthOpts = Array.from({ length: 12 }, (_, i) => [this.opMonth(i), fmtM(this.opMonth(i))]);
        if (dr.kind === 'facility') { const av = (+F.cap || 0) - (+F.occ || 0); dv.opDrFields = [fld('name', 'Facility name', 'text', { ph: 'e.g. Lakeside Residence' }), fld('city', 'City & location', 'text', { ph: 'City, Province' }), fld('program', 'Program category', 'select', { options: progs }), fld('cap', 'Total operational capacity', 'number'), fld('occ', 'Occupied spaces', 'number', { help: 'Available spaces: ' + (F.cap === '' ? '—' : av) + ' (calculated)' }), fld('status', 'Operational status', 'select', { options: fStats })]; dv.opDrNotice = true; dv.opDrNoticeText = 'Enter totals only. Never enter names, room assignments or individual bed details.'; }
        if (dr.kind === 'partner') { dv.opDrFields = [fld('name', 'Organization name', 'text'), fld('type', 'Organization type', 'select', { options: pTypes }), fld('web', 'Website', 'text', { ph: 'organization.ca' }), fld('cName', 'Business contact name', 'text', { help: 'Professional contact at the organization only' }), fld('cRole', 'Contact role / department', 'text'), fld('email', 'Professional email', 'email'), fld('phone', 'Business phone', 'tel'), fld('owner', 'Relationship owner', 'select', { options: teams }), fld('status', 'Relationship status', 'select', { options: [['prospect', 'Prospect'], ['active', 'Active'], ['paused', 'Paused']] }), fld('next', 'Next follow-up', 'date')]; dv.opDrNotice = true; dv.opDrNoticeText = 'Business relationship details only. Do not record patients, referrals or client information.'; }
        if (dr.kind === 'report') { dv.opDrFields = [fld('month', 'Reporting month', 'select', { options: monthOpts }), fld('scope', 'Reporting scope', 'select', { options: scopes }), fld('inq', 'Total inquiries', 'number'), fld('adm', 'Total admissions', 'number'), fld('spend', 'Marketing spend (' + cur + ')', 'number'), fld('rev', 'Aggregate revenue (' + cur + ')', 'number')]; dv.opDrNotice = true; dv.opDrNoticeText = 'Organization or facility totals for the month. One report per scope and month.'; }
        if (dr.kind === 'task') dv.opDrFields = [fld('cat', 'Activity category', 'select', { options: cats }), fld('team', 'Responsible team', 'select', { options: teams }), fld('due', 'Due date', 'date'), fld('priority', 'Priority', 'select', { options: ['High', 'Medium', 'Low'] }), fld('status', 'Status', 'select', { options: [['todo', 'To do'], ['doing', 'In progress'], ['done', 'Completed']] })];
        if (dr.kind === 'campaign') { dv.opDrFields = [fld('name', 'Campaign name', 'text'), fld('channel', 'Marketing channel', 'select', { options: channelsAll }), fld('period', 'Reporting period', 'select', { options: monthOpts }), fld('budget', 'Budget (' + cur + ')', 'number'), fld('spend', 'Actual spend (' + cur + ')', 'number'), fld('inq', 'Total inquiries', 'number'), fld('att', 'Attributed admissions (optional)', 'number', { help: 'Leave blank unless attribution is reliable (tracked number or dedicated page).' })]; }
        const ne = Object.keys(E).length; dv.opDrHasErr = ne > 0; dv.opDrErrSummary = ne === 1 ? 'Fix 1 field to continue.' : 'Fix ' + ne + ' fields to continue.';
      }
    }
    const validate = (kind, F, id) => { const e = {}; const req = (k, msg) => { if (!String(F[k] || '').trim()) e[k] = msg || 'Required'; }; const num = (k, opt) => { if (opt && F[k] === '') return; if (F[k] === '' || isNaN(+F[k]) || +F[k] < 0 || !Number.isInteger(+F[k])) e[k] = 'Enter a whole number, 0 or more'; };
      if (kind === 'facility') { req('name'); req('city'); num('cap'); num('occ'); if (!e.cap && +F.cap === 0) e.cap = 'Capacity must be at least 1'; if (!e.cap && !e.occ && +F.occ > +F.cap) e.occ = 'Occupied spaces can’t exceed total capacity (' + F.cap + ')'; }
      if (kind === 'partner') { req('name'); req('cName'); if (F.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(F.email)) e.email = 'Enter a valid professional email'; req('next', 'Choose a follow-up date'); }
      if (kind === 'report') { ['inq', 'adm', 'spend', 'rev'].forEach(k => num(k)); if (o.reports.some(r => r.scope === F.scope && r.month === F.month && r.id !== id)) e.month = 'A report for ' + F.scope + ' · ' + fmtM(F.month) + ' already exists. Edit that report instead.'; }
      if (kind === 'task') req('due', 'Choose a due date');
      if (kind === 'campaign') { req('name'); ['budget', 'spend', 'inq'].forEach(k => num(k)); num('att', true); }
      return e; };
    const opDrSave = () => { const d = this.state.op.dr; const e = validate(d.kind, d.form, d.id); if (Object.keys(e).length) { this.opSet({ dr: { ...d, errors: e, tried: true } }); return; }
      const F = d.form, numK = ['cap', 'occ', 'inq', 'adm', 'spend', 'rev', 'budget']; const val = Object.fromEntries(Object.entries(F).map(([k, v]) => [k, numK.includes(k) ? +v : k === 'att' ? (v === '' ? null : +v) : v.trim ? v.trim() : v]));
      if (d.kind === 'facility') val.updated = this.opDay(0);
      this.opSet(op => { const c = coll[d.kind]; const list = d.id != null ? op[c].map(x => x.id === d.id ? { ...x, ...val } : x) : op[c].concat({ id: op.nextId, ...(d.kind === 'partner' ? { last: this.opDay(0), log: [] } : {}), ...val }); return { [c]: list, nextId: op.nextId + 1, updatedAt: Date.now(), dr: d.kind === 'partner' || d.kind === 'facility' ? { ...d, mode: 'view', id: d.id != null ? d.id : op.nextId } : null }; });
      this.flash((d.id != null ? 'Saved ' : 'Added ') + kindName[d.kind]); };
    const cf = o.confirm, cfRec = cf ? o[coll[cf.kind]].find(x => x.id === cf.id) : null;
    const effects = { facility: 'Its capacity will no longer count toward totals.', partner: 'Its outreach history will also be removed.', report: 'Overview totals for that month will show “No report submitted”.', task: '', campaign: 'It will be removed from marketing totals.' };
    const labelOf = (kind, r) => !r ? '' : kind === 'report' ? r.scope + ' · ' + fmtM(r.month) : kind === 'task' ? r.cat + ' · due ' + fmtD(r.due) : r.name;
    return {
      isFacilities: this.state.view === 'facilities', isPartners: this.state.view === 'partners', isMarketing: this.state.view === 'marketing', isReports: this.state.view === 'reports', isTasks: this.state.view === 'tasks',
      opLoading: this.state.opLoading, opReady: !this.state.opLoading, opSkel: [1, 2, 3, 4, 5], opCurrency: cur,
      opUpdated: new Date(o.updatedAt).toLocaleString('en-CA', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }),
      opPeriodSel: selObj(o.period, [5, 4, 3, 2, 1, 0].map(i => [this.opMonth(i), fmtM(this.opMonth(i))]).reverse(), 'period'),
      opKpis, opKpiCols: wide ? 'repeat(4,minmax(0,1fr))' : 'repeat(2,minmax(0,1fr))', opSplit: wide ? 'minmax(0,1.4fr) minmax(0,1fr)' : 'minmax(0,1fr)', opTrend, opCapRows, opAttnTasks, opNoAttn: !opAttnTasks.length, opDuePartners, opNoDue: !opDuePartners.length,
      goFacilities: this.opGo('facilities'), goTasks: this.opGo('tasks'), goPartners: this.opGo('partners'),
      opFacStats: [{ l: 'Total capacity', v: tCap, s: 'Operating facilities' }, { l: 'Occupied', v: tOcc, s: Math.round(tOcc / Math.max(1, tCap) * 100) + '% of capacity' }, { l: 'Available', v: tCap - tOcc, s: 'Current snapshot' }, { l: 'Facilities operating', v: live.length + ' of ' + fac.length, s: fac.length - live.length + ' temporarily closed' }],
      opFacQ: o.facQ, onFacQ: (e) => this.opSet({ facQ: e.target.value }), opFacProg: selObj(o.facProg, [['all', 'All']].concat(progs), 'facProg'), opFacStatus: selObj(o.facStatus, [['all', 'All']].concat(fStats), 'facStatus'), opFacSort: selObj(o.facSort, [['name', 'Name'], ['avail', 'Most available'], ['occ', 'Highest occupancy']], 'facSort'),
      opFacCols: ['Facility', 'Program', 'Capacity', 'Available', 'Status', 'Updated', ''], opFacRows, opFacEmpty: !opFacRows.length, opClearFac: set({ facQ: '', facProg: 'all', facStatus: 'all' }), opAddFacility: openForm('facility', null),
      opParQ: o.parQ, onParQ: (e) => this.opSet({ parQ: e.target.value }), opParStatus: selObj(o.parStatus, [['all', 'All'], ['active', 'Active'], ['prospect', 'Prospect'], ['paused', 'Paused']], 'parStatus'), opParType: selObj(o.parType, [['all', 'All']].concat(pTypes), 'parType'), opParSort: selObj(o.parSort, [['next', 'Next follow-up'], ['last', 'Last outreach'], ['name', 'Name']], 'parSort'),
      opParCols: ['Organization', 'Type', 'Relationship owner', 'Status', 'Last outreach', 'Next follow-up', ''], opParRows, opParEmpty: !opParRows.length, opClearPar: set({ parQ: '', parStatus: 'all', parType: 'all' }), opAddPartner: openForm('partner', null),
      opMktPeriod: selObj(o.mktPeriod, [['all', 'All periods']].concat(mktMonths.map(m => [m, fmtM(m)])), 'mktPeriod'), opMktChannel: selObj(o.mktChannel, [['all', 'All channels']].concat(channelsAll), 'mktChannel'),
      opMktStats: [{ l: 'Budget', v: money(tB), s: cr.length + ' campaigns' }, { l: 'Actual spend', v: money(tS), s: tB ? Math.round(tS / tB * 100) + '% of budget' : '—' }, { l: 'Total inquiries', v: tI.toLocaleString('en-CA'), s: 'Period total' }, { l: 'Cost per inquiry', v: tI ? money(tS / tI) : '—', s: 'Spend ÷ inquiries' }],
      opMktCols: ['Campaign', 'Channel', 'Period', 'Budget', 'Spend', 'Inquiries', 'Cost / inquiry', 'Attributed admissions', 'Cost / admission', ''], opMktRows, opMktEmpty: !opMktRows.length, opAddCampaign: openForm('campaign', null),
      opMktBars: cr.map(c => ({ name: c.name, label: money(c.spend) + ' of ' + money(c.budget), pct: Math.min(100, c.spend / Math.max(1, c.budget) * 100) + '%', c: c.spend > c.budget ? '#c0262d' : '#0890E8' })),
      opCpiBars: cr.filter(c => c.inq).map(c => ({ name: c.name, label: money(c.spend / c.inq), pct: (c.spend / c.inq / maxCpi * 100) + '%', c: '#7a5af8' })),
      opRepScope: selObj(o.repScope, scopes, 'repScope'), opRepSort: selObj(o.repSort, [['new', 'Newest first'], ['old', 'Oldest first']], 'repSort'), opRepCols: ['Month', 'Inquiries', 'Admissions', 'Marketing spend', 'Revenue', 'Inquiry : admission', 'vs previous month', ''], opRepRows, opExport, opAddReport: openForm('report', null, { scope: o.repScope }),
      opTaskQ: o.taskQ, onTaskQ: (e) => this.opSet({ taskQ: e.target.value }), opTaskCat: selObj(o.taskCat, [['all', 'All']].concat(cats), 'taskCat'), opTaskTeam: selObj(o.taskTeam, [['all', 'All']].concat(teams), 'taskTeam'), opTaskGroups, opAddTask: openForm('task', null),
      ...dv, opDrClose: set({ dr: null }), opDrEdit: () => openForm(dr.kind, dr.id)(), opDrSave, opDrDelete: () => this.opSet({ confirm: { kind: dr.kind, id: dr.id } }),
      opActTypes: ['Introduced facility', 'Partnership meeting', 'Shared service information', 'Scheduled follow-up'], opActOutcomes: ['Completed', 'Meeting booked', 'Awaiting reply', 'No response'], opActType: o.actType, opActOutcome: o.actOutcome,
      opSetActType: (e) => this.opSet({ actType: e.target.value }), opSetActOutcome: (e) => this.opSet({ actOutcome: e.target.value }),
      opLogActivity: () => { const id = dr.id; this.opSet(op => ({ partners: op.partners.map(p => p.id === id ? { ...p, last: this.opDay(0), next: op.actType === 'Scheduled follow-up' ? this.opDay(14) : p.next, log: p.log.concat({ type: op.actType, outcome: op.actOutcome, date: this.opDay(0) }) } : p), updatedAt: Date.now() })); this.flash('Outreach activity logged'); },
      opConfirmOpen: !!cfRec, opConfirmKind: cf ? kindName[cf.kind] : '', opConfirmLabel: labelOf(cf && cf.kind, cfRec), opConfirmEffect: cf ? effects[cf.kind] : '', opConfirmCancel: set({ confirm: null }),
      opConfirmDo: () => { const c = this.state.op.confirm; this.opSet(op => ({ [coll[c.kind]]: op[coll[c.kind]].filter(x => x.id !== c.id), confirm: null, dr: null, updatedAt: Date.now() })); this.flash(kindName[c.kind][0].toUpperCase() + kindName[c.kind].slice(1) + ' deleted'); },
      opOrgFields: [['name', 'Organization name'], ['email', 'Business email (operations)'], ['city', 'Head office city']].map(([k, l]) => { const err = o.orgErr[k]; return { l, v: o.org[k], err: err || '', errDisplay: err ? 'block' : 'none', border: err ? '#e0787c' : '#dbe6f0', onChange: (e) => { const v = e.target.value; this.opSet(op => ({ org: { ...op.org, [k]: v } })); } }; }),
      opSaveOrg: () => { const e = {}; if (!o.org.name.trim()) e.name = 'Required'; if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(o.org.email)) e.email = 'Enter a valid email'; this.opSet({ orgErr: e, updatedAt: Date.now() }); if (!Object.keys(e).length) this.flash('Organization details saved'); },
      opLocations: [...new Set(fac.map(f => f.city))], opSetCurrency: (e) => { this.opSet({ currency: e.target.value }); this.flash('Reporting currency set to ' + e.target.value); },
      opToggleSuppress: set({ suppress: !o.suppress }), opSupTrack: o.suppress ? '#0890E8' : '#cfdceb', opSupKnob: o.suppress ? '21px' : '3px',
    };
  }

  icon(paths, extra) {
    const R = React.createElement;
    return R('svg', { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round', ...(extra || {}) },
      ...paths.map((p, i) => typeof p === 'string' ? R('path', { key: i, d: p }) : R(p.t, { key: i, ...p.a })));
  }
  flash(t) { clearTimeout(this._tt); this.setState({ toast: t }); this._tt = setTimeout(() => this.setState({ toast: '' }), 2200); }
  renderVals() { const v = this.baseVals(); return { ...v, ...this.mobVals(v) }; }
  mobVals(v) {
    const { vw, moreOpen, mobSearch } = this.state, mob = vw < 760, nav = v.nav || [];
    const pref = ['overview', 'leads', 'clients', 'calendar', 'tasks'];
    let prim = pref.map(k => nav.find(n => n.k === k)).filter(Boolean).slice(0, 4);
    const act = nav.find(n => n.active), inPrim = act && prim.includes(act);
    const close = (fn) => () => { this.setState({ moreOpen: false, mobSearch: false }); fn && fn(); };
    const tabs = prim.map(n => ({ label: n.label === 'Overview' ? 'Home' : n.label, icon: n.icon, go: close(n.go), color: n.active && !moreOpen ? '#0a6fc0' : '#6b7f95', pill: n.active && !moreOpen ? '#e3f1fc' : 'transparent', badge: n.badge, badgeDisplay: n.badge ? 'inline-flex' : 'none' }));
    const moreBadge = nav.filter(n => !prim.includes(n) && n.badge).length;
    const dots = this.icon([{ t: 'circle', a: { cx: 5, cy: 12, r: 1.6 } }, { t: 'circle', a: { cx: 12, cy: 12, r: 1.6 } }, { t: 'circle', a: { cx: 19, cy: 12, r: 1.6 } }]);
    const moreOn = moreOpen || (act && !inPrim);
    tabs.push({ label: moreOpen || inPrim || !act ? 'More' : act.label.split(' ')[0], icon: dots, go: () => this.setState({ moreOpen: !moreOpen, mobSearch: false, notifOpen: false }), color: moreOn ? '#0a6fc0' : '#6b7f95', pill: moreOn ? '#e3f1fc' : 'transparent', badge: moreBadge ? String(moreBadge) : '', badgeDisplay: moreBadge ? 'inline-flex' : 'none' });
    const moreItems = nav.map(n => ({ label: n.label, icon: n.icon, go: close(n.go), badge: n.badge, badgeDisplay: n.badge ? 'inline-flex' : 'none', bg: n.active ? '#f0f8fe' : '#fff', border: n.active ? '#0890E8' : '#e8eef5', color: '#10233a', iconBg: n.active ? '#0890E8' : '#eef5fb', iconColor: n.active ? '#fff' : '#0a6fc0' }));
    return {
      tabs, moreItems, moreOpen: mob && !!moreOpen, closeMore: () => this.setState({ moreOpen: false }),
      goBillingMore: close(v.goBilling), mobTitle: act ? act.label : (v.isLeads ? 'Leads' : 'Dashboard'),
      mobSearchOpen: mob && !!mobSearch, mobSearchBg: mobSearch ? '#e3f1fc' : '#fff', toggleMobSearch: () => this.setState({ mobSearch: !mobSearch, moreOpen: false, notifOpen: false }),
      topH: mob ? '64px' : '72px', topGap: mob ? '8px' : '10px', tapSize: mob ? '44px' : '40px', gcalBtnDisplay: mob ? 'none' : 'inline-flex',
      notifRight: mob ? '12px' : v.mainPadX, notifTop: mob ? 'calc(62px + env(safe-area-inset-top))' : '66px', notifW: mob ? 'calc(100vw - 24px)' : '340px',
      avatarTap: mob ? () => this.setState({ moreOpen: true, notifOpen: false, mobSearch: false }) : v.goBilling,
      toggleNotif: () => this.setState({ notifOpen: !this.state.notifOpen, moreOpen: false, mobSearch: false }),
      toastBottom: mob ? 'calc(84px + env(safe-area-inset-bottom))' : '24px',
      mainPad: mob ? '16px 14px calc(108px + env(safe-area-inset-bottom))' : v.mainPad,
    };
  }
  baseVals() {
    const { vw, view, range, hover, q, leadView, openId, drag, dropOn, reply, note, ai, gcal, extra, status, openSec, notifOpen, notifRead, toast, notifs, user } = this.state;
    const I = this.I;
    const leads = this.state.leads || [];
    const prof = this.state.prof || this.profFrom();
    const isC = !this.isT();
    const wide = vw >= 1200, mid = vw >= 760, sideOn = vw >= 760, sideWide = vw >= 1100;
    const go = (v) => () => { this.setState({ view: v, notifOpen: false }); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    const ic = {
      home: this.icon(['M3 11l9-7 9 7', 'M5 10v10h14V10']), users: this.icon([{ t: 'circle', a: { cx: 9, cy: 8, r: 3.5 } }, 'M2.5 20a6.5 6.5 0 0 1 13 0', 'M16 4.5a3.5 3.5 0 0 1 0 7', 'M18 14a6.5 6.5 0 0 1 3.5 6']),
      cal: this.icon([{ t: 'rect', a: { x: 3, y: 5, width: 18, height: 16, rx: 3 } }, 'M3 10h18', 'M8 3v4', 'M16 3v4']), chart: this.icon(['M4 20V10', 'M10 20V4', 'M16 20v-7', 'M22 20H2']),
      edit: this.icon(['M4 20h4L19 9l-4-4L4 16z', 'M13.5 6.5l4 4']), card: this.icon([{ t: 'rect', a: { x: 2.5, y: 5, width: 19, height: 14, rx: 3 } }, 'M2.5 10h19']), gear: this.icon([{ t: 'circle', a: { cx: 12, cy: 12, r: 3 } }, 'M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z']),
      eye: this.icon(['M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z', { t: 'circle', a: { cx: 12, cy: 12, r: 3 } }]), phone: this.icon(['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z']),
      msg: this.icon(['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z']), mail: this.icon([{ t: 'rect', a: { x: 3, y: 5, width: 18, height: 14, rx: 2 } }, 'M3 7l9 6 9-6']), globe: this.icon([{ t: 'circle', a: { cx: 12, cy: 12, r: 9 } }, 'M3 12h18', 'M12 3a14 14 0 0 1 0 18', 'M12 3a14 14 0 0 0 0 18']),
      note: this.icon(['M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z', 'M14 3v5h5']), move: this.icon(['M5 12h14', 'M13 6l6 6-6 6']), star: this.icon(['M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z']),
    };
    const sm = (p) => this.icon(p, { width: 12, height: 12, strokeWidth: 2.2 });
    const NOW = Date.now(), DAY = 864e5;
    const rel = (t) => { const m = Math.max(0, Math.round((NOW - t) / 6e4)); if (m < 1) return 'Just now'; if (m < 60) return m + ' min ago'; const h = Math.round(m / 60); if (h < 24) return h + ' hr' + (h > 1 ? 's' : '') + ' ago'; const d = Math.round(h / 24); if (d === 1) return 'Yesterday'; if (d < 7) return d + ' days ago'; const w = Math.round(d / 7); if (d < 30) return w + ' week' + (w > 1 ? 's' : '') + ' ago'; return new Date(t).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }); };
    const ymd = (d) => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    const stages = [['new', 'New', '#0890E8', '#eaf5fd', '#0a5d96'], ['contacted', 'Contacted', '#F5A623', '#fff6e5', '#8a5a00'], ['booked', isC ? 'Assessment booked' : 'Consult booked', '#8b5cf6', '#f1ebfe', '#5b34b8'], ['admitted', isC ? 'Admitted' : 'Client', '#2fb46b', '#e6f4ec', '#1f8a52'], ['lost', 'Closed', '#9aabbd', '#f1f4f7', '#516378']];
    const stageOf = (k) => stages.find(s => s[0] === k) || stages[0];
    const avPal = [['#eaf5fd', '#0890E8'], ['#fdeceb', '#D82028'], ['#e6f4ec', '#1f8a52'], ['#fff6e5', '#b07400'], ['#f1ebfe', '#6d45d0']];
    const scoreSty = (s) => s >= 85 ? ['#fdeceb', '#c0262d'] : s >= 70 ? ['#fff6e5', '#9a6400'] : ['#f1f4f7', '#516378'];
    const hashN = (x) => { let h = 0; String(x).split('').forEach(ch => { h = (h * 31 + ch.charCodeAt(0)) | 0; }); return Math.abs(h); };
    const openLead = (id) => () => this.setState({ openId: id, reply: '', note: '', notifOpen: false });
    const decorate = (l) => { const [sb, sc] = scoreSty(l.score); const st = stageOf(l.stage); const av = avPal[hashN(l.id) % avPal.length]; const hrs = (NOW - l.at) / 36e5;
      return { ...l, ago: rel(l.at), hrs, initials: (l.name || '?').split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase(), avBg: av[0], avColor: av[1], scoreBg: sb, scoreColor: sc, stageLabel: st[1], stageBg: st[3], stageColor: st[4], stage: st[1], stageKey: l.stage,
        open: openLead(l.id), drag: (e) => { try { e.dataTransfer.setData('text/plain', String(l.id)); } catch (err) {} this.setState({ drag: l.id }); },
        srcIcon: sm(/call/i.test(l.source) ? ['M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z'] : /message|listing|profile/i.test(l.source) ? ['M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z'] : [{ t: 'circle', a: { cx: 12, cy: 12, r: 9 } }, 'M3 12h18']),
        overdueDisplay: l.stage === 'new' && hrs > 0.5 ? 'inline' : 'none' }; };
    const ql = q.trim().toLowerCase();
    const filtered = leads.filter(l => !ql || (l.name + ' ' + l.interest + ' ' + l.source + ' ' + l.email + ' ' + l.phone).toLowerCase().includes(ql));
    const patchLead = (id, fn) => this.setState(s => ({ leads: s.leads.map(l => l.id === id ? fn(l) : l) }));
    const leadApi = (payload, okMsg) => this.api('/api/dashboard/leads', payload).then(r => { if (!r.ok) this.flash(r.error); else if (okMsg) this.flash(okMsg); return r; });
    const moveLead = (id, stage, why) => { const label = stageOf(stage)[1] + (why ? ' · ' + why : ''); patchLead(id, l => ({ ...l, stage, timeline: [{ k: 'move', t: 'Moved to ' + label, at: Date.now() }, ...l.timeline] })); leadApi({ action: 'stage', id, stage, why: label }); };
    const board = stages.map(([k, label, color]) => { const cards = filtered.filter(l => l.stage === k).map(decorate); const on = dropOn === k;
      return { label, color, count: String(cards.length), cards, bg: on ? '#eaf5fd' : 'rgba(231,237,244,.7)', border: on ? '#0890E8' : 'transparent',
        over: (e) => { e.preventDefault(); if (dropOn !== k) this.setState({ dropOn: k }); }, leave: () => { if (dropOn === k) this.setState({ dropOn: null }); },
        drop: (e) => { e.preventDefault(); const id = drag; this.setState({ drag: null, dropOn: null }); const l0 = leads.find(x => x.id === id); if (l0 && l0.stage !== k) { moveLead(id, k); this.flash('Lead moved to ' + label); } } }; });

    const newCount = leads.filter(l => l.stage === 'new').length;
    const oic = this.opIc(); const nav = [['overview', 'Overview', ic.home, ''], ['facilities', 'Facilities', oic.building, ''], ['partners', 'Referral partners', oic.hand, ''], ['reports', 'Monthly reports', oic.report, ''], ['tasks', 'Tasks', oic.tasks, this.opOverdue() ? String(this.opOverdue()) : ''], ['marketing', 'Marketing', oic.mega, ''], ['leads', isC ? 'Leads' : 'Enquiries', ic.users, newCount ? String(newCount) : ''], ['calendar', 'Calendar', ic.cal, ''], ['analytics', 'Analytics', ic.chart, ''], ['profile', isC ? 'Listing' : 'Profile', ic.edit, ''], ['billing', 'Billing', ic.card, ''], ['settings', 'Settings', ic.gear, '']]
      .map(([k, label, icon, badge]) => ({ label, icon, badge, go: this.opMods.includes(k) ? this.opGo(k) : go(k), bg: view === k ? (sideOn ? 'linear-gradient(135deg,#1aa0f0,#0a74c9)' : '#0890E8') : 'transparent', shadow: view === k && sideOn ? '0 10px 22px -12px rgba(8,144,232,.9),inset 0 1px 0 rgba(255,255,255,.25)' : 'none', color: view === k ? '#fff' : (sideOn ? '#b7c7d8' : '#dbe6f0'),
        labelDisplay: sideWide ? 'block' : 'none', badgeDisplay: badge && sideWide ? 'inline-flex' : 'none', justify: sideWide ? 'flex-start' : 'center', k, active: view === k }));

    // ---------- chart: real page views (listing counters) and leads, per day or per 2 days for 90 ----------
    const ST = I.stats || { daily: {}, refs: [], terms: [] }, daily = ST.daily || {};
    const N = range === 7 ? 7 : range === 90 ? 45 : 30, stepD = range === 90 ? 2 : 1;
    const bucketStart = (i, off) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() - ((N - 1 - i) * stepD + (stepD - 1)) - (off || 0)); return d; };
    const dayVal = (d, k) => { const x = daily[new Date(d.getTime() + 12 * 36e5).toISOString().slice(0, 10)]; return x ? x[k] || 0 : 0; };
    const series = (k, off) => Array.from({ length: N }, (_, i) => { let v = 0; for (let j = 0; j < stepD; j++) { const d = bucketStart(i, off); d.setDate(d.getDate() + j); v += dayVal(d, k); } return v; });
    const leadSeries = (off, pick) => Array.from({ length: N }, (_, i) => { const a = bucketStart(i, off).getTime(); return leads.filter(l => l.at >= a && l.at < a + stepD * DAY).map(pick || (() => 1)).reduce((x, y) => x + y, 0); });
    const views = series('view'), lds = leadSeries(0), callsS = series('call'), clicksS = series('click');
    const prevOff = N * stepD, sumArr = (a) => a.reduce((x, y) => x + y, 0);
    const maxV = Math.max(...views, 1) * 1.12, maxL = Math.max(...lds, 1) * 2.2;
    const W = 600, H = 200, step = W / N;
    const px = (i) => i * step + step / 2, py = (v) => H - (v / maxV) * H;
    const line = views.map((v, i) => (i ? 'L' : 'M') + px(i).toFixed(1) + ',' + py(v).toFixed(1)).join('');
    const area = line + 'L' + px(N - 1).toFixed(1) + ',' + H + 'L' + px(0).toFixed(1) + ',' + H + 'Z';
    const bw = Math.max(3, step * 0.42);
    const bars = lds.map((l, i) => { const h = (l / maxL) * H; return { x: (px(i) - bw / 2).toFixed(1), y: (H - h).toFixed(1), w: bw.toFixed(1), h: h.toFixed(1), fill: hover === i ? '#D82028' : 'rgba(216,32,40,.55)' }; });
    const hits = views.map((_, i) => ({ x: (i * step).toFixed(1), w: step.toFixed(1), enter: () => this.setState({ hover: i }) }));
    const dayLabel = (i) => bucketStart(i).toLocaleDateString('en-CA', { month: 'short', day: 'numeric' });
    const sumV = sumArr(views), sumL = sumArr(lds);
    const spark = (arr) => { const mx = Math.max(...arr), mn = Math.min(...arr); const n = arr.length; const pts = arr.map((v, i) => [(i / Math.max(1, n - 1)) * 120, 30 - ((v - mn) / (mx - mn || 1)) * 26]); const l = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(''); return { line: l, area: l + 'L120,32L0,32Z' }; };
    const replyMins = (l) => { const m = (l.timeline || []).filter(t => t.k === 'mail').map(t => t.at).sort((a, b) => a - b)[0]; return m ? (m - l.at) / 6e4 : null; };
    const avgReply = (from, to) => { const r = leads.filter(l => l.at >= from && l.at < to).map(replyMins).filter(x => x != null); return r.length ? r.reduce((a, b) => a + b, 0) / r.length : null; };
    const fmtMin = (m) => m == null ? '—' : m < 90 ? Math.round(m) + ' min' : m < 48 * 60 ? (m / 60).toFixed(1) + ' hrs' : Math.round(m / 1440) + ' days';
    const winA = bucketStart(0).getTime(), winP = bucketStart(0, prevOff).getTime();
    const delta = (cur, prev, lowerIsBetter) => { if (cur == null || prev == null || !prev) return ['—', '#f1f4f7', '#516378']; const p = Math.round((cur - prev) / prev * 100); const good = lowerIsBetter ? p <= 0 : p >= 0; return [(p >= 0 ? '+' : '−') + Math.abs(p) + '%', good ? '#e6f4ec' : '#fdecec', good ? '#1f8a52' : '#c0262d']; };
    const rCur = avgReply(winA, NOW + 1), rPrev = avgReply(winP, winA);
    const kpis = [
      ['Profile views', sumV.toLocaleString('en-CA'), delta(sumV, sumArr(series('view', prevOff))), ic.eye, '#0890E8', '#eaf5fd', views],
      ['Calls', String(sumArr(callsS)), delta(sumArr(callsS), sumArr(series('call', prevOff))), ic.phone, '#D82028', '#fdeceb', callsS],
      [isC ? 'Messages' : 'Enquiries', String(sumL), delta(sumL, sumArr(leadSeries(prevOff))), ic.msg, '#8b5cf6', '#f1ebfe', lds],
      ['Avg. reply time', fmtMin(rCur), delta(rCur, rPrev, true), ic.star, '#2fb46b', '#e6f4ec', leadSeries(0, (l) => replyMins(l) || 0)],
    ].map(([label, value, d, icon, color, tint, arr], i) => ({ label, value, delta: d[0], icon, color, tint, wash: tint, delay: (i * 60) + 'ms', ...spark(arr), deltaBg: d[1], deltaColor: d[2] }));

    const hot = leads.filter(l => l.stage === 'new' || l.stage === 'contacted').sort((a, b) => b.score - a.score).slice(0, 4).map(decorate);
    // ---------- calendar: bookings and open slots kept in the workspace (dated) ----------
    const days = Array.from({ length: 5 }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); const dow = d.getDay(); d.setDate(d.getDate() - ((dow + 6) % 7) + i); return d; });
    const todayIdx = (new Date().getDay() + 6) % 7;
    const evs = (extra || []).filter(e => e && e.date);
    const evSty = { booked: ['#eaf5fd', '#b9dcf6', '#0a5d96', '#3b7fb3'], gcal: ['#f1f4f7', '#dde4ec', '#1f3550', '#6b7f95'], block: ['repeating-linear-gradient(135deg,#f7f9fb 0 6px,#eef2f6 6px 12px)', '#e3eaf2', '#6b7f95', '#8a9bb0'], hold: ['#fff6e5', '#f6dfae', '#8a5a00', '#a07a2a'] };
    const evTime = (e) => new Date(e.date + 'T' + String(e.h).padStart(2, '0') + ':00').getTime();
    const upcoming = evs.filter(e => (e.kind === 'booked' || e.kind === 'hold') && evTime(e) >= NOW - 36e5).sort((a, b) => evTime(a) - evTime(b)).slice(0, 3).map(e => ({ dow: new Date(evTime(e)).toLocaleDateString('en-CA', { weekday: 'short' }), time: (e.h > 12 ? e.h - 12 : e.h) + (e.h >= 12 ? 'p' : 'a'), title: e.title, meta: e.sub, tint: evSty[e.kind][0], color: evSty[e.kind][2] }));
    const calRows = Array.from({ length: 10 }, (_, r) => { const h = 8 + r;
      return { label: (h > 12 ? h - 12 : h) + (h >= 12 ? ' pm' : ' am'), cells: days.map((dd, d) => { const key = ymd(dd); const ev = evs.find(e => e.date === key && e.h === h); const s = ev ? evSty[ev.kind] || evSty.booked : null; const past = new Date(dd.getTime() + h * 36e5).getTime() < NOW;
        return { has: !!ev, title: ev ? ev.title : '', sub: ev ? ev.sub : '', evBg: s ? s[0] : '', evBorder: s ? s[1] : '', evColor: s ? s[2] : '', evSub: s ? s[3] : '', cursor: ev ? (ev.kind === 'hold' ? 'pointer' : 'default') : past ? 'not-allowed' : 'copy', bg: d === todayIdx ? '#fbfdff' : '#fff',
          add: () => { if (ev) { if (ev.kind === 'hold') { this.setState(st => ({ extra: st.extra.filter(x => x !== ev) })); this.flash('Open slot removed'); } return; } if (past) { this.flash('That time has passed'); return; } this.setState(st => ({ extra: [...st.extra, { date: key, h, title: isC ? 'Open assessment slot' : 'Open consult slot', sub: 'Shown as available', kind: 'hold' }] })); this.flash('Open slot added · click it again to remove'); } }; }) }; });

    // ---------- where leads come from (real sources) ----------
    const srcCount = {}; leads.forEach(l => { srcCount[l.source] = (srcCount[l.source] || 0) + 1; });
    const srcColors = ['#0890E8', '#10233a', '#D82028', '#2fb46b', '#F5A623', '#8b5cf6'];
    const sources = leads.length ? Object.entries(srcCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([label, n], i) => ({ label, pct: Math.round(n / leads.length * 100) + '%', color: srcColors[i] })) : [{ label: 'No leads yet', pct: '0%', color: '#cfdceb' }];
    // ---------- profile strength (real listing completeness) ----------
    const checks = isC ? [['Add at least 6 photos', prof.photos >= 6, 'profile'], ['Write your description', !!(prof.about || (prof.fallback && prof.fallback.description)), 'profile'], ['Add your admissions phone', !!(prof.phone || (prof.fallback && prof.fallback.phone)), 'profile'], ['List your programs', prof.services.length > 0, 'profile'], ['Add your price range', !!prof.price, 'profile'], ['Reply to new leads', newCount === 0, 'leads']]
      : [['Write your headline', !!prof.headline, 'profile'], ['Write your bio', !!prof.about, 'profile'], ['Add your specialties', prof.services.length > 0, 'profile'], ['Add your session fee', !!prof.price, 'profile'], ['Add your phone', !!prof.phone, 'profile'], ['Reply to new enquiries', newCount === 0, 'leads']];
    const strength = Math.round(checks.filter(c => c[1]).length / checks.length * 100);
    const todo = checks.filter(c => !c[1]).slice(0, 3).map(([label, , v]) => ({ label, go: go(v) }));

    const in30 = (l) => l.at >= NOW - 30 * DAY;
    const crmStats = [['Open leads', String(leads.filter(l => ['new', 'contacted', 'booked'].includes(l.stage)).length), '#10233a'], ['Awaiting reply', String(newCount), newCount ? '#c0262d' : '#1f8a52'], [isC ? 'Admitted (30d)' : 'New clients (30d)', String(leads.filter(l => l.stage === 'admitted' && in30(l)).length), '#1f8a52'], ['Win rate', Math.round((leads.filter(l => l.stage === 'admitted').length / Math.max(1, leads.filter(l => ['admitted', 'lost'].includes(l.stage)).length)) * 100) + '%', '#0890E8']].map(([k, v, color]) => ({ k, v, color }));

    const cur = leads.find(l => l.id === openId);
    const ld = cur ? decorate(cur) : {};
    const firstName = (((user && user.name) || '').trim() || (user && user.email ? user.email.split('@')[0] : 'there')).split(' ')[0];
    const orgName = isC ? (prof.name || 'Your centre') : (prof.name || (user && user.name) || 'Your profile');
    const tpls = isC ? [['Availability', 'Thank you for reaching out. We currently have availability and can arrange an assessment as early as this week. What time works best for a call?'], ['Coverage', 'Many clients use extended health benefits toward treatment. If you share your provider, our admissions team can confirm what may be covered.'], ['Book assessment', 'We would be glad to set up a confidential assessment. Reply with a few times that suit you and we will confirm one.']]
      : [['Availability', 'Thanks for getting in touch. I have openings in the coming weeks. Would a short consultation be helpful first?'], ['Fees', (prof.price ? 'Individual sessions are $' + prof.price + '. ' : '') + 'Receipts include my registration number for insurance.'], ['Book consult', 'I would be happy to meet for a short consult. Let me know a couple of times that work for you.']];
    const aiDraft = () => { if (!cur) return; const fn = (cur.name || '').split(' ')[0]; const t = cur.stage === 'new' ? tpls[0][1] : tpls[2][1]; this.setState({ reply: 'Hi ' + fn + ',\n\nThank you for reaching out' + (cur.interest && !/enquiry|request/i.test(cur.interest) ? ' about ' + cur.interest.toLowerCase().replace(' · ', ' and ') : '') + '. ' + t + '\n\nWarmly,\n' + firstName + (isC ? '\n' + orgName : '') }); };
    const sendReply = () => { if (!cur || !reply.trim()) { this.flash('Write a reply first'); return; } if (!cur.email) { this.flash('This lead has no email address. Call them instead.'); return; } const text = reply; this.setState({ reply: '' });
      leadApi({ action: 'reply', id: cur.id, text }).then(r => { if (!r.ok) { this.setState({ reply: text }); return; } patchLead(cur.id, l => ({ ...l, stage: l.stage === 'new' ? 'contacted' : l.stage, timeline: [{ k: 'mail', t: (r.sent ? 'Email sent to ' : 'Email saved (sending not configured) for ') + l.email, at: r.at || Date.now() }, ...l.timeline] })); this.flash(r.sent ? 'Email sent to ' + cur.name : 'Saved · e-mail sending is not configured yet'); }); };
    const addNote = () => { if (!cur || !note.trim()) return; const t = note.trim(); this.setState({ note: '' }); patchLead(cur.id, l => ({ ...l, timeline: [{ k: 'note', t, at: Date.now() }, ...l.timeline] })); leadApi({ action: 'note', id: cur.id, text: t }); };
    const tlIcon = { in: [ic.msg, '#eaf5fd', '#0890E8'], move: [ic.move, '#f1ebfe', '#6d45d0'], mail: [ic.mail, '#e6f4ec', '#1f8a52'], note: [ic.note, '#fff6e5', '#b07400'], cal: [ic.cal, '#eaf5fd', '#0890E8'] };
    const bookFor = () => { if (!cur) return;
      let slot = null; for (let dd = 1; dd <= 14 && !slot; dd++) { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + dd); if (d.getDay() === 0 || d.getDay() === 6) continue; for (const h of [11, 10, 14, 15, 13, 9, 16]) { if (!evs.find(e => e.date === ymd(d) && e.h === h)) { slot = { d, h }; break; } } }
      if (!slot) { this.flash('No free slot in the next two weeks'); return; }
      const label = 'Booked for ' + slot.d.toLocaleDateString('en-CA', { weekday: 'long', month: 'short', day: 'numeric' }) + ' ' + (slot.h > 12 ? slot.h - 12 : slot.h) + ':00 ' + (slot.h >= 12 ? 'pm' : 'am');
      this.setState(s => ({ extra: [...s.extra.filter(e => !(e.date === ymd(slot.d) && e.h === slot.h)), { date: ymd(slot.d), h: slot.h, title: (isC ? 'Assessment · ' : 'Consult · ') + cur.name, sub: 'From your leads', kind: 'booked', lead: cur.id }] }));
      patchLead(cur.id, l => ({ ...l, stage: 'booked', timeline: [{ k: 'cal', t: label, at: Date.now() }, ...l.timeline] }));
      leadApi({ action: 'book', id: cur.id, label }, label + ' · see your calendar'); };

    // ---------- listing editor (writes the real public profile) ----------
    const P = I.profile, td = (I.therapist && I.therapist.data) || {};
    const setProf = (patch) => this.setState(s => ({ prof: { ...s.prof, ...patch } }));
    const chipBase = isC ? ['Residential', 'Medical detox', 'Outpatient', 'Family programs', 'Aftercare', 'Dual diagnosis', 'Online'] : ['Addiction', 'Alcohol use', 'Anxiety', 'Depression', 'Trauma', 'Grief', 'Relationships'];
    const chipOpts = [...new Set(chipBase.concat(prof.services))];
    const secDefs = isC ? [['basics', 'Centre details', ic.home, [['phone', 'Admissions phone'], ['email', 'Admissions email'], ['website', 'Website']]], ['story', 'Description', ic.edit, [['about', 'About your centre', true]]], ['services', 'Programs & services', ic.users, [], chipOpts], ['photos', 'Photos', ic.eye, []], ['pricing', 'Pricing', ic.card, [['price', 'Price range (e.g. $12,000 – $28,000 for 30 days)']]]]
      : [['basics', 'Name & contact', ic.home, [['name', 'Display name'], ['phone', 'Phone']]], ['story', 'Headline & bio', ic.edit, [['headline', 'Headline'], ['about', 'About you', true]]], ['services', 'Specialties', ic.users, [], chipOpts], ['pricing', 'Fees', ic.card, [['price', 'Session fee in dollars (e.g. 150)']]]];
    const canEdit = isC ? !!P && !!(user && user.verified) : !!I.therapist && !!(user && user.verified) && I.therapist.status !== 'removed';
    const saveListing = (k) => async () => {
      if (!canEdit) { this.flash(!(user && user.verified) ? 'Confirm your email address first (check your inbox)' : isC ? 'Your listing is not approved yet' : 'Your profile is not set up yet'); return; }
      const p = this.state.prof; let r;
      if (isC) { const raw = { ...(p.raw || {}) }; raw.phone = p.phone; raw.email = p.email; raw.website = p.website && !/^https?:\/\//.test(p.website) ? 'https://' + p.website : p.website; raw.description = p.about; raw.programs = p.services; raw.photos = p.photoList; raw.availability = this.state.status;
        const pr = (raw.pricing || []).slice(); if (p.price) { pr[0] = { ...(pr[0] || { label: 'Program cost' }), price: p.price }; } else pr.splice(0, 1); raw.pricing = pr;
        r = await this.api('/api/provider/profile', { slug: P.slug, profile: raw }); if (r.ok) setProf({ raw }); }
      else { r = await this.saveTherapist({ name: p.name, phone: p.phone, tagline: p.headline, bio: p.about, concerns: p.services, fee: String(p.price || '').replace(/[^\d]/g, '') }); }
      if (!r || !r.ok) { if (r && r.fields) this.flash(Object.values(r.fields)[0] || r.error); else if (r) this.flash(r.error); return; }
      this.setState({ openSec: null }); if (isC) this.flash(r.live ? 'Changes saved and live' : 'Saved · waiting for review before going live'); };
    const upload = (file) => { if (!file) return; if (!canEdit) { this.flash(!(user && user.verified) ? 'Confirm your email address first' : 'Your listing is not approved yet'); return; } const fd = new FormData(); fd.append('slug', P.slug); fd.append('file', file); fd.append('alt', P.name);
      this.flash('Uploading…'); fetch('/api/provider/upload', { method: 'POST', body: fd, credentials: 'same-origin' }).then(r => r.json().then(j => ({ r, j }))).then(({ r, j }) => { if (r.ok && j.ok) { this.setState(s => ({ prof: { ...s.prof, photoList: [...s.prof.photoList, { url: j.url, alt: j.alt || '' }], photos: s.prof.photos + 1 } })); this.flash('Photo added · press Save changes to publish it'); } else this.flash(j.error || 'The photo was not uploaded'); }).catch(() => this.flash('The photo was not uploaded')); };
    const R = React.createElement;
    const addCell = R('label', { style: { width: '100%', height: '100%', display: 'grid', placeItems: 'center', cursor: 'pointer' } }, '+ Add', R('input', { type: 'file', accept: 'image/jpeg,image/png,image/webp', style: { display: 'none' }, onChange: (e) => { upload(e.target.files && e.target.files[0]); e.target.value = ''; } }));
    const rmBtn = (i) => R('button', { type: 'button', 'aria-label': 'Remove photo', onClick: () => this.setState(s => ({ prof: { ...s.prof, photoList: s.prof.photoList.filter((_, j) => j !== i), photos: s.prof.photos - 1 } })), style: { justifySelf: 'end', alignSelf: 'start', margin: '6px', width: '26px', height: '26px', borderRadius: '50%', border: 0, background: 'rgba(16,35,58,.7)', color: '#fff', cursor: 'pointer', font: '600 14px Figtree,sans-serif' } }, '×');
    const fb = (prof.fallback || {});
    const sections = secDefs.map(([k, title, icon, fs, chipOptsK]) => { const open = openSec === k;
      const summary = k === 'services' ? (prof.services.join(', ') || 'Nothing selected yet') : k === 'photos' ? (prof.photoList.length ? prof.photoList.length + ' uploaded photo' + (prof.photoList.length === 1 ? '' : 's') : 'No uploaded photos') + (fb.photos ? ' · ' + fb.photos + ' from your current page' : '') : (fs.map(f => prof[f[0]] || (fb[f[0] === 'about' ? 'description' : f[0]] ? 'Current page text' : '')).filter(Boolean).join(' · ') || 'Not filled in');
      const needs = k === 'photos' ? prof.photos < 6 : k === 'services' ? !prof.services.length : fs.some(f => !prof[f[0]] && !fb[f[0] === 'about' ? 'description' : f[0]]);
      return { title, icon, summary: summary.length > 140 ? summary.slice(0, 140) + '…' : summary, open, border: open ? '#0890E8' : '#e3eaf2', chev: open ? 'rotate(-135deg)' : 'rotate(45deg)', tag: needs ? 'Needs attention' : 'Complete', tagBg: needs ? '#fff6e5' : '#e6f4ec', tagColor: needs ? '#8a5a00' : '#1f8a52',
        toggle: () => this.setState({ openSec: open ? null : k }), save: saveListing(k),
        fields: fs.map(([fk, label, areaF]) => ({ label, value: prof[fk] || '', isArea: !!areaF, isInput: !areaF, onChange: (e) => { const v = e.target.value; setProf({ [fk]: v }); } })),
        hasChips: !!chipOptsK, chips: (chipOptsK || []).map(label => { const on = prof.services.includes(label); return { label, toggle: () => this.setState(s => ({ prof: { ...s.prof, services: on ? s.prof.services.filter(x => x !== label) : [...s.prof.services, label] } })), bg: on ? '#0890E8' : '#fff', color: on ? '#fff' : '#1f3550', border: on ? '#0890E8' : '#dbe6f0' }; }),
        hasPhotos: k === 'photos', photos: Array.from({ length: Math.max(6, prof.photoList.length + 1) }, (_, i) => i < prof.photoList.length ? { bg: 'url("' + prof.photoList[i].url + '")', bs: 'solid', label: rmBtn(i) } : { bg: '#f9fbfd', bs: 'dashed', label: i === prof.photoList.length ? addCell : '' }) }; });
    const statusDefs = isC ? [['available', 'Beds available', 'Shown on your listing', '#2fb46b'], ['waitlist', 'Waitlist', 'Families see that your waitlist is open', '#F5A623'], ['full', 'Currently full', 'Leads still come in for future dates', '#9aabbd']]
      : [['available', 'Accepting new clients', 'Shown on your profile', '#2fb46b'], ['waitlist', 'Waitlist', 'New clients can join your waitlist', '#F5A623'], ['full', 'Not accepting', 'Your profile stays visible', '#9aabbd']];
    const setStatus = (k, label) => async () => {
      if (!canEdit) { this.flash(!(user && user.verified) ? 'Confirm your email address first' : isC ? 'Your listing is not approved yet' : 'Your profile is not set up yet'); return; }
      const prev = this.state.status; this.setState({ status: k });
      let r; if (isC) { const raw = { ...(this.state.prof.raw || {}), availability: k }; r = await this.api('/api/provider/profile', { slug: P.slug, profile: raw }); if (r.ok) setProf({ raw }); }
      else r = await this.saveTherapist({ accepting: k !== 'full' });
      if (!r || !r.ok) { this.setState({ status: prev }); this.flash((r && r.error) || 'Not saved'); return; }
      this.flash('Status updated on your listing: ' + label + (isC && !r.live ? ' · after review' : '')); };

    // ---------- plan & billing (Stripe) ----------
    const B = I.billing || { plans: [], invoices: [], sub: null, paymentsOn: false };
    const planName = isC ? (B.sub ? B.sub.plan : 'Free listing') : (I.therapist && I.therapist.status === 'published' ? 'Free profile' : 'Profile');
    const curPlan = B.sub && B.plans.find(p => p.key === B.sub.planKey);
    const planPrice = curPlan && curPlan.price ? curPlan.price : B.sub ? 'Billed through Stripe' : 'No subscription';
    const checkout = async (key) => { if (!P) { this.flash('You need an approved listing before choosing a plan'); return; } const r = await this.api('/api/stripe/checkout', { plan: key, centreSlug: P.slug }); if (r.ok && r.url) window.location.href = r.url; else this.flash(r.error); };
    const portal = async () => { const r = await this.api('/api/stripe/portal', {}); if (r.ok && r.url) window.location.href = r.url; else this.flash(r.error); };
    const upgrades = B.plans.filter(p => p.key !== 'national' || (B.sub && B.sub.planKey === 'national')).slice(0, 3).map(p => { const current = !!B.sub && p.key === B.sub.planKey; return { name: p.name, price: p.price || (p.available ? 'See checkout' : 'Coming soon'), features: [p.summary], border: current ? '#0890E8' : '#e3eaf2', bg: current ? '#f3f9fe' : '#fff', btn: current ? 'Current plan' : !p.available ? 'Coming soon' : (B.sub ? 'Switch to ' : 'Choose ') + p.name, btnBg: current || !p.available ? '#eaf5fd' : '#0890E8', btnColor: current || !p.available ? '#0a5d96' : '#fff', pick: () => current ? this.flash('This is your current plan') : !p.available ? this.flash('Plans open for purchase soon. Nothing has been charged.') : B.sub ? portal() : checkout(p.key) }; });
    const invoices = B.invoices.map(iv => ({ date: iv.date, desc: iv.desc, amt: iv.amt, dl: () => { if (iv.url) window.open(iv.url, '_blank', 'noopener'); else this.flash('This invoice has no download yet'); } }));
    const renewDate = B.sub && B.sub.renews ? new Date(B.sub.renews).toLocaleDateString('en-CA', { month: 'long', day: 'numeric' }) : '—';

    const tog = (k, t, b, live) => ({ t, b: live ? b : b + ' · coming soon', track: notifs[k] ? '#0890E8' : '#cfdceb', knob: notifs[k] ? '21px' : '3px', toggle: () => { if (!live) { this.flash(t + ' is not available yet'); return; } this.setState(s => ({ notifs: { ...s.notifs, [k]: !s.notifs[k] } })); this.flash(notifs[k] ? 'You will not get lead emails' : 'Lead emails switched on'); } });
    // ---------- analytics (real counters) ----------
    const heatHours = ['8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p'];
    const hm = {}; leads.forEach(l => { const d = new Date(l.at), di = (d.getDay() + 6) % 7, hi = d.getHours() - 8; if (hi >= 0 && hi < 12) hm[di + '-' + hi] = (hm[di + '-' + hi] || 0) + 1; }); const hMax = Math.max(1, ...Object.values(hm));
    const heat = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, di) => ({ d, cells: heatHours.map((h, hi) => { const n = hm[di + '-' + hi] || 0, v = n / hMax; return { bg: 'rgba(8,144,232,' + (0.06 + v * 0.85).toFixed(2) + ')', t: d + ' ' + h + ' · ' + n + (n === 1 ? ' enquiry' : ' enquiries') }; }) }));
    const inWin = leads.filter(l => l.at >= winA), reach = (st) => inWin.filter(l => st.includes(l.stage)).length;
    const funnelDefs = [[isC ? 'Listing views' : 'Profile views', sumV], ['Contact clicks', sumArr(callsS) + sumArr(clicksS)], [isC ? 'Leads' : 'Enquiries', inWin.length], [isC ? 'Assessments' : 'Consults', reach(['booked', 'admitted'])], [isC ? 'Admissions' : 'New clients', reach(['admitted'])]];
    const fMax = Math.max(1, funnelDefs[0][1]);
    const funnel = funnelDefs.map(([k, v], i) => ({ k, v: v.toLocaleString('en-CA'), h: Math.max(8, (Math.sqrt(v / fMax)) * 100) + '%', bg: ['#0890E8', '#2a9fec', '#5bb4f0', '#8b5cf6', '#2fb46b'][i], rate: i ? (funnelDefs[i - 1][1] ? Math.round((v / funnelDefs[i - 1][1]) * 100) + '% of previous' : '—') : '' }));
    const pageKind = (p) => p.startsWith('/therapists') ? 'Therapist pages' : p.startsWith('/search') ? 'Site search' : p === '/' ? 'Homepage' : /listing-location|-rehabs?\/$/.test(p) ? 'City / province page' : /addiction|alcohol|drug|detox/.test(p) ? 'Substance page' : p.startsWith('/blog') ? 'Blog' : 'Page';
    const pages = (ST.refs || []).length ? ST.refs.slice(0, 5).map(r => ({ page: r.key === '/' ? 'Homepage' : r.key.replace(/^\/|\/$/g, '').replace(/[-/_]+/g, ' ').replace(/^./, c => c.toUpperCase()), kind: pageKind(r.key), views: r.n.toLocaleString('en-CA'), tag: 'Organic', tagBg: '#f1f4f7', tagColor: '#516378' })) : [{ page: 'No visits recorded yet', kind: 'Visits are counted from today', views: '0', tag: '—', tagBg: '#f1f4f7', tagColor: '#516378' }];
    const tMax = Math.max(1, ...(ST.terms || []).map(t => t.n));
    const searches = (ST.terms || []).length ? ST.terms.map(({ key: term, n }) => { const r = n / tMax; return { term, n: String(n), size: (13 + r * 4).toFixed(1) + 'px', bg: 'rgba(8,144,232,' + (0.06 + r * 0.16).toFixed(2) + ')', color: r > 0.5 ? '#0a5d96' : '#1f3550' }; }) : [{ term: 'No site searches yet', n: '0', size: '13px', bg: 'rgba(8,144,232,.06)', color: '#516378' }];
    const busiest = Object.entries(hm).sort((a, b) => b[1] - a[1])[0];
    const insight = busiest ? 'Most enquiries arrive on ' + ['Mondays', 'Tuesdays', 'Wednesdays', 'Thursdays', 'Fridays', 'Saturdays', 'Sundays'][+busiest[0].split('-')[0]] + ' around ' + heatHours[+busiest[0].split('-')[1]].replace('a', ' am').replace('p', ' pm') + '. Replying within the hour is when families are most likely to book.' : 'Insights appear here once enquiries start coming in. Keep your listing complete so families can reach you.';

    // ---------- notifications (real) ----------
    const nl = [];
    leads.filter(l => l.stage === 'new').slice(0, 3).forEach(l => nl.push({ t: 'New lead: ' + l.name, b: l.interest + ' · ' + rel(l.at), icon: ic.users, iconBg: '#fdeceb', iconColor: '#D82028', go: () => this.setState({ view: 'leads', notifOpen: false, openId: l.id }) }));
    if (isC && this.opOverdue()) nl.push({ t: this.opOverdue() + ' overdue task' + (this.opOverdue() > 1 ? 's' : ''), b: 'Operations tasks', icon: ic.note, iconBg: '#fff6e5', iconColor: '#b07400', go: this.opGo('tasks') });
    (I.claims || []).filter(c => c.status === 'pending').slice(0, 2).forEach(c => nl.push({ t: 'Claim waiting for review', b: c.centre + ' · ' + rel(c.at), icon: ic.star, iconBg: '#eaf5fd', iconColor: '#0890E8', go: go('overview') }));
    if (P && P.pending) nl.push({ t: 'Listing changes waiting for review', b: 'They go live once approved', icon: ic.edit, iconBg: '#eaf5fd', iconColor: '#0890E8', go: go('profile') });
    if (P && P.rejectedNote != null) nl.push({ t: 'Listing changes not approved', b: P.rejectedNote || 'Open your listing to update them', icon: ic.edit, iconBg: '#fdecec', iconColor: '#c0262d', go: go('profile') });
    if (B.sub && B.sub.status === 'past_due') nl.push({ t: 'Payment problem', b: 'Update your card to keep your plan', icon: ic.card, iconBg: '#fdecec', iconColor: '#c0262d', go: go('billing') });
    if (!(user && user.verified)) nl.push({ t: 'Confirm your email address', b: 'We sent a link to ' + (user && user.email), icon: ic.mail, iconBg: '#fff6e5', iconColor: '#b07400', go: go('overview') });
    if (!nl.length) nl.push({ t: 'You are all caught up', b: 'New leads and alerts appear here', icon: ic.star, iconBg: '#e6f4ec', iconColor: '#1f8a52', go: () => this.setState({ notifOpen: false }) });
    const notifList = nl.map(n => ({ ...n, bg: notifRead ? '#fff' : '#f7fbff' }));
    const unread = !notifRead && nl.some(n => n.t !== 'You are all caught up');

    // ---------- status banner (real) ----------
    const vrf = !!(user && user.verified), pendingClaim = (I.claims || []).some(c => c.status === 'pending');
    let verifyTitle, verifyBody, steps;
    if (isC) {
      if (!vrf) { verifyTitle = 'Confirm your email address'; verifyBody = 'We sent a link to ' + (user && user.email) + '. Editing unlocks once it is confirmed.'; }
      else if (!P) { verifyTitle = pendingClaim ? 'Your claim is being reviewed' : 'Add your centre to get started'; verifyBody = pendingClaim ? 'We verify every claim and email you when it is approved.' : 'Claim an existing listing or submit a new centre.'; }
      else if (P.status === 'draft') { verifyTitle = P.name + ' is approved and being prepared'; verifyBody = 'Your page is not public yet. Complete your listing so it is ready to publish.'; }
      else { verifyTitle = P.name + ' is live' + (B.sub ? ' on the ' + B.sub.plan + ' plan' : ''); verifyBody = P.pending ? 'Your latest changes are waiting for review' : 'Families can find and contact you' + (B.sub && B.sub.renews ? ' · Renews ' + renewDate : ''); }
      steps = [['Paid', !!B.sub], ['Verified', vrf && !!P], ['Live', !!P && P.status !== 'draft']];
    } else {
      const T0 = I.therapist;
      if (!vrf) { verifyTitle = 'Confirm your email address'; verifyBody = 'We sent a link to ' + (user && user.email) + '.'; }
      else if (!T0) { verifyTitle = I.onboarding === 'pending' ? 'Your profile is being reviewed' : 'Create your therapist profile'; verifyBody = I.onboarding === 'pending' ? 'We email you as soon as it is approved.' : 'It takes about 10 minutes.'; }
      else { verifyTitle = T0.status === 'published' ? 'Your profile is live' : T0.status === 'removed' ? 'Your profile is not public' : 'Your profile is waiting to be published'; verifyBody = T0.status === 'published' ? 'Clients can find and message you' : 'Our team publishes it after a review'; }
      steps = [['Verified', vrf], ['Profile', !!T0], ['Live', !!T0 && T0.status === 'published']];
    }
    const hr = new Date().getHours();
    const tableColsV = mid ? 'minmax(0,1.3fr) minmax(0,1.2fr) minmax(0,1fr) auto 48px' : 'minmax(0,1fr) auto 40px';
    const csvCell = (v) => { const t = String(v == null ? '' : v); return '"' + (/^[=+\-@\t\r]/.test(t) ? "'" + t : t).replace(/"/g, '""') + '"'; };
    const exportCsv = () => { const rows = [['Received', 'Name', 'Stage', 'Interest', 'Source', 'Phone', 'Email', 'Message']].concat(filtered.map(l => [new Date(l.at).toISOString().slice(0, 16).replace('T', ' '), l.name, stageOf(l.stage)[1], l.interest, l.source, l.phone, l.email, l.message])); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([rows.map(r => r.map(csvCell).join(',')).join('\n')], { type: 'text/csv' })); a.download = 'leads.csv'; document.body.appendChild(a); a.click(); a.remove(); this.flash('Exported ' + filtered.length + ' leads to CSV'); };
    const addLead = async () => { const name = window.prompt('Name of the person (or family) who contacted you'); if (!name || !name.trim()) return; const phone = window.prompt('Phone number (optional)') || ''; const email = window.prompt('Email address (optional)') || '';
      const r = await this.api('/api/dashboard/leads', { action: 'create', centreSlug: P && P.slug, name: name.trim(), phone: phone.trim(), email: email.trim(), interest: isC ? 'Walk-in / phone enquiry' : 'Direct enquiry' }); if (!r.ok) { this.flash(r.error); return; }
      const l = { id: r.id, name: name.trim(), stage: 'new', interest: isC ? 'Walk-in / phone enquiry' : 'Direct enquiry', source: 'Added manually', at: r.at || Date.now(), score: 60, phone: phone.trim(), email: email.trim(), message: 'Added manually from the dashboard.', who: '', insurance: '', urgency: '', timeline: [{ k: 'in', t: 'Lead added manually', at: r.at || Date.now() }] };
      this.setState(s => ({ leads: [l, ...s.leads], openId: l.id, view: 'leads' })); this.flash('Lead added'); };
    const signOut = async () => { if (this._st) { clearTimeout(this._st); await this.saveNow(false); } await fetch('/api/auth/logout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}', credentials: 'same-origin' }).catch(() => {}); window.location.href = '/login/'; };
    const teamList = (I.team || []).length ? I.team : [{ name: (user && user.name) || '', email: (user && user.email) || '', role: 'Owner' }];
    return {
      shellCols: sideOn ? (sideWide ? '252px minmax(0,1fr)' : '80px minmax(0,1fr)') : 'minmax(0,1fr)', showSide: sideOn, sideWide, sidePad: sideWide ? '16px' : '12px', logoJustify: sideWide ? 'flex-start' : 'center', logoSrc: '/assets/logo-white.png', logoH: sideWide ? '40px' : '22px', sideLabelDisplay: sideWide ? 'inline' : 'none',
      nav, orgName, userPad: sideWide ? '10px' : '6px', goBilling: isC ? go('billing') : () => { window.location.href = '/promote/'; }, goCalendar: go('calendar'), goLeads: go('leads'), planName, planPrice, iconHelp: this.icon([{ t: 'circle', a: { cx: 12, cy: 12, r: 9 } }, 'M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14', 'M12 17.5v.01']),
      planLine: B.sub ? planName + ' · ' + planPrice : planName, planStatus: B.sub ? ({ active: 'Active', trialing: 'Trial', past_due: 'Payment due', canceled: 'Cancelled' }[B.sub.status] || B.sub.status) : 'Free', planVerified: vrf ? 'Verified' : 'Email not confirmed', signOut, saveErr: this.state.saveErr,
      listingNote: isC ? (I.moderation === 'instant' ? 'Changes go live instantly after saving.' : 'Changes are reviewed by our team, then go live.') + (P && P.pending ? ' Your last changes are waiting for review.' : '') : 'Changes go live instantly after saving.',
      fullEditorHref: isC && P ? '/provider-dashboard/' + P.slug + '/' : '/therapist-dashboard/edit/',
      showMobileNav: !sideOn, mainPadX: mid ? '28px' : '16px', mainPad: mid ? '26px 28px 60px' : '18px 16px 48px', searchDisplay: mid ? 'flex' : 'none', demoDisplay: 'none', q, setQ: (e) => this.setState({ q: e.target.value, view: view === 'leads' ? view : 'leads' }),
      gcalDot: '#9aabbd', gcalAnim: 'none', gcalLabel: 'Calendar', gcalLabelDisplay: vw >= 900 ? 'inline' : 'none',
      toggleNotif: () => this.setState({ notifOpen: !notifOpen }), notifOpen, notifs: notifList, notifDot: unread ? 'block' : 'none', clearNotif: () => this.setState({ notifRead: true }),
      initials: ((user && user.name) || orgName || '?').split(/\s+/).filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      h1Size: mid ? '30px' : '26px', today: new Date().toLocaleDateString('en-CA', { weekday: 'long', month: 'long', day: 'numeric' }), dayPart: hr < 12 ? 'morning' : hr < 18 ? 'afternoon' : 'evening', firstName,
      ranges: [[7, '7 days'], [30, '30 days'], [90, '90 days']].map(([r, label]) => ({ label, select: () => this.setState({ range: r, hover: -1 }), bg: range === r ? '#10233a' : 'transparent', color: range === r ? '#fff' : '#516378' })),
      isOverview: view === 'overview', isLeads: view === 'leads', isCalendar: view === 'calendar', isAnalytics: view === 'analytics', isProfile: view === 'profile', isBilling: view === 'billing', isSettings: view === 'settings',
      bannerCols: vw >= 980 ? 'minmax(0,1fr) auto' : 'minmax(0,1fr)', verifyTitle, verifyBody,
      verifySteps: steps.map(([label, on]) => ({ label, bg: on ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.05)', color: on ? '#fff' : '#9fb3c8', dot: on ? '#2fb46b' : 'rgba(255,255,255,.25)' })),
      kpiCols: wide ? 'repeat(4,minmax(0,1fr))' : (vw >= 560 ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)'), kpis,
      twoWide: wide ? 'minmax(0,1.65fr) minmax(0,1fr)' : 'minmax(0,1fr)', threeCols: wide ? 'repeat(3,minmax(0,1fr))' : (mid ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)'), twoEven: vw >= 1000 ? 'repeat(2,minmax(0,1fr))' : 'minmax(0,1fr)',
      grid: [40, 90, 140, 190].map(y => ({ y: String(y) })), bars, hits, chartLine: line, chartArea: area,
      hoverX: hover >= 0 ? px(hover).toFixed(1) : '-10', hoverOp: hover >= 0 ? '1' : '0', tipLeft: hover >= 0 ? Math.min(88, Math.max(12, (px(hover) / W) * 100)) + '%' : '50%', tipDate: hover >= 0 ? dayLabel(hover) : '', tipViews: hover >= 0 ? String(views[hover]) : '', tipLeads: hover >= 0 ? String(lds[hover]) : '',
      hotLeads: hot, hotEmpty: !hot.length, upcoming, upcomingEmpty: !upcoming.length, sources, strengthPct: Math.min(100, strength) + '%', strengthColor: strength >= 85 ? '#2fb46b' : '#0890E8', strengthOffset: String(113 - (113 * Math.min(100, strength)) / 100), todo,
      leadSummary: newCount ? newCount + ' new lead' + (newCount === 1 ? '' : 's') + ' waiting for a reply. Drag cards between stages.' : leads.length ? 'You’re all caught up. Drag cards between stages.' : 'Enquiries from your ' + (isC ? 'listing' : 'profile') + ' appear here. Add a phone or walk-in lead yourself with “Add lead”.',
      leadViews: [['board', 'Pipeline'], ['table', 'List']].map(([k, label]) => ({ label, select: () => this.setState({ leadView: k }), bg: leadView === k ? '#10233a' : 'transparent', color: leadView === k ? '#fff' : '#516378' })),
      isBoard: leadView === 'board', isTable: leadView === 'table', board, boardCols: vw >= 1300 ? 'repeat(5,minmax(0,1fr))' : 'repeat(5,240px)', crmStats,
      leadRows: filtered.map(decorate), tableCols: tableColsV, tableExtra: mid ? 'block' : 'none',
      exportCsv, addLead,
      gcalSub: 'Bookings from your leads and open slots are kept here', gcalSubColor: '#6b7f95',
      gcalBtn: 'Connect', gcalBtnBg: '#0890E8', gcalBtnColor: '#fff', gcalSpin: 'none',
      toggleGcal: () => this.flash('Google Calendar sync is not available yet. Your bookings stay in this calendar.'),
      calDays: days.map((d, i) => ({ dow: d.toLocaleDateString('en-CA', { weekday: 'short' }), date: String(d.getDate()), color: i === todayIdx ? '#0890E8' : '#10233a' })), calRows,
      calLegend: [['Bookings from leads', 'booked'], ['Open slots', 'hold'], ['Unavailable', 'block']].map(([label, k]) => ({ label, bg: evSty[k][0], border: evSty[k][1] })),
      funnel, funnelCols: vw >= 900 ? 'repeat(5,minmax(0,1fr))' : 'repeat(3,minmax(0,1fr))', pages, searches, heat, heatHours,
      insight,
      publicHref: isC ? (P && P.href ? P.href : '/claim-listing/') : (I.therapist && I.therapist.href ? I.therapist.href : '/therapists/'), sections, photoCols: mid ? 'repeat(6,minmax(0,1fr))' : 'repeat(3,minmax(0,1fr))',
      statusCols: vw >= 900 ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)',
      statusOpts: statusDefs.map(([k, label, body, dot]) => { const on = status === k; return { label, body, dot, anim: on && k === 'available' ? 'pdPulse 2.4s infinite' : 'none', border: on ? dot : '#e3eaf2', bg: on ? '#fff' : '#fbfcfd', select: setStatus(k, label) }; }),
      renewDate, cardLabel: B.sub ? 'Payment method managed in Stripe' : B.paymentsOn ? 'No payment method yet' : 'Plans open soon', upgrades, upgradeCols: vw >= 1300 ? 'repeat(3,minmax(0,1fr))' : (vw >= 640 ? 'repeat(3,minmax(0,1fr))' : 'minmax(0,1fr)'), invoices,
      cancelSub: () => B.sub ? portal() : this.flash('You have no subscription to cancel'),
      notifSettings: [tog('email', isC ? 'Email me new leads' : 'Email me new enquiries', 'Instant email for every enquiry', true), tog('sms', 'Text me urgent leads', 'SMS when a lead scores 85+', false), tog('digest', 'Weekly performance digest', 'Views, leads and tips every Monday', false), tog('reviews', 'New review alerts', 'Know when someone reviews you', false)],
      integrations: [['G', 'Google Calendar', 'Not available yet'], ['GB', 'Google Business Profile', 'Reviews come from Google automatically'], ['Z', 'Zapier', 'Not available yet']].map(([mark, name, sub]) => ({ mark, name, sub, subColor: '#6b7f95', btn: 'Connect', btnBg: '#0890E8', btnColor: '#fff', btnBorder: '#0890E8', toggle: () => this.flash(name + ' connection is not available yet') })),
      team: teamList.map(t => ({ i: (t.name || t.email || '?').slice(0, 1).toUpperCase(), n: t.name || t.email, e: t.email, r: t.role })),
      inviteTeam: async () => { if (!isC) { this.flash('Team access is for centre accounts'); return; } const em = window.prompt('Email address of the colleague you want to give access to'); if (!em || !em.trim()) return; const r = await this.api('/api/dashboard/team', { email: em.trim() }); this.flash(r.ok ? 'Invitation sent to ' + em.trim() : r.error); },
      drawerOpen: !!cur, drawerW: vw >= 600 ? '480px' : '100%', ld, closeLead: () => this.setState({ openId: null }),
      quick: cur ? [['Call', cur.phone ? 'tel:' + cur.phone.replace(/[^\d+]/g, '') : '#', ic.phone, '#fdeceb', '#c0262d', cur.phone ? null : (e) => { e.preventDefault(); this.flash('No phone number for this lead'); }], ['Email', cur.email ? 'mailto:' + cur.email : '#', ic.mail, '#eaf5fd', '#0a5d96', cur.email ? null : (e) => { e.preventDefault(); this.flash('No email address for this lead'); }], ['Book', '#', ic.cal, '#f1ebfe', '#5b34b8', (e) => { e.preventDefault(); bookFor(); }], ['Won', '#', ic.star, '#e6f4ec', '#1f8a52', (e) => { e.preventDefault(); moveLead(cur.id, 'admitted'); this.flash('Marked as ' + stageOf('admitted')[1]); }]].map(([label, href, icon, bg, color, act]) => ({ label, href, icon, bg, color, act: act || (() => {}) })) : [],
      ldStages: stages.map(([k, label, color]) => { const on = cur && cur.stage === k; return { label, select: () => cur && cur.stage !== k && moveLead(cur.id, k), bg: on ? color : '#fff', color: on ? '#fff' : '#1f3550', border: on ? color : '#e3eaf2' }; }),
      ldFacts: cur ? [['Phone', cur.phone || '—'], ['Email', cur.email || '—'], ['Enquiring for', cur.who || '—'], ['Payment', cur.insurance || '—'], ['Urgency', cur.urgency || '—'], ['Interest', cur.interest]].map(([k, v]) => ({ k, v })) : [],
      reply, setReply: (e) => this.setState({ reply: e.target.value }), aiDraft, aiLabel: 'Draft a reply', aiSpin: 'none', aiIcon: 'flex',
      templates: tpls.map(([label, text]) => ({ label, use: () => this.setState({ reply: 'Hi ' + (cur ? (cur.name || '').split(' ')[0] : '') + ',\n\n' + text + '\n\nWarmly,\n' + firstName }) })), sendReply,
      note, setNote: (e) => this.setState({ note: e.target.value }), addNote,
      ldTimeline: cur ? cur.timeline.map(t => { const x = tlIcon[t.k] || tlIcon.in; return { t: t.t, when: t.at ? rel(t.at) : (t.when || ''), icon: x[0], bg: x[1], color: x[2] }; }) : [],
      ...this.opVals(), ...this.thVals(nav), toastOn: !!toast, toast,
      iconSearch: this.icon([{ t: 'circle', a: { cx: 11, cy: 11, r: 7 } }, 'M20 20l-3.5-3.5']), iconBell: this.icon(['M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8', 'M10.3 21a1.9 1.9 0 0 0 3.4 0']),
      iconShield: this.icon(['M12 3l7 3v5c0 5-3 8.5-7 10-4-1.5-7-5-7-10V6z', 'M9 12l2 2 4-4'], { width: 22, height: 22 }), iconCheckTiny: this.icon(['M5 12.5l4.5 4.5L19 7.5'], { width: 11, height: 11, strokeWidth: 3.2 }), iconCheckTiny2: this.icon(['M5 12.5l4.5 4.5L19 7.5'], { width: 12, height: 12, strokeWidth: 3 }),
      iconArrowSm: this.icon(['M5 12h14', 'M13 6l6 6-6 6'], { width: 15, height: 15, strokeWidth: 2.2 }), iconDownload: this.icon(['M12 4v12', 'M7 11l5 5 5-5', 'M5 20h14'], { width: 16, height: 16, strokeWidth: 2 }), iconPlus: this.icon(['M12 5v14', 'M5 12h14'], { width: 16, height: 16, strokeWidth: 2.2 }),
      iconEye: ic.eye, iconDoc: ic.note, iconSpark: this.icon(['M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z', 'M19 17l.7 1.8 1.8.7-1.8.7L19 22l-.7-1.8-1.8-.7 1.8-.7z'], { width: 15, height: 15, strokeWidth: 2 }),
    };
  }
  /** Saves part of the therapist's public profile (merged with the rest on the server). */
  async saveTherapist(patch, okMsg) {
    const d = (this.I.therapist && this.I.therapist.data) || {};
    if (!this.I.therapist) { this.flash('Your profile is not set up yet'); return { ok: false, error: 'Your profile is not set up yet' }; }
    const merged = { ...d, ...(this.state.prof && this.state.prof.raw), ...patch };
    const profile = { name: merged.name || (this.state.user && this.state.user.name) || 'Therapist' };
    ['phone', 'website', 'desig', 'years', 'city', 'prov', 'tagline', 'bio', 'fee', 'couples'].forEach(k => { if (merged[k] != null) profile[k] = String(merged[k]); });
    ['modes', 'langs', 'clients', 'concerns', 'approaches', 'payments'].forEach(k => { if (Array.isArray(merged[k])) profile[k] = merged[k]; });
    ['accepting', 'sliding', 'consult'].forEach(k => { if (typeof merged[k] === 'boolean') profile[k] = merged[k]; });
    const r = await this.api('/api/therapist/profile', { profile });
    if (r.ok) { this.setState(s => ({ prof: { ...s.prof, raw: { ...(s.prof.raw || {}), ...profile } } })); if (okMsg) this.flash(okMsg); else this.flash('Changes saved and live'); }
    else this.flash(r.fields ? Object.values(r.fields)[0] : r.error);
    return r;
  }

}


/* ───────────────────────── template ───────────────────────── */
function template(v) {
  const { a, addLead, addNote, aiDraft, aiIcon, aiLabel, aiSpin, at, avatarTap, b, bannerCols, bars, board, boardCols, c, calDays, calLegend, calRows, cancelSub, cardLabel, cb, cc, cd, chartArea, chartLine, clearNotif, closeLead, closeMore, col, cr, crmStats, cs, d, dayPart, demoDisplay, dp, drawerOpen, drawerW, exportCsv, f, fa, firstName, fn, fs, fullEditorHref, funnel, funnelCols, g, gcalAnim, gcalBtn, gcalBtnBg, gcalBtnColor, gcalBtnDisplay, gcalDot, gcalLabel, gcalLabelDisplay, gcalSpin, gcalSub, gcalSubColor, goBilling, goBillingMore, goCalendar, goFacilities, goLeads, goPartners, goTasks, grid, h, h1Size, hc, heat, heatHours, hh, hits, hotEmpty, hotLeads, hoverOp, hoverX, hr, i, iconArrowSm, iconBell, iconCheckTiny, iconCheckTiny2, iconDoc, iconDownload, iconEye, iconHelp, iconPlus, iconSearch, iconShield, iconSpark, ig, initials, insight, integrations, inviteTeam, invoices, isAnalytics, isBilling, isBoard, isCalendar, isFacilities, isLeads, isMarketing, isOverview, isPartners, isProfile, isReports, isSettings, isTable, isTasks, iv, k, kpiCols, kpis, l, ld, ldFacts, ldStages, ldTimeline, leadRows, leadSummary, leadViews, lf, lg, listingNote, lo, logoH, logoJustify, lv, m, mainPad, mainPadX, mb, mobSearchBg, mobSearchOpen, mobTitle, moreItems, moreOpen, ms, n, nav, note, notifDot, notifOpen, notifRight, notifSettings, notifTop, notifW, notifs, ns, nt, o, of, onFacQ, onParQ, onTaskQ, onThCliQ, opActOutcome, opActOutcomes, opActType, opActTypes, opAddCampaign, opAddFacility, opAddPartner, opAddReport, opAddTask, opAttnTasks, opCapRows, opClearFac, opClearPar, opConfirmCancel, opConfirmDo, opConfirmEffect, opConfirmKind, opConfirmLabel, opConfirmOpen, opCpiBars, opCurrency, opDrCanDelete, opDrCapColor, opDrCapLabel, opDrCapPct, opDrClose, opDrDelete, opDrEdit, opDrErrSummary, opDrFacts, opDrFields, opDrHasCap, opDrHasErr, opDrHasLog, opDrIsForm, opDrIsView, opDrKicker, opDrLog, opDrNotice, opDrNoticeText, opDrOpen, opDrSave, opDrSaveLabel, opDrTitle, opDuePartners, opExport, opFacCols, opFacEmpty, opFacProg, opFacQ, opFacRows, opFacSort, opFacStats, opFacStatus, opKpiCols, opKpis, opLoading, opLocations, opLogActivity, opMktBars, opMktChannel, opMktCols, opMktEmpty, opMktPeriod, opMktRows, opMktStats, opNoAttn, opNoDue, opOrgFields, opParCols, opParEmpty, opParQ, opParRows, opParSort, opParStatus, opParType, opPeriodSel, opReady, opRepCols, opRepRows, opRepScope, opRepSort, opSaveOrg, opSetActOutcome, opSetActType, opSetCurrency, opSkel, opSplit, opSupKnob, opSupTrack, opTaskCat, opTaskGroups, opTaskQ, opTaskTeam, opToggleSuppress, opTrend, opUpdated, orgName, p, pages, pg, ph, photoCols, planLine, planName, planPrice, planStatus, planVerified, publicHref, q, qa, quick, r, ranges, renewDate, reply, s, searchDisplay, searches, sec, sections, sendReply, setNote, setQ, setReply, shellCols, showMobileNav, showSide, sideLabelDisplay, sidePad, sideWide, signOut, so, sources, sr, st, statusCols, statusOpts, strengthColor, strengthOffset, strengthPct, t, tableCols, tableExtra, tabs, tapSize, tb, td, team, templates, tg, thAcceptLabel, thAddClient, thAddInv, thAddTask, thAddWait, thBillStats, thBlock, thBook, thBuffer, thBufferLabel, thCalDays, thCalFmt, thCalGridOn, thCalH, thCalLabel, thCalMinW, thCalModes, thCalMonthOn, thCalN, thCalNext, thCalPrev, thCalRoom, thCalToday, thCliCols, thCliEmpty, thCliQ, thCliRows, thCliSort, thCliStatus, thCols3, thCols4, thCp, thCpBook, thCpCols, thCpEdit, thCpEmpty, thCpFacts, thCpFactsOn, thCpListOn, thCpRows, thCpTabs, thCur, thDeadEmpty, thDeadlines, thDrCanCancel, thDrCancelAppt, thDrClose, thDrErr, thDrErrText, thDrFacts, thDrFields, thDrOpen, thDrRecur, thDrSave, thDrSaveLabel, thDrTitle, thDupKeep, thDupOn, thDupReview, thDupText, thExport, thFeeQueue, thFeeQueueOn, thFin, thFinDisplay, thFirst, thGoBill, thGoCal, thGoClients, thGoWait, thHours, thHoursRows, thInvCols, thInvEmpty, thInvFilter, thInvRows, thIsAvail, thIsBill, thIsCal, thIsClient, thIsClients, thIsOverview, thIsReports, thIsSettingsX, thIsTasks, thIsWait, thKpis, thLeave, thLog, thMonthCells, thName, thNoFin, thOn, thOwing, thPermCols, thPerms, thProfFacts, thQuick, thRecurOpts, thRem, thRemCols, thRepPeriod, thReport, thRoleNote, thRoles, thRooms, thSec, thSetBuffer, thSplit, thTaskGroups, thToday, thTodayEmpty, thTodayList, thToggleAccept, thTrend, thTz, thUtil, thWaitCols, thWaitDue, thWaitDueEmpty, thWaitEmpty, thWaitRows, thWeekAvail, threeCols, tipDate, tipLeads, tipLeft, tipViews, tk, tl, tm, toast, toastBottom, toastOn, today, todo, toggleGcal, toggleMobSearch, toggleNotif, topGap, topH, tp, tr, twoEven, twoWide, u, uf, up, upcoming, upcomingEmpty, upgradeCols, upgrades, userPad, verifyBody, verifySteps, verifyTitle, vs, w, x } = v;
  return (
    <>
    <div style={$css(`min-height:100vh;display:grid;grid-template-columns:${shellCols ?? ''};background:radial-gradient(900px 520px at 100% -10%,rgba(8,144,232,.10),rgba(8,144,232,0) 60%),radial-gradient(700px 480px at 30% 110%,rgba(216,32,40,.05),rgba(216,32,40,0) 60%),#f3f6fa`)}>
      {showSide ? (
        <>
          <aside data-screen-label="Dashboard sidebar" style={$css(`position:sticky;top:0;height:100vh;background:radial-gradient(420px 260px at 0% 0%,rgba(8,144,232,.28),rgba(8,144,232,0) 70%),linear-gradient(180deg,#12294a 0%,#0c1b2f 100%);color:#b7c7d8;box-shadow:inset -1px 0 0 rgba(255,255,255,.06);display:flex;flex-direction:column;gap:22px;padding:22px ${sidePad ?? ''};overflow-y:auto`)}>
            <$A href="/" style={$css(`display:flex;align-items:center;justify-content:${logoJustify ?? ''};min-height:44px`)}>
              <img src="/assets/logo-white.png" alt="Addiction Rehab Centres Canada" style={$css(`height:${logoH ?? ''};width:auto;display:block`)} />
            </$A>
            <nav style={$css("display:flex;flex-direction:column;gap:4px")}>
              {$list(nav).map((n, $index) => (
                <Fragment key={$index}>
                  <button className="pdp0 pdp1" onClick={n?.go} title={$val(n?.label)} style={$css(`appearance:none;border:0;cursor:pointer;display:flex;align-items:center;gap:12px;height:44px;padding:0 12px;border-radius:12px;background:${n?.bg ?? ''};color:${n?.color ?? ''};box-shadow:${n?.shadow ?? ''};font:600 14.5px Figtree,sans-serif;text-align:left;justify-content:${n?.justify ?? ''};transition:background .18s ease,color .18s ease,box-shadow .2s ease,transform .12s ease-out`)}>
                    <span style={$css("display:flex;flex-shrink:0")}>
                      {$i(n?.icon)}
                    </span>
                    <span style={$css(`display:${n?.labelDisplay ?? ''};flex:1`)}>
                      {$i(n?.label)}
                    </span>
                    <span style={$css(`display:${n?.badgeDisplay ?? ''};min-width:22px;height:22px;padding:0 7px;border-radius:999px;background:#D82028;color:#fff;font:600 11.5px Jost,sans-serif;align-items:center;justify-content:center`)}>
                      {$i(n?.badge)}
                    </span>
                  </button>
                </Fragment>
              ))}
            </nav>
            {sideWide ? (
              <>
                <div style={$css("margin-top:auto;display:flex;flex-direction:column;gap:12px;padding:16px;border-radius:20px;box-shadow:inset 0 1px 0 rgba(255,255,255,.08);background:linear-gradient(160deg,rgba(8,144,232,.28),rgba(8,144,232,.08));border:1px solid rgba(124,196,245,.25)")}>
                  <span style={$css("font:600 12px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#7cc4f5")}>
                    {$i(planName)}{" plan"}
                  </span>
                  <span style={$css("font:600 16px/1.3 Jost,sans-serif;color:#fff")}>
                    Get sponsored placement on city & substance pages
                  </span>
                  <button onClick={goBilling} style={$css("appearance:none;border:0;cursor:pointer;height:38px;border-radius:999px;background:#fff;color:#0a5d96;font:600 13.5px Jost,sans-serif")}>
                    See upgrade options
                  </button>
                </div>
              </>
            ) : null}
            <div style={$css(`display:flex;align-items:center;gap:10px;justify-content:${logoJustify ?? ''};padding:${userPad ?? ''};border-radius:16px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)`)}>
              <span style={$css("width:36px;height:36px;border-radius:11px;background:linear-gradient(135deg,#1aa0f0,#0a6fc0);color:#fff;display:grid;place-items:center;font:600 13px Jost,sans-serif;flex-shrink:0")}>
                {$i(initials)}
              </span>
              <span style={$css(`display:${sideLabelDisplay ?? ''};min-width:0;flex-direction:column`)}>
                <span style={$css("display:block;font:600 14px Jost,sans-serif;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                  {$i(orgName)}
                </span>
                <span style={$css("display:block;font:500 12px Figtree,sans-serif;color:#9fb3c8")}>
                  {$i(planName)}{" · "}{$i(planVerified)}
                </span>
              </span>
            </div>
            <$A className="pdp2" href="tel:+18558854747" style={$css(`display:flex;align-items:center;gap:10px;justify-content:${logoJustify ?? ''};color:#b7c7d8;font:500 13px Figtree,sans-serif`)}>
              <span style={$css("display:flex")}>
                {$i(iconHelp)}
              </span>
              <span style={$css(`display:${sideLabelDisplay ?? ''}`)}>
                Provider support
              </span>
            </$A>
            <button className="pdp2" onClick={signOut} style={$css(`appearance:none;border:0;background:transparent;cursor:pointer;padding:0;display:flex;align-items:center;gap:10px;justify-content:${logoJustify ?? ''};color:#b7c7d8;font:500 13px Figtree,sans-serif`)}>
              <span style={$css("display:flex")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 17l-5-5 5-5" /><path d="M5 12h11" /></svg>
              </span>
              <span style={$css(`display:${sideLabelDisplay ?? ''}`)}>
                Sign out
              </span>
            </button>
          </aside>
        </>
      ) : null}
      <div style={$css("min-width:0;display:flex;flex-direction:column")}>
        <header style={$css(`position:sticky;top:0;z-index:30;display:flex;align-items:center;gap:12px;height:${topH ?? ''};box-sizing:content-box;padding:env(safe-area-inset-top) ${mainPadX ?? ''} 0;background:rgba(246,249,252,.78);backdrop-filter:blur(16px) saturate(1.4);-webkit-backdrop-filter:blur(16px) saturate(1.4);border-bottom:1px solid rgba(227,234,242,.8)`)}>
          {showMobileNav ? (
            <>
              <div style={$css("display:flex;flex-direction:column;min-width:0;flex:1")}>
                <span style={$css("font:500 12px Figtree,sans-serif;color:#6b7f95;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                  {$i(orgName)}
                </span>
                <span style={$css("font:600 21px/1.15 Jost,sans-serif;letter-spacing:-.01em;color:#10233a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                  {$i(mobTitle)}
                </span>
              </div>
              <button className="pdp3" onClick={toggleMobSearch} aria-label="Search" style={$css(`appearance:none;cursor:pointer;width:44px;height:44px;flex-shrink:0;border-radius:14px;background:${mobSearchBg ?? ''};border:1px solid #e3eaf2;color:#1f3550;display:grid;place-items:center`)}>
                {$i(iconSearch)}
              </button>
            </>
          ) : null}
          <div style={$css(`display:${searchDisplay ?? ''};align-items:center;gap:10px;flex:1;max-width:420px;height:44px;padding:0 14px;border-radius:14px;background:#fff;border:1px solid #e3eaf2`)}>
            <span style={$css("display:flex;color:#6b7f95")}>
              {$i(iconSearch)}
            </span>
            <input value={$val(q)} onChange={setQ} placeholder="Search leads by name, program or source" style={$css("flex:1;min-width:0;border:0;outline:none;background:transparent;font:500 14.5px Figtree,sans-serif;color:#10233a")} />
          </div>
          <div style={$css(`margin-left:auto;display:flex;align-items:center;gap:${topGap ?? ''};flex-shrink:0`)}>
            <span style={$css(`display:${demoDisplay ?? ''};height:28px;padding:0 10px;border-radius:999px;background:#fff6e5;border:1px solid #f6dfae;color:#8a5a00;font:600 12px Figtree,sans-serif;align-items:center`)}>
              Demo data
            </span>
            <button onClick={goCalendar} title="Google Calendar sync" style={$css(`appearance:none;cursor:pointer;display:${gcalBtnDisplay ?? ''};align-items:center;gap:8px;height:40px;padding:0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;color:#1f3550;font:600 13px Figtree,sans-serif`)}>
              <span style={$css(`width:8px;height:8px;border-radius:50%;background:${gcalDot ?? ''};animation:${gcalAnim ?? ''}`)} />
              <span style={$css(`display:${gcalLabelDisplay ?? ''}`)}>
                {$i(gcalLabel)}
              </span>
            </button>
            <button onClick={toggleNotif} aria-label="Notifications" style={$css(`appearance:none;cursor:pointer;position:relative;width:${tapSize ?? ''};height:${tapSize ?? ''};border-radius:12px;background:#fff;border:1px solid #e3eaf2;color:#1f3550;display:grid;place-items:center`)}>
              {$i(iconBell)}
              <span style={$css(`position:absolute;top:6px;right:6px;width:9px;height:9px;border-radius:50%;background:#D82028;border:2px solid #fff;display:${notifDot ?? ''}`)} />
            </button>
            <button onClick={avatarTap} aria-label="Account" style={$css(`appearance:none;border:0;cursor:pointer;width:${tapSize ?? ''};height:${tapSize ?? ''};border-radius:12px;background:#0890E8;color:#fff;display:grid;place-items:center;font:600 14px Jost,sans-serif`)}>
              {$i(initials)}
            </button>
          </div>
          {notifOpen ? (
            <>
              <div style={$css(`position:absolute;right:${notifRight ?? ''};top:${notifTop ?? ''};width:${notifW ?? ''};max-width:calc(100vw - 24px);max-height:70vh;overflow-y:auto;background:#fff;border:1px solid #e3eaf2;border-radius:20px;padding:8px;box-shadow:0 30px 60px -30px rgba(16,35,58,.45);animation:pdFade .18s ease-out`)}>
                <div style={$css("display:flex;justify-content:space-between;align-items:center;padding:8px 10px")}>
                  <span style={$css("font:600 15px Jost,sans-serif")}>
                    Notifications
                  </span>
                  <button onClick={clearNotif} style={$css("appearance:none;border:0;background:transparent;cursor:pointer;font:600 12.5px Figtree,sans-serif;color:#0890E8")}>
                    Mark all read
                  </button>
                </div>
                {$list(notifs).map((nt, $index) => (
                  <Fragment key={$index}>
                    <button className="pdp4" onClick={nt?.go} style={$css(`appearance:none;border:0;cursor:pointer;width:100%;text-align:left;display:flex;gap:12px;padding:10px;border-radius:14px;background:${nt?.bg ?? ''}`)}>
                      <span style={$css(`width:34px;height:34px;border-radius:11px;background:${nt?.iconBg ?? ''};color:${nt?.iconColor ?? ''};display:grid;place-items:center;flex-shrink:0`)}>
                        {$i(nt?.icon)}
                      </span>
                      <span style={$css("display:flex;flex-direction:column;gap:2px;min-width:0")}>
                        <span style={$css("font:600 14px Figtree,sans-serif;color:#10233a")}>
                          {$i(nt?.t)}
                        </span>
                        <span style={$css("font-size:12.5px;color:#6b7f95")}>
                          {$i(nt?.b)}
                        </span>
                      </span>
                    </button>
                  </Fragment>
                ))}
              </div>
            </>
          ) : null}
        </header>
        {mobSearchOpen ? (
          <>
            <div style={$css("position:sticky;top:calc(64px + env(safe-area-inset-top));z-index:29;padding:10px 14px;background:rgba(246,249,252,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid #e3eaf2;animation:pdFade .18s ease-out")}>
              <div style={$css("display:flex;align-items:center;gap:10px;height:48px;padding:0 14px;border-radius:14px;background:#fff;border:1.5px solid #0890E8;box-shadow:0 0 0 4px rgba(8,144,232,.12)")}>
                <span style={$css("display:flex;color:#6b7f95")}>
                  {$i(iconSearch)}
                </span>
                <input autoFocus={true} value={$val(q)} onChange={setQ} placeholder="Search leads, programs, sources" style={$css("flex:1;min-width:0;border:0;outline:none;background:transparent;font:500 16px Figtree,sans-serif;color:#10233a")} />
                <button onClick={toggleMobSearch} style={$css("appearance:none;border:0;background:transparent;cursor:pointer;font:600 14px Figtree,sans-serif;color:#0890E8;padding:8px 0 8px 6px")}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : null}
        <main style={$css(`padding:${mainPad ?? ''};display:flex;flex-direction:column;gap:22px;min-width:0`)}>
          {isOverview ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:22px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px")}>
                    <span style={$css("font:500 14px Figtree,sans-serif;color:#6b7f95")}>
                      {$i(today)}
                    </span>
                    <h1 style={$css(`font-size:${h1Size ?? ''};letter-spacing:-.02em`)}>
                      {"Good "}{$i(dayPart)}{", "}
                      <span style={$css("background:linear-gradient(90deg,#0a6fc0,#0890E8);-webkit-background-clip:text;background-clip:text;color:transparent")}>
                        {$i(firstName)}
                      </span>
                    </h1>
                  </div>
                  <div style={$css("display:inline-flex;padding:4px;border-radius:999px;background:#fff;border:1px solid #e6edf5;box-shadow:0 8px 20px -16px rgba(16,35,58,.35)")}>
                    {$list(ranges).map((r, $index) => (
                      <Fragment key={$index}>
                        <button onClick={r?.select} style={$css(`appearance:none;border:0;cursor:pointer;height:34px;padding:0 14px;border-radius:999px;background:${r?.bg ?? ''};color:${r?.color ?? ''};font:600 13px Figtree,sans-serif`)}>
                          {$i(r?.label)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${bannerCols ?? ''};gap:16px;align-items:center;padding:18px 20px;border-radius:22px;background:radial-gradient(420px 200px at 90% 0%,rgba(124,196,245,.35),rgba(124,196,245,0) 70%),linear-gradient(120deg,#10233a 0%,#0a4f86 70%,#0a6fc0 100%);color:#fff;position:relative;overflow:hidden;box-shadow:0 24px 50px -32px rgba(10,79,134,.8)`)}>
                  <span style={$css("position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;border:40px solid rgba(255,255,255,.06)")} />
                  <div style={$css("position:relative;display:flex;align-items:center;gap:14px")}>
                    <span style={$css("width:46px;height:46px;border-radius:14px;background:rgba(255,255,255,.14);display:grid;place-items:center;flex-shrink:0")}>
                      {$i(iconShield)}
                    </span>
                    <span style={$css("display:flex;flex-direction:column;gap:3px")}>
                      <span style={$css("font:600 17px Jost,sans-serif")}>
                        {$i(verifyTitle)}
                      </span>
                      <span style={$css("font-size:14px;color:#b7c7d8")}>
                        {$i(verifyBody)}
                      </span>
                    </span>
                  </div>
                  <div style={$css("position:relative;display:flex;align-items:center;gap:8px")}>
                    {$list(verifySteps).map((vs, $index) => (
                      <Fragment key={$index}>
                        <span style={$css(`display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 11px 0 7px;border-radius:999px;background:${vs?.bg ?? ''};font:600 12.5px Figtree,sans-serif;color:${vs?.color ?? ''};white-space:nowrap`)}>
                          <span style={$css(`width:16px;height:16px;border-radius:50%;background:${vs?.dot ?? ''};display:grid;place-items:center;color:#fff`)}>
                            {$i(iconCheckTiny)}
                          </span>
                          {$i(vs?.label)}
                        </span>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <section aria-label="Business operations" style={$css("display:flex;flex-direction:column;gap:16px")}>
                  <div style={$css("display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h2 style={$css("font-size:21px")}>
                        Business operations
                      </h2>
                    </div>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <span style={$css("font-size:12.5px;color:#6b7f95;white-space:nowrap")}>
                        {"Last updated "}{$i(opUpdated)}
                      </span>
                      <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                        Reporting period
                        <select data-opsel="1" data-val={$val(opPeriodSel?.value)} onChange={opPeriodSel?.onChange} value={$val(opPeriodSel?.value)} aria-label="Reporting period" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                          {$list(opPeriodSel?.opts).map((o, $index) => (
                            <Fragment key={$index}>
                              <option value={$val(o?.v)}>
                                {$i(o?.t)}
                              </option>
                            </Fragment>
                          ))}
                        </select>
                      </label>
                    </div>
                  </div>
                  <div style={$css(`display:grid;grid-template-columns:${opKpiCols ?? ''};gap:14px`)}>
                    {$list(opKpis).map((k, $index) => (
                      <Fragment key={$index}>
                        <button className="pdp5 pdp6" onClick={k?.go} style={$css("appearance:none;cursor:pointer;text-align:left;background:#fff;border:1px solid #e6edf5;border-radius:22px;padding:16px 18px;display:flex;flex-direction:column;gap:8px;min-width:0;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);transition:transform .2s cubic-bezier(.23,1,.32,1)")}>
                          <span style={$css("display:flex;flex-direction:column;gap:3px")}>
                            <span style={$css("font:600 10.5px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8a9bb0")}>
                              {$i(k?.kind)}
                            </span>
                            <span style={$css("font:600 13.5px/1.3 Figtree,sans-serif;color:#516378")}>
                              {$i(k?.label)}
                            </span>
                          </span>
                          <span style={$css(`font:600 ${k?.size ?? ''}/1.05 Jost,sans-serif;color:${k?.valColor ?? ''}`)}>
                            {$i(k?.value)}
                          </span>
                          <span style={$css(`font-size:12.5px;color:${k?.subColor ?? ''}`)}>
                            {$i(k?.sub)}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div style={$css(`display:grid;grid-template-columns:${opSplit ?? ''};gap:16px`)}>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px;min-width:0")}>
                      <div style={$css("display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap")}>
                        <h3 style={$css("font-size:18px;line-height:1.25;white-space:nowrap")}>
                          Monthly inquiries & admissions
                        </h3>
                        <span style={$css("display:flex;gap:14px;font:500 12.5px Figtree,sans-serif;color:#516378")}>
                          <span style={$css("display:inline-flex;align-items:center;gap:6px")}>
                            <span style={$css("width:10px;height:10px;border-radius:3px;background:#9fd2f7")} />
                            Inquiries
                          </span>
                          <span style={$css("display:inline-flex;align-items:center;gap:6px")}>
                            <span style={$css("width:10px;height:10px;border-radius:3px;background:#0a5d96")} />
                            Admissions
                          </span>
                        </span>
                      </div>
                      <div style={$css("display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;align-items:end;height:190px;padding-top:8px")}>
                        {$list(opTrend).map((tr, $index) => (
                          <Fragment key={$index}>
                            <div style={$css("display:flex;flex-direction:column;align-items:center;gap:6px;height:100%;justify-content:flex-end;min-width:0")}>
                              {tr?.has ? (
                                <>
                                  <div style={$css("display:flex;align-items:flex-end;gap:4px;height:150px")}>
                                    <span title={$val(tr?.it)} style={$css(`width:16px;height:${tr?.ih ?? ''};border-radius:5px 5px 2px 2px;background:#9fd2f7`)} />
                                    <span title={$val(tr?.at)} style={$css(`width:16px;height:${tr?.ah ?? ''};border-radius:5px 5px 2px 2px;background:#0a5d96`)} />
                                  </div>
                                </>
                              ) : null}
                              {tr?.none ? (
                                <>
                                  <div style={$css("height:150px;display:flex;align-items:flex-end")}>
                                    <span style={$css("font:600 10.5px Figtree,sans-serif;color:#8a9bb0;text-align:center;line-height:1.3;padding:6px 4px;border:1px dashed #cfdceb;border-radius:8px")}>
                                      No report submitted
                                    </span>
                                  </div>
                                </>
                              ) : null}
                              <span style={$css("font:600 12px Figtree,sans-serif;color:#6b7f95")}>
                                {$i(tr?.m)}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                      <span style={$css("font-size:12px;color:#8a9bb0")}>
                        Organization-wide period totals from monthly business reports.
                      </span>
                    </div>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px;min-width:0")}>
                      <div style={$css("display:flex;justify-content:space-between;align-items:center;gap:10px")}>
                        <h3 style={$css("font-size:18px;line-height:1.25;white-space:nowrap")}>
                          Capacity by facility
                        </h3>
                        <span style={$css("font:600 10.5px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8a9bb0")}>
                          Current snapshot
                        </span>
                      </div>
                      {$list(opCapRows).map((cr, $index) => (
                        <Fragment key={$index}>
                          <div style={$css("display:flex;flex-direction:column;gap:6px")}>
                            <div style={$css("display:flex;justify-content:space-between;gap:10px;font-size:13.5px")}>
                              <span style={$css("font-weight:600;color:#1f3550;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>
                                {$i(cr?.name)}
                              </span>
                              <span style={$css("font:600 13px Jost,sans-serif;white-space:nowrap")}>
                                {$i(cr?.occ)}{" / "}{$i(cr?.cap)}{" · "}
                                <span style={$css(`color:${cr?.availColor ?? ''}`)}>
                                  {$i(cr?.avail)}{" available"}
                                </span>
                              </span>
                            </div>
                            <span style={$css("height:8px;border-radius:8px;background:#eef2f7;overflow:hidden;display:block;min-width:80px")}>
                              <span style={$css(`display:block;height:100%;width:${cr?.pct ?? ''};border-radius:8px;background:${cr?.c ?? ''};transition:width .4s cubic-bezier(.23,1,.32,1)`)} />
                            </span>
                          </div>
                        </Fragment>
                      ))}
                      <button className="pdp7 pdp8" onClick={goFacilities} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                        Manage facilities
                      </button>
                    </div>
                  </div>
                  <div style={$css(`display:grid;grid-template-columns:${twoEven ?? ''};gap:16px`)}>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:10px;min-width:0")}>
                      <div style={$css("display:flex;justify-content:space-between;align-items:center")}>
                        <h3 style={$css("font-size:18px;line-height:1.25")}>
                          Tasks requiring attention
                        </h3>
                        <button onClick={goTasks} style={$css("appearance:none;border:0;background:transparent;cursor:pointer;font:600 13.5px Jost,sans-serif;color:#0890E8")}>
                          All tasks
                        </button>
                      </div>
                      {$list(opAttnTasks).map((at, $index) => (
                        <Fragment key={$index}>
                          <div style={$css("display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;background:#f9fbfd;border:1px solid #edf2f7")}>
                            <span style={$css("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}>
                              <span style={$css("font:600 14px Jost,sans-serif")}>
                                {$i(at?.cat)}
                              </span>
                              <span style={$css("font-size:12.5px;color:#6b7f95")}>
                                {$i(at?.team)}{" · due "}{$i(at?.due)}
                              </span>
                            </span>
                            <span style={$css(`display:inline-flex;align-items:center;gap:6px;font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:${at?.bg ?? ''};color:${at?.color ?? ''};white-space:nowrap`)}>
                              {$i(at?.state)}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                      {opNoAttn ? (
                        <>
                          <div style={$css("padding:36px 20px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center")}>
                            <span style={$css("width:48px;height:48px;border-radius:14px;background:#f3f6fa;color:#8a9bb0;display:grid;place-items:center")}>
                              {$i(iconSearch)}
                            </span>
                            <span style={$css("font:600 16px Jost,sans-serif;color:#10233a")}>
                              Nothing overdue or due this week
                            </span>
                            <span style={$css("font-size:14px;color:#516378;max-width:380px")}>
                              New tasks will appear here as their due dates approach.
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:10px;min-width:0")}>
                      <div style={$css("display:flex;justify-content:space-between;align-items:center")}>
                        <h3 style={$css("font-size:18px;line-height:1.25")}>
                          Partners due for outreach
                        </h3>
                        <button onClick={goPartners} style={$css("appearance:none;border:0;background:transparent;cursor:pointer;font:600 13.5px Jost,sans-serif;color:#0890E8")}>
                          All partners
                        </button>
                      </div>
                      {$list(opDuePartners).map((dp, $index) => (
                        <Fragment key={$index}>
                          <button className="pdp9 pdp6" onClick={dp?.open} style={$css("appearance:none;border:1px solid #edf2f7;cursor:pointer;text-align:left;display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;background:#f9fbfd")}>
                            <span style={$css("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}>
                              <span style={$css("font:600 14px Jost,sans-serif;color:#10233a")}>
                                {$i(dp?.name)}
                              </span>
                              <span style={$css("font-size:12.5px;color:#6b7f95")}>
                                {$i(dp?.type)}{" · "}{$i(dp?.owner)}
                              </span>
                            </span>
                            <span style={$css(`font:600 12.5px Figtree,sans-serif;color:${dp?.color ?? ''};white-space:nowrap`)}>
                              {$i(dp?.when)}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                      {opNoDue ? (
                        <>
                          <div style={$css("padding:36px 20px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center")}>
                            <span style={$css("width:48px;height:48px;border-radius:14px;background:#f3f6fa;color:#8a9bb0;display:grid;place-items:center")}>
                              {$i(iconSearch)}
                            </span>
                            <span style={$css("font:600 16px Jost,sans-serif;color:#10233a")}>
                              No follow-ups due
                            </span>
                            <span style={$css("font-size:14px;color:#516378;max-width:380px")}>
                              Partners with a follow-up date in the next 14 days appear here.
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </div>
                </section>
                <div style={$css(`display:grid;grid-template-columns:${kpiCols ?? ''};gap:14px`)}>
                  {$list(kpis).map((k, $index) => (
                    <Fragment key={$index}>
                      <div className="pdpa" style={$css(`position:relative;overflow:hidden;background:linear-gradient(180deg,${k?.wash ?? ''} 0%,#fff 58%);border:1px solid #e6edf5;border-radius:24px;padding:18px 18px 14px;display:flex;flex-direction:column;gap:10px;min-width:0;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);animation:pdFade .45s cubic-bezier(.23,1,.32,1) both;animation-delay:${k?.delay ?? ''};transition:transform .2s cubic-bezier(.23,1,.32,1),box-shadow .2s ease`)}>
                        <div style={$css("display:flex;align-items:center;justify-content:space-between;gap:8px")}>
                          <span style={$css("display:flex;align-items:center;gap:8px;font:600 13px Figtree,sans-serif;color:#516378")}>
                            <span style={$css(`width:28px;height:28px;border-radius:9px;background:${k?.tint ?? ''};color:${k?.color ?? ''};display:grid;place-items:center`)}>
                              {$i(k?.icon)}
                            </span>
                            {$i(k?.label)}
                          </span>
                          <span style={$css(`font:600 12px Figtree,sans-serif;padding:3px 8px;border-radius:999px;background:${k?.deltaBg ?? ''};color:${k?.deltaColor ?? ''}`)}>
                            {$i(k?.delta)}
                          </span>
                        </div>
                        <span style={$css("font:600 34px/1 Jost,sans-serif;color:#10233a;letter-spacing:-.02em")}>
                          {$i(k?.value)}
                        </span>
                        <svg viewBox="0 0 120 32" preserveAspectRatio="none" style={$css("width:100%;height:32px;display:block")}>
                          <path d={$val(k?.area)} style={$css(`fill:${k?.tint ?? ''}`)} />
                          <path d={$val(k?.line)} style={$css(`fill:none;stroke:${k?.color ?? ''};stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vector-effect:non-scaling-stroke`)} />
                        </svg>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={$css(`display:grid;grid-template-columns:${twoWide ?? ''};gap:16px`)}>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:14px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap")}>
                      <h3 style={$css("font-size:18px")}>
                        Profile views & leads
                      </h3>
                      <div style={$css("display:flex;gap:14px;font:500 12.5px Figtree,sans-serif;color:#516378")}>
                        <span style={$css("display:inline-flex;align-items:center;gap:6px")}>
                          <span style={$css("width:10px;height:3px;border-radius:2px;background:#0890E8")} />
                          Views
                        </span>
                        <span style={$css("display:inline-flex;align-items:center;gap:6px")}>
                          <span style={$css("width:8px;height:8px;border-radius:2px;background:#D82028")} />
                          Leads
                        </span>
                      </div>
                    </div>
                    <div style={$css("position:relative")}>
                      <svg viewBox="0 0 600 200" preserveAspectRatio="none" style={$css("width:100%;height:220px;display:block;overflow:visible")}>
                        {$list(grid).map((g, $index) => (
                          <Fragment key={$index}>
                            <line x1="0" x2="600" y1={$val(g?.y)} y2={$val(g?.y)} style={$css("stroke:#edf2f7;stroke-width:1")} />
                          </Fragment>
                        ))}
                        {$list(bars).map((b, $index) => (
                          <Fragment key={$index}>
                            <rect x={$val(b?.x)} y={$val(b?.y)} width={$val(b?.w)} height={$val(b?.h)} rx="3" style={$css(`fill:${b?.fill ?? ''};transition:fill .15s ease`)} />
                          </Fragment>
                        ))}
                        <path d={$val(chartArea)} style={$css("fill:url(#pdArea)")} />
                        <path d={$val(chartLine)} style={$css("fill:none;stroke:#0890E8;stroke-width:2.5;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:1400;animation:pdDraw 1.2s cubic-bezier(.23,1,.32,1) both;vector-effect:non-scaling-stroke")} />
                        <defs>
                          <linearGradient id="pdArea" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0" style={$css("stop-color:#0890E8;stop-opacity:.22")} />
                            <stop offset="1" style={$css("stop-color:#0890E8;stop-opacity:0")} />
                          </linearGradient>
                        </defs>
                        <line x1={$val(hoverX)} x2={$val(hoverX)} y1="0" y2="200" style={$css(`stroke:#10233a;stroke-width:1;stroke-dasharray:3 3;opacity:${hoverOp ?? ''}`)} />
                        {$list(hits).map((h, $index) => (
                          <Fragment key={$index}>
                            <rect x={$val(h?.x)} y="0" width={$val(h?.w)} height="200" onMouseEnter={h?.enter} style={$css("fill:transparent;cursor:crosshair")} />
                          </Fragment>
                        ))}
                      </svg>
                      <div style={$css(`position:absolute;top:0;left:${tipLeft ?? ''};transform:translateX(-50%);opacity:${hoverOp ?? ''};pointer-events:none;background:#10233a;color:#fff;border-radius:12px;padding:8px 12px;display:flex;flex-direction:column;gap:2px;white-space:nowrap;transition:opacity .15s ease;box-shadow:0 12px 24px -12px rgba(16,35,58,.6)`)}>
                        <span style={$css("font:600 12px Figtree,sans-serif;color:#9fd3f8")}>
                          {$i(tipDate)}
                        </span>
                        <span style={$css("font:600 13.5px Jost,sans-serif")}>
                          {$i(tipViews)}{" views · "}{$i(tipLeads)}{" leads"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:14px;min-width:0")}>
                    <div style={$css("display:flex;justify-content:space-between;align-items:center")}>
                      <h3 style={$css("font-size:18px")}>
                        Hot leads
                      </h3>
                      <button onClick={goLeads} style={$css("appearance:none;border:0;background:transparent;cursor:pointer;font:600 13.5px Jost,sans-serif;color:#0890E8")}>
                        View all
                      </button>
                    </div>
                    {hotEmpty ? (
                      <span style={$css("font-size:14px;color:#6b7f95;padding:6px 2px")}>No open leads right now. New enquiries from your listing appear here.</span>
                    ) : null}
                    {$list(hotLeads).map((l, $index) => (
                      <Fragment key={$index}>
                        <button className="pdp9 pdpb" onClick={l?.open} style={$css("appearance:none;border:0;cursor:pointer;text-align:left;display:flex;align-items:center;gap:12px;padding:10px;border-radius:16px;background:#f9fbfd;transition:background .15s ease,transform .12s ease-out")}>
                          <span style={$css(`width:40px;height:40px;border-radius:12px;background:${l?.avBg ?? ''};color:${l?.avColor ?? ''};display:grid;place-items:center;font:600 14px Jost,sans-serif;flex-shrink:0`)}>
                            {$i(l?.initials)}
                          </span>
                          <span style={$css("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}>
                            <span style={$css("font:600 14.5px Jost,sans-serif;color:#10233a")}>
                              {$i(l?.name)}
                            </span>
                            <span style={$css("font-size:12.5px;color:#6b7f95;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                              {$i(l?.interest)}{" · "}{$i(l?.ago)}
                            </span>
                          </span>
                          <span style={$css(`font:700 13px Jost,sans-serif;padding:4px 9px;border-radius:999px;background:${l?.scoreBg ?? ''};color:${l?.scoreColor ?? ''}`)}>
                            {$i(l?.score)}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${threeCols ?? ''};gap:16px`)}>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px;min-width:0")}>
                    <div style={$css("display:flex;justify-content:space-between;align-items:center")}>
                      <h3 style={$css("font-size:18px")}>
                        Upcoming
                      </h3>
                      <button onClick={goCalendar} style={$css("appearance:none;border:0;background:transparent;cursor:pointer;font:600 13.5px Jost,sans-serif;color:#0890E8")}>
                        Calendar
                      </button>
                    </div>
                    {upcomingEmpty ? (
                      <span style={$css("font-size:14px;color:#6b7f95;padding:6px 2px")}>Nothing booked yet. Book from a lead or add open slots in your calendar.</span>
                    ) : null}
                    {$list(upcoming).map((u, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:flex;gap:12px;align-items:center")}>
                          <span style={$css(`width:48px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;padding:6px 0;border-radius:12px;background:${u?.tint ?? ''};color:${u?.color ?? ''}`)}>
                            <span style={$css("font:600 10.5px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase")}>
                              {$i(u?.dow)}
                            </span>
                            <span style={$css("font:600 18px/1.1 Jost,sans-serif")}>
                              {$i(u?.time)}
                            </span>
                          </span>
                          <span style={$css("display:flex;flex-direction:column;gap:2px;min-width:0")}>
                            <span style={$css("font:600 14.5px Jost,sans-serif")}>
                              {$i(u?.title)}
                            </span>
                            <span style={$css("font-size:12.5px;color:#6b7f95")}>
                              {$i(u?.meta)}
                            </span>
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:14px;min-width:0")}>
                    <h3 style={$css("font-size:18px")}>
                      Where leads come from
                    </h3>
                    {$list(sources).map((s, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:flex;flex-direction:column;gap:6px")}>
                          <div style={$css("display:flex;justify-content:space-between;font-size:13.5px")}>
                            <span style={$css("color:#1f3550;font-weight:500")}>
                              {$i(s?.label)}
                            </span>
                            <span style={$css("font:600 13.5px Jost,sans-serif")}>
                              {$i(s?.pct)}
                            </span>
                          </div>
                          <span style={$css("height:8px;border-radius:8px;background:#eef3f8;overflow:hidden")}>
                            <span style={$css(`display:block;height:100%;width:${s?.pct ?? ''};background:${s?.color ?? ''};border-radius:8px`)} />
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:14px")}>
                      <svg viewBox="0 0 44 44" style={$css("width:64px;height:64px;flex-shrink:0;transform:rotate(-90deg)")}>
                        <circle cx="22" cy="22" r="18" style={$css("fill:none;stroke:#eef3f8;stroke-width:5")} />
                        <circle cx="22" cy="22" r="18" style={$css(`fill:none;stroke:${strengthColor ?? ''};stroke-width:5;stroke-linecap:round;stroke-dasharray:113;stroke-dashoffset:${strengthOffset ?? ''};transition:stroke-dashoffset .6s cubic-bezier(.23,1,.32,1)`)} />
                      </svg>
                      <span style={$css("display:flex;flex-direction:column;gap:2px")}>
                        <span style={$css("font:600 24px/1 Jost,sans-serif")}>
                          {$i(strengthPct)}
                        </span>
                        <span style={$css("font-size:13px;color:#6b7f95")}>
                          Profile strength
                        </span>
                      </span>
                    </div>
                    {$list(todo).map((td, $index) => (
                      <Fragment key={$index}>
                        <button className="pdpc" onClick={td?.go} style={$css("appearance:none;border:0;cursor:pointer;text-align:left;display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;background:#f9fbfd;font:500 13.5px Figtree,sans-serif;color:#1f3550")}>
                          <span style={$css("width:8px;height:8px;border-radius:50%;background:#F5A623;flex-shrink:0")} />
                          <span style={$css("flex:1")}>
                            {$i(td?.label)}
                          </span>
                          <span style={$css("display:flex;color:#0890E8")}>
                            {$i(iconArrowSm)}
                          </span>
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
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px")}>
                    <h1 style={$css(`font-size:${h1Size ?? ''}`)}>
                      Leads
                    </h1>
                    <p style={$css("font-size:15px;color:#516378")}>
                      {$i(leadSummary)}
                    </p>
                  </div>
                  <div style={$css("display:flex;gap:8px;flex-wrap:wrap")}>
                    <div style={$css("display:inline-flex;padding:4px;border-radius:999px;background:#fff;border:1px solid #e6edf5;box-shadow:0 8px 20px -16px rgba(16,35,58,.35)")}>
                      {$list(leadViews).map((lv, $index) => (
                        <Fragment key={$index}>
                          <button onClick={lv?.select} style={$css(`appearance:none;border:0;cursor:pointer;height:34px;padding:0 14px;border-radius:999px;background:${lv?.bg ?? ''};color:${lv?.color ?? ''};font:600 13px Figtree,sans-serif`)}>
                            {$i(lv?.label)}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <button onClick={exportCsv} style={$css("appearance:none;cursor:pointer;height:42px;padding:0 16px;border-radius:999px;border:1px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;display:inline-flex;align-items:center;gap:8px")}>
                      {$i(iconDownload)}Export CSV
                    </button>
                    <button className="pdpd pdp0" onClick={addLead} style={$css("appearance:none;border:0;cursor:pointer;height:42px;padding:0 16px;border-radius:999px;background:#0890E8;color:#fff;font:600 13.5px Jost,sans-serif;display:inline-flex;align-items:center;gap:8px")}>
                      {$i(iconPlus)}Add lead
                    </button>
                  </div>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${kpiCols ?? ''};gap:12px`)}>
                  {$list(crmStats).map((cs, $index) => (
                    <Fragment key={$index}>
                      <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:20px;padding:16px 18px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);display:flex;flex-direction:column;gap:4px")}>
                        <span style={$css("font:600 12px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b7f95")}>
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
                    <div style={$css(`display:grid;grid-template-columns:${boardCols ?? ''};gap:12px;overflow-x:auto;padding-bottom:6px`)}>
                      {$list(board).map((col, $index) => (
                        <Fragment key={$index}>
                          <div onDragOver={col?.over} onDrop={col?.drop} onDragLeave={col?.leave} style={$css(`display:flex;flex-direction:column;gap:10px;padding:12px;border-radius:20px;background:${col?.bg ?? ''};border:1.5px dashed ${col?.border ?? ''};min-height:380px;min-width:220px;transition:background .15s ease,border-color .15s ease;box-shadow:inset 0 1px 0 rgba(255,255,255,.7)`)}>
                            <div style={$css("display:flex;align-items:center;justify-content:space-between;padding:2px 4px")}>
                              <span style={$css("display:inline-flex;align-items:center;gap:8px;font:600 14px Jost,sans-serif")}>
                                <span style={$css(`width:9px;height:9px;border-radius:3px;background:${col?.color ?? ''}`)} />
                                {$i(col?.label)}
                              </span>
                              <span style={$css("font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                                {$i(col?.count)}
                              </span>
                            </div>
                            {$list(col?.cards).map((l, $index) => (
                              <Fragment key={$index}>
                                <div className="pdpe" draggable="true" onDragStart={l?.drag} onClick={l?.open} style={$css("cursor:grab;background:#fff;border:1px solid #e3eaf2;border-radius:16px;padding:12px;display:flex;flex-direction:column;gap:8px;box-shadow:0 6px 14px -12px rgba(16,35,58,.4);transition:transform .12s ease-out,box-shadow .15s ease")}>
                                  <div style={$css("display:flex;align-items:center;gap:10px")}>
                                    <span style={$css(`width:32px;height:32px;border-radius:10px;background:${l?.avBg ?? ''};color:${l?.avColor ?? ''};display:grid;place-items:center;font:600 12.5px Jost,sans-serif;flex-shrink:0`)}>
                                      {$i(l?.initials)}
                                    </span>
                                    <span style={$css("flex:1;min-width:0;display:flex;flex-direction:column")}>
                                      <span style={$css("font:600 14px Jost,sans-serif;color:#10233a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                                        {$i(l?.name)}
                                      </span>
                                      <span style={$css("font-size:12px;color:#6b7f95")}>
                                        {$i(l?.ago)}
                                      </span>
                                    </span>
                                    <span style={$css(`font:700 12px Jost,sans-serif;padding:3px 7px;border-radius:999px;background:${l?.scoreBg ?? ''};color:${l?.scoreColor ?? ''}`)}>
                                      {$i(l?.score)}
                                    </span>
                                  </div>
                                  <span style={$css("font-size:13px;line-height:1.4;color:#3b4d63")}>
                                    {$i(l?.interest)}
                                  </span>
                                  <div style={$css("display:flex;align-items:center;justify-content:space-between;gap:6px")}>
                                    <span style={$css("display:inline-flex;align-items:center;gap:5px;font:500 11.5px Figtree,sans-serif;color:#516378;padding:3px 8px;border-radius:999px;background:#f3f6fa")}>
                                      {$i(l?.srcIcon)}{$i(l?.source)}
                                    </span>
                                    <span style={$css(`display:${l?.overdueDisplay ?? ''};font:600 11.5px Figtree,sans-serif;color:#c0262d`)}>
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
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:24px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow:hidden")}>
                      <div style={$css(`display:grid;grid-template-columns:${tableCols ?? ''};gap:12px;padding:12px 18px;background:#f9fbfd;border-bottom:1px solid #edf2f7;font:600 11.5px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b7f95`)}>
                        <span>
                          Lead
                        </span>
                        <span style={$css(`display:${tableExtra ?? ''}`)}>
                          Interest
                        </span>
                        <span style={$css(`display:${tableExtra ?? ''}`)}>
                          Source
                        </span>
                        <span>
                          Stage
                        </span>
                        <span>
                          Score
                        </span>
                      </div>
                      {$list(leadRows).map((l, $index) => (
                        <Fragment key={$index}>
                          <button className="pdpf" onClick={l?.open} style={$css(`appearance:none;border:0;border-bottom:1px solid #f0f4f8;cursor:pointer;width:100%;text-align:left;display:grid;grid-template-columns:${tableCols ?? ''};gap:12px;align-items:center;padding:12px 18px;background:#fff`)}>
                            <span style={$css("display:flex;align-items:center;gap:10px;min-width:0")}>
                              <span style={$css(`width:34px;height:34px;border-radius:10px;background:${l?.avBg ?? ''};color:${l?.avColor ?? ''};display:grid;place-items:center;font:600 12.5px Jost,sans-serif;flex-shrink:0`)}>
                                {$i(l?.initials)}
                              </span>
                              <span style={$css("display:flex;flex-direction:column;min-width:0")}>
                                <span style={$css("font:600 14px Jost,sans-serif;color:#10233a")}>
                                  {$i(l?.name)}
                                </span>
                                <span style={$css("font-size:12px;color:#6b7f95")}>
                                  {$i(l?.ago)}
                                </span>
                              </span>
                            </span>
                            <span style={$css(`display:${tableExtra ?? ''};font-size:13.5px;color:#3b4d63`)}>
                              {$i(l?.interest)}
                            </span>
                            <span style={$css(`display:${tableExtra ?? ''};font-size:13px;color:#516378`)}>
                              {$i(l?.source)}
                            </span>
                            <span style={$css(`justify-self:start;display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border-radius:999px;background:${l?.stageBg ?? ''};color:${l?.stageColor ?? ''};font:600 12px Figtree,sans-serif`)}>
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
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px")}>
                    <h1 style={$css(`font-size:${h1Size ?? ''}`)}>
                      Calendar
                    </h1>
                    <p style={$css("font-size:15px;color:#516378")}>
                      Assessments, consultations and tours. Click an open slot to add a booking.
                    </p>
                  </div>
                  <div style={$css("display:flex;align-items:center;gap:10px;padding:8px 10px 8px 14px;border-radius:16px;background:#fff;border:1px solid #e3eaf2")}>
                    <span style={$css("display:flex;flex-direction:column;gap:1px")}>
                      <span style={$css("font:600 14px Jost,sans-serif")}>
                        Google Calendar
                      </span>
                      <span style={$css(`font-size:12.5px;color:${gcalSubColor ?? ''}`)}>
                        {$i(gcalSub)}
                      </span>
                    </span>
                    <button onClick={toggleGcal} style={$css(`appearance:none;border:0;cursor:pointer;height:36px;padding:0 14px;border-radius:999px;background:${gcalBtnBg ?? ''};color:${gcalBtnColor ?? ''};font:600 13px Jost,sans-serif;display:inline-flex;align-items:center;gap:8px`)}>
                      <span style={$css(`display:${gcalSpin ?? ''};width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:pdSpin .7s linear infinite`)} />
                      {$i(gcalBtn)}
                    </button>
                  </div>
                </div>
                <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:24px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow:auto")}>
                  <div style={$css("display:grid;grid-template-columns:64px repeat(5,minmax(120px,1fr));min-width:700px")}>
                    <span style={$css("border-bottom:1px solid #edf2f7")} />
                    {$list(calDays).map((cd, $index) => (
                      <Fragment key={$index}>
                        <span style={$css("padding:12px;border-bottom:1px solid #edf2f7;border-left:1px solid #f0f4f8;display:flex;align-items:baseline;gap:6px")}>
                          <span style={$css("font:600 12px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b7f95")}>
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
                        <span style={$css("height:56px;padding:4px 10px 0 0;text-align:right;font:500 12px Figtree,sans-serif;color:#8a9bb0;border-bottom:1px solid #f4f7fa")}>
                          {$i(cr?.label)}
                        </span>
                        {$list(cr?.cells).map((cc, $index) => (
                          <Fragment key={$index}>
                            <div className="pdp10" onClick={cc?.add} style={$css(`position:relative;height:56px;border-left:1px solid #f0f4f8;border-bottom:1px solid #f4f7fa;cursor:${cc?.cursor ?? ''};background:${cc?.bg ?? ''}`)}>
                              {cc?.has ? (
                                <>
                                  <div style={$css(`position:absolute;inset:3px 4px;border-radius:10px;background:${cc?.evBg ?? ''};border-left:0;padding:6px 8px;display:flex;flex-direction:column;gap:1px;overflow:hidden;box-shadow:inset 0 0 0 1px ${cc?.evBorder ?? ''}`)}>
                                    <span style={$css(`font:600 12.5px Jost,sans-serif;color:${cc?.evColor ?? ''};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}>
                                      {$i(cc?.title)}
                                    </span>
                                    <span style={$css(`font-size:11px;color:${cc?.evSub ?? ''};white-space:nowrap;overflow:hidden;text-overflow:ellipsis`)}>
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
                <div style={$css("display:flex;gap:16px;flex-wrap:wrap;font:500 13px Figtree,sans-serif;color:#516378")}>
                  {$list(calLegend).map((lg, $index) => (
                    <Fragment key={$index}>
                      <span style={$css("display:inline-flex;align-items:center;gap:7px")}>
                        <span style={$css(`width:12px;height:12px;border-radius:4px;background:${lg?.bg ?? ''};box-shadow:inset 0 0 0 1px ${lg?.border ?? ''}`)} />
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
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;flex-direction:column;gap:6px")}>
                  <h1 style={$css(`font-size:${h1Size ?? ''}`)}>
                    Analytics
                  </h1>
                  <p style={$css("font-size:15px;color:#516378")}>
                    How families find you, and what makes them reach out.
                  </p>
                </div>
                <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:22px;display:flex;flex-direction:column;gap:16px")}>
                  <h3 style={$css("font-size:18px")}>
                    Conversion funnel · last 30 days
                  </h3>
                  <div style={$css(`display:grid;grid-template-columns:${funnelCols ?? ''};gap:10px;align-items:end`)}>
                    {$list(funnel).map((fn, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:flex;flex-direction:column;gap:8px;min-width:0")}>
                          <div style={$css("height:160px;display:flex;align-items:flex-end")}>
                            <span style={$css(`display:block;width:100%;height:${fn?.h ?? ''};border-radius:14px 14px 6px 6px;background:${fn?.bg ?? ''};transition:height .6s cubic-bezier(.23,1,.32,1)`)} />
                          </div>
                          <span style={$css("font:600 22px/1 Jost,sans-serif")}>
                            {$i(fn?.v)}
                          </span>
                          <span style={$css("font-size:13px;color:#516378")}>
                            {$i(fn?.k)}
                          </span>
                          <span style={$css("font:600 12px Figtree,sans-serif;color:#1f8a52")}>
                            {$i(fn?.rate)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${twoEven ?? ''};gap:16px`)}>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px;min-width:0")}>
                    <h3 style={$css("font-size:18px")}>
                      Top pages sending visitors
                    </h3>
                    {$list(pages).map((pg, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:14px;align-items:center;padding:10px 0;border-bottom:1px solid #f0f4f8")}>
                          <span style={$css("display:flex;flex-direction:column;gap:2px;min-width:0")}>
                            <span style={$css("font:600 14px Jost,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                              {$i(pg?.page)}
                            </span>
                            <span style={$css("font-size:12px;color:#6b7f95")}>
                              {$i(pg?.kind)}
                            </span>
                          </span>
                          <span style={$css("font:600 14px Jost,sans-serif")}>
                            {$i(pg?.views)}
                          </span>
                          <span style={$css(`font:600 12px Figtree,sans-serif;padding:3px 8px;border-radius:999px;background:${pg?.tagBg ?? ''};color:${pg?.tagColor ?? ''}`)}>
                            {$i(pg?.tag)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px;min-width:0")}>
                    <h3 style={$css("font-size:18px")}>
                      What people searched
                    </h3>
                    <div style={$css("display:flex;flex-wrap:wrap;gap:8px")}>
                      {$list(searches).map((sr, $index) => (
                        <Fragment key={$index}>
                          <span style={$css(`display:inline-flex;align-items:center;gap:8px;height:34px;padding:0 12px;border-radius:999px;background:${sr?.bg ?? ''};color:${sr?.color ?? ''};font:500 ${sr?.size ?? ''} Figtree,sans-serif`)}>
                            {$i(sr?.term)}
                            <span style={$css("font:600 11.5px Jost,sans-serif;opacity:.7")}>
                              {$i(sr?.n)}
                            </span>
                          </span>
                        </Fragment>
                      ))}
                    </div>
                    <div style={$css("margin-top:6px;display:flex;gap:12px;padding:14px;border-radius:16px;background:#f3f9fe;border:1px solid #d6eafa")}>
                      <span style={$css("width:34px;height:34px;border-radius:11px;background:#0890E8;color:#fff;display:grid;place-items:center;flex-shrink:0")}>
                        {$i(iconSpark)}
                      </span>
                      <span style={$css("display:flex;flex-direction:column;gap:3px")}>
                        <span style={$css("font:600 14.5px Jost,sans-serif")}>
                          Insight
                        </span>
                        <span style={$css("font-size:13.5px;line-height:1.5;color:#1f3550")}>
                          {$i(insight)}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px")}>
                  <h3 style={$css("font-size:18px")}>
                    When enquiries arrive
                  </h3>
                  <div style={$css("display:grid;grid-template-columns:44px repeat(12,minmax(0,1fr));gap:4px;align-items:center")}>
                    <span />
                    {$list(heatHours).map((hh, $index) => (
                      <Fragment key={$index}>
                        <span style={$css("font:500 11px Figtree,sans-serif;color:#8a9bb0;text-align:center")}>
                          {$i(hh)}
                        </span>
                      </Fragment>
                    ))}
                    {$list(heat).map((hr, $index) => (
                      <Fragment key={$index}>
                        <span style={$css("font:600 12px Figtree,sans-serif;color:#516378")}>
                          {$i(hr?.d)}
                        </span>
                        {$list(hr?.cells).map((hc, $index) => (
                          <Fragment key={$index}>
                            <span title={$val(hc?.t)} style={$css(`height:26px;border-radius:7px;background:${hc?.bg ?? ''}`)} />
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
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px")}>
                    <h1 style={$css(`font-size:${h1Size ?? ''}`)}>
                      Your listing
                    </h1>
                    <p style={$css("font-size:15px;color:#516378")}>
                      {$i(listingNote)}
                    </p>
                  </div>
                  <$A className="pdp7" href={$val(publicHref)} style={$css("height:42px;padding:0 16px;border-radius:999px;border:1px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;display:inline-flex;align-items:center;gap:8px")}>
                    {$i(iconEye)}View public listing
                  </$A>
                  <$A className="pdp7" href={$val(fullEditorHref)} style={$css("height:42px;padding:0 16px;border-radius:999px;border:1px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;display:inline-flex;align-items:center;gap:8px")}>
                    {$i(iconDoc)}All fields
                  </$A>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${statusCols ?? ''};gap:12px`)}>
                  {$list(statusOpts).map((so, $index) => (
                    <Fragment key={$index}>
                      <button onClick={so?.select} style={$css(`appearance:none;cursor:pointer;text-align:left;display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:18px;border:1.5px solid ${so?.border ?? ''};background:${so?.bg ?? ''};transition:border-color .15s ease,background .15s ease`)}>
                        <span style={$css(`width:12px;height:12px;border-radius:50%;background:${so?.dot ?? ''};animation:${so?.anim ?? ''};flex-shrink:0`)} />
                        <span style={$css("display:flex;flex-direction:column;gap:2px")}>
                          <span style={$css("font:600 15px Jost,sans-serif;color:#10233a")}>
                            {$i(so?.label)}
                          </span>
                          <span style={$css("font-size:12.5px;color:#516378")}>
                            {$i(so?.body)}
                          </span>
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div style={$css("display:flex;flex-direction:column;gap:10px")}>
                  {$list(sections).map((sec, $index) => (
                    <Fragment key={$index}>
                      <div style={$css(`background:#fff;border:1px solid ${sec?.border ?? ''};border-radius:20px;overflow:hidden;transition:border-color .15s ease`)}>
                        <button onClick={sec?.toggle} style={$css("appearance:none;border:0;cursor:pointer;width:100%;display:flex;align-items:center;gap:14px;padding:16px 18px;background:#fff;text-align:left")}>
                          <span style={$css("width:36px;height:36px;border-radius:11px;background:#eaf5fd;color:#0890E8;display:grid;place-items:center;flex-shrink:0")}>
                            {$i(sec?.icon)}
                          </span>
                          <span style={$css("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}>
                            <span style={$css("font:600 16px Jost,sans-serif;color:#10233a")}>
                              {$i(sec?.title)}
                            </span>
                            <span style={$css("font-size:13px;color:#6b7f95;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                              {$i(sec?.summary)}
                            </span>
                          </span>
                          <span style={$css(`font:600 12px Figtree,sans-serif;padding:4px 9px;border-radius:999px;background:${sec?.tagBg ?? ''};color:${sec?.tagColor ?? ''}`)}>
                            {$i(sec?.tag)}
                          </span>
                          <span style={$css(`width:8px;height:8px;border-right:2px solid #6b7f95;border-bottom:2px solid #6b7f95;transform:${sec?.chev ?? ''};transition:transform .2s ease;margin:0 4px`)} />
                        </button>
                        {sec?.open ? (
                          <>
                            <div style={$css("padding:4px 18px 18px;display:flex;flex-direction:column;gap:14px;animation:pdFade .2s ease-out")}>
                              {$list(sec?.fields).map((f, $index) => (
                                <Fragment key={$index}>
                                  <label style={$css("display:flex;flex-direction:column;gap:7px")}>
                                    <span style={$css("font:600 13px Figtree,sans-serif;color:#1f3550")}>
                                      {$i(f?.label)}
                                    </span>
                                    {f?.isArea ? (
                                      <>
                                        <textarea className="pdp11" value={$val(f?.value)} onChange={f?.onChange} rows="5" style={$css("padding:12px 14px;border-radius:14px;border:1.5px solid #dbe6f0;font:500 15px/1.6 Figtree,sans-serif;color:#10233a;outline:none;resize:vertical")} />
                                      </>
                                    ) : null}
                                    {f?.isInput ? (
                                      <>
                                        <input className="pdp11" value={$val(f?.value)} onChange={f?.onChange} style={$css("height:48px;padding:0 14px;border-radius:14px;border:1.5px solid #dbe6f0;font:500 15px Figtree,sans-serif;color:#10233a;outline:none")} />
                                      </>
                                    ) : null}
                                  </label>
                                </Fragment>
                              ))}
                              {sec?.hasChips ? (
                                <>
                                  <div style={$css("display:flex;flex-wrap:wrap;gap:8px")}>
                                    {$list(sec?.chips).map((c, $index) => (
                                      <Fragment key={$index}>
                                        <button onClick={c?.toggle} style={$css(`appearance:none;cursor:pointer;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid ${c?.border ?? ''};background:${c?.bg ?? ''};color:${c?.color ?? ''};font:500 13.5px Figtree,sans-serif`)}>
                                          {$i(c?.label)}
                                        </button>
                                      </Fragment>
                                    ))}
                                  </div>
                                </>
                              ) : null}
                              {sec?.hasPhotos ? (
                                <>
                                  <div style={$css(`display:grid;grid-template-columns:${photoCols ?? ''};gap:8px`)}>
                                    {$list(sec?.photos).map((ph, $index) => (
                                      <Fragment key={$index}>
                                        <span style={$css(`aspect-ratio:4/3;border-radius:12px;background:${ph?.bg ?? ''};background-size:cover;background-position:center;border:1.5px ${ph?.bs ?? ''} #cfdceb;display:grid;place-items:center;font:600 12px Jost,sans-serif;color:#0890E8`)}>
                                          {$i(ph?.label)}
                                        </span>
                                      </Fragment>
                                    ))}
                                  </div>
                                </>
                              ) : null}
                              <div style={$css("display:flex;justify-content:flex-end;gap:8px")}>
                                <button onClick={sec?.toggle} style={$css("appearance:none;cursor:pointer;height:40px;padding:0 16px;border-radius:999px;border:1px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif")}>
                                  Close
                                </button>
                                <button className="pdpd pdp0" onClick={sec?.save} style={$css("appearance:none;border:0;cursor:pointer;height:40px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 13.5px Jost,sans-serif")}>
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
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;flex-direction:column;gap:6px")}>
                  <h1 style={$css(`font-size:${h1Size ?? ''}`)}>
                    Billing
                  </h1>
                  <p style={$css("font-size:15px;color:#516378")}>
                    Manage your subscription, payment method and invoices.
                  </p>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${twoWide ?? ''};gap:16px`)}>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:22px;display:flex;flex-direction:column;gap:16px")}>
                    <div style={$css("display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap")}>
                      <div style={$css("display:flex;flex-direction:column;gap:6px")}>
                        <span style={$css("font:600 12px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b7f95")}>
                          Current plan
                        </span>
                        <span style={$css("font:600 26px Jost,sans-serif")}>
                          {$i(planLine)}
                        </span>
                        <span style={$css("font-size:14px;color:#516378")}>
                          {"Renews "}{$i(renewDate)}{" · "}{$i(cardLabel)}
                        </span>
                      </div>
                      <span style={$css("height:28px;padding:0 11px;border-radius:999px;background:#e6f4ec;color:#1f8a52;font:600 12.5px Figtree,sans-serif;display:inline-flex;align-items:center")}>
                        {$i(planStatus)}
                      </span>
                    </div>
                    <div style={$css(`display:grid;grid-template-columns:${upgradeCols ?? ''};gap:10px`)}>
                      {$list(upgrades).map((up, $index) => (
                        <Fragment key={$index}>
                          <div style={$css(`display:flex;flex-direction:column;gap:10px;padding:16px;border-radius:18px;border:1.5px solid ${up?.border ?? ''};background:${up?.bg ?? ''}`)}>
                            <span style={$css("display:flex;justify-content:space-between;align-items:baseline;gap:6px")}>
                              <span style={$css("font:600 16px Jost,sans-serif")}>
                                {$i(up?.name)}
                              </span>
                              <span style={$css("font:600 16px Jost,sans-serif")}>
                                {$i(up?.price)}
                              </span>
                            </span>
                            <ul style={$css("display:flex;flex-direction:column;gap:5px")}>
                              {$list(up?.features).map((uf, $index) => (
                                <Fragment key={$index}>
                                  <li style={$css("display:flex;gap:7px;font-size:13px;color:#3b4d63")}>
                                    <span style={$css("display:flex;color:#0890E8;margin-top:2px")}>
                                      {$i(iconCheckTiny2)}
                                    </span>
                                    {$i(uf)}
                                  </li>
                                </Fragment>
                              ))}
                            </ul>
                            <button onClick={up?.pick} style={$css(`appearance:none;border:0;cursor:pointer;margin-top:auto;height:38px;border-radius:999px;background:${up?.btnBg ?? ''};color:${up?.btnColor ?? ''};font:600 13.5px Jost,sans-serif`)}>
                              {$i(up?.btn)}
                            </button>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:22px;display:flex;flex-direction:column;gap:12px")}>
                    <h3 style={$css("font-size:18px")}>
                      Invoices
                    </h3>
                    {$list(invoices).map((iv, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f0f4f8")}>
                          <span style={$css("width:34px;height:34px;border-radius:10px;background:#f3f6fa;color:#516378;display:grid;place-items:center")}>
                            {$i(iconDoc)}
                          </span>
                          <span style={$css("flex:1;display:flex;flex-direction:column")}>
                            <span style={$css("font:600 14px Jost,sans-serif")}>
                              {$i(iv?.date)}
                            </span>
                            <span style={$css("font-size:12px;color:#6b7f95")}>
                              {$i(iv?.desc)}
                            </span>
                          </span>
                          <span style={$css("font:600 14px Jost,sans-serif")}>
                            {$i(iv?.amt)}
                          </span>
                          <button onClick={iv?.dl} aria-label="Download invoice" style={$css("appearance:none;border:0;background:transparent;cursor:pointer;color:#0890E8;display:flex")}>
                            {$i(iconDownload)}
                          </button>
                        </div>
                      </Fragment>
                    ))}
                    <button onClick={cancelSub} style={$css("appearance:none;border:0;background:transparent;cursor:pointer;align-self:flex-start;margin-top:6px;font:600 13px Figtree,sans-serif;color:#6b7f95")}>
                      Cancel subscription
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {thOn ? (
            <>
              <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap;padding:10px 14px;border-radius:16px;background:#fff;border:1px solid #e6edf5")}>
                <span style={$css("font:600 13px Figtree,sans-serif;color:#516378")}>
                  Viewing as
                </span>
                <div style={$css("display:inline-flex;padding:4px;border-radius:999px;background:#f3f6fa;flex-wrap:wrap")}>
                  {$list(thRoles).map((r, $index) => (
                    <Fragment key={$index}>
                      <button className="pdp6" onClick={r?.go} style={$css(`appearance:none;border:0;cursor:pointer;height:32px;padding:0 12px;border-radius:999px;background:${r?.bg ?? ''};color:${r?.color ?? ''};box-shadow:${r?.shadow ?? ''};font:600 12.5px Figtree,sans-serif;white-space:nowrap`)}>
                        {$i(r?.t)}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <span style={$css("font-size:12.5px;color:#6b7f95")}>
                  {$i(thRoleNote)}
                </span>
              </div>
            </>
          ) : null}
          {thIsOverview ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:20px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        {"Good "}{$i(dayPart)}{", "}{$i(thFirst)}
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      {$i(thToday)}{" · clinic time "}{$i(thTz)}
                    </p>
                  </div>
                </div>
                <div style={$css("display:flex;gap:8px;flex-wrap:wrap")}>
                  {$list(thQuick).map((q, $index) => (
                    <Fragment key={$index}>
                      <button className="pdp7 pdp6" onClick={q?.go} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                        {$i(iconPlus)}{$i(q?.t)}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <span style={$css("font:600 12px Figtree,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#0890E8")}>
                  Today & this week
                </span>
                <div style={$css(`display:grid;grid-template-columns:${thCols3 ?? ''};gap:14px`)}>
                  {$list(thKpis).map((k, $index) => (
                    <Fragment key={$index}>
                      <button className="pdp6" onClick={k?.go} style={$css("appearance:none;cursor:pointer;text-align:left;background:#fff;border:1px solid #e6edf5;border-radius:22px;padding:16px 18px;display:flex;flex-direction:column;gap:6px;min-width:0;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35)")}>
                        <span style={$css("font:600 10.5px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8a9bb0")}>
                          {$i(k?.period)}
                        </span>
                        <span style={$css("font:600 13.5px Figtree,sans-serif;color:#516378")}>
                          {$i(k?.l)}
                        </span>
                        <span style={$css(`font:600 ${k?.size ?? ''}/1.05 Jost,sans-serif;color:${k?.c ?? ''}`)}>
                          {$i(k?.v)}
                        </span>
                        <span style={$css("font-size:12.5px;color:#6b7f95")}>
                          {$i(k?.s)}
                        </span>
                      </button>
                    </Fragment>
                  ))}
                </div>
                <div style={$css(`display:grid;grid-template-columns:${thSplit ?? ''};gap:16px`)}>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:10px;min-width:0")}>
                    <div style={$css("display:flex;justify-content:space-between;align-items:center")}>
                      <h3 style={$css("font-size:18px")}>
                        Today's schedule
                      </h3>
                      <button onClick={thGoCal} style={$css("appearance:none;border:0;background:transparent;cursor:pointer;font:600 13.5px Jost,sans-serif;color:#0890E8")}>
                        Open calendar
                      </button>
                    </div>
                    {$list(thTodayList).map((a, $index) => (
                      <Fragment key={$index}>
                        <button className="pdp9 pdp6" onClick={a?.open} style={$css("appearance:none;border:1px solid #edf2f7;cursor:pointer;text-align:left;display:grid;grid-template-columns:70px minmax(0,1fr) auto;gap:12px;align-items:center;padding:10px 12px;border-radius:14px;background:#f9fbfd")}>
                          <span style={$css("font:600 14px Jost,sans-serif;color:#10233a")}>
                            {$i(a?.time)}
                          </span>
                          <span style={$css("display:flex;flex-direction:column;gap:2px;min-width:0")}>
                            <span style={$css("font:600 14px Jost,sans-serif;color:#10233a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                              {$i(a?.who)}
                            </span>
                            <span style={$css("font-size:12.5px;color:#6b7f95")}>
                              {$i(a?.meta)}
                            </span>
                          </span>
                          <span style={$css(`display:inline-flex;align-items:center;font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:${a?.stBg ?? ''};color:${a?.stColor ?? ''};white-space:nowrap`)}>
                            {$i(a?.status)}
                          </span>
                        </button>
                      </Fragment>
                    ))}
                    {thTodayEmpty ? (
                      <>
                        <div style={$css("padding:30px 18px;text-align:center;display:flex;flex-direction:column;gap:6px;align-items:center")}>
                          <span style={$css("font:600 15px Jost,sans-serif")}>
                            No appointments today
                          </span>
                          <span style={$css("font-size:13.5px;color:#516378;max-width:360px")}>
                            Open slots this week appear under availability.
                          </span>
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:10px;min-width:0")}>
                    <div style={$css("display:flex;justify-content:space-between;align-items:center")}>
                      <h3 style={$css("font-size:18px")}>
                        Availability this week
                      </h3>
                      <span style={$css("font:600 10.5px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8a9bb0")}>
                        This week
                      </span>
                    </div>
                    {$list(thWeekAvail).map((d, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:grid;grid-template-columns:44px minmax(0,1fr) 110px;gap:10px;align-items:center;font-size:13px")}>
                          <span style={$css("font-weight:600;color:#1f3550")}>
                            {$i(d?.day)}
                          </span>
                          <span style={$css("height:10px;border-radius:6px;background:#e6f4ec;overflow:hidden;display:block")}>
                            <span style={$css(`display:block;height:100%;width:${d?.pct ?? ''};background:#0890E8;border-radius:6px`)} />
                          </span>
                          <span style={$css("color:#516378;text-align:right;white-space:nowrap")}>
                            {$i(d?.label)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    <span style={$css("font-size:12px;color:#8a9bb0")}>
                      Blue = booked hours · green = open hours
                    </span>
                  </div>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${twoEven ?? ''};gap:16px`)}>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:10px;min-width:0")}>
                    <div style={$css("display:flex;justify-content:space-between;align-items:center")}>
                      <h3 style={$css("font-size:18px")}>
                        Waitlist follow-ups
                      </h3>
                      <button onClick={thGoWait} style={$css("appearance:none;border:0;background:transparent;cursor:pointer;font:600 13.5px Jost,sans-serif;color:#0890E8")}>
                        Waitlist
                      </button>
                    </div>
                    {$list(thWaitDue).map((w, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;background:#f9fbfd;border:1px solid #edf2f7")}>
                          <span style={$css("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}>
                            <span style={$css("font:600 14px Jost,sans-serif")}>
                              {$i(w?.who)}
                            </span>
                            <span style={$css("font-size:12.5px;color:#6b7f95")}>
                              {$i(w?.pref)}
                            </span>
                          </span>
                          <span style={$css(`display:inline-flex;align-items:center;font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:${w?.stBg ?? ''};color:${w?.stColor ?? ''};white-space:nowrap`)}>
                            {$i(w?.status)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    {thWaitDueEmpty ? (
                      <>
                        <div style={$css("padding:30px 18px;text-align:center;display:flex;flex-direction:column;gap:6px;align-items:center")}>
                          <span style={$css("font:600 15px Jost,sans-serif")}>
                            No follow-ups due
                          </span>
                          <span style={$css("font-size:13.5px;color:#516378;max-width:360px")}>
                            Waitlist follow-ups due in the next 7 days appear here.
                          </span>
                        </div>
                      </>
                    ) : null}
                  </div>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:10px;min-width:0")}>
                    <div style={$css("display:flex;justify-content:space-between;align-items:center")}>
                      <h3 style={$css("font-size:18px")}>
                        Outstanding payments
                      </h3>
                      <button onClick={thGoBill} style={$css(`appearance:none;border:0;background:transparent;cursor:pointer;font:600 13.5px Jost,sans-serif;color:#0890E8;display:${thFinDisplay ?? ''}`)}>
                        Billing
                      </button>
                    </div>
                    {thFin ? (
                      <>
                        {$list(thOwing).map((i, $index) => (
                          <Fragment key={$index}>
                            <div style={$css("display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:14px;background:#f9fbfd;border:1px solid #edf2f7")}>
                              <span style={$css("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}>
                                <span style={$css("font:600 14px Jost,sans-serif")}>
                                  {$i(i?.who)}
                                </span>
                                <span style={$css("font-size:12.5px;color:#6b7f95")}>
                                  {$i(i?.no)}{" · issued "}{$i(i?.date)}
                                </span>
                              </span>
                              <span style={$css(`font:600 14px Jost,sans-serif;color:${i?.c ?? ''}`)}>
                                {$i(i?.bal)}
                              </span>
                            </div>
                          </Fragment>
                        ))}
                      </>
                    ) : null}
                    {thNoFin ? (
                      <>
                        <div style={$css("padding:16px;border-radius:14px;background:#f7fafd;border:1px dashed #cfdceb;font-size:13.5px;color:#516378")}>
                          Financial details are restricted for this role.
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                <span style={$css("font:600 12px Figtree,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#0890E8;margin-top:6px")}>
                  Monthly business results
                </span>
                <div style={$css(`display:grid;grid-template-columns:${thSplit ?? ''};gap:16px`)}>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px;min-width:0")}>
                    <div style={$css("display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h3 style={$css("font-size:18px")}>
                        Appointment activity · last 6 months
                      </h3>
                      <span style={$css("display:flex;gap:12px;font:500 12px Figtree,sans-serif;color:#516378")}>
                        <span style={$css("display:inline-flex;align-items:center;gap:5px")}>
                          <span style={$css("width:10px;height:10px;border-radius:3px;background:#0890E8")} />
                          Completed
                        </span>
                        <span style={$css("display:inline-flex;align-items:center;gap:5px")}>
                          <span style={$css("width:10px;height:10px;border-radius:3px;background:#e09b1a")} />
                          Cancelled
                        </span>
                        <span style={$css("display:inline-flex;align-items:center;gap:5px")}>
                          <span style={$css("width:10px;height:10px;border-radius:3px;background:#c0262d")} />
                          No-show
                        </span>
                      </span>
                    </div>
                    <div style={$css("display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:10px;align-items:end;height:170px")}>
                      {$list(thTrend).map((t, $index) => (
                        <Fragment key={$index}>
                          <div style={$css("display:flex;flex-direction:column;align-items:center;gap:6px;justify-content:flex-end;height:100%")}>
                            <div style={$css("display:flex;flex-direction:column-reverse;width:28px;height:130px;justify-content:flex-start")}>
                              <span title={$val(t?.ct)} style={$css(`height:${t?.ch ?? ''};background:#0890E8;border-radius:0 0 4px 4px`)} />
                              <span style={$css(`height:${t?.xh ?? ''};background:#e09b1a`)} />
                              <span style={$css(`height:${t?.nh ?? ''};background:#c0262d;border-radius:4px 4px 0 0`)} />
                            </div>
                            <span style={$css("font:600 12px Figtree,sans-serif;color:#6b7f95")}>
                              {$i(t?.m)}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:10px;min-width:0")}>
                    <h3 style={$css("font-size:18px")}>
                      Upcoming admin deadlines
                    </h3>
                    {$list(thDeadlines).map((d, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f0f4f8")}>
                          <span style={$css("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}>
                            <span style={$css("font:600 14px Jost,sans-serif")}>
                              {$i(d?.cat)}
                            </span>
                            <span style={$css("font-size:12.5px;color:#6b7f95")}>
                              {$i(d?.sub)}
                            </span>
                          </span>
                          <span style={$css(`display:inline-flex;align-items:center;font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:${d?.bg ?? ''};color:${d?.color ?? ''};white-space:nowrap`)}>
                            {$i(d?.when)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    {thDeadEmpty ? (
                      <>
                        <div style={$css("padding:30px 18px;text-align:center;display:flex;flex-direction:column;gap:6px;align-items:center")}>
                          <span style={$css("font:600 15px Jost,sans-serif")}>
                            Nothing due
                          </span>
                          <span style={$css("font-size:13.5px;color:#516378;max-width:360px")}>
                            Tasks due in the next 14 days appear here.
                          </span>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {thIsClients ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        Clients
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      Administrative directory: contact, scheduling and billing status only.
                    </p>
                  </div>
                  <button className="pdpd pdp0 pdp6" onClick={thAddClient} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap")}>
                    {$i(iconPlus)}Add client
                  </button>
                </div>
                {thDupOn ? (
                  <>
                    <div role="status" style={$css("display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:12px 16px;border-radius:16px;background:#fdf3e1;border:1px solid #f3dcae;font-size:13.5px;color:#7a4b04")}>
                      <strong style={$css("font:600 14px Jost,sans-serif")}>
                        Possible duplicate:
                      </strong>
                      <span style={$css("flex:1;min-width:200px")}>
                        {$i(thDupText)}
                      </span>
                      <button className="pdp7 pdp6" onClick={thDupKeep} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap;height:34px")}>
                        Not a duplicate
                      </button>
                      <button className="pdp7 pdp6" onClick={thDupReview} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap;height:34px")}>
                        Review records
                      </button>
                    </div>
                  </>
                ) : null}
                <div style={$css("display:flex;gap:10px;flex-wrap:wrap;align-items:center")}>
                  <div style={$css("display:flex;align-items:center;gap:8px;height:42px;padding:0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;flex:1 1 220px;max-width:340px")}>
                    <span style={$css("display:flex;color:#6b7f95")}>
                      {$i(iconSearch)}
                    </span>
                    <input value={$val(thCliQ)} onChange={onThCliQ} placeholder="Search name, email or phone" aria-label="Search name, email or phone" style={$css("flex:1;min-width:0;border:0;outline:none;background:transparent;font:500 14px Figtree,sans-serif;color:#10233a")} />
                  </div>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Status
                    <select data-opsel="1" data-val={$val(thCliStatus?.value)} value={$val(thCliStatus?.value)} onChange={thCliStatus?.onChange} aria-label="Status" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(thCliStatus?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Sort
                    <select data-opsel="1" data-val={$val(thCliSort?.value)} value={$val(thCliSort?.value)} onChange={thCliSort?.onChange} aria-label="Sort" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(thCliSort?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                </div>
                <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow:hidden")}>
                  <div style={$css("overflow-x:auto")}>
                    <table style={$css("min-width:820px")}>
                      <thead>
                        <tr>
                          {$list(thCliCols).map((c, $index) => (
                            <Fragment key={$index}>
                              <th style={$css("padding:11px 16px;font:600 11.5px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b7f95;background:#f9fbfd;border-bottom:1px solid #edf2f7;white-space:nowrap;text-align:left")}>
                                {$i(c)}
                              </th>
                            </Fragment>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {$list(thCliRows).map((c, $index) => (
                          <Fragment key={$index}>
                            <tr className="pdp12" onClick={c?.open} style={$css("cursor:pointer")}>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;")}>
                                <span style={$css("display:flex;flex-direction:column;gap:2px")}>
                                  <span style={$css("font:600 14.5px Jost,sans-serif;color:#10233a;white-space:nowrap")}>
                                    {$i(c?.name)}
                                  </span>
                                  <span style={$css("font-size:12.5px;color:#6b7f95")}>
                                    {$i(c?.pref)}
                                  </span>
                                </span>
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap")}>
                                {$i(c?.contact)}
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;")}>
                                <span style={$css(`display:inline-flex;align-items:center;font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:${c?.stBg ?? ''};color:${c?.stColor ?? ''};white-space:nowrap`)}>
                                  {$i(c?.status)}
                                </span>
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap")}>
                                {$i(c?.next)}
                              </td>
                              <td style={$css(`padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap;font-weight:600;color:${c?.balColor ?? ''}`)}>
                                {$i(c?.bal)}
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;text-align:right")}>
                                <span style={$css("font:600 13px Jost,sans-serif;color:#0890E8")}>
                                  Open
                                </span>
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {thCliEmpty ? (
                    <>
                      <div style={$css("padding:30px 18px;text-align:center;display:flex;flex-direction:column;gap:6px;align-items:center")}>
                        <span style={$css("font:600 15px Jost,sans-serif")}>
                          No clients match
                        </span>
                        <span style={$css("font-size:13.5px;color:#516378;max-width:360px")}>
                          Try a different search or status.
                        </span>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
          {thIsClient ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <button className="pdp7 pdp6" onClick={thGoClients} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap;align-self:flex-start")}>
                  ← All clients
                </button>
                <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;align-items:center;gap:16px;flex-wrap:wrap")}>
                  <span style={$css("width:56px;height:56px;border-radius:18px;background:#eaf5fd;color:#0890E8;display:grid;place-items:center;font:600 18px Jost,sans-serif")}>
                    {$i(thCp?.initials)}
                  </span>
                  <span style={$css("flex:1;min-width:200px;display:flex;flex-direction:column;gap:3px")}>
                    <span style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <span style={$css("font:600 22px Jost,sans-serif")}>
                        {$i(thCp?.name)}
                      </span>
                      <span style={$css(`display:inline-flex;align-items:center;font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:${thCp?.stBg ?? ''};color:${thCp?.stColor ?? ''};white-space:nowrap`)}>
                        {$i(thCp?.status)}
                      </span>
                    </span>
                    <span style={$css("font-size:13.5px;color:#6b7f95")}>
                      {$i(thCp?.sub)}
                    </span>
                  </span>
                  <div style={$css("display:flex;gap:8px;flex-wrap:wrap")}>
                    <button className="pdpd pdp0 pdp6" onClick={thCpBook} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap")}>
                      Book appointment
                    </button>
                    <button className="pdp7 pdp6" onClick={thCpEdit} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                      Edit details
                    </button>
                  </div>
                </div>
                <div style={$css("display:flex;gap:4px;overflow-x:auto;padding:5px;border-radius:16px;background:#fff;border:1px solid #e6edf5;align-self:flex-start;max-width:100%")}>
                  {$list(thCpTabs).map((t, $index) => (
                    <Fragment key={$index}>
                      <button className="pdp6" onClick={t?.go} style={$css(`appearance:none;border:0;cursor:pointer;height:36px;padding:0 14px;border-radius:12px;background:${t?.bg ?? ''};color:${t?.color ?? ''};font:600 13.5px Figtree,sans-serif;white-space:nowrap`)}>
                        {$i(t?.t)}
                      </button>
                    </Fragment>
                  ))}
                </div>
                {thCpFactsOn ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:8px 20px")}>
                      {$list(thCpFacts).map((f, $index) => (
                        <Fragment key={$index}>
                          <div style={$css("display:flex;justify-content:space-between;gap:14px;padding:12px 0;border-bottom:1px solid #f0f4f8;font-size:14px;flex-wrap:wrap")}>
                            <span style={$css("color:#6b7f95")}>
                              {$i(f?.k)}
                            </span>
                            <span style={$css(`font-weight:600;color:${f?.c ?? ''};text-align:right`)}>
                              {$i(f?.v)}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {thCpListOn ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow:hidden")}>
                      <div style={$css("overflow-x:auto")}>
                        <table style={$css("min-width:640px")}>
                          <thead>
                            <tr>
                              {$list(thCpCols).map((c, $index) => (
                                <Fragment key={$index}>
                                  <th style={$css("padding:11px 16px;font:600 11.5px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b7f95;background:#f9fbfd;border-bottom:1px solid #edf2f7;white-space:nowrap;text-align:left")}>
                                    {$i(c)}
                                  </th>
                                </Fragment>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {$list(thCpRows).map((r, $index) => (
                              <Fragment key={$index}>
                                <tr>
                                  {$list(r?.cells).map((x, $index) => (
                                    <Fragment key={$index}>
                                      <td style={$css(`padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap;color:${x?.c ?? ''};font-weight:${x?.w ?? ''}`)}>
                                        {$i(x?.v)}
                                      </td>
                                    </Fragment>
                                  ))}
                                </tr>
                              </Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {thCpEmpty ? (
                        <>
                          <div style={$css("padding:30px 18px;text-align:center;display:flex;flex-direction:column;gap:6px;align-items:center")}>
                            <span style={$css("font:600 15px Jost,sans-serif")}>
                              Nothing here yet
                            </span>
                            <span style={$css("font-size:13.5px;color:#516378;max-width:360px")}>
                              Records appear here as they are created.
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </>
                ) : null}
                <span style={$css("font-size:12.5px;color:#8a9bb0")}>
                  No clinical notes, documents or reasons for care are stored here. To correct client information, use Edit details. Changes are logged.
                </span>
              </div>
            </>
          ) : null}
          {thIsCal ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:16px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        Calendar
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      {"Clinic time "}{$i(thTz)}. Online clients see times in their own timezone in reminders.
                    </p>
                  </div>
                  <button className="pdpd pdp0 pdp6" onClick={thBook} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap")}>
                    {$i(iconPlus)}Book appointment
                  </button>
                </div>
                <div style={$css("display:flex;gap:10px;flex-wrap:wrap;align-items:center")}>
                  <div style={$css("display:inline-flex;padding:4px;border-radius:999px;background:#fff;border:1px solid #e6edf5")}>
                    {$list(thCalModes).map((m, $index) => (
                      <Fragment key={$index}>
                        <button className="pdp6" onClick={m?.go} style={$css(`appearance:none;border:0;cursor:pointer;height:34px;padding:0 14px;border-radius:999px;background:${m?.bg ?? ''};color:${m?.color ?? ''};font:600 13px Figtree,sans-serif`)}>
                          {$i(m?.t)}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <span style={$css("display:inline-flex;gap:6px")}>
                    <button className="pdp7 pdp6" onClick={thCalPrev} aria-label="Previous" style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap;width:38px;padding:0;justify-content:center")}>
                      ‹
                    </button>
                    <button className="pdp7 pdp6" onClick={thCalToday} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                      Today
                    </button>
                    <button className="pdp7 pdp6" onClick={thCalNext} aria-label="Next" style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap;width:38px;padding:0;justify-content:center")}>
                      ›
                    </button>
                  </span>
                  <span style={$css("font:600 16px Jost,sans-serif")}>
                    {$i(thCalLabel)}
                  </span>
                  <span style={$css("flex:1")} />
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Format
                    <select data-opsel="1" data-val={$val(thCalFmt?.value)} value={$val(thCalFmt?.value)} onChange={thCalFmt?.onChange} aria-label="Format" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(thCalFmt?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Room
                    <select data-opsel="1" data-val={$val(thCalRoom?.value)} value={$val(thCalRoom?.value)} onChange={thCalRoom?.onChange} aria-label="Room" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(thCalRoom?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                </div>
                {thCalGridOn ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow-x:auto")}>
                      <div style={$css(`display:grid;grid-template-columns:56px repeat(${thCalN ?? ''},minmax(140px,1fr));min-width:${thCalMinW ?? ''}`)}>
                        <span />
                        {$list(thCalDays).map((d, $index) => (
                          <Fragment key={$index}>
                            <span style={$css(`padding:12px 10px;border-bottom:1px solid #edf2f7;font:600 13px Figtree,sans-serif;color:${d?.color ?? ''};background:${d?.bg ?? ''}`)}>
                              {$i(d?.t)}
                            </span>
                          </Fragment>
                        ))}
                        <div style={$css("display:flex;flex-direction:column")}>
                          {$list(thHours).map((h, $index) => (
                            <Fragment key={$index}>
                              <span style={$css("height:56px;padding:4px 8px;font:500 11px Figtree,sans-serif;color:#8a9bb0;border-bottom:1px solid #f3f6fa")}>
                                {$i(h)}
                              </span>
                            </Fragment>
                          ))}
                        </div>
                        {$list(thCalDays).map((d, $index) => (
                          <Fragment key={$index}>
                            <div style={$css(`position:relative;height:${thCalH ?? ''};border-left:1px solid #f0f4f8;background:repeating-linear-gradient(180deg,#fff 0 55px,#f3f6fa 55px 56px)`)}>
                              {$list(d?.blocks).map((b, $index) => (
                                <Fragment key={$index}>
                                  <span style={$css(`position:absolute;left:4px;right:4px;top:${b?.top ?? ''};height:${b?.h ?? ''};border-radius:10px;background:repeating-linear-gradient(135deg,#eef2f7 0 6px,#f7fafd 6px 12px);font:600 11px Figtree,sans-serif;color:#8a9bb0;padding:6px 8px`)}>
                                    {$i(b?.t)}
                                  </span>
                                </Fragment>
                              ))}
                              {$list(d?.appts).map((a, $index) => (
                                <Fragment key={$index}>
                                  <button className="pdp6" onClick={a?.open} style={$css(`appearance:none;cursor:pointer;position:absolute;left:4px;right:4px;top:${a?.top ?? ''};height:${a?.h ?? ''};border-radius:10px;border:0;border-left:3px solid ${a?.bar ?? ''};background:${a?.bg ?? ''};text-align:left;padding:5px 8px;display:flex;flex-direction:column;gap:1px;overflow:hidden`)}>
                                    <span style={$css("font:600 12px Jost,sans-serif;color:#10233a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                                      {$i(a?.who)}
                                    </span>
                                    <span style={$css("font:500 11px Figtree,sans-serif;color:#516378;white-space:nowrap")}>
                                      {$i(a?.time)}{" · "}{$i(a?.fmt)}
                                    </span>
                                  </button>
                                </Fragment>
                              ))}
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
                {thCalMonthOn ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:14px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px")}>
                      {$list(thMonthCells).map((m, $index) => (
                        <Fragment key={$index}>
                          <button className="pdp6" onClick={m?.go} style={$css(`appearance:none;cursor:pointer;min-height:70px;border-radius:12px;border:1px solid ${m?.border ?? ''};background:${m?.bg ?? ''};text-align:left;padding:8px;display:flex;flex-direction:column;gap:4px`)}>
                            <span style={$css(`font:600 12.5px Figtree,sans-serif;color:${m?.color ?? ''}`)}>
                              {$i(m?.d)}
                            </span>
                            <span style={$css("font:600 11.5px Figtree,sans-serif;color:#0a5d96")}>
                              {$i(m?.n)}
                            </span>
                          </button>
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                <span style={$css("font-size:12.5px;color:#6b7f95")}>
                  {"Buffer between appointments: "}{$i(thBufferLabel)}{" · conflicts with therapist or room are blocked when booking."}
                </span>
              </div>
            </>
          ) : null}
          {thIsAvail ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        Availability
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      Working hours, fees and capacity. Business details only.
                    </p>
                  </div>
                  <button className="pdpd pdp0 pdp6" onClick={thBlock} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap")}>
                    {$i(iconPlus)}Block time
                  </button>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${thCols4 ?? ''};gap:14px`)}>
                  {$list(thUtil).map((k, $index) => (
                    <Fragment key={$index}>
                      <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:20px;padding:14px 16px;display:flex;flex-direction:column;gap:4px;min-width:0")}>
                        <span style={$css("font:600 10.5px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8a9bb0")}>
                          {$i(k?.period)}
                        </span>
                        <span style={$css("font:600 13px Figtree,sans-serif;color:#516378")}>
                          {$i(k?.l)}
                        </span>
                        <span style={$css(`font:600 24px/1.1 Jost,sans-serif;color:${k?.c ?? ''}`)}>
                          {$i(k?.v)}
                        </span>
                        <span style={$css("font-size:12px;color:#8a9bb0")}>
                          {$i(k?.s)}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={$css(`display:grid;grid-template-columns:${twoEven ?? ''};gap:16px`)}>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px")}>
                    <div style={$css("display:flex;justify-content:space-between;align-items:center;gap:10px")}>
                      <h3 style={$css("font-size:18px")}>
                        {$i(thName)}
                      </h3>
                      <button className="pdp7 pdp6" onClick={thToggleAccept} style={$css(`appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap;height:34px;color:${thAcceptColor ?? ''}`)}>
                        {$i(thAcceptLabel)}
                      </button>
                    </div>
                    {$list(thProfFacts).map((f, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid #f0f4f8;font-size:14px;flex-wrap:wrap")}>
                          <span style={$css("color:#6b7f95")}>
                            {$i(f?.k)}
                          </span>
                          <span style={$css("font-weight:600;text-align:right")}>
                            {$i(f?.v)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    <label style={$css("display:flex;flex-direction:column;gap:6px")}>
                      <span style={$css("font:600 13px Figtree,sans-serif;color:#1f3550")}>
                        Buffer between appointments
                      </span>
                      <select data-opsel="1" data-val={$val(thBuffer)} value={$val(thBuffer)} onChange={thSetBuffer} style={$css("height:42px;padding:0 10px;border-radius:12px;border:1.5px solid #dbe6f0;font:500 14px Figtree,sans-serif;background:#fff")}>
                        <option value="0">
                          None
                        </option>
                        <option value="10">
                          10 minutes
                        </option>
                        <option value="15">
                          15 minutes
                        </option>
                        <option value="20">
                          20 minutes
                        </option>
                      </select>
                    </label>
                  </div>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:10px")}>
                    <h3 style={$css("font-size:18px")}>
                      Working hours
                    </h3>
                    {$list(thHoursRows).map((h, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:grid;grid-template-columns:60px minmax(0,1fr) auto;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #f0f4f8;font-size:14px")}>
                          <span style={$css("font-weight:600")}>
                            {$i(h?.d)}
                          </span>
                          <span style={$css("color:#516378")}>
                            {$i(h?.t)}
                          </span>
                          <span style={$css("font-size:12.5px;color:#8a9bb0")}>
                            {$i(h?.room)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    <h3 style={$css("font-size:16px;margin-top:8px")}>
                      Planned leave & blocked time
                    </h3>
                    {$list(thLeave).map((l, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:flex;justify-content:space-between;gap:10px;font-size:13.5px;padding:6px 0")}>
                          <span>
                            {$i(l?.t)}
                          </span>
                          <span style={$css("color:#6b7f95;white-space:nowrap")}>
                            {$i(l?.d)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                    <h3 style={$css("font-size:16px;margin-top:8px")}>
                      Rooms
                    </h3>
                    {$list(thRooms).map((r, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:flex;justify-content:space-between;gap:10px;font-size:13.5px;padding:6px 0")}>
                          <span style={$css("font-weight:600")}>
                            {$i(r?.t)}
                          </span>
                          <span style={$css("color:#6b7f95")}>
                            {$i(r?.s)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : null}
          {thIsWait ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        Waitlist
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      Scheduling preferences only. This is not clinical triage or emergency support.
                    </p>
                  </div>
                  <button className="pdpd pdp0 pdp6" onClick={thAddWait} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap")}>
                    {$i(iconPlus)}Add to waitlist
                  </button>
                </div>
                <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow:hidden")}>
                  <div style={$css("overflow-x:auto")}>
                    <table style={$css("min-width:900px")}>
                      <thead>
                        <tr>
                          {$list(thWaitCols).map((c, $index) => (
                            <Fragment key={$index}>
                              <th style={$css("padding:11px 16px;font:600 11.5px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b7f95;background:#f9fbfd;border-bottom:1px solid #edf2f7;white-space:nowrap;text-align:left")}>
                                {$i(c)}
                              </th>
                            </Fragment>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {$list(thWaitRows).map((w, $index) => (
                          <Fragment key={$index}>
                            <tr>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;")}>
                                <span style={$css("display:flex;flex-direction:column;gap:2px")}>
                                  <span style={$css("font:600 14.5px Jost,sans-serif;color:#10233a")}>
                                    {$i(w?.who)}
                                  </span>
                                  <span style={$css("font-size:12px;color:#6b7f95")}>
                                    {"Added "}{$i(w?.added)}
                                  </span>
                                </span>
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;")}>
                                {$i(w?.pref)}
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap")}>
                                {$i(w?.staff)}
                              </td>
                              <td style={$css(`padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap;color:${w?.nextColor ?? ''};font-weight:600`)}>
                                {$i(w?.next)}
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;")}>
                                <span style={$css(`display:inline-flex;align-items:center;font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:${w?.stBg ?? ''};color:${w?.stColor ?? ''};white-space:nowrap`)}>
                                  {$i(w?.status)}
                                </span>
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;text-align:right;white-space:nowrap")}>
                                <span style={$css("display:inline-flex;gap:6px")}>
                                  <button className="pdp7 pdp6" onClick={w?.offer} disabled={w?.offerOff} style={$css(`appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap;height:34px;opacity:${w?.offerOp ?? ''}`)}>
                                    {$i(w?.offerLabel)}
                                  </button>
                                  <button className="pdpd pdp0 pdp6" onClick={w?.convert} disabled={w?.convOff} style={$css(`appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap;height:34px;opacity:${w?.convOp ?? ''}`)}>
                                    Book
                                  </button>
                                </span>
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {thWaitEmpty ? (
                    <>
                      <div style={$css("padding:30px 18px;text-align:center;display:flex;flex-direction:column;gap:6px;align-items:center")}>
                        <span style={$css("font:600 15px Jost,sans-serif")}>
                          Waitlist is empty
                        </span>
                        <span style={$css("font-size:13.5px;color:#516378;max-width:360px")}>
                          Add someone when no suitable slot is available.
                        </span>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
          {thIsBill ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        Billing & payments
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      {"Invoices, payments, credits and refunds. Amounts in "}{$i(thCur)}.
                    </p>
                  </div>
                  <button className="pdpd pdp0 pdp6" onClick={thAddInv} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap")}>
                    {$i(iconPlus)}Create invoice
                  </button>
                </div>
                <div style={$css("display:flex;gap:12px;align-items:flex-start;padding:12px 16px;border-radius:16px;background:#f7fafd;border:1px solid #e3eaf2;font-size:13.5px;color:#3b4d63;line-height:1.5")}>
                  <span style={$css("display:flex;color:#0890E8")}>
                    {$i(iconShield)}
                  </span>
                  <span>
                    <strong style={$css("font:600 14px Jost,sans-serif;color:#10233a")}>
                      Payment processing is not connected.
                    </strong>
                    {" Record payments received by e-transfer, card terminal or cash. Payment links appear only once a processor is connected. Card numbers are never stored here."}
                  </span>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${thCols4 ?? ''};gap:14px`)}>
                  {$list(thBillStats).map((k, $index) => (
                    <Fragment key={$index}>
                      <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:20px;padding:14px 16px;display:flex;flex-direction:column;gap:4px;min-width:0")}>
                        <span style={$css("font:600 10.5px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8a9bb0")}>
                          {$i(k?.period)}
                        </span>
                        <span style={$css("font:600 13px Figtree,sans-serif;color:#516378")}>
                          {$i(k?.l)}
                        </span>
                        <span style={$css(`font:600 24px/1.1 Jost,sans-serif;color:${k?.c ?? ''}`)}>
                          {$i(k?.v)}
                        </span>
                        <span style={$css("font-size:12px;color:#8a9bb0")}>
                          {$i(k?.s)}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                {thFeeQueueOn ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:18px;display:flex;flex-direction:column;gap:10px")}>
                      <h3 style={$css("font-size:17px")}>
                        Cancellation & no-show fees to review
                      </h3>
                      {$list(thFeeQueue).map((q, $index) => (
                        <Fragment key={$index}>
                          <div style={$css("display:flex;align-items:center;gap:12px;flex-wrap:wrap;padding:10px 12px;border-radius:14px;background:#fdf3e1")}>
                            <span style={$css("flex:1;min-width:200px;font-size:14px")}>
                              <strong style={$css("font-weight:600")}>
                                {$i(q?.who)}
                              </strong>
                              {" · "}{$i(q?.what)}
                            </span>
                            <button className="pdpd pdp0 pdp6" onClick={q?.apply} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap;height:34px")}>
                              {"Apply "}{$i(q?.fee)}
                            </button>
                            <button className="pdp7 pdp6" onClick={q?.waive} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap;height:34px")}>
                              Waive
                            </button>
                          </div>
                        </Fragment>
                      ))}
                      <span style={$css("font-size:12px;color:#8a9bb0")}>
                        Fees are added to the client's invoice only after you apply them. Clients are never charged automatically.
                      </span>
                    </div>
                  </>
                ) : null}
                <div style={$css("display:flex;gap:10px;flex-wrap:wrap")}>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Status
                    <select data-opsel="1" data-val={$val(thInvFilter?.value)} value={$val(thInvFilter?.value)} onChange={thInvFilter?.onChange} aria-label="Status" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(thInvFilter?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                </div>
                <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow:hidden")}>
                  <div style={$css("overflow-x:auto")}>
                    <table style={$css("min-width:960px")}>
                      <thead>
                        <tr>
                          {$list(thInvCols).map((c, $index) => (
                            <Fragment key={$index}>
                              <th style={$css("padding:11px 16px;font:600 11.5px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b7f95;background:#f9fbfd;border-bottom:1px solid #edf2f7;white-space:nowrap;text-align:left")}>
                                {$i(c)}
                              </th>
                            </Fragment>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {$list(thInvRows).map((i, $index) => (
                          <Fragment key={$index}>
                            <tr>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap")}>
                                <span style={$css("font:600 13.5px Jost,sans-serif;color:#0890E8")}>
                                  {$i(i?.no)}
                                </span>
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;font-weight:600")}>
                                {$i(i?.who)}
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;")}>
                                {$i(i?.desc)}
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap;color:#6b7f95")}>
                                {$i(i?.date)}
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;")}>
                                <span style={$css(`display:inline-flex;align-items:center;font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:${i?.stBg ?? ''};color:${i?.stColor ?? ''};white-space:nowrap`)}>
                                  {$i(i?.status)}
                                </span>
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap;text-align:right")}>
                                {$i(i?.total)}
                              </td>
                              <td style={$css(`padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap;text-align:right;font-weight:600;color:${i?.balColor ?? ''}`)}>
                                {$i(i?.bal)}
                              </td>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;text-align:right")}>
                                <button className="pdp7 pdp6" onClick={i?.pay} disabled={i?.payOff} style={$css(`appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap;height:34px;opacity:${i?.payOp ?? ''}`)}>
                                  {$i(i?.payLabel)}
                                </button>
                              </td>
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {thInvEmpty ? (
                    <>
                      <div style={$css("padding:30px 18px;text-align:center;display:flex;flex-direction:column;gap:6px;align-items:center")}>
                        <span style={$css("font:600 15px Jost,sans-serif")}>
                          No invoices with this status
                        </span>
                        <span style={$css("font-size:13.5px;color:#516378;max-width:360px")}>
                          Choose a different status.
                        </span>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </>
          ) : null}
          {thIsTasks ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        Tasks
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      Administrative tasks with structured categories. No free-text notes.
                    </p>
                  </div>
                  <button className="pdpd pdp0 pdp6" onClick={thAddTask} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap")}>
                    {$i(iconPlus)}Add task
                  </button>
                </div>
                {$list(thTaskGroups).map((g, $index) => (
                  <Fragment key={$index}>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow:hidden")}>
                      <div style={$css("display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid #edf2f7")}>
                        <span style={$css(`width:10px;height:10px;border-radius:50%;background:${g?.c ?? ''}`)} />
                        <h3 style={$css("font-size:17px")}>
                          {$i(g?.t)}
                        </h3>
                        <span style={$css("font:600 12.5px Figtree,sans-serif;color:#8a9bb0")}>
                          {$i(g?.n)}
                        </span>
                      </div>
                      {$list(g?.items).map((t, $index) => (
                        <Fragment key={$index}>
                          <div style={$css("display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid #f0f4f8;flex-wrap:wrap")}>
                            <button className="pdp6" onClick={t?.toggle} aria-label={$val(t?.aria)} style={$css(`appearance:none;cursor:pointer;width:24px;height:24px;border-radius:8px;border:1.5px solid ${t?.bc ?? ''};background:${t?.bg ?? ''};color:#fff;display:grid;place-items:center;flex-shrink:0`)}>
                              {$i(t?.check)}
                            </button>
                            <span style={$css("flex:1 1 220px;min-width:0;display:flex;flex-direction:column;gap:2px")}>
                              <span style={$css(`font:600 14.5px Jost,sans-serif;color:${t?.tc ?? ''};text-decoration:${t?.strike ?? ''}`)}>
                                {$i(t?.cat)}
                              </span>
                              <span style={$css("font-size:12.5px;color:#6b7f95")}>
                                {$i(t?.sub)}
                              </span>
                            </span>
                            <span style={$css(`display:inline-flex;align-items:center;font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:${t?.pBg ?? ''};color:${t?.pColor ?? ''};white-space:nowrap`)}>
                              {$i(t?.pr)}
                            </span>
                          </div>
                        </Fragment>
                      ))}
                      {g?.empty ? (
                        <>
                          <div style={$css("padding:30px 18px;text-align:center;display:flex;flex-direction:column;gap:6px;align-items:center")}>
                            <span style={$css("font:600 15px Jost,sans-serif")}>
                              Nothing here
                            </span>
                            <span style={$css("font-size:13.5px;color:#516378;max-width:360px")}>
                              Tasks in this group appear here.
                            </span>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </Fragment>
                ))}
              </div>
            </>
          ) : null}
          {thIsReports ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        Reports
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      Aggregate business reports. No clinical outcomes or client-level exports.
                    </p>
                  </div>
                </div>
                <div style={$css("display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between")}>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Period
                    <select data-opsel="1" data-val={$val(thRepPeriod?.value)} value={$val(thRepPeriod?.value)} onChange={thRepPeriod?.onChange} aria-label="Period" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(thRepPeriod?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                  <button className="pdp7 pdp6" onClick={thExport} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                    {$i(iconDownload)}Export aggregate CSV
                  </button>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${thCols3 ?? ''};gap:14px`)}>
                  {$list(thReport).map((r, $index) => (
                    <Fragment key={$index}>
                      <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);border-radius:22px;padding:16px 18px;display:flex;flex-direction:column;gap:6px")}>
                        <span style={$css("font:600 13.5px Figtree,sans-serif;color:#516378")}>
                          {$i(r?.l)}
                        </span>
                        <span style={$css("font:600 26px/1.05 Jost,sans-serif")}>
                          {$i(r?.v)}
                        </span>
                        <span style={$css("font-size:12.5px;color:#6b7f95;line-height:1.45")}>
                          {$i(r?.def)}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </>
          ) : null}
          {thIsSettingsX ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:16px")}>
                <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px")}>
                  <div style={$css("display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap")}>
                    <h3 style={$css("font-size:18px")}>
                      Reminders & notices
                    </h3>
                    <span style={$css("font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:#fdecec;color:#a51f26")}>
                      Email & SMS not connected · messages queue only
                    </span>
                  </div>
                  {$list(thRem).map((r, $index) => (
                    <Fragment key={$index}>
                      <div style={$css(`display:grid;grid-template-columns:${thRemCols ?? ''};gap:10px;align-items:center;padding:10px 0;border-bottom:1px solid #f0f4f8`)}>
                        <span style={$css("display:flex;flex-direction:column;gap:2px")}>
                          <span style={$css("font:600 14.5px Jost,sans-serif")}>
                            {$i(r?.t)}
                          </span>
                          <span style={$css("font-size:12.5px;color:#6b7f95")}>
                            Preview: “{$i(r?.preview)}”
                          </span>
                        </span>
                        <span style={$css("font-size:13px;color:#516378")}>
                          {$i(r?.when)}
                        </span>
                        <button className="pdp6" onClick={r?.toggle} aria-label={`Toggle ${r?.t ?? ''}`} style={$css("appearance:none;border:0;background:transparent;cursor:pointer;justify-self:end;padding:0")}>
                          <span style={$css(`display:block;width:44px;height:26px;border-radius:999px;background:${r?.track ?? ''};position:relative`)}>
                            <span style={$css(`position:absolute;top:3px;left:${r?.knob ?? ''};width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(16,35,58,.25);transition:left .2s ease`)} />
                          </span>
                        </button>
                      </div>
                    </Fragment>
                  ))}
                  <span style={$css("font-size:12.5px;color:#6b7f95")}>
                    Messages use each client's approved channels and never include appointment reasons or clinical details. Delivery status (queued, sent, delivered, failed) shows once a provider is connected.
                  </span>
                </div>
                <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px")}>
                  <div style={$css("display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap")}>
                    <h3 style={$css("font-size:18px")}>
                      Access & privacy
                    </h3>
                    <span style={$css("font:600 11.5px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:#eef2f7;color:#516378")}>
                      Design · permissions must be enforced server-side
                    </span>
                  </div>
                  <div style={$css("overflow-x:auto")}>
                    <table style={$css("min-width:620px")}>
                      <thead>
                        <tr>
                          {$list(thPermCols).map((c, $index) => (
                            <Fragment key={$index}>
                              <th style={$css("padding:11px 16px;font:600 11.5px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b7f95;background:#f9fbfd;border-bottom:1px solid #edf2f7;white-space:nowrap;text-align:left")}>
                                {$i(c)}
                              </th>
                            </Fragment>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {$list(thPerms).map((p, $index) => (
                          <Fragment key={$index}>
                            <tr>
                              <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;font-weight:600")}>
                                {$i(p?.t)}
                              </td>
                              {$list(p?.cells).map((x, $index) => (
                                <Fragment key={$index}>
                                  <td style={$css(`padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;color:${x?.c ?? ''};font-weight:600`)}>
                                    {$i(x?.v)}
                                  </td>
                                </Fragment>
                              ))}
                            </tr>
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div style={$css(`display:grid;grid-template-columns:${twoEven ?? ''};gap:10px`)}>
                    {$list(thSec).map((x, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:flex;justify-content:space-between;align-items:center;gap:10px;padding:12px 14px;border-radius:14px;border:1px solid #e6edf5;background:#f9fbfd")}>
                          <span style={$css("display:flex;flex-direction:column;gap:2px")}>
                            <span style={$css("font:600 14px Jost,sans-serif")}>
                              {$i(x?.t)}
                            </span>
                            <span style={$css("font-size:12.5px;color:#6b7f95")}>
                              {$i(x?.s)}
                            </span>
                          </span>
                          <span style={$css(`font:600 12.5px Figtree,sans-serif;color:${x?.c ?? ''};white-space:nowrap`)}>
                            {$i(x?.v)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  <h3 style={$css("font-size:16px;margin-top:6px")}>
                    Recent access & changes
                  </h3>
                  {$list(thLog).map((l, $index) => (
                    <Fragment key={$index}>
                      <div style={$css("display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;font-size:13.5px;padding:6px 0;border-bottom:1px solid #f0f4f8")}>
                        <span>
                          {$i(l?.t)}
                        </span>
                        <span style={$css("color:#8a9bb0;white-space:nowrap")}>
                          {$i(l?.w)}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  <span style={$css("font-size:12.5px;color:#6b7f95")}>
                    This interface doesn't establish HIPAA, PHIPA or other legal compliance. Review the requirements for your jurisdiction before using it with real client data.
                  </span>
                </div>
              </div>
            </>
          ) : null}
          {thDrOpen ? (
            <>
              <div onClick={thDrClose} style={$css("position:fixed;inset:0;z-index:70;background:rgba(16,35,58,.32)")} />
              <aside role="dialog" aria-label={$val(thDrTitle)} style={$css("position:fixed;top:0;right:0;bottom:0;z-index:71;width:min(480px,100%);background:#f7fafd;box-shadow:-30px 0 60px -30px rgba(16,35,58,.45);display:flex;flex-direction:column;animation:pdSlide .3s cubic-bezier(.23,1,.32,1)")}>
                <div style={$css("padding:18px 22px;background:#fff;border-bottom:1px solid #e6edf5;display:flex;align-items:center;gap:12px")}>
                  <span style={$css("flex:1;font:600 19px Jost,sans-serif")}>
                    {$i(thDrTitle)}
                  </span>
                  <button className="pdp6" onClick={thDrClose} aria-label="Close" style={$css("appearance:none;cursor:pointer;width:40px;height:40px;border-radius:12px;border:1px solid #e3eaf2;background:#fff;font:600 18px Jost,sans-serif")}>
                    ×
                  </button>
                </div>
                <div style={$css("flex:1;overflow-y:auto;padding:20px 22px;display:flex;flex-direction:column;gap:14px")}>
                  {thDrErr ? (
                    <>
                      <div role="alert" style={$css("padding:12px 14px;border-radius:14px;background:#fdecec;border:1px solid #f3c4c6;font:600 13.5px Figtree,sans-serif;color:#a51f26")}>
                        {$i(thDrErrText)}
                      </div>
                    </>
                  ) : null}
                  {$list(thDrFacts).map((f, $index) => (
                    <Fragment key={$index}>
                      <div style={$css("display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #e6edf5;font-size:14px")}>
                        <span style={$css("color:#6b7f95")}>
                          {$i(f?.k)}
                        </span>
                        <span style={$css("font-weight:600;text-align:right")}>
                          {$i(f?.v)}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  {$list(thDrFields).map((f, $index) => (
                    <Fragment key={$index}>
                      <label style={$css("display:flex;flex-direction:column;gap:6px")}>
                        <span style={$css("font:600 13px Figtree,sans-serif;color:#1f3550")}>
                          {$i(f?.label)}
                        </span>
                        {f?.isInput ? (
                          <>
                            <input className="pdp11" type={$val(f?.type)} value={$val(f?.value)} onChange={f?.onChange} style={$css(`height:44px;padding:0 14px;border-radius:12px;border:1.5px solid ${f?.border ?? ''};font:500 14.5px Figtree,sans-serif;outline:none;background:#fff`)} />
                          </>
                        ) : null}
                        {f?.isSelect ? (
                          <>
                            <select data-opsel="1" data-val={$val(f?.value)} value={$val(f?.value)} onChange={f?.onChange} style={$css(`height:44px;padding:0 12px;border-radius:12px;border:1.5px solid ${f?.border ?? ''};font:500 14.5px Figtree,sans-serif;background:#fff`)}>
                              {$list(f?.options).map((o, $index) => (
                                <Fragment key={$index}>
                                  <option value={$val(o?.v)}>
                                    {$i(o?.t)}
                                  </option>
                                </Fragment>
                              ))}
                            </select>
                          </>
                        ) : null}
                        <span style={$css(`display:${f?.errDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`)}>
                          {$i(f?.err)}
                        </span>
                      </label>
                    </Fragment>
                  ))}
                  {thDrRecur ? (
                    <>
                      <div style={$css("padding:12px 14px;border-radius:14px;background:#eaf5fd;border:1px solid #d6eafa;display:flex;flex-direction:column;gap:8px")}>
                        <span style={$css("font:600 13.5px Figtree,sans-serif;color:#0a5d96")}>
                          This is a recurring appointment. Apply changes to:
                        </span>
                        <div style={$css("display:flex;gap:6px")}>
                          {$list(thRecurOpts).map((o, $index) => (
                            <Fragment key={$index}>
                              <button onClick={o?.go} style={$css(`appearance:none;cursor:pointer;height:34px;padding:0 12px;border-radius:999px;border:1.5px solid ${o?.border ?? ''};background:${o?.bg ?? ''};color:${o?.color ?? ''};font:600 13px Figtree,sans-serif`)}>
                                {$i(o?.t)}
                              </button>
                            </Fragment>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
                <div style={$css("padding:14px 22px;background:#fff;border-top:1px solid #e6edf5;display:flex;justify-content:flex-end;gap:8px;flex-wrap:wrap")}>
                  {thDrCanCancel ? (
                    <>
                      <button className="pdp7 pdp6" onClick={thDrCancelAppt} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap;color:#c0262d;border-color:#f3c4c6")}>
                        Cancel appointment
                      </button>
                    </>
                  ) : null}
                  <span style={$css("flex:1")} />
                  <button className="pdp7 pdp6" onClick={thDrClose} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                    Close
                  </button>
                  <button className="pdpd pdp0 pdp6" onClick={thDrSave} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap")}>
                    {$i(thDrSaveLabel)}
                  </button>
                </div>
              </aside>
            </>
          ) : null}
          {isFacilities ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        Facilities & capacity
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      Operational capacity per facility. Available spaces are calculated from total minus occupied.
                    </p>
                  </div>
                  <button className="pdpd pdp0 pdp6" onClick={opAddFacility} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap;transition:background .15s ease,transform .12s ease-out")}>
                    {$i(iconPlus)}Add facility
                  </button>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${opKpiCols ?? ''};gap:14px`)}>
                  {$list(opFacStats).map((fs, $index) => (
                    <Fragment key={$index}>
                      <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:20px;padding:14px 16px;display:flex;flex-direction:column;gap:4px")}>
                        <span style={$css("font:600 12.5px Figtree,sans-serif;color:#516378")}>
                          {$i(fs?.l)}
                        </span>
                        <span style={$css("font:600 24px/1 Jost,sans-serif")}>
                          {$i(fs?.v)}
                        </span>
                        <span style={$css("font-size:12px;color:#8a9bb0")}>
                          {$i(fs?.s)}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                <div style={$css("display:flex;gap:10px;flex-wrap:wrap;align-items:center")}>
                  <div style={$css("display:flex;align-items:center;gap:8px;height:42px;padding:0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;flex:1 1 240px;max-width:340px")}>
                    <span style={$css("display:flex;color:#6b7f95")}>
                      {$i(iconSearch)}
                    </span>
                    <input value={$val(opFacQ)} onChange={onFacQ} placeholder="Search facilities or cities" aria-label="Search facilities or cities" style={$css("flex:1;min-width:0;border:0;outline:none;background:transparent;font:500 14px Figtree,sans-serif;color:#10233a")} />
                  </div>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Program
                    <select data-opsel="1" data-val={$val(opFacProg?.value)} onChange={opFacProg?.onChange} value={$val(opFacProg?.value)} aria-label="Program" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(opFacProg?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Status
                    <select data-opsel="1" data-val={$val(opFacStatus?.value)} onChange={opFacStatus?.onChange} value={$val(opFacStatus?.value)} aria-label="Status" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(opFacStatus?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Sort
                    <select data-opsel="1" data-val={$val(opFacSort?.value)} onChange={opFacSort?.onChange} value={$val(opFacSort?.value)} aria-label="Sort" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(opFacSort?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                </div>
                {opLoading ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px")} aria-busy="true" aria-label="Loading">
                      {$list(opSkel).map((sk, $index) => (
                        <Fragment key={$index}>
                          <span style={$css("height:44px;border-radius:12px;background:linear-gradient(90deg,#eef2f7 0%,#f7fafd 50%,#eef2f7 100%);background-size:200% 100%;animation:opShimmer 1.2s linear infinite")} />
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {opReady ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow:hidden")}>
                      <div style={$css("overflow-x:auto")}>
                        <table style={$css("min-width:880px")}>
                          <thead>
                            <tr>
                              {$list(opFacCols).map((c, $index) => (
                                <Fragment key={$index}>
                                  <th style={$css("padding:11px 16px;font:600 11.5px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b7f95;background:#f9fbfd;border-bottom:1px solid #edf2f7;white-space:nowrap;text-align:left")}>
                                    {$i(c)}
                                  </th>
                                </Fragment>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {$list(opFacRows).map((f, $index) => (
                              <Fragment key={$index}>
                                <tr className="pdp12" style={$css("cursor:pointer")} onClick={f?.view}>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;min-width:220px")}>
                                    <span style={$css("display:flex;flex-direction:column;gap:2px")}>
                                      <span style={$css("font:600 14.5px Jost,sans-serif;color:#10233a")}>
                                        {$i(f?.name)}
                                      </span>
                                      <span style={$css("font-size:12.5px;color:#6b7f95")}>
                                        {$i(f?.city)}
                                      </span>
                                    </span>
                                  </td>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550")}>
                                    {$i(f?.program)}
                                  </td>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;min-width:200px")}>
                                    <span style={$css("display:flex;flex-direction:column;gap:6px")}>
                                      <span style={$css("font:600 13px Jost,sans-serif")}>
                                        {$i(f?.occ)}{" occupied of "}{$i(f?.cap)}
                                      </span>
                                      <span style={$css("height:8px;border-radius:8px;background:#eef2f7;overflow:hidden;display:block;min-width:80px")}>
                                        <span style={$css(`display:block;height:100%;width:${f?.pct ?? ''};border-radius:8px;background:${f?.c ?? ''};transition:width .4s cubic-bezier(.23,1,.32,1)`)} />
                                      </span>
                                    </span>
                                  </td>
                                  <td style={$css(`padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;font:600 15px Jost,sans-serif;color:${f?.availColor ?? ''}`)}>
                                    {$i(f?.avail)}
                                  </td>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550")}>
                                    <span style={$css(`display:inline-flex;align-items:center;gap:6px;font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:${f?.stBg ?? ''};color:${f?.stColor ?? ''};white-space:nowrap`)}>
                                      {$i(f?.status)}
                                    </span>
                                  </td>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;font-size:13px;color:#6b7f95;white-space:nowrap")}>
                                    {$i(f?.updated)}
                                  </td>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;text-align:right;white-space:nowrap")}>
                                    <button className="pdp7 pdp13" onClick={f?.edit} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                                      Edit
                                    </button>
                                  </td>
                                </tr>
                              </Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {opFacEmpty ? (
                        <>
                          <div style={$css("padding:36px 20px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center")}>
                            <span style={$css("width:48px;height:48px;border-radius:14px;background:#f3f6fa;color:#8a9bb0;display:grid;place-items:center")}>
                              {$i(iconSearch)}
                            </span>
                            <span style={$css("font:600 16px Jost,sans-serif;color:#10233a")}>
                              No facilities match
                            </span>
                            <span style={$css("font-size:14px;color:#516378;max-width:380px")}>
                              Try a different search term or clear the filters.
                            </span>
                            <button className="pdp7 pdp14" onClick={opClearFac} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                              Clear filters
                            </button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
          {isPartners ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        Referral partners
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      Business relationships with organizations that refer to your programs. No patient or referral records are stored here.
                    </p>
                  </div>
                  <button className="pdpd pdp0 pdp6" onClick={opAddPartner} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap;transition:background .15s ease,transform .12s ease-out")}>
                    {$i(iconPlus)}Add organization
                  </button>
                </div>
                <div style={$css("display:flex;gap:10px;flex-wrap:wrap;align-items:center")}>
                  <div style={$css("display:flex;align-items:center;gap:8px;height:42px;padding:0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;flex:1 1 240px;max-width:340px")}>
                    <span style={$css("display:flex;color:#6b7f95")}>
                      {$i(iconSearch)}
                    </span>
                    <input value={$val(opParQ)} onChange={onParQ} placeholder="Search organizations" aria-label="Search organizations" style={$css("flex:1;min-width:0;border:0;outline:none;background:transparent;font:500 14px Figtree,sans-serif;color:#10233a")} />
                  </div>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Status
                    <select data-opsel="1" data-val={$val(opParStatus?.value)} onChange={opParStatus?.onChange} value={$val(opParStatus?.value)} aria-label="Status" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(opParStatus?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Type
                    <select data-opsel="1" data-val={$val(opParType?.value)} onChange={opParType?.onChange} value={$val(opParType?.value)} aria-label="Type" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(opParType?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Sort
                    <select data-opsel="1" data-val={$val(opParSort?.value)} onChange={opParSort?.onChange} value={$val(opParSort?.value)} aria-label="Sort" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(opParSort?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                </div>
                {opLoading ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px")} aria-busy="true" aria-label="Loading">
                      {$list(opSkel).map((sk, $index) => (
                        <Fragment key={$index}>
                          <span style={$css("height:44px;border-radius:12px;background:linear-gradient(90deg,#eef2f7 0%,#f7fafd 50%,#eef2f7 100%);background-size:200% 100%;animation:opShimmer 1.2s linear infinite")} />
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {opReady ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow:hidden")}>
                      <div style={$css("overflow-x:auto")}>
                        <table style={$css("min-width:900px")}>
                          <thead>
                            <tr>
                              {$list(opParCols).map((c, $index) => (
                                <Fragment key={$index}>
                                  <th style={$css("padding:11px 16px;font:600 11.5px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b7f95;background:#f9fbfd;border-bottom:1px solid #edf2f7;white-space:nowrap;text-align:left")}>
                                    {$i(c)}
                                  </th>
                                </Fragment>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {$list(opParRows).map((p, $index) => (
                              <Fragment key={$index}>
                                <tr className="pdp12" style={$css("cursor:pointer")} onClick={p?.view}>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550")}>
                                    <span style={$css("display:flex;flex-direction:column;gap:2px")}>
                                      <span style={$css("font:600 14.5px Jost,sans-serif;color:#10233a")}>
                                        {$i(p?.name)}
                                      </span>
                                      <span style={$css("font-size:12.5px;color:#6b7f95")}>
                                        {$i(p?.web)}
                                      </span>
                                    </span>
                                  </td>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550")}>
                                    {$i(p?.type)}
                                  </td>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550")}>
                                    {$i(p?.owner)}
                                  </td>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550")}>
                                    <span style={$css(`display:inline-flex;align-items:center;gap:6px;font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:${p?.stBg ?? ''};color:${p?.stColor ?? ''};white-space:nowrap`)}>
                                      {$i(p?.status)}
                                    </span>
                                  </td>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap;color:#516378")}>
                                    {$i(p?.last)}
                                  </td>
                                  <td style={$css(`padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap;font-weight:600;color:${p?.nextColor ?? ''}`)}>
                                    {$i(p?.next)}
                                  </td>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;text-align:right")}>
                                    <span style={$css("font:600 13px Jost,sans-serif;color:#0890E8;white-space:nowrap")}>
                                      Open
                                    </span>
                                  </td>
                                </tr>
                              </Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {opParEmpty ? (
                        <>
                          <div style={$css("padding:36px 20px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center")}>
                            <span style={$css("width:48px;height:48px;border-radius:14px;background:#f3f6fa;color:#8a9bb0;display:grid;place-items:center")}>
                              {$i(iconSearch)}
                            </span>
                            <span style={$css("font:600 16px Jost,sans-serif;color:#10233a")}>
                              No organizations match
                            </span>
                            <span style={$css("font-size:14px;color:#516378;max-width:380px")}>
                              Try a different search term or clear the filters.
                            </span>
                            <button className="pdp7 pdp14" onClick={opClearPar} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                              Clear filters
                            </button>
                          </div>
                        </>
                      ) : null}
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
          {isMarketing ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        Marketing performance
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      Aggregate campaign results for the selected period, entered by your team.
                    </p>
                  </div>
                  <button className="pdpd pdp0 pdp6" onClick={opAddCampaign} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap;transition:background .15s ease,transform .12s ease-out")}>
                    {$i(iconPlus)}Add campaign
                  </button>
                </div>
                <div style={$css("display:flex;gap:12px;align-items:flex-start;padding:14px 16px;border-radius:18px;background:#f7fafd;border:1px solid #e3eaf2;font-size:13.5px;color:#3b4d63;line-height:1.5")}>
                  <span style={$css("display:flex;color:#0890E8;margin-top:1px")}>
                    {$i(iconShield)}
                  </span>
                  <span>
                    <strong style={$css("font:600 14px Jost,sans-serif;color:#10233a")}>
                      No advertising platforms are connected.
                    </strong>
                    {" Figures are entered manually. Attributed admissions are shown only where the source is reliable (tracked number or dedicated landing page); other campaigns show “Not attributable”. Counts below 5 appear as “<5”."}
                  </span>
                </div>
                <div style={$css("display:flex;gap:10px;flex-wrap:wrap;align-items:center")}>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Period
                    <select data-opsel="1" data-val={$val(opMktPeriod?.value)} onChange={opMktPeriod?.onChange} value={$val(opMktPeriod?.value)} aria-label="Period" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(opMktPeriod?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Channel
                    <select data-opsel="1" data-val={$val(opMktChannel?.value)} onChange={opMktChannel?.onChange} value={$val(opMktChannel?.value)} aria-label="Channel" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(opMktChannel?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${opKpiCols ?? ''};gap:14px`)}>
                  {$list(opMktStats).map((ms, $index) => (
                    <Fragment key={$index}>
                      <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:20px;padding:14px 16px;display:flex;flex-direction:column;gap:4px")}>
                        <span style={$css("font:600 12.5px Figtree,sans-serif;color:#516378")}>
                          {$i(ms?.l)}
                        </span>
                        <span style={$css("font:600 24px/1 Jost,sans-serif")}>
                          {$i(ms?.v)}
                        </span>
                        <span style={$css("font-size:12px;color:#8a9bb0")}>
                          {$i(ms?.s)}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
                {opLoading ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px")} aria-busy="true" aria-label="Loading">
                      {$list(opSkel).map((sk, $index) => (
                        <Fragment key={$index}>
                          <span style={$css("height:44px;border-radius:12px;background:linear-gradient(90deg,#eef2f7 0%,#f7fafd 50%,#eef2f7 100%);background-size:200% 100%;animation:opShimmer 1.2s linear infinite")} />
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {opReady ? (
                  <>
                    <div style={$css(`display:grid;grid-template-columns:${opSplit ?? ''};gap:16px`)}>
                      <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow:hidden;min-width:0")}>
                        <div style={$css("overflow-x:auto")}>
                          <table style={$css("min-width:900px")}>
                            <thead>
                              <tr>
                                {$list(opMktCols).map((c, $index) => (
                                  <Fragment key={$index}>
                                    <th style={$css("padding:11px 16px;font:600 11.5px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b7f95;background:#f9fbfd;border-bottom:1px solid #edf2f7;white-space:nowrap;text-align:left")}>
                                      {$i(c)}
                                    </th>
                                  </Fragment>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {$list(opMktRows).map((c, $index) => (
                                <Fragment key={$index}>
                                  <tr>
                                    <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550")}>
                                      <span style={$css("font:600 14px Jost,sans-serif;color:#10233a")}>
                                        {$i(c?.name)}
                                      </span>
                                    </td>
                                    <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550")}>
                                      {$i(c?.channel)}
                                    </td>
                                    <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap")}>
                                      {$i(c?.period)}
                                    </td>
                                    <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap")}>
                                      {$i(c?.budget)}
                                    </td>
                                    <td style={$css(`padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap;font-weight:600;color:${c?.spendColor ?? ''}`)}>
                                      {$i(c?.spend)}
                                    </td>
                                    <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;font-weight:600")}>
                                      {$i(c?.inq)}
                                    </td>
                                    <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap")}>
                                      {$i(c?.cpi)}
                                    </td>
                                    <td style={$css(`padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap;color:${c?.attColor ?? ''}`)}>
                                      {$i(c?.att)}
                                    </td>
                                    <td style={$css(`padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap;color:${c?.attColor ?? ''}`)}>
                                      {$i(c?.cpa)}
                                    </td>
                                    <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;text-align:right;white-space:nowrap")}>
                                      <button className="pdp7 pdp13" onClick={c?.edit} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                                        Edit
                                      </button>
                                    </td>
                                  </tr>
                                </Fragment>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {opMktEmpty ? (
                          <>
                            <div style={$css("padding:36px 20px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center")}>
                              <span style={$css("width:48px;height:48px;border-radius:14px;background:#f3f6fa;color:#8a9bb0;display:grid;place-items:center")}>
                                {$i(iconSearch)}
                              </span>
                              <span style={$css("font:600 16px Jost,sans-serif;color:#10233a")}>
                                No campaigns for this period
                              </span>
                              <span style={$css("font-size:14px;color:#516378;max-width:380px")}>
                                Add a campaign or choose a different period.
                              </span>
                            </div>
                          </>
                        ) : null}
                      </div>
                      <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px;min-width:0")}>
                        <h3 style={$css("font-size:17px")}>
                          Spend vs budget
                        </h3>
                        {$list(opMktBars).map((mb, $index) => (
                          <Fragment key={$index}>
                            <div style={$css("display:flex;flex-direction:column;gap:6px")}>
                              <div style={$css("display:flex;justify-content:space-between;gap:10px;font-size:13px")}>
                                <span style={$css("font-weight:600;color:#1f3550;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>
                                  {$i(mb?.name)}
                                </span>
                                <span style={$css("white-space:nowrap;color:#516378")}>
                                  {$i(mb?.label)}
                                </span>
                              </div>
                              <span style={$css("height:8px;border-radius:8px;background:#eef2f7;overflow:hidden;display:block;min-width:80px")}>
                                <span style={$css(`display:block;height:100%;width:${mb?.pct ?? ''};border-radius:8px;background:${mb?.c ?? ''};transition:width .4s cubic-bezier(.23,1,.32,1)`)} />
                              </span>
                            </div>
                          </Fragment>
                        ))}
                        <h3 style={$css("font-size:17px;margin-top:8px")}>
                          Cost per inquiry
                        </h3>
                        {$list(opCpiBars).map((cb, $index) => (
                          <Fragment key={$index}>
                            <div style={$css("display:flex;flex-direction:column;gap:6px")}>
                              <div style={$css("display:flex;justify-content:space-between;gap:10px;font-size:13px")}>
                                <span style={$css("font-weight:600;color:#1f3550;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap")}>
                                  {$i(cb?.name)}
                                </span>
                                <span style={$css("white-space:nowrap;font:600 13px Jost,sans-serif")}>
                                  {$i(cb?.label)}
                                </span>
                              </div>
                              <span style={$css("height:8px;border-radius:8px;background:#eef2f7;overflow:hidden;display:block;min-width:80px")}>
                                <span style={$css(`display:block;height:100%;width:${cb?.pct ?? ''};border-radius:8px;background:${cb?.c ?? ''};transition:width .4s cubic-bezier(.23,1,.32,1)`)} />
                              </span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
          {isReports ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        Monthly business reports
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      Organization-wide monthly totals. One report per scope and month.
                    </p>
                  </div>
                  <button className="pdpd pdp0 pdp6" onClick={opAddReport} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap;transition:background .15s ease,transform .12s ease-out")}>
                    {$i(iconPlus)}Add report
                  </button>
                </div>
                <div style={$css("display:flex;gap:10px;flex-wrap:wrap;align-items:center;justify-content:space-between")}>
                  <div style={$css("display:flex;gap:10px;flex-wrap:wrap")}>
                    <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                      Scope
                      <select data-opsel="1" data-val={$val(opRepScope?.value)} onChange={opRepScope?.onChange} value={$val(opRepScope?.value)} aria-label="Scope" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                        {$list(opRepScope?.opts).map((o, $index) => (
                          <Fragment key={$index}>
                            <option value={$val(o?.v)}>
                              {$i(o?.t)}
                            </option>
                          </Fragment>
                        ))}
                      </select>
                    </label>
                    <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                      Sort
                      <select data-opsel="1" data-val={$val(opRepSort?.value)} onChange={opRepSort?.onChange} value={$val(opRepSort?.value)} aria-label="Sort" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                        {$list(opRepSort?.opts).map((o, $index) => (
                          <Fragment key={$index}>
                            <option value={$val(o?.v)}>
                              {$i(o?.t)}
                            </option>
                          </Fragment>
                        ))}
                      </select>
                    </label>
                  </div>
                  <button className="pdp7 pdp6" onClick={opExport} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                    {$i(iconDownload)}Export CSV
                  </button>
                </div>
                {opLoading ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px")} aria-busy="true" aria-label="Loading">
                      {$list(opSkel).map((sk, $index) => (
                        <Fragment key={$index}>
                          <span style={$css("height:44px;border-radius:12px;background:linear-gradient(90deg,#eef2f7 0%,#f7fafd 50%,#eef2f7 100%);background-size:200% 100%;animation:opShimmer 1.2s linear infinite")} />
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {opReady ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow:hidden")}>
                      <div style={$css("overflow-x:auto")}>
                        <table style={$css("min-width:960px")}>
                          <thead>
                            <tr>
                              {$list(opRepCols).map((c, $index) => (
                                <Fragment key={$index}>
                                  <th style={$css("padding:11px 16px;font:600 11.5px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b7f95;background:#f9fbfd;border-bottom:1px solid #edf2f7;white-space:nowrap;text-align:left")}>
                                    {$i(c)}
                                  </th>
                                </Fragment>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {$list(opRepRows).map((r, $index) => (
                              <Fragment key={$index}>
                                <tr>
                                  <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;min-width:170px")}>
                                    <span style={$css("display:flex;flex-direction:column;gap:2px")}>
                                      <span style={$css("font:600 14.5px Jost,sans-serif;color:#10233a;white-space:nowrap")}>
                                        {$i(r?.month)}
                                      </span>
                                      <span style={$css("font-size:12px;color:#6b7f95")}>
                                        {$i(r?.scope)}
                                      </span>
                                    </span>
                                  </td>
                                  {r?.has ? (
                                    <>
                                      <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;font-weight:600")}>
                                        {$i(r?.inq)}
                                      </td>
                                      <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;font-weight:600")}>
                                        {$i(r?.adm)}
                                      </td>
                                      <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap")}>
                                        {$i(r?.spend)}
                                      </td>
                                      <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap")}>
                                        {$i(r?.rev)}
                                      </td>
                                      <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;font:600 14px Jost,sans-serif")}>
                                        {$i(r?.ratio)}
                                      </td>
                                      <td style={$css(`padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;white-space:nowrap;font-size:12.5px;color:${r?.cmpColor ?? ''}`)}>
                                        {$i(r?.cmp)}
                                      </td>
                                      <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;text-align:right;white-space:nowrap")}>
                                        <span style={$css("display:inline-flex;gap:6px")}>
                                          <button className="pdp7 pdp13" onClick={r?.edit} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                                            Edit
                                          </button>
                                          <button className="pdp7 pdp15" onClick={r?.del} aria-label="Delete report" style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                                            Delete
                                          </button>
                                        </span>
                                      </td>
                                    </>
                                  ) : null}
                                  {r?.none ? (
                                    <>
                                      <td colSpan="6" style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;color:#8a9bb0;font-weight:600")}>
                                        No report submitted
                                      </td>
                                      <td style={$css("padding:12px 16px;border-bottom:1px solid #f0f4f8;font-size:14px;color:#1f3550;text-align:right")}>
                                        <button className="pdp7 pdp13" onClick={r?.add} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                                          Add report
                                        </button>
                                      </td>
                                    </>
                                  ) : null}
                                </tr>
                              </Fragment>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div style={$css("padding:12px 16px;font-size:12.5px;color:#6b7f95;border-top:1px solid #f0f4f8")}>
                        {"Inquiry-to-admission ratio = period admissions ÷ period inquiries. It's a period-based business metric, not a tracked individual conversion. Amounts in "}{$i(opCurrency)}.
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </>
          ) : null}
          {isTasks ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;align-items:flex-end;justify-content:space-between;gap:16px;flex-wrap:wrap")}>
                  <div style={$css("display:flex;flex-direction:column;gap:6px;min-width:0")}>
                    <div style={$css("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
                      <h1 style={$css(`font-size:${h1Size ?? ''};white-space:nowrap`)}>
                        Operational tasks
                      </h1>
                    </div>
                    <p style={$css("font-size:15px;color:#516378")}>
                      Business tasks for your teams. Not linked to clients.
                    </p>
                  </div>
                  <button className="pdpd pdp0 pdp6" onClick={opAddTask} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap;transition:background .15s ease,transform .12s ease-out")}>
                    {$i(iconPlus)}Add task
                  </button>
                </div>
                <div style={$css("display:flex;gap:10px;flex-wrap:wrap;align-items:center")}>
                  <div style={$css("display:flex;align-items:center;gap:8px;height:42px;padding:0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;flex:1 1 240px;max-width:340px")}>
                    <span style={$css("display:flex;color:#6b7f95")}>
                      {$i(iconSearch)}
                    </span>
                    <input value={$val(opTaskQ)} onChange={onTaskQ} placeholder="Search tasks" aria-label="Search tasks" style={$css("flex:1;min-width:0;border:0;outline:none;background:transparent;font:500 14px Figtree,sans-serif;color:#10233a")} />
                  </div>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Category
                    <select data-opsel="1" data-val={$val(opTaskCat?.value)} onChange={opTaskCat?.onChange} value={$val(opTaskCat?.value)} aria-label="Category" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(opTaskCat?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                  <label style={$css("display:inline-flex;align-items:center;gap:6px;height:42px;padding:0 4px 0 12px;border-radius:12px;background:#fff;border:1px solid #e3eaf2;font:600 12.5px Figtree,sans-serif;color:#6b7f95")}>
                    Team
                    <select data-opsel="1" data-val={$val(opTaskTeam?.value)} onChange={opTaskTeam?.onChange} value={$val(opTaskTeam?.value)} aria-label="Team" style={$css("height:38px;border:0;background:transparent;font:600 13.5px Figtree,sans-serif;color:#10233a;outline:none;cursor:pointer")}>
                      {$list(opTaskTeam?.opts).map((o, $index) => (
                        <Fragment key={$index}>
                          <option value={$val(o?.v)}>
                            {$i(o?.t)}
                          </option>
                        </Fragment>
                      ))}
                    </select>
                  </label>
                </div>
                {opLoading ? (
                  <>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:12px")} aria-busy="true" aria-label="Loading">
                      {$list(opSkel).map((sk, $index) => (
                        <Fragment key={$index}>
                          <span style={$css("height:44px;border-radius:12px;background:linear-gradient(90deg,#eef2f7 0%,#f7fafd 50%,#eef2f7 100%);background-size:200% 100%;animation:opShimmer 1.2s linear infinite")} />
                        </Fragment>
                      ))}
                    </div>
                  </>
                ) : null}
                {opReady ? (
                  <>
                    {$list(opTaskGroups).map((tg, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);overflow:hidden")}>
                          <div style={$css("display:flex;align-items:center;gap:10px;padding:14px 18px;border-bottom:1px solid #edf2f7")}>
                            <span style={$css(`width:10px;height:10px;border-radius:50%;background:${tg?.c ?? ''}`)} />
                            <h3 style={$css("font-size:17px")}>
                              {$i(tg?.t)}
                            </h3>
                            <span style={$css("font:600 12.5px Figtree,sans-serif;color:#8a9bb0")}>
                              {$i(tg?.n)}
                            </span>
                          </div>
                          {$list(tg?.items).map((tk, $index) => (
                            <Fragment key={$index}>
                              <div style={$css("display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:1px solid #f0f4f8;flex-wrap:wrap")}>
                                <button className="pdp6" onClick={tk?.toggle} aria-label={$val(tk?.toggleLabel)} style={$css(`appearance:none;cursor:pointer;width:24px;height:24px;border-radius:8px;border:1.5px solid ${tk?.boxBorder ?? ''};background:${tk?.boxBg ?? ''};color:#fff;display:grid;place-items:center;flex-shrink:0`)}>
                                  {$i(tk?.check)}
                                </button>
                                <span style={$css("flex:1 1 220px;min-width:0;display:flex;flex-direction:column;gap:2px")}>
                                  <span style={$css(`font:600 14.5px Jost,sans-serif;color:${tk?.titleColor ?? ''};text-decoration:${tk?.strike ?? ''}`)}>
                                    {$i(tk?.cat)}
                                  </span>
                                  <span style={$css("font-size:12.5px;color:#6b7f95")}>
                                    {$i(tk?.team)}{" · due "}{$i(tk?.due)}
                                  </span>
                                </span>
                                <span style={$css(`display:inline-flex;align-items:center;gap:6px;font:600 12px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:${tk?.prBg ?? ''};color:${tk?.prColor ?? ''};white-space:nowrap`)}>
                                  {$i(tk?.priority)}
                                </span>
                                <select value={$val(tk?.status)} onChange={tk?.setStatus} aria-label="Task status" style={$css("height:34px;padding:0 8px;border-radius:10px;border:1px solid #e3eaf2;background:#fff;font:600 13px Figtree,sans-serif;color:#1f3550")}>
                                  <option value="todo">
                                    To do
                                  </option>
                                  <option value="doing">
                                    In progress
                                  </option>
                                  <option value="done">
                                    Completed
                                  </option>
                                </select>
                                <button className="pdp7 pdp13" onClick={tk?.edit} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                                  Edit
                                </button>
                              </div>
                            </Fragment>
                          ))}
                          {tg?.empty ? (
                            <>
                              <div style={$css("padding:36px 20px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center")}>
                                <span style={$css("width:48px;height:48px;border-radius:14px;background:#f3f6fa;color:#8a9bb0;display:grid;place-items:center")}>
                                  {$i(iconSearch)}
                                </span>
                                <span style={$css("font:600 16px Jost,sans-serif;color:#10233a")}>
                                  Nothing here
                                </span>
                                <span style={$css("font-size:14px;color:#516378;max-width:380px")}>
                                  Tasks in this group will appear here.
                                </span>
                              </div>
                            </>
                          ) : null}
                        </div>
                      </Fragment>
                    ))}
                  </>
                ) : null}
              </div>
            </>
          ) : null}
          {isSettings ? (
            <>
              <div style={$css("display:flex;flex-direction:column;gap:18px;animation:pdFade .3s ease-out")}>
                <div style={$css("display:flex;flex-direction:column;gap:6px")}>
                  <h1 style={$css(`font-size:${h1Size ?? ''}`)}>
                    Settings
                  </h1>
                  <p style={$css("font-size:15px;color:#516378")}>
                    Organization, reporting, notifications and integrations.
                  </p>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${twoEven ?? ''};gap:16px`)}>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:14px")}>
                    <div style={$css("display:flex;justify-content:space-between;align-items:center;gap:10px")}>
                      <h3 style={$css("font-size:18px")}>
                        Organization details
                      </h3>
                      <button className="pdpd pdp0 pdp16" onClick={opSaveOrg} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap;transition:background .15s ease,transform .12s ease-out")}>
                        Save
                      </button>
                    </div>
                    {$list(opOrgFields).map((of, $index) => (
                      <Fragment key={$index}>
                        <label style={$css("display:flex;flex-direction:column;gap:6px")}>
                          <span style={$css("font:600 13px Figtree,sans-serif;color:#1f3550")}>
                            {$i(of?.l)}
                          </span>
                          <input className="pdp11" value={$val(of?.v)} onChange={of?.onChange} style={$css(`height:44px;padding:0 14px;border-radius:12px;border:1.5px solid ${of?.border ?? ''};font:500 14.5px Figtree,sans-serif;color:#10233a;outline:none`)} />
                          <span style={$css(`display:${of?.errDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`)}>
                            {$i(of?.err)}
                          </span>
                        </label>
                      </Fragment>
                    ))}
                    <div style={$css("display:flex;flex-direction:column;gap:8px")}>
                      <span style={$css("font:600 13px Figtree,sans-serif;color:#1f3550")}>
                        Locations
                      </span>
                      <div style={$css("display:flex;flex-wrap:wrap;gap:6px")}>
                        {$list(opLocations).map((lo, $index) => (
                          <Fragment key={$index}>
                            <span style={$css("display:inline-flex;align-items:center;height:32px;padding:0 12px;border-radius:999px;background:#eaf5fd;color:#0a5d96;font:600 13px Figtree,sans-serif")}>
                              {$i(lo)}
                            </span>
                          </Fragment>
                        ))}
                      </div>
                      <span style={$css("font-size:12.5px;color:#6b7f95")}>
                        Locations come from your facilities list.
                      </span>
                    </div>
                  </div>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:14px")}>
                    <h3 style={$css("font-size:18px")}>
                      Reporting preferences
                    </h3>
                    <label style={$css("display:flex;flex-direction:column;gap:6px")}>
                      <span style={$css("font:600 13px Figtree,sans-serif;color:#1f3550")}>
                        Reporting currency
                      </span>
                      <select value={$val(opCurrency)} onChange={opSetCurrency} style={$css("height:44px;padding:0 12px;border-radius:12px;border:1.5px solid #dbe6f0;font:500 14.5px Figtree,sans-serif;background:#fff")}>
                        <option value="CAD">
                          CAD · Canadian dollar
                        </option>
                        <option value="USD">
                          USD · US dollar
                        </option>
                      </select>
                    </label>
                    <label style={$css("display:flex;flex-direction:column;gap:6px")}>
                      <span style={$css("font:600 13px Figtree,sans-serif;color:#1f3550")}>
                        Fiscal year starts
                      </span>
                      <select style={$css("height:44px;padding:0 12px;border-radius:12px;border:1.5px solid #dbe6f0;font:500 14.5px Figtree,sans-serif;background:#fff")}>
                        <option>
                          January
                        </option>
                        <option>
                          April
                        </option>
                      </select>
                    </label>
                    <button onClick={opToggleSuppress} style={$css("appearance:none;border:0;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:4px 0;background:transparent;text-align:left")}>
                      <span style={$css("display:flex;flex-direction:column;gap:2px")}>
                        <span style={$css("font:600 14.5px Jost,sans-serif;color:#10233a")}>
                          Hide small counts
                        </span>
                        <span style={$css("font-size:13px;color:#516378")}>
                          {"Show counts below 5 as “<5” in breakdowns"}
                        </span>
                      </span>
                      <span style={$css(`width:44px;height:26px;border-radius:999px;background:${opSupTrack ?? ''};position:relative;flex-shrink:0;transition:background .2s ease`)}>
                        <span style={$css(`position:absolute;top:3px;left:${opSupKnob ?? ''};width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(16,35,58,.25);transition:left .2s cubic-bezier(.23,1,.32,1)`)} />
                      </span>
                    </button>
                    <div style={$css("display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 14px;border-radius:14px;border:1px dashed #cfdceb;background:#f9fbfd")}>
                      <span style={$css("display:flex;flex-direction:column;gap:2px")}>
                        <span style={$css("font:600 14px Jost,sans-serif;color:#10233a")}>
                          Team permissions
                        </span>
                        <span style={$css("font-size:12.5px;color:#6b7f95")}>
                          Role-based access per module
                        </span>
                      </span>
                      <span style={$css("font:600 11.5px Figtree,sans-serif;padding:4px 10px;border-radius:999px;background:#eef2f7;color:#516378;white-space:nowrap")}>
                        Proposed · not yet functional
                      </span>
                    </div>
                  </div>
                </div>
                <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:10px;background:linear-gradient(180deg,#f3f9fe 0%,#fff 70%)")}>
                  <h3 style={$css("font-size:18px")}>
                    Data boundaries
                  </h3>
                  <p style={$css("font-size:14.5px;line-height:1.6;color:#3b4d63;max-width:820px")}>
                    This platform accepts business information and aggregate operational figures only: facility capacity totals, period inquiry and admission counts, marketing spend and partner organization contacts. Individual client and clinical records stay in your own clinical systems and are never entered here.
                  </p>
                  <div style={$css(`display:grid;grid-template-columns:${twoEven ?? ''};gap:12px`)}>
                    <div style={$css("padding:14px;border-radius:14px;background:#fff;border:1px solid #e6edf5;display:flex;flex-direction:column;gap:6px")}>
                      <span style={$css("font:600 13px Figtree,sans-serif;color:#1f8a52")}>
                        Accepted
                      </span>
                      <span style={$css("font-size:13.5px;color:#3b4d63;line-height:1.5")}>
                        Facility names, locations and capacity · monthly totals · campaign budgets and results · professional contacts at partner organizations · operational tasks
                      </span>
                    </div>
                    <div style={$css("padding:14px;border-radius:14px;background:#fff;border:1px solid #e6edf5;display:flex;flex-direction:column;gap:6px")}>
                      <span style={$css("font:600 13px Figtree,sans-serif;color:#c0262d")}>
                        Not accepted
                      </span>
                      <span style={$css("font-size:13.5px;color:#3b4d63;line-height:1.5")}>
                        Patient names or identifiers · diagnoses, treatment or medications · insurance details · clinical notes · client messages or documents · individual bed assignments
                      </span>
                    </div>
                  </div>
                  <span style={$css("font-size:12.5px;color:#6b7f95")}>
                    This describes how the platform is designed to be used. It is not a certification or a guarantee of anonymity.
                  </span>
                </div>
                <div style={$css(`display:grid;grid-template-columns:${twoEven ?? ''};gap:16px`)}>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:8px")}>
                    <h3 style={$css("font-size:18px;margin-bottom:6px")}>
                      Lead notifications
                    </h3>
                    {$list(notifSettings).map((ns, $index) => (
                      <Fragment key={$index}>
                        <button onClick={ns?.toggle} style={$css("appearance:none;border:0;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:12px 0;background:transparent;text-align:left;border-bottom:1px solid #f0f4f8")}>
                          <span style={$css("display:flex;flex-direction:column;gap:2px")}>
                            <span style={$css("font:600 14.5px Jost,sans-serif;color:#10233a")}>
                              {$i(ns?.t)}
                            </span>
                            <span style={$css("font-size:13px;color:#516378")}>
                              {$i(ns?.b)}
                            </span>
                          </span>
                          <span style={$css(`width:44px;height:26px;border-radius:999px;background:${ns?.track ?? ''};position:relative;flex-shrink:0;transition:background .2s ease`)}>
                            <span style={$css(`position:absolute;top:3px;left:${ns?.knob ?? ''};width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 2px 6px rgba(16,35,58,.25);transition:left .2s cubic-bezier(.23,1,.32,1)`)} />
                          </span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <div style={$css("display:flex;flex-direction:column;gap:16px")}>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:10px")}>
                      <h3 style={$css("font-size:18px;margin-bottom:4px")}>
                        Integrations
                      </h3>
                      {$list(integrations).map((ig, $index) => (
                        <Fragment key={$index}>
                          <div style={$css("display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid #f0f4f8")}>
                            <span style={$css("width:38px;height:38px;border-radius:11px;background:#f3f6fa;color:#1f3550;display:grid;place-items:center;font:700 13px Jost,sans-serif")}>
                              {$i(ig?.mark)}
                            </span>
                            <span style={$css("flex:1;display:flex;flex-direction:column;gap:1px")}>
                              <span style={$css("font:600 14.5px Jost,sans-serif")}>
                                {$i(ig?.name)}
                              </span>
                              <span style={$css(`font-size:12.5px;color:${ig?.subColor ?? ''}`)}>
                                {$i(ig?.sub)}
                              </span>
                            </span>
                            <button onClick={ig?.toggle} style={$css(`appearance:none;cursor:pointer;height:34px;padding:0 14px;border-radius:999px;border:1px solid ${ig?.btnBorder ?? ''};background:${ig?.btnBg ?? ''};color:${ig?.btnColor ?? ''};font:600 13px Jost,sans-serif`)}>
                              {$i(ig?.btn)}
                            </button>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                    <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:26px;box-shadow:0 1px 2px rgba(16,35,58,.04),0 18px 40px -30px rgba(16,35,58,.35);padding:20px;display:flex;flex-direction:column;gap:10px")}>
                      <div style={$css("display:flex;justify-content:space-between;align-items:center")}>
                        <h3 style={$css("font-size:18px")}>
                          Team
                        </h3>
                        <button onClick={inviteTeam} style={$css("appearance:none;border:0;background:transparent;cursor:pointer;font:600 13.5px Jost,sans-serif;color:#0890E8")}>
                          + Invite
                        </button>
                      </div>
                      {$list(team).map((tm, $index) => (
                        <Fragment key={$index}>
                          <div style={$css("display:flex;align-items:center;gap:12px")}>
                            <span style={$css("width:36px;height:36px;border-radius:11px;background:#eaf5fd;color:#0890E8;display:grid;place-items:center;font:600 13px Jost,sans-serif")}>
                              {$i(tm?.i)}
                            </span>
                            <span style={$css("flex:1;display:flex;flex-direction:column")}>
                              <span style={$css("font:600 14px Jost,sans-serif")}>
                                {$i(tm?.n)}
                              </span>
                              <span style={$css("font-size:12.5px;color:#6b7f95")}>
                                {$i(tm?.e)}
                              </span>
                            </span>
                            <span style={$css("font:600 12px Figtree,sans-serif;padding:3px 9px;border-radius:999px;background:#f3f6fa;color:#516378")}>
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
          <div onClick={closeLead} style={$css("position:fixed;inset:0;background:rgba(16,35,58,.35);z-index:60;animation:pdFade .15s ease-out")} />
          <aside data-screen-label="Lead detail" style={$css(`position:fixed;top:0;right:0;bottom:0;width:${drawerW ?? ''};background:#fff;z-index:61;display:flex;flex-direction:column;box-shadow:-30px 0 60px -30px rgba(16,35,58,.45);animation:pdSlide .25s cubic-bezier(.23,1,.32,1)`)}>
            <div style={$css("display:flex;align-items:center;gap:14px;padding:20px 22px;border-bottom:1px solid #edf2f7")}>
              <span style={$css(`width:48px;height:48px;border-radius:14px;background:${ld?.avBg ?? ''};color:${ld?.avColor ?? ''};display:grid;place-items:center;font:600 16px Jost,sans-serif`)}>
                {$i(ld?.initials)}
              </span>
              <span style={$css("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}>
                <span style={$css("font:600 19px Jost,sans-serif")}>
                  {$i(ld?.name)}
                </span>
                <span style={$css("font-size:13px;color:#6b7f95")}>
                  {$i(ld?.source)}{" · "}{$i(ld?.ago)}
                </span>
              </span>
              <span style={$css(`font:700 14px Jost,sans-serif;padding:5px 10px;border-radius:999px;background:${ld?.scoreBg ?? ''};color:${ld?.scoreColor ?? ''}`)} title="Lead score">
                {$i(ld?.score)}
              </span>
              <button onClick={closeLead} aria-label="Close" style={$css("appearance:none;border:0;background:#f3f6fa;cursor:pointer;width:36px;height:36px;border-radius:11px;font:600 18px/1 Jost,sans-serif;color:#1f3550")}>
                ×
              </button>
            </div>
            <div style={$css("flex:1;overflow-y:auto;padding:18px 22px;display:flex;flex-direction:column;gap:18px")}>
              <div style={$css("display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px")}>
                {$list(quick).map((qa, $index) => (
                  <Fragment key={$index}>
                    <$A className="pdp17" href={$val(qa?.href)} onClick={qa?.act} style={$css(`display:flex;flex-direction:column;align-items:center;gap:6px;padding:12px 6px;border-radius:16px;background:${qa?.bg ?? ''};color:${qa?.color ?? ''};font:600 12.5px Figtree,sans-serif;text-align:center`)}>
                      {$i(qa?.icon)}{$i(qa?.label)}
                    </$A>
                  </Fragment>
                ))}
              </div>
              <div style={$css("display:flex;flex-direction:column;gap:8px")}>
                <span style={$css("font:600 12px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b7f95")}>
                  Stage
                </span>
                <div style={$css("display:flex;flex-wrap:wrap;gap:6px")}>
                  {$list(ldStages).map((st, $index) => (
                    <Fragment key={$index}>
                      <button onClick={st?.select} style={$css(`appearance:none;cursor:pointer;height:34px;padding:0 12px;border-radius:999px;border:1.5px solid ${st?.border ?? ''};background:${st?.bg ?? ''};color:${st?.color ?? ''};font:600 13px Figtree,sans-serif`)}>
                        {$i(st?.label)}
                      </button>
                    </Fragment>
                  ))}
                </div>
              </div>
              <div style={$css("display:grid;grid-template-columns:1fr 1fr;gap:1px;background:#edf2f7;border:1px solid #edf2f7;border-radius:16px;overflow:hidden")}>
                {$list(ldFacts).map((lf, $index) => (
                  <Fragment key={$index}>
                    <div style={$css("background:#fff;padding:10px 12px;display:flex;flex-direction:column;gap:2px;min-width:0")}>
                      <span style={$css("font:600 10.5px Figtree,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b7f95")}>
                        {$i(lf?.k)}
                      </span>
                      <span style={$css("font:600 13.5px Jost,sans-serif;overflow-wrap:anywhere")}>
                        {$i(lf?.v)}
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div style={$css("display:flex;flex-direction:column;gap:8px;padding:14px;border-radius:16px;background:#f7fafd;border:1px solid #edf2f7")}>
                <span style={$css("font:600 12px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b7f95")}>
                  Their message
                </span>
                <p style={$css("font-size:14.5px;line-height:1.6;color:#1f3550")}>
                  {$i(ld?.message)}
                </p>
              </div>
              <div style={$css("display:flex;flex-direction:column;gap:10px")}>
                <div style={$css("display:flex;align-items:center;justify-content:space-between;gap:10px")}>
                  <span style={$css("font:600 12px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b7f95")}>
                    Reply
                  </span>
                  <button onClick={aiDraft} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:7px;height:32px;padding:0 12px;border-radius:999px;background:linear-gradient(135deg,#0a6fc0,#0890E8);color:#fff;font:600 12.5px Jost,sans-serif")}>
                    <span style={$css(`display:${aiSpin ?? ''};width:12px;height:12px;border-radius:50%;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;animation:pdSpin .7s linear infinite`)} />
                    <span style={$css(`display:${aiIcon ?? ''}`)}>
                      {$i(iconSpark)}
                    </span>
                    {$i(aiLabel)}
                  </button>
                </div>
                <textarea className="pdp11" value={$val(reply)} onChange={setReply} rows="5" placeholder="Write a reply or use a template…" style={$css("padding:12px 14px;border-radius:14px;border:1.5px solid #dbe6f0;font:500 14.5px/1.55 Figtree,sans-serif;color:#10233a;outline:none;resize:vertical")} />
                <div style={$css("display:flex;flex-wrap:wrap;gap:6px")}>
                  {$list(templates).map((tp, $index) => (
                    <Fragment key={$index}>
                      <button className="pdp7" onClick={tp?.use} style={$css("appearance:none;cursor:pointer;height:30px;padding:0 11px;border-radius:999px;border:1px solid #e3eaf2;background:#fff;color:#1f3550;font:500 12.5px Figtree,sans-serif")}>
                        {$i(tp?.label)}
                      </button>
                    </Fragment>
                  ))}
                </div>
                <button className="pdpd pdp0" onClick={sendReply} style={$css("appearance:none;border:0;cursor:pointer;align-self:flex-end;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;display:inline-flex;align-items:center;gap:8px")}>
                  Send email{$i(iconArrowSm)}
                </button>
              </div>
              <div style={$css("display:flex;flex-direction:column;gap:10px")}>
                <span style={$css("font:600 12px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b7f95")}>
                  Activity
                </span>
                <div style={$css("display:flex;gap:8px")}>
                  <input className="pdp18" value={$val(note)} onChange={setNote} placeholder="Add a private note…" style={$css("flex:1;min-width:0;height:42px;padding:0 14px;border-radius:12px;border:1.5px solid #dbe6f0;font:500 14px Figtree,sans-serif;outline:none")} />
                  <button onClick={addNote} style={$css("appearance:none;border:0;cursor:pointer;height:42px;padding:0 14px;border-radius:12px;background:#10233a;color:#fff;font:600 13.5px Jost,sans-serif")}>
                    Add
                  </button>
                </div>
                <ol style={$css("list-style:none;margin:0;padding:0;display:flex;flex-direction:column")}>
                  {$list(ldTimeline).map((tl, $index) => (
                    <Fragment key={$index}>
                      <li style={$css("display:grid;grid-template-columns:28px 1fr;gap:10px;padding-bottom:14px;position:relative")}>
                        <span style={$css(`width:28px;height:28px;border-radius:9px;background:${tl?.bg ?? ''};color:${tl?.color ?? ''};display:grid;place-items:center`)}>
                          {$i(tl?.icon)}
                        </span>
                        <span style={$css("display:flex;flex-direction:column;gap:2px;padding-top:3px")}>
                          <span style={$css("font:500 13.5px Figtree,sans-serif;color:#1f3550")}>
                            {$i(tl?.t)}
                          </span>
                          <span style={$css("font-size:12px;color:#8a9bb0")}>
                            {$i(tl?.when)}
                          </span>
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
      {opDrOpen ? (
        <>
          <div onClick={opDrClose} style={$css("position:fixed;inset:0;z-index:70;background:rgba(16,35,58,.32);animation:pdFade .2s ease-out")} />
          <aside role="dialog" aria-label={$val(opDrTitle)} style={$css("position:fixed;top:0;right:0;bottom:0;z-index:71;width:min(520px,100%);background:#f7fafd;box-shadow:-30px 0 60px -30px rgba(16,35,58,.45);display:flex;flex-direction:column;animation:pdSlide .3s cubic-bezier(.23,1,.32,1)")}>
            <div style={$css("padding:18px 22px;background:#fff;border-bottom:1px solid #e6edf5;display:flex;align-items:center;gap:12px")}>
              <span style={$css("flex:1;min-width:0;display:flex;flex-direction:column;gap:2px")}>
                <span style={$css("font:600 11.5px Figtree,sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#0890E8")}>
                  {$i(opDrKicker)}
                </span>
                <span style={$css("font:600 19px Jost,sans-serif")}>
                  {$i(opDrTitle)}
                </span>
              </span>
              <button className="pdp19" onClick={opDrClose} aria-label="Close" style={$css("appearance:none;cursor:pointer;width:40px;height:40px;border-radius:12px;border:1px solid #e3eaf2;background:#fff;color:#1f3550;display:grid;place-items:center;font:600 18px Jost,sans-serif")}>
                ×
              </button>
            </div>
            <div style={$css("flex:1;overflow-y:auto;padding:20px 22px;display:flex;flex-direction:column;gap:16px")}>
              {opDrIsView ? (
                <>
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:20px;padding:16px 18px;display:flex;flex-direction:column")}>
                    {$list(opDrFacts).map((fa, $index) => (
                      <Fragment key={$index}>
                        <div style={$css("display:flex;justify-content:space-between;gap:14px;padding:10px 0;border-bottom:1px solid #f0f4f8;font-size:14px")}>
                          <span style={$css("color:#6b7f95")}>
                            {$i(fa?.k)}
                          </span>
                          <span style={$css("font-weight:600;color:#10233a;text-align:right;overflow-wrap:anywhere")}>
                            {$i(fa?.v)}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                  {opDrHasCap ? (
                    <>
                      <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:20px;padding:16px 18px;display:flex;flex-direction:column;gap:8px")}>
                        <span style={$css("display:flex;justify-content:space-between;font:600 14px Jost,sans-serif")}>
                          <span>
                            Capacity · current snapshot
                          </span>
                          <span>
                            {$i(opDrCapLabel)}
                          </span>
                        </span>
                        <span style={$css("height:8px;border-radius:8px;background:#eef2f7;overflow:hidden;display:block;min-width:80px")}>
                          <span style={$css(`display:block;height:100%;width:${opDrCapPct ?? ''};border-radius:8px;background:${opDrCapColor ?? ''};transition:width .4s cubic-bezier(.23,1,.32,1)`)} />
                        </span>
                      </div>
                    </>
                  ) : null}
                  {opDrHasLog ? (
                    <>
                      <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:20px;padding:16px 18px;display:flex;flex-direction:column;gap:12px")}>
                        <span style={$css("font:600 15px Jost,sans-serif")}>
                          Outreach activity
                        </span>
                        <div style={$css("display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr);gap:8px")}>
                          <select data-opsel="1" data-val={$val(opActType)} value={$val(opActType)} onChange={opSetActType} aria-label="Activity type" style={$css("height:40px;padding:0 10px;border-radius:11px;border:1.5px solid #dbe6f0;font:500 13.5px Figtree,sans-serif;background:#fff")}>
                            {$list(opActTypes).map((o, $index) => (
                              <Fragment key={$index}>
                                <option value={$val(o)}>
                                  {$i(o)}
                                </option>
                              </Fragment>
                            ))}
                          </select>
                          <select data-opsel="1" data-val={$val(opActOutcome)} value={$val(opActOutcome)} onChange={opSetActOutcome} aria-label="Outcome" style={$css("height:40px;padding:0 10px;border-radius:11px;border:1.5px solid #dbe6f0;font:500 13.5px Figtree,sans-serif;background:#fff")}>
                            {$list(opActOutcomes).map((o, $index) => (
                              <Fragment key={$index}>
                                <option value={$val(o)}>
                                  {$i(o)}
                                </option>
                              </Fragment>
                            ))}
                          </select>
                        </div>
                        <button className="pdpd pdp0 pdp1a" onClick={opLogActivity} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap;transition:background .15s ease,transform .12s ease-out")}>
                          Log activity
                        </button>
                        <ol style={$css("display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none")}>
                          {$list(opDrLog).map((lg, $index) => (
                            <Fragment key={$index}>
                              <li style={$css("display:grid;grid-template-columns:10px minmax(0,1fr) auto;gap:10px;align-items:baseline;font-size:13.5px")}>
                                <span style={$css("width:8px;height:8px;border-radius:50%;background:#0890E8")} />
                                <span style={$css("color:#1f3550")}>
                                  <strong style={$css("font-weight:600")}>
                                    {$i(lg?.type)}
                                  </strong>
                                  {" · "}{$i(lg?.outcome)}
                                </span>
                                <span style={$css("font-size:12px;color:#8a9bb0;white-space:nowrap")}>
                                  {$i(lg?.date)}
                                </span>
                              </li>
                            </Fragment>
                          ))}
                        </ol>
                        <span style={$css("font-size:12px;color:#8a9bb0")}>
                          Structured fields only. Don't record patient or referral details.
                        </span>
                      </div>
                    </>
                  ) : null}
                </>
              ) : null}
              {opDrIsForm ? (
                <>
                  {opDrNotice ? (
                    <>
                      <div style={$css("padding:12px 14px;border-radius:14px;background:#eaf5fd;border:1px solid #d6eafa;font-size:13px;color:#0a5d96;line-height:1.5")}>
                        {$i(opDrNoticeText)}
                      </div>
                    </>
                  ) : null}
                  {opDrHasErr ? (
                    <>
                      <div role="alert" style={$css("padding:12px 14px;border-radius:14px;background:#fdecec;border:1px solid #f3c4c6;font:600 13.5px Figtree,sans-serif;color:#a51f26")}>
                        {$i(opDrErrSummary)}
                      </div>
                    </>
                  ) : null}
                  <div style={$css("background:#fff;border:1px solid #e6edf5;border-radius:20px;padding:18px;display:flex;flex-direction:column;gap:14px")}>
                    {$list(opDrFields).map((f, $index) => (
                      <Fragment key={$index}>
                        <label style={$css("display:flex;flex-direction:column;gap:6px")}>
                          <span style={$css("font:600 13px Figtree,sans-serif;color:#1f3550")}>
                            {$i(f?.label)}
                          </span>
                          {f?.isInput ? (
                            <>
                              <input className="pdp11" type={$val(f?.type)} min={$val(f?.min)} value={$val(f?.value)} onChange={f?.onChange} placeholder={$val(f?.ph)} aria-invalid={$val(f?.invalid)} style={$css(`height:44px;padding:0 14px;border-radius:12px;border:1.5px solid ${f?.border ?? ''};font:500 14.5px Figtree,sans-serif;color:#10233a;outline:none;background:#fff`)} />
                            </>
                          ) : null}
                          {f?.isSelect ? (
                            <>
                              <select className="pdp11" data-opsel="1" data-val={$val(f?.value)} value={$val(f?.value)} onChange={f?.onChange} style={$css(`height:44px;padding:0 12px;border-radius:12px;border:1.5px solid ${f?.border ?? ''};font:500 14.5px Figtree,sans-serif;color:#10233a;background:#fff`)}>
                                {$list(f?.options).map((o, $index) => (
                                  <Fragment key={$index}>
                                    <option value={$val(o?.v)}>
                                      {$i(o?.t)}
                                    </option>
                                  </Fragment>
                                ))}
                              </select>
                            </>
                          ) : null}
                          <span style={$css(`display:${f?.helpDisplay ?? ''};font-size:12px;color:#6b7f95`)}>
                            {$i(f?.help)}
                          </span>
                          <span style={$css(`display:${f?.errDisplay ?? ''};font:500 12.5px Figtree,sans-serif;color:#c0262d`)}>
                            {$i(f?.err)}
                          </span>
                        </label>
                      </Fragment>
                    ))}
                  </div>
                </>
              ) : null}
            </div>
            <div style={$css("padding:14px 22px;background:#fff;border-top:1px solid #e6edf5;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap")}>
              {opDrCanDelete ? (
                <>
                  <button className="pdp7 pdp1b" onClick={opDrDelete} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                    Delete
                  </button>
                </>
              ) : null}
              <span style={$css("flex:1")} />
              {opDrIsView ? (
                <>
                  <button className="pdpd pdp0 pdp6" onClick={opDrEdit} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap;transition:background .15s ease,transform .12s ease-out")}>
                    Edit
                  </button>
                </>
              ) : null}
              {opDrIsForm ? (
                <>
                  <button className="pdp7 pdp6" onClick={opDrClose} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                    Cancel
                  </button>
                  <button className="pdpd pdp0 pdp6" onClick={opDrSave} style={$css("appearance:none;border:0;cursor:pointer;display:inline-flex;align-items:center;gap:8px;height:42px;padding:0 18px;border-radius:999px;background:#0890E8;color:#fff;font:600 14px Jost,sans-serif;white-space:nowrap;transition:background .15s ease,transform .12s ease-out")}>
                    {$i(opDrSaveLabel)}
                  </button>
                </>
              ) : null}
            </div>
          </aside>
        </>
      ) : null}
      {opConfirmOpen ? (
        <>
          <div style={$css("position:fixed;inset:0;z-index:90;background:rgba(16,35,58,.45);display:grid;place-items:center;padding:16px;animation:pdFade .15s ease-out")}>
            <div role="alertdialog" aria-label="Confirm deletion" style={$css("width:min(420px,100%);background:#fff;border-radius:24px;padding:22px;display:flex;flex-direction:column;gap:12px;box-shadow:0 40px 80px -30px rgba(16,35,58,.6)")}>
              <span style={$css("font:600 19px Jost,sans-serif")}>
                {"Delete "}{$i(opConfirmKind)}?
              </span>
              <p style={$css("font-size:14.5px;line-height:1.55;color:#3b4d63")}>
                <strong style={$css("color:#10233a")}>
                  {$i(opConfirmLabel)}
                </strong>
                {" will be permanently removed. "}{$i(opConfirmEffect)}
              </p>
              <div style={$css("display:flex;justify-content:flex-end;gap:8px;margin-top:6px")}>
                <button className="pdp7 pdp6" onClick={opConfirmCancel} style={$css("appearance:none;cursor:pointer;display:inline-flex;align-items:center;gap:6px;height:38px;padding:0 14px;border-radius:999px;border:1.5px solid #e3eaf2;background:#fff;color:#1f3550;font:600 13.5px Jost,sans-serif;white-space:nowrap")}>
                  Cancel
                </button>
                <button className="pdp1c" onClick={opConfirmDo} style={$css("appearance:none;border:0;cursor:pointer;height:40px;padding:0 18px;border-radius:999px;background:#c0262d;color:#fff;font:600 14px Jost,sans-serif")}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
      {showMobileNav ? (
        <>
          <nav data-screen-label="Mobile tab bar" style={$css("position:fixed;left:0;right:0;bottom:0;z-index:60;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));padding:6px 6px calc(6px + env(safe-area-inset-bottom));background:rgba(255,255,255,.94);backdrop-filter:blur(18px) saturate(1.5);-webkit-backdrop-filter:blur(18px) saturate(1.5);border-top:1px solid #e3eaf2;box-shadow:0 -10px 30px -20px rgba(16,35,58,.35)")}>
            {$list(tabs).map((tb, $index) => (
              <Fragment key={$index}>
                <button className="pdp1d" onClick={tb?.go} aria-label={$val(tb?.label)} style={$css(`appearance:none;border:0;background:transparent;cursor:pointer;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-height:54px;padding:4px 2px;color:${tb?.color ?? ''};transition:color .15s ease,transform .12s ease-out`)}>
                  <span style={$css(`display:grid;place-items:center;width:52px;height:30px;border-radius:999px;background:${tb?.pill ?? ''};transition:background .2s ease`)}>
                    {$i(tb?.icon)}
                  </span>
                  <span style={$css("font:600 11px Figtree,sans-serif;letter-spacing:.01em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%")}>
                    {$i(tb?.label)}
                  </span>
                  <span style={$css(`display:${tb?.badgeDisplay ?? ''};position:absolute;top:4px;left:calc(50% + 8px);min-width:18px;height:18px;padding:0 5px;border-radius:999px;background:#D82028;color:#fff;border:2px solid #fff;font:600 10px Jost,sans-serif;align-items:center;justify-content:center`)}>
                    {$i(tb?.badge)}
                  </span>
                </button>
              </Fragment>
            ))}
          </nav>
        </>
      ) : null}
      {moreOpen ? (
        <>
          <div onClick={closeMore} style={$css("position:fixed;inset:0;z-index:70;background:rgba(16,35,58,.42);animation:pdDim .2s ease-out")} />
          <div role="dialog" aria-label="All sections" style={$css("position:fixed;left:0;right:0;bottom:0;z-index:71;max-height:86vh;overflow-y:auto;background:#fff;border-radius:26px 26px 0 0;padding:10px 16px calc(20px + env(safe-area-inset-bottom));box-shadow:0 -30px 60px -30px rgba(16,35,58,.5);animation:pdSheet .28s cubic-bezier(.2,.8,.2,1)")}>
            <button onClick={closeMore} aria-label="Close" style={$css("appearance:none;border:0;background:transparent;cursor:pointer;display:block;margin:0 auto 6px;padding:8px 30px")}>
              <span style={$css("display:block;width:40px;height:5px;border-radius:999px;background:#d5dfea")} />
            </button>
            <div style={$css("display:flex;align-items:center;gap:12px;padding:12px;border-radius:18px;background:linear-gradient(135deg,#12294a,#0c1b2f);color:#fff;margin-bottom:16px")}>
              <span style={$css("width:44px;height:44px;border-radius:14px;background:linear-gradient(135deg,#1aa0f0,#0a6fc0);display:grid;place-items:center;font:600 15px Jost,sans-serif;flex-shrink:0")}>
                {$i(initials)}
              </span>
              <span style={$css("display:flex;flex-direction:column;min-width:0;flex:1")}>
                <span style={$css("font:600 16px Jost,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>
                  {$i(orgName)}
                </span>
                <span style={$css("font:500 13px Figtree,sans-serif;color:#9fb3c8")}>
                  {$i(planName)}{" · "}{$i(planVerified)}
                </span>
              </span>
              <button onClick={goBillingMore} style={$css("appearance:none;border:0;cursor:pointer;height:36px;padding:0 14px;border-radius:999px;background:#fff;color:#0a5d96;font:600 13px Jost,sans-serif;flex-shrink:0")}>
                Upgrade
              </button>
            </div>
            <span style={$css("display:block;font:600 12px Figtree,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#6b7f95;padding:0 4px 10px")}>
              All sections
            </span>
            <div style={$css("display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px")}>
              {$list(moreItems).map((m, $index) => (
                <Fragment key={$index}>
                  <button className="pdp1e" onClick={m?.go} style={$css(`appearance:none;cursor:pointer;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;min-height:92px;padding:12px 6px;border-radius:18px;background:${m?.bg ?? ''};border:1.5px solid ${m?.border ?? ''};color:${m?.color ?? ''};transition:transform .12s ease-out`)}>
                    <span style={$css(`width:40px;height:40px;border-radius:13px;display:grid;place-items:center;background:${m?.iconBg ?? ''};color:${m?.iconColor ?? ''}`)}>
                      {$i(m?.icon)}
                    </span>
                    <span style={$css("font:600 13px/1.2 Figtree,sans-serif;text-align:center;text-wrap:balance")}>
                      {$i(m?.label)}
                    </span>
                    <span style={$css(`display:${m?.badgeDisplay ?? ''};position:absolute;top:8px;right:8px;min-width:20px;height:20px;padding:0 6px;border-radius:999px;background:#D82028;color:#fff;font:600 11px Jost,sans-serif;align-items:center;justify-content:center`)}>
                      {$i(m?.badge)}
                    </span>
                  </button>
                </Fragment>
              ))}
            </div>
            <$A href="tel:+18558854747" style={$css("display:flex;align-items:center;justify-content:center;gap:10px;height:52px;margin-top:16px;border-radius:16px;background:#f3f6fa;color:#1f3550;font:600 14.5px Figtree,sans-serif")}>
              {$i(iconHelp)}Call provider support
            </$A>
            <button onClick={signOut} style={$css("appearance:none;border:1px solid #e3eaf2;cursor:pointer;display:flex;align-items:center;justify-content:center;width:100%;height:48px;margin-top:10px;border-radius:16px;background:#fff;color:#c0262d;font:600 15px Jost,sans-serif")}>
              Sign out
            </button>
          </div>
        </>
      ) : null}
      {toastOn ? (
        <>
          <div style={$css(`position:fixed;left:50%;bottom:${toastBottom ?? ''};transform:translateX(-50%);z-index:80;display:flex;align-items:center;gap:10px;padding:12px 18px 12px 12px;border-radius:16px;background:#10233a;color:#fff;font:500 14px Figtree,sans-serif;box-shadow:0 20px 40px -20px rgba(16,35,58,.7);animation:pdFade .2s ease-out`)}>
            <span style={$css("width:26px;height:26px;border-radius:50%;background:#2fb46b;display:grid;place-items:center")}>
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

export const css = "html,body{margin:0;padding:0;background:#f3f6fa;color:#10233a;font-family:Figtree,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}\n*{box-sizing:border-box}\na{color:#0890E8;text-decoration:none}a:hover{color:#0670b8}\nh1,h2,h3,h4{font-family:Jost,Helvetica,sans-serif;margin:0;font-weight:600;letter-spacing:-0.01em;text-wrap:balance}\np{margin:0;text-wrap:pretty}\nul{margin:0;padding:0;list-style:none}\ninput,select,button,textarea{font-family:inherit}\nbutton,a{-webkit-tap-highlight-color:transparent;touch-action:manipulation}\nhtml{overscroll-behavior-y:none}\n@media (max-width:759px){input,select,textarea{font-size:16px!important}main table{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch}}\n@keyframes pdSheet{from{transform:translateY(100%)}to{transform:none}}\n@keyframes pdDim{from{opacity:0}to{opacity:1}}\ninput::placeholder,textarea::placeholder{color:#8a9bb0}\n@keyframes pdFade{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}\n@keyframes pdSlide{from{transform:translateX(24px);opacity:0}to{transform:none;opacity:1}}\n@keyframes pdPulse{0%{box-shadow:0 0 0 0 rgba(47,180,107,.5)}70%{box-shadow:0 0 0 8px rgba(47,180,107,0)}100%{box-shadow:0 0 0 0 rgba(47,180,107,0)}}\n@keyframes pdDraw{from{stroke-dashoffset:1400}to{stroke-dashoffset:0}}\n@keyframes pdSpin{to{transform:rotate(360deg)}}\n@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;transition-duration:.01ms!important}}\n@keyframes opShimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}\n.pdp0:active{transform:scale(.97) !important}\n.pdp1:hover{background:rgba(255,255,255,.08) !important;color:#fff !important}\n.pdp2:hover{color:#fff !important}\n.pdp3:active{transform:scale(.94) !important}\n.pdp4:hover{background:#f3f8fd !important}\n.pdp5:hover{transform:translateY(-2px) !important}\n.pdp6:focus-visible{outline:3px solid rgba(8,144,232,.35) !important;outline-offset:2px !important}\n.pdp7:hover{border-color:#0890E8 !important;color:#0890E8 !important}\n.pdp8:focus-visible{outline:3px solid rgba(8,144,232,.35) !important;outline-offset:2px !important;align-self:flex-start !important}\n.pdp9:hover{background:#eef6fd !important}\n.pdpa:hover{transform:translateY(-2px) !important;box-shadow:0 1px 2px rgba(16,35,58,.04),0 26px 44px -30px rgba(16,35,58,.45) !important}\n.pdpb:active{transform:scale(.99) !important}\n.pdpc:hover{background:#f0f6fc !important}\n.pdpd:hover{background:#0670b8 !important}\n.pdpe:hover{box-shadow:0 14px 24px -16px rgba(16,35,58,.45) !important;transform:translateY(-1px) !important}\n.pdpf:hover{background:#f7fafd !important}\n.pdp10:hover{background:#f7fbff !important}\n.pdp11:focus-visible{border-color:#0890E8 !important;box-shadow:0 0 0 4px rgba(8,144,232,.12) !important}\n.pdp12:hover{background:#f6faff !important}\n.pdp13:focus-visible{outline:3px solid rgba(8,144,232,.35) !important;outline-offset:2px !important;height:34px !important}\n.pdp14:focus-visible{outline:3px solid rgba(8,144,232,.35) !important;outline-offset:2px !important;margin-top:4px !important}\n.pdp15:focus-visible{outline:3px solid rgba(8,144,232,.35) !important;outline-offset:2px !important;height:34px !important;color:#c0262d !important}\n.pdp16:focus-visible{outline:3px solid rgba(8,144,232,.35) !important;outline-offset:2px !important;height:36px !important}\n.pdp17:hover{filter:brightness(.97) !important;color:{{ qa.color }} !important}\n.pdp18:focus-visible{border-color:#0890E8 !important}\n.pdp19:focus-visible{outline:3px solid rgba(8,144,232,.35) !important}\n.pdp1a:focus-visible{outline:3px solid rgba(8,144,232,.35) !important;outline-offset:2px !important;height:38px !important;align-self:flex-start !important}\n.pdp1b:focus-visible{outline:3px solid rgba(8,144,232,.35) !important;outline-offset:2px !important;color:#c0262d !important;border-color:#f3c4c6 !important}\n.pdp1c:focus-visible{outline:3px solid rgba(192,38,45,.35) !important;outline-offset:2px !important}\n.pdp1d:active{transform:scale(.92) !important}\n.pdp1e:active{transform:scale(.95) !important}";
const View = createDC('ProviderDashboard', Component, template);
export default View;
export function Root(props) {
  return <DCRoot View={View} defaults={{ providerType: 'centre' }} css={css} {...props} />;
}
