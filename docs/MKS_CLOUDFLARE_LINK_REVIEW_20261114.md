# МАКЕДОНИЈА СИСТЕМ — Cloudflare/GitHub поврзување (REVIEW ONLY)

**Датум:** 14.11.2026  
**Статус:** ПОДГОТОВКА / НЕ Е ПОВРЗАНО ПРЕКУ ОВАА ГРАНКА / НЕ Е ПУШТЕНО ВО ПРОДУКЦИЈА.

## Потврдена состојба
- GitHub: Makedonija-Sistem/makedonija-sistem, главна гранка main.
- Cloudflare GitHub App е инсталирана за репозиториумот (прикажано од сопственикот).
- Постојниот Worker: makedonija-sistem-preview. Во Cloudflare Dashboard сопственикот ја прикажал активната рачно поставена верзија f9b8f578 (целосен ID порано наведен во проектната документација).
- Нема потврда дека Worker-от има конфигурирано Workers Builds Git поврзување.
- Изворната еднаквост GitHub ↔ активен Cloudflare Worker НЕ Е ПОТВРДЕНА.

## Што е во оваа гранка
- wrangler.jsonc: worker name строго makedonija-sistem-preview и static assets само од dist/cloudflare.
- scripts/mks_cloudflare_stage.py: Python без надворешни зависности; копира точно 12 експлицитно дозволени јавни датотеки.
- scripts/test_mks_cloudflare_stage.py: тестови за дозволен список, недостигачки датотеки, забрана за препокривање и symlink, noindex/robots и manifest.
- .github/workflows/mks-cloudflare-link-review.yml: само read-only build/tests, без CI secrets и без deploy.

Архиви, .env, docs, .github, LICENSE и приватни конфигурации НЕ СЕ КОПИРААТ во јавниот Worker пакет. Output е во веќе gitignore-ираниот dist/.

## Што НЕ Е докажано
- Новата static-only Wrangler конфигурација НЕ претставува реконструкција на кодот на Worker-от f9b8f578. Ако претходната Cloudflare верзија има Worker скрипта / API / binding, оваа кандидатска конфигурација може да се однесува поинаку.
- Не се тестирани жива Cloudflare Build поставка, мрежен E2E, Worker Previews, 5-јазична редакција, политика на приватност или CSP во испорачаните HTTP headers.
- Cloudflare Worker е постоечка продукциска рута според Dashboard; промената таму е посебен release gate.

## Безбедно поврзување — операторски чекор во Cloudflare Dashboard
1. Workers & Pages → makedonija-sistem-preview → Settings → Builds → Connect.
2. Git account: Makedonija-Sistem; repository: Makedonija-Sistem/makedonija-sistem.
3. **Привремена production branch:** integration/cloudflare-builds-safe-review-20261114 (не main).
4. Root directory: / (root).
5. Build command: python3 scripts/mks_cloudflare_stage.py
6. **Deploy command: npx wrangler versions upload** (не npx wrangler deploy). Cloudflare документацијата потврдува дека upload не ја промовира новата верзија во активниот сообраќај.
7. Preview command: npx wrangler preview. Вклучи Preview Builds само откако ќе се проверат изолираноста и потребните preview ресурси.
8. Пред Save/Connect провери ги вредностите; ако default deploy команда остане npx wrangler deploy или гранката е main — НЕ ПОТВРДУВАЈ.
9. Потоа провери build log/preview URL и дека активниот Worker сè уште ја има очекуваната продукциска верзија. Не ја промовирај новата верзија без посебна проверка.

**ВАЖНО:** Не се испраќа Cloudflare API token, приватна лозинка или верификациски код во chat. Не се менува manual deployment, domain, routes, secrets, bindings или Cloudflare account settings од овој PR.

## Human Gate / rollback
- PR за оваа гранка треба да остане Draft. Не го спојувај со main додека не се проверат тестовите, живите функции и точната поврзаност со Cloudflare.
- Ако Workers Builds не е активиран, ништо не треба да се враќа. Ако по идно активирање е потребен rollback, во Cloudflare врати ја претходната веќе проверена активна верзија и исклучи автоматско промовирање.
- Следен безбеден чекор: операторот да отвори Settings → Builds и да го провери формуларот; без интерфејс/Cloudflare API пристап не може од оваа интеграција да се потврди Connect.

## Официјални Cloudflare извори
- https://developers.cloudflare.com/workers/ci-cd/builds/
- https://developers.cloudflare.com/workers/ci-cd/builds/configuration/
- https://developers.cloudflare.com/workers/ci-cd/builds/build-branches/
- https://developers.cloudflare.com/workers/static-assets/
