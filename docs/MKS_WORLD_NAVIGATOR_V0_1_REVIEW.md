# MKS World Navigator · v0.1 · Build and review record

**Date:** 14 November 2026  
**Mode:** BUILD / source-only prototype  
**Public status:** REVIEW-ONLY · NO INDEX · NO ACTIVE MEMBERSHIP · NO DEPLOY  
**Baseline:** `main` commit `aa538b7323c1f104b65c57baa1ee9354a1ac774a`.

## Purpose

Create a useful, attractive, accessible world-facing information entry point for **all visitors**, including people who live outside North Macedonia, to explore the existing MKS public programme draft at their own discretion.

**Not in scope:** ethnicity/nationality-based political targeting, behavioral profiling, conversion optimization, hidden recommendation rankings, emotional manipulation, user tracking, identity verification, formal membership, petitions, campaign payments, CRM, backend, government data or APIs. The product is **not** a recruitment automation engine.

## What is implemented

- `world/index.html`: semantic accessible standalone gateway. Existing content and source links work even with JavaScript disabled.
- `world/styles.css`: responsive navy-gold system design; local system fonts only; keyboard focus and reduced-motion behavior.
- `world/app.js`: transparent deterministic selection of six existing topics. Five manually selected languages: MK / EN / Albanian (HTML `sq`) / SR / DE. All language dictionaries are checked for complete keys at runtime.
- `scripts/test_mks_world_gateway.py`: offline source QA for allowed links, real anchor destinations, transparency, noindex, strict CSP, absence of personal-data collection.
- `scripts/mks_world_gateway_browser.cjs`: 10 behavioral checks with local Chromium: languages, localized headings, topic selection, exact destinations, review status, no tracking/storage, desktop/mobile/compact layouts and no-JS fallback.
- `.github/workflows/mks-world-navigator-review.yml`: runs tests for both path shapes: `/world/` (Cloudflare-style) and `/makedonija-sistem/world/` (GitHub Pages-style). The test runner uses `127.0.0.1` and no Cloudflare or production credentials.

## Transparent algorithm

The six topic keys and destinations are static and source-controlled:

| User choice | Existing source section |
| --- | --- |
| Institutions and law | `../index.html#principles` |
| Economy and work | `../index.html#industrial-champions` |
| Education and development | `../index.html#programme` |
| Health and wellbeing | `../index.html#wellbeing` |
| Diaspora and connections | `../index.html#diaspora-hub` |
| Municipalities and local development | `../index.html#municipalities` |

No demographic or location inference; no personalized political messages. A visitor selects a topic, receives a neutral explanation, and may open a verifiable source section. No user input is sent or persisted. No cookies, third-party libraries, fonts, analytics, forms, trackers or signup endpoints.

## Boundaries and acceptance criteria

1. **PASS required:** source smoke tests, Node syntax, Chromium on both local path shapes, keyboard/focus navigation and working fallback without JS.
2. **PASS required:** verify all six destinations exist in the actual master portal.
3. **PASS required:** `noindex,nofollow`, truthful unregistered-initiative status, no formal membership or government-service claims.
4. **PASS required:** no network requests to third-party origins and no local/session storage or cookie creation by the gateway.
5. **NOT YET TESTED:** full linguistic editorial review by native speakers; WCAG audit with assistive technology; real Cloudflare HTTP headers and live browser behavior; comparison with currently active Worker; full privacy legal assessment.
6. **BLOCKER for publication:** explicit owner Human Gate on any merge to `main`; GitHub Pages may publish new files on merge even without Worker deployment.
7. **BLOCKER for Cloudflare:** the existing `scripts/mks_cloudflare_stage.py` static-asset allowlist intentionally **does not include `world/`**. A new separately reviewed allowlist change and specifically approved inactive-version upload would be needed. This PR does not deploy or touch the Cloudflare Worker.
8. **BLOCKER for actual membership:** a future standalone legal design, official entity status/eligibility, informed opt-in, privacy controller and retention policy, data-processing protections, authentication, human review, withdrawal/deletion process, abuse controls, DPA assessment and security audit. **No membership form is implemented.**

## Human Gate

This PR is a design-and-functionality candidate only. Do **not** auto-merge, publish, activate traffic, collect membership information, change `robots.txt`, or remove `noindex` without a distinct authorization. This is explicitly separate from earlier authorization to upload Cloudflare version `182f2c98-e115-461b-a648-d435705f4fff` inactive.

## Future iteration (proposal, not built)

After editorial and legal review, expand source content and add verifiable policy citations; offer a privacy-first **information request** workflow only if legal groundwork is complete. Keep information routing user-controlled and independent of ethnicity, country, sensitive political views or inferred intent.
