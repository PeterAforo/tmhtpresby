import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resend, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/resend";
import {
  contactConfirmationEmail,
  contactNotificationEmail,
} from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, subject, message, consent } =
      body;

    // ── Validation ────────────────────────────────────────────────
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (!consent) {
      return NextResponse.json(
        { error: "You must consent to data processing." },
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

    // ── Save to database ──────────────────────────────────────────
    await prisma.contact.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject,
        message: message.trim(),
      },
    });

    // ── Send emails (non-blocking — don't fail if Resend key missing)
    if (process.env.RESEND_API_KEY) {
      await Promise.allSettled([
        resend.emails.send({
          from: FROM_EMAIL,
          to: email.trim().toLowerCase(),
          subject: "We received your message — Most Holy Trinity",
          html: contactConfirmationEmail(firstName.trim()),
        }),
        resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `New Contact: ${subject} — ${firstName} ${lastName}`,
          html: contactNotificationEmail({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim().toLowerCase(),
            phone: phone?.trim(),
            subject,
            message: message.trim(),
          }),
        }),
      ]);
    } else {
      console.log("📧 [DEV] Contact form submitted:", {
        firstName,
        lastName,
        email,
        subject,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
