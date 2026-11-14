# Makedonija - Sistem | Macedonia - System

**Status: Public project concept / review candidate; not a registered political party.**

This repository holds an independent civic and institutional reform concept. It is not
an official government website and does not provide any authenticated membership,
notarial, digital-signature, election, voting, payment, fundraising or legal service.
No sensitive personal data should be submitted through preview interfaces.

## Which version is which?

| Surface | Status | Version / source |
| --- | --- | --- |
| GitHub Pages | Existing public site from 11 May 2026, until a separately approved merge | `main` |
| PR #3 | Draft / review only; no public release | `review/root-cutover-v0.1.6` |
| Content in PR #3 | Review-language content snapshot | `v0.1.3-preview` (`VERSION`) |
| Current hardening patch | Additional safety, docs, QA; **not a site release** | Review pack `v0.1.7` |
| Cloudflare Worker | Separately deployed via Cloudflare Dashboard | Worker version `f9b8f578-0282-417c-9db2-7ca3c47744af` |

**Important:** A review-pack number is not the public application version. The
Cloudflare deployment has *not* been byte-compared with the GitHub candidate.
A user-visible Cloudflare copy previously showed `v0.1.2-preview`; this is a
pending provenance check, not proof of a technical fault.

## Scope of this review

- Informative programme and institutional concepts; proposals are not achievements.
- Transparent status labels for inactive modules.
- Five selectable languages in the source; **Macedonian is the default** until all long-form translations are verified. A manually selected language (or `?lang=` URL parameter) is respected. Translation quality is not yet certified.
- No live backed supporter counters, polling, CRM, payments, election results or
  verified notarization integrations.
- No claim of partnership or institutional authorization without documentary proof.
- For legal or official procedures, consult the responsible public authorities.

## Files and technical use

The root `index.html` is the GitHub Pages entry point. Static resources and legal
information are in `assets/` and `legal/`. For a local preview, serve this
repository from a folder named `makedonija-sistem` to reproduce the project path:

```sh
python3 -m http.server 8080
```

Do not assume a `file://` preview verifies all browser behavior. `robots.txt`
and HTML `noindex` remain restrictive while the candidate is in review. PWA
and offline support are intentionally not active in this review candidate.

## Verification and release policy

- Review PR: https://github.com/Makedonija-Sistem/makedonija-sistem/pull/3
- The review QA workflow is **read-only**; it does not deploy the website.
- Runtime checks, editorial review, privacy/legal review, provenance check and
  human approval are required before public merge or deployment.
- The older README is preserved unchanged in
  `archive/README_main_2026-05-11.md.disabled` for historical reference.
- Historical documentation under `docs/` may describe older ideas and is not an
  authoritative statement that a proposed feature is active.

## Contact

Public technical questions: GitHub Issues. For independent contact, the project
uses `makedonijasistem@gmail.com`. Do not email identity documents, identification
numbers, signatures, or sensitive health or financial information.

## Release control

**DO NOT MERGE PR #3, activate automatic Cloudflare deployment, or remove
noindex before the owner explicitly approves a verified release.**
