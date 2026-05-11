# 🤝 Како да придонесеш · Contributing Guide

Ти благодариме што размислуваш да помогнеш со развојот на **Македонија — Систем**! 🇲🇰

Платформата е **отворен код** (Creative Commons BY-NC 4.0) и сите придонеси се добредојдени.

---

## 🎯 Начини да помогнеш

### 1. 🐛 Пријави грешка
Најди ли нешто што не работи? [Отвори Issue](../../issues/new?template=bug_report.md)

### 2. 💡 Предложи нова функционалност
Имаш идеја за подобрување? [Отвори Feature Request](../../issues/new?template=feature_request.md)

### 3. 🌐 Помогни со превод
Зборуваш јазик кој не е во платформата? Помогни ни.

### 4. 📝 Подобри документација
README, DEPLOYMENT, FAQs — секогаш може подобро.

### 5. 🎨 Дизајн и илустрации
- OG images (1200x630) за социјални мрежи
- Иконки за PWA
- Илустрации за секции

### 6. ⚖️ Правна експертиза
Преглед на legal/ документи од адвокат или нотар.

### 7. 🔧 Код
- HTML/CSS подобрувања
- JavaScript оптимизации
- Accessibility (a11y) подобрувања
- Performance оптимизации

---

## 🚀 Setup за развој

```bash
# 1. Fork repo
# 2. Clone fork
git clone https://github.com/YOUR-USERNAME/platform.git
cd platform

# 3. Создади branch
git checkout -b feature/my-improvement

# 4. Локален server
python3 -m http.server 8080
# или: npx serve

# 5. Отвори http://localhost:8080
```

---

## 📋 Pull Request процес

1. **Forkни** го repo
2. **Креирај branch** со описно име:
   - `feature/add-romanian-translation`
   - `fix/notary-modal-bug`
   - `docs/improve-deployment-guide`
3. **Направи промени** локално
4. **Тестирај** на mobile + desktop
5. **Commit** со описна порака:
   ```bash
   git commit -m "feat: додаде Романски превод"
   git commit -m "fix: поправка на нотарски модал"
   ```
6. **Push** на твојот fork
7. **Отвори PR** на главното repo

---

## ✅ Стандарди за код

### HTML
- Semantic tags (`<section>`, `<article>`, `<nav>`)
- ARIA labels за accessibility
- Responsive (mobile-first)

### CSS
- CSS Variables (за консистентни бои)
- BEM-like naming (`.fd-step`, `.fd-step-title`)
- No inline styles (освен dynamic во JS)

### JavaScript
- ES2020+ features
- `'use strict'` во IIFE
- try/catch за safety
- console.warn (не console.log) за debug

### i18n
- Сите нови strings во `data-i18n` attribute
- Превод во сите 5 јазици (или минимум мк + ен)

### Безбедност
- НЕ commit-ирaj API keys, passwords, личнi data
- localStorage само за non-sensitive податоци
- Sanitize HTML input (XSS prevention)

---

## 🌐 Превод

Платформата има 5 јазици: 🇲🇰 МК · 🇬🇧 EN · 🇦🇱 AL · 🇷🇸 SR · 🇩🇪 DE

### Како да додадеш нов јазик

1. Најди го i18n објектот во `index.html`:
   ```javascript
   const translations = {
     mk: { ... },
     en: { ... },
     // ...
   };
   ```

2. Додади нов јазик:
   ```javascript
   ro: {
     'nav.programme': 'Program',
     // ...
   }
   ```

3. Додади во `LANG_CONFIG`:
   ```javascript
   const LANG_CONFIG = [
     { code: 'mk', name: 'Македонски', flag: '🇲🇰' },
     { code: 'ro', name: 'Română', flag: '🇷🇴' },  // нов
     // ...
   ];
   ```

4. Преведи **сите 784 клучеви** (или фокусирај се на критичните)

---

## 🧪 Тестирање

Пред да направиш PR:

### Минимум:
- [ ] Тестирај на Chrome desktop
- [ ] Тестирај на mobile (Chrome DevTools → Toggle device)
- [ ] Нема нови console грешки
- [ ] HTML валиден ([validator.w3.org](https://validator.w3.org/))

### Препорачно:
- [ ] Lighthouse audit (>90 на сите)
- [ ] Тестирај на Safari (iOS особено)
- [ ] Тестирај на Firefox
- [ ] Screen reader test (VoiceOver/NVDA)

### За code changes:
```bash
# Validate JavaScript with acorn
npx acorn-cli index.html

# Check HTML
npx html-validate index.html
```

---

## 📝 Стил на commit пораки

Користиме [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: додаде нова функционалност
fix: поправка на грешка
docs: промена на документација
style: формат, no logic change
refactor: refactor без нови функционалности
perf: performance подобрување
test: додавање тестови
chore: maintenance задачи
i18n: превод
a11y: accessibility подобрувања
```

Примери:
```
feat(diaspora): добави Skills Bridge форма
fix(notary): поправка на модал на mobile
docs: ажурирана DEPLOYMENT.md
i18n(de): превод на дијаспорски Hub
a11y: добави aria-label на сите икони
```

---

## 🎖️ Кодекс на однесување

### Бидеме професионални:
✅ Конструктивна критика  
✅ Почитување на различни мислења  
✅ Помош на новајлии  
✅ Фокус на проблемот, не на личноста  

### Не толерираме:
❌ Хейт, расизам, дискриминација  
❌ Лични напади  
❌ Спам или ирелевантен content  
❌ Политички пропаганда (ова е civic, не партиски tool)

**Кршење → блокирање.**

---

## 💬 Каде да прашуваш

- **GitHub Discussions:** за општи прашања
- **GitHub Issues:** за грешки и предлози
- **Email:** makedonijasistem@gmail.com за чувствителни теми

---

## 🏆 Признание

Сите придонесувачи ќе бидат наведени во:
- README.md (Contributors section)
- CHANGELOG.md (по верзија)

Топ придонесувачи ќе добијат:
- 🥉 **Bronze tier** (1+ PR merged): спомнат на сајтот
- 🥈 **Silver tier** (5+ PRs): достап до beta features
- 🥇 **Gold tier** (10+ PRs): canonical член на core тим

---

🇲🇰 **Заедно градиме Македонија. Секој придонес важи.** 🚀
