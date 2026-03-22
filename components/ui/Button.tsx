"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ButtonVariant =
  | "primary"
  | "secondary"
  | "accent"
  | "cta"
  | "outline"
  | "ghost";

type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
  /** Render as a child element (e.g. wrap a Next.js <Link>) */
  asChild?: boolean;
  disabled?: boolean;
  loading?: boolean;
}

export type ButtonProps = ButtonBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

// ---------------------------------------------------------------------------
// Style maps
// ---------------------------------------------------------------------------

const variantStyles: Record<ButtonVariant, string> = {
  primary: [
    "bg-[#2E3192] text-white",
    "hover:bg-[#252880] hover:shadow-[0_4px_14px_rgba(46,49,146,0.45)]",
    "active:bg-[#1e2070]",
    "dark:bg-[#7C93DD] dark:text-[#0C1529]",
    "dark:hover:bg-[#8fa2e6] dark:hover:shadow-[0_4px_14px_rgba(124,147,221,0.45)]",
  ].join(" "),

  secondary: [
    "bg-[#7C93DD] text-white",
    "hover:bg-[#6a82d0] hover:shadow-[0_4px_14px_rgba(124,147,221,0.4)]",
    "active:bg-[#5c74c4]",
    "dark:bg-[#2E3192] dark:text-white",
    "dark:hover:bg-[#252880]",
  ].join(" "),

  accent: [
    "bg-[#317256] text-white",
    "hover:bg-[#28614a] hover:shadow-[0_4px_14px_rgba(49,114,86,0.45)]",
    "active:bg-[#1f503c]",
    "dark:bg-[#3DA066] dark:text-[#0C1529]",
    "dark:hover:bg-[#35906d]",
  ].join(" "),

  cta: [
    "bg-[#670D0E] text-white",
    "hover:bg-[#560b0c] hover:shadow-[0_4px_14px_rgba(103,13,14,0.45)]",
    "active:bg-[#46090a]",
    "dark:bg-[#670D0E] dark:text-white",
    "dark:hover:bg-[#7a1010]",
  ].join(" "),

  outline: [
    "border border-[var(--primary)] text-[var(--primary)] bg-transparent",
    "hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(46,49,146,0.2)]",
    "hover:bg-[var(--primary)] hover:text-white",
    "active:translate-y-0",
    "dark:border-[var(--primary)] dark:text-[var(--primary)]",
    "dark:hover:bg-[var(--primary)] dark:hover:text-[#0C1529]",
  ].join(" "),

  ghost: [
    "bg-transparent text-[var(--primary)]",
    "hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]",
    "active:bg-[var(--primary)]/20",
    "dark:text-[var(--primary)] dark:hover:bg-[var(--primary)]/15",
  ].join(" "),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm gap-1.5",
  md: "px-5 py-2.5 text-base gap-2",
  lg: "px-7 py-3.5 text-lg gap-2.5",
};

// ---------------------------------------------------------------------------
// Loading spinner
// ---------------------------------------------------------------------------

function Spinner({ size }: { size: ButtonSize }) {
  const dim = size === "sm" ? "h-3.5 w-3.5" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  return (
    <svg
      className={cn("animate-spin shrink-0", dim)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      className,
      children,
      asChild = false,
      disabled = false,
      loading = false,
      type = "button",
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    const baseStyles = cn(
      // Layout & typography
      "inline-flex items-center justify-center font-semibold rounded-md",
      "leading-none tracking-wide whitespace-nowrap",
      // Transitions (respects prefers-reduced-motion via globals.css)
      "transition-all duration-200 ease-in-out",
      // Lift on hover (non-outline / non-ghost handled per variant)
      !["outline", "ghost"].includes(variant) &&
        "hover:-translate-y-0.5 active:translate-y-0",
      // Disabled / loading state
      isDisabled && "opacity-50 cursor-not-allowed pointer-events-none",
      // Cursor
      !isDisabled && "cursor-pointer",
      // Focus ring (global :focus-visible handles outline via globals.css)
      "focus-visible:outline-2 focus-visible:outline-offset-2",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    // asChild: clone the single child and pass all button props to it
    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(
        children as React.ReactElement<React.HTMLAttributes<HTMLElement>>,
        {
          className: cn(baseStyles, (children.props as { className?: string }).className),
          "aria-disabled": isDisabled || undefined,
          ...(isDisabled ? { tabIndex: -1 } : {}),
        }
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        className={baseStyles}
        {...rest}
      >
        {loading && <Spinner size={size} />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export default Button;
