import React from "react";
import { cn } from "../../lib/ui";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "glass" | "minimal";
};

export function Card({ variant = "default", className, ...props }: CardProps) {
  const variants = {
    default: "bg-black/70 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.35)]",
    glass: "bg-black/55 backdrop-blur-xl border border-white/10",
    minimal: "bg-black/40 border border-white/5",
  };

  return (
    <div
      className={cn(
        "rounded-lg transition-colors",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

