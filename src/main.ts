import OBR, { Command, Image, Item, Vector2, buildImage, buildPath } from '@owlbear-rodeo/sdk';
import { CardUrls, Constants } from './utilities/bsConstants';
import * as Utilities from './utilities/bsUtilities';
import './styles/main-style.css'
import { SetupContextMenuButtons } from './contextMenuButtons';
import { BSCACHE } from './utilities/bsSceneCache';

type ProcessCardUrl = (url: string) => string;

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    Hello.
    <button id="makecard">Make a Card</button>
    <button id="makedeck">Make a Deck</button>
    <button id="makemajor">Make a Major</button>
    <button id="makeminor">Make a Minor</button>
    <button id="maked20">Make a D20</button>
  </div>
`;

async function BeginDecked()
{
    await BSCACHE.InitializeCache();
    await DECKEDMAIN.InitializeDecked();
    BSCACHE.SetupHandlers();
}

OBR.onReady(async () =>
{
    const sceneReady = await OBR.scene.isReady();

    if (sceneReady === false)
    {
        const startup = OBR.scene.onReadyChange(async (ready) =>
        {
            if (ready)
            {
                startup(); // Kill startup Handler
                await BeginDecked();
            }
        });
    }
    else
    {
        await BeginDecked();
    }
});

class Decked
{
    constructor()
    {

    }

    public async Testing()
    {
        const makeDeckThing = document.getElementById('makedeck') as HTMLButtonElement;
        makeDeckThing.onclick = async (e) =>
        {
            e.preventDefault();

            const deckData = DECKEDMAIN.PopulateDeck(CardUrls.BACK_ABSTRACT, CardUrls.DECK52, CardUrls.GETPNGURL);
            const items = DECKEDMAIN.CreateDeck(deckData.Cards[0].BackUrl, deckData);

            OBR.scene.items.addItems(items);
        }

        const makeMajorThing = document.getElementById('makemajor') as HTMLButtonElement;
        makeMajorThing.onclick = async (e) =>
        {
            e.preventDefault();

            const deckData = DECKEDMAIN.PopulateDeck(CardUrls.BACK_ASTRONAUT, CardUrls.TAROTMAJOR, CardUrls.GETWEBPURL);
            const items = DECKEDMAIN.CreateDeck(deckData.Cards[0].BackUrl, deckData);

            OBR.scene.items.addItems(items);
        }

        const makeMinorThing = document.getElementById('makeminor') as HTMLButtonElement;
        makeMinorThing.onclick = async (e) =>
        {
            e.preventDefault();

            const deckData = DECKEDMAIN.PopulateDeck(CardUrls.BACK_SCENE, CardUrls.TAROTMINOR, CardUrls.GETWEBPURL);
            const items = DECKEDMAIN.CreateDeck(deckData.Cards[0].BackUrl, deckData);

            OBR.scene.items.addItems(items);
        }

        const maked20Thing = document.getElementById('maked20') as HTMLButtonElement;
        maked20Thing.onclick = async (e) =>
        {
            e.preventDefault();

            const deckData = DECKEDMAIN.PopulateDeck(CardUrls.BACK_RED, CardUrls.DICECARDS, CardUrls.GETWEBPURL);
            const items = DECKEDMAIN.CreateDeck(deckData.Cards[0].BackUrl, deckData);

            OBR.scene.items.addItems(items);
        }

        const makeThing = document.getElementById('makecard') as HTMLButtonElement;
        makeThing.onclick = async (e) =>
        {
            e.preventDefault();

            const item = DECKEDMAIN.CreateCard(
                CardUrls.CLUBS_10,
                CardUrls.BACK_CLOUDS,
                "clubs_10",
                true,
                Utilities.GetGUID()
            )

            OBR.scene.items.addItems([item]);
        };
    }

    public async InitializeDecked(): Promise<void>
    {
        await SetupContextMenuButtons();
        this.Testing();
    }

    public CreateDeck(back: string, deckData: DeckData, position?: Vector2): Item[]
    {
        const backCardUrl = deckData.Cards[0].BackUrl;
        const extension = Utilities.GetImageExtension(backCardUrl);

        const item = buildImage(
            {
                height: CardUrls.HEIGHT,
                width: CardUrls.WIDTH,
                url: back,
                mime: `image/${extension}`,
            },
            { dpi: 150, offset: { x: 0, y: 0 } })
            .metadata({ [`${Constants.EXTENSIONID}/deck_data`]: deckData })
            .name("Deck")
            .plainText(deckData.Cards.length.toString())
            .layer("PROP")
            .build();
        if (position) item.position = position;

        const commands: any[] = [
            [Command.MOVE, CardUrls.RADIUS, 0],   // Starting point after the first rounded corner
            [Command.LINE, CardUrls.WIDTH - CardUrls.RADIUS, 0],  // Move to the beginning of the second rounded corner
            [Command.QUAD, CardUrls.WIDTH, 0, CardUrls.WIDTH, CardUrls.RADIUS],  // Draw the rounded corner
            [Command.LINE, CardUrls.WIDTH, CardUrls.HEIGHT - CardUrls.RADIUS],  // Move to the beginning of the third rounded corner
            [Command.QUAD, CardUrls.WIDTH, CardUrls.HEIGHT, CardUrls.WIDTH - CardUrls.RADIUS, CardUrls.HEIGHT],  // Draw the rounded corner
            [Command.LINE, CardUrls.RADIUS, CardUrls.HEIGHT],  // Move to the beginning of the fourth rounded corner
            [Command.QUAD, 0, CardUrls.HEIGHT, 0, CardUrls.HEIGHT - CardUrls.RADIUS],  // Draw the rounded corner
            [Command.LINE, 0, CardUrls.RADIUS],  // Move to the beginning of the first rounded corner
            [Command.QUAD, 0, 0, CardUrls.RADIUS, 0],  // Draw the rounded corner
            [Command.CLOSE],
        ];

        for (let i = 0; i < 20; i++)
        {
            const y = CardUrls.HEIGHT - (i * (2 + 2));
            commands.push([Command.MOVE, CardUrls.WIDTH, y - CardUrls.RADIUS]);
            commands.push([Command.QUAD, CardUrls.WIDTH, y, CardUrls.WIDTH - CardUrls.RADIUS, y])
            commands.push([Command.LINE, CardUrls.RADIUS, y]);
            commands.push([Command.QUAD, 0, y, 0, y - CardUrls.RADIUS])
        };

        const lines = buildPath()
            .commands(commands)
            .strokeOpacity(1)
            .strokeWidth(.85)
            .strokeColor("#000000")
            .fillColor("#ffffff")
            .layer("PROP")
            .metadata({ [`${Constants.EXTENSIONID}/deck_id_lines`]: deckData.Id })
            .zIndex(.5)
            .build();
        lines.position = {
            x: item.position.x,
            y: item.position.y + (Math.min(deckData.Cards.length, 75))
        };
        lines.attachedTo = item.id; // Attach to label for cleanup/movement
        lines.disableHit = true;
        return [item, lines];
    }

    public CreateCard(front: string, back: string, value: string, faceUp: boolean, deckId: string): Image
    {
        const extension = Utilities.GetImageExtension(faceUp ? front : back);

        const cardData: CardData =
        {
            BackUrl: back,
            FrontUrl: front,
            FaceUp: faceUp,
            Value: value,
            DeckId: deckId
        }

        const item = buildImage(
            {
                height: CardUrls.HEIGHT,
                width: CardUrls.WIDTH,
                url: faceUp ? front : back,
                mime: `image/${extension}`,
            },
            { dpi: 150, offset: { x: 0, y: 0 } })
            .metadata({ [`${Constants.EXTENSIONID}/card_data`]: cardData })
            .name("Card")
            .layer("PROP")
            .build();

        return item;
    }

    public PopulateDeck(back: string, deckArray: string[], retrieveFunction: ProcessCardUrl): DeckData
    {
        const cardData: CardData[] = [];
        const deckId = Utilities.GetGUID();

        for (const card of deckArray)
        {
            const newCard: CardData =
            {
                BackUrl: back,
                FrontUrl: retrieveFunction(card),
                DeckId: deckId,
                FaceUp: false,
                Value: card
            }
            cardData.push(newCard);
        }

        const deckData: DeckData = {
            Id: deckId,
            Cards: cardData
        }

        return deckData;
    }
}

export const DECKEDMAIN = new Decked();