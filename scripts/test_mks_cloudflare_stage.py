#!/usr/bin/env python3
"""Regression tests for fail-closed asset staging; no network or credentials."""
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
            p = self.root / name
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(b"asset")
        (self.root / "index.html").write_text('<meta name="robots" content="noindex,nofollow">', encoding="utf-8")
        (self.root / "robots.txt").write_text('User-agent: *\nDisallow: /\n', encoding="utf-8")
        (self.root / "manifest.json").write_text(json.dumps({"icons": [{"src": "./assets/icons/icon.svg"}]}), encoding="utf-8")
        (self.root / "archive").mkdir()
        (self.root / "archive" / "private.html.disabled").write_text("never stage", encoding="utf-8")
        (self.root / ".env").write_text("never stage", encoding="utf-8")

    def test_allowlist_only(self):
        output = self.root / "dist" / "cloudflare"
        checksums = stage.build(self.root, output)
        copied = sorted(str(x.relative_to(output)) for x in output.rglob("*") if x.is_file())
        self.assertEqual(copied, sorted(stage.PUBLIC_FILES))
        self.assertEqual(set(checksums), set(stage.PUBLIC_FILES))
        self.assertFalse((output / "archive").exists())
        self.assertFalse((output / ".env").exists())

    def test_cannot_overwrite(self):
        output = self.root / "dist" / "cloudflare"
        output.mkdir(parents=True)
        (output / "keep").write_text("preserve")
        with self.assertRaises(ValueError):
            stage.build(self.root, output)
        self.assertEqual((output / "keep").read_text(), "preserve")

    def test_missing_source_fails_closed(self):
        (self.root / "legal" / "PRIVACY.html").unlink()
        with self.assertRaises(ValueError):
            stage.build(self.root, self.root / "dist" / "cloudflare")
        self.assertFalse((self.root / "dist").exists())

    def test_index_gate_must_remain(self):
        (self.root / "index.html").write_text("public release", encoding="utf-8")
        with self.assertRaises(ValueError):
            stage.build(self.root, self.root / "dist" / "cloudflare")

    def test_manifest_cannot_reference_outside(self):
        (self.root / "manifest.json").write_text(json.dumps({"icons": [{"src": "../archive/private.html.disabled"}]}), encoding="utf-8")
        with self.assertRaises(ValueError):
            stage.build(self.root, self.root / "dist" / "cloudflare")

    def test_symlink_rejected(self):
        victim = self.root / "legal" / "TERMS.html"
        victim.unlink()
        victim.symlink_to(self.root / ".env")
        with self.assertRaises(ValueError):
            stage.build(self.root, self.root / "dist" / "cloudflare")


if __name__ == "__main__":
    unittest.main()
