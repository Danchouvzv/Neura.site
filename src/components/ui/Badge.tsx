import React from "react";
import { cn } from "../../lib/ui";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "accent" | "muted";
};

export function Badge({ variant = "default", className, ...props }: BadgeProps) {
  const variants = {
    default: "border-white/20 bg-white/5 text-gray-300",
    accent: "border-neura-pink/30 bg-neura-pink/10 text-neura-pink",
    muted: "border-white/10 bg-white/3 text-gray-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-3 py-1",
        "text-xs tracking-wider uppercase font-mono font-bold",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

