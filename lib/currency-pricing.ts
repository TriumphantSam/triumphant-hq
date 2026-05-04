export type VisitorPricingContext = {
  countryCode: string;
  currency: string;
  locale: string;
  source: "header" | "cookie" | "locale" | "timezone" | "default";
};

const DEFAULT_COUNTRY = "NG";
const DEFAULT_LOCALE = "en-NG";
const DEFAULT_NGN_PER_USD = 1500;

const COUNTRY_TO_CURRENCY: Record<string, string> = {
  AD: "EUR",
  AE: "AED",
  AF: "AFN",
  AG: "XCD",
  AI: "XCD",
  AL: "ALL",
  AM: "AMD",
  AO: "AOA",
  AR: "ARS",
  AS: "USD",
  AT: "EUR",
  AU: "AUD",
  AW: "AWG",
  AX: "EUR",
  AZ: "AZN",
  BA: "BAM",
  BB: "BBD",
  BD: "BDT",
  BE: "EUR",
  BF: "XOF",
  BG: "BGN",
  BH: "BHD",
  BI: "BIF",
  BJ: "XOF",
  BL: "EUR",
  BM: "BMD",
  BN: "BND",
  BO: "BOB",
  BQ: "USD",
  BR: "BRL",
  BS: "BSD",
  BT: "BTN",
  BW: "BWP",
  BY: "BYN",
  BZ: "BZD",
  CA: "CAD",
  CC: "AUD",
  CD: "CDF",
  CF: "XAF",
  CG: "XAF",
  CH: "CHF",
  CI: "XOF",
  CK: "NZD",
  CL: "CLP",
  CM: "XAF",
  CN: "CNY",
  CO: "COP",
  CR: "CRC",
  CU: "CUP",
  CV: "CVE",
  CW: "ANG",
  CX: "AUD",
  CY: "EUR",
  CZ: "CZK",
  DE: "EUR",
  DJ: "DJF",
  DK: "DKK",
  DM: "XCD",
  DO: "DOP",
  DZ: "DZD",
  EC: "USD",
  EE: "EUR",
  EG: "EGP",
  EH: "MAD",
  ER: "ERN",
  ES: "EUR",
  ET: "ETB",
  FI: "EUR",
  FJ: "FJD",
  FK: "FKP",
  FM: "USD",
  FO: "DKK",
  FR: "EUR",
  GA: "XAF",
  GB: "GBP",
  GD: "XCD",
  GE: "GEL",
  GF: "EUR",
  GG: "GBP",
  GH: "GHS",
  GI: "GIP",
  GL: "DKK",
  GM: "GMD",
  GN: "GNF",
  GP: "EUR",
  GQ: "XAF",
  GR: "EUR",
  GT: "GTQ",
  GU: "USD",
  GW: "XOF",
  GY: "GYD",
  HK: "HKD",
  HN: "HNL",
  HR: "EUR",
  HT: "HTG",
  HU: "HUF",
  ID: "IDR",
  IE: "EUR",
  IL: "ILS",
  IM: "GBP",
  IN: "INR",
  IO: "USD",
  IQ: "IQD",
  IR: "IRR",
  IS: "ISK",
  IT: "EUR",
  JE: "GBP",
  JM: "JMD",
  JO: "JOD",
  JP: "JPY",
  KE: "KES",
  KG: "KGS",
  KH: "KHR",
  KI: "AUD",
  KM: "KMF",
  KN: "XCD",
  KP: "KPW",
  KR: "KRW",
  KW: "KWD",
  KY: "KYD",
  KZ: "KZT",
  LA: "LAK",
  LB: "LBP",
  LC: "XCD",
  LI: "CHF",
  LK: "LKR",
  LR: "LRD",
  LS: "LSL",
  LT: "EUR",
  LU: "EUR",
  LV: "EUR",
  LY: "LYD",
  MA: "MAD",
  MC: "EUR",
  MD: "MDL",
  ME: "EUR",
  MF: "EUR",
  MG: "MGA",
  MH: "USD",
  MK: "MKD",
  ML: "XOF",
  MM: "MMK",
  MN: "MNT",
  MO: "MOP",
  MP: "USD",
  MQ: "EUR",
  MR: "MRU",
  MS: "XCD",
  MT: "EUR",
  MU: "MUR",
  MV: "MVR",
  MW: "MWK",
  MX: "MXN",
  MY: "MYR",
  MZ: "MZN",
  NA: "NAD",
  NC: "XPF",
  NE: "XOF",
  NF: "AUD",
  NG: "NGN",
  NI: "NIO",
  NL: "EUR",
  NO: "NOK",
  NP: "NPR",
  NR: "AUD",
  NU: "NZD",
  NZ: "NZD",
  OM: "OMR",
  PA: "PAB",
  PE: "PEN",
  PF: "XPF",
  PG: "PGK",
  PH: "PHP",
  PK: "PKR",
  PL: "PLN",
  PM: "EUR",
  PN: "NZD",
  PR: "USD",
  PS: "ILS",
  PT: "EUR",
  PW: "USD",
  PY: "PYG",
  QA: "QAR",
  RE: "EUR",
  RO: "RON",
  RS: "RSD",
  RU: "RUB",
  RW: "RWF",
  SA: "SAR",
  SB: "SBD",
  SC: "SCR",
  SD: "SDG",
  SE: "SEK",
  SG: "SGD",
  SH: "SHP",
  SI: "EUR",
  SJ: "NOK",
  SK: "EUR",
  SL: "SLE",
  SM: "EUR",
  SN: "XOF",
  SO: "SOS",
  SR: "SRD",
  SS: "SSP",
  ST: "STN",
  SV: "USD",
  SX: "ANG",
  SY: "SYP",
  SZ: "SZL",
  TC: "USD",
  TD: "XAF",
  TG: "XOF",
  TH: "THB",
  TJ: "TJS",
  TK: "NZD",
  TL: "USD",
  TM: "TMT",
  TN: "TND",
  TO: "TOP",
  TR: "TRY",
  TT: "TTD",
  TV: "AUD",
  TW: "TWD",
  TZ: "TZS",
  UA: "UAH",
  UG: "UGX",
  UM: "USD",
  US: "USD",
  UY: "UYU",
  UZ: "UZS",
  VA: "EUR",
  VC: "XCD",
  VE: "VES",
  VG: "USD",
  VI: "USD",
  VN: "VND",
  VU: "VUV",
  WF: "XPF",
  WS: "WST",
  XK: "EUR",
  YE: "YER",
  YT: "EUR",
  ZA: "ZAR",
  ZM: "ZMW",
  ZW: "USD",
};

const USD_TO_CURRENCY: Record<string, number> = {
  AED: 3.67,
  AFN: 71,
  ALL: 93,
  AMD: 390,
  ANG: 1.79,
  AOA: 920,
  ARS: 875,
  AUD: 1.54,
  AWG: 1.8,
  AZN: 1.7,
  BAM: 1.79,
  BBD: 2,
  BDT: 110,
  BGN: 1.79,
  BHD: 0.38,
  BIF: 2850,
  BMD: 1,
  BND: 1.35,
  BOB: 6.9,
  BRL: 5.05,
  BSD: 1,
  BTN: 83,
  BWP: 13.6,
  BYN: 3.27,
  BZD: 2,
  CAD: 1.37,
  CDF: 2800,
  CHF: 0.91,
  CLP: 945,
  CNY: 7.24,
  COP: 3900,
  CRC: 515,
  CUP: 24,
  CVE: 101,
  CZK: 23.1,
  DJF: 178,
  DKK: 6.86,
  DOP: 59,
  DZD: 134,
  EGP: 48,
  ERN: 15,
  ETB: 57,
  EUR: 0.92,
  FJD: 2.25,
  FKP: 0.79,
  GBP: 0.79,
  GEL: 2.7,
  GHS: 14.5,
  GIP: 0.79,
  GMD: 68,
  GNF: 8600,
  GTQ: 7.78,
  GYD: 209,
  HKD: 7.82,
  HNL: 24.7,
  HTG: 132,
  HUF: 360,
  IDR: 16200,
  ILS: 3.7,
  INR: 83,
  IQD: 1310,
  IRR: 42000,
  ISK: 139,
  JMD: 156,
  JOD: 0.71,
  JPY: 155,
  KES: 130,
  KGS: 89,
  KHR: 4100,
  KMF: 452,
  KRW: 1360,
  KWD: 0.31,
  KYD: 0.83,
  KZT: 445,
  LAK: 21200,
  LBP: 89500,
  LKR: 300,
  LRD: 193,
  LSL: 18.3,
  LYD: 4.84,
  MAD: 10,
  MDL: 17.7,
  MGA: 4500,
  MKD: 56.5,
  MMK: 2100,
  MNT: 3450,
  MOP: 8.05,
  MRU: 39.6,
  MUR: 46,
  MVR: 15.4,
  MWK: 1735,
  MXN: 17,
  MYR: 4.7,
  MZN: 64,
  NAD: 18.3,
  NGN: 1500,
  NIO: 36.8,
  NOK: 10.7,
  NPR: 133,
  NZD: 1.67,
  OMR: 0.38,
  PAB: 1,
  PEN: 3.72,
  PGK: 3.8,
  PHP: 57.5,
  PKR: 278,
  PLN: 3.95,
  PYG: 7400,
  QAR: 3.64,
  RON: 4.58,
  RSD: 108,
  RUB: 92,
  RWF: 1300,
  SAR: 3.75,
  SBD: 8.45,
  SCR: 13.8,
  SDG: 600,
  SEK: 10.6,
  SGD: 1.35,
  SHP: 0.79,
  SLE: 22.5,
  SOS: 571,
  SRD: 35,
  SSP: 130,
  STN: 22.6,
  SYP: 13000,
  SZL: 18.3,
  THB: 36.6,
  TJS: 10.9,
  TMT: 3.5,
  TND: 3.13,
  TOP: 2.36,
  TRY: 32.4,
  TTD: 6.78,
  TWD: 32.3,
  TZS: 2600,
  UAH: 39.5,
  UGX: 3800,
  USD: 1,
  UYU: 38.6,
  UZS: 12600,
  VES: 36.6,
  VND: 25400,
  VUV: 119,
  WST: 2.8,
  XAF: 603,
  XCD: 2.7,
  XOF: 603,
  XPF: 110,
  YER: 250,
  ZAR: 18.3,
  ZMW: 25,
};

const TIMEZONE_COUNTRY_HINTS: Record<string, string> = {
  "Africa/Lagos": "NG",
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Phoenix": "US",
  "America/Anchorage": "US",
  "Pacific/Honolulu": "US",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/Mexico_City": "MX",
  "America/Sao_Paulo": "BR",
  "America/Bogota": "CO",
  "America/Lima": "PE",
  "America/Santiago": "CL",
  "Europe/London": "GB",
  "Europe/Dublin": "IE",
  "Europe/Paris": "FR",
  "Europe/Berlin": "DE",
  "Europe/Madrid": "ES",
  "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL",
  "Europe/Warsaw": "PL",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Zurich": "CH",
  "Asia/Dubai": "AE",
  "Asia/Kolkata": "IN",
  "Asia/Singapore": "SG",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "Asia/Shanghai": "CN",
  "Asia/Hong_Kong": "HK",
  "Asia/Jakarta": "ID",
  "Asia/Manila": "PH",
  "Asia/Bangkok": "TH",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Pacific/Auckland": "NZ",
};

export function normalizeCountryCode(value?: string | null): string {
  const country = value?.trim().toUpperCase() ?? "";
  return /^[A-Z]{2}$/.test(country) ? country : "";
}

export function currencyForCountry(countryCode?: string | null): string {
  const country = normalizeCountryCode(countryCode);
  return COUNTRY_TO_CURRENCY[country] ?? "USD";
}

export function localeForCountry(countryCode?: string | null): string {
  const country = normalizeCountryCode(countryCode);
  if (!country) return DEFAULT_LOCALE;
  return country === "NG" ? DEFAULT_LOCALE : `en-${country}`;
}

export function getNgnPerUsd(): number {
  const env: Record<string, string | undefined> = typeof process !== "undefined" ? process.env : {};
  const configured = Number(env.NEXT_PUBLIC_DIGITAL_FORGE_NGN_PER_USD ?? env.DIGITAL_FORGE_NGN_PER_USD ?? DEFAULT_NGN_PER_USD);
  return Number.isFinite(configured) && configured > 0 ? configured : DEFAULT_NGN_PER_USD;
}

function parseRateOverrides(): Record<string, number> {
  const env: Record<string, string | undefined> = typeof process !== "undefined" ? process.env : {};
  const raw = env.NEXT_PUBLIC_DIGITAL_FORGE_USD_TO_CURRENCY_JSON ?? env.DIGITAL_FORGE_USD_TO_CURRENCY_JSON ?? "";
  if (!raw.trim()) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return Object.entries(parsed).reduce<Record<string, number>>((accumulator, [currency, value]) => {
      const rate = Number(value);
      if (currency.length === 3 && Number.isFinite(rate) && rate > 0) {
        accumulator[currency.toUpperCase()] = rate;
      }
      return accumulator;
    }, {});
  } catch {
    return {};
  }
}

export function usdToCurrencyRate(currency: string): number {
  const normalized = currency.toUpperCase();
  const overrides = parseRateOverrides();
  return overrides[normalized] ?? USD_TO_CURRENCY[normalized] ?? 1;
}

export function countryFromLocale(locale?: string): string {
  if (!locale) return "";
  try {
    const parsed = new Intl.Locale(locale);
    return normalizeCountryCode(parsed.region);
  } catch {
    const match = locale.match(/[-_]([A-Za-z]{2})(?:$|[-_])/);
    return normalizeCountryCode(match?.[1]);
  }
}

export function countryFromTimezone(timeZone?: string): string {
  if (!timeZone) return "";
  return normalizeCountryCode(TIMEZONE_COUNTRY_HINTS[timeZone]);
}

export function buildVisitorPricingContext(
  countryCode?: string | null,
  source: VisitorPricingContext["source"] = "default",
): VisitorPricingContext {
  const normalizedCountry = normalizeCountryCode(countryCode) || DEFAULT_COUNTRY;
  return {
    countryCode: normalizedCountry,
    currency: currencyForCountry(normalizedCountry),
    locale: localeForCountry(normalizedCountry),
    source,
  };
}

export function formatNgnAsCurrency(amountNgn: number, context: VisitorPricingContext): string {
  const safeAmount = Number.isFinite(amountNgn) && amountNgn > 0 ? amountNgn : 0;
  const currency = context.countryCode === "NG" ? "NGN" : context.currency;
  const amount =
    currency === "NGN"
      ? safeAmount
      : (safeAmount / getNgnPerUsd()) * usdToCurrencyRate(currency);
  const maximumFractionDigits = currency === "NGN" || amount >= 100 ? 0 : 2;
  const formatted = new Intl.NumberFormat(context.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: maximumFractionDigits === 0 ? 0 : 2,
    maximumFractionDigits,
  }).format(amount);

  return currency === "NGN" || currency === "USD" ? formatted : `≈${formatted}`;
}

export function formatUsdAsCurrency(amountUsd: number, context: VisitorPricingContext): string {
  const safeAmount = Number.isFinite(amountUsd) && amountUsd > 0 ? amountUsd : 0;
  const currency = context.countryCode === "NG" ? "NGN" : context.currency;
  const amount =
    currency === "NGN"
      ? safeAmount * getNgnPerUsd()
      : safeAmount * usdToCurrencyRate(currency);
  const maximumFractionDigits = currency === "NGN" || amount >= 100 ? 0 : 2;
  const formatted = new Intl.NumberFormat(context.locale, {
    style: "currency",
    currency,
    minimumFractionDigits: maximumFractionDigits === 0 ? 0 : 2,
    maximumFractionDigits,
  }).format(amount);

  return currency === "NGN" || currency === "USD" ? formatted : `≈${formatted}`;
}

export function inferVisitorPricingContextFromBrowser(): VisitorPricingContext {
  if (typeof navigator !== "undefined") {
    const locales = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const locale of locales) {
      const country = countryFromLocale(locale);
      if (country) return buildVisitorPricingContext(country, "locale");
    }
  }

  try {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
    const country = countryFromTimezone(timeZone);
    if (country) return buildVisitorPricingContext(country, "timezone");
  } catch {
    // Fall through to default.
  }

  return buildVisitorPricingContext(DEFAULT_COUNTRY, "default");
}
