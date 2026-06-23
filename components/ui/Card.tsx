import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export function Card({ className, glass, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm",
        glass && "bg-white/60 backdrop-blur-md border-white/30",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
