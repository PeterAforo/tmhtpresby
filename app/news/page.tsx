import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { Calendar, User, Clock, Eye, Heart, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News",
  description: "Latest news and updates from The Most Holy Trinity Presbyterian Church.",
};

const categoryColors: Record<string, string> = {
  devotional: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  "bible-study": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  family: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  outreach: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  worship: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  culture: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  announcement: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  general: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

const fallbackImages = [
  "/img/pictures/2/001.jpg",
  "/img/pictures/2/010.jpg",
  "/img/pictures/2/020.jpg",
  "/img/pictures/2/030.jpg",
  "/img/pictures/2/040.jpg",
  "/img/pictures/2/050.jpg",
];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

async function getNews() {
  try {
    return await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
      take: 20,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export default async function NewsPage() {
  const posts = await getNews();
  const featuredPost = posts[0];
  const otherPosts = posts.slice(1);

  return (
    <>
      <PageHeroWithBackground
        pageSlug="news"
        overline="Stay Updated"
        title="Church News"
        subtitle="Latest news, articles, and updates from our community"
      />

      <section className="py-12 lg:py-20 bg-[var(--bg)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Featured Post */}
          {featuredPost && (
            <div className="mb-12">
              <h2 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider mb-6">
                Featured Story
              </h2>
              <Link
                href={`/news/${featuredPost.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-2 gap-8 rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
                  <Image
                    src={featuredPost.imageUrl || fallbackImages[0]}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent lg:hidden" />
                </div>
                <div className="p-6 lg:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={cn("px-3 py-1 rounded-full text-xs font-semibold capitalize", categoryColors[featuredPost.category] || categoryColors.general)}>
                      {featuredPost.category.replace("-", " ")}
                    </span>
                    {featuredPost.readTime && (
                      <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <Clock size={12} /> {featuredPost.readTime} min read
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl lg:text-3xl font-bold text-[var(--text)] mb-4 group-hover:text-[var(--accent)] transition-colors">
                    {featuredPost.title}
                  </h3>
                  {featuredPost.excerpt && (
                    <p className="text-[var(--text-muted)] leading-relaxed mb-6 line-clamp-3">
                      {featuredPost.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                      <span className="flex items-center gap-1.5">
                        <User size={14} /> {featuredPost.author}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={14} /> {formatDate(featuredPost.publishedAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                      {featuredPost.viewCount > 0 && (
                        <span className="flex items-center gap-1">
                          <Eye size={14} /> {featuredPost.viewCount}
                        </span>
                      )}
                      {featuredPost.likes > 0 && (
                        <span className="flex items-center gap-1 text-rose-500">
                          <Heart size={14} fill="currentColor" /> {featuredPost.likes}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-6">
                    <span className="inline-flex items-center gap-2 text-[var(--accent)] font-semibold group-hover:gap-3 transition-all">
                      Read Full Story <ArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Other Posts Grid */}
          {otherPosts.length > 0 && (
            <>
              <h2 className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider mb-6">
                Latest News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherPosts.map((post, index) => (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="group flex flex-col rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={post.imageUrl || fallbackImages[(index + 1) % fallbackImages.length]}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold capitalize bg-white/90 dark:bg-gray-900/90", categoryColors[post.category]?.split(" ")[1] || "text-gray-600")}>
                          {post.category.replace("-", " ")}
                        </span>
                      </div>
                      {post.likes > 0 && (
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-gray-900/90 text-rose-500 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <Heart size={12} fill="currentColor" /> {post.likes}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col flex-1 p-5">
                      <h3 className="text-lg font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 flex-1 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                        <span className="flex items-center gap-1.5">
                          <User size={12} /> {post.author.split(" ").slice(-1)[0]}
                        </span>
                        <div className="flex items-center gap-3">
                          {post.readTime && (
                            <span className="flex items-center gap-1">
                              <Clock size={12} /> {post.readTime}m
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {formatDate(post.publishedAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-[var(--text-muted)]">No news articles yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
