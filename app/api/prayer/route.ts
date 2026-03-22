import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resend, FROM_EMAIL, ADMIN_EMAIL } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, subject, message } = body;

    // Validation
    if (!firstName || !lastName || !message) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Save to database
    await prisma.prayerRequest.create({
      data: {
        name: `${firstName.trim()} ${lastName.trim()}`,
        email: email?.trim().toLowerCase() || null,
        request: message.trim(),
        isPrivate: true,
      },
    });

    // Send notification email to admin
    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject: `New Prayer Request from ${firstName} ${lastName}`,
        html: `
          <h2>New Prayer Request</h2>
          <p><strong>From:</strong> ${firstName} ${lastName}</p>
          ${email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
          <p><strong>Request:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      });
    } else {
      console.log("📧 [DEV] Prayer request submitted:", {
        name: `${firstName} ${lastName}`,
        email,
        subject,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Prayer request error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
