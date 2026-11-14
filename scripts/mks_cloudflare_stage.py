#!/usr/bin/env python3
"""Fail-closed, allowlisted static site staging for a Cloudflare Worker review.

This script builds local files only. It does not call Cloudflare or deploy.
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path
import shutil

PUBLIC_FILES = (
    "index.html",
    "404.html",
    "VERSION",
    "manifest.json",
    "robots.txt",
    "sitemap.xml",
    "sw.js",
    "assets/icons/icon.svg",
    "assets/og/og-image.png",
    "assets/og/og-image.svg",
    "legal/PRIVACY.html",
    "legal/TERMS.html",
)


def build(root: Path, output: Path | None = None) -> dict[str, str]:
    root = root.resolve()
    output = output or (root / "dist" / "cloudflare")
    output = output.absolute()
    if output.exists() or output.is_symlink():
        raise ValueError(f"Refusing to overwrite an existing output directory: {output}")
    if output == root or root == output:
        raise ValueError("Output must be a new directory")
    # Inspect every source before creating any output files.
    sources: dict[str, Path] = {}
    for name in PUBLIC_FILES:
        source = root / name
        if any(part.is_symlink() for part in (source, *source.parents) if part != root):
            raise ValueError(f"Symlink rejected: {name}")
        if not source.is_file() or source.stat().st_size == 0:
            raise ValueError(f"Missing or empty allowlisted public asset: {name}")
        sources[name] = source

    html = sources["index.html"].read_text(encoding="utf-8")
    robots = sources["robots.txt"].read_text(encoding="utf-8")
    if 'content="noindex,nofollow"' not in html or "Disallow: /" not in robots:
        raise ValueError("Review-only noindex/robots gate must remain in place")
    manifest = json.loads(sources["manifest.json"].read_text(encoding="utf-8"))
    for icon in manifest.get("icons", []):
        ref = icon.get("src", "")
        if not ref.startswith("./") or ref[2:] not in PUBLIC_FILES:
            raise ValueError(f"Manifest icon is not allowlisted: {ref}")

    output.mkdir(parents=True, exist_ok=False)
    checksums: dict[str, str] = {}
    for name, source in sources.items():
        dest = output / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, dest)
        checksums[name] = hashlib.sha256(dest.read_bytes()).hexdigest()
    return checksums


if __name__ == "__main__":
    project = Path(__file__).resolve().parents[1]
    digests = build(project)
    print(json.dumps({"status": "PASS", "scope": "STAGED_ONLY_NOT_DEPLOYED", "files": digests}, indent=2))
