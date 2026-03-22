"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

export function NewsletterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".newsletter-content",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-16 lg:py-20 bg-[var(--bg-card)] border-t border-[var(--border)]"
    >
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="newsletter-content opacity-0">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-[var(--accent)]/10 flex items-center justify-center">
            <Mail size={22} className="text-[var(--accent)]" />
          </div>

          <h2 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl font-bold text-[var(--text)] mb-3">
            Stay Connected
          </h2>
          <p className="text-[var(--text-muted)] text-base mb-8 max-w-md mx-auto">
            Get weekly devotionals, event updates, and church news delivered to
            your inbox.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-2 text-[var(--accent)] font-medium">
              <CheckCircle size={20} />
              <span>Thank you! Check your inbox to confirm.</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className={cn(
                  "flex-1 px-4 py-3 rounded-md text-base",
                  "bg-[var(--bg)] text-[var(--text)]",
                  "border border-[var(--border)]",
                  "placeholder:text-[var(--text-muted)]",
                  "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent",
                  "transition-shadow duration-200"
                )}
              />
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "px-6 py-3 rounded-md text-base font-semibold",
                  "bg-[var(--accent)] text-white",
                  "hover:opacity-90 transition-opacity duration-200",
                  "shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                )}
              >
                {loading ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}

          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}

          <p className="text-xs text-[var(--text-muted)] mt-4">
            No spam, ever. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  );
}
