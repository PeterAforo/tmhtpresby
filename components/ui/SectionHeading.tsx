import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Align = "center" | "left";

interface SectionHeadingProps {
  /** Main heading text — rendered in Playfair Display */
  title: string;
  /** Optional supporting text below the title */
  subtitle?: string;
  /** Show the green accent divider line beneath the title. Default: true */
  showDivider?: boolean;
  /** Text alignment. Default: "center" */
  align?: Align;
  /** HTML heading level for the title. Default: "h2" */
  as?: "h1" | "h2" | "h3";
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  showDivider = true,
  align = "center",
  as: Tag = "h2",
  className,
}) => {
  const isCentered = align === "center";

  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        isCentered ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {/* Title */}
      <Tag
        className={cn(
          // Playfair Display via CSS custom property
          "font-[family-name:var(--font-heading)]",
          "text-[var(--text)] font-bold leading-tight tracking-tight",
          // Responsive sizes
          "text-3xl sm:text-4xl lg:text-5xl"
        )}
      >
        {title}
      </Tag>

      {/* Decorative green accent divider */}
      {showDivider && (
        <div
          aria-hidden="true"
          className={cn(
            "h-1 rounded-full bg-[var(--divider)]",
            "transition-all duration-300",
            isCentered ? "w-16" : "w-12"
          )}
        />
      )}

      {/* Subtitle */}
      {subtitle && (
        <p
          className={cn(
            "text-[var(--text-muted)] font-[family-name:var(--font-body)]",
            "text-base sm:text-lg leading-relaxed",
            isCentered ? "max-w-2xl" : "max-w-xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};

SectionHeading.displayName = "SectionHeading";

export { SectionHeading };
export type { SectionHeadingProps };
export default SectionHeading;
