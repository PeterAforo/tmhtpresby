import * as React from "react";
import { cn } from "@/lib/utils";
import {
  fieldLabelStyles,
  fieldErrorStyles,
  fieldHintStyles,
  fieldInputStyles,
} from "./Input";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Visible label rendered above the textarea */
  label?: string;
  /** Error message rendered below; also sets aria-invalid */
  error?: string;
  /** Optional helper text rendered below (hidden when error is set) */
  hint?: string;
  className?: string;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className, rows = 4, ...rest }, ref) => {
    const generatedId = React.useId();
    const textareaId = id ?? generatedId;
    const errorId = `${textareaId}-error`;
    const hintId = `${textareaId}-hint`;

    const describedBy = [
      error ? errorId : null,
      !error && hint ? hintId : null,
    ]
      .filter(Boolean)
      .join(" ") || undefined;

    return (
      <div className="flex flex-col w-full">
        {label && (
          <label htmlFor={textareaId} className={fieldLabelStyles}>
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            fieldInputStyles,
            // Textarea-specific overrides
            "resize-y min-h-[100px]",
            "leading-relaxed",
            className
          )}
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

Textarea.displayName = "Textarea";

export { Textarea };
export type { TextareaProps };
export default Textarea;
