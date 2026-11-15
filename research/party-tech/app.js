/* Self-contained, privacy-safe research interface; all annotations are editorial. */
import { TECH_EVIDENCE } from './evidence.js';

const LANGUAGE_CODES = ["mk","en","al","sr","de"];
const TRANSLATIONS = {
  "skip": [
    "Прескокни до содржината",
    "Skip to content",
    "Kalo te përmbajtja",
    "Пређи на садржај",
    "Zum Inhalt springen"
  ],
  "status": [
    "ИСТРАЖУВАЧКИ ПРОТОТИП · НЕ Е РАНГИРАЊЕ · НЕ ОЗНАЧУВА ПАРТНЕРСТВА · БЕЗ СОБИРАЊЕ ПОДАТОЦИ",
    "RESEARCH PROTOTYPE · NO RANKING · NO PARTNERSHIP CLAIMS · NO DATA COLLECTION",
    "PROTOTIP KËRKIMOR · PA RENDITJE · PA PRETENDIME PARTNERITETI · PA MBLEDHJE TË DHËNASH",
    "ИСТРАЖИВАЧКИ ПРОТОТИП · БЕЗ РАНГИРАЊА · БЕЗ ПАРТНЕРСТАВА · БЕЗ ПРИКУПЉАЊА ПОДАТАКА",
    "FORSCHUNGSPROTOTYP · KEIN RANKING · KEINE PARTNERSCHAFTSBEHAUPTUNGEN · KEINE DATENERHEBUNG"
  ],
  "brand.sub": [
    "Истражувачка надградба на партискиот атлас",
    "Research extension of the party atlas",
    "Zgjerim kërkimor i atlasit të partive",
    "Истраживачко проширење партијског атласа",
    "Forschungserweiterung des Parteienatlas"
  ],
  "nav.explore": [
    "Истражување",
    "Explore",
    "Hulumto",
    "Истраживање",
    "Erkunden"
  ],
  "nav.method": [
    "Методологија",
    "Methodology",
    "Metodologjia",
    "Методологија",
    "Methodik"
  ],
  "nav.other": [
    "Дополнителни случаи",
    "Other cases",
    "Raste të tjera",
    "Додатни случајеви",
    "Weitere Fälle"
  ],
  "hero.kicker": [
    "ГЛОБАЛЕН ПАРТИСКИ АТЛАС / НОВ ИСТРАЖУВАЧКИ СЛОЈ",
    "GLOBAL PARTY ATLAS / RESEARCH LAYER",
    "ATLASI GLOBAL I PARTIVE / SHTRESË KËRKIMORE",
    "ГЛОБАЛНИ ПАРТИЈСКИ АТЛАС / ИСТРАЖИВАЧКИ СЛОЈ",
    "GLOBALER PARTEIENATLAS / FORSCHUNGSEBENE"
  ],
  "hero.title": [
    "Дигиталните технологии на светските партии — со докази, не со претпоставки.",
    "Digital technologies of political parties — evidence, not assumptions.",
    "Teknologjitë digjitale të partive — prova, jo supozime.",
    "Дигиталне технологије партија — докази, не претпоставке.",
    "Digitale Technologien der Parteien — Belege statt Annahmen."
  ],
  "hero.intro": [
    "Ги зачувуваме постојните 61 партиски профил и додаваме проверливи описи на членски портали, предлози, правила, безбедносни механизми и надворешни финансиски платформи. Нема произволен технолошки скор.",
    "The existing 61 party profiles remain the single source of truth. We add publicly sourced descriptions of member portals, motions, governance, access controls and external finance services. No arbitrary score.",
    "61 profilet ekzistuese mbeten burimi kryesor. Shtojmë informacione me burime publike për portale anëtarësh, propozime, qeverisje, qasje dhe financim të jashtëm. Nuk ka pikëzim arbitrar.",
    "Постојећи 61 профил остаје извор истине. Додајемо јавне изворе о чланским порталима, предлозима, управљању, приступу и спољним финансијским услугама. Без произвољних оцена.",
    "Die 61 bestehenden Parteiprofile bleiben maßgeblich. Wir ergänzen öffentlich belegte Angaben zu Mitgliederportalen, Anträgen, Regeln, Zugangskontrollen und externen Finanzdiensten. Ohne willkürliche Bewertung."
  ],
  "hero.go": [
    "Истражи ги профилите",
    "Explore profiles",
    "Hulumto profilet",
    "Истражи профиле",
    "Profile erkunden"
  ],
  "metric.atlas": [
    "Постојни профили",
    "Existing profiles",
    "Profile ekzistuese",
    "Постојећи профили",
    "Bestehende Profile"
  ],
  "metric.researched": [
    "Со јавни технолошки извори",
    "With public technical sources",
    "Me burime teknike publike",
    "Са јавним техничким изворима",
    "Mit öffentlichen Technikquellen"
  ],
  "metric.signals": [
    "Документирани сигнали",
    "Documented capabilities",
    "Aftësi të dokumentuara",
    "Документоване функције",
    "Dokumentierte Funktionen"
  ],
  "metric.sources": [
    "Извори во регистарот",
    "Sources in register",
    "Burime në regjistër",
    "Извори у регистру",
    "Quellen im Register"
  ],
  "explore.kicker": [
    "01 / ФИЛТРИРАЧКИ ИСТРАЖУВАЧКИ ПРЕГЛЕД",
    "01 / FILTERABLE RESEARCH",
    "01 / HULUMTIM ME FILTRA",
    "01 / ПРЕТРАЖИВА ИСТРАЖИВАЊА",
    "01 / FILTERBARE FORSCHUNG"
  ],
  "explore.title": [
    "Истите партии. Нов доказен слој.",
    "The same parties. A new evidence layer.",
    "Të njëjtat parti. Një shtresë e re provash.",
    "Исте партије. Нови слој доказа.",
    "Dieselben Parteien. Neue Belege."
  ],
  "explore.desc": [
    "Податоците за имиња и држави се читаат од постојниот атлас при отворање. Истражувачките белешки имаат поединечни јавни извори. „Неистражено“ не значи дека партијата нема технологија.",
    "Party names and countries are read from the existing atlas. Technical findings have individual public sources. “Not researched” does not mean a party lacks technology.",
    "Emrat dhe shtetet merren nga atlasi ekzistues. Gjetjet kanë burime individuale publike. “Pa hulumtuar” nuk do të thotë mungesë teknologjie.",
    "Имена и државе се читају из постојећег атласа. Технички налази имају јавне изворе. „Неистражено“ не значи да технологија не постоји.",
    "Namen und Länder werden aus dem bestehenden Atlas gelesen. Jede technische Aussage hat eine öffentliche Quelle. „Nicht untersucht“ bedeutet nicht, dass Technik fehlt."
  ],
  "filter.search": [
    "Пребарај партија или земја",
    "Search party or country",
    "Kërko parti ose shtet",
    "Претражи партију или земљу",
    "Partei oder Land suchen"
  ],
  "search.placeholder": [
    "Име, држава...",
    "Name, country...",
    "Emër, shtet...",
    "Назив, држава...",
    "Name, Land..."
  ],
  "filter.region": [
    "Регион",
    "Region",
    "Rajoni",
    "Регион",
    "Region"
  ],
  "filter.dimension": [
    "Дигитална функција",
    "Digital function",
    "Funksioni digjital",
    "Дигитална функција",
    "Digitale Funktion"
  ],
  "filter.evidence": [
    "Доказен статус",
    "Evidence status",
    "Statusi i provave",
    "Статус доказа",
    "Belegstatus"
  ],
  "filter.reset": [
    "Исчисти филтри",
    "Clear filters",
    "Pastro filtrat",
    "Обриши филтере",
    "Filter zurücksetzen"
  ],
  "filter.export": [
    "Преземи филтриран CSV",
    "Download filtered CSV",
    "Shkarko CSV të filtruar",
    "Преузми филтрирани CSV",
    "Gefilterte CSV laden"
  ],
  "results.loading": [
    "Се вчитуваат профилите од постојниот атлас...",
    "Loading profiles from the existing atlas...",
    "Po ngarkohen profilet nga atlasi...",
    "Учитавање профила из атласа...",
    "Profile aus dem Atlas werden geladen..."
  ],
  "fallback.title": [
    "Истражувачки преглед",
    "Research overview",
    "Përmbledhje kërkimore",
    "Истраживачки преглед",
    "Forschungsübersicht"
  ],
  "fallback.text": [
    "За интерактивните податоци потребно е JavaScript. Оригиналниот каталог останува достапен.",
    "The interactive list requires JavaScript. The original atlas remains available.",
    "Lista interaktive kërkon JavaScript. Atlasi origjinal mbetet i hapur.",
    "За интерактивни приказ потребан је JavaScript. Оригинални атлас је доступан.",
    "Die interaktive Liste benötigt JavaScript. Der Originalatlas bleibt verfügbar."
  ],
  "fallback.link": [
    "Отвори го постојниот атлас",
    "Open original atlas",
    "Hap atlasin origjinal",
    "Отвори оригинални атлас",
    "Originalatlas öffnen"
  ],
  "explore.translation": [
    "Интерфејсот е достапен на пет јазици. Доказните описни белешки се изворно уредени на македонски; нивните преводи бараат посебна лекторска проверка.",
    "Interface available in five languages. Evidence annotations are edited in Macedonian and require separate professional translation.",
    "Ndërfaqja është në pesë gjuhë. Shënimet e provave janë në maqedonisht; përkthimet kërkojnë redaktim profesional.",
    "Интерфејс је на пет језика. Белешке о доказима су на македонском; преводи захтевају засебну проверу.",
    "Oberfläche in fünf Sprachen. Evidenzhinweise sind auf Mazedonisch verfasst; Übersetzungen benötigen gesonderte Prüfung."
  ],
  "method.kicker": [
    "02 / ПРОВЕНАНЦИЈА И МЕТОД",
    "02 / PROVENANCE AND METHOD",
    "02 / BURIMI DHE METODA",
    "02 / ПОРЕКЛО И МЕТОД",
    "02 / HERKUNFT UND METHODE"
  ],
  "method.title": [
    "Јавен доказ ≠ независен аудит.",
    "Public evidence ≠ independent audit.",
    "Prova publike ≠ auditim i pavarur.",
    "Јавни доказ ≠ независна ревизија.",
    "Öffentlicher Beleg ≠ unabhängige Prüfung."
  ],
  "method.a.title": [
    "Канонски каталог",
    "Canonical atlas",
    "Atlasi kanonik",
    "Канонски атлас",
    "Kanonischer Atlas"
  ],
  "method.a.desc": [
    "Сите 61 профил се читаат директно од постојниот HTML-атлас; не се создаваат нови партиски картички во базата.",
    "All 61 profiles are read from the current HTML atlas; no duplicate master catalogue.",
    "Të 61 profilet merren nga atlasi HTML ekzistues; nuk krijohet katalog i dytë.",
    "Свих 61 профил се чита из постојећег HTML атласа; нема другог каталога.",
    "Alle 61 Profile werden aus dem bestehenden HTML-Atlas gelesen; kein zweiter Katalog."
  ],
  "method.b.title": [
    "Доказни записи",
    "Evidence entries",
    "Regjistra provash",
    "Доказни записи",
    "Belegeinträge"
  ],
  "method.b.desc": [
    "Секој технолошки сигнал мора да има јавен партиски или доставувачки извор. Описот покажува само што изворот може да потврди.",
    "Each technical finding cites a public party or supplier source. Claims remain bounded.",
    "Çdo gjetje teknike ka burim publik të partisë ose ofruesit. Pretendimet janë të kufizuara.",
    "Сваки технички налаз има јавни партијски или добављачки извор.",
    "Jeder technische Befund nennt eine öffentliche Partei- oder Anbieterquelle."
  ],
  "method.c.title": [
    "Без спорни рангирања",
    "No arbitrary ranking",
    "Pa renditje arbitrare",
    "Без произвољног рангирања",
    "Kein willkürliches Ranking"
  ],
  "method.c.desc": [
    "Нема оцена „најнапредна партија“, изборни прогнози, симпатии, политички профили или скриено убедување.",
    "No party-performance score, election forecasting, political profiles or covert persuasion.",
    "Pa pikëzim partie, parashikime zgjedhore, profile politike ose bindje të fshehtë.",
    "Без оцена партија, изборних прогноза, профила или прикривеног убеђивања.",
    "Keine Parteibewertung, Wahlprognose, politische Profile oder verdeckte Beeinflussung."
  ],
  "method.d.title": [
    "Human Gate",
    "Human Gate",
    "Kontrolli njerëzor",
    "Људска контрола",
    "Menschliche Freigabe"
  ],
  "method.d.desc": [
    "AI, приватни апликации и криптографска безбедност не се независно потврдени. Јавната продукциска промена бара посебна човечка ревизија.",
    "AI, private apps and cryptographic claims are not independently audited. Publication requires human approval.",
    "AI, aplikacionet private dhe pretendimet e sigurisë nuk janë audituar në mënyrë të pavarur. Publikimi kërkon miratim njerëzor.",
    "AI, приватне апликације и безбедносне тврдње нису независно проверене. Објављивање тражи људско одобрење.",
    "KI, private Anwendungen und Sicherheitsbehauptungen wurden nicht unabhängig geprüft. Veröffentlichung erfordert menschliche Freigabe."
  ],
  "limits.title": [
    "Граници на ова истражувачко издание",
    "Limits of this edition",
    "Kufijtë e këtij botimi",
    "Ограничења овог издања",
    "Grenzen dieser Ausgabe"
  ],
  "limits.body": [
    "13 од 61 партија имаат дополнети јавни технолошки докази. Останатите 48 се означени „неистражено во ова издание“. Надворешните ActBlue и WinRed не се мешаат со сопствените информатички системи на партиите. Нема пристап до приватни членски бази или овластување за објавување на чувствителни податоци.",
    "13 of 61 parties have new public technology evidence; 48 remain not researched. ActBlue and WinRed are external providers, not parties' own internal systems. No access to private member data.",
    "13 nga 61 parti kanë prova të reja publike; 48 mbeten të pahulumtuara. ActBlue dhe WinRed janë ofrues të jashtëm. Pa qasje në të dhëna private.",
    "13 од 61 партије имају нове јавне техничке доказе; 48 нису истражене. ActBlue и WinRed су спољни добављачи. Нема приступа приватним подацима.",
    "13 von 61 Parteien haben neue öffentliche Technikbelege; 48 sind nicht untersucht. ActBlue und WinRed sind externe Anbieter. Kein Zugriff auf private Mitgliederdaten."
  ],
  "method.atlas": [
    "Врати се на изворниот Глобален партиски атлас",
    "Return to the original World Parties Atlas",
    "Kthehu te atlasi origjinal i partive",
    "Назад на оригинални атлас",
    "Zurück zum Originalatlas"
  ],
  "extra.kicker": [
    "03 / ДОПОЛНИТЕЛНИ КОМПАРАТИВНИ ПРИМЕРИ",
    "03 / ADDITIONAL CASES",
    "03 / RASTE SHTESË",
    "03 / ДОДАТНИ СЛУЧАЈЕВИ",
    "03 / ZUSÄTZLICHE FÄLLE"
  ],
  "extra.title": [
    "Два вредни примера што не се меѓу 61 профил.",
    "Two additional examples outside the 61 profiles.",
    "Dy raste shtesë jashtë 61 profileve.",
    "Два додатна случаја ван 61 профила.",
    "Zwei weitere Fälle außerhalb der 61 Profile."
  ],
  "extra.desc": [
    "Не ги додаваме автоматски во оригиналниот каталог. Ги прикажуваме одделно како истражувачки примери со јавни извори.",
    "Not automatically added to the original atlas. Shown separately with sources.",
    "Nuk shtohen automatikisht në atlasin origjinal. Paraqiten veçmas me burime.",
    "Не додају се аутоматски у оригинални атлас. Приказују се одвојено са изворима.",
    "Nicht automatisch zum Originalatlas hinzugefügt. Gesondert mit Quellen."
  ],
  "foot.note": [
    "Независна истражувачка надградба · без партиски партнерства, кориснички досиеја или активни членски функции.",
    "Independent research extension · no party partnerships, user profiles or live membership.",
    "Shtesë kërkimore e pavarur · pa partneritete, profile ose anëtarësim aktiv.",
    "Независно истраживачко проширење · без партнерстава, профила или активног чланства.",
    "Unabhängige Forschungserweiterung · ohne Partnerschaften, Nutzerprofile oder aktive Mitgliedschaft."
  ],
  "foot.return": [
    "← Назад во атласот",
    "← Back to atlas",
    "← Kthehu te atlasi",
    "← Назад у атлас",
    "← Zurück zum Atlas"
  ],
  "region.all": [
    "Сите региони",
    "All regions",
    "Të gjitha rajonet",
    "Сви региони",
    "Alle Regionen"
  ],
  "region.europe": [
    "Европа",
    "Europe",
    "Evropa",
    "Европа",
    "Europa"
  ],
  "region.americas": [
    "Америка",
    "Americas",
    "Amerikat",
    "Америка",
    "Amerika"
  ],
  "region.asia": [
    "Азија",
    "Asia",
    "Azia",
    "Азија",
    "Asien"
  ],
  "region.africa": [
    "Африка",
    "Africa",
    "Afrika",
    "Африка",
    "Afrika"
  ],
  "region.oceania": [
    "Океанија",
    "Oceania",
    "Oqeania",
    "Океанија",
    "Ozeanien"
  ],
  "dimension.all": [
    "Сите функции",
    "All functions",
    "Të gjitha funksionet",
    "Све функције",
    "Alle Funktionen"
  ],
  "evidence.all": [
    "Сите статуси",
    "All statuses",
    "Të gjitha statuset",
    "Сви статуси",
    "Alle Status"
  ],
  "evidence.researched": [
    "Со јавни докази",
    "Publicly documented",
    "Me prova publike",
    "Са јавним доказима",
    "Öffentlich belegt"
  ],
  "evidence.unresearched": [
    "Неистражено во ова издание",
    "Not researched in this edition",
    "E pahulumtuar në këtë botim",
    "Неистражено у овом издању",
    "In dieser Ausgabe nicht untersucht"
  ],
  "card.country": [
    "Држава",
    "Country",
    "Shteti",
    "Држава",
    "Land"
  ],
  "card.more": [
    "Документирани функции",
    "Documented functions",
    "Funksione të dokumentuara",
    "Документоване функције",
    "Dokumentierte Funktionen"
  ],
  "card.none": [
    "Нема верификувана дополнителна технолошка белешка во ова истражување. Ова не докажува отсуство на дигитални системи.",
    "No additional public technical evidence has been reviewed for this profile; this is not proof of absence.",
    "Pa provë teknike shtesë të rishikuar; kjo nuk tregon mungesë teknologjie.",
    "Нема додатно провереног техничког доказа; то не значи да технологија не постоји.",
    "Kein weiterer öffentlicher Technikbeleg geprüft; kein Beweis für Abwesenheit."
  ],
  "card.party": [
    "Оригинален партиски профил",
    "Original party site",
    "Faqja e partisë",
    "Оригинални сајт странке",
    "Originale Parteiseite"
  ],
  "card.source": [
    "Отвори јавен извор",
    "Open public source",
    "Hap burimin publik",
    "Отвори јавни извор",
    "Öffentliche Quelle öffnen"
  ],
  "card.vendor": [
    "Надворешен доставувач; не подразбира сопственост на партијата.",
    "External supplier; party ownership is not implied.",
    "Ofrues i jashtëm; nuk nënkupton pronësi të partisë.",
    "Спољни добављач; не подразумева власништво партије.",
    "Externer Anbieter; kein Eigentumsnachweis der Partei."
  ],
  "card.partyclaim": [
    "Партиски јавно објавен опис; независен аудит не е направен.",
    "Party-published description; not independently audited.",
    "Përshkrim publik i partisë; jo auditim i pavarur.",
    "Јавни партијски опис; без независне ревизије.",
    "Öffentliche Parteiaussage; nicht unabhängig geprüft."
  ],
  "results.count": [
    "Прикажани {shown} од {total} профили",
    "Showing {shown} of {total} profiles",
    "Shfaqen {shown} nga {total} profile",
    "Приказано {shown} од {total} профила",
    "{shown} von {total} Profilen"
  ],
  "results.empty": [
    "Нема совпаѓања",
    "No matching results",
    "Nuk ka rezultate",
    "Нема резултата",
    "Keine Treffer"
  ],
  "results.emptydesc": [
    "Промени ги филтрите или врати ги сите 61 профил.",
    "Change filters or clear to see all 61 profiles.",
    "Ndrysho filtrat për të parë 61 profile.",
    "Промени филтере за свих 61 профил.",
    "Filter ändern, um alle 61 Profile zu sehen."
  ],
  "results.error": [
    "Не може да се вчита канонскиот партиски каталог. Изворниот атлас останува достапен.",
    "The original atlas could not be loaded. The source atlas is still available.",
    "Atlasi origjinal nuk mund të ngarkohet.",
    "Није могуће учитати оригинални атлас.",
    "Originalatlas konnte nicht geladen werden."
  ],
  "extra.source": [
    "Јавен извор",
    "Public source",
    "Burim publik",
    "Јавни извор",
    "Öffentliche Quelle"
  ]
};
const COUNTRY_REGION = Object.freeze({
europe:["Германија","Македонија","Италија","Франција","Грција","Шпанија","Португалија","Унгарија","Полска","Австрија","Ирска","Швајцарија","Белгија","Словачка","Хрватска","Србија","Бугарија","Романија","Велика Британија","Норвешка","Шведска","Данска","Словенија","Естонија","Холандија","Чешка","Ирска · Сев. Ирска","Финска"],
americas:["САД","Канада","Бразил","Чиле","Мексико","Аргентина"],
asia:["Јапонија","Јужна Кореја","Израел","Индија","Тајван"],
africa:["Јужна Африка"],
oceania:["Австралија","Нов Зеланд"]
});
const REGIONS = Object.keys(COUNTRY_REGION);
const DICTIONARY = Object.create(null);
for (const [key, values] of Object.entries(TRANSLATIONS)) {
  if (values.length !== LANGUAGE_CODES.length || values.some(value => !value || typeof value !== 'string')) {
    throw new Error('Incomplete UI translation: ' + key);
  }
  DICTIONARY[key] = Object.fromEntries(LANGUAGE_CODES.map((lang, i) => [lang, values[i]]));
}
for (const element of document.querySelectorAll('[data-t]')) {
  if (!DICTIONARY[element.dataset.t]) throw new Error('Untranslated field: '+element.dataset.t);
}
const state = {lang: 'mk', items: [], query: '', region:'all', dimension:'all', evidence:'all', ready:false};
const urlLocale = new URLSearchParams(location.search).get('lang');
if (LANGUAGE_CODES.includes(urlLocale)) state.lang=urlLocale;
const search = document.getElementById('search');
const region = document.getElementById('region');
const dimension = document.getElementById('dimension');
const evidence = document.getElementById('evidence');
const results = document.getElementById('research-results');
const count = document.getElementById('result-count');
const csv = document.getElementById('csv');
const langs = [...document.querySelectorAll('.lang[data-lang]')];

function tr(key) {
  const entry = DICTIONARY[key];
  return entry ? entry[state.lang] : key;
}
function make(tag, cls, value) {
  const el = document.createElement(tag);
  if(cls) el.className=cls;
  if(value !== undefined) el.textContent=value;
  return el;
}
function href(anchor, url) {
  const parsed = new URL(url, location.href);
  if (parsed.protocol !== 'https:' && parsed.origin !== location.origin) throw new Error('Unsafe evidence URL');
  anchor.href = parsed.href;
  anchor.rel = 'noopener noreferrer';
  anchor.referrerPolicy = 'no-referrer';
  anchor.target = '_blank';
  return anchor;
}
function regionOf(country) {
  for (const key of REGIONS) if (COUNTRY_REGION[key].includes(country)) return key;
  throw new Error('Unknown country in source atlas: '+country);
}
function normalized(text) {
  return String(text||'').normalize('NFKC').toLocaleLowerCase().trim();
}
function fromOriginal(html) {
  // Parsing fetched HTML as inert content: embedded original scripts are NEVER executed.
  const original = new DOMParser().parseFromString(html,'text/html');
  const cards = [...original.querySelectorAll('#world-parties #wpGrid > article.wp-card')];
  if(cards.length!==61) throw new Error('Atlas count drift: expected 61 but found '+cards.length);
  const parties = cards.map((el,i)=>{
    const name = el.querySelector('.wp-info > strong')?.textContent?.trim();
    const country = el.querySelector('.wp-country')?.textContent?.trim();
    const flag = el.querySelector('.wp-flag')?.textContent?.trim()||'🌍';
    const partyUrl = el.querySelector('.wp-web a')?.getAttribute('href');
    const block=el.getAttribute('data-block');
    if(!name||!country||!partyUrl||!block) throw new Error('Incomplete original atlas card: '+i);
    const fullUrl=new URL(partyUrl).href.replace(/\/$/,'');
    const tech=TECH_EVIDENCE.records[fullUrl]||null;
    return {name,country,flag,url:fullUrl,block,region:regionOf(country),signals:tech?.signals||[]};
  });
  const keys=parties.map(item=>item.url);
  if(new Set(keys).size!==keys.length) throw new Error('Duplicate canonical party websites in existing atlas');
  for (const key of Object.keys(TECH_EVIDENCE.records)) {
    if(!keys.includes(key)) throw new Error('Evidence not tied to an existing canonical party: '+key);
  }
  return parties;
}
function renderSelectors() {
  const previous={region:state.region,dimension:state.dimension,evidence:state.evidence};
  const fill = (element, rows,selected)=>{
    element.replaceChildren();
    for (const [value,label] of rows) {
      const option=document.createElement('option');
      option.value=value;option.textContent=label;element.append(option);
    }
    element.value=selected;
  };
  fill(region,[['all',tr('region.all')],...REGIONS.map(id=>[id,tr('region.'+id)])],previous.region);
  fill(dimension,[['all',tr('dimension.all')],...TECH_EVIDENCE.dimensions.map(dim=>[dim.id,dim[state.lang]])],previous.dimension);
  fill(evidence,[['all',tr('evidence.all')],['researched',tr('evidence.researched')],['unresearched',tr('evidence.unresearched')]],previous.evidence);
}
function filtered() {
  return state.items.filter(item=>{
    if(state.region!=='all'&&item.region!==state.region)return false;
    if(state.evidence==='researched'&&!item.signals.length)return false;
    if(state.evidence==='unresearched'&&item.signals.length)return false;
    if(state.dimension!=='all'&&!item.signals.some(s=>s.dimension===state.dimension))return false;
    if(state.query) {
      const dimensionNames=item.signals.map(s=>s.title).join(' ');
      const haystack=normalized([item.name,item.country,item.block,dimensionNames].join(' '));
      if(!haystack.includes(state.query))return false;
    }
    return true;
  });
}
function renderCard(party) {
  const card=make('article','research-card');
  const top=make('div','card-top');
  top.append(make('span','partyflag',party.flag));
  const title=make('h3','',party.name);
  top.append(title);card.append(top);
  card.append(make('div','subheading',party.country+' · '+tr('region.'+party.region)));
  const badges=make('div','card-badges');
  badges.append(make('span','chip'+(party.signals.length?'':' unresearched'),tr(party.signals.length?'evidence.researched':'evidence.unresearched')));
  card.append(badges);
  card.append(href(make('a','card-link',tr('card.party')+' ↗'),party.url));
  if(!party.signals.length){
    card.append(make('p','no-evidence',tr('card.none')));
    return card;
  }
  for (const signal of party.signals) {
    const details=make('details','evidence');
    const dimensionName=TECH_EVIDENCE.dimensions.find(dim=>dim.id===signal.dimension)?.[state.lang]||signal.dimension;
    details.append(make('summary','',signal.title+' · '+dimensionName));
    const box=make('div','evidence-content');
    box.append(make('p','',signal.summary));
    for(const id of signal.source_ids){
      const src=TECH_EVIDENCE.sources[id];
      if(!src)throw new Error('Missing source id '+id);
      box.append(href(make('a','evidence-source',tr('card.source')+': '+src.title+' ↗'),src.url));
    }
    const isExternal=signal.source_ids.some(id=>TECH_EVIDENCE.sources[id].type==='provider');
    box.append(make('div','source-type',tr(isExternal?'card.vendor':'card.partyclaim')));
    details.append(box);card.append(details);
  }
  return card;
}
function render(){
  if(!state.ready) return;
  const shown=filtered();
  count.textContent=tr('results.count').replace('{shown}',shown.length).replace('{total}',state.items.length);
  csv.disabled = shown.length===0;
  const fragment=document.createDocumentFragment();
  if(!shown.length){
    const card=make('div','empty');
    card.append(make('h3','',tr('results.empty')));
    card.append(make('p','',tr('results.emptydesc')));
    fragment.append(card);
  } else {
    for(const party of shown) fragment.append(renderCard(party));
  }
  results.replaceChildren(fragment);
}
function renderExtra(){
  const container=document.getElementById('extra-cases');
  container.replaceChildren();
  for(const extra of TECH_EVIDENCE.outside_atlas){
    const card=make('article','extra-card');
    card.append(make('h3','',extra.name));
    card.append(make('div','subheading',extra.country));
    card.append(make('p','',extra.note));
    const src=TECH_EVIDENCE.sources[extra.source_id];
    card.append(href(make('a','',tr('extra.source')+': '+src.publisher+' ↗'),src.url));
    container.append(card);
  }
}
function setLanguage(code){
  if(!LANGUAGE_CODES.includes(code))return;
  state.lang=code;
  document.documentElement.lang=code==='al'?'sq':code;
  for(const el of document.querySelectorAll('[data-t]')) el.textContent=tr(el.dataset.t);
  search.placeholder=tr('search.placeholder');
  for(const el of langs){
    const active=el.dataset.lang===code;el.classList.toggle('current',active);el.setAttribute('aria-pressed',String(active));
  }
  renderSelectors();renderExtra();render();
}
function protectCsvCell(value){
  let s=String(value??'').replace(/\r/g,' ').replace(/\n/g,' ');
  if (/^[\s]*[=+@-]/.test(s)) s="'"+s;
  return '"'+s.replace(/"/g,'""')+'"';
}
function exportCsv(){
  if(!state.ready)return;
  const rows=[['party','country','region','atlas_block','research_status','dimension','technical_note_mk','public_sources']];
  for(const item of filtered()){
    const signals=item.signals.length?item.signals:[null];
    for(const signal of signals)rows.push([item.name,item.country,item.region,item.block,signal?'public_documented':'not_researched',signal?.dimension||'',signal?.summary||'',signal?.source_ids.map(id=>TECH_EVIDENCE.sources[id].url).join(' | ')||'']);
  }
  const csvText='\uFEFF'+rows.map(row=>row.map(protectCsvCell).join(',')).join('\r\n');
  const file=new Blob([csvText],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(file);
  const anchor=document.createElement('a');
  anchor.href=url;anchor.download='MKS_Party_Tech_Research_2026-11-15.csv';
  document.body.append(anchor);anchor.click();anchor.remove();
  // Revoke only after the synchronous download has been requested, not before it.
  setTimeout(()=>URL.revokeObjectURL(url),3000);
}
for(const button of langs)button.addEventListener('click',()=>setLanguage(button.dataset.lang));
search.addEventListener('input',()=>{state.query=normalized(search.value);render();});
region.addEventListener('change',()=>{state.region=region.value;render();});
dimension.addEventListener('change',()=>{state.dimension=dimension.value;render();});
evidence.addEventListener('change',()=>{state.evidence=evidence.value;render();});
document.getElementById('reset').addEventListener('click',()=>{
  state.query='';state.region='all';state.dimension='all';state.evidence='all';
  search.value='';renderSelectors();render();search.focus();
});
csv.addEventListener('click',exportCsv);
setLanguage(state.lang);
(async()=>{
  try{
    // One same-origin request for existing public atlas HTML only. No external APIs, personal data or tracking.
    const response=await fetch('../../index.html',{credentials:'omit',redirect:'error',cache:'no-store'});
    if(!response.ok)throw new Error('Original atlas returned HTTP '+response.status);
    state.items=fromOriginal(await response.text());
    document.getElementById('count-atlas').textContent=String(state.items.length);
    document.getElementById('count-researched').textContent=String(state.items.filter(x=>x.signals.length).length);
    document.getElementById('count-signals').textContent=String(state.items.reduce((n,x)=>n+x.signals.length,0));
    document.getElementById('count-sources').textContent=String(Object.keys(TECH_EVIDENCE.sources).length);
    state.ready=true;render();
  }catch(error){
    const card=make('div','fallback');
    card.append(make('h3','',tr('results.error')));
    const link=make('a','',tr('fallback.link'));link.href='../../index.html#world-parties';card.append(link);
    results.replaceChildren(card);count.textContent=tr('results.error');
    console.warn('MKS party-tech source unavailable; preserved link to original atlas:',error.message);
  }
})();
