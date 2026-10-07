#!/usr/bin/env python3
import argparse,json,re
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('input');p.add_argument('output');a=p.parse_args()
s=Path(a.input).read_text(encoding='utf-8-sig').replace('\r\n','\n')
pattern=r'(?P<a>(?:\d{2,}:)?\d{2}:\d{2}[,.]\d{3})\s*-->\s*(?P<b>(?:\d{2,}:)?\d{2}:\d{2}[,.]\d{3})[^\n]*\n(?P<t>.*?)(?=\n\s*\n|\Z)'
def sec(v):return sum(float(x)*60**i for i,x in enumerate(reversed(v.replace(',','.').split(':'))))
cues=[]
for m in re.finditer(pattern,s,re.S):
 start,end=sec(m['a']),sec(m['b'])
 if end<=start:raise SystemExit('Invalid cue duration')
 cues.append({'start':start,'end':end,'text':re.sub('<[^>]+>','',m['t']).strip()})
if not cues:raise SystemExit('No timed cues found. Plain text needs timing before export.')
cues.sort(key=lambda c:c['start'])
Path(a.output).write_text(json.dumps({'durationEstimate':max(c['end'] for c in cues),'durationSource':'last subtitle end; verify silent tail','cues':cues},ensure_ascii=False,indent=2))
print(f'{len(cues)} cues parsed')
