interface CardData
{
    FrontUrl: string;
    BackUrl: string;
    Value: string;
    FaceUp: boolean;
    DeckId: string;
}

interface DeckData
{
    Id: string;
    Cards: CardData[];
}