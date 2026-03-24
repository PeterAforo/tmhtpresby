import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageBlock {
  id: string;
  type: string;
  content: Record<string, unknown>;
}

interface PageData {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  content: PageBlock[] | null;
  template: string;
  published: boolean;
  metaTitle: string | null;
  metaDesc: string | null;
  featuredImg: string | null;
}

async function getPage(slug: string): Promise<PageData | null> {
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page || !page.published) {
    return null;
  }

  return {
    ...page,
    content: page.content as PageBlock[] | null,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDesc || page.description || undefined,
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDesc || page.description || undefined,
      images: page.featuredImg ? [page.featuredImg] : undefined,
    },
  };
}

function renderBlock(block: PageBlock): React.ReactNode {
  const { type, content } = block;

  switch (type) {
    case "heading":
      const HeadingTag = (content.level as string) === "h1" ? "h1" : 
                         (content.level as string) === "h2" ? "h2" : 
                         (content.level as string) === "h3" ? "h3" : "h2";
      return (
        <HeadingTag
          key={block.id}
          className={`font-[family-name:var(--font-heading)] font-bold text-[var(--text)] ${
            HeadingTag === "h1" ? "text-4xl mb-6" :
            HeadingTag === "h2" ? "text-3xl mb-4" : "text-2xl mb-3"
          }`}
          style={{ textAlign: ((content.align as string) || "left") as "left" | "center" | "right" }}
        >
          {String(content.text || "")}
        </HeadingTag>
      );

    case "paragraph":
      return (
        <p
          key={block.id}
          className="text-[var(--text-muted)] leading-relaxed mb-4"
          style={{ textAlign: ((content.align as string) || "left") as "left" | "center" | "right" }}
          dangerouslySetInnerHTML={{ __html: String(content.text || "") }}
        />
      );

    case "image":
      if (!content.url) return null;
      return (
        <figure key={block.id} className="my-6">
          <img
            src={content.url as string}
            alt={(content.alt as string) || ""}
            className={`rounded-lg ${
              content.width === "full" ? "w-full" : 
              content.width === "medium" ? "max-w-lg mx-auto" : "max-w-sm mx-auto"
            }`}
          />
          {typeof content.caption === "string" && content.caption && (
            <figcaption className="text-sm text-[var(--text-muted)] text-center mt-2">
              {content.caption}
            </figcaption>
          )}
        </figure>
      );

    case "spacer":
      return <div key={block.id} style={{ height: `${content.height || 40}px` }} />;

    case "divider":
      return (
        <hr
          key={block.id}
          className="border-t my-6"
          style={{
            borderStyle: (content.style as string) || "solid",
            borderColor: (content.color as string) || "#e5e7eb",
          }}
        />
      );

    case "quote":
      const quoteText = String(content.text || "");
      const quoteAuthor = typeof content.author === "string" ? content.author : "";
      const quoteSource = typeof content.source === "string" ? content.source : "";
      return (
        <blockquote key={block.id} className="border-l-4 border-[var(--accent)] pl-4 py-2 italic my-6">
          <p className="text-lg text-[var(--text)]">{quoteText}</p>
          {quoteAuthor && (
            <footer className="text-sm text-[var(--text-muted)] mt-2">
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
        <ol key={block.id} className="list-decimal pl-5 space-y-1 my-4">
          {listItems.map((item, i) => (
            <li key={i} className="text-[var(--text-muted)]">{item}</li>
          ))}
        </ol>
      ) : (
        <ul key={block.id} className="list-disc pl-5 space-y-1 my-4">
          {listItems.map((item, i) => (
            <li key={i} className="text-[var(--text-muted)]">{item}</li>
          ))}
        </ul>
      );

    case "cta":
      return (
        <div
          key={block.id}
          className="rounded-xl p-8 text-center text-white my-8"
          style={{ backgroundColor: (content.bgColor as string) || "var(--accent)" }}
        >
          <h3 className="text-2xl font-bold mb-2">{(content.title as string) || "Call to Action"}</h3>
          <p className="text-white/90 mb-4">{(content.subtitle as string) || ""}</p>
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
          key={block.id}
          className="relative rounded-xl overflow-hidden min-h-[300px] flex items-center justify-center text-center text-white my-8"
          style={{
            backgroundImage: heroBgImage ? `url(${heroBgImage})` : undefined,
            backgroundColor: heroBgImage ? undefined : "var(--accent)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {showOverlay && <div className="absolute inset-0 bg-black/50" />}
          <div className="relative z-10 p-8">
            <h2 className="text-4xl font-bold mb-2">{(content.title as string) || "Hero Title"}</h2>
            <p className="text-xl text-white/90 mb-6">{(content.subtitle as string) || ""}</p>
            {typeof content.buttonText === "string" && content.buttonText && (
              <a
                href={(content.buttonUrl as string) || "#"}
                className="inline-block px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                {content.buttonText}
              </a>
            )}
          </div>
        </div>
      );

    case "video":
      if (content.youtubeId) {
        return (
          <div key={block.id} className="aspect-video rounded-xl overflow-hidden my-6">
            <iframe
              src={`https://www.youtube.com/embed/${content.youtubeId}`}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        );
      }
      return null;

    case "html":
      return (
        <div
          key={block.id}
          className="my-6"
          dangerouslySetInnerHTML={{ __html: String(content.code || "") }}
        />
      );

    default:
      return null;
  }
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  const blocks = page.content || [];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl font-bold mb-4">
            {page.title}
          </h1>
          {page.description && (
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {page.description}
            </p>
          )}
        </div>
      </section>

      {/* Page Content */}
      <section className="py-12">
        <div className={`container mx-auto px-4 ${
          page.template === "full-width" ? "" : "max-w-4xl"
        }`}>
          {blocks.length > 0 ? (
            <div className="prose prose-lg max-w-none">
              {blocks.map((block) => {
              const rendered = renderBlock(block);
              return rendered;
            })}
            </div>
          ) : (
            <div className="text-center py-12 text-[var(--text-muted)]">
              <p>This page has no content yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
