import { NextRequest, NextResponse } from "next/server";
import { parseTelegramWaCommand, sendWhatsAppText } from "@/lib/whatsapp-launch-bundle";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidTelegramSecret(request: NextRequest): boolean {
  const expected = (process.env.TELEGRAM_WEBHOOK_SECRET ?? "").trim();
  if (!expected) return true;
  const supplied = request.headers.get("x-telegram-bot-api-secret-token") ?? "";
  return supplied === expected;
}

export async function POST(request: NextRequest) {
  try {
    if (!isValidTelegramSecret(request)) {
      return NextResponse.json({ error: "invalid_secret" }, { status: 403 });
    }

    const payload = (await request.json()) as {
      message?: { chat?: { id?: number | string }; text?: string; caption?: string };
      edited_message?: { chat?: { id?: number | string }; text?: string; caption?: string };
    };
    const message = payload.message || payload.edited_message || {};
    const chatId = String(message.chat?.id ?? "").trim();
    const text = String(message.text || message.caption || "").trim();
    const allowedChatId = (process.env.TELEGRAM_CHAT_ID ?? "").trim();

    if (allowedChatId && chatId && chatId !== allowedChatId) {
      return NextResponse.json({ ok: true, skipped: "unauthorized_chat" });
    }
    if (!text) {
      return NextResponse.json({ ok: true, skipped: "no_text" });
    }

    const parsed = parseTelegramWaCommand(text);
    if (!parsed) {
      return NextResponse.json({ ok: true, skipped: "not_wa_command" });
    }

    await sendWhatsAppText(parsed.phone, parsed.message);
    const token = (process.env.TELEGRAM_BOT_TOKEN ?? "").trim();
    if (token && chatId) {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: `Sent to +${parsed.phone}`,
          disable_web_page_preview: true,
        }),
        cache: "no-store",
      }).catch(() => undefined);
    }

    return NextResponse.json({ ok: true, to: parsed.phone });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown Telegram webhook error" },
      { status: 500 },
    );
  }
}
