import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";
import { newsletterWelcomeEmail } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // ── Validation ────────────────────────────────────────────────
    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();

    // ── Upsert subscriber (handle duplicates gracefully) ──────────
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing && !existing.unsubscribed) {
      return NextResponse.json({
        success: true,
        message: "You're already subscribed!",
      });
    }

    if (existing && existing.unsubscribed) {
      // Re-subscribe
      await prisma.newsletterSubscriber.update({
        where: { email: normalizedEmail },
        data: { unsubscribed: false, confirmedAt: new Date() },
      });
    } else {
      await prisma.newsletterSubscriber.create({
        data: {
          email: normalizedEmail,
          confirmedAt: new Date(),
        },
      });
    }

    // ── Send welcome email ────────────────────────────────────────
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: normalizedEmail,
        subject: "Welcome to the Most Holy Trinity Newsletter!",
        html: newsletterWelcomeEmail(),
      });
    } else {
      console.log("📧 [DEV] Newsletter subscription:", normalizedEmail);
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed!",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
