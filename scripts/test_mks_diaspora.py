"""Local-only diaspora onboarding safety QA. Never collects identity, affiliation or video."""
import html.parser
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PART = ROOT / "world" / "participate"
DIR = PART / "diaspora"
PAGE = (DIR / "index.html").read_text(encoding="utf-8")
JS = (DIR / "app.js").read_text(encoding="utf-8")
CSS = (DIR / "styles.css").read_text(encoding="utf-8")
PARENT = (PART / "index.html").read_text(encoding="utf-8")
PARENTJS = (PART / "app.js").read_text(encoding="utf-8")
GATE = json.loads((ROOT / "docs" / "mks-participation-gates.json").read_text(encoding="utf-8"))


class HTML(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.anchors = []
        self.translations = []
        self.inputs = []
        self.scripts = []
        self.buttons = {}

    def handle_starttag(self, name, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
            if name == "button":
                self.buttons[attrs["id"]] = attrs
        if name == "a":
            self.anchors.append(attrs)
        if name == "input":
            self.inputs.append(attrs)
        if name == "script":
            self.scripts.append(attrs)
        if "data-t" in attrs:
            self.translations.append(attrs["data-t"])


class DiasporaReviewTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dom = HTML()
        cls.dom.feed(PAGE)

    def test_all_local_assets_and_navigation(self):
        self.assertTrue((DIR / "styles.css").is_file())
        self.assertTrue((DIR / "app.js").is_file())
        self.assertIn('href="./styles.css"', PAGE)
        self.assertEqual(self.dom.scripts, [{"defer": None, "src": "./app.js"}])
        self.assertIn('href="./diaspora/"', PARENT)
        self.assertIn('data-t="diaspora.title"', PARENT)
        self.assertIn('href="../"', PAGE)
        self.assertIn('href="../../"', PAGE)
        self.assertEqual(len(self.dom.ids), len(set(self.dom.ids)))
        missing = [a["href"][1:] for a in self.dom.anchors
                   if a.get("href", "").startswith("#") and a["href"][1:] not in self.dom.ids]
        self.assertEqual(missing, [])

    def test_prototype_and_legal_boundaries(self):
        self.assertIn('<meta name="robots" content="noindex,nofollow">', PAGE)
        self.assertIn("ИНФОРМАТИВЕН ПРОТОТИП", PAGE)
        self.assertIn("НЕМА ПОТВРДА ЗА ЗАЧЛЕНУВАЊЕ", PAGE)
        self.assertIn("видеоразговор", PAGE.lower())
        self.assertIn("не и заверка", PAGE.lower())
        self.assertIn('id="video-locked" disabled', PAGE)
        self.assertNotIn("Потврди членство", PAGE)
        self.assertNotIn("Join now", PAGE)
        self.assertNotIn("Успешно сте зачленети", PAGE)

    def test_no_identifying_data_or_submission(self):
        self.assertNotIn("<form", PAGE.lower())
        self.assertNotRegex(PAGE, r"<(?:textarea|iframe|object|embed)\b")
        self.assertEqual(len(self.dom.inputs), 5)
        self.assertTrue(all(i.get("type") == "checkbox" for i in self.dom.inputs))
        for forbidden in ("fetch(", "localStorage", "sessionStorage", "sendBeacon(", "WebSocket(",
                          "XMLHttpRequest", "document.cookie", "getUserMedia(", "postMessage(",
                          "navigator.geolocation", "window.open(", "innerHTML", "eval(", "gtag(", "fbq("):
            self.assertNotIn(forbidden, JS, forbidden)
        self.assertNotRegex(PAGE, r'type="(?:text|email|tel|password|file|date)"')
        self.assertNotIn("src=\"https:", PAGE)
        self.assertIn("connect-src 'none'", PAGE)
        self.assertIn("form-action 'none'", PAGE)
        self.assertNotIn("unsafe-inline", PAGE)

    def test_countries_and_processes_are_explicit_not_personalized(self):
        self.assertEqual(set(re.findall(r'<option value="(us|ca|au)"', PAGE)),
                         {"us", "ca", "au"})
        self.assertIn('value="membership"', PAGE)
        self.assertIn('value="founding"', PAGE)
        self.assertIn("north_america", JS)
        self.assertIn("australia_and_oceania", JS)
        self.assertNotRegex(PAGE, r'\b(?:EMBG|passport number|matichen broj)\b')
        self.assertIn("result.purpose.founding", JS)
        self.assertIn("result.purpose.membership", JS)
        self.assertIn("result.country.us", JS)
        self.assertIn("result.country.ca", JS)
        self.assertIn("result.country.au", JS)

    def test_external_links_are_explicit_source_checked_and_no_referrer(self):
        expected = [
            "https://ai-advokat.github.io/#ai-advokat-chat",
            "https://mfa.gov.mk/mk-MK/konzularni-uslugi/notarski-uslugi",
            "https://www.nkrm.org.mk/",
            "https://e-ucilnica.azlp.mk/prasanja-odgovori/",
            "https://www.pravda.gov.mk/mk-MK/kontakt/cpp-cesto-postavuvani-prasanja",
        ]
        urls = [a.get("href", "") for a in self.dom.anchors]
        for url in expected:
            self.assertIn(url, urls)
        for anchor in self.dom.anchors:
            if anchor.get("href", "").startswith("https://"):
                self.assertEqual(anchor.get("target"), "_blank")
                self.assertIn("noopener", anchor.get("rel", ""))
                self.assertEqual(anchor.get("referrerpolicy"), "no-referrer")
        self.assertNotIn("ai-advokat.github.io", JS)  # no hidden cross-origin launch

    def test_all_five_languages_have_complete_tables(self):
        mark = "const TRANSLATIONS = "
        self.assertIn(mark, JS)
        data = JS.split(mark, 1)[1].split(";\n", 1)[0]
        rows = json.loads(data)
        self.assertGreaterEqual(len(rows), 60)
        self.assertEqual(len(rows), len(set(row[0] for row in rows)))
        self.assertTrue(all(len(row) == 6 and all(isinstance(x, str) and x.strip() for x in row)
                            for row in rows))
        keys = {row[0] for row in rows}
        self.assertTrue(set(self.dom.translations).issubset(keys))
        for locale in ("mk", "en", "al", "sr", "de"):
            self.assertIn('data-lang="' + locale + '"', PAGE)
        for k in ("diaspora.kicker", "diaspora.title", "diaspora.description", "diaspora.open"):
            self.assertIn('"' + k + '"', PARENTJS)
        self.assertIn("document.documentElement.lang", JS)

    def test_video_and_membership_backend_are_locked(self):
        state = GATE["diaspora_remote_process"]
        self.assertEqual(state["status"], "BLOCKED_LEGAL_AND_PROVIDER_VERIFICATION")
        self.assertEqual(state["countries"], ["US", "CA", "AU"])
        self.assertTrue(all(v is False for v in state.values() if isinstance(v, bool)))
        for name in ("decision_reference", "legal_opinion_reference", "provider_contract_reference"):
            self.assertIsNone(state[name])
        self.assertEqual(GATE["release_status"], "BLOCKED_REVIEW_ONLY")
        self.assertNotIn("world/participate/diaspora",
                         (ROOT / "scripts/mks_cloudflare_stage.py").read_text(encoding="utf-8"))
        self.assertNotIn("diaspora", (ROOT / "wrangler.jsonc").read_text(encoding="utf-8"))

    def test_cost_covering_is_proposed_not_a_financial_commitment(self):
        cost = GATE["diaspora_cost_coverage"]
        self.assertEqual(cost["status"], "PROPOSED_NOT_APPROVED_NOT_PAYABLE")
        self.assertEqual(cost["proposed_payer"], "MAKEDONIJA SISTEM")
        self.assertTrue(cost["beneficiary_no_processing_cost_intent"])
        self.assertEqual(cost["member_dues"], "NOT_SET_SEPARATE_LEGAL_ISSUE")
        self.assertEqual(cost["payer_model"],
                         "DIRECT_PAYMENT_TO_VERIFIED_LICENSED_SUPPLIERS_AFTER_APPROVAL_AND_INVOICE")
        self.assertEqual(cost["eligible_countries"], ["US", "CA", "AU"])
        self.assertEqual(len(cost["included_potential_costs"]), 4)
        self.assertTrue(all(x is False for x in cost["checks"].values()))
        self.assertEqual(len(cost["checks"]), 13)
        for key in ("approved_budget_amount_mkd", "approved_unit_cost_cap_mkd",
                    "legal_review_reference", "financial_human_gate_decision_reference",
                    "provider_contract_reference", "conflict_of_interest_register_reference"):
            self.assertIsNone(cost[key])
        self.assertIn('id="cost-policy"', PAGE)
        self.assertIn('data-t="cost.title"', PAGE)
        self.assertIn('data-t="cost.status"', PAGE)
        self.assertIn('data-t="cost.dues"', PAGE)
        self.assertIn("НЕ активна финансиска гаранција", PAGE)
        self.assertIn("членарина", PAGE)
        for forbidden in ('type="card"', 'name="credit_card"', 'name="iban"',
                          "checkout", "payment-provider", "reimburse-now", "stripe.com"):
            self.assertNotIn(forbidden, PAGE.lower())
        self.assertNotIn("fetch(", JS)

    def test_accessibility_and_reset_support(self):
        self.assertIn('aria-live="polite"', PAGE)
        self.assertIn('role="status"', PAGE)
        self.assertIn("prefers-reduced-motion", CSS)
        self.assertIn("focus-visible", CSS)
        self.assertIn("reset.addEventListener('click'", JS)
        self.assertIn("check.checked=false", JS)
        self.assertNotIn("navigator.clipboard", JS)
        self.assertIn("aria-pressed", JS)


if __name__ == "__main__":
    unittest.main()
