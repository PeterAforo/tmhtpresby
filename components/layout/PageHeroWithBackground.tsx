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
  defaultBackgroundImage?: string;
  defaultOverlayColor?: string;
}

const DEFAULT_HERO_IMAGE = "/img/pictures/2/001.jpg";
const DEFAULT_OVERLAY_COLOR = "rgba(12, 21, 41, 0.85)";

export function PageHeroWithBackground({
  pageSlug,
  title,
  subtitle,
  overline,
  defaultBackgroundImage = DEFAULT_HERO_IMAGE,
  defaultOverlayColor = DEFAULT_OVERLAY_COLOR,
}: PageHeroWithBackgroundProps) {
  const [settings, setSettings] = useState<PageHeroSettings | null>(null);
  const [loaded, setLoaded] = useState(false);

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
      } finally {
        setLoaded(true);
      }
    }
    fetchSettings();
  }, [pageSlug]);

  return (
    <PageHero
      title={settings?.title || title}
      subtitle={settings?.subtitle || subtitle}
      overline={overline}
      backgroundImage={settings?.backgroundUrl || defaultBackgroundImage}
      overlayColor={settings?.overlayColor || defaultOverlayColor}
    />
  );
}
