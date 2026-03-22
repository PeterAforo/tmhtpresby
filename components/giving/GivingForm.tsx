"use client";

import { useState } from "react";
import { Loader2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { GIVING_QUICK_AMOUNTS } from "@/lib/constants";

const FUNDS = [
  { value: "general", label: "General Fund" },
  { value: "building", label: "Building Fund" },
  { value: "missions", label: "Missions" },
  { value: "benevolence", label: "Benevolence" },
  { value: "youth", label: "Youth Ministry" },
  { value: "media", label: "Media Ministry" },
];

export function GivingForm() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [fund, setFund] = useState("general");
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const amount = selectedAmount || parseFloat(customAmount) || 0;

  const handleQuickAmount = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmount("");
  };

  const handleCustomAmount = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < 1) {
      setError("Please enter an amount of at least GHS 1.");
      return;
    }
    if (!email) {
      setError("Email is required for your receipt.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/giving/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          fund,
          frequency,
          email,
          firstName,
          lastName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        return;
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = cn(
    "w-full px-4 py-3 rounded-lg text-sm",
    "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]",
    "placeholder:text-[var(--text-muted)]",
    "focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent"
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 sm:p-8 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]"
    >
      <h2 className="font-[family-name:var(--font-heading)] text-xl sm:text-2xl font-bold text-[var(--text)] mb-6">
        Make a Donation
      </h2>

      {/* Quick amounts */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--text)] mb-2">
          Select Amount (GHS)
        </label>
        <div className="grid grid-cols-3 gap-3">
          {GIVING_QUICK_AMOUNTS.map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => handleQuickAmount(amt)}
              className={cn(
                "py-3 rounded-lg text-base font-semibold text-center transition-all duration-200",
                selectedAmount === amt
                  ? "bg-[var(--accent)] text-white border border-[var(--accent)]"
                  : "border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/5"
              )}
            >
              GHS {amt}
            </button>
          ))}
        </div>
      </div>

      {/* Custom amount */}
      <div className="mb-6">
        <label htmlFor="customAmount" className="block text-sm font-medium text-[var(--text)] mb-1.5">
          Or Enter Custom Amount
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[var(--text-muted)] font-medium">
            GHS
          </span>
          <input
            id="customAmount"
            type="number"
            min="1"
            step="0.01"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            placeholder="0.00"
            className={cn(inputClasses, "pl-14")}
          />
        </div>
      </div>

      {/* Fund */}
      <div className="mb-6">
        <label htmlFor="fund" className="block text-sm font-medium text-[var(--text)] mb-1.5">
          Designate to Fund
        </label>
        <select
          id="fund"
          value={fund}
          onChange={(e) => setFund(e.target.value)}
          className={inputClasses}
        >
          {FUNDS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Frequency */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-[var(--text)] mb-2">
          Frequency
        </label>
        <div className="flex gap-3">
          {(["one-time", "monthly"] as const).map((freq) => (
            <button
              key={freq}
              type="button"
              onClick={() => setFrequency(freq)}
              className={cn(
                "flex-1 py-3 rounded-lg text-sm font-semibold text-center transition-all duration-200",
                frequency === freq
                  ? "bg-[var(--accent)] text-white"
                  : "border border-[var(--border)] text-[var(--text)] hover:border-[var(--accent)]"
              )}
            >
              {freq === "one-time" ? "One-time" : "Monthly"}
            </button>
          ))}
        </div>
      </div>

      {/* Donor info */}
      <div className="mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-[var(--text)] mb-1.5">
              First Name
            </label>
            <input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-[var(--text)] mb-1.5">
              Last Name
            </label>
            <input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className={inputClasses}
            />
          </div>
        </div>
        <div>
          <label htmlFor="donorEmail" className="block text-sm font-medium text-[var(--text)] mb-1.5">
            Email <span className="text-[var(--cta)]">*</span>
          </label>
          <input
            id="donorEmail"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className={inputClasses}
          />
          <p className="text-xs text-[var(--text-muted)] mt-1">
            Required for your donation receipt.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm text-red-500 mb-4 text-center">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading || amount < 1}
        className={cn(
          "w-full py-4 rounded-lg text-base font-semibold",
          "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20",
          "hover:opacity-90 transition-all duration-200",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "inline-flex items-center justify-center gap-2"
        )}
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Heart size={18} />
            {amount > 0
              ? `Give GHS ${amount.toFixed(2)} ${frequency === "monthly" ? "/ month" : ""}`
              : "Continue to Payment"}
          </>
        )}
      </button>

      <p className="mt-4 text-xs text-[var(--text-muted)] text-center">
        Powered by Stripe. All transactions are secure and encrypted.
      </p>
    </form>
  );
}
