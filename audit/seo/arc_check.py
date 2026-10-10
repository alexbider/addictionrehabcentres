#!/usr/bin/env python3
"""ARC migration acceptance test.

Usage:
  python3 arc_check.py https://addictionrehabcentres.vercel.app        (before DNS switch)
  python3 arc_check.py https://addictionrehabcenters.ca --live         (after DNS switch)

Needs ARC_expected_urls.csv in the same folder. Python 3.8+, no extra packages.
Prints every failure and ends with PASS or FAIL.
"""
import csv, os, re, sys, time, urllib.request, urllib.error, concurrent.futures as cf
from urllib.parse import urlsplit

CANON = "https://addictionrehabcenters.ca"
HOST = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else sys.exit(__doc__)
LIVE = "--live" in sys.argv
UA = {"User-Agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)"}
NOINDEX_OK = {"/search/", "/centre-onboarding/", "/ecstasy-addiction/", "/tranquilisers-addiction/"}  # noindex on purpose, same as the old site


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


opener = urllib.request.build_opener(NoRedirect)


def get(path, tries=4):
    """Fetch without following redirects. Retries network errors (status 0)."""
    for attempt in range(tries):
        req = urllib.request.Request(HOST + path, headers=UA)
        try:
            r = opener.open(req, timeout=40)
            return r.status, dict(r.headers), r.read().decode("utf-8", "ignore")
        except urllib.error.HTTPError as e:
            return e.code, dict(e.headers), ""
        except Exception as e:
            err = str(e)
            time.sleep(2 * (attempt + 1))
    return 0, {}, err


def loc_path(headers):
    loc = headers.get("Location") or headers.get("location") or ""
    return urlsplit(loc).path + (("?" + urlsplit(loc).query) if urlsplit(loc).query else "")


def check(row):
    p, exp, target = row["path"], row["expected_status"], row["expected_target"]
    s, h, body = get(p)
    errs = []
    if exp == "200":
        if s != 200:
            errs.append(f"expected 200, got {s} {loc_path(h)}")
        else:
            m = re.search(r'<link[^>]+rel="canonical"[^>]+href="([^"]+)"', body)
            if p in NOINDEX_OK:
                return p, errs
            want = CANON + p.split("?")[0]
            if not m:
                errs.append("no canonical tag")
            elif m.group(1) != want:
                errs.append(f"canonical is {m.group(1)}, expected {want}")
            rb = re.search(r'<meta[^>]+name="robots"[^>]+content="([^"]+)"', body)
            if rb and "noindex" in rb.group(1) and p not in NOINDEX_OK:
                errs.append(f"robots meta is '{rb.group(1)}'")
            if LIVE and "noindex" in (h.get("X-Robots-Tag", "") + h.get("x-robots-tag", "")):
                errs.append("X-Robots-Tag noindex header on live domain")
    else:
        if s not in (301, 308):
            errs.append(f"expected 301 to {target}, got {s}")
        else:
            lp = loc_path(h)
            if lp.split("?")[0] != target:
                errs.append(f"redirects to {lp}, expected {target}")
            else:
                s2, h2, _ = get(lp)
                if s2 != 200:
                    errs.append(f"target {lp} returns {s2} (chain or broken target)")
    return p, errs


def main():
    here = os.path.dirname(os.path.abspath(__file__))
    rows = list(csv.DictReader(open(os.path.join(here, "ARC_expected_urls.csv"))))
    fails = 0
    with cf.ThreadPoolExecutor(6) as ex:
        for p, errs in ex.map(check, rows):
            for e in errs:
                fails += 1
                print(f"FAIL {p}: {e}")

    # robots.txt
    s, h, body = get("/robots.txt")
    if LIVE:
        if "Disallow: /\n" in body + "\n" and "Allow: /" not in body:
            fails += 1; print("FAIL robots.txt blocks the whole site on the live domain")
        if f"Sitemap: {CANON}/sitemap.xml" not in body:
            fails += 1; print("FAIL robots.txt does not list the sitemap")

    # sitemap must only contain 200 URLs
    s, h, body = get("/sitemap.xml")
    locs = re.findall(r"<loc>([^<]+)</loc>", body)
    if not locs:
        fails += 1; print("FAIL /sitemap.xml has no URLs")
    bad_host = [l for l in locs if not l.startswith(CANON + "/")]
    for l in bad_host[:20]:
        fails += 1; print(f"FAIL sitemap URL not on {CANON}: {l}")

    def sm(l):
        return l, get(urlsplit(l).path)[0]
    with cf.ThreadPoolExecutor(6) as ex:
        for l, code in ex.map(sm, locs):
            if code != 200:
                fails += 1; print(f"FAIL sitemap URL returns {code}: {l}")

    print(f"\nChecked {len(rows)} URLs and {len(locs)} sitemap entries.")
    print("PASS" if fails == 0 else f"FAIL ({fails} problems)")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
