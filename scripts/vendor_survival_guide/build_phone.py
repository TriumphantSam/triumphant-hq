"""Phone-first Quick Start. Open this in traffic. Do not read the long book first."""

from __future__ import annotations

import sys
from pathlib import Path

from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfgen.canvas import Canvas
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
    BRICK,
    CHARCOAL_DEEP,
    CONTENT_W,
    GREEN,
    GREEN_SOFT,
    MARGIN_B,
    MARGIN_L,
    MARGIN_T,
    PAGE,
    PAGE_H,
    PAGE_W,
    SAND,
    WHITE,
    CheckLine,
    CopyPaste,
    RoundedBox,
    SectionMark,
    draw_header_footer,
    hairline,
    register_fonts,
    styles,
)

OUT = ROOT / "output" / "pdf" / "vendor-survival-sales-guide" / "00_Phone-Quick-Start.pdf"
S = None
SECTION = {"name": "Phone quick start"}


def P(text, style="BodyLeft"):
    return Paragraph(text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;"), S[style])


def sp(h=8):
    return Spacer(1, h)


def kicker(text):
    return Paragraph(text.upper(), S["Kicker"])


def h1(text):
    return Paragraph(text, S["H1"])


def h2(text):
    return Paragraph(text, S["H2"])


def turn(name):
    return [SectionMark(name, SECTION), PageBreak()]


def on_cover(canvas: Canvas, doc):
    canvas.saveState()
    canvas.setFillColor(CHARCOAL_DEEP)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(GREEN)
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
        "Use one script on the next last-price.",
        "Open the full guide when you sit down.",
    ]:
        canvas.drawString(22 * mm, y, line)
        y -= 7 * mm
    canvas.setFillColor(GREEN)
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
        CheckLine("Name the note: VENDOR SCRIPTS.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Replace [product], [price], [benefit] with today's offer.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Pin one TikTok comment or post one Status. Then reply.", CONTENT_W, S["BodyLeft"]),
        sp(8),
        RoundedBox(
            "STOP HERE IF YOU MUST",
            "That is enough for now.\nClose this file.\nUse one script on the next last-price.\nOpen the rest when you sit down.",
            CONTENT_W,
            GREEN_SOFT,
            GREEN,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(8),
        RoundedBox(
            "IF YOU HAVE 2 MORE MINUTES",
            "Write your real price on a paper you can see.\nSay it out loud once. That is the price.",
            CONTENT_W,
            SAND,
            BRICK,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        *turn("Copy-paste"),
    ]


def page_scripts():
    boxes = [
        ("Last price", "[product] is [price].\nThat is the real price, not a starting number.\nYou get [benefit].\nShould I send the payment link?"),
        ("I will get back", "Alright.\nWhen you are ready, [product] is [price].\nIf you want me to hold it, tell me a time today.\nIf not, I will leave it open."),
        ("TikTok pin", "Comment PRICE and I will send details on WhatsApp.\nDo not ask in comments if you want the full breakdown."),
        ("How much", "[product] is [price].\nYou get the file after payment.\nDo you want me to send the link?"),
        ("Welcome from TikTok", "Welcome. You asked about [product].\nIt is [price]. You get [benefit].\nPayment link, or one question first?"),
        ("Kind close", "If [price] is not in your budget now, I wish you well.\nWhen you are ready, [product] will be here if it is still available."),
    ]
    story = [
        kicker("Save these now"),
        h1("Copy-paste boxes"),
        P("Tap. Copy. Paste into Notes. Fill the blanks. Use one today."),
        hairline(),
        sp(4),
    ]
    for header, line in boxes:
        story += [CopyPaste(header, line, CONTENT_W, S), sp(5)]
    story += turn("Action plan")
    return story


def page_plan():
    return [
        kicker("What next"),
        h1("Action Plan"),
        P("Do the next step that fits today. Skip the rest. Come back when you can."),
        hairline(),
        sp(6),
        RoundedBox(
            "NOW  ·  2 MINUTES",
            "Save 3 scripts.\nFill [product], [price], [benefit].\nSay the price out loud once.",
            CONTENT_W,
            GREEN_SOFT,
            GREEN,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(6),
        RoundedBox(
            "TODAY  ·  20 MINUTES",
            "Post one Status or pin one TikTok comment.\nReply every how-much.\nUse LAST PRICE once without dropping the number.",
            CONTENT_W,
            SAND,
            BRICK,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(6),
        RoundedBox(
            "THIS WEEK  ·  WHEN YOU SIT DOWN",
            "Open the main guide.\nFill the Offer Setup page.\nRun the 7-day sequence. Track what paid.",
            CONTENT_W,
            GREEN_SOFT,
            GREEN,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(10),
        h2("Upgrade Path"),
        P("Move forward only when the last step feels easy. No rush. No exam."),
        CheckLine("Step 1: You used one script.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Step 2: You filled one offer and one price.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Step 3: You ran 7 days of posts plus replies.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Step 4: You tracked one paid week.", CONTENT_W, S["BodyLeft"]),
        sp(8),
        RoundedBox(
            "YOU ARE DONE FOR TODAY IF...",
            "One script is in your Notes.\nOne real price is filled.\nThat is a win. Close the file.",
            CONTENT_W,
            SAND,
            BRICK,
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
        title="Vendor Survival Phone Quick Start",
        author="Vendor Survival System",
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
