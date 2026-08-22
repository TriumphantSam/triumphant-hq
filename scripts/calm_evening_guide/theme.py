"""Shared visual system for The Calm Evening Survival Guide."""

from __future__ import annotations

from reportlab.lib.colors import Color, HexColor, white, black
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, StyleSheet1
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Flowable, Paragraph, Spacer, Table, TableStyle

PAGE = A4
PAGE_W, PAGE_H = PAGE
MARGIN_L = 18 * mm
MARGIN_R = 18 * mm
MARGIN_T = 22 * mm
MARGIN_B = 18 * mm
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

NAVY = HexColor("#1B3A4B")
NAVY_DEEP = HexColor("#122833")
TEAL = HexColor("#2F6F66")
TEAL_SOFT = HexColor("#E7F2EF")
TERRACOTTA = HexColor("#C45C32")
SAND = HexColor("#F6F0E6")
CREAM = HexColor("#FBF7F1")
INK = HexColor("#1C2429")
MUTED = HexColor("#5C6B73")
LINE = HexColor("#D9CDBB")
RULE = HexColor("#C9B79A")
WHITE = white


def register_fonts() -> None:
    pdfmetrics.registerFont(TTFont("Georgia", r"C:\Windows\Fonts\georgia.ttf"))
    pdfmetrics.registerFont(TTFont("Georgia-Bold", r"C:\Windows\Fonts\georgiab.ttf"))
    pdfmetrics.registerFont(TTFont("Georgia-Italic", r"C:\Windows\Fonts\georgiai.ttf"))
    pdfmetrics.registerFont(TTFont("Georgia-BoldItalic", r"C:\Windows\Fonts\georgiaz.ttf"))
    pdfmetrics.registerFont(TTFont("SourceSans", r"C:\Windows\Fonts\SourceSansPro-Regular.ttf"))
    pdfmetrics.registerFont(TTFont("SourceSans-Bold", r"C:\Windows\Fonts\SourceSansPro-Bold.ttf"))
    pdfmetrics.registerFont(TTFont("SourceSans-Semibold", r"C:\Windows\Fonts\SourceSansPro-SemiBold.ttf"))
    pdfmetrics.registerFont(TTFont("SourceSans-Italic", r"C:\Windows\Fonts\SourceSansPro-Italic.ttf"))
    pdfmetrics.registerFont(TTFont("SourceSans-Light", r"C:\Windows\Fonts\SourceSansPro-Light.ttf"))


def styles() -> StyleSheet1:
    s = StyleSheet1()
    s.add(ParagraphStyle(name="Body", fontName="SourceSans", fontSize=10.5, leading=15.2, textColor=INK, alignment=TA_JUSTIFY, spaceAfter=8))
    s.add(ParagraphStyle(name="BodyLeft", fontName="SourceSans", fontSize=10.5, leading=15.2, textColor=INK, alignment=TA_LEFT, spaceAfter=7))
    s.add(ParagraphStyle(name="Lead", fontName="SourceSans", fontSize=12, leading=17.5, textColor=INK, alignment=TA_LEFT, spaceAfter=10))
    s.add(ParagraphStyle(name="H1", fontName="Georgia-Bold", fontSize=22, leading=26, textColor=NAVY, spaceBefore=0, spaceAfter=8))
    s.add(ParagraphStyle(name="H2", fontName="Georgia-Bold", fontSize=14.5, leading=19, textColor=NAVY, spaceBefore=10, spaceAfter=6))
    s.add(ParagraphStyle(name="H3", fontName="SourceSans-Bold", fontSize=11.5, leading=15, textColor=TEAL, spaceBefore=8, spaceAfter=4))
    s.add(ParagraphStyle(name="Kicker", fontName="SourceSans-Semibold", fontSize=8.5, leading=11, textColor=TERRACOTTA, alignment=TA_LEFT, spaceAfter=3, tracking=1.2))
    s.add(ParagraphStyle(name="Caption", fontName="SourceSans-Italic", fontSize=9, leading=12.5, textColor=MUTED, spaceAfter=6))
    s.add(ParagraphStyle(name="Small", fontName="SourceSans", fontSize=9, leading=12.5, textColor=MUTED, spaceAfter=4))
    s.add(ParagraphStyle(name="Footer", fontName="SourceSans", fontSize=8, leading=10, textColor=MUTED, alignment=TA_CENTER))
    s.add(ParagraphStyle(name="HeaderL", fontName="SourceSans-Semibold", fontSize=7.5, leading=10, textColor=MUTED, alignment=TA_LEFT))
    s.add(ParagraphStyle(name="HeaderR", fontName="SourceSans", fontSize=7.5, leading=10, textColor=MUTED, alignment=TA_RIGHT))
    s.add(ParagraphStyle(name="CoverKicker", fontName="SourceSans-Semibold", fontSize=10, leading=13, textColor=HexColor("#E8C4B0"), alignment=TA_LEFT, tracking=2.4))
    s.add(ParagraphStyle(name="CoverTitle", fontName="Georgia-Bold", fontSize=36, leading=40, textColor=WHITE, alignment=TA_LEFT, spaceAfter=6))
    s.add(ParagraphStyle(name="CoverSub", fontName="Georgia-Italic", fontSize=14, leading=19, textColor=HexColor("#F3E6D8"), alignment=TA_LEFT))
    s.add(ParagraphStyle(name="BoxTitle", fontName="SourceSans-Bold", fontSize=10, leading=13, textColor=NAVY, spaceAfter=3))
    s.add(ParagraphStyle(name="BoxBody", fontName="SourceSans", fontSize=10, leading=14, textColor=INK, alignment=TA_LEFT))
    s.add(ParagraphStyle(name="ScriptLabel", fontName="SourceSans-Bold", fontSize=8, leading=11, textColor=TERRACOTTA, spaceAfter=2, tracking=0.8))
    s.add(ParagraphStyle(name="ScriptBody", fontName="Georgia-Italic", fontSize=11, leading=15.5, textColor=NAVY, alignment=TA_LEFT))
    s.add(ParagraphStyle(name="WhiteBody", fontName="SourceSans", fontSize=10.5, leading=15, textColor=WHITE))
    s.add(ParagraphStyle(name="CenterMuted", fontName="SourceSans", fontSize=9.5, leading=13, textColor=MUTED, alignment=TA_CENTER))
    s.add(ParagraphStyle(name="TocChap", fontName="SourceSans", fontSize=10.5, leading=16, textColor=INK))
    s.add(ParagraphStyle(name="Cell", fontName="SourceSans", fontSize=8.5, leading=11.5, textColor=INK))
    s.add(ParagraphStyle(name="CellBold", fontName="SourceSans-Bold", fontSize=8.5, leading=11.5, textColor=NAVY))
    s.add(ParagraphStyle(name="CellHead", fontName="SourceSans-Bold", fontSize=8, leading=11, textColor=WHITE, alignment=TA_CENTER))
    s.add(ParagraphStyle(name="Prompt", fontName="SourceSans-Semibold", fontSize=10, leading=14, textColor=NAVY, spaceAfter=3))
    s.add(ParagraphStyle(name="BackCover", fontName="SourceSans", fontSize=11, leading=16, textColor=HexColor("#F3E6D8")))
    return s


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def draw_header_footer(canvas, doc, section: str) -> None:
    canvas.saveState()
    canvas.setFillColor(SAND)
    canvas.rect(0, PAGE_H - 12 * mm, PAGE_W, 12 * mm, stroke=0, fill=1)
    canvas.setFillColor(TERRACOTTA)
    canvas.rect(0, PAGE_H - 12.4 * mm, PAGE_W, 1.2, stroke=0, fill=1)
    canvas.setFillColor(NAVY)
    canvas.setFont("SourceSans-Semibold", 7.4)
    canvas.drawString(MARGIN_L, PAGE_H - 8.2 * mm, "THE CALM EVENING SURVIVAL GUIDE")
    canvas.setFillColor(MUTED)
    canvas.setFont("SourceSans", 7.4)
    canvas.drawRightString(PAGE_W - MARGIN_R, PAGE_H - 8.2 * mm, section.upper())

    canvas.setFillColor(SAND)
    canvas.rect(0, 0, PAGE_W, 12 * mm, stroke=0, fill=1)
    canvas.setFillColor(TEAL)
    canvas.rect(0, 12 * mm, PAGE_W, 1.1, stroke=0, fill=1)
    canvas.setFillColor(MUTED)
    canvas.setFont("SourceSans", 8)
    canvas.drawCentredString(PAGE_W / 2, 5.2 * mm, str(doc.page))
    canvas.setFont("SourceSans", 7)
    canvas.drawString(MARGIN_L, 5.2 * mm, "Calm evenings. Cooperative children.")
    canvas.drawRightString(PAGE_W - MARGIN_R, 5.2 * mm, "15-minute tools")
    canvas.restoreState()


def draw_cover_page(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFillColor(NAVY_DEEP)
    canvas.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(NAVY)
    canvas.rect(0, 0, 14 * mm, PAGE_H, stroke=0, fill=1)
    canvas.setFillColor(TERRACOTTA)
    canvas.rect(14 * mm, 0, 3.2, PAGE_H, stroke=0, fill=1)

    canvas.setFillColor(TERRACOTTA)
    canvas.roundRect(28 * mm, PAGE_H - 32 * mm, 62 * mm, 8 * mm, 2 * mm, stroke=0, fill=1)
    canvas.setFillColor(WHITE)
    canvas.setFont("SourceSans-Semibold", 8)
    canvas.drawCentredString(28 * mm + 31 * mm, PAGE_H - 29.4 * mm, "PARENTING SURVIVAL GUIDE")

    canvas.setFillColor(WHITE)
    canvas.setFont("Georgia-Bold", 34)
    canvas.drawString(28 * mm, PAGE_H - 58 * mm, "The Calm")
    canvas.drawString(28 * mm, PAGE_H - 72 * mm, "Evening")
    canvas.setFont("Georgia-Italic", 16)
    canvas.setFillColor(HexColor("#E8C4B0"))
    canvas.drawString(28 * mm, PAGE_H - 86 * mm, "A 15-minute home system for Nigerian parents")

    canvas.setStrokeColor(TERRACOTTA)
    canvas.setLineWidth(1.4)
    canvas.line(28 * mm, PAGE_H - 94 * mm, 78 * mm, PAGE_H - 94 * mm)

    canvas.setFillColor(HexColor("#F3E6D8"))
    canvas.setFont("SourceSans", 12)
    y = PAGE_H - 110 * mm
    for line in [
        "You are not a bad parent.",
        "You are an exhausted parent without a shared plan.",
        "",
        "This book gives you the words, the agreement,",
        "and the evening rhythm that turn homework,",
        "chores, and screen time into cooperation -",
        "not another fight after a long school run.",
    ]:
        canvas.drawString(28 * mm, y, line)
        y -= 6.2 * mm

    canvas.setFillColor(TEAL)
    canvas.roundRect(28 * mm, 48 * mm, PAGE_W - 50 * mm, 28 * mm, 3 * mm, stroke=0, fill=1)
    canvas.setFillColor(WHITE)
    canvas.setFont("SourceSans-Bold", 10)
    canvas.drawString(34 * mm, 67 * mm, "OUTCOME, NOT PERFECTION")
    canvas.setFont("SourceSans", 10)
    canvas.drawString(34 * mm, 59 * mm, "Calm evenings. Cooperative children. Less shouting.")
    canvas.drawString(34 * mm, 53 * mm, "Every tool in this book can be used in under 15 minutes.")

    canvas.setFillColor(HexColor("#E8C4B0"))
    canvas.setFont("SourceSans", 9)
    canvas.drawString(28 * mm, 28 * mm, "For parents, guardians, aunties, and caregivers")
    canvas.drawString(28 * mm, 22 * mm, "of school-age children  |  Start tonight")
    canvas.restoreState()


class RoundedBox(Flowable):
    def __init__(self, title: str, body: str, width: float, bg: Color, accent: Color, title_style, body_style, pad: float = 8):
        super().__init__()
        self.title = title
        self.body = body
        self.box_width = width
        self.bg = bg
        self.accent = accent
        self.title_style = title_style
        self.body_style = body_style
        self.pad = pad
        self._title_p = Paragraph(esc(title), title_style) if title else None
        self._body_p = Paragraph(esc(body).replace("\n", "<br/>"), body_style)
        self._h = 40

    def wrap(self, aw, ah):
        inner = self.box_width - self.pad * 2 - 6
        th = 0
        if self._title_p:
            _, th = self._title_p.wrap(inner, ah)
        _, bh = self._body_p.wrap(inner, ah)
        self._th = th
        self._bh = bh
        self._h = self.pad * 2 + th + bh + (6 if th else 0)
        return self.box_width, self._h

    def draw(self):
        self.canv.setFillColor(self.bg)
        self.canv.setStrokeColor(self.accent)
        self.canv.setLineWidth(0.6)
        self.canv.roundRect(0, 0, self.box_width, self._h, 4, stroke=0, fill=1)
        self.canv.setFillColor(self.accent)
        self.canv.rect(0, 0, 3.2, self._h, stroke=0, fill=1)
        y = self._h - self.pad
        inner_x = self.pad + 4
        inner = self.box_width - self.pad * 2 - 6
        if self._title_p:
            self._title_p.drawOn(self.canv, inner_x, y - self._th)
            y -= self._th + 6
        self._body_p.drawOn(self.canv, inner_x, y - self._bh)


class ScriptCard(Flowable):
    def __init__(self, label: str, words: str, width: float, stylesheet: StyleSheet1):
        super().__init__()
        self.label = label
        self.words = words
        self.box_width = width
        self.s = stylesheet
        self._label = Paragraph(esc(label).upper(), stylesheet["ScriptLabel"])
        self._body = Paragraph("&quot;" + esc(words) + "&quot;", stylesheet["ScriptBody"])
        self._h = 40

    def wrap(self, aw, ah):
        inner = self.box_width - 16
        _, lh = self._label.wrap(inner, ah)
        _, bh = self._body.wrap(inner, ah)
        self._lh, self._bh = lh, bh
        self._h = 14 + lh + bh + 8
        return self.box_width, self._h

    def draw(self):
        self.canv.setFillColor(WHITE)
        self.canv.setStrokeColor(LINE)
        self.canv.setLineWidth(0.8)
        self.canv.roundRect(0, 0, self.box_width, self._h, 4, stroke=1, fill=1)
        self.canv.setFillColor(TERRACOTTA)
        self.canv.circle(10, self._h - 11, 3.2, stroke=0, fill=1)
        y = self._h - 8
        self._label.drawOn(self.canv, 16, y - self._lh)
        y -= self._lh + 4
        self._body.drawOn(self.canv, 10, y - self._bh)


class CheckLine(Flowable):
    def __init__(self, text: str, width: float, style: ParagraphStyle):
        super().__init__()
        self.box_width = width
        self._p = Paragraph(esc(text), style)
        self._h = 16

    def wrap(self, aw, ah):
        _, h = self._p.wrap(self.box_width - 18, ah)
        self._ph = h
        self._h = max(14, h + 2)
        return self.box_width, self._h

    def draw(self):
        box_y = self._h - 11
        self.canv.setStrokeColor(TEAL)
        self.canv.setLineWidth(1)
        self.canv.rect(0.5, box_y, 9, 9, stroke=1, fill=0)
        self._p.drawOn(self.canv, 16, 0)


class WriteBlock(Flowable):
    def __init__(self, prompt: str, lines: int, width: float, stylesheet: StyleSheet1):
        super().__init__()
        self.prompt = prompt
        self.lines = lines
        self.box_width = width
        self.s = stylesheet
        self._p = Paragraph(esc(prompt), stylesheet["Prompt"]) if prompt else None
        self._h = 20

    def wrap(self, aw, ah):
        ph = 0
        if self._p:
            _, ph = self._p.wrap(self.box_width, ah)
        self._ph = ph
        self._h = ph + 4 + self.lines * 16 + 4
        return self.box_width, self._h

    def draw(self):
        y = self._h
        if self._p:
            self._p.drawOn(self.canv, 0, y - self._ph)
            y -= self._ph + 4
        else:
            y -= 2
        self.canv.setStrokeColor(LINE)
        self.canv.setLineWidth(0.6)
        for _ in range(self.lines):
            y -= 16
            self.canv.line(0, y, self.box_width, y)


class SectionMark(Flowable):
    """Set the running header when this flowable is drawn, not when the story is built."""

    def __init__(self, name: str, bucket: dict):
        super().__init__()
        self.name = name
        self.bucket = bucket

    def wrap(self, aw, ah):
        return 0, 0

    def draw(self):
        self.bucket["name"] = self.name


class BadgeRow(Flowable):
    def __init__(self, items: list[str], width: float):
        super().__init__()
        self.items = items
        self.box_width = width
        self._h = 22

    def wrap(self, aw, ah):
        return self.box_width, self._h

    def draw(self):
        x = 0
        self.canv.setFont("SourceSans-Semibold", 7.5)
        for item in self.items:
            w = self.canv.stringWidth(item.upper(), "SourceSans-Semibold", 7.5) + 16
            self.canv.setFillColor(TEAL_SOFT)
            self.canv.roundRect(x, 2, w, 16, 3, stroke=0, fill=1)
            self.canv.setFillColor(TEAL)
            self.canv.drawString(x + 8, 6.5, item.upper())
            x += w + 8


def simple_table(data, col_widths, has_header=True) -> Table:
    t = Table(data, colWidths=col_widths, repeatRows=1 if has_header else 0)
    cmds = [
        ("FONTNAME", (0, 0), (-1, -1), "SourceSans"),
        ("FONTSIZE", (0, 0), (-1, -1), 8.4),
        ("LEADING", (0, 0), (-1, -1), 11.4),
        ("TEXTCOLOR", (0, 0), (-1, -1), INK),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("GRID", (0, 0), (-1, -1), 0.4, LINE),
        ("BACKGROUND", (0, 1), (-1, -1), WHITE),
    ]
    if has_header:
        cmds += [
            ("BACKGROUND", (0, 0), (-1, 0), NAVY),
            ("TEXTCOLOR", (0, 0), (-1, 0), WHITE),
            ("FONTNAME", (0, 0), (-1, 0), "SourceSans-Bold"),
            ("ALIGN", (0, 0), (-1, 0), "CENTER"),
        ]
    t.setStyle(TableStyle(cmds))
    return t


def hairline() -> Table:
    t = Table([[""]], colWidths=[CONTENT_W], rowHeights=[6])
    t.setStyle(TableStyle([("LINEBELOW", (0, 0), (-1, 0), 0.5, RULE), ("TOPPADDING", (0, 0), (-1, -1), 0), ("BOTTOMPADDING", (0, 0), (-1, -1), 0)]))
    return t
