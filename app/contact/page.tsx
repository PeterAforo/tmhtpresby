"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CHURCH_INFO } from "@/lib/constants";
import type { ContactFormSubject } from "@/types";

const SUBJECTS: { value: ContactFormSubject; label: string }[] = [
  { value: "general-inquiry", label: "General Inquiry" },
  { value: "prayer-request", label: "Prayer Request" },
  { value: "pastoral-care", label: "Pastoral Care" },
  { value: "events", label: "Events" },
  { value: "giving", label: "Giving" },
  { value: "volunteering", label: "Volunteering" },
  { value: "media", label: "Media" },
  { value: "other", label: "Other" },
];

function ContactForm() {
  const searchParams = useSearchParams();
  const preselectedSubject = searchParams.get("subject") || "general-inquiry";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: preselectedSubject as ContactFormSubject,
    message: "",
    consentToContact: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const target = e.target;
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;
    setFormData((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message,
          consent: formData.consentToContact,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.error || "Something went wrong.");
        return;
      }

      setSubmitted(true);
    } catch {
      setFormError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
          <CheckCircle size={32} className="text-[var(--accent)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--text)] mb-2">
          Message Sent!
        </h3>
        <p className="text-[var(--text-muted)] max-w-md mx-auto">
          Thank you for reaching out. We&apos;ll get back to you as soon as
          possible — usually within 24-48 hours.
        </p>
      </div>
    );
  }

  const inputClasses = cn(
    "w-full px-4 py-3 rounded-lg text-sm",
    "bg-[var(--bg)] text-[var(--text)]",
    "border border-[var(--border)]",
    "placeholder:text-[var(--text-muted)]",
    "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent",
    "transition-shadow duration-200"
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-[var(--text)] mb-1.5"
          >
            First Name <span className="text-[var(--cta)]">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleChange}
            placeholder="John"
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-[var(--text)] mb-1.5"
          >
            Last Name <span className="text-[var(--cta)]">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Doe"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Email & Phone */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-[var(--text)] mb-1.5"
          >
            Email <span className="text-[var(--cta)]">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className={inputClasses}
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-[var(--text)] mb-1.5"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+233 XX XXX XXXX"
            className={inputClasses}
          />
        </div>
      </div>

      {/* Subject */}
      <div>
        <label
          htmlFor="subject"
          className="block text-sm font-medium text-[var(--text)] mb-1.5"
        >
          Subject <span className="text-[var(--cta)]">*</span>
        </label>
        <select
          id="subject"
          name="subject"
          required
          value={formData.subject}
          onChange={handleChange}
          className={inputClasses}
        >
          {SUBJECTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-[var(--text)] mb-1.5"
        >
          Message <span className="text-[var(--cta)]">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          value={formData.message}
          onChange={handleChange}
          placeholder={
            formData.subject === "prayer-request"
              ? "Share your prayer request here. All requests are kept confidential."
              : "How can we help you?"
          }
          className={inputClasses}
        />
      </div>

      {/* Consent */}
      <div className="flex items-start gap-3">
        <input
          id="consent"
          name="consentToContact"
          type="checkbox"
          required
          checked={formData.consentToContact}
          onChange={handleChange}
          className="mt-1 w-4 h-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-[var(--accent)]"
        />
        <label htmlFor="consent" className="text-sm text-[var(--text-muted)]">
          I consent to being contacted regarding this inquiry. Your information
          is kept confidential and will not be shared.
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className={cn(
          "w-full sm:w-auto inline-flex items-center justify-center gap-2",
          "px-8 py-3.5 rounded-lg text-base font-semibold",
          "bg-[var(--accent)] text-white",
          "hover:opacity-90 transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed"
        )}
      >
        {submitting ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending...
          </>
        ) : (
          <>
            <Send size={18} />
            Send Message
          </>
        )}
      </button>

      {formError && (
        <p className="text-sm text-red-500 mt-3 text-center">{formError}</p>
      )}
    </form>
  );
}

export default function ContactPage() {
  return (
    <>
      <PageHero
        overline="Get in Touch"
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out with questions, prayer requests, or just to say hello."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact info sidebar */}
            <div className="lg:col-span-2 space-y-8">
              {/* Address */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1">
                    Address
                  </h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                    {CHURCH_INFO.address.street}
                    <br />
                    {CHURCH_INFO.address.city},{" "}
                    {CHURCH_INFO.address.region}
                    <br />
                    {CHURCH_INFO.address.country}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  <Phone size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1">
                    Phone
                  </h3>
                  <a
                    href={`tel:${CHURCH_INFO.phone.replace(/\s/g, "")}`}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {CHURCH_INFO.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1">
                    Email
                  </h3>
                  <a
                    href={`mailto:${CHURCH_INFO.email}`}
                    className="text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                  >
                    {CHURCH_INFO.email}
                  </a>
                </div>
              </div>

              {/* Service times */}
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                  <Clock size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[var(--text)] mb-1">
                    Service Times
                  </h3>
                  <div className="space-y-1">
                    {CHURCH_INFO.serviceTimes.map((s, i) => (
                      <p
                        key={i}
                        className="text-sm text-[var(--text-muted)]"
                      >
                        <span className="font-medium text-[var(--text)]">
                          {s.day}
                        </span>{" "}
                        {s.time} — {s.label}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              {/* Prayer request CTA */}
              <div className="p-5 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={18} className="text-[var(--accent)]" />
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    Prayer Requests
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Need prayer? Select &ldquo;Prayer Request&rdquo; as the subject in
                  the form. All requests are confidential and prayed over by our
                  pastoral team weekly.
                </p>
              </div>

              {/* Google Maps embed */}
              <div className="rounded-xl overflow-hidden border border-[var(--border)] aspect-video">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.9661!2d-0.0456!3d5.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sLashibi%2C%20Accra%2C%20Ghana!5e0!3m2!1sen!2sgh!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Church Location Map"
                  className="w-full h-full"
                />
              </div>
              <a
                href={CHURCH_INFO.address.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-3 text-sm font-medium text-[var(--accent)] hover:underline"
              >
                <MapPin size={14} />
                Get Directions
              </a>
            </div>

            {/* Contact form */}
            <div className="lg:col-span-3">
              <div className="p-6 sm:p-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-[var(--text)] mb-1">
                  Send Us a Message
                </h2>
                <p className="text-sm text-[var(--text-muted)] mb-6">
                  Fill out the form below and we&apos;ll get back to you soon.
                </p>
                <Suspense fallback={<div className="h-96 animate-pulse bg-[var(--bg)] rounded-lg" />}>
                  <ContactForm />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
