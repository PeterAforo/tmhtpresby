import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/layout/PageHero";
import { Calendar, User, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles, devotionals, and reflections from The Most Holy Trinity Presbyterian Church.",
};

const categoryColors: Record<string, string> = {
  devotional: "bg-[var(--accent)]/10 text-[var(--accent)]",
  "bible-study": "bg-[var(--primary)]/10 text-[var(--primary)]",
  family: "bg-pink-500/10 text-pink-600",
  outreach: "bg-amber-500/10 text-amber-600",
  worship: "bg-purple-500/10 text-purple-600",
  culture: "bg-blue-500/10 text-blue-600",
  general: "bg-gray-100 text-gray-600",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: 18,
  });

  return (
    <>
      <PageHero
        overline="Resources"
        title="Blog"
        subtitle="Articles, devotionals, and reflections to nourish your faith journey."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-200"
              >
                {/* Thumbnail */}
                <div className="aspect-[16/9] bg-gradient-to-br from-[var(--primary)]/10 to-[var(--accent)]/10" />

                <div className="flex flex-col flex-1 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("px-2 py-0.5 rounded-full text-xs font-semibold capitalize", categoryColors[post.category] || "bg-gray-100 text-gray-600")}>
                      {post.category.replace("-", " ")}
                    </span>
                    {post.readTime && (
                      <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <Clock size={11} /> {post.readTime} min read
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-semibold text-[var(--text)] mb-2 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-4 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                    <span className="flex items-center gap-1">
                      <User size={12} /> {post.author.split(" ").slice(-1)[0]}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {formatDate(post.publishedAt)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-[var(--text-muted)]">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
