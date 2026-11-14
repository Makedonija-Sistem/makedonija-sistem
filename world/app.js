/* SYSTEM Navigator v0.1: deterministic, opt-in information routing; no profiling or collection. */
(() => {
  'use strict';

  // These are the only permitted destinations. All are existing sections of the public draft.
  const ROUTES = Object.freeze({
    institutions: '#principles',
    economy: '#industrial-champions',
    education: '#programme',
    health: '#wellbeing',
    diaspora: '#diaspora-hub',
    local: '#municipalities'
  });

  const TEXT = Object.freeze({
    mk: {
      skip:'Прескокни кон содржината',
      draft:'ЈАВЕН НАЦРТ · НЕ Е РЕГИСТРИРАНА ПОЛИТИЧКА ПАРТИЈА · НЕМА АКТИВНО ЗАЧЛЕНУВАЊЕ',
      'brand.sub':'Информативен светски простор',
      'nav.topics':'Области','nav.how':'Како работи','nav.participation':'Учество',
      'hero.kicker':'СИСТЕМ НАВИГАТОР · 01',
      'hero.title':'Идеите стануваат појасни кога можеме да ги истражиме.',
      'hero.intro':'Едно место за преглед на програмските концепти, јавните прашања и можностите за информиран разговор. Избери тема и отвори го изворниот нацрт — без профилирање и без регистрација.',
      'hero.explore':'Разгледај ги областите','hero.source':'Отвори го јавниот нацрт',
      'hero.note':'Нема следење, скриено рангирање или автоматско зачленување. Секој избор е твој.',
      'trust.one':'Јавен извор','trust.two':'Твој избор','trust.three':'Без лични податоци','trust.four':'Проверлива содржина',
      'topics.kicker':'01 / ИНФОРМАТИВЕН ИЗБОР','topics.title':'Која област те интересира?',
      'topics.intro':'Изборот само го покажува соодветниот дел од постојниот јавен нацрт. Ништо не се испраќа и не се зачувува.',
      'topic.institutions':'Институции и право','topic.economy':'Економија и работа',
      'topic.education':'Образование и развој','topic.health':'Здравје и благосостојба',
      'topic.diaspora':'Дијаспора и поврзаност','topic.local':'Општини и локален развој',
      'desc.institutions':'Прегледај ги принципите и институционалните концепти во јавниот нацрт. Текстот е предлог за разгледување, а не усвоена политика.',
      'desc.economy':'Отвори го делот за индустриски и економски концепти. Проектните идеи не се претставуваат како реализирани инвестиции или гарантирани работни места.',
      'desc.education':'Разгледај ја општата програмска рамка и прашањата поврзани со развојот. Конкретните мерки остануваат предмет на проверка.',
      'desc.health':'Прегледај ги информативните концепти за благосостојба. Страницата не обезбедува медицински услуги или официјални програми.',
      'desc.diaspora':'Отвори го делот за дијаспора во јавниот нацрт. Нема активна дигитална регистрација, проверка на идентитет или формално членство.',
      'desc.local':'Прегледај ги општинските и локалните концепти. Информациите се дел од програмски нацрт, не од официјален регистар.',
      'result.kicker':'ИЗБРАНА ОБЛАСТ · ПРОВЕРЛИВ ИЗВОР',
      'result.open':'Прочитај го делот во јавниот нацрт','result.close':'Затвори го изборот',
      'how.kicker':'02 / КАКО ФУНКЦИОНИРА','how.title':'Три едноставни чекори.',
      'how.one.title':'Избери тема','how.one.body':'Не бараме име, адреса, потекло или политичко определување.',
      'how.two.title':'Прочитај го изворот','how.two.body':'Секој избор води до конкретна секција од постојниот програмски нацрт.',
      'how.three.title':'Одлучи самостојно','how.three.body':'Разгледувањето е слободно. Нема скриени оценки, маркетинг профили или обврски.',
      'participation.kicker':'03 / ЈАВЕН СТАТУС','participation.title':'Учеството започнува со јасни правила.',
      'participation.body':'Платформата е во развој. Формално зачленување, верификација на идентитет, гласање и уплати не се активни. За такви услуги претходно се потребни соодветна правна основа, заштита на податоци и посебно човечко одобрение.',
      'participation.note':'Оваа страница не прима пријави и не собира лични или чувствителни податоци.',
      'participation.next':'Можеш да прочиташ повеќе и да ги провериш информациите во јавниот нацрт.',
      'participation.link':'Оди на главниот портал',
      'footer.status':'Независен програмски концепт · јавен нацрт · без активни услуги.',
      'footer.privacy':'Приватност','footer.terms':'Услови','footer.portal':'Главен портал',
      'page.title':'СИСТЕМ Навигатор · Информативен светски простор',
      'brand.aria':'МАКЕДОНИЈА — СИСТЕМ, почетна страна',
      'nav.aria':'Главна навигација','trust.aria':'Принципи на употреба'
    },
    en: {
      skip:'Skip to content',
      draft:'PUBLIC DRAFT · NOT A REGISTERED POLITICAL PARTY · NO ACTIVE MEMBERSHIP',
      'brand.sub':'Worldwide information space',
      'nav.topics':'Topics','nav.how':'How it works','nav.participation':'Participation',
      'hero.kicker':'SYSTEM NAVIGATOR · 01',
      'hero.title':'Ideas become clearer when we can explore them.',
      'hero.intro':'Explore programme concepts, public questions and opportunities for informed discussion. Choose a topic and read the original draft — without profiling or registration.',
      'hero.explore':'Explore the topics','hero.source':'Open the public draft',
      'hero.note':'No tracking, hidden ranking or automatic membership. Every choice is yours.',
      'trust.one':'Public source','trust.two':'Your choice','trust.three':'No personal data','trust.four':'Verifiable content',
      'topics.kicker':'01 / INFORMATION CHOICES','topics.title':'Which topic interests you?',
      'topics.intro':'Your choice simply points to the relevant section of the existing public draft. Nothing is sent or stored.',
      'topic.institutions':'Institutions and law','topic.economy':'Economy and work',
      'topic.education':'Education and development','topic.health':'Health and wellbeing',
      'topic.diaspora':'Diaspora and connections','topic.local':'Municipalities and local development',
      'desc.institutions':'Read the principles and institutional ideas in the public draft. These are proposals for discussion, not adopted policies.',
      'desc.economy':'Open the section on industrial and economic concepts. Project ideas are not presented as completed investments or guaranteed jobs.',
      'desc.education':'Explore the general programme and development questions. Specific measures still require verification.',
      'desc.health':'Read informational concepts about wellbeing. This site provides neither healthcare services nor official programmes.',
      'desc.diaspora':'Open the diaspora section of the public draft. No digital registration, identity verification or formal membership is active.',
      'desc.local':'Explore municipal and local concepts. This material is a programme draft, not an official register.',
      'result.kicker':'SELECTED TOPIC · CHECKABLE SOURCE',
      'result.open':'Read this section in the public draft','result.close':'Close selection',
      'how.kicker':'02 / HOW IT WORKS','how.title':'Three simple steps.',
      'how.one.title':'Choose a topic','how.one.body':'We do not ask for a name, address, ancestry or political views.',
      'how.two.title':'Read the source','how.two.body':'Every choice leads to a specific section in the existing programme draft.',
      'how.three.title':'Decide independently','how.three.body':'Browsing is open. There are no hidden scores, marketing profiles or obligations.',
      'participation.kicker':'03 / PUBLIC STATUS','participation.title':'Participation starts with clear rules.',
      'participation.body':'This platform is under development. Formal membership, identity verification, voting and payments are not active. Such services would first require an appropriate legal basis, data protection and separate human approval.',
      'participation.note':'This page does not accept applications or collect personal or sensitive data.',
      'participation.next':'You can learn more and check the information in the public draft.',
      'participation.link':'Visit the main portal',
      'footer.status':'Independent programme concept · public draft · no active services.',
      'footer.privacy':'Privacy','footer.terms':'Terms','footer.portal':'Main portal',
      'page.title':'SYSTEM Navigator · Worldwide information space',
      'brand.aria':'MACEDONIA — SYSTEM, home page',
      'nav.aria':'Main navigation','trust.aria':'Principles of use'
    },
    al: {
      skip:'Kalo te përmbajtja',
      draft:'DRAFT PUBLIK · JO PARTI POLITIKE E REGJISTRUAR · PA ANËTARËSIM AKTIV',
      'brand.sub':'Hapësirë informative botërore',
      'nav.topics':'Fushat','nav.how':'Si funksionon','nav.participation':'Pjesëmarrja',
      'hero.kicker':'NAVIGATORI SISTEM · 01',
      'hero.title':'Idetë bëhen më të qarta kur mund t’i shqyrtojmë.',
      'hero.intro':'Një hapësirë për të shqyrtuar koncepte programore, çështje publike dhe mundësi për diskutim të informuar. Zgjidh një temë dhe lexo draftin origjinal — pa profilizim dhe pa regjistrim.',
      'hero.explore':'Shiko fushat','hero.source':'Hap draftin publik',
      'hero.note':'Pa gjurmim, renditje të fshehtë apo anëtarësim automatik. Çdo zgjedhje është e jotja.',
      'trust.one':'Burim publik','trust.two':'Zgjedhja jote','trust.three':'Pa të dhëna personale','trust.four':'Përmbajtje e verifikueshme',
      'topics.kicker':'01 / ZGJEDHJE INFORMATIVE','topics.title':'Cila fushë të intereson?',
      'topics.intro':'Zgjedhja të çon vetëm te pjesa përkatëse e draftit publik. Asgjë nuk dërgohet ose ruhet.',
      'topic.institutions':'Institucionet dhe ligji','topic.economy':'Ekonomia dhe puna',
      'topic.education':'Arsimi dhe zhvillimi','topic.health':'Shëndeti dhe mirëqenia',
      'topic.diaspora':'Diaspora dhe lidhjet','topic.local':'Komunat dhe zhvillimi lokal',
      'desc.institutions':'Lexo parimet dhe konceptet institucionale në draftin publik. Këto janë propozime për diskutim, jo politika të miratuara.',
      'desc.economy':'Hap pjesën për konceptet industriale dhe ekonomike. Idetë nuk paraqiten si investime të realizuara ose vende pune të garantuara.',
      'desc.education':'Shqyrto kornizën e përgjithshme programore dhe pyetjet për zhvillimin. Masat konkrete kërkojnë verifikim.',
      'desc.health':'Lexo konceptet informative për mirëqenien. Faqja nuk ofron shërbime shëndetësore ose programe zyrtare.',
      'desc.diaspora':'Hap pjesën për diasporën në draftin publik. Regjistrimi digjital, verifikimi i identitetit dhe anëtarësimi formal nuk janë aktivë.',
      'desc.local':'Shqyrto konceptet komunale dhe lokale. Informacioni është pjesë e draftit programor, jo e një regjistri zyrtar.',
      'result.kicker':'FUSHA E ZGJEDHUR · BURIM I VERIFIKUESHËM',
      'result.open':'Lexo këtë pjesë në draftin publik','result.close':'Mbylle zgjedhjen',
      'how.kicker':'02 / SI FUNKSIONON','how.title':'Tre hapa të thjeshtë.',
      'how.one.title':'Zgjidh një temë','how.one.body':'Nuk kërkojmë emër, adresë, prejardhje apo bindje politike.',
      'how.two.title':'Lexo burimin','how.two.body':'Çdo zgjedhje çon te një pjesë konkrete e draftit ekzistues.',
      'how.three.title':'Vendos vetë','how.three.body':'Shfletimi është i lirë. Nuk ka vlerësime të fshehta, profile marketingu apo detyrime.',
      'participation.kicker':'03 / STATUSI PUBLIK','participation.title':'Pjesëmarrja fillon me rregulla të qarta.',
      'participation.body':'Platforma është në zhvillim. Anëtarësimi formal, verifikimi i identitetit, votimi dhe pagesat nuk janë aktive. Shërbime të tilla do të kërkonin më parë bazë ligjore, mbrojtje të të dhënave dhe miratim të veçantë njerëzor.',
      'participation.note':'Kjo faqe nuk pranon aplikime dhe nuk mbledh të dhëna personale apo të ndjeshme.',
      'participation.next':'Mund të lexosh më shumë dhe t’i kontrollosh informacionet në draftin publik.',
      'participation.link':'Shko te portali kryesor',
      'footer.status':'Koncept programor i pavarur · draft publik · pa shërbime aktive.',
      'footer.privacy':'Privatësia','footer.terms':'Kushtet','footer.portal':'Portali kryesor',
      'page.title':'Navigatori SISTEM · Hapësirë informative botërore',
      'brand.aria':'MAQEDONIA — SISTEM, faqja kryesore',
      'nav.aria':'Navigimi kryesor','trust.aria':'Parimet e përdorimit'
    },
    sr: {
      skip:'Пређи на садржај',
      draft:'ЈАВНИ НАЦРТ · НИЈЕ РЕГИСТРОВАНА ПОЛИТИЧКА СТРАНКА · НЕМА АКТИВНОГ УЧЛАЊЕЊА',
      'brand.sub':'Светски информативни простор',
      'nav.topics':'Области','nav.how':'Како функционише','nav.participation':'Учешће',
      'hero.kicker':'СИСТЕМ НАВИГАТОР · 01',
      'hero.title':'Идеје постају јасније када можемо да их истражимо.',
      'hero.intro':'Место за преглед програмских концепата, јавних питања и могућности за информисан разговор. Изабери тему и прочитај изворни нацрт — без профилисања и регистрације.',
      'hero.explore':'Истражи области','hero.source':'Отвори јавни нацрт',
      'hero.note':'Нема праћења, скривеног рангирања или аутоматског учлањења. Сваки избор је твој.',
      'trust.one':'Јавни извор','trust.two':'Твој избор','trust.three':'Без личних података','trust.four':'Проверљив садржај',
      'topics.kicker':'01 / ИНФОРМАТИВНИ ИЗБОР','topics.title':'Која област те занима?',
      'topics.intro':'Избор само показује одговарајући део постојећег јавног нацрта. Ништа се не шаље нити чува.',
      'topic.institutions':'Институције и право','topic.economy':'Економија и рад',
      'topic.education':'Образовање и развој','topic.health':'Здравље и благостање',
      'topic.diaspora':'Дијаспора и повезаност','topic.local':'Општине и локални развој',
      'desc.institutions':'Прегледај принципе и институционалне концепте у јавном нацрту. То су предлози за разговор, а не усвојене политике.',
      'desc.economy':'Отвори одељак о индустријским и економским концептима. Идеје нису представљене као реализоване инвестиције или загарантовани послови.',
      'desc.education':'Размотри општи програмски оквир и питања развоја. Конкретне мере захтевају проверу.',
      'desc.health':'Прочитај информативне концепте о благостању. Страница не пружа медицинске услуге или званичне програме.',
      'desc.diaspora':'Отвори део о дијаспори у јавном нацрту. Дигитална регистрација, провера идентитета и формално чланство нису активни.',
      'desc.local':'Прегледај општинске и локалне концепте. Информације су део програмског нацрта, не званичног регистра.',
      'result.kicker':'ИЗАБРАНА ОБЛАСТ · ПРОВЕРЉИВ ИЗВОР',
      'result.open':'Прочитај део у јавном нацрту','result.close':'Затвори избор',
      'how.kicker':'02 / КАКО ФУНКЦИОНИШЕ','how.title':'Три једноставна корака.',
      'how.one.title':'Изабери тему','how.one.body':'Не тражимо име, адресу, порекло или политичка уверења.',
      'how.two.title':'Прочитај извор','how.two.body':'Сваки избор води до конкретног дела постојећег програмског нацрта.',
      'how.three.title':'Одлучи самостално','how.three.body':'Разгледање је слободно. Нема скривених оцена, маркетиншких профила или обавеза.',
      'participation.kicker':'03 / ЈАВНИ СТАТУС','participation.title':'Учешће почиње јасним правилима.',
      'participation.body':'Платформа је у развоју. Формално учлањење, провера идентитета, гласање и плаћања нису активни. За такве услуге претходно су потребни одговарајући правни основ, заштита података и посебно људско одобрење.',
      'participation.note':'Ова страница не прима пријаве и не прикупља личне или осетљиве податке.',
      'participation.next':'Можеш да сазнаш више и провериш информације у јавном нацрту.',
      'participation.link':'Иди на главни портал',
      'footer.status':'Независан програмски концепт · јавни нацрт · без активних услуга.',
      'footer.privacy':'Приватност','footer.terms':'Услови','footer.portal':'Главни портал',
      'page.title':'СИСТЕМ Навигатор · Светски информативни простор',
      'brand.aria':'МАКЕДОНИЈА — СИСТЕМ, почетна страница',
      'nav.aria':'Главна навигација','trust.aria':'Принципи употребе'
    },
    de: {
      skip:'Zum Inhalt springen',
      draft:'ÖFFENTLICHER ENTWURF · KEINE EINGETRAGENE POLITISCHE PARTEI · KEINE AKTIVE MITGLIEDSCHAFT',
      'brand.sub':'Weltweiter Informationsraum',
      'nav.topics':'Themen','nav.how':'So funktioniert es','nav.participation':'Beteiligung',
      'hero.kicker':'SYSTEM NAVIGATOR · 01',
      'hero.title':'Ideen werden klarer, wenn wir sie selbst erkunden können.',
      'hero.intro':'Hier lassen sich programmatische Konzepte, öffentliche Fragen und Möglichkeiten zum informierten Austausch erkunden. Wähle ein Thema und lies den ursprünglichen Entwurf — ohne Profilbildung oder Registrierung.',
      'hero.explore':'Themen erkunden','hero.source':'Öffentlichen Entwurf öffnen',
      'hero.note':'Kein Tracking, kein verborgenes Ranking, keine automatische Mitgliedschaft. Du entscheidest selbst.',
      'trust.one':'Öffentliche Quelle','trust.two':'Deine Wahl','trust.three':'Keine persönlichen Daten','trust.four':'Überprüfbare Inhalte',
      'topics.kicker':'01 / INFORMATIONSWEGE','topics.title':'Welches Thema interessiert dich?',
      'topics.intro':'Deine Auswahl führt lediglich zum passenden Abschnitt des bestehenden Entwurfs. Nichts wird gesendet oder gespeichert.',
      'topic.institutions':'Institutionen und Recht','topic.economy':'Wirtschaft und Arbeit',
      'topic.education':'Bildung und Entwicklung','topic.health':'Gesundheit und Wohlbefinden',
      'topic.diaspora':'Diaspora und Vernetzung','topic.local':'Gemeinden und lokale Entwicklung',
      'desc.institutions':'Lies die Grundsätze und institutionellen Konzepte im öffentlichen Entwurf. Es handelt sich um Vorschläge zur Diskussion, nicht um beschlossene Politik.',
      'desc.economy':'Öffne den Abschnitt über Industrie und Wirtschaft. Ideen werden nicht als verwirklichte Investitionen oder garantierte Arbeitsplätze dargestellt.',
      'desc.education':'Erkunde den allgemeinen programmatischen Rahmen und Entwicklungsfragen. Konkrete Maßnahmen müssen noch überprüft werden.',
      'desc.health':'Lies die Informationskonzepte zum Wohlbefinden. Diese Seite bietet weder medizinische Leistungen noch amtliche Programme.',
      'desc.diaspora':'Öffne den Diaspora-Abschnitt des Entwurfs. Digitale Registrierung, Identitätsprüfung und formale Mitgliedschaft sind nicht aktiv.',
      'desc.local':'Erkunde kommunale und lokale Konzepte. Die Angaben sind Teil eines Programmentwurfs, nicht eines amtlichen Registers.',
      'result.kicker':'AUSGEWÄHLTES THEMA · PRÜFBARE QUELLE',
      'result.open':'Abschnitt im öffentlichen Entwurf lesen','result.close':'Auswahl schließen',
      'how.kicker':'02 / SO FUNKTIONIERT ES','how.title':'Drei einfache Schritte.',
      'how.one.title':'Thema auswählen','how.one.body':'Wir fragen weder nach Namen, Anschrift, Herkunft noch politischen Ansichten.',
      'how.two.title':'Quelle lesen','how.two.body':'Jede Auswahl führt zu einem bestimmten Abschnitt des bestehenden Entwurfs.',
      'how.three.title':'Selbst entscheiden','how.three.body':'Das Lesen ist frei. Keine versteckten Bewertungen, Marketingprofile oder Verpflichtungen.',
      'participation.kicker':'03 / ÖFFENTLICHER STATUS','participation.title':'Beteiligung braucht klare Regeln.',
      'participation.body':'Die Plattform befindet sich in Entwicklung. Formale Mitgliedschaft, Identitätsprüfung, Abstimmungen und Zahlungen sind nicht aktiv. Dafür wären zunächst eine geeignete Rechtsgrundlage, Datenschutz und eine gesonderte menschliche Freigabe erforderlich.',
      'participation.note':'Diese Seite nimmt keine Anträge entgegen und sammelt keine persönlichen oder sensiblen Daten.',
      'participation.next':'Weitere Informationen und den Originalwortlaut findest du im öffentlichen Entwurf.',
      'participation.link':'Zum Hauptportal',
      'footer.status':'Unabhängiger Programmentwurf · öffentliche Vorabfassung · keine aktiven Dienste.',
      'footer.privacy':'Datenschutz','footer.terms':'Nutzungsbedingungen','footer.portal':'Hauptportal',
      'page.title':'SYSTEM Navigator · Weltweiter Informationsraum',
      'brand.aria':'MAZEDONIEN — SYSTEM, Startseite',
      'nav.aria':'Hauptnavigation','trust.aria':'Grundsätze der Nutzung'
    }
  });

  const keys = Object.keys(TEXT.mk);
  for (const [locale, values] of Object.entries(TEXT)) {
    if (keys.some(key => !Object.hasOwn(values, key)) || Object.keys(values).length !== keys.length) {
      throw new Error('Incomplete navigator locale: ' + locale);
    }
  }

  const buttons = [...document.querySelectorAll('.lang[data-lang]')];
  const cards = [...document.querySelectorAll('.topic-card[data-topic]')];
  const selection = document.getElementById('selection');
  const selectionTitle = document.getElementById('selection-title');
  const selectionDesc = document.getElementById('selection-desc');
  const selectionLink = document.getElementById('selection-link');
  const selectionClose = document.getElementById('selection-close');
  let activeTopic = null;
  const initialParam = new URLSearchParams(window.location.search).get('lang');
  let activeLanguage = Object.hasOwn(TEXT, initialParam || '') ? initialParam : 'mk';

  function renderSelection() {
    if (!activeTopic) return;
    const lang = TEXT[activeLanguage];
    selectionTitle.textContent = lang['topic.' + activeTopic];
    selectionDesc.textContent = lang['desc.' + activeTopic];
    selectionLink.href = '../index.html' + ROUTES[activeTopic];
  }

  function setLanguage(locale) {
    if (!Object.hasOwn(TEXT, locale)) return;
    activeLanguage = locale;
    const messages = TEXT[locale];
    document.documentElement.lang = locale === 'al' ? 'sq' : locale;
    document.title = messages['page.title'];
    document.querySelectorAll('[data-t]').forEach(element => {
      const key = element.getAttribute('data-t');
      if (Object.hasOwn(messages, key)) element.textContent = messages[key];
    });
    document.querySelector('.brand').setAttribute('aria-label', messages['brand.aria']);
    document.querySelector('.header-links').setAttribute('aria-label', messages['nav.aria']);
    document.querySelector('.trust-strip').setAttribute('aria-label', messages['trust.aria']);
    for (const button of buttons) {
      const selected = button.dataset.lang === locale;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    }
    renderSelection();
  }

  function showTopic(topic) {
    if (!Object.hasOwn(ROUTES, topic)) return;
    activeTopic = topic;
    for (const card of cards) card.classList.toggle('selected', card.dataset.topic === topic);
    selection.hidden = false;
    renderSelection();
    selectionTitle.setAttribute('tabindex', '-1');
    selectionTitle.focus({preventScroll:true});
    selection.scrollIntoView({behavior:'smooth',block:'nearest'});
  }

  for (const button of buttons) {
    button.addEventListener('click', () => setLanguage(button.dataset.lang));
  }

  for (const card of cards) {
    card.addEventListener('click', event => {
      if (!Object.hasOwn(ROUTES, card.dataset.topic)) return;
      event.preventDefault();
      showTopic(card.dataset.topic);
    });
  }
  selectionClose.addEventListener('click', () => {
    selection.hidden = true;
    for (const card of cards) card.classList.remove('selected');
    const former = cards.find(card => card.dataset.topic === activeTopic);
    activeTopic = null;
    if (former) former.focus({preventScroll:true});
  });
  setLanguage(activeLanguage);
})();
