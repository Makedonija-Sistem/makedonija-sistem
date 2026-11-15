"""MEDIA CONNECT review gates. Run with python -m unittest -v scripts/test_mks_media_connect.py."""
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]
def read(p): return (ROOT / p).read_text(encoding="utf-8")

class MediaConnectReview(unittest.TestCase):
    def test_canonical_atlas_untouched(self):
        s=read("index.html")
        section=s[s.index('<section id="world-parties"'):]
        cards=re.findall(r'<article class="wp-card"',section)
        self.assertEqual(len(cards),61)
        self.assertIn('id="wpGrid"',section)

    def test_bridge_and_files(self):
        s=read("index.html")
        self.assertIn('id="media-connect"',s)
        self.assertIn('href="./media-connect/"',s)
        for p in ("index.html","app.js","style.css","room.html","room.js","room.css","room-config.js"):
            self.assertTrue((ROOT/"media-connect"/p).is_file(),p)
        self.assertIn('href="./room.html"',read("media-connect/index.html"))
        self.assertIn('href="./index.html"',read("media-connect/room.html"))

    def test_disabled_by_default(self):
        c=read("media-connect/room-config.js")
        self.assertIn("enabled:false",c)
        self.assertIn('tokenEndpoint:""',c)
        h=read("media-connect/room.html")
        self.assertIn('id="joinButton" type="submit" disabled',h)
        self.assertIn("500+500",h)

    def test_backend_security_gates(self):
        s=read("media-connect/worker/token-worker.mjs")
        for token in ('HUMAN_GATE_APPROVED','ENABLED','JOIN_LIMITER','ALLOWED_ORIGIN',
                      'HOST_JOIN_CODE','SPEAKER_JOIN_CODE','VIEWER_JOIN_CODE','roomJoin:true',
                      'canPublish:role!=="viewer"','roomAdmin:role==="host"','"Cache-Control"'):
            self.assertIn(token,s,token)
        self.assertNotIn("YOUR_LIVEKIT_API_SECRET",s)
        self.assertNotIn('LIVEKIT_API_SECRET_LONG_FOR_TESTING',s)

    def test_no_production_asset_staging(self):
        stage=read("scripts/mks_cloudflare_stage.py")
        self.assertNotIn('"media-connect/"',stage)
        self.assertIn("PUBLIC_FILES",stage)
        config=read("media-connect/worker/wrangler.pilot.example.jsonc")
        self.assertIn('"workers_dev": false',config)
        self.assertIn('"ENABLED": "false"',config)
        self.assertIn('"HUMAN_GATE_APPROVED": "false"',config)

    def test_no_hidden_media_or_political_profiling(self):
        h=read("media-connect/room.html")
        self.assertNotRegex(h,r"<(video|iframe|form[^>]+action=)")
        self.assertIn('name="robots" content="noindex,nofollow"',h)
        j=read("media-connect/room.js")
        for bad in ("localStorage","sessionStorage","sendBeacon","eval(","innerHTML","WebSocket("):
            self.assertNotIn(bad,j)
        self.assertIn('credentials:"omit"',j)
        self.assertIn("setCameraEnabled(next)",j)
        self.assertIn("setMicrophoneEnabled(next)",j)

    def test_csp_and_vendor_disclaimer(self):
        h=read("media-connect/room.html")
        self.assertIn("Content-Security-Policy",h)
        self.assertIn("form-action 'none'",h)
        idx=read("media-connect/index.html")
        self.assertIn("не се наши партнери",idx)
        self.assertIn("не е потврден оперативен капацитет",idx)
        self.assertIn('name="robots" content="noindex,nofollow"',read("index.html"))
        
if __name__ == "__main__":
    unittest.main()
