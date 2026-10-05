"""Complete manuscript for The Life Story Blueprint journal."""

from __future__ import annotations

from dataclasses import dataclass


JOURNAL_TITLE = "The Life Story Blueprint"
JOURNAL_SUBTITLE = (
    "A Gentle 30-Day Guided Journal to Preserve Your Memories "
    "for Your Children & Grandchildren"
)
JOURNAL_KICKER = "A thirty-day guided journal"
COVER_PROMISE = "Ten minutes a day. One page at a time."
COVER_FOOT = "For the stories only you can tell."

HALF_TITLE_QUOTE = (
    "The stories you think are too small are the ones they will hold the longest."
)
HALF_TITLE_CREDIT = "A note to begin"

WEEKS = {
    1: {
        "label": "Week One",
        "short": "Week One  |  Childhood",
        "title": "Roots & Early Childhood",
        "title_lines": ("Roots & Early Childhood",),
        "days": "Days 1 to 7",
        "epigraph": "Before the world had an opinion of you, there was a place that simply held you.",
        "body": (
            "This week we walk back to the beginning: the rooms, the voices, the games, "
            "and the ordinary air of your first years. You do not need a perfect memory. "
            "A smell, a doorway, a name will do. If the house is gone, it still lives in you. "
            "Write from there."
        ),
    },
    2: {
        "label": "Week Two",
        "short": "Week Two  |  Coming of Age",
        "title": "Youth, Discoveries & Coming of Age",
        "title_lines": ("Youth, Discoveries", "& Coming of Age"),
        "days": "Days 8 to 14",
        "epigraph": "There was a season when the future felt like an open gate.",
        "body": (
            "Here we gather the years when you were finding yourself: schoolrooms, friendships, "
            "clothes you longed to wear, work that paid you your own money, music that made "
            "the night feel larger. Some of it will make you smile. Some of it may sting. "
            "Both belong. Tell it kindly, and tell it true."
        ),
    },
    3: {
        "label": "Week Three",
        "short": "Week Three  |  Love & Home",
        "title": "Love, Partnership & Building a Home",
        "title_lines": ("Love, Partnership", "& Building a Home"),
        "days": "Days 15 to 21",
        "epigraph": "A home is not only a house. It is the life you practiced inside it.",
        "body": (
            "This week is for the people you chose, the rooms you made, and the children "
            "(or the young lives) who changed the air. If love did not look like marriage, "
            "if a partner was lost, if family came by another road, write the life you actually lived. "
            "Love has more than one honest shape."
        ),
    },
    4: {
        "label": "Week Four",
        "short": "Week Four  |  Wisdom & Blessing",
        "title": "Hard-Won Wisdom & Messages for the Future",
        "title_lines": ("Hard-Won Wisdom", "& Messages for the Future"),
        "days": "Days 22 to 30",
        "epigraph": "What you have lived through can become a lantern in someone else's hands.",
        "body": (
            "In these last pages we gather what the years have taught you, and we turn toward "
            "the people who will come after. You may write only as much as feels right. "
            "A blessing can be short. A letter can be one paragraph. What matters is that "
            "your voice is left where they can find it."
        ),
    },
}


@dataclass(frozen=True)
class Day:
    number: int
    week: int
    theme: str
    invitation: str
    questions: tuple[str, ...]
    whisper: str
    letter_prompt: str | None = None
    line_count: int = 9


DAYS: tuple[Day, ...] = (
    Day(
        1,
        1,
        "The House That Held You First",
        "Before anyone asked who you would become, there was a place that simply knew you were there. Let us begin at that door.",
        (
            "When you close your eyes, what did the house or rooms of your earliest years look like?",
            "Which door did you come through most often, and who was usually on the other side of it?",
            "If you stood in that doorway this evening, what would you hear?",
        ),
        "If the rooms are blurry, name one color, one piece of furniture, one window.",
    ),
    Day(
        2,
        1,
        "The Kitchen of Ordinary Days",
        "Kitchens remember us even when we have forgotten ourselves. Take a slow breath and step inside yours.",
        (
            "What did your childhood kitchen smell like on an ordinary afternoon?",
            "Who stood at the stove or the table, and what were their hands doing?",
            "Was there a dish, a kettle, a loaf, or a piece of fruit that meant home before you had the word for it?",
        ),
        "You may write only the smell. That is a whole story.",
    ),
    Day(
        3,
        1,
        "The Voices That Named You",
        "Long before you chose your own way of speaking, someone said your name into the air. Listen for that sound.",
        (
            "How did your mother, father, or the person who raised you say your name when they were pleased with you?",
            "What did their voice sound like when they were tired, singing, or calling you in from outside?",
            "Is there a sentence you can still hear, word for word, after all these years?",
        ),
        "One remembered sentence is enough for today.",
    ),
    Day(
        4,
        1,
        "Play, and the Long Afternoon",
        "There were hours that felt endless. They were not wasted. They were the first freedom you knew.",
        (
            "What games did you play, and where: the yard, the street, the hallway, the field, the steps?",
            "Who was beside you, and what were you wearing?",
            "When the light began to change, how did you know it was time to go in?",
        ),
        "Write the names of the children if they come. Leave space if they do not.",
    ),
    Day(
        5,
        1,
        "Just Outside the Door",
        "Every childhood had a map: the places you were allowed to wander, and the edge you were told not to cross.",
        (
            "What did the street, the lane, the yard, or the land around your home look like in those years?",
            "What sounds belonged to that place: birds, traffic, a train, a neighbor's radio, a screen door?",
            "Where were you allowed to go alone, and where were you told not to go?",
        ),
        "A single sound can bring a whole street back.",
    ),
    Day(
        6,
        1,
        "The Day That Felt Different",
        "Most families had one morning that did not behave like the others: a Sunday, a holy day, a best dress, a quiet rule.",
        (
            "How did your family keep Sunday, or the holy day, or the one morning that felt set apart?",
            "What did people wear, and what was forbidden, and what was quietly allowed?",
            "Is there a smell, a hymn, a roast in the oven, or a walk that still belongs to that day?",
        ),
        "If your family kept no special day, write what an ordinary weekend felt like instead.",
    ),
    Day(
        7,
        1,
        "A Kindness You Have Never Forgotten",
        "Some gifts were small and have lasted a lifetime. Today we thank the person who offered one.",
        (
            "Who was kind to you when you were small, in a way that still surprises you?",
            "What exactly did they do: a look, a gift, a place at the table, a secret saved for you?",
            "If you could thank them now, in one or two sentences, what would you say?",
        ),
        "It is all right if they are gone. Write to them anyway.",
    ),
    Day(
        8,
        2,
        "The Walk to School",
        "Education was not only what happened at the desk. It began on the way there: the bag, the road, the feeling in your stomach.",
        (
            "What was the school, the classroom, or the first teacher you still remember?",
            "What did you carry, and what did the walk (or the ride) look like in the morning light?",
            "Was there a subject you loved, a subject you feared, or a desk you wanted to sit near?",
        ),
        "You do not have to remember every year. Choose one room.",
    ),
    Day(
        9,
        2,
        "The Friend Who Knew You Early",
        "Before romance, before reputation, there was often one person who simply liked you. That is a treasure.",
        (
            "Who was the friend of your youth, and where did you find each other?",
            "What did you do together that made the hours disappear?",
            "Is there a laugh, a secret, a shared snack, or a walk home that you can still see?",
        ),
        "If friendship was scarce, write about the companion you wished for, and why.",
    ),
    Day(
        10,
        2,
        "Clothes, Hair, and Wanting to Belong",
        "Youth has a wardrobe of longing. What you wore (or wished you could wear) was never only cloth.",
        (
            "What did you wear when you wanted to feel beautiful, handsome, grown, or simply like yourself?",
            "Who did your hair, or whose style did you copy, and from where: a magazine, a film, a girl on the bus?",
            "Was there a garment you saved for, borrowed, mended, or were not allowed to have?",
        ),
        "Fashion is memory. Write the fabric if you remember the fabric.",
    ),
    Day(
        11,
        2,
        "The Dream You Carried Quietly",
        "Somewhere in those years you wanted a life. It may have changed. It still matters that you wanted it.",
        (
            "When you were young, what did you hope you would be, or have, or see?",
            "Who believed you, and who smiled as if you should want something smaller?",
            "Did any piece of that dream come true in a way you did not expect?",
        ),
        "A dream that changed still counts. Write the first version.",
    ),
    Day(
        12,
        2,
        "First Work, First Money of Your Own",
        "There is a particular pride in being paid. Even a small wage can feel like a door unlocking.",
        (
            "What was your first job, chore-for-pay, or work that made you feel useful?",
            "What did the place smell like, and who showed you what to do?",
            "What did you buy, hide, give away, or dream about with that first money?",
        ),
        "If you worked at home without pay, that labor counts. Write it with honor.",
    ),
    Day(
        13,
        2,
        "Music, Dancing, and Feeling Alive",
        "Some nights refuse to fade. A song can still put you back in the room.",
        (
            "What song was playing (on the radio, at a dance, in a car, in a kitchen) when you felt most alive?",
            "Where were you, and who was there, and what were you wearing?",
            "If you stood up and that music began now, what would your body remember first?",
        ),
        "Hum the tune if the words will not come. Then write the feeling.",
    ),
    Day(
        14,
        2,
        "The Day You Felt Yourself Change",
        "Coming of age is rarely one ceremony. Often it is a single afternoon when you knew you were no longer only a child.",
        (
            "Was there a moment when you understood you were growing up: a loss, a journey, a look in the mirror, a responsibility handed to you?",
            "What did the air feel like that day, and who (if anyone) noticed the change in you?",
            "What did you leave behind, and what did you carry forward?",
        ),
        "You may choose a quiet moment. Quiet moments often tell the truth.",
    ),
    Day(
        15,
        3,
        "When You First Noticed Them",
        "Love often begins before anyone names it: a glance, a kindness, a laugh across a room.",
        (
            "How did you meet the person you loved, or the person who changed your idea of companionship?",
            "What did they look like then, and what small thing did you notice first: a voice, a coat, a way of listening?",
            "Was there a song, a season, a street, or a smell that still belongs to that beginning?",
        ),
        "If love arrived later, or more than once, choose the beginning that still glows.",
    ),
    Day(
        16,
        3,
        "The Day Love Became a Promise",
        "Some loves are marked by a wedding. Some are marked by a quiet decision. Both can be sacred.",
        (
            "If there was a wedding, a vow, a first home, or a private promise, what do you remember of that day?",
            "What were you wearing, and who stood near you, and how did your hands feel?",
            "What hope were you carrying that you might not have said out loud?",
        ),
        "If there was no ceremony, write the ordinary day you knew you had chosen them.",
    ),
    Day(
        17,
        3,
        "The Rooms You Made into a Home",
        "Home is a practice: the table, the light, the way someone was welcomed at the door.",
        (
            "Describe the first home you made as a grown person: the rooms, the furniture you were proud of, the thing that never quite worked.",
            "What made it feel like yours: a recipe, a chair, a garden, a radio, a way of setting the table?",
            "Who crossed the threshold often, and what did they come for?",
        ),
        "Imperfect rooms are the ones people miss. Write those.",
    ),
    Day(
        18,
        3,
        "The Children Who Changed the Air",
        "A child (your own, or a child you stood beside) rearranges a life. Today we honor that rearrangement.",
        (
            "Who were the children of your life, and how did the house sound after they arrived?",
            "What were the small repeating scenes: bedtime, breakfast, a school-gate, a bath, a worry you carried in the night?",
            "What did you hope they would feel when they thought of home?",
        ),
        "If you did not raise children, write of the young people you loved, taught, or sheltered.",
    ),
    Day(
        19,
        3,
        "Ordinary Tuesdays",
        "Families are not made of holidays alone. They are made of the days that did not seem worth photographing.",
        (
            "What did an ordinary weekday look like in the home you built: morning, meal, evening?",
            "Were there rituals no guest would have noticed: a chair that belonged to someone, a program on the radio, a walk, a joke?",
            "What food, what noise, what hour of the day still feels like 'us'?",
        ),
        "Choose one Tuesday. Let it stand for a hundred.",
    ),
    Day(
        20,
        3,
        "A Season That Asked More of You",
        "Every household meets a weather it did not order: illness, money, distance, a breaking, a long repair.",
        (
            "Was there a season when the home you built was tested, and what did that season ask of you?",
            "Who stayed near, and what practical thing (a meal, a visit, a silence kept kindly) helped you through?",
            "What did you learn about love when it was no longer easy?",
        ),
        "Write only as much as feels safe. You may tell the edge of the story, not the whole storm.",
    ),
    Day(
        21,
        3,
        "What Home Still Means",
        "After all the moving and mending, there is a feeling you still call home. Let us name it.",
        (
            "If the word home is a place, a person, a table, or a time of day, what is it for you now?",
            "What would you want a grandchild to remember about the way your house felt?",
            "Is there a habit of welcome you hope will outlive the furniture?",
        ),
        "Home can be a person. Home can be a kettle. Write the true one.",
    ),
    Day(
        22,
        4,
        "The Hardest Road You Walked",
        "Wisdom is often born where we would not have chosen to go. You need not dramatize it. A few true sentences will do.",
        (
            "What is one hard thing you lived through that shaped the person you became?",
            "What helped you endure: a person, a faith, a daily task, a stubborn hope?",
            "If a younger member of the family ever walks a similar road, what would you want them to know?",
        ),
        "You may keep some details private. Courage can be quiet on the page.",
        line_count=8,
    ),
    Day(
        23,
        4,
        "A Pride You Rarely Speak Of",
        "We are taught not to boast. Still, there are victories that deserve a seat at the table, especially the quiet ones.",
        (
            "What are you proud of that the world may never have applauded?",
            "Was it a child helped, a bill paid, a kindness repeated, a skill learned, a promise kept when it would have been easier not to?",
            "If you could let yourself feel that pride for one full minute, what would you say about it?",
        ),
        "Small prides are often the truest. Write one of those.",
    ),
    Day(
        24,
        4,
        "If You Could Sit with Your Younger Self",
        "Imagine a quiet table, two cups, and the younger you arriving with all their hope and fear. You would not scold. You would tell them something useful.",
        (
            "How old is the younger you who still needs a word from you, and what are they worrying about?",
            "What would you tell them to keep, and what would you tell them they can lay down?",
            "What do you know now that would have saved them a little loneliness?",
        ),
        "Write as if they can hear you. In a way, they still can.",
    ),
    Day(
        25,
        4,
        "What You Hope They Keep",
        "Values are not speeches. They are the way a family treats a guest, a mistake, a Sunday, a person in need.",
        (
            "What qualities do you hope will survive you in this family: kindness, courage, faith, humor, honesty, work, welcome?",
            "Where did you learn those qualities, and in whom did you first see them?",
            "What is one small habit that teaches the quality better than any advice?",
        ),
        "Choose two or three. A short list is easier to live.",
    ),
    Day(
        26,
        4,
        "A Letter to Your Child",
        "Today the questions step back. Write a letter. If you have more than one child, choose one today. The extra pages at the back are waiting for the others.",
        (
            "What do you love about them that they may not fully know?",
            "What do you hope they forgive, remember, or carry?",
            "What blessing do you want them to hear in your own words?",
        ),
        "A letter may be short. Short letters are often kept the longest.",
        letter_prompt="My dear child,",
        line_count=10,
    ),
    Day(
        27,
        4,
        "A Letter to a Grandchild",
        "Write toward the child who sits on your knee now, or the one still coming, or the young person who already feels like yours.",
        (
            "What do you want them to know about the world you grew up in?",
            "What do you want them to know about themselves, even before they can understand it?",
            "What simple joy do you hope they never become too busy for?",
        ),
        "If you have no grandchild yet, write to the child who will one day open this book.",
        letter_prompt="My dear grandchild,",
        line_count=10,
    ),
    Day(
        28,
        4,
        "How You Wish to Be Remembered",
        "Not the formal obituary. The kitchen-table version. The way you hope they will say your name when you are not in the room.",
        (
            "When the people who love you speak of you, what do you hope they mention first?",
            "What should they remember about your laugh, your stubbornness, your tenderness, your favorite things?",
            "Is there a story you hope they will tell about you, even if they tell it imperfectly?",
        ),
        "You are allowed to want to be remembered well. That is not vanity. That is love looking forward.",
    ),
    Day(
        29,
        4,
        "Grace, Forgiveness, and What You Would Lay Down",
        "Some families inherit silence. You may choose to leave a little more light. You need not name every wound.",
        (
            "Is there something you would like to forgive, or be forgiven for, in a way that frees the next generation?",
            "What quarrel, secret, or heaviness do you hope will not be carried forward?",
            "What would grace look like in this family if it had a simple daily form?",
        ),
        "If this page is too much, write one sentence of peace and stop. That is complete.",
        line_count=8,
    ),
    Day(
        30,
        4,
        "The Blessing You Leave Behind",
        "Thirty days ago you sat down with a blank page. Today you offer a blessing. It can be as short as a breath.",
        (
            "If the people you love could hear one blessing from you whenever they need courage, what would it be?",
            "What do you want them to remember on an ordinary morning, when life is simply life?",
            "How would you finish this sentence: 'Whenever you think of me, I hope you feel...'",
        ),
        "You have done enough. Write the blessing, then rest your hand.",
        line_count=9,
    ),
)


WELCOME_PARAS = (
    "Dear one,",
    "Please sit down. There is no hurry.",
    (
        "You do not need a famous name for your life to be worth keeping. The people who love you "
        "are not waiting for a polished book. They are waiting for you: for the sound of your particular voice, "
        "for the kitchen you remember, for the way your mother said your name."
    ),
    (
        "So many stories disappear simply because no one asked, or because we believed our days were too ordinary "
        "to write down. They were not ordinary. They were yours. And that is enough."
    ),
    (
        "This journal is a gentle companion for thirty days. Each page offers a small doorway. You walk through it "
        "for about ten minutes (fifteen at the most) and then you stop. You may write in pencil. You may cross things out. "
        "You may leave a question unanswered."
    ),
    (
        "Spelling does not matter. Grammar does not matter. Neatness does not matter. "
        "Only your true voice matters."
    ),
    (
        "If a memory comes with tears, that is not a mistake. If a memory will not come at all, write one color, "
        "one sound, one name. That, too, is a beginning."
    ),
    "I will sit with you, one page at a time.",
    "Whenever you are ready, turn the page.",
)

HOW_TO_INTRO = (
    "Think of this as a cup of tea and a conversation, not an assignment. "
    "The whole visit is meant to fit inside a quiet pocket of your day."
)

HOW_TO_STEPS = (
    ("Choose a small pocket of time.", "Morning with tea, an afternoon rest, or the hush after supper. Ten minutes is a complete visit."),
    ("Read the day's questions once, slowly.", "You do not have to answer every one. Let the question that warms (or tugs) go first."),
    ("Write in your own words.", "Talk onto the page the way you would talk across a kitchen table. Imperfect, honest memory is worth more than polished prose."),
    ("Stop while it still feels kind.", "If the page is only half full, that is still a day's work. Tomorrow there will be another door."),
    ("Skip what does not fit.", "If a prompt does not belong to your life, write the true thing instead, or turn the page without apology."),
)

PROMISE_LINES = (
    "You do not have to be a writer.",
    "You only have to be yourself.",
    "A few true sentences will outlast a perfect paragraph.",
    "Your children and grandchildren are hungry for the small, real things.",
)

MEMORY_NOTE = (
    "A note about memory: it is all right if the years have blurred. Write what remains. "
    "If two versions of a story live in you, write the one that feels most true today. "
    "Feeling is a kind of memory, too."
)

CLOSING_PARAS = (
    "You have done a rare and generous thing.",
    (
        "In thirty quiet sittings you have gathered a life. Not the whole of it, for no book can hold that, "
        "but enough. Enough for a child to hear your voice when the room is empty. Enough for a grandchild "
        "who never sat in your kitchen to know how it smelled."
    ),
    (
        "This journal is now a family treasure. Keep it where it can be found. Read a page aloud if you wish. "
        "Slip a photograph between the pages. Next year, if a new memory knocks, write it in the margin."
    ),
    (
        "You did not need perfect sentences. You needed only to tell the truth as you lived it. "
        "The people who love you will not remember whether every comma was in its place. "
        "They will remember that you came. That you sat down. That you left them your voice."
    ),
    "Thank you for trusting these pages with what is yours.",
    "With tenderness,",
    "Your companion on the page",
)

KEEPING_TITLE = "How to keep this book"
KEEPING_PARAS = (
    (
        "Place it where the family will not have to hunt for it: a drawer that is opened, a shelf by the photographs, "
        "a box with the letters."
    ),
    (
        "You may copy a letter from Days 26 or 27 for a birthday, a wedding, or a hard season. "
        "The original can stay here, safe."
    ),
    (
        "Photographs are welcome between pages. A pressed leaf, a recipe card, a ticket stub: these are not clutter. "
        "They are proof."
    ),
    (
        "If you have more to say, the extra pages that follow are yours. The conversation does not have to end "
        "because Day 30 is complete."
    ),
)

BACK_COVER_QUOTE = (
    "You do not need a famous name. You need only the stories that are yours, "
    "told in the voice your family already loves."
)
BACK_COVER_POINTS = (
    "Thirty unhurried daily invitations",
    "Four chapters of a life, from childhood to blessing",
    "Ten minutes a day, one page at a time",
    "Room to write by hand, in your own true voice",
)
