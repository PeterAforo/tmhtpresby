import { prisma } from "@/lib/db";
import { HomePageClient } from "@/components/home/HomePageClient";

interface BlockData {
  id: string;
  type: string;
  content: Record<string, unknown>;
}

async function getHomePageContent(): Promise<BlockData[] | null> {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: "home" },
      select: { content: true, published: true },
    });

    if (!page?.published || !page.content) return null;
    return page.content as unknown as BlockData[];
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const blocks = await getHomePageContent();
  return <HomePageClient blocks={blocks} />;
}
