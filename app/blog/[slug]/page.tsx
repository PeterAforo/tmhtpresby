import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/layout/PageHero";
import { Calendar, User, Clock, ArrowLeft, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  devotional: "bg-[var(--accent)]/10 text-[var(--accent)]",
  "bible-study": "bg-[var(--primary)]/10 text-[var(--primary)]",
  family: "bg-pink-500/10 text-pink-600",
  outreach: "bg-amber-500/10 text-amber-600",
  worship: "bg-purple-500/10 text-purple-600",
  culture: "bg-blue-500/10 text-blue-600",
  general: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt || `Read "${post.title}" on the Most Holy Trinity Presbyterian Church blog.`,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();

  // Increment view count (fire-and-forget)
  prisma.blogPost.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  // Fetch related posts
  const related = await prisma.blogPost.findMany({
    where: {
      published: true,
      category: post.category,
      id: { not: post.id },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  return (
    <>
      <PageHero
        overline={post.category.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        title={post.title}
        subtitle={post.excerpt || undefined}
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Blog
          </Link>

          {/* Meta bar */}
          <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-[var(--text-muted)]">
            <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold capitalize", categoryColors[post.category] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400")}>
              {post.category.replace("-", " ")}
            </span>
            <span className="flex items-center gap-1">
              <User size={14} /> {post.author}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={14} /> {formatDate(post.publishedAt)}
            </span>
            {post.readTime && (
              <span className="flex items-center gap-1">
                <Clock size={14} /> {post.readTime} min read
              </span>
            )}
            <span className="flex items-center gap-1">
              <Eye size={14} /> {post.viewCount.toLocaleString()} views
            </span>
          </div>

          {/* Article content */}
          <article
            className="prose prose-lg max-w-none text-[var(--text)] prose-headings:font-[family-name:var(--font-heading)] prose-headings:text-[var(--text)] prose-a:text-[var(--accent)] prose-strong:text-[var(--text)]"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Related posts */}
          {related.length > 0 && (
            <div className="mt-16 pt-10 border-t border-[var(--border)]">
              <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-[var(--text)] mb-6">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/blog/${r.slug}`}
                    className="rounded-xl bg-[var(--bg-card)] border border-[var(--border)] p-4 hover:border-[var(--accent)]/40 hover:shadow-md transition-all duration-200"
                  >
                    <span className={cn("inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize mb-2", categoryColors[r.category] || "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400")}>
                      {r.category.replace("-", " ")}
                    </span>
                    <h3 className="text-sm font-semibold text-[var(--text)] line-clamp-2 mb-1">
                      {r.title}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">{r.author}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
