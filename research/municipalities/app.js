"use strict";(()=>{
const data=window.MKS_MUNICIPALITY_DATA;
const input=document.getElementById("munSearch"),select=document.getElementById("regionSelect");
const results=document.getElementById("regionResults"),summary=document.getElementById("resultsSummary");
const empty=document.getElementById("emptyResults"),clear=document.getElementById("clearFilters");
if(!input||!select||!results||!summary||!empty||!clear)return;
const valid=!!data&&Array.isArray(data.regions)&&data.regions.length===8&&
data.regions.reduce((n,region)=>n+region.municipalities.length,0)===80&&
new Set(data.regions.flatMap(r=>r.municipalities)).size===80;
if(!valid){results.replaceChildren();summary.textContent="Каталогот не може да се потврди.";empty.hidden=false;empty.textContent="Грешка во изворните податоци. Користи го официјалниот линк.";return;}
for(const r of data.regions){const option=document.createElement("option");option.value=r.id;option.textContent=r.name+" регион";select.append(option);}
const normalize=s=>String(s).normalize("NFKC").toLocaleLowerCase("mk").trim();
function render(){
const query=normalize(input.value),regionId=select.value;let count=0;
const frag=document.createDocumentFragment();
for(const region of data.regions){
 if(regionId!=="all"&&region.id!==regionId)continue;
 const names=region.municipalities.filter(name=>normalize(name).includes(query));
 if(!names.length)continue;
 count+=names.length;
 const article=document.createElement("article");article.className="region-card";
 const h=document.createElement("h3");h.textContent=region.name+" регион";
 const stats=document.createElement("span");stats.className="count";stats.textContent=" · "+names.length+" општини";h.append(stats);
 const ul=document.createElement("ul");for(const name of names){const li=document.createElement("li");li.textContent=name;ul.append(li);}
 article.append(h,ul);frag.append(article);
}
results.replaceChildren(frag);empty.hidden=count>0;
summary.textContent=count===80?"Прикажани се сите 80 општини.":"Прикажани општини: "+count+" од 80.";
}
input.addEventListener("input",render);select.addEventListener("change",render);
clear.addEventListener("click",()=>{input.value="";select.value="all";render();input.focus();});render();
})();