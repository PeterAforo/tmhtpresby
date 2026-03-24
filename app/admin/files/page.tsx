"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  Upload,
  FolderPlus,
  Folder,
  File,
  Image as ImageIcon,
  Video,
  FileText,
  Trash2,
  Download,
  Copy,
  Check,
  X,
  ChevronRight,
  Home,
  Grid,
  List,
  Search,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface FileItem {
  publicId: string;
  url: string;
  format: string;
  size: number;
  width?: number;
  height?: number;
  createdAt: string;
}

interface FolderItem {
  name: string;
  path: string;
}

export default function FileManagerPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [currentPath, setCurrentPath] = useState("tmht-presby");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/files?folder=${encodeURIComponent(currentPath)}`);
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
        setFolders(data.folders || []);
      }
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPath]);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadFiles = e.target.files;
    if (!uploadFiles || uploadFiles.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(uploadFiles)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", currentPath);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          console.error("Upload failed for:", file.name);
        }
      }
      await fetchFiles();
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return;

    try {
      const res = await fetch("/api/admin/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });

      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.publicId !== publicId));
        setSelectedFiles((prev) => {
          const next = new Set(prev);
          next.delete(publicId);
          return next;
        });
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedFiles.size} files?`)) return;

    for (const publicId of selectedFiles) {
      await handleDelete(publicId);
    }
    setSelectedFiles(new Set());
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    try {
      const res = await fetch("/api/admin/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "createFolder",
          folderPath: `${currentPath}/${newFolderName.trim()}`,
        }),
      });

      if (res.ok) {
        setShowNewFolderModal(false);
        setNewFolderName("");
        await fetchFiles();
      }
    } catch (error) {
      console.error("Create folder error:", error);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const navigateToFolder = (path: string) => {
    setCurrentPath(path);
    setSelectedFiles(new Set());
  };

  const breadcrumbs = currentPath.split("/").filter(Boolean);

  const filteredFiles = files.filter((f) =>
    f.publicId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (format: string) => {
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(format)) {
      return <ImageIcon size={24} className="text-blue-500" />;
    }
    if (["mp4", "webm", "mov", "avi"].includes(format)) {
      return <Video size={24} className="text-purple-500" />;
    }
    if (["pdf", "doc", "docx", "txt"].includes(format)) {
      return <FileText size={24} className="text-red-500" />;
    }
    return <File size={24} className="text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">File Manager</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload and manage your media files
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowNewFolderModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <FolderPlus size={18} />
            New Folder
          </button>
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity cursor-pointer">
            <Upload size={18} />
            Upload Files
            <input
              type="file"
              multiple
              onChange={handleUpload}
              className="hidden"
              accept="image/*,video/*,.pdf,.doc,.docx"
            />
          </label>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 flex-1 overflow-x-auto">
            <button
              onClick={() => navigateToFolder("tmht-presby")}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Home size={18} className="text-gray-600" />
            </button>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center">
                <ChevronRight size={16} className="text-gray-400" />
                <button
                  onClick={() =>
                    navigateToFolder(breadcrumbs.slice(0, index + 1).join("/"))
                  }
                  className="px-2 py-1 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors whitespace-nowrap"
                >
                  {crumb}
                </button>
              </div>
            ))}
          </div>

          {/* Search & View Toggle */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-48 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
              />
            </div>
            <button
              onClick={fetchFiles}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Refresh"
            >
              <RefreshCw size={18} className={`text-gray-600 ${loading ? "animate-spin" : ""}`} />
            </button>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                <Grid size={18} className="text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-gray-100" : "hover:bg-gray-50"}`}
              >
                <List size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedFiles.size > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {selectedFiles.size} file(s) selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={16} />
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedFiles(new Set())}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear Selection
            </button>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
          <Loader2 size={20} className="text-blue-500 animate-spin" />
          <span className="text-sm text-blue-700">Uploading files...</span>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Loader2 size={32} className="mx-auto text-gray-400 animate-spin" />
          <p className="text-sm text-gray-500 mt-2">Loading files...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {/* Folders */}
          {folders.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3">Folders</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {folders.map((folder) => (
                  <button
                    key={folder.path}
                    onClick={() => navigateToFolder(folder.path)}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors text-left"
                  >
                    <Folder size={24} className="text-amber-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {folder.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Files */}
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <ImageIcon size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No files yet</h3>
              <p className="text-sm text-gray-500">
                Upload files to get started
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.publicId}
                  className={`group relative rounded-lg border overflow-hidden cursor-pointer transition-all ${
                    selectedFiles.has(file.publicId)
                      ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setPreviewFile(file)}
                >
                  {/* Checkbox */}
                  <div
                    className="absolute top-2 left-2 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFiles((prev) => {
                        const next = new Set(prev);
                        if (next.has(file.publicId)) {
                          next.delete(file.publicId);
                        } else {
                          next.add(file.publicId);
                        }
                        return next;
                      });
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedFiles.has(file.publicId)
                          ? "bg-[var(--accent)] border-[var(--accent)]"
                          : "bg-white/80 border-gray-300 group-hover:border-gray-400"
                      }`}
                    >
                      {selectedFiles.has(file.publicId) && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    {["jpg", "jpeg", "png", "gif", "webp"].includes(file.format) ? (
                      <Image
                        src={file.url}
                        alt=""
                        width={200}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getFileIcon(file.format)
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2">
                    <p className="text-xs text-gray-700 truncate">
                      {file.publicId.split("/").pop()}
                    </p>
                    <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                  </div>

                  {/* Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(file.url);
                      }}
                      className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                      title="Copy URL"
                    >
                      {copiedUrl === file.url ? (
                        <Check size={14} className="text-green-500" />
                      ) : (
                        <Copy size={14} className="text-gray-600" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.publicId);
                      }}
                      className="p-1.5 bg-white rounded-lg shadow-sm hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <div
                  key={file.publicId}
                  className={`flex items-center gap-4 p-3 hover:bg-gray-50 cursor-pointer ${
                    selectedFiles.has(file.publicId) ? "bg-[var(--accent)]/5" : ""
                  }`}
                  onClick={() => setPreviewFile(file)}
                >
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFiles((prev) => {
                        const next = new Set(prev);
                        if (next.has(file.publicId)) {
                          next.delete(file.publicId);
                        } else {
                          next.add(file.publicId);
                        }
                        return next;
                      });
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        selectedFiles.has(file.publicId)
                          ? "bg-[var(--accent)] border-[var(--accent)]"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedFiles.has(file.publicId) && (
                        <Check size={12} className="text-white" />
                      )}
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {["jpg", "jpeg", "png", "gif", "webp"].includes(file.format) ? (
                      <Image
                        src={file.url}
                        alt=""
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getFileIcon(file.format)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.publicId.split("/").pop()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                      {file.width && file.height && ` • ${file.width}×${file.height}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(file.url);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Copy URL"
                    >
                      {copiedUrl === file.url ? (
                        <Check size={16} className="text-green-500" />
                      ) : (
                        <Copy size={16} className="text-gray-400" />
                      )}
                    </button>
                    <a
                      href={file.url}
                      download
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                      title="Download"
                    >
                      <Download size={16} className="text-gray-400" />
                    </a>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file.publicId);
                      }}
                      className="p-2 hover:bg-red-50 rounded-lg"
                      title="Delete"
                    >
                      <Trash2 size={16} className="text-red-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
              autoFocus
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowNewFolderModal(false);
                  setNewFolderName("");
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 bg-[var(--accent)] text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPreviewFile(null)}
        >
          <button
            onClick={() => setPreviewFile(null)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-lg"
          >
            <X size={24} />
          </button>
          <div
            className="max-w-4xl max-h-[80vh] mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {["jpg", "jpeg", "png", "gif", "webp"].includes(previewFile.format) ? (
              <Image
                src={previewFile.url}
                alt=""
                width={previewFile.width || 800}
                height={previewFile.height || 600}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            ) : (
              <div className="bg-white rounded-xl p-8 text-center">
                {getFileIcon(previewFile.format)}
                <p className="mt-4 text-gray-900 font-medium">
                  {previewFile.publicId.split("/").pop()}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {formatFileSize(previewFile.size)}
                </p>
                <a
                  href={previewFile.url}
                  download
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-[var(--accent)] text-white rounded-lg"
                >
                  <Download size={18} />
                  Download
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
