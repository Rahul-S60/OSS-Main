import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "success" | "warning" | "danger" | "purple";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const baseClasses = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "border-transparent bg-[var(--color-elevated-surface)] text-[var(--color-primary-text)] hover:bg-[var(--color-border)]",
    secondary: "border-transparent bg-[var(--color-secondary-bg)] text-[var(--color-secondary-text)]",
    outline: "border-[var(--color-border)] text-[var(--color-primary-text)]",
    success: "border-transparent bg-[var(--color-success)]/10 text-[var(--color-success)]",
    warning: "border-transparent bg-[var(--color-warning)]/10 text-[var(--color-warning)]",
    danger: "border-transparent bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
    purple: "border-transparent bg-[var(--color-primary-accent)]/10 text-[var(--color-primary-accent)]",
  };

  return (
    <div className={cn(baseClasses, variants[variant], className)} {...props} />
  );
}

export { Badge };
