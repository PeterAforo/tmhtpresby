"use client";

import { useState, useRef, useEffect } from "react";
import { User, Mail, FileText, Send, HandHeart } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PrayerFormSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    email: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      setSubmitted(true);
      setFormData({ firstName: "", lastName: "", subject: "", email: "", message: "" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".prayer-form",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 lg:py-28 bg-[#0C1529]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Form */}
          <div className="prayer-form order-2 lg:order-1">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:border-[var(--accent)] focus:bg-white/10 transition-colors"
                  />
                </div>

                {/* Last Name */}
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:border-[var(--accent)] focus:bg-white/10 transition-colors"
                  />
                </div>

                {/* Subject */}
                <div className="relative">
                  <FileText size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="text"
                    name="subject"
                    placeholder="Subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:border-[var(--accent)] focus:bg-white/10 transition-colors"
                  />
                </div>

                {/* Email */}
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:border-[var(--accent)] focus:bg-white/10 transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <textarea
                name="message"
                placeholder="Share your prayer request with us..."
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 bg-white/5 border border-white/20 text-white placeholder-white/50 rounded-lg focus:outline-none focus:border-[var(--accent)] focus:bg-white/10 transition-colors resize-none"
              />

              {/* Error message */}
              {error && (
                <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg">{error}</p>
              )}

              {/* Success message */}
              {submitted && (
                <p className="text-green-400 text-sm text-center bg-green-500/10 py-2 rounded-lg">
                  Thank you! Your prayer request has been submitted. Our prayer team will lift you up in prayer.
                </p>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[var(--accent)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Prayer Request"}
                <Send size={18} />
              </button>
            </form>
          </div>

          {/* Right side - Descriptive text with praying hands icon */}
          <div className="prayer-info order-1 lg:order-2 text-center lg:text-left">
            {/* Large praying hands icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 lg:w-32 lg:h-32 rounded-full bg-[var(--accent)]/20 mb-6">
              <HandHeart size={48} className="text-[var(--accent)] lg:w-16 lg:h-16" />
            </div>
            
            <h2 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              Prayer Request
            </h2>
            
            <div className="w-16 h-1 bg-[var(--accent)] rounded-full mb-6 mx-auto lg:mx-0" />
            
            <p className="text-white/80 text-base lg:text-lg leading-relaxed mb-6">
              &ldquo;Therefore I tell you, whatever you ask for in prayer, believe that you have received it, and it will be yours.&rdquo;
              <span className="block mt-2 text-[var(--accent)] font-semibold text-sm">— Mark 11:24</span>
            </p>
            
            <p className="text-white/70 text-sm lg:text-base leading-relaxed mb-6">
              We believe in the power of prayer. Share your prayer requests with us, and our dedicated prayer team will intercede on your behalf. Whether you&apos;re facing challenges, seeking guidance, or simply need spiritual support, we&apos;re here to pray with you.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start text-sm text-white/60">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                <span>Confidential & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                <span>Prayed Over Weekly</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
