import OBR, { Grid, isImage, Image, Item, Metadata, Player, Theme } from "@owlbear-rodeo/sdk";
import * as Utilities from '../utilities/bsUtilities';
import { Constants } from "./bsConstants";

class BSCache
{
    // Cache Names
    static PLAYER = "PLAYER";
    static PARTY = "PARTY";
    static LOCALITEMS = "LOCALITEMS";
    static SCENEITEMS = "SCENEITEMS";
    static SCENEMETA = "SCENEMETADATA";
    static SCENEGRID = "SCENEGRID";
    static ROOMMETA = "ROOMMETADATA";

    private debouncedOnSceneItemsChange: (items: Item[]) => void;
    private debouncedOnSceneMetadataChange: (items: Metadata) => void;
    private debouncedOnPartyChange: (party: Player[]) => void;

    playerId: string;
    playerConnection: string;
    playerColor: string;
    playerName: string;
    playerMetadata: {};
    playerRole: "GM" | "PLAYER";

    currentDealer: string;

    party: Player[];
    lastParty: Player[];

    gridDpi: number;
    gridScale: number; // IE; 5ft

    sceneItems: Item[];
    sceneSelected: string[];
    sceneMetadata: Metadata;
    sceneReady: boolean;

    activeCards: Image[];
    activeDecks: Image[];

    roomMetadata: Metadata;

    theme: any;

    caches: string[];
    USER_REGISTERED: boolean;
    historyLog: Record<string, {}>;

    //handlers
    sceneMetadataHandler?: () => void;
    localItemsHandler?: () => void;
    sceneItemsHandler?: () => void;
    sceneGridHandler?: () => void;
    sceneReadyHandler?: () => void;
    playerHandler?: () => void;
    partyHandler?: () => void;
    themeHandler?: () => void;
    roomHandler?: () => void;

    constructor(caches: string[])
    {
        this.playerId = "";
        this.playerConnection = "";
        this.playerName = "";
        this.playerColor = "";
        this.playerMetadata = {};
        this.playerRole = "PLAYER";
        this.currentDealer = "";
        this.party = [];
        this.lastParty = [];
        this.sceneItems = [];
        this.sceneSelected = [];
        this.sceneMetadata = {};
        this.activeCards = [];
        this.activeDecks = [];
        this.gridDpi = 0;
        this.gridScale = 5;
        this.sceneReady = false;
        this.theme = "DARK";
        this.roomMetadata = {};

        this.USER_REGISTERED = false;
        this.caches = caches;
        this.historyLog = {};

        // Large singular updates to sceneItems can cause the resulting onItemsChange to proc multiple times, at the same time
        this.debouncedOnSceneItemsChange = Utilities.Debounce(this.OnSceneItemsChange.bind(this) as any, 100);
        this.debouncedOnSceneMetadataChange = Utilities.Debounce(this.OnSceneMetadataChanges.bind(this) as any, 100);
        this.debouncedOnPartyChange = Utilities.Debounce(this.OnPartyChange.bind(this) as any, 100);
    }

    public async InitializeCache()
    {
        // Always Cache
        this.sceneReady = await OBR.scene.isReady();

        this.theme = await OBR.theme.getTheme();
        Utilities.SetThemeMode(this.theme, document);

        if (this.caches.includes(BSCache.PLAYER))
        {
            this.playerId = await OBR.player.getId();
            this.playerConnection = await OBR.player.getConnectionId();
            this.playerName = await OBR.player.getName();
            this.playerColor = await OBR.player.getColor();
            this.playerMetadata = await OBR.player.getMetadata();
            this.playerRole = await OBR.player.getRole();
        }

        if (this.caches.includes(BSCache.PARTY))
        {
            this.party = await OBR.party.getPlayers();
            this.lastParty = this.party;
        }

        if (this.caches.includes(BSCache.SCENEITEMS))
        {
            if (this.sceneReady) this.sceneItems = await OBR.scene.items.getItems();
        }

        if (this.caches.includes(BSCache.SCENEMETA))
        {
            if (this.sceneReady) 
            {
                this.sceneMetadata = await OBR.scene.getMetadata();
            }
        }

        if (this.caches.includes(BSCache.SCENEGRID))
        {
            if (this.sceneReady)
            {
                this.gridDpi = await OBR.scene.grid.getDpi();
                this.gridScale = (await OBR.scene.grid.getScale()).parsed?.multiplier ?? 5;
            }
        }

        if (this.caches.includes(BSCache.ROOMMETA))
        {
            this.roomMetadata = await OBR.room.getMetadata();

            await this.RefreshDealer();
        }
        
        await this.CheckRegistration();
    }

    public KillHandlers()
    {
        if (this.caches.includes(BSCache.SCENEMETA) && this.sceneMetadataHandler !== undefined) this.sceneMetadataHandler!();
        if (this.caches.includes(BSCache.SCENEITEMS) && this.sceneItemsHandler !== undefined) this.sceneItemsHandler!();
        if (this.caches.includes(BSCache.SCENEITEMS) && this.localItemsHandler !== undefined) this.localItemsHandler!();
        if (this.caches.includes(BSCache.SCENEGRID) && this.sceneGridHandler !== undefined) this.sceneGridHandler!();
        if (this.caches.includes(BSCache.PLAYER) && this.playerHandler !== undefined) this.playerHandler!();
        if (this.caches.includes(BSCache.PARTY) && this.partyHandler !== undefined) this.partyHandler!();
        if (this.caches.includes(BSCache.ROOMMETA) && this.roomHandler !== undefined) this.roomHandler!();

        if (this.themeHandler !== undefined) this.themeHandler!();
    }

    public SetupHandlers()
    {
        if (this.sceneMetadataHandler === undefined || this.sceneMetadataHandler.length === 0)
        {
            if (this.caches.includes(BSCache.SCENEMETA))
            {
                this.sceneMetadataHandler = OBR.scene.onMetadataChange(async (metadata) =>
                {
                    this.sceneMetadata = metadata;
                    this.debouncedOnSceneMetadataChange(metadata);
                });
            }
        }

        if (this.sceneItemsHandler === undefined || this.sceneItemsHandler.length === 0)
        {
            if (this.caches.includes(BSCache.SCENEITEMS))
            {
                this.sceneItemsHandler = OBR.scene.items.onChange(async (items) =>
                {
                    this.sceneItems = items;
                    this.debouncedOnSceneItemsChange(items);
                });
            }
        }

        if (this.sceneGridHandler === undefined || this.sceneGridHandler.length === 0)
        {
            if (this.caches.includes(BSCache.SCENEGRID))
            {
                this.sceneGridHandler = OBR.scene.grid.onChange(async (grid) =>
                {
                    this.gridDpi = grid.dpi;
                    this.gridScale = parseInt(grid.scale);
                    await this.OnSceneGridChange(grid);
                });
            }
        }

        if (this.playerHandler === undefined || this.playerHandler.length === 0)
        {
            if (this.caches.includes(BSCache.PLAYER))
            {
                this.playerHandler = OBR.player.onChange(async (player) =>
                {
                    this.playerName = player.name;
                    this.playerColor = player.color;
                    this.playerId = player.id;
                    this.playerConnection = player.connectionId;
                    this.playerRole = player.role;
                    this.playerMetadata = player.metadata;
                    await this.OnPlayerChange(player);
                });
            }
        }

        if (this.partyHandler === undefined || this.partyHandler.length === 0)
        {
            if (this.caches.includes(BSCache.PARTY))
            {
                this.partyHandler = OBR.party.onChange(async (party) =>
                {
                    this.party = party.filter(x => x.id !== "");
                    this.debouncedOnPartyChange(party);
                });
            }
        }

        if (this.roomHandler === undefined || this.roomHandler.length === 0)
        {
            if (this.caches.includes(BSCache.ROOMMETA))
            {
                this.roomHandler = OBR.room.onMetadataChange(async (metadata) =>
                {
                    this.roomMetadata = metadata;
                    await this.OnRoomMetadataChange(metadata);
                });
            }
        }


        if (this.themeHandler === undefined)
        {
            this.themeHandler = OBR.theme.onChange(async (theme) =>
            {
                this.theme = theme.mode;
                await this.OnThemeChange(theme);
            });
        }

        // Only setup if we don't have one, never kill
        if (this.sceneReadyHandler === undefined)
        {
            this.sceneReadyHandler = OBR.scene.onReadyChange(async (ready) =>
            {
                this.sceneReady = ready;

                if (ready)
                {
                    this.sceneItems = await OBR.scene.items.getItems(isImage);
                    this.sceneMetadata = await OBR.scene.getMetadata();
                    this.gridDpi = await OBR.scene.grid.getDpi();
                    this.gridScale = (await OBR.scene.grid.getScale()).parsed?.multiplier ?? 5;
                }
                await this.OnSceneReadyChange(ready);
            });
        }
    }

    public async CheckRegistration()
    {
        try
        {
            const debug = window.location.origin.includes("localhost") ? "eternaldream" : "";
            const userid = {
                owlbearid: BSCACHE.playerId
            };

            const requestOptions = {
                method: "POST",
                headers: new Headers({
                    "Content-Type": "application/json",
                    "Authorization": Constants.ANONAUTH,
                    "x-manuel": debug
                }),
                body: JSON.stringify(userid),
            };
            const response = await fetch(Constants.CHECKREGISTRATION, requestOptions);

            if (!response.ok)
            {
                const errorData = await response.json();
                // Handle error data
                console.error("Error:", errorData);
                return;
            }
            const data = await response.json();
            if (data.Data === "OK")
            {
                this.USER_REGISTERED = true;
                console.log("Connected");
            }
            else console.log("Not Registered");
        }
        catch (error)
        {
            // Handle errors
            console.error("Error:", error);
        }
    }

    public async OnSceneMetadataChanges(_metadata: Metadata)
    {
        if (this.playerRole !== "GM")
        {

        }
    }

    public async OnLocalItemsChange(_items: Item[])
    {

    }

    public async OnSceneItemsChange(_items: Item[])
    {
        if (this.sceneReady)
        {
            if (this.playerId === this.currentDealer)
            {

                this.activeCards = this.sceneItems.filter(x => x.metadata[`${Constants.EXTENSIONID}/card_data`] !== undefined) as Image[];
                this.activeDecks = this.sceneItems.filter(x => x.metadata[`${Constants.EXTENSIONID}/deck_data`] !== undefined) as Image[];

                const toDelete: string[] = [];
                for (const deck of this.activeDecks)
                {
                    for (const card of this.activeCards)
                    {
                        const nearBy = Utilities.WithinDistance(card.position, deck.position, 25);
                        if (nearBy)
                        {
                            const onTop = card.zIndex > deck.zIndex;

                            const cardsData = card.metadata[`${Constants.EXTENSIONID}/card_data`] as CardData;
                            cardsData.FaceUp = false;

                            await OBR.scene.items.updateItems(x => x.id === deck.id, (items) =>
                            {
                                for (let item of items)
                                {
                                    const dadata = item.metadata[`${Constants.EXTENSIONID}/deck_data`] as DeckData;
                                    if (onTop) dadata.Cards.push(cardsData);
                                    else dadata.Cards.unshift(cardsData);

                                    // Update the top of the deck's image in case different
                                    const nextCard = !onTop ? dadata.Cards[0] : dadata.Cards[dadata.Cards.length - 1];
                                    const extension = Utilities.GetImageExtension(nextCard.BackUrl);
                                    item.image.url = nextCard.BackUrl;
                                    item.image.mime = `image/${extension}`;

                                    item.text.plainText = dadata.Cards.length.toString();
                                }
                            });
                            toDelete.push(card.id);
                        }
                    }

                    for (const deckToo of this.activeDecks)
                    {
                        if (deckToo.id === deck.id) continue;
                        if (toDelete.includes(deck.id)) continue;

                        const nearBy = Utilities.WithinDistance(deckToo.position, deck.position, 25);
                        if (nearBy)
                        {
                            const onTop = deckToo.zIndex > deck.zIndex;

                            const deckOneData = deck.metadata[`${Constants.EXTENSIONID}/deck_data`] as DeckData;
                            const deckTooData = deckToo.metadata[`${Constants.EXTENSIONID}/deck_data`] as DeckData;

                            await OBR.scene.items.updateItems(x => x.id === deck.id, (items) =>
                            {
                                for (let item of items)
                                {
                                    const dadata = item.metadata[`${Constants.EXTENSIONID}/deck_data`] as DeckData;
                                    const order = onTop ? [...dadata.Cards, ...deckTooData.Cards] : [...deckTooData.Cards, ...dadata.Cards];
                                    dadata.Cards = order;

                                    // Update the top of the deck's image in case different
                                    const nextCard = !onTop ? dadata.Cards[0] : dadata.Cards[dadata.Cards.length - 1];
                                    const extension = Utilities.GetImageExtension(nextCard.BackUrl);
                                    item.image.url = nextCard.BackUrl;
                                    item.image.mime = `image/${extension}`;

                                    item.text.plainText = dadata.Cards.length.toString();
                                }
                            });

                            const deckLines = BSCACHE.sceneItems.find(x => x.attachedTo === deck.id
                                && x.metadata[`${Constants.EXTENSIONID}/deck_id_lines`] !== undefined
                            );

                            await OBR.scene.items.updateItems(x => x.id === deckLines.id, (items) =>
                            {
                                for (let item of items)
                                {
                                    item.position = {
                                        x: deck.position.x,
                                        y: deck.position.y + (Math.min(deckOneData.Cards.length + deckTooData.Cards.length, 75))
                                    };
                                }
                            });

                            toDelete.push(deckToo.id);
                        }
                    }
                }

                if (toDelete.length > 0) await OBR.scene.items.deleteItems(toDelete);
            }
        }
    }

    public async OnSceneGridChange(_grid: Grid)
    {

    }

    public async OnSceneReadyChange(ready: boolean)
    {
        if (ready)
        {
        }
    }

    public async OnPlayerChange(player: Player)
    {
        if (player.selection?.length === 1)
        {

        }
    }

    public async OnPartyChange(party: Player[])
    {
        // Going on the assumption if there is a party change, the numbers would change
        // You won't ever have someone join/leave in the same second.
        if (party.length !== this.lastParty.length) await this.RefreshDealer();
        this.lastParty = party;
        console.log(party);
    }

    public async OnRoomMetadataChange(_metadata: Metadata)
    {
    }

    public async OnThemeChange(theme: Theme)
    {
        Utilities.SetThemeMode(theme, document);
    }

    private async RefreshDealer()
    {
        // Get the dealer settings
        this.currentDealer = this.roomMetadata[`${Constants.EXTENSIONID}/dealer`] as string;
        const dealerIsMe = this.currentDealer === this.playerId;
        const dealerIsInParty = this.party.find(x => x.id === this.currentDealer);

        // If there is no dealer, or they are not present, take the role
        if (!this.currentDealer || (!dealerIsMe && !dealerIsInParty))
        {
            await OBR.room.setMetadata({ [`${Constants.EXTENSIONID}/dealer`]: this.playerId });
        }
    }
};

// Set the handlers needed for this Extension
export const BSCACHE = new BSCache([BSCache.PLAYER, BSCache.PARTY, BSCache.SCENEITEMS, BSCache.SCENEMETA, BSCache.ROOMMETA]);
