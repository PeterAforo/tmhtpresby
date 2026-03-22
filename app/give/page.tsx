import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { GivingForm } from "@/components/giving/GivingForm";
import { Shield, RefreshCw, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Give",
  description:
    "Support the mission of The Most Holy Trinity Presbyterian Church through online giving.",
};

export default function GivePage() {
  return (
    <>
      <PageHero
        overline="Support the Mission"
        title="Give Online"
        subtitle="Every gift makes a difference. Your generosity fuels the work of the Gospel in Accra and beyond."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Interactive giving form */}
            <div className="lg:col-span-3">
              <GivingForm />
            </div>

            {/* Sidebar info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                <div className="flex items-center gap-3 mb-3">
                  <Shield size={20} className="text-[var(--accent)]" />
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    Secure Giving
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Your financial information is encrypted and processed securely
                  through Stripe. We never store your card details.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                <div className="flex items-center gap-3 mb-3">
                  <RefreshCw size={20} className="text-[var(--accent)]" />
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    Recurring Giving
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Set up automatic monthly donations to make consistent impact.
                  You can modify or cancel anytime from your donor portal.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
                <div className="flex items-center gap-3 mb-3">
                  <CreditCard size={20} className="text-[var(--accent)]" />
                  <h3 className="text-sm font-semibold text-[var(--text)]">
                    Payment Methods
                  </h3>
                </div>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  We accept Visa, Mastercard, Mobile Money (MTN, Vodafone,
                  AirtelTigo), and bank transfers.
                </p>
              </div>

              {/* Scripture */}
              <div className="p-5 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent)]/20 text-center">
                <p className="font-[family-name:var(--font-heading)] text-sm italic text-[var(--text)] leading-relaxed">
                  &ldquo;Each of you should give what you have decided in your
                  heart to give, not reluctantly or under compulsion, for God
                  loves a cheerful giver.&rdquo;
                </p>
                <p className="mt-2 text-xs font-semibold text-[var(--accent)]">
                  2 Corinthians 9:7
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
