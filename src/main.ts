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
    customLoadedDeck: CardData[];
    customLoadedDeckId: string;

    backLoaded = true;
    frontLoaded = true;

    customBackLoaded = true;
    customFrontLoaded = true;

    defaultHeight = 408;
    customHeight = 526;

    // Standard Card Controls
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

    // Custom Card Controls
    customFrontPreview = document.getElementById('customFrontPreview') as HTMLImageElement;
    customBackPreview = document.getElementById('customBackPreview') as HTMLImageElement;

    customDefaultBacks = document.getElementById('customDefaultBacks') as HTMLSelectElement;
    customSelectTokenButtonBack = document.getElementById('customSelectTokenButtonBack') as HTMLButtonElement;
    customUseUrlInputBack = document.getElementById('customUseUrlInputBack') as HTMLInputElement;
    customUseUrlOKButtonBack = document.getElementById('customUseUrlOKButtonBack') as HTMLButtonElement;
    addToDeckButton = document.getElementById('addToDeckButton') as HTMLButtonElement;

    customDefaultFronts = document.getElementById('customDefaultFronts') as HTMLSelectElement;
    customSelectTokenButtonFront = document.getElementById('customSelectTokenButtonFront') as HTMLButtonElement;
    customUseUrlInputFront = document.getElementById('customUseUrlInputFront') as HTMLInputElement;
    customUseUrlOKButtonFront = document.getElementById('customUseUrlOKButtonFront') as HTMLButtonElement;
    customCardValueButton = document.getElementById('customCardValueButton') as HTMLInputElement;

    // Deck Management Controls
    deckDatabaseTable = document.getElementById('deckDatabaseTable') as HTMLTableElement;
    createCustomDeck = document.getElementById('createCustomDeck') as HTMLButtonElement;
    clearCustomDeck = document.getElementById('clearCustomDeck') as HTMLButtonElement;
    importCustomDeck = document.getElementById('importCustomDeck') as HTMLButtonElement;
    exportCustomDeck = document.getElementById('exportCustomDeck') as HTMLButtonElement;

    constructor()
    {
        this.customLoadedDeck = [];
        this.customLoadedDeckId = Utilities.GetGUID();
    }

    public SetupWhatsNew()
    {
        const whatsNewContainer = document.getElementById("whatsNewContainer")!;
        whatsNewContainer.appendChild(Utilities.GetWhatsNewButton());
    }
    public SetupTabControls()
    {
        // Setup Tab Controls
        this.defaultDeckCreation.onclick = async (e) =>
        {
            e.preventDefault();
            if (!this.defaultDeckCreation.classList.contains("selected"))
            {
                await OBR.action.setHeight(this.defaultHeight);
            }
            this.defaultPanel.style.display = "block";
            this.defaultDeckCreation.classList.add("selected");

            this.customPanel.style.display = "none";
            this.customDeckCreation.classList.remove("selected");
        };

        this.customDeckCreation.onclick = async (e) =>
        {
            e.preventDefault();
            if (!this.customDeckCreation.classList.contains("selected"))
            {
                await OBR.action.setHeight(this.customHeight);
            }
            this.defaultPanel.style.display = "none";
            this.defaultDeckCreation.classList.remove("selected");

            this.customPanel.style.display = "block";
            this.customDeckCreation.classList.add("selected");
        };
    }

    public SetupStandardDeckControls()
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
                    this.frontPreview.src = CardUrls.BASE + "dicecard_20.webp";
                    break;
            }
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
            {
                await OBR.notification.show("Please use valid images before creating the deck.", "ERROR");
                return;
            }

            if (this.createDeckButton.disabled === true)
            {
                return;
            }
            this.createDeckButton.disabled = true;
            this.createDeckButton.innerText = "Working...";

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
            const screenPosition = await DECKEDMAIN.GetScreenCenter();
            const items = DECKEDMAIN.CreateDeck(deckData, screenPosition);

            await OBR.scene.items.addItems(items);
            this.createDeckButton.disabled = false;
            this.createDeckButton.innerText = "Create Deck";
        };
    }

    public SetupCustomDeckControls()
    {
        // Setup Image Fail Checks
        this.customFrontPreview.onload = () => 
        {
            if (this.customFrontPreview.src !== 'https://battle-system.com/owlbear/decked-docs/cards/error_card.webp')
                this.customFrontLoaded = true;
        };
        this.customFrontPreview.onerror = () =>
        {
            this.customFrontLoaded = false;
            this.customFrontPreview.src = 'https://battle-system.com/owlbear/decked-docs/cards/error_card.webp';
        };

        this.customBackPreview.onload = () => 
        {
            if (this.customBackPreview.src !== 'https://battle-system.com/owlbear/decked-docs/cards/error_card.webp')
                this.customBackLoaded = true;
        };
        this.customBackPreview.onerror = () =>
        {
            this.customBackLoaded = false;
            this.customBackPreview.src = 'https://battle-system.com/owlbear/decked-docs/cards/error_card.webp';
        };

        // Setup Deck Backing Select
        // Keeping this seperate in case new options arrive for Custom
        // Otherwise combine later to avoid two loops
        CardUrls.DEFAULTBACKS.forEach(back =>
        {
            const name = back.replace(CardUrls.BASE, "").replace(/^backs_/, '').replace(/\.png$/, '');
            const upper = name.charAt(0).toUpperCase() + name.slice(1);
            const option = document.createElement('option');
            option.value = back;
            option.textContent = upper;
            this.customDefaultBacks.appendChild(option);
        });
        this.customDefaultBacks.onchange = (e) =>
        {
            const element = e.currentTarget as HTMLSelectElement;
            const value = element.value;
            this.customBackPreview.src = value;
        };

        // Setup Default Card List
        this.GetCardOptionFromList(CardUrls.DECK52, this.customDefaultFronts, false);
        this.GetCardOptionFromList(CardUrls.TAROTMAJOR, this.customDefaultFronts, true);
        this.GetCardOptionFromList(CardUrls.TAROTMINOR, this.customDefaultFronts, true);
        this.GetCardOptionFromList(CardUrls.DICECARDS, this.customDefaultFronts, true);
        this.customDefaultFronts.onchange = (e) =>
        {
            const element = e.currentTarget as HTMLSelectElement;
            const value = element.value;
            this.customFrontPreview.src = value;
        };

        // Setup Custom Token Select
        this.customSelectTokenButtonBack.onclick = async (e) =>
        {
            e.preventDefault();

            const selections = await OBR.player.getSelection();
            if (selections === undefined || selections.length === 0) return;
            const itemsSelected = BSCACHE.sceneItems.filter(x => selections.includes(x.id)) as Image[];
            if (itemsSelected.length === 0) return;
            const imagesSelected = itemsSelected.filter(x => x.image?.url !== undefined);
            if (imagesSelected.length === 0) return;

            this.customBackLoaded = false;

            const selectedUrl = imagesSelected[0].image.url;
            this.customBackPreview.src = selectedUrl;
        };
        this.customSelectTokenButtonFront.onclick = async (e) =>
        {
            e.preventDefault();

            const selections = await OBR.player.getSelection();
            if (selections === undefined || selections.length === 0) return;
            const itemsSelected = BSCACHE.sceneItems.filter(x => selections.includes(x.id)) as Image[];
            if (itemsSelected.length === 0) return;
            const imagesSelected = itemsSelected.filter(x => x.image?.url !== undefined);
            if (imagesSelected.length === 0) return;

            this.customFrontLoaded = false;

            const selectedUrl = imagesSelected[0].image.url;
            this.customFrontPreview.src = selectedUrl;
        };

        // Setup URL Select
        this.customUseUrlOKButtonBack.onclick = async (e) =>
        {
            e.preventDefault();
            const enteredText = this.customUseUrlInputBack.value;
            if (!enteredText) return;
            const imageExtensions = /\.(jpg|jpeg|png|gif|webp|webm|mp4)$/i;

            try
            {
                var parsedUrl = new URL(enteredText);
                if ((parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:")
                    && imageExtensions.test(parsedUrl.pathname))
                {
                    this.customBackLoaded = false;
                    this.customBackPreview.src = parsedUrl.toString();
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
        this.customUseUrlOKButtonFront.onclick = async (e) =>
        {
            e.preventDefault();
            const enteredText = this.customUseUrlInputFront.value;
            if (!enteredText) return;
            const imageExtensions = /\.(jpg|jpeg|png|gif|webp|webm|mp4)$/i;

            try
            {
                var parsedUrl = new URL(enteredText);
                if ((parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:")
                    && imageExtensions.test(parsedUrl.pathname))
                {
                    this.customFrontLoaded = false;
                    this.customFrontPreview.src = parsedUrl.toString();
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

        // Add Card to Deck Databse
        this.addToDeckButton.onclick = async (e) =>
        {
            e.preventDefault();

            if (!this.customFrontLoaded || !this.customBackLoaded)
            {
                await OBR.notification.show("Please use valid images before adding to the deck.", "ERROR");
                return;
            }

            const frontCustomImage = this.customFrontPreview.src;
            const frontCustomDimensions = { x: this.customFrontPreview.naturalWidth, y: this.customFrontPreview.naturalHeight };
            const backCustomImage = this.customBackPreview.src;
            const backCustomDimensions = { x: this.customBackPreview.naturalWidth, y: this.customBackPreview.naturalHeight };
            let customCardName = this.customCardValueButton.value;
            if (customCardName === undefined || customCardName === null || customCardName.trim() === "") customCardName = "Unknown Name";
            const cardId = Utilities.GetGUID();
            const newCustomCard: CardData =
            {
                FrontUrl: frontCustomImage,
                FrontSize: frontCustomDimensions,
                BackUrl: backCustomImage,
                BackSize: backCustomDimensions,
                Value: customCardName,
                FaceUp: false,
                DeckId: this.customLoadedDeckId,
                CardId: cardId
            };
            this.customLoadedDeck.push(newCustomCard);

            // Create table element
            this.AppendCardToDatabaseTable(cardId, customCardName);
        }

        // Custom Deck Configuration Controls
        this.createCustomDeck.onclick = async (e) =>
        {
            e.preventDefault();

            if (this.customLoadedDeck.length === 0)
            {
                await OBR.notification.show("Cannot create an empty deck.", "ERROR");
                return;
            }
            else if (this.customLoadedDeck.length === 1)
            {
                await OBR.notification.show("For a single card, use the 'Create' Button next to the card name.", "DEFAULT");
                return;
            }

            if (this.createCustomDeck.disabled === true)
            {
                return;
            }
            this.createCustomDeck.disabled = true;
            this.createCustomDeck.innerText = "Working...";

            const customDeckData: DeckData =
            {
                Id: this.customLoadedDeckId,
                Cards: this.customLoadedDeck
            };

            const screenPosition = await this.GetScreenCenter();
            const newCustomDeck = this.CreateDeck(customDeckData, screenPosition);
            await OBR.scene.items.addItems(newCustomDeck);
            this.createCustomDeck.disabled = false;
            this.createCustomDeck.innerText = "Create";
        };
        let clearDeckConfirmed = false;
        this.clearCustomDeck.onclick = async (e) =>
        {
            e.preventDefault();
            if (this.customLoadedDeck.length === 0)
            {
                await OBR.notification.show("There are no cards to clear.", "ERROR");
                return;
            }

            if (clearDeckConfirmed)
            {
                this.deckDatabaseTable.innerHTML = "";
                this.customLoadedDeck = [];
                this.customLoadedDeckId = Utilities.GetGUID();
                this.clearCustomDeck.style.backgroundColor = 'rgba(30, 34, 49, 0.5)';
                this.clearCustomDeck.innerText = 'Clear';
                clearDeckConfirmed = false;
            }
            else
            {
                clearDeckConfirmed = true;
                this.clearCustomDeck.style.backgroundColor = 'darkred';
                this.clearCustomDeck.innerText = 'You Sure?';
                setTimeout(() =>
                {
                    clearDeckConfirmed = false;
                    this.clearCustomDeck.style.backgroundColor = 'rgba(30, 34, 49, 0.5)';
                    this.clearCustomDeck.innerText = 'Clear';
                }, 3000);
            }
        };

        // Need a file holder button
        const fileButton = document.createElement('input');
        fileButton.type = "file";
        fileButton.id = "fileButton";
        fileButton.title = "Choose a file to import"
        fileButton.className = "tinyType";
        fileButton.hidden = true;
        fileButton.accept = ".txt";
        fileButton.onchange = async function ()
        {
            if (fileButton.files && fileButton.files.length > 0)
            {
                let file = fileButton.files[0];
                let reader = new FileReader();

                reader.readAsText(file);

                reader.onload = async function ()
                {
                    try
                    {
                        const saveData: DeckData = JSON.parse(reader.result as string);
                        DECKEDMAIN.customLoadedDeckId = saveData.Id;
                        DECKEDMAIN.customLoadedDeck = saveData.Cards;
                        for (const card of DECKEDMAIN.customLoadedDeck)
                        {
                            DECKEDMAIN.AppendCardToDatabaseTable(card.CardId, card.Value);
                        }
                        OBR.notification.show("Import Complete!", "SUCCESS");
                    }
                    catch (error) 
                    {
                        OBR.notification.show(`The import failed - ${error}`, "ERROR");
                    }
                };

                reader.onerror = function ()
                {
                    console.log(reader.error);
                };
            }
        }
        this.importCustomDeck.onclick = async (e) =>
        {
            e.preventDefault();
            fileButton!.click();

        };
        this.exportCustomDeck.onclick = async (e) =>
        {
            e.preventDefault();
            const exportDeckData: DeckData =
            {
                Id: this.customLoadedDeckId,
                Cards: this.customLoadedDeck
            };
            var a = document.createElement("a");
            var file = new Blob([JSON.stringify(exportDeckData)], { type: "text/plain" });
            a.href = URL.createObjectURL(file);
            a.download = `DeckedExport-${Date.now()}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        };
    }

    public async Testing()
    {
    }

    public async InitializeDecked(): Promise<void>
    {
        await SetupContextMenuButtons();
        this.Testing();
        this.SetupWhatsNew();
        this.SetupTabControls();
        this.SetupStandardDeckControls();
        this.SetupCustomDeckControls();
    }

    public CreateDeck(deckData: DeckData, position?: Vector2): Item[]
    {
        const size = deckData.Cards[0].BackSize;
        const scale = Utilities.calculateScale(size.x, size.y);
        const backCardUrl = deckData.Cards[deckData.Cards.length - 1].BackUrl;
        const extension = Utilities.GetImageExtension(backCardUrl);

        const item = buildImage(
            {
                height: size.y,
                width: size.x,
                url: backCardUrl,
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

    private async GetScreenCenter(): Promise<Vector2>
    {
        const width = await OBR.viewport.getWidth();
        const height = await OBR.viewport.getHeight();
        const center = await OBR.viewport.inverseTransformPoint({
            x: width / 2,
            y: height / 2,
        });

        return { x: center.x - (CardUrls.WIDTH / 2), y: center.y - (CardUrls.HEIGHT / 2) };
    }

    private AppendCardToDatabaseTable(cardId: string, customCardName: string)
    {
        const row = document.createElement('tr');
        row.id = cardId;

        const nameCell = document.createElement('td');
        nameCell.textContent = customCardName;
        row.appendChild(nameCell);

        const button1Cell = document.createElement('td');
        const createButton = document.createElement('button');
        createButton.textContent = 'Create';
        createButton.classList.add('confirm-button');
        createButton.onclick = async (e) =>
        {
            e.preventDefault();
            const clickedRow = (e.target as HTMLElement).closest('tr');
            const clickedCard = this.customLoadedDeck.find(x => x.CardId === clickedRow.id);

            if (!clickedCard)
            {
                await OBR.notification.show("Unable to find card data.", "ERROR");
                clickedRow.remove();
                return;
            }

            const screenPosition = await DECKEDMAIN.GetScreenCenter();
            const item = DECKEDMAIN.CreateCardFromData(clickedCard);
            item.position.x = screenPosition.x;
            item.position.y = screenPosition.y;

            await OBR.scene.items.addItems([item]);
        };
        button1Cell.appendChild(createButton);
        row.appendChild(button1Cell);

        const button2Cell = document.createElement('td');
        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.classList.add('confirm-button');
        removeButton.onclick = async (e) =>
        {
            e.preventDefault();
            const clickedRow = (e.target as HTMLElement).closest('tr');
            this.customLoadedDeck = this.customLoadedDeck.filter(x => x.CardId !== clickedRow.id);
            clickedRow.remove();
        };
        button2Cell.appendChild(removeButton);
        row.appendChild(button2Cell);

        this.deckDatabaseTable.appendChild(row);
    }

    private GetCardOptionFromList(cardlist: string[], selectElement: HTMLSelectElement, webp: boolean): void
    {
        for (const cardName of cardlist)
        {
            const words = cardName.split('_');

            const capitalizedWords = words.map(word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            );

            const titleCasedName = capitalizedWords.join(' ');

            const option = document.createElement('option');
            option.value = `${CardUrls.BASE}${cardName}${webp ? '.webp' : '.png'}`;
            option.textContent = titleCasedName;
            selectElement.appendChild(option);
        }
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