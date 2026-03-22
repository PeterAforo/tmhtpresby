import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ScriptureQuoteProps {
  /** The scripture text to display */
  text: string;
  /** Biblical reference, e.g. "John 3:16 (NIV)" */
  reference?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const ScriptureQuote: React.FC<ScriptureQuoteProps> = ({
  text,
  reference,
  className,
}) => (
  <figure
    // scripture-quote class from globals.css provides base styling;
    // we augment with Tailwind for full control.
    className={cn(
      "scripture-quote",
      // Override / extend globals.css base with Tailwind equivalents
      "border-l-4 border-[#317256] dark:border-[#3DA066]",
      "pl-5 py-1",
      "font-[family-name:var(--font-heading)] italic",
      "text-[var(--text-muted)]",
      "text-lg sm:text-xl leading-relaxed",
      // Subtle background tint
      "bg-[#317256]/5 dark:bg-[#3DA066]/8",
      "rounded-r-lg",
      "transition-colors duration-200",
      className
    )}
    aria-label={reference ? `Scripture: ${reference}` : "Scripture quote"}
  >
    {/* Quote text */}
    <blockquote className="m-0 p-0 before:content-['\u201C'] after:content-['\u201D']">
      {text}
    </blockquote>

    {/* Reference */}
    {reference && (
      <figcaption
        className={cn(
          "mt-2 not-italic",
          "text-sm font-semibold font-[family-name:var(--font-body)]",
          "text-[#317256] dark:text-[#3DA066]",
          "tracking-wide"
        )}
      >
        &mdash; {reference}
      </figcaption>
    )}
  </figure>
);

ScriptureQuote.displayName = "ScriptureQuote";

export { ScriptureQuote };
export type { ScriptureQuoteProps };
export default ScriptureQuote;
