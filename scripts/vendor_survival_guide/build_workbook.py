"""Printable vendor planner: one tool per page, large write-in areas."""

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
    GOLD,
    GOLD_SOFT,
    GREEN,
    GREEN_SOFT,
    MARGIN_B,
    MARGIN_L,
    MARGIN_R,
    MARGIN_T,
    PAGE,
    PAGE_H,
    PAGE_W,
    SAND,
    WHITE,
    CheckLine,
    CopyPaste,
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

OUT = ROOT / "output" / "pdf" / "vendor-survival-sales-guide" / "02_Vendor-Sales-Workbook.pdf"
S = None
SECTION = {"name": "Workbook"}


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
    canvas.setFillColor(CHARCOAL_DEEP)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(GREEN)
    canvas.rect(0, 0, 8 * mm, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(WHITE)
    canvas.setFont("SourceSans-Semibold", 9)
    canvas.drawString(22 * mm, PAGE_H - 30 * mm, "PRINTABLE PACK  |  FILL BY HAND")
    canvas.setFont("Georgia-Bold", 28)
    canvas.drawString(22 * mm, PAGE_H - 50 * mm, "Sales Workbook")
    canvas.setFont("Georgia-Bold", 28)
    canvas.drawString(22 * mm, PAGE_H - 62 * mm, "& 30-Day Planner")
    canvas.setFont("Georgia-Italic", 13)
    canvas.setFillColor(SAND)
    canvas.drawString(22 * mm, PAGE_H - 76 * mm, "Companion to The Vendor Survival & Sales Guide")
    canvas.setFillColor(WHITE)
    canvas.setFont("SourceSans", 11)
    y = PAGE_H - 98 * mm
    for line in [
        "Print these pages. Write real names, real prices, real dates.",
        "Do not wait for a perfect brand week.",
        "",
        "Inside: offer setup, 7-day launch calendar, objection playbook,",
        "TikTok keyword sheet, daily sales planner, buyer log,",
        "delivery checklist, confidence contract, 30-day tracker.",
        "",
        "Every page is a tool you can use today.",
    ]:
        canvas.drawString(22 * mm, y, line)
        y -= 7 * mm
    canvas.setFillColor(GREEN)
    canvas.roundRect(22 * mm, 40 * mm, PAGE_W - 44 * mm, 22 * mm, 3 * mm, stroke=0, fill=1)
    canvas.setFillColor(WHITE)
    canvas.setFont("SourceSans-Bold", 10)
    canvas.drawString(28 * mm, 53 * mm, "OUTCOME")
    canvas.setFont("SourceSans", 10)
    canvas.drawString(28 * mm, 46 * mm, "Predictable daily sales. Confident communication.")
    canvas.restoreState()


def on_interior(canvas, doc):
    draw_header_footer(canvas, doc, SECTION["name"])


def page_start(k, title, lead):
    return [
        kicker(k),
        h1(title),
        P(lead, "Lead"),
        hairline(),
        sp(6),
    ]


def turn(next_section: str):
    return [SectionMark(next_section, SECTION), PageBreak()]


def offer_setup():
    return page_start("Worksheet 01", "Offer setup", "Fill this once before you copy any script. If this page is empty, every message is a costume.") + [
        WriteBlock("Product name [product]:", 1, CONTENT_W, S),
        WriteBlock("Who it is for [who]:", 2, CONTENT_W, S),
        WriteBlock("The result they want [benefit]:", 2, CONTENT_W, S),
        WriteBlock("The pain they are tired of [pain]:", 2, CONTENT_W, S),
        WriteBlock("Price [price]  ·  Payment link [link]:", 1, CONTENT_W, S),
        WriteBlock("What is inside (5 bullets):", 5, CONTENT_W, S),
        WriteBlock("Sample I can send without giving the whole product away:", 2, CONTENT_W, S),
        WriteBlock("Delivery method (WhatsApp file / Drive / Selar) and access time:", 1, CONTENT_W, S),
        WriteBlock("Bonus this week (or write none):", 1, CONTENT_W, S),
        WriteBlock("My one next-step word (PAY / SAMPLE / PRICE):", 1, CONTENT_W, S),
        *turn("Launch calendar"),
    ]


def launch_calendar():
    head = [Paragraph(esc(x), S["CellHead"]) for x in ["Day", "Job", "Posted", "Replies", "Paid", "Note"]]
    jobs = [
        "Teaser + reply SAMPLE people",
        "Second teaser or who-it-is-for",
        "Launch announcement",
        "What is inside + pin link",
        "Sample reminder + price questions",
        "Checkout follow-up (once)",
        "Delivery check + ask 2 reviews",
    ]
    data = [head]
    for i, job in enumerate(jobs, 1):
        data.append([
            Paragraph(esc(str(i)), S["CellBold"]),
            Paragraph(esc(job), S["Cell"]),
            Paragraph(esc(""), S["Cell"]),
            Paragraph(esc(""), S["Cell"]),
            Paragraph(esc(""), S["Cell"]),
            Paragraph(esc(""), S["Cell"]),
        ])
    return page_start("Worksheet 02", "7-day launch calendar", "Write real dates. Tick posted. Count replies. Do not invent a perfect week after the fact.") + [
        simple_table(data, [14 * mm, 58 * mm, 18 * mm, 20 * mm, 16 * mm, CONTENT_W - 126 * mm]),
        sp(10),
        WriteBlock("Launch week starts on (date):", 1, CONTENT_W, S),
        WriteBlock("The one offer I will not change this week:", 2, CONTENT_W, S),
        WriteBlock("If nobody pays by Day 7, I will change (offer / who / price / place) because:", 2, CONTENT_W, S),
        *turn("Objection playbook"),
    ]


def objection_playbook():
    rows = [
        "Last price",
        "Too expensive",
        "I will get back",
        "Can I pay later",
        "I saw it cheaper",
        "Send the file first",
        "How much? then silence",
        "They got rude",
    ]
    head = [Paragraph(esc(x), S["CellHead"]) for x in ["They say", "My saved reply (fill your real [price])", "Paid?"]]
    data = [head]
    for r in rows:
        data.append([
            Paragraph(esc(r), S["CellBold"]),
            Paragraph(esc(""), S["Cell"]),
            Paragraph(esc(""), S["Cell"]),
        ])
    return page_start("Worksheet 03", "My 8 objection replies", "Save eight. Not eighty. Write the exact words you will send. Then use them.") + [
        simple_table(data, [38 * mm, CONTENT_W - 56 * mm, 18 * mm]),
        sp(8),
        RoundedBox(
            "DISCOUNT RULES I WILL KEEP",
            "I can add a small bonus, not slash the price every night.\n"
            "I can discount a bundle, not a single cheap item.\n"
            "I can give a close-people price once, not every week.\n"
            "If I discount, I write the new price here so I do not forget: N________",
            CONTENT_W,
            GOLD_SOFT,
            GOLD,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(8),
        WriteBlock("Smaller option I can offer instead of begging:", 2, CONTENT_W, S),
        *turn("TikTok sheet"),
    ]


def tiktok_sheet():
    return page_start("Worksheet 04", "TikTok to WhatsApp sheet", "One video. One offer. One keyword. Write it so you stop improvising in comments.") + [
        WriteBlock("The video I will push this week (what it shows):", 2, CONTENT_W, S),
        WriteBlock("Pinned comment CTA (copy the exact line):", 2, CONTENT_W, S),
        WriteBlock("Keyword people must send (PRICE / PAY / CATALOG):", 1, CONTENT_W, S),
        WriteBlock("WhatsApp link or wa.me:", 1, CONTENT_W, S),
        WriteBlock("Comment reply for 'how much' (one line + WhatsApp):", 2, CONTENT_W, S),
        WriteBlock("First WhatsApp message after they arrive:", 3, CONTENT_W, S),
        WriteBlock("Follow-up if they go quiet (one message only):", 2, CONTENT_W, S),
        sp(6),
        h2("This week's count"),
        WriteBlock("Comments I replied  ·  People who landed on WhatsApp  ·  People who paid:", 2, CONTENT_W, S),
        *turn("Daily planner"),
    ]


def daily_planner():
    story = page_start("Worksheet 05", "Daily sales week planner", "One post a day. Then reply. Do not post all 50 templates this week.")
    head = [Paragraph(esc(x), S["CellHead"]) for x in ["Day", "Post type", "Caption I will use (first line)", "CTA", "DMs", "Paid"]]
    days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    types = ["Direct offer", "Problem-solution", "Trust / review", "Question", "Soft-sell tip", "Urgency / stock", "Reminder + CTA"]
    data = [head]
    for d, t in zip(days, types):
        data.append([
            Paragraph(esc(d), S["CellBold"]),
            Paragraph(esc(t), S["Cell"]),
            Paragraph(esc(""), S["Cell"]),
            Paragraph(esc(""), S["Cell"]),
            Paragraph(esc(""), S["Cell"]),
            Paragraph(esc(""), S["Cell"]),
        ])
    story += [
        simple_table(data, [16 * mm, 32 * mm, CONTENT_W - 98 * mm, 18 * mm, 16 * mm, 16 * mm]),
        sp(10),
        WriteBlock("The one CTA word this week:", 1, CONTENT_W, S),
        WriteBlock("The post I will repeat next week because it got DMs:", 2, CONTENT_W, S),
        *turn("Buyer log"),
    ]
    return story


def buyer_log():
    story = page_start("Worksheet 06", "Buyer conversation log", "Write the humans. Not vibes. This page tells you which script made money.")
    head = [Paragraph(esc(x), S["CellHead"]) for x in ["Name", "From", "They asked", "Script I used", "Next", "Paid"]]
    data = [head]
    for _ in range(10):
        data.append([Paragraph(esc(""), S["Cell"]) for _ in range(6)])
    story += [
        simple_table(data, [28 * mm, 22 * mm, 32 * mm, 36 * mm, 28 * mm, 16 * mm]),
        sp(8),
        P("From = Status / TikTok / IG / friend. Next = hold / follow-up / close / deliver."),
        WriteBlock("Pattern I noticed this week:", 2, CONTENT_W, S),
        *turn("Delivery"),
    ]
    return story


def delivery():
    return page_start("Worksheet 07", "Payment and delivery checklist", "Speed is part of the product. Use this every time money drops.") + [
        CheckLine("Payment confirmed (screenshot / Selar / alert).", CONTENT_W, S["BodyLeft"]),
        CheckLine("Correct file attached. Not last year's draft.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Start Here instruction included.", CONTENT_W, S["BodyLeft"]),
        CheckLine("I told them what to open first.", CONTENT_W, S["BodyLeft"]),
        CheckLine("If they have trouble: asked for screenshot, sent a second copy, confirmed it opened.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Asked for a short voice note or 2-line review after they used one script.", CONTENT_W, S["BodyLeft"]),
        sp(8),
        WriteBlock("My delivery message (copy from the book, then write your real version):", 4, CONTENT_W, S),
        WriteBlock("If the PDF will not open, I send:", 2, CONTENT_W, S),
        *turn("Confidence"),
    ]


def confidence():
    return page_start("Worksheet 08", "Confidence contract", "Read aloud. Sign. This is the deal you keep with yourself when last price arrives at 11pm.") + [
        RoundedBox(
            "I WILL",
            "Say the real price.\n"
            "Send one clear next step.\n"
            "Offer a smaller option before I slash the main price.\n"
            "Follow up once after I will get back.\n"
            "Close politely when they are not a buyer.\n"
            "Deliver the same day payment shows.",
            CONTENT_W,
            GREEN_SOFT,
            GREEN,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(6),
        RoundedBox(
            "I WILL NOT",
            "Beg.\n"
            "Insult the customer or the cheaper seller.\n"
            "Lie about stock.\n"
            "Send eight follow-ups.\n"
            "Paste my account under a TikTok.\n"
            "Send the full file because they said let me see.",
            CONTENT_W,
            SAND,
            BRICK,
            S["BoxTitle"],
            S["BoxBody"],
        ),
        sp(10),
        P("Vendor name: ______________________________  date: ________"),
        P("Signature: ________________________________"),
        sp(8),
        ScriptCard(
            "When I feel cheap",
            "The price is [price]. I will be here. If you have moved on, no wahala.",
            CONTENT_W,
            S,
        ),
        *turn("30-day tracker"),
    ]


def tracker():
    story = page_start("Worksheet 09", "30-day sales tracker", "Score the day. Hunt a pattern. 1 is silence. 5 is a paid day. Do not write essays about the algorithm.")
    for week in range(1, 5):
        story.append(h2(f"Week {week}  dates: __________ to __________"))
        head = [Paragraph(esc(x), S["CellHead"]) for x in ["Day", "Posted", "Replies", "Paid", "Score 1-5", "Script that worked"]]
        data = [head]
        for d in ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]:
            data.append([Paragraph(esc(d), S["CellBold"])] + [Paragraph(esc(""), S["Cell"]) for _ in range(5)])
        story.append(simple_table(data, [18 * mm, 20 * mm, 22 * mm, 18 * mm, 24 * mm, CONTENT_W - 102 * mm]))
        story.append(sp(6))
    story.extend(turn("Weekly review"))
    return story


def weekly_review():
    story = page_start("Worksheet 10", "Four weekly reviews", "15 minutes. Not a tribunal. What paid, what wasted time, one change.")
    for n in range(1, 5):
        story += [
            h2(f"Week {n}  date: __________"),
            WriteBlock("What paid (script + place):", 1, CONTENT_W, S),
            WriteBlock("What I will stop doing:", 1, CONTENT_W, S),
            WriteBlock("One change next week:", 1, CONTENT_W, S),
            sp(4),
        ]
    story.extend(turn("Status sequence"))
    return story


def status_fill():
    return page_start("Worksheet 11", "My Status sequence this week", "Write the real lines. Then copy to Status. One per day.") + [
        WriteBlock("Day 1 teaser:", 2, CONTENT_W, S),
        WriteBlock("Day 2 SAMPLE:", 2, CONTENT_W, S),
        WriteBlock("Day 3 who it is for:", 2, CONTENT_W, S),
        WriteBlock("Day 4 live + [price]:", 2, CONTENT_W, S),
        WriteBlock("Day 5 what is inside:", 2, CONTENT_W, S),
        WriteBlock("Day 6 checkout help:", 2, CONTENT_W, S),
        WriteBlock("Day 7 last reminder:", 2, CONTENT_W, S),
        *turn("Cheat sheet"),
    ]


def cheat_sheet():
    cards = [
        ("Last price", "[product] is [price]. That is the real price, not a starting number. You get [benefit]. Should I send the payment link?"),
        ("Too expensive", "I understand. [product] is [price]. It includes [benefit]. Hold it, or I show a closer option?"),
        ("I will get back", "Alright. When you are ready, [product] is [price]. If you want me to hold it, tell me a time today."),
        ("Last follow-up", "I will not keep following up after this. If you want [product], send PAY. If you have moved on, no wahala."),
        ("TikTok pin", "Comment PRICE and I will send details on WhatsApp."),
        ("Welcome from TikTok", "Welcome. You asked about [product]. It is [price]. You get [benefit]. Payment link, or one question?"),
        ("How much", "[product] is [price]. You get the file [time] after payment. Do you want the link?"),
        ("Kind close", "If [price] is not in your budget now, I wish you well. When you are ready, [product] will be here if it is still available."),
    ]
    story = page_start("Worksheet 12", "Phone cheat sheet", "Put this in Notes. Read one line. Do not invent a sermon at 11pm.")
    for title, words in cards:
        story += [CopyPaste(title, words, CONTENT_W, S), sp(4)]
    return story


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
        title="Vendor Sales Workbook & 30-Day Planner",
        author="Vendor Survival System",
    )
    doc.addPageTemplates([cover, interior])
    story = [
        Paragraph(" ", ParagraphStyle("x", fontName="SourceSans", fontSize=1, leading=1)),
        NextPageTemplate("interior"),
        SectionMark("Offer setup", SECTION),
        PageBreak(),
    ]
    for fn in [
        offer_setup,
        launch_calendar,
        objection_playbook,
        tiktok_sheet,
        daily_planner,
        buyer_log,
        delivery,
        confidence,
        tracker,
        weekly_review,
        status_fill,
        cheat_sheet,
    ]:
        story.extend(fn())
    doc.build(story)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
