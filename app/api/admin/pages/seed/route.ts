import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

// Helper to generate unique IDs
const genId = () => Math.random().toString(36).substring(2, 9);

// Home page with full editable sections
const homePageSections = [
  {
    id: genId(),
    type: "hero-slider",
    content: {
      slides: [
        { id: genId(), image: "/img/pictures/2/001.jpg", headline: "Welcome to TMHT Presbyterian Church", subline: "A community of faith, hope, and love in Lashibi", accent: "Sunday Service 9:00 AM" },
        { id: genId(), image: "/img/pictures/2/002.jpg", headline: "Growing Together in Faith", subline: "Join us for worship, fellowship, and spiritual growth", accent: "Bible Study Wednesdays" },
        { id: genId(), image: "/img/pictures/2/003.jpg", headline: "Serving Our Community", subline: "Making a difference through love and action", accent: "Get Involved Today" },
      ],
      autoplaySpeed: 6000,
      height: "600px",
    },
  },
  {
    id: genId(),
    type: "quick-links",
    content: {
      links: [
        { id: genId(), icon: "Church", title: "Our Church", description: "Discover our rich history and vibrant community.", href: "/about", variant: "white" },
        { id: genId(), icon: "LayoutGrid", title: "Ministries", description: "Find your place to serve and grow.", href: "/ministries", variant: "red" },
        { id: genId(), icon: "Calendar", title: "Events", description: "Stay connected with upcoming events.", href: "/events", variant: "white" },
      ],
    },
  },
  {
    id: genId(),
    type: "about-section",
    content: {
      label: "About Our Church",
      heading: "A Community Built on Faith, Love & Purpose",
      description: "We believe in the transformative power of God's love. For over 25 years, we've been nurturing faith, building community, and serving with compassion and purpose.",
      image: "/img/about/3.png",
      stats: [{ value: "1500+", label: "Church Members" }, { value: "25+", label: "Years of Faith" }],
      features: [
        { icon: "Heart", title: "Compassionate Community", description: "A welcoming family where everyone belongs." },
        { icon: "Users", title: "Strong Fellowship", description: "Building lasting relationships through shared faith." },
        { icon: "BookOpen", title: "Biblical Teaching", description: "Grounded in Scripture, equipping believers." },
        { icon: "Church", title: "Vibrant Worship", description: "Encountering God's presence through praise." },
      ],
      contactPhone: "+233 24 683 9756",
      contactLabel: "Speak with our Pastor",
    },
  },
  {
    id: genId(),
    type: "live-stream",
    content: {
      label: "LIVE & ON-DEMAND",
      heading: "Watch Our Services",
      description: "Join us live every Sunday or catch up on past services, sermons, and special events.",
      featuredVideo: { videoId: "jhloSMM-y0c", title: "Sunday Worship Service", date: "Nov 30, 2025" },
      youtubeChannel: "https://www.youtube.com/@tmhtpresby",
    },
  },
  {
    id: genId(),
    type: "ministries-preview",
    content: {
      label: "OUR MINISTRIES",
      heading: "Find Your Place to Serve",
      description: "Discover the many ways you can get involved and make a difference.",
      showCount: 6,
      ctaUrl: "/ministries",
    },
  },
  {
    id: genId(),
    type: "prayer-request",
    content: {
      title: "Submit a Prayer Request",
      description: "Share your prayer needs with our prayer team. We believe in the power of prayer.",
    },
  },
  {
    id: genId(),
    type: "testimonials-section",
    content: {
      label: "TESTIMONIALS",
      heading: "What Our Congregation Say",
      testimonials: [
        { id: genId(), quote: "This church has transformed my life. The warmth and genuine love I've experienced here is unlike anything I've known before.", name: "Akua Mensah", role: "Member since 2018", image: "/img/pictures/2/016.jpg", rating: 5 },
        { id: genId(), quote: "The youth ministry has been a blessing for my children. They've grown so much in their faith.", name: "Kofi Asante", role: "Member since 2015", image: "/img/pictures/2/018.jpg", rating: 5 },
      ],
    },
  },
  {
    id: genId(),
    type: "cta-banner",
    content: {
      heading: "Ready to Join Us?",
      description: "We'd love to welcome you to our church family. Visit us this Sunday!",
      buttonText: "Plan Your Visit",
      buttonUrl: "/contact",
      backgroundColor: "var(--accent)",
    },
  },
];

// Standard page sections with editable hero
const createStandardPageSections = (title: string, subtitle: string) => [
  {
    id: genId(),
    type: "page-hero",
    content: {
      title,
      subtitle,
      backgroundImage: "/img/pictures/2/001.jpg",
      overlayColor: "rgba(12, 21, 41, 0.85)",
      height: "400px",
      alignment: "center",
    },
  },
];

const aboutPageSections = [
  ...createStandardPageSections("About Us", "Learn about our church, our beliefs, and our mission"),
  {
    id: genId(),
    type: "quick-links",
    content: {
      links: [
        { id: genId(), icon: "Church", title: "Our Story", description: "Learn about our history and journey", href: "/about/church", variant: "white" },
        { id: genId(), icon: "BookOpen", title: "Our Beliefs", description: "What we believe and stand for", href: "/about/beliefs", variant: "red" },
        { id: genId(), icon: "Users", title: "Leadership", description: "Meet our church leaders", href: "/about/leadership", variant: "white" },
      ],
    },
  },
];

const ministriesPageSections = [
  ...createStandardPageSections("Our Ministries", "Find your place to serve and grow in faith"),
  { id: genId(), type: "ministries-preview", content: { label: "", heading: "", showCount: 12, ctaUrl: "" } },
];

const eventsPageSections = [
  ...createStandardPageSections("Events", "Stay connected with upcoming church events"),
  { id: genId(), type: "events-list", content: { count: 10, showPast: false } },
];

const sermonsPageSections = [
  ...createStandardPageSections("Sermons", "Watch and listen to our messages"),
  { id: genId(), type: "sermons-list", content: { count: 12, showVideo: true } },
];

const blogPageSections = [
  ...createStandardPageSections("Blog & News", "Stay updated with church news and articles"),
  { id: genId(), type: "blog-posts", content: { count: 9 } },
];

const galleryPageSections = [
  ...createStandardPageSections("Photo Gallery", "Memories from our church family"),
];

const contactPageSections = [
  ...createStandardPageSections("Contact Us", "We'd love to hear from you"),
  { id: genId(), type: "contact-form", content: { title: "Send us a Message", fields: ["name", "email", "phone", "message"] } },
  { id: genId(), type: "map", content: { address: "TMHT Presbyterian Church, Lashibi, Accra, Ghana", zoom: 15 } },
];

const givePageSections = [
  ...createStandardPageSections("Give", "Support our church and its mission"),
  {
    id: genId(),
    type: "paragraph",
    content: {
      text: "Your generous giving helps us continue our mission of spreading the Gospel, serving our community, and building God's kingdom. Thank you for your faithful support.",
      align: "center",
    },
  },
];

const devotionalsPageSections = [
  ...createStandardPageSections("Devotionals", "Daily inspiration and spiritual growth"),
];

const livePageSections = [
  ...createStandardPageSections("Live Stream", "Join us for live worship"),
  {
    id: genId(),
    type: "live-stream",
    content: {
      label: "LIVE NOW",
      heading: "Watch Live",
      description: "Join us for our live service broadcast",
      featuredVideo: { videoId: "", title: "Live Service", date: "" },
      youtubeChannel: "https://www.youtube.com/@tmhtpresby",
    },
  },
];

const shopPageSections = [
  ...createStandardPageSections("Church Shop", "Books, merchandise, and more"),
];

const genericPageSections = (title: string, subtitle: string) => [
  ...createStandardPageSections(title, subtitle),
  { id: genId(), type: "paragraph", content: { text: "Page content goes here. Edit this section to add your content.", align: "left" } },
];

const corePages = [
  { title: "Home", slug: "home", description: "Welcome to TMHT Presbyterian Church", content: homePageSections },
  { title: "About", slug: "about", description: "Learn about our church", content: aboutPageSections },
  { title: "About - Our Church", slug: "about/church", description: "Our church history and mission", content: genericPageSections("Our Church", "Our history and mission") },
  { title: "About - Our Beliefs", slug: "about/beliefs", description: "What we believe", content: genericPageSections("Our Beliefs", "What we believe and stand for") },
  { title: "About - Leadership", slug: "about/leadership", description: "Our church leadership", content: genericPageSections("Leadership", "Meet our church leaders") },
  { title: "About - History", slug: "about/history", description: "Our church history", content: genericPageSections("Our History", "The journey of our church") },
  { title: "Ministries", slug: "ministries", description: "Our church ministries", content: ministriesPageSections },
  { title: "Events", slug: "events", description: "Upcoming church events", content: eventsPageSections },
  { title: "Sermons", slug: "sermons", description: "Watch and listen to sermons", content: sermonsPageSections },
  { title: "Blog / News", slug: "blog", description: "Church news and articles", content: blogPageSections },
  { title: "Gallery", slug: "gallery", description: "Photo gallery", content: galleryPageSections },
  { title: "Contact", slug: "contact", description: "Get in touch with us", content: contactPageSections },
  { title: "Give", slug: "give", description: "Support our church", content: givePageSections },
  { title: "Devotionals", slug: "devotionals", description: "Daily devotionals", content: devotionalsPageSections },
  { title: "Daily Word", slug: "daily-word", description: "Daily word and inspiration", content: genericPageSections("Daily Word", "Daily inspiration and encouragement") },
  { title: "Announcements", slug: "announcements", description: "Church announcements", content: genericPageSections("Announcements", "Stay updated with church news") },
  { title: "Community", slug: "community", description: "Church community", content: genericPageSections("Community", "Our church community") },
  { title: "Community Impact", slug: "community-impact", description: "Our community impact", content: genericPageSections("Community Impact", "Making a difference together") },
  { title: "Projects", slug: "projects", description: "Church projects", content: genericPageSections("Projects", "Our ongoing projects") },
  { title: "Volunteers", slug: "volunteers", description: "Volunteer opportunities", content: genericPageSections("Volunteers", "Join our volunteer team") },
  { title: "Live", slug: "live", description: "Live streaming", content: livePageSections },
  { title: "Shop", slug: "shop", description: "Church shop", content: shopPageSections },
  { title: "Services", slug: "services", description: "Our services", content: genericPageSections("Services", "Our worship services") },
  { title: "Resources", slug: "resources", description: "Church resources", content: genericPageSections("Resources", "Helpful resources for your faith journey") },
  { title: "Directory", slug: "directory", description: "Church directory", content: genericPageSections("Directory", "Church directory") },
  { title: "Videos", slug: "videos", description: "Video content", content: genericPageSections("Videos", "Watch our video content") },
  { title: "Media", slug: "media", description: "Media content", content: genericPageSections("Media", "Photos, videos, and more") },
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
