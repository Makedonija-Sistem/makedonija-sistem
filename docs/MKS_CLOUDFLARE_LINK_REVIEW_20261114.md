# МАКЕДОНИЈА СИСТЕМ — GitHub Actions → Cloudflare, без GitHub picker

**Дата:** 14 ноември 2026  
**Верзија:** review v0.2 (не е издание на порталот)  
**СТАТУС:** DRAFT PR #4, преглед/тестирање. **НЕ Е СПОЕНО ВО MAIN, НЕ Е ИЗВРШЕН Cloudflare UPLOAD, НЕ Е АКТИВИРАНА ПРОДУКЦИЈА.**

## Одлука и потекло

Cloudflare Workers Builds selector се заглавува со `makedonmessenger (355030331)` и `makedon-messenger-one`, иако GitHub `@Makedonija-Sistem` има авторизирана Cloudflare апликација. Го заобиколуваме *само* selector-от: користиме официјално поддржан GitHub Actions → Cloudflare API токен.

**Цел:**
- Репозиториум: `Makedonija-Sistem/makedonija-sistem`
- Единствен Worker: `makedonija-sistem-preview`.
- Постојна активна Cloudflare верзија од сопственички Dashboard: `f9b8f578`. Изворна еквивалентност со GitHub сè уште не е утврдена.
- `icy-darkness-16d5` и `makedon-messenger-one`: недопрени.

## Безбедносни граници имплементирани во PR #4

1. **Точно дозволени јавни ресурси.** `scripts/mks_cloudflare_stage.py` копира само 12 експлицитни статички датотеки во `dist/cloudflare`, без `.env`, `archive/`, `docs/`, `.github/`. Не препокрива постоечки output и одбива симболички линкови.
2. **Реални HTTP headers за статички Cloudflare assets.** Генерира `_headers` во build output, со `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `Content-Security-Policy: frame-ancestors 'none'` и `X-Robots-Tag: noindex, nofollow`. Изворниот CSP сè уште користи inline скрипти — **не тврдиме дека е завршен XSS hardening**. HTTP headers во живиот Worker се непроверени.
3. **Зачувана забрана за индексирање.** Robots meta `noindex,nofollow` и `robots.txt` `Disallow: /` се задолжителни. Ако ги нема, staging запира.
4. **Офлајн тестови + вистинска Wrangler dry-run компилација.** `wrangler@4.161.0 deploy --dry-run` е само compile/config тест и не комуницира со продукцискиот Worker. Нема Cloudflare token на PR проверки.
5. **Ниту едно автоматско upload/deploy на push, merge или PR.** Рачниот workflow `.github/workflows/mks-cloudflare-manual-upload.yml` има стандарден избор `CHECK_ONLY`.
6. **Двоен Human Gate за нова неактивна верзија.** Cloudflare upload job бара: `workflow_dispatch` од `main` + експлицитно `UPLOAD_NONLIVE_VERSION` + точен 40-цифрен `approved_main_sha` што се совпаѓа со SHA на извршувањето, плус GitHub environment со наменски тајни.
7. **Ниту еден production deploy.** Единствена дозволена upload команда: `npx --yes wrangler@4.161.0 versions upload --config wrangler.jsonc`. Не содржи `wrangler deploy` без `--dry-run`, ниту `versions deploy` или Cloudflare traffic promotion.

## Еднократен Human Gate и тајни (САМО ПО ОДОБРЕН И ПРОВЕРЕН PR)

**Внимание:** Овој PR е Draft. Во моментов **НЕ** создавај токен со широка дозвола. Не испраќај токени, клучеви или кодови во chat.

1. Cloudflare Dashboard → **Manage Account → Account API Tokens → Create token**. Избери *account-owned* токен со **Workers Editor** за **Individual Worker: `makedonija-sistem-preview`**. Не давај Admin/All Workers/Zone Routes/други продукти. Официјално оваа грануларност е поддржана од 15.9.2026. Ако интерфејсот не дозволува ограничување на конкретниот Worker, **СТОП**.
2. GitHub → **Settings → Environments → New environment**, име точно **`mks-cloudflare-nonlive-upload`**: https://github.com/Makedonija-Sistem/makedonija-sistem/settings/environments
3. Во environment конфигурирај **Required reviewers** и deployment branches **main only**, според достапните опции. Ако акаунтот е единствен одобрувач, не активирај „Prevent self-review“ без втор овластен reviewer (инаку може да се блокираш). Environment settings мора рачно да се прегледаат; кодот сам не докажува дека се поставени.
4. Во **истиот environment**, не во repository-wide Secrets, додај:
   - `MKS_CLOUDFLARE_API_TOKEN`: ограничен Cloudflare токен.
   - `MKS_CLOUDFLARE_ACCOUNT_ID`: ID на истиот Cloudflare account.
5. **PR #4 да се спои во main само по независен ревизорски преглед и посебно изречно одобрение на сопственикот.** Спојувањето НЕ активира Cloudflare, но може да влијае на GitHub Pages, затоа е Human Gate.

## Рачна проверка ПО одобрен merge — без промена на сообраќај

1. GitHub → Actions → `MKS Cloudflare manual non-live version upload` → Run workflow на `main`.
2. Најнапред избери `CHECK_ONLY` (без Cloudflare токен); провери дека тестовите и Wrangler dry-run се зелени.
3. Дури по ревизија, за пробен **неактивен** Worker version избери `UPLOAD_NONLIVE_VERSION` и во `approved_main_sha` внеси го **точниот 40-цифрен main commit SHA** што си го одобрил. Ако не се совпаѓа, workflow мора да FAIL без upload.
4. GitHub environment треба да бара одобрување. Само тогаш се ослободуваат неговите secrets.
5. По успешен upload, во Cloudflare → `makedonija-sistem-preview` → Deployments/Versions утврди нова неактивна version ID; провери дека активната `f9b8f578` и распределбата на сообраќај остануваат непроменети. **Upload ≠ deploy.**

## Преостанати блокери пред било каков LIVE release

- Нема независна байт-по-байт споредба на стар Cloudflare Worker и GitHub index, ниту browser E2E smoke-test.
- Нема проверено финални 5-јазични преводи, дел од основните script CSP слабости, live HTTP headers, правни и privacy текстови.
- Не е извршен workflow upload со Cloudflare токен. Не е одобрен production deploy или traffic change.
- Потребно е да се потврди restore/rollback од зачуваната стара верзија пред евентуално идно promotion.

## Докази

- GitHub Draft PR: https://github.com/Makedonija-Sistem/makedonija-sistem/pull/4
- Cloudflare Workers permissions: https://developers.cloudflare.com/workers/authorization/workers/
- Cloudflare Versions and Deployments: https://developers.cloudflare.com/workers/versions-and-deployments/
- Cloudflare Static Assets headers: https://developers.cloudflare.com/workers/static-assets/headers/
- Cloudflare GitHub Actions: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- GitHub protected environments: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments
