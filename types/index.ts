// =============================================================================
// Navigation
// =============================================================================

export interface NavSubItem {
  label: string;
  href: string;
  description?: string;
}

export interface NavItem {
  label: string;
  href: string;
  /** Child links rendered in a dropdown panel */
  subItems?: NavSubItem[];
  /** Opens in a new tab */
  external?: boolean;
}

// =============================================================================
// Church Leadership
// =============================================================================

export type LeadershipRole =
  | "Senior Pastor"
  | "Associate Pastor"
  | "Youth Pastor"
  | "Worship Pastor"
  | "Executive Pastor"
  | "Elder"
  | "Deacon"
  | "Deaconess"
  | string;

export interface LeadershipMember {
  id: string;
  name: string;
  role: LeadershipRole;
  bio: string;
  /** Public URL for the member's photo */
  imageUrl: string;
  imageAlt?: string;
  email?: string;
  /** Social media handles (username only, no full URL) */
  social?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
  };
  /** Display order (lower = first) */
  order?: number;
}

// =============================================================================
// Events
// =============================================================================

export type EventCategory =
  | "worship"
  | "youth"
  | "women"
  | "men"
  | "prayer"
  | "outreach"
  | "conference"
  | "special"
  | "family"
  | string;

export interface ChurchEvent {
  id: string;
  title: string;
  slug: string;
  description: string;
  /** Full ISO 8601 datetime string */
  startDate: string;
  endDate?: string;
  /** "All Day" or formatted time e.g. "9:00 AM – 12:00 PM" */
  time?: string;
  location: string;
  category: EventCategory;
  imageUrl?: string;
  imageAlt?: string;
  isFeatured?: boolean;
  registrationUrl?: string;
  isFree?: boolean;
  /** Ticket price in GHS if not free */
  ticketPrice?: number;
  /** Organiser or ministry responsible */
  organiser?: string;
  tags?: string[];
}

// =============================================================================
// Sermons
// =============================================================================

export type SermonMediaType = "video" | "audio" | "both";

export interface SermonSpeaker {
  id: string;
  name: string;
  imageUrl?: string;
  role?: string;
}

export interface Sermon {
  id: string;
  title: string;
  slug: string;
  description: string;
  /** ISO 8601 date string */
  date: string;
  speaker: SermonSpeaker;
  series?: string;
  seriesSlug?: string;
  /** Bible reference(s) e.g. "John 3:16-17" */
  scripture?: string;
  duration?: string;
  mediaType: SermonMediaType;
  videoUrl?: string;
  audioUrl?: string;
  thumbnailUrl?: string;
  thumbnailAlt?: string;
  isFeatured?: boolean;
  tags?: string[];
  /** View / play count */
  views?: number;
}

// =============================================================================
// Ministries
// =============================================================================

export type MinistryAgeGroup =
  | "children"
  | "youth"
  | "young-adults"
  | "adults"
  | "seniors"
  | "all-ages";

export interface Ministry {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
  ageGroup: MinistryAgeGroup;
  meetingDay?: string;
  meetingTime?: string;
  location?: string;
  leader?: string;
  contactEmail?: string;
  isFeatured?: boolean;
  /** Sort order */
  order?: number;
}

// =============================================================================
// FAQ
// =============================================================================

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  /** Groups items for tabbed / accordion display */
  category?: string;
  /** Sort order within category */
  order?: number;
}

// =============================================================================
// Contact Form
// =============================================================================

export type ContactFormSubject =
  | "general-inquiry"
  | "prayer-request"
  | "pastoral-care"
  | "events"
  | "giving"
  | "volunteering"
  | "media"
  | "other";

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: ContactFormSubject;
  message: string;
  /** Whether the sender consents to being contacted */
  consentToContact: boolean;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
  /** Field-level validation errors */
  errors?: Partial<Record<keyof ContactFormData, string>>;
}

// =============================================================================
// Blog / Articles (bonus — used alongside the types above)
// =============================================================================

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  /** ISO 8601 date string */
  publishedAt: string;
  updatedAt?: string;
  author: {
    id: string;
    name: string;
    imageUrl?: string;
    role?: string;
  };
  coverImageUrl?: string;
  coverImageAlt?: string;
  tags?: string[];
  category?: string;
  isFeatured?: boolean;
  readingTimeMinutes?: number;
}

// =============================================================================
// Giving / Donation
// =============================================================================

export type GivingFrequency = "one-time" | "weekly" | "bi-weekly" | "monthly" | "annually";

export type GivingFund =
  | "general"
  | "building"
  | "missions"
  | "benevolence"
  | "youth"
  | "media"
  | string;

export interface DonationFormData {
  amount: number;
  currency: "GHS" | "USD" | "GBP";
  fund: GivingFund;
  frequency: GivingFrequency;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  /** Optional anonymous giving */
  isAnonymous?: boolean;
  /** Stripe payment method ID */
  paymentMethodId?: string;
}

// =============================================================================
// Site-wide utility types
// =============================================================================

export interface SeoMeta {
  title: string;
  description: string;
  openGraphImageUrl?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
