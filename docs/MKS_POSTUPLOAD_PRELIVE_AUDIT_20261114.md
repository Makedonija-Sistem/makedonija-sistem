# МАКЕДОНИЈА СИСТЕМ — независна пост-upload, pre-live ревизија

**Датум:** 14 ноември 2026  
**Опфат:** техничка ревизија без промени на продукциски сообраќај  
**Статус:** REVIEW / NO DEPLOY / HUMAN GATE — ова не е одобрение за јавно активирање.  
**GitHub main SHA:** `aa538b7323c1f104b65c57baa1ee9354a1ac774a`

## 1. Потврдена инфраструктура

| Проверка | Резултат | Доказ |
|---|---|---|
| PR #4 за рачно Cloudflare поврзување | **PASS — споен во main** | https://github.com/Makedonija-Sistem/makedonija-sistem/pull/4 |
| GitHub Actions #11: тестови, staging, Wrangler dry-run | **PASS** | https://github.com/Makedonija-Sistem/makedonija-sistem/actions/runs/43632732076 |
| `wrangler versions upload` на `makedonija-sistem-preview` | **PASS — создадена верзија** | Истиот GitHub Actions run; Wrangler ID `182f2c98-e115-461b-a648-d435705f4fff` |
| Поставени нови/изменети ресурси | **PASS — 12/12 upload** | Wrangler излез во run #11 |
| Cloudflare Dashboard: новата `182f2c98` | **USER-VERIFIED — Ready / неактивна** | Сопственички приказ на Deployments, 14.11.2026 |
| Cloudflare Dashboard: старата `f9b8f578` | **USER-VERIFIED — наведена како Active deployment** | Сопственички приказ на Deployments, 14.11.2026 |
| Точна распределба 0%/100% по верзија | **NOT INDEPENDENTLY VERIFIED** | Копираниот текст не го врзува недвосмислено секој процент со соодветна верзија |
| Live HTTP/браузерска сесија до Worker | **NOT TESTED** | Мрежниот пристап од ревизорската околина не успеа; ова не докажува дека страницата е недостапна |

Важно: **version upload != traffic deployment**. Во run #11 има `versions upload`, но нема `versions deploy` или traffic promotion. Неактивната верзија е создадена; **не се тврди дека е тестирана како продукциска апликација**.

## 2. Изворен статички QA — само GitHub main, не live DOM

- **PASS (static):** во `index.html` се најдени 61 `href="#..."` референци, сите со соодветна ID-цел; нема дупликат ID-ознаки во проверениот HTML (87 ID-ознаки).
- **PRESENT / NOT RUNTIME TESTED:** пет јазични избори (`mk`, `en`, `al`, `sr`, `de`) и `data-i18n` ознаки се во изворниот HTML. Ова не докажува целосен превод или исправно префрлање во прелистувач.
- **PASS (source policy):** `index.html` задржува `noindex,nofollow`; `robots.txt` блокира индексирање. Продолжува статусот „јавен нацрт“, не финално јавно издание.
- **REVIEW REQUIRED:** во изворниот HTML има пет inline JavaScript блокови и meta CSP со `script-src 'self' 'unsafe-inline'`. Cloudflare `_headers` е поставен за clickjacking / nosniff / robots, но само по себе не го отстранува `unsafe-inline`. Не се тврди завршен XSS hardening.
- **REVIEW REQUIRED:** изворната страница е голем монолитен HTML (~839 KB знаци); потребна е независна проверка на иницијално вчитување, мобилен приказ, перформанси и однесување на интерактивните модули.
- **CONTENT BLOCKER FOR CLOUDFLARE TRAFFIC:** `legal/PRIVACY.html` во моментов наведува само GitHub Pages како хостинг. Ако Worker започне да служи јавен сообраќај, текстот мора да ја опише вистинската инфраструктура, со правна проверка.
- **REVIEW REQUIRED:** `og:url`, JSON-LD и `sitemap.xml` наведуваат GitHub Pages URL; пред јавно активирање на Worker потребна е одлука кој URL е канонски. Во review/noindex фаза ова е нерешено прашање, не автоматска причина за објавување.
- **NOT TESTED:** HTTP response headers од живиот Worker и верзионскиот URL, JavaScript runtime, keyboard/focus, навигациски интеракции, статички 404 и листа на requests, контроли на прелистувач, петте јазика, правна содржина и rollback rehearsal.

## 3. Задолжителни acceptance gates ПРЕД одлука за traffic

1. **Source parity:** одделно прегледај ги старата активна верзија `f9b8f578` и кандидатот `182f2c98` (содржина, статус, појавување и статички ресурси). Не претставувај snapshot споредба како активна продукциска проверка.
2. **Browser E2E:** desktop и mobile, `mk/en/al/sr/de` (реална префрлувачка логика и покриеност), главни менија, grouped navigation, legal врски, fallback/404, пристапност и исправни празни/неактивни состојби.
3. **HTTP/security:** GET/HEAD од верзиониран preview, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `X-Robots-Tag`, ефективен CSP и безбедно DOM внесување на динамички текст; тестирај без да внесуваш вистински лични податоци.
4. **Provenance/legal:** точен хостинг, вистински статус на предложените модули, privacy/terms проверка, јасен канонски URL за кога ќе има јавен release.
5. **Rollback + Human Gate:** запиши стара активна version ID и сообраќај, утврди реална патека за враќање, а потоа барај **ново, изречно одобрение** за било каков `Deploy`, `Rollout`, `versions deploy`, traffic change или промена на `noindex`.

## 4. Безбедносна граница на овој ревизорски документ

Овој документ е **read-only evidence log**: не менува `index.html`, `wrangler.jsonc`, workflow, Worker, токени, тајни, сообраќај, маршрути или содржинска политика. `main` и двата Cloudflare version ID остануваат недопрени со оваа ревизија. Старите операторски белешки во `docs/MKS_CLOUDFLARE_LINK_REVIEW_20261114.md` се историски review-record и сега содржат пред-upload статус; овој запис е понова фактографска дополнителна белешка, не ретроактивно препишување.

Референци:
- https://developers.cloudflare.com/workers/versions-and-deployments/
- https://developers.cloudflare.com/workers/static-assets/headers/
- https://github.com/Makedonija-Sistem/makedonija-sistem/actions/runs/43632732076
