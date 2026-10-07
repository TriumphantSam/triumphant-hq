import { whatsappNumber } from "@/lib/services";

export const WHATSAPP_NUMBER = whatsappNumber;

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
