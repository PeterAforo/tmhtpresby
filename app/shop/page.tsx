import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { ShoppingBag, Tag, Users, Filter, Grid3X3, List } from "lucide-react";
import { ShopClient } from "@/components/shop/ShopClient";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse church merchandise, books, and resources from The Most Holy Trinity Presbyterian Church.",
};

const ministryGroupLabels: Record<string, string> = {
  aged: "The Aged Ministry",
  men: "Men's Ministry",
  women: "Women's Ministry",
  young_adult: "Young Adults Ministry",
  ypg: "Young People's Guild",
  junior: "Junior Ministry",
  choir: "Choir Ministry",
  "singing-band": "Singing Band",
  "trinity-praise": "Trinity Praise Ministry",
};

async function getProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
      },
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

async function getCategories() {
  try {
    return await prisma.productCategory.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      include: {
        images: { orderBy: { order: "asc" }, take: 1 },
        category: true,
      },
      take: 4,
    });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

export default async function ShopPage() {
  const [products, categories, featuredProducts] = await Promise.all([
    getProducts(),
    getCategories(),
    getFeaturedProducts(),
  ]);

  // Get unique ministry groups from products
  const ministryGroups = [...new Set(products.filter(p => p.ministryGroup).map(p => p.ministryGroup!))];

  return (
    <>
      <PageHeroWithBackground
        pageSlug="shop"
        overline="Church Store"
        title="Shop"
        subtitle="Support our ministries by purchasing merchandise, books, and resources"
      />

      <ShopClient
        products={products.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          description: p.description,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          stock: p.stock,
          imageUrl: p.images[0]?.url || "/img/pictures/2/001.jpg",
          categoryId: p.categoryId,
          categoryName: p.category?.name || null,
          ministryGroup: p.ministryGroup,
          ministryGroupLabel: p.ministryGroup ? ministryGroupLabels[p.ministryGroup] || p.ministryGroup : null,
          isFeatured: p.isFeatured,
        }))}
        categories={categories.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
        }))}
        ministryGroups={ministryGroups.map(mg => ({
          value: mg,
          label: ministryGroupLabels[mg] || mg,
        }))}
        featuredProducts={featuredProducts.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          imageUrl: p.images[0]?.url || "/img/pictures/2/001.jpg",
          ministryGroup: p.ministryGroup,
          ministryGroupLabel: p.ministryGroup ? ministryGroupLabels[p.ministryGroup] || p.ministryGroup : null,
        }))}
      />
    </>
  );
}
