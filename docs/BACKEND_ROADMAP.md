# 🔌 Backend Roadmap · Македонија-Систем

**Верзија:** 1.0
**Статус:** План (не имплементиран)
**Тип:** Технички документ

---

## 1. Зошто е потребен backend

Тековната верзија (Public MVP 0.1.0) е **статичен сајт**. Сите форми се `mailto:` или `localStorage`-only. Кога ќе има реална потреба да се:

- Регистрираат **реални основачи** (не demo бројач)
- Чува **листа на поддржувачи** со согласност
- Координира **дијаспора** по земја
- Прати **newsletter**
- Прифаќа **донации** (само ако е правно покриено)
- Управува **админ dashboard**

— тогаш ќе биде потребен backend.

---

## 2. Принципи

### Безбедност прва
- HTTPS only
- Encryption at rest и in transit
- Audit log за критични акции
- Rate limiting

### Минимум потребни податоци
- Не собирај што не ти треба
- ЕМБГ, ЛК, потпис **само** ако правно е оправдано
- Време за чување — јасно дефинирано

### Согласност и право на бришење
- Експлицитна согласност за секоја цел
- Лесно бришење на барање
- Експорт на лични податоци

### Транспарентност
- Јавни статистики (без лични податоци)
- Месечен аудит извештај

---

## 3. Препорачана архитектура

```
Frontend (GitHub Pages)
    ↓ HTTPS
API Gateway (Cloudflare Workers)
    ↓
Database (Supabase PostgreSQL)
    ↓
Email (Resend / SendGrid)
```

### Зошто оваа комбинација

| Технологија | Зошто |
|---|---|
| **Cloudflare Workers** | 100k req/ден бесплатно, низок latency |
| **Supabase** | PostgreSQL + Auth + Row Level Security |
| **Resend** | Едноставно email API, 100/ден бесплатно |

---

## 4. Database schema (предлог)

```sql
-- Поддржувачи (изразен интерес, не официјални основачи)
CREATE TABLE supporters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  surname VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  phone VARCHAR(30),
  municipality VARCHAR(100),
  diaspora_country VARCHAR(100),
  role VARCHAR(50), -- 'supporter', 'volunteer', 'diaspora', 'legal', 'coordinator'
  consent_text_version VARCHAR(20),
  consent_timestamp TIMESTAMPTZ NOT NULL,
  ip_hash VARCHAR(64), -- SHA-256 на IP, за anti-fraud
  user_agent_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ -- soft delete
);

-- Audit log за GDPR
CREATE TABLE audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor_type VARCHAR(20), -- 'user', 'admin', 'system'
  actor_id UUID,
  action VARCHAR(50), -- 'consent', 'delete', 'export', 'login'
  target_id UUID,
  details JSONB,
  ip_hash VARCHAR(64),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Барања за бришење (GDPR Art. 17)
CREATE TABLE deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(150) NOT NULL,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  verified_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  notes TEXT
);

-- Newsletter subscribers (одделно од supporters)
CREATE TABLE newsletter (
  email VARCHAR(150) PRIMARY KEY,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  unsubscribe_token VARCHAR(64) UNIQUE,
  confirmed BOOLEAN DEFAULT FALSE
);
```

**Што НЕ е во првата верзија:**
- ❌ ЕМБГ колона
- ❌ Број на лична карта колона
- ❌ Адреса колона
- ❌ Потпис / документ upload
- ❌ Финансиски податоци

Тие се додаваат **само ако правно е потврдено** дека се потребни и **со посебна согласност**.

---

## 5. API ендпоинти

### Јавни (без auth)

```
POST /api/supporters
  Body: { name, surname, email, phone?, municipality?, role, consent }
  → 201 { id, message }

POST /api/newsletter/subscribe
  Body: { email, consent }
  → 200 { message: "Confirm email sent" }

GET /api/newsletter/confirm/:token
  → 200 { confirmed: true }

POST /api/contact
  Body: { name, email, subject, message, consent }
  → 200 { message: "Sent" }

GET /api/stats/public
  → 200 { supporters_count, by_role, by_region }
  (Само агрегирани броеви, без имиња)
```

### Кориснички (со token)

```
GET /api/me
  → 200 { my data }

DELETE /api/me
  → 204 (soft delete, целосно бришење после 30 дена)

GET /api/me/export
  → 200 { all my data in JSON } (GDPR Art. 20)

POST /api/me/consent/revoke
  Body: { consent_id }
  → 200 { revoked }
```

### Админски (само за оправдан персонал)

```
GET /api/admin/supporters
  Query: ?role=volunteer&limit=50&offset=0
  → 200 { list }

GET /api/admin/audit
  → 200 { audit entries }

POST /api/admin/export
  → 202 { job_id } (async за GDPR извештаи)

POST /api/admin/deletion-requests/:id/process
  → 200 { processed }
```

**Сите админ операции се логирани во `audit_log`.**

---

## 6. Безбедност

### Rate limiting
```
Public endpoints: 30 req/min по IP
Auth endpoints: 5 req/min по IP
Admin endpoints: 100 req/min (со auth)
```

### Авторизација
```
Public: nема
User: JWT (15 min expiry) + Refresh token (7 дена)
Admin: JWT + Multi-Factor Authentication задолжителна
```

### Валидација
- Сите inputs sanitize-ирани (XSS prevention)
- SQL queries parametrized (SQL injection prevention)
- Email валидација (RFC 5322)
- Phone валидација (E.164)

### Logging
- Сите 4xx/5xx грешки во структуриран лог
- Sensitive податоци maskирани (email → `a***@example.com`)
- 90-дневен retention

---

## 7. GDPR / ЗЗЛП Compliance

### Што мора да биде имплементирано

| Право | Endpoint | Време |
|---|---|---|
| **Access** (Art. 15) | `GET /api/me/export` | веднаш |
| **Rectification** (Art. 16) | `PUT /api/me` | веднаш |
| **Erasure** (Art. 17) | `DELETE /api/me` | 30 дена |
| **Portability** (Art. 20) | `GET /api/me/export` | веднаш |
| **Object** (Art. 21) | `POST /api/me/consent/revoke` | веднаш |

### Согласност (Consent)

```javascript
// Пример на consent запис
{
  user_id: "uuid",
  consent_text_version: "v1.0-2026-05-10",
  consent_text: "Се согласувам платформата...", // полн текст
  given_at: "2026-05-10T12:34:56Z",
  ip_hash: "sha256...",
  withdrawn_at: null
}
```

**Сите** consent verzii се чуваат — никогаш не се прескокнуваат.

### Контролор на лични податоци

Кога ќе има backend, мора да има:
- Именуван правен субјект ([ИМЕ НА ПРАВЕН СУБЈЕКТ])
- DPO (Data Protection Officer) ако има значителна обработка
- Регистрирана обработка пред АЗЛП (Агенција за заштита на лични податоци)

---

## 8. Cost estimate

### MVP (до 10,000 поддржувачи)

| Сервис | Цена |
|---|---:|
| Cloudflare Workers | $0 (free tier) |
| Supabase | $0 (free tier до 50K rows) |
| Resend | $0 (100 емаила/ден) |
| Domain | ~$15/година |
| **Вкупно** | **~$15/година** |

### Growth (10K - 100K поддржувачи)

| Сервис | Цена |
|---|---:|
| Cloudflare Workers | $5/мес |
| Supabase Pro | $25/мес |
| Resend | $20/мес |
| Sentry | $26/мес |
| Plausible | $9/мес |
| **Вкупно** | **~$85/мес** |

### Scale (100K+)

Custom архитектура, dedicated PostgreSQL, redundancy. Прелиминарно: $300-500/мес.

---

## 9. Имплементација по фази

### Phase A: Минимум функционална backend (2 недели)
- [ ] Setup Cloudflare Worker
- [ ] Setup Supabase + schema
- [ ] `/api/supporters` POST + GET (јавно за counter)
- [ ] `/api/newsletter/subscribe` со double opt-in
- [ ] Resend интеграција за confirm пораки

### Phase B: Кориснички портал (3 недели)
- [ ] Magic link login (без password)
- [ ] `/api/me` ендпоинти
- [ ] Export како JSON
- [ ] Бришење со 30-ден grace period

### Phase C: Админ панел (4 недели)
- [ ] Read-only admin dashboard
- [ ] Audit log viewer
- [ ] CSV export (за правен тим, оправдан случај)
- [ ] Deletion request workflow

### Phase D: Адванс (1-3 месеци)
- [ ] WebRTC за нотарски сесии (ако е правно дозволено)
- [ ] КЕП интеграција (КИБС-Трст)
- [ ] DocuSign / Adobe Sign

---

## 10. Не правиме сега

❌ **Crypto/blockchain** — нема jasna корист, висок ризик
❌ **AI ChatGPT бот** — со реални податоци, додека нема правна проверка
❌ **Mobile native app** — PWA е доволно
❌ **Видео streaming** — користи YouTube
❌ **Forum** — користи Discord/Telegram
❌ **Payment processing** — без правен субјект и адвокатска проверка

---

**Контакт за технички прашања:** [EMAIL ЗА КОНТАКТ]
**Правна проверка пред имплементација:** ЗАДОЛЖИТЕЛНА
