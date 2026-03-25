import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Helper to generate unique IDs
const genId = () => Math.random().toString(36).substring(2, 9);

// Define sections for each core page
const homePageSections = [
  { id: genId(), type: "core-section", content: { name: "HeroSection", label: "Hero Section", description: "Main hero with slideshow and call-to-action buttons" } },
  { id: genId(), type: "core-section", content: { name: "QuickLinksSection", label: "Quick Links", description: "Quick access buttons for key pages" } },
  { id: genId(), type: "core-section", content: { name: "AboutSection", label: "About Section", description: "Brief introduction about the church" } },
  { id: genId(), type: "core-section", content: { name: "LiveStreamSection", label: "Live Stream", description: "Live streaming and upcoming service info" } },
  { id: genId(), type: "core-section", content: { name: "PresbyterySection", label: "Presbytery Section", description: "Presbyterian Church of Ghana information" } },
  { id: genId(), type: "core-section", content: { name: "MinistriesSection", label: "Ministries Preview", description: "Featured ministries showcase" } },
  { id: genId(), type: "core-section", content: { name: "ProjectsPreviewSection", label: "Projects Preview", description: "Featured church projects" } },
  { id: genId(), type: "core-section", content: { name: "PrayerFormSection", label: "Prayer Request", description: "Prayer request submission form" } },
  { id: genId(), type: "core-section", content: { name: "TestimonialsSection", label: "Testimonials", description: "Member testimonials carousel" } },
  { id: genId(), type: "core-section", content: { name: "WhatsNewSection", label: "What's New", description: "Latest news and announcements" } },
];

const aboutPageSections = [
  { id: genId(), type: "core-section", content: { name: "PageHeroWithBackground", label: "Page Hero", description: "Hero section with background image" } },
  { id: genId(), type: "core-section", content: { name: "AboutLinksGrid", label: "About Links", description: "Grid of links to about sub-pages (Our Story, Beliefs, Leadership, Vision)" } },
];

const ministriesPageSections = [
  { id: genId(), type: "core-section", content: { name: "PageHeroWithBackground", label: "Page Hero", description: "Hero section with background image" } },
  { id: genId(), type: "core-section", content: { name: "MinistriesGrid", label: "Ministries Grid", description: "Grid of all church ministries (pulled from database)" } },
];

const eventsPageSections = [
  { id: genId(), type: "core-section", content: { name: "PageHeroWithBackground", label: "Page Hero", description: "Hero section with background image" } },
  { id: genId(), type: "core-section", content: { name: "EventsList", label: "Events List", description: "List of upcoming and past events (pulled from database)" } },
];

const sermonsPageSections = [
  { id: genId(), type: "core-section", content: { name: "PageHeroWithBackground", label: "Page Hero", description: "Hero section with background image" } },
  { id: genId(), type: "core-section", content: { name: "SermonsGrid", label: "Sermons Grid", description: "Grid of sermons with filters (pulled from database)" } },
];

const blogPageSections = [
  { id: genId(), type: "core-section", content: { name: "PageHeroWithBackground", label: "Page Hero", description: "Hero section with background image" } },
  { id: genId(), type: "core-section", content: { name: "BlogGrid", label: "Blog Posts", description: "Grid of blog posts with categories (pulled from database)" } },
];

const galleryPageSections = [
  { id: genId(), type: "core-section", content: { name: "PageHeroWithBackground", label: "Page Hero", description: "Hero section with background image" } },
  { id: genId(), type: "core-section", content: { name: "GalleryGrid", label: "Photo Gallery", description: "Photo gallery with albums (pulled from database)" } },
];

const contactPageSections = [
  { id: genId(), type: "core-section", content: { name: "PageHeroWithBackground", label: "Page Hero", description: "Hero section with background image" } },
  { id: genId(), type: "core-section", content: { name: "ContactInfo", label: "Contact Information", description: "Church address, phone, email, and hours" } },
  { id: genId(), type: "core-section", content: { name: "ContactForm", label: "Contact Form", description: "Message submission form" } },
  { id: genId(), type: "core-section", content: { name: "LocationMap", label: "Location Map", description: "Google Maps embed showing church location" } },
];

const givePageSections = [
  { id: genId(), type: "core-section", content: { name: "PageHeroWithBackground", label: "Page Hero", description: "Hero section with background image" } },
  { id: genId(), type: "core-section", content: { name: "GivingOptions", label: "Giving Options", description: "Different ways to give (online, mobile money, bank)" } },
  { id: genId(), type: "core-section", content: { name: "GivingForm", label: "Online Giving", description: "Online donation form" } },
];

const devotionalsPageSections = [
  { id: genId(), type: "core-section", content: { name: "PageHeroWithBackground", label: "Page Hero", description: "Hero section with background image" } },
  { id: genId(), type: "core-section", content: { name: "DevotionalsList", label: "Devotionals List", description: "List of daily devotionals (pulled from database)" } },
];

const livePageSections = [
  { id: genId(), type: "core-section", content: { name: "LiveStreamPlayer", label: "Live Stream Player", description: "YouTube/Video live stream embed" } },
  { id: genId(), type: "core-section", content: { name: "ServiceSchedule", label: "Service Schedule", description: "Upcoming service times" } },
];

const shopPageSections = [
  { id: genId(), type: "core-section", content: { name: "PageHeroWithBackground", label: "Page Hero", description: "Hero section with background image" } },
  { id: genId(), type: "core-section", content: { name: "ProductsGrid", label: "Products Grid", description: "Grid of shop products (pulled from database)" } },
];

const genericPageSections = [
  { id: genId(), type: "core-section", content: { name: "PageHeroWithBackground", label: "Page Hero", description: "Hero section with background image" } },
  { id: genId(), type: "core-section", content: { name: "PageContent", label: "Page Content", description: "Main page content area" } },
];

const corePages = [
  { title: "Home", slug: "home", description: "Welcome to TMHT Presbyterian Church", content: homePageSections },
  { title: "About", slug: "about", description: "Learn about our church", content: aboutPageSections },
  { title: "About - Our Church", slug: "about/church", description: "Our church history and mission", content: genericPageSections },
  { title: "About - Our Beliefs", slug: "about/beliefs", description: "What we believe", content: genericPageSections },
  { title: "About - Leadership", slug: "about/leadership", description: "Our church leadership", content: genericPageSections },
  { title: "About - History", slug: "about/history", description: "Our church history", content: genericPageSections },
  { title: "Ministries", slug: "ministries", description: "Our church ministries", content: ministriesPageSections },
  { title: "Events", slug: "events", description: "Upcoming church events", content: eventsPageSections },
  { title: "Sermons", slug: "sermons", description: "Watch and listen to sermons", content: sermonsPageSections },
  { title: "Blog / News", slug: "blog", description: "Church news and articles", content: blogPageSections },
  { title: "Gallery", slug: "gallery", description: "Photo gallery", content: galleryPageSections },
  { title: "Contact", slug: "contact", description: "Get in touch with us", content: contactPageSections },
  { title: "Give", slug: "give", description: "Support our church", content: givePageSections },
  { title: "Devotionals", slug: "devotionals", description: "Daily devotionals", content: devotionalsPageSections },
  { title: "Daily Word", slug: "daily-word", description: "Daily word and inspiration", content: devotionalsPageSections },
  { title: "Announcements", slug: "announcements", description: "Church announcements", content: genericPageSections },
  { title: "Community", slug: "community", description: "Church community", content: genericPageSections },
  { title: "Community Impact", slug: "community-impact", description: "Our community impact", content: genericPageSections },
  { title: "Projects", slug: "projects", description: "Church projects", content: genericPageSections },
  { title: "Volunteers", slug: "volunteers", description: "Volunteer opportunities", content: genericPageSections },
  { title: "Live", slug: "live", description: "Live streaming", content: livePageSections },
  { title: "Shop", slug: "shop", description: "Church shop", content: shopPageSections },
  { title: "Services", slug: "services", description: "Our services", content: genericPageSections },
  { title: "Resources", slug: "resources", description: "Church resources", content: genericPageSections },
  { title: "Directory", slug: "directory", description: "Church directory", content: genericPageSections },
  { title: "Videos", slug: "videos", description: "Video content", content: genericPageSections },
  { title: "Media", slug: "media", description: "Media content", content: genericPageSections },
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
            title: page.title,
            slug: page.slug,
            description: page.description,
            content: page.content,
            published: true,
            isCore: true,
            template: "default",
          },
        });
        results.push(`Created: ${page.title}`);
      } else {
        // Update existing page with content and mark as core
        await prisma.page.update({
          where: { slug: page.slug },
          data: { 
            isCore: true,
            content: page.content,
          },
        });
        results.push(`Updated: ${page.title} (content and core flag)`);
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Seed pages error:", error);
    return NextResponse.json({ error: "Failed to seed pages" }, { status: 500 });
  }
}
