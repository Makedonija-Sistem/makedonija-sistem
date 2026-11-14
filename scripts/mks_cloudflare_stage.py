#!/usr/bin/env python3
"""Fail-closed Cloudflare static asset staging. Never deploy from this script."""
from __future__ import annotations

import hashlib
from html.parser import HTMLParser
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

# For Cloudflare Workers STATIC assets only; this file is not served to visitors.
# Keep the source site's own (currently weaker) inline-script CSP unchanged:
# replacing it without a JS refactor would break the existing UI.
SECURITY_HEADERS_FILE = "_headers"
SECURITY_HEADERS = (
    "/*\n"
    "  X-Frame-Options: DENY\n"
    "  X-Content-Type-Options: nosniff\n"
    "  Referrer-Policy: no-referrer\n"
    "  Content-Security-Policy: frame-ancestors 'none'\n"
    "  X-Robots-Tag: noindex, nofollow\n"
)


class _RobotsMetaParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.policies: list[set[str]] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() != "meta":
            return
        values = {key.lower(): (value or "") for key, value in attrs}
        if values.get("name", "").lower() == "robots":
            self.policies.append({v.strip().lower() for v in values.get("content", "").split(",")})


def _validate_review_gate(index: str, robots: str) -> None:
    meta = _RobotsMetaParser()
    meta.feed(index)
    must = {"noindex", "nofollow"}
    if not meta.policies or any(not must.issubset(policy) for policy in meta.policies):
        raise ValueError("Every robots meta policy must retain noindex and nofollow")
    active = {line.split("#", 1)[0].strip().lower() for line in robots.splitlines()}
    if "user-agent: *" not in active or "disallow: /" not in active or "allow: /" in active:
        raise ValueError("robots.txt must block all crawling in review mode")


def build(root: Path, output: Path | None = None) -> dict[str, str]:
    root = root.resolve()
    output = (output or (root / "dist" / "cloudflare")).absolute()
    # Do not stage through symlinked output parents, outside the project or over existing output.
    if output.is_symlink() or any(part.is_symlink() for part in output.parents if part != root):
        raise ValueError("Symlinked output path is not allowed")
    output = output.resolve(strict=False)
    if not output.is_relative_to(root) or output == root:
        raise ValueError("Output must be a new subdirectory inside the repository")
    if output.exists() or output.is_symlink():
        raise ValueError(f"Refusing to overwrite an existing output directory: {output}")

    sources: dict[str, Path] = {}
    for name in PUBLIC_FILES:
        source = root / name
        if any(part.is_symlink() for part in (source, *source.parents) if part != root):
            raise ValueError(f"Symlink rejected: {name}")
        if not source.is_file() or source.stat().st_size == 0:
            raise ValueError(f"Missing or empty allowlisted public asset: {name}")
        sources[name] = source

    _validate_review_gate(
        sources["index.html"].read_text(encoding="utf-8"),
        sources["robots.txt"].read_text(encoding="utf-8"),
    )
    manifest = json.loads(sources["manifest.json"].read_text(encoding="utf-8"))
    for icon in manifest.get("icons", []):
        ref = icon.get("src", "")
        if not isinstance(ref, str) or not ref.startswith("./") or ref[2:] not in PUBLIC_FILES:
            raise ValueError(f"Manifest icon is not allowlisted: {ref}")

    output.mkdir(parents=True, exist_ok=False)
    checksums: dict[str, str] = {}
    for name, source in sources.items():
        dest = output / name
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, dest)
        checksums[name] = hashlib.sha256(dest.read_bytes()).hexdigest()
    header_target = output / SECURITY_HEADERS_FILE
    header_target.write_text(SECURITY_HEADERS, encoding="utf-8")
    checksums[SECURITY_HEADERS_FILE] = hashlib.sha256(header_target.read_bytes()).hexdigest()
    return checksums


if __name__ == "__main__":
    project = Path(__file__).resolve().parents[1]
    digests = build(project)
    print(json.dumps({"status": "PASS", "scope": "STAGED_ONLY_NOT_DEPLOYED", "files": digests}, indent=2))
