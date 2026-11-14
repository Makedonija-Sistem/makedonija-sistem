# MKS PR #3 | technical hardening addendum v0.1.7

**14 November 2026 | REVIEW ONLY | NO MERGE | NO CLOUDFLARE DEPLOY**

## Source and scope

- Base was the exact May 2026 GitHub repository ZIP; README blob `ca593e77f55c7460215779baf0bb4478c60cfd2e`.
- Overlaid the 12 known candidate files in PR #3, checked against the GitHub blob references.
- v0.1.7 is a **review hardening package**, not a deployed website version.
- Content version in `VERSION` remains `v0.1.3-preview` deliberately.

## Changes prepared for the same review branch

1. README now describes the actual state of GitHub main vs Draft PR vs Cloudflare, rather than claiming an operational platform at v0.1.0.
2. Historical README preserved byte-identically in the archive.
3. GitHub Pages privacy draft corrected to identify GitHub Pages hosting; it remains a draft needing independent legal review.
4. Removed unreachable, old frontend simulations for members and digital notaries, including code able to generate a fake legally valid electronic declaration.
5. Removed dormant demo actions falsely confirming email campaigns, signatures, booking, budgeting, anonymous submission and sentiment analysis.
6. Removed obsolete, unreferenced translation keys for these deactivated modules; kept all currently displayed UI and the language toggles.
7. Disabled the unverified canned chatbot knowledge base (including invented supporter statistics, legal and partner claims); replaced responses with a clear review-only status and escaped user messages to prevent injected HTML.
8. Added a read-only GitHub Actions PR QA workflow and stdlib Python gate. No Pages or Cloudflare deployment action.
9. Final consolidation: removed five additional unreachable legacy JS modules (party networking, municipality directory, mock news magazine, diaspora form handlers, floating CTA) and the inactive magazine modal. Every removed module lacked a corresponding operational UI entry point in the review candidate; the archived earlier original remains preserved in Git history and backup. The removed magazine data consisted of unverified illustrative stories, not confirmed recent news.

## Additional accessibility corrections and browser verification

- The mobile menu toggle previously became covered by its fixed open drawer at 390 px. An explicit stacking rule keeps the toggle clickable when the drawer is open. The previous issue was observed in Chromium; the correction was retested at 390 px.
- Macedonian is now the default locale if the visitor has no saved/URL language choice; auto-detection of English from the browser had caused a mixed-language opening screen before editorial translation review. All five manual selectors remain enabled.
- The Albanian selection still uses `data-lang="al"` for internal dictionary compatibility but correctly sets the document language attribute to `sq`.

## Locally executed checks

- Offline static gate: **42 PASS, 0 FAIL**; **5 retained inline JavaScript blocks** parse.
- HTTP: **13/13 named resources responded 200**, including the /makedonija-sistem/ project-path deployment simulation, independently retested after final consolidation.
- **Final-source browser checks (Playwright / Chromium):** 4 viewport widths (320, 390, 768, 1440 px) loaded without JavaScript page errors or horizontal overflow; all five language toggles responded, Macedonian loaded as the default, the mobile menu successfully opened **and closed**, and the theme toggle updated its state. This replaces the earlier inconclusive browser harness result. No active HTML forms were found.
- Limitation: browser network navigation to localhost failed in this sandbox. The browser was rendered with `set_content`, and HTTP paths were tested independently. This is **not** proof of a full browser-to-server E2E test.
- The GitHub PR review workflow is included in the patch, but it has **not yet executed on GitHub**. A focused Chromium bot test verified HTML typed into the bot field was rendered as text, with 0 injected images and 0 JavaScript page errors.
- Final static parser QA: no duplicate HTML IDs, 55/55 fragment links resolve to IDs, 0 unsafe `target=_blank` links without `noopener`, 0 active forms. Browser layout tested separately and without external network resources.

## Remaining blockers (must not merge until closed)

- Cloudflare Worker version `f9b8f578-0282-417c-9db2-7ca3c47744af` cannot be independently byte-compared in this environment.
- Political/economic quantitative propositions and historical assertions still need source-level editorial review and labels identifying scenarios vs confirmed facts.
- Legal and privacy documents are **working drafts**, not legal advice or a reviewed data-protection policy.
- Full Albanian, Serbian, German, English and Macedonian human-language audit is **not complete**. A runtime probe found **61 of 204** elements tagged `data-i18n` whose keys fell back to original text rather than a translated dictionary value; long-form content remains partly Macedonian. This is a localization release blocker, not a navigation bug.
- **NOT VERIFIED:** network-connected end-to-end/browser-hosting deployment tests. The local browser tests used `page.set_content` on the exact final `index.html`; HTTP URLs were separately probed with a local server. These do not establish live deployment equivalence.
- Actual GitHub Pages deployment and user real-world browser tests are **not performed**; draft changes are not served by Pages.
- PWA offline and full accessibility tests are **not performed**.
- `robots.txt` and HTML `noindex` are purposely restrictive. Do not remove them until release approval.
- The new workflow should report PASS only for checks it really runs. Draft PR #3 previously had 0 checks, not a passing result.

## Human gate

Only after the owner approves the precise candidate, and after the above blockers are closed, is a merge to `main` permitted. No external deployment or automatic Cloudflare build is part of this patch.

## Rollback

While Draft, close PR #3 and do not merge. If an approved merge is later reverted, use the commit's Git revert and restore companion assets; do not treat reverting just `index.html` as sufficient.
