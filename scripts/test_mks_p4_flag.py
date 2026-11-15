#!/usr/bin/env python3
"""Read-only smoke test: MKS flag P4, built-in Python only."""
from pathlib import Path
import xml.etree.ElementTree as ET

ROOT=Path(__file__).resolve().parents[1]
src=ROOT/'assets/identity/flag/MKS_FLAG_PRIMARY_P4.svg'
mon=ROOT/'assets/identity/flag/MKS_FLAG_PRIMARY_P4_MONO.svg'
assert src.exists() and mon.exists()
for f in (src,mon):
    root=ET.parse(f).getroot()
    assert root.attrib.get('viewBox')=='0 0 3000 2000'
    for el in root.iter():
        assert el.tag.split('}')[-1] not in {'script','foreignObject','text'}
        assert not any(a.startswith('on') or a.endswith('}href') or a == 'href' for a in el.attrib)
    s=f.read_text()
    assert 'translate(800 300) scale(7)' in s
    assert 'opacity=' not in s
s=src.read_text()
assert '#0A1D3A' in s and '#D4AD4A' in s
assert '<rect x="64"' in s and '<rect x="128"' in s
index=(ROOT/'index.html').read_text(encoding='utf-8')
assert '<symbol id="ms-sigil"' in index
assert (ROOT/'assets/icons/icon.svg').exists()
print('PASS P4 flag geometry, passive SVG, original sigil and icon present')
