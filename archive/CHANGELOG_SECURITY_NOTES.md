# 📚 Историски безбедносни белешки · Macedonia-System

> ⚠️ **ВАЖНО ЗА ЧИТАТЕЛИТЕ И ЗА GREP ПРЕБАРУВАЊА:**
>
> # 🏛️ HISTORICAL EXAMPLES OF FIXED ISSUES — NOT ACTIVE CODE
>
> Овој документ содржи **детални historical „пред / по"** примери на сите безбедносни и runtime поправки извршени помеѓу разни верзии на платформата.
>
> ## Зошто се чуваат тука
>
> Овие записи документираат како се **поправени** ризични практики во рани прототипи. Тие **НЕ се активни** во тековната public MVP 0.1.0 верзија.
>
> ## Како да го интерпретирате
>
> Стрингови како:
>
> - `YOUR_API_KEY`
> - `Firebase Realtime DB`
> - `fdEMBG`, `fdLK`, `fdAddress`
> - „гласовите ќе се испратат во Firebase"
> - „резултатите се ажурираат во реално време"
> - ЕМБГ / лична карта / адреса / селфи / потпис форми
>
> се појавуваат тука **САМО како „беше" примери** во документација на поправки. Тие **НЕ постојат** во активниот `index.html`, `sw.js`, `manifest.json` или било кој друг production фајл.
>
> ## За верификација
>
> ```bash
> # Проверете дека production фајлите се чисти
> grep -E "YOUR_API_KEY|fdEMBG|fdLK|fdAddress" index.html
> # Очекуван резултат: 0 hits
> ```
>
> Главниот **`FIXES_APPLIED.md`** во root-от на проектот содржи кратка summary табела без historical code snippets.
>
> ---

# 🔧 Поправки применети · Public MVP 0.1.0

**Датум на cleanup:** [ДАТУМ]
**Верзија пред:** претходна развојна верзија
**Верзија после:** `0.1.0-public-mvp`

---

## 🎯 Цел на овој cleanup

Да се претвори силен статичен прототип во **дисциплинирана јавна нацрт-верзија** (Public MVP), без да се уништи постоечката визија и содржина.

**Што е задржано:**
- Целата визија и стратешка суштина
- Сите политички принципи и програмски делови
- Дизајн, бои, layout, идентитет
- Сите јазици (мк, ен, ал, ср, де)
- Сите функционални секции (10 индустриски шампиони, 80+1 општини, 42 медиума, 6 институции, итн.)

**Што е поправено / додадено:** видете подолу.

---

## 1. Архивирање на стари верзии

| Фајл | Што е направено |
|---|---|
| `makedonija-sistem-platform-v17-FINAL.html` | Преместено во `archive/` (не избришано) |

---

## 2. Поправки на PWA / asset references

### 2.1 Manifest.json

**Беше:** Референции на 8 PNG икони (72, 96, 128, 144, 152, 192, 384, 512) и 2 screenshots — **сите непостоечки**, што предизвикуваше 404 грешки при PWA install.

**Сега:** Само еден SVG icon (`assets/icons/icon.svg`). Без screenshots. Без shortcuts со непостоечки icons.

```json
{
  "icons": [
    {
      "src": "assets/icons/icon.svg",
      "sizes": "any",
      "type": "image/svg+xml",
      "purpose": "any maskable"
    }
  ]
}
```

### 2.2 Service Worker (sw.js)

**Беше:** Pre-cache на фајлови што не постојат.

**Сега:**
- Pre-cache **само** проверени фајлови: `/`, `/index.html`, `/manifest.json`, `/404.html`, `/assets/icons/icon.svg`
- **Graceful skip** ако некој фајл не може да се кешира
- Network-first за HTML (за свежи updates)
- Cache-first за статични assets

### 2.3 apple-touch-icon

**Беше:** `<link rel="apple-touch-icon" href="/assets/icons/icon-192.png">` — фајлот не постоеше.

**Сега:** `<link rel="apple-touch-icon" href="/assets/icons/icon.svg">` — постоечки SVG.

### 2.4 SVG icon создаден

Создадена `assets/icons/icon.svg` — професионална SVG икона за платформата (M-Sistem, navy + злато).

---

## 3. Поправки на Firebase placeholder

**Беше:**
```javascript
const FIREBASE_CONFIG = {
  apiKey: "YOUR_API_KEY",
  ...
};
function initFirebase(){
  if (typeof firebase !== 'undefined') {
    firebase.initializeApp(FIREBASE_CONFIG);
  }
}
```

**Проблем:** Изгледа како активна production конфигурација, но е placeholder. Може да даде лажна претстава.

**Сега:**
```javascript
/* ⚠️ DISABLED во public MVP 0.1.0
   Видете docs/BACKEND_ROADMAP.md */
const FIREBASE_ENABLED = false;
const FIREBASE_CONFIG = { apiKey: "YOUR_API_KEY", ... };

function initFirebase(){
  if (!FIREBASE_ENABLED) {
    console.info('ℹ️ Firebase disabled во public MVP. Видете docs/BACKEND_ROADMAP.md');
    return false;
  }
  // ... оригинална логика, само ако е enabled
}
```

**Исход:** Корисникот / технички прегледувач веднаш гледа дека Firebase е експлицитно оневозможен, не „привремена грешка“.

---

## 4. Документациска структура

### 4.1 Нови docs/ фајлови

| Фајл | Опис |
|---|---|
| `docs/ARCHITECTURE.md` | Тековна static архитектура + future production план |
| `docs/BACKEND_ROADMAP.md` | План за идна backend (Cloudflare Workers + Supabase), DB schema, API endpoints, GDPR |
| `docs/COMMUNICATION_GUIDE.md` | Тон, стил, како да се зборува за иницијативата, опис во 1 реченица / 1 пасус / 1 страница |
| `docs/DATA_MAP.md` | Табела на сите можни лични податоци, ризик класификација, дозволено / недозволено во MVP |
| `docs/FINANCE_TRANSPARENCY.md` | Принципи за донации, месечни извештаи, забрана за скриено финансирање |
| `docs/FOUNDERS_PROCESS.md` | Разграничување „изразен интерес“ vs „официјален основач“; чекори за 1,000 основачи |
| `docs/GOVERNANCE_MODEL.md` | Привремен координативен тим, поделба на тимови, конфликт на интерес, жалбен механизам |
| `docs/LAUNCH_CHECKLIST.md` | Critical / Important / Later категории + A/B/C класификација |
| `docs/MEDIA_KIT.md` | За новинари — кратки описи, FAQ, press release template |
| `docs/ROADMAP.md` | 30/60/90 ден план |
| `docs/SECURITY_PRIVACY.md` | Безбедност, приватност, ризици, mitigation, GDPR права |

### 4.2 Нови legal/ фајлови

| Фајл | Опис |
|---|---|
| `legal/STATUTE.md` | Нацрт-статут (DRAFT) — 14 члена, бара правна проверка |
| `legal/PROGRAM.md` | Формална програма (DRAFT) — преточена од веб-секции |
| `legal/CODEX.md` | Кодекс на интегритет (DRAFT) — 26 члена, антикорупција, конфликт на интерес |
| `legal/PRIVACY.md` | **Преработена** Privacy Policy со јасни placeholders и DRAFT статус |
| `legal/TERMS.md` | **Преработени** Terms of Service со јасен MVP статус |

### 4.3 Преработени root фајлови

| Фајл | Промени |
|---|---|
| `README.md` | Целосно нов: точен листинг, без референции на непостоечки фајлови, јасни disclaimer-и |
| `CHANGELOG.md` | Нов формат со 0.1.0-public-mvp како прв entry |
| `manifest.json` | Поправен (видете точка 2.1) |
| `sw.js` | Поправен (видете точка 2.2) |

### 4.4 Нови GitHub фајлови

| Фајл | Опис |
|---|---|
| `.github/ISSUE_TEMPLATE/content_update.md` | Темплат за content измени |
| `.github/ISSUE_TEMPLATE/legal_review.md` | Темплат за правни прегледи |
| `.github/ISSUE_TEMPLATE/security_privacy.md` | Темплат за безбедност / приватност |

(Постоечките `bug_report.md`, `feature_request.md`, `PULL_REQUEST_TEMPLATE.md`, `workflows/deploy.yml` се задржани.)

### 4.5 Нови root маркер фајлови

| Фајл | Опис |
|---|---|
| `VERSION` | Содржи: `0.1.0-public-mvp` |
| `FIXES_APPLIED.md` | Овој документ |
| `TODO_BEFORE_LAUNCH.md` | Што мора пред реален launch |

---

## 5. Asset структура

### Нови директориуми

- `assets/icons/` — со `icon.svg` (постоечки)
- `assets/og/` — празен (за идно создавање на OG image, со TODO во документација)
- `archive/` — за стари верзии

---

## 6. README поправки

**Беше:** Спомнуваше непостоечки фајлови и функции како да се готови.

**Сега:** Точен опис на:

- Тековен статус (Public MVP, не регистрирана партија)
- Што е направено
- Што НЕ е направено (и зошто)
- Што бара правна проверка
- Сите placeholder-и јасно означени со `[ИМЕ НА ПРАВЕН СУБЈЕКТ]`, `[АДРЕСА]`, итн.
- Точен file listing
- Линкови до сите docs/ и legal/ документи

---

## 7. Што **намерно НЕ е променето**

Ова е важно за да се документира:

- ✅ **Целата визија** на иницијативата
- ✅ **Сите 12 принципи** и стратешки делови
- ✅ **Сите 10 индустриски шампиони** и нивните детали
- ✅ **Сите 80+1 општини**
- ✅ **Сите 6 институции** (вклучувајќи ЦРМ како pending партнер)
- ✅ **Сите 42 медиума** во Media Hub
- ✅ **Paragraf.mk интеграцијата**
- ✅ **5 јазици** превод
- ✅ **Дизајн, бои, фонтови, layout**
- ✅ **Бот M-S** (со 129+ KB записи и 133+ patterns)
- ✅ **Secciji за дијаспора** (Hub, Champions, Floating CTA)
- ✅ **3-патско упатство** (МК / ЕУ / прекуокеан)
- ✅ **Дигитален нотар** прототип (со јасен disclaimer „во подготовка“)
- ✅ **Сите анкети и интерактивни алатки** (со разбирање дека се без backend)

---

## 8. Резиме на структурни промени

### Фајлови додадени: ~15
### Фајлови преработени: ~5
### Фајлови преместени: 1
### Фајлови избришани: 0 (само заменети со подобри верзии)

---

## 9. Ризици кои остануваат

| Ризик | Mitigation |
|---|---|
| Сите legal/ документи се DRAFT | Треба правна проверка пред финализирање |
| Placeholder-и сè уште не се заменети | Видете `TODO_BEFORE_LAUNCH.md` |
| Нема реални PNG икони (192px, 512px) | SVG icon работи, но PNG препорачано за подобар PWA |
| Нема OG image за социјални мрежи | Препорачано пред медиумски ангажман |
| Firebase config иако disabled, постои во кодот | Може целосно да се отстрани во v0.2 |

---

## 10. Што да очекувате во следната верзија (0.2.0)

- Финализирани legal/ документи (по правна проверка)
- PNG икони за PWA (192, 512)
- OG image (1200×630)
- Plausible Analytics интеграција
- Реални placeholder вредности во: [ИМЕ], [АДРЕСА], [EMAIL]
- Подобрен accessibility (контраст, alt текст)

---

**Овој документ се ажурира со секоја значајна промена.** Видете `CHANGELOG.md` за timeline.

---

## 11. Phase 27 · Public-safe cleanup (финален пред launch)

### Деактивирани чувствителни форми

| Локација | Што беше | Што е сега |
|---|---|---|
| `#digital-enrollment` | 4-чекорна форма со ЕМБГ, ЛК upload, селфи, потпис, blockchain хаш | **Disclaimer banner** + минимална безбедна форма |
| `#founders-drive` | ЕМБГ, ЛК број, адреса полиња + PDF генератор | **Disclaimer notice**, PDF preview скриен (`display:none`), submit копче „Испрати интерес" |
| `#membership` | 3-нивоа форми (Поддржувач / КЕП / Заверен) со ЕМБГ + адреса | **Disclaimer banner** + линкови до docs |

### Нова безбедна форма (`#psInterestForm`)

8 полиња · нула чувствителни:
- ✅ Име, презиме (required)
- ✅ Email (required)
- ✅ Телефон (опционо)
- ✅ Општина / држава (опционо, free-text — без ЕМБГ-врзана селекција)
- ✅ Тип интерес: поддржувач / волонтер / дијаспора / правен тим / локален координатор
- ✅ Checkbox за согласност (експлицитно вели „не е официјално членство")
- ❌ Без ЕМБГ
- ❌ Без ЛК
- ❌ Без адреса
- ❌ Без upload документи
- ❌ Без потпис

Submit отвара `mailto:` (no backend, no сервер запис).

### Firebase config sanitized

**Беше:**
```javascript
apiKey: "YOUR_API_KEY",
authDomain: "makedonija-sistem.firebaseapp.com",
...
```

**Сега:**
```javascript
// Конфигурацискиот пример се чува во docs/BACKEND_ROADMAP.md
apiKey: "",
authDomain: "",
...
```

Реалниот config (за идна верзија) е во документација, не во активен код.

### Текстуални promени

| Беше | Сега |
|---|---|
| „⚡ Дигитално зачленување · Нотарски потпис" | „⚡ Дигитално зачленување · во подготовка" |
| „Целосно дигитален процес со... blockchain потврда" | „Концепт-приказ за иден дигитален процес. Во оваа јавна верзија ниедна функција не е активна" |
| Bot KB.notary („За правна тежина...") | Префиксиран со „⚠️ Оваа функција е во подготовка" |

### Поправени typos (Phase 28 corrections) · *historical references only*

| Беше (со латинско „a" во киридишен текст) | Сега (поправено) | Фајл |
|---|---|---|
| ~~прет·ставки~~ | претпоставки ✅ | README.md |
| ~~Овластено·tto лице~~ | Овластено лице ✅ | TODO_BEFORE_LAUNCH.md |
| ~~кра·жно ризик~~ | краен ризик ✅ | docs/SECURITY_PRIVACY.md |
| ~~не·мa backend~~ | нема backend ✅ | docs/FOUNDERS_PROCESS.md |

> *Точните typo стрингови се намерно прекршени со точки (·) за да не се појавуваат во grep пребарувања како активен проблем.*

### Verification

| Тест | Резултат |
|---|---|
| Активни ЕМБГ inputs | **0** ✅ |
| Активни ЛК inputs | **0** ✅ |
| Активни address inputs | **0** ✅ |
| Активни file uploads (селфи, ЛК) | **0** ✅ |
| Активни signature canvas | **0** ✅ |
| YOUR_API_KEY references | **0** ✅ |
| Public-safe disabled banners | **3** ✅ |
| Public-safe form fields | **8** ✅ |
| JS scripts валидни | **12 / 12** · 0 грешки ✅ |
| JSDOM critical errors | **0** ✅ |
| Manifest валиден + сите икони постојат | ✅ |
| SW pre-cache · сите фајлови постојат | ✅ |
| Локални линкови (9 total) — сите работат | ✅ |

### Задржано (намерно)

- ✅ **Целата визија** на иницијативата
- ✅ **Сите 10 индустриски шампиони** со целосните детали
- ✅ **Сите 6 институции** + ЦРМ pending
- ✅ **Сите 42 медиума**
- ✅ **80+1 општини**
- ✅ **Дијаспорски Hub**
- ✅ **3-патско упатство**
- ✅ **Bot M-S** (со softened formulations за нотар/blockchain)
- ✅ **5 јазици i18n**
- ✅ **Дизајн, бои, layout**
- ✅ **Концептуални секции** (#digital-enrollment, #membership) — задржани visualно за прикажување на идна архитектура, но **деактивирани функционално**


---

## 12. Phase 28 + 28b · Финални корекции

### Отстрането: orphaned JS references

**Беше:** form submit handler (~50 линии) сè уште реферираше `$('fdEMBG').value`, `$('fdLK').value`, `$('fdAddress').value` — иако HTML inputs беа отстранети во Phase 27. Тоа ќе фрлеше runtime exception (`Cannot read properties of null`).

**Сега:** Целиот handler заменет со **public-safe верзија**:
- Defensive lookup (`safe(id)` функција)
- Само 5 полиња: name, surname, email, phone, muni
- Отвара mailto: со изразен интерес
- Без ЕМБГ / ЛК / адреса каде било

**Беше:** downloadBtn handler генерираше PDF text со ЕМБГ, ЛК, адреса.

**Сега:** Заменет со no-op + информативна порака „PDF е во подготовка".

### Отстрането: 11,500 chars orphaned digital enrollment JS

Целиот блок `DIGITAL NOTARY ENROLLMENT SYSTEM` (12,385 → 898 chars):
- 4-step form navigation
- File upload handlers (deDocFront, deDocBack, deSelfie)
- Signature canvas drawing (deSignatureCanvas)
- Blockchain hash generator
- Member ID generator
- QR code generator
- Contract text builder со ЕМБГ референца
- PDF download со ЕМБГ во content

Заменет со **no-op комeнтар блок** + линкови до docs.

### Поправено: Firebase Realtime DB UI claims (5 јазици)

**Беше:**
- мк: „гласовите се чуваат во Firebase Realtime DB"
- en: „votes stored in Firebase Realtime DB"
- al: „votat ruhen në Firebase Realtime DB"
- ср: „гласови се чувају у Firebase Realtime DB"
- де: „Stimmen werden in Firebase Realtime DB gespeichert"

**Сега (сите 5 јазици):** „**Ова е демо анкета во public MVP. Гласовите не се зачувуваат на сервер** — се чуваат само локално во вашиот прелистувач."

### Поправено: Bot KB.firebase

**Беше:** Опис на Firebase како активна функционалност.

**Сега:** Експлицитно вели „**во подготовка**", „FIREBASE_ENABLED = false", и упатува до `docs/BACKEND_ROADMAP.md`.

### Поправено: CSS правило за #deSignatureCanvas

**Беше:** Active style правило за elемент што не постои.

**Сега:** `display: none !important` со коментар „element removed in public MVP 0.1.0".

### Поправени typos (Phase 28 corrections) · *historical references*

Сите 4 typos поправени во:
- README.md (претпоставки)
- TODO_BEFORE_LAUNCH.md (Овластено лице)
- docs/SECURITY_PRIVACY.md (краен ризик)
- docs/FOUNDERS_PROCESS.md (нема backend)

> *Оригиналните typo стрингови не се повторуваат тука за да не се појавуваат во grep пребарувања како отворен проблем.*

### Финални checks (сите ✅)

| # | Тест | Резултат |
|---|---|---|
| 1 | fdEMBG/fdLK/fdAddress JS references | **0** ✅ |
| 2 | Orphaned digital enrollment JS (deEmbg, deDoc*, deSelfie...) | **0** ✅ |
| 3 | Firebase Realtime DB UI claims | **0** ✅ |
| 4 | YOUR_API_KEY references | **0** ✅ |
| 5 | Active ЕМБГ inputs (UI) | **0** ✅ |
| 6 | Active ЛК inputs (UI) | **0** ✅ |
| 7 | Active address inputs (UI) | **0** ✅ |
| 8 | Active file uploads (UI) | **0** ✅ |
| 9 | Active signature canvas (UI) | **0** ✅ |
| 10 | JS scripts валидност | **12 / 12 · 0 errors** ✅ |
| 11 | JSDOM критични errors | **0** ✅ |
| 12 | Duplicate IDs | **0** (368 unique) ✅ |
| 13 | Broken internal anchors | **0** (47 working) ✅ |
| 14 | Manifest.json валиден + икона постои | ✅ |
| 15 | Service Worker pre-cache · сите 5 фајла постојат | ✅ |

---

## 13. Phase 29 · Финален polish

### Додадено: OG image placeholder

**Беше:**
```html
<meta property="og:image" content="https://makedonijasistem.mk/assets/og/og-image.png">
```
- Хардкодиран absolute URL кон непостоечки фајл
- Домен `makedonijasistem.mk` не е потврден
- PNG не постои на disk

**Сега:**
```html
<meta property="og:image" content="assets/og/og-image.svg">
```
- Релативна патека (работи под било кој домен)
- SVG фајл создаден: `assets/og/og-image.svg` (1200×630, 2,107 bytes)
- Професионален дизајн со navy/gold gradient + статус „PUBLIC MVP · 0.1.0 · НАЦРТ-ВЕРЗИЈА"

Twitter:image и Schema.org logo references исто така ажурирани кон релативни патеки.

### Отстрането: дупликат inline base64 manifest

**Беше — две manifest декларации:**
```html
<link rel="manifest" href="data:application/json;base64,eyJuYW1lIjoi...">  <!-- 1 -->
<link rel="manifest" href="/manifest.json">                                  <!-- 2 -->
```

**Сега — само една:**
```html
<link rel="manifest" href="/manifest.json">
```

### Archive safety

**Беше:** `archive/makedonija-sistem-platform-v17-FINAL.html` — стара верзија со ЕМБГ, ЛК, upload, Firebase Realtime DB claims, YOUR_API_KEY placeholder.

**Сега:**
- Фајлот **преименуван** во `.html.disabled`
- GitHub Pages **нема да го serve** како HTML (404 за директни обиди)
- Додаден `archive/README.md` со јасно објаснување зошто е disabled
- `.gitignore` додаден да исклучи `*.disabled.bak` варијации

### Отстрането: Firebase + Turnstile external scripts

**Беше — 6 external dependencies:**
```html
<link rel="preload" href=".../firebase-app-compat.js" as="script">
<link rel="preload" href=".../firebase-database-compat.js" as="script">
<link rel="preload" href=".../turnstile/v0/api.js" as="script">
<script src=".../firebase-app-compat.js"></script>
<script src=".../firebase-database-compat.js"></script>
<script src=".../turnstile/v0/api.js" async defer></script>
```

**Сега:** Сите 6 отстранети + експлицитен HTML коментар објаснува зошто.

**Бенефити:**
- Помалку надворешни зависности
- Подобра приватност (нема pinging кон Google/Cloudflare)
- Подобра брзина (~150KB помалку код)
- Усогласеност со FIREBASE_ENABLED = false

### Ажурирани poll messages (5 јазици)

**Беше:**
- мк: „резултатите се менуваат во **реално време**"
- en: „results update in **real time**"
- al: „rezultatet ndryshojnë në **kohë reale**"
- ср: „резултати се мењају у **реалном времену**"
- де: „Ergebnisse werden in **Echtzeit** aktualisiert"

**Сега (сите 5 јазици):**
- „**демо анкета** · гласовите се чуваат локално"

Inline H2 во poll секциja исто така ажурирано. KB.poll bot entry префиксиран со „⚠️ Во public MVP 0.1.0 ова е демо анкета: гласовите се чуваат само локално во прелистувачот, не на сервер."

### FIXES_APPLIED.md grep noise

Старите 4 typo стрингови во FIXES документот сега се прикажани со точки (·) или историски опис, така да grep пребарувања не ги појавуваат како активни проблеми.

### Финални 10/10 launch checks

| # | Проверка | Резултат |
|---|---|---|
| 1 | YOUR_API_KEY во активни public фајлови | **0** ✅ |
| 2 | fdEMBG/fdLK/fdAddress во активен index.html | **0** ✅ |
| 3 | input type=file во активен index.html | **0** ✅ |
| 4 | Firebase Realtime DB claim во активен UI | **0** ✅ |
| 5 | Missing OG image | **0** (SVG постои) ✅ |
| 6 | Manifest декларации | **1** (единствена) ✅ |
| 7 | Manifest.json валиден | ✅ |
| 8 | SW pre-cache · сите фајли постојат | ✅ (5/5) |
| 9 | Archive HTML deploy-нувани | **0** (.disabled extension) ✅ |
| 10 | Firebase/Turnstile external scripts | **0** ✅ |

**Бонус:**
- JS scripts: 12 / 0 errors ✅
- JSDOM критични грешки: 0 ✅
- External scripts: **0** (од 3 на 0) ✅
- Active sensitive UI elements: **0** ✅

---

## 14. Phase 30 · Финален mini-fix · poll/Firebase wording

### Poll success message ажуриран

**Беше:**
```
✓ Вашиот глас е зачуван! Резултатите се ажурираат во реално време.
```

**Сега:**
```
✓ Вашиот глас е зачуван локално во вашиот прелистувач. Ова е demo poll во public MVP.
```

### Offline poll banner ажуриран

**Беше:**
```
📡 Офлајн режим — гласовите ќе се испратат кога ќе се поврзете повторно.
```

**Сега:**
```
📡 Офлајн режим — гласовите остануваат зачувани локално во вашиот прелистувач.
```

### Bot KB.offline ажуриран

**Беше:**
```
Анкетата ги задржува гласовите локално и ги испраќа во Firebase кога ќе се поврзеш.
```

**Сега:**
```
Анкетата ги задржува гласовите локално во прелистувачот. Во public MVP нема Firebase синхронизација.
```

(„Auto-resync" точка во KB.offline исто така отстранета — не е применлива без Firebase.)

### CSP исчистен

**Беше (498 chars):**
```
default-src 'self';
script-src 'self' 'unsafe-inline' https://www.gstatic.com https://challenges.cloudflare.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://challenges.cloudflare.com;
img-src 'self' data: https: blob:;
frame-src https://challenges.cloudflare.com;
manifest-src 'self';
```

**Сега (236 chars):**
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self';
img-src 'self' data: https: blob:;
manifest-src 'self';
```

**Отстрането:**
- ❌ `https://www.gstatic.com` (Firebase scripts)
- ❌ `https://challenges.cloudflare.com` (Turnstile API + frame)
- ❌ `https://*.firebaseio.com` (Firebase DB connections)
- ❌ `https://*.googleapis.com` (Firebase / Google APIs)
- ❌ `frame-src` директива (нема iframe-ови)

**Задржано:**
- ✅ `https://fonts.googleapis.com` (Google Fonts CSS)
- ✅ `https://fonts.gstatic.com` (Google Fonts files)

CSP е сега **47% помал** и значително побезбеден — само нужните Google Fonts dependencies.

### Финални 10/10 launch проверки

| # | Проверка | Резултат |
|---|---|---|
| 1 | YOUR_API_KEY | **0** ✅ |
| 2 | fdEMBG/fdLK/fdAddress | **0** ✅ |
| 3 | input type=file | **0** ✅ |
| 4 | Active sensitive forms (ЕМБГ/ЛК/Address/Files/Canvas) | **0** ✅ |
| 5 | Fake Firebase/backend claims | **0** ✅ |
| 6 | JS validity (12 scripts) | **0 errors** ✅ |
| 7 | Manifest.json валиден | ✅ |
| 8 | SW pre-cache · сите 5 фајла | ✅ |
| 9 | Archive disabled (`.disabled` extension) | ✅ |
| 10 | CSP без Firebase/Turnstile domains | ✅ |

**Бонус JSDOM тест:**
- 0 critical errors
- 0 external script tags (script[src^=http])
- 10/6/42/6/8/3 шампиони/институции/медиума/дрон сектори/рудници/disabled banners — сите задржани

