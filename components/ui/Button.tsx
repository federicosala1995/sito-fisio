"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "whatsapp";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-full font-inter font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed",
          {
            "bg-teal text-white hover:bg-teal-600 active:scale-95 shadow-lg shadow-teal/20":
              variant === "primary",
            "border-2 border-navy text-navy hover:bg-navy hover:text-white active:scale-95":
              variant === "secondary",
            "text-navy hover:text-teal underline-offset-2 hover:underline":
              variant === "ghost",
            "bg-[#25D366] text-white hover:bg-[#20c05a] active:scale-95 shadow-lg shadow-green-500/20":
              variant === "whatsapp",
          },
          {
            "px-4 py-2 text-sm": size === "sm",
            "px-6 py-3 text-base": size === "md",
            "px-8 py-4 text-lg": size === "lg",
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
