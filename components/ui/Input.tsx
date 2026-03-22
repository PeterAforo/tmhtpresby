import * as React from "react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visible label rendered above the input */
  label?: string;
  /** Error message rendered below the input; also sets aria-invalid */
  error?: string;
  /** Optional helper text rendered below the input (hidden when error is set) */
  hint?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Shared field-container classes (reused in Textarea)
// ---------------------------------------------------------------------------

export const fieldLabelStyles = cn(
  "block text-sm font-medium text-[var(--text)] mb-1"
);

export const fieldErrorStyles = cn(
  "mt-1.5 text-xs font-medium text-[#670D0E] dark:text-[#ff6b6b]"
);

export const fieldHintStyles = cn(
  "mt-1.5 text-xs text-[var(--text-muted)]"
);

export const fieldInputStyles = cn(
  // Layout
  "block w-full rounded-lg",
  "px-4 py-2.5",
  "text-base text-[var(--text)]",
  // Background & border — light mode
  "bg-white border border-[var(--border)]",
  // Dark mode
  "dark:bg-[#152040] dark:border-[#1E3A5F] dark:text-[var(--text)]",
  // Placeholder
  "placeholder:text-[var(--text-muted)]",
  // Transition
  "transition-colors duration-150",
  // Focus ring — accent green
  "outline-none",
  "focus:border-[#317256] focus:ring-2 focus:ring-[#317256]/25",
  "dark:focus:border-[#3DA066] dark:focus:ring-[#3DA066]/25",
  // Disabled
  "disabled:opacity-50 disabled:cursor-not-allowed",
  // Error ring (applied via aria-invalid / data-error via parent)
  "aria-[invalid=true]:border-[#670D0E] aria-[invalid=true]:ring-2",
  "aria-[invalid=true]:ring-[#670D0E]/20"
);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className, ...rest }, ref) => {
    // Derive a stable id for label association when none is provided
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const hintId = `${inputId}-hint`;

    const describedBy = [
      error ? errorId : null,
      !error && hint ? hintId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className="flex flex-col w-full">
        {label && (
          <label htmlFor={inputId} className={fieldLabelStyles}>
            {label}
          </label>
        )}

        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(fieldInputStyles, className)}
          {...rest}
        />

        {error && (
          <p id={errorId} role="alert" className={fieldErrorStyles}>
            {error}
          </p>
        )}

        {!error && hint && (
          <p id={hintId} className={fieldHintStyles}>
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };
export type { InputProps };
export default Input;
