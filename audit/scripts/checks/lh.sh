#!/bin/bash
# usage: lh.sh <tag>   -> audit/data/lh-<tag>/<type>.json and audit/data/lighthouse-<tag>.txt  (mobile, perf+a11y+best-practices+seo; Chrome on 9333)
tag=$1; mkdir -p audit/data/lh-$tag; : > audit/data/lighthouse-$tag.txt
for p in "home|/" "centre|/addiction-rehab-toronto/" "blog-post|/10-drug-addiction-facts-you-need-to-know/" "drug|/heroin-addiction/" "province|/ontario-rehabs/" "city-archive|/listing-location/toronto/" "blog|/blog/" "alcohol|/alcohol-addiction-treatment/" "document|/about-us/" "category|/category/helpful-articles/"; do
  n=${p%%|*}; u=${p#*|}
  npx --yes lighthouse "http://localhost:3100$u" --port=9333 --only-categories=performance,accessibility --form-factor=mobile --output=json --output-path=audit/data/lh-$tag/$n.json --quiet >/dev/null 2>&1
  python3 - "$n" "$tag" <<'P' >> audit/data/lighthouse-$tag.txt
import json,sys
n,tag=sys.argv[1:3]
try:
    d=json.load(open(f'audit/data/lh-{tag}/{n}.json')); c=d['categories']; a=d['audits']
    print(n,{k:round(v['score']*100) for k,v in c.items()},'LCP',a['largest-contentful-paint']['displayValue'],'TBT',a['total-blocking-time']['displayValue'],'CLS',a['cumulative-layout-shift']['displayValue'],'FCP',a['first-contentful-paint']['displayValue'])
except Exception as e: print(n,'ERR',e)
P
done
cat audit/data/lighthouse-$tag.txt
