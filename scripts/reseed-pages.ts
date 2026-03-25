import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
if (!connectionString) { console.error("DATABASE_URL not set"); process.exit(1); }
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
const genId = () => Math.random().toString(36).substring(2, 9);

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

async function main() {
  // Update home page
  const home = await prisma.page.findUnique({ where: { slug: "home" } });
  if (home) {
    await prisma.page.update({
      where: { slug: "home" },
      data: { content: homePageSections },
    });
    console.log("✅ Home page updated with new editable blocks");
  } else {
    console.log("⚠️  Home page not found - run the seed API first");
  }

  // Update other core pages with page-hero blocks
  const createStandardSections = (title: string, subtitle: string) => [
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

  const pagesToUpdate: { slug: string; content: object[] }[] = [
    { slug: "about", content: [...createStandardSections("About Us", "Learn about our church, our beliefs, and our mission"), { id: genId(), type: "quick-links", content: { links: [{ id: genId(), icon: "Church", title: "Our Story", description: "Learn about our history", href: "/about/church", variant: "white" }, { id: genId(), icon: "BookOpen", title: "Our Beliefs", description: "What we believe", href: "/about/beliefs", variant: "red" }, { id: genId(), icon: "Users", title: "Leadership", description: "Meet our leaders", href: "/about/leadership", variant: "white" }] } }] },
    { slug: "ministries", content: [...createStandardSections("Our Ministries", "Find your place to serve and grow in faith"), { id: genId(), type: "ministries-preview", content: { label: "", heading: "", showCount: 12, ctaUrl: "" } }] },
    { slug: "events", content: [...createStandardSections("Events", "Stay connected with upcoming church events"), { id: genId(), type: "events-list", content: { count: 10, showPast: false } }] },
    { slug: "sermons", content: [...createStandardSections("Sermons", "Watch and listen to our messages"), { id: genId(), type: "sermons-list", content: { count: 12, showVideo: true } }] },
    { slug: "blog", content: [...createStandardSections("Blog & News", "Stay updated with church news"), { id: genId(), type: "blog-posts", content: { count: 9 } }] },
    { slug: "contact", content: [...createStandardSections("Contact Us", "We'd love to hear from you"), { id: genId(), type: "contact-form", content: { title: "Send us a Message", fields: ["name", "email", "phone", "message"] } }, { id: genId(), type: "map", content: { address: "TMHT Presbyterian Church, Lashibi, Accra, Ghana", zoom: 15 } }] },
    { slug: "live", content: [...createStandardSections("Live Stream", "Join us for live worship"), { id: genId(), type: "live-stream", content: { label: "LIVE NOW", heading: "Watch Live", description: "Join us for our live service broadcast", featuredVideo: { videoId: "", title: "Live Service", date: "" }, youtubeChannel: "https://www.youtube.com/@tmhtpresby" } }] },
    { slug: "give", content: [...createStandardSections("Give", "Support our church and its mission"), { id: genId(), type: "paragraph", content: { text: "Your generous giving helps us continue our mission of spreading the Gospel.", align: "center" } }] },
  ];

  for (const page of pagesToUpdate) {
    const existing = await prisma.page.findUnique({ where: { slug: page.slug } });
    if (existing) {
      await prisma.page.update({ where: { slug: page.slug }, data: { content: page.content } });
      console.log(`✅ Updated: ${page.slug}`);
    }
  }

  console.log("\n🎉 All pages re-seeded with editable blocks!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
