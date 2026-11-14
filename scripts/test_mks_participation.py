"""Independent fail-closed source QA for the non-live participation module."""
import html.parser
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PAGE = (ROOT / "world/participate/index.html").read_text(encoding="utf-8")
CSS = (ROOT / "world/participate/styles.css").read_text(encoding="utf-8")
JS = (ROOT / "world/participate/app.js").read_text(encoding="utf-8")
GATE = json.loads((ROOT / "docs/mks-participation-gates.json").read_text(encoding="utf-8"))
WORKER = (ROOT / "api/participation-review-worker.mjs").read_text(encoding="utf-8")
WORLD = (ROOT / "world/index.html").read_text(encoding="utf-8")
WORLDSCRIPT = (ROOT / "world/app.js").read_text(encoding="utf-8")


class Markup(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.scripts = []
        self.anchors = []
        self.data_keys = []
        self.inputs = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag == "script":
            self.scripts.append(attrs)
        if tag == "a":
            self.anchors.append(attrs.get("href", ""))
        if tag in ("input", "textarea", "form"):
            self.inputs.append(tag)
        if "data-t" in attrs:
            self.data_keys.append(attrs["data-t"])


class ParticipationReviewTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.dom = Markup()
        cls.dom.feed(PAGE)

    def test_preview_only_and_no_membership_pretence(self):
        self.assertIn('<meta name="robots" content="noindex,nofollow">', PAGE)
        self.assertIn("БЕЗ ЗАЧЛЕНУВАЊЕ", PAGE)
        self.assertIn("Не е регистрирана политичка партија", PAGE)
        self.assertIn("не примаме никакви пријави", PAGE)
        self.assertIn('data-t="gate.closed"', PAGE)
        self.assertEqual(GATE["release_status"], "BLOCKED_REVIEW_ONLY")

    def test_no_input_collection_or_remote_submission(self):
        self.assertEqual(self.dom.inputs, [])
        self.assertNotIn("<form", PAGE.lower())
        self.assertNotIn("fetch(", JS)
        for forbidden in ("localStorage", "sessionStorage", "document.cookie",
                          "XMLHttpRequest", "sendBeacon(", "WebSocket(",
                          "navigator.geolocation", "analytics", "gtag(", "fbq(",
                          "window.open", "mailto:", "innerHTML", "eval("):
            self.assertNotIn(forbidden, JS, forbidden)
        self.assertNotIn("localStorage", PAGE)
        self.assertNotIn("type=\"email\"", PAGE)
        self.assertIn("navigator.clipboard.writeText", JS)

    def test_content_security_is_stricter_than_existing_main(self):
        self.assertIn("default-src 'none'", PAGE)
        self.assertIn("script-src 'self'", PAGE)
        self.assertIn("connect-src 'none'", PAGE)
        self.assertIn("form-action 'none'", PAGE)
        self.assertIn("object-src 'none'", PAGE)
        self.assertNotIn("unsafe-inline", PAGE)
        self.assertNotRegex(PAGE, r"<style\b|<script\b(?![^>]*\bsrc=)")
        self.assertEqual(self.dom.scripts, [{"type": "module", "src": "./app.js"}])
        self.assertIn("focus-visible", CSS)
        self.assertIn("prefers-reduced-motion", CSS)

    def test_no_duplicate_ids_and_all_anchors_exist(self):
        self.assertEqual(len(self.dom.ids), len(set(self.dom.ids)))
        missing = [ref[1:] for ref in self.dom.anchors if ref.startswith("#")
                   and ref[1:] not in self.dom.ids]
        self.assertEqual(missing, [])
        self.assertIn("../", self.dom.anchors)
        self.assertIn("../../legal/PRIVACY.html", self.dom.anchors)
        self.assertIn("../../legal/TERMS.html", self.dom.anchors)
        self.assertIn("https://azlp.mk/vashite-prava/", self.dom.anchors)

    def test_five_language_tables_complete(self):
        match = re.search(r"const TRANSLATIONS = (\[[\s\S]*?\]);", JS)
        self.assertIsNotNone(match)
        rows = json.loads(match.group(1))
        self.assertGreaterEqual(len(rows), 80)
        self.assertEqual(len(rows), len({row[0] for row in rows}))
        self.assertTrue(all(len(row) == 6 and all(isinstance(item, str) and item.strip()
                                                  for item in row) for row in rows))
        keys = {row[0] for row in rows}
        self.assertTrue(set(self.dom.data_keys).issubset(keys))
        for required in ("info.learn.title", "info.contribute.desc", "info.membership.desc",
                         "template.request", "template.copyok", "template.copyerror",
                         "control.cleared", "page.title"):
            self.assertIn(required, keys)
        for language in ("mk", "en", "al", "sr", "de"):
            self.assertIn('data-lang="' + language + '"', PAGE)

    def test_all_safety_gates_fail_closed(self):
        self.assertEqual(GATE["schema_version"], 1)
        self.assertTrue(all(v is False for v in GATE["controls"].values()))
        self.assertTrue(all(v is False for v in GATE["legal_and_human_gate"].values()))
        for prop in ("controller_legal_name", "lawful_basis_article_10",
                     "special_category_exception_article_13", "approved_retention_period",
                     "release_commit_sha", "human_gate_decision_reference"):
            self.assertIsNone(GATE[prop])
        self.assertNotIn("api/participation", (ROOT / "wrangler.jsonc").read_text())
        self.assertNotIn("world/participate", (ROOT / "scripts/mks_cloudflare_stage.py").read_text())

    def test_api_cannot_read_or_save_submission(self):
        self.assertNotRegex(WORKER, r"request\.(?:text|json|formData|arrayBuffer)\s*\(")
        for forbidden in ("env.DB", "env.KV", "env.D1", "console.log(request",
                          "COLLECT_ENABLED", "createMember(", "insert into", "Set-Cookie",
                          "Access-Control-Allow-Origin"):
            self.assertNotIn(forbidden, WORKER)
        self.assertIn("COLLECTION_NOT_AUTHORIZED", WORKER)
        self.assertIn("response(423,", WORKER)
        self.assertIn("Cache-Control", WORKER)

    def test_existing_navigator_link_and_locales(self):
        self.assertIn('href="./participate/"', WORLD)
        self.assertIn('data-t="participation.rights"', WORLD)
        self.assertEqual(WORLDSCRIPT.count("'participation.rights'"), 5)
        self.assertIn("Не е регистрирана политичка партија", PAGE)

    def test_ai_advokat_is_explicit_opt_in_external_link_not_embedded_tracker(self):
        from html import unescape
        self.assertIn('id="ai-advokat"', PAGE)
        self.assertIn('id="ai-advokat-heading"', PAGE)
        link = re.search(r'<a\b[^>]*\bid="ai-advokat-launch"[^>]*>', PAGE)
        self.assertIsNotNone(link)
        tag = unescape(link.group(0))
        self.assertIn('href="https://ai-advokat.github.io/#ai-advokat-chat"', tag)
        self.assertIn('target="_blank"', tag)
        self.assertIn('rel="noopener noreferrer"', tag)
        self.assertIn('referrerpolicy="no-referrer"', tag)
        self.assertIn('aria-describedby="ai-advokat-warning"', tag)
        for path in ("legal-notice.html", "privacy-policy.html"):
            self.assertIn('href="https://ai-advokat.github.io/' + path + '"', PAGE)
        self.assertIn("Ниту еден избор од овој портал не се испраќа автоматски", PAGE)
        self.assertIn("Достапноста на AI-разговорот зависи", PAGE)
        self.assertNotRegex(PAGE, r"<(?:iframe|embed|object)\b")
        self.assertNotIn("ai-advokat.github.io", JS)  # no auto-load or transfer from MKS JS
        self.assertNotIn("fetch(", JS)
        self.assertNotIn("window.open", JS)
        for key in ("ai.eyebrow", "ai.external", "ai.intro", "ai.warning",
                    "ai.launch", "ai.legal", "ai.privacy", "ai.disclaimer"):
            self.assertIn('"' + key + '"', JS)

    def test_no_operational_claims_or_personal_identity_fields(self):
        for forbidden in ("type=\"file\"", "type=\"password\"", "type=\"tel\"",
                          "type=\"date\"", "upload-document", "membership-approved",
                          "членска книшка", "Your membership is confirmed"):
            self.assertNotIn(forbidden, PAGE)
        self.assertNotIn("intelligence", JS.lower())


if __name__ == "__main__":
    unittest.main()
