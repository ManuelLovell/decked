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
    Got a little bored with general maintenance and documentation, and I know a 'Deck of Cards' has been on everyone's wishlist for awhile.
    </br>
    </br> Made this pretty configurable, so hopefully it scratches all the itches.
    </br>
    </br> I don't plan on adding any specific card sets to this. The cards that are in the defaults are all public domain. I'd like to not be sued.
    </br> The custom deck creator will allow you to pass in IMG links and it should fit the images to the cards, though. So you can do as you like with that.
    </br> Also the Export/Import features should allow for saving your decks when not in use.
    </br> Or even sharing with others! But be MINDFUL that any cards made from tokens that YOU have in YOUR account won't transfer the same way.
    </br>
    </br> So if you want to share a deck with someone, make sure it's all public URLs and not made from your tokens.
    </br> Have fun!
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
        ${subscriber ? '<embed id="patreonLogo" class="svg thankyou" src="/w-thankyou.svg" />'
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
