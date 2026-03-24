"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Filter,
  Grid3X3,
  List,
  Tag,
  Users,
  ChevronDown,
  Star,
  ShoppingBag,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  imageUrl: string;
  categoryId: string | null;
  categoryName: string | null;
  ministryGroup: string | null;
  ministryGroupLabel: string | null;
  isFeatured: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface MinistryGroup {
  value: string;
  label: string;
}

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string;
  ministryGroup: string | null;
  ministryGroupLabel: string | null;
}

interface ShopClientProps {
  products: Product[];
  categories: Category[];
  ministryGroups: MinistryGroup[];
  featuredProducts: FeaturedProduct[];
}

function formatPrice(pesewas: number): string {
  return `GH₵ ${(pesewas / 100).toFixed(2)}`;
}

export function ShopClient({
  products,
  categories,
  ministryGroups,
  featuredProducts,
}: ShopClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMinistry, setSelectedMinistry] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"newest" | "price-low" | "price-high">("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Filter products
  const filteredProducts = products.filter((product) => {
    if (selectedCategory && product.categoryId !== selectedCategory) return false;
    if (selectedMinistry && product.ministryGroup !== selectedMinistry) return false;
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      default:
        return 0; // Keep original order (newest first from DB)
    }
  });

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedMinistry(null);
  };

  const hasActiveFilters = selectedCategory || selectedMinistry;

  return (
    <>
      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-6">
              <Star className="text-amber-500" size={20} />
              <h2 className="text-lg font-semibold text-[var(--text)]">Featured Products</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="group relative rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {product.compareAtPrice && product.compareAtPrice > product.price && (
                      <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                        {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-[var(--text)] text-sm line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
                      {product.name}
                    </h3>
                    {product.ministryGroupLabel && (
                      <p className="text-xs text-[var(--accent)] mt-0.5">{product.ministryGroupLabel}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-[var(--text)]">{formatPrice(product.price)}</span>
                      {product.compareAtPrice && product.compareAtPrice > product.price && (
                        <span className="text-xs text-[var(--text-muted)] line-through">
                          {formatPrice(product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Filter Bar */}
      <section className="bg-[var(--bg)] border-y border-[var(--border)] sticky top-16 md:top-20 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] text-sm font-medium text-[var(--text)] hover:border-[var(--accent)] transition-colors"
              >
                <Filter size={16} />
                Filters
                {hasActiveFilters && (
                  <span className="w-2 h-2 rounded-full bg-[var(--accent)]" />
                )}
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--text-muted)]">
                {sortedProducts.length} product{sortedProducts.length !== 1 ? "s" : ""}
              </span>
              <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "grid"
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  )}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 transition-colors",
                    viewMode === "list"
                      ? "bg-[var(--accent)] text-white"
                      : "text-[var(--text-muted)] hover:text-[var(--text)]"
                  )}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-[var(--border)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory || ""}
                      onChange={(e) => setSelectedCategory(e.target.value || null)}
                      className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Ministry Filter */}
                  {ministryGroups.length > 0 && (
                    <div>
                      <label className="block text-xs font-medium text-[var(--text-muted)] mb-2">
                        Sold By Ministry
                      </label>
                      <select
                        value={selectedMinistry || ""}
                        onChange={(e) => setSelectedMinistry(e.target.value || null)}
                        className="w-full px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50"
                      >
                        <option value="">All Ministries</option>
                        {ministryGroups.map((mg) => (
                          <option key={mg.value} value={mg.value}>
                            {mg.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <div className="flex items-end">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-2 text-sm text-[var(--accent)] hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Products Grid/List */}
      <section className="py-12 bg-[var(--bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {sortedProducts.length > 0 ? (
            <AnimatePresence mode="wait">
              {viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
                >
                  {sortedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        href={`/shop/${product.slug}`}
                        className="group flex flex-col rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-lg h-full"
                      >
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <div className="absolute top-2 left-2 bg-rose-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              Sale
                            </div>
                          )}
                          {product.stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <span className="bg-white text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                                Out of Stock
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-4 flex flex-col flex-1">
                          {product.ministryGroupLabel && (
                            <p className="text-xs text-[var(--accent)] font-medium mb-1 flex items-center gap-1">
                              <Users size={12} />
                              {product.ministryGroupLabel}
                            </p>
                          )}
                          <h3 className="font-semibold text-[var(--text)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors flex-1">
                            {product.name}
                          </h3>
                          {product.categoryName && (
                            <p className="text-xs text-[var(--text-muted)] mt-1">{product.categoryName}</p>
                          )}
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-lg font-bold text-[var(--text)]">
                              {formatPrice(product.price)}
                            </span>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <span className="text-sm text-[var(--text-muted)] line-through">
                                {formatPrice(product.compareAtPrice)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {sortedProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Link
                        href={`/shop/${product.slug}`}
                        className="group flex gap-4 rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-lg p-4"
                      >
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={product.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          {product.ministryGroupLabel && (
                            <p className="text-xs text-[var(--accent)] font-medium mb-1 flex items-center gap-1">
                              <Users size={12} />
                              {product.ministryGroupLabel}
                            </p>
                          )}
                          <h3 className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-3">
                            <span className="text-lg font-bold text-[var(--text)]">
                              {formatPrice(product.price)}
                            </span>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                              <span className="text-sm text-[var(--text-muted)] line-through">
                                {formatPrice(product.compareAtPrice)}
                              </span>
                            )}
                            {product.stock === 0 && (
                              <span className="text-xs text-rose-500 font-medium">Out of Stock</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
              <h3 className="text-lg font-semibold text-[var(--text)] mb-2">No products found</h3>
              <p className="text-[var(--text-muted)] mb-4">
                {hasActiveFilters
                  ? "Try adjusting your filters to find what you're looking for."
                  : "Check back soon for new products!"}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="text-[var(--accent)] font-medium hover:underline"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
