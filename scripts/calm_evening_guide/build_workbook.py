"""Printable fridge pack: one tool per page, large write-in areas."""

from __future__ import annotations

import sys
from pathlib import Path

from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
)

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from theme import (  # noqa: E402
    CONTENT_W,
    MARGIN_B,
    MARGIN_L,
    MARGIN_R,
    MARGIN_T,
    NAVY_DEEP,
    PAGE,
    PAGE_H,
    PAGE_W,
    SAND,
    TEAL,
    TEAL_SOFT,
    TERRACOTTA,
    WHITE,
    CheckLine,
    RoundedBox,
    ScriptCard,
    SectionMark,
    WriteBlock,
    draw_header_footer,
    esc,
    hairline,
    register_fonts,
    simple_table,
    styles,
)

# Reuse cover drawing would be wrong; draw a workbook cover instead.
from reportlab.pdfgen.canvas import Canvas

OUT = ROOT / "output" / "pdf" / "calm-evening-survival-guide" / "02_Printable-Family-Worksheets.pdf"
S = None
SECTION = {"name": "Printable pack"}


def P(text, style="Body"):
    return Paragraph(esc(text), S[style])


def sp(h=8):
    return Spacer(1, h)


def kicker(text):
    return Paragraph(esc(text).upper(), S["Kicker"])


def h1(text):
    return Paragraph(esc(text), S["H1"])


def h2(text):
    return Paragraph(esc(text), S["H2"])


def on_cover(canvas: Canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY_DEEP)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(TERRACOTTA)
    canvas.rect(0, 0, 8 * mm, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(WHITE)
    canvas.setFont("SourceSans-Semibold", 9)
    canvas.drawString(22 * mm, PAGE_H - 30 * mm, "PRINTABLE PACK  |  STICK ON THE FRIDGE")
    canvas.setFont("Georgia-Bold", 28)
    canvas.drawString(22 * mm, PAGE_H - 50 * mm, "Family Worksheets")
    canvas.setFont("Georgia-Italic", 13)
    canvas.setFillColor(SAND)
    canvas.drawString(22 * mm, PAGE_H - 62 * mm, "Companion to The Calm Evening Survival Guide")
    canvas.setFillColor(WHITE)
    canvas.setFont("SourceSans", 11)
    y = PAGE_H - 85 * mm
    for line in [
        "Print these pages. Fill them by hand. Put the agreement where",
        "everyone can see it. Do not wait for a perfect Sunday.",
        "",
        "Inside: evening map, weekday planner, screen-time agreement,",
        "chore chart, homework log, conversation cheat sheet,",
        "survival-night card, Sunday reset, four-week calm tracker.",
        "",
        "Every page is a 15-minute tool.",
    ]:
        canvas.drawString(22 * mm, y, line)
        y -= 7 * mm
    canvas.setFillColor(TEAL)
    canvas.roundRect(22 * mm, 40 * mm, PAGE_W - 44 * mm, 20 * mm, 3 * mm, stroke=0, fill=1)
    canvas.setFillColor(WHITE)
    canvas.setFont("SourceSans-Bold", 10)
    canvas.drawString(28 * mm, 51 * mm, "OUTCOME")
    canvas.setFont("SourceSans", 10)
    canvas.drawString(28 * mm, 44 * mm, "Calm evenings. Cooperative children. Less chasing of tablets.")
    canvas.restoreState()


def on_interior(canvas, doc):
    draw_header_footer(canvas, doc, SECTION["name"])


def page_start(name, k, title, lead):
    return [
        kicker(k),
        h1(title),
        P(lead, "Lead"),
        hairline(),
        sp(6),
    ]


def turn(next_section: str):
    return [SectionMark(next_section, SECTION), PageBreak()]


def evening_map():
    return page_start("Evening map", "Worksheet 01", "The evening we actually have", "Fill the true house, not the house on Instagram.") + [
        WriteBlock("Children's names and ages:", 2, CONTENT_W, S),
        WriteBlock("I usually walk in at:", 1, CONTENT_W, S),
        WriteBlock("Children are home from school / extra lesson at:", 1, CONTENT_W, S),
        WriteBlock("Who is with them before I arrive:", 2, CONTENT_W, S),
        WriteBlock("Dinner time / lights-down time:", 1, CONTENT_W, S),
        WriteBlock("The fight usually starts when:", 2, CONTENT_W, S),
        WriteBlock("If light goes, we:", 2, CONTENT_W, S),
        WriteBlock("One sentence: the evening problem in this house is:", 2, CONTENT_W, S),
        *turn("Weekday planner"),
    ]


def weekday_planner():
    head = [Paragraph(esc(x), S["CellHead"]) for x in ["Time", "Mon", "Tue", "Wed", "Thu", "Fri"]]
    rows = ["Arrival / land", "Homework window", "House job", "Screen window", "Collect devices", "Dinner / bath / bags", "Lights down"]
    data = [head]
    for r in rows:
        data.append([Paragraph(esc(r), S["CellBold"])] + [Paragraph(esc(""), S["Cell"]) for _ in range(5)])
    return page_start("Weekday planner", "Worksheet 02", "School-night evening planner", "Write real times. If you get home at 7, do not write 4:30 and then feel like a failure.") + [
        simple_table(data, [38 * mm] + [(CONTENT_W - 38 * mm) / 5] * 5),
        sp(10),
        WriteBlock("Our evening order in one line:", 2, CONTENT_W, S),
        WriteBlock("Late-home trigger time (after this, we run the short evening):", 1, CONTENT_W, S),
        *turn("Weekend planner"),
    ]


def weekend_planner():
    data = [[Paragraph(esc(x), S["CellHead"]) for x in ["Block", "Saturday", "Sunday"]]]
    for r in ["Morning house jobs", "Family / church / mosque / outing", "Child free time (inside minutes)", "Screens allowed until", "Visitors / extra lesson", "Family meeting / reset"]:
        data.append([Paragraph(esc(r), S["CellBold"]), Paragraph(esc(""), S["Cell"]), Paragraph(esc(""), S["Cell"])])
    return page_start("Weekend planner", "Worksheet 03", "Weekend rails", "Weekends fail when Saturday morning has no job and Sunday has no reset.") + [
        simple_table(data, [48 * mm, (CONTENT_W - 48 * mm) / 2, (CONTENT_W - 48 * mm) / 2]),
        sp(10),
        WriteBlock("Saturday morning job for each child:", 3, CONTENT_W, S),
        WriteBlock("If Saturday jobs are not done, afternoon screens:", 2, CONTENT_W, S),
        *turn("Screen agreement"),
    ]


def agreement():
    return page_start("Screen agreement", "Worksheet 04", "Family Screen-Time Agreement", "Read aloud. Fill. Sign. Fridge. Point to this page instead of shouting.") + [
        RoundedBox(
            "OUR DEAL",
            "In this house, phones, tablets, TV, and games are a privilege, not a right.\n"
            "Screens come after the homework window and one house job.\n"
            "Before a device is given, we say the minutes out loud. The child repeats them.\n"
            "When time ends, the child brings the device to: ____________________\n"
            "School-night minutes: ______     Weekend minutes: ______\n"
            "Lights-down / no bedroom screens after: ______\n"
            "If the deal is broken, tomorrow's minutes become: ______\n"
            "Allowed: ________________________________________________\n"
            "Not allowed without a parent: ________________________________",
            CONTENT_W,
            SAND,
            TERRACOTTA,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(10),
        P("Child 1: ________________________  signature: ________________  date: ______"),
        P("Child 2: ________________________  signature: ________________  date: ______"),
        P("Parent / caregiver: ______________  signature: ________________  date: ______"),
        P("Second adult (Aunty / Grandma / Daddy): ________  signature: ______  date: ______"),
        sp(8),
        ScriptCard("Collect sentence", "Time is up. Bring it to the kitchen, please. Thank you for keeping our agreement.", CONTENT_W, S),
        *turn("Chore chart"),
    ]


def chore_chart():
    head = [Paragraph(esc(x), S["CellHead"]) for x in ["Child", "School-night job", "Weekend job", "Inspect time", "M", "T", "W", "T", "F", "S", "S"]]
    data = [head]
    for _ in range(4):
        data.append([Paragraph(esc(""), S["Cell"]) for _ in range(11)])
    return page_start("Chore chart", "Worksheet 05", "House jobs chart", "One job on school nights. Inspect at a named time. Screens wait.") + [
        simple_table(data, [24 * mm, 32 * mm, 32 * mm, 18 * mm] + [((CONTENT_W - 106 * mm) / 7)] * 7),
        sp(8),
        P("Tick the day when the job was done before screens. Empty square means screens did not start."),
        WriteBlock("Inspect sentence I will actually say:", 2, CONTENT_W, S),
        WriteBlock("If the job is undone:", 2, CONTENT_W, S),
        *turn("Homework log"),
    ]


def homework_log():
    story = page_start("Homework log", "Worksheet 06", "Two-week homework window log", "Tick if the window happened. Minutes. One line. Stop writing essays about your child.")
    for week in (1, 2):
        story.append(h2(f"Week {week}"))
        head = [Paragraph(esc(x), S["CellHead"]) for x in ["Day", "Start time", "Minutes", "I sat nearby", "Ended on timer", "Note"]]
        data = [head]
        for d in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]:
            data.append([Paragraph(esc(d), S["CellBold"])] + [Paragraph(esc(""), S["Cell"]) for _ in range(5)])
        story.append(simple_table(data, [20 * mm, 24 * mm, 22 * mm, 28 * mm, 28 * mm, CONTENT_W - 122 * mm]))
        story.append(sp(8))
    story.extend(turn("Cheat sheet"))
    return story


def cheat_sheet():
    cards = [
        ("Walk-in", "Good evening. Bags there. Water first. I land for eight minutes. Then homework. Tablet stays in the kitchen."),
        ("Homework", "Diary out. 25 minutes. I sit here. When it rings, we stop even if it is not finished."),
        ("No homework", "Show me the diary and class WhatsApp. If there is nothing, you read for 15 minutes. Then the house job."),
        ("House job", "Tonight your job is ______. I check at ______. Screens wait until it is done."),
        ("Time is up", "Time is up. Bring it to the kitchen, please. Thank you for keeping our agreement."),
        ("Stall", "I will not hunt the bedroom. One minute. Or tomorrow is 15 minutes shorter. Your choice now."),
        ("Cousin house", "We are not in Aunty Titi's house. In this house screens come after homework and one job."),
        ("Short evening", "Hard day. Bags, food, bath, bed. Screens stay in the kitchen. I love you. I am tired."),
        ("Repair", "I shouted. The rule still stands. I will try that again with a lower voice."),
        ("Love vs yes", "I love you. The tablet is not how I prove it. Love is not the same thing as yes."),
    ]
    story = page_start("Cheat sheet", "Worksheet 07", "Conversation cheat sheet", "Put this in your phone notes or on the fridge. Read one line. Do not invent a sermon.")
    for title, words in cards:
        story += [ScriptCard(title, words, CONTENT_W, S), sp(4)]
    story.extend(turn("Survival night"))
    return story


def survival_card():
    return page_start("Survival night", "Worksheet 08", "Exhausted-parent card", "When you walk in after 8, run this. It is not failure.") + [
        CheckLine("Greet. Water. Bags in one place.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Food if it exists.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Devices in the kitchen park. No unsupervised 'just 20 minutes'.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Bags and uniform for tomorrow.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Bath. Bed. Good night.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Homework: note to teacher, or 15 minutes at 6:00am if it is truly due.", CONTENT_W, S["BodyLeft"]),
        sp(8),
        ScriptCard("Say this", "Today was a hard day. Short evening: bags, food, bath, bed. Screens stay in the kitchen. I love you. I am tired.", CONTENT_W, S),
        sp(8),
        WriteBlock("In this house, a short evening starts if I walk in after:", 1, CONTENT_W, S),
        WriteBlock("The other adult who must know this card:", 1, CONTENT_W, S),
        *turn("Sunday reset"),
    ]


def sunday_reset():
    story = page_start("Sunday reset", "Worksheet 09", "Four Sunday resets", "15 minutes. Not a tribunal. What went well, what slipped, one change.")
    for n in range(1, 5):
        story += [
            h2(f"Sunday {n}  date: __________"),
            WriteBlock("What went well:", 1, CONTENT_W, S),
            WriteBlock("Where the deal slipped:", 1, CONTENT_W, S),
            WriteBlock("One change / extra lesson / travel to plan:", 1, CONTENT_W, S),
            sp(4),
        ]
    story.extend(turn("Calm tracker"))
    return story


def four_week():
    story = page_start("Calm tracker", "Worksheet 10", "Four-week calm tracker", "Score 1-5. 1 is a war. 5 is calm enough. Hunt a pattern, not a perfect child.")
    for week in range(1, 5):
        story.append(h2(f"Week {week}"))
        head = [Paragraph(esc(x), S["CellHead"]) for x in ["Day", "Calm 1-5", "Window", "Job", "Collected", "One line"]]
        data = [head]
        for d in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]:
            data.append([Paragraph(esc(d), S["CellBold"])] + [Paragraph(esc(""), S["Cell"]) for _ in range(5)])
        story.append(simple_table(data, [20 * mm, 24 * mm, 24 * mm, 20 * mm, 26 * mm, CONTENT_W - 114 * mm]))
        story.append(sp(6))
    story.extend(turn("Fridge order"))
    return story


def fridge_order():
    return page_start("Fridge order", "Worksheet 11", "The evening order (print large)", "One page. Children's eye line. Read it when the case starts.") + [
        RoundedBox("1  LAND", "Bags down. Greet. Water. Devices in the kitchen. Mummy/Daddy lands for 8 minutes.", CONTENT_W, TEAL_SOFT, TEAL, S["BoxTitle"], S["BoxBody"]),
        sp(6),
        RoundedBox("2  HOMEWORK WINDOW", "Timer on. One window. Then it ends. Even if the page is not finished.", CONTENT_W, SAND, TERRACOTTA, S["BoxTitle"], S["BoxBody"]),
        sp(6),
        RoundedBox("3  ONE HOUSE JOB", "Each child has one job. Screens wait until it is done.", CONTENT_W, TEAL_SOFT, TEAL, S["BoxTitle"], S["BoxBody"]),
        sp(6),
        RoundedBox("4  EARNED SCREENS", "Minutes said out loud. When time ends, bring it to the kitchen. No bedroom hunt.", CONTENT_W, SAND, TERRACOTTA, S["BoxTitle"], S["BoxBody"]),
        sp(6),
        RoundedBox("5  CLOSE THE EVENING", "Dinner, bath, bags, lights down. Love is not the same thing as yes.", CONTENT_W, TEAL_SOFT, TEAL, S["BoxTitle"], S["BoxBody"]),
        sp(10),
        P("Our minutes: school night ______    weekend ______    collect to: ________________"),
        P("Our short-evening trigger: if we get home after ______"),
    ]


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
    doc = BaseDocTemplate(
        str(OUT),
        pagesize=PAGE,
        title="Calm Evening Printable Family Worksheets",
        author="Parenting Survival Guide",
    )
    doc.addPageTemplates([cover, interior])
    story = [
        Paragraph(" ", ParagraphStyle("x", fontName="SourceSans", fontSize=1, leading=1)),
        NextPageTemplate("interior"),
        SectionMark("Evening map", SECTION),
        PageBreak(),
    ]
    for fn in [
        evening_map,
        weekday_planner,
        weekend_planner,
        agreement,
        chore_chart,
        homework_log,
        cheat_sheet,
        survival_card,
        sunday_reset,
        four_week,
        fridge_order,
    ]:
        story.extend(fn())
    doc.build(story)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
