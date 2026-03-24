import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

const corePages = [
  { title: "Home", slug: "home", description: "Welcome to TMHT Presbyterian Church" },
  { title: "About", slug: "about", description: "Learn about our church" },
  { title: "About - Our Church", slug: "about/church", description: "Our church history and mission" },
  { title: "About - Our Beliefs", slug: "about/beliefs", description: "What we believe" },
  { title: "About - Leadership", slug: "about/leadership", description: "Our church leadership" },
  { title: "About - History", slug: "about/history", description: "Our church history" },
  { title: "Ministries", slug: "ministries", description: "Our church ministries" },
  { title: "Events", slug: "events", description: "Upcoming church events" },
  { title: "Sermons", slug: "sermons", description: "Watch and listen to sermons" },
  { title: "Blog / News", slug: "blog", description: "Church news and articles" },
  { title: "Gallery", slug: "gallery", description: "Photo gallery" },
  { title: "Contact", slug: "contact", description: "Get in touch with us" },
  { title: "Give", slug: "give", description: "Support our church" },
  { title: "Devotionals", slug: "devotionals", description: "Daily devotionals" },
  { title: "Daily Word", slug: "daily-word", description: "Daily word and inspiration" },
  { title: "Announcements", slug: "announcements", description: "Church announcements" },
  { title: "Community", slug: "community", description: "Church community" },
  { title: "Community Impact", slug: "community-impact", description: "Our community impact" },
  { title: "Projects", slug: "projects", description: "Church projects" },
  { title: "Volunteers", slug: "volunteers", description: "Volunteer opportunities" },
  { title: "Live", slug: "live", description: "Live streaming" },
  { title: "Shop", slug: "shop", description: "Church shop" },
  { title: "Services", slug: "services", description: "Our services" },
  { title: "Resources", slug: "resources", description: "Church resources" },
  { title: "Directory", slug: "directory", description: "Church directory" },
  { title: "Videos", slug: "videos", description: "Video content" },
  { title: "Media", slug: "media", description: "Media content" },
];

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== "super_admin") {
      return NextResponse.json({ error: "Forbidden - Super admin only" }, { status: 403 });
    }

    const results: string[] = [];

    for (const page of corePages) {
      const existing = await prisma.page.findUnique({
        where: { slug: page.slug },
      });

      if (!existing) {
        await prisma.page.create({
          data: {
            ...page,
            published: true,
            isCore: true,
            template: "default",
          },
        });
        results.push(`Created: ${page.title}`);
      } else if (!existing.isCore) {
        await prisma.page.update({
          where: { slug: page.slug },
          data: { isCore: true },
        });
        results.push(`Updated: ${page.title} (marked as core)`);
      } else {
        results.push(`Skipped: ${page.title} (already exists)`);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Seed pages error:", error);
    return NextResponse.json({ error: "Failed to seed pages" }, { status: 500 });
  }
}
