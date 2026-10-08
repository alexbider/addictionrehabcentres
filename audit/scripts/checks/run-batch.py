"""usage: python3 run-batch.py <n> <start> <end>   build batch n (centres [start:end] alphabetical), run checks, exit 1 on problems."""
import json,random,subprocess,sys,re,os
n,start,end=int(sys.argv[1]),int(sys.argv[2]),int(sys.argv[3])
R='/Users/mac/Downloads/arc-next'; os.chdir(R)
out=f'audit/shots/centre-batch{n}'; os.makedirs(out,exist_ok=True)
idx=json.load(open('content/_index.json'))
c=sorted(e['slug'].replace('centre__','') for e in idx if e['type']=='centre' and e['published'])
batch=c[start:end]
sz=open('src/lib/centre.ts').read()
sz=re.sub(r'export const BATCH_SIZE = \d+;','export const BATCH_SIZE = %d;'%end,sz); open('src/lib/centre.ts','w').write(sz)
info={}
for s in batch:
    d=json.load(open(f'content/centre__{s}.json')); ce=d['centre']; t=json.dumps(ce['about_blocks'])
    info[s]=dict(w=d['word_count'],emb=('"iframe"' in t or '"video"' in t),vid='"video"' in t,faq=len(ce['faqs']),info=bool(ce['info_items']),route=d['route'])
random.seed(n)
longest=sorted(batch,key=lambda s:-info[s]['w'])[:6]
emb=[s for s in batch if info[s]['emb'] and s not in longest][:6]
faq=[s for s in batch if info[s]['faq'] and s not in longest+emb][:2]
inf=[s for s in batch if info[s]['info']][:2]
mini=sorted(batch,key=lambda s:info[s]['w'])[:2]
sl=[s for s in batch if '/search-listing/' in info[s]['route']][:2]
ov=list(dict.fromkeys(longest+emb+faq+inf+mini+sl)); rest=[s for s in batch if s not in ov]; ov+=random.sample(rest,max(0,18-len(ov)))
vids=[s for s in batch if info[s]['vid']]
shots=random.sample([s for s in batch if s not in vids],5)+(random.sample(vids,1) if vids else [])
json.dump(dict(slugs=batch,overflow=ov,shots=shots,videos=vids),open(f'{out}/batch.json','w'),indent=1)
def sh(cmd):
    r=subprocess.run(cmd,shell=True,capture_output=True,text=True); return r
b=sh('npm run build 2>&1'); open(f'{out}/build.log','w').write(b.stdout+b.stderr)
if b.returncode!=0: print('BUILD FAILED'); sys.exit(1)
sh('lsof -ti :3100 | xargs kill; sleep 1'); subprocess.Popen('nohup npx next start -p 3100 >/dev/null 2>&1 &',shell=True)
import time; time.sleep(8)
r=sh(f'node audit/scripts/checks/centre-batch.mjs {out} {out}/batch.json all'); open(f'{out}/run.log','w').write(r.stdout+r.stderr)
log=r.stdout
m=re.search(r'pages checked: (\d+), pages with problems: (\d+), total missing words: (\d+)',log); o=re.search(r'overflow pages: (\d+), with sideways scroll: (\d+)',log)
print(f'batch {n}: pages {batch[0]}..{batch[-1]} ({len(batch)})'); print(m.group(0) if m else 'NO FIDELITY RESULT'); print(o.group(0) if o else 'NO OVERFLOW RESULT')
bad = (not m) or (not o) or m.group(2)!='0' or m.group(3)!='0' or o.group(2)!='0'
for line in log.splitlines():
    if line.startswith('PROBLEM'): print(line[:300])
sys.exit(1 if bad else 0)
