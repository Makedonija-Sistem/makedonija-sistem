"""MKS section source-of-truth recovery gate. No deploy, no personal-data processing."""
from pathlib import Path
import re
import json
import unittest
ROOT=Path(__file__).resolve().parents[1]
def read(name):return (ROOT/name).read_text(encoding="utf-8")
class SectionRecovery(unittest.TestCase):
    def test_58_original_section_identifiers_preserved(self):
        s=read("index.html")
        ids=re.findall(r'<section\b[^>]*\bid="([^"]+)"',s)
        # The unified review adds the legitimate strategic-investments and media-connect sections.
        self.assertEqual(len(ids),60)
        self.assertEqual(len(set(ids)),60)
        for need in ["municipalities","initiatives","diaspora","events","petitions","membership","world-parties"]:
            self.assertIn(need,ids)
        self.assertIn("strategic-investments",ids)
        self.assertIn("media-connect",ids)
    def test_all_fragment_links_have_unique_targets(self):
        s=read("index.html")
        ids=re.findall(r'\bid="([^"]+)"',s)
        fragments=re.findall(r'<a\b[^>]*href="#([^"]+)"',s)
        self.assertEqual(len(ids),len(set(ids)))
        self.assertEqual([v for v in fragments if v not in ids],[])
    def test_municipal_directory_link_and_status(self):
        s=read("index.html")
        self.assertEqual(s.count('href="./research/municipalities/index.html"'),2)
        section=s.split('<section id="municipalities"',1)[1].split("</section>",1)[0]
        self.assertIn('data-review-status="informational"',section)
        self.assertNotIn("Активен координатор",section)
        self.assertNotIn("ЗЕЛС — Партнер",section)
        self.assertNotIn("59",section)
    def test_known_legacy_services_still_disabled(self):
        s=read("index.html")
        for id in ["membership","digital-enrollment","poll-tool","donations","anonymous-proposals"]:
            section=s.split('<section id="'+id+'"',1)[1].split("</section>",1)[0]
            self.assertIn("data-review-status=\"unverified\"",section)
        media=s.split('<section id="media-hub"',1)[1].split("</section>",1)[0]
        self.assertIn('data-mks-recovery-status="read-only"',media)
        self.assertIn("disabled data-may-historical-control",media)
        self.assertIn('<meta name="robots" content="noindex,nofollow">',s)
    def test_official_municipality_source(self):
        s=read("research/municipalities/data.js")
        self.assertIn("regionite-vo-rm-2026-web.pdf",s)
        self.assertEqual(s.count('id:"'),8)
        self.assertNotIn("Активен",s)
        self.assertNotIn("координатор",s.lower())
        page=read("research/municipalities/index.html")
        self.assertIn("connect-src 'none'",page)
        self.assertIn('src="./data.js"',page)
        self.assertIn('src="./app.js"',page)
        self.assertNotIn("<form",page)
        self.assertIn("не се пренесени",page)
    def test_original_svg_and_archived_contacts_are_restored(self):
        page=read("research/municipalities/index.html")
        self.assertIn('id="municipalityMap"',page)
        self.assertIn('src="./legacy-links.js"',page)
        self.assertEqual(page.count('class="region-shape" role="button" tabindex="0"'),8)
        self.assertIn("Стилизирана",page)
        self.assertNotIn("ЗЕЛС — Партнер",page)
        self.assertNotIn("Активен координатор",page)
        data=read("research/municipalities/legacy-links.js")
        match=re.search(r"Object\.freeze\((\{[\s\S]*?\})\);",data)
        self.assertIsNotNone(match)
        obj=json.loads(match.group(1))
        self.assertEqual(len(obj["rows"]),80)
        self.assertEqual(obj["verification"],"ARCHIVED_WEBSITES_NOT_LIVE_CHECKED")
        self.assertEqual(len({x["name"] for x in obj["rows"]}),80)
        self.assertEqual(len({x["web"] for x in obj["rows"]}),80)
        for item in obj["rows"]:
            self.assertRegex(item["web"],r"^[a-z0-9.-]+\.gov\.mk$")
            self.assertTrue(item["center"])
            self.assertTrue(isinstance(item["archivePopulation"],int))
        self.assertFalse(any("mayor" in x or "coord" in x for x in obj["rows"]))
        self.assertIn("historical MKS v17",data)
        app=read("research/municipalities/app.js")
        self.assertIn('aria-pressed',app)
        self.assertIn('addEventListener("keydown"',app)
        self.assertIn('referrerPolicy="no-referrer"',app)
        self.assertIn('recordByName',app)
        self.assertIn('details',app)
        self.assertNotIn("innerHTML",app)
        self.assertNotIn("fetch(",app)
    def test_safe_loading_and_no_prod(self):
        s=read("research/municipalities/app.js")
        self.assertIn("replaceChildren",s)
        for danger in ["eval(","innerHTML","fetch(","XMLHttpRequest","localStorage","sessionStorage","sendBeacon"]:
            self.assertNotIn(danger,s)
        stage=read("scripts/mks_cloudflare_stage.py")
        self.assertNotIn('"research/municipalities/"',stage)
if __name__=="__main__":
    unittest.main()
