# Heritage catalogue — language access (review only)

This catalogue gives searchable titles and interface labels in MK, EN, AL, SR and DE for all 58 historically preserved sections. The original MK-language source is never modified or silently replaced.

- Open `heritage/index.html?lang=en` (or `al`, `sr`, `de`, `mk`) for the title-language view.
- Each section links to the root portal with its locale query and to the unchanged May historic original.
- The content of 58 original sections and all 26 original documents is NOT fully translated by this update. A native-language editorial review and verified per-section translations are required before any claim of full coverage.
- No services, user registration, communications, forms, payments or live votes are enabled.

**Verification:** `python3 scripts/test_mks_heritage_i18n.py`, `python3 -m unittest -v scripts/test_mks_may_preservation.py`, and `node scripts/mks_heritage_i18n_browser.cjs` with an isolated local Chromium instance.
