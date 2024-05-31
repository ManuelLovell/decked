import OBR from "@owlbear-rodeo/sdk";
import { DECKEDMAIN } from "./main";
import { Constants } from "./utilities/bsConstants";
import { BSCACHE } from "./utilities/bsSceneCache";
import * as Utilities from './utilities/bsUtilities';

export async function SetupContextMenuButtons()
{
    await OBR.contextMenu.create({
        id: Constants.CUTCARDSID,
        icons: [
            {
                icon: "/icon.svg",
                label: "Cut Deck",
                filter: {
                    every: [
                        { key: ["metadata", `${Constants.EXTENSIONID}/deck_data`], value: undefined, operator: "!=", coordinator: "&&" },
                    ],
                    max: 1
                }
            }
        ],
        async onClick(context, _: string)
        {
            for (const deckItem of context.items)
            {
                const fulldeck = deckItem.metadata[`${Constants.EXTENSIONID}/deck_data`] as DeckData;
                if (fulldeck.Cards.length <= 3)
                {
                    await OBR.notification.show("You need at least four cards to cut the deck.");
                }
                else
                {
                    const midpoint = Math.ceil(fulldeck.Cards.length / 2);
                    const firstHalf = fulldeck.Cards.slice(0, midpoint);
                    const secondHalf = fulldeck.Cards.slice(midpoint);

                    // First Half
                    await OBR.scene.items.updateItems(context.items, (items) =>
                    {
                        for (let item of items)
                        {
                            // Update the top of the deck's image in case different
                            const nextCard = firstHalf[firstHalf.length - 1];
                            const extension = Utilities.GetImageExtension(nextCard.BackUrl);
                            item.metadata[`${Constants.EXTENSIONID}/deck_data`] = {Id: fulldeck.Id, Cards: firstHalf};
                            item.image.url = nextCard.BackUrl;
                            item.image.mime = `image/${extension}`;

                            //TEMPORARY DEBUG
                            item.text.plainText = firstHalf.length.toString();
                        }
                    });

                    const deckLines = BSCACHE.sceneItems.find(x => x.attachedTo === deckItem.id
                        && x.metadata[`${Constants.EXTENSIONID}/deck_id_lines`] !== undefined
                    );

                    await OBR.scene.items.updateItems(x => x.id === deckLines.id, (items) =>
                    {
                        for (let item of items)
                        {
                            item.position = {
                                x: deckItem.position.x,
                                y: deckItem.position.y + (Math.min(firstHalf.length, 75))
                            };
                        }
                    });

                    // Second Half
                    const basePosition = { x: deckItem.position.x + 300, y: deckItem.position.y };

                    const deckData: DeckData = { Cards: secondHalf, Id: secondHalf[0].DeckId };
                    const newDeck = DECKEDMAIN.CreateDeck(secondHalf[deckData.Cards.length - 1].BackUrl, deckData, basePosition);

                    OBR.scene.items.addItems(newDeck);
                }
            }
        }
    });
    await OBR.contextMenu.create({
        id: Constants.SHUFFLECARDSID,
        icons: [
            {
                icon: "/icon.svg",
                label: "Shuffle Cards",
                filter: {
                    every: [
                        { key: ["metadata", `${Constants.EXTENSIONID}/deck_data`], value: undefined, operator: "!=", coordinator: "&&" },
                    ],
                }
            }
        ],
        async onClick(context, _: string)
        {
            await OBR.scene.items.updateItems(context.items, (items) =>
            {
                for (let item of items)
                {
                    const ddata = item.metadata[`${Constants.EXTENSIONID}/deck_data`] as DeckData;
                    ddata.Cards = Utilities.ShuffleArray(ddata.Cards);

                    // Update the top of the deck's image in case different
                    const nextCard = ddata.Cards[ddata.Cards.length - 1];
                    const extension = Utilities.GetImageExtension(nextCard.BackUrl);
                    item.image.url = nextCard.BackUrl;
                    item.image.mime = `image/${extension}`;
                }
            });
            await OBR.notification.show("The deck has been shuffled.", "DEFAULT");
        }
    });
    await OBR.contextMenu.create({
        id: Constants.FLIPCARDID,
        icons: [
            {
                icon: "/icon.svg",
                label: "Flip Card",
                filter: {
                    every: [
                        { key: ["metadata", `${Constants.EXTENSIONID}/card_data`], value: undefined, operator: "!=", coordinator: "&&" },
                    ],
                }
            }
        ],
        async onClick(context, _: string)
        {
            await OBR.scene.items.updateItems(context.items, (items) =>
            {
                for (let item of items)
                {
                    const cdata = item.metadata[`${Constants.EXTENSIONID}/card_data`] as CardData;
                    const extension = Utilities.GetImageExtension(cdata.FaceUp === true ? cdata.BackUrl : cdata.FrontUrl);
                    item.image.url = cdata.FaceUp === true ? cdata.BackUrl : cdata.FrontUrl;
                    item.image.mime = `image/${extension}`;
                    cdata.FaceUp = cdata.FaceUp === true ? false : true;
                    item.metadata[`${Constants.EXTENSIONID}/card_data`] = cdata;
                }
            });
        }
    });

    await OBR.contextMenu.create({
        id: Constants.GROUPCARDSID,
        icons: [
            {
                icon: "/icon.svg",
                label: "Group Cards",
                filter: {
                    every: [
                        { key: ["metadata", `${Constants.EXTENSIONID}/card_data`], value: undefined, operator: "!=", coordinator: "&&" },
                    ],
                    min: 2
                }
            }
        ],
        async onClick(context, _: string)
        {
            const baseCard = context.items[0];
            const basePosition = baseCard.position;
            const cardData: CardData[] = [];

            for (let item of context.items)
            {
                const cdata = item.metadata[`${Constants.EXTENSIONID}/card_data`] as CardData;
                cdata.FaceUp = false;
                cardData.push(cdata);
            }

            const deckData: DeckData = { Cards: cardData, Id: cardData[0].DeckId };
            const newDeck = DECKEDMAIN.CreateDeck(cardData[deckData.Cards.length - 1].BackUrl, deckData, basePosition);

            OBR.scene.items.addItems(newDeck);
            OBR.scene.items.deleteItems(context.items.map(x => x.id));
        }
    });

    await OBR.contextMenu.create({
        id: Constants.DRAWCARDID,
        icons: [
            {
                icon: "/icon.svg",
                label: "Draw Card",
                filter: {
                    every: [
                        { key: ["metadata", `${Constants.EXTENSIONID}/deck_data`], value: undefined, operator: "!=", coordinator: "&&" },
                    ],
                }
            }
        ],
        async onClick(context, _: string)
        {
            const toCreate = [];
            let cardOffsetX = 300 + Utilities.RandomNumber(10, 35);
            let cardOffsetY = 0 + Utilities.RandomNumber(10, 35);
            for (const deck of context.items)
            {
                const ddata = deck.metadata[`${Constants.EXTENSIONID}/deck_data`] as DeckData;
                const drewCard = ddata.Cards[ddata.Cards.length - 1]; // Remember to mimic what card is removed for accuracy
                if (drewCard)
                {
                    // Create Cards
                    const createCard = DECKEDMAIN.CreateCard(
                        drewCard.FrontUrl,
                        drewCard.BackUrl,
                        drewCard.Value,
                        drewCard.FaceUp,
                        drewCard.DeckId
                    );

                    createCard.position =
                    {
                        x: deck.position.x + cardOffsetX,
                        y: deck.position.y + cardOffsetY
                    };

                    toCreate.push(createCard);

                    if (ddata.Cards.length > 2)
                    {
                        // Update Deck Data if there will be cards left, otherwise we will destroy it
                        await OBR.scene.items.updateItems(context.items, (items) =>
                        {
                            for (let item of items)
                            {
                                const dadata = item.metadata[`${Constants.EXTENSIONID}/deck_data`] as DeckData;
                                dadata.Cards.pop(); // Remember to mimic what card is removed for accuracy

                                // Update the top of the deck's image in case different
                                const nextCard = dadata.Cards[dadata.Cards.length - 1];
                                const extension = Utilities.GetImageExtension(nextCard.BackUrl);
                                item.image.url = nextCard.BackUrl;
                                item.image.mime = `image/${extension}`;

                                //TEMPORARY DEBUG
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
                                    y: deck.position.y + (Math.min(ddata.Cards.length, 75))
                                };
                            }
                        });
                    }
                    // If we are drawing on our last two cards, replace the deck with the final card
                    else if (ddata.Cards.length === 2)
                    {
                        const lastCard = ddata.Cards[0];
                        const createLastCard = DECKEDMAIN.CreateCard(
                            lastCard.FrontUrl,
                            lastCard.BackUrl,
                            lastCard.Value,
                            lastCard.FaceUp,
                            lastCard.DeckId
                        );

                        createLastCard.position =
                        {
                            x: deck.position.x,
                            y: deck.position.y
                        };

                        toCreate.push(createLastCard);
                        // Out of Cards, destroy the deck
                        await OBR.scene.items.deleteItems(context.items.map(x => x.id));
                    }
                }
            }
            await OBR.scene.items.addItems(toCreate);
        }
    });
}