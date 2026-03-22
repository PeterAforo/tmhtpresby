import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHero } from "@/components/layout/PageHero";
import { Camera } from "lucide-react";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos and moments from The Most Holy Trinity Presbyterian Church.",
};

const gradients = [
  "from-[var(--primary)]/20 to-[var(--accent)]/10",
  "from-[var(--accent)]/20 to-amber-500/10",
  "from-purple-500/20 to-[var(--primary)]/10",
  "from-amber-500/20 to-pink-500/10",
  "from-[var(--accent)]/15 to-[var(--primary)]/15",
  "from-pink-500/20 to-purple-500/10",
  "from-[var(--primary)]/15 to-blue-500/10",
  "from-amber-500/15 to-[var(--accent)]/15",
];

export default async function GalleryPage() {
  const albums = await prisma.galleryAlbum.findMany({
    where: { published: true },
    include: { _count: { select: { images: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHero
        overline="Memories"
        title="Photo Gallery"
        subtitle="A glimpse into the life, worship, and community of Most Holy Trinity."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {albums.map((album, i) => (
              <Link
                key={album.id}
                href={`/gallery/${album.slug}`}
                className="group rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--accent)]/40 hover:shadow-lg transition-all duration-200"
              >
                {album.coverUrl ? (
                  <div className="aspect-square bg-gray-100 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={album.coverUrl}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className={`aspect-square bg-gradient-to-br ${gradients[i % gradients.length]} flex items-center justify-center`}>
                    <Camera size={32} className="text-[var(--text-muted)] opacity-30 group-hover:opacity-50 transition-opacity" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors">
                    {album.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    {album._count.images} photo{album._count.images !== 1 ? "s" : ""}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {albums.length === 0 && (
            <div className="text-center py-16">
              <p className="text-lg text-[var(--text-muted)]">No albums yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
