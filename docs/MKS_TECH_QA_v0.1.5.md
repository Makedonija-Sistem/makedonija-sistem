# MKS v0.1.5 - Side-by-side technical verification (2026-11-14)

This audit applies ONLY to the add-on review-preview subtree in the unmerged local upload ZIP, not to the actual live Cloudflare deployment.

| Test | Result | Evidence/limit |
|---|---|---|
| Original main exact byte preservation | PASS | Main index SHA-1 git blob 59d29dc5d4b56168eba1b6952b16c253d638d4aa; copied byte-for-byte to archive |
| New Cloudflare source provenance | PASS | v0.1.3 original HTML SHA-1 git blob b0f90f75be01b8e48fe530ca804bb0743d2352cc equals GitHub review/sync-preview-v0.1.3 source |
| New side-by-side HTML changes | PASS | Exactly 7 changed lines vs v0.1.3 original HTML; all path and SW guards, no editorial programme copy changes |
| New preview in separate folder | PASS | No root index.html in upload ZIP; original root stays untouched |
| Section / anchor structural integrity | PASS | 60 sections; 58 IDs; 38 in-page navigation targets |
| Inline JavaScript syntax | PASS | 12/12 `node --check` |
| Local static HTTP paths (separate test) | PASS | 7/7 HTTP 200, including root original, review preview, manifest, icons, OG image and 2 legal pages |
| Chromium DOM-responsive scenarios | PASS | 7/7 widths: 320, 375, 390, 768, 1024, 1280, 1440; zero page JavaScript errors and zero horizontal overflow in scenarios |
| Mobile navigation | PASS | Menu opens, a group opens, Escape closes menu, on 390px DOM test |
| Locale switch state | PASS (mechanical) | MK, EN, AL, SR, DE button states switched; translation correctness NOT reviewed |
| GitHub Pages integrated navigation via HTTP in Chromium | NOT TESTED | Browser navigation to localhost blocked by administrator; HTTP and DOM were checked separately |
| Cloudflare independent public accessibility | NOT VERIFIED | Live Worker could not be opened by independent browsing tool |
| PWA/offline behavior | NOT TESTED | Service Worker disabled intentionally in side-by-side preview to protect shared-origin cache |
| Factual, legal and five-language review | NOT TESTED | These are mandatory substantive gates before public root replacement |
| GitHub PR merge / Cloudflare deployment | NOT DONE | No write, merge or deployment from this package |

## Release position

**REVIEW CANDIDATE ONLY**: This package can be examined in a NEW Draft PR. Do not deploy it as a public final programme. It is not approved for root index replacement, official membership, donations, surveys, or political claim validation.

**Human Gate:** The repository owner decides if and when to move from side-by-side technical review to a separate root cutover and public release, after factual and legal review.
