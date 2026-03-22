"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Camera, Video, X, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  type: "image" | "video";
  thumbnailUrl?: string;
}

interface GalleryAlbum {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverImage: string | null;
  imageCount: number;
  images: GalleryImage[];
}

interface MinistryGalleryProps {
  ministrySlug: string;
  ministryName: string;
}

export function MinistryGallery({ ministrySlug, ministryName }: MinistryGalleryProps) {
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch(`/api/ministries/${ministrySlug}/gallery`);
        if (res.ok) {
          const data = await res.json();
          setAlbums(data.albums || []);
        }
      } catch (error) {
        console.error("Failed to fetch ministry gallery:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, [ministrySlug]);

  const openLightbox = (album: GalleryAlbum, index: number) => {
    setSelectedAlbum(album);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    setSelectedAlbum(null);
  };

  const navigateLightbox = (direction: "prev" | "next") => {
    if (!selectedAlbum || lightboxIndex === null) return;
    
    const newIndex = direction === "prev" 
      ? (lightboxIndex - 1 + selectedAlbum.images.length) % selectedAlbum.images.length
      : (lightboxIndex + 1) % selectedAlbum.images.length;
    
    setLightboxIndex(newIndex);
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-[var(--border)] rounded w-1/3"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-square bg-[var(--border)] rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (albums.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
        <Camera size={32} className="mx-auto text-[var(--text-muted)] mb-3" />
        <p className="text-sm text-[var(--text-muted)]">
          No photos or videos available for {ministryName} yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-[var(--text)]">
        Photos & Videos
      </h2>

      {/* Albums grid */}
      <div className="space-y-6">
        {albums.map((album) => (
          <div key={album.id} className="space-y-3">
            {/* Album header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[var(--text)]">
                {album.title}
              </h3>
              <span className="text-xs text-[var(--text-muted)]">
                {album.imageCount} {album.imageCount === 1 ? "item" : "items"}
              </span>
            </div>

            {album.description && (
              <p className="text-sm text-[var(--text-muted)]">{album.description}</p>
            )}

            {/* Images grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {album.images.slice(0, 8).map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => openLightbox(album, index)}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <Image
                    src={image.thumbnailUrl || image.url}
                    alt={image.caption || `${album.title} - Image ${index + 1}`}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  
                  {/* Video indicator */}
                  {image.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                        <Play size={18} className="text-[var(--accent)] ml-0.5" />
                      </div>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                  {/* Show more indicator on last visible item */}
                  {index === 7 && album.images.length > 8 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        +{album.images.length - 8}
                      </span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && selectedAlbum && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
          >
            <X size={24} />
          </button>

          {/* Navigation */}
          <button
            onClick={() => navigateLightbox("prev")}
            className="absolute left-4 p-2 text-white/80 hover:text-white transition-colors z-10"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={() => navigateLightbox("next")}
            className="absolute right-4 p-2 text-white/80 hover:text-white transition-colors z-10"
          >
            <ChevronRight size={32} />
          </button>

          {/* Image */}
          <div className="relative max-w-4xl max-h-[80vh] w-full mx-4">
            {selectedAlbum.images[lightboxIndex].type === "video" ? (
              <video
                src={selectedAlbum.images[lightboxIndex].url}
                controls
                className="max-w-full max-h-[80vh] mx-auto"
              />
            ) : (
              <Image
                src={selectedAlbum.images[lightboxIndex].url}
                alt={selectedAlbum.images[lightboxIndex].caption || ""}
                width={1200}
                height={800}
                className="object-contain max-h-[80vh] mx-auto"
              />
            )}
          </div>

          {/* Caption & counter */}
          <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            {selectedAlbum.images[lightboxIndex].caption && (
              <p className="text-sm mb-2">{selectedAlbum.images[lightboxIndex].caption}</p>
            )}
            <p className="text-xs text-white/60">
              {lightboxIndex + 1} / {selectedAlbum.images.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
