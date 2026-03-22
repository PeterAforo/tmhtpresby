import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { stripe, fromPesewas, FUND_LABELS } from "@/lib/stripe";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { donationReceiptEmail } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const donation = await prisma.donation.findUnique({
          where: { stripeSessionId: session.id },
          include: { donor: true },
        });

        if (donation) {
          await prisma.donation.update({
            where: { id: donation.id },
            data: {
              status: "completed",
              stripePaymentId: session.payment_intent as string | null,
              stripeSubId: session.subscription as string | null,
            },
          });

          // Send receipt email
          const recipientEmail = donation.donor?.email || donation.guestEmail;
          const recipientName = donation.donor?.firstName || donation.guestFirstName || "Friend";

          if (recipientEmail && process.env.RESEND_API_KEY) {
            const fundLabel = FUND_LABELS[donation.fund] || donation.fund;
            await resend.emails.send({
              from: FROM_EMAIL,
              to: recipientEmail,
              subject: `Donation Receipt — GHS ${fromPesewas(donation.amount)}`,
              html: donationReceiptEmail({
                name: recipientName,
                amount: fromPesewas(donation.amount),
                currency: donation.currency,
                fund: fundLabel,
                frequency: donation.frequency,
                date: donation.createdAt.toISOString(),
                transactionId: donation.id,
              }),
            });

            await prisma.donation.update({
              where: { id: donation.id },
              data: { receiptSentAt: new Date() },
            });
          }
        }
        break;
      }

      case "invoice.payment_succeeded": {
        // Handle recurring subscription payments
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const invoice = event.data.object as any;
        const subId = invoice.subscription as string | null;
        if (subId) {
          const existingDonation = await prisma.donation.findFirst({
            where: { stripeSubId: subId },
            include: { donor: true },
          });

          if (existingDonation && existingDonation.donor) {
            // Create a new donation record for this recurring payment
            await prisma.donation.create({
              data: {
                amount: invoice.amount_paid ?? 0,
                currency: ((invoice.currency as string) || "ghs").toUpperCase(),
                fund: existingDonation.fund,
                frequency: "monthly",
                status: "completed",
                stripePaymentId: (invoice.payment_intent as string) || null,
                donorId: existingDonation.donorId,
              },
            });
          }
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object;
        if (charge.payment_intent) {
          await prisma.donation.updateMany({
            where: { stripePaymentId: charge.payment_intent as string },
            data: { status: "refunded" },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook handler error:", error);
  }

  return NextResponse.json({ received: true });
}
