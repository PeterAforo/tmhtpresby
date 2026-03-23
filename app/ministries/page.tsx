import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PageHeroWithBackground } from "@/components/layout/PageHeroWithBackground";
import { Users, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";

export const metadata: Metadata = {
  title: "Ministries",
  description: "Explore the ministries and groups at The Most Holy Trinity Presbyterian Church.",
};

const FALLBACK_IMAGES = [
  "/img/pictures/2/001.jpg",
  "/img/pictures/2/010.jpg",
  "/img/pictures/2/020.jpg",
  "/img/pictures/2/030.jpg",
  "/img/pictures/2/040.jpg",
  "/img/pictures/2/050.jpg",
  "/img/pictures/2/060.jpg",
  "/img/pictures/2/070.jpg",
];

async function getMinistries() {
  try {
    const ministries = await prisma.leadershipGroup.findMany({
      where: {
        type: "ministry",
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        imageUrl: true,
        order: true,
      },
      orderBy: { order: "asc" },
    });
    return ministries;
  } catch (error) {
    console.error("Failed to fetch ministries:", error);
    return [];
  }
}

export default async function MinistriesPage() {
  const ministries = await getMinistries();

  return (
    <>
      <PageHeroWithBackground
        pageSlug="ministries"
        overline="Get Involved"
        title="Our Ministries"
        subtitle="There's a place for everyone at The Most Holy Trinity. Find your community and serve with purpose."
      />

      <section className="py-16 lg:py-24 bg-[var(--bg)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {ministries.length === 0 ? (
            <div className="text-center py-16">
              <Users size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
              <p className="text-[var(--text-muted)]">No ministries available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ministries.map((ministry, index) => {
                const fallbackImage = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
                return (
                  <Link
                    key={ministry.id}
                    href={`/ministries/${ministry.slug}`}
                    className="group relative rounded-2xl overflow-hidden aspect-[4/3] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
                  >
                    {/* Background Image */}
                    <Image
                      src={ministry.imageUrl || fallbackImage}
                      alt={ministry.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20 group-hover:from-black/95 group-hover:via-black/60 transition-colors duration-300" />
                    
                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      {/* Icon */}
                      <div className="absolute top-5 right-5 w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white group-hover:bg-[var(--accent)] transition-colors duration-300">
                        <Users size={22} />
                      </div>
                      
                      {/* Text */}
                      <div>
                        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-white mb-2 group-hover:text-[var(--accent)] transition-colors">
                          {ministry.name}
                        </h3>
                        <p className="text-sm text-white/80 leading-relaxed mb-3 line-clamp-2">
                          {ministry.description || "Join our ministry community"}
                        </p>
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          Learn More
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
