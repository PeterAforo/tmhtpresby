import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { ProductDetailClient } from "@/components/shop/ProductDetailClient";
import { ArrowLeft, Users, Tag, Package } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description || `Buy ${product.name} from The Most Holy Trinity Presbyterian Church shop.`,
  };
}

async function getRelatedProducts(currentId: string, categoryId: string | null, ministryGroup: string | null) {
  return await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: currentId },
      OR: [
        { categoryId: categoryId || undefined },
        { ministryGroup: ministryGroup || undefined },
      ],
    },
    include: {
      images: { orderBy: { order: "asc" }, take: 1 },
    },
    take: 4,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { order: "asc" } },
      category: true,
    },
  });

  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId, product.ministryGroup);

  return (
    <>
      <ProductDetailClient
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          stock: product.stock,
          sku: product.sku,
          images: product.images.length > 0 
            ? product.images.map(img => ({ url: img.url, alt: img.alt }))
            : [{ url: "/img/pictures/2/001.jpg", alt: product.name }],
          categoryName: product.category?.name || null,
          ministryGroup: product.ministryGroup,
          ministryGroupLabel: product.ministryGroup ? ministryGroupLabels[product.ministryGroup] || product.ministryGroup : null,
        }}
        relatedProducts={relatedProducts.map(p => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          compareAtPrice: p.compareAtPrice,
          imageUrl: p.images[0]?.url || "/img/pictures/2/001.jpg",
          ministryGroupLabel: p.ministryGroup ? ministryGroupLabels[p.ministryGroup] || p.ministryGroup : null,
        }))}
      />
    </>
  );
}
