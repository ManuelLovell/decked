import"./modulepreload-polyfill-B5Qt9EMX.js";import{O as i,C as u,a as r,b as R,c as g,d as U}from"./bsConstants-CGmqgvGh.js";function N(c){return c.type==="IMAGE"}class f{static PLAYER="PLAYER";static PARTY="PARTY";static LOCALITEMS="LOCALITEMS";static SCENEITEMS="SCENEITEMS";static SCENEMETA="SCENEMETADATA";static SCENEGRID="SCENEGRID";static ROOMMETA="ROOMMETADATA";debouncedOnSceneItemsChange;debouncedOnSceneMetadataChange;debouncedOnPartyChange;playerId;playerConnection;playerColor;playerName;playerMetadata;playerRole;currentDealer;party;lastParty;gridDpi;gridScale;sceneItems;sceneSelected;sceneMetadata;sceneReady;activeCards;activeDecks;roomMetadata;theme;caches;USER_REGISTERED;historyLog;sceneMetadataHandler;localItemsHandler;sceneItemsHandler;sceneGridHandler;sceneReadyHandler;playerHandler;partyHandler;themeHandler;roomHandler;constructor(e){this.playerId="",this.playerConnection="",this.playerName="",this.playerColor="",this.playerMetadata={},this.playerRole="PLAYER",this.currentDealer="",this.party=[],this.lastParty=[],this.sceneItems=[],this.sceneSelected=[],this.sceneMetadata={},this.activeCards=[],this.activeDecks=[],this.gridDpi=0,this.gridScale=5,this.sceneReady=!1,this.theme="DARK",this.roomMetadata={},this.USER_REGISTERED=!1,this.caches=e,this.historyLog={},this.debouncedOnSceneItemsChange=S(this.OnSceneItemsChange.bind(this),100),this.debouncedOnSceneMetadataChange=S(this.OnSceneMetadataChanges.bind(this),100),this.debouncedOnPartyChange=S(this.OnPartyChange.bind(this),100)}async InitializeCache(){this.sceneReady=await i.scene.isReady(),this.theme=await i.theme.getTheme(),B(this.theme,document),this.caches.includes(f.PLAYER)&&(this.playerId=await i.player.getId(),this.playerConnection=await i.player.getConnectionId(),this.playerName=await i.player.getName(),this.playerColor=await i.player.getColor(),this.playerMetadata=await i.player.getMetadata(),this.playerRole=await i.player.getRole()),this.caches.includes(f.PARTY)&&(this.party=await i.party.getPlayers(),this.lastParty=this.party),this.caches.includes(f.SCENEITEMS)&&this.sceneReady&&(this.sceneItems=await i.scene.items.getItems()),this.caches.includes(f.SCENEMETA)&&this.sceneReady&&(this.sceneMetadata=await i.scene.getMetadata()),this.caches.includes(f.SCENEGRID)&&this.sceneReady&&(this.gridDpi=await i.scene.grid.getDpi(),this.gridScale=(await i.scene.grid.getScale()).parsed?.multiplier??5),this.caches.includes(f.ROOMMETA)&&(this.roomMetadata=await i.room.getMetadata(),await this.RefreshDealer()),await this.CheckRegistration()}KillHandlers(){this.caches.includes(f.SCENEMETA)&&this.sceneMetadataHandler!==void 0&&this.sceneMetadataHandler(),this.caches.includes(f.SCENEITEMS)&&this.sceneItemsHandler!==void 0&&this.sceneItemsHandler(),this.caches.includes(f.SCENEITEMS)&&this.localItemsHandler!==void 0&&this.localItemsHandler(),this.caches.includes(f.SCENEGRID)&&this.sceneGridHandler!==void 0&&this.sceneGridHandler(),this.caches.includes(f.PLAYER)&&this.playerHandler!==void 0&&this.playerHandler(),this.caches.includes(f.PARTY)&&this.partyHandler!==void 0&&this.partyHandler(),this.caches.includes(f.ROOMMETA)&&this.roomHandler!==void 0&&this.roomHandler(),this.themeHandler!==void 0&&this.themeHandler()}SetupHandlers(){(this.sceneMetadataHandler===void 0||this.sceneMetadataHandler.length===0)&&this.caches.includes(f.SCENEMETA)&&(this.sceneMetadataHandler=i.scene.onMetadataChange(async e=>{this.sceneMetadata=e,this.debouncedOnSceneMetadataChange(e)})),(this.sceneItemsHandler===void 0||this.sceneItemsHandler.length===0)&&this.caches.includes(f.SCENEITEMS)&&(this.sceneItemsHandler=i.scene.items.onChange(async e=>{this.sceneItems=e,this.debouncedOnSceneItemsChange(e)})),(this.sceneGridHandler===void 0||this.sceneGridHandler.length===0)&&this.caches.includes(f.SCENEGRID)&&(this.sceneGridHandler=i.scene.grid.onChange(async e=>{this.gridDpi=e.dpi,this.gridScale=parseInt(e.scale),await this.OnSceneGridChange(e)})),(this.playerHandler===void 0||this.playerHandler.length===0)&&this.caches.includes(f.PLAYER)&&(this.playerHandler=i.player.onChange(async e=>{this.playerName=e.name,this.playerColor=e.color,this.playerId=e.id,this.playerConnection=e.connectionId,this.playerRole=e.role,this.playerMetadata=e.metadata,await this.OnPlayerChange(e)})),(this.partyHandler===void 0||this.partyHandler.length===0)&&this.caches.includes(f.PARTY)&&(this.partyHandler=i.party.onChange(async e=>{this.party=e.filter(s=>s.id!==""),this.debouncedOnPartyChange(e)})),(this.roomHandler===void 0||this.roomHandler.length===0)&&this.caches.includes(f.ROOMMETA)&&(this.roomHandler=i.room.onMetadataChange(async e=>{this.roomMetadata=e,await this.OnRoomMetadataChange(e)})),this.themeHandler===void 0&&(this.themeHandler=i.theme.onChange(async e=>{this.theme=e.mode,await this.OnThemeChange(e)})),this.sceneReadyHandler===void 0&&(this.sceneReadyHandler=i.scene.onReadyChange(async e=>{this.sceneReady=e,e&&(this.sceneItems=await i.scene.items.getItems(N),this.sceneMetadata=await i.scene.getMetadata(),this.gridDpi=await i.scene.grid.getDpi(),this.gridScale=(await i.scene.grid.getScale()).parsed?.multiplier??5),await this.OnSceneReadyChange(e)}))}async CheckRegistration(){try{const e=window.location.origin.includes("localhost")?"eternaldream":"",s={owlbearid:C.playerId},a={method:"POST",headers:new Headers({"Content-Type":"application/json",Authorization:u.ANONAUTH,"x-manuel":e}),body:JSON.stringify(s)},t=await fetch(u.CHECKREGISTRATION,a);if(!t.ok){const o=await t.json();console.error("Error:",o);return}(await t.json()).Data==="OK"?(this.USER_REGISTERED=!0,console.log("Connected")):console.log("Not Registered")}catch(e){console.error("Error:",e)}}async OnSceneMetadataChanges(e){this.playerRole}async OnLocalItemsChange(e){}async OnSceneItemsChange(e){if(this.sceneReady&&this.playerId===this.currentDealer){this.activeCards=this.sceneItems.filter(a=>a.metadata[`${u.EXTENSIONID}/card_data`]!==void 0),this.activeDecks=this.sceneItems.filter(a=>a.metadata[`${u.EXTENSIONID}/deck_data`]!==void 0);const s=[];for(const a of this.activeDecks){for(const t of this.activeCards)if(b(t.position,a.position,25)){const o=t.zIndex>a.zIndex,d=t.metadata[`${u.EXTENSIONID}/card_data`];d.FaceUp=!1,await i.scene.items.updateItems(l=>l.id===a.id,l=>{for(let p of l){const m=p.metadata[`${u.EXTENSIONID}/deck_data`];o?m.Cards.push(d):m.Cards.unshift(d);const h=o?m.Cards[m.Cards.length-1]:m.Cards[0],k=D(h.BackUrl);p.image.url=h.BackUrl,p.image.mime=`image/${k}`,p.text.plainText=m.Cards.length.toString()}}),s.push(t.id)}for(const t of this.activeDecks){if(t.id===a.id||s.includes(a.id))continue;if(b(t.position,a.position,25)){const o=t.zIndex>a.zIndex,d=a.metadata[`${u.EXTENSIONID}/deck_data`],l=t.metadata[`${u.EXTENSIONID}/deck_data`];await i.scene.items.updateItems(m=>m.id===a.id,m=>{for(let h of m){const k=h.metadata[`${u.EXTENSIONID}/deck_data`],y=o?[...k.Cards,...l.Cards]:[...l.Cards,...k.Cards];k.Cards=y;const E=o?k.Cards[k.Cards.length-1]:k.Cards[0],x=D(E.BackUrl);h.image.url=E.BackUrl,h.image.mime=`image/${x}`,h.text.plainText=k.Cards.length.toString()}});const p=C.sceneItems.find(m=>m.attachedTo===a.id&&m.metadata[`${u.EXTENSIONID}/deck_id_lines`]!==void 0);await i.scene.items.updateItems(m=>m.id===p.id,m=>{for(let h of m)h.position={x:a.position.x,y:a.position.y+Math.min(d.Cards.length+l.Cards.length,75)}}),s.push(t.id)}}}s.length>0&&await i.scene.items.deleteItems(s)}}async OnSceneGridChange(e){}async OnSceneReadyChange(e){}async OnPlayerChange(e){e.selection?.length}async OnPartyChange(e){e.length!==this.lastParty.length&&await this.RefreshDealer(),this.lastParty=e,console.log(e)}async OnRoomMetadataChange(e){}async OnThemeChange(e){B(e,document)}async RefreshDealer(){this.currentDealer=this.roomMetadata[`${u.EXTENSIONID}/dealer`];const e=this.currentDealer===this.playerId,s=this.party.find(a=>a.id===this.currentDealer);(!this.currentDealer||!e&&!s)&&await i.room.setMetadata({[`${u.EXTENSIONID}/dealer`]:this.playerId})}}const C=new f([f.PLAYER,f.PARTY,f.SCENEITEMS,f.SCENEMETA,f.ROOMMETA]);function L(){const c=document.createElement("img");return c.id="whatsNewButton",c.style.cursor="pointer",c.setAttribute("class","icon"),c.classList.add("clickable"),c.setAttribute("title","Whats New?"),c.setAttribute("src","/w-info.svg"),c.onclick=async function(){await i.modal.open({id:u.EXTENSIONWHATSNEW,url:`/src/whatsnew/whatsnew.html?subscriber=${C.USER_REGISTERED}`,height:500,width:350})},c}function v(c,e){return c=Math.ceil(c),e=Math.floor(e),Math.floor(Math.random()*(e-c+1))+c}function T(){let c=new Date().getTime();return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,s=>{const a=(c+Math.random()*16)%16|0;return c=Math.floor(c/16),(s==="x"?a:a&3|8).toString(16)})}function b(c,e,s){const a=c.x-e.x,t=c.y-e.y;return Math.sqrt(a*a+t*t)<=s}function M(c){for(let e=c.length-1;e>0;e--){const s=Math.floor(Math.random()*(e+1));[c[e],c[s]]=[c[s],c[e]]}return c}function D(c){const a=new URL(c).pathname.split(".").pop();return a||""}function S(c,e){let s;return function(...t){s&&clearTimeout(s),s=setTimeout(()=>{c(...t),s=void 0},e)}}function w(c,e){const t=234/c,n=333/e;return{x:t,y:n}}function A(c){return new Promise((e,s)=>{const a=new Image;a.onload=()=>{const t={x:a.naturalWidth,y:a.naturalHeight};e(t)},a.onerror=t=>{s(t)},a.src=c})}function B(c,e){const s=window.matchMedia("(prefers-color-scheme: dark)"),a=s.matches?"dark":"light",t=s.matches?"light":"dark";for(var n=0;n<e.styleSheets.length;n++)for(var o=0;o<e.styleSheets[n].cssRules.length;o++){let d=e.styleSheets[n].cssRules[o];d&&d.media&&d.media.mediaText.includes("prefers-color-scheme")&&(c.mode=="LIGHT"?(d.media.appendMedium(`(prefers-color-scheme: ${a})`),d.media.mediaText.includes(t)&&d.media.deleteMedium(`(prefers-color-scheme: ${t})`)):c.mode=="DARK"&&(d.media.appendMedium(`(prefers-color-scheme: ${t})`),d.media.mediaText.includes(a)&&d.media.deleteMedium(`(prefers-color-scheme: ${a})`)))}}async function P(){await i.contextMenu.create({id:u.CUTCARDSID,icons:[{icon:"/icon.svg",label:"Cut Deck",filter:{every:[{key:["metadata",`${u.EXTENSIONID}/deck_data`],value:void 0,operator:"!=",coordinator:"&&"}],max:1}}],async onClick(c,e){for(const s of c.items){const a=s.metadata[`${u.EXTENSIONID}/deck_data`];if(a.Cards.length<=3)await i.notification.show("You need at least four cards to cut the deck.");else{const t=Math.ceil(a.Cards.length/2),n=a.Cards.slice(0,t),o=a.Cards.slice(t);await i.scene.items.updateItems(c.items,h=>{for(let k of h){const y=n[n.length-1],E=D(y.BackUrl);k.metadata[`${u.EXTENSIONID}/deck_data`]={Id:a.Id,Cards:n},k.image.url=y.BackUrl,k.image.mime=`image/${E}`,k.text.plainText=n.length.toString()}});const d=C.sceneItems.find(h=>h.attachedTo===s.id&&h.metadata[`${u.EXTENSIONID}/deck_id_lines`]!==void 0);await i.scene.items.updateItems(h=>h.id===d.id,h=>{for(let k of h)k.position={x:s.position.x,y:s.position.y+Math.min(n.length,75)}});const l={x:s.position.x+300,y:s.position.y},p={Cards:o,Id:o[0].DeckId},m=I.CreateDeck(p,l);i.scene.items.addItems(m)}}}}),await i.contextMenu.create({id:u.SHUFFLECARDSID,icons:[{icon:"/icon.svg",label:"Shuffle Cards",filter:{every:[{key:["metadata",`${u.EXTENSIONID}/deck_data`],value:void 0,operator:"!=",coordinator:"&&"}]}}],async onClick(c,e){await i.scene.items.updateItems(c.items,s=>{for(let a of s){const t=a.metadata[`${u.EXTENSIONID}/deck_data`];t.Cards=M(t.Cards);const n=t.Cards[t.Cards.length-1],o=D(n.BackUrl);a.image.url=n.BackUrl,a.image.mime=`image/${o}`}}),await i.notification.show("The deck has been shuffled.","DEFAULT")}}),await i.contextMenu.create({id:u.FLIPCARDID,icons:[{icon:"/icon.svg",label:"Flip Card",filter:{every:[{key:["metadata",`${u.EXTENSIONID}/card_data`],value:void 0,operator:"!=",coordinator:"&&"}]}}],async onClick(c,e){await i.scene.items.updateItems(c.items,s=>{for(let a of s){const t=a.metadata[`${u.EXTENSIONID}/card_data`],n=D(t.FaceUp===!0?t.BackUrl:t.FrontUrl),o=t.FaceUp===!0?w(t.BackSize.x,t.BackSize.y):w(t.FrontSize.x,t.FrontSize.y);a.image.url=t.FaceUp===!0?t.BackUrl:t.FrontUrl,a.image.mime=`image/${n}`,a.image.width=t.FaceUp===!0?t.BackSize.x:t.FrontSize.x,a.image.height=t.FaceUp===!0?t.BackSize.y:t.FrontSize.y,a.scale=o,t.FaceUp=t.FaceUp!==!0,a.metadata[`${u.EXTENSIONID}/card_data`]=t}})}}),await i.contextMenu.create({id:u.GROUPCARDSID,icons:[{icon:"/icon.svg",label:"Group Cards",filter:{every:[{key:["metadata",`${u.EXTENSIONID}/card_data`],value:void 0,operator:"!=",coordinator:"&&"}],min:2}}],async onClick(c,e){const a=c.items[0].position,t=[];for(let d of c.items){const l=d.metadata[`${u.EXTENSIONID}/card_data`];l.FaceUp=!1,t.push(l)}const n={Cards:t,Id:t[0].DeckId},o=I.CreateDeck(n,a);i.scene.items.addItems(o),i.scene.items.deleteItems(c.items.map(d=>d.id))}}),await i.contextMenu.create({id:u.DRAWCARDID,icons:[{icon:"/icon.svg",label:"Draw Card",filter:{every:[{key:["metadata",`${u.EXTENSIONID}/deck_data`],value:void 0,operator:"!=",coordinator:"&&"}]}}],async onClick(c,e){const s=[];let a=300+v(10,35),t=0+v(10,35);for(const n of c.items){const o=n.metadata[`${u.EXTENSIONID}/deck_data`],d=o.Cards[o.Cards.length-1];if(d){const l=I.CreateCardFromData(d);if(l.position={x:n.position.x+a,y:n.position.y+t},s.push(l),o.Cards.length>2){await i.scene.items.updateItems(c.items,m=>{for(let h of m){const k=h.metadata[`${u.EXTENSIONID}/deck_data`];k.Cards.pop();const y=k.Cards[k.Cards.length-1],E=D(y.BackUrl);h.image.url=y.BackUrl,h.image.mime=`image/${E}`,h.text.plainText=k.Cards.length.toString()}});const p=C.sceneItems.find(m=>m.attachedTo===n.id&&m.metadata[`${u.EXTENSIONID}/deck_id_lines`]!==void 0);await i.scene.items.updateItems(m=>m.id===p.id,m=>{for(let h of m)h.position={x:n.position.x,y:n.position.y+Math.min(o.Cards.length,75)}})}else if(o.Cards.length===2){const p=o.Cards[0],m=I.CreateCardFromData(p);m.position={x:n.position.x,y:n.position.y},s.push(m),await i.scene.items.deleteItems(c.items.map(h=>h.id))}}}await i.scene.items.addItems(s)}})}async function O(){await C.InitializeCache(),await I.InitializeDecked(),C.SetupHandlers()}i.onReady(async()=>{if(await i.scene.isReady()===!1){const e=i.scene.onReadyChange(async s=>{s&&(e(),await O())})}else await O()});class H{customLoadedDeck;customLoadedDeckId;backLoaded=!0;frontLoaded=!0;customBackLoaded=!0;customFrontLoaded=!0;defaultHeight=406;customHeight=524;defaultDeckBacks=document.getElementById("defaultBacks");defaultDeckTypes=document.getElementById("defaultDecks");defaultDeckCreation=document.getElementById("defaultDeckCreation");defaultPanel=document.getElementById("defaultPanel");customDeckCreation=document.getElementById("customDeckCreation");customPanel=document.getElementById("customPanel");frontPreview=document.getElementById("frontPreview");backPreview=document.getElementById("backPreview");selectTokenButton=document.getElementById("selectTokenButton");useUrlInput=document.getElementById("useUrlInput");useUrlOKButton=document.getElementById("useUrlOKButton");createDeckButton=document.getElementById("createDeckButton");customFrontPreview=document.getElementById("customFrontPreview");customBackPreview=document.getElementById("customBackPreview");customDefaultBacks=document.getElementById("customDefaultBacks");customSelectTokenButtonBack=document.getElementById("customSelectTokenButtonBack");customUseUrlInputBack=document.getElementById("customUseUrlInputBack");customUseUrlOKButtonBack=document.getElementById("customUseUrlOKButtonBack");addToDeckButton=document.getElementById("addToDeckButton");customDefaultFronts=document.getElementById("customDefaultFronts");customSelectTokenButtonFront=document.getElementById("customSelectTokenButtonFront");customUseUrlInputFront=document.getElementById("customUseUrlInputFront");customUseUrlOKButtonFront=document.getElementById("customUseUrlOKButtonFront");customCardValueButton=document.getElementById("customCardValueButton");deckDatabaseTable=document.getElementById("deckDatabaseTable");createCustomDeck=document.getElementById("createCustomDeck");clearCustomDeck=document.getElementById("clearCustomDeck");importCustomDeck=document.getElementById("importCustomDeck");exportCustomDeck=document.getElementById("exportCustomDeck");constructor(){this.customLoadedDeck=[],this.customLoadedDeckId=T()}SetupWhatsNew(){document.getElementById("whatsNewContainer").appendChild(L())}SetupTabControls(){this.defaultDeckCreation.onclick=async e=>{e.preventDefault(),this.defaultDeckCreation.classList.contains("selected")||await i.action.setHeight(this.defaultHeight),this.defaultPanel.style.display="block",this.defaultDeckCreation.classList.add("selected"),this.customPanel.style.display="none",this.customDeckCreation.classList.remove("selected")},this.customDeckCreation.onclick=async e=>{e.preventDefault(),this.customDeckCreation.classList.contains("selected")||await i.action.setHeight(this.customHeight),this.defaultPanel.style.display="none",this.defaultDeckCreation.classList.remove("selected"),this.customPanel.style.display="block",this.customDeckCreation.classList.add("selected")}}SetupStandardDeckControls(){this.frontPreview.onload=()=>{this.frontPreview.src!=="https://battle-system.com/owlbear/decked-docs/cards/error_card.webp"&&(this.frontLoaded=!0)},this.frontPreview.onerror=()=>{this.frontLoaded=!1,this.frontPreview.src="https://battle-system.com/owlbear/decked-docs/cards/error_card.webp"},this.backPreview.onload=()=>{this.backPreview.src!=="https://battle-system.com/owlbear/decked-docs/cards/error_card.webp"&&(this.backLoaded=!0)},this.backPreview.onerror=()=>{this.backLoaded=!1,this.backPreview.src="https://battle-system.com/owlbear/decked-docs/cards/error_card.webp"},r.DEFAULTBACKS.forEach(e=>{const s=e.replace(r.BASE,"").replace(/^backs_/,"").replace(/\.png$/,""),a=s.charAt(0).toUpperCase()+s.slice(1),t=document.createElement("option");t.value=e,t.textContent=a,this.defaultDeckBacks.appendChild(t)}),this.defaultDeckBacks.onchange=e=>{const a=e.currentTarget.value;this.backPreview.src=a},r.DEFAULTDECKS.forEach(e=>{const s=document.createElement("option");s.value=e,s.textContent=e,this.defaultDeckTypes.appendChild(s)}),this.defaultDeckTypes.onchange=e=>{switch(e.currentTarget.value){case"Base52":this.frontPreview.src=r.SPADES_KING;break;case"Tarot Major":this.frontPreview.src=r.BASE+"major_tower.webp";break;case"Tarot Minor":this.frontPreview.src=r.BASE+"swords_king.webp";break;case"D20":this.frontPreview.src=r.BASE+"dice_20.webp";break}},this.selectTokenButton.onclick=async e=>{e.preventDefault();const s=await i.player.getSelection();if(s===void 0||s.length===0)return;const a=C.sceneItems.filter(o=>s.includes(o.id));if(a.length===0)return;const t=a.filter(o=>o.image?.url!==void 0);if(t.length===0)return;this.backLoaded=!1;const n=t[0].image.url;this.backPreview.src=n},this.useUrlOKButton.onclick=async e=>{e.preventDefault();const s=this.useUrlInput.value;if(!s)return;const a=/\.(jpg|jpeg|png|gif|webp|webm|mp4)$/i;try{var t=new URL(s);(t.protocol==="http:"||t.protocol==="https:")&&a.test(t.pathname)?(this.backLoaded=!1,this.backPreview.src=t.toString()):await i.notification.show("Invalid image URL.","ERROR")}catch{await i.notification.show("Invalid image URL.","ERROR")}},this.createDeckButton.onclick=async e=>{if(e.preventDefault(),!this.frontLoaded||!this.backLoaded){await i.notification.show("Please use valid images before creating the deck.","ERROR");return}const s=this.backPreview.src,a=this.defaultDeckTypes.value;let t,n=!1;switch(a){case"Base52":t=r.DECK52,n=!0;break;case"Tarot Major":t=r.TAROTMAJOR;break;case"Tarot Minor":t=r.TAROTMINOR;break;case"D20":t=r.DICECARDS;break}const o=await I.PopulateDefaultDeck(s,t,n?r.GETPNGURL:r.GETWEBPURL),d=I.CreateDeck(o);await i.scene.items.addItems(d)}}SetupCustomDeckControls(){this.customFrontPreview.onload=()=>{this.customFrontPreview.src!=="https://battle-system.com/owlbear/decked-docs/cards/error_card.webp"&&(this.customFrontLoaded=!0)},this.customFrontPreview.onerror=()=>{this.customFrontLoaded=!1,this.customFrontPreview.src="https://battle-system.com/owlbear/decked-docs/cards/error_card.webp"},this.customBackPreview.onload=()=>{this.customBackPreview.src!=="https://battle-system.com/owlbear/decked-docs/cards/error_card.webp"&&(this.customBackLoaded=!0)},this.customBackPreview.onerror=()=>{this.customBackLoaded=!1,this.customBackPreview.src="https://battle-system.com/owlbear/decked-docs/cards/error_card.webp"},r.DEFAULTBACKS.forEach(a=>{const t=a.replace(r.BASE,"").replace(/^backs_/,"").replace(/\.png$/,""),n=t.charAt(0).toUpperCase()+t.slice(1),o=document.createElement("option");o.value=a,o.textContent=n,this.customDefaultBacks.appendChild(o)}),this.customDefaultBacks.onchange=a=>{const n=a.currentTarget.value;this.customBackPreview.src=n},this.GetCardOptionFromList(r.DECK52,this.customDefaultFronts,!1),this.GetCardOptionFromList(r.TAROTMAJOR,this.customDefaultFronts,!0),this.GetCardOptionFromList(r.TAROTMINOR,this.customDefaultFronts,!0),this.GetCardOptionFromList(r.DICECARDS,this.customDefaultFronts,!0),this.customDefaultFronts.onchange=a=>{const n=a.currentTarget.value;this.customFrontPreview.src=n},this.customSelectTokenButtonBack.onclick=async a=>{a.preventDefault();const t=await i.player.getSelection();if(t===void 0||t.length===0)return;const n=C.sceneItems.filter(l=>t.includes(l.id));if(n.length===0)return;const o=n.filter(l=>l.image?.url!==void 0);if(o.length===0)return;this.customBackLoaded=!1;const d=o[0].image.url;this.customBackPreview.src=d},this.customSelectTokenButtonFront.onclick=async a=>{a.preventDefault();const t=await i.player.getSelection();if(t===void 0||t.length===0)return;const n=C.sceneItems.filter(l=>t.includes(l.id));if(n.length===0)return;const o=n.filter(l=>l.image?.url!==void 0);if(o.length===0)return;this.customFrontLoaded=!1;const d=o[0].image.url;this.customFrontPreview.src=d},this.customUseUrlOKButtonBack.onclick=async a=>{a.preventDefault();const t=this.customUseUrlInputBack.value;if(!t)return;const n=/\.(jpg|jpeg|png|gif|webp|webm|mp4)$/i;try{var o=new URL(t);(o.protocol==="http:"||o.protocol==="https:")&&n.test(o.pathname)?(this.customBackLoaded=!1,this.customBackPreview.src=o.toString()):await i.notification.show("Invalid image URL.","ERROR")}catch{await i.notification.show("Invalid image URL.","ERROR")}},this.customUseUrlOKButtonFront.onclick=async a=>{a.preventDefault();const t=this.customUseUrlInputFront.value;if(!t)return;const n=/\.(jpg|jpeg|png|gif|webp|webm|mp4)$/i;try{var o=new URL(t);(o.protocol==="http:"||o.protocol==="https:")&&n.test(o.pathname)?(this.customFrontLoaded=!1,this.customFrontPreview.src=o.toString()):await i.notification.show("Invalid image URL.","ERROR")}catch{await i.notification.show("Invalid image URL.","ERROR")}},this.addToDeckButton.onclick=async a=>{if(a.preventDefault(),!this.customFrontLoaded||!this.customBackLoaded){await i.notification.show("Please use valid images before adding to the deck.","ERROR");return}const t=this.customFrontPreview.src,n={x:this.customFrontPreview.naturalWidth,y:this.customFrontPreview.naturalHeight},o=this.customBackPreview.src,d={x:this.customBackPreview.naturalWidth,y:this.customBackPreview.naturalHeight};let l=this.customCardValueButton.value;(l==null||l.trim()==="")&&(l="Unknown Name");const p=T(),m={FrontUrl:t,FrontSize:n,BackUrl:o,BackSize:d,Value:l,FaceUp:!1,DeckId:this.customLoadedDeckId,CardId:p};this.customLoadedDeck.push(m),this.AppendCardToDatabaseTable(p,l)},this.createCustomDeck.onclick=async a=>{if(a.preventDefault(),this.customLoadedDeck.length===0){await i.notification.show("Cannot create an empty deck.","ERROR");return}else if(this.customLoadedDeck.length===1){await i.notification.show("For a single card, use the 'Create' Button next to the card name.","DEFAULT");return}const t={Id:this.customLoadedDeckId,Cards:this.customLoadedDeck},n=this.CreateDeck(t);await i.scene.items.addItems(n)};let e=!1;this.clearCustomDeck.onclick=async a=>{if(a.preventDefault(),this.customLoadedDeck.length===0){await i.notification.show("There are no cards to clear.","ERROR");return}e?(this.deckDatabaseTable.innerHTML="",this.customLoadedDeck=[],this.customLoadedDeckId=T(),this.clearCustomDeck.style.backgroundColor="rgba(30, 34, 49, 0.5)",this.clearCustomDeck.innerText="Clear",e=!1):(e=!0,this.clearCustomDeck.style.backgroundColor="darkred",this.clearCustomDeck.innerText="You Sure?",setTimeout(()=>{e=!1,this.clearCustomDeck.style.backgroundColor="rgba(30, 34, 49, 0.5)",this.clearCustomDeck.innerText="Clear"},3e3))};const s=document.createElement("input");s.type="file",s.id="fileButton",s.title="Choose a file to import",s.className="tinyType",s.hidden=!0,s.onchange=async function(){if(s.files&&s.files.length>0){let a=s.files[0],t=new FileReader;t.readAsText(a),t.onload=async function(){try{const n=JSON.parse(t.result);I.customLoadedDeckId=n.Id,I.customLoadedDeck=n.Cards;for(const o of I.customLoadedDeck)I.AppendCardToDatabaseTable(o.CardId,o.Value);i.notification.show("Import Complete!","SUCCESS")}catch(n){i.notification.show(`The import failed - ${n}`,"ERROR")}},t.onerror=function(){console.log(t.error)}}},this.importCustomDeck.onclick=async a=>{a.preventDefault(),s.click()},this.exportCustomDeck.onclick=async a=>{a.preventDefault();const t={Id:this.customLoadedDeckId,Cards:this.customLoadedDeck};var n=document.createElement("a"),o=new Blob([JSON.stringify(t)],{type:"text/plain"});n.href=URL.createObjectURL(o),n.download=`DeckedExport-${Date.now()}`,document.body.appendChild(n),n.click(),document.body.removeChild(n)}}async Testing(){}async InitializeDecked(){await P(),this.Testing(),this.SetupWhatsNew(),this.SetupTabControls(),this.SetupStandardDeckControls(),this.SetupCustomDeckControls()}CreateDeck(e,s){const a=e.Cards[0].BackSize,t=w(a.x,a.y),n=e.Cards[e.Cards.length-1].BackUrl,o=D(n),d=R({height:a.y,width:a.x,url:n,mime:`image/${o}`},{dpi:150,offset:{x:0,y:0}}).metadata({[`${u.EXTENSIONID}/deck_data`]:e}).scale(t).name("Deck").plainText(e.Cards.length.toString()).layer("PROP").build();s&&(d.position=s);const l=[[g.MOVE,r.RADIUS,0],[g.LINE,r.WIDTH-r.RADIUS,0],[g.QUAD,r.WIDTH,0,r.WIDTH,r.RADIUS],[g.LINE,r.WIDTH,r.HEIGHT-r.RADIUS],[g.QUAD,r.WIDTH,r.HEIGHT,r.WIDTH-r.RADIUS,r.HEIGHT],[g.LINE,r.RADIUS,r.HEIGHT],[g.QUAD,0,r.HEIGHT,0,r.HEIGHT-r.RADIUS],[g.LINE,0,r.RADIUS],[g.QUAD,0,0,r.RADIUS,0],[g.CLOSE]];for(let m=0;m<20;m++){const h=r.HEIGHT-m*4;l.push([g.MOVE,r.WIDTH,h-r.RADIUS]),l.push([g.QUAD,r.WIDTH,h,r.WIDTH-r.RADIUS,h]),l.push([g.LINE,r.RADIUS,h]),l.push([g.QUAD,0,h,0,h-r.RADIUS])}const p=U().commands(l).strokeOpacity(1).strokeWidth(.85).strokeColor("#000000").fillColor("#ffffff").layer("PROP").metadata({[`${u.EXTENSIONID}/deck_id_lines`]:e.Id}).zIndex(.5).build();return p.position={x:d.position.x,y:d.position.y+Math.min(e.Cards.length,75)},p.attachedTo=d.id,p.disableHit=!0,[d,p]}CreateCardFromData(e){const s=e.FaceUp?w(e.FrontSize.x,e.FrontSize.y):w(e.BackSize.x,e.BackSize.y),a=D(e.FaceUp?e.FrontUrl:e.BackUrl);return R({height:e.FaceUp?e.FrontSize.y:e.BackSize.y,width:e.FaceUp?e.FrontSize.x:e.BackSize.x,url:e.FaceUp?e.FrontUrl:e.BackUrl,mime:`image/${a}`},{dpi:150,offset:{x:0,y:0}}).metadata({[`${u.EXTENSIONID}/card_data`]:e}).scale(s).name("Card").layer("PROP").build()}async PopulateCard(){}AppendCardToDatabaseTable(e,s){const a=document.createElement("tr");a.id=e;const t=document.createElement("td");t.textContent=s,a.appendChild(t);const n=document.createElement("td"),o=document.createElement("button");o.textContent="Create",o.classList.add("confirm-button"),o.onclick=async p=>{p.preventDefault();const m=p.target.closest("tr"),h=this.customLoadedDeck.find(y=>y.CardId===m.id);if(!h){await i.notification.show("Unable to find card data.","ERROR"),m.remove();return}const k=I.CreateCardFromData(h);await i.scene.items.addItems([k])},n.appendChild(o),a.appendChild(n);const d=document.createElement("td"),l=document.createElement("button");l.textContent="Remove",l.classList.add("confirm-button"),l.onclick=async p=>{p.preventDefault();const m=p.target.closest("tr");this.customLoadedDeck=this.customLoadedDeck.filter(h=>h.CardId!==m.id),m.remove()},d.appendChild(l),a.appendChild(d),this.deckDatabaseTable.appendChild(a)}GetCardOptionFromList(e,s,a){for(const t of e){const d=t.split("_").map(p=>p.charAt(0).toUpperCase()+p.slice(1)).join(" "),l=document.createElement("option");l.value=`${r.BASE}${t}${a?".webp":".png"}`,l.textContent=d,s.appendChild(l)}}async PopulateDefaultDeck(e,s,a){const t=[],n=T();for(const d of s){const l=await A(e),p={BackUrl:e,BackSize:l,FrontUrl:a(d),FrontSize:{x:234,y:333},DeckId:n,FaceUp:!1,Value:d};t.push(p)}return{Id:n,Cards:t}}}const I=new H;