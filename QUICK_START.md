# ⚡ Quick Start — за 5 минути на GitHub Pages

> Само сакам да го качам и да работи. Без читање на 50 страници.

---

## 🎯 За 5 минути

### Чекор 1️⃣ (1 минут): GitHub account
- Оди на [github.com](https://github.com) → **Sign up**
- Username: на пр. `makedonijasistem`

### Чекор 2️⃣ (1 минут): Создај repo
- Кликни **+** горе-десно → **New repository**
- Name: `platform`
- ✅ Public
- Кликни **Create**

### Чекор 3️⃣ (2 минути): Качи фајлови
- Кликни **uploading an existing file**
- Drag & drop сите фајлови од `makedonija-sistem-repo/` папката
- ⚠️ Не заборави скриените (со точка): `.gitignore`, `.nojekyll`, `.github/`
- Commit message: `Initial release v2.1 PLATINUM 🇲🇰`
- Кликни **Commit**

### Чекор 4️⃣ (1 минут): Активирај Pages
- Repository → **Settings** → **Pages** (лево)
- **Source:** Deploy from branch
- **Branch:** `main` / `(root)` → **Save**

### ✅ Готово!
Чекај 2-5 мин → твојата страница е на:
**https://YOUR-USERNAME.github.io/platform/**

---

## 🔗 Custom домен (опционо, 5 мин)

Ако имаш `makedonijasistem.mk`:

### Кај registrar
DNS A records:
```
@ → 185.199.108.153
@ → 185.199.109.153
@ → 185.199.110.153
@ → 185.199.111.153
```

### На GitHub
- Settings → Pages → Custom domain: `makedonijasistem.mk`
- ✅ Enforce HTTPS (после 24 ч)

Готово!

---

## 🆘 Не работи?

### Не се појавува страната
1. Чекај **5-10 минути** (прв deploy е најбавен)
2. Освежи Settings → Pages → треба да пишува **Your site is live at...**
3. Ако не работи 30 мин → провери дали `index.html` е во root, не во папка

### Грешки во конзола
1. Отвори браузер → F12 → Console
2. Доколку има црвени грешки → **отвори Issue** на repo

### Стилови не се вчитуваат
Сè е inline во HTML, не би требало. Ако се случи:
1. Hard refresh: Ctrl+Shift+R (Windows) или Cmd+Shift+R (Mac)
2. Disable cache: F12 → Network → Disable cache

---

## 🎉 Што следно?

После прв успешен deploy:

1. **📊 Тестирај Lighthouse** (F12 → Lighthouse) — целни оценки 90+
2. **📷 Создај иконки** (`assets/icons/icon-192.png`, `icon-512.png`)
3. **📷 Создај OG image** (`assets/og/og-image.png`, 1200x630)
4. **🔍 Submit на Google** ([search.google.com/search-console](https://search.google.com/search-console))
5. **📱 Тестирaj на мобилен** телефон
6. **🎨 Подели на социјалните мрежи**

---

## 📞 Помош

- 📖 Целосно упатство: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- 🐛 Грешки: [GitHub Issues](../../issues)
- 📧 Email: makedonijasistem@gmail.com

---

🇲🇰 **Среќно! Си на пат да направиш разлика.** 🚀
