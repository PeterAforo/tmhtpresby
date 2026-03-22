import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://mhtpcaccra.org";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    "",
    "/about",
    "/about/our-story",
    "/about/beliefs",
    "/about/leadership",
    "/about/vision",
    "/sermons",
    "/events",
    "/ministries",
    "/give",
    "/blog",
    "/gallery",
    "/live",
    "/contact",
  ];

  return staticPages.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path.startsWith("/about") ? 0.8 : 0.7,
  }));
}
