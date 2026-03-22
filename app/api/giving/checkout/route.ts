import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe, toPesewas, CURRENCY, FUND_LABELS } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, fund, frequency, email, firstName, lastName } = body;

    // ── Validation ────────────────────────────────────────────────
    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Please enter a valid amount." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const fundLabel = FUND_LABELS[fund] || "General Fund";
    const amountInPesewas = toPesewas(amount);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // ── Find or create donor ──────────────────────────────────────
    let donor = await prisma.donor.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!donor) {
      donor = await prisma.donor.create({
        data: {
          email: email.toLowerCase(),
          firstName: firstName || null,
          lastName: lastName || null,
        },
      });
    }

    // ── Create Stripe Checkout Session ────────────────────────────
    if (frequency === "monthly") {
      // Recurring: create a subscription checkout
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: CURRENCY,
              unit_amount: amountInPesewas,
              recurring: { interval: "month" },
              product_data: {
                name: `Monthly Giving — ${fundLabel}`,
                description: `Monthly donation to ${fundLabel} at Most Holy Trinity Presbyterian Church`,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          fund,
          frequency: "monthly",
          donorId: donor.id,
        },
        success_url: `${appUrl}/give/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/give/cancelled`,
      });

      // Save pending donation
      await prisma.donation.create({
        data: {
          amount: amountInPesewas,
          currency: CURRENCY.toUpperCase(),
          fund,
          frequency: "monthly",
          status: "pending",
          stripeSessionId: session.id,
          donorId: donor.id,
        },
      });

      return NextResponse.json({ url: session.url });
    } else {
      // One-time payment
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: CURRENCY,
              unit_amount: amountInPesewas,
              product_data: {
                name: `Donation — ${fundLabel}`,
                description: `One-time donation to ${fundLabel} at Most Holy Trinity Presbyterian Church`,
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          fund,
          frequency: "one-time",
          donorId: donor.id,
        },
        success_url: `${appUrl}/give/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/give/cancelled`,
      });

      // Save pending donation
      await prisma.donation.create({
        data: {
          amount: amountInPesewas,
          currency: CURRENCY.toUpperCase(),
          fund,
          frequency: "one-time",
          status: "pending",
          stripeSessionId: session.id,
          donorId: donor.id,
        },
      });

      return NextResponse.json({ url: session.url });
    }
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session." },
      { status: 500 }
    );
  }
}
