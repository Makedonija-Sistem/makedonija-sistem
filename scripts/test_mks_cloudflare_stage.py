#!/usr/bin/env python3
"""Offline security and fail-closed tests; never require Cloudflare access."""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("mks_stage", Path(__file__).with_name("mks_cloudflare_stage.py"))
assert spec and spec.loader
stage = importlib.util.module_from_spec(spec)
spec.loader.exec_module(stage)


class StageTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        for name in stage.PUBLIC_FILES:
            path = self.root / name
            path.parent.mkdir(parents=True, exist_ok=True)
            path.write_bytes(b"asset")
        (self.root / "index.html").write_text('<meta name="robots" content="noindex,nofollow">', encoding="utf-8")
        (self.root / "robots.txt").write_text('User-agent: *\nDisallow: /\n', encoding="utf-8")
        (self.root / "manifest.json").write_text(json.dumps({"icons": [{"src": "./assets/icons/icon.svg"}]}), encoding="utf-8")
        (self.root / "archive").mkdir()
        (self.root / "archive" / "private.html.disabled").write_text("never stage", encoding="utf-8")
        (self.root / ".env").write_text("never stage", encoding="utf-8")

    def test_only_public_files_and_generated_headers(self):
        output = self.root / "dist" / "cloudflare"
        checksums = stage.build(self.root, output)
        expected = set(stage.PUBLIC_FILES) | {stage.SECURITY_HEADERS_FILE}
        copied = {str(x.relative_to(output)) for x in output.rglob("*") if x.is_file()}
        self.assertEqual(copied, expected)
        self.assertEqual(set(checksums), expected)
        self.assertFalse((output / "archive").exists())
        self.assertFalse((output / ".env").exists())

    def test_real_http_security_headers_for_static_assets(self):
        stage.build(self.root, self.root / "dist" / "cloudflare")
        headers = (self.root / "dist" / "cloudflare" / "_headers").read_text()
        for required in ("X-Frame-Options: DENY", "X-Content-Type-Options: nosniff",
                         "Referrer-Policy: no-referrer", "frame-ancestors 'none'",
                         "X-Robots-Tag: noindex, nofollow"):
            self.assertIn(required, headers)
        self.assertNotIn("unsafe-inline", headers)

    def test_cannot_overwrite(self):
        output = self.root / "dist" / "cloudflare"
        output.mkdir(parents=True)
        (output / "keep").write_text("preserve")
        with self.assertRaises(ValueError):
            stage.build(self.root, output)
        self.assertEqual((output / "keep").read_text(), "preserve")

    def test_missing_source_fails_before_creating_output(self):
        (self.root / "legal" / "PRIVACY.html").unlink()
        with self.assertRaises(ValueError):
            stage.build(self.root, self.root / "dist" / "cloudflare")
        self.assertFalse((self.root / "dist").exists())

    def test_noindex_gate_cannot_be_removed(self):
        (self.root / "index.html").write_text("public release", encoding="utf-8")
        with self.assertRaises(ValueError):
            stage.build(self.root, self.root / "dist" / "cloudflare")

    def test_robots_gate_cannot_be_commented_out(self):
        (self.root / "robots.txt").write_text("User-agent: *\n# Disallow: /\n")
        with self.assertRaises(ValueError):
            stage.build(self.root, self.root / "dist" / "cloudflare")

    def test_manifest_cannot_reference_outside(self):
        (self.root / "manifest.json").write_text(json.dumps({"icons": [{"src": "../archive/private.html.disabled"}]}))
        with self.assertRaises(ValueError):
            stage.build(self.root, self.root / "dist" / "cloudflare")

    def test_source_symlink_rejected(self):
        victim = self.root / "legal" / "TERMS.html"
        victim.unlink()
        victim.symlink_to(self.root / ".env")
        with self.assertRaises(ValueError):
            stage.build(self.root, self.root / "dist" / "cloudflare")

    def test_output_parent_symlink_rejected(self):
        (self.root / "alt").mkdir()
        (self.root / "dist").symlink_to(self.root / "alt", target_is_directory=True)
        with self.assertRaises(ValueError):
            stage.build(self.root, self.root / "dist" / "cloudflare")

    def test_output_outside_repo_rejected(self):
        with self.assertRaises(ValueError):
            stage.build(self.root, self.root.parent / "outside-mks-test")


if __name__ == "__main__":
    unittest.main()
