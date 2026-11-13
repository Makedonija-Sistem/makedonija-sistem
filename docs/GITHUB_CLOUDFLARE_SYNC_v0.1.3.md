# GitHub и Cloudflare усогласување — МАКЕДОНИЈА — СИСТЕМ

Верзија: **v0.1.3-preview** (13.11.2026)  
Статус: **за преглед, без автоматско објавување**.

## Зошто GitHub и Cloudflare се различни

Cloudflare Worker `makedonija-sistem-preview` е рачно распореден од ZIP, не е
поврзан со GitHub. Кодот на `Makedonija-Sistem/makedonija-sistem` во `main`
останува од оригиналната верзија. Ова не значи дека нешто е изгубено.

## Препорачана постапка (без менување на `main`)

1. На GitHub отвори `https://github.com/Makedonija-Sistem/makedonija-sistem`.
2. Од менито за гранки избери `main`, напиши
   `review/sync-preview-v0.1.3` и одбери **Create branch from 'main'**.
3. Распакувај го `MKS_GITHUB_UPLOAD_CHANGES_v0.1.3.zip` локално.
4. На новата *review* гранка, во коренот на репозиториумот одбери
   **Add file → Upload files**. Прикачи ги **содржините** од распакуваниот
   пакет, заедно со нивните поддиректориуми `assets/`, `docs/`, `legal/`.
   Не прикачувај ја ZIP архивата како една единствена датотека.
5. Прегледај ја листата на променети датотеки, особено дека `index.html`
   останува во коренот и `assets/og/og-image.png` е внатре во поддиректориум.
6. Commit **само на review гранката**. Создај **Draft Pull Request** кон
   `main`. Не прави Merge без завршна контрола и изречно одобрение.
7. Cloudflare се ажурира **одделно** преку ново рачно распоредување
   на `MKS_CLOUDFLARE_PREVIEW_v0.1.3.zip`, во `makedonija-sistem-preview`.
   Не го користи `icy-darkness-16d5`.

**Внимание:** ако Github web-upload не ги зачува поддиректориумите или
не дозволи замена на `index.html`, запрете. Наместо слепо commit-ирање,
може да се употреби GitHub Desktop или `git` локално.

## Што не е извршено

- Не е направена GitHub промена поради недоволни права на ChatGPT GitHub интеграцијата (HTTP 403).
- GitHub `main` не е сменет.
- Cloudflare Worker не е ажуриран од овој пакет.
- Не постои автоматски CI/CD pipeline кон Cloudflare.
- Не е завршена независна правна, финансиска, изворна и целосна петјазична ревизија.

## Ако треба враќање назад

GitHub `main` останува извор за оригиналните датотеки; затвори го Draft PR
без Merge. На Cloudflare може да се врати на претходното deployment
`f9b8f578` за preview Worker, ако постапката се покаже потребна.

## Извор на вистина

Овој пакет спојува оригиналната GitHub ZIP архива и v0.1.3-preview.
Оригиналните `docs/`, `legal/*.md` и `archive/` се зачувани. Новите `legal/*.html`
се прегледни документи и не заменуваат `legal/*.md` без правна проверка.
