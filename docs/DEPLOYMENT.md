# 🚀 Deployment Guide · GitHub Pages

Целосно упатство како да го качиш Македонија — Систем на GitHub Pages.

## 📋 Што ти треба

- ✅ GitHub account (бесплатен)
- ✅ Git инсталиран на компјутер ([download](https://git-scm.com/downloads))
- ✅ Текст едитор (VS Code, Sublime, или било кој)

---

## 🎯 Чекор-по-чекор

### Чекор 1: Креирај GitHub repository

1. Оди на [github.com](https://github.com) и логирај се
2. Кликни **New repository** (зелено копче горе-десно)
3. Име: `platform` (или било кое име)
4. Опис: „Македонија — Систем · Civic-state платформа"
5. **Public** (за бесплатни GitHub Pages)
6. ✅ Не додавај README (имаме веќе)
7. Кликни **Create repository**

### Чекор 2: Качи ги фајловите

Имаш 2 опции:

#### Опција А: Преку Git CLI (препорачано)

```bash
# Клонирај го празниот репо
cd ~/projects
git clone https://github.com/YOUR-USERNAME/platform.git
cd platform

# Копирај ги сите фајлови од makedonija-sistem-repo/ овде
cp -r /path/to/makedonija-sistem-repo/* .
cp -r /path/to/makedonija-sistem-repo/.github .
cp /path/to/makedonija-sistem-repo/.nojekyll .
cp /path/to/makedonija-sistem-repo/.gitignore .

# Commit и push
git add .
git commit -m "🎉 Initial release v2.1 PLATINUM"
git branch -M main
git push -u origin main
```

#### Опција Б: Преку GitHub Web UI

1. Во repository страната, кликни **uploading an existing file**
2. Drag & drop сите фајлови од `makedonija-sistem-repo/` папката
3. **Важно:** Прикажи скриени фајлови (со точка) — `.gitignore`, `.nojekyll`, `.github/`
4. Commit message: „Initial release v2.1 PLATINUM"
5. Кликни **Commit changes**

### Чекор 3: Активирај GitHub Pages

1. Во repository → **Settings** (горе-десно)
2. Лево, кликни **Pages**
3. **Source:** Deploy from a branch
4. **Branch:** `main` · `/` (root)
5. Кликни **Save**
6. Чекај 2–5 минути за прв deploy

### Чекор 4: Провери дека работи

1. Освежи Settings → Pages
2. Ќе видиш: **Your site is live at** `https://YOUR-USERNAME.github.io/platform/`
3. Кликни на линкот → треба да се отвори платформата 🎉

---

## 🌐 Custom Domain (makedonijasistem.mk)

Ако имаш сопствен домен:

### Кај registrar-от (на пр. Гoddady, MK Host)

Додај **DNS записи**:

```
Type: A
Host: @
Value: 185.199.108.153

Type: A
Host: @
Value: 185.199.109.153

Type: A
Host: @
Value: 185.199.110.153

Type: A
Host: @
Value: 185.199.111.153

Type: CNAME
Host: www
Value: YOUR-USERNAME.github.io
```

### Кај GitHub

1. Repository → Settings → Pages
2. **Custom domain:** `makedonijasistem.mk`
3. ✅ **Enforce HTTPS** (после 24 часа кога се пропагираат DNS)
4. Чекај 24-48 часа за SSL сертификат

### Провери

```bash
# Test DNS пропагација
dig makedonijasistem.mk +short
# Треба да враќа: 185.199.108.153, etc.

# Test SSL
curl -I https://makedonijasistem.mk
# Треба HTTP/2 200
```

---

## 🔄 Auto-deploy на промени

Со GitHub Actions workflow (`.github/workflows/deploy.yml`):

```bash
# Направи промена локално
echo "// Промена" >> some-file.js

# Commit & push
git add .
git commit -m "feat: додадена нова функционалност"
git push

# Чекај 1-2 минути → автоматски deploy
```

Workflow прави:
1. ✅ Проверка дека `index.html` постои
2. ✅ Валидира JavaScript со acorn
3. ✅ Качува на GitHub Pages

---

## 📊 Проверка на performance

После deploy, тестирај:

### Lighthouse (Chrome DevTools)
1. Отвори страната
2. Right-click → Inspect → Lighthouse
3. **Categories:** сите
4. **Mode:** Navigation
5. Generate report

**Целни оценки:**
- Performance: **>90**
- Accessibility: **>90**
- Best Practices: **>95**
- SEO: **>95**
- PWA: **passes**

### PageSpeed Insights
[https://pagespeed.web.dev/](https://pagespeed.web.dev/)

### GTmetrix
[https://gtmetrix.com/](https://gtmetrix.com/)

---

## 🐛 Често проблеми

### Problem: 404 Not Found
**Решение:** Провери дали `index.html` е во root, не во папка.

### Problem: Стилови не се вчитуваат
**Решение:** Сè е inline во HTML, така што не би требало. Ако се случи — проблем со `.nojekyll`. Креирај го пак:
```bash
touch .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll"
git push
```

### Problem: Service Worker не работи
**Решение:** GitHub Pages бара HTTPS (automatically). Локално користи:
```bash
python3 -m http.server 8080
# или
npx serve
```

### Problem: PWA install не се појавува
**Решение:** 
- HTTPS задолжително (✅ GitHub Pages го прави)
- `manifest.json` мора да биде валиден
- Service Worker мора да биде регистриран
- Имаш ли иконки во `assets/icons/`?

---

## 🎯 Следни чекори (после deploy)

1. **📷 Создај иконки** за PWA (192px, 512px) и стави ги во `assets/icons/`
2. **📷 Создај OG image** (1200x630) и стави ja во `assets/og/og-image.png`
3. **📊 Конфигурирај Plausible Analytics** (или скриј го коментарот за GoogleAnalytics)
4. **🔍 Submit на Google Search Console** — `sitemap.xml`
5. **📱 Тестирај на mobile** (Chrome → Inspect → Mobile mode)
6. **🌐 Поврзи custom домен** ако имаш

---

## 📞 Помош

- 💬 GitHub Discussions: ask questions
- 🐛 GitHub Issues: пријави грешка
- 📧 Email: makedonijasistem@gmail.com

---

**Среќно со deploy! 🇲🇰🚀**
