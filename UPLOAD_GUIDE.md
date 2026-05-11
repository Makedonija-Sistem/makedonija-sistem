# 🚀 GitHub Pages Upload Guide · Македонија — Систем

> **Status:** Production-ready · v0.1.0-public-mvp
> **Last validated:** Сите тестови поминати ✅
> **Estimated time:** 10-15 минути

---

## 📋 Што имаш во ZIP-от

```
makedonija-sistem-repo/
├── index.html                       (1.8 MB · главна страница)
├── 404.html                         (custom error page)
├── manifest.json                    (PWA конфигурација)
├── sw.js                            (Service Worker · offline support)
├── sitemap.xml                      (SEO)
├── robots.txt                       (SEO)
├── CNAME                            (custom domain · ако имаш)
├── .nojekyll                        (GitHub Pages config)
├── .gitignore
├── VERSION                          (0.1.0-public-mvp)
├── README.md                        (преглед)
├── LICENSE                          (CC BY-NC 4.0)
├── QUICK_START.md
├── CHANGELOG.md
├── FIXES_APPLIED.md
├── TODO_BEFORE_LAUNCH.md
│
├── assets/
│   ├── icons/icon.svg               (PWA икона · 591 bytes)
│   └── og/og-image.svg              (Open Graph · 1200×630)
│
├── docs/                            (13 технички документи)
│   ├── ARCHITECTURE.md
│   ├── BACKEND_ROADMAP.md
│   ├── DEPLOYMENT.md
│   ├── SECURITY_PRIVACY.md
│   └── ... (9 more)
│
├── legal/                           (5 нацрт правни документи)
│   ├── CODEX.md
│   ├── PRIVACY.md
│   ├── PROGRAM.md
│   ├── STATUTE.md
│   └── TERMS.md
│
├── archive/                         (стари верзии · НЕ се deploy)
│   ├── README.md
│   ├── CHANGELOG_SECURITY_NOTES.md
│   └── *.html.disabled
│
├── api/
│   └── README.md                    (placeholder за идна backend)
│
└── .github/
    ├── workflows/deploy.yml         (auto-deploy при push)
    ├── ISSUE_TEMPLATE/              (5 темплати)
    └── PULL_REQUEST_TEMPLATE.md
```

---

## 🎯 Опција 1: Преку GitHub Web (најлесно, без command line)

### Чекор 1: Создавање на репозиторум

1. Оди на **[github.com](https://github.com)** и логирај се
2. Кликни **„+" во горниот десен агол** → **„New repository"**
3. Пополни:
   - **Repository name:** `makedonija-sistem` (или `makedonija-sistem.github.io` за personal)
   - **Description:** `🇲🇰 Граѓанска, институционална и реформска платформа за модерна македонска држава`
   - **Public** (мора за бесплатни GitHub Pages)
   - ❌ НЕ означувај „Add a README" (имаме веќе)
   - ❌ НЕ означувај gitignore (имаме веќе)
   - ❌ НЕ означувај license (имаме веќе)
4. Кликни **„Create repository"**

### Чекор 2: Upload на фајлови

1. На празната страница на репозиториумот, кликни **„uploading an existing file"**
2. **Распакувај го ZIP-от** на твојот компјутер
3. **Селектирај СИТЕ фајлови** во папката `makedonija-sistem-repo/` (со Ctrl+A / Cmd+A)
4. **Drag-and-drop** во GitHub
5. Скрол долу:
   - **Commit message:** `🎉 Initial public MVP 0.1.0`
   - **Extended description:** `Граѓанска платформа за модерна Македонија. 13 индустриски шампиони · 11 институции · 79 медиума и подкасти · 5 јазици i18n. Без чувствителни лични податоци. Без external tracking.`
6. Кликни **„Commit changes"**

⚠️ **Важно:** Ако GitHub каже „too many files" — раздели го upload-от во 2-3 batch-а (прв batch: главни фајлови, втор batch: docs/, трет batch: legal/+archive/+.github/).

### Чекор 3: Активирање на GitHub Pages

1. Во репозиториумот, кликни **„Settings"** (горен мени)
2. Лево скрол до **„Pages"**
3. Под **„Build and deployment"**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (или `master`)
   - **Folder:** `/ (root)`
4. Кликни **„Save"**

### Чекор 4: Проверка (по 1-2 минути)

1. Освежи Settings → Pages
2. Ќе видиш:
   ```
   ✅ Your site is live at https://<username>.github.io/makedonija-sistem/
   ```
3. Кликни линкот → платформата е жива!

---

## ⚡ Опција 2: Преку Command Line (за брзо ажурирање во иднина)

### Pre-requisites

- Git инсталиран ([git-scm.com](https://git-scm.com/downloads))
- GitHub account
- ZIP распакуван локално

### Команди

```bash
# 1. Влез во папката
cd path/to/makedonija-sistem-repo

# 2. Иницијализирај Git
git init
git branch -M main

# 3. Додај сè
git add .

# 4. Прв commit
git commit -m "🎉 Initial public MVP 0.1.0

Граѓанска платформа за модерна Македонија.
• 13 индустриски шампиони (€15.8B / 81,500 места)
• 11 институции (вкл. ФЕЗ, НБРМ, МИПС, КИБС, КАСИС)
• 79 медиума и подкасти
• 80+1 општини
• 5 јазици i18n (мк / en / al / sr / de)
• 0 чувствителни UI елементи
• 0 external scripts
• 0 fake backend claims"

# 5. Поврзи со GitHub (замени <username> и <repo>)
git remote add origin https://github.com/<username>/<repo>.git

# 6. Push на GitHub
git push -u origin main
```

### Активирај Pages

```bash
# По push-от, оди на:
# https://github.com/<username>/<repo>/settings/pages
# 
# Source: Deploy from a branch
# Branch: main
# Folder: / (root)
# Save
```

---

## 🌐 Опција 3: Custom Domain (ако имаш makedonijasistem.mk)

### Подготовка

CNAME фајлот веќе постои во ZIP-от со содржина `makedonijasistem.mk`.

### Чекори

1. **Во репозиториумот → Settings → Pages**
2. Под **„Custom domain"** напиши: `makedonijasistem.mk`
3. Кликни **„Save"**
4. Означи **„Enforce HTTPS"** (ќе биде достапно по 24-48ч)

### DNS конфигурација (кaj домен провајдер)

Кликни на твојот domain провајдер (Macedonia.MK, NIC.MK, GoDaddy, итн.) и додај:

```dns
# A records (за apex домен)
@   A   185.199.108.153
@   A   185.199.109.153
@   A   185.199.110.153
@   A   185.199.111.153

# CNAME (за www поддомен)
www CNAME <username>.github.io.
```

⏱️ **Време за propagation:** 2-48 часа.

---

## ✅ Post-Deployment Checklist

По упload-от, провери:

- [ ] Главната страница се отвoрува: `https://<username>.github.io/makedonija-sistem/`
- [ ] Иконата е видлива во browser tab (M·SISTEM)
- [ ] Сите 9 секции работат:
  - Hero / Принципи / Шампиони / Институции / Медиум Hub / Дијаспора / Анкета / Општини / Контакт
- [ ] Менувачот на јазик работи (5 јазици)
- [ ] Тематски прекин (dark/light) работи
- [ ] Bot M-S одговара на прашања
- [ ] PWA install promo се појавува (на мобилен)
- [ ] „Add to Home Screen" работи (мобилен) — со М иконата
- [ ] 404 страница работи: `https://...github.io/<repo>/непостоечка-страна`
- [ ] Social share копчињата работат
- [ ] Анкетата дозволува гласање (1 глас по уред)

---

## 🛠️ Како да ажурираш во иднина

### Со GitHub Web

1. Влез во репозиториумот
2. Кликни на фајл што сакаш да ажурираш
3. Кликни иконата **„Edit" (молив)**
4. Направи промена
5. На дното: **„Commit changes"**

GitHub Pages автоматски ќе re-deploy-нe за 1-2 минути.

### Со Command Line

```bash
cd makedonija-sistem-repo

# Направи промени...

git add .
git commit -m "Опис на промена"
git push
```

---

## 🆘 Troubleshooting

### „404 Page Not Found" по deploy

- Провери дека `.nojekyll` фајлот е во root-от (за `.github` именикот да не се игнорира)
- Чекај 5 минути по првиот push — понекогаш Pages треба време
- Освежи без cache: `Ctrl+Shift+R` (Windows) или `Cmd+Shift+R` (Mac)

### „Custom domain not working"

- Провери дека DNS пропагирал: [dnschecker.org](https://dnschecker.org)
- Можеби чекаш до 48ч
- Провери дека CNAME фајлот содржи **точно** `makedonijasistem.mk` (без www, без https://, без /)

### „Site is not secure" (HTTPS)

- GitHub автоматски обезбедува HTTPS преку Let's Encrypt
- Чекај до 24ч по првиот deploy
- Settings → Pages → означи „Enforce HTTPS"

### Update не се појавува

- GitHub Pages има cache од 10 минути
- Освежи со Ctrl+F5 / Cmd+Shift+R
- Чекај максимум 10 минути

---

## 📊 Технички спецификации

| Метрика | Вредност |
|---|---|
| **index.html** | 1.8 MB |
| **Total ZIP** | 931 KB |
| **JS scripts** | 12 (сите валидни) |
| **External scripts** | 0 ✅ |
| **CSS файлови** | Inline во HTML |
| **Бројки во CSP** | 236 chars (минимум) |
| **PWA capable** | ✅ Yes (manifest + SW + icon) |
| **Offline support** | ✅ Service Worker |
| **i18n** | 5 јазици |
| **Browser support** | Chrome 90+, Safari 14+, Firefox 88+, Edge 90+ |

---

## 🎓 Корисни ресурси

- **GitHub Pages docs:** https://docs.github.com/en/pages
- **Custom domain setup:** https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site
- **DNS pojмови:** https://www.cloudflare.com/learning/dns/what-is-dns/
- **PWA проверка:** https://web.dev/measure/

---

## 📞 Што следно

По upload-от и активацијата:

1. **Сподели го линкот** со пробни корисници (5-10 луѓе) за feedback
2. **Прибери коментари** на дизајн, content, грешки
3. **Чекор 2:** регистрирај `makedonijasistem.mk` домен (ако сè уште не) — ~10 EUR/год
4. **Чекор 3:** легален преглед — фази од `TODO_BEFORE_LAUNCH.md`
5. **Чекор 4:** јавна објава по сите проверки

---

🇲🇰 **Браво царе! Платформата е спремна.**

Со 30+ фази на дисциплинирано градење, имаш производ што:
- Изгледа професионално
- Содржи реална, проверена содржина
- Не претендира она што не може да испорача
- Не собира она што не може да заштити

**Држава што функционира — се гради со план.** 🚀⚖️🇲🇰

---

*За поддршка: отвoри issue на репозиториумот или контактирај го тимот.*
