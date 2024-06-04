import"./modulepreload-polyfill-B5Qt9EMX.js";import{O as e,C as a}from"./bsConstants-Ci3gOeKI.js";const d=document.querySelector("#bs-whatsnew"),i=document.querySelector("#bs-whatsnew-notes");d.innerHTML=`
  <div id="newsContainer">
    <h1>Decked! 5/29</h1>
    Another one.
    </br>
    </div>
`;e.onReady(async()=>{const n=window.location.search,o=new URLSearchParams(n).get("subscriber")==="true";i.innerHTML=`
    <div id="footButtonContainer">
        <button id="discordButton" type="button" title="Join the Owlbear-Rodeo Discord"><embed class="svg discord" src="/w-discord.svg" /></button>
        <button id="patreonButton" type="button" ${o?'title="Thank you for subscribing!"':'title="Check out the Battle-System Patreon"'}>
        ${o?'<embed id="patreonLogo" class="svg thankyou" src="/thankyou.svg" />':'<embed id="patreonLogo" class="svg patreon" src="/w-patreon.png" />'}</button>
    </div>
    <button id="closeButton" type="button" title="Close this window"><embed class="svg close" src="/w-close.svg" /></button>
    `;const s=document.getElementById("closeButton");s.onclick=async()=>{await e.modal.close(a.EXTENSIONWHATSNEW)};const c=document.getElementById("discordButton");c.onclick=async t=>{t.preventDefault(),window.open("https://discord.gg/ANZKDmWzr6","_blank")};const r=document.getElementById("patreonButton");r.onclick=async t=>{t.preventDefault(),window.open("https://www.patreon.com/battlesystem","_blank")}});
