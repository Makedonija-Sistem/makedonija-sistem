"use strict";(()=>{
const data=window.MKS_MUNICIPALITY_DATA;
const archive=window.MKS_MUNICIPALITY_ARCHIVE;
const input=document.getElementById("munSearch"),select=document.getElementById("regionSelect");
const results=document.getElementById("regionResults"),summary=document.getElementById("resultsSummary");
const empty=document.getElementById("emptyResults"),clear=document.getElementById("clearFilters");
const mapButtons=Array.from(document.querySelectorAll("#municipalityMap .region-shape"));
const mapReset=document.getElementById("mapReset");
if(!input||!select||!results||!summary||!empty||!clear)return;
const key=(region,name)=>region+"\u0000"+name;
const regionNames=Array.isArray(data?.regions)?data.regions.map(r=>r.id):[];
const published=Array.isArray(data?.regions)?data.regions.flatMap(r=>r.municipalities.map(name=>key(r.id,name))):[];
const records=Array.isArray(archive?.rows)?archive.rows:[];
const archived=records.map(x=>key(x.region,x.name));
const domainPattern=/^(?:[a-z0-9-]+\.)+gov\.mk$/;
const valid=!!data&&data.regions.length===8&&published.length===80&&new Set(published).size===80&&
 records.length===80&&new Set(archived).size===80&&archived.every(x=>published.includes(x))&&
 records.every(row=>typeof row.center==="string"&&
   typeof row.web==="string"&&domainPattern.test(row.web)&&
   Number.isFinite(row.archivePopulation)&&Number.isFinite(row.archiveAreaKm2))&&
 mapButtons.length===8&&new Set(mapButtons.map(b=>b.dataset.region)).size===8&&
 mapButtons.every(b=>regionNames.includes(b.dataset.region));
if(!valid){
 results.replaceChildren();summary.textContent="Каталогот не може да се потврди.";
 empty.hidden=false;empty.textContent="Грешка во изворните податоци. Користи го официјалниот линк.";
 return;
}
const recordByName=new Map(records.map(row=>[key(row.region,row.name),row]));
const normalize=s=>String(s).normalize("NFKC").toLocaleLowerCase("mk").trim();
for(const r of data.regions){
 const option=document.createElement("option");
 option.value=r.id;option.textContent=r.name+" регион";select.append(option);
}
function updateMap(){
 const current=select.value;
 for(const button of mapButtons)button.setAttribute("aria-pressed",
   current!=="all"&&button.dataset.region===current?"true":"false");
}
function createMunicipality(name,region){
 const row=recordByName.get(key(region.id,name));
 const li=document.createElement("li");
 const line=document.createElement("div");line.className="municipality-line";
 const heading=document.createElement("strong");heading.textContent=name;
 const link=document.createElement("a");
 link.className="web-link";
 link.textContent="🌐 "+row.web;
 link.href="https://"+row.web+"/";
 link.target="_blank";link.rel="noopener noreferrer";
 link.referrerPolicy="no-referrer";
 link.title="Веб-адреса од архивата од 13.11.2026; денешната достапност не е проверена";
 link.setAttribute("aria-label","Архивиран веб-контакт за општина "+name+": "+row.web);
 line.append(heading,link);
 const details=document.createElement("details");details.className="legacy-detail";
 const toggle=document.createElement("summary");toggle.textContent="Повеќе информации од оригиналниот портал";
 const info=document.createElement("p");
 info.textContent="Седиште/центар: "+row.center+" · жители (архивски запис): "+
  Number(row.archivePopulation).toLocaleString("mk-MK")+
  " · површина (архивски запис): "+row.archiveAreaKm2+" км²";
 const provenance=document.createElement("small");
 provenance.textContent="Овие историски податоци не се повторно валидирани во 2026. За денешни контакти провери ја самата веб-страница.";
 details.append(toggle,info,provenance);li.append(line,details);return li;
}
function render(){
 const query=normalize(input.value),regionId=select.value;let count=0;
 const frag=document.createDocumentFragment();
 for(const region of data.regions){
  if(regionId!=="all"&&region.id!==regionId)continue;
  const names=region.municipalities.filter(name=>{
   const row=recordByName.get(key(region.id,name));
   return !query||normalize(name+" "+row.center+" "+row.web).includes(query);
  });
  if(!names.length)continue;
  count+=names.length;
  const article=document.createElement("article");article.className="region-card";
  const h=document.createElement("h3");h.textContent=region.name+" регион";
  const stats=document.createElement("span");stats.className="count";
  stats.textContent=" · "+names.length+" општини";h.append(stats);
  const ul=document.createElement("ul");
  for(const name of names)ul.append(createMunicipality(name,region));
  article.append(h,ul);frag.append(article);
 }
 results.replaceChildren(frag);empty.hidden=count>0;
 summary.textContent=count===80?"Прикажани се сите 80 општини и нивните архивирани веб-адреси.":
  "Прикажани општини: "+count+" од 80.";
 updateMap();
}
function chooseRegion(region){
 if(!regionNames.includes(region))return;
 select.value=select.value===region?"all":region;
 input.value="";render();
 results.scrollIntoView({behavior:"smooth",block:"start"});
}
for(const button of mapButtons){
 button.addEventListener("click",()=>chooseRegion(button.dataset.region));
 button.addEventListener("keydown",e=>{
  if(e.key==="Enter"||e.key===" "){e.preventDefault();chooseRegion(button.dataset.region);}
 });
}
input.addEventListener("input",render);
select.addEventListener("change",render);
clear.addEventListener("click",()=>{input.value="";select.value="all";render();input.focus();});
if(mapReset)mapReset.addEventListener("click",()=>{input.value="";select.value="all";render();});
render();
})();