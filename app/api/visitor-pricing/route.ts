import { NextRequest, NextResponse } from "next/server";
import {
  buildVisitorPricingContext,
  countryFromLocale,
  normalizeCountryCode,
} from "@/lib/currency-pricing";

const GEO_HEADER_KEYS = [
  "x-vercel-ip-country",
  "cf-ipcountry",
  "cloudfront-viewer-country",
  "x-country-code",
  "x-geo-country",
  "x-appengine-country",
];

function countryFromRequest(request: NextRequest): string {
  for (const key of GEO_HEADER_KEYS) {
    const country = normalizeCountryCode(request.headers.get(key));
    if (country && country !== "XX") return country;
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const locale = acceptLanguage.split(",")[0]?.trim();
  return countryFromLocale(locale);
}

export async function GET(request: NextRequest) {
  const country = countryFromRequest(request);
  const context = buildVisitorPricingContext(country || undefined, country ? "header" : "default");

  return NextResponse.json(context, {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}

