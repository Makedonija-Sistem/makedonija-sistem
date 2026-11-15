"""Cross-PR reconciliation checks. These do not authorize deployment."""
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
def read(p): return (ROOT/p).read_text(encoding="utf-8")

class UnifiedMKSReview(unittest.TestCase):
    def test_sections_and_links_once(self):
        x=read("index.html")
        for target in ('id="strategic-investments"','id="media-connect"',
                       'href="#media-connect"',
                       'href="./research/party-tech/"','href="./research/strategic-investments.html"'):
            self.assertEqual(x.count(target),1,target)
        # Two intentional links: directory from Channels and the dedicated section.
        self.assertEqual(x.count('href="./media-connect/"'),2)

    def test_original_61_and_research_integration(self):
        x=read("index.html")
        segment=x[x.index('<section id="world-parties"'):x.index('</section>', x.index('<section id="world-parties"'))]
        self.assertEqual(segment.count('<article class="wp-card"'),61)
        self.assertIn('id="wpGrid"',segment)
        self.assertTrue((ROOT/"research/party-tech/index.html").is_file())
        self.assertTrue((ROOT/"research/party-tech/evidence.js").is_file())

    def test_legal_programme_and_investments(self):
        p=read("legal/PROGRAM.md")
        for chapter in ("## XVI.","## XVII.","## XVIII.","## XIX.","## XX.","## XXI."):
            self.assertIn(chapter,p)
        self.assertIn("најмалку 10%",p)
        self.assertIn("НЕУСВОЕН",p)
        self.assertIn("DRAFT",read("legal/STATUTE.md"))
        self.assertTrue((ROOT/"research/strategic-investments.html").is_file())

    def test_media_client_and_locked_gateway(self):
        for path in ("media-connect/index.html","media-connect/room.html",
                     "media-connect/room.js","media-connect/room-config.js",
                     "media-connect/worker/token-worker.mjs",
                     "media-connect/tests/token-worker.test.mjs"):
            self.assertTrue((ROOT/path).is_file(),path)
        self.assertIn("enabled:false",read("media-connect/room-config.js"))
        self.assertIn('HUMAN_GATE_APPROVED',read("media-connect/worker/token-worker.mjs"))
        self.assertIn('href="./room.html"',read("media-connect/index.html"))

    def test_review_not_production(self):
        x=read("index.html")
        self.assertIn('name="robots" content="noindex,nofollow"',x)
        stage=read("scripts/mks_cloudflare_stage.py")
        self.assertNotIn('"media-connect/"',stage)
        self.assertNotIn('"research/party-tech/"',stage)
        self.assertNotIn('"research/strategic-investments.html"',stage)

    def test_technical_test_packages_present(self):
        for path in ("scripts/test_mks_party_tech_research.py",
                     "scripts/test_mks_media_connect.py",
                     "scripts/mks_party_tech_browser.cjs",
                     "scripts/mks_media_connect_browser.cjs",
                     ".github/workflows/mks-party-tech-review.yml",
                     ".github/workflows/mks-media-connect-pilot-review.yml"):
            self.assertTrue((ROOT/path).is_file(),path)

if __name__ == "__main__":
    unittest.main()
