import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SEED_SECRET = "tmht-seed-products-2026";

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    if (secret !== SEED_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create categories
    const categories = await Promise.all([
      prisma.productCategory.upsert({
        where: { slug: "books" },
        update: {},
        create: {
          name: "Books & Devotionals",
          slug: "books",
          description: "Christian books, devotionals, and study materials",
        },
      }),
      prisma.productCategory.upsert({
        where: { slug: "apparel" },
        update: {},
        create: {
          name: "Apparel",
          slug: "apparel",
          description: "Church branded clothing and accessories",
        },
      }),
      prisma.productCategory.upsert({
        where: { slug: "accessories" },
        update: {},
        create: {
          name: "Accessories",
          slug: "accessories",
          description: "Bags, mugs, and other accessories",
        },
      }),
      prisma.productCategory.upsert({
        where: { slug: "music" },
        update: {},
        create: {
          name: "Music & Media",
          slug: "music",
          description: "CDs, DVDs, and digital content",
        },
      }),
    ]);

    const [booksCategory, apparelCategory, accessoriesCategory, musicCategory] = categories;

    // Create products
    const products = [
      {
        name: "TMHT Church T-Shirt (White)",
        slug: "tmht-church-tshirt-white",
        description: "Premium cotton t-shirt with The Most Holy Trinity Presbyterian Church logo. Available in various sizes.",
        price: 8000, // GH₵ 80.00
        compareAtPrice: 10000,
        stock: 50,
        sku: "APP-TSH-WHT-001",
        categoryId: apparelCategory.id,
        ministryGroup: "ypg",
        isFeatured: true,
        tags: ["clothing", "t-shirt", "white"],
      },
      {
        name: "Daily Devotional 2026",
        slug: "daily-devotional-2026",
        description: "365 days of spiritual nourishment. Start each day with scripture, reflection, and prayer.",
        price: 5000, // GH₵ 50.00
        stock: 100,
        sku: "BK-DEV-2026",
        categoryId: booksCategory.id,
        ministryGroup: "women",
        isFeatured: true,
        tags: ["devotional", "book", "daily"],
      },
      {
        name: "Church Choir Album - Songs of Praise",
        slug: "choir-album-songs-of-praise",
        description: "A collection of 12 beautiful hymns and worship songs performed by our church choir.",
        price: 3500, // GH₵ 35.00
        stock: 75,
        sku: "MUS-CD-001",
        categoryId: musicCategory.id,
        ministryGroup: "choir",
        isFeatured: true,
        tags: ["music", "cd", "choir", "worship"],
      },
      {
        name: "TMHT Coffee Mug",
        slug: "tmht-coffee-mug",
        description: "Start your morning with inspiration. Ceramic mug with church logo and scripture verse.",
        price: 2500, // GH₵ 25.00
        stock: 40,
        sku: "ACC-MUG-001",
        categoryId: accessoriesCategory.id,
        isFeatured: true,
        tags: ["mug", "coffee", "gift"],
      },
      {
        name: "Youth Ministry Hoodie",
        slug: "youth-ministry-hoodie",
        description: "Comfortable hoodie for the young people. Features YPG logo on front and scripture on back.",
        price: 15000, // GH₵ 150.00
        compareAtPrice: 18000,
        stock: 30,
        sku: "APP-HOD-YPG-001",
        categoryId: apparelCategory.id,
        ministryGroup: "ypg",
        tags: ["clothing", "hoodie", "youth"],
      },
      {
        name: "Bible Study Guide - Romans",
        slug: "bible-study-guide-romans",
        description: "An in-depth study guide for the Book of Romans. Perfect for small groups and personal study.",
        price: 3000, // GH₵ 30.00
        stock: 60,
        sku: "BK-STD-ROM-001",
        categoryId: booksCategory.id,
        ministryGroup: "men",
        tags: ["book", "bible-study", "romans"],
      },
      {
        name: "Church Tote Bag",
        slug: "church-tote-bag",
        description: "Eco-friendly canvas tote bag with church branding. Perfect for carrying your Bible and notes.",
        price: 4000, // GH₵ 40.00
        stock: 45,
        sku: "ACC-BAG-TOT-001",
        categoryId: accessoriesCategory.id,
        ministryGroup: "women",
        tags: ["bag", "tote", "eco-friendly"],
      },
      {
        name: "Children's Bible Stories Book",
        slug: "childrens-bible-stories",
        description: "Beautifully illustrated Bible stories for children. 50 stories from the Old and New Testament.",
        price: 4500, // GH₵ 45.00
        stock: 35,
        sku: "BK-CHD-001",
        categoryId: booksCategory.id,
        ministryGroup: "junior",
        tags: ["book", "children", "bible-stories"],
      },
      {
        name: "Worship DVD - Easter Conference 2025",
        slug: "worship-dvd-easter-2025",
        description: "Relive the powerful moments from Easter Conference 2025. Includes sermons and worship sessions.",
        price: 2000, // GH₵ 20.00
        stock: 50,
        sku: "MUS-DVD-EST-2025",
        categoryId: musicCategory.id,
        tags: ["dvd", "easter", "conference"],
      },
      {
        name: "Prayer Journal",
        slug: "prayer-journal",
        description: "Guided prayer journal with prompts, scripture references, and space for personal reflections.",
        price: 3500, // GH₵ 35.00
        stock: 80,
        sku: "BK-JRN-PRA-001",
        categoryId: booksCategory.id,
        ministryGroup: "aged",
        tags: ["journal", "prayer", "devotional"],
      },
      {
        name: "Men's Ministry Cap",
        slug: "mens-ministry-cap",
        description: "Adjustable baseball cap with Men's Ministry emblem. One size fits all.",
        price: 3000, // GH₵ 30.00
        stock: 25,
        sku: "APP-CAP-MEN-001",
        categoryId: apparelCategory.id,
        ministryGroup: "men",
        tags: ["cap", "hat", "men"],
      },
      {
        name: "Women's Ministry Scarf",
        slug: "womens-ministry-scarf",
        description: "Elegant scarf with subtle church branding. Perfect for services and special occasions.",
        price: 5500, // GH₵ 55.00
        stock: 20,
        sku: "APP-SCF-WOM-001",
        categoryId: apparelCategory.id,
        ministryGroup: "women",
        tags: ["scarf", "women", "accessory"],
      },
    ];

    const createdProducts = [];
    for (const product of products) {
      const created = await prisma.product.upsert({
        where: { slug: product.slug },
        update: {},
        create: product,
      });
      createdProducts.push(created);
    }

    // Add images to products
    const productImages = [
      { productSlug: "tmht-church-tshirt-white", url: "/img/pictures/2/001.jpg" },
      { productSlug: "daily-devotional-2026", url: "/img/pictures/2/010.jpg" },
      { productSlug: "choir-album-songs-of-praise", url: "/img/pictures/2/020.jpg" },
      { productSlug: "tmht-coffee-mug", url: "/img/pictures/2/030.jpg" },
      { productSlug: "youth-ministry-hoodie", url: "/img/pictures/2/040.jpg" },
      { productSlug: "bible-study-guide-romans", url: "/img/pictures/2/050.jpg" },
      { productSlug: "church-tote-bag", url: "/img/pictures/2/060.jpg" },
      { productSlug: "childrens-bible-stories", url: "/img/pictures/2/070.jpg" },
      { productSlug: "worship-dvd-easter-2025", url: "/img/pictures/2/080.jpg" },
      { productSlug: "prayer-journal", url: "/img/pictures/2/090.jpg" },
      { productSlug: "mens-ministry-cap", url: "/img/pictures/2/001.jpg" },
      { productSlug: "womens-ministry-scarf", url: "/img/pictures/2/010.jpg" },
    ];

    for (const img of productImages) {
      const product = await prisma.product.findUnique({ where: { slug: img.productSlug } });
      if (product) {
        const existingImage = await prisma.productImage.findFirst({
          where: { productId: product.id },
        });
        if (!existingImage) {
          await prisma.productImage.create({
            data: {
              productId: product.id,
              url: img.url,
              alt: product.name,
              order: 0,
            },
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${categories.length} categories and ${createdProducts.length} products`,
    });
  } catch (error) {
    console.error("Error seeding products:", error);
    return NextResponse.json({ error: "Failed to seed products" }, { status: 500 });
  }
}
