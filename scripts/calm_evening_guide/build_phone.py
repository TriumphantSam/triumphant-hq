"""Phone-first Quick Start. Open this in traffic. Do not read the long book first."""

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
from reportlab.pdfgen.canvas import Canvas

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from theme import (  # noqa: E402
    CONTENT_W,
    MARGIN_B,
    MARGIN_L,
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
    draw_header_footer,
    esc,
    hairline,
    register_fonts,
    styles,
)

OUT = ROOT / "output" / "pdf" / "calm-evening-survival-guide" / "00_Phone-Quick-Start.pdf"
S = None
SECTION = {"name": "Phone quick start"}


def P(text, style="BodyLeft"):
    return Paragraph(esc(text), S[style])


def Html(text, style="BodyLeft"):
    return Paragraph(text, S[style])


def sp(h=8):
    return Spacer(1, h)


def kicker(text):
    return Paragraph(esc(text).upper(), S["Kicker"])


def h1(text):
    return Paragraph(esc(text), S["H1"])


def h2(text):
    return Paragraph(esc(text), S["H2"])


def turn(name):
    return [SectionMark(name, SECTION), PageBreak()]


def copy_box(header, line):
    return RoundedBox(header.upper(), line, CONTENT_W, SAND, TERRACOTTA, S["BoxTitle"], S["BoxBody"])


def on_cover(canvas: Canvas, doc):
    canvas.saveState()
    canvas.setFillColor(NAVY_DEEP)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(TERRACOTTA)
    canvas.rect(0, 0, 8 * mm, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(WHITE)
    canvas.setFont("SourceSans-Semibold", 9)
    canvas.drawString(22 * mm, PAGE_H - 28 * mm, "OPEN THIS FIRST  |  PHONE-FRIENDLY")
    canvas.setFont("Georgia-Bold", 30)
    canvas.drawString(22 * mm, PAGE_H - 50 * mm, "2-Minute")
    canvas.drawString(22 * mm, PAGE_H - 64 * mm, "Quick Start")
    canvas.setFont("Georgia-Italic", 13)
    canvas.setFillColor(SAND)
    canvas.drawString(22 * mm, PAGE_H - 78 * mm, "Read this in traffic. Do the long book later.")
    canvas.setFillColor(WHITE)
    canvas.setFont("SourceSans", 12)
    y = PAGE_H - 100 * mm
    for line in [
        "Big type. Short lines. Copy-paste boxes.",
        "No essays. No fluff.",
        "",
        "Do one Quick Win now.",
        "Use one script tonight.",
        "Open the full guide when you sit down.",
    ]:
        canvas.drawString(22 * mm, y, line)
        y -= 7 * mm
    canvas.setFillColor(TEAL)
    canvas.roundRect(22 * mm, 42 * mm, PAGE_W - 44 * mm, 28 * mm, 3 * mm, stroke=0, fill=1)
    canvas.setFillColor(WHITE)
    canvas.setFont("SourceSans-Bold", 10)
    canvas.drawString(28 * mm, 58 * mm, "QUICK WIN")
    canvas.setFont("SourceSans", 11)
    canvas.drawString(28 * mm, 50 * mm, "Save 3 scripts to your phone notes. Now.")
    canvas.restoreState()


def on_interior(canvas, doc):
    draw_header_footer(canvas, doc, SECTION["name"])


def page_wins():
    return [
        kicker("Do this first"),
        h1("Quick Wins"),
        P("Finish these in 2 minutes. Do them now. Do not wait for a free evening."),
        hairline(),
        sp(6),
        CheckLine("Open your phone notes.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Copy the 3 scripts on the next page.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Name the note: CALM EVENING.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Put a bowl or basket on the kitchen counter.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Say this out loud: Land. Homework. One job. Then screens.", CONTENT_W, S["BodyLeft"]),
        sp(8),
        RoundedBox(
            "STOP HERE IF YOU MUST",
            "That is enough for now.\nClose this file.\nUse one script when you walk in.\nOpen the rest when you sit down.",
            CONTENT_W,
            TEAL_SOFT,
            TEAL,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(8),
        RoundedBox(
            "IF YOU HAVE 2 MORE MINUTES",
            "Text the other adult in the house:\n\"We are trying a written evening order this week. Devices wait in the kitchen.\"",
            CONTENT_W,
            SAND,
            TERRACOTTA,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        *turn("Copy-paste"),
    ]


def page_scripts():
    boxes = [
        ("Walk-in", "Bags there. Water first. I land for 8 minutes. The tablet stays in the kitchen."),
        ("Homework", "Diary out. 25 minutes. I sit here. When it rings, we stop."),
        ("Time is up", "Time is up. Bring it to the kitchen, please. Thank you for keeping our agreement."),
        ("They stall", "I will not hunt the bedroom. One minute. Or tomorrow is 15 minutes shorter."),
        ("They cry", "I love you. The tablet is not how I prove it. Love is not the same thing as yes."),
        ("Hard day", "Short evening: bags, food, bath, bed. Screens stay in the kitchen. I love you. I am tired."),
    ]
    story = [
        kicker("Save these now"),
        h1("Copy-paste boxes"),
        P("Tap. Copy. Paste into Notes. Use one tonight. Flat voice is fine."),
        hairline(),
        sp(4),
    ]
    for header, line in boxes:
        story += [copy_box(header, line), sp(5)]
    story += turn("Action plan")
    return story


def page_plan():
    return [
        kicker("What next"),
        h1("Action Plan"),
        P("Do the next step that fits tonight. Skip the rest. Come back when you can."),
        hairline(),
        sp(6),
        RoundedBox(
            "NOW  ·  2 MINUTES",
            "Save 3 scripts.\nPut a basket in the kitchen.\nSay the evening order once.",
            CONTENT_W,
            TEAL_SOFT,
            TEAL,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(6),
        RoundedBox(
            "TONIGHT  ·  15 MINUTES",
            "Use the walk-in script.\nRun one homework window or one house job.\nCollect devices into the basket.",
            CONTENT_W,
            SAND,
            TERRACOTTA,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(6),
        RoundedBox(
            "THIS WEEK  ·  WHEN YOU SIT DOWN",
            "Open the main guide.\nPrint the Screen-Time Agreement.\nSign it. Stick it on the fridge.",
            CONTENT_W,
            TEAL_SOFT,
            TEAL,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(10),
        h2("Upgrade Path"),
        P("Move forward only when the last step feels easy. No rush. No exam."),
        CheckLine("Step 1: You used one script.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Step 2: You signed the agreement.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Step 3: You ran a Sunday reset.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Step 4: You tracked one calm week.", CONTENT_W, S["BodyLeft"]),
        sp(8),
        RoundedBox(
            "YOU ARE DONE FOR TODAY IF...",
            "One script is in your Notes.\nOne basket is in the kitchen.\nThat is a win. Close the file.",
            CONTENT_W,
            SAND,
            TERRACOTTA,
            S["BoxTitle"],
            S["BoxBody"],
        ),
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
        title="Calm Evening Phone Quick Start",
        author="Parenting Survival Guide",
    )
    doc.addPageTemplates([cover, interior])
    story = [
        Paragraph(" ", ParagraphStyle("x", fontName="SourceSans", fontSize=1, leading=1)),
        NextPageTemplate("interior"),
        SectionMark("Quick wins", SECTION),
        PageBreak(),
    ]
    story.extend(page_wins())
    story.extend(page_scripts())
    story.extend(page_plan())
    doc.build(story)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
