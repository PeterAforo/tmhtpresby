"use client";

import { useState } from "react";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import {
  Heart,
  CreditCard,
  Repeat,
  ChevronRight,
  Building2,
  Smartphone,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FUNDS = [
  { id: "tithe", label: "Tithe", description: "Support the church's general operations" },
  { id: "offering", label: "Offering", description: "Weekly worship offering" },
  { id: "missions", label: "Missions", description: "Support missionary work" },
  { id: "building", label: "Building Fund", description: "Church building projects" },
  { id: "welfare", label: "Welfare", description: "Help those in need" },
  { id: "thanksgiving", label: "Thanksgiving", description: "Special thanksgiving offering" },
];

const PRESET_AMOUNTS = [50, 100, 200, 500, 1000];

export default function GivingPage() {
  const [step, setStep] = useState(1);
  const [fund, setFund] = useState("tithe");
  const [amount, setAmount] = useState<number | "">("");
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAmountSelect = (value: number) => {
    setAmount(value);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setAmount("");
  };

  const finalAmount = amount || parseFloat(customAmount) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (finalAmount < 1) {
      setError("Please enter a valid amount");
      return;
    }
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/giving/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          fund,
          frequency,
          email,
          firstName,
          lastName,
        }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Failed to process. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeroWithBackground
        pageSlug="giving"
        overline="Support Our Mission"
        title="Give Online"
        subtitle="Your generosity helps us serve our community and spread the Gospel. Every gift makes a difference."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-4 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors",
                    step >= s
                      ? "bg-[var(--accent)] text-white"
                      : "bg-[var(--border)] text-[var(--text-muted)]"
                  )}
                >
                  {step > s ? <CheckCircle2 size={16} /> : s}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium hidden sm:block",
                    step >= s ? "text-[var(--text)]" : "text-[var(--text-muted)]"
                  )}
                >
                  {s === 1 ? "Select Fund" : s === 2 ? "Amount" : "Details"}
                </span>
                {s < 3 && (
                  <ChevronRight
                    size={16}
                    className="text-[var(--text-muted)] hidden sm:block"
                  />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Select Fund */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[var(--text)]">
                    Where would you like to give?
                  </h2>
                  <p className="text-[var(--text-muted)] mt-2">
                    Select a fund to support
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {FUNDS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFund(f.id)}
                      className={cn(
                        "p-5 rounded-xl border-2 text-left transition-all",
                        fund === f.id
                          ? "border-[var(--accent)] bg-[var(--accent)]/5"
                          : "border-[var(--border)] hover:border-[var(--accent)]/40"
                      )}
                    >
                      <h3 className="font-semibold text-[var(--text)]">{f.label}</h3>
                      <p className="text-sm text-[var(--text-muted)] mt-1">
                        {f.description}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition-opacity"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Amount */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[var(--text)]">
                    How much would you like to give?
                  </h2>
                  <p className="text-[var(--text-muted)] mt-2">
                    Select an amount or enter a custom amount
                  </p>
                </div>

                {/* Frequency Toggle */}
                <div className="flex justify-center mb-6">
                  <div className="inline-flex rounded-lg border border-[var(--border)] p-1">
                    <button
                      type="button"
                      onClick={() => setFrequency("one-time")}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        frequency === "one-time"
                          ? "bg-[var(--accent)] text-white"
                          : "text-[var(--text-muted)] hover:text-[var(--text)]"
                      )}
                    >
                      <CreditCard size={16} className="inline mr-2" />
                      One-time
                    </button>
                    <button
                      type="button"
                      onClick={() => setFrequency("monthly")}
                      className={cn(
                        "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                        frequency === "monthly"
                          ? "bg-[var(--accent)] text-white"
                          : "text-[var(--text-muted)] hover:text-[var(--text)]"
                      )}
                    >
                      <Repeat size={16} className="inline mr-2" />
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Preset Amounts */}
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {PRESET_AMOUNTS.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAmountSelect(preset)}
                      className={cn(
                        "py-4 rounded-xl border-2 font-semibold transition-all",
                        amount === preset
                          ? "border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--accent)]"
                          : "border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]/40"
                      )}
                    >
                      GH₵{preset}
                    </button>
                  ))}
                </div>

                {/* Custom Amount */}
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] font-semibold">
                    GH₵
                  </span>
                  <input
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    className="w-full pl-14 pr-4 py-4 rounded-xl border-2 border-[var(--border)] bg-[var(--bg)] text-[var(--text)] text-lg font-semibold focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-6 py-3 rounded-lg border border-[var(--border)] text-[var(--text)] font-semibold hover:bg-[var(--bg-card)] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={finalAmount < 1}
                    className="px-6 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Details */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-[var(--text)]">
                    Your Information
                  </h2>
                  <p className="text-[var(--text-muted)] mt-2">
                    We&apos;ll send your receipt to this email
                  </p>
                </div>

                {/* Summary */}
                <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[var(--text-muted)]">Fund</span>
                    <span className="font-semibold text-[var(--text)]">
                      {FUNDS.find((f) => f.id === fund)?.label}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[var(--text-muted)]">Frequency</span>
                    <span className="font-semibold text-[var(--text)] capitalize">
                      {frequency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-[var(--border)]">
                    <span className="text-[var(--text-muted)]">Amount</span>
                    <span className="text-2xl font-bold text-[var(--accent)]">
                      GH₵{finalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                      First Name
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--text)] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30"
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-lg bg-red-500/10 text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="px-6 py-3 rounded-lg border border-[var(--border)] text-[var(--text)] font-semibold hover:bg-[var(--bg-card)] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-8 py-3 rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity inline-flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Heart size={18} />
                        Give GH₵{finalAmount.toLocaleString()}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </form>

          {/* Alternative Payment Methods */}
          <div className="mt-16 pt-12 border-t border-[var(--border)]">
            <h3 className="text-lg font-semibold text-[var(--text)] text-center mb-6">
              Other Ways to Give
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)]">
                    <Smartphone size={20} />
                  </div>
                  <h4 className="font-semibold text-[var(--text)]">Mobile Money</h4>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-3">
                  Send to our MTN MoMo number
                </p>
                <p className="font-mono text-lg font-semibold text-[var(--text)]">
                  024 XXX XXXX
                </p>
              </div>

              <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)]">
                    <Building2 size={20} />
                  </div>
                  <h4 className="font-semibold text-[var(--text)]">Bank Transfer</h4>
                </div>
                <p className="text-sm text-[var(--text-muted)] mb-2">
                  The Most Holy Trinity Presbyterian Church
                </p>
                <p className="text-sm text-[var(--text-muted)]">
                  GCB Bank • Acc: XXXX-XXXX-XXXX
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
