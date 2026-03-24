import { prisma } from "../lib/db";

const corePages = [
  {
    title: "Home",
    slug: "home",
    description: "Welcome to TMHT Presbyterian Church",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "About",
    slug: "about",
    description: "Learn about our church",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "About - Our Church",
    slug: "about/church",
    description: "Our church history and mission",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "About - Our Beliefs",
    slug: "about/beliefs",
    description: "What we believe",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "About - Leadership",
    slug: "about/leadership",
    description: "Our church leadership",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "About - History",
    slug: "about/history",
    description: "Our church history",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Ministries",
    slug: "ministries",
    description: "Our church ministries",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Events",
    slug: "events",
    description: "Upcoming church events",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Sermons",
    slug: "sermons",
    description: "Watch and listen to sermons",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Blog / News",
    slug: "blog",
    description: "Church news and articles",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Gallery",
    slug: "gallery",
    description: "Photo gallery",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Contact",
    slug: "contact",
    description: "Get in touch with us",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Give",
    slug: "give",
    description: "Support our church",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Devotionals",
    slug: "devotionals",
    description: "Daily devotionals",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Daily Word",
    slug: "daily-word",
    description: "Daily word and inspiration",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Announcements",
    slug: "announcements",
    description: "Church announcements",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Community",
    slug: "community",
    description: "Church community",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Community Impact",
    slug: "community-impact",
    description: "Our community impact",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Projects",
    slug: "projects",
    description: "Church projects",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Volunteers",
    slug: "volunteers",
    description: "Volunteer opportunities",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Live",
    slug: "live",
    description: "Live streaming",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Shop",
    slug: "shop",
    description: "Church shop",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Services",
    slug: "services",
    description: "Our services",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Resources",
    slug: "resources",
    description: "Church resources",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Directory",
    slug: "directory",
    description: "Church directory",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Videos",
    slug: "videos",
    description: "Video content",
    published: true,
    isCore: true,
    template: "default",
  },
  {
    title: "Media",
    slug: "media",
    description: "Media content",
    published: true,
    isCore: true,
    template: "default",
  },
];

async function main() {
  console.log("Seeding core pages...");

  for (const page of corePages) {
    const existing = await prisma.page.findUnique({
      where: { slug: page.slug },
    });

    if (!existing) {
      await prisma.page.create({ data: page });
      console.log(`Created: ${page.title} (/${page.slug})`);
    } else {
      // Update to mark as core if not already
      if (!existing.isCore) {
        await prisma.page.update({
          where: { slug: page.slug },
          data: { isCore: true },
        });
        console.log(`Updated: ${page.title} (marked as core)`);
      } else {
        console.log(`Skipped: ${page.title} (already exists)`);
      }
    }
  }

  console.log("Done seeding core pages!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
