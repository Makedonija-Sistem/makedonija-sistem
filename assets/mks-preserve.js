/* MAKEDONIJA SISTEM - content-preserving review overlay; no original copy removed. */
(function(){'use strict';
  const groups = [
    {id:'home',names:{mk:'Почеток',en:'Home',al:'Kreu',sr:'Почетна',de:'Start'},ids:['dashboard','manifest','principles','bestpractices','wellbeing']},
    {id:'programme',names:{mk:'Програма',en:'Programme',al:'Programi',sr:'Програм',de:'Programm'},ids:['program-restart','programme','industrial-champions','robotika-macedonia','financial-hub','mining-resources','drones-macedonia']},
    {id:'citizens',names:{mk:'Граѓани',en:'Citizens',al:'Qytetarët',sr:'Грађани',de:'Bürger'},ids:['citizens-march','initiatives','municipalities','events','petitions','participatory-budget']},
    {id:'diaspora',names:{mk:'Дијаспора',en:'Diaspora',al:'Diaspora',sr:'Дијаспора',de:'Diaspora'},ids:['diaspora','diaspora-hub','guide','founders-drive']},
    {id:'organisation',names:{mk:'Организација',en:'Organisation',al:'Organizata',sr:'Организација',de:'Organisation'},ids:['institute','junge','congress','officina','membership','statute']},
    {id:'trust',names:{mk:'Доверба',en:'Trust',al:'Transparenca',sr:'Поверење',de:'Vertrauen'},ids:['donations','election-context','institutional-framework','media-hub','analytical-center','world-parties','party-networking','monthly-magazine','crm-dashboard','poll-archive']}
  ];
  const wording = {
    mk:{status:'ЈАВЕН НАЦРТ · не е регистрирана партија. Текстовите и инвестиционите бројки се проекти/предлози, не реализирани резултати. Нема активни нотари, официјално членство, собирање донации или договорени партнери. Не испраќајте чувствителни податоци.',locked:'Неактивен демонстративен модул — оригиналната содржина е целосно зачувана, но не е верификувана ниту функционална.',preview:'Отвори го оригиналниот развоен материјал (непотврден; без активни дејства)',disclaimer:'ПРОЕКТЕН ПРЕДЛОГ · бројките, роковите и наведените соработки не се независно потврдени.'},
    en:{status:'PUBLIC DRAFT · not a registered political party. Claims and projections are proposals, not delivered results. There are no active notary services, formal memberships, donations or confirmed partnerships. Do not share sensitive data.',locked:'Inactive demonstration module — all original material is preserved, but its claims and operation are not verified.',preview:'Show original development material (unverified; interactions disabled)',disclaimer:'PROJECT PROPOSAL · figures, dates and partnerships are not independently verified.'},
    al:{status:'DRAFT PUBLIK · jo parti politike e regjistruar. Shifrat dhe parashikimet janë propozime, jo rezultate të realizuara. Nuk ka shërbime aktive noteriale, anëtarësi, donacione ose partneritete të konfirmuara. Mos ndani të dhëna të ndjeshme.',locked:'Modul demonstrues joaktiv — përmbajtja origjinale ruhet, por nuk është verifikuar.',preview:'Shfaq materialin origjinal (i paverifikuar; pa veprime aktive)',disclaimer:'PROPOZIM · shifrat dhe partneritetet nuk janë të verifikuara.'},
    sr:{status:'ЈАВНИ НАЦРТ · није регистрована политичка странка. Бројеви и прогнозе су предлози, не реализовани резултати. Нема активних нотарских услуга, чланства, донација или потврђених партнерстава. Не шаљите осетљиве податке.',locked:'Неактиван демонстрациони модул — оригинални садржај је сачуван, али није проверен.',preview:'Прикажи оригинални развојни материјал (непроверено; без активних радњи)',disclaimer:'ПРОЈЕКТНИ ПРЕДЛОГ · бројеви и партнерства нису независно проверени.'},
    de:{status:'ÖFFENTLICHER ENTWURF · keine eingetragene politische Partei. Zahlen und Prognosen sind Vorschläge, keine Ergebnisse. Keine aktiven Notariatsdienste, Mitgliedschaften, Spenden oder bestätigten Partnerschaften. Keine sensiblen Daten übermitteln.',locked:'Inaktives Demomodul — der Originalinhalt bleibt erhalten, ist jedoch nicht verifiziert.',preview:'Originalentwurf anzeigen (ungeprüft; keine aktiven Aktionen)',disclaimer:'PROJEKTVORSCHLAG · Zahlen und Partnerschaften sind nicht unabhängig geprüft.'}
  };
  const restricted = ['dashboard','founders-drive','guide','membership','digital-enrollment','donations','election-context','media-hub','poll-tool','bot-agent','newsletter','crm-dashboard','recruiting','volunteer-hub','events','petitions','email-campaign','participatory-budget','anonymous-proposals','ai-sentiment','poll-archive','presentation-export','growth-dashboard'];
  const proposals = ['program-restart','industrial-champions','robotika-macedonia','financial-hub','mining-resources','drones-macedonia','bestpractices','wellbeing','citizens-march','initiatives','municipalities','diaspora','diaspora-hub','diaspora-champions','institute','junge','congress','officina','institutional-framework','world-parties','party-networking','monthly-magazine','analytical-center','statute'];
  const html=document.documentElement;
  const lang=()=>wording[html.dataset.lang] ? html.dataset.lang : 'mk';
  const tr=k=>wording[lang()][k];
  const register=[];
  function closeGroups(except){register.forEach(d=>{if(d!==except)d.open=false;});}
  function setMenu(open){
    const n=document.getElementById('navLinks'),b=document.getElementById('menuToggle');
    if(!n || !b)return;
    n.classList.toggle('open',Boolean(open));
    document.body.classList.toggle('menu-open',Boolean(open));
    const backdrop=document.getElementById('menuBackdrop');if(backdrop)backdrop.classList.toggle('show',Boolean(open));
    b.setAttribute('aria-expanded',String(Boolean(open)));
    if(!open)closeGroups();
  }
  function makeNote(k){
    const d=document.createElement('div');d.className='mks-review-note';d.setAttribute('role','note');d.dataset.mksNote=k;d.textContent=tr(k);return d;
  }
  function init(){
    if(document.getElementById('mks-preserve-banner'))return;
    const nav=document.getElementById('navLinks'),toggle=document.getElementById('menuToggle');
    if(!nav||!toggle){console.warn('MKS preserve: nav not found');return;}
    const directLinks=Array.from(nav.children).filter(a=>a.matches('a[href^="#"]'));
    if(directLinks.length!==38){console.warn('MKS preserve: original 38-link navigation changed; refusing rewrite',directLinks.length);return;}
    const lookup=new Map(directLinks.map(a=>[a.getAttribute('href').slice(1),a]));
    const all=groups.flatMap(g=>g.ids);
    if(all.length!==38||new Set(all).size!==38||all.some(id=>!lookup.has(id))){console.warn('MKS preserve: groups mismatch');return;}
    groups.forEach(g=>{
      const details=document.createElement('details');details.className='mks-nav-group';details.dataset.mksGroup=g.id;
      const summary=document.createElement('summary');summary.textContent=g.names[lang()];summary.dataset.mksSummary=g.id;
      const panel=document.createElement('div');panel.className='mks-nav-panel';
      g.ids.forEach(id=>panel.appendChild(lookup.get(id)));details.append(summary,panel);nav.appendChild(details);
      details.addEventListener('toggle',()=>{if(details.open)closeGroups(details);});register.push(details);
    });
    nav.classList.add('mks-preserve-nav');
    const closeButton=document.createElement('button');
    closeButton.type='button';closeButton.className='mks-menu-close';closeButton.setAttribute('aria-label','Close navigation');
    closeButton.textContent='×';nav.prepend(closeButton);
    closeButton.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();setMenu(false);},true);
    // Capture phase shields against the two original conflicting bubble-phase menu toggles.
    toggle.addEventListener('click',event=>{
      event.preventDefault();event.stopImmediatePropagation();setMenu(!nav.classList.contains('open'));
    },true);
    nav.addEventListener('click',event=>{
      if(!event.target.closest('a[href^="#"]'))return;
      closeGroups();if(window.innerWidth<=1320)setMenu(false);
    },true);
    document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeGroups();setMenu(false);}},true);
    document.addEventListener('pointerdown',event=>{
      if(nav.contains(event.target)||toggle.contains(event.target))return;
      closeGroups();if(window.innerWidth<=1320&&nav.classList.contains('open'))setMenu(false);
    },true);
    window.addEventListener('resize',()=>{if(window.innerWidth>1320)setMenu(false);},{passive:true});

    const banner=document.createElement('aside');banner.id='mks-preserve-banner';banner.className='mks-review-banner';banner.setAttribute('role','note');
    const t=document.createElement('div');t.className='mks-notice-text';t.dataset.mksNote='status';t.textContent=tr('status');banner.append(t);
    const header=document.querySelector('header#siteHeader');
    if(header)header.insertAdjacentElement('afterend',banner);else document.body.prepend(banner);
    restricted.forEach(id=>{
      const section=document.getElementById(id);if(!section)return;
      const old=Array.from(section.childNodes);
      const details=document.createElement('details');details.className='mks-review-archive';details.dataset.mksRestricted=id;
      const summary=document.createElement('summary');summary.dataset.mksNote='preview';summary.textContent=tr('preview');
      const content=document.createElement('div');content.className='mks-review-original';
      old.forEach(node=>content.appendChild(node));
      details.append(summary,content);
      section.append(makeNote('locked'),details);
      // Prevent any unverified payments, registration, voting, or misleading live actions.
      section.addEventListener('click',event=>{
        if(event.target.closest('.mks-review-archive>summary'))return;
        if(event.target.closest('a,button,input,select,textarea,[role="button"]')){
          event.preventDefault();event.stopImmediatePropagation();
        }
      },true);
      content.querySelectorAll('input,button,select,textarea').forEach(el=>{el.disabled=true;el.setAttribute('aria-disabled','true');});
    });
    proposals.forEach(id=>{const section=document.getElementById(id);if(section)section.insertBefore(makeNote('disclaimer'),section.firstChild);});
    const floater=document.getElementById('diaFloatCta');if(floater)floater.setAttribute('hidden','');
    // Keep all source text and original section IDs; only labels are localised in this overlay.
    function relabel(){
      document.querySelectorAll('[data-mks-summary]').forEach(el=>{
        const g=groups.find(g=>g.id===el.dataset.mksSummary);if(g)el.textContent=g.names[lang()];
      });
      document.querySelectorAll('[data-mks-note]').forEach(el=>{el.textContent=tr(el.dataset.mksNote);});
    }
    new MutationObserver(mutations=>{if(mutations.some(m=>m.attributeName==='data-lang'))relabel();})
      .observe(html,{attributes:true,attributeFilter:['data-lang']});
    window.__MKS_PRESERVE_REVIEW__={version:'v0.1.4-preserve-review',groups:6,links:38,restricted:restricted.length,proposals:proposals.length};
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
