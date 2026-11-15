/* May 2026 media directory bridge.
 * Activates local read-only filtering only. No email, mass outreach, CRM, tracking
 * or external network; archived press contacts may be stale.
 */
"use strict";
(()=>{
 const root=document.getElementById("media-hub");
 if(!root||root.dataset.mksMayMediaReady==="true")return;
 const cards=Array.from(root.querySelectorAll(".mh-card"));
 const filters=Array.from(root.querySelectorAll('button[data-may-safe-filter][data-cat]'));
 const input=root.querySelector("#mhSearch");
 const host=root.querySelector(".mh-search");
 if(cards.length<20||filters.length!==7||!input||!host)return;
 const state=document.createElement("p");
 state.id="mhLocalSearchStatus";
 state.className="mks-may-heritage-link";
 state.setAttribute("role","status");
 state.setAttribute("aria-live","polite");
 state.textContent="Локална архивска база · без автоматски пораки.";
 host.appendChild(state);
 const normalize=text=>String(text).normalize("NFKC").toLocaleLowerCase("mk");
 let category="all";
 function render(){
  const query=normalize(input.value.trim());
  let count=0;
  for(const card of cards){
   const matchesCategory=category==="all"||card.dataset.cat===category;
   const matchesTerm=!query||normalize((card.dataset.name||"")+" "+card.textContent).includes(query);
   const show=matchesCategory&&matchesTerm;
   card.classList.toggle("hidden",!show);
   card.hidden=!show;
   if(show)count++;
  }
  state.textContent="Прикажани архивски медиуми: "+count+" од "+cards.length+
   ". Сегашните адреси и податоци не се потврдени. Автоматско испраќање НЕ е активно.";
 }
 for(const button of filters){
  button.addEventListener("click",()=>{
   category=button.dataset.cat;
   for(const other of filters){
    const active=other===button;
    other.classList.toggle("active",active);
    other.setAttribute("aria-pressed",String(active));
   }
   render();
  });
  button.setAttribute("aria-pressed",String(button.dataset.cat==="all"));
 }
 input.addEventListener("input",render);
 root.dataset.mksMayMediaReady="true";
 render();
})();