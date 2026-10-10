"""Old WordPress image URLs (audit/seo/ARC_old_image_urls.csv) -> published WebP files. Writes src/lib/image-redirects.json
({map: {/wp-content/uploads/... : /assets/img/...}, gone: [...]}) and audit/import/unmatched-images.csv.
Matching: exact original URL -> same stem ignoring size suffix (-300x200) and extension -> unmatched (410, closest candidate listed for review)."""
import csv, json, re, difflib, urllib.parse
from pathlib import Path
R = Path(__file__).resolve().parents[2]
rows = list(csv.DictReader(open(R/'audit/seo/ARC_old_image_urls.csv')))
imap = json.load(open(R/'audit/data/img-url-map.json'))  # original URL -> /assets/img/...webp (everything build-content published)
# also every image the manifest knows, published under any page
stem = lambda u: re.sub(r'-\d+x\d+$', '', re.sub(r'\.[a-z0-9]+$', '', urllib.parse.unquote(u.rsplit('/', 1)[-1]).lower()))
by_stem = {}
for u, w in imap.items(): by_stem.setdefault(stem(u), w)
out, gone, un, kinds = {}, [], [], {'exact': 0, 'stem': 0, 'none': 0}
seen = set()
for r in rows:
    u = r['old_image_url']
    if u in seen: continue
    seen.add(u)
    path = urllib.parse.unquote(urllib.parse.urlsplit(u).path)
    if u in imap: out[path] = imap[u]; kinds['exact'] += 1; continue
    s = stem(u)
    if s in by_stem: out[path] = by_stem[s]; kinds['stem'] += 1; continue
    cand = difflib.get_close_matches(s, list(by_stem), n=1, cutoff=0.75)
    kinds['none'] += 1; gone.append(path)
    un.append([u, r['page_slug_it_belonged_to'], (by_stem[cand[0]] if cand else ''), (round(difflib.SequenceMatcher(None, s, cand[0]).ratio(), 2) if cand else ''), 'not redirected: 410 Gone (no file with this name in the export; candidate shown for review only)'])
json.dump({'map': out, 'gone': gone}, open(R/'src/lib/image-redirects.json', 'w'), separators=(',', ':'))
with open(R/'audit/import/unmatched-images.csv', 'w', newline='') as f:
    w = csv.writer(f); w.writerow(['old_image_url', 'page_slug', 'closest_candidate', 'similarity', 'plan']); w.writerows(un)
print(len(seen), 'unique old URLs;', kinds)
