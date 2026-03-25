"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
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
  Eye,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sliders,
  Link as LinkIcon,
  MessageSquare,
  Play,
  Church,
  BookOpen,
  Star,
} from "lucide-react";

export interface BlockData {
  id: string;
  type: string;
  content: Record<string, unknown>;
}

interface PageBuilderProps {
  initialBlocks?: BlockData[];
  onChange: (blocks: BlockData[]) => void;
  pageType?: "home" | "standard";
}

const BLOCK_TYPES = [
  { type: "hero-slider", label: "Hero Slider", icon: Sliders, category: "Page Sections", description: "Full-width hero with slides" },
  { type: "page-hero", label: "Page Hero", icon: Layout, category: "Page Sections", description: "Single hero with background" },
  { type: "quick-links", label: "Quick Links", icon: LinkIcon, category: "Page Sections", description: "Three-column cards" },
  { type: "about-section", label: "About Section", icon: Users, category: "Page Sections", description: "About with image" },
  { type: "testimonials-section", label: "Testimonials", icon: MessageSquare, category: "Page Sections", description: "Testimonials carousel" },
  { type: "live-stream", label: "Live Stream", icon: Play, category: "Page Sections", description: "YouTube section" },
  { type: "ministries-preview", label: "Ministries", icon: Church, category: "Page Sections", description: "Ministries grid" },
  { type: "cta-banner", label: "CTA Banner", icon: Heart, category: "Page Sections", description: "Call-to-action" },
  { type: "heading", label: "Heading", icon: Type, category: "Content" },
  { type: "paragraph", label: "Paragraph", icon: AlignLeft, category: "Content" },
  { type: "image", label: "Image", icon: ImageIcon, category: "Content" },
  { type: "video", label: "Video", icon: Video, category: "Content" },
  { type: "quote", label: "Quote", icon: Quote, category: "Content" },
  { type: "list", label: "List", icon: List, category: "Content" },
  { type: "spacer", label: "Spacer", icon: Layout, category: "Layout" },
  { type: "divider", label: "Divider", icon: Layout, category: "Layout" },
  { type: "events-list", label: "Events", icon: Calendar, category: "Dynamic" },
  { type: "sermons-list", label: "Sermons", icon: Play, category: "Dynamic" },
  { type: "blog-posts", label: "Blog Posts", icon: BookOpen, category: "Dynamic" },
  { type: "contact-form", label: "Contact Form", icon: Users, category: "Forms" },
  { type: "prayer-request", label: "Prayer Request", icon: Heart, category: "Forms" },
  { type: "map", label: "Map", icon: MapPin, category: "Embed" },
  { type: "html", label: "Custom HTML", icon: Code, category: "Embed" },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function getDefaultContent(type: string): Record<string, unknown> {
  switch (type) {
    case "hero-slider":
      return {
        slides: [{ id: generateId(), image: "/img/pictures/2/001.jpg", headline: "Welcome", subline: "Join us for worship", accent: "Sunday 9AM" }],
        autoplaySpeed: 6000,
        height: "600px",
      };
    case "page-hero":
      return { title: "Page Title", subtitle: "", backgroundImage: "/img/pictures/2/001.jpg", overlayColor: "rgba(12,21,41,0.85)", height: "400px", alignment: "center" };
    case "quick-links":
      return {
        links: [
          { id: generateId(), icon: "Church", title: "Our Church", description: "Learn about us", href: "/about", variant: "white" },
          { id: generateId(), icon: "LayoutGrid", title: "Ministries", description: "Get involved", href: "/ministries", variant: "red" },
          { id: generateId(), icon: "Calendar", title: "Events", description: "Stay connected", href: "/events", variant: "white" },
        ],
      };
    case "about-section":
      return {
        label: "About Our Church",
        heading: "A Community Built on Faith",
        description: "We believe in the transformative power of God's love.",
        image: "/img/about/3.png",
        stats: [{ value: "1500+", label: "Members" }, { value: "25+", label: "Years" }],
        features: [
          { icon: "Heart", title: "Community", description: "A welcoming family" },
          { icon: "Users", title: "Fellowship", description: "Building relationships" },
        ],
      };
    case "testimonials-section":
      return {
        label: "TESTIMONIALS",
        heading: "What Our Congregation Say",
        testimonials: [{ id: generateId(), quote: "Amazing church!", name: "John", role: "Member", image: "", rating: 5 }],
      };
    case "live-stream":
      return {
        label: "LIVE & ON-DEMAND",
        heading: "Watch Our Services",
        description: "Join us live every Sunday",
        featuredVideo: { videoId: "", title: "Sunday Service", date: "" },
        youtubeChannel: "https://www.youtube.com/@tmhtpresby",
      };
    case "ministries-preview":
      return { label: "OUR MINISTRIES", heading: "Find Your Place", showCount: 6, ctaUrl: "/ministries" };
    case "cta-banner":
      return { heading: "Ready to Join Us?", description: "We'd love to welcome you", buttonText: "Get Started", buttonUrl: "/contact", backgroundColor: "var(--accent)" };
    case "heading":
      return { text: "Heading", level: "h2", align: "left" };
    case "paragraph":
      return { text: "Enter text here...", align: "left" };
    case "image":
      return { url: "", alt: "", caption: "", width: "full" };
    case "video":
      return { url: "", type: "youtube" };
    case "quote":
      return { text: "Quote...", author: "" };
    case "list":
      return { items: ["Item 1", "Item 2"], style: "bullet" };
    case "spacer":
      return { height: 40 };
    case "divider":
      return { style: "solid", color: "#e5e7eb" };
    case "events-list":
      return { count: 3, showPast: false };
    case "sermons-list":
      return { count: 4, showVideo: true };
    case "blog-posts":
      return { count: 3 };
    case "contact-form":
      return { title: "Contact Us", fields: ["name", "email", "message"] };
    case "prayer-request":
      return { title: "Prayer Request", description: "Share your prayer needs" };
    case "map":
      return { address: "Lashibi, Accra, Ghana", zoom: 15 };
    case "html":
      return { html: "" };
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

  const updateBlocks = useCallback((newBlocks: BlockData[]) => {
    setBlocks(newBlocks);
    onChange(newBlocks);
  }, [onChange]);

  const addBlock = (type: string, index?: number) => {
    const newBlock: BlockData = { id: generateId(), type, content: getDefaultContent(type) };
    const newBlocks = [...blocks];
    newBlocks.splice(index ?? blocks.length, 0, newBlock);
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
    updateBlocks(blocks.map((b) => (b.id === id ? { ...b, content: { ...b.content, ...content } } : b)));
  };

  const selectedBlockData = blocks.find((b) => b.id === selectedBlock);

  return (
    <div className="flex h-[calc(100vh-200px)] min-h-[600px]">
      <div className="flex-1 overflow-auto bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-end mb-4">
            <button onClick={() => setPreviewMode(!previewMode)} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${previewMode ? "bg-[var(--accent)] text-white" : "bg-white text-gray-700 border border-gray-200"}`}>
              <Eye size={16} />
              {previewMode ? "Exit Preview" : "Preview"}
            </button>
          </div>

          {blocks.length === 0 ? (
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center cursor-pointer hover:border-[var(--accent)]" onClick={() => { setInsertIndex(0); setShowBlockPicker(true); }}>
              <Plus size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500">Click to add your first block</p>
            </div>
          ) : (
            <div className="space-y-4">
              {blocks.map((block, index) => (
                <div key={block.id}>
                  {!previewMode && (
                    <div className="flex justify-center -mb-2 relative z-10">
                      <button onClick={() => { setInsertIndex(index); setShowBlockPicker(true); }} className="p-1 bg-white border border-gray-200 rounded-full shadow-sm hover:border-[var(--accent)] opacity-0 hover:opacity-100">
                        <Plus size={16} className="text-gray-400" />
                      </button>
                    </div>
                  )}
                  <div className={`relative bg-white rounded-xl border ${previewMode ? "border-transparent" : selectedBlock === block.id ? "border-[var(--accent)] ring-2 ring-[var(--accent)]/20" : "border-gray-200 hover:border-gray-300"}`} onClick={() => !previewMode && setSelectedBlock(block.id)}>
                    {!previewMode && selectedBlock === block.id && (
                      <div className="absolute -top-3 left-4 flex items-center gap-1 bg-white border border-gray-200 rounded-lg shadow-sm px-1 py-0.5 z-10">
                        <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "up"); }} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ChevronUp size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); moveBlock(block.id, "down"); }} disabled={index === blocks.length - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ChevronDown size={14} /></button>
                        <div className="w-px h-4 bg-gray-200 mx-1" />
                        <button onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }} className="p-1 hover:bg-red-50 rounded text-red-500"><Trash2 size={14} /></button>
                      </div>
                    )}
                    <div className="p-4"><BlockRenderer block={block} /></div>
                  </div>
                </div>
              ))}
              {!previewMode && (
                <div className="flex justify-center pt-2">
                  <button onClick={() => { setInsertIndex(blocks.length); setShowBlockPicker(true); }} className="p-2 bg-white border border-gray-200 rounded-full shadow-sm hover:border-[var(--accent)]">
                    <Plus size={20} className="text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {!previewMode && selectedBlockData && (
        <div className="w-96 bg-white border-l border-gray-200 overflow-auto">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">{BLOCK_TYPES.find((t) => t.type === selectedBlockData.type)?.label || "Block"} Settings</h3>
            <button onClick={() => setSelectedBlock(null)} className="p-1 hover:bg-gray-100 rounded"><X size={18} className="text-gray-500" /></button>
          </div>
          <div className="p-4"><BlockSettings block={selectedBlockData} onChange={(content) => updateBlockContent(selectedBlockData.id, content)} /></div>
        </div>
      )}

      {showBlockPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBlockPicker(false)}>
          <div className="bg-white rounded-xl w-full max-w-3xl max-h-[80vh] overflow-hidden mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Add Block</h3>
              <button onClick={() => setShowBlockPicker(false)} className="p-1 hover:bg-gray-100 rounded"><X size={18} className="text-gray-500" /></button>
            </div>
            <div className="p-4 overflow-auto max-h-[60vh]">
              {["Page Sections", "Content", "Layout", "Dynamic", "Forms", "Embed"].map((category) => {
                const categoryBlocks = BLOCK_TYPES.filter((b) => b.category === category);
                if (categoryBlocks.length === 0) return null;
                return (
                  <div key={category} className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">{category}</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {categoryBlocks.map((blockType) => (
                        <button key={blockType.type} onClick={() => addBlock(blockType.type, insertIndex ?? undefined)} className="flex flex-col items-start gap-1 p-3 rounded-lg border border-gray-200 hover:border-[var(--accent)] hover:bg-[var(--accent)]/5 text-left">
                          <div className="flex items-center gap-2">
                            <blockType.icon size={18} className="text-gray-600" />
                            <span className="text-sm font-medium text-gray-700">{blockType.label}</span>
                          </div>
                          {blockType.description && <span className="text-xs text-gray-500">{blockType.description}</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BlockRenderer({ block }: { block: BlockData }) {
  const { type, content } = block;
  const blockInfo = BLOCK_TYPES.find((b) => b.type === type);

  switch (type) {
    case "hero-slider":
      const slides = (content.slides as Array<{ id: string; image: string; headline: string; subline: string; accent: string }>) || [];
      return (
        <div className="relative rounded-lg overflow-hidden bg-gray-900 min-h-[180px]">
          {slides.length > 0 && slides[0].image ? (
            <div className="relative aspect-[21/9]">
              <Image src={slides[0].image} alt={slides[0].headline} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
              <div className="absolute inset-0 flex items-center p-6">
                <div className="text-white max-w-lg">
                  <span className="inline-block px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold mb-2">{slides[0].accent}</span>
                  <h2 className="text-xl font-bold mb-1">{slides[0].headline}</h2>
                  <p className="text-white/80 text-sm">{slides[0].subline}</p>
                </div>
              </div>
              {slides.length > 1 && <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">{slides.map((_, i) => <div key={i} className={`w-6 h-1 rounded-full ${i === 0 ? 'bg-white' : 'bg-white/30'}`} />)}</div>}
            </div>
          ) : (
            <div className="aspect-[21/9] flex items-center justify-center text-white/50"><Sliders size={32} className="mr-2" /> Add slides</div>
          )}
        </div>
      );

    case "page-hero":
      return (
        <div className="relative rounded-lg overflow-hidden min-h-[120px]" style={{ backgroundImage: content.backgroundImage ? `url(${content.backgroundImage})` : undefined, backgroundColor: !content.backgroundImage ? '#1a1a2e' : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}>
          <div className="absolute inset-0" style={{ backgroundColor: (content.overlayColor as string) || 'rgba(12,21,41,0.85)' }} />
          <div className={`relative z-10 p-6 text-white text-${content.alignment || 'center'}`}>
            <h2 className="text-xl font-bold mb-1">{(content.title as string) || 'Page Title'}</h2>
            {typeof content.subtitle === 'string' && content.subtitle && <p className="text-white/80 text-sm">{content.subtitle}</p>}
          </div>
        </div>
      );

    case "quick-links":
      const links = (content.links as Array<{ id: string; title: string; description: string; variant: string }>) || [];
      return (
        <div className="grid grid-cols-3 gap-0 rounded-lg overflow-hidden">
          {links.map((link, i) => (
            <div key={link.id || i} className={`p-4 text-center ${link.variant === 'red' ? 'bg-red-600 text-white' : 'bg-white border border-gray-200'}`}>
              <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center mb-2 ${link.variant === 'red' ? 'bg-white/10' : 'bg-red-50'}`}>
                <Church size={18} className={link.variant === 'red' ? 'text-white' : 'text-red-600'} />
              </div>
              <h4 className="font-semibold text-sm mb-1">{link.title}</h4>
              <p className={`text-xs ${link.variant === 'red' ? 'text-white/80' : 'text-gray-500'}`}>{link.description}</p>
            </div>
          ))}
        </div>
      );

    case "about-section":
      return (
        <div className="bg-gradient-to-b from-amber-50 to-white rounded-lg p-4">
          <div className="flex gap-4">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              {typeof content.image === 'string' && content.image && <Image src={content.image} alt="About" width={96} height={96} className="object-cover" />}
            </div>
            <div className="flex-1">
              <span className="text-red-600 text-xs font-semibold uppercase">{content.label as string}</span>
              <h3 className="text-lg font-bold text-gray-900 mt-1 mb-2">{content.heading as string}</h3>
              <p className="text-gray-600 text-xs line-clamp-2">{content.description as string}</p>
            </div>
          </div>
        </div>
      );

    case "testimonials-section":
      const testimonials = (content.testimonials as Array<{ quote: string; name: string; rating: number }>) || [];
      return (
        <div className="bg-white rounded-lg p-4">
          <div className="text-center mb-3">
            <span className="text-red-600 text-xs font-semibold">{content.label as string}</span>
            <h3 className="text-lg font-bold text-gray-900">{content.heading as string}</h3>
          </div>
          {testimonials[0] && (
            <div className="flex gap-2 items-start">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0" />
              <div>
                <div className="flex gap-0.5 mb-1">{[1,2,3,4,5].map((s) => <Star key={s} size={10} className={s <= testimonials[0].rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />)}</div>
                <p className="text-xs text-gray-600 line-clamp-2">{testimonials[0].quote}</p>
                <p className="text-xs font-semibold mt-1">{testimonials[0].name}</p>
              </div>
            </div>
          )}
        </div>
      );

    case "live-stream":
      return (
        <div className="bg-gray-100 rounded-lg p-4">
          <div className="text-center mb-3">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-xs font-semibold"><Play size={10} /> {content.label as string}</span>
            <h3 className="text-lg font-bold text-gray-900 mt-1">{content.heading as string}</h3>
          </div>
          <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
            <Play size={32} className="text-white" />
          </div>
        </div>
      );

    case "ministries-preview":
      return (
        <div className="bg-white rounded-lg p-4">
          <div className="text-center mb-3">
            <span className="text-red-600 text-xs font-semibold uppercase">{content.label as string}</span>
            <h3 className="text-lg font-bold text-gray-900">{content.heading as string}</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[1,2,3].map((i) => <div key={i} className="bg-gray-100 rounded p-3 text-center"><Church size={18} className="mx-auto text-gray-400" /></div>)}
          </div>
          <p className="text-center text-xs text-gray-500 mt-2">Shows {String(content.showCount || 6)} ministries</p>
        </div>
      );

    case "cta-banner":
      return (
        <div className="rounded-lg p-6 text-center text-white" style={{ backgroundColor: (content.backgroundColor as string) || 'var(--accent)' }}>
          <h3 className="text-lg font-bold mb-1">{content.heading as string}</h3>
          <p className="text-white/80 text-sm mb-3">{content.description as string}</p>
          <button className="px-4 py-2 bg-white text-gray-900 rounded-lg font-medium text-sm">{content.buttonText as string}</button>
        </div>
      );

    case "heading":
      const level = (content.level as string) || "h2";
      const headingClass = `font-bold ${level === "h1" ? "text-3xl" : level === "h2" ? "text-2xl" : "text-xl"} text-${content.align || "left"}`;
      return <h2 className={headingClass}>{(content.text as string) || "Heading"}</h2>;

    case "paragraph":
      return <p className={`text-gray-700 text-${content.align || "left"}`}>{(content.text as string) || "Paragraph..."}</p>;

    case "image":
      return content.url ? <img src={content.url as string} alt={(content.alt as string) || ""} className="rounded-lg w-full" /> : (
        <div className="bg-gray-100 rounded-lg p-6 text-center"><ImageIcon size={24} className="mx-auto text-gray-400 mb-1" /><p className="text-sm text-gray-500">Add image</p></div>
      );

    case "video":
      return <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center"><Play size={32} className="text-white" /></div>;

    case "quote":
      return (
        <blockquote className="border-l-4 border-[var(--accent)] pl-4 py-2 italic">
          <p className="text-gray-700">{(content.text as string) || "Quote..."}</p>
          {typeof content.author === 'string' && content.author && <footer className="text-sm text-gray-500 mt-1">— {content.author}</footer>}
        </blockquote>
      );

    case "list":
      return <ul className="list-disc pl-5 space-y-1">{((content.items as string[]) || []).map((item, i) => <li key={i} className="text-gray-700">{item}</li>)}</ul>;

    case "spacer":
      return <div style={{ height: `${content.height || 40}px` }} className="bg-gray-50 rounded border border-dashed border-gray-200" />;

    case "divider":
      return <hr className="border-t" style={{ borderStyle: (content.style as string) || "solid", borderColor: (content.color as string) || "#e5e7eb" }} />;

    case "events-list":
      return <div className="bg-gray-50 rounded-lg p-4"><Calendar size={18} className="text-gray-600 mb-2" /><span className="font-semibold">Events</span><p className="text-xs text-gray-500">Shows {String(content.count || 3)} events</p></div>;

    case "sermons-list":
      return <div className="bg-gray-50 rounded-lg p-4"><Play size={18} className="text-gray-600 mb-2" /><span className="font-semibold">Sermons</span><p className="text-xs text-gray-500">Shows {String(content.count || 4)} sermons</p></div>;

    case "blog-posts":
      return <div className="bg-gray-50 rounded-lg p-4"><BookOpen size={18} className="text-gray-600 mb-2" /><span className="font-semibold">Blog Posts</span><p className="text-xs text-gray-500">Shows {String(content.count || 3)} posts</p></div>;

    case "contact-form":
      return (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3">{content.title as string}</h4>
          <div className="space-y-2">
            {((content.fields as string[]) || ['name','email','message']).map((f) => <div key={f} className="bg-white rounded border border-gray-200 px-3 py-2 text-xs text-gray-400">{f}</div>)}
            <button className="w-full bg-[var(--accent)] text-white rounded py-2 text-sm">Submit</button>
          </div>
        </div>
      );

    case "prayer-request":
      return (
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold mb-1">{content.title as string}</h4>
          <p className="text-xs text-gray-600 mb-3">{content.description as string}</p>
          <div className="space-y-2">
            <div className="bg-white rounded border border-gray-200 px-3 py-2 text-xs text-gray-400">Name</div>
            <div className="bg-white rounded border border-gray-200 px-3 py-4 text-xs text-gray-400">Request</div>
          </div>
        </div>
      );

    case "map":
      return <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center"><MapPin size={24} className="text-gray-500 mr-2" /><span className="text-sm text-gray-500">{content.address as string}</span></div>;

    case "html":
      return <div className="bg-gray-50 rounded-lg p-4 border border-dashed border-gray-300"><Code size={16} className="text-gray-500 mb-1" /><span className="text-sm text-gray-500">Custom HTML</span></div>;

    default:
      return <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500"><Layout size={20} className="mx-auto mb-1" />{blockInfo?.label || type}</div>;
  }
}

function BlockSettings({ block, onChange }: { block: BlockData; onChange: (content: Record<string, unknown>) => void }) {
  const { type, content } = block;

  const TextInput = ({ label, field, placeholder = "", multiline = false }: { label: string; field: string; placeholder?: string; multiline?: boolean }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {multiline ? (
        <textarea value={(content[field] as string) || ""} onChange={(e) => onChange({ [field]: e.target.value })} placeholder={placeholder} rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
      ) : (
        <input type="text" value={(content[field] as string) || ""} onChange={(e) => onChange({ [field]: e.target.value })} placeholder={placeholder} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
      )}
    </div>
  );

  const SelectInput = ({ label, field, options }: { label: string; field: string; options: { value: string; label: string }[] }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select value={(content[field] as string) || options[0]?.value} onChange={(e) => onChange({ [field]: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
        {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
    </div>
  );

  const NumberInput = ({ label, field, min, max }: { label: string; field: string; min?: number; max?: number }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type="number" value={(content[field] as number) || 0} onChange={(e) => onChange({ [field]: parseInt(e.target.value) || 0 })} min={min} max={max} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
    </div>
  );

  switch (type) {
    case "hero-slider":
      const slides = (content.slides as Array<{ id: string; image: string; headline: string; subline: string; accent: string }>) || [];
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Slides ({slides.length})</label>
            <button onClick={() => onChange({ slides: [...slides, { id: generateId(), image: "", headline: "New Slide", subline: "", accent: "" }] })} className="text-xs text-[var(--accent)] font-medium">+ Add</button>
          </div>
          {slides.map((slide, i) => (
            <div key={slide.id} className="bg-gray-50 rounded-lg p-3 border">
              <div className="flex justify-between mb-2"><span className="text-xs font-medium text-gray-500">Slide {i + 1}</span><button onClick={() => onChange({ slides: slides.filter((_, idx) => idx !== i) })} className="text-red-500"><Trash2 size={12} /></button></div>
              <input type="text" value={slide.image} onChange={(e) => { const s = [...slides]; s[i] = { ...slide, image: e.target.value }; onChange({ slides: s }); }} placeholder="Image URL" className="w-full px-2 py-1 border rounded text-xs mb-1" />
              <input type="text" value={slide.headline} onChange={(e) => { const s = [...slides]; s[i] = { ...slide, headline: e.target.value }; onChange({ slides: s }); }} placeholder="Headline" className="w-full px-2 py-1 border rounded text-xs mb-1" />
              <input type="text" value={slide.subline} onChange={(e) => { const s = [...slides]; s[i] = { ...slide, subline: e.target.value }; onChange({ slides: s }); }} placeholder="Subline" className="w-full px-2 py-1 border rounded text-xs mb-1" />
              <input type="text" value={slide.accent} onChange={(e) => { const s = [...slides]; s[i] = { ...slide, accent: e.target.value }; onChange({ slides: s }); }} placeholder="Accent badge" className="w-full px-2 py-1 border rounded text-xs" />
            </div>
          ))}
          <NumberInput label="Autoplay (ms)" field="autoplaySpeed" min={1000} max={15000} />
          <SelectInput label="Height" field="height" options={[{ value: "400px", label: "Small" }, { value: "500px", label: "Medium" }, { value: "600px", label: "Large" }, { value: "100vh", label: "Full" }]} />
        </div>
      );

    case "page-hero":
      return (
        <div>
          <TextInput label="Title" field="title" />
          <TextInput label="Subtitle" field="subtitle" />
          <TextInput label="Background Image" field="backgroundImage" placeholder="URL" />
          <TextInput label="Overlay Color" field="overlayColor" placeholder="rgba(12,21,41,0.85)" />
          <SelectInput label="Alignment" field="alignment" options={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }]} />
        </div>
      );

    case "quick-links":
      const links = (content.links as Array<{ id: string; title: string; description: string; href: string; variant: string }>) || [];
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Links</label>
            <button onClick={() => onChange({ links: [...links, { id: generateId(), title: "New", description: "", href: "/", variant: "white" }] })} className="text-xs text-[var(--accent)] font-medium">+ Add</button>
          </div>
          {links.map((link, i) => (
            <div key={link.id} className="bg-gray-50 rounded-lg p-3 border mb-2">
              <div className="flex justify-between mb-2"><span className="text-xs text-gray-500">Link {i + 1}</span><button onClick={() => onChange({ links: links.filter((_, idx) => idx !== i) })} className="text-red-500"><Trash2 size={12} /></button></div>
              <input type="text" value={link.title} onChange={(e) => { const l = [...links]; l[i] = { ...link, title: e.target.value }; onChange({ links: l }); }} placeholder="Title" className="w-full px-2 py-1 border rounded text-xs mb-1" />
              <input type="text" value={link.description} onChange={(e) => { const l = [...links]; l[i] = { ...link, description: e.target.value }; onChange({ links: l }); }} placeholder="Description" className="w-full px-2 py-1 border rounded text-xs mb-1" />
              <input type="text" value={link.href} onChange={(e) => { const l = [...links]; l[i] = { ...link, href: e.target.value }; onChange({ links: l }); }} placeholder="URL" className="w-full px-2 py-1 border rounded text-xs mb-1" />
              <select value={link.variant} onChange={(e) => { const l = [...links]; l[i] = { ...link, variant: e.target.value }; onChange({ links: l }); }} className="w-full px-2 py-1 border rounded text-xs">
                <option value="white">White</option><option value="red">Red</option>
              </select>
            </div>
          ))}
        </div>
      );

    case "about-section":
      return (
        <div>
          <TextInput label="Label" field="label" />
          <TextInput label="Heading" field="heading" />
          <TextInput label="Description" field="description" multiline />
          <TextInput label="Image URL" field="image" />
          <TextInput label="Contact Phone" field="contactPhone" />
          <TextInput label="Contact Label" field="contactLabel" />
        </div>
      );

    case "testimonials-section":
      const testimonials = (content.testimonials as Array<{ id: string; quote: string; name: string; role: string; image: string; rating: number }>) || [];
      return (
        <div>
          <TextInput label="Label" field="label" />
          <TextInput label="Heading" field="heading" />
          <div className="flex items-center justify-between mb-2 mt-4">
            <label className="text-sm font-medium text-gray-700">Testimonials</label>
            <button onClick={() => onChange({ testimonials: [...testimonials, { id: generateId(), quote: "", name: "", role: "", image: "", rating: 5 }] })} className="text-xs text-[var(--accent)] font-medium">+ Add</button>
          </div>
          {testimonials.map((t, i) => (
            <div key={t.id} className="bg-gray-50 rounded-lg p-3 border mb-2">
              <div className="flex justify-between mb-2"><span className="text-xs text-gray-500">#{i + 1}</span><button onClick={() => onChange({ testimonials: testimonials.filter((_, idx) => idx !== i) })} className="text-red-500"><Trash2 size={12} /></button></div>
              <textarea value={t.quote} onChange={(e) => { const ts = [...testimonials]; ts[i] = { ...t, quote: e.target.value }; onChange({ testimonials: ts }); }} placeholder="Quote" rows={2} className="w-full px-2 py-1 border rounded text-xs mb-1" />
              <input type="text" value={t.name} onChange={(e) => { const ts = [...testimonials]; ts[i] = { ...t, name: e.target.value }; onChange({ testimonials: ts }); }} placeholder="Name" className="w-full px-2 py-1 border rounded text-xs mb-1" />
              <input type="text" value={t.role} onChange={(e) => { const ts = [...testimonials]; ts[i] = { ...t, role: e.target.value }; onChange({ testimonials: ts }); }} placeholder="Role" className="w-full px-2 py-1 border rounded text-xs mb-1" />
              <input type="text" value={t.image} onChange={(e) => { const ts = [...testimonials]; ts[i] = { ...t, image: e.target.value }; onChange({ testimonials: ts }); }} placeholder="Image URL" className="w-full px-2 py-1 border rounded text-xs mb-1" />
              <select value={t.rating} onChange={(e) => { const ts = [...testimonials]; ts[i] = { ...t, rating: parseInt(e.target.value) }; onChange({ testimonials: ts }); }} className="w-full px-2 py-1 border rounded text-xs">
                {[1,2,3,4,5].map((r) => <option key={r} value={r}>{r} Stars</option>)}
              </select>
            </div>
          ))}
        </div>
      );

    case "live-stream":
      return (
        <div>
          <TextInput label="Label" field="label" />
          <TextInput label="Heading" field="heading" />
          <TextInput label="Description" field="description" multiline />
          <TextInput label="YouTube Channel" field="youtubeChannel" />
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Featured Video</label>
            <input type="text" value={(content.featuredVideo as { videoId?: string })?.videoId || ""} onChange={(e) => onChange({ featuredVideo: { ...(content.featuredVideo as object), videoId: e.target.value } })} placeholder="YouTube Video ID" className="w-full px-2 py-1 border rounded text-xs mb-1" />
            <input type="text" value={(content.featuredVideo as { title?: string })?.title || ""} onChange={(e) => onChange({ featuredVideo: { ...(content.featuredVideo as object), title: e.target.value } })} placeholder="Title" className="w-full px-2 py-1 border rounded text-xs" />
          </div>
        </div>
      );

    case "ministries-preview":
      return (
        <div>
          <TextInput label="Label" field="label" />
          <TextInput label="Heading" field="heading" />
          <NumberInput label="Show Count" field="showCount" min={3} max={12} />
          <TextInput label="CTA URL" field="ctaUrl" />
        </div>
      );

    case "cta-banner":
      return (
        <div>
          <TextInput label="Heading" field="heading" />
          <TextInput label="Description" field="description" />
          <TextInput label="Button Text" field="buttonText" />
          <TextInput label="Button URL" field="buttonUrl" />
          <TextInput label="Background Color" field="backgroundColor" placeholder="var(--accent)" />
        </div>
      );

    case "heading":
      return (
        <div>
          <TextInput label="Text" field="text" />
          <SelectInput label="Level" field="level" options={[{ value: "h1", label: "H1" }, { value: "h2", label: "H2" }, { value: "h3", label: "H3" }, { value: "h4", label: "H4" }]} />
          <SelectInput label="Alignment" field="align" options={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }]} />
        </div>
      );

    case "paragraph":
      return (
        <div>
          <TextInput label="Text" field="text" multiline />
          <SelectInput label="Alignment" field="align" options={[{ value: "left", label: "Left" }, { value: "center", label: "Center" }, { value: "right", label: "Right" }]} />
        </div>
      );

    case "image":
      return (
        <div>
          <TextInput label="Image URL" field="url" />
          <TextInput label="Alt Text" field="alt" />
          <TextInput label="Caption" field="caption" />
          <SelectInput label="Width" field="width" options={[{ value: "full", label: "Full" }, { value: "medium", label: "Medium" }, { value: "small", label: "Small" }]} />
        </div>
      );

    case "video":
      return (
        <div>
          <TextInput label="Video URL/ID" field="url" />
          <SelectInput label="Type" field="type" options={[{ value: "youtube", label: "YouTube" }, { value: "vimeo", label: "Vimeo" }]} />
        </div>
      );

    case "quote":
      return (
        <div>
          <TextInput label="Quote" field="text" multiline />
          <TextInput label="Author" field="author" />
        </div>
      );

    case "list":
      const items = (content.items as string[]) || [];
      return (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Items</label>
            <button onClick={() => onChange({ items: [...items, "New item"] })} className="text-xs text-[var(--accent)] font-medium">+ Add</button>
          </div>
          {items.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input type="text" value={item} onChange={(e) => { const newItems = [...items]; newItems[i] = e.target.value; onChange({ items: newItems }); }} className="flex-1 px-2 py-1 border rounded text-xs" />
              <button onClick={() => onChange({ items: items.filter((_, idx) => idx !== i) })} className="text-red-500"><Trash2 size={12} /></button>
            </div>
          ))}
          <SelectInput label="Style" field="style" options={[{ value: "bullet", label: "Bullet" }, { value: "numbered", label: "Numbered" }]} />
        </div>
      );

    case "spacer":
      return <NumberInput label="Height (px)" field="height" min={10} max={200} />;

    case "divider":
      return (
        <div>
          <SelectInput label="Style" field="style" options={[{ value: "solid", label: "Solid" }, { value: "dashed", label: "Dashed" }, { value: "dotted", label: "Dotted" }]} />
          <TextInput label="Color" field="color" placeholder="#e5e7eb" />
        </div>
      );

    case "events-list":
      return (
        <div>
          <NumberInput label="Count" field="count" min={1} max={10} />
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked={(content.showPast as boolean) || false} onChange={(e) => onChange({ showPast: e.target.checked })} />
            <label className="text-sm text-gray-700">Show past events</label>
          </div>
        </div>
      );

    case "sermons-list":
      return (
        <div>
          <NumberInput label="Count" field="count" min={1} max={12} />
          <div className="flex items-center gap-2 mt-2">
            <input type="checkbox" checked={(content.showVideo as boolean) || false} onChange={(e) => onChange({ showVideo: e.target.checked })} />
            <label className="text-sm text-gray-700">Show video thumbnails</label>
          </div>
        </div>
      );

    case "blog-posts":
      return <NumberInput label="Count" field="count" min={1} max={12} />;

    case "contact-form":
      return (
        <div>
          <TextInput label="Title" field="title" />
          <p className="text-xs text-gray-500 mt-2">Fields: name, email, phone, message</p>
        </div>
      );

    case "prayer-request":
      return (
        <div>
          <TextInput label="Title" field="title" />
          <TextInput label="Description" field="description" multiline />
        </div>
      );

    case "map":
      return (
        <div>
          <TextInput label="Address" field="address" />
          <NumberInput label="Zoom" field="zoom" min={10} max={20} />
        </div>
      );

    case "html":
      return <TextInput label="HTML Code" field="html" multiline />;

    default:
      return <p className="text-sm text-gray-500">No settings available.</p>;
  }
}
