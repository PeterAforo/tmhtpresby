import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { ArrowLeft, ImageIcon } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const album = await prisma.galleryAlbum.findUnique({ where: { slug } });
  if (!album) return { title: "Album Not Found" };
  return {
    title: `${album.title} — Gallery`,
    description: album.description || `Browse photos from "${album.title}" at The Most Holy Trinity Presbyterian Church.`,
  };
}

export default async function GalleryAlbumPage({ params }: Props) {
  const { slug } = await params;

  const album = await prisma.galleryAlbum.findUnique({
    where: { slug, published: true },
    include: {
      images: { orderBy: { order: "asc" } },
    },
  });

  if (!album) notFound();

  return (
    <>
      <PageHeroWithBackground
        pageSlug={`gallery-${album.slug}`}
        overline="Gallery"
        title={album.title}
        subtitle={album.description || undefined}
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors mb-8"
          >
            <ArrowLeft size={16} />
            Back to Gallery
          </Link>

          <p className="text-sm text-[var(--text-muted)] mb-6">
            {album.images.length} photo{album.images.length !== 1 ? "s" : ""}
          </p>

          {album.images.length > 0 ? (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {album.images.map((image) => (
                <div
                  key={image.id}
                  className="break-inside-avoid rounded-xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border)] hover:shadow-lg transition-shadow duration-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image.url}
                    alt={image.caption || album.title}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                  {image.caption && (
                    <p className="p-3 text-xs text-[var(--text-muted)]">{image.caption}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <ImageIcon size={48} className="mx-auto text-[var(--text-muted)] opacity-30 mb-4" />
              <p className="text-lg text-[var(--text-muted)]">No photos in this album yet.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
