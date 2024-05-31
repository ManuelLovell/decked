import OBR from "@owlbear-rodeo/sdk";
import { Constants } from "../utilities/bsConstants";
import './w-style.css'


const whatsnew = document.querySelector<HTMLDivElement>('#bs-whatsnew')!;
const footer = document.querySelector<HTMLElement>('#bs-whatsnew-notes')!;

whatsnew.innerHTML = `
  <div id="newsContainer">
    <h1>Decked! 5/29</h1>
    Another one.
    </br>
    </div>
`;

OBR.onReady(async () =>
{
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const subscriberId = urlParams.get('subscriber')!;
    const subscriber = subscriberId === "true";

    footer.innerHTML = `
    <div id="footButtonContainer">
        <button id="discordButton" type="button" title="Join the Owlbear-Rodeo Discord"><embed class="svg discord" src="/w-discord.svg" /></button>
        <button id="patreonButton" type="button" ${subscriber ? 'title="Thank you for subscribing!"': 'title="Check out the Battle-System Patreon"'}>
        ${subscriber ? '<embed id="patreonLogo" class="svg thankyou" src="/thankyou.svg" />'
            : '<embed id="patreonLogo" class="svg patreon" src="/w-patreon.png" />'}</button>
    </div>
    <button id="closeButton" type="button" title="Close this window"><embed class="svg close" src="/w-close.svg" /></button>
    `;

    const closebutton = document.getElementById('closeButton');
    closebutton!.onclick = async () =>
    {
        await OBR.modal.close(Constants.EXTENSIONWHATSNEW);
    };

    const discordButton = document.getElementById('discordButton');
    discordButton!.onclick = async (e) =>
    {
        e.preventDefault();
        window.open("https://discord.gg/ANZKDmWzr6", "_blank");
    };

    const patreonButton = document.getElementById('patreonButton');
    patreonButton!.onclick = async (e) =>
    {
        e.preventDefault();
        window.open("https://www.patreon.com/battlesystem", "_blank");
    };
});
