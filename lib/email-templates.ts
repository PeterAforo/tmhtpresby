// ─── Shared styles ──────────────────────────────────────────────
const baseWrapper = (content: string) => `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;margin-top:32px;margin-bottom:32px;">
    <!-- Header -->
    <tr>
      <td style="background:#1a3c34;padding:28px 32px;text-align:center;">
        <h1 style="margin:0;color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.5px;">
          The Most Holy Trinity Presbyterian Church
        </h1>
      </td>
    </tr>
    <!-- Body -->
    <tr>
      <td style="padding:32px;">
        ${content}
      </td>
    </tr>
    <!-- Footer -->
    <tr>
      <td style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;text-align:center;">
        <p style="margin:0;color:#6b7280;font-size:12px;line-height:1.6;">
          14 Liberation Road, Accra, Greater Accra Region, Ghana<br/>
          <a href="https://tmhtpresby.org" style="color:#c8a961;text-decoration:none;">tmhtpresby.org</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── Contact form: confirmation to submitter ────────────────────
export function contactConfirmationEmail(firstName: string) {
  return baseWrapper(`
    <h2 style="margin:0 0 16px;color:#1a3c34;font-size:22px;">Thank you, ${firstName}!</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      We have received your message and a member of our pastoral team will get back to you within 48 hours.
    </p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      If your matter is urgent, please call us directly at
      <a href="tel:+233302345678" style="color:#c8a961;font-weight:600;">+233 30 234 5678</a>.
    </p>
    <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:24px 0 0;">
      In His service,<br/>
      <strong style="color:#1a3c34;">The Most Holy Trinity Presbyterian Church</strong>
    </p>
  `);
}

// ─── Contact form: notification to admin ────────────────────────
export function contactNotificationEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return baseWrapper(`
    <h2 style="margin:0 0 16px;color:#1a3c34;font-size:22px;">New Contact Form Submission</h2>
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom:20px;">
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;width:100px;vertical-align:top;">Name</td>
        <td style="padding:8px 0;color:#111827;font-size:14px;">${data.firstName} ${data.lastName}</td>
      </tr>
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;vertical-align:top;">Email</td>
        <td style="padding:8px 0;color:#111827;font-size:14px;"><a href="mailto:${data.email}" style="color:#c8a961;">${data.email}</a></td>
      </tr>
      ${data.phone ? `<tr>
        <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;vertical-align:top;">Phone</td>
        <td style="padding:8px 0;color:#111827;font-size:14px;">${data.phone}</td>
      </tr>` : ""}
      <tr>
        <td style="padding:8px 0;color:#6b7280;font-size:13px;font-weight:600;vertical-align:top;">Subject</td>
        <td style="padding:8px 0;color:#111827;font-size:14px;">${data.subject}</td>
      </tr>
    </table>
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;padding:16px;margin-top:8px;">
      <p style="margin:0 0 8px;color:#6b7280;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">Message</p>
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.7;white-space:pre-wrap;">${data.message}</p>
    </div>
  `);
}

// ─── Newsletter: welcome email ──────────────────────────────────
export function newsletterWelcomeEmail() {
  return baseWrapper(`
    <h2 style="margin:0 0 16px;color:#1a3c34;font-size:22px;">Welcome to the Family!</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 16px;">
      Thank you for subscribing to our newsletter. You&rsquo;ll receive weekly updates on sermons, events, devotionals, and what&rsquo;s happening in the life of our church.
    </p>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 24px;">
      We&rsquo;re glad you&rsquo;re here.
    </p>
    <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:0;">
      In His service,<br/>
      <strong style="color:#1a3c34;">The Most Holy Trinity Presbyterian Church</strong>
    </p>
    <p style="margin:24px 0 0;text-align:center;">
      <a href="https://tmhtpresby.org" style="display:inline-block;padding:12px 28px;background:#c8a961;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">
        Visit Our Website
      </a>
    </p>
  `);
}

// ─── Donation receipt ───────────────────────────────────────────
export function donationReceiptEmail(data: {
  name: string;
  amount: string;
  currency: string;
  fund: string;
  frequency: string;
  date: string;
  transactionId: string;
}) {
  const formattedDate = new Date(data.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return baseWrapper(`
    <h2 style="margin:0 0 16px;color:#1a3c34;font-size:22px;">Thank You for Your Generosity, ${data.name}!</h2>
    <p style="color:#374151;font-size:15px;line-height:1.7;margin:0 0 20px;">
      Your ${data.frequency === "monthly" ? "monthly" : ""} donation has been received and is making a real difference in the life of our church and community.
    </p>

    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:20px;margin-bottom:20px;">
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;width:120px;">Amount</td>
          <td style="padding:6px 0;color:#111827;font-size:16px;font-weight:700;">${data.currency} ${data.amount}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Fund</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;">${data.fund}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Frequency</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;">${data.frequency === "monthly" ? "Monthly recurring" : "One-time"}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Date</td>
          <td style="padding:6px 0;color:#111827;font-size:14px;">${formattedDate}</td>
        </tr>
        <tr>
          <td style="padding:6px 0;color:#6b7280;font-size:13px;">Transaction ID</td>
          <td style="padding:6px 0;color:#111827;font-size:12px;font-family:monospace;">${data.transactionId}</td>
        </tr>
      </table>
    </div>

    <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0 0 16px;">
      Please keep this email as your donation receipt. If you have any questions about your donation, contact us at
      <a href="mailto:finance@tmhtpresby.org" style="color:#c8a961;">finance@tmhtpresby.org</a>.
    </p>

    <p style="color:#6b7280;font-size:14px;line-height:1.6;margin:16px 0 0;">
      In His service,<br/>
      <strong style="color:#1a3c34;">The Most Holy Trinity Presbyterian Church</strong>
    </p>
  `);
}
