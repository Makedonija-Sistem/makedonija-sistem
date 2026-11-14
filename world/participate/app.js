'use strict';
const TRANSLATIONS = [
  [
    "skip",
    "Прескокни кон содржината",
    "Skip to content",
    "Kalo te përmbajtja",
    "Пређи на садржај",
    "Zum Inhalt springen"
  ],
  [
    "status",
    "РАЗВОЈНА ВЕРЗИЈА · БЕЗ ПОДНЕСУВАЊЕ · БЕЗ ЗАЧЛЕНУВАЊЕ · БЕЗ СОБИРАЊЕ ПОДАТОЦИ",
    "DEVELOPMENT VERSION · NO SUBMISSIONS · NO MEMBERSHIP · NO DATA COLLECTION",
    "VERSION NË ZHVILLIM · PA APLIKIME · PA ANËTARËSIM · PA MBLEDHJE TË DHËNASH",
    "РАЗВОЈНА ВЕРЗИЈА · НЕМА ПРИЈАВА · НЕМА ЧЛАНСТВА · НЕМА ПРИКУПЉАЊА ПОДАТАКА",
    "ENTWICKLUNGSVERSION · KEINE ANTRÄGE · KEINE MITGLIEDSCHAFT · KEINE DATENERHEBUNG"
  ],
  [
    "brand.sub",
    "Центар за доброволно учество",
    "Voluntary participation centre",
    "Qendra për pjesëmarrje vullnetare",
    "Центар за добровољно учешће",
    "Zentrum für freiwillige Beteiligung"
  ],
  [
    "nav.paths",
    "Можности",
    "Options",
    "Mundësitë",
    "Могућности",
    "Möglichkeiten"
  ],
  [
    "nav.rights",
    "Мои права",
    "My rights",
    "Të drejtat e mia",
    "Моја права",
    "Meine Rechte"
  ],
  [
    "nav.gate",
    "Human Gate",
    "Human Gate",
    "Kontrolli njerëzor",
    "Људска контрола",
    "Menschliche Freigabe"
  ],
  [
    "hero.overline",
    "ПАРТИЦИПАЦИЈА СО ПРАВА · v0.1",
    "PARTICIPATION WITH RIGHTS · v0.1",
    "PJESËMARRJE ME TË DREJTA · v0.1",
    "УЧЕШЋЕ УЗ ПРАВА · v0.1",
    "BETEILIGUNG MIT RECHTEN · v0.1"
  ],
  [
    "hero.title",
    "Учеството е твоја одлука. Контролата останува кај тебе.",
    "Participation is your choice. You stay in control.",
    "Pjesëmarrja është zgjedhja jote. Ti mban kontrollin.",
    "Учешће је твој избор. Контрола остаје у твојим рукама.",
    "Beteiligung ist deine Entscheidung. Du behältst die Kontrolle."
  ],
  [
    "hero.body",
    "Дознај кои форми на учество се можни во иднина, кои права ги имаш и какви услови мора да се исполнат пред формално зачленување. Сега не примаме никакви пријави.",
    "Explore possible future forms of participation, your rights and the conditions required before formal membership. No applications are accepted now.",
    "Mëso për format e mundshme të pjesëmarrjes në të ardhmen, të drejtat e tua dhe kushtet për anëtarësim formal. Aktualisht nuk pranohen aplikime.",
    "Сазнај о могућим облицима будућег учешћа, својим правима и условима за формално чланство. Тренутно се не примају пријаве.",
    "Informiere dich über mögliche künftige Beteiligung, deine Rechte und die Voraussetzungen einer formalen Mitgliedschaft. Derzeit werden keine Anträge angenommen."
  ],
  [
    "hero.cta",
    "Разгледај ги можностите",
    "Explore options",
    "Shiko mundësitë",
    "Размотри могућности",
    "Möglichkeiten ansehen"
  ],
  [
    "pill.voluntary",
    "Доброволно",
    "Voluntary",
    "Vullnetare",
    "Добровољно",
    "Freiwillig"
  ],
  [
    "pill.transparent",
    "Транспарентно",
    "Transparent",
    "Transparente",
    "Транспарентно",
    "Transparent"
  ],
  [
    "pill.private",
    "Без собирање податоци",
    "No data collection",
    "Pa mbledhje të dhënash",
    "Без прикупљања података",
    "Keine Datenerhebung"
  ],
  [
    "pill.human",
    "Човечка одлука",
    "Human decision",
    "Vendim njerëzor",
    "Људска одлука",
    "Menschliche Entscheidung"
  ],
  [
    "paths.overline",
    "01 / ЛОКАЛЕН ИНФОРМАТИВЕН ИЗБОР",
    "01 / LOCAL INFORMATION CHOICE",
    "01 / ZGJEDHJE INFORMATIVE LOKALE",
    "01 / ЛОКАЛНИ ИНФОРМАТИВНИ ИЗБОР",
    "01 / LOKALE INFORMATIONSAUSWAHL"
  ],
  [
    "paths.title",
    "Избери што сакаш да дознаеш.",
    "Choose what you want to learn.",
    "Zgjidh çfarë dëshiron të mësosh.",
    "Изабери шта желиш да сазнаш.",
    "Wähle, worüber du mehr erfahren möchtest."
  ],
  [
    "paths.body",
    "Изборот останува само на овој екран. Не создаваме кориснички профил, досие, запис за интерес или политичко определување.",
    "Your choice stays on this screen. We create no profile, dossier, interest record or political-preference record.",
    "Zgjedhja mbetet vetëm në këtë ekran. Nuk krijojmë profil, dosje, regjistër interesi apo bindjeje politike.",
    "Избор остаје само на овом екрану. Не правимо профил, досије, запис о интересовању или политичком опредељењу.",
    "Deine Auswahl bleibt nur auf diesem Bildschirm. Es entstehen weder Profil noch Dossier noch Aufzeichnung von Interessen oder politischen Ansichten."
  ],
  [
    "choice.learn",
    "Да разгледам информации",
    "Explore information",
    "Të shoh informacione",
    "Да разгледам информације",
    "Informationen ansehen"
  ],
  [
    "choice.contribute",
    "Да се информирам за идно учество",
    "Learn about future participation",
    "Të mësoj për pjesëmarrje të ardhshme",
    "Да сазнам о будућем учешћу",
    "Über künftige Beteiligung informieren"
  ],
  [
    "choice.membership",
    "Да ги прочитам условите за идно членство",
    "Read future membership conditions",
    "Të lexoj kushtet për anëtarësim në të ardhmen",
    "Да прочитам услове за будуће чланство",
    "Voraussetzungen einer künftigen Mitgliedschaft lesen"
  ],
  [
    "result.label",
    "САМО ИНФОРМАЦИЈА · НЕ Е ПРИЈАВА",
    "INFORMATION ONLY · NOT AN APPLICATION",
    "VETËM INFORMACION · JO APLIKIM",
    "САМО ИНФОРМАЦИЈА · НИЈЕ ПРИЈАВА",
    "NUR INFORMATION · KEIN ANTRAG"
  ],
  [
    "result.reminder",
    "Ниту еден избор не е поднесен, сниман или испратен.",
    "No choice has been submitted, recorded or sent.",
    "Asnjë zgjedhje nuk është dorëzuar, regjistruar apo dërguar.",
    "Ниједан избор није поднет, снимљен нити послат.",
    "Keine Auswahl wurde eingereicht, gespeichert oder gesendet."
  ],
  [
    "result.clear",
    "Исчисти го изборот",
    "Clear selection",
    "Pastro zgjedhjen",
    "Обриши избор",
    "Auswahl löschen"
  ],
  [
    "paths.notehead",
    "Важно:",
    "Important:",
    "E rëndësishme:",
    "Важно:",
    "Wichtig:"
  ],
  [
    "paths.note",
    "Дигиталната изјава не е замена за законски пропишана постапка за зачленување или за потпис.",
    "An online declaration cannot replace legally prescribed membership procedures or signatures.",
    "Deklarata digjitale nuk zëvendëson procedurat apo nënshkrimet e kërkuara me ligj për anëtarësim.",
    "Онлајн изјава не замењује законом прописану процедуру учлањења или потпис.",
    "Eine Online-Erklärung ersetzt keine gesetzlich vorgeschriebenen Mitgliedschaftsverfahren oder Unterschriften."
  ],
  [
    "rights.overline",
    "02 / ПРАВА И КОНТРОЛА",
    "02 / RIGHTS AND CONTROL",
    "02 / TË DREJTAT DHE KONTROLLI",
    "02 / ПРАВА И КОНТРОЛА",
    "02 / RECHTE UND KONTROLLE"
  ],
  [
    "rights.title",
    "Знај ги своите права пред да споделиш податоци.",
    "Know your rights before sharing data.",
    "Njihi të drejtat para se të ndash të dhëna.",
    "Упознај своја права пре дељења података.",
    "Kenne deine Rechte, bevor du Daten teilst."
  ],
  [
    "rights.body",
    "Кога некоја организација законито обработува лични податоци, лицето располага со права што зависат од правниот основ и околностите. Во овој тестен модул не се обработуваат податоци за членство.",
    "When an organisation lawfully processes personal data, you have rights depending on the legal basis and circumstances. This test module does not process membership data.",
    "Kur një organizatë përpunon ligjërisht të dhëna personale, ke të drejta sipas bazës ligjore dhe rrethanave. Ky modul testues nuk përpunon të dhëna anëtarësimi.",
    "Када организација законито обрађује личне податке, имаш права у складу са правним основом и околностима. Овај тест модул не обрађује податке о чланству.",
    "Bei rechtmäßiger Verarbeitung personenbezogener Daten bestehen Rechte je nach Rechtsgrundlage und Umständen. Dieses Testmodul verarbeitet keine Mitgliedsdaten."
  ],
  [
    "right.info",
    "Информирање",
    "Information",
    "Informimi",
    "Информисање",
    "Information"
  ],
  [
    "right.info.desc",
    "Да знаеш кој, зошто и како обработува податоци.",
    "Know who processes data, why and how.",
    "Të dish kush, pse dhe si i përpunon të dhënat.",
    "Да знаш ко, зашто и како обрађује податке.",
    "Wissen, wer Daten warum und wie verarbeitet."
  ],
  [
    "right.access",
    "Пристап и исправка",
    "Access and correction",
    "Qasja dhe korrigjimi",
    "Приступ и исправка",
    "Auskunft und Berichtigung"
  ],
  [
    "right.access.desc",
    "Да побараш преглед и исправка на неточни податоци.",
    "Request access to and correction of inaccurate data.",
    "Të kërkosh qasje dhe korrigjim të të dhënave të pasakta.",
    "Да затражиш приступ и исправку нетачних података.",
    "Auskunft und Berichtigung unrichtiger Daten verlangen."
  ],
  [
    "right.delete",
    "Бришење и ограничување",
    "Erasure and restriction",
    "Fshirja dhe kufizimi",
    "Брисање и ограничење",
    "Löschung und Einschränkung"
  ],
  [
    "right.delete.desc",
    "Да побараш бришење или ограничување, кога се исполнети условите.",
    "Request erasure or restriction when legal conditions are met.",
    "Të kërkosh fshirje ose kufizim kur plotësohen kushtet ligjore.",
    "Да тражиш брисање или ограничење када су испуњени услови.",
    "Löschung oder Einschränkung unter den gesetzlichen Voraussetzungen beantragen."
  ],
  [
    "right.object",
    "Приговор и човечка проверка",
    "Objection and human review",
    "Kundërshtimi dhe shqyrtimi njerëzor",
    "Приговор и људска провера",
    "Widerspruch und menschliche Überprüfung"
  ],
  [
    "right.object.desc",
    "Да поднесеш приговор и да оспориш одредени автоматизирани одлуки.",
    "Object to processing and challenge certain automated decisions.",
    "Të kundërshtosh përpunimin dhe vendime të caktuara automatike.",
    "Да уложиш приговор и оспориш одређене аутоматизоване одлуке.",
    "Widerspruch einlegen und bestimmte automatisierte Entscheidungen anfechten."
  ],
  [
    "template.title",
    "Локален образец за барање",
    "Local request template",
    "Model lokal i kërkesës",
    "Локални образац захтева",
    "Lokale Anfragevorlage"
  ],
  [
    "template.body",
    "Избери право и добиј општ текст што можеш да го копираш. Не се бараат лични податоци и ништо не се испраќа. Ова не е официјално поднесено барање.",
    "Choose a right and generate general text you may copy. No personal data are requested or sent. This is not an officially filed request.",
    "Zgjidh një të drejtë dhe krijo tekst të përgjithshëm që mund ta kopjosh. Nuk kërkohen ose dërgohen të dhëna personale. Kjo nuk është kërkesë e dorëzuar zyrtarisht.",
    "Изабери право и добиј општи текст који можеш копирати. Не траже се и не шаљу лични подаци. Ово није званично поднет захтев.",
    "Wähle ein Recht und erstelle einen allgemeinen Text zum Kopieren. Es werden keine personenbezogenen Daten abgefragt oder gesendet. Dies ist kein offiziell eingereichter Antrag."
  ],
  [
    "template.label",
    "Избери право",
    "Choose a right",
    "Zgjidh një të drejtë",
    "Изабери право",
    "Recht auswählen"
  ],
  [
    "template.information",
    "Информација",
    "Information",
    "Informacion",
    "Информација",
    "Information"
  ],
  [
    "template.access",
    "Пристап",
    "Access",
    "Qasje",
    "Приступ",
    "Auskunft"
  ],
  [
    "template.correction",
    "Исправка",
    "Correction",
    "Korrigjim",
    "Исправка",
    "Berichtigung"
  ],
  [
    "template.deletion",
    "Бришење",
    "Erasure",
    "Fshirje",
    "Брисање",
    "Löschung"
  ],
  [
    "template.restriction",
    "Ограничување",
    "Restriction",
    "Kufizim",
    "Ограничење",
    "Einschränkung"
  ],
  [
    "template.objection",
    "Приговор",
    "Objection",
    "Kundërshtim",
    "Приговор",
    "Widerspruch"
  ],
  [
    "template.human",
    "Човечка проверка",
    "Human review",
    "Shqyrtim njerëzor",
    "Људска провера",
    "Menschliche Überprüfung"
  ],
  [
    "template.build",
    "Подготви текст",
    "Generate text",
    "Përgatit tekstin",
    "Припреми текст",
    "Text erstellen"
  ],
  [
    "template.preview",
    "ПРЕГЛЕД · НЕ Е ПОДНЕСЕНО",
    "PREVIEW · NOT SUBMITTED",
    "PAMJE · NUK ËSHTË DORËZUAR",
    "ПРЕГЛЕД · НИЈЕ ПОДНЕТО",
    "VORSCHAU · NICHT EINGEREICHT"
  ],
  [
    "template.empty",
    "Избери право и притисни „Подготви текст“.",
    "Choose a right and select “Generate text”.",
    "Zgjidh një të drejtë dhe shtyp “Përgatit tekstin”.",
    "Изабери право и притисни „Припреми текст“.",
    "Wähle ein Recht und klicke auf „Text erstellen“."
  ],
  [
    "template.copy",
    "Копирај го текстот",
    "Copy text",
    "Kopjo tekstin",
    "Копирај текст",
    "Text kopieren"
  ],
  [
    "rights.official",
    "Официјални информации за правата:",
    "Official information on rights:",
    "Informacion zyrtar për të drejtat:",
    "Званичне информације о правима:",
    "Offizielle Informationen über Rechte:"
  ],
  [
    "rights.source",
    "Агенција за заштита на личните податоци",
    "Personal Data Protection Agency",
    "Agjencia për Mbrojtjen e të Dhënave Personale",
    "Агенција за заштиту личних података",
    "Agentur für den Schutz personenbezogener Daten"
  ],
  [
    "gate.overline",
    "03 / ИНСТИТУЦИОНАЛНА КОНТРОЛА",
    "03 / INSTITUTIONAL CONTROL",
    "03 / KONTROLLI INSTITUCIONAL",
    "03 / ИНСТИТУЦИОНАЛНА КОНТРОЛА",
    "03 / INSTITUTIONELLE KONTROLLE"
  ],
  [
    "gate.title",
    "Не се активира со еден клик.",
    "Activation is never a one-click decision.",
    "Aktivizimi nuk bëhet me një klikim.",
    "Активирање није одлука једним кликом.",
    "Aktivierung ist keine Ein-Klick-Entscheidung."
  ],
  [
    "gate.body",
    "Вистинскиот систем за пријави ќе биде дозволен дури по одредување на правен контролор, проверка на правните основи, процена на ризици, технички тестови и експлицитна човечка одлука.",
    "Any real application service requires a verified controller, lawful basis, risk assessment, technical testing and explicit human approval first.",
    "Çdo shërbim real aplikimi kërkon kontrollues të verifikuar, bazë ligjore, vlerësim rreziku, teste teknike dhe miratim të shprehur njerëzor.",
    "Стварни пријавни сервиси захтевају утврђеног контролора, правни основ, процену ризика, техничке тестове и изричито људско одобрење.",
    "Ein echter Antragsdienst erfordert zunächst einen bestätigten Verantwortlichen, eine Rechtsgrundlage, Risikoprüfung, technische Tests und ausdrückliche menschliche Freigabe."
  ],
  [
    "gate.closed",
    "ПРИЈАВИ: БЛОКИРАНИ · HUMAN GATE: НЕОДОБРЕН",
    "APPLICATIONS: BLOCKED · HUMAN GATE: NOT APPROVED",
    "APLIKIMET: TË BLLOKUARA · MIRATIMI NJERËZOR: MUNGON",
    "ПРИЈАВЕ: БЛОКИРАНЕ · ЉУДСКО ОДОБРЕЊЕ: НИЈЕ ДАТО",
    "ANTRÄGE: GESPERRT · MENSCHLICHE FREIGABE: NICHT ERTEILT"
  ],
  [
    "gate.g1",
    "Правен статус и контролор",
    "Legal status and controller",
    "Statusi ligjor dhe kontrolluesi",
    "Правни статус и контролор",
    "Rechtsstatus und Verantwortlicher"
  ],
  [
    "gate.pending",
    "Потребна проверка",
    "Verification required",
    "Kërkohet verifikim",
    "Потребна провера",
    "Prüfung erforderlich"
  ],
  [
    "gate.g2",
    "Правен основ и посебни категории",
    "Lawful basis and sensitive data",
    "Baza ligjore dhe të dhënat e ndjeshme",
    "Правни основ и посебне категорије",
    "Rechtsgrundlage und besondere Datenkategorien"
  ],
  [
    "gate.g3",
    "Процена на влијанието и права",
    "Impact assessment and rights",
    "Vlerësimi i ndikimit dhe të drejtat",
    "Процена утицаја и права",
    "Folgenabschätzung und Rechte"
  ],
  [
    "gate.g4",
    "Безбеден сервер и рокови на чување",
    "Secure server and retention",
    "Serveri i sigurt dhe afatet e ruajtjes",
    "Безбедан сервер и рокови чувања",
    "Sicherer Server und Aufbewahrungsfristen"
  ],
  [
    "gate.g5",
    "Независно тестирање и човечко одобрение",
    "Independent tests and human approval",
    "Teste të pavarura dhe miratim njerëzor",
    "Независни тестови и људско одобрење",
    "Unabhängige Tests und menschliche Freigabe"
  ],
  [
    "control.overline",
    "04 / ТВОЈА КОНТРОЛА",
    "04 / YOUR CONTROL",
    "04 / KONTROLLI YT",
    "04 / ТВОЈА КОНТРОЛА",
    "04 / DEINE KONTROLLE"
  ],
  [
    "control.title",
    "Можеш да ги исчистиш изборите во секој момент.",
    "You can clear your choices at any time.",
    "Mund t’i pastrosh zgjedhjet në çdo kohë.",
    "Можеш обрисати изборе у сваком тренутку.",
    "Du kannst deine Auswahl jederzeit löschen."
  ],
  [
    "control.body",
    "Нема корисничка сметка, база на учесници, колачиња или зачувување во прелистувач. Копираниот текст е под твоја контрола. Чистењето ги отстранува изборите од овој екран, но не може да избрише текст што претходно сам си го копирал.",
    "No user accounts, participant database, cookies or browser storage. You control copied text. Reset clears choices from this screen but cannot delete text you already copied elsewhere.",
    "Nuk ka llogari, bazë të dhënash pjesëmarrësish, cookie apo ruajtje në shfletues. Ti kontrollon tekstin e kopjuar. Rivendosja pastron këtë ekran, por nuk fshin tekstin e kopjuar më parë.",
    "Нема налога, базе учесника, колачића ни чувања у прегледачу. Контролишеш копирани текст. Брисање чисти овај екран, али не и текст раније копиран на друго место.",
    "Keine Nutzerkonten, Teilnehmerdatenbank, Cookies oder Browserspeicherung. Du kontrollierst kopierte Texte. Zurücksetzen löscht die Auswahl auf diesem Bildschirm, aber keine bereits an anderer Stelle kopierten Texte."
  ],
  [
    "control.reset",
    "Исчисти ги локалните избори",
    "Clear local choices",
    "Pastro zgjedhjet lokale",
    "Обриши локалне изборе",
    "Lokale Auswahl löschen"
  ],
  [
    "control.note",
    "Без регистрација. Без следење. Без автоматска одлука за членство.",
    "No registration. No tracking. No automated membership decision.",
    "Pa regjistrim. Pa gjurmim. Pa vendim automatik për anëtarësim.",
    "Без регистрације. Без праћења. Без аутоматске одлуке о чланству.",
    "Keine Registrierung. Kein Tracking. Keine automatisierte Mitgliedschaftsentscheidung."
  ],
  [
    "footer.note",
    "Граѓански и програмски нацрт во развој. Не е регистрирана политичка партија.",
    "Civic and programme concept in development. Not a registered political party.",
    "Koncept qytetar dhe programor në zhvillim. Nuk është parti politike e regjistruar.",
    "Грађански и програмски концепт у развоју. Није регистрована политичка странка.",
    "Bürger- und Programmkonzept in Entwicklung. Keine eingetragene politische Partei."
  ],
  [
    "footer.world",
    "Светски навигатор",
    "World navigator",
    "Navigatori botëror",
    "Светски навигатор",
    "Welt-Navigator"
  ],
  [
    "footer.privacy",
    "Приватност",
    "Privacy",
    "Privatësia",
    "Приватност",
    "Datenschutz"
  ],
  [
    "footer.terms",
    "Услови",
    "Terms",
    "Kushtet",
    "Услови",
    "Bedingungen"
  ],
  [
    "info.learn.title",
    "Информирање без обврски",
    "Explore without obligation",
    "Informohu pa detyrime",
    "Информисање без обавеза",
    "Informieren ohne Verpflichtung"
  ],
  [
    "info.learn.desc",
    "Можеш да го разгледаш програмскиот нацрт и да провериш што е факт, а што предлог. Оваа страница не бара податоци.",
    "You may read the draft and distinguish documented facts from proposals. This page requests no data.",
    "Mund të lexosh draftin dhe të dallosh faktet nga propozimet. Kjo faqe nuk kërkon të dhëna.",
    "Можеш прочитати нацрт и разликовати чињенице од предлога. Страница не тражи податке.",
    "Du kannst den Entwurf lesen und belegte Fakten von Vorschlägen unterscheiden. Diese Seite fragt keine Daten ab."
  ],
  [
    "info.contribute.title",
    "Можности за идно доброволно учество",
    "Potential future voluntary participation",
    "Mundësi për pjesëmarrje vullnetare në të ardhmen",
    "Могућности будућег добровољног учешћа",
    "Mögliche künftige freiwillige Beteiligung"
  ],
  [
    "info.contribute.desc",
    "Пред какви било активности треба да бидат објавени правилата, улогите, одговорните лица и начинот на повлекување. Сега нема формулар за учество.",
    "Before any activity, the rules, roles, responsible people and withdrawal process must be published. No participation form is currently active.",
    "Përpara çdo aktiviteti duhen publikuar rregullat, rolet, përgjegjësit dhe mënyra e tërheqjes. Nuk ka formular aktiv.",
    "Пре било каквих активности морају бити објављена правила, улоге, одговорна лица и начин повлачења. Тренутно нема обрасца.",
    "Vor jeder Aktivität müssen Regeln, Rollen, Verantwortliche und Rückzugsmöglichkeiten veröffentlicht werden. Es gibt derzeit kein aktives Formular."
  ],
  [
    "info.membership.title",
    "Членство: само по законска и човечка проверка",
    "Membership: only after legal and human checks",
    "Anëtarësimi: vetëm pas kontrollit ligjor dhe njerëzor",
    "Чланство: тек после законске и људске провере",
    "Mitgliedschaft: erst nach rechtlicher und menschlicher Prüfung"
  ],
  [
    "info.membership.desc",
    "Овој избор не е барање за членство. Правниот статус, условите за подобност, потписите и обработката на чувствителни податоци мора независно да се проверат. До тогаш зачленувањето е блокирано.",
    "This choice is not a membership application. Legal status, eligibility, signatures and handling of sensitive data require independent checks. Membership stays blocked until then.",
    "Kjo zgjedhje nuk është aplikim për anëtarësim. Statusi ligjor, kushtet e pranimit, nënshkrimet dhe të dhënat e ndjeshme kërkojnë verifikim. Anëtarësimi mbetet i bllokuar.",
    "Овај избор није пријава за чланство. Правни статус, услови, потписи и обрада осетљивих података захтевају независну проверу. Чланство је до тада блокирано.",
    "Dies ist kein Mitgliedsantrag. Rechtsstatus, Voraussetzungen, Unterschriften und Umgang mit sensiblen Daten müssen unabhängig geprüft werden. Mitgliedschaft bleibt bis dahin gesperrt."
  ],
  [
    "template.request",
    "Почитувани,\nВе молам да ми доставите информации за постапката и условите за остварување на правото: {right}. Доколку обработувате мои лични податоци, Ве молам наведете го идентитетот на контролорот и безбеден канал за потврдување на идентитетот. Овој текст е само нацрт; не содржи лични податоци и не е поднесен.\nСо почит.",
    "Dear Sir or Madam,\nPlease provide information about the procedure and conditions for exercising my right to: {right}. If you process my personal data, please identify the controller and a secure channel for identity verification. This is a draft only; it contains no personal data and has not been submitted.\nKind regards.",
    "Të nderuar,\nJu lutem më informoni për procedurën dhe kushtet e ushtrimit të së drejtës: {right}. Nëse përpunoni të dhënat e mia, ju lutem identifikoni kontrolluesin dhe kanalin e sigurt për verifikim identiteti. Ky është vetëm draft, pa të dhëna personale dhe nuk është dërguar.\nMe respekt.",
    "Поштовани,\nМолим информације о поступку и условима остваривања права: {right}. Ако обрађујете моје личне податке, наведите контролора и сигуран канал за проверу идентитета. Ово је само нацрт, не садржи личне податке и није поднет.\nС поштовањем.",
    "Sehr geehrte Damen und Herren,\nbitte informieren Sie mich über das Verfahren und die Voraussetzungen zur Ausübung meines Rechts auf: {right}. Falls Sie personenbezogene Daten über mich verarbeiten, nennen Sie den Verantwortlichen und einen sicheren Weg zur Identitätsprüfung. Dies ist nur ein Entwurf ohne personenbezogene Angaben und wurde nicht eingereicht.\nMit freundlichen Grüßen"
  ],
  [
    "template.copyok",
    "Текстот е копиран. Ти одлучуваш дали и каде ќе го користиш.",
    "Text copied. You decide whether and where to use it.",
    "Teksti u kopjua. Ti vendos nëse dhe ku do ta përdorësh.",
    "Текст је копиран. Ти одлучујеш да ли ћеш га користити.",
    "Text kopiert. Du entscheidest über die weitere Verwendung."
  ],
  [
    "template.copyerror",
    "Копирањето не успеа. Можеш рачно да го означиш текстот.",
    "Copying failed. You can select the text manually.",
    "Kopjimi dështoi. Mund ta zgjedhësh tekstin manualisht.",
    "Копирање није успело. Можеш ручно означити текст.",
    "Kopieren fehlgeschlagen. Du kannst den Text manuell markieren."
  ],
  [
    "control.cleared",
    "Локалните избори се исчистени.",
    "Local choices cleared.",
    "Zgjedhjet lokale u pastruan.",
    "Локални избори су обрисани.",
    "Lokale Auswahl gelöscht."
  ],
  [
    "page.title",
    "Доброволно учество · МАКЕДОНИЈА — СИСТЕМ · тестен модул",
    "Voluntary participation · MACEDONIA — SYSTEM · test module",
    "Pjesëmarrje vullnetare · MAQEDONIA — SISTEM · modul testues",
    "Добровољно учешће · МАКЕДОНИЈА — СИСТЕМ · тест модул",
    "Freiwillige Beteiligung · MAZEDONIEN — SYSTEM · Testmodul"
  ],
  [
    "brand.aria",
    "МАКЕДОНИЈА — СИСТЕМ, врати се на светскиот навигатор",
    "MACEDONIA — SYSTEM, return to world navigator",
    "MAQEDONIA — SISTEM, kthehu te navigatori botëror",
    "МАКЕДОНИЈА — СИСТЕМ, назад на светски навигатор",
    "MAZEDONIEN — SYSTEM, zurück zum Welt-Navigator"
  ],
  [
    "nav.aria",
    "Главно мени",
    "Main navigation",
    "Navigimi kryesor",
    "Главни мени",
    "Hauptnavigation"
  ],
  [
    "choice.aria",
    "Информативни теми",
    "Information topics",
    "Tema informative",
    "Информативне теме",
    "Informationsthemen"
  ]
];

/* Participation review v0.1: no registration, no data collection or external processing. */
(() => {
  'use strict';
  const locales = ['mk','en','al','sr','de'];
  const dictionary = Object.fromEntries(locales.map(locale => [locale, Object.create(null)]));
  for (const row of TRANSLATIONS) {
    if (!Array.isArray(row) || row.length !== 6 || row.some(value => typeof value !== 'string' || !value.trim())) {
      throw new Error('Incomplete translation row');
    }
    for (let index = 0; index < locales.length; index++) {
      if (Object.hasOwn(dictionary[locales[index]], row[0])) {
        throw new Error('Duplicate localization key: ' + row[0]);
      }
      dictionary[locales[index]][row[0]] = row[index + 1];
    }
  }
  for (const element of document.querySelectorAll('[data-t]')) {
    const key = element.getAttribute('data-t');
    for (const lang of locales) {
      if (!Object.hasOwn(dictionary[lang], key)) throw new Error('Missing locale key: ' + lang + '/' + key);
    }
  }

  const languages = [...document.querySelectorAll('.language[data-lang]')];
  const choices = [...document.querySelectorAll('.choice[data-choice]')];
  const result = document.getElementById('choice-result');
  const resultTitle = document.getElementById('result-title');
  const resultDescription = document.getElementById('result-description');
  const rightsSelect = document.getElementById('right-type');
  const templateOutput = document.getElementById('template-output');
  const copyButton = document.getElementById('copy-template');
  const copyState = document.getElementById('copy-state');
  const resetState = document.getElementById('reset-state');
  const state = {language:'mk', topic:null, generated:false};
  const initialLocale = new URLSearchParams(window.location.search).get('lang');
  if (locales.includes(initialLocale)) state.language = initialLocale;

  function lookup(key) { return dictionary[state.language][key]; }
  function renderTopic() {
    if (state.topic === null) return;
    resultTitle.textContent = lookup('info.' + state.topic + '.title');
    resultDescription.textContent = lookup('info.' + state.topic + '.desc');
  }
  function renderTemplate() {
    if (!state.generated) {
      templateOutput.textContent = lookup('template.empty');
      copyButton.disabled = true;
      return;
    }
    const right = lookup('template.' + rightsSelect.value);
    templateOutput.textContent = lookup('template.request').replace('{right}', right);
    copyButton.disabled = false;
  }
  function setLocale(lang) {
    if (!locales.includes(lang)) return;
    state.language = lang;
    document.documentElement.lang = lang === 'al' ? 'sq' : lang;
    document.title = lookup('page.title');
    for (const element of document.querySelectorAll('[data-t]')) {
      element.textContent = lookup(element.getAttribute('data-t'));
    }
    document.getElementById('home-link').setAttribute('aria-label', lookup('brand.aria'));
    document.getElementById('primary-nav').setAttribute('aria-label', lookup('nav.aria'));
    document.getElementById('choice-group').setAttribute('aria-label', lookup('choice.aria'));
    for (const button of languages) {
      const selected = button.dataset.lang === lang;
      button.classList.toggle('current', selected);
      button.setAttribute('aria-pressed', selected ? 'true' : 'false');
    }
    renderTopic();
    renderTemplate();
    copyState.textContent = '';
    resetState.textContent = '';
  }
  for (const button of languages) {
    button.addEventListener('click', () => setLocale(button.dataset.lang));
  }
  for (const button of choices) {
    button.addEventListener('click', () => {
      const topic = button.dataset.choice;
      if (!['learn','contribute','membership'].includes(topic)) return;
      state.topic = topic;
      result.hidden = false;
      for (const choice of choices) {
        const selected = choice.dataset.choice === topic;
        choice.classList.toggle('selected', selected);
        choice.setAttribute('aria-pressed', selected ? 'true' : 'false');
      }
      renderTopic();
      resultTitle.setAttribute('tabindex','-1');
      resultTitle.focus({preventScroll:true});
    });
  }
  document.getElementById('clear-choice').addEventListener('click', () => {
    const selected = choices.find(button => button.dataset.choice === state.topic);
    state.topic = null;
    result.hidden = true;
    for (const button of choices) {
      button.classList.remove('selected');
      button.setAttribute('aria-pressed', 'false');
    }
    if (selected) selected.focus({preventScroll:true});
  });

  rightsSelect.addEventListener('change', () => {
    state.generated = false;
    renderTemplate();
    copyState.textContent = '';
  });
  document.getElementById('build-template').addEventListener('click', () => {
    state.generated = true;
    renderTemplate();
    copyState.textContent = '';
  });
  copyButton.addEventListener('click', async () => {
    if (!state.generated || !navigator.clipboard || !navigator.clipboard.writeText) {
      copyState.textContent = lookup('template.copyerror');
      return;
    }
    try {
      await navigator.clipboard.writeText(templateOutput.textContent);
      copyState.textContent = lookup('template.copyok');
    } catch (_) {
      copyState.textContent = lookup('template.copyerror');
    }
  });
  document.getElementById('reset-local').addEventListener('click', () => {
    state.topic = null;
    state.generated = false;
    rightsSelect.value = 'information';
    result.hidden = true;
    for (const button of choices) {
      button.classList.remove('selected');
      button.setAttribute('aria-pressed', 'false');
    }
    renderTemplate();
    copyState.textContent = '';
    resetState.textContent = lookup('control.cleared');
  });

  // State remains in this JS runtime only: no fetch, forms, cookies or browser storage.
  setLocale(state.language);
})();
