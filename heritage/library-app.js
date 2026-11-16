"use strict";
(()=>{
  const d=window.MKS_MAY_LIBRARY;
  const i18n=window.MKS_MAY_LANG;
  const root=document.getElementById("sectionList"),docs=document.getElementById("documentList");
  const search=document.getElementById("search"),select=document.getElementById("state"),reset=document.getElementById("reset");
  const summary=document.getElementById("summary"),empty=document.getElementById("noMatches");
  const supported=["mk","en","al","sr","de"];
  const htmlLocales={mk:"mk",en:"en",al:"sq",sr:"sr",de:"de"};
  const btns=Array.from(document.querySelectorAll(".heritage-lang-btn"));
  function fail(){
    if(summary)summary.textContent="Каталогот не може безбедно да се потврди. Отворете го мајскиот оригинал.";
  }
  if(!d||!i18n||d.sections?.length!==58||d.documents?.length!==26||i18n.coverage?.titleCount!==58||
      !root||!docs||!search||!select||!reset||!summary||!empty||btns.length!==5){fail();return;}
  if(!supported.every(lang=>i18n.messages[lang])){fail();return;}
  for(const lang of supported.filter(v=>v!=="mk")){
    if(!d.sections.every(item=>typeof i18n.titles?.[lang]?.[item.id]==="string"&&i18n.titles[lang][item.id].length>0)){fail();return;}
  }
  let lang="mk";
  try{
    const param=new URL(location.href).searchParams.get("lang");
    if(supported.includes(param))lang=param;
  }catch(_){}
  const norm=s=>String(s).toLocaleLowerCase().normalize("NFKC");
  const safeSection=id=>/^[a-z0-9-]{1,80}$/.test(id);
  function m(key){return i18n.messages[lang][key]||i18n.messages.mk[key]||key;}
  function link(url,label){
    const el=document.createElement("a");el.href=url;el.textContent=label;return el;
  }
  function card(item){
    const article=document.createElement("article");article.className="library-card";
    const meta=document.createElement("span");meta.className="meta";
    meta.textContent=m("status"+item.status[0].toUpperCase()+item.status.slice(1));
    const title=document.createElement("h3");
    title.textContent=lang==="mk"?item.title:i18n.titles[lang][item.id];
    const original=document.createElement("p");original.className="original-title";
    if(lang!=="mk"){
      const tag=document.createElement("b");tag.textContent=m("sourceLabel")+": ";
      const value=document.createElement("span");value.lang="mk";value.textContent=item.title;
      original.append(tag,value);
    }
    const note=document.createElement("p");note.className="translation-state";note.textContent=m("titleOnly");
    const actions=document.createElement("div");actions.className="actions";
    const portal="../index.html"+(lang==="mk"?"":"?lang="+encodeURIComponent(lang))+"#"+item.id;
    const originalUrl="./may-2026-v17-readonly.html#"+item.id;
    actions.append(link(portal,m("portal")),link(originalUrl,m("original")));
    if(lang==="mk")article.append(meta,title,actions);
    else article.append(meta,title,original,note,actions);
    return article;
  }
  function render(){
    const query=norm(search.value.trim()),state=select.value;root.replaceChildren();
    const list=document.createDocumentFragment();let count=0;
    for(const item of d.sections){
      if(!safeSection(item.id))continue;
      if(state!=="all"&&item.status!==state)continue;
      const translated=lang==="mk"?item.title:i18n.titles[lang][item.id];
      if(query&&!norm(item.title+" "+translated+" "+item.id).includes(query))continue;
      list.append(card(item));count++;
    }
    root.append(list);empty.hidden=count>0;
    summary.textContent=m("shown").replace("{count}",String(count));
  }
  function updateStatic(){
    document.documentElement.lang=htmlLocales[lang];
    document.documentElement.setAttribute("data-catalog-lang",lang);
    document.title=m("pageTitle");
    const desc=document.querySelector('meta[name="description"]');
    if(desc)desc.setAttribute("content",m("lead"));
    const nav=document.getElementById("heritageLangNav");
    if(nav)nav.setAttribute("aria-label",m("languageLabel"));
    for(const el of document.querySelectorAll("[data-msg]")){
      const key=el.getAttribute("data-msg");
      if(key==="loading"||key==="noMatches"&&el===empty){
        if(key==="noMatches")el.textContent=m(key);
        continue;
      }
      if(key==="searchPlaceholder")continue;
      el.textContent=m(key);
    }
    search.placeholder=m("searchPlaceholder");
    btns.forEach(btn=>{
      const active=btn.dataset.lang===lang;
      btn.setAttribute("aria-pressed",active?"true":"false");
      btn.classList.toggle("active",active);
    });
  }
  function setLang(next,push){
    if(!supported.includes(next))return;
    lang=next;updateStatic();render();
    if(push){
      try{
        const url=new URL(location.href);
        if(lang==="mk")url.searchParams.delete("lang");
        else url.searchParams.set("lang",lang);
        history.replaceState(null,"",url.pathname+url.search+url.hash);
      }catch(_){}
    }
  }
  for(const path of d.documents){
    if(!/^[a-zA-Z0-9_./-]+$/.test(path)||path.includes(".."))continue;
    const url="https://github.com/Makedonija-Sistem/makedonija-sistem/blob/"+
      d.sourceCommit+"/"+path;
    const a=link(url,path);
    a.target="_blank";a.rel="noopener noreferrer";a.referrerPolicy="no-referrer";a.className="doc-row";
    docs.append(a);
  }
  search.addEventListener("input",render);
  select.addEventListener("change",render);
  reset.addEventListener("click",()=>{search.value="";select.value="all";render();search.focus();});
  btns.forEach(btn=>btn.addEventListener("click",()=>setLang(btn.dataset.lang,true)));
  setLang(lang,false);
})();