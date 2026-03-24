"use client";

import { useState, useEffect, useCallback, use } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Upload,
  Trash2,
  Loader2,
  ImageIcon,
  GripVertical,
  X,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  order: number;
}

interface Album {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  coverUrl: string | null;
  published: boolean;
  images: GalleryImage[];
}

export default function AlbumImagesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [editingCaption, setEditingCaption] = useState<string | null>(null);
  const [captionText, setCaptionText] = useState("");

  const fetchAlbum = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/gallery/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAlbum(data.album);
      }
    } catch (err) {
      console.error("Failed to fetch album:", err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchAlbum();
  }, [fetchAlbum]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setSelectedFiles(Array.from(files));
    }
  };

  const handleBulkUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    const uploadedUrls: string[] = [];
    const totalFiles = selectedFiles.length;

    for (let i = 0; i < totalFiles; i++) {
      const file = selectedFiles[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          uploadedUrls.push(data.url);
        }
      } catch (err) {
        console.error("Upload error:", err);
      }

      setUploadProgress(Math.round(((i + 1) / totalFiles) * 100));
    }

    // Add images to album
    if (uploadedUrls.length > 0) {
      try {
        await fetch(`/api/admin/gallery/${id}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: uploadedUrls }),
        });
        fetchAlbum();
      } catch (err) {
        console.error("Failed to add images:", err);
      }
    }

    setSelectedFiles([]);
    setUploading(false);
    setUploadProgress(0);
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Delete this image?")) return;

    try {
      await fetch(`/api/admin/gallery/${id}/images?imageId=${imageId}`, {
        method: "DELETE",
      });
      fetchAlbum();
    } catch (err) {
      console.error("Failed to delete image:", err);
    }
  };

  const handleUpdateCaption = async (imageId: string) => {
    try {
      await fetch(`/api/admin/gallery/${id}/images`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, caption: captionText }),
      });
      setEditingCaption(null);
      setCaptionText("");
      fetchAlbum();
    } catch (err) {
      console.error("Failed to update caption:", err);
    }
  };

  const startEditCaption = (image: GalleryImage) => {
    setEditingCaption(image.id);
    setCaptionText(image.caption || "");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={24} className="animate-spin text-[var(--accent)]" />
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-16">
        <p className="text-[var(--text-muted)]">Album not found</p>
        <Link href="/admin/gallery" className="text-[var(--accent)] hover:underline mt-2 inline-block">
          Back to Gallery
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/gallery"
            className="p-2 rounded-lg hover:bg-[var(--border)] transition-colors"
          >
            <ArrowLeft size={20} className="text-[var(--text-muted)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text)]">{album.title}</h1>
            <p className="text-sm text-[var(--text-muted)]">
              {album.images.length} image{album.images.length !== 1 ? "s" : ""} in this album
            </p>
          </div>
        </div>
      </div>

      {/* Bulk Upload Section */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4 flex items-center gap-2">
          <Upload size={20} className="text-[var(--accent)]" />
          Upload Images
        </h2>

        <div className="space-y-4">
          {/* File Input */}
          <div
            className={cn(
              "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
              selectedFiles.length > 0
                ? "border-[var(--accent)] bg-[var(--accent)]/5"
                : "border-[var(--border)] hover:border-[var(--accent)]/50"
            )}
            onClick={() => document.getElementById("file-input")?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <ImageIcon size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text)] font-medium mb-1">
              {selectedFiles.length > 0
                ? `${selectedFiles.length} file${selectedFiles.length !== 1 ? "s" : ""} selected`
                : "Click or drag images to upload"}
            </p>
            <p className="text-sm text-[var(--text-muted)]">
              Supports JPG, PNG, GIF, WebP. Multiple files allowed.
            </p>
          </div>

          {/* Selected Files Preview */}
          {selectedFiles.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--text-muted)]">
                  Selected files:
                </p>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-xs text-red-500 hover:underline"
                >
                  Clear all
                </button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {selectedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden bg-[var(--bg)]"
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                      }}
                      className="absolute top-1 right-1 p-0.5 bg-red-500 text-white rounded-full"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[var(--text-muted)]">Uploading...</span>
                <span className="text-[var(--accent)] font-medium">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[var(--accent)] transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleBulkUpload}
            disabled={selectedFiles.length === 0 || uploading}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold bg-[var(--accent)] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Uploading {uploadProgress}%
              </>
            ) : (
              <>
                <Upload size={18} />
                Upload {selectedFiles.length} Image{selectedFiles.length !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Album Images Grid */}
      <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-6">
        <h2 className="text-lg font-semibold text-[var(--text)] mb-4">
          Album Images
        </h2>

        {album.images.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon size={48} className="mx-auto text-[var(--text-muted)] mb-4" />
            <p className="text-[var(--text-muted)]">No images in this album yet</p>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Upload images using the form above
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {album.images.map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square rounded-xl overflow-hidden bg-[var(--bg)] border border-[var(--border)]"
              >
                <Image
                  src={image.url}
                  alt={image.caption || "Gallery image"}
                  fill
                  className="object-cover"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                  {/* Actions */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Caption */}
                  <div>
                    {editingCaption === image.id ? (
                      <div className="flex gap-1">
                        <input
                          type="text"
                          value={captionText}
                          onChange={(e) => setCaptionText(e.target.value)}
                          placeholder="Add caption..."
                          className="flex-1 px-2 py-1 text-xs rounded bg-white text-gray-900"
                          autoFocus
                        />
                        <button
                          onClick={() => handleUpdateCaption(image.id)}
                          className="p-1 bg-[var(--accent)] text-white rounded"
                        >
                          <Save size={12} />
                        </button>
                        <button
                          onClick={() => setEditingCaption(null)}
                          className="p-1 bg-gray-500 text-white rounded"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => startEditCaption(image)}
                        className="text-xs text-white/80 hover:text-white text-left w-full truncate"
                      >
                        {image.caption || "Click to add caption..."}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
