import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ContainerSize = "sm" | "md" | "lg" | "full";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Controls the max-width of the container:
   *   sm   → max-w-3xl   (~768 px)
   *   md   → max-w-5xl   (~1024 px)
   *   lg   → max-w-7xl   (~1280 px) — default
   *   full → no max-width cap
   */
  size?: ContainerSize;
  className?: string;
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Size map
// ---------------------------------------------------------------------------

const sizeStyles: Record<ContainerSize, string> = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-7xl",
  full: "max-w-none",
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ size = "lg", className, children, ...rest }, ref) => (
    <div
      ref={ref}
      className={cn(
        "mx-auto w-full",
        "px-4 sm:px-6 lg:px-8",
        sizeStyles[size],
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
);

Container.displayName = "Container";

export { Container };
export type { ContainerProps, ContainerSize };
export default Container;
