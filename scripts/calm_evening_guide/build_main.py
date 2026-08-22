"""Build The Calm Evening Survival Guide - main professional book."""

from __future__ import annotations

import sys
from pathlib import Path

from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from theme import (  # noqa: E402
    CONTENT_W,
    CREAM,
    MARGIN_B,
    MARGIN_L,
    MARGIN_R,
    MARGIN_T,
    NAVY,
    NAVY_DEEP,
    PAGE,
    PAGE_H,
    PAGE_W,
    SAND,
    TEAL,
    TEAL_SOFT,
    TERRACOTTA,
    WHITE,
    BadgeRow,
    CheckLine,
    RoundedBox,
    SectionMark,
    ScriptCard,
    WriteBlock,
    draw_cover_page,
    draw_header_footer,
    esc,
    hairline,
    register_fonts,
    simple_table,
    styles,
)

OUT = ROOT / "output" / "pdf" / "calm-evening-survival-guide" / "01_The-Calm-Evening-Survival-Guide.pdf"
S = None
SECTION = {"name": "Contents"}


def P(text, style="Body"):
    return Paragraph(esc(text), S[style])


def Html(text, style="Body"):
    return Paragraph(text, S[style])


def sp(h=8):
    return Spacer(1, h)


def kicker(text):
    return Paragraph(esc(text).upper(), S["Kicker"])


def h1(text):
    return Paragraph(esc(text), S["H1"])


def h2(text):
    return Paragraph(esc(text), S["H2"])


def h3(text):
    return Paragraph(esc(text), S["H3"])


def tonight(*items):
    body = "\n".join(f"- {i}" for i in items)
    return RoundedBox("TONIGHT, IN 15 MINUTES", body, CONTENT_W, TEAL_SOFT, TEAL, S["BoxTitle"], S["BoxBody"])


def seen(text):
    return RoundedBox("YOU ARE SEEN", text, CONTENT_W, SAND, TERRACOTTA, S["BoxTitle"], S["BoxBody"])


def outcome(text):
    return RoundedBox("THE OUTCOME", text, CONTENT_W, HexColor_soft(), TEAL, S["BoxTitle"], S["BoxBody"])


def HexColor_soft():
    return TEAL_SOFT


def chapter(num, title, promise, section_name):
    bits = [
        kicker(f"Chapter {num}"),
        h1(title),
        Paragraph(esc(promise), S["Lead"]),
        hairline(),
        sp(6),
    ]
    return bits


def turn(next_section: str):
    return [SectionMark(next_section, SECTION), PageBreak()]


def on_cover(canvas, doc):
    draw_cover_page(canvas, doc)


def on_interior(canvas, doc):
    draw_header_footer(canvas, doc, SECTION["name"])


def sales_intro():
    return [
        kicker("A letter to you"),
        h1("This is not another planner."),
        P("You already know what a calm evening should look like. Homework done. Devices down. Children who greet you and listen the first time.", "Lead"),
        P("You do not have that evening."),
        Html("<b>You have the war.</b>", "Lead"),
        seen(
            "You walk in from traffic. Bags are still on the sofa. Someone is already asking for the tablet. 'I don't have homework' until you check the class WhatsApp. Aunty already said yes to TV. You become the wicked one. Again. Then you shout. Then you feel guilty. Then you promise tomorrow will be gentler. Tomorrow looks the same."
        ),
        sp(6),
        P("Here is the part nobody told you."),
        P("Your child is not broken. You are not a failed parent. The screen is not the real enemy."),
        Html("<b>Your evening has no rails.</b>", "Lead"),
        P("There is a 10-minute window after you walk in that decides the whole night. Most parents miss it. They answer the demand first. The evening is already lost."),
        P("There is also a sentence you can say when they cry that you do not love them because you took the tablet. And a one-page deal you can point to instead of shouting. You will meet both inside this system."),
        outcome(
            "This is the Calm Evening System. Not a chart you abandon by Wednesday. A shared order for the house: land, homework window, one house job, earned screens, collect. Calm evenings. Cooperative children. You, no longer the enemy every night."
        ),
        sp(6),
        P("You will not become a different parent by Friday."),
        P("You will walk into a different evening. Tonight. In 15 minutes."),
        tonight(
            "Do not read this like a novel.",
            "Turn the page. Open the chapter that matches tonight's fight.",
            "Use one script. Fill one page. Stop.",
        ),
        *turn("Phone start"),
    ]


def phone_start():
    return [
        kicker("Phone-friendly"),
        h1("Quick start. Do this now."),
        P("Read this on your phone. Skip the long chapters until you sit down."),
        hairline(),
        sp(4),
        h2("Quick Wins  ·  2 minutes"),
        CheckLine("Open Notes. Copy WALK-IN, TIME IS UP, and THEY CRY.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Name the note CALM EVENING.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Put a basket on the kitchen counter.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Say this: Land. Homework. One job. Then screens.", CONTENT_W, S["BodyLeft"]),
        sp(6),
        RoundedBox(
            "COPY-PASTE  ·  WALK-IN",
            "Bags there. Water first. I land for 8 minutes. The tablet stays in the kitchen.",
            CONTENT_W,
            SAND,
            TERRACOTTA,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(5),
        RoundedBox(
            "COPY-PASTE  ·  TIME IS UP",
            "Time is up. Bring it to the kitchen, please. Thank you for keeping our agreement.",
            CONTENT_W,
            SAND,
            TERRACOTTA,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(5),
        RoundedBox(
            "COPY-PASTE  ·  THEY CRY",
            "I love you. The tablet is not how I prove it. Love is not the same thing as yes.",
            CONTENT_W,
            SAND,
            TERRACOTTA,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        PageBreak(),
        SectionMark("Phone start", SECTION),
        h2("Action Plan"),
        RoundedBox("NOW", "Save 3 scripts. Put a basket in the kitchen. Say the evening order once.", CONTENT_W, TEAL_SOFT, TEAL, S["BoxTitle"], S["BoxBody"]),
        sp(5),
        RoundedBox("TONIGHT", "Use the walk-in script. Run one window or one job. Collect devices.", CONTENT_W, SAND, TERRACOTTA, S["BoxTitle"], S["BoxBody"]),
        sp(5),
        RoundedBox("THIS WEEK", "Print the agreement. Sign it. Stick it on the fridge. Only when you sit down.", CONTENT_W, TEAL_SOFT, TEAL, S["BoxTitle"], S["BoxBody"]),
        sp(8),
        h2("Upgrade Path"),
        P("Take the next step only when the last one feels easy. No rush."),
        CheckLine("You used one script. You started. You can stop here tonight.", CONTENT_W, S["BodyLeft"]),
        CheckLine("You signed the agreement. The house has rails.", CONTENT_W, S["BodyLeft"]),
        CheckLine("You ran a Sunday reset. The system is alive.", CONTENT_W, S["BodyLeft"]),
        CheckLine("You tracked one week. You can see the calm.", CONTENT_W, S["BodyLeft"]),
        sp(8),
        tonight(
            "Do one Quick Win now.",
            "Use one script when you walk in.",
            "Open the next chapter only if you want to.",
        ),
        *turn("Contents"),
    ]


def toc_page():
    rows = [
        ("01", "You are not failing", "The real problem is the evening, not your character"),
        ("02", "The 15-minute rule", "If it cannot be done tonight, it does not belong here"),
        ("03", "Map the evening you actually have", "Traffic, extra lesson, Aunty, generator"),
        ("04", "The four levers", "Arrival, homework, house jobs, screens"),
        ("05", "The arrival reset", "The first 10 minutes decide the night"),
        ("06", "Homework without the war", "One window. Then you stop."),
        ("07", "House jobs that get done", "Contribution, not punishment"),
        ("08", "The screen-time agreement", "Firm, kind, written, collected"),
        ("09", "Words that work", "Scripts you can say after a long day"),
        ("10", "Rewards and calm consequences", "Cooperation without bribery or shame"),
        ("11", "The exhausted-parent protocol", "When traffic stole the evening"),
        ("12", "The Sunday reset", "A 15-minute family meeting"),
        ("13", "Your first 7 days", "Do not overhaul your life. Install one lever."),
        ("14", "When it still falls apart", "Pushback, two houses, visitors, siblings"),
        ("15", "Age notes and shared homes", "6-8, 9-12, 13+, Aunty, Grandma, Daddy travels"),
        ("16", "Four-week family log", "Track calm. Repeat what worked."),
    ]
    story = [SectionMark("Contents", SECTION), kicker("How to use this book"), h1("Contents"), sp(4)]
    data = [[
        Paragraph(esc("CH"), S["CellHead"]),
        Paragraph(esc("Chapter"), S["CellHead"]),
        Paragraph(esc("What it gives you"), S["CellHead"]),
    ]]
    for n, t, d in rows:
        data.append([
            Paragraph(esc(n), S["CellBold"]),
            Paragraph(esc(t), S["CellBold"]),
            Paragraph(esc(d), S["Cell"]),
        ])
    story.append(simple_table(data, [22 * mm, 62 * mm, CONTENT_W - 84 * mm]))
    story += [
        sp(12),
        RoundedBox(
            "READ THIS ONCE",
            "Do not read this book like a novel. Open the chapter that matches tonight's fight. Use one script. Fill one page. Stop. Calm evenings are built by repeating a small plan, not by finishing every worksheet in one sitting.",
            CONTENT_W,
            SAND,
            TERRACOTTA,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        *turn("01  You are not failing"),
    ]
    return story


def ch01():
    return [
        *chapter("01", "You are not failing", "The shouting is not proof that you are a harsh parent. It is proof that the house has no shared evening plan.", "01  You are not failing"),
        seen(
            "You left work already tired. Traffic held you. The school WhatsApp group is still pinging. Uniforms need tomorrow. There is soup on the stove or there is not. The children have been with Aunty or Grandma since 2pm, and the first thing you hear is a request for the tablet. Then homework. Then a fight. Then you become the enemy. That is not a character problem. That is an evening with no rails."
        ),
        sp(8),
        P("Most Nigerian parents are running three jobs at once: paid work, the school run, and the emotional work of raising children who will not disgrace the family. You were not given a script for the 4pm to 9pm window. You inherited 'I will flog you' or 'I will tell your father' or endless warning that nobody believes anymore."),
        P("This guide will not ask you to become a gentle Western parent with a colour-coded fridge. It will not ask you to throw away respect. It will not pretend your house has a nanny, a dishwasher, and a husband who is always home at 5."),
        P("It will give you a small system: a written screen agreement, a homework window, one house job per child, and words you can say when you are too tired to invent a speech."),
        h2("What success looks like here"),
        CheckLine("Evenings end without a shouting match most nights of the week.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Your child knows the order: arrive, settle, homework, house job, then screen.", CONTENT_W, S["BodyLeft"]),
        CheckLine("You collect the device without chasing from room to room.", CONTENT_W, S["BodyLeft"]),
        CheckLine("You have a short evening option for the days traffic or light destroy the plan.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Your child cooperates more because the rules are predictable, not because you got louder.", CONTENT_W, S["BodyLeft"]),
        sp(6),
        outcome(
            "We are not chasing a perfect home. We are chasing calm evenings and cooperative children. If the house is a little messy and the children still greeted you, did their window of work, and brought the tablet when time was up - you won tonight."
        ),
        sp(8),
        tonight(
            "Say this out loud, even if only to yourself: 'I am not a bad parent. Tonight I will use one tool, not twenty.'",
            "Circle the fight that happens most: homework, screens, chores, bedtime, or all of them.",
            "Open that chapter. Ignore the rest until tomorrow.",
        ),
        *turn("02  The 15-minute rule"),
    ]


def ch02():
    return [
        *chapter("02", "The 15-minute rule", "If a tool needs a seminar, a laminator, and a free Saturday, you will not use it. Every page here is built for a tired parent with a small window.", "02  The 15-minute rule"),
        P("You do not have a time-management problem. You have an after-work collapse. By the time you sit down, your patience is already spent on the road. So this book has one hard rule:"),
        Html("<b>If you cannot start it in 15 minutes tonight, skip it.</b>", "Lead"),
        h2("What 15 minutes can actually do"),
        P("Fifteen minutes is enough to write tomorrow's evening times. It is enough to read the screen agreement with your child and both sign it. It is enough to assign one house job. It is enough to sit beside homework without taking over. It is enough to collect devices and put them in the kitchen."),
        P("Fifteen minutes is not enough to heal every pattern from your own childhood, redesign the whole house, and convert a stubborn 13-year-old. Stop asking one evening to do that."),
        h2("How to use the book on a work night"),
        CheckLine("Stand in the kitchen. Open one chapter. Read only the SAY THIS card.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Use the script once, even if your voice is flat. Flat and firm beats loud and empty.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Fill one line on a tracker. Date. What you tried. What happened.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Close the PDF. Do not 'finish the book'. Repeat the same tool for three nights before you add another.", CONTENT_W, S["BodyLeft"]),
        sp(6),
        RoundedBox(
            "THE TRAP",
            "Parents buy planners, fill the first page in beautiful handwriting, then go back to shouting by Wednesday. That happens when the plan is bigger than the life. Your life includes extra lesson, generator noise, visitors, and days you get home at 8. This system expects those days. That is why there is an Exhausted-Parent Protocol later. Use it without guilt.",
            CONTENT_W,
            SAND,
            TERRACOTTA,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(8),
        tonight(
            "Set a 15-minute timer on your phone.",
            "Write three times that are true for YOUR house: arrival, homework start, screens off.",
            "Stop when the timer ends, even if the page is ugly.",
        ),
        *turn("03  Map your evening"),
    ]


def ch03():
    s = [
        *chapter("03", "Map the evening you actually have", "Do not copy a routine from the internet. Copy the truth of your house, then put rails on it.", "03  Map your evening"),
        P("A plan that assumes you walk in at 4:30 will fail if you walk in at 7:10. A plan that assumes Daddy is home will fail if Daddy is on the road till Friday. Fill this page with the real house, not the house you wish you had."),
        h2("Who is in this house after school?"),
    ]
    who = [
        "I am home by: __________     The children are home by: __________",
        "Who is with them before I arrive?  Me / Aunty / Grandma / lesson teacher / older sibling / they are alone",
        "Extra lesson days: _______________________________________________",
        "Usual dinner time: __________     Usual lights-down: __________",
        "When light goes, we: use generator till _____ / use phone torch / sleep earlier",
    ]
    for line in who:
        s.append(P(line, "BodyLeft"))
    s += [
        h2("Where the fight usually starts"),
    ]
    for item in [
        "The moment I walk in, they ask for the tablet / TV / my phone.",
        "Homework that 'was not given' until I check the diary.",
        "Aunty already let them watch, so I become the wicked one.",
        "Siblings fighting over one device.",
        "Bedtime stretching because nobody wants to iron or pack the bag.",
        "I am hungry and overstimulated, so the first 'Mummy look' sounds like an attack.",
    ]:
        s.append(CheckLine(item, CONTENT_W, S["BodyLeft"]))
    s += [
        sp(6),
        WriteBlock("In one sentence, the evening problem in this house is:", 2, CONTENT_W, S),
        sp(6),
        WriteBlock("The time of day it usually explodes:", 1, CONTENT_W, S),
        sp(6),
        WriteBlock("What I have already tried that did not stick:", 2, CONTENT_W, S),
        sp(8),
        tonight(
            "Fill the lines above. Ugly handwriting is fine.",
            "Circle one explosion point. That is the first lever you will install.",
            "Tell one other adult in the house (spouse, Aunty, Grandma) one sentence: 'We are trying a written evening order this week.'",
        ),
        *turn("04  Four levers"),
    ]
    return s


def ch04():
    data = [[
        Paragraph(esc("Lever"), S["CellHead"]),
        Paragraph(esc("What it is"), S["CellHead"]),
        Paragraph(esc("15-minute install"), S["CellHead"]),
        Paragraph(esc("Outcome"), S["CellHead"]),
    ]]
    rows = [
        ("1. Arrival", "A 10-minute landing: greet, water, bags down, no devices yet.", "Write the landing steps on the fridge.", "You stop walking into a demand."),
        ("2. Homework", "One timed window. You sit nearby. Then it ends.", "Pick start time and a 20-30 min timer.", "Less all-night dragging."),
        ("3. House job", "One contribution each, matched to age, before screens.", "Assign one job per child tonight.", "Help without a court case."),
        ("4. Screens", "Written agreement: earned, timed, brought to you.", "Read and sign the one-page contract.", "You stop being the thief of fun."),
    ]
    for a, b, c, d in rows:
        data.append([Paragraph(esc(x), S["Cell"]) for x in (a, b, c, d)])
    return [
        *chapter("04", "The four levers", "You do not need twenty charts. You need four rails on the evening. Install them in order. Do not skip arrival and jump to confiscating phones. That is how you become the villain.", "04  Four levers"),
        P("Children cooperate when life is predictable. Not because they suddenly became angels. Because their brain can see the next step. Chaos makes them cling to the tablet. Rails make the tablet a chapter of the evening, not the whole evening."),
        simple_table(data, [28 * mm, 48 * mm, 48 * mm, CONTENT_W - 124 * mm]),
        sp(10),
        h2("The evening order you will teach"),
        Html(
            "<b>Arrive &rarr; Land &rarr; Homework window &rarr; One house job &rarr; Earned screen time &rarr; Collect &rarr; Dinner / bath / bags &rarr; Lights down.</b>",
            "Lead",
        ),
        P("If you get home late, you do not throw the whole order away. You shorten it. Landing still happens. Screens still get collected. Homework may move to morning. That is later, in the Exhausted-Parent Protocol. For now, learn the full order so the short version still makes sense."),
        sp(6),
        tonight(
            "Write the order on paper and stick it where children can see it.",
            "Read it once at dinner, without a lecture. 'This is how evenings will go in this house.'",
            "Do not add extra rules tonight. Four levers only.",
        ),
        *turn("05  Arrival reset"),
    ]


def ch05():
    s = [
        *chapter("05", "The arrival reset", "The first 10 minutes after you walk in teach your children whether the evening will be a fight or a landing.", "05  Arrival reset"),
        seen(
            "You open the door and someone is already talking. The generator is loud. There is a plate on the floor. A child wants your phone 'just to watch one video'. Your body is still on the road. If you answer the demand first, the evening has already been hijacked."
        ),
        h2("The 10-minute landing"),
        P("You do this even when you are late. Especially when you are late. It is not cute. It is a boundary on your nervous system and theirs."),
        CheckLine("Bags down in one place. Not the sofa. Not your bed.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Greet. You can require a greeting without a speech. 'Good evening, Mummy.' You answer warmly even if you are tired.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Water or a small snack. Hunger makes every child look rude.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Toilet. Wash hands. Uniform off if that is your house rule.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Devices stay in the kitchen basket until the homework window and house job are done.", CONTENT_W, S["BodyLeft"]),
        CheckLine("You get 8 minutes with your shoes off before you take questions. Say it out loud so they are not guessing.", CONTENT_W, S["BodyLeft"]),
        sp(6),
        ScriptCard("Say this when you walk in", "Good evening. Bags there. Water first. I will sit down for eight minutes. Then we start homework. The tablet stays in the kitchen until we earn it.", CONTENT_W, S),
        sp(6),
        ScriptCard("If they follow you with requests", "I heard you. I am not ignoring you. I am landing. When this timer ends, I am yours. If you keep talking now, we start later, which means less screen time.", CONTENT_W, S),
        sp(8),
        KeepTogether([
            h2("Your landing card (fill this)"),
            WriteBlock("In this house, bags go:", 1, CONTENT_W, S),
            WriteBlock("Snack / water we actually have:", 1, CONTENT_W, S),
            WriteBlock("My landing sentence (copy from above or write yours):", 2, CONTENT_W, S),
            WriteBlock("Devices wait in:", 1, CONTENT_W, S),
            sp(8),
            tonight(
                "Put a bowl or basket in the kitchen. That is now the device park.",
                "Practice the walk-in sentence once before anyone is home, so it is in your mouth.",
                "Tonight, protect the first 10 minutes even if homework is waiting.",
            ),
        ]),
        *turn("06  Homework"),
    ]
    return s


def ch06():
    data = [[
        Paragraph(esc("They say"), S["CellHead"]),
        Paragraph(esc("You say"), S["CellHead"]),
    ]]
    pairs = [
        (
            "I don't have homework.",
            "Show me the diary and the class WhatsApp. If there is nothing, you read for 15 minutes. That is still the window. Then we do the house job.",
        ),
        (
            "It is too hard.",
            "Show me the first question you can try. I will sit here. I will not do it for you. If we are stuck after two tries, we star it and I write a note to the teacher.",
        ),
        (
            "I will do it after the cartoon.",
            "In this house the cartoon is after the window, not before. The window is 25 minutes. Timer is on.",
        ),
        (
            "My teacher will not check.",
            "We are not doing homework for the teacher alone. We are doing it so tomorrow morning is not a panic. Twenty-five minutes. Then we stop.",
        ),
    ]
    for a, b in pairs:
        data.append([Paragraph(esc(a), S["CellBold"]), Paragraph(esc(b), S["Cell"])])
    return [
        *chapter("06", "Homework without the war", "Stop turning the whole night into a classroom. Give homework a window, your body nearby, and a clean ending.", "06  Homework"),
        P("All-night homework trains your child to stall. They learn that if they drag, you will eventually explode and then do the work yourself. A window trains something else: start, stay, stop."),
        h2("The homework window"),
        P("Pick a start time that matches reality. If extra lesson ends at 5:30, do not pretend homework starts at 4. If you get home at 7, the window may be 20 minutes, not 2 hours. Short and real beats long and fake."),
        CheckLine("Timer where the child can see it. 20 minutes for younger, 30-40 for older. One subject if energy is low.", CONTENT_W, S["BodyLeft"]),
        CheckLine("You sit in the same room with your own task: folding, emails, eating. This is body doubling, not hovering.", CONTENT_W, S["BodyLeft"]),
        CheckLine("No TV in the background. No 'let me just reply this WhatsApp' on the child's device.", CONTENT_W, S["BodyLeft"]),
        CheckLine("When the timer ends, homework ends for the night, even if it is unfinished. You write a note or finish a last line. You do not restart the war.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Praise the sitting, not only the score. 'You stayed for the whole window' is the behaviour you want repeated.", CONTENT_W, S["BodyLeft"]),
        sp(6),
        ScriptCard("Opening the window", "It is homework time. Diary out. We have 25 minutes. I am sitting here with my own work. When the timer rings, we stop even if it is not finished.", CONTENT_W, S),
        sp(8),
        simple_table(data, [58 * mm, CONTENT_W - 58 * mm]),
        sp(10),
        h2("7-day homework log"),
        P("Tick if the window happened. Note minutes. Do not write an essay."),
    ] + _week_log("Homework window happened?", "Minutes") + [
        sp(8),
        tonight(
            "Choose tonight's window: start time and minutes.",
            "Sit in the room. Set the timer. Do not take the pencil unless they ask for one hint.",
            "End when it rings. Say thank you for staying, even if the page is messy.",
        ),
        *turn("07  House jobs"),
    ]


def _week_log(col_a, col_b):
    head = [Paragraph(esc(x), S["CellHead"]) for x in ["Day", col_a, col_b, "What helped / what blocked"]]
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    data = [head]
    for d in days:
        data.append([
            Paragraph(esc(d), S["CellBold"]),
            Paragraph(esc(""), S["Cell"]),
            Paragraph(esc(""), S["Cell"]),
            Paragraph(esc(""), S["Cell"]),
        ])
    return [simple_table(data, [22 * mm, 38 * mm, 28 * mm, CONTENT_W - 88 * mm])]


def ch07():
    data = [[
        Paragraph(esc("Age"), S["CellHead"]),
        Paragraph(esc("Jobs that fit a Nigerian home"), S["CellHead"]),
        Paragraph(esc("Done looks like"), S["CellHead"]),
    ]]
    ages = [
        ("5-7", "Put plate in the sink. Pack tomorrow's socks into the bag. Fold two towels with you. Put shoes on the rack. Wipe the table with a cloth you wring for them.", "You can see it in 10 seconds. Do not re-do it in front of them unless it is unsafe."),
        ("8-10", "Wash own plate and cup. Sweep one room. Water the plants. Arrange the shoe rack. Lay out uniform. Wipe the sink after teeth.", "They start without a 20-minute argument. You may still inspect."),
        ("11-13", "Wash plates after dinner. Fold own clothes. Help younger sibling with bag. Wipe the bathroom sink. Simple rice or eggs with supervision.", "The job completes before screens. Not after a speech."),
        ("14+", "Cook one simple meal a week. Iron own uniform. Own laundry fold. Help Aunty without being asked twice. Check younger ones' bags.", "They own a real slice of the house. Respect is shown in work, not only in greeting."),
    ]
    for a, b, c in ages:
        data.append([Paragraph(esc(a), S["CellBold"]), Paragraph(esc(b), S["Cell"]), Paragraph(esc(c), S["Cell"])])
    return [
        *chapter("07", "House jobs that get done", "Your child is not Aunty's employer. Contribution is how they belong in this house. Keep it to one job before screens, or you will negotiate all night.", "07  House jobs"),
        P("Chore charts fail when they are a museum of tasks nobody checks. Pick one job per child on school nights. Weekends can hold a longer house job. The point is not a spotless parlour. The point is a child who knows: in this house, we all carry something."),
        simple_table(data, [22 * mm, 78 * mm, CONTENT_W - 100 * mm]),
        sp(10),
        ScriptCard("Say this", "Aunty is not here to serve you. She helps this house. You help this house. Tonight your job is plates and the table. I check at 7:30. If it is done, your screen time starts. If it is not, we lose the screen without a long talk.", CONTENT_W, S),
        sp(6),
        ScriptCard("If they say 'that is Aunty's work'", "Aunty cooks and keeps this house standing. Your job is the part that belongs to you. We are not discussing whether you contribute. We are confirming the job.", CONTENT_W, S),
        sp(8),
        KeepTogether([
            h2("Tonight's assignment"),
            WriteBlock("Child 1 name + one job:", 1, CONTENT_W, S),
            WriteBlock("Child 2 name + one job:", 1, CONTENT_W, S),
            WriteBlock("Child 3 name + one job:", 1, CONTENT_W, S),
            WriteBlock("I will inspect at this time, and the inspect sentence is:", 2, CONTENT_W, S),
            sp(6),
            tonight(
                "Assign one job each. Say it once. Write it on the fridge.",
                "Inspect at the time you named. Keep your face calm.",
                "If it is undone: screens do not start. No speech longer than two sentences.",
            ),
        ]),
        *turn("08  Screen agreement"),
    ]


def ch08():
    return [
        *chapter("08", "The screen-time agreement", "You do not need a stricter hand. You need a written deal both of you can point to when emotions are high.", "08  Screen agreement"),
        P("The tablet fight is rarely about the cartoon. It is about who controls the evening. If the rule lives only in your mouth, your child will test it every night. If the rule lives on one page you both signed, you are not the villain. You are the keeper of a deal."),
        h2("Rules that survive a Nigerian evening"),
        P("Keep them few. Children cannot obey twelve commandments after extra lesson."),
        CheckLine("Screens start after the homework window and one house job. Not before. Not 'just a little'.", CONTENT_W, S["BodyLeft"]),
        CheckLine("You agree the number of minutes BEFORE the device is handed over. Say it. They repeat it.", CONTENT_W, S["BodyLeft"]),
        CheckLine("When time ends, they bring it to the kitchen park. You do not hunt bedrooms.", CONTENT_W, S["BodyLeft"]),
        CheckLine("If they stall or shout, tomorrow's minutes are shorter. You will say this calmly, once.", CONTENT_W, S["BodyLeft"]),
        CheckLine("No devices in the bedroom after lights-down. Charging happens in the kitchen or your room.", CONTENT_W, S["BodyLeft"]),
        CheckLine("School WhatsApp and research happen with you present, not as a loophole for YouTube.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Sunday we review: what was kept, what slipped, what we adjust. We do not hold a tribunal every night.", CONTENT_W, S["BodyLeft"]),
        sp(6),
        ScriptCard("How you introduce it", "I have been shouting about the tablet, and it is not working. That is on me too, not only on you. From tonight we use a written agreement. You will know the rules. I will know the rules. We will both keep them. This is how this house will have calmer evenings.", CONTENT_W, S),
        PageBreak(),
        kicker("Chapter 08 continued"),
        h1("Family Screen-Time Agreement"),
        P("Read this aloud together. Fill the blanks. Sign. Put it on the fridge. This is the page you point to when somebody starts a case."),
        RoundedBox(
            "OUR DEAL",
            "In this house, the phone, tablet, TV, and games are a privilege, not a right.\n"
            "Screens come out after homework and one house job.\n"
            "Before any device is given, we will say the minutes out loud.\n"
            "When time is finished, the child brings the device to: ____________________\n"
            "School-night minutes: __________     Weekend minutes: __________\n"
            "No screens in the bedroom after lights-down at: __________\n"
            "If the deal is broken, tomorrow's screen time becomes: __________ minutes, and we talk without shouting.\n"
            "Apps / channels that are allowed: ____________________________________\n"
            "Apps / channels that are not allowed without a parent: __________________",
            CONTENT_W,
            SAND,
            TERRACOTTA,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(8),
        h3("We agree to keep this deal"),
        P("Child name and signature: ________________________________    Date: __________"),
        P("Parent / caregiver signature: ______________________________    Date: __________"),
        P("Second adult in the house (Aunty, Grandma, Daddy): __________    Date: __________"),
        sp(8),
        ScriptCard("When time is up", "Time is up. Bring it to the kitchen, please. Thank you for keeping our agreement.", CONTENT_W, S),
        sp(6),
        ScriptCard("If they stall", "I will not come and collect it from the bedroom. If it is not on this table in one minute, tomorrow is 15 minutes shorter. That is the deal we signed. Your choice now.", CONTENT_W, S),
        sp(6),
        ScriptCard("If they cry or shout", "You can be upset. The rule does not change. Sit here for two minutes. Then we continue the evening. I am not going to match your volume.", CONTENT_W, S),
        sp(8),
        tonight(
            "Fill and sign the agreement. One page. No extra clauses.",
            "Agree tonight's minutes before you hand anything over.",
            "Practice collecting into the kitchen park once, even if minutes were short.",
        ),
        *turn("09  Words that work"),
    ]


def ch09():
    blocks = []
    scripts = [
        ("School / 'it was fine'",
         "Tell me one thing that was hard today, not only 'it was fine'. You can tell me while we eat. I will not solve it immediately. I will listen for two minutes."),
        ("The cousin comparison",
         "We are not in Aunty Titi's house. In this house, screens come after homework and one job. That is how we do it here. You do not have to like it. You do have to keep it."),
        ("Visitors are in the parlour",
         "We do not disgrace this house in front of visitors. Go and greet. Then sit. If you need me, come to the kitchen and tap my arm. We will talk after they go. No shouting from the passage."),
        ("Siblings fighting over one tablet",
         "The tablet is not a trophy. Tunde, you have 15 minutes. Amaka, you have the next 15. I am keeping the time. If there is snatching, both of you lose the rest of tonight. The deal is on the fridge."),
        ("Bedtime stalling",
         "It is 8:45. Devices in the kitchen. Tomorrow's uniform is on the chair. Lights off at 9:00. I will come and say good night. You can tell me one thing from today. Then it is quiet."),
        ("You are about to explode",
         "I am too angry to talk well. I am going to drink water in the kitchen for three minutes. Do not follow me. When I come back, we will finish this without shouting."),
        ("They say you don't love them because you took the tablet",
         "I love you. The tablet is not how I prove it. I prove it by feeding you, by this house, and by keeping our deal. The tablet will come back when it is time. Love is not the same thing as yes."),
        ("Weekend plan",
         "Saturday morning is house work. Afternoon is your time, inside the minutes we agreed. Sunday we go to church / mosque / family, then rest. If Saturday jobs are not done, afternoon screens wait. That is the whole weekend speech."),
    ]
    blocks += [
        *chapter("09", "Words that work", "You should not have to invent a speech after three hours of traffic. These are firm, kind sentences you can say with a tired voice.", "09  Words that work"),
        P("Read them once. Mark the three you need this week. Put those three on your phone notes. The goal is not poetry. The goal is a child who can predict you."),
    ]
    for title, words in scripts:
        blocks += [h3(title), ScriptCard("Say this", words, CONTENT_W, S), sp(5)]
    blocks += [
        h2("Stop saying / say this instead"),
    ]
    swap = [[
        Paragraph(esc("This pours petrol"), S["CellHead"]),
        Paragraph(esc("This keeps your authority"), S["CellHead"]),
    ]]
    for a, b in [
        ("You are a useless child.", "That behaviour is not acceptable in this house. Try it again."),
        ("Come and see slap.", "The consequence is shorter screen time tomorrow. I will not shout."),
        ("Is that how they trained you in that school?", "Show me the diary. We will do the window we agreed."),
        ("I will tell your father, wait.", "I am the parent in the room. The deal stands tonight. Daddy can see the chart on Friday."),
        ("You will not amount to anything.", "This evening is about the next 15 minutes. Sit. We start."),
        ("Leave it, let me do it myself.", "I will not take over. I will sit here. You start. I am not going anywhere."),
    ]:
        swap.append([Paragraph(esc(a), S["Cell"]), Paragraph(esc(b), S["CellBold"])])
    blocks += [
        simple_table(swap, [CONTENT_W / 2, CONTENT_W / 2]),
        sp(8),
        tonight(
            "Pick three scripts. Write them in your phone.",
            "Use one tonight, even if it feels stiff. Stiff and calm still counts.",
            "If you slip into shouting, repair in one line: 'I shouted. The rule still stands. I will try that again with a lower voice.'",
        ),
        *turn("10  Rewards"),
    ]
    return blocks


def ch10():
    data = [[
        Paragraph(esc("Use these"), S["CellHead"]),
        Paragraph(esc("Avoid these"), S["CellHead"]),
    ]]
    data.append([
        Paragraph(esc("Extra 10 minutes of story or talk with you. Choice of Saturday rice or swallow. Invite a friend after church. Choose the family TV programme. Estate playground extra 15 minutes. Sleepover with a cousin if the week was kept. A praise note on the fridge with the exact behaviour."), S["Cell"]),
        Paragraph(esc("Cash every night. New phone as a bribe for basic manners. Sweets every time they greet you. Public shame in front of visitors. Withholding food. Beating as the first tool. Promising Disneyland you cannot fund. Rewards so big the child learns to hold the house hostage."), S["Cell"]),
    ])
    return [
        *chapter("10", "Rewards and calm consequences", "Cooperation grows when the good thing is connected to the deal, and the consequence is boring, certain, and small.", "10  Rewards"),
        P("You do not need to buy your child's obedience. You also do not need to humiliate them to prove you are in charge. Tie a small privilege to a kept deal. Tie a small loss to a broken deal. Then stop talking."),
        simple_table(data, [CONTENT_W / 2, CONTENT_W / 2]),
        sp(10),
        h2("Calm consequences that take under 15 minutes"),
        CheckLine("Shorter screen time tomorrow. You write the new number on the agreement.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Loss of choosing: they do not pick the cartoon or the meat from the pot.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Earlier lights-down by 15 minutes.", CONTENT_W, S["BodyLeft"]),
        CheckLine("House job done before any play, including playing with siblings.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Repair: a spoken apology plus the undone job, not a forced 'sorry' while they smirk.", CONTENT_W, S["BodyLeft"]),
        sp(6),
        ScriptCard("Delivering a consequence", "The deal was broken, so tomorrow is 15 minutes, not 40. I am not angry in a way that needs a speech. The number is on the fridge. Tonight we still eat, we still say good night, I still love you.", CONTENT_W, S),
        sp(8),
        WriteBlock("Our household rewards this month (pick 3):", 3, CONTENT_W, S),
        WriteBlock("Our default consequence (one sentence):", 2, CONTENT_W, S),
        sp(6),
        tonight(
            "Choose one reward and one consequence. Tell the children once.",
            "Do not stack five punishments for one offence.",
            "If you already shouted, still apply the small consequence. Do not add shame on top.",
        ),
        *turn("11  Exhausted protocol"),
    ]


def ch11():
    return [
        *chapter("11", "The exhausted-parent protocol", "Some nights traffic, light, or work will steal the evening. You need a short version you can run without guilt.", "11  Exhausted protocol"),
        seen(
            "You got home at 8:40. There is no light. The children are overstimulated. You have not eaten. Forcing a full homework window now will only create a fight you cannot finish. Survival nights are part of this system. Two survival nights a week is not failure. Seven shouting nights is."
        ),
        h2("The 15-minute short evening"),
        CheckLine("Land anyway: greet, water, bags in one place.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Food if it exists. If it does not, something small. Hungry people do not cooperate.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Devices in the kitchen park. No 'just 20 minutes' when you cannot supervise.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Bags and uniform for tomorrow if they are not ready. That is the only academic task.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Bath, bed, good night. Homework note to the teacher if needed, or a 15-minute window at 6:00am.", CONTENT_W, S["BodyLeft"]),
        CheckLine("You drink water. You do not give a moral lecture you cannot enforce.", CONTENT_W, S["BodyLeft"]),
        sp(6),
        ScriptCard("Say this", "Today was a hard day. We are doing the short evening: bags, food, bath, bed. Screens stay in the kitchen. I love you. I am tired. If homework must be done, we will do a short window in the morning. This is not a punishment. This is how we protect the house tonight.", CONTENT_W, S),
        sp(8),
        h2("Morning rescue window (optional)"),
        P("If an assignment is truly due, set a 15-minute window before school. Same rules: timer, you nearby, then you stop. Do not recreate the night war at 5:30am more than twice a week or nobody will survive."),
        WriteBlock("Our survival-night order, in our words:", 3, CONTENT_W, S),
        sp(6),
        tonight(
            "Write 'SHORT EVENING' on a card. Keep it in the kitchen.",
            "Agree with the other adult: when we get home after ____, we run the short evening.",
            "Use it once this week on purpose, even on a normal night, so the children already know the shape.",
        ),
        *turn("12  Sunday reset"),
    ]


def ch12():
    return [
        *chapter("12", "The Sunday reset", "A 15-minute family meeting beats seven nights of case-making. Keep it short enough that children do not dread it.", "12  Sunday reset"),
        P("Pick a time that already exists: after church, after lunch, before evening film. Sit where you eat. Phones in the basket. You lead. You do not cross-examine."),
        h2("The 15-minute agenda"),
        Html("<b>3 min</b> &nbsp; What went well this week? Each person names one thing. You start, so they hear competence, not only correction.", "BodyLeft"),
        Html("<b>4 min</b> &nbsp; Where did the deal slip? One example, not a catalogue of sins. 'The tablet did not come to the kitchen on Wednesday.'", "BodyLeft"),
        Html("<b>4 min</b> &nbsp; What do we keep, what do we change? Minutes, jobs, bedtime. Write it on the agreement.", "BodyLeft"),
        Html("<b>4 min</b> &nbsp; The week ahead: extra lesson days, visitors, Daddy travelling, test week. Adjust the plan before the chaos arrives.", "BodyLeft"),
        sp(6),
        ScriptCard("Opening", "This is not a court. This is how our house stays calm. Everyone will talk. I will not shout. We end in 15 minutes, even if we are not finished.", CONTENT_W, S),
        sp(8),
        WriteBlock("Date of this Sunday reset:", 1, CONTENT_W, S),
        WriteBlock("What went well:", 2, CONTENT_W, S),
        WriteBlock("Where the deal slipped:", 2, CONTENT_W, S),
        WriteBlock("One change for next week:", 2, CONTENT_W, S),
        WriteBlock("Extra lesson / travel / visitors we must plan for:", 2, CONTENT_W, S),
        sp(6),
        tonight(
            "Put the next Sunday reset in your phone calendar.",
            "Tell the children the meeting exists, so it is not a surprise ambush.",
            "End with food or a short family cartoon so the meeting is not only correction.",
        ),
        *turn("13  First 7 days"),
    ]


def ch13():
    days = [
        ("Day 1 - Monday", "Write the evening order and the three true times. Put the device basket in the kitchen. Do not add new punishments."),
        ("Day 2 - Tuesday", "Read the screen agreement aloud. Fill minutes. Sign. Use it once, even for 15 minutes, so the muscle memory starts."),
        ("Day 3 - Wednesday", "Assign one house job each. Inspect at a named time. Screens wait until the job is done."),
        ("Day 4 - Thursday", "Run a homework window with a visible timer. Sit nearby. End when it rings."),
        ("Day 5 - Friday", "Collect devices without chasing. If they stall, apply tomorrow's shorter minutes. Keep your voice boring."),
        ("Day 6 - Saturday", "Do one longer house job in the morning. Keep afternoon screens inside the weekend minutes. Practice a real conversation prompt at lunch."),
        ("Day 7 - Sunday", "Run the 15-minute family meeting. Change one number on the agreement if you must. Celebrate one kept deal out loud."),
    ]
    story = [
        *chapter("13", "Your first 7 days", "Do not overhaul your life. Install one lever a day. By Sunday you will have a house with rails.", "13  First 7 days"),
        P("If you miss a day, do not restart from Day 1 as punishment. Do the day you missed tonight, then continue. This is a system, not an exam."),
    ]
    for title, body in days:
        story += [KeepTogether([h3(title), P(body), sp(2)])]
    story += [
        h2("End-of-week check"),
        CheckLine("We have a written evening order on the wall.", CONTENT_W, S["BodyLeft"]),
        CheckLine("The agreement is signed by at least one child and one adult.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Devices have a park that is not a bedroom.", CONTENT_W, S["BodyLeft"]),
        CheckLine("I used at least three scripts without shouting, even if my voice was tired.", CONTENT_W, S["BodyLeft"]),
        CheckLine("I used the short evening once without calling myself a failure.", CONTENT_W, S["BodyLeft"]),
        sp(6),
        KeepTogether([
            WriteBlock("The lever that helped most:", 2, CONTENT_W, S),
            WriteBlock("The moment I still lost my temper, and what I will say next time:", 2, CONTENT_W, S),
            sp(6),
            tonight(
                "Start Day 1 even if today is not Monday. Rename the days. The order matters more than the calendar.",
            ),
        ]),
        *turn("14  When it falls apart"),
    ]
    return story


def ch14():
    data = [[
        Paragraph(esc("Situation"), S["CellHead"]),
        Paragraph(esc("Do this in 15 minutes"), S["CellHead"]),
    ]]
    for a, b in [
        ("They refuse the agreement entirely", "You still hold the rails. 'You do not have to sign to be loved. You do have to live the order: homework, job, then screen. Signing just makes it clearer.' If they will not sign, you still collect devices. The deal is the house, not a hobby."),
        ("Daddy / Mummy contradicts you", "Take the adult aside, not in front of the child. 'We need one evening order. If we disagree, the child will use the gap.' Agree on minutes and the kitchen park. Present a united sentence later."),
        ("Two houses, two sets of rules", "You cannot control the other house. You can say: 'In this house, this is the deal.' Do not badmouth the other parent. Keep your rails boring and consistent on your days."),
        ("Aunty already said yes to TV", "Do not shame Aunty in front of the children. Privately: 'From now, TV waits until I am home unless I text you. If they already watched, tonight's minutes are used up.' Then tell the children the new order once."),
        ("Test week / common entrance / WAEC pressure", "Increase the homework window by 15 minutes. Cut screens, not sleep. Sleep protects memory. Use the short evening if you get home late, plus a morning window."),
        ("A child with bigger needs (ADHD, delay, grief)", "Shorter windows. More body doubling. One job only. Visual timer. This book is still useful, but you may need a paediatric or school conversation. Rails plus support, not rails as punishment."),
        ("You broke the deal (gave the phone to keep them quiet)", "Repair: 'I was tired and I handed it over without the job. That was me, not you. Tomorrow we go back to the deal.' Then actually go back. Do not give a speech and repeat the leak."),
    ]:
        data.append([Paragraph(esc(a), S["CellBold"]), Paragraph(esc(b), S["Cell"])])
    return [
        *chapter("14", "When it still falls apart", "Pushback means the system is touching a real habit. It does not mean you should return to chaos.", "14  When it falls apart"),
        simple_table(data, [48 * mm, CONTENT_W - 48 * mm]),
        sp(10),
        tonight(
            "Name the situation from the table that is already in your house.",
            "Do only the 15-minute move beside it.",
            "Tell the other adult one sentence of the plan, not a complaint about the child.",
        ),
        *turn("15  Age and home"),
    ]


def ch15():
    return [
        *chapter("15", "Age notes and shared homes", "The four levers stay the same. The language and the minutes change.", "15  Age and home"),
        h2("Ages 6-8"),
        P("They need your body more than a speech. Sit for the homework window. Jobs must be visible and short. Screen minutes stay low on school nights (20-30). Use a visual timer. Conversation: one question, then you wait. They often say 'I don't know' first. Wait anyway."),
        h2("Ages 9-12"),
        P("They can repeat the deal back to you. Make them say the minutes before the device is given. House jobs should be real, not pretend. Watch for secret YouTube on a sibling's phone. Keep charging in the kitchen. They care about fairness between siblings - write the rota."),
        h2("Ages 13+"),
        P("Respect is the currency. Do not treat them like a small child in public. Give a later lights-down than the younger ones, and hold it. Phones are social oxygen; cutting to zero on a normal night often backfires. Keep the order, keep the kitchen park, keep school-night minutes. Add a weekly privilege they can earn: extra weekend data, outing with friends, later Saturday night. Talk like an ally on school stress, and stay the parent on the deal."),
        h2("Aunty, househelp, Grandma"),
        P("If they are in the house, they are part of the system or they will accidentally sabotage it with kindness. Give them three lines only: devices wait in the kitchen; homework window is at X; if they already watched, tell you. Write it. Do not assume they heard you while stirring soup."),
        h2("When Daddy or Mummy travels"),
        P("The remaining parent does not become both policeman and entertainer. Keep the same order. Reduce minutes if you cannot supervise. Tell the travelling parent the deal so a video call does not undo it with 'let them watch, they miss me'."),
        WriteBlock("Our age band(s) and the one adjustment we will make:", 3, CONTENT_W, S),
        sp(6),
        tonight(
            "Tell the other adult in the house the three lines they must keep.",
            "If your children span two age bands, write two minute numbers on the agreement, not one fight.",
        ),
        *turn("16  Four-week log"),
    ]


def ch16():
    story = [
        *chapter("16", "Four-week family log", "What you track, you can repeat. Score the evening 1-5. 1 is a war. 5 is calm enough. You are not hunting perfect fives.", "16  Four-week log"),
        P("Each night: one number, one tick, one line. Sunday: one sentence. That is enough data to see whether this house is getting calmer."),
    ]
    for week in range(1, 5):
        story += [h2(f"Week {week}"), sp(2)]
        head = [Paragraph(esc(x), S["CellHead"]) for x in ["Day", "Calm 1-5", "Homework window", "Job done", "Screens collected", "One line: what happened"]]
        data = [head]
        for d in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]:
            data.append([Paragraph(esc(d), S["CellBold"])] + [Paragraph(esc(""), S["Cell"]) for _ in range(5)])
        story.append(simple_table(data, [18 * mm, 22 * mm, 32 * mm, 24 * mm, 32 * mm, CONTENT_W - 128 * mm]))
        story += [sp(4), WriteBlock(f"Week {week} Sunday note - keep / change / thank someone:", 2, CONTENT_W, S), sp(8)]
    story += [
        outcome(
            "If week 4 has more 3s and 4s than week 1, the system is working even if you still had a bad Tuesday. Keep the rails. Calm evenings are a pattern, not a mood."
        ),
        *turn("Start tonight"),
    ]
    return story


def closing():
    return [
        kicker("Closing"),
        h1("Do this. Then stop."),
        P("Skip the perfect house. Do the next step that fits tonight."),
        h2("Action Plan"),
        RoundedBox("NOW", "Save 3 scripts. Put a basket in the kitchen.", CONTENT_W, TEAL_SOFT, TEAL, S["BoxTitle"], S["BoxBody"]),
        sp(5),
        RoundedBox("TONIGHT", "Say the walk-in script. Collect devices. End the evening.", CONTENT_W, SAND, TERRACOTTA, S["BoxTitle"], S["BoxBody"]),
        sp(5),
        RoundedBox("THIS WEEK", "Sign the agreement. Stick it up. Only when you sit down.", CONTENT_W, TEAL_SOFT, TEAL, S["BoxTitle"], S["BoxBody"]),
        sp(8),
        h2("Upgrade Path"),
        CheckLine("One script used. You started. Stop if that is all you have.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Agreement signed. The house has rails.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Sunday reset done. The system is alive.", CONTENT_W, S["BodyLeft"]),
        CheckLine("One week tracked. You can see the calm.", CONTENT_W, S["BodyLeft"]),
        sp(8),
        tonight(
            "Drink water.",
            "Use one script.",
            "Close the file. That is enough for tonight.",
        ),
    ]


def back_cover(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY_DEEP)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(NAVY)
    canvas.rect(PAGE_W - 14 * mm, 0, 14 * mm, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(TERRACOTTA)
    canvas.rect(PAGE_W - 17.2 * mm, 0, 3.2, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(WHITE)
    canvas.setFont("Georgia-Bold", 18)
    canvas.drawString(22 * mm, PAGE_H - 40 * mm, "Calm evenings are not a personality.")
    canvas.drawString(22 * mm, PAGE_H - 50 * mm, "They are a plan.")
    canvas.setFillColor(HexColor_cream())
    canvas.setFont("SourceSans", 11)
    y = PAGE_H - 70 * mm
    for line in [
        "Inside this survival guide you get:",
        "the 10-minute arrival reset, a homework window that actually ends,",
        "house jobs that fit a Nigerian home, a one-page screen-time agreement,",
        "scripts you can say after a long school run, an exhausted-parent protocol,",
        "a Sunday reset, and four weeks of tracking.",
        "",
        "Every tool takes under 15 minutes.",
        "Start tonight. Repeat tomorrow. The house will feel it.",
    ]:
        canvas.drawString(22 * mm, y, line)
        y -= 7 * mm
    canvas.setFillColor(TEAL)
    canvas.roundRect(22 * mm, 40 * mm, PAGE_W - 50 * mm, 22 * mm, 3 * mm, stroke=0, fill=1)
    canvas.setFillColor(WHITE)
    canvas.setFont("SourceSans-Bold", 10)
    canvas.drawString(28 * mm, 53 * mm, "PARENTING SURVIVAL GUIDE")
    canvas.setFont("SourceSans", 9)
    canvas.drawString(28 * mm, 46 * mm, "For Nigerian parents of school-age children  |  15-minute tools")
    canvas.restoreState()


def HexColor_cream():
    from reportlab.lib.colors import HexColor
    return HexColor("#F3E6D8")


def build():
    global S
    register_fonts()
    S = styles()
    OUT.parent.mkdir(parents=True, exist_ok=True)

    cover = PageTemplate(id="cover", frames=[Frame(0, 0, PAGE_W, PAGE_H, 0, 0, 0, 0)], onPage=on_cover)
    interior = PageTemplate(
        id="interior",
        frames=[Frame(MARGIN_L, MARGIN_B, CONTENT_W, PAGE_H - MARGIN_T - MARGIN_B, 0, 0, 0, 0)],
        onPage=on_interior,
    )
    back = PageTemplate(id="back", frames=[Frame(0, 0, PAGE_W, PAGE_H, 0, 0, 0, 0)], onPage=back_cover)

    doc = BaseDocTemplate(
        str(OUT),
        pagesize=PAGE,
        title="The Calm Evening Survival Guide",
        author="Parenting Survival Guide",
        subject="A 15-minute home system for Nigerian parents",
    )
    doc.addPageTemplates([cover, interior, back])

    story = [
        Paragraph(" ", ParagraphStyle("x", fontName="SourceSans", fontSize=1, leading=1)),
        NextPageTemplate("interior"),
        SectionMark("A letter to you", SECTION),
        PageBreak(),
    ]
    for fn in [sales_intro, phone_start, toc_page, ch01, ch02, ch03, ch04, ch05, ch06, ch07, ch08, ch09, ch10, ch11, ch12, ch13, ch14, ch15, ch16, closing]:
        story.extend(fn())
    story += [NextPageTemplate("back"), PageBreak(), Paragraph(" ", ParagraphStyle("x", fontName="SourceSans", fontSize=1, leading=1))]

    doc.build(story)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
