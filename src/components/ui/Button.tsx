"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    
    // We wrap standard buttons in motion.button if not asChild to give micro-interactions.
    // If asChild is true, we assume the user handles motion themselves.
    const MotionComp = asChild ? Slot : motion.button;
    
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-[var(--color-background)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-[var(--color-primary-accent)] text-white hover:bg-[var(--color-primary-accent-hover)] shadow-sm",
      secondary: "bg-[var(--color-elevated-surface)] text-[var(--color-primary-text)] hover:bg-[var(--color-border)]",
      outline: "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-elevated-surface)] text-[var(--color-primary-text)]",
      ghost: "hover:bg-[var(--color-elevated-surface)] text-[var(--color-secondary-text)] hover:text-[var(--color-primary-text)]",
      danger: "bg-[var(--color-danger)] text-white hover:opacity-90",
      success: "bg-[var(--color-success)] text-white hover:opacity-90",
    };
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8 text-base",
      icon: "h-10 w-10",
    };

    const combinedClasses = cn(
      baseClasses,
      variants[variant],
      sizes[size],
      className
    );

    if (asChild) {
      return <Comp className={combinedClasses} ref={ref} {...props} />;
    }

    return (
      <MotionComp
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={combinedClasses}
        ref={ref}
        {...(props as any)}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
