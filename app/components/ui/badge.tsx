import type * as React from "react";
import { cn } from "@/utils/manage-class-name";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "info" | "warning" | "error";
}

function Badge({ className, variant = "success", ...props }: BadgeProps) {
  const baseClasses =
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variantClasses = {
    success: "inline-block rounded border-1 border-green-200 bg-green-100 text-green-800 px-2 py-1 text-xs font-semibold",
    info: "inline-block rounded border-1 border-blue-200 bg-blue-100 text-blue-800 px-2 py-1 text-xs font-semibold",
    warning: "inline-block rounded border-1 border-yellow-200 bg-yellow-100 text-yellow-800 px-2 py-1 text-xs font-semibold",
    error: "inline-block rounded border-1 border-red-200 bg-red-100 text-red-800 px-2 py-1 text-xs font-semibold",
  };

  const classes = cn(baseClasses, variantClasses[variant], className);

  return <div className={classes} {...props} />;
}

export { Badge };
