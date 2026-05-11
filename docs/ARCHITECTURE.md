# 🏗️ Архитектура · Македонија-Систем

**Верзија на документ:** 1.0
**Поврзан со:** `0.1.0-public-mvp`
**Тип:** Технички документ

---

## 1. Тековна архитектура (Public MVP 0.1.0)

```
┌─────────────────────────────────────────┐
│   КОРИСНИК · ПРЕЛИСТУВАЧ                │
│   (Chrome, Firefox, Safari, Edge)       │
└──────────────────┬──────────────────────┘
                   │ HTTPS
                   ▼
┌─────────────────────────────────────────┐
│   GITHUB PAGES                          │
│   (статичен hosting, бесплатно)         │
│                                         │
│   index.html (HTML + CSS + JS inline)   │
│   manifest.json (PWA)                   │
│   sw.js (Service Worker)                │
│   assets/icons/icon.svg                 │
│   404.html · robots.txt · sitemap.xml   │
└─────────────────────────────────────────┘
```

### Карактеристики

| Аспект | Тековно |
|---|---|
| **Hosting** | GitHub Pages (бесплатно) |
| **Backend** | ❌ Нема (статичен сајт) |
| **База на податоци** | ❌ Нема |
| **Автентикација** | ❌ Нема |
| **Анализа** | ❌ Нема (планирана Plausible) |
| **Форми** | `mailto:` или `localStorage` |
| **Offline** | ✅ Service Worker |
| **Mobile** | ✅ Responsive + PWA installable |
| **Јазик** | Македонски (примарен) + 4 јазици i18n |

### Технологии

- **HTML5** — semantic markup
- **CSS3** — CSS Variables, Grid, Flexbox
- **Vanilla JavaScript** — без framework dependencies (нема React/Vue/Angular)
- **PWA** — manifest.json + Service Worker
- **localStorage** — за јазик, тема, лични preferences (само на тoj уред)

### Што **НЕМА** во оваа верзија

- ❌ Реален бројач на основачи (тоа што е прикажано е demo-only)
- ❌ Реални нотарски сесии (UI прототип)
- ❌ Регистрирана база на основачи
- ❌ Email automation
- ❌ Admin dashboard
- ❌ Push notifications
- ❌ Реални плакания/донации
- ❌ Live анкети (Firebase оневозможен — видете FIREBASE_ENABLED = false)

---

## 2. Идна production архитектура (v1.0+)

Кога ќе биде потребен реален backend (видете `docs/BACKEND_ROADMAP.md`):

```
┌──────────────────────────────────────────┐
│   FRONTEND · GitHub Pages или CDN        │
│   (HTML/CSS/JS · непроменети)            │
└──────────────────┬───────────────────────┘
                   │ HTTPS
                   ▼
┌──────────────────────────────────────────┐
│   API GATEWAY · Cloudflare Workers       │
│   - Rate limiting                        │
│   - CORS strict                          │
│   - Auth (JWT)                           │
└──────────────────┬───────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   ┌────────┐ ┌────────┐ ┌──────────┐
   │POSTGRES│ │ REDIS  │ │  EMAIL   │
   │(основни│ │(сесии  │ │(SendGrid │
   │податоци│ │ кеш)   │ │ /Resend) │
   └────────┘ └────────┘ └──────────┘
```

### Препорачани технологии за идна верзија

| Слој | Препорака | Алтернатива |
|---|---|---|
| **API** | Cloudflare Workers | Vercel Functions, Render |
| **База** | Supabase (PostgreSQL) | Neon, PlanetScale |
| **Auth** | Supabase Auth (JWT) | Auth0, Clerk |
| **Email** | Resend | SendGrid, Postmark |
| **Storage** | Cloudflare R2 | AWS S3 |
| **Monitoring** | Sentry + UptimeRobot | Datadog |
| **Аналитика** | Plausible | Umami |

### Безбедност во production

- HTTPS only (Let's Encrypt бесплатно)
- Rate limiting (100 req/min по IP)
- CORS strict (само од registered domains)
- CSRF protection
- SQL injection prevention (parametrized queries)
- XSS prevention (sanitize input)
- Bcrypt за passwords (cost factor ≥12)
- JWT со 15-минутно expiration + refresh tokens
- Content Security Policy (CSP)
- HTTPS Strict Transport Security (HSTS)
- GDPR / ЗЗЛП compliance ендпоинти

Детали: `docs/SECURITY_PRIVACY.md` и `docs/BACKEND_ROADMAP.md`

---

## 3. Како функционира тековната верзија

### Структура на `index.html`

Целата платформа е во **еден single-file** дизајн:

```html
<!DOCTYPE html>
<html lang="mk">
<head>
  <!-- Meta tags, SEO, PWA -->
  <style>
    /* Сите CSS правила inline */
    /* CSS Variables, layout, components */
  </style>
</head>
<body>
  <!-- Сите секции -->
  <header><nav>...</nav></header>
  <main>
    <section id="hero">...</section>
    <section id="programme">...</section>
    <!-- 25+ секции -->
  </main>
  <footer>...</footer>

  <script>
    /* Главен IIFE: i18n, theme, navigation, bot */
  </script>
  <script>
    /* Standalone скрипти за модули */
  </script>
</body>
</html>
```

### Зошто single-file?

- ✅ Лесен deployment (само upload)
- ✅ Брзо вчитување (нема additional HTTP requests)
- ✅ Работи на GitHub Pages без build process
- ✅ Лесно тестирање
- ⚠️ Голема големина (~1.5 MB) — прифатлива за PWA caching

### Зошто **НЕ** Vue/React/Angular?

- Платформата е **content-heavy**, не **app-heavy**
- Не треба state management
- Не треба SPA routing
- Build процес значи complexity без вистинска корист
- Може да се мигрира во иднина без излишен ризик сега

---

## 4. Локално стартување

```bash
# Опција 1: Python (вградено)
python3 -m http.server 8080

# Опција 2: Node.js
npx serve

# Опција 3: PHP (ако имате)
php -S localhost:8080

# Опција 4: Live Server (VS Code extension)
# Десен клик на index.html → Open with Live Server
```

Отворете `http://localhost:8080`

---

## 5. Deployment

### GitHub Pages (препорачано за MVP)

1. Push на `main` branch
2. Settings → Pages → Source: `main` / root
3. Чекај 2-5 мин → live на `https://[USERNAME].github.io/[REPO]/`

Детали: `docs/DEPLOYMENT.md`

### Custom домен

1. Додади CNAME запис кај registrar
2. Settings → Pages → Custom domain
3. Enforce HTTPS (после 24 часа)

---

## 6. Идна миграција (кога ќе биде потребно)

| Тригер | Препорачана акција |
|---|---|
| 100+ дневни посети | Plausible Analytics ($9/мес) |
| 500+ пораки на ден | SendGrid за email automation |
| Реален бројач на основачи | Cloudflare Worker + KV |
| Сесии за нотар | WebRTC server + Firebase |
| Регистар на основачи | Supabase + admin dashboard |
| Multilingual content management | Headless CMS (Strapi/Sanity) |

---

## 7. Тип на ризици

| Ризик | Сегашен степен | Mitigation |
|---|---|---|
| Сите податоци само локални | Висок | Не собирaj чувствителни податоци |
| Нема backup на форми | Среден | Користи mailto + manual чување |
| Браузер може да ги избрише localStorage | Низок | Известувајте корисниците |
| Service Worker може да кешира стар content | Низок | Force update при критичен промен |
| GitHub Pages неактивност | Многу низок | 99.9% uptime |

---

**Контакт за технички прашања:** [EMAIL ЗА КОНТАКТ — placeholder]
