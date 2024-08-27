import type * as React from "react";
import { cn } from "@/utils/manage-class-name";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "success" | "info" | "warning" | "error";
}

function Badge({ className, variant = "success", ...props }: BadgeProps) {
  const baseClasses =
    "inline-flex items-center rounded border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variantClasses = {
    success: "border-green-200 bg-green-100 text-green-800 dark:border-green-800 dark:bg-green-900 dark:text-green-300",
    info: "border-blue-200 bg-blue-100 text-blue-800 dark:border-blue-800 dark:bg-blue-900 dark:text-blue-300",
    warning: "border-yellow-200 bg-yellow-100 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    error: "border-red-200 bg-red-100 text-red-800 dark:border-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const classes = cn(baseClasses, variantClasses[variant], className);

  return <div className={classes} {...props} />;
}

export { Badge };