"""Finds clinician names + credentials that already appear in our own published content (audit/import/therapists-from-content.csv).
Suggestions for admin review only: nothing here is published, and no individual is contacted or listed from this file without approval."""
import json, re, glob, csv
from pathlib import Path
R = Path(__file__).resolve().parents[2]
CRED = r'(?:RP|RSW|MSW|RCC|CCC|CCAC|R\.?\s?Psych|C\.?\s?Psych|Ph\.?\s?D\.?|PsyD|MD|M\.D\.|LCSW|LMFT|MA|M\.A\.|MEd|M\.Ed\.|MSc|M\.Sc\.|CAC|CCS|RN|NP|DSW|BSW)'
NAME = r"((?:Dr\.\s+)?[A-Z][a-z]+(?:\s+[A-Z]\.)?(?:\s+[A-Z][a-zA-Z'’\-]+){1,2})"
p1 = re.compile(NAME + r',?\s+(' + CRED + r'(?:,?\s+' + CRED + r')*)\b')
p2 = re.compile(r'\b(Dr\.\s+[A-Z][a-z]+(?:\s+[A-Z][a-zA-Z\'’\-]+){1,2})')
p3 = re.compile(NAME + r',?\s+(?:a|an|our|the)?\s*(?:registered |licensed |certified |clinical )?(psychotherapist|psychologist|social worker|addiction counsellor|addiction counselor|therapist|counsellor|counselor|psychiatrist|physician)', re.I)
STOP = {'Addiction Rehab', 'Rehab Centre', 'Mental Health', 'Health Services', 'Social Work', 'Drug Rehab', 'Treatment Centre', 'Treatment Center', 'Canada Addiction', 'Recovery Centre', 'Medical Doctor', 'Alcohol Rehab', 'Ontario Rehab'}
def text_of(o, acc):
    if isinstance(o, dict):
        for k, v in o.items():
            if k in ('jsonld_source', 'head', 'source', 'seo', 'listing'): continue
            text_of(v, acc)
    elif isinstance(o, list):
        for v in o: text_of(v, acc)
    elif isinstance(o, str): acc.append(o)
rows = {}
idx = {e['slug']: e for e in json.load(open(R / 'content/_index.json')) if e['published']}
for f in sorted(glob.glob(str(R / 'content/*.json'))):
    slug = Path(f).stem
    if slug not in idx: continue
    d = json.load(open(f)); acc = []; text_of(d, acc)
    t = re.sub(r'<[^>]+>', ' ', ' '.join(acc)); t = re.sub(r'&[a-z]+;', ' ', t); t = re.sub(r'\s+', ' ', t)
    for rx, kind in ((p1, 'name + credential'), (p2, 'Dr. + name')):  # the looser "name + role" pattern was dropped: too many false positives
        for m in rx.finditer(t):
            name = m.group(1).strip(); cred = m.group(2).strip() if m.lastindex and m.lastindex >= 2 else ''
            if any(s in name for s in STOP) or len(name.split()) < 2: continue
            if any(w.lower() in {'and','of','the','for','to','in','a','an','at','with','call','ability'} for w in name.split()): continue
            if re.match(r'^(The|This|Our|Your|Please|Call|Find|Read|About|Contact|Learn|Click|Home|Best|Top|What|How|When)\b', name): continue
            key = (name.lower(), idx[slug]['route'])
            if key in rows: continue
            ctx = t[max(0, m.start() - 70): m.end() + 70]
            rows[key] = [name, cred, kind, idx[slug]['route'], idx[slug]['type'], ctx]
out = R / 'audit/import/therapists-from-content.csv'
with open(out, 'w', newline='') as fh:
    w = csv.writer(fh); w.writerow(['name', 'credential_or_role', 'match', 'source_page', 'page_type', 'context'])
    for r in sorted(rows.values(), key=lambda r: (r[0], r[3])): w.writerow(r)
print(len(rows), 'suggestions,', len({r[0].lower() for r in rows.values()}), 'distinct names ->', out)
