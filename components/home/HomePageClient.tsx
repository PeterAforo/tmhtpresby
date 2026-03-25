"use client";

import { HeroSection } from "@/components/home/HeroSection";
import { QuickLinksSection } from "@/components/home/QuickLinksSection";
import { AboutSection } from "@/components/home/AboutSection";
import { LiveStreamSection } from "@/components/home/LiveStreamSection";
import { PresbyterySection } from "@/components/home/PresbyterySection";
import { MinistriesSection } from "@/components/home/MinistriesSection";
import { ProjectsPreviewSection } from "@/components/home/ProjectsPreviewSection";
import { PrayerFormSection } from "@/components/home/PrayerFormSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhatsNewSection } from "@/components/home/WhatsNewSection";

interface BlockData {
  id: string;
  type: string;
  content: Record<string, unknown>;
}

interface HomePageClientProps {
  blocks: BlockData[] | null;
}

function renderBlock(block: BlockData) {
  const c = block.content;

  switch (block.type) {
    case "hero-slider":
      return (
        <HeroSection
          key={block.id}
          slides={c.slides as { image: string; headline: string; subline: string; accent: string }[]}
          autoplaySpeed={(c.autoplaySpeed as number) || 6000}
          height={c.height as string}
        />
      );

    case "quick-links":
      return (
        <QuickLinksSection
          key={block.id}
          links={c.links as { icon: string; title: string; description: string; href: string; variant: string }[]}
        />
      );

    case "about-section":
      return (
        <AboutSection
          key={block.id}
          label={c.label as string}
          heading={c.heading as string}
          description={c.description as string}
          image={c.image as string}
          stats={c.stats as { value: string; label: string }[]}
          features={c.features as { icon: string; title: string; description: string }[]}
          contactPhone={c.contactPhone as string}
          contactLabel={c.contactLabel as string}
        />
      );

    case "live-stream":
      return (
        <LiveStreamSection
          key={block.id}
          label={c.label as string}
          heading={c.heading as string}
          description={c.description as string}
          featuredVideo={c.featuredVideo as { videoId: string; title: string; date: string }}
          youtubeChannel={c.youtubeChannel as string}
        />
      );

    case "testimonials-section":
      return (
        <TestimonialsSection
          key={block.id}
          label={c.label as string}
          heading={c.heading as string}
          testimonials={c.testimonials as { quote: string; name: string; role: string; image: string; rating: number }[]}
        />
      );

    case "ministries-preview":
      return <MinistriesSection key={block.id} />;

    case "prayer-request":
      return <PrayerFormSection key={block.id} />;

    case "cta-banner":
      return (
        <section
          key={block.id}
          className="py-16"
          style={{ backgroundColor: (c.backgroundColor as string) || "var(--accent)" }}
        >
          <div className="max-w-4xl mx-auto px-4 text-center text-white">
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-4">
              {String(c.heading || "")}
            </h2>
            <p className="text-white/80 text-lg mb-8">
              {String(c.description || "")}
            </p>
            {typeof c.buttonText === 'string' && typeof c.buttonUrl === 'string' && (
              <a
                href={c.buttonUrl}
                className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                {c.buttonText}
              </a>
            )}
          </div>
        </section>
      );

    default:
      return null;
  }
}

export function HomePageClient({ blocks }: HomePageClientProps) {
  // If no database content, render default layout
  if (!blocks || blocks.length === 0) {
    return (
      <>
        <HeroSection />
        <QuickLinksSection />
        <AboutSection />
        <LiveStreamSection />
        <PresbyterySection />
        <MinistriesSection />
        <ProjectsPreviewSection />
        <PrayerFormSection />
        <TestimonialsSection />
        <WhatsNewSection />
      </>
    );
  }

  // Render from database blocks
  return <>{blocks.map((block) => renderBlock(block))}</>;
}
