import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { ShoppingBag } from "lucide-react";

export const metadata = {
  title: "Shop",
  description: "Browse church merchandise and resources.",
};

export default function ShopPage() {
  return (
    <>
      <PageHeroWithBackground
        pageSlug="shop"
        overline="Store"
        title="Church Shop"
        subtitle="Browse our merchandise and resources"
      />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-[var(--primary)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-[var(--primary)]" />
            </div>
            <h2 className="text-2xl font-semibold text-[var(--text)] mb-4">
              Coming Soon
            </h2>
            <p className="text-[var(--text-muted)] mb-8">
              Our online shop is currently under development. Soon you'll be able to purchase 
              church merchandise, books, devotionals, and other resources right here.
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              In the meantime, please visit our church office for any merchandise inquiries.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
