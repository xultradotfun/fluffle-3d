"use client";

import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "border bg-card text-card-foreground transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-background border-2 border-foreground hover:shadow-[8px_8px_0_hsl(var(--foreground))] hover:-translate-x-1 hover:-translate-y-1",
        outline:
          "bg-background border-2 border-foreground",
        filled:
          "bg-foreground text-background border-2 border-foreground",
        minimal:
          "bg-background border-l-4 border-foreground border-t-0 border-r-0 border-b-0",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, variant, ...props }: CardProps) {
  return (
    <div className={cn(cardVariants({ variant }), className)} {...props} />
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  return (
    <div className={`p-6 border-b-2 border-foreground font-bold uppercase tracking-wider ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}
