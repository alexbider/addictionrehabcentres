"""Phase 5D (report only, nothing is imported): compares our published centre listings with StatCan's Open Database of Healthcare Facilities
(Open Government Licence - Canada). Usage: python3 -I audit/scripts/compare-centres-odhf.py <path to odhf_v1.1.csv>"""
import csv, json, re, sys, difflib, glob
from pathlib import Path
R = Path(__file__).resolve().parents[2]
src = sys.argv[1]
norm = lambda s: re.sub(r'\b(inc|ltd|the|centre|center|society|services|service|clinic|program|programs|of|and|for|health)\b', ' ', re.sub(r'[^a-z0-9 ]', ' ', (s or '').lower().replace('&', ' and '))).split()
key = lambda s: ' '.join(sorted(norm(s)))
pc = lambda s: re.sub(r'\s+', '', (s or '').upper())
odhf = list(csv.DictReader(open(src, encoding='cp1252', errors='replace')))
by_pc = {}
for r in odhf: by_pc.setdefault(pc(r['postal_code']), []).append(r)
ours = []
for f in glob.glob(str(R / 'content/centre__*.json')):
    p = json.load(open(f))
    c = p.get('centre')
    if not c: continue
    m = re.search(r'([A-Z]\d[A-Z]\s?\d[A-Z]\d)', c.get('address') or '')
    ours.append((p['route'], c['name'], c.get('address') or '', pc(m.group(1)) if m else ''))
rows = []; stats = {'ours': len(ours), 'odhf_rows': len(odhf), 'matched_postal+name': 0, 'matched_postal_only': 0, 'no_match': 0, 'no_postal_in_our_address': 0, 'would_fill_coordinates': 0}
for route, name, addr, post in ours:
    if not post: stats['no_postal_in_our_address'] += 1; rows.append([route, name, addr, '', '', '', '', '', 'no postal code in our address']); continue
    cands = by_pc.get(post, [])
    best = None; score = 0
    for c in cands:
        s = difflib.SequenceMatcher(None, key(name), key(c['facility_name'])).ratio()
        if s > score: best, score = c, s
    if best and score >= 0.75:
        stats['matched_postal+name'] += 1; kind = 'same postal code + similar name'
    elif cands:
        stats['matched_postal_only'] += 1; best = best; kind = 'same postal code, different name (review)'
    else:
        stats['no_match'] += 1; rows.append([route, name, addr, '', '', '', '', '', 'no ODHF facility at this postal code']); continue
    has_geo = bool(best.get('latitude') and best.get('longitude'))
    if has_geo and kind.startswith('same postal code + similar'): stats['would_fill_coordinates'] += 1
    rows.append([route, name, addr, best['facility_name'], best['odhf_facility_type'], best['provider'], best.get('latitude', ''), best.get('longitude', ''), kind + f' (similarity {score:.2f})'])
out = R / 'audit/import/centres-vs-odhf.csv'
with open(out, 'w', newline='') as fh:
    w = csv.writer(fh); w.writerow(['our_page', 'our_name', 'our_address', 'odhf_name', 'odhf_type', 'odhf_provider', 'latitude', 'longitude', 'result']); w.writerows(rows)
json.dump(stats, open(R / 'audit/import/centres-vs-odhf.summary.json', 'w'), indent=1)
print(json.dumps(stats, indent=1))
