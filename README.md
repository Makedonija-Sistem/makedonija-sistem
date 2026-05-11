<div align="center">

# 🇲🇰 Македонија — Систем

### Држава што функционира · Систем — не партија

[![Version](https://img.shields.io/badge/version-0.1.0--public--mvp-d4ad4a)](VERSION)
[![License](https://img.shields.io/badge/license-CC%20BY--NC%204.0-blue)](LICENSE)
[![Status](https://img.shields.io/badge/status-draft-orange)]()
[![Languages](https://img.shields.io/badge/languages-5-success)]()
[![PWA](https://img.shields.io/badge/PWA-ready-purple)]()

**Граѓанска, институционална и реформска платформа за модерна македонска држава**

[📖 Прочитај Програма](legal/PROGRAM.md) · [🏛️ Институции](#-институционална-рамка) · [📊 Анкета](#) · [🌍 Дијаспора](#) · [📞 Контакт](#)

---

</div>

## ⚠️ Важно пред да продолжите

**Македонија — Систем** во оваа верзија (v0.1.0) е **граѓанска иницијатива и предлог-модел**, **НЕ** регистрирана политичка партија. Платформата е во **подготовка** и претставува:

✅ Јавна презентација на принципи и програма  
✅ Покана за поддршка преку *интерес* (не официјално членство)  
✅ База за дискусија и граѓанско ангажирање  
❌ **НЕ е** официјален регистар на основачи  
❌ **НЕ е** платформа за нотарска заверка  
❌ **НЕ собира** чувствителни лични податоци (ЕМБГ, лична карта, потпис)  

Сите правни, финансиски и организациски претпоставки во документацијата се **нацрт-предлози** кои бараат **финална правна проверка** пред официјална употреба.

---

## 📊 Што содржи платформата

| Категорија | Број | Опис |
|---|---:|---|
| 🏭 **Индустриски шампиони** | **13** | Робтика, водороден автомобил, MK-Drones, MK-Phone, рудни ресурси, хипермаркети, враќање мозоци, итн. |
| 🏛️ **Институции** | **11** | АЗЛП, ЦРМ, МНР, ФЕЗ, НБРМ, МИПС, КИБС, КАСИС, и други |
| 📡 **Медиуми и подкасти** | **79** | 10 ТВ + 8 радио + 37 портали + 5 печат + 4 агенции + 12 подкасти + 3 дијаспора |
| 🏘️ **Општини** | **80+1** | Сите 80 општини на РСМ + Град Скопје |
| 🌍 **Јазици i18n** | **5** | Македонски, англиски, албански, српски, германски |
| ⛏️ **Рудни потенцијали** | **3** | Алшар, Иловица-Штука, Казандол |
| 💰 **Инвестиции до 2030** | **€15.8B** | Потенцијал од сите 13 шампиони |
| 👷 **Високотехнолошки места** | **81,500** | Цел до 2030 |

---

## 🎯 Принципи

> **Ред · Закон · Одговорност · Меритократија · Функционални институции**

12 столбови на државна реформа:

1. **Институции пред личности**
2. **Меритократски стандарди** во јавна администрација
3. **Транспарентност** на јавни ресурси
4. **Антикорупциски стандарди** (Equator Principles)
5. **Дигитализација** на државни услуги
6. **Дијаспора** како системски партнер
7. **Локален развој** (80+1 општини)
8. **Образование** + STEM + AI таленти
9. **Одговорно рударство** (≥51% домашно + еко стандарди)
10. **Финансиска инфраструктура** (НБРМ, МИПС, КИБС, КАСИС)
11. **Индустриска стратегија** (13 шампиони, 14 ТИРЗ зони)
12. **Транспарентна анкета** (1 глас по уред · без верификација идентитет)

Детали во [`legal/PROGRAM.md`](legal/PROGRAM.md).

---

## 🚀 Quickstart

### Локално стартување

```bash
# Опција 1: Python (вграден)
python3 -m http.server 8080

# Опција 2: Node.js
npx serve

# Опција 3: PHP
php -S localhost:8080
```

Отвoри: **http://localhost:8080**

### Production deploy (GitHub Pages)

Видете [`UPLOAD_GUIDE.md`](UPLOAD_GUIDE.md) за чекор-по-чекор водич.

```bash
# Брз deploy:
git init
git add .
git commit -m "🎉 Initial public MVP 0.1.0"
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
# → Settings → Pages → Source: main / root → Save
```

---

## 📁 Структура

```
makedonija-sistem-repo/
├── index.html               ← Главна страница (1.8 MB)
├── 404.html                 ← Custom error page
├── manifest.json            ← PWA конфигурација
├── sw.js                    ← Service Worker
├── assets/
│   ├── icons/icon.svg       ← PWA икона
│   └── og/og-image.svg      ← Open Graph (1200×630)
├── docs/                    ← 13 технички документи
├── legal/                   ← 5 нацрт правни документи (DRAFT)
├── archive/                 ← Стари верзии (не се deploy)
└── .github/                 ← Workflows + templates
```

---

## 🛡️ Безбедност и приватност

✅ **0** активни чувствителни UI елементи (ЕМБГ, ЛК, адреса, документи)  
✅ **0** external tracking scripts  
✅ **0** Firebase / Google Analytics / Plausible  
✅ **0** YOUR_API_KEY placeholder-и  
✅ **0** fake backend claims  

Единствени external resources: **Google Fonts** (CSS + font files).

Детали во [`docs/SECURITY_PRIVACY.md`](docs/SECURITY_PRIVACY.md).

---

## 🌐 Технички спецификации

| Атрибут | Вредност |
|---|---|
| **Тип** | Static HTML/CSS/JS (вграден single-file) |
| **Backend** | Нема (planet-friendly!) |
| **JS файлови** | 12 inline scripts · 0 errors |
| **External** | Само Google Fonts |
| **PWA** | ✅ Yes (offline + installable) |
| **Mobile** | ✅ Responsive |
| **A11y** | WCAG 2.1 AA basic |
| **Browser** | Chrome 90+, Safari 14+, Firefox 88+, Edge 90+ |
| **Performance** | Lighthouse 90+ |

---

## 📚 Документација

### За корисници
- [`QUICK_START.md`](QUICK_START.md) — Брз вовед
- [`UPLOAD_GUIDE.md`](UPLOAD_GUIDE.md) — GitHub Pages deployment

### За develop-ери
- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — Архитектура
- [`docs/DEVELOPMENT.md`](docs/DEVELOPMENT.md) — Local dev setup
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) — Production deploy
- [`docs/BACKEND_ROADMAP.md`](docs/BACKEND_ROADMAP.md) — Идна backend архитектура

### За контрибутори
- [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) — Како да придонесеш
- [`docs/CODE_OF_CONDUCT.md`](docs/CODE_OF_CONDUCT.md) — Правила на однесување

### Стратегија
- [`docs/ROADMAP.md`](docs/ROADMAP.md) — План за идните фази
- [`docs/MEDIA_KIT.md`](docs/MEDIA_KIT.md) — За медиуми
- [`docs/LAUNCH_CHECKLIST.md`](docs/LAUNCH_CHECKLIST.md) — Што пред launch

### Правни (DRAFT)
- [`legal/PROGRAM.md`](legal/PROGRAM.md) — Програма (нацрт)
- [`legal/STATUTE.md`](legal/STATUTE.md) — Статут (нацрт)
- [`legal/CODEX.md`](legal/CODEX.md) — Кодекс (нацрт)
- [`legal/PRIVACY.md`](legal/PRIVACY.md) — Политика за приватност
- [`legal/TERMS.md`](legal/TERMS.md) — Услови за користење

---

## 🤝 Како да помогнеш

1. **Заѕвезди го** репозиториумот ⭐
2. **Сподели го линкот** со пријатели и дијаспора
3. **Гласај** во отворената анкета
4. **Отвоpи issue** ако најдеш грешка
5. **Предложи** нова функционалност преку pull request
6. **Прати email** на тимот (placeholder тековно)

---

## 📊 Roadmap

### ✅ Phase 0-38 (завршено)
- Платформа со 13 шампиони, 11 институции, 79 медиума
- 5 јазици i18n
- PWA + Service Worker
- Public-safe (без чувствителни податоци)

### 🚧 Phase 39 — пред launch (следно)
- [ ] Правен преглед на нацрт документи
- [ ] Регистрација на домен `makedonijasistem.mk`
- [ ] Поставување email инфраструктура
- [ ] Социјални медиум профили
- [ ] Прв јавен ангажман

### 🔮 Phase 40+ (по правна основа)
- [ ] Backend инфраструктура (Firebase или сличен)
- [ ] Реална anketa со server-side персистенција
- [ ] Donation систем (преку НБРМ/КАСИС/банка)
- [ ] Дигитално зачленување со КЕП (преку КИБС)
- [ ] Регистрација на правен субјект (ЦРМ)

Детали во [`docs/ROADMAP.md`](docs/ROADMAP.md).

---

## 📞 Контакт

- **Web:** https://makedonijasistem.mk (по domain регистрација)
- **Email:** *placeholder* `[EMAIL ЗА КОНТАКТ]`
- **GitHub Issues:** За технички прашања
- **Social Media:** *по официјална регистрација*

---

## 📜 Лиценца

**[Creative Commons BY-NC 4.0](LICENSE)** · Слободно за некомерцијална употреба со атрибуција.

---

<div align="center">

### 🇲🇰 Држава што функционира — се гради со план.

**Систем · Не партија.**

[![Macedonia](https://img.shields.io/badge/🇲🇰-За_Македонија-c8102e)](https://makedonijasistem.mk)

---

*Се гради со ❤️ за матичната земја · v0.1.0 · 2026*

</div>
