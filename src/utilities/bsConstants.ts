export class Constants
{
    static EXTENSIONID = "com.battle-system.decked";
    static FLIPCARDID = "com.battle-system.decked-flipcard";
    static DRAWCARDID = "com.battle-system.decked-drawdeck";
    static GROUPCARDSID = "com.battle-system.decked-groupcards";
    static SHUFFLECARDSID = "com.battle-system.decked-shufflecards";
    static CUTCARDSID = "com.battle-system.decked-cutcards";

    static EXTENSIONWHATSNEW = "com.battle-system.decked-whatsnew";

    static BROADCASTCHANNEL = "com.battle-system.decked-broadcast";

    static ANONAUTH = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';
}

export class CardUrls
{
    static BASE = 'https://battle-system.com/owlbear/decked-docs/cards/';
    static HEIGHT = 333;
    static WIDTH = 234;
    static RADIUS = 10;

    static BLANK = CardUrls.BASE + "blank_card.png";
    static BACK_ABSTRACT = CardUrls.BASE + "backs_abstract.png";
    static BACK_ASTRONAUT = CardUrls.BASE + "backs_astronaut.png";
    static BACK_BLUE = CardUrls.BASE + "backs_blue.png";
    static BACK_BLUETWO = CardUrls.BASE + "backs_blue2.png";
    static BACK_RED = CardUrls.BASE + "backs_red.png";
    static BACK_REDTWO = CardUrls.BASE + "backs_red2.png";
    static BACK_CASTLE = CardUrls.BASE + "backs_castle.png";
    static BACK_CLOUDS = CardUrls.BASE + "backs_clouds.png";
    static BACK_SCENE = CardUrls.BASE + "backs_scene.png";

    static GETCARDURL = (value: string) => { return CardUrls.BASE + value + '.png'; };
    static GETTAROTURL = (value: string) => { return CardUrls.BASE + value + '.webp'; };

    static DECK52 = [
        // Clubs
        "clubs_2",
        "clubs_3",
        "clubs_4",
        "clubs_5",
        "clubs_6",
        "clubs_7",
        "clubs_8",
        "clubs_9",
        "clubs_10",
        "clubs_jack",
        "clubs_queen",
        "clubs_king",
        "clubs_ace",

        // Diamonds
        "diamonds_2",
        "diamonds_3",
        "diamonds_4",
        "diamonds_5",
        "diamonds_6",
        "diamonds_7",
        "diamonds_8",
        "diamonds_9",
        "diamonds_10",
        "diamonds_jack",
        "diamonds_queen",
        "diamonds_king",
        "diamonds_ace",

        // Hearts
        "hearts_2",
        "hearts_3",
        "hearts_4",
        "hearts_5",
        "hearts_6",
        "hearts_7",
        "hearts_8",
        "hearts_9",
        "hearts_10",
        "hearts_jack",
        "hearts_queen",
        "hearts_king",
        "hearts_ace",

        // Spades
        "spades_2",
        "spades_3",
        "spades_4",
        "spades_5",
        "spades_6",
        "spades_7",
        "spades_8",
        "spades_9",
        "spades_10",
        "spades_jack",
        "spades_queen",
        "spades_king",
        "spades_ace"
    ];

    static TAROTMAJOR = [
        "major_fool", "major_magician", "major_priestess", "major_empress", "major_emperor",
        "major_hierophant", "major_lovers", "major_chariot", "major_strength", "major_hermit",
        "major_wheel", "major_justice", "major_hangedman", "major_death", "major_temperance",
        "major_devil", "major_tower", "major_star", "major_moon", "major_sun",
        "major_judgement", "major_world"
    ];

    static TAROTMINOR = [
        "cups_ace", "cups_2", "cups_3", "cups_4", "cups_5", "cups_6", "cups_7", "cups_8", "cups_9", "cups_10", "cups_page", "cups_knight", "cups_queen", "cups_king",
        "swords_ace", "swords_2", "swords_3", "swords_4", "swords_5", "swords_6", "swords_7", "swords_8", "swords_9", "swords_10", "swords_page", "swords_knight", "swords_queen", "swords_king",
        "pentacles_ace", "pentacles_2", "pentacles_3", "pentacles_4", "pentacles_5", "pentacles_6", "pentacles_7", "pentacles_8", "pentacles_9", "pentacles_10", "pentacles_page", "pentacles_knight", "pentacles_queen", "pentacles_king",
        "wands_ace", "wands_2", "wands_3", "wands_4", "wands_5", "wands_6", "wands_7", "wands_8", "wands_9", "wands_10", "wands_page", "wands_knight", "wands_queen", "wands_king"
    ];

    // Clubs
    static CLUBS_2 = CardUrls.BASE + "clubs_2.png";
    static CLUBS_3 = CardUrls.BASE + "clubs_3.png";
    static CLUBS_4 = CardUrls.BASE + "clubs_4.png";
    static CLUBS_5 = CardUrls.BASE + "clubs_5.png";
    static CLUBS_6 = CardUrls.BASE + "clubs_6.png";
    static CLUBS_7 = CardUrls.BASE + "clubs_7.png";
    static CLUBS_8 = CardUrls.BASE + "clubs_8.png";
    static CLUBS_9 = CardUrls.BASE + "clubs_9.png";
    static CLUBS_10 = CardUrls.BASE + "clubs_10.png";
    static CLUBS_JACK = CardUrls.BASE + "clubs_jack.png";
    static CLUBS_QUEEN = CardUrls.BASE + "clubs_queen.png";
    static CLUBS_KING = CardUrls.BASE + "clubs_king.png";
    static CLUBS_ACE = CardUrls.BASE + "clubs_ace.png";

    // Diamonds
    static DIAMONDS_2 = CardUrls.BASE + "diamonds_2.png";
    static DIAMONDS_3 = CardUrls.BASE + "diamonds_3.png";
    static DIAMONDS_4 = CardUrls.BASE + "diamonds_4.png";
    static DIAMONDS_5 = CardUrls.BASE + "diamonds_5.png";
    static DIAMONDS_6 = CardUrls.BASE + "diamonds_6.png";
    static DIAMONDS_7 = CardUrls.BASE + "diamonds_7.png";
    static DIAMONDS_8 = CardUrls.BASE + "diamonds_8.png";
    static DIAMONDS_9 = CardUrls.BASE + "diamonds_9.png";
    static DIAMONDS_10 = CardUrls.BASE + "diamonds_10.png";
    static DIAMONDS_JACK = CardUrls.BASE + "diamonds_jack.png";
    static DIAMONDS_QUEEN = CardUrls.BASE + "diamonds_queen.png";
    static DIAMONDS_KING = CardUrls.BASE + "diamonds_king.png";
    static DIAMONDS_ACE = CardUrls.BASE + "diamonds_ace.png";

    // Hearts
    static HEARTS_2 = CardUrls.BASE + "hearts_2.png";
    static HEARTS_3 = CardUrls.BASE + "hearts_3.png";
    static HEARTS_4 = CardUrls.BASE + "hearts_4.png";
    static HEARTS_5 = CardUrls.BASE + "hearts_5.png";
    static HEARTS_6 = CardUrls.BASE + "hearts_6.png";
    static HEARTS_7 = CardUrls.BASE + "hearts_7.png";
    static HEARTS_8 = CardUrls.BASE + "hearts_8.png";
    static HEARTS_9 = CardUrls.BASE + "hearts_9.png";
    static HEARTS_10 = CardUrls.BASE + "hearts_10.png";
    static HEARTS_JACK = CardUrls.BASE + "hearts_jack.png";
    static HEARTS_QUEEN = CardUrls.BASE + "hearts_queen.png";
    static HEARTS_KING = CardUrls.BASE + "hearts_king.png";
    static HEARTS_ACE = CardUrls.BASE + "hearts_ace.png";

    // Spades
    static SPADES_2 = CardUrls.BASE + "spades_2.png";
    static SPADES_3 = CardUrls.BASE + "spades_3.png";
    static SPADES_4 = CardUrls.BASE + "spades_4.png";
    static SPADES_5 = CardUrls.BASE + "spades_5.png";
    static SPADES_6 = CardUrls.BASE + "spades_6.png";
    static SPADES_7 = CardUrls.BASE + "spades_7.png";
    static SPADES_8 = CardUrls.BASE + "spades_8.png";
    static SPADES_9 = CardUrls.BASE + "spades_9.png";
    static SPADES_10 = CardUrls.BASE + "spades_10.png";
    static SPADES_JACK = CardUrls.BASE + "spades_jack.png";
    static SPADES_QUEEN = CardUrls.BASE + "spades_queen.png";
    static SPADES_KING = CardUrls.BASE + "spades_king.png";
    static SPADES_ACE = CardUrls.BASE + "spades_ace.png";
}