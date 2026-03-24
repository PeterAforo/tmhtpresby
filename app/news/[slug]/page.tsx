import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { NewsDetailClient } from "@/components/news/NewsDetailClient";
import { Calendar, User, Clock, Eye, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

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
];

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "News Not Found" };
  return {
    title: post.title,
    description: post.excerpt || `Read ${post.title} on The Most Holy Trinity Presbyterian Church news.`,
  };
}

async function getRelatedPosts(currentId: string, category: string) {
  return await prisma.blogPost.findMany({
    where: {
      published: true,
      id: { not: currentId },
      OR: [{ category }],
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
}

async function getComments(postId: string) {
  return await prisma.newsComment.findMany({
    where: { postId, isApproved: true },
    orderBy: { createdAt: "desc" },
  });
}

async function getAverageRating(postId: string) {
  const result = await prisma.newsRating.aggregate({
    where: { postId },
    _avg: { rating: true },
    _count: { rating: true },
  });
  return {
    average: result._avg.rating || 0,
    count: result._count.rating,
  };
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });

  if (!post) notFound();

  // Increment view count
  await prisma.blogPost.update({
    where: { id: post.id },
    data: { viewCount: { increment: 1 } },
  });

  const [relatedPosts, comments, ratingData] = await Promise.all([
    getRelatedPosts(post.id, post.category),
    getComments(post.id),
    getAverageRating(post.id),
  ]);

  return (
    <>
      {/* Hero Image */}
      <div className="relative h-64 sm:h-80 lg:h-[450px] w-full overflow-hidden">
        <Image
          src={post.imageUrl || fallbackImages[0]}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={cn("px-4 py-2 rounded-full text-sm font-semibold capitalize bg-white/90", categoryColors[post.category]?.split(" ")[1] || "text-gray-600")}>
            {post.category.replace("-", " ")}
          </span>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-10">
          <div className="mx-auto max-w-4xl">
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-1.5">
                <User size={16} /> {post.author}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={16} /> {formatDate(post.publishedAt)}
              </span>
              {post.readTime && (
                <span className="flex items-center gap-1.5">
                  <Clock size={16} /> {post.readTime} min read
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Eye size={16} /> {post.viewCount + 1} views
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Client Component for Interactive Features */}
      <NewsDetailClient
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          content: post.content,
          excerpt: post.excerpt,
          author: post.author,
          category: post.category,
          imageUrl: post.imageUrl,
          likes: post.likes,
          publishedAt: post.publishedAt,
        }}
        relatedPosts={relatedPosts.map((p, i) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          excerpt: p.excerpt,
          imageUrl: p.imageUrl || fallbackImages[(i + 1) % fallbackImages.length],
          category: p.category,
          publishedAt: p.publishedAt,
        }))}
        comments={comments.map(c => ({
          id: c.id,
          content: c.content,
          authorName: c.authorName,
          createdAt: c.createdAt,
        }))}
        rating={ratingData}
        categoryColors={categoryColors}
      />
    </>
  );
}
