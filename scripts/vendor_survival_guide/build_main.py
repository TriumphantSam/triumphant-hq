"""Build The Vendor Survival & Sales Guide - main professional book."""

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
    BadgeRow,
    CheckLine,
    CopyPaste,
    RoundedBox,
    SectionMark,
    draw_cover_page,
    draw_header_footer,
    esc,
    hairline,
    register_fonts,
    simple_table,
    styles,
)

OUT = ROOT / "output" / "pdf" / "vendor-survival-sales-guide" / "01_The-Vendor-Survival-Sales-Guide.pdf"
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


def seen(text):
    return RoundedBox("YOU ARE SEEN", text, CONTENT_W, SAND, BRICK, S["BoxTitle"], S["BoxBody"])


def outcome(text):
    return RoundedBox("THE OUTCOME", text, CONTENT_W, GREEN_SOFT, GREEN, S["BoxTitle"], S["BoxBody"])


def rule(text):
    return RoundedBox("THE RULE", text, CONTENT_W, GOLD_SOFT, GOLD, S["BoxTitle"], S["BoxBody"])


def today(*items):
    body = "\n".join(f"- {i}" for i in items)
    return RoundedBox("TODAY, ON YOUR PHONE", body, CONTENT_W, GREEN_SOFT, GREEN, S["BoxTitle"], S["BoxBody"])


def cp(name, words):
    return CopyPaste(name, words, CONTENT_W, S)


def turn(next_section: str):
    return [SectionMark(next_section, SECTION), PageBreak()]


def on_cover(canvas, doc):
    draw_cover_page(canvas, doc)


def on_interior(canvas, doc):
    draw_header_footer(canvas, doc, SECTION["name"])


def letter():
    return [
        kicker("A letter to you"),
        h1("You are not a desperate vendor."),
        P("You already have something to sell. A file. A dress. A service. A pack sitting on your laptop.", "Lead"),
        P("The hard part is not the product. The hard part is the chat."),
        Html("<b>Last price. I will get back to you. How much? Then silence.</b>", "Lead"),
        seen(
            "You post on Status. People view it. Nobody replies. You get 12,000 TikTok views and two comments that say 'nice'. You type a follow-up, delete it, type it again, send it, then feel cheap. Someone says last price before they even ask what is inside. You drop the price because you are afraid they will leave. They leave anyway."
        ),
        sp(6),
        P("Here is the part nobody told you."),
        P("Your product is not always the problem. Your silence, your long speeches, and your panic discounts are the problem."),
        Html("<b>You do not have a sales system. You have hope and a chat list.</b>", "Lead"),
        P("This book is not a course. It is not motivation. It is the words, the daily rhythm, and the close."),
        P("Every script is phone-first. Short. Punchy. Easy to read on a small screen. Copy it. Replace the blanks. Send one message. Wait."),
        outcome(
            "Predictable daily sales. Confident communication. You stop guessing what to type. You stop begging. You stop insulting. You send the next clear step, then you track what paid."
        ),
        sp(6),
        BadgeRow(["WhatsApp", "TikTok", "Status", "Selar", "Phone-first"], CONTENT_W),
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
        CheckLine("Open Notes. Title it: VENDOR SCRIPTS.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Copy LAST PRICE, I WILL GET BACK, and TIKTOK PIN.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Fill [product], [price], [benefit] with today's real offer.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Post one Status or pin one TikTok comment. Then reply.", CONTENT_W, S["BodyLeft"]),
        sp(6),
        cp(
            "Last price",
            "[product] is [price].\nThat is the real price, not a starting number.\nYou get [benefit].\nShould I send the payment link?",
        ),
        sp(5),
        cp(
            "I will get back",
            "Alright.\nWhen you are ready, [product] is [price].\nIf you want me to hold it, tell me a time today.\nIf not, I will leave it open.",
        ),
        sp(5),
        cp(
            "TikTok pin",
            "Comment PRICE and I will send details on WhatsApp.\nDo not ask in comments if you want the full breakdown.",
        ),
        PageBreak(),
        SectionMark("Phone start", SECTION),
        h2("Action Plan"),
        RoundedBox("NOW", "Save 3 scripts. Fill your real [product], [price], [benefit].", CONTENT_W, GREEN_SOFT, GREEN, S["BoxTitle"], S["BoxBody"]),
        sp(5),
        RoundedBox("TODAY", "Send one launch or one Status. Reply every 'how much' the same day. Use LAST PRICE once.", CONTENT_W, SAND, BRICK, S["BoxTitle"], S["BoxBody"]),
        sp(5),
        RoundedBox("THIS WEEK", "Run the 7-day Status sequence. Track replies and payments. Keep only what paid.", CONTENT_W, GREEN_SOFT, GREEN, S["BoxTitle"], S["BoxBody"]),
        sp(8),
        h2("Upgrade Path"),
        P("Take the next step only when the last one feels easy. No exam."),
        CheckLine("You used one script. You started. You can stop here tonight.", CONTENT_W, S["BodyLeft"]),
        CheckLine("You filled your offer sentence and one price. The chat has rails.", CONTENT_W, S["BodyLeft"]),
        CheckLine("You ran 7 days of posts plus replies. The system is alive.", CONTENT_W, S["BodyLeft"]),
        CheckLine("You tracked one week. You can see which words made money.", CONTENT_W, S["BodyLeft"]),
        sp(8),
        today(
            "Do one Quick Win now.",
            "Use one script on the next 'last price'.",
            "Open the next chapter only if you want to.",
        ),
        *turn("Contents"),
    ]


def toc_page():
    rows = [
        ("00", "Quick start", "Do this on your phone first"),
        ("01", "The real problem", "Views, silence, and panic discounts"),
        ("02", "The Vendor Survival System", "One offer. One price. One next step."),
        ("03", "Fill your blanks once", "The key that makes every script usable"),
        ("04", "WhatsApp launch", "Teaser to live without sounding desperate"),
        ("05", "Sample, checkout, deliver", "Taste, pay, file, review"),
        ("06", "Last price", "Firm. Polite. No theatre."),
        ("07", "I will get back", "Hold, follow up, or close"),
        ("08", "Cheaper elsewhere", "Explain value. Offer a ladder. Leave well."),
        ("09", "TikTok to WhatsApp", "Views are not sales. Move them."),
        ("10", "First 60 seconds", "What to send when they arrive"),
        ("11", "Daily sales posts", "Never stare at Status again"),
        ("12", "The 7-day proof", "A week that produces money, not content"),
        ("13", "Confidence rules", "No begging. No insulting. No 8 follow-ups."),
        ("14", "Close the file", "Do this. Then stop."),
    ]
    story = [
        kicker("How to use this book"),
        h1("Contents"),
        P("Jump to today's fight. Do not read this like a novel."),
        hairline(),
        sp(6),
    ]
    data = [[Paragraph(esc("Ch"), S["CellHead"]), Paragraph(esc("Chapter"), S["CellHead"]), Paragraph(esc("Use it when"), S["CellHead"])]]
    for n, title, use in rows:
        data.append([
            Paragraph(esc(n), S["CellBold"]),
            Paragraph(esc(title), S["CellBold"]),
            Paragraph(esc(use), S["Cell"]),
        ])
    story.append(simple_table(data, [18 * mm, 62 * mm, CONTENT_W - 80 * mm]))
    story += [
        sp(10),
        P("The workbook has the write-in pages: offer setup, launch calendar, objection playbook, daily planner, buyer log, 30-day tracker."),
        P("The Phone Quick Start is 4 pages. Open that in traffic. Open this book on the sofa."),
        *turn("01  The problem"),
    ]
    return story


def ch01():
    return [
        kicker("Chapter 01"),
        h1("The real problem is not your product."),
        P("You can create a PDF in an afternoon. AI made that easy. Buyers did not become easier.", "Lead"),
        hairline(),
        sp(6),
        P("Most vendors start with 'what should I create?' Then they build. Then they post. Then they wait. Then they say digital products do not work."),
        P("The money is made before the file exists. People are already trying to buy something. Your job is to find that, package a clear offer, then stop going blank in the chat."),
        h2("The four Nigerian vendor wounds"),
        P("1. Last price. They ask before they know what they are buying. Bargaining is a habit. If you panic, you train them to keep dragging."),
        P("2. I will get back to you. Sometimes it is money. Sometimes it is comparison. Sometimes it is a polite goodbye. Your job is one clear hold or one follow-up. Not a campaign."),
        P("3. TikTok views, zero WhatsApp DMs. The video worked. The next step did not. Comments are not a checkout. WhatsApp is."),
        P("4. The fear of sounding desperate. So you go quiet. Or you send four voice notes. Both lose the sale."),
        seen(
            "You are not weak because you feel this. You are a vendor in a market where people collect prices, ghost chats, and still expect you to smile. You need rails. Not a new personality."
        ),
        sp(6),
        h2("What this book will not do"),
        P("It will not print money. It will not make a dead offer live. It will not save you if you drop your price every night."),
        P("It will give you words you can send today, and a week you can repeat."),
        outcome("Stop creating first and hunting buyers later. Sell what people already ask for. Then use scripts so the chat does not depend on your mood."),
        today("Write the last message that made you feel cheap.", "Write the reply you wished you had sent.", "You will meet that reply in Chapter 06."),
        *turn("02  The system"),
    ]


def ch02():
    data = [[Paragraph(esc(x), S["CellHead"]) for x in ["Block", "Minutes", "Job"]]]
    for a, b, c in [
        ("Post", "10", "One Status, one TikTok comment sweep, or one launch line"),
        ("Reply", "20", "Every how-much and PRICE comment. Move them to WhatsApp"),
        ("Close", "15", "Send details once. Ask a decision. Follow up yesterday's quiet chats once"),
        ("Deliver", "10", "Payment in. File out. Tell them what to open first"),
        ("Track", "5", "What you sent. Who replied. Who paid. Repeat only that"),
    ]:
        data.append([Paragraph(esc(a), S["CellBold"]), Paragraph(esc(b), S["Cell"]), Paragraph(esc(c), S["Cell"])])
    story_table = simple_table(data, [28 * mm, 22 * mm, CONTENT_W - 50 * mm])
    return [
            kicker("Chapter 02"),
            h1("The Vendor Survival System"),
            P("One offer. One price. One next step. Every day.", "Lead"),
            hairline(),
            sp(6),
            P("If a buyer must think, they will keep scrolling. If you dump five links, they will pick none. If you change the price in every chat, you will hate your own business."),
            h2("The four rails"),
            P("RAIL 1  ·  OFFER. [product] helps [who] get [benefit] without [the confusing thing they are tired of]."),
            P("RAIL 2  ·  PRICE. One number. Say it. Do not hide it unless you truly cannot. Hidden prices create last-price fights."),
            P("RAIL 3  ·  NEXT STEP. PAY. SAMPLE. PRICE. One word. One link. Not a paragraph."),
            P("RAIL 4  ·  RHYTHM. Post once. Reply the same day. Follow up once. Deliver fast. Track what paid."),
            rule("Keep one product, one price, and one next step in every message. Do not dump five links."),
            sp(6),
            h2("The daily loop"),
            story_table,
            sp(8),
            P("That is 60 minutes. Not a full-time content job. If you cannot do 60, do Reply and Close. Posting without replies is decoration."),
            today("Write your one offer sentence.", "Write your one price.", "Write your one next step word."),
            *turn("03  Fill-in key"),
        ]


def ch03():
    data = [[Paragraph(esc(a), S["CellHead"]), Paragraph(esc(b), S["CellHead"])] for a, b in [("Blank", "What you write")]]
    for a, b in [
        ("[product]", "The name of what you sell today"),
        ("[price]", "Your real price. Example: N5,000"),
        ("[benefit]", "The result they want. Not 'a nice PDF'"),
        ("[who]", "Who it is for. Be cruelly specific"),
        ("[pain]", "The annoying problem they already have"),
        ("[link]", "Selar, Paystack, or wa.me"),
        ("[sample]", "One page or one template. Not the whole file"),
        ("[time]", "How fast they get access. Usually instantly"),
        ("[bonus]", "Extra this week, or write none"),
        ("[keyword]", "PRICE, PAY, SAMPLE, CATALOG"),
    ]:
        data.append([Paragraph(esc(a), S["CellBold"]), Paragraph(esc(b), S["Cell"])])
    return [
            kicker("Chapter 03"),
            h1("Fill your blanks once."),
            P("Until these are real, every script is a costume.", "Lead"),
            hairline(),
            sp(6),
            P("Do this on paper or in Notes before you copy anything. If you skip this, you will send [product] to a human being. That is how you look unserious."),
            h3("The fill-in key"),
            simple_table(data, [36 * mm, CONTENT_W - 36 * mm]),
            sp(8),
            h2("Offer sentence"),
            cp(
                "Offer sentence",
                "[product] is a simple [ebook / template pack / planner / prompt pack] for [who]\nwho want [benefit] without [the confusing thing they are tired of].",
            ),
            sp(5),
            cp(
                "Worked example",
                "WhatsApp Sales Scripts For Fashion Vendors is a copy-paste pack for boutique\nand thrift sellers who want more orders without guessing what to type.",
            ),
            sp(6),
            rule("If you cannot say the offer in two lines, you are not ready to launch. You are still thinking."),
            today("Fill the workbook Offer Setup page.", "Prepare one sample you can send without giving the product away."),
            *turn("04  WhatsApp launch"),
        ]


def ch04():
    return [
        kicker("Chapter 04  ·  WhatsApp Launch Kit"),
        h1("Launch without sounding desperate."),
        P("Do not drop the payment link first. Warm the chat. Then announce. Then follow up once.", "Lead"),
        hairline(),
        sp(6),
        P("Desperation sounds like: 'Please buy.' 'I need to make sales today.' 'Last last I will reduce it.' Confidence sounds like: here is what it is, here is the price, here is the next step. Your tone can be warm. Your structure must be firm."),
        h2("3-day launch"),
        P("Day 1: one teaser. Reply 'what is it?' Send SAMPLE to serious people only."),
        P("Day 2: announce. Send what is inside. Pin [link]. Answer every price question the same day."),
        P("Day 3: one checkout reminder. Follow up 'I will pay later' once. Deliver fast. Ask for a voice note."),
        h2("Pre-launch teasers"),
        cp(
            "Problem teaser",
            "If you have a digital product sitting on your laptop\nand you keep saying you will launch when you are ready,\nthis is the week.\n\nI am dropping [product] for [who] who want [benefit].",
        ),
        sp(5),
        cp(
            "Quiet work",
            "I have been packaging something simple.\nNo long course. No confusion.\n\nIt is for [who] who are tired of [pain].\nI will share it here tomorrow.",
        ),
        sp(5),
        cp(
            "Sample coming",
            "I will send a free sample of [product] to people who reply SAMPLE.\nIf it is useful, you can get the full file when I open it.",
        ),
        PageBreak(),
        SectionMark("04  WhatsApp launch", SECTION),
        cp(
            "Who it is for",
            "This is not for everybody.\n\nIt is for [who] who want [benefit]\nand are ready to use a simple file this week.\nReply YES if that is you.",
        ),
        sp(5),
        cp(
            "Countdown",
            "[product] goes live tomorrow.\nIf you want first access plus [bonus],\nreply READY.",
        ),
        sp(8),
        h2("Launch announcements"),
        cp(
            "Direct launch",
            "[product] is now available.\n\nIt is for [who] who want [benefit].\nPrice is [price].\nYou get access [time] after payment.\n\nSend PAY and I will give you the link.",
        ),
        sp(5),
        cp(
            "Launch with the pain",
            "Most people do not fail because the product is bad.\nThey fail because they do not know what to say when it is time to sell.\n\n[product] gives you [benefit] in a simple file you can use today.\n[price]. Comment or DM PAY.",
        ),
        sp(5),
        cp(
            "What is inside",
            "[product] is live.\n\nInside:\n- [item 1]\n- [item 2]\n- [item 3]\n- [item 4]\n- [item 5]\n\nPrice: [price]\nAccess: [time]\nReply PAY to get the link.",
        ),
        sp(5),
        cp(
            "Busy people",
            "If you do not have time to overthink a launch, use this.\n\n[product] is a ready file for [who].\nOpen it, copy what you need, start.\n\n[price]. Link: [link]",
        ),
        sp(5),
        cp(
            "Close people first",
            "I am giving my close people first access to [product]\nbefore I post it everywhere.\n\nIt helps [who] get [benefit].\nIf you want it, send PAY. Price is [price].",
        ),
        sp(5),
        cp(
            "Status launch",
            "New file for [who]: [product]\nGet [benefit] without starting from zero.\n\n[price]. Reply PAY.",
        ),
        sp(5),
        cp(
            "Bonus window",
            "[product] is [price].\n\nIf you pay today, I am adding [bonus] at no extra cost.\nAfter that, it is just the main file.\n\nSend PAY for the link.",
        ),
        today("Send one teaser today or one launch if you already teased.", "Do not send both in the same hour."),
        *turn("05  Checkout"),
    ]


def ch05():
    return [
        kicker("Chapter 05  ·  WhatsApp Launch Kit"),
        h1("Sample. Checkout. Deliver like a pro."),
        P("Give a taste. Do not send the full PDF because someone said 'let me see.'", "Lead"),
        hairline(),
        sp(6),
        h2("When they ask what is inside"),
        cp(
            "Short inside list",
            "[product] includes:\n1. [section 1]\n2. [section 2]\n3. [section 3]\n4. [section 4]\n5. [section 5]\n\nIt is a download, not a live class.\nYou can use it on your phone.\n[price]. Do you want the payment link?",
        ),
        sp(5),
        cp(
            "Versus a course",
            "This is not a 6-week course.\n\nIt is a practical file you can open today and use.\nNo Zoom. No waiting. You get it [time] after payment.\n\n[product] - [price]\nReply PAY.",
        ),
        sp(5),
        cp(
            "For skeptics",
            "I will be direct.\n\n[product] will not print money for you.\nIt will give you clear scripts so you stop guessing.\n\nIf you will use it, it is worth [price].\nIf you only want to collect files, do not buy it.",
        ),
        sp(6),
        h2("Sample without giving the store away"),
        cp(
            "Sample keyword",
            "Reply SAMPLE and I will send you 1 page from [product]\nso you can see if the style is useful for you.",
        ),
        sp(5),
        cp(
            "Boundary",
            "I can send a short preview, not the full file.\n\nThe full [product] is [price] and you get everything after payment.\nDo you want the preview or the payment link?",
        ),
        sp(5),
        cp(
            "After the sample",
            "That is one piece from [product].\n\nThe full file has more like this, plus [bonus].\nIf you want the complete version, it is [price].\nI can send the payment link now.",
        ),
        PageBreak(),
        SectionMark("05  Checkout", SECTION),
        cp(
            "They want it free",
            "I cannot send the full file free.\nThe preview is to show you the quality.\n\nThe complete [product] is [price].\nIf it is useful to you, I can send the payment link.",
        ),
        sp(8),
        h2("Buyer questions"),
        cp("How much?", "[product] is [price].\n\nYou get the full file [time] after payment.\nDo you want me to send the link?"),
        sp(5),
        cp("Is it a course?", "No. It is a downloadable file you can use on your phone.\nNo live class. No waiting for a Zoom link.\n\nYou pay [price], I send access."),
        sp(5),
        cp("Send the file first", "I deliver immediately after payment.\nThat is how I keep it fair for people who have paid.\n\nI can send a short preview now.\nThe full [product] is [price]. Should I send the link?"),
        sp(5),
        cp("I need to think", "No problem.\n\nThe file is [product] for [who] who want [benefit].\nPrice is [price].\n\nIf you want it later, just send PAY.\nI will be here."),
        sp(8),
        h2("Checkout"),
        cp(
            "What happens next",
            "To get [product]:\n\n1. Pay [price] here: [link]\n2. Send your payment screenshot\n3. I send your file [time]\n\nThat is all.",
        ),
        sp(5),
        cp("Gentle check", "Hi, just checking.\nWere you able to complete checkout for [product]?"),
        sp(5),
        cp(
            "Close the loop",
            "I will not keep disturbing you.\n\nIf you still want [product], the link is [link].\nIf not, I wish you well with your launch.",
        ),
        sp(8),
        h2("Payment and delivery"),
        cp(
            "Payment received",
            "Payment received. Thank you.\n\nHere is your [product] download: [file or link]\n\nStart with the Start Here section, then copy the first script you need today.",
        ),
        sp(5),
        cp(
            "File will not open",
            "If the PDF does not open, tell me the phone you are using\nand send a screenshot. I will send another copy.",
        ),
        sp(5),
        cp(
            "Ask for a review",
            "If the pack is useful, please send me a short voice note or 2 lines\non what you used it for. It helps other buyers trust the file.",
        ),
        today("Save SAMPLE, HOW MUCH, and PAYMENT RECEIVED.", "Deliver the same day payment shows. Speed is part of the product."),
        *turn("06  Last price"),
    ]


def ch06():
    return [
        kicker("Chapter 06  ·  Price Objections"),
        h1("Last price. Stand. Do not perform."),
        P("They are not always rejecting you. Sometimes they want to feel they did not pay foolishly.", "Lead"),
        hairline(),
        sp(6),
        P("Last price is a habit in this market. Your job is not to win an argument. Your job is to make the next step clear: pay, pick a smaller option, or leave politely."),
        rule("Do not insult the customer. Do not beg. Do not lie about stock just to force a sale. Do not start high so you can 'reduce'."),
        sp(6),
        h2("Too expensive"),
        cp(
            "Calm price repeat",
            "I understand.\n[product] is [price].\n\nIt includes [benefit].\nDo you want me to hold it for you, or should I show a closer option?",
        ),
        sp(5),
        cp(
            "Price plus what they get",
            "It is [price] because you are getting [benefit], not just the name of the file.\n\nIf you want it, I can reserve it now.\nIf budget is the issue, tell me the range you are working with.",
        ),
        sp(5),
        cp(
            "Do not apologize",
            "Yes, it is [price].\n\nI price it for the quality and the way I deliver.\nIf that works for you, I can take the order now.",
        ),
        sp(5),
        cp(
            "Ask what they compared",
            "Okay. When you say expensive, do you mean the price is above your budget,\nor you saw a cheaper version somewhere?\n\nIf I know which one, I can explain the difference or show another option.",
        ),
        PageBreak(),
        SectionMark("06  Last price", SECTION),
        cp(
            "Digital product version",
            "I hear you.\n\nThis is a complete file, not a random free template.\nYou get [benefit], and you can use it immediately.\n\n[price]. If you want a smaller version, I have [smaller option] for [price].",
        ),
        sp(5),
        cp(
            "Stand firm softly",
            "I cannot drop it to that amount and still deliver it well.\n\nThe price remains [price].\nIf you want it, I am here. If not, I wish you well.",
        ),
        sp(8),
        h2("Last price theatre"),
        cp(
            "Last price is the price",
            "The last price is [price].\nThat is the real price, not a starting number.\n\nShould I book it for you?",
        ),
        sp(5),
        cp(
            "They keep asking",
            "[price] is already the last price.\n\nI do not start high so we can drag it down.\nDo you want me to process it at [price]?",
        ),
        sp(5),
        cp(
            "Gift instead of discount",
            "I cannot reduce the price.\n\nWhat I can do is include [bonus]\nif you complete payment today.\n[product] remains [price].",
        ),
        sp(5),
        cp(
            "Refuse the theatre",
            "I do not do \"make I hear last price\" on this one.\nThe price is [price], and it is available now.\n\nYes or no is fine.",
        ),
        sp(5),
        cp(
            "Digital one-price",
            "For digital products I keep one price so every buyer pays the same.\n\n[product] is [price].\nNo special last price, no hidden discount.\nDo you want the link?",
        ),
        sp(5),
        cp(
            "Last price then ladder",
            "Last price on this [product] is [price].\n\nIf that is above what you want to spend, [smaller option] is [price].\nWhich one should I pack?",
        ),
        today("Save LAST PRICE IS THE PRICE and STAND FIRM SOFTLY.", "Use one. Do not send both."),
        *turn("07  Get back"),
    ]


def ch07():
    return [
        kicker("Chapter 07  ·  Price Objections"),
        h1("I will get back to you."),
        P("This sentence is where sales go to die if you either chase or vanish.", "Lead"),
        hairline(),
        sp(6),
        P("Give them a simple next step. Ask what they need to confirm. Offer a short hold. Follow up once. Then close the loop. Two follow-ups is enough. Three is usually too much. Eight is begging."),
        h2("Hold the door without kneeling"),
        cp(
            "Simple next step",
            "Alright.\n\nWhen you are ready, [product] is [price].\nI will be here. If you want me to hold it, tell me a time today.",
        ),
        sp(5),
        cp(
            "What do you need to confirm",
            "No problem.\n\nAre you checking money, or comparing another option?\nIf I know, I can send the exact detail you need so you do not delay.",
        ),
        sp(5),
        cp(
            "Short hold",
            "I can hold [product] until [time].\nAfter that I cannot promise it will still be available.\n\nShould I hold it?",
        ),
        sp(5),
        cp(
            "Same-day follow-up",
            "Hi, just circling back on [product].\nDo you still want it, or should I leave it for now?",
        ),
        sp(5),
        cp(
            "Next-day follow-up",
            "Good morning. Checking if you still want [product] at [price].\nIf yes, I can take payment now. If your budget changed, tell me.",
        ),
        sp(5),
        cp(
            "Last follow-up",
            "I will not keep following up after this.\n\nIf you want [product], send PAY or send the amount.\nIf you have moved on, no wahala.",
        ),
        PageBreak(),
        SectionMark("07  Get back", SECTION),
        cp(
            "Help them decide",
            "If the only issue is confusion, here is the short version:\n\n[product] - [price]\nIncludes [benefit]\nAvailable now\n\nDo you want it or should I close the chat?",
        ),
        sp(8),
        h2("Pay later / installment"),
        cp(
            "Small file rule",
            "For this file, payment is complete before I send it.\nIt is [price], one-time.\n\nI can wait until [time] today if you are collecting the money.",
        ),
        sp(5),
        cp(
            "Deposit for physical",
            "I can hold it with a deposit of [price].\nBalance [price] before delivery or pickup.\n\nShould I send the account?",
        ),
        sp(5),
        cp(
            "Pay later is a stall",
            "I understand money timing.\n\nI will not start work or send the file until payment is complete.\nWhen you are ready, [price] is the price.",
        ),
        sp(5),
        cp(
            "Cheaper thing today",
            "If paying [price] later is hard, [smaller option] is [price] and you can take it today.\nThen you can upgrade later if you want.",
        ),
        seen(
            "You are afraid that if you do not keep chatting, you will look hungry. The opposite is true. One calm follow-up looks like a business. Five 'please dear' messages look like you need them more than they need the product."
        ),
        today("Pick one follow-up. Put a time on your phone. Send it once. Then stop."),
        *turn("08  Cheaper"),
    ]


def ch08():
    return [
        kicker("Chapter 08  ·  Price Objections"),
        h1("They saw it cheaper."),
        P("Do not attack the other seller. Explain what they pay for here. Offer a ladder. Close well.", "Lead"),
        hairline(),
        sp(6),
        cp(
            "Explain the difference",
            "The cheaper one is probably a lighter version, or no support.\n\nThis one includes [benefit].\nThat is why it is [price].",
        ),
        sp(5),
        cp(
            "Do not talk them down",
            "I have not seen the one you saw, so I will not talk down on it.\n\nWhat I can tell you is what you are paying for here:\n[benefit].\nPrice is [price].",
        ),
        sp(5),
        cp(
            "Screenshot of cheaper",
            "Thanks for showing me.\n\nThat offer is not the same as this [product].\nMine is [price] because of [benefit].\n\nIf you want theirs, take it. If you want this one, I will process it.",
        ),
        sp(5),
        cp(
            "Value in buyer language",
            "You are not paying for a file name.\nYou are paying so you can [benefit] without starting from blank.\n\n[price]. Do you want to go ahead?",
        ),
        sp(8),
        h2("When to discount"),
        P("Discount only when the remaining money still covers cost, delivery, and your time. Do not discount from fear. Some people are collecting prices. Let them go."),
        P("Offer a smaller option before you slash the main offer. Keep the main offer strong. Give them a ladder down."),
        cp(
            "Allowed discount",
            "I can do [price] if you complete payment now.\nAfter today it returns to [price].\n\nShould I send the account?",
        ),
        sp(5),
        cp(
            "Not allowed",
            "I cannot meet that amount on this [product].\nThe lowest I can do is [price], or you can take [smaller option] at [price].",
        ),
        sp(8),
        h2("Polite closing"),
        cp(
            "Kind close",
            "Thank you for asking.\n\nIf [price] is not in your budget now, I wish you well.\nWhen you are ready, [product] will be here if it is still available.",
        ),
        sp(5),
        cp(
            "After too much bargaining",
            "I think we should leave it.\n\nI want you to buy something you are comfortable with,\nand I need to keep the price I can deliver well.\n\nThank you.",
        ),
        sp(5),
        cp(
            "Door open",
            "No wahala.\n\nIf your budget changes, send a message.\nI will tell you if [product] is still available at [price].",
        ),
        sp(5),
        cp(
            "They got rude",
            "I will not continue this conversation.\n\nThe price is [price]. If you want it later at that price, you can message.",
        ),
        outcome("You kept your price or you offered a smaller thing. You did not beg. You did not insult. That is a win even if they leave."),
        *turn("09  TikTok"),
    ]


def ch09():
    return [
        kicker("Chapter 09  ·  TikTok to WhatsApp"),
        h1("Views are not sales."),
        P("The leak is the comment section. You reply too slow, dump the whole story, or have no WhatsApp next step.", "Lead"),
        hairline(),
        sp(6),
        P("Pin one CTA. Reply with one short line and one next step. Move price, delivery, and payment to WhatsApp. Do not paste your account under the video. Do not argue in comments."),
        rule("One video. One offer. One keyword. If people must think, they will keep scrolling."),
        sp(6),
        h2("Pinned comments and video CTAs"),
        cp("Price keyword", "Comment PRICE and I will send details on WhatsApp."),
        sp(5),
        cp("Catalog keyword", "Reply CATALOG on WhatsApp for available options.\nWhatsApp link is in bio."),
        sp(5),
        cp("Link in bio", "Link is in bio.\nSend WhatsApp message with the word [keyword] so I know what you watched."),
        sp(5),
        cp("No-face product", "You do not need to see my face to order.\nComment PRICE or send [keyword] on WhatsApp."),
        sp(5),
        cp("Digital product CTA", "This is a download, not a live class.\nComment PAY and I will send the WhatsApp link."),
        sp(5),
        cp("Stock CTA", "This [product] is available now.\nComment SIZE or DM me WHATSAPP and I will send the link."),
        PageBreak(),
        SectionMark("09  TikTok", SECTION),
        h2("Comment replies: keep them short"),
        cp(
            "Direct price then WhatsApp",
            "It is [price].\nSend PRICE on WhatsApp and I will tell you what is included plus how to order. [link]",
        ),
        sp(5),
        cp(
            "How much",
            "[price].\nSend HI on WhatsApp with the video you watched so I send the right details.",
        ),
        sp(5),
        cp(
            "Too public",
            "I do not drop full payment details here.\nSend PRICE on WhatsApp and I will send everything clean. [link]",
        ),
        sp(5),
        cp(
            "Send account in comments",
            "I will not post account details under the video.\nWhatsApp me ORDER and I will send a proper payment step.",
        ),
        sp(5),
        cp(
            "Too expensive in comments",
            "There is a smaller option.\nWhatsApp me OPTIONS and I will show you.",
        ),
        sp(5),
        cp(
            "Is this real",
            "Yes. I deliver after payment.\nIf you want proof, I will send it on WhatsApp, not here.",
        ),
        sp(5),
        cp(
            "Rude comment",
            "I will answer serious questions on WhatsApp.\nIf you want [product], the link is in bio.",
        ),
        sp(8),
        h2("Move the DM off the app"),
        cp(
            "Move to WhatsApp",
            "Thanks for your interest.\nIt is easier to send catalog, delivery, and payment details on WhatsApp.\nMessage me here: [link]",
        ),
        sp(5),
        cp(
            "They want to finish in IG",
            "I can give a short answer here.\n\nPrice is [price].\nTo complete order, WhatsApp is faster because I can send details and confirm.\nHere: [link]",
        ),
        today("Pin one CTA on your best video.", "Reply every PRICE comment today with one line plus WhatsApp."),
        *turn("10  First 60s"),
    ]


def ch10():
    return [
        kicker("Chapter 10  ·  TikTok to WhatsApp"),
        h1("The first 60 seconds on WhatsApp."),
        P("They arrived. Do not send your life story. Send the offer, the price, one choice.", "Lead"),
        hairline(),
        sp(6),
        cp(
            "Welcome from TikTok",
            "Welcome. I saw your comment from TikTok.\n\nYou asked about [product].\nIt is [price].\nYou get [benefit].\n\nDo you want me to send the payment link, or do you have one question first?",
        ),
        sp(5),
        cp(
            "They only sent the keyword",
            "Hi, welcome from TikTok / Reels.\n\nWhich one did you watch:\n1. [product]\n2. [other item]\n3. Something else\n\nReply with 1, 2, or 3.",
        ),
        sp(5),
        cp(
            "Catalog",
            "Here are the available options:\n\n1. [product] - [price]\n2. [item] - [price]\n3. [item] - [price]\n\nReply with the number you want.",
        ),
        sp(5),
        cp(
            "Digital details",
            "[product] is [price].\n\nYou get: [benefit]\nAccess: [time] after payment\nPay here: [link]\n\nAfter payment, send the screenshot.",
        ),
        sp(5),
        cp(
            "One decision",
            "Should I reserve [product] for you now, or do you want to see one more option first?",
        ),
        sp(8),
        h2("They go quiet after details"),
        cp("After details", "Have you seen the details I sent?\nIf yes, do you want to pay now or do you still have one question?"),
        sp(5),
        cp("If they go quiet", "Just checking. Do you still want [product] from the TikTok video,\nor should I leave it?"),
        sp(5),
        cp(
            "They fear scam",
            "I understand.\n\nYou can pay on Selar so it is recorded: [link]\nI deliver after the payment shows. I can also send [proof] first.",
        ),
        sp(8),
        h2("20-minute comment sweep"),
        P("Twice a day: reply every PRICE and WHERE comment. Invite them to WhatsApp with one keyword. Open WhatsApp and answer new people before you post another video."),
        P("Do not argue under the video. Do not paste long price lists in comments. Do not ignore comments for 2 days. Do not send 8 follow-ups to one person who never replied."),
        today("Write your welcome-from-TikTok message with real [product] and [price].", "Save it as a WhatsApp quick reply."),
        *turn("11  Daily posts"),
    ]


def ch11():
    data = [[Paragraph(esc(a), S["CellHead"]), Paragraph(esc(b), S["CellHead"])] for a, b in [("Day", "Job")]]
    for a, b in [
        ("1", "Direct offer"),
        ("2", "Problem-solution"),
        ("3", "Trust or review"),
        ("4", "Question post"),
        ("5", "Soft-sell / one tip"),
        ("6", "Urgency or stock"),
        ("7", "Reminder plus CTA"),
    ]:
        data.append([Paragraph(esc(a), S["CellBold"]), Paragraph(esc(b), S["Cell"])])
    return [
            kicker("Chapter 11  ·  Daily Sales Posts"),
            h1("Never stare at Status again."),
            P("Most vendors do not lack products. They lack words. Then they post 'available, DM for price' until people mute them.", "Lead"),
            hairline(),
            sp(6),
            P("Pick 7 templates this week. Not 50. Edit [product], [benefit], [price]. Use one CTA. Post once. Reply the same day. Repeat the posts that got DMs."),
            h2("7-day posting rhythm"),
            simple_table(data, [22 * mm, CONTENT_W - 22 * mm]),
            sp(8),
            h2("Direct offers"),
            cp(
                "Direct offer",
                "[product] is available now.\n\nFor [who] who want [benefit].\nPrice is [price].\n\nReply YES or DM me to order.",
            ),
            sp(5),
            cp(
                "No long story",
                "[product] for [who].\n\nOne payment. Clear delivery. No long story.\n[price]. Send PAY.",
            ),
            sp(5),
            cp(
                "Selling today",
                "I am selling [product] today, not coming soon.\n\n[price].\nDM me now if you want it reserved.",
            ),
            PageBreak(),
            SectionMark("11  Daily posts", SECTION),
            h2("Problem-solution"),
            cp(
                "Not lazy",
                "If [pain] is still happening, it is not because you are lazy.\n\nYou probably do not have a simple [product] to use.\nThis one helps you [benefit].\n[price]. DM me.",
            ),
            sp(5),
            cp(
                "Views are not sales",
                "Views are not sales.\n\nIf people watch you and do not WhatsApp you, use [product]\nto move them from comments to order. [price].",
            ),
            sp(5),
            cp(
                "Blank in the chat",
                "The customer asked a question. You went blank. They left.\n\n[product] gives you what to say next time.\n[price]. Send SAMPLE if you want a preview.",
            ),
            sp(8),
            h2("Questions, trust, urgency"),
            cp(
                "What is stopping you",
                "What is stopping you from ordering [product]?\n\nPrice, delivery, or you are not sure it will work for you?\nReply 1, 2, or 3. I will answer straight.",
            ),
            sp(5),
            cp(
                "Trust",
                "The benefit is not a nice PDF.\nThe benefit is you stop guessing what to say.\n\n[product] - [price].",
            ),
            sp(5),
            cp(
                "I will not shout",
                "I will not shout.\n\n[product] is [price].\nIf it is for you, DM me. If not, keep scrolling in peace.",
            ),
            sp(5),
            cp(
                "Last call",
                "Last reminder for this week: [product] - [price]\nReply PAY or ignore.",
            ),
            sp(5),
            cp(
                "Soft-sell tip",
                "Yesterday a buyer asked me [common question].\n\nHere is the simple answer: [one tip].\nIf you want the full [product], it is [price].",
            ),
            sp(5),
            cp(
                "Today's only job",
                "Today's only job:\n\nPost this, then reply everyone.\n[product] is available. [price].\nDM me to get it.",
            ),
            today("Pick 7 posts in the workbook. Edit them tonight.", "Post Day 1 tomorrow. Then reply."),
            *turn("12  7-day proof"),
        ]


def ch12():
    return [
        kicker("Chapter 12"),
        h1("The 7-day proof."),
        P("A week that produces money, not content.", "Lead"),
        hairline(),
        sp(6),
        P("Do not add a new product every day unless you can reply everyone. One clear offer plus fast replies beats ten ignored posts."),
        h2("7-day Status sequence"),
        cp("Day 1", "I am packaging a file for [who] who want [benefit].\nI will share it here."),
        sp(5),
        cp("Day 2", "Reply SAMPLE if you want a preview of [product]."),
        sp(5),
        cp("Day 3", "[product] is for [who].\nNot for people who only collect free files."),
        sp(5),
        cp("Day 4", "[product] is live.\n[price]. Reply PAY."),
        sp(5),
        cp("Day 5", "Inside [product]: [item 1], [item 2], [item 3].\nPayment link on request."),
        sp(5),
        cp("Day 6", "If you clicked the link and did not finish, tell me.\nI will help you complete it."),
        sp(5),
        cp("Day 7", "Last reminder for this week: [product] - [price]\nReply PAY or ignore."),
        sp(8),
        h2("What to write down every day"),
        P("Date. Script you used. Where you sent it. Who replied. Paid / smaller option / left. After 7 days you will see which words to keep."),
        outcome("If nothing paid, the offer or the audience is wrong. Do not blame 'WhatsApp is dry'. Change the offer sentence or the who. Then run the week again."),
        today("Print the 7-day calendar in the workbook.", "Write real dates. Tick posted. Count replies."),
        *turn("13  Confidence"),
    ]


def ch13():
    return [
        kicker("Chapter 13"),
        h1("Confidence rules."),
        P("Firm. Polite. Short. Then stop.", "Lead"),
        hairline(),
        sp(6),
        CheckLine("One message. Then wait. Do not send three speeches in a row.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Say the price. Hidden prices create last-price fights.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Offer a smaller option before you slash the main price.", CONTENT_W, S["BodyLeft"]),
        CheckLine("One follow-up after I will get back. Two if they engaged. Never eight.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Do not apologize for a fair price.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Do not insult cheaper sellers. Explain your [benefit].", CONTENT_W, S["BodyLeft"]),
        CheckLine("Do not paste account numbers under TikTok.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Do not send the full file because they said let me see.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Deliver the same day payment shows. Speed is part of the product.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Close politely when they are not a buyer. Leave the door open unless they were rude.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Track what paid. Repeat only that. Delete the rest from this week's rotation.", CONTENT_W, S["BodyLeft"]),
        sp(8),
        seen(
            "Sounding desperate is not the same as following up. Desperate is 'please dear I need this sale'. Professional is 'the price is [price]. I will be here. If you have moved on, no wahala.'"
        ),
        sp(6),
        rule("Your job is not to win the argument. Your job is to make the next step clear: pay, pick a smaller option, or leave politely."),
        today("Read these rules once. Sign the Confidence Contract in the workbook."),
        *turn("14  Close"),
    ]


def closing():
    return [
        kicker("Closing"),
        h1("Do this. Then stop."),
        P("Skip the perfect content week. Do the next step that fits today."),
        h2("Action Plan"),
        RoundedBox("NOW", "Save LAST PRICE, I WILL GET BACK, TIKTOK PIN. Fill [product], [price], [benefit].", CONTENT_W, GREEN_SOFT, GREEN, S["BoxTitle"], S["BoxBody"]),
        sp(5),
        RoundedBox("TODAY", "Post one Status or pin one comment. Reply every how-much. Use one objection script.", CONTENT_W, SAND, BRICK, S["BoxTitle"], S["BoxBody"]),
        sp(5),
        RoundedBox("THIS WEEK", "Run the 7-day sequence. Track replies and payments. Keep only what paid.", CONTENT_W, GREEN_SOFT, GREEN, S["BoxTitle"], S["BoxBody"]),
        sp(8),
        h2("Upgrade Path"),
        CheckLine("One script used. You started. Stop if that is all you have.", CONTENT_W, S["BodyLeft"]),
        CheckLine("Offer sentence filled. The chat has rails.", CONTENT_W, S["BodyLeft"]),
        CheckLine("7 days posted and replied. The system is alive.", CONTENT_W, S["BodyLeft"]),
        CheckLine("One week tracked. You can see the sales.", CONTENT_W, S["BodyLeft"]),
        sp(8),
        today(
            "Open Notes.",
            "Use one script on the next last-price.",
            "Close the file. That is enough for today.",
        ),
        sp(8),
        outcome(
            "Predictable daily sales. Confident communication.\nNot a perfect brand. Not 50 posts. The next clear message."
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
        title="The Vendor Survival & Sales Guide",
        author="Vendor Survival System",
    )
    doc.addPageTemplates([cover, interior])
    story = [
        Paragraph(" ", ParagraphStyle("x", fontName="SourceSans", fontSize=1, leading=1)),
        NextPageTemplate("interior"),
        SectionMark("A letter", SECTION),
        PageBreak(),
    ]
    for fn in [
        letter,
        phone_start,
        toc_page,
        ch01,
        ch02,
        ch03,
        ch04,
        ch05,
        ch06,
        ch07,
        ch08,
        ch09,
        ch10,
        ch11,
        ch12,
        ch13,
        closing,
    ]:
        story.extend(fn())
    doc.build(story)
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    build()
