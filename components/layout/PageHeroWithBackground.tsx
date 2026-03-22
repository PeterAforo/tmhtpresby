"use client";

import { useEffect, useState } from "react";
import { PageHero } from "./PageHero";

interface PageHeroSettings {
  backgroundUrl?: string;
  overlayColor?: string;
  title?: string;
  subtitle?: string;
}

interface PageHeroWithBackgroundProps {
  pageSlug: string;
  title: string;
  subtitle?: string;
  overline?: string;
}

export function PageHeroWithBackground({
  pageSlug,
  title,
  subtitle,
  overline,
}: PageHeroWithBackgroundProps) {
  const [settings, setSettings] = useState<PageHeroSettings | null>(null);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch(`/api/page-hero/${encodeURIComponent(pageSlug)}`);
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (error) {
        console.error("Error fetching page hero settings:", error);
      }
    }
    fetchSettings();
  }, [pageSlug]);

  return (
    <PageHero
      title={settings?.title || title}
      subtitle={settings?.subtitle || subtitle}
      overline={overline}
      backgroundImage={settings?.backgroundUrl}
      overlayColor={settings?.overlayColor}
    />
  );
}
