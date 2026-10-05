"""Build The Life Story Blueprint: print-ready US Letter journal PDF + Canva copy."""

from __future__ import annotations

import sys
from pathlib import Path

from reportlab.lib.units import inch
from reportlab.pdfgen.canvas import Canvas

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from content import (  # noqa: E402
    BACK_COVER_POINTS,
    BACK_COVER_QUOTE,
    CLOSING_PARAS,
    COVER_FOOT,
    COVER_PROMISE,
    DAYS,
    HALF_TITLE_CREDIT,
    HALF_TITLE_QUOTE,
    HOW_TO_INTRO,
    HOW_TO_STEPS,
    JOURNAL_KICKER,
    JOURNAL_SUBTITLE,
    JOURNAL_TITLE,
    KEEPING_PARAS,
    KEEPING_TITLE,
    MEMORY_NOTE,
    PROMISE_LINES,
    WELCOME_PARAS,
    WEEKS,
)
from theme import (  # noqa: E402
    CONTENT_W,
    COVER,
    COVER_MID,
    CREAM,
    CREAM_DEEP,
    GOLD,
    GOLD_DEEP,
    GOLD_PALE,
    INK,
    INK_SOFT,
    IVORY,
    LINE,
    MARGIN_L,
    MARGIN_R,
    MUTED,
    PAGE,
    PAGE_H,
    PAGE_W,
    ROSEWOOD,
    WHITE,
    draw_centered_lines,
    draw_corners,
    draw_cream_page,
    draw_double_frame,
    draw_double_rule,
    draw_field_line,
    draw_flourish,
    draw_header_footer,
    draw_para,
    draw_rule,
    draw_writing_lines,
    letterspace,
    register_fonts,
    styles,
    wrap_text_lines,
)

OUT_DIR = ROOT / "output" / "pdf" / "life-story-blueprint"
OUT_PDF = OUT_DIR / "The-Life-Story-Blueprint.pdf"
OUT_CANVA = OUT_DIR / "CANVA-COPY-The-Life-Story-Blueprint.md"


class Book:
    def __init__(self) -> None:
        register_fonts()
        self.s = styles()
        OUT_DIR.mkdir(parents=True, exist_ok=True)
        self.out_path = OUT_PDF
        self.build_path = OUT_DIR / "The-Life-Story-Blueprint.build.pdf"
        self.c = Canvas(str(self.build_path), pagesize=PAGE)
        self.c.setTitle(JOURNAL_TITLE)
        self.c.setAuthor("A Guided Legacy Journal")
        self.c.setSubject(JOURNAL_SUBTITLE)
        self.c.setKeywords("legacy journal, memoir, family history, guided journal")
        self.page_no = 0

    def finish(self, key: str | None = None, title: str | None = None, level: int = 0) -> None:
        if key:
            self.c.bookmarkPage(key)
            if title:
                self.c.addOutlineEntry(title, key, level=level, closed=False)
        self.c.showPage()

    def interior(self, section: str) -> None:
        self.page_no += 1
        draw_cream_page(self.c, CREAM)
        draw_header_footer(self.c, section, str(self.page_no))

    def cover(self) -> None:
        c = self.c
        c.setFillColor(COVER)
        c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        c.setFillColor(COVER_MID)
        c.rect(0, 0, 0.42 * inch, PAGE_H, stroke=0, fill=1)
        c.setFillColor(GOLD)
        c.rect(0.42 * inch, 0, 2.4, PAGE_H, stroke=0, fill=1)

        draw_double_frame(c, inset=28, color=GOLD, inner_gap=5)
        draw_corners(c, inset=36, arm=16, color=GOLD)

        y = PAGE_H - 1.55 * inch
        c.setFillColor(GOLD)
        c.setFont("Merri", 9)
        c.drawCentredString(PAGE_W / 2, y, letterspace(JOURNAL_KICKER, inner="  ", word_gap="    "))
        y -= 0.28 * inch
        draw_flourish(c, PAGE_W / 2, y, GOLD, 1.05)

        y -= 0.72 * inch
        c.setFillColor(IVORY)
        c.setFont("Playfair", 40)
        c.drawCentredString(PAGE_W / 2, y, "The Life Story")
        y -= 0.58 * inch
        c.setFont("Playfair", 40)
        c.drawCentredString(PAGE_W / 2, y, "Blueprint")

        y -= 0.32 * inch
        draw_rule(c, PAGE_W / 2 - 1.35 * inch, y, 2.7 * inch, GOLD, 0.9)
        y -= 0.08 * inch
        draw_rule(c, PAGE_W / 2 - 0.85 * inch, y, 1.7 * inch, GOLD, 0.4)

        y -= 0.55 * inch
        c.setFillColor(GOLD_PALE)
        c.setFont("Playfair-Italic", 13.5)
        for line in [
            "A Gentle 30-Day Guided Journal",
            "to Preserve Your Memories",
            "for Your Children & Grandchildren",
        ]:
            c.drawCentredString(PAGE_W / 2, y, line)
            y -= 0.28 * inch

        c.setFillColor(COVER_MID)
        box_h = 0.72 * inch
        box_w = PAGE_W - 2.4 * inch
        box_x = 1.2 * inch
        box_y = 1.55 * inch
        c.roundRect(box_x, box_y, box_w, box_h, 6, stroke=0, fill=1)
        c.setStrokeColor(GOLD)
        c.setLineWidth(0.6)
        c.roundRect(box_x, box_y, box_w, box_h, 6, stroke=1, fill=0)
        c.setFillColor(IVORY)
        c.setFont("Merri", 11)
        c.drawCentredString(PAGE_W / 2, box_y + 0.40 * inch, COVER_PROMISE)
        c.setFont("Playfair-Italic", 11)
        c.setFillColor(GOLD_PALE)
        c.drawCentredString(PAGE_W / 2, box_y + 0.18 * inch, COVER_FOOT)

        self.finish("cover", "Cover")

    def half_title(self) -> None:
        c = self.c
        draw_cream_page(c, CREAM)
        draw_double_frame(c, 26, GOLD_PALE, 4)
        draw_flourish(c, PAGE_W / 2, PAGE_H / 2 + 1.35 * inch, GOLD, 1.0)
        y = PAGE_H / 2 + 0.85 * inch
        h = draw_para(c, HALF_TITLE_QUOTE, self.s["Lead"], MARGIN_L + 18, y, CONTENT_W - 36)
        y = y - h - 0.28 * inch
        draw_rule(c, PAGE_W / 2 - 0.7 * inch, y, 1.4 * inch, GOLD, 0.6)
        y -= 0.32 * inch
        c.setFillColor(GOLD_DEEP)
        c.setFont("Merri", 8.5)
        c.drawCentredString(PAGE_W / 2, y, HALF_TITLE_CREDIT.upper())
        self.finish("half-title", "A note to begin")

    def belongs_to(self) -> None:
        self.interior("This journal")
        c = self.c
        y = PAGE_H - 1.15 * inch
        y -= draw_para(c, "THIS JOURNAL BELONGS TO", self.s["Kicker"], MARGIN_L, y, CONTENT_W)
        y -= 0.12 * inch
        y -= draw_para(c, "A gift of memory", self.s["H1"], MARGIN_L, y, CONTENT_W)
        y -= 0.08 * inch
        draw_flourish(c, PAGE_W / 2, y, GOLD, 0.9)
        y -= 0.42 * inch
        y -= draw_para(
            c,
            "Write your name the way the family says it. Then begin when you are ready.",
            self.s["BodyCenter"],
            MARGIN_L,
            y,
            CONTENT_W,
        )
        y -= 0.35 * inch
        fields = [
            ("Name", 1, 22),
            ("I began on", 1, 18),
            ("I am writing this for", 2, 16),
            ("In the year", 1, 18),
        ]
        for label, nlines, gap in fields:
            c.setFillColor(INK_SOFT)
            c.setFont("Merri", 11)
            c.drawString(MARGIN_L, y, label)
            y -= 0.14 * inch
            draw_writing_lines(c, MARGIN_L, y, CONTENT_W, nlines, spacing=26)
            y -= nlines * 26 + gap
        y -= 0.1 * inch
        y -= draw_para(
            c,
            "There is no late start. The stories will wait for you.",
            self.s["Whisper"],
            MARGIN_L,
            y,
            CONTENT_W,
        )
        self.finish("belongs", "This journal belongs to")

    def welcome(self) -> None:
        self.interior("Welcome")
        c = self.c
        y = PAGE_H - 1.12 * inch
        y -= draw_para(c, "A LETTER TO BEGIN", self.s["Kicker"], MARGIN_L, y, CONTENT_W)
        y -= 0.06 * inch
        y -= draw_para(c, "Welcome, dear one", self.s["H1"], MARGIN_L, y, CONTENT_W)
        y -= 0.04 * inch
        draw_flourish(c, PAGE_W / 2, y, GOLD, 0.85)
        y -= 0.32 * inch
        for i, para in enumerate(WELCOME_PARAS):
            style = "BodyCenter" if i in (0, 1, 7, 8) else "BodyJust"
            extra = 6 if i in (1, 5, 7) else 2
            y -= draw_para(c, para, self.s[style], MARGIN_L + 6, y, CONTENT_W - 12)
            y -= extra
        self.finish("welcome", "Welcome")

    def how_to(self) -> None:
        self.interior("How to use this journal")
        c = self.c
        y = PAGE_H - 1.12 * inch
        y -= draw_para(c, "TEN MINUTES A DAY", self.s["Kicker"], MARGIN_L, y, CONTENT_W)
        y -= draw_para(c, "How to use these pages", self.s["H1"], MARGIN_L, y, CONTENT_W)
        y -= 0.02 * inch
        draw_flourish(c, PAGE_W / 2, y, GOLD, 0.8)
        y -= 0.28 * inch
        y -= draw_para(c, HOW_TO_INTRO, self.s["Lead"], MARGIN_L + 10, y, CONTENT_W - 20)
        y -= 0.12 * inch
        for i, (title, body) in enumerate(HOW_TO_STEPS, start=1):
            # numbered gold disc
            cy = y - 8
            c.setFillColor(GOLD)
            c.circle(MARGIN_L + 8, cy, 8.5, stroke=0, fill=1)
            c.setFillColor(WHITE)
            c.setFont("Playfair-Bold", 10)
            c.drawCentredString(MARGIN_L + 8, cy - 3.5, str(i))
            y -= draw_para(c, title, self.s["StepTitle"], MARGIN_L + 28, y, CONTENT_W - 28)
            y -= draw_para(c, body, self.s["StepBody"], MARGIN_L + 28, y, CONTENT_W - 28)
            y -= 4
        y -= 0.06 * inch
        y -= draw_para(
            c,
            "If you print this journal, cream paper is a kindness. One-sided pages are easier to write on, "
            "and a pen you already love is the only tool you need.",
            self.s["Whisper"],
            MARGIN_L,
            y,
            CONTENT_W,
        )
        self.finish("how-to", "How to use these pages")

    def promise(self) -> None:
        self.interior("A gentle promise")
        c = self.c
        y = PAGE_H - 1.12 * inch
        y -= draw_para(c, "BEFORE YOU BEGIN", self.s["Kicker"], MARGIN_L, y, CONTENT_W)
        y -= draw_para(c, "A gentle promise", self.s["H1"], MARGIN_L, y, CONTENT_W)
        y -= 0.04 * inch
        draw_flourish(c, PAGE_W / 2, y, GOLD, 0.85)
        y -= 0.38 * inch
        y -= draw_para(
            c,
            "You do not need to be a professional writer. Imperfect, honest memories are worth more than polished prose.",
            self.s["Lead"],
            MARGIN_L + 8,
            y,
            CONTENT_W - 16,
        )
        y -= 0.22 * inch
        box_top = y
        box_h = 2.55 * inch
        c.setFillColor(IVORY)
        c.roundRect(MARGIN_L, box_top - box_h, CONTENT_W, box_h, 7, stroke=0, fill=1)
        c.setStrokeColor(GOLD_PALE)
        c.setLineWidth(0.8)
        c.roundRect(MARGIN_L, box_top - box_h, CONTENT_W, box_h, 7, stroke=1, fill=0)
        iy = box_top - 0.32 * inch
        for line in PROMISE_LINES:
            c.setFillColor(INK)
            c.setFont("Playfair-Italic", 14)
            c.drawCentredString(PAGE_W / 2, iy, line)
            iy -= 0.48 * inch
        y = box_top - box_h - 0.38 * inch
        y -= draw_para(c, MEMORY_NOTE, self.s["BodyJust"], MARGIN_L + 4, y, CONTENT_W - 8)
        y -= 0.2 * inch
        y -= draw_para(
            c,
            "If love, family, or home did not look like the picture other people expected, write the life you actually lived. This book is for that life.",
            self.s["BodyJust"],
            MARGIN_L + 4,
            y,
            CONTENT_W - 8,
        )
        self.finish("promise", "A gentle promise")

    def contents(self) -> None:
        self.interior("Contents")
        c = self.c
        y = PAGE_H - 1.10 * inch
        y -= draw_para(c, "THE THIRTY DAYS", self.s["Kicker"], MARGIN_L, y, CONTENT_W)
        y -= draw_para(c, "Contents", self.s["H1"], MARGIN_L, y, CONTENT_W)
        y -= 0.02 * inch
        draw_flourish(c, PAGE_W / 2, y, GOLD, 0.75)
        y -= 0.34 * inch
        current_week = 0
        for day in DAYS:
            if day.week != current_week:
                if current_week != 0:
                    y -= 8
                current_week = day.week
                week = WEEKS[day.week]
                c.setFillColor(ROSEWOOD)
                header = f"{week['label']}  -  {week['title']}"
                header_lines = wrap_text_lines(header, "Playfair", 12.5, CONTENT_W)
                for line in header_lines:
                    c.setFont("Playfair", 12.5)
                    c.drawString(MARGIN_L, y, line)
                    y -= 16
                draw_rule(c, MARGIN_L, y + 3, 1.15 * inch, GOLD_PALE, 0.55)
                y -= 16
            c.setFillColor(GOLD)
            c.circle(MARGIN_L + 3.2, y + 3.2, 1.7, stroke=0, fill=1)
            c.setFillColor(MUTED)
            c.setFont("Merri", 10.4)
            c.drawString(MARGIN_L + 14, y, f"Day {day.number}")
            c.setFillColor(INK)
            c.setFont("Merri", 10.4)
            theme_x = MARGIN_L + 92
            theme_lines = wrap_text_lines(day.theme, "Merri", 10.4, CONTENT_W - 92)
            for i, line in enumerate(theme_lines):
                if i:
                    y -= 13.5
                c.drawString(theme_x, y, line)
            y -= 14.8
        self.finish("contents", "Contents")

    def week_divider(self, week_n: int) -> None:
        week = WEEKS[week_n]
        c = self.c
        draw_cream_page(c, CREAM_DEEP)
        draw_double_frame(c, 24, GOLD, 5)
        draw_corners(c, 34, 15, GOLD)
        y = PAGE_H - 2.05 * inch
        c.setFillColor(GOLD_DEEP)
        c.setFont("Merri", 9)
        c.drawCentredString(PAGE_W / 2, y, letterspace(week["label"]))
        y -= 0.22 * inch
        c.setFillColor(MUTED)
        c.setFont("Merri", 8.5)
        c.drawCentredString(PAGE_W / 2, y, letterspace(week["days"], inner=" ", word_gap="   "))
        y -= 0.38 * inch
        draw_flourish(c, PAGE_W / 2, y, GOLD, 1.15)
        y -= 0.58 * inch
        c.setFillColor(INK)
        c.setFont("Playfair", 26)
        lines = week.get("title_lines") or (week["title"],)
        for line in lines:
            c.drawCentredString(PAGE_W / 2, y, line)
            y -= 32
        y -= 0.08 * inch
        draw_double_rule(c, PAGE_W / 2 - 1.2 * inch, y, 2.4 * inch)
        y -= 0.48 * inch
        y -= draw_para(c, week["epigraph"], self.s["Lead"], MARGIN_L + 16, y, CONTENT_W - 32)
        y -= 0.18 * inch
        y -= draw_para(c, week["body"], self.s["BodyCenter"], MARGIN_L + 22, y, CONTENT_W - 44)
        c.setFillColor(GOLD_DEEP)
        c.setFont("Playfair-Italic", 11)
        c.drawCentredString(PAGE_W / 2, 1.15 * inch, "Begin whenever the day feels quiet.")
        self.finish(f"week-{week_n}", f"{week['label']}: {week['title']}", level=0)

    def day_page(self, day) -> None:
        week = WEEKS[day.week]
        self.interior(week["short"])
        c = self.c
        y = PAGE_H - 1.05 * inch

        kicker = f"DAY  {day.number}   OF   30"
        y -= draw_para(c, kicker, self.s["KickerLeft"], MARGIN_L, y, CONTENT_W)
        y -= 0.10 * inch

        title_lines = wrap_text_lines(day.theme, "Playfair", 22, CONTENT_W)
        y -= 18
        c.setFillColor(INK)
        c.setFont("Playfair", 22)
        for i, line in enumerate(title_lines):
            if i:
                y -= 26
            c.drawString(MARGIN_L, y, line)

        y -= 40
        draw_field_line(c, "Today's date", MARGIN_L, y, CONTENT_W, label_w=92)
        y -= 0.28 * inch
        y -= draw_para(c, day.invitation, self.s["Invite"], MARGIN_L, y, CONTENT_W)
        y -= 0.04 * inch
        draw_double_rule(c, MARGIN_L, y, CONTENT_W)
        y -= 0.22 * inch
        c.setFillColor(GOLD_DEEP)
        c.setFont("Merri", 8)
        c.drawString(MARGIN_L, y, "LET THESE QUESTIONS OPEN THE DOOR")
        y -= 0.22 * inch

        for i, q in enumerate(day.questions, start=1):
            # small gold diamond bullet
            c.setFillColor(GOLD)
            d = 3.1
            cx, cy = MARGIN_L + 4, y - 8
            p = c.beginPath()
            p.moveTo(cx, cy + d)
            p.lineTo(cx + d, cy)
            p.lineTo(cx, cy - d)
            p.lineTo(cx - d, cy)
            p.close()
            c.drawPath(p, stroke=0, fill=1)
            qtext = q
            y -= draw_para(c, qtext, self.s["Question"], MARGIN_L + 16, y, CONTENT_W - 16)
            y -= 2

        y -= 0.10 * inch
        c.setFillColor(ROSEWOOD)
        c.setFont("Merri", 8)
        c.drawString(MARGIN_L, y, "WRITE WHATEVER COMES")
        y -= 0.18 * inch

        if day.letter_prompt:
            y -= draw_para(c, day.letter_prompt, self.s["LetterOpen"], MARGIN_L, y, CONTENT_W)
            y -= 0.04 * inch

        whisper_h = 28
        bottom = 0.72 * inch + whisper_h
        available = y - bottom
        spacing = 24.0
        count = int(available // spacing)
        count = min(11, max(count, 0))
        if count < 6:
            count = max(count, 6) if available >= 6 * spacing - 8 else max(count, 5)
        # keep a little air above the whisper
        lines_h = count * spacing
        y_first = y - 2
        draw_writing_lines(c, MARGIN_L, y_first, CONTENT_W, count, spacing=spacing)
        y_after = y_first - lines_h

        wy = max(0.70 * inch, y_after - 0.08 * inch)
        draw_para(c, day.whisper, self.s["Whisper"], MARGIN_L, wy, CONTENT_W)
        self.finish(f"day-{day.number}", f"Day {day.number}: {day.theme}", level=1)

    def closing(self) -> None:
        self.interior("A closing note")
        c = self.c
        y = PAGE_H - 1.12 * inch
        y -= draw_para(c, "DAY THIRTY IS COMPLETE", self.s["Kicker"], MARGIN_L, y, CONTENT_W)
        y -= draw_para(c, "You have left them your voice", self.s["H1"], MARGIN_L, y, CONTENT_W)
        y -= 0.02 * inch
        draw_flourish(c, PAGE_W / 2, y, GOLD, 0.9)
        y -= 0.32 * inch
        for i, para in enumerate(CLOSING_PARAS):
            if i == 0:
                style = "Lead"
            elif i >= 5:
                style = "BodyCenter"
            else:
                style = "BodyJust"
            y -= draw_para(c, para, self.s[style], MARGIN_L + 6, y, CONTENT_W - 12)
            y -= 4 if i < 4 else 2
        y -= 0.15 * inch
        draw_field_line(c, "I finished on", MARGIN_L, y, CONTENT_W, label_w=100)
        self.finish("closing", "A closing note")

    def keeping(self) -> None:
        self.interior("How to keep this book")
        c = self.c
        y = PAGE_H - 1.12 * inch
        y -= draw_para(c, "AFTER THE THIRTY DAYS", self.s["Kicker"], MARGIN_L, y, CONTENT_W)
        y -= draw_para(c, KEEPING_TITLE, self.s["H1"], MARGIN_L, y, CONTENT_W)
        y -= 0.04 * inch
        draw_flourish(c, PAGE_W / 2, y, GOLD, 0.8)
        y -= 0.32 * inch
        for para in KEEPING_PARAS:
            # small diamond
            c.setFillColor(GOLD)
            d = 3.1
            cx, cy = MARGIN_L + 4, y - 9
            p = c.beginPath()
            p.moveTo(cx, cy + d)
            p.lineTo(cx + d, cy)
            p.lineTo(cx, cy - d)
            p.lineTo(cx - d, cy)
            p.close()
            c.drawPath(p, stroke=0, fill=1)
            y -= draw_para(c, para, self.s["Body"], MARGIN_L + 18, y, CONTENT_W - 18)
            y -= 8
        y -= 0.1 * inch
        y -= draw_para(
            c,
            "This is no longer a workbook. It is an heirloom.",
            self.s["Lead"],
            MARGIN_L,
            y,
            CONTENT_W,
        )
        self.finish("keeping", "How to keep this book")

    def extra_notes(self, n: int) -> None:
        self.interior("More room")
        c = self.c
        y = PAGE_H - 1.08 * inch
        y -= draw_para(c, "IF A MEMORY ASKED FOR MORE", self.s["KickerLeft"], MARGIN_L, y, CONTENT_W)
        y -= 0.10 * inch
        y -= 18
        c.setFillColor(INK)
        c.setFont("Playfair", 22)
        c.drawString(MARGIN_L, y, "Extra pages")
        y -= 32
        draw_field_line(c, "This belongs with Day", MARGIN_L, y, CONTENT_W * 0.55, label_w=138)
        draw_field_line(c, "Date", MARGIN_L + CONTENT_W * 0.58, y, CONTENT_W * 0.42, label_w=42)
        y -= 0.32 * inch
        bottom = 0.78 * inch
        available = y - bottom
        count = int(available // 24)
        draw_writing_lines(c, MARGIN_L, y, CONTENT_W, count, spacing=24)
        self.finish(f"extra-{n}", f"Extra pages {n}", level=1)

    def back_cover(self) -> None:
        c = self.c
        c.setFillColor(COVER)
        c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
        c.setFillColor(COVER_MID)
        c.rect(PAGE_W - 0.42 * inch, 0, 0.42 * inch, PAGE_H, stroke=0, fill=1)
        c.setFillColor(GOLD)
        c.rect(PAGE_W - 0.42 * inch - 2.4, 0, 2.4, PAGE_H, stroke=0, fill=1)
        draw_double_frame(c, 28, GOLD, 5)
        draw_corners(c, 36, 16, GOLD)

        y = PAGE_H - 1.7 * inch
        c.setFillColor(GOLD)
        c.setFont("Merri", 8.5)
        c.drawCentredString(PAGE_W / 2, y, letterspace("A legacy journal"))
        y -= 0.35 * inch
        draw_flourish(c, PAGE_W / 2, y, GOLD, 1.0)
        y -= 0.55 * inch
        y -= draw_para(
            c,
            BACK_COVER_QUOTE,
            self.s["Lead"],
            MARGIN_L + 18,
            y,
            CONTENT_W - 36,
        )
        y -= 0.15 * inch
        draw_rule(c, PAGE_W / 2 - 1.1 * inch, y, 2.2 * inch, GOLD, 0.7)
        y -= 0.45 * inch
        for point in BACK_COVER_POINTS:
            c.setFillColor(GOLD)
            c.circle(MARGIN_L + 28, y + 3, 2.4, stroke=0, fill=1)
            c.setFillColor(IVORY)
            c.setFont("Merri", 12)
            c.drawString(MARGIN_L + 42, y, point)
            y -= 0.38 * inch

        c.setFillColor(COVER_MID)
        c.roundRect(1.15 * inch, 1.35 * inch, PAGE_W - 2.3 * inch, 0.78 * inch, 6, stroke=0, fill=1)
        c.setStrokeColor(GOLD)
        c.setLineWidth(0.55)
        c.roundRect(1.15 * inch, 1.35 * inch, PAGE_W - 2.3 * inch, 0.78 * inch, 6, stroke=1, fill=0)
        c.setFillColor(GOLD_PALE)
        c.setFont("Playfair-Italic", 12)
        c.drawCentredString(PAGE_W / 2, 1.72 * inch, "Sit down. There is no hurry.")
        c.setFont("Merri", 9.5)
        c.setFillColor(GOLD)
        c.drawCentredString(PAGE_W / 2, 1.48 * inch, "Your true voice is the whole point.")
        self.finish("back", "Back cover")

    def build(self) -> Path:
        self.cover()
        self.half_title()
        self.belongs_to()
        self.welcome()
        self.how_to()
        self.promise()
        self.contents()
        for week_n in (1, 2, 3, 4):
            self.week_divider(week_n)
            for day in DAYS:
                if day.week == week_n:
                    self.day_page(day)
        self.closing()
        self.keeping()
        self.extra_notes(1)
        self.extra_notes(2)
        self.back_cover()
        self.c.save()
        try:
            self.build_path.replace(self.out_path)
            return self.out_path
        except OSError:
            fallback = OUT_DIR / "The-Life-Story-Blueprint-updated.pdf"
            fallback.write_bytes(self.build_path.read_bytes())
            print(f"Original PDF is open. Wrote: {fallback}")
            return fallback


def write_canva_copy() -> Path:
    lines: list[str] = []
    w = lines.append
    w("# THE LIFE STORY BLUEPRINT")
    w("## Canva / document-maker copy deck")
    w("")
    w("Paste one page block per Canva page. Suggested type: **Playfair Display** (titles) + **Merriweather** (body).")
    w("Background: cream `#F7F1E4`. Ink: `#2B2018`. Gold: `#B08D57`.")
    w("")
    w("---")
    w("")
    w("## PAGE: COVER")
    w(f"Kicker: {JOURNAL_KICKER}")
    w(f"# {JOURNAL_TITLE}")
    w(f"*{JOURNAL_SUBTITLE}*")
    w(COVER_PROMISE)
    w(COVER_FOOT)
    w("")
    w("## PAGE: HALF TITLE")
    w(f"*“{HALF_TITLE_QUOTE}”*")
    w(HALF_TITLE_CREDIT)
    w("")
    w("## PAGE: THIS JOURNAL BELONGS TO")
    w("This journal belongs to: ______________________________")
    w("I began on: ______________________________")
    w("I am writing this for: ______________________________")
    w("In the year: ______________________________")
    w("")
    w("*There is no late start. The stories will wait for you.*")
    w("")
    w("## PAGE: WELCOME")
    w("# Welcome, dear one")
    w("")
    for para in WELCOME_PARAS:
        w(para)
        w("")
    w("## PAGE: HOW TO USE THESE PAGES")
    w("# How to use these pages")
    w("")
    w(HOW_TO_INTRO)
    w("")
    for i, (title, body) in enumerate(HOW_TO_STEPS, 1):
        w(f"**{i}. {title}**")
        w(body)
        w("")
    w("If you print this journal, cream paper is a kindness. One-sided pages are easier to write on.")
    w("")
    w("## PAGE: A GENTLE PROMISE")
    w("# A gentle promise")
    w("")
    w("You do not need to be a professional writer. Imperfect, honest memories are worth more than polished prose.")
    w("")
    for line in PROMISE_LINES:
        w(f"- {line}")
    w("")
    w(MEMORY_NOTE)
    w("")
    w("If love, family, or home did not look like the picture other people expected, write the life you actually lived. This book is for that life.")
    w("")
    w("## PAGE: CONTENTS")
    w("# Contents")
    w("")
    current = 0
    for day in DAYS:
        if day.week != current:
            current = day.week
            week = WEEKS[day.week]
            w("")
            w(f"### {week['label']} — {week['title']}")
            w("")
        w(f"Day {day.number} — {day.theme}")
    w("")
    for week_n, week in WEEKS.items():
        w("")
        w(f"## PAGE: WEEK {week_n} DIVIDER")
        w(f"Kicker: {week['label']} · {week['days']}")
        w(f"# {week['title']}")
        w(f"*{week['epigraph']}*")
        w("")
        w(week["body"])
        w("")
        w("*Begin whenever the day feels quiet.*")
        for day in DAYS:
            if day.week != week_n:
                continue
            w("")
            w(f"## PAGE: DAY {day.number}")
            w(f"DAY {day.number} OF 30")
            w(f"# {day.theme}")
            w("Today's date: ________________")
            w("")
            w(f"*{day.invitation}*")
            w("")
            w("**Let these questions open the door**")
            w("")
            for q in day.questions:
                w(f"- {q}")
            w("")
            w("**Write whatever comes**")
            if day.letter_prompt:
                w("")
                w(f"*{day.letter_prompt}*")
            w("")
            w("_[Leave 8–11 generous writing lines here.]_")
            w("")
            w(f"*{day.whisper}*")
    w("")
    w("## PAGE: CLOSING")
    w("# You have left them your voice")
    w("")
    for para in CLOSING_PARAS:
        w(para)
        w("")
    w("I finished on: ________________")
    w("")
    w("## PAGE: HOW TO KEEP THIS BOOK")
    w(f"# {KEEPING_TITLE}")
    w("")
    for para in KEEPING_PARAS:
        w(f"- {para}")
        w("")
    w("*This is no longer a workbook. It is an heirloom.*")
    w("")
    w("## PAGE: EXTRA LINED PAGE (repeat twice)")
    w("# Extra pages")
    w("This belongs with Day: ______    Date: ______")
    w("_[Full page of writing lines.]_")
    w("")
    w("## PAGE: BACK COVER")
    w(f"*“{BACK_COVER_QUOTE}”*")
    w("")
    for p in BACK_COVER_POINTS:
        w(f"- {p}")
    w("")
    w("*Sit down. There is no hurry.*")
    w("Your true voice is the whole point.")
    w("")
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    OUT_CANVA.write_text("\n".join(lines), encoding="utf-8")
    return OUT_CANVA


def main() -> None:
    pdf = Book().build()
    md = write_canva_copy()
    print(f"PDF  {pdf}")
    print(f"COPY {md}")


if __name__ == "__main__":
    main()
