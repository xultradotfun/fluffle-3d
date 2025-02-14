import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export function Input({
  label,
  helperText,
  id,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="space-y-3">
      {(label || helperText) && (
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={id} className="text-sm font-medium text-foreground">
              {label}
            </label>
          )}
          {helperText && (
            <span className="text-xs text-muted-foreground">{helperText}</span>
          )}
        </div>
      )}
      <input
        id={id}
        className={`w-full bg-card border border-input rounded-xl px-4 py-3 text-[#ededed] placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 ${className}`}
        {...props}
      />
    </div>
  );
}
