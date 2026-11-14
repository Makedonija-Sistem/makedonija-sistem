# Makedonija Sistem - safe side-by-side review v0.1.5

**Review-only, unmerged and undeployed.** This is a *non-destructive additive* candidate based on the v0.1.3 Cloudflare source. It does not replace the repository root `index.html`.

## Source truth

- Existing `main/index.html` blob SHA: `59d29dc5d4b56168eba1b6952b16c253d638d4aa` (validated against the locally saved main ZIP and GitHub connector).
- New v0.1.3 Cloudflare source `index.html` blob SHA: `b0f90f75be01b8e48fe530ca804bb0743d2352cc` (validated against the GitHub `review/sync-preview-v0.1.3` branch and source ZIP).
- Draft PR #1 (`review/preserve-all-v0.1.4`) is a separate, older-UI preservation candidate. Keep it Draft; do **not** merge it just to obtain the new UI.

## Additions to a NEW GitHub review branch from main

1. `review-preview/` - complete new v0.1.3 source in a separate subtree. It changes only relative asset/legal links, the relative service worker script path, manifest scope and deliberately disables both legacy service-worker registrations to protect the shared GitHub Pages origin. No policy text is edited.
2. `archive/main-index-original-20261113.html.disabled` - byte-for-byte old main `index.html` snapshot, protected from publication as HTML.
3. `docs/MKS_SAFE_RECONCILIATION_v0.1.5.md` - this review guide.

## Why a side-by-side candidate

The new root replacement from the older `review/sync-preview-v0.1.3` branch deletes 7,294 old `index.html` lines even though other original repository files remain. Preservation must be proven by a separate archive and reviewed in context. This additive bundle keeps `main/index.html` *completely unchanged* while allowing a trial of the new UI.

## QA gates

- Original root HTML SHA: PASS.
- New source HTML SHA: PASS before review-only path adjustments.
- New HTML section count: 60 (58 with ids); original menu links: 38; noindex: PASS.
- JavaScript syntax and browser checks: see separate generated audit report; not implicitly PASS.
- Full substantive verification of economics, policies, legal texts, party data, five languages and real services: NOT DONE.
- Cloudflare live verification: NOT DONE (source bundle != confirmed deployment).
- Current GitHub main, PRs, Cloudflare worker: NOT CHANGED by this ZIP.

## Safe review procedure

1. **DO NOT** press Commit on an older pending upload screen.
2. Create a new branch FROM `main` called `review/side-by-side-v0.1.5`.
3. Upload the **contents** of this ZIP with directory paths preserved. Stop at the upload summary and verify there is NO root `index.html` and paths start with `review-preview/`, `archive/` or `docs/`.
4. Commit only to that review branch; open Draft PR toward `main`.
5. Check all changed files are **new additions** and no original files are deleted or modified.
6. Before any merge or root cutover, verify GitHub Pages preview, functional gates, sources, accessibility and a legal review and obtain explicit human approval.

## Rollback

Because the review branch adds new files only, closing its PR or deleting the branch leaves `main` unchanged. A future release must explicitly plan transfer of the new UI to root and preserve/restore original root history.
