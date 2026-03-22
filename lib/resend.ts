import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn(
    "⚠️  RESEND_API_KEY not set — emails will be logged to console instead of sent."
  );
}

export const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder");

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL || "noreply@tmhtpresby.org";

export const ADMIN_EMAIL =
  process.env.ADMIN_EMAIL || "admin@tmhtpresby.org";
