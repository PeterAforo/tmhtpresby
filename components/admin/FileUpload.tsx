"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X, Loader2, FileText, Image as ImageIcon, Music, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  type?: "image" | "document" | "audio" | "video" | "any";
  placeholder?: string;
  className?: string;
}

export default function FileUpload({
  value,
  onChange,
  accept,
  type = "image",
  placeholder,
  className,
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const getAcceptTypes = () => {
    if (accept) return accept;
    switch (type) {
      case "image":
        return "image/*";
      case "document":
        return ".pdf,.doc,.docx,.txt";
      case "audio":
        return "audio/*";
      case "video":
        return "video/*";
      default:
        return "*/*";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "image":
        return <ImageIcon size={24} className="text-gray-400" />;
      case "document":
        return <FileText size={24} className="text-gray-400" />;
      case "audio":
        return <Music size={24} className="text-gray-400" />;
      case "video":
        return <Video size={24} className="text-gray-400" />;
      default:
        return <Upload size={24} className="text-gray-400" />;
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      onChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const isImage = type === "image" || (value && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(value));

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={getAcceptTypes()}
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="relative group">
          {isImage ? (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <Image
                src={value}
                alt="Uploaded file"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
              {getIcon()}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {value.split("/").pop()}
                </p>
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--accent)] hover:underline"
                >
                  View file
                </a>
              </div>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="mt-2 text-xs text-[var(--accent)] hover:underline"
          >
            Replace file
          </button>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex flex-col items-center justify-center p-6 rounded-lg border-2 border-dashed cursor-pointer transition-colors",
            dragOver
              ? "border-[var(--accent)] bg-[var(--accent)]/5"
              : "border-gray-300 hover:border-gray-400 bg-gray-50",
            uploading && "pointer-events-none opacity-60"
          )}
        >
          {uploading ? (
            <>
              <Loader2 size={24} className="animate-spin text-[var(--accent)] mb-2" />
              <p className="text-sm text-gray-500">Uploading...</p>
            </>
          ) : (
            <>
              {getIcon()}
              <p className="text-sm text-gray-600 mt-2">
                {placeholder || `Click or drag to upload ${type}`}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {type === "image" && "PNG, JPG, GIF up to 10MB"}
                {type === "document" && "PDF, DOC, DOCX up to 10MB"}
                {type === "audio" && "MP3, WAV, OGG up to 50MB"}
                {type === "video" && "MP4, WEBM up to 100MB"}
                {type === "any" && "Any file up to 100MB"}
              </p>
            </>
          )}
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
