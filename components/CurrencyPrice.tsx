"use client";

import { useEffect, useState, type CSSProperties } from "react";
import {
  buildVisitorPricingContext,
  formatNgnAsCurrency,
  formatUsdAsCurrency,
  inferVisitorPricingContextFromBrowser,
  type VisitorPricingContext,
} from "@/lib/currency-pricing";

const NGN_AMOUNT_PATTERN = /(₦|NGN\s*)([0-9][0-9,]*(?:\.\d+)?)/gi;
const USD_AMOUNT_PATTERN = /(\$|USD\s*)([0-9][0-9,]*(?:\.\d+)?)/gi;

let cachedContext: VisitorPricingContext | null = null;
let contextPromise: Promise<VisitorPricingContext> | null = null;
const contextListeners = new Set<(context: VisitorPricingContext) => void>();

function parseNgnAmount(value: string): number | null {
  NGN_AMOUNT_PATTERN.lastIndex = 0;
  const match = NGN_AMOUNT_PATTERN.exec(value);
  const amount = Number(match?.[2]?.replace(/,/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

function parseUsdAmount(value: string): number | null {
  USD_AMOUNT_PATTERN.lastIndex = 0;
  const match = USD_AMOUNT_PATTERN.exec(value);
  const amount = Number(match?.[2]?.replace(/,/g, ""));
  return Number.isFinite(amount) && amount > 0 ? amount : null;
}

async function fetchVisitorPricingContext(): Promise<VisitorPricingContext> {
  if (cachedContext) return cachedContext;
  if (contextPromise) return contextPromise;

  contextPromise = fetch("/api/visitor-pricing", { cache: "no-store" })
    .then(async (response) => {
      if (!response.ok) throw new Error("Visitor pricing lookup failed.");
      return (await response.json()) as VisitorPricingContext;
    })
    .catch(() => inferVisitorPricingContextFromBrowser())
    .then((context) => {
      cachedContext = context?.countryCode
        ? context
        : buildVisitorPricingContext(undefined, "default");
      contextListeners.forEach((listener) => listener(cachedContext as VisitorPricingContext));
      return cachedContext;
    });

  return contextPromise;
}

function formatLabel({
  ngnLabel,
  usdLabel,
  amountNgn,
  context,
}: {
  ngnLabel: string;
  usdLabel?: string;
  amountNgn?: number;
  context: VisitorPricingContext;
}) {
  if (context.countryCode !== "NG" && usdLabel) {
    const amountUsd = parseUsdAmount(usdLabel);
    if (amountUsd) {
      const converted = formatUsdAsCurrency(amountUsd, context);
      USD_AMOUNT_PATTERN.lastIndex = 0;
      return usdLabel.replace(USD_AMOUNT_PATTERN, converted);
    }
    return usdLabel;
  }

  const resolvedAmount = Number.isFinite(amountNgn) && amountNgn ? amountNgn : parseNgnAmount(ngnLabel);
  if (resolvedAmount) {
    const converted = formatNgnAsCurrency(resolvedAmount, context);
    NGN_AMOUNT_PATTERN.lastIndex = 0;
    return ngnLabel.replace(NGN_AMOUNT_PATTERN, converted);
  }

  return ngnLabel;
}

export function useVisitorPricing() {
  const [context, setContext] = useState<VisitorPricingContext>(
    // Keep the server render and the first client render identical. Browser
    // location is applied after hydration by fetchVisitorPricingContext.
    cachedContext ?? buildVisitorPricingContext(undefined, "default"),
  );

  useEffect(() => {
    contextListeners.add(setContext);
    fetchVisitorPricingContext().then(setContext);
    return () => {
      contextListeners.delete(setContext);
    };
  }, []);

  return context;
}

export default function CurrencyPrice({
  ngnLabel,
  usdLabel,
  amountNgn,
  className,
  style,
}: {
  ngnLabel: string;
  usdLabel?: string;
  amountNgn?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const context = useVisitorPricing();
  const label = formatLabel({ ngnLabel, usdLabel, amountNgn, context });

  return (
    <span className={className} style={style}>
      {label}
    </span>
  );
}
