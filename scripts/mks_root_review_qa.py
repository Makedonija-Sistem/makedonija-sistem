#!/usr/bin/env python3
"""Non-deploy static gate for MKS PR #3. Offline, stdlib-only."""
import hashlib
import json
import re
import subprocess
from pathlib import Path

root = Path(__file__).resolve().parents[1]
html = (root/'index.html').read_text(encoding='utf-8')
readme=(root/'README.md').read_text(encoding='utf-8')
privacy=(root/'legal/PRIVACY.html').read_text(encoding='utf-8')
failures=[]
passed=[]

def check(ok, description):
    (passed if ok else failures).append(description)

check('<meta name="robots" content="noindex,nofollow">' in html,
      'review-only noindex remains active')
check('v0.1.3-preview' in (root/'VERSION').read_text(encoding='utf-8'),
      'content version is transparent')
check('review/root-cutover-v0.1.6' in readme and 'DO NOT MERGE' in readme,
      'README truthfully describes PR, versions and release boundary')
check('GitHub Pages' in privacy and 'Cloudflare' not in privacy,
      'GitHub candidate hosting description is corrected')
check((root/'archive/README_main_2026-05-11.md.disabled').exists(),
      'old README preserved')
check((root/'archive/main-index-original-20261113.html.disabled').exists(),
      'old index preserved')
for bad in ['Qualified Electronic Signature: VALID',
            'Document legally binding under ZEDEIDU',
            '5,420 ', '87 of 167 active notaries',
            '0% errors, 100% legal certainty',
            'Анонимниот предлог е поднесен и чека модерација!',
            'mailto:[EMAIL']:
    check(bad not in html, 'no unsanctioned demo marker: '+bad[:50])
check(not re.search(r'(?<![0-9])12,847(?![0-9])', html),
      'no invented supporter tally 12,847')
for marker in ['PARTY NETWORKING SYSTEM','MUNICIPALITIES DIRECTORY',
               'MAGAZINE V2','DIASPORA ENGAGEMENT HUB',
               'DIASPORA TOTAL INTEGRATION']:
    check(not any(marker in body for body in re.findall(r'<script\b[^>]*>(.*?)</script>', html, re.I|re.S)), 'legacy inactive executable module removed: '+marker)
check('id="magModal"' not in html, 'inactive unverified magazine modal removed')
check('const KB = {' not in html and 'const PATTERNS' not in html,
      'unsafe canned assistant knowledge base removed')
check('document.createTextNode(String(text))' in html,
      'chat user input is rendered as text rather than HTML')
check('The automated knowledge assistant is disabled' in html,
      'review-only bot response is truthful')
check('data-review-status="unverified"' in html,
      'review status present')
check('start_url' in (root/'manifest.json').read_text(encoding='utf-8'),
      'manifest present')
try:
    json.loads((root/'manifest.json').read_text(encoding='utf-8'))
    passed.append('manifest parses as JSON')
except Exception as e:
    failures.append('manifest failed to parse: '+str(e))
for path in ['index.html','404.html','VERSION','sw.js','robots.txt',
             'legal/PRIVACY.html','legal/TERMS.html',
             'assets/icons/icon.svg','assets/og/og-image.png']:
    check((root/path).is_file(),'file exists: '+path)

# Script syntax: only JavaScript script tags, not JSON-LD.
scripts=[]
for attrs, body in re.findall(r'<script\b([^>]*)>(.*?)</script>', html, re.I|re.S):
    if 'application/ld+json' in attrs.lower():
        try:
            json.loads(body)
            passed.append('JSON-LD parses')
        except json.JSONDecodeError:
            failures.append('JSON-LD does not parse')
        continue
    if re.search(r'\bsrc\s*=', attrs):
        continue
    scripts.append(body)
    p=root/'.qa_temp_js'
    p.write_text(body,encoding='utf-8')
    try:
        result=subprocess.run(['node','--check',str(p)],text=True,capture_output=True)
    except FileNotFoundError:
        failures.append('node not installed: cannot test scripts')
        break
    if result.returncode:
        failures.append('JavaScript syntax failure: '+result.stderr[:200])
    else:
        passed.append('JavaScript syntax PASS')
    p.unlink(missing_ok=True)
try:
    check(subprocess.run(['node','--check',str(root/'sw.js')],text=True,capture_output=True).returncode==0,
          'passive service worker syntax')
except FileNotFoundError:
    failures.append('node not installed: cannot test service worker')

print(json.dumps({'status': 'FAIL' if failures else 'PASS',
                  'passed':len(passed),'failed':len(failures),
                  'script_count':len(scripts),
                  'failures':failures},indent=2,ensure_ascii=False))
if failures:raise SystemExit(1)
