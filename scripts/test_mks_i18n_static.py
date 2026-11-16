#!/usr/bin/env python3
"""Offline MKS five-language review gate. No deployment or network calls."""
from pathlib import Path
import json,re,subprocess,sys
root=Path(__file__).resolve().parents[1]
html=(root/"index.html").read_text(encoding="utf-8")
js=(root/"assets/i18n/mks-i18n-repair.js").read_text(encoding="utf-8")
issues=[]
def check(ok,what):
    if not ok: issues.append(what)
match=re.search(r"const EXTRA = (\{[^\n]+\});",js)
check(bool(match),"extension translations JSON present")
data=json.loads(match.group(1)) if match else {}
keysets=[set(d.keys()) for d in data.values()]
check(set(data)=={"en","al","sr","de"},"exactly four extension locales")
check(bool(keysets) and len({tuple(sorted(s)) for s in keysets})==1,"keysets identical across target languages")
check(bool(keysets) and len(keysets[0])==61,"all 61 known absent keys covered")
for lang,values in data.items():
    for key,value in values.items():
        check(key.startswith("ind.") and re.fullmatch(r"ind\.c\d+\.[a-z0-9]+",key)!=None,"industrial key "+key)
        check(bool(value.strip()),"nonempty "+lang+":"+key)
        check("<script" not in value.lower() and "javascript:" not in value.lower(),"safe local text "+lang+":"+key)
        check(value.count("<strong>")==value.count("</strong>"),"balanced bold "+lang+":"+key)
        check('data-i18n="'+key+'"' in html,"key exists in page "+key)
check(html.count('src="assets/i18n/mks-i18n-repair.js?v=0.2.0"')==1,"exactly one deferred, relative script")
check('id="langSwitcher"' in html,"existing language controls retained")
check('function setLanguage(lang)' in html and "window.t = t" in html,"base language engine retained")
check('<symbol id="ms-sigil"' in html,"original logo retained")
check("fetch(" not in js and "XMLHttpRequest" not in js and "sendBeacon" not in js,
      "no translation network transport")
for file in ["index.html","assets/icons/icon.svg","assets/i18n/mks-i18n-repair.js"]:
    check((root/file).is_file(),"file exists "+file)
for path in [root/"assets/i18n/mks-i18n-repair.js"]:
    run=subprocess.run(["node","--check",str(path)],capture_output=True,text=True)
    check(run.returncode==0,run.stderr[:500] or "external JS syntax")
scripts=re.findall(r"<script\b([^>]*)>(.*?)</script>",html,re.I|re.S)
for a,b in scripts:
    if "application/ld+json" in a or re.search(r"\bsrc\s*=",a):continue
    p=root/".i18n_qa_temp.js"
    p.write_text(b,encoding="utf-8")
    run=subprocess.run(["node","--check",str(p)],capture_output=True,text=True)
    p.unlink(missing_ok=True)
    check(run.returncode==0,run.stderr[:500] or "inline JS syntax")
result={"status":"FAIL" if issues else "PASS","extended_key_count":len(keysets[0]) if keysets else 0,"locales":sorted(data),"missing":issues[:40],"checks":"static/Node/no-network"}
print(json.dumps(result,ensure_ascii=False,indent=2))
sys.exit(bool(issues))
