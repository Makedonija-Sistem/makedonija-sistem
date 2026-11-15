"use strict";
/* MEDIA CONNECT v0.2 - LiveKit pilot client. Never stores invite codes or JWTs.
 * No join occurs until the operator has enabled the standalone server config.
 * Do not turn this into mass messaging or targeted political outreach.
 */
(() => {
  const el=id=>document.getElementById(id);
  const form=el("joinForm"), joinButton=el("joinButton"),leaveButton=el("leaveButton");
  const roleControl=el("role"), codeControl=el("accessCode");
  const status=el("connectionStatus"),pilotStatus=el("pilotStatus");
  const micButton=el("micButton"),camButton=el("camButton"),audioButton=el("audioButton");
  const grid=el("remoteTracks"),empty=el("emptyRoom");
  const cfg=window.MKS_MEDIA_ROOM_CONFIG||{};
  let room=null, currentRole=null, pending=false;
  const tracks=new Map();
  const enabled=cfg.enabled===true &&
    typeof cfg.tokenEndpoint==="string" && /^https:\/\/[^\s]+$/.test(cfg.tokenEndpoint) &&
    typeof cfg.clientSdkUrl==="string" && /^https:\/\/cdn\.jsdelivr\.net\//.test(cfg.clientSdkUrl);
  const setStatus=text=>{status.textContent=text;};
  function buttons() {
    const connected=!!room && room.state==="connected";
    joinButton.disabled=!enabled||pending||connected;
    leaveButton.disabled=!connected && !pending;
    const publish=connected&&(currentRole==="speaker"||currentRole==="host");
    micButton.disabled=!publish;camButton.disabled=!publish;
    audioButton.disabled=!connected;
  }
  function clearRemoteTracks(){
    for(const entry of tracks.values()){
      try{entry.track.detach().forEach(node=>node.remove());}catch{}
      entry.container.remove();
    }
    tracks.clear();
    empty.hidden=false;
  }
  function detachTrack(track,publication,participant) {
    const id=participant.identity+":"+(publication.trackSid||track.sid);
    const entry=tracks.get(id);
    if(entry){entry.container.remove();tracks.delete(id);}
    try{track.detach().forEach(node=>node.remove());}catch{}
    empty.hidden=tracks.size>0;
  }
  function attachTrack(track,publication,participant) {
    if(track.kind!=="audio" && track.kind!=="video")return;
    const id=participant.identity+":"+(publication.trackSid||track.sid);
    if(tracks.has(id))return;
    const tile=document.createElement("div");
    tile.className="trackCard";
    const label=document.createElement("p");label.className="label";
    label.textContent=(participant.name||"Учесник")+" · "+(track.kind==="video"?"видео":"аудио");
    const media=track.attach();
    media.autoplay=true;
    media.playsInline=true;
    if(track.kind==="audio")media.controls=true;
    tile.append(media,label);
    grid.appendChild(tile);
    tracks.set(id,{container:tile,track});
    empty.hidden=true;
  }
  function resetRoom(message){
    const previous=room;room=null;currentRole=null;pending=false;
    if(previous){try{previous.disconnect();}catch{}}
    clearRemoteTracks();
    micButton.setAttribute("aria-pressed","false");
    camButton.setAttribute("aria-pressed","false");
    micButton.textContent="Вклучи микрофон";
    camButton.textContent="Вклучи камера";
    buttons();
    setStatus(message);
  }
  function registerRoomEvents(lk,newRoom) {
    newRoom
      .on(lk.RoomEvent.TrackSubscribed,attachTrack)
      .on(lk.RoomEvent.TrackUnsubscribed,detachTrack)
      .on(lk.RoomEvent.ParticipantDisconnected,participant=>{
        for(const [id,entry] of tracks){
          if(id.startsWith(participant.identity+":")){
            entry.container.remove();
            tracks.delete(id);
            try{entry.track.detach().forEach(node=>node.remove());}catch{}
          }
        }
        empty.hidden=tracks.size>0;
      })
      .on(lk.RoomEvent.Disconnected,()=>{
        if(room===newRoom)resetRoom("Повикот е прекинат. Можеш повторно да се приклучиш.");
      });
  }
  async function loadSdk(){
    if(window.LivekitClient)return window.LivekitClient;
    return await new Promise((resolve,reject)=>{
      const s=document.createElement("script");
      s.src=cfg.clientSdkUrl;s.async=true;s.referrerPolicy="no-referrer";
      s.onload=()=>window.LivekitClient?resolve(window.LivekitClient):reject(new Error("Missing SDK"));
      s.onerror=()=>reject(new Error("Unable to load SDK"));
      document.head.appendChild(s);
    });
  }
  form.addEventListener("submit",async event=>{
    event.preventDefault();
    if(!enabled || pending || room)return;
    const code=codeControl.value;
    if(code.length<24){setStatus("Кодот за покана мора да има најмалку 24 знаци.");return;}
    pending=true;buttons();setStatus("Проверка на поканата и поврзување...");
    try {
      const result=await fetch(cfg.tokenEndpoint,{
        method:"POST",mode:"cors",credentials:"omit",cache:"no-store",redirect:"error",
        referrerPolicy:"no-referrer",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({role:roleControl.value,code})
      });
      codeControl.value="";
      if(!result.ok){
        const msg=result.status===429?"Премногу обиди. Пробај подоцна.":
          result.status===403?"Невалидна покана или неодобрен домен.":
          result.status===503?"Пилотот е исклучен од операторот.":"Неуспешно овластување.";
        throw new Error(msg);
      }
      const data=await result.json();
      if(!data || !/^wss:\/\/[^\s]+$/.test(data.serverUrl||"") ||
         typeof data.token!=="string" || !["viewer","speaker","host"].includes(data.role)) {
        throw new Error("Некоректен одговор од пилотскиот сервер.");
      }
      const lk=await loadSdk();
      const newRoom=new lk.Room({adaptiveStream:true,dynacast:true});
      room=newRoom;currentRole=data.role;
      registerRoomEvents(lk,newRoom);
      await newRoom.connect(data.serverUrl,data.token);
      if(room!==newRoom)return;
      pending=false;
      // Never publish by default. Explicit user action required for media.
      setStatus("Поврзано · "+(currentRole==="viewer"?"гледач":currentRole==="speaker"?"говорник":"модератор")+
        ". Камерата и микрофонот се исклучени.");
      buttons();
    }catch(error){
      codeControl.value="";
      const message=error instanceof Error?error.message:"Непозната грешка.";
      resetRoom(message);
    }
  });
  leaveButton.addEventListener("click",()=>resetRoom("Ја напушти видеосалата."));
  micButton.addEventListener("click",async()=>{
    if(!room||currentRole==="viewer")return;
    micButton.disabled=true;
    try{
      const next=!room.localParticipant.isMicrophoneEnabled;
      await room.localParticipant.setMicrophoneEnabled(next);
      micButton.textContent=next?"Исклучи микрофон":"Вклучи микрофон";
      micButton.setAttribute("aria-pressed",String(next));
    }catch{setStatus("Микрофонот не е достапен или нема дозвола.");}
    buttons();
  });
  camButton.addEventListener("click",async()=>{
    if(!room||currentRole==="viewer")return;
    camButton.disabled=true;
    try{
      const next=!room.localParticipant.isCameraEnabled;
      await room.localParticipant.setCameraEnabled(next);
      camButton.textContent=next?"Исклучи камера":"Вклучи камера";
      camButton.setAttribute("aria-pressed",String(next));
    }catch{setStatus("Камерата не е достапна или нема дозвола.");}
    buttons();
  });
  audioButton.addEventListener("click",async()=>{
    if(!room)return;
    try{await room.startAudio();setStatus("Звукот е дозволен во прелистувачот.");}
    catch{setStatus("Не може да се пушти звук. Провери ги дозволите на прелистувачот.");}
  });
  window.addEventListener("pagehide",()=>{
    if(room){try{room.disconnect();}catch{}}
  });
  if(enabled) {
    pilotStatus.textContent="Конфигурацијата за пилот е вклучена. Пристапот зависи од серверските дозволи.";
    setStatus("Внеси приватен код за покана и избери улога.");
  }
  buttons();
})();
