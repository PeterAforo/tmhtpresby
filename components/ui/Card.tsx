import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Card (root)
// ---------------------------------------------------------------------------

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true, the card lifts and deepens its shadow on hover */
  hoverable?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ hoverable = false, className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        // Base — uses CSS vars so it respects light / dark theme automatically
        "rounded-xl bg-[var(--bg-card)] text-[var(--text)]",
        // Light-mode shadow + subtle border
        "shadow-sm border border-[var(--border)]",
        // Dark-mode adjustments (bg-card is #152040 in dark, border is #1E3A5F)
        "dark:shadow-none dark:border dark:border-[var(--border)]",
        // Transition for hover lift
        "transition-all duration-200 ease-in-out",
        // Hoverable variant
        hoverable && "cursor-pointer hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_8px_24px_rgba(0,0,0,0.5)] hover:border-[var(--accent)]/40",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

// ---------------------------------------------------------------------------
// CardHeader
// ---------------------------------------------------------------------------

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 pt-6 pb-4 border-b border-[var(--border)] last:border-b-0",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

// ---------------------------------------------------------------------------
// CardContent
// ---------------------------------------------------------------------------

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn("px-6 py-4", className)}
      {...rest}
    >
      {children}
    </div>
  )
);
CardContent.displayName = "CardContent";

// ---------------------------------------------------------------------------
// CardFooter
// ---------------------------------------------------------------------------

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "px-6 pt-4 pb-6 border-t border-[var(--border)] first:border-t-0",
        "flex items-center gap-3",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);
CardFooter.displayName = "CardFooter";

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export { Card, CardHeader, CardContent, CardFooter };
export type { CardProps, CardHeaderProps, CardContentProps, CardFooterProps };
export default Card;
