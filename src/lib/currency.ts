// src/lib/currency.ts
export const SUPPORTED_CURRENCIES =
  (import.meta.env.VITE_SUPPORTED_CURRENCIES || "UGX,JPY,USD,EUR,KES,RWF,TZS")
    .split(",").map((s: string )=> s.trim().toUpperCase());

export const DEFAULT_CURRENCY =
  (import.meta.env.VITE_DEFAULT_CURRENCY || "USD").toUpperCase();

const CURRENCY_EXPONENT: Record<string, number> = {
  UGX: 0,
  JPY: 0,
  USD: 2,
  EUR: 2,
  GBP: 2,
  KES: 2, // Kenya
  RWF: 0, // Rwanda
  TZS: 2, // Tanzania
};

export const getExponent = (c: string) => CURRENCY_EXPONENT[c] ?? 2;

export const getCurrency = () =>
  (localStorage.getItem("currency") || DEFAULT_CURRENCY).toUpperCase();

export const setCurrency = (c: string) => {
  const cur = c.toUpperCase();
  if (SUPPORTED_CURRENCIES.includes(cur)) localStorage.setItem("currency", cur);
};

export const minorToMajor = (minor: number, currency = getCurrency()) =>
  minor / Math.pow(10, getExponent(currency));

export const formatMoney = (amount: number, currency = getCurrency()) => {
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(amount);
  } catch {
    // fallback to plain number if Intl throws for some reason
    return `${amount} ${currency}`;
  }
};

/** Best-effort display price from a Product shape returned by your API */
export const priceForProduct = (p: any, currency = getCurrency()): number => {
  if (p?.prices && typeof p.prices[currency] === "number") {
    return minorToMajor(p.prices[currency], currency);
  }
  if (typeof p.price === "number") return p.price; // Product virtual (major units)
  if (typeof p.priceCents === "number") return minorToMajor(p.priceCents, currency);
  return 0;
};
