# МАКЕДОНИЈА — СИСТЕМ · MEDIA CONNECT v0.2
## Технички пилот, неактивен по дифолт / HUMAN GATE

**Датум:** 15.11.2026  
**Гранка:** `review/mks-media-connect-architecture-v0-1-20261115`  
**Статус:** REVIEW-ONLY / NO DEPLOY / NO MEMBERSHIP / NO BULK OUTREACH

### 1. Реална имплементација

- `media-connect/index.html` — каталог со јавни линкови кон социјални мрежи, месинџери и системи за видеоконференции; симулатор за планирање до 500 говорници + 500 гледачи.
- `media-connect/room.html`, `room.js`, `room.css`, `room-config.js` — реален LiveKit browser client: приклучување со токен од сервер, преглед на пристигнати аудио/видео траки, вклучување/исклучување камера и микрофон по експлицитен клик, напуштање на сесија. Сите медиуми започнуваат исклучени.
- `media-connect/worker/token-worker.mjs` — серверски Cloudflare Worker за краткотрајни LiveKit JWT токени; никакви тајни во HTML. Гледачот има `canPublish:false`; говорникот може да објавува; модераторот има `roomAdmin:true`. JWT важи 300 секунди за иницијално приклучување.
- `media-connect/worker/wrangler.pilot.example.jsonc` — намерно исклучена пример-конфигурација без јавно достапна рута.
- `media-connect/tests/token-worker.test.mjs`, `scripts/test_mks_media_connect.py`, `scripts/mks_media_connect_browser.cjs`, `.github/workflows/mks-media-connect-pilot-review.yml` — тестови за соодветни улоги, CORS, невалидни покани, rate limits, локален browser и зачувување на постојниот портал.

### 2. Граници на системот

- **500 + 500 е архитектонска цел, а не верификувана пропусна моќ.** Повеќе истовремени HD публикувачи и 500 публика-пристапи бараат профилирање на оптоварување, договорен провајдер, заштита од злоупотреба, дистрибуција преку CDN/HLS и буџет.
- Се користат **само самостојни јавни линкови** до YouTube, Rumble, Viber, Telegram, WhatsApp, Signal, Zoom, Webex и другите сервиси. Нема добиени дозволи од овие платформи, нема поддржан мост меѓу нивните приватни повици, нема масовни пораки.
- Нема автоматска политичка сегментација, следење корисници, приспособени политички пораки, увоз на контакти, автоматско емитување или снимање.
- Пред јавна услуга потребни се особено: правила за модерација, заштита на малолетници, согласност за снимање, приватност, управување со incident/appeal, достапност и безбедносна ревизија.

### 3. Конфигурација на тестна видеосала — САМО ПО HUMAN GATE

Во `room-config.js` тековно стои `enabled:false` и празен `tokenEndpoint`. Во пример Worker-конфигурацијата стојат `ENABLED:false`, `HUMAN_GATE_APPROVED:false`, `workers_dev:false`, без routes. Не е создаден Cloudflare сервис или LiveKit организација.

По *посебна* операторска одлука и избор на провајдер:
1. Да се постави одделен тестен Cloudflare Worker со валиден точен HTTPS `ALLOWED_ORIGIN`, `wss://` `LIVEKIT_URL`, `ROOM_NAME` и функционален `JOIN_LIMITER` binding.
2. Да се конфигурираат само во **Cloudflare Secrets**: `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`, `HOST_JOIN_CODE`, `SPEAKER_JOIN_CODE`, `VIEWER_JOIN_CODE`. Последните три мора да бидат различни, случајни и долги минимум 24 знаци, без повторна употреба на кориснички лозинки.
3. По независна правна и безбедносна контрола и човечка дозвола: `ENABLED=true`, `HUMAN_GATE_APPROVED=true` и операторскиот `room-config.js` да сочува `enabled:true` и точен HTTPS `tokenEndpoint`.
4. Да се тестира со најмалку два овластени тест-прелистувачи: говорник вклучува микрофон, гледач добива звук но **нема publishing permission**, модератор го одржува редот; секоја грешка води назад кон исклучен пилот.
5. Да се провери и процес на повлекување покани/ревокација, паралелни сесии, присилно исклучување, логови, финансиско ограничување и лични податоци пред какво било јавно проширување.

**ВАЖНО:** Пилотот користи заеднички тајни кодови за улога, со лимитер приближно по IP. Тоа е привремено; за продукција е потребен посебен систем со проверлив идентитет, индивидуални покани и нивно повлекување, строга контрола на бројот учесници, одобрен модераторски workflow и одбрана од повеќекратни пријавувања. Предложената **500/500 бројка не се ограничува ниту гарантира** со овој Worker.

### 4. Извршување тестови (само локално, без видео API)

```sh
node --test media-connect/tests/token-worker.test.mjs
python3 -m unittest -v scripts/test_mks_media_connect.py
python3 scripts/mks_root_review_qa.py
node --check media-connect/room.js
```

За автоматизиран browser smoke се користи GitHub Actions workflow. Строго е ограничен на loopback `127.0.0.1`, со блокирање на надворешни мрежни барања. Скриншотовите се артефакти за човечка QA, не доказ за продукциско оптоварување.

### 5. Release gate

| Област | Тековен статус |
| --- | --- |
| HTML и приватносно информирање | SOURCE COMPLETE; QA pending |
| Клиентски WebRTC протокол | CODE IMPLEMENTED; provider call NOT TESTED |
| Token signing + grants | CODE IMPLEMENTED; automated tests pending |
| Secret management + rate limiter | CODE READY; secrets NOT CONFIGURED |
| LiveKit provider, room, billing | NOT CONFIGURED |
| 500/500 staged stress test | NOT TESTED |
| Cross-PR #9/#10/#11 combined index | TO CONSOLIDATE |
| Production Cloudflare + public broadcasting | BLOCKED · HUMAN GATE |

Постојниот Cloudflare stage allowlist `scripts/mks_cloudflare_stage.py` намерно не вклучува MEDIA CONNECT. **Нема live deploy и нема право на јавен пренос без посебно човечко одобрение.**

### 6. Технички основи / извори

- LiveKit Access Tokens & Grants: https://docs.livekit.io/frontends/reference/tokens-grants/
- LiveKit JavaScript Client SDK: https://docs.livekit.io/reference/client-sdk-js/
- Cloudflare Secrets: https://developers.cloudflare.com/workers/configuration/secrets/
- Cloudflare rate limiting binding: https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

Сите извори се јавни технички упатства, не потврда за партнерство, спремност на провајдерот или безбедносен сертификат.
