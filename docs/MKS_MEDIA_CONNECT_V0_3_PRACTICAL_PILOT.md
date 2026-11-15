# MEDIA CONNECT v0.3 · Практичен тест-пилот — МАКЕДОНИЈА — СИСТЕМ

**Датум:** 15 ноември 2026  
**Извор:** Draft PR #12, \`review/mks-unified-atlas-programme-media-v0-2-20261115\`  
**Статус:** ИМПЛЕМЕНТИРАН КОД / ПРЕГЛЕД, НЕ АКТИВНА УСЛУГА  
**Јавен/продукциски deploy:** НЕ. **Реален LiveKit тест:** НЕ. **1.000 луѓе:** НЕ ТЕСТИРАНО.

## А. Реални технички елементи

- \`media-connect/room.html\`, \`room.js\` — LiveKit клиент кој се приклучува со серверски токен, ги прикажува аудио/видео траките, овозможува свесно вклучување камера/микрофон и напуштање.
- \`media-connect/worker/invite-worker.mjs\` — **v0.3 предложен backend**: Cloudflare Worker + SQLite Durable Object; секој код е случаен, еднократен и со рок; серверот ја назначува улогата. Може да се повлече **неупотребен** код. LiveKit JWT важи 120 секунди за приклучување.
- \`media-connect/worker/wrangler.invite.pilot.example.jsonc\` — почетна конфигурација со \`ENABLED=false\`, \`HUMAN_GATE_APPROVED=false\`, \`workers_dev=false\`, без јавна route или вистински secrets.
- \`scripts/mks_media_operator.mjs\` — **само операторска CLI** за креирање/повлекување поединечни покани, со експлицитно \`--confirm\` и силен серверски администраторски токен.
- \`media-connect/tests/invite-worker.test.mjs\` — тестови за улоги, двојно искористување, ревокација, квоти, CORS, потпис и заштита. 
- \`scripts/mks_media_connect_mock_browser.cjs\` — Chromium тест што симулира приклучување, микрофон, камера, претплата на видео и напуштање, без надворешна медиумска инфраструктура.
- \`scripts/mks_build_unified_review_pack.py\` — прави изолиран ZIP за локален преглед; не ги вклучува серверскиот backend или secrets.

**Legacy:** \`worker/token-worker.mjs\` и \`wrangler.pilot.example.jsonc\` се задржани исклучиво за историска проверка v0.2. Не треба да се активираат за реален пилот; тие користат споделени кодови по улоги.

## Б. Што можеш да провериш сега без никаков надворешен сервис

1. Отвори го Draft PR #12 и GitHub Actions. Под „MKS Unified Atlas + Programme + Media review“ најди го артефактот \`mks-unified-offline-review-v0-3\` (кога соодветниот тест ќе заврши успешно).
2. Преземи ZIP, распакувај во нова папка.
3. Отвори терминал во папката и стартувај \`python3 -m http.server 8788\`.
4. Во прелистувач отвори \`http://127.0.0.1:8788/\` и провери: Глобален партиски атлас; предложени инвестиции; MEDIA CONNECT; видеосала. **Видеосалата намерно не дозволува приклучување додека нема безбедна конфигурација.**
5. За автоматизирани проверки без провајдер се извршуваат \`node --test media-connect/tests/invite-worker.test.mjs\` и CI browser tests; ова **не е** доказ за врска кон вистински LiveKit сервер.

## В. Единствени зависности за приватен реален пилот

**Ова се операции со надворешни ресурси и чуваат Human Gate. Не ги извршувај автоматски.**

1. Организаторот отвора сопствен LiveKit Cloud проект или одобрена самостојна SFU инфраструктура, со договорен капацитет и буџет. Нема потврда за платен пакет/квота.
2. Во **посебен тестен Cloudflare Worker** се подготвува конфигурацијата од \`wrangler.invite.pilot.example.jsonc\`. Се поставува LiveKit \`wss://\` URL, посебно \`ROOM_NAME\`, точен HTTPS \`ALLOWED_ORIGIN\`, лимитер и Durable Object. На почеток се оставаат \`ENABLED=false\`, \`HUMAN_GATE_APPROVED=false\`, \`workers_dev=false\`.
3. Во Cloudflare Secrets, **НЕ во GitHub/ChatGPT/HTML**, операторот локално поставува \`LIVEKIT_API_KEY\`, \`LIVEKIT_API_SECRET\`, \`ADMIN_INVITE_TOKEN\`. Администраторскиот токен треба да има најмалку 32 случајни знаци.
4. По техничка/правна проверка и експлицитно човечко одобрение се додава контролирана HTTPS route, одобрен заштитен домен, \`ENABLED=true\`, \`HUMAN_GATE_APPROVED=true\`. Дури тогаш HTML \`room-config.js\` може да добие \`enabled:true\` и \`tokenEndpoint\` кон тестниот Worker.
5. Прво тест: **1 модератор + 2 говорници + 5 гледачи**; потоа план 10 + 25, и само ако помине тестот, контролирана поголема сесија. За 500 + 500 се потребни реален load test, политика за активни говорници, пропусен опсег, TURN/STUN, стриминг излез и CDN/HLS.
6. Постави ограничување на финансиски трошоци, испробај сценарија со прекин на врска, повторни покани, модерација, повлекување права и пријави/жалби. Потребни се операторски логови и минимизација на лични податоци.

## Г. Пример за управување со покани по одобрена конфигурација

\`\`\`bash
# Тестирај само во приватна одобрена околина — не во продукцискиот портал.
# Мора однапред да постои deploy и тестен HTTPS Worker URL.
export MKS_MEDIA_API_URL="https://YOUR-PRIVATE-TEST-WORKER.EXAMPLE/"
read -s MKS_MEDIA_ADMIN_TOKEN
export MKS_MEDIA_ADMIN_TOKEN
node scripts/mks_media_operator.mjs issue viewer 30 --confirm
node scripts/mks_media_operator.mjs issue speaker 30 --confirm
node scripts/mks_media_operator.mjs issue host 30 --confirm
# Кодот се покажува само тогаш. Доставувај го безбедно до конкретниот учесник.
# За повлекување на неупотребен код:
node scripts/mks_media_operator.mjs revoke --confirm
unset MKS_MEDIA_ADMIN_TOKEN
\`\`\`

**Напомена:** Повлекувањето на веќе искористена покана не може самото да исклучи активен учесник; за тоа е потребен контролиран LiveKit server API / модераторски workflow. Истечениот JWT не прекинува автоматски тековна поврзана сесија.

## Д. Прифатни критериуми и блокери

| Критериум | Состојба |
|---|---|
| Главна HTML навигација, атлас 61, Програма, MEDIA CONNECT | ИМПЛЕМЕНТИРАНО / CI проверка |
| Еднократен код + серверска улога + 120s JWT | ИМПЛЕМЕНТИРАНО / unit tests |
| Поврзување, камера/микрофон и напуштање со симулиран SDK | ИМПЛЕМЕНТИРАНО / Chromium mock tests |
| Реален LiveKit проект, API secrets, Cloudflare Worker route | НЕ КОНФИГУРИРАНО |
| Повик со два вистински браузери и согласни тестирачи | НЕ ТЕСТИРАНО |
| Строго ограничување на истовремени приклучени учесници | НЕ ИМПЛЕМЕНТИРАНО |
| 500 + 500 реална оптоварувачка проверка | НЕ ТЕСТИРАНО |
| Правна/безбедносна ревизија, заштита на малолетници, модерација и жалби | БЛОКЕР |
| Објава/merge и продукциски видео пренос | ЧОВЕЧКА ОДЛУКА — НЕИЗВРШЕНО |

**Приложени официјални извори:**  
LiveKit tokens/grants — https://docs.livekit.io/frontends/reference/tokens-grants/  
LiveKit client SDK — https://docs.livekit.io/reference/client-sdk-js/  
Cloudflare SQLite Durable Objects — https://developers.cloudflare.com/durable-objects/api/sqlite-storage-api/  
Cloudflare rate limiting — https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

## Ѓ. Непроменети граници на порталот

Нема потврдени официјални профили на социјалните мрежи, нема спојување приватни Viber/Signal/WhatsApp/Telegram повици, нема автоматско масовно испраќање пораки, нема политичко профилирање, членство, плаќања, инвестициони договори или изборни услуги. Сите идни комуникациски канали мора да имаат веродостојна информација за идентитетот на организаторот, јасна модерација и избор за доброволно учество.
