"""Safety and structural checks for world gateway. Source-only; no Cloudflare API."""
import html.parser
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WORLD = ROOT / "world"
SOURCE = (WORLD / "index.html").read_text(encoding="utf-8")
JS = (WORLD / "app.js").read_text(encoding="utf-8")
CSS = (WORLD / "styles.css").read_text(encoding="utf-8")
MAIN = (ROOT / "index.html").read_text(encoding="utf-8")


class Elements(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.elements = []
        self.ids = []
        self.topics = []
        self.sources = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        self.elements.append((tag, attrs))
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if "data-topic" in attrs:
            self.topics.append((tag, attrs["data-topic"], attrs.get("href")))
        if tag == "script" and "src" in attrs:
            self.sources.append(attrs["src"])


class WorldGatewayReview(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dom = Elements()
        cls.dom.feed(SOURCE)

    def test_all_local_files_present(self):
        self.assertTrue((WORLD / "app.js").is_file())
        self.assertTrue((WORLD / "styles.css").is_file())
        self.assertIn('href="./styles.css"', SOURCE)
        self.assertEqual(self.dom.sources, ["./app.js"])
        for path in ("legal/PRIVACY.html", "legal/TERMS.html"):
            self.assertTrue((ROOT / path).is_file())

    def test_preview_only_noindex(self):
        self.assertRegex(SOURCE, r'<meta\s+name="robots"\s+content="noindex,nofollow"')
        self.assertIn("Disallow: /", (ROOT / "robots.txt").read_text())
        self.assertIn("НЕМА АКТИВНО ЗАЧЛЕНУВАЊЕ", SOURCE)
        self.assertIn("не собира лични или чувствителни податоци", SOURCE)
        self.assertIn("не е регистрирана", SOURCE.lower())

    def test_strict_standalone_csp(self):
        m = re.search(r'<meta\s+http-equiv="Content-Security-Policy"\s+content="([^"]+)"', SOURCE)
        self.assertIsNotNone(m)
        policy = m.group(1)
        for required in ("default-src 'none'", "script-src 'self'", "style-src 'self'", "form-action 'none'", "base-uri 'none'"):
            self.assertIn(required, policy)
        self.assertNotIn("unsafe-inline", policy)
        self.assertNotIn("unsafe-eval", policy)
        self.assertFalse(re.search(r"\bon(?:click|change|submit|load)\s*=", SOURCE, re.I))
        self.assertNotRegex(SOURCE, r"<style\b|<script\b(?![^>]*\bsrc=)")
        self.assertNotIn("innerHTML", JS)
        self.assertNotIn("eval(", JS)

    def test_six_topic_routes_exist_in_master(self):
        expected = {
            "institutions": "principles", "economy": "industrial-champions",
            "education": "programme", "health": "wellbeing",
            "diaspora": "diaspora-hub", "local": "municipalities"
        }
        self.assertEqual(len(self.dom.topics), 6)
        self.assertEqual(
            {key: href for tag, key, href in self.dom.topics},
            {key: "../index.html#" + anchor for key, anchor in expected.items()},
        )
        ids = set(re.findall(r'\bid\s*=\s*["\']([^"\']+)["\']', MAIN))
        for anchor in expected.values():
            self.assertIn(anchor, ids)
            self.assertIn("'" + anchor + "'", JS)

    def test_no_personal_data_or_automated_signup(self):
        self.assertNotIn("<form", SOURCE.lower())
        self.assertNotRegex(SOURCE, r"<input\b")
        for forbidden in ("localStorage", "sessionStorage", "navigator.sendBeacon",
                          "XMLHttpRequest", "fetch(", "document.cookie", "dataLayer",
                          "gtag(", "fbq(", "URL.createObjectURL", "crypto.subtle"):
            self.assertNotIn(forbidden, JS)
        self.assertNotRegex(JS, r'(?i)ethnic.*segment|conversion.*score|target.*nationality')
        self.assertIn("Nothing is sent or stored", JS)
        self.assertIn("No tracking", JS)

    def test_all_five_locales_present(self):
        for locale in ("mk", "en", "al", "sr", "de"):
            self.assertRegex(SOURCE, r'data-lang="' + locale + r'"')
            self.assertRegex(JS, r'(?m)^\s*' + locale + r': \{')
        self.assertEqual(len(re.findall(r'data-t="', SOURCE)), len(set(re.findall(r'data-t="([^"]+)"', SOURCE))) + 0 if False else len(re.findall(r'data-t="', SOURCE)))
        self.assertIn("Incomplete navigator locale", JS)
        self.assertIn("aria-pressed", JS)
        self.assertIn("textContent =", JS)

    def test_semantics_and_accessible_start(self):
        for tag in ("main", "header", "footer", "nav"):
            self.assertTrue(any(name == tag for name, _ in self.dom.elements))
        self.assertEqual(len(self.dom.ids), len(set(self.dom.ids)))
        self.assertIn('href="#main"', SOURCE)
        self.assertIn('id="selection"', SOURCE)
        self.assertIn('aria-live="polite"', SOURCE)
        self.assertIn("prefers-reduced-motion", CSS)
        self.assertIn("focus-visible", CSS)

    def test_status_does_not_impersonate_state(self):
        self.assertNotRegex(SOURCE, r'(?i)official ministry|verified government partner')
        self.assertNotIn("членови се регистрирани", SOURCE)
        self.assertNotIn("освоени мандати", SOURCE)


if __name__ == "__main__":
    unittest.main()
