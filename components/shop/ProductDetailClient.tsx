"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Users,
  Tag,
  Package,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Share2,
  Check,
  Facebook,
  Twitter,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImage {
  url: string;
  alt: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  sku: string | null;
  images: ProductImage[];
  categoryName: string | null;
  ministryGroup: string | null;
  ministryGroupLabel: string | null;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  imageUrl: string;
  ministryGroupLabel: string | null;
}

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: RelatedProduct[];
}

function formatPrice(pesewas: number): string {
  return `GH₵ ${(pesewas / 100).toFixed(2)}`;
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const productUrl = typeof window !== "undefined" ? window.location.href : "";
  const isOutOfStock = product.stock === 0;
  const discount = product.compareAtPrice && product.compareAtPrice > product.price
    ? Math.round((1 - product.price / product.compareAtPrice) * 100)
    : null;

  const handleQuantityChange = (delta: number) => {
    const newQty = quantity + delta;
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = async () => {
    if (isOutOfStock || isAddingToCart) return;

    setIsAddingToCart(true);
    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, quantity }),
      });

      if (res.ok) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 3000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Error copying link:", error);
    }
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, "_blank");
  };

  const shareOnTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(product.name)}`, "_blank");
  };

  return (
    <>
      <section className="py-8 lg:py-12 bg-[var(--bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)]">
                <Image
                  src={product.images[selectedImage]?.url || "/img/pictures/2/001.jpg"}
                  alt={product.images[selectedImage]?.alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {discount && (
                  <div className="absolute top-4 left-4 bg-rose-500 text-white px-3 py-1.5 rounded-full text-sm font-bold">
                    {discount}% OFF
                  </div>
                )}
                {isOutOfStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-white text-gray-900 px-4 py-2 rounded-full font-medium">
                      Out of Stock
                    </span>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={cn(
                        "relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all",
                        selectedImage === index
                          ? "border-[var(--accent)]"
                          : "border-transparent hover:border-[var(--border)]"
                      )}
                    >
                      <Image
                        src={img.url}
                        alt={img.alt || `${product.name} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Ministry Badge */}
              {product.ministryGroupLabel && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium">
                  <Users size={14} />
                  Sold by {product.ministryGroupLabel}
                </div>
              )}

              <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold text-[var(--text)]">
                {product.name}
              </h1>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[var(--text)]">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-xl text-[var(--text-muted)] line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 text-sm text-[var(--text-muted)]">
                {product.categoryName && (
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} />
                    {product.categoryName}
                  </span>
                )}
                {product.sku && (
                  <span className="flex items-center gap-1.5">
                    <Package size={14} />
                    SKU: {product.sku}
                  </span>
                )}
                <span className={cn(
                  "flex items-center gap-1.5",
                  product.stock > 0 ? "text-green-600" : "text-rose-500"
                )}>
                  {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-sm max-w-none text-[var(--text-muted)]">
                  <p>{product.description}</p>
                </div>
              )}

              {/* Quantity & Add to Cart */}
              <div className="pt-6 border-t border-[var(--border)] space-y-4">
                {!isOutOfStock && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-[var(--text)]">Quantity:</span>
                    <div className="flex items-center border border-[var(--border)] rounded-lg">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="w-12 text-center font-medium text-[var(--text)]">
                        {quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stock}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] disabled:opacity-50"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isOutOfStock || isAddingToCart}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all",
                      isOutOfStock
                        ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                        : addedToCart
                          ? "bg-green-500 text-white"
                          : "bg-[var(--accent)] text-white hover:opacity-90"
                    )}
                  >
                    {addedToCart ? (
                      <>
                        <Check size={20} />
                        Added to Cart
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} />
                        {isOutOfStock ? "Out of Stock" : "Add to Cart"}
                      </>
                    )}
                  </button>

                  {/* Share Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-3 rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--accent)] transition-colors"
                    >
                      <Share2 size={20} />
                    </button>

                    {showShareMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="p-2">
                          <button
                            onClick={shareOnFacebook}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                          >
                            <Facebook size={16} className="text-blue-600" />
                            Facebook
                          </button>
                          <button
                            onClick={shareOnTwitter}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                          >
                            <Twitter size={16} className="text-sky-500" />
                            Twitter
                          </button>
                          <button
                            onClick={handleCopyLink}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--text)] hover:bg-[var(--bg)] transition-colors"
                          >
                            {copied ? (
                              <>
                                <Check size={16} className="text-green-500" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Link2 size={16} />
                                Copy Link
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Click outside to close share menu */}
      {showShareMenu && (
        <div className="fixed inset-0 z-40" onClick={() => setShowShareMenu(false)} />
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-[var(--bg-card)] border-t border-[var(--border)]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-[var(--text)] mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct.id}
                  href={`/shop/${relatedProduct.slug}`}
                  className="group flex flex-col rounded-xl overflow-hidden bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--accent)]/50 transition-all duration-300 hover:shadow-lg"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={relatedProduct.imageUrl}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    {relatedProduct.ministryGroupLabel && (
                      <p className="text-xs text-[var(--accent)] font-medium mb-1">
                        {relatedProduct.ministryGroupLabel}
                      </p>
                    )}
                    <h3 className="font-medium text-[var(--text)] line-clamp-2 group-hover:text-[var(--accent)] transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-[var(--text)]">
                        {formatPrice(relatedProduct.price)}
                      </span>
                      {relatedProduct.compareAtPrice && relatedProduct.compareAtPrice > relatedProduct.price && (
                        <span className="text-xs text-[var(--text-muted)] line-through">
                          {formatPrice(relatedProduct.compareAtPrice)}
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
    </>
  );
}
