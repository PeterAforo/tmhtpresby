import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export const metadata = {
  title: "Checkout",
  description: "Complete your purchase.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="checkout"
        overline="Store"
        title="Checkout"
        subtitle="Complete your purchase"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-10 h-10 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">
              Your Cart is Empty
            </h2>
            <p className="text-[var(--text-muted)] mb-8">
              It looks like you haven't added anything to your cart yet. 
              Visit our shop to browse available items.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 bg-[var(--primary)] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
