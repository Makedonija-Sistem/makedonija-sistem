# МАКЕДОНИЈА СИСТЕМ — директно GitHub Actions → Cloudflare (алтернатива)

**Датум:** 14 ноември 2026  
**Статус:** REVIEW ONLY / ПОДГОТВЕНО ВО ГИТХАБ; НЕ Е ПОВРЗАНО СО ТОКЕН; НЕ Е ПУШТЕНО ВО ПРОДУКЦИЈА.

## Зошто оваа алтернатива

Cloudflare Workers Builds формуларот повторно го прикажува погрешниот GitHub корисник **makedonmessenger (355030331)** и репозиториумот `makedon-messenger-one`, иако точниот `Makedonija-Sistem` GitHub account има инсталирана и авторизирана Cloudflare GitHub апликација. НЕ го користиме тој формулар, НЕ ја отстрануваме апликацијата од MAKEDON MESSENGER.

**Алтернативата е GitHub Actions со ограничен Cloudflare API token, без Workers Builds Git поврзување.**

## Цел и граници

- **GitHub:** `Makedonija-Sistem/makedonija-sistem`
- **Единствен дозволен Worker:** `makedonija-sistem-preview`
- **Постојна активна верзија (според Dashboard на сопственикот):** `f9b8f578`
- **Стар резервен Worker:** `icy-darkness-16d5` — останува недопрен.
- **Cloudflare API token:** да има **Editor само за `makedonija-sistem-preview`**, доколку Cloudflare нуди грануларно ограничување на конкретен Worker; НЕ Workers Admin, НЕ пристап до сите апликации.
- **Нема** автоматско поставување при push, merge или PR. Нема `wrangler deploy` или `versions deploy` во работниот тек.

## Внесени датотеки (во Draft PR #4)

- `wrangler.jsonc` — точен Worker и assets path `./dist/cloudflare`.
- `scripts/mks_cloudflare_stage.py` — fail-closed дозволен список од точно 12 јавни датотеки, без `archive/`, `.env`, `.github/` и интерни документи.
- `scripts/test_mks_cloudflare_stage.py` — регресиски проверки.
- `.github/workflows/mks-cloudflare-link-review.yml` — офлајн QA.
- **`.github/workflows/mks-cloudflare-manual-upload.yml`** — QA на PR; рачен upload само од `main`, со експлицитен избор `UPLOAD_NONLIVE_VERSION`.
- Овој документ — операторски упатства.

## Што се прави само откако ќе има одобрение за спојување на PR #4

Работниот тек `workflow_dispatch` **не е достапен за рачно извршување додека датотеката не е во default branch `main`**. Спојувањето на PR е посебен Human Gate по ревизија. Дотогаш се извршуваат само PR тестови, без тајни.

### Еднократни поставки, без испраќање тајни во разговор

1. Во Cloudflare Dashboard → **Manage Account → Account API Tokens** → Create token. Ако е достапно, користи account-owned token со дозвола **Workers Editor** за **Specified Workers → `makedonija-sistem-preview`**. Не додавај Workers Admin, routes, KV, R2, Messenger или други сервиси. Ограничен рок на важност и можност за ротација се препорачуваат. Ако Granular Worker scope не е достапен во интерфејсот, **стоп** и провери го понудениот опфат пред креирање.
2. На GitHub отвори **Settings → Secrets and variables → Actions → New repository secret**, точно за `Makedonija-Sistem/makedonija-sistem`: https://github.com/Makedonija-Sistem/makedonija-sistem/settings/secrets/actions
3. Додај `MKS_CLOUDFLARE_API_TOKEN`: токенот од Cloudflare (никогаш во код/commit/chat).
4. Додај `MKS_CLOUDFLARE_ACCOUNT_ID`: Account ID од твојата Cloudflare Dashboard Account Details страница. Идентификаторот се чува како GitHub Secret за да не се објавува.
5. За дополнителен Human Gate можеш да поставиш GitHub environment **`mks-cloudflare-nonlive-upload`** со required reviewers во repo Settings → Environments; не е задолжителен за основната функционалност, но е препорачлив.

### По одобрено спојување (без автоматско продукциско распоредување)

1. GitHub → Actions → **MKS Cloudflare manual non-live version upload** → Run workflow.
2. Branch **main**; избор **CHECK_ONLY** е безбеден стандарден режим.
3. Само ако намерно сакаш нова **неактивна** верзија и се проверени secrets, избери **UPLOAD_NONLIVE_VERSION**.
4. Работниот тек ќе ги изврши тестовите и `npx --yes wrangler@4 versions upload --config wrangler.jsonc`. Ова **создава нова Worker верзија**, но **не ја активира** за публика.
5. Во Cloudflare → Worker → Deployments/Versions провери го новиот ID и дека активната верзија `f9b8f578` е непроменета. Ако нема проверка, статусот останува **НЕПОТВРДЕНО**.

## Критични граници

- **НЕ** спојувај PR #4 само затоа што тестовите се зелени. Нужни се независни прегледи и одобрение на сопственикот.
- **НЕ** користи Deploy new version/Promote/Traffic changes без посебен експлицитен Human Gate.
- **НЕ** копирај ги API токенот, лозинки или кодови во ChatGPT.
- Постоечката Cloudflare верзија и GitHub root `index.html` **не се byte-equivalent проверени**. Подготвената static-only верзија може да биде функционално различна. Пред активирање задолжителни се browser smoke тестови, link/header/CSP/i18n проверка и rollback план.
- `robots.txt` и `noindex,nofollow` остануваат активни.

## Какво е нивото на доказ

- VERIFIED FACT: GitHub е достапен за запишување, тестна гранка и PR #4 постојат.
- VERIFIED FACT: Работната линија за static assets успешно помина претходна GitHub Actions офлајн проверка.
- НЕПОТВРДЕНО: конфигурирани GitHub Secrets, Cloudflare API token, извршен upload со токен, нов Cloudflare version ID.
- NOT AUTHORIZED: автоматски production deploy/traffic/promote/merge.

## Официјални упатства

- Cloudflare GitHub Actions: https://developers.cloudflare.com/workers/ci-cd/external-cicd/github-actions/
- Worker-specific API token permissions: https://developers.cloudflare.com/workers/authorization/workers/
- Cloudflare deployment management: https://developers.cloudflare.com/workers/versions-and-deployments/deployment-management/
- GitHub workflow_dispatch: https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#workflow_dispatch
