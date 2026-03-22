import type {
  NavItem,
  FaqItem,
} from "@/types";

// =============================================================================
// Navigation
// =============================================================================

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "The Word",
    href: "/sermons",
    subItems: [
      {
        label: "Sermon",
        href: "/sermons",
        description: "Watch and listen to our messages",
      },
      {
        label: "Daily Word",
        href: "/daily-word",
        description: "Daily devotional messages",
      },
    ],
  },
  {
    label: "Ministries",
    href: "/ministries",
    subItems: [
      {
        label: "The Aged Ministry",
        href: "/ministries/aged",
        description: "Ministry for senior members",
      },
      {
        label: "Men's Ministry",
        href: "/ministries/men",
        description: "Fellowship for men",
      },
      {
        label: "Women Ministry",
        href: "/ministries/women",
        description: "Fellowship for women",
      },
      {
        label: "Young Adult Ministry",
        href: "/ministries/young-adults",
        description: "For young adults",
      },
      {
        label: "Young People's Guild",
        href: "/ministries/ypg",
        description: "Youth fellowship",
      },
      {
        label: "Junior Ministry",
        href: "/ministries/junior",
        description: "Children's ministry",
      },
      {
        label: "Choir Ministry",
        href: "/ministries/choir",
        description: "Church choir",
      },
      {
        label: "Singing Band Ministry",
        href: "/ministries/singing-band",
        description: "Singing band group",
      },
      {
        label: "Trinity Praise Ministry",
        href: "/ministries/trinity-praise",
        description: "Praise and worship team",
      },
    ],
  },
  {
    label: "Media",
    href: "/media",
    subItems: [
      {
        label: "Announcements",
        href: "/announcements",
        description: "Church announcements",
      },
      {
        label: "Community Impact",
        href: "/community-impact",
        description: "Our community outreach",
      },
      {
        label: "Resources",
        href: "/resources",
        description: "Church resources",
      },
      {
        label: "Events",
        href: "/events",
        description: "Upcoming events",
      },
      {
        label: "Pictures",
        href: "/gallery",
        description: "Photo gallery",
      },
      {
        label: "Videos",
        href: "/videos",
        description: "Video gallery",
      },
    ],
  },
  {
    label: "About",
    href: "/about",
    subItems: [
      {
        label: "The Church",
        href: "/about/church",
        description: "About our church",
      },
      {
        label: "The Minister",
        href: "/about/minister",
        description: "Meet our minister",
      },
      {
        label: "The Catechist",
        href: "/about/catechist",
        description: "Meet our catechist",
      },
      {
        label: "The Session",
        href: "/about/session",
        description: "Church session members",
      },
      {
        label: "Our Agents",
        href: "/about/agents",
        description: "Church agents",
      },
      {
        label: "Administration",
        href: "/about/administration",
        description: "Church administration",
      },
      {
        label: "Departments",
        href: "/about/departments",
        description: "Church departments",
      },
      {
        label: "Committees",
        href: "/about/committees",
        description: "Church committees",
      },
      {
        label: "Projects",
        href: "/projects",
        description: "Our ongoing projects",
      },
    ],
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

// =============================================================================
// Social Links
// =============================================================================

export interface SocialLink {
  platform: "facebook" | "instagram" | "youtube" | "twitter";
  label: string;
  href: string;
  /** SVG path data for the icon — use lucide-react icons in components instead */
  ariaLabel: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "facebook",
    label: "Facebook",
    href: "https://facebook.com/gracepointhurch",
    ariaLabel: "Follow us on Facebook",
  },
  {
    platform: "instagram",
    label: "Instagram",
    href: "https://instagram.com/gracepointhurch",
    ariaLabel: "Follow us on Instagram",
  },
  {
    platform: "youtube",
    label: "YouTube",
    href: "https://youtube.com/@gracepointhurch",
    ariaLabel: "Subscribe on YouTube",
  },
  {
    platform: "twitter",
    label: "X (Twitter)",
    href: "https://x.com/gracepointhurch",
    ariaLabel: "Follow us on X",
  },
];

// =============================================================================
// Church Info
// =============================================================================

export interface ServiceTime {
  day: string;
  time: string;
  label: string;
}

export interface ChurchInfo {
  name: string;
  shortName: string;
  tagline: string;
  address: {
    street: string;
    city: string;
    region: string;
    country: string;
    /** Google Maps embed/link URL */
    mapUrl: string;
    /** Plain text for display */
    formatted: string;
  };
  phone: string;
  /** WhatsApp number in international format (digits only) */
  whatsapp: string;
  email: string;
  generalEmail: string;
  website: string;
  serviceTimes: ServiceTime[];
}

export const CHURCH_INFO: ChurchInfo = {
  name: "The Most Holy Trinity Presbyterian Church",
  shortName: "TMHT Presby",
  tagline: "That They All May Be One",
  address: {
    street: "MW2F+87R",
    city: "Lashibi",
    region: "Greater Accra Region",
    country: "Ghana",
    mapUrl:
      "https://www.google.com/maps/dir//The+Most+Holy+Trinity+Congregation+(Presbyterian+Church+of+Ghana),+MW2F%2B87R,+Lashibi/@5.7405129,0.046657,15z/data=!3m1!4b1!4m8!4m7!1m0!1m5!1m1!1s0xfdf83fe76852171:0xaff80fd556554012!2m2!1d-0.0768664!2d5.650859?entry=ttu",
    formatted: "MW2F+87R, Lashibi, Greater Accra Region, Ghana",
  },
  phone: "+233 30 266 1788",
  whatsapp: "233302661788",
  email: "info@tmhtpresby.org",
  generalEmail: "hello@tmhtpresby.org",
  website: "https://tmhtpresby.org",
  serviceTimes: [
    {
      day: "Sunday",
      time: "7:00 AM",
      label: "First Service",
    },
    {
      day: "Sunday",
      time: "9:30 AM",
      label: "Second Service",
    },
    {
      day: "Sunday",
      time: "12:00 PM",
      label: "Third Service",
    },
    {
      day: "Wednesday",
      time: "6:30 PM",
      label: "Midweek Bible Study",
    },
    {
      day: "Friday",
      time: "6:00 PM",
      label: "Prayer Night",
    },
  ],
};

// =============================================================================
// Footer Links
// =============================================================================

export interface FooterLinkItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterLinkGroup {
  heading: string;
  links: FooterLinkItem[];
}

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    heading: "Information",
    links: [
      { label: "Ministries", href: "/ministries" },
      { label: "Services", href: "/services" },
      { label: "Our Church", href: "/about/church" },
      { label: "Sermons", href: "/sermons" },
      { label: "Volunteers", href: "/volunteers" },
      { label: "Events", href: "/events" },
    ],
  },
  {
    heading: "Others",
    links: [
      { label: "Shop", href: "/shop" },
      { label: "Checkout", href: "/checkout" },
      { label: "Donation", href: "/give" },
      { label: "Contact Us", href: "/contact" },
      { label: "Blog", href: "/blog" },
    ],
  },
];

// =============================================================================
// Miscellaneous
// =============================================================================

/** Number of items shown per page for paginated lists */
export const DEFAULT_PAGE_SIZE = 12;

/** Base path for Supabase storage public bucket */
export const STORAGE_PUBLIC_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`
    : "";

/** Currency used for giving / ticketing */
export const DEFAULT_CURRENCY = "GHS";

/** Predefined giving amounts displayed on the Give page (in GHS) */
export const GIVING_QUICK_AMOUNTS = [20, 50, 100, 200, 500, 1000] as const;

export type GivingQuickAmount = (typeof GIVING_QUICK_AMOUNTS)[number];

/** Sample FAQ items — replace / extend from Supabase in production */
export const SAMPLE_FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq-1",
    question: "What time are Sunday services?",
    answer:
      "We hold three Sunday services at 7:00 AM, 9:30 AM, and 12:00 PM. All services are held at our church in Lashibi, Accra.",
    category: "services",
    order: 1,
  },
  {
    id: "faq-2",
    question: "Is there a children's programme during services?",
    answer:
      "Yes! Our Children's Ministry runs concurrently with all Sunday services for children from infants through age 12. Our trained volunteers ensure a safe and engaging experience.",
    category: "services",
    order: 2,
  },
  {
    id: "faq-3",
    question: "How do I get involved in a ministry?",
    answer:
      "Visit our Ministries page to explore the various groups available. You can reach out to the ministry leader directly or fill in the contact form and we will connect you.",
    category: "involvement",
    order: 1,
  },
  {
    id: "faq-4",
    question: "How can I give online?",
    answer:
      "Navigate to the Give page where you can make a one-time or recurring donation via mobile money or card. All transactions are secure and encrypted.",
    category: "giving",
    order: 1,
  },
  {
    id: "faq-5",
    question: "Are sermons available online?",
    answer:
      "All messages are uploaded to our Sermons page and YouTube channel within 48 hours of each service. You can also stream Sunday services live on our Live page.",
    category: "media",
    order: 1,
  },
];
