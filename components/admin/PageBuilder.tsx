"use client";

import { useState, useCallback } from "react";
import {
  Type,
  Image as ImageIcon,
  Video,
  Layout,
  Columns,
  List,
  Quote,
  Code,
  MapPin,
  Calendar,
  Users,
  Heart,
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Settings,
  Eye,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

export interface BlockData {
  id: string;
  type: string;
  content: Record<string, unknown>;
}

interface PageBuilderProps {
  initialBlocks?: BlockData[];
  onChange: (blocks: BlockData[]) => void;
}

const BLOCK_TYPES = [
  { type: "heading", label: "Heading", icon: Type, category: "Text" },
  { type: "paragraph", label: "Paragraph", icon: AlignLeft, category: "Text" },
  { type: "image", label: "Image", icon: ImageIcon, category: "Media" },
  { type: "video", label: "Video", icon: Video, category: "Media" },
  { type: "gallery", label: "Gallery", icon: Layout, category: "Media" },
  { type: "columns", label: "Columns", icon: Columns, category: "Layout" },
  { type: "spacer", label: "Spacer", icon: Layout, category: "Layout" },
  { type: "divider", label: "Divider", icon: Layout, category: "Layout" },
  { type: "list", label: "List", icon: List, category: "Text" },
  { type: "quote", label: "Quote", icon: Quote, category: "Text" },
  { type: "code", label: "Code Block", icon: Code, category: "Advanced" },
  { type: "html", label: "Custom HTML", icon: Code, category: "Advanced" },
  { type: "map", label: "Map", icon: MapPin, category: "Embed" },
  { type: "events", label: "Events List", icon: Calendar, category: "Dynamic" },
  { type: "sermons", label: "Sermons List", icon: Users, category: "Dynamic" },
  { type: "donation", label: "Donation Form", icon: Heart, category: "Dynamic" },
  { type: "contact", label: "Contact Form", icon: Users, category: "Dynamic" },
  { type: "cta", label: "Call to Action", icon: Layout, category: "Marketing" },
  { type: "hero", label: "Hero Section", icon: Layout, category: "Marketing" },
  { type: "testimonials", label: "Testimonials", icon: Quote, category: "Marketing" },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function getDefaultContent(type: string): Record<string, unknown> {
  switch (type) {
    case "heading":
      return { text: "New Heading", level: "h2", align: "left" };
    case "paragraph":
      return { text: "Enter your text here...", align: "left" };
    case "image":
      return { url: "", alt: "", caption: "", width: "full" };
    case "video":
      return { url: "", type: "youtube", autoplay: false };
    case "gallery":
      return { images: [], columns: 3, gap: 4 };
    case "columns":
      return { columns: 2, gap: 6, content: [[], []] };
    case "spacer":
      return { height: 40 };
    case "divider":
      return { style: "solid", color: "#e5e7eb" };
    case "list":
      return { items: ["Item 1", "Item 2", "Item 3"], style: "bullet" };
    case "quote":
      return { text: "Quote text here...", author: "", source: "" };
    case "code":
      return { code: "", language: "javascript" };
    case "html":
      return { html: "" };
    case "map":
      return { address: "Lashibi, Accra, Ghana", zoom: 15 };
    case "events":
      return { count: 3, showPast: false };
    case "sermons":
      return { count: 3, showVideo: true };
    case "donation":
      return { title: "Support Our Ministry", showAmounts: true };
    case "contact":
      return { title: "Get in Touch", fields: ["name", "email", "message"] };
    case "cta":
      return {
        title: "Ready to Join Us?",
        subtitle: "We'd love to welcome you to our church family.",
        buttonText: "Learn More",
        buttonUrl: "/about",
        bgColor: "var(--accent)",
      };
    case "hero":
      return {
        title: "Welcome",
        subtitle: "Join us for worship",
        bgImage: "",
        buttonText: "Learn More",
        buttonUrl: "/about",
        overlay: true,
      };
    case "testimonials":
      return {
        items: [
          { text: "Amazing church community!", author: "John D.", role: "Member" },
        ],
      };
    default:
      return {};
  }
}

export default function PageBuilder({ initialBlocks = [], onChange }: PageBuilderProps) {
  const [blocks, setBlocks] = useState<BlockData[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
  const [showBlockPicker, setShowBlockPicker] = useState(false);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const updateBlocks = useCallback(
    (newBlocks: BlockData[]) => {
      setBlocks(newBlocks);
      onChange(newBlocks);
    },
    [onChange]
  );

  const addBlock = (type: string, index?: number) => {
    const newBlock: BlockData = {
      id: generateId(),
      type,
      content: getDefaultContent(type),
    };
    const newBlocks = [...blocks];
    const insertAt = index !== undefined ? index : blocks.length;
    newBlocks.splice(insertAt, 0, newBlock);
    updateBlocks(newBlocks);
    setSelectedBlock(newBlock.id);
    setShowBlockPicker(false);
    setInsertIndex(null);
  };

  const removeBlock = (id: string) => {
    updateBlocks(blocks.filter((b) => b.id !== id));
    if (selectedBlock === id) setSelectedBlock(null);
  };

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((b) => b.id === id);
    if (index === -1) return;
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === blocks.length - 1) return;

    const newBlocks = [...blocks];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    updateBlocks(newBlocks);
  };

  const updateBlockContent = (id: string, content: Record<string, unknown>) => {
    updateBlocks(
      blocks.map((b) => (b.id === id ? { ...b, content: { ...b.content, ...content } } : b))
    );
  };

  const selectedBlockData = blocks.find((b) => b.id === selectedBlock);

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[600px]">
      {/* Main Editor Area */}
      <div className="flex-1 overflow-auto bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Preview Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                previewMode
                  ? "bg-[var(--accent)] text-white"
                  : "bg-white text-gray-700 border border-gray-200"
              }`}
            >
              <Eye size={16} />
              {previewMode ? "Exit Preview" : "Preview"}
            </button>
          </div>

          {/* Blocks */}
          {blocks.length === 0 ? (
            <div
              className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center cursor-pointer hover:border-[var(--accent)] transition-colors"
              onClick={() => {
                setInsertIndex(0);
                setShowBlockPicker(true);
              }}
            >
              <Plus size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Click to add your first block</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div key={block.id}>
                  {/* Insert Button Above */}
                  {!previewMode && (
                    <div className="flex justify-center -mb-2 relative z-10">
                      <button
                        onClick={() => {
                          setInsertIndex(index);
                          setShowBlockPicker(true);
                        }}
                        className="p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:border-[var(--accent)] transition-colors opacity-0 hover:opacity-100"
                      >
                        <Plus size={16} className="text-gray-400" />
                      </button>
                    </div>
                  )}

                  {/* Block */}
                  <div
                    className={`relative bg-white rounded-xl border transition-all ${
                      previewMode
                        ? "border-transparent"
                        : selectedBlock === block.id
                        ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => !previewMode && setSelectedBlock(block.id)}
                  >
                    {/* Block Toolbar */}
                    {!previewMode && selectedBlock === block.id && (
                      <div className="absolute -top-3 left-4 flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-sm px-1 py-0.5 z-10">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(block.id, "up");
                          }}
                          disabled={index === 0}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            moveBlock(block.id, "down");
                          }}
                          disabled={index === blocks.length - 1}
                          className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"
                        >
                          <ChevronDown size={14} />
                        </button>
                        <div className="w-px h-4 bg-gray-200 mx-1" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeBlock(block.id);
                          }}
                          className="p-1 hover:bg-red-50 rounded text-red-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    )}

                    {/* Block Content */}
                    <div className="p-4">
                      <BlockRenderer block={block} previewMode={previewMode} />
                    </div>

                    {/* Drag Handle */}
                    {!previewMode && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full pr-2 opacity-0 group-hover:opacity-100">
                        <GripVertical size={16} className="text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {/* Insert Button at End */}
              {!previewMode && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={() => {
                      setInsertIndex(blocks.length);
                      setShowBlockPicker(true);
                    }}
                    className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:border-[var(--accent)] transition-colors"
                  >
                    <Plus size={20} className="text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {!previewMode && selectedBlockData && (
        <div className="w-80 bg-white border-l border-gray-200 overflow-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">
              {BLOCK_TYPES.find((t) => t.type === selectedBlockData.type)?.label || "Block"} Settings
            </h3>
            <button
              onClick={() => setSelectedBlock(null)}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          <div className="p-4">
            <BlockSettings
              block={selectedBlockData}
              onChange={(content) => updateBlockContent(selectedBlockData.id, content)}
            />
          </div>
        </div>
      )}

      {/* Block Picker Modal */}
      {showBlockPicker && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowBlockPicker(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Add Block</h3>
              <button
                onClick={() => setShowBlockPicker(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>
            <div className="p-4 overflow-auto max-h-[60vh]">
              {["Text", "Media", "Layout", "Marketing", "Dynamic", "Embed", "Advanced"].map(
                (category) => {
                  const categoryBlocks = BLOCK_TYPES.filter((b) => b.category === category);
                  if (categoryBlocks.length === 0) return null;
                  return (
                    <div key={category} className="mb-6">
                      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                        {category}
                      </h4>
                      <div className="grid grid-cols-3 gap-2">
                        {categoryBlocks.map((blockType) => (
                          <button
                            key={blockType.type}
                            onClick={() => addBlock(blockType.type, insertIndex ?? undefined)}
                            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 transition-colors"
                          >
                            <blockType.icon size={24} className="text-gray-600" />
                            <span className="text-sm text-gray-700">{blockType.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BlockRenderer({ block, previewMode }: { block: BlockData; previewMode: boolean }) {
  const { type, content } = block;

  switch (type) {
    case "heading":
      const level = (content.level as string) || "h2";
      const headingText = (content.text as string) || "Heading";
      const headingClass = `font-bold ${
        level === "h1"
          ? "text-4xl"
          : level === "h2"
          ? "text-3xl"
          : level === "h3"
          ? "text-2xl"
          : "text-xl"
      } text-${content.align || "left"}`;
      
      if (level === "h1") return <h1 className={headingClass}>{headingText}</h1>;
      if (level === "h3") return <h3 className={headingClass}>{headingText}</h3>;
      if (level === "h4") return <h4 className={headingClass}>{headingText}</h4>;
      return <h2 className={headingClass}>{headingText}</h2>;

    case "paragraph":
      return (
        <p className={`text-gray-700 text-${content.align || "left"}`}>
          {(content.text as string) || "Paragraph text..."}
        </p>
      );

    case "image":
      return content.url ? (
        <figure>
          <img
            src={content.url as string}
            alt={(content.alt as string) || ""}
            className={`rounded-lg ${
              content.width === "full" ? "w-full" : content.width === "medium" ? "max-w-lg mx-auto" : "max-w-sm mx-auto"
            }`}
          />
          {typeof content.caption === "string" && content.caption && (
            <figcaption className="text-sm text-gray-500 text-center mt-2">
              {content.caption}
            </figcaption>
          )}
        </figure>
      ) : (
        <div className="bg-gray-100 rounded-lg p-8 text-center">
          <ImageIcon size={32} className="mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Click to add an image</p>
        </div>
      );

    case "spacer":
      return <div style={{ height: `${content.height || 40}px` }} />;

    case "divider":
      return (
        <hr
          className="border-t"
          style={{
            borderStyle: (content.style as string) || "solid",
            borderColor: (content.color as string) || "#e5e7eb",
          }}
        />
      );

    case "quote":
      const quoteText = String(content.text || "Quote...");
      const quoteAuthor = typeof content.author === "string" ? content.author : "";
      const quoteSource = typeof content.source === "string" ? content.source : "";
      return (
        <blockquote className="border-l-4 border-[var(--accent)] pl-4 py-2 italic">
          <p className="text-lg text-gray-700">{quoteText}</p>
          {quoteAuthor && (
            <footer className="text-sm text-gray-500 mt-2">
              — {quoteAuthor}
              {quoteSource && `, ${quoteSource}`}
            </footer>
          )}
        </blockquote>
      );

    case "list":
      const listItems = (content.items as string[]) || [];
      const isNumbered = content.style === "numbered";
      return isNumbered ? (
        <ol className="list-decimal pl-5 space-y-1">
          {listItems.map((item, i) => (
            <li key={i} className="text-gray-700">{item}</li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc pl-5 space-y-1">
          {listItems.map((item, i) => (
            <li key={i} className="text-gray-700">{item}</li>
          ))}
        </ul>
      );

    case "cta":
      return (
        <div
          className="rounded-xl p-8 text-center text-white"
          style={{ backgroundColor: (content.bgColor as string) || "var(--accent)" }}
        >
          <h3 className="text-2xl font-bold mb-2">{(content.title as string) || "Call to Action"}</h3>
          <p className="text-white/90 mb-4">{(content.subtitle as string) || "Subtitle here..."}</p>
          <a
            href={(content.buttonUrl as string) || "#"}
            className="inline-block px-6 py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            {(content.buttonText as string) || "Learn More"}
          </a>
        </div>
      );

    case "hero":
      const heroBgImage = typeof content.bgImage === "string" ? content.bgImage : undefined;
      const showOverlay = Boolean(content.overlay) && Boolean(heroBgImage);
      return (
        <div
          className="relative rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center text-center text-white"
          style={{
            backgroundImage: heroBgImage ? `url(${heroBgImage})` : undefined,
            backgroundColor: heroBgImage ? undefined : "var(--accent)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {showOverlay && (
            <div className="absolute inset-0 bg-black/50" />
          )}
          <div className="relative z-10 p-8">
            <h2 className="text-4xl font-bold mb-2">{(content.title as string) || "Hero Title"}</h2>
            <p className="text-xl text-white/90 mb-6">{(content.subtitle as string) || "Subtitle"}</p>
            <a
              href={(content.buttonUrl as string) || "#"}
              className="inline-block px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              {(content.buttonText as string) || "Learn More"}
            </a>
          </div>
        </div>
      );

    default:
      return (
        <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
          {type} block
        </div>
      );
  }
}

function BlockSettings({
  block,
  onChange,
}: {
  block: BlockData;
  onChange: (content: Record<string, unknown>) => void;
}) {
  const { type, content } = block;

  switch (type) {
    case "heading":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <input
              type="text"
              value={(content.text as string) || ""}
              onChange={(e) => onChange({ text: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
            <select
              value={(content.level as string) || "h2"}
              onChange={(e) => onChange({ level: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <div className="flex gap-1">
              {[
                { value: "left", icon: AlignLeft },
                { value: "center", icon: AlignCenter },
                { value: "right", icon: AlignRight },
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => onChange({ align: value })}
                  className={`p-2 rounded-lg ${
                    content.align === value ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case "paragraph":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Text</label>
            <textarea
              value={(content.text as string) || ""}
              onChange={(e) => onChange({ text: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alignment</label>
            <div className="flex gap-1">
              {[
                { value: "left", icon: AlignLeft },
                { value: "center", icon: AlignCenter },
                { value: "right", icon: AlignRight },
              ].map(({ value, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => onChange({ align: value })}
                  className={`p-2 rounded-lg ${
                    content.align === value ? "bg-[var(--accent)]/10 text-[var(--accent)]" : "hover:bg-gray-100"
                  }`}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case "image":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input
              type="text"
              value={(content.url as string) || ""}
              onChange={(e) => onChange({ url: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alt Text</label>
            <input
              type="text"
              value={(content.alt as string) || ""}
              onChange={(e) => onChange({ alt: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
            <input
              type="text"
              value={(content.caption as string) || ""}
              onChange={(e) => onChange({ caption: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
            <select
              value={(content.width as string) || "full"}
              onChange={(e) => onChange({ width: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            >
              <option value="full">Full Width</option>
              <option value="medium">Medium</option>
              <option value="small">Small</option>
            </select>
          </div>
        </div>
      );

    case "spacer":
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
          <input
            type="number"
            value={(content.height as number) || 40}
            onChange={(e) => onChange({ height: parseInt(e.target.value) || 40 })}
            min={10}
            max={200}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
          />
        </div>
      );

    case "quote":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quote Text</label>
            <textarea
              value={(content.text as string) || ""}
              onChange={(e) => onChange({ text: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
            <input
              type="text"
              value={(content.author as string) || ""}
              onChange={(e) => onChange({ author: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
        </div>
      );

    case "cta":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={(content.subtitle as string) || ""}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={(content.buttonText as string) || ""}
              onChange={(e) => onChange({ buttonText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
            <input
              type="text"
              value={(content.buttonUrl as string) || ""}
              onChange={(e) => onChange({ buttonUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
            <input
              type="color"
              value={(content.bgColor as string) || "#3D4DB7"}
              onChange={(e) => onChange({ bgColor: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      );

    case "hero":
      return (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={(content.title as string) || ""}
              onChange={(e) => onChange({ title: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
            <input
              type="text"
              value={(content.subtitle as string) || ""}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Background Image URL</label>
            <input
              type="text"
              value={(content.bgImage as string) || ""}
              onChange={(e) => onChange({ bgImage: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
            <input
              type="text"
              value={(content.buttonText as string) || ""}
              onChange={(e) => onChange({ buttonText: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Button URL</label>
            <input
              type="text"
              value={(content.buttonUrl as string) || ""}
              onChange={(e) => onChange({ buttonUrl: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 focus:border-[var(--accent)]"
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={(content.overlay as boolean) || false}
              onChange={(e) => onChange({ overlay: e.target.checked })}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Dark Overlay</span>
          </label>
        </div>
      );

    default:
      return (
        <p className="text-sm text-gray-500">No settings available for this block type.</p>
      );
  }
}
