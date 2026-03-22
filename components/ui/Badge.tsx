import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type BadgeVariant = "default" | "primary" | "accent" | "crimson";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  className?: string;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Variant styles
// ---------------------------------------------------------------------------

const variantStyles: Record<BadgeVariant, string> = {
  default: [
    "bg-[var(--border)] text-[var(--text)]",
    "dark:bg-[#1E3A5F] dark:text-[var(--text)]",
  ].join(" "),

  primary: [
    "bg-[#2E3192]/15 text-[#2E3192]",
    "dark:bg-[#7C93DD]/20 dark:text-[#7C93DD]",
  ].join(" "),

  accent: [
    "bg-[#317256]/15 text-[#317256]",
    "dark:bg-[#3DA066]/20 dark:text-[#3DA066]",
  ].join(" "),

  crimson: [
    "bg-[#670D0E]/10 text-[#670D0E]",
    "dark:bg-[#670D0E]/25 dark:text-[#ff6b6b]",
  ].join(" "),
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "default", className, children, ...rest }, ref) => (
    <span
      ref={ref}
      className={cn(
        // Base layout & typography
        "inline-flex items-center justify-center",
        "px-2.5 py-0.5 rounded-full",
        "text-xs font-semibold leading-none tracking-wide",
        "whitespace-nowrap select-none",
        // Transition for any hover parent effects
        "transition-colors duration-150",
        variantStyles[variant],
        className
      )}
      {...rest}
    >
      {children}
    </span>
  )
);

Badge.displayName = "Badge";

export { Badge };
export type { BadgeProps, BadgeVariant };
export default Badge;
