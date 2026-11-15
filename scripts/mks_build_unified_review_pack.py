#!/usr/bin/env python3
"""Build a deterministic, local-only review ZIP. NO secrets, deploy, or network."""
from __future__ import annotations
from pathlib import Path
import hashlib
import json
import sys
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

ROOT = Path(__file__).resolve().parents[1]
PUBLIC_REVIEW = (
    "index.html",
    "media-connect/index.html",
    "media-connect/style.css",
    "media-connect/app.js",
    "media-connect/room.html",
    "media-connect/room.css",
    "media-connect/room.js",
    "media-connect/room-config.js",
    "research/party-tech/index.html",
    "research/party-tech/styles.css",
    "research/party-tech/app.js",
    "research/party-tech/evidence.js",
    "research/strategic-investments.html",
    "legal/PROGRAM.md",
    "legal/STATUTE.md",
)
README = """MAKEDONIJA SISTEM - OFFLINE REVIEW v0.3 (2026-11-15)

STATUS: SOURCE REVIEW ONLY; no deployment, membership or investment service.
MEDIA CONNECT: Video joining DISABLED. No LiveKit account, tokens, recordings,
API secrets, server integration or evidence of 500+500 live capacity is included.

Files: index.html (61-card master), Party Atlas, economic programme,
MEDIA CONNECT directory, role-gated videoroom frontend, legal drafts.
Secrets and Cloudflare Worker backends are intentionally excluded.

How to inspect:
1. Extract the ZIP into a separate test folder.
2. In the extracted folder run: python3 -m http.server 8788
3. In your browser open http://127.0.0.1:8788/
4. Follow the links from the main portal. No external accounts required.
5. DO NOT share this as a production portal or activate political/financial
   services. The review-only video page cannot join a real room.

GitHub reviewer: https://github.com/Makedonija-Sistem/makedonija-sistem/pull/12
Human Gate before any merge, hosting, secret deployment or public conference.
"""
def arcinfo(name: str) -> ZipInfo:
    z = ZipInfo(name, date_time=(2026, 11, 15, 0, 0, 0))
    z.compress_type = ZIP_DEFLATED
    z.external_attr = 0o644 << 16
    return z

def build(destination: Path) -> dict:
    destination = destination.resolve(strict=False)
    if destination.exists():
        raise ValueError("Refusing to overwrite existing ZIP")
    if not destination.parent.is_dir():
        raise ValueError("Output directory must already exist")
    checksums = {}
    with ZipFile(destination, "w") as zf:
        for rel in PUBLIC_REVIEW:
            f = ROOT / rel
            if (not f.is_file() or f.is_symlink()
                    or not f.resolve().is_relative_to(ROOT)):
                raise ValueError("Missing/unsafe review asset: " + rel)
            raw = f.read_bytes()
            if not raw:
                raise ValueError("Empty review asset: " + rel)
            zf.writestr(arcinfo(rel), raw)
            checksums[rel] = hashlib.sha256(raw).hexdigest()
        zf.writestr(arcinfo("README_REVIEW_ONLY.txt"), README.encode("utf-8"))
        data = {"mode": "REVIEW_ONLY_NO_DEPLOY", "files": checksums}
        zf.writestr(arcinfo("REVIEW_MANIFEST.json"),
                    json.dumps(data, ensure_ascii=False, indent=2).encode("utf-8"))
    with ZipFile(destination) as zf:
        paths = set(zf.namelist())
        if paths != set(PUBLIC_REVIEW) | {"README_REVIEW_ONLY.txt", "REVIEW_MANIFEST.json"}:
            raise AssertionError("Incorrect artifact manifest")
        if any("worker/" in item or "secret" in item.lower() for item in paths):
            raise AssertionError("Server/private files included")
    return {"status": "PASS", "mode": "REVIEW_ONLY_NO_DEPLOY",
            "file_count": len(checksums), "zip": str(destination)}
if __name__ == "__main__":
    output = Path(sys.argv[1]) if len(sys.argv) == 2 else Path("/tmp/mks-review-offline.zip")
    print(json.dumps(build(output), ensure_ascii=False, indent=2))
