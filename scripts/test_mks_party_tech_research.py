"""Read-only verification for Global Party Atlas technology evidence layer.

No political persuasion, visitor identity collection, private systems, or deployment.
"""
from __future__ import annotations

from collections import Counter
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import unittest
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1]
ATLAS = (ROOT / "index.html").read_text(encoding="utf-8")
PAGE = (ROOT / "research/party-tech/index.html").read_text(encoding="utf-8")
APP = (ROOT / "research/party-tech/app.js").read_text(encoding="utf-8")
STYLE = (ROOT / "research/party-tech/styles.css").read_text(encoding="utf-8")
EVIDENCE = (ROOT / "research/party-tech/evidence.js").read_text(encoding="utf-8")
STAGER = (ROOT / "scripts/mks_cloudflare_stage.py").read_text(encoding="utf-8")


def json_assigned(text: str, name: str) -> dict:
    match = re.search(r"(?m)^(?:export )?const " + re.escape(name) + r" = (\{[\s\S]*?\});\s*(?:\n|$)", text)
    if not match:
        raise AssertionError("Cannot find literal JSON assignment: " + name)
    return json.loads(match.group(1))


DATA = json_assigned(EVIDENCE, "TECH_EVIDENCE")
TRANSLATIONS = json_assigned(APP, "TRANSLATIONS")


def atlas_section() -> str:
    first = ATLAS.index('<section id="world-parties"')
    end = ATLAS.index("</section>", first)
    return ATLAS[first:end]


def extracted_party_cards():
    # Cards retain names/countries/websites in canonical HTML; no second catalogue.
    section = atlas_section()
    return [
        {
            "block": match.group(1),
            "name": re.search(r'<strong>(.*?)</strong>', match.group(2), re.S).group(1),
            "country": re.search(r'class="wp-country">(.*?)</span>', match.group(2), re.S).group(1),
            "url": re.search(r'class="wp-web"><a href="([^"]+)"', match.group(2), re.S).group(1).rstrip("/"),
        }
        for match in re.finditer(
            r'<article class="wp-card" data-block="([^"]+)"[^>]*>([\s\S]*?)</article>', section
        )
    ]


class ResearchTechnologyAtlasTests(unittest.TestCase):
    def test_canonical_atlas_still_has_61_unique_profiles(self):
        cards = extracted_party_cards()
        self.assertEqual(len(cards), 61)
        self.assertEqual(len({x["url"] for x in cards}), 61)
        self.assertEqual(sum(Counter(x["block"] for x in cards).values()), 61)
        for c in cards:
            self.assertTrue(c["name"] and c["country"])
            self.assertTrue(c["url"].startswith("https://"))

    def test_original_atlas_cross_link_is_in_correct_section(self):
        section = atlas_section()
        self.assertIn('id="world-party-technology"', section)
        self.assertIn('href="./research/party-tech/"', section)
        self.assertEqual(section.count('href="./research/party-tech/"'), 1)
        self.assertEqual(section.count('id="wpGrid"'), 1)
        self.assertEqual(section.count('data-filter="all"'), 1)
        self.assertIn("Истражувачки каталог".upper(), section.upper())

    def test_geographic_region_counts_reconcile_without_double_counting(self):
        cards = extracted_party_cards()
        self.assertIn("42 партии", atlas_section())
        self.assertIn("8 партии", atlas_section())
        self.assertIn("5 партии", atlas_section())
        self.assertIn("2 партии", atlas_section())
        self.assertIn("4 партии", atlas_section())
        self.assertEqual(42 + 8 + 5 + 2 + 4, len(cards))
        # Regional source of truth is a static, documented, deterministic country map.
        c = json.loads(re.search(r"europe:(\[[^\n]+\]),\namericas:", APP).group(1))
        self.assertIn("Македонија", c)
        self.assertIn("Велика Британија", c)
        self.assertIn("Ирска · Сев. Ирска", c)
        self.assertNotIn("14 партии", atlas_section().split("<!-- Parties grid -->")[0])

    def test_new_research_uses_existing_atlas_as_source(self):
        self.assertIn("fetch('../../index.html'", APP)
        self.assertIn("new DOMParser().parseFromString(html,'text/html')", APP)
        self.assertIn("'#world-parties #wpGrid > article.wp-card'", APP)
        self.assertIn("if(cards.length!==61)", APP)
        self.assertIn("Duplicate canonical party websites", APP)
        self.assertNotIn('data-party-name=', PAGE)

    def test_all_record_keys_match_canonical_atlas(self):
        party_urls = {c["url"] for c in extracted_party_cards()}
        record_urls = set(DATA["records"])
        self.assertEqual(len(record_urls), 15)
        self.assertTrue(record_urls.issubset(party_urls))
        self.assertIn("https://bjp.org", record_urls)
        self.assertIn("https://alp.org.au", record_urls)
        self.assertIn("Victorian Labor", DATA["records"]["https://alp.org.au"]["signals"][0]["title"])
        self.assertIn("2023", next(case["note"] for case in DATA["outside_atlas"] if case["name"] == "Podemos"))
        self.assertEqual(DATA["schema_version"], 1)
        self.assertEqual(DATA["snapshot_date"], "2026-11-15")

    def test_20_capabilities_have_exact_source_references(self):
        source_ids = set(DATA["sources"])
        self.assertEqual(len(source_ids), 25)
        count = 0
        dimensions = {d["id"] for d in DATA["dimensions"]}
        for url, doc in DATA["records"].items():
            self.assertTrue(url.startswith("https://"))
            self.assertGreaterEqual(len(doc["signals"]), 1)
            for signal in doc["signals"]:
                count += 1
                self.assertIn(signal["dimension"], dimensions)
                self.assertTrue(signal["summary"] and signal["title"])
                self.assertEqual(signal["verification"], "documented-public-claim")
                self.assertGreaterEqual(len(signal["source_ids"]), 1)
                for source in signal["source_ids"]:
                    self.assertIn(source, source_ids)
        self.assertEqual(count, 24)

    def test_source_urls_are_https_and_provider_status_explicit(self):
        for ref, source in DATA["sources"].items():
            url = urlsplit(source["url"])
            self.assertEqual(url.scheme, "https", ref)
            self.assertTrue(url.netloc, ref)
            self.assertIn(source["type"], ("party", "provider"))
            self.assertTrue(source["title"] and source["publisher"])
        self.assertEqual(DATA["sources"]["actblue-about"]["type"], "provider")
        self.assertEqual(DATA["sources"]["winred-about"]["type"], "provider")
        self.assertIn("not a security audit", DATA["evidence_standard"].lower())

    def test_outside_examples_remain_distinct_from_main_catalogue(self):
        extra = DATA["outside_atlas"]
        self.assertEqual(len(extra), 3)
        self.assertEqual({x["name"] for x in extra}, {"La France insoumise", "Movimento 5 Stelle", "Podemos"})
        for case in extra:
            self.assertIn(case["source_id"], DATA["sources"])
        self.assertNotIn("La France insoumise", {c["name"] for c in extracted_party_cards()})

    def test_five_languages_cover_every_visible_ui_key(self):
        keys = set(re.findall(r'data-t="([^"]+)"', PAGE))
        self.assertGreaterEqual(len(keys), 50)
        self.assertEqual(keys - set(TRANSLATIONS), set())
        for name, values in TRANSLATIONS.items():
            self.assertEqual(len(values), 5, name)
            self.assertTrue(all(isinstance(x, str) and x.strip() for x in values), name)
        self.assertIn("data-lang=\"mk\"", PAGE)
        for lang in ["en", "al", "sr", "de"]:
            self.assertIn('data-lang="' + lang + '"', PAGE)
        for dimension in DATA["dimensions"]:
            self.assertTrue(all(dimension.get(lang) for lang in ["mk", "en", "al", "sr", "de"]))

    def test_all_nine_institutional_layers_show_truthful_states(self):
        for i in range(1, 10):
            self.assertIn("synth." + str(i) + ".title", TRANSLATIONS)
            self.assertIn("synth." + str(i) + ".desc", TRANSLATIONS)
            self.assertIn('class="synth-n">' + str(i).zfill(2), PAGE)
        self.assertEqual(PAGE.count('class="synth-card"'), 9)
        self.assertEqual(PAGE.count('data-state="review"'), 4)
        self.assertEqual(PAGE.count('data-state="planned"'), 3)
        self.assertEqual(PAGE.count('data-state="blocked"'), 2)
        self.assertIn("Human Gate", PAGE)

    def test_no_tracking_or_secret_membership_pipeline(self):
        self.assertIn('<meta name="robots" content="noindex,nofollow">', PAGE)
        self.assertIn("connect-src 'self'", PAGE)
        self.assertIn("form-action 'none'", PAGE)
        self.assertIn("default-src 'none'", PAGE)
        self.assertNotIn("unsafe-inline", PAGE)
        self.assertNotIn("<iframe", PAGE)
        self.assertNotIn("<form", PAGE)
        self.assertNotIn("<script src=\"https", PAGE)
        for term in ["localStorage", "sessionStorage", "document.cookie", "navigator.geolocation",
                     "getUserMedia(", "sendBeacon(", "XMLHttpRequest", "postMessage(",
                     "ga('", "gtag(", "fbq(", "eval(", "innerHTML =", "unsafe-eval"]:
            self.assertNotIn(term, APP, term)
        self.assertIn("credentials:'omit'", APP)

    def test_exports_are_local_and_formula_injection_guarded(self):
        self.assertIn("const csvText=", APP)
        self.assertIn("new Blob([csvText]", APP)
        self.assertIn("URL.createObjectURL", APP)
        self.assertIn("revokeObjectURL", APP)
        self.assertIn("function protectCsvCell", APP)
        self.assertIn(r"/^[\s]*[=+@-]/", APP)  # formula injection guard
        self.assertIn("csv.addEventListener('click',exportCsv)", APP)

    def test_mobile_keyboard_and_no_js_fallback(self):
        self.assertIn("focus-visible", STYLE)
        self.assertIn("prefers-reduced-motion", STYLE)
        self.assertIn("@media(max-width:720px)", STYLE)
        self.assertIn("@media(max-width:410px)", STYLE)
        self.assertIn("<noscript>", PAGE)
        self.assertIn('href="../../index.html#world-parties"', PAGE)
        self.assertIn('role="status" aria-live="polite"', PAGE)

    def test_cloudflare_static_allowlist_unchanged(self):
        self.assertNotIn('"research/party-tech/', STAGER)
        self.assertNotIn("research/party-tech", (ROOT / "wrangler.jsonc").read_text(encoding="utf-8"))
        self.assertIn('directory": "./dist/cloudflare"', (ROOT / "wrangler.jsonc").read_text(encoding="utf-8"))

    def test_status_not_legal_certification_or_party_partnership(self):
        self.assertIn("НЕ ОЗНАЧУВА ПАРТНЕРСТВА", PAGE)
        self.assertIn("НЕ Е РАНГИРАЊЕ", PAGE)
        self.assertIn("не е независен технички аудит", ATLAS.lower())
        self.assertNotIn("party-affiliation", APP)
        self.assertNotIn("microtarget", APP)


if __name__ == "__main__":
    unittest.main()
