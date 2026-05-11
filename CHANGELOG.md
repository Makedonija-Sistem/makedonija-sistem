# Changelog · Македонија-Систем

Сите значајни промени на овој проект ќе бидат документирани овде.

Форматот следи [Keep a Changelog](https://keepachangelog.com/),
а проектот користи [Semantic Versioning](https://semver.org/).

---

## [0.1.0-public-mvp] · 2026-05-10

### Public MVP Cleanup

Прва јавна нацрт-верзија на платформата „Македонија-Систем".

#### Додадено
- Чиста `index.html` јавна верзија
- `manifest.json` (PWA) со само постоечки asset references
- `sw.js` (Service Worker) — pre-cache само постоечки фајлови, graceful error handling
- `404.html` со навигација назад
- `assets/icons/icon.svg` — единствен SVG icon (без потреба од PNG генерирање)
- `VERSION` фајл
- `docs/` — комплетна документациска структура:
  - `ARCHITECTURE.md` — static + future production
  - `BACKEND_ROADMAP.md` — план за идна backend
  - `COMMUNICATION_GUIDE.md` — комуникациска дисциплина
  - `DATA_MAP.md` — мапа на чувствителни податоци
  - `FINANCE_TRANSPARENCY.md` — финансиска транспарентност
  - `FOUNDERS_PROCESS.md` — процес за основачи
  - `GOVERNANCE_MODEL.md` — модел на управување
  - `LAUNCH_CHECKLIST.md` — Critical/Important/Later
  - `MEDIA_KIT.md` — медиумски пакет
  - `ROADMAP.md` — 30/60/90 ден план
  - `SECURITY_PRIVACY.md` — безбедност и приватност
- `legal/` — нацрт-документи (DRAFT):
  - `STATUTE.md`
  - `PROGRAM.md`
  - `CODEX.md`
  - `PRIVACY.md` (преработен со јасни placeholders)
  - `TERMS.md` (преработен)
- `.github/ISSUE_TEMPLATE/` — 4 нови темплати:
  - `content_update.md`
  - `legal_review.md`
  - `security_privacy.md`
  - (плус постоечкиот `bug_report.md` и `feature_request.md`)
- `FIXES_APPLIED.md` — детална листа на сите измени
- `TODO_BEFORE_LAUNCH.md` — критични задачи пред реален launch

#### Поправено
- **Firebase placeholder config** — додаден `FIREBASE_ENABLED = false` со јасна порака
- **Manifest references** — отстранети референции на непостоечки PNG икони
- **Service Worker pre-cache** — само постоечки фајлови, graceful skip за missing
- **apple-touch-icon** — упатен кон постоечкиот SVG
- **README** — отстранети референции на непостоечки фајлови; додадени правни disclaimers

#### Преместено
- `makedonija-sistem-platform-v17-FINAL.html` → `archive/` (backup на стара верзија)

#### Означено како нацрт
- Сите документи во `legal/` јасно означени како **DRAFT**
- Сите форми во UI означени со „во подготовка"
- Сите бројки и цели означени како „предлог-модел" или „цел"

---

## Roadmap

Идните промени се планирани во:
- `docs/ROADMAP.md` — 30/60/90 ден план
- `docs/BACKEND_ROADMAP.md` — кога и како се воведува backend
- `TODO_BEFORE_LAUNCH.md` — критични пред-launch задачи
