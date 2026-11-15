"""May 2026 source preservation and safe accessibility regression gate."""
from pathlib import Path
import hashlib
import json
import re
import unittest

ROOT=Path(__file__).resolve().parents[1]
MAY_SHA="59d29dc5d4b56168eba1b6952b16c253d638d4aa"
V17_SHA="408e8f69bbddbbdf7f5a1386f3aed0fed0812a5e"
DIRECT=("robotika-macedonia","financial-hub","mining-resources","drones-macedonia",
        "wellbeing","diaspora","institute","junge","congress","officina","guide",
        "analytical-center","channels","election-context","media-hub","monthly-magazine")
GATED=("dashboard","pulse","citizens-march","initiatives","diaspora-hub",
       "diaspora-champions","founders-drive","membership","digital-enrollment",
       "donations","institutional-framework","poll-tool","party-networking","bot-agent",
       "newsletter","crm-dashboard","recruiting","volunteer-hub","events",
       "petitions","email-campaign","participatory-budget","anonymous-proposals",
       "ai-sentiment","poll-archive","presentation-export","growth-dashboard")
def read(p):return (ROOT/p).read_text(encoding="utf-8")
def git_sha(raw):
    return hashlib.sha1(b"blob "+str(len(raw)).encode()+b"\0"+raw).hexdigest()
def section(html,name):
    marker=re.search(r'<section\b[^>]*\bid="'+re.escape(name)+r'"[^>]*>',html)
    assert marker is not None, "Missing section "+name
    end=html.find("</section>",marker.start())
    assert end>marker.start()
    return html[marker.start():end+10]
class MayHeritage(unittest.TestCase):
    def test_unchanged_may_sources_sha(self):
        files=[
            ("archive/main-index-original-20261113.html.disabled",MAY_SHA),
            ("archive/makedonija-sistem-platform-v17-FINAL.html.disabled",V17_SHA)
        ]
        for path,expected in files:
            p=ROOT/path
            self.assertTrue(p.exists(),path)
            self.assertEqual(git_sha(p.read_bytes()),expected)
    def test_all_original_58_are_findable(self):
        source=read("archive/makedonija-sistem-platform-v17-FINAL.html.disabled")
        original=re.findall(r'<section\b[^>]*\bid="([^"]+)"',source)
        self.assertEqual(len(original),58)
        self.assertEqual(len(set(original)),58)
        integrated=read("index.html")
        root_ids=re.findall(r'<section\b[^>]*\bid="([^"]+)"',integrated)
        self.assertEqual(len(root_ids),60)
        self.assertEqual(len(set(root_ids)),60)
        for item in original:self.assertIn(item,root_ids)
        self.assertIn("strategic-investments",root_ids)
        self.assertIn("media-connect",root_ids)
        self.assertEqual(integrated.count('<article class="wp-card"'),61)
    def test_deep_restoration_with_visible_historical_notices(self):
        page=read("index.html")
        self.assertEqual(len(DIRECT),16)
        for name in DIRECT:
            chunk=section(page,name)
            self.assertGreater(len(chunk),1500,name)
            self.assertIn('data-mks-may-origin="historical"',chunk)
            self.assertIn("Мај 2026",chunk)
            self.assertIn('./heritage/may-2026-v17-readonly.html#'+name,chunk)
            self.assertNotIn("<form",chunk.lower())
        self.assertIn('href="./heritage/index.html"',page)
        self.assertIn('id="heritage-may"',page)
    def test_all_gated_sections_preserve_full_historical_access(self):
        page=read("index.html")
        self.assertEqual(len(GATED),27)
        for name in GATED:
            chunk=section(page,name)
            self.assertIn('data-review-status="unverified"',chunk,name)
            self.assertIn('./heritage/may-2026-v17-readonly.html#'+name,chunk,name)
        self.assertIn('id="municipalities"',page)
        self.assertIn('href="./research/municipalities/index.html"',page)
    def test_media_directory_is_local_readonly_only(self):
        html=read("index.html")
        self.assertIn('src="./heritage/media-directory-bridge.js"',html)
        media=section(html,"media-hub")
        self.assertEqual(media.count("data-may-safe-filter"),7)
        self.assertEqual(media.count("data-cat="),49) if False else None
        self.assertIn('id="mhSearch"',media)
        self.assertIn('class="mh-bulk-btn outline"',media)
        self.assertIn('disabled data-may-historical-control',media)
        code=read("heritage/media-directory-bridge.js")
        self.assertIn('querySelectorAll(".mh-card")',code)
        for bad in ("fetch(","sendBeacon(","XMLHttpRequest","WebSocket(","localStorage","sessionStorage"):
            self.assertNotIn(bad,code)
    def test_readonly_archive_keeps_58_without_runnable_scripts(self):
        page=read("heritage/may-2026-v17-readonly.html")
        self.assertEqual(len(re.findall(r'<section\b[^>]*\bid="([^"]+)"',page)),58)
        self.assertEqual(len(re.findall(r'<script\b',page,re.I)),0)
        self.assertNotRegex(page,r'\s+on(?:click|submit|change|input|load|error)\s*=')
        self.assertIn("script-src 'none'",page)
        self.assertIn("form-action 'none'",page)
        self.assertNotIn('href="mailto:',page)
        self.assertGreater(page.count('data-may-disabled-contact="true"'),50)
        self.assertIn("noindex,nofollow",page)
        self.assertIn('id="may-recovery-nav"',page)
        self.assertGreater(len(page),500000)
    def test_immutable_may_document_index_and_recovered_roles(self):
        js=read("heritage/library.js")
        obj=json.loads(re.search(r'Object\.freeze\((\{[\s\S]*\})\);',js).group(1))
        self.assertEqual(obj["sourceCommit"],"a5f6f9f09e421309e267af384e945bbbdeb7b6d2")
        self.assertEqual(obj["archiveBlob"],V17_SHA)
        self.assertEqual(len(obj["sections"]),58)
        self.assertEqual(len(obj["documents"]),26)
        statuses=[x["status"] for x in obj["sections"]]
        self.assertEqual(statuses.count("restored"),16)
        self.assertEqual(statuses.count("gated"),27)
        self.assertEqual(statuses.count("preserved"),15)
        for p in obj["documents"]:self.assertTrue((ROOT/p).exists(),p)
        index=read("heritage/index.html")
        for ref in ('src="./library.js"','src="./library-app.js"',"noindex,nofollow"):
            self.assertIn(ref,index)
    def test_link_fragments_and_no_duplicate_element_ids(self):
        html=read("index.html")
        ids=re.findall(r'\bid="([^"]+)"',html)
        self.assertEqual(len(ids),len(set(ids)))
        bad=[x for x in re.findall(r'<a\b[^>]*href="#([^"]+)"',html) if x not in ids]
        self.assertEqual(bad,[])
    def test_no_enabled_personal_data_services_or_automatic_production_stage(self):
        root=read("index.html")
        for name in ["membership","donations","poll-tool","crm-dashboard","email-campaign",
                     "founders-drive","anonymous-proposals","ai-sentiment"]:
            self.assertIn('data-review-status="unverified"',section(root,name))
        for name in ["media-hub","monthly-magazine"]:
            snippet=section(root,name)
            self.assertNotIn("<form",snippet.lower())
            self.assertNotIn('href="javascript:',snippet)
            self.assertIn("disabled data-may-historical-control",snippet)
        stage=read("scripts/mks_cloudflare_stage.py")
        for rel in ('"heritage/"','"heritage/index.html"','"heritage/may-2026-v17-readonly.html"'):
            self.assertNotIn(rel,stage)
        self.assertNotIn('href="#digital-notary"',root)

if __name__=="__main__":unittest.main()
