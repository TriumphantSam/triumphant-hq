"""Visual system for The Life Story Blueprint."""

from __future__ import annotations

from pathlib import Path

from reportlab.lib.colors import Color, HexColor, white
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, StyleSheet1
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph

PAGE = letter
PAGE_W, PAGE_H = PAGE

MARGIN_L = 0.82 * inch
MARGIN_R = 0.82 * inch
MARGIN_T = 0.88 * inch
MARGIN_B = 0.78 * inch
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R
CONTENT_X = MARGIN_L

# Quiet-luxury palette: cream paper, espresso ink, antique gold
CREAM = HexColor("#F7F1E4")
CREAM_DEEP = HexColor("#EFE4D2")
IVORY = HexColor("#FBF6EC")
INK = HexColor("#2B2018")
INK_SOFT = HexColor("#5C4636")
MUTED = HexColor("#7A6454")
GOLD = HexColor("#B08D57")
GOLD_DEEP = HexColor("#8C6A3A")
GOLD_PALE = HexColor("#D9C7A3")
LINE = HexColor("#C4B294")
ROSEWOOD = HexColor("#7A3F38")
COVER = HexColor("#2A1C14")
COVER_MID = HexColor("#3A281E")
WHITE = white

FONT_DIR = Path(__file__).resolve().parent / "fonts"

_FONTS_READY = False


def register_fonts() -> None:
    global _FONTS_READY
    if _FONTS_READY:
        return
    files = {
        "Playfair": "playfair-display-v40-latin-regular.ttf",
        "Playfair-Bold": "playfair-display-v40-latin-700.ttf",
        "Playfair-Italic": "playfair-display-v40-latin-italic.ttf",
        "Playfair-BoldItalic": "playfair-display-v40-latin-700italic.ttf",
        "Merri": "merriweather-v33-latin-regular.ttf",
        "Merri-Bold": "merriweather-v33-latin-700.ttf",
        "Merri-Italic": "merriweather-v33-latin-italic.ttf",
        "Merri-BoldItalic": "merriweather-v33-latin-700italic.ttf",
        "Merri-Light": "merriweather-v33-latin-300.ttf",
    }
    for name, fname in files.items():
        path = FONT_DIR / fname
        if not path.exists():
            raise FileNotFoundError(f"Missing font: {path}")
        pdfmetrics.registerFont(TTFont(name, str(path)))
    _FONTS_READY = True


def styles() -> StyleSheet1:
    s = StyleSheet1()
    s.add(
        ParagraphStyle(
            name="Body",
            fontName="Merri",
            fontSize=12.6,
            leading=21.0,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=11,
        )
    )
    s.add(
        ParagraphStyle(
            name="BodyJust",
            fontName="Merri",
            fontSize=12.6,
            leading=21.2,
            textColor=INK,
            alignment=TA_JUSTIFY,
            spaceAfter=12,
        )
    )
    s.add(
        ParagraphStyle(
            name="BodyCenter",
            fontName="Merri",
            fontSize=12.6,
            leading=21.0,
            textColor=INK,
            alignment=TA_CENTER,
            spaceAfter=10,
        )
    )
    s.add(
        ParagraphStyle(
            name="Lead",
            fontName="Merri-Italic",
            fontSize=13.2,
            leading=21.5,
            textColor=INK_SOFT,
            alignment=TA_CENTER,
            spaceAfter=10,
        )
    )
    s.add(
        ParagraphStyle(
            name="Invite",
            fontName="Merri-Italic",
            fontSize=12.3,
            leading=19.6,
            textColor=INK_SOFT,
            alignment=TA_LEFT,
            spaceAfter=8,
        )
    )
    s.add(
        ParagraphStyle(
            name="Question",
            fontName="Merri",
            fontSize=12.3,
            leading=19.2,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=7,
            leftIndent=14,
            firstLineIndent=-14,
        )
    )
    s.add(
        ParagraphStyle(
            name="Whisper",
            fontName="Merri-Italic",
            fontSize=10.2,
            leading=15.2,
            textColor=MUTED,
            alignment=TA_CENTER,
        )
    )
    s.add(
        ParagraphStyle(
            name="H1",
            fontName="Playfair-Bold",
            fontSize=26,
            leading=31,
            textColor=INK,
            alignment=TA_CENTER,
            spaceAfter=8,
        )
    )
    s.add(
        ParagraphStyle(
            name="H2",
            fontName="Playfair",
            fontSize=22,
            leading=27,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=6,
        )
    )
    s.add(
        ParagraphStyle(
            name="DayTitle",
            fontName="Playfair",
            fontSize=23,
            leading=28,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=0,
        )
    )
    s.add(
        ParagraphStyle(
            name="Kicker",
            fontName="Merri",
            fontSize=8.6,
            leading=12,
            textColor=GOLD_DEEP,
            alignment=TA_CENTER,
            spaceAfter=4,
            tracking=2.1,
        )
    )
    s.add(
        ParagraphStyle(
            name="KickerLeft",
            fontName="Merri",
            fontSize=8.4,
            leading=11,
            textColor=GOLD_DEEP,
            alignment=TA_LEFT,
            tracking=1.8,
        )
    )
    s.add(
        ParagraphStyle(
            name="StepTitle",
            fontName="Playfair",
            fontSize=14,
            leading=18,
            textColor=INK,
            spaceAfter=2,
        )
    )
    s.add(
        ParagraphStyle(
            name="StepBody",
            fontName="Merri",
            fontSize=11.5,
            leading=17.5,
            textColor=INK_SOFT,
            spaceAfter=10,
        )
    )
    s.add(
        ParagraphStyle(
            name="TocWeek",
            fontName="Playfair",
            fontSize=13.5,
            leading=18,
            textColor=ROSEWOOD,
            spaceBefore=0,
            spaceAfter=0,
        )
    )
    s.add(
        ParagraphStyle(
            name="TocItem",
            fontName="Merri",
            fontSize=11,
            leading=17.5,
            textColor=INK,
        )
    )
    s.add(
        ParagraphStyle(
            name="LetterOpen",
            fontName="Playfair-Italic",
            fontSize=14,
            leading=18,
            textColor=INK_SOFT,
            spaceAfter=6,
        )
    )
    s.add(
        ParagraphStyle(
            name="SmallCenter",
            fontName="Merri-Italic",
            fontSize=11,
            leading=16.5,
            textColor=INK_SOFT,
            alignment=TA_CENTER,
        )
    )
    s.add(
        ParagraphStyle(
            name="Label",
            fontName="Merri",
            fontSize=10.5,
            leading=15,
            textColor=INK_SOFT,
        )
    )
    return s


def esc(text: str) -> str:
    return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def draw_para(c, text: str, style: ParagraphStyle, x: float, y: float, width: float) -> float:
    """Draw paragraph with top at y. Returns height used."""
    p = Paragraph(esc(text), style)
    _w, h = p.wrap(width, 2000)
    p.drawOn(c, x, y - h)
    return h


def measure_para(text: str, style: ParagraphStyle, width: float) -> float:
    p = Paragraph(esc(text), style)
    _w, h = p.wrap(width, 2000)
    return h


def draw_cream_page(c, fill: Color = CREAM) -> None:
    c.setFillColor(fill)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)


def draw_double_frame(c, inset: float = 22, color: Color = GOLD, inner_gap: float = 4.2) -> None:
    c.setStrokeColor(color)
    c.setLineWidth(0.9)
    c.rect(inset, inset, PAGE_W - 2 * inset, PAGE_H - 2 * inset, stroke=1, fill=0)
    c.setLineWidth(0.45)
    g = inner_gap
    c.rect(inset + g, inset + g, PAGE_W - 2 * (inset + g), PAGE_H - 2 * (inset + g), stroke=1, fill=0)


def draw_corners(c, inset: float = 28, arm: float = 14, color: Color = GOLD) -> None:
    c.setStrokeColor(color)
    c.setLineWidth(1.05)
    pts = [
        (inset, PAGE_H - inset, 1, -1),
        (PAGE_W - inset, PAGE_H - inset, -1, -1),
        (inset, inset, 1, 1),
        (PAGE_W - inset, inset, -1, 1),
    ]
    for x, y, dx, dy in pts:
        c.line(x, y, x + arm * dx, y)
        c.line(x, y, x, y + arm * dy)


def wrap_text_lines(text: str, font: str, size: float, max_width: float) -> list[str]:
    from reportlab.pdfbase.pdfmetrics import stringWidth

    words = text.split()
    if not words:
        return [""]
    lines: list[str] = []
    current = words[0]
    for word in words[1:]:
        trial = current + " " + word
        if stringWidth(trial, font, size) <= max_width:
            current = trial
        else:
            lines.append(current)
            current = word
    lines.append(current)
    return lines


def letterspace(text: str, inner: str = "  ", word_gap: str = "     ") -> str:
    """Luxury small-caps tracking without colliding word spaces."""
    return word_gap.join(inner.join(list(word)) for word in text.upper().split())


def draw_centered_lines(c, text: str, y: float, font: str, size: float, max_width: float, leading: float | None = None, color=None) -> float:
    """Draw one or two centered lines. Returns y after the last line."""
    from reportlab.pdfbase.pdfmetrics import stringWidth

    if color is not None:
        c.setFillColor(color)
    c.setFont(font, size)
    lead = leading if leading is not None else size * 1.18
    if stringWidth(text, font, size) <= max_width:
        c.drawCentredString(PAGE_W / 2, y, text)
        return y - lead
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        trial = (current + " " + word).strip()
        if stringWidth(trial, font, size) <= max_width:
            current = trial
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    for line in lines:
        c.drawCentredString(PAGE_W / 2, y, line)
        y -= lead
    return y


def draw_flourish(c, cx: float, cy: float, color: Color = GOLD, scale: float = 1.0) -> None:
    """Small bookish ornament: line, diamond, line."""
    c.saveState()
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(0.7)
    wing = 38 * scale
    c.line(cx - wing, cy, cx - 8 * scale, cy)
    c.line(cx + 8 * scale, cy, cx + wing, cy)
    d = 4.2 * scale
    p = c.beginPath()
    p.moveTo(cx, cy + d)
    p.lineTo(cx + d, cy)
    p.lineTo(cx, cy - d)
    p.lineTo(cx - d, cy)
    p.close()
    c.drawPath(p, stroke=0, fill=1)
    c.setLineWidth(0.45)
    c.circle(cx, cy, 6.4 * scale, stroke=1, fill=0)
    c.restoreState()


def draw_rule(c, x: float, y: float, w: float, color: Color = GOLD_PALE, weight: float = 0.6) -> None:
    c.setStrokeColor(color)
    c.setLineWidth(weight)
    c.line(x, y, x + w, y)


def draw_double_rule(c, x: float, y: float, w: float) -> None:
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.9)
    c.line(x, y, x + w, y)
    c.setLineWidth(0.4)
    c.line(x, y - 3.2, x + w, y - 3.2)


def draw_header_footer(c, section: str, page_label: str) -> None:
    c.setFillColor(GOLD_DEEP)
    c.setFont("Merri", 8)
    c.drawString(MARGIN_L, PAGE_H - 0.52 * inch, "THE LIFE STORY BLUEPRINT")
    c.setFillColor(MUTED)
    c.setFont("Merri", 8)
    c.drawRightString(PAGE_W - MARGIN_R, PAGE_H - 0.52 * inch, section)
    draw_rule(c, MARGIN_L, PAGE_H - 0.60 * inch, CONTENT_W, GOLD_PALE, 0.55)

    draw_rule(c, MARGIN_L, 0.48 * inch, CONTENT_W, GOLD_PALE, 0.55)
    c.setFillColor(GOLD_DEEP)
    c.setFont("Playfair", 9.5)
    c.drawCentredString(PAGE_W / 2, 0.30 * inch, page_label)


def draw_writing_lines(
    c,
    x: float,
    y_top: float,
    width: float,
    count: int,
    spacing: float = 24.0,
    color: Color = LINE,
) -> float:
    """Draw ruled lines downward from y_top. Returns y of last line."""
    c.setStrokeColor(color)
    c.setLineWidth(0.55)
    y = y_top
    for _ in range(count):
        c.line(x, y, x + width, y)
        y -= spacing
    return y


def draw_field_line(c, label: str, x: float, y: float, width: float, label_w: float = 118) -> None:
    """Draw a label sitting on a writing line. y is the text baseline."""
    c.setFillColor(INK_SOFT)
    c.setFont("Merri", 11)
    c.drawString(x, y, label)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.7)
    c.line(x + label_w, y - 1.2, x + width, y - 1.2)
