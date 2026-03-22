import { HeroSection } from "@/components/home/HeroSection";
import { QuickLinksSection } from "@/components/home/QuickLinksSection";
import { AboutSection } from "@/components/home/AboutSection";
import { LiveStreamSection } from "@/components/home/LiveStreamSection";
import { PresbyterySection } from "@/components/home/PresbyterySection";
import { MinistriesSection } from "@/components/home/MinistriesSection";
import { PrayerFormSection } from "@/components/home/PrayerFormSection";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { WhatsNewSection } from "@/components/home/WhatsNewSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <QuickLinksSection />
      <AboutSection />
      <LiveStreamSection />
      <PresbyterySection />
      <MinistriesSection />
      <PrayerFormSection />
      <TestimonialsSection />
      <WhatsNewSection />
    </>
  );
}
