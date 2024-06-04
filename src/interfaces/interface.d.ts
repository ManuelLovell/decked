interface CardData
{
    FrontUrl: string;
    FrontSize: Vector2;
    BackUrl: string;
    BackSize: Vector2;
    Value: string;
    FaceUp: boolean;
    DeckId: string;
}

interface DeckData
{
    Id: string;
    Cards: CardData[];
}