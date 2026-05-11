# 💻 Development Setup

Целосно упатство за развој на Македонија — Систем локално.

---

## 📋 Барања

- **Git** ([download](https://git-scm.com/))
- **Текст едитор** (VS Code препорачано)
- **Python 3** или **Node.js** (за локален сервер)
- **Современ браузер** (Chrome, Firefox, Safari, Edge)

---

## 🚀 Setup

```bash
# 1. Клонирaj
git clone https://github.com/makedonijasistem/platform.git
cd platform

# 2. Локален сервер (избери една)

# Python (доаѓа со macOS/Linux)
python3 -m http.server 8080

# Node.js (ако имаш npm)
npx serve

# PHP (ако имаш)
php -S localhost:8080

# 3. Отвори
# http://localhost:8080
```

---

## 🏗️ Архитектура

### Single-file дизајн
Целата платформа е во **`index.html`** (1.5 MB) со:
- Сите CSS inline во `<style>`
- Сите JS inline во `<script>`
- Никакви external dependencies (освен Google Fonts)

**Зошто single-file?**
- ✅ Лесен deployment (само upload)
- ✅ Брзо вчитување (1.5s)
- ✅ Работи на GitHub Pages без build process
- ✅ Лесно тестирање

**Зошто не split-нати фајлови?**
- За GitHub Pages — повеќе HTTP requests = побавно
- За одржување — single file е лесен за грeп/edit
- Идна фаза (v3.0+) може да се split-не со Vite/Webpack

---

## 📂 Структура на index.html

```html
<!DOCTYPE html>
<html lang="mk">
<head>
  <!-- Meta tags, SEO, PWA -->
  <style>
    /* CSS Variables (бои, fontови) */
    /* Layout grids */
    /* Components per phase: 
       - Phase 10: .wp- (networking)
       - Phase 11: .muni-
       - Phase 12: .mag-v2-
       - Phase 13: .ind-
       - Phase 14: .dia-
       - Phase 15: .fd-
       - Phase 16: .dn-
       - Phase 17: .rm-
       - Phase 18: .gd-
    */
  </style>
</head>
<body>
  <!-- 12 главни секции -->
  <header><nav></nav></header>
  <main>
    <section id="hero">...</section>
    <section id="programme">...</section>
    <section id="industrial-champions">...</section>
    <section id="robotika-macedonia">...</section>
    <section id="economy">...</section>
    <section id="diaspora">...</section>
    <section id="diaspora-hub">...</section>
    <section id="diaspora-champions">...</section>
    <section id="founders-drive">...</section>
    <section id="guide">...</section>
    <section id="membership">...</section>
    <section id="party-networking">...</section>
    <section id="municipalities">...</section>
    <section id="monthly-magazine">...</section>
    <section id="contact">...</section>
  </main>
  <footer>...</footer>

  <!-- Bot M-S модал -->
  <div id="botModal">...</div>

  <!-- 9 inline скрипти -->
  <script>/* Главен IIFE: i18n, theme, navigation, bot */</script>
  <script>/* Networking standalone */</script>
  <script>/* Municipalities standalone */</script>
  <script>/* Magazine V2 standalone */</script>
  <script>/* Diaspora integration */</script>
  <script>/* Founders Drive */</script>
  <script>/* Digital Notary */</script>
  <script>/* Guide path switcher */</script>
  <script>/* Service Worker registration */</script>
</body>
</html>
```

---

## 🎨 CSS Conventions

### CSS Variables (--name)
```css
:root {
  /* Бои */
  --navy-deep: #0a1d3a;
  --gold: #d4ad4a;
  --cream: #fdfbf5;
  
  /* Fontови */
  --serif: 'Source Serif Pro', Georgia, serif;
  --sans: 'Inter', -apple-system, sans-serif;
  --mono: 'JetBrains Mono', Consolas, monospace;
}
```

### Naming
Префикси по компонента:
- `.wp-` → World Parties (networking)
- `.muni-` → Municipalities
- `.mag-v2-` → Magazine V2
- `.ind-` → Industrial
- `.rm-` → Robotika Macedonia
- `.dia-` → Diaspora
- `.fd-` → Founders Drive
- `.dn-` → Digital Notary
- `.gd-` → Guide

### Responsive
Mobile-first:
```css
.element { /* mobile defaults */ }

@media (max-width: 640px) { /* small mobile */ }
@media (min-width: 768px) { /* tablet */ }
@media (min-width: 1024px) { /* desktop */ }
```

---

## 🧩 JavaScript Conventions

### IIFE pattern
Сите standalone скрипти се вo IIFE за изолација:

```javascript
(function() {
  'use strict';
  try {
    // твојот код
  } catch (err) {
    console.warn('[component-name] error:', err && err.message ? err.message : err);
  }
})();
```

### DOM access
```javascript
const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

// Безбедно (со null check):
const el = $('myEl');
if (el) el.textContent = 'Value';
```

### localStorage safety
```javascript
function safeGet(key, fallback) {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch(e) {
    return fallback;
  }
}

function safeSet(key, val) {
  try {
    localStorage.setItem(key, val);
    return true;
  } catch(e) {
    return false;
  }
}
```

---

## 🌐 i18n систем

Главниот објект:
```javascript
const translations = {
  mk: {
    'nav.programme': 'Програма',
    // ...
  },
  en: {
    'nav.programme': 'Programme',
    // ...
  },
  // al, sr, de
};
```

### HTML елементи
```html
<a href="#programme" data-i18n="nav.programme">Програма</a>
<input data-i18n-placeholder="search.placeholder" placeholder="Барај...">
```

### JavaScript промена на јазик
```javascript
function setLanguage(lang) {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const value = translations[lang]?.[key];
    if (value) el.innerHTML = value; // или textContent
  });
  // placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.dataset.i18nPlaceholder;
    const value = translations[lang]?.[key];
    if (value) el.placeholder = value;
  });
  localStorage.setItem('mks_lang', lang);
}
```

---

## 🤖 Bot M-S систем

### KB структура
```javascript
const KB = {
  greeting: `<b>Здраво!</b> Како можам да ти помогнам?`,
  
  programme: `<b>📋 Програма</b><br><br>...
              ${link('#programme', 'Види ja целата')}`,
  
  // 120+ записи
};
```

### Pattern matching
```javascript
const PATTERNS = [
  { test: /(здраво|hello|hi)/i, fn: () => KB.greeting },
  { test: /(програм|programme)/i, fn: () => KB.programme },
  // 124+ patterns
];

function findResponse(query) {
  const q = query.toLowerCase();
  for (const p of PATTERNS) {
    if (p.test.test(q)) return p.fn();
  }
  return KB.fallback;
}
```

---

## 🧪 Testing

### Manual checklist
```
□ Десктоп (Chrome, Firefox, Safari)
□ Mobile (iOS Safari, Chrome Android)
□ Сите 5 јазици преведени
□ Bot отговара на сите quick buttons
□ Forms генерираат точни PDFs/mailto
□ localStorage функционира
□ ServiceWorker се регистрира (HTTPS)
□ Сите линкови работат (без 404)
□ Console без грешки
```

### Automated
```bash
# Validate JavaScript
npx acorn-cli index.html

# Validate HTML
npx html-validate index.html

# Lighthouse
npx lighthouse http://localhost:8080 --view
```

---

## 🔍 Debug

### Browser Console
Притисни **F12** → Console tab.

Корисни команди:
```javascript
// Тестирај i18n
setLanguage('en')

// Прикажи KB запис
KB.programme

// Browse localStorage
Object.keys(localStorage).forEach(k => console.log(k, localStorage[k]))

// Reset все local data
localStorage.clear()
```

### Service Worker debug
Chrome DevTools → Application tab → Service Workers

```
✅ Status: activated and running
✅ Source: /sw.js
✅ Cache Storage: mks-v2.1-2026-05-10
```

---

## 📦 Build process (тренутно нема)

Платформата нема build step. Само git push → GitHub Actions deployира.

**Кога ќе се додаде build (v3.0+):**
- TypeScript compilation
- CSS minification
- JavaScript bundling
- Image optimization
- Critical CSS inlining

---

## 🤝 Pull Request workflow

```bash
# 1. Sync
git fetch origin
git checkout main
git pull origin main

# 2. Branch
git checkout -b feature/my-improvement

# 3. Code
# ... направи промени

# 4. Commit
git add .
git commit -m "feat: добави нова функционалност"

# 5. Push
git push origin feature/my-improvement

# 6. PR на GitHub
# Open https://github.com/makedonijasistem/platform/compare/...
```

---

🇲🇰 **Среќно со развојот!** Прашања → makedonijasistem@gmail.com
