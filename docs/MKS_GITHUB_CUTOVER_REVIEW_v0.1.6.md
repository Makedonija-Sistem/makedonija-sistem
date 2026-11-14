# МАКЕДОНИЈА — СИСТЕМ · Контролиран кандидат за GitHub Pages (v0.1.6)

**СТАТУС: REVIEW ONLY · НЕ Е ОБЈАВЕНО · НЕ Е ОДОБРЕНО ЗА MERGE.**

## Извори, идентитети и ограничувања

- Стара GitHub главна страница: Git blob SHA `59d29dc5d4b56168eba1b6952b16c253d638d4aa`. Снимена без измена како `archive/main-index-original-20261113.html.disabled`.
- Нов локален извор: `MKS_CLOUDFLARE_PREVIEW_v0.1.3_SYNC_MATCH.zip`; изворниот `index.html` има Git blob SHA `b0f90f75be01b8e48fe530ca804bb0743d2352cc` и се совпаѓаше со GitHub `review/sync-preview-v0.1.3` кога е проверен.
- GitHub side-by-side база: `review-preview` од `review/side-by-side-v0.1.5`, со зелено GitHub Actions извршување **само за таа посебна тестна верзија**.
- Cloudflare Worker: `makedonija-sistem-preview`; операторот прикажа active Version ID `f9b8f578-0282-417c-9db2-7ca3c47744af`, Source `Dashboard`, `Manually deployed`.
- **НЕПОТВРДЕНО:** независна проверка на содржината на активниот Cloudflare deployment; точниот Cloudflare upload ZIP за `f9b8f578` не е достапен преку API од оваа околина. Текстот прикачен од сопственикот го покажува `v0.1.2-preview`, а зачуваниот локален кандидат носи `v0.1.3-preview`. Може да е различен upload или cache; без докази не се тврди еднаквост.

## Што е поправено во **GitHub-кандидатот**

- Патеките за икони, правни страници и manifest се релативни и погодни за GitHub Pages под `/makedonija-sistem/`.
- Manifest `start_url`, `scope`, icons, shortcuts се релативни.
- 404 врските од `/`/`/#...` се претворени во `/makedonija-sistem/`/`/makedonija-sistem/#...` (стабилни и за подлабоки 404 патеки).
- Legal home links се сменети од `/` во `../index.html`.
- Canonical, OG URL, OG image, WebSite JSON-LD и sitemap се усогласени на `https://makedonija-sistem.github.io/makedonija-sistem/` **само во GitHub-кандидатот**, не во Cloudflare.
- Оригиналниот кеширачки Service Worker за Cloudflare користи domain-root патеки; GitHub-кандидатот го заменува со **пасивен SW** без кеширање/fetch interception. HTML регистрациите се намерно деактивирани. Offline/PWA можности: **НЕ ТЕСТИРАНИ / НЕАКТИВНИ**.
- `robots.txt` е review `Disallow: /`, а HTML содржи `noindex,nofollow`. Индексација не се одобрува на овој чекор.

## Како да се употреби

1. **Не поставувај ZIP во Cloudflare и не поставувај на `main`.**
2. Кога ќе биде одобрен review branch, креирај `review/root-cutover-v0.1.6` од **`main`** во GitHub.
3. Распакувај `MKS_GITHUB_ROOT_CUTOVER_REVIEW_ONLY_v0.1.6.zip` и прикачи ги само неговите содржини на review гранката (структурата на папките мора да се зачува). Погледни diff пред Commit.
4. Провери дека единствената постоечка изворна датотека што се заменува е коренскиот `index.html` и дека другите root фајлови се само потребни изменети придружни ресурси; нема бришења на стари датотеки.
5. Отвори **Draft** PR кон `main`. Провери ги сите релевантни PR checks. Овој локален QA не е remote QA.
6. Заврши проверка на живиот Cloudflare извор, 5 јазици, правна/финансиска содржина, прелистувачки сценарија, линкови и приватност. Потребно е изречно одобрение од сопственикот пред Merge.

## Rollback

- Додека PR е Draft, затворање на PR ја остава `main` недопрена.
- По евентуална дозволена замена: направи Revert на release commit или обнови `index.html` од `archive/main-index-original-20261113.html.disabled`; провери и другите променети companion фајлови, особено SW, manifest и legal HTML.
- Не менувај Cloudflare Worker без посебен план и идентификација на активниот Worker Version ID.

## Преостанати ограничувања

- Фактографска, изборна, правна, даночна, финансиска и петјазична ревизија: **НЕПОТВРДЕНО**.
- Авторска одлука за индексација, официјален домен и PWA кеширање: **ОТВОРЕНО**.
- Успешното локално тестирање значи само функционален кандидат, не објавена/законски валидирана платформа.
