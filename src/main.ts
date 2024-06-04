import OBR, { Command, Image, Item, Vector2, buildImage, buildPath } from '@owlbear-rodeo/sdk';
import { CardUrls, Constants } from './utilities/bsConstants';
import * as Utilities from './utilities/bsUtilities';
import './styles/main-style.css'
import { SetupContextMenuButtons } from './contextMenuButtons';
import { BSCACHE } from './utilities/bsSceneCache';

type ProcessCardUrl = (url: string) => string;

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
    backLoaded = true;
    frontLoaded = true;

    defaultDeckBacks = document.getElementById('defaultBacks') as HTMLSelectElement;
    defaultDeckTypes = document.getElementById('defaultDecks') as HTMLSelectElement;

    defaultDeckCreation = document.getElementById('defaultDeckCreation') as HTMLDivElement;
    defaultPanel = document.getElementById('defaultPanel') as HTMLDivElement;
    customDeckCreation = document.getElementById('customDeckCreation') as HTMLDivElement;
    customPanel = document.getElementById('customPanel') as HTMLDivElement;

    frontPreview = document.getElementById('frontPreview') as HTMLImageElement;
    backPreview = document.getElementById('backPreview') as HTMLImageElement;

    selectTokenButton = document.getElementById('selectTokenButton') as HTMLButtonElement;

    useUrlInput = document.getElementById('useUrlInput') as HTMLInputElement;
    useUrlOKButton = document.getElementById('useUrlOKButton') as HTMLButtonElement;

    createDeckButton = document.getElementById('createDeckButton') as HTMLButtonElement;

    constructor()
    {

    }

    public async Testing()
    {
        // Setup Image Fail Checks
        this.frontPreview.onload = () => 
        {
            if (this.frontPreview.src !== 'https://battle-system.com/owlbear/decked-docs/cards/error_card.webp')
                this.frontLoaded = true;
        };
        this.frontPreview.onerror = () =>
        {
            this.frontLoaded = false;
            this.frontPreview.src = 'https://battle-system.com/owlbear/decked-docs/cards/error_card.webp';
        };

        this.backPreview.onload = () => 
        {
            if (this.backPreview.src !== 'https://battle-system.com/owlbear/decked-docs/cards/error_card.webp')
                this.backLoaded = true;
        };
        this.backPreview.onerror = () =>
        {
            this.backLoaded = false;
            this.backPreview.src = 'https://battle-system.com/owlbear/decked-docs/cards/error_card.webp';
        };

        // Setup Deck Backing Select
        CardUrls.DEFAULTBACKS.forEach(back =>
        {
            const name = back.replace(CardUrls.BASE, "").replace(/^backs_/, '').replace(/\.png$/, '');
            const upper = name.charAt(0).toUpperCase() + name.slice(1);
            const option = document.createElement('option');
            option.value = back;
            option.textContent = upper;
            this.defaultDeckBacks.appendChild(option);
        });
        this.defaultDeckBacks.onchange = (e) =>
        {
            const element = e.currentTarget as HTMLSelectElement;
            const value = element.value;
            this.backPreview.src = value;
        };

        // Setup Deck Type Select
        CardUrls.DEFAULTDECKS.forEach(deck =>
        {
            const option = document.createElement('option');
            option.value = deck;
            option.textContent = deck;
            this.defaultDeckTypes.appendChild(option);
        });
        this.defaultDeckTypes.onchange = (e) =>
        {
            const element = e.currentTarget as HTMLSelectElement;
            const value = element.value;
            switch (value)
            {
                case "Base52":
                    this.frontPreview.src = CardUrls.SPADES_KING;
                    break;
                case "Tarot Major":
                    this.frontPreview.src = CardUrls.BASE + "major_tower.webp";
                    break;
                case "Tarot Minor":
                    this.frontPreview.src = CardUrls.BASE + "swords_king.webp";
                    break;
                case "D20":
                    this.frontPreview.src = CardUrls.BASE + "dice_20.webp";
                    break;
            }
        };

        // Setup Tab Controls
        this.defaultDeckCreation.onclick = (e) =>
        {
            e.preventDefault();
            this.defaultPanel.style.display = "block";
            this.defaultDeckCreation.classList.add("selected");

            this.customPanel.style.display = "none";
            this.customDeckCreation.classList.remove("selected");
        };

        this.customDeckCreation.onclick = (e) =>
        {
            e.preventDefault();
            this.defaultPanel.style.display = "none";
            this.defaultDeckCreation.classList.remove("selected");

            this.customPanel.style.display = "block";
            this.customDeckCreation.classList.add("selected");
        };

        // Setup Token Select
        this.selectTokenButton.onclick = async (e) =>
        {
            e.preventDefault();

            const selections = await OBR.player.getSelection();
            if (selections === undefined || selections.length === 0) return;
            const itemsSelected = BSCACHE.sceneItems.filter(x => selections.includes(x.id)) as Image[];
            if (itemsSelected.length === 0) return;
            const imagesSelected = itemsSelected.filter(x => x.image?.url !== undefined);
            if (imagesSelected.length === 0) return;

            this.backLoaded = false;

            const selectedUrl = imagesSelected[0].image.url;
            this.backPreview.src = selectedUrl;
        };

        // Setup URL Select
        this.useUrlOKButton.onclick = async (e) =>
        {
            e.preventDefault();
            const enteredText = this.useUrlInput.value;
            if (!enteredText) return;
            const imageExtensions = /\.(jpg|jpeg|png|gif|webp|webm|mp4)$/i;

            try
            {
                var parsedUrl = new URL(enteredText);
                if ((parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:")
                    && imageExtensions.test(parsedUrl.pathname))
                {
                    this.backLoaded = false;
                    this.backPreview.src = parsedUrl.toString();
                }
                else
                {
                    await OBR.notification.show("Invalid image URL.", "ERROR");
                }
            } catch (_)
            {
                await OBR.notification.show("Invalid image URL.", "ERROR");
            }
        };

        // Setup Create Deck Button
        this.createDeckButton.onclick = async (e) =>
        {
            e.preventDefault();

            if (!this.frontLoaded || !this.backLoaded)
                await OBR.notification.show("Please use valid images before creating the deck.", "ERROR");

            const BACKIMAGE = this.backPreview.src;
            const DECKTYPE = this.defaultDeckTypes.value;
            let deckTypeData: string[];
            let png = false;

            switch (DECKTYPE)
            {
                case "Base52":
                    deckTypeData = CardUrls.DECK52;
                    png = true;
                    break;
                case "Tarot Major":
                    deckTypeData = CardUrls.TAROTMAJOR;
                    break;
                case "Tarot Minor":
                    deckTypeData = CardUrls.TAROTMINOR;
                    break;
                case "D20":
                    deckTypeData = CardUrls.DICECARDS;
                    break;
            }

            const deckData = await DECKEDMAIN.PopulateDefaultDeck(BACKIMAGE, deckTypeData, png ? CardUrls.GETPNGURL : CardUrls.GETWEBPURL);
            const items = DECKEDMAIN.CreateDeck(BACKIMAGE, deckData);

            OBR.scene.items.addItems(items);
        };

        // const makeThing = document.getElementById('makecard') as HTMLButtonElement;
        // makeThing.onclick = async (e) =>
        // {
        //     e.preventDefault();

        //     const item = DECKEDMAIN.CreateCard(
        //         CardUrls.CLUBS_10,
        //         CardUrls.BACK_CLOUDS,
        //         "clubs_10",
        //         true,
        //         Utilities.GetGUID()
        //     )

        //     OBR.scene.items.addItems([item]);
        // };
    }

    public async InitializeDecked(): Promise<void>
    {
        await SetupContextMenuButtons();
        this.Testing();
    }

    public CreateDeck(back: string, deckData: DeckData, position?: Vector2): Item[]
    {
        const size = deckData.Cards[0].BackSize;
        const scale = Utilities.calculateScale(size.x, size.y);
        const backCardUrl = deckData.Cards[0].BackUrl;
        const extension = Utilities.GetImageExtension(backCardUrl);

        const item = buildImage(
            {
                height: size.y,
                width: size.x,
                url: back,
                mime: `image/${extension}`,
            },
            { dpi: 150, offset: { x: 0, y: 0 } })
            .metadata({ [`${Constants.EXTENSIONID}/deck_data`]: deckData })
            .scale(scale)
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

    public CreateCardFromData(cardData: CardData): Image
    {
        const scale = cardData.FaceUp ? Utilities.calculateScale(cardData.FrontSize.x, cardData.FrontSize.y)
            : Utilities.calculateScale(cardData.BackSize.x, cardData.BackSize.y);
        const extension = Utilities.GetImageExtension(cardData.FaceUp ? cardData.FrontUrl : cardData.BackUrl);

        const item = buildImage(
            {
                height: cardData.FaceUp ? cardData.FrontSize.y : cardData.BackSize.y,
                width: cardData.FaceUp ? cardData.FrontSize.x : cardData.BackSize.x,
                url: cardData.FaceUp ? cardData.FrontUrl : cardData.BackUrl,
                mime: `image/${extension}`,
            },
            { dpi: 150, offset: { x: 0, y: 0 } })
            .metadata({ [`${Constants.EXTENSIONID}/card_data`]: cardData })
            .scale(scale)
            .name("Card")
            .layer("PROP")
            .build();

        return item;
    }

    public async PopulateCard()
    {

    }

    public async PopulateDefaultDeck(back: string, deckArray: string[], retrieveFunction: ProcessCardUrl): Promise<DeckData>
    {
        const cardData: CardData[] = [];
        const deckId = Utilities.GetGUID();

        for (const card of deckArray)
        {
            // We already know the default size for the front types
            const backSize = await Utilities.getImageDimensions(back);

            const newCard: CardData =
            {
                BackUrl: back,
                BackSize: backSize,
                FrontUrl: retrieveFunction(card),
                FrontSize: { x: 234, y: 333 },
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