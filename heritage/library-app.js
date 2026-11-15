"use strict";(()=>{
 const d=window.MKS_MAY_LIBRARY;const root=document.getElementById("sectionList"),docs=document.getElementById("documentList");
 const search=document.getElementById("search"),select=document.getElementById("state"),reset=document.getElementById("reset");
 const summary=document.getElementById("summary"),empty=document.getElementById("noMatches");
 if(!d||d.sections?.length!==58||d.documents?.length!==26||!root||!docs||!search||!select||!reset||!summary||!empty){if(summary)summary.textContent="Каталогот не може да се потврди.";return;}
 const labels={restored:"Реставрирана информативна содржина",preserved:"Зачувана во главниот портал",gated:"Историски модул · потребна проверка"};
 const norm=s=>String(s).toLocaleLowerCase("mk").normalize("NFKC");
 function a(href,text){const link=document.createElement("a");link.href=href;link.textContent=text;return link;}
 function render(){
   const query=norm(search.value.trim()),state=select.value;root.replaceChildren();const fragment=document.createDocumentFragment();let count=0;
   for(const item of d.sections){
     if(state!=="all"&&item.status!==state)continue;
     if(query&&!norm(item.title+" "+item.id).includes(query))continue;
     count++;
     const card=document.createElement("article");card.className="library-card";
     const meta=document.createElement("span");meta.className="meta";meta.textContent=labels[item.status];
     const h=document.createElement("h3");h.textContent=item.title;
     const actions=document.createElement("div");actions.className="actions";
     actions.append(a("../index.html#"+item.id,"Во порталот"),a("./may-2026-v17-readonly.html#"+item.id,"Мајски оригинал"));
     card.append(meta,h,actions);fragment.append(card);
   }
   root.append(fragment);empty.hidden=count>0;summary.textContent="Прикажани: "+count+" од 58 секции.";
 }
 for(const path of d.documents){
  const link=a("https://github.com/Makedonija-Sistem/makedonija-sistem/blob/"+d.sourceCommit+"/"+path,path);
  link.target="_blank";link.rel="noopener noreferrer";link.referrerPolicy="no-referrer";link.className="doc-row";docs.append(link);
 }
 search.addEventListener("input",render);select.addEventListener("change",render);
 reset.addEventListener("click",()=>{search.value="";select.value="all";render();search.focus();});render();
})();