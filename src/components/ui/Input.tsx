import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {(label || helperText) && (
          <div className="flex items-center justify-between">
            {label && (
              <label
                htmlFor={id}
                className="text-sm font-medium text-foreground"
              >
                {label}
              </label>
            )}
            {helperText && (
              <span className="text-xs text-muted-foreground">
                {helperText}
              </span>
            )}
          </div>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full bg-card border border-input rounded-xl px-4 py-3 text-foreground placeholder:text-muted-foreground/50",
              "transition-all duration-200",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:border-primary/30",
              error && "border-red-500/30 focus:ring-red-500/30",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500 animate-slide-down">{error}</p>
        )}
      </div>
    );
  }
);
