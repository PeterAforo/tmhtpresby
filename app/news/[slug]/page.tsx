import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;

  // Try to find a blog post with this slug
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    select: { slug: true },
  });

  if (post) {
    // Redirect to the blog post
    redirect(`/blog/${slug}`);
  }

  // If no blog post found, redirect to the news page
  redirect("/news");
}
