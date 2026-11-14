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
    "review",
    "ИНФОРМАТИВЕН ПРОТОТИП · БЕЗ ПРИЈАВИ · БЕЗ ОНЛАЈН НОТАРСКА ЗАВЕРКА",
    "INFORMATION PROTOTYPE · NO APPLICATIONS · NO ONLINE NOTARIZATION",
    "PROTOTIP INFORMATIV · PA APLIKIME · PA NOTERIZIM ONLINE",
    "ИНФОРМАТИВНИ ПРОТОТИП · НЕМА ПРИЈАВА · НЕМА ОНЛАЈН ОВЕРЕ",
    "INFORMATIONSPROTOTYP · KEINE ANTRÄGE · KEINE ONLINE-BEGLAUBIGUNG"
  ],
  [
    "brand.sub",
    "Дијаспора · правен пат",
    "Diaspora · legal pathway",
    "Diaspora · rruga ligjore",
    "Дијаспора · правни пут",
    "Diaspora · rechtlicher Weg"
  ],
  [
    "nav.steps",
    "Чекори",
    "Steps",
    "Hapat",
    "Кораци",
    "Schritte"
  ],
  [
    "nav.sources",
    "Официјални извори",
    "Official sources",
    "Burime zyrtare",
    "Званични извори",
    "Amtliche Quellen"
  ],
  [
    "nav.controls",
    "Контроли",
    "Safeguards",
    "Kontrollet",
    "Контроле",
    "Schutzmaßnahmen"
  ],
  [
    "hero.kicker",
    "ДИЈАСПОРА · ДИГИТАЛЕН ПРАВЕН ПАТ",
    "DIASPORA · DIGITAL LEGAL PATHWAY",
    "DIASPORA · RRUGA DIGJITALE LIGJORE",
    "ДИЈАСПОРА · ДИГИТАЛНИ ПРАВНИ ПУТ",
    "DIASPORA · DIGITALER RECHTSWEG"
  ],
  [
    "hero.title",
    "Од било каде во светот. Со јасна постапка и човечка проверка.",
    "From abroad. With a clear process and human review.",
    "Nga jashtë vendit. Me procedurë të qartë dhe kontroll njerëzor.",
    "Из иностранства. Уз јасан поступак и људску проверу.",
    "Aus dem Ausland. Mit klarem Verfahren und menschlicher Prüfung."
  ],
  [
    "hero.body",
    "Разгледај кои законски чекори треба да се потврдат за САД, Канада и Австралија. AI Адвокат помага со правни информации; видеоразговор не значи автоматска нотарска заверка или членство.",
    "Explore the legal steps that need verification for the USA, Canada and Australia. AI Advokat provides legal information; a video call is not automatically a notarization or membership.",
    "Shiko hapat ligjorë që duhet të verifikohen për SHBA-në, Kanadanë dhe Australinë. AI Advokat ofron informacion juridik; një video-thirrje nuk është automatikisht noterizim ose anëtarësim.",
    "Размотри законске кораке које треба проверити за САД, Канаду и Аустралију. AI Advokat пружа правне информације; видео-позив није аутоматски овера или чланство.",
    "Prüfe die rechtlichen Schritte für die USA, Kanada und Australien. AI Advokat bietet Rechtsinformationen; ein Videoanruf ist nicht automatisch eine notarielle Beglaubigung oder Mitgliedschaft."
  ],
  [
    "hero.start",
    "Отвори го водичот ↓",
    "Open the guide ↓",
    "Hap udhëzuesin ↓",
    "Отвори водич ↓",
    "Leitfaden öffnen ↓"
  ],
  [
    "steps.kicker",
    "01 / ВОДИЧ ПО ДРЖАВА",
    "01 / COUNTRY GUIDE",
    "01 / UDHËZUES SIPAS SHTETIT",
    "01 / ВОДИЧ ПО ДРЖАВИ",
    "01 / LÄNDERLEITFADEN"
  ],
  [
    "steps.title",
    "Избери држава и вид постапка.",
    "Choose a country and process.",
    "Zgjidh shtetin dhe procedurën.",
    "Изабери државу и поступак.",
    "Land und Verfahren auswählen."
  ],
  [
    "steps.intro",
    "Изборите се пресметуваат локално. Не бараме и не снимаме име, државјанство, адреса, политичко определување, документ или контакт.",
    "Selections remain in this browser session only. No name, citizenship, address, political preference, documents or contact details are requested or recorded.",
    "Zgjedhjet mbeten vetëm në këtë sesion. Nuk kërkohen ose regjistrohen emër, shtetësi, adresë, qëndrime politike, dokumente apo kontakt.",
    "Избори остају само у овој сесији. Не тражимо нити бележимо име, држављанство, адресу, политичко опредељење, документа или контакт.",
    "Auswahl bleibt nur in dieser Browsersitzung. Es werden keine Namen, Staatsangehörigkeit, Anschriften, politischen Ansichten, Dokumente oder Kontaktdaten abgefragt oder gespeichert."
  ],
  [
    "form.country",
    "Каде престојуваш?",
    "Where do you currently reside?",
    "Ku jeton aktualisht?",
    "Где тренутно боравиш?",
    "Wo hältst du dich auf?"
  ],
  [
    "form.purpose",
    "За што бараш информации?",
    "What is your question about?",
    "Për çfarë kërkon informacion?",
    "О чему тражиш информације?",
    "Worum geht es?"
  ],
  [
    "country.us",
    "САД",
    "United States",
    "SHBA",
    "САД",
    "USA"
  ],
  [
    "country.ca",
    "Канада",
    "Canada",
    "Kanada",
    "Канада",
    "Kanada"
  ],
  [
    "country.au",
    "Австралија",
    "Australia",
    "Australia",
    "Аустралија",
    "Australien"
  ],
  [
    "purpose.membership",
    "Доброволно членство (идна постапка)",
    "Voluntary membership (future process)",
    "Anëtarësim vullnetar (procedurë e ardhshme)",
    "Добровољно чланство (будући поступак)",
    "Freiwillige Mitgliedschaft (künftiges Verfahren)"
  ],
  [
    "purpose.founding",
    "Основачки потпис / регистрација",
    "Founding signature / registration",
    "Nënshkrim themelues / regjistrim",
    "Оснивачки потпис / регистрација",
    "Gründungsunterschrift / Registrierung"
  ],
  [
    "result.title",
    "ТВОЈОТ ИНФОРМАТИВЕН ПАТ · НЕ Е ПРИЈАВА",
    "YOUR INFORMATION PATH · NOT AN APPLICATION",
    "RRUGA JOTE INFORMATIVE · JO APLIKIM",
    "ТВОЈ ИНФОРМАТИВНИ ПУТ · НИЈЕ ПРИЈАВА",
    "DEIN INFORMATIONSWEG · KEIN ANTRAG"
  ],
  [
    "result.official",
    "Отвори ги официјалните претставништва",
    "Open official diplomatic missions",
    "Hap përfaqësitë zyrtare",
    "Отвори званична представништва",
    "Amtliche Auslandsvertretungen öffnen"
  ],
  [
    "result.country.us",
    "За САД: провери ги македонските дипломатско-конзуларни претставништва за дозволени услуги и термин; не претпоставувај дека секој американски онлајн нотар има важечка постапка во Македонија.",
    "For the USA: consult North Macedonia's official diplomatic missions about permitted services and appointments; do not assume a US online notary is accepted in North Macedonia.",
    "Për SHBA: pyet përfaqësitë zyrtare të Maqedonisë së Veriut për shërbimet dhe terminet; mos supozo se çdo noter online amerikan pranohet në Maqedoni.",
    "За САД: провери званична македонска представништва и термине; не претпостављај да се свака америчка онлајн овера признаје у Македонији.",
    "USA: Informiere dich bei den nordmazedonischen Auslandsvertretungen über zulässige Dienste und Termine; die Anerkennung einer US-Onlinebeglaubigung ist nicht automatisch gesichert."
  ],
  [
    "result.country.ca",
    "За Канада: провери ги официјалните претставништва и прашај која форма на потпис или конзуларна заверка може да се прифати за конкретниот акт.",
    "For Canada: check official missions and ask which signature or consular-certification process is accepted for the specific document.",
    "Për Kanadanë: kontrollo përfaqësitë zyrtare dhe pyet çfarë forme nënshkrimi ose vërtetimi konsullor pranohet për dokumentin.",
    "За Канаду: провери званична представништва и питај који потпис или конзуларна овера важи за конкретни документ.",
    "Kanada: Prüfe die amtlichen Vertretungen und kläre, welche Unterschrift oder konsularische Bestätigung für den konkreten Rechtsakt anerkannt wird."
  ],
  [
    "result.country.au",
    "За Австралија: провери во Канбера или Мелбурн која заверка е возможна и кои оригинали, потписи или посети се потребни.",
    "For Australia: ask the official missions in Canberra or Melbourne which certification is available and whether originals, signatures or in-person visits are required.",
    "Për Australinë: pyet përfaqësitë në Canberra ose Melbourne për vërtetimin, dokumentet origjinale, nënshkrimet ose paraqitjen personale.",
    "За Аустралију: питај представништва у Канбери или Мелбурну која је овера доступна и да ли су потребни оригинали, потписи или лични долазак.",
    "Australien: Kläre mit Canberra oder Melbourne, welche Beglaubigung möglich ist und ob Originale, Unterschriften oder ein persönlicher Besuch nötig sind."
  ],
  [
    "result.purpose.membership",
    "За доброволно членство треба да се проверат законот, статусот и статутот на организацијата и прописната форма на потпис. Не е потврдено дека видеоразговор сам по себе е доволен.",
    "For voluntary membership, verify the law, registration and statutes of the organisation and the required signature form. A video call alone has not been shown to suffice.",
    "Për anëtarësim vullnetar duhen verifikuar ligji, regjistrimi, statuti dhe forma e nënshkrimit. Një video-thirrje e vetme nuk është provuar e mjaftueshme.",
    "За добровољно чланство провери закон, регистрацију и статут организације и прописани потпис. Сам видео-позив није потврђен као довољан.",
    "Bei freiwilliger Mitgliedschaft müssen Gesetz, Registrierung, Satzung und vorgeschriebene Unterschriftsform geklärt sein. Ein Videoanruf allein ist nicht nachweislich ausreichend."
  ],
  [
    "result.purpose.founding",
    "Основачките потписи имаат посебна законска форма и нотарски барања. Не е потврдено дека потпис преку видео од странство ги исполнува. Потребна е писмена оценка од овластен правник и надлежни органи.",
    "Founding signatures have specific legal and notarial requirements. Remote video signing from abroad has not been confirmed to meet them. Obtain written advice from qualified legal counsel and competent authorities.",
    "Nënshkrimet themeluese kanë kërkesa të veçanta ligjore dhe noteriale. Nuk është konfirmuar se video-nënshkrimi nga jashtë i plotëson. Kërko mendim me shkrim nga profesionistët dhe autoritetet.",
    "Оснивачки потписи имају посебне законске и нотарске услове. Није потврђено да потпис видео-везом из иностранства испуњава услове. Тражи писану стручну и службену проверу.",
    "Gründungsunterschriften unterliegen besonderen gesetzlichen und notariellen Anforderungen. Eine Video-Unterschrift aus dem Ausland ist dafür nicht als ausreichend bestätigt. Erforderlich ist eine schriftliche fachliche und behördliche Prüfung."
  ],
  [
    "stage.ai.title",
    "AI Адвокат · правно истражување",
    "AI Advokat · legal research",
    "AI Advokat · kërkim juridik",
    "AI Advokat · правно истраживање",
    "AI Advokat · Rechtsrecherche"
  ],
  [
    "stage.ai.body",
    "Разгледај ги применливите прописи во одделниот AI Адвокат. Не испраќаме избрана држава, цел, лични податоци или текст од овој водич.",
    "Review applicable laws in the separate AI Advokat service. We do not send selected country, purpose, personal data or text from this guide.",
    "Shiko ligjet në shërbimin e veçantë AI Advokat. Nuk dërgojmë shtetin, qëllimin, të dhëna personale ose tekst nga ky udhëzues.",
    "Провери прописе у засебном AI Advokat сервису. Не шаљемо државу, сврху, личне податке или текст водича.",
    "Prüfe Rechtsvorschriften im eigenständigen AI-Advokat-Dienst. Land, Zweck, persönliche Daten und Inhalte dieses Leitfadens werden nicht übertragen."
  ],
  [
    "stage.ai.open",
    "Отвори AI Адвокат (нов таб)",
    "Open AI Advokat (new tab)",
    "Hap AI Advokat (skedë e re)",
    "Отвори AI Advokat (нова картица)",
    "AI Advokat öffnen (neuer Tab)"
  ],
  [
    "stage.ai.note",
    "AI не дава правно важечка заверка и не носи одлука за членство.",
    "AI does not perform notarization or make membership decisions.",
    "AI nuk kryen noterizim dhe nuk merr vendime anëtarësimi.",
    "AI не оверава исправе и не одлучује о чланству.",
    "KI kann weder beglaubigen noch über Mitgliedschaft entscheiden."
  ],
  [
    "stage.video.title",
    "Видео-консултација · не и заверка",
    "Video consultation · not notarization",
    "Konsultim me video · jo noterizim",
    "Видео-консултација · не и овера",
    "Videoberatung · keine Beglaubigung"
  ],
  [
    "stage.video.body",
    "Може да се испланира видео-разговор за правни прашања и подготовка. Далечинска нотарска заверка, идентитетска проверка и признавање на странски документи мора претходно да ги потврдат надлежните лица.",
    "A video call may help with preparatory legal questions. Remote notarization, identity verification and recognition of foreign documents require prior confirmation by competent authorities.",
    "Video-thirrja mund të shërbejë për pyetje juridike paraprake. Noterizimi në distancë, identifikimi dhe njohja e dokumenteve të huaja duhet të konfirmohen nga autoritetet.",
    "Видео-разговор може помоћи у припреми. Удаљену оверу, проверу идентитета и признавање страних исправа морају претходно потврдити надлежни.",
    "Ein Videoanruf kann rechtliche Vorfragen klären. Fernbeglaubigung, Identitätsprüfung und Anerkennung ausländischer Urkunden müssen zuvor von zuständigen Stellen bestätigt werden."
  ],
  [
    "stage.video.locked",
    "Видео-термин: не е поврзан со проверен давател",
    "Video session: no verified provider connected",
    "Seancë video: nuk ka ofrues të verifikuar",
    "Видео-термин: нема провереног пружаоца",
    "Videositzung: kein geprüfter Anbieter angebunden"
  ],
  [
    "stage.video.note",
    "Не снимаме видео, не активираме камера, микрофон, биометрија или конференциска соба.",
    "No video recording, camera, microphone, biometrics or meeting room is activated.",
    "Nuk aktivizohen regjistrim video, kamerë, mikrofon, biometri ose dhomë takimi.",
    "Не активирамо снимање, камеру, микрофон, биометрију или собу за састанке.",
    "Keine Videoaufzeichnung, Kamera, Mikrofon, Biometrie oder Konferenzräume werden aktiviert."
  ],
  [
    "stage.notary.title",
    "Нотар / конзуларен пат",
    "Notary / consular route",
    "Rruga noteriale / konsullore",
    "Нотарска / конзуларна путања",
    "Notarieller / konsularischer Weg"
  ],
  [
    "stage.notary.body",
    "Побарај писмена потврда дали е потребен потпис пред нотар, конзуларна заверка или друга постапка, и дали исправата од странство ќе се признае во Македонија.",
    "Obtain written confirmation whether a notary, consular certification or another process is required and whether the foreign document will be recognized in North Macedonia.",
    "Kërko konfirmim me shkrim nëse nevojitet noter, vërtetim konsullor ose procedurë tjetër dhe nëse dokumenti i huaj do të pranohet në Maqedoninë e Veriut.",
    "Затражи писану потврду да ли је потребан нотар, конзуларна овера или други поступак и да ли ће се страна исправа признати у Македонији.",
    "Hole schriftliche Bestätigung ein, ob ein Notar, eine konsularische Beglaubigung oder ein anderes Verfahren nötig ist und ob ausländische Unterlagen anerkannt werden."
  ],
  [
    "stage.notary.consular",
    "Службени конзуларни заверки ↗",
    "Official consular services ↗",
    "Shërbime konsullore zyrtare ↗",
    "Званичне конзуларне услуге ↗",
    "Amtliche konsularische Dienste ↗"
  ],
  [
    "stage.notary.chamber",
    "Нотарска комора ↗",
    "Notary Chamber ↗",
    "Dhoma e Noterëve ↗",
    "Нотарска комора ↗",
    "Notarkammer ↗"
  ],
  [
    "stage.human.title",
    "Проверка на документи и Human Gate",
    "Document verification and Human Gate",
    "Verifikim i dokumenteve dhe kontroll njerëzor",
    "Провера докумената и људска контрола",
    "Dokumentenprüfung und menschliche Freigabe"
  ],
  [
    "stage.human.body",
    "Само одговорно овластено лице, по проверка на законскиот статус, подобноста, документите, потписот и правната основа, може да постапи по членство. Овој прототип не прима пријави.",
    "Only an authorized human officer, after checking legal status, eligibility, documentation, signatures and lawful basis, may process future membership. This prototype receives no applications.",
    "Vetëm një person i autorizuar, pas kontrollit të statusit ligjor, kushteve, dokumenteve dhe nënshkrimeve, mund të shqyrtojë anëtarësimin në të ardhmen. Nuk pranohen aplikime.",
    "Само овлашћено лице, након провере статуса, подобности, докумената, потписа и правног основа, може размотрити будуће чланство. Прототип не прима пријаве.",
    "Nur eine zuständige Person kann nach Prüfung von Rechtsstatus, Voraussetzungen, Unterlagen, Unterschriften und Rechtsgrundlage künftige Mitgliedschaft bearbeiten. Der Prototyp nimmt keine Anträge entgegen."
  ],
  [
    "stage.human.locked",
    "ЧЛЕНСТВО: НЕАКТИВНО · НЕМА ПОТВРДА ЗА ЗАЧЛЕНУВАЊЕ",
    "MEMBERSHIP: INACTIVE · NO ENROLMENT CONFIRMATION",
    "ANËTARËSIMI: JOAKTIV · PA KONFIRMIM",
    "ЧЛАНСТВО: НЕАКТИВНО · НЕМА ПОТВРДЕ",
    "MITGLIEDSCHAFT: INAKTIV · KEINE BESTÄTIGUNG"
  ],
  [
    "check.title",
    "Локална листа за подготовка",
    "Local preparation checklist",
    "Listë lokale përgatitore",
    "Локална листа за припрему",
    "Lokale Vorbereitungsliste"
  ],
  [
    "check.intro",
    "Провери ги прашањата пред видео-консултација. Оваа листа не е правна согласност и не се испраќа.",
    "Review questions before any video consultation. This checklist is not legal consent and is never submitted.",
    "Kontrollo pyetjet para çdo video-konsultimi. Lista nuk është pëlqim ligjor dhe nuk dërgohet.",
    "Провери питања пре видео-консултације. Листа није правни пристанак и не шаље се.",
    "Prüfe Fragen vor einer Videoberatung. Die Liste ist keine rechtliche Einwilligung und wird nicht übermittelt."
  ],
  [
    "check.law",
    "Потврди кој правен режим важи",
    "Confirm the applicable legal regime",
    "Konfirmo kuadrin ligjor",
    "Потврди који правни режим важи",
    "Anwendbare Rechtsvorschriften klären"
  ],
  [
    "check.sign",
    "Потврди дали е потребен потпис и во која форма",
    "Confirm if a signature is required and in what form",
    "Konfirmo nëse kërkohet nënshkrim dhe në çfarë forme",
    "Потврди да ли је потребан потпис и у којој форми",
    "Unterschriftspflicht und Form klären"
  ],
  [
    "check.notary",
    "Потврди дали заверката од далечина е признаена",
    "Confirm whether remote certification is recognized",
    "Konfirmo njohjen e noterizimit në distancë",
    "Потврди да ли се удаљена овера признаје",
    "Anerkennung der Fernbeglaubigung klären"
  ],
  [
    "check.privacy",
    "Провери кој би ги обработувал личните податоци",
    "Identify who would process personal data",
    "Identifiko përpunuesin e të dhënave",
    "Утврдити ко обрађује личне податке",
    "Verantwortliche Stelle für Daten klären"
  ],
  [
    "check.human",
    "Потврди кој носи конечна човечка одлука",
    "Confirm who makes the final human decision",
    "Konfirmo vendimmarrësin përfundimtar",
    "Потврди ко доноси коначну људску одлуку",
    "Verantwortliche menschliche Entscheidung klären"
  ],
  [
    "check.reset",
    "Исчисти локален избор",
    "Clear local choices",
    "Pastro zgjedhjet lokale",
    "Обриши локалне изборе",
    "Lokale Auswahl löschen"
  ],
  [
    "check.cleared",
    "Локалните избори се исчистени.",
    "Local choices cleared.",
    "Zgjedhjet lokale u pastruan.",
    "Локални избори су обрисани.",
    "Lokale Auswahl gelöscht."
  ],
  [
    "sources.kicker",
    "02 / ДОКУМЕНТИ И ИЗВОРИ",
    "02 / DOCUMENTS AND SOURCES",
    "02 / DOKUMENTE DHE BURIME",
    "02 / ДОКУМЕНТИ И ИЗВОРИ",
    "02 / DOKUMENTE UND QUELLEN"
  ],
  [
    "sources.title",
    "Проверувај ги официјалните извори.",
    "Check official sources.",
    "Kontrollo burimet zyrtare.",
    "Проверавај званичне изворе.",
    "Amtliche Quellen prüfen."
  ],
  [
    "sources.desc",
    "Законската важност на видео-заверката и на странски електронски или нотарски исправи за конкретната постапка останува непотврдена. Ова се почетни извори, не правно одобрение.",
    "Legal acceptance of video notarization and foreign electronic/notarial documents for this specific process has not been verified. These are starting sources, not legal approval.",
    "Njohja ligjore e noterizimit përmes videos dhe e dokumenteve të huaja elektronike/noteriale për këtë procedurë nuk është verifikuar. Këto janë burime fillestare.",
    "Правна важност видео-овере и страних електронских или нотарских исправа није потврђена за овај поступак. Ово су почетни извори, не одобрење.",
    "Die rechtliche Anerkennung von Videobeglaubigungen und ausländischen elektronischen oder notariellen Urkunden für dieses Verfahren ist ungeklärt. Diese Links sind Ausgangsquellen, keine Freigabe."
  ],
  [
    "sources.court",
    "Уставен суд · Закон за политички партии ↗",
    "Constitutional Court · Political Parties Law ↗",
    "Gjykata Kushtetuese · Ligji për partitë ↗",
    "Уставни суд · Закон о партијама ↗",
    "Verfassungsgericht · Parteiengesetz ↗"
  ],
  [
    "sources.justice",
    "Министерство за правда · Заверка на потпис ↗",
    "Ministry of Justice · Signature certification ↗",
    "Ministria e Drejtësisë · Vërtetim nënshkrimi ↗",
    "Министарство правде · Овера потписа ↗",
    "Justizministerium · Unterschriftsbeglaubigung ↗"
  ],
  [
    "sources.mfa",
    "МНР · Нотарски конзуларни услуги ↗",
    "Foreign Ministry · Consular notarial services ↗",
    "MPJ · Shërbime noteriale konsullore ↗",
    "МСП · Конзуларне нотарске услуге ↗",
    "Außenministerium · Konsularische Notardienste ↗"
  ],
  [
    "sources.azlp",
    "АЗЛП · Податоци за политичко членство ↗",
    "Data Protection Agency · Political membership data ↗",
    "Agjencia e Privatësisë · Të dhënat politike ↗",
    "Агенција за заштиту података · Политичко чланство ↗",
    "Datenschutzbehörde · Politische Mitgliedsdaten ↗"
  ],
  [
    "control.kicker",
    "03 / ГРАНИЦИ",
    "03 / LIMITS",
    "03 / KUFIJTË",
    "03 / ГРАНИЦЕ",
    "03 / GRENZEN"
  ],
  [
    "control.title",
    "Не е доволно само да се вклучи камера.",
    "Turning on the camera is not enough.",
    "Nuk mjafton të ndizet kamera.",
    "Није довољно укључити камеру.",
    "Die Kamera einzuschalten reicht nicht aus."
  ],
  [
    "control.body",
    "Нема автоматско зачленување преку AI, обичен видеоразговор или едно поле за согласност. За активирање треба правна процена по земја, соодветна организациска регистрација, валидни потписи, овластен нотарски или конзуларен процес, безбедни податоци и Human Gate.",
    "No automatic enrolment through AI, an ordinary video call or a consent checkbox. Activation would require country-specific legal review, verified organizational registration, valid signatures, an authorized notarial/consular route, privacy safeguards and a human decision.",
    "Nuk ka anëtarësim automatik përmes AI, video-thirrjes ose një kutie pëlqimi. Duhet kontroll ligjor sipas vendit, regjistrim organizativ, nënshkrime të vlefshme, procedurë të autorizuar, privatësi dhe vendim njerëzor.",
    "Нема аутоматског учлањења преко AI, обичног видео-позива или поља за сагласност. Потребни су правна провера по држави, правни статус, ваљани потписи, овлашћена нотарска/конзуларна процедура, заштита података и људска одлука.",
    "Keine automatische Mitgliedschaft durch KI, Videoanruf oder Einwilligungskästchen. Erforderlich wären länderspezifische Rechtsprüfung, bestätigte Registrierung, gültige Unterschriften, ein zugelassener Notar-/Konsularweg, Datenschutz und menschliche Freigabe."
  ],
  [
    "control.privacy",
    "Податоците за политичко членство се чувствителни. Овој водич не зачувува избор на земја, цел, штиклирани полиња или какви било идентификациски податоци.",
    "Political membership data are sensitive. This guide stores neither country, purpose, checklist selections nor identifying information.",
    "Të dhënat e anëtarësimit politik janë të ndjeshme. Udhëzuesi nuk ruan shtetin, qëllimin, zgjedhjet e listës apo informacion identifikues.",
    "Подаци о политичком чланству су осетљиви. Водич не чува државу, сврху, означене ставке нити идентификационе податке.",
    "Daten zur politischen Mitgliedschaft sind sensibel. Dieser Leitfaden speichert weder Land, Zweck, Checklisten-Auswahl noch Identitätsdaten."
  ],
  [
    "foot.note",
    "Развоен информативен модул · без зачленување, нотаријална заверка или серверско собирање на податоци.",
    "Development information module · no enrolment, notarization or server-side collection.",
    "Modul informativ në zhvillim · pa anëtarësim, noterizim ose mbledhje të dhënash.",
    "Развојни информативни модул · без чланства, овере или серверског прикупљања података.",
    "Informationsmodul in Entwicklung · keine Mitgliedschaft, Beglaubigung oder serverseitige Datenerhebung."
  ],
  [
    "foot.back",
    "Назад до „Мои права“",
    "Back to My rights",
    "Kthehu te të drejtat e mia",
    "Назад на Моја права",
    "Zurück zu Meine Rechte"
  ],
  [
    "foot.world",
    "Светски навигатор",
    "World Navigator",
    "Navigatori botëror",
    "Светски навигатор",
    "Welt-Navigator"
  ],
  [
    "page.title",
    "Дијаспора · правен и нотарски пат · МАКЕДОНИЈА СИСТЕМ",
    "Diaspora · legal and notarial route · MACEDONIA SYSTEM",
    "Diaspora · rruga ligjore dhe noteriale · MAQEDONIA SISTEM",
    "Дијаспора · правни и нотарски пут · МАКЕДОНИЈА СИСТЕМ",
    "Diaspora · Rechts- und Notarweg · MAZEDONIEN SYSTEM"
  ]
];

/* Country selectors only choose static legal information. No application or data transfer. */
(() => {
  'use strict';
  const LANGUAGES = ['mk','en','al','sr','de'];
  const I18N = Object.fromEntries(LANGUAGES.map(lang => [lang,Object.create(null)]));
  for (const row of TRANSLATIONS) {
    if (row.length !== 6 || row.some(value => typeof value !== 'string' || !value.trim())) {
      throw new Error('Incomplete translation row');
    }
    for (let idx=0;idx<LANGUAGES.length;idx++) {
      if (Object.hasOwn(I18N[LANGUAGES[idx]],row[0])) throw new Error('Duplicate translation key');
      I18N[LANGUAGES[idx]][row[0]] = row[idx+1];
    }
  }
  for(const element of document.querySelectorAll('[data-t]')) {
    const key = element.getAttribute('data-t');
    for(const lang of LANGUAGES) {
      if (!Object.hasOwn(I18N[lang],key)) throw new Error('Missing translated UI key: '+key+'/'+lang);
    }
  }
  const DESTINATIONS = Object.freeze({
    us:'https://mfa.gov.mk/mk-MK/ambasadi?region=north_america',
    ca:'https://mfa.gov.mk/mk-MK/ambasadi?region=north_america',
    au:'https://mfa.gov.mk/mk-MK/ambasadi?region=australia_and_oceania'
  });
  const country = document.getElementById('country');
  const purpose = document.getElementById('purpose');
  const resultCountry = document.getElementById('result-country');
  const resultDescription = document.getElementById('result-description');
  const resultPurpose = document.getElementById('result-purpose');
  const official = document.getElementById('country-official');
  const reset = document.getElementById('reset');
  const resetStatus = document.getElementById('reset-status');
  const checks = [...document.querySelectorAll('[data-check]')];
  const languages = [...document.querySelectorAll('.language')];
  let language = 'mk';
  const requested = new URLSearchParams(location.search).get('lang');
  if (LANGUAGES.includes(requested)) language = requested;
  function msg(key) { return I18N[language][key]; }
  function route() {
    if (!Object.hasOwn(DESTINATIONS,country.value)) country.value='us';
    if (!['membership','founding'].includes(purpose.value)) purpose.value='membership';
    const place = country.value;
    resultCountry.textContent = msg('country.'+place);
    resultDescription.textContent = msg('result.country.'+place);
    resultPurpose.textContent = msg('result.purpose.'+purpose.value);
    official.href = DESTINATIONS[place];
  }
  function applyLanguage(next) {
    if (!LANGUAGES.includes(next)) return;
    language = next;
    document.documentElement.lang = next === 'al' ? 'sq' : next;
    document.title = msg('page.title');
    for (const el of document.querySelectorAll('[data-t]')) {
      el.textContent = msg(el.getAttribute('data-t'));
    }
    for(const button of languages) {
      const selected = button.dataset.lang === next;
      button.classList.toggle('current',selected);
      button.setAttribute('aria-pressed',selected?'true':'false');
    }
    resetStatus.textContent = '';
    route();
  }
  for(const button of languages) button.addEventListener('click',()=>applyLanguage(button.dataset.lang));
  country.addEventListener('change',route);
  purpose.addEventListener('change',route);
  reset.addEventListener('click',()=>{
    country.value='us';
    purpose.value='membership';
    for(const check of checks) check.checked=false;
    route();
    resetStatus.textContent=msg('check.cleared');
  });
  // Privacy boundary: ephemeral selections only; no tracking, recording, external calls or storage.
  applyLanguage(language);
})();
