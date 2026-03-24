import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const ADMIN_ROLES = ["super_admin", "pastor", "ministry_leader"];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (!role || !ADMIN_ROLES.includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      name,
      description,
      price,
      compareAtPrice,
      sku,
      stock,
      categoryId,
      ministryGroup,
      isFeatured,
      isActive,
      images,
    } = body;

    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price are required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let slug = generateSlug(name);
    const existingProduct = await prisma.product.findUnique({ where: { slug } });
    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description || null,
        price,
        compareAtPrice: compareAtPrice || null,
        sku: sku || null,
        stock: stock || 0,
        categoryId: categoryId || null,
        ministryGroup: ministryGroup || null,
        isFeatured: isFeatured || false,
        isActive: isActive !== false,
      },
    });

    // Create product images if provided
    if (images && images.length > 0) {
      await prisma.productImage.createMany({
        data: images.map((url: string, index: number) => ({
          url,
          productId: product.id,
          order: index,
        })),
      });
    }

    // Fetch the complete product with images
    const completeProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: true,
        images: {
          orderBy: { order: "asc" },
        },
      },
    });

    return NextResponse.json(completeProduct, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
