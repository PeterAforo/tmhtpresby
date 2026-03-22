import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn(
    "⚠️  STRIPE_SECRET_KEY not set — payment features will not work."
  );
}

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_placeholder",
  { apiVersion: "2026-02-25.clover" }
);

export const CURRENCY = "ghs"; // Ghana Cedis
export const CURRENCY_SYMBOL = "GHS";

/**
 * Convert amount in GHS (e.g. 100) to pesewas (e.g. 10000)
 */
export function toPesewas(amount: number): number {
  return Math.round(amount * 100);
}

/**
 * Convert pesewas to GHS display string
 */
export function fromPesewas(pesewas: number): string {
  return (pesewas / 100).toFixed(2);
}

export const FUND_LABELS: Record<string, string> = {
  general: "General Fund",
  building: "Building Fund",
  missions: "Missions",
  benevolence: "Benevolence",
  youth: "Youth Ministry",
  media: "Media Ministry",
};
