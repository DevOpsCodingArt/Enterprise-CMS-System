import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with clsx + tailwind-merge.
 * Handles conditional classes and deduplication of conflicting utilities.
 *
 * @example
 * cn("px-4 py-2", isActive && "bg-primary text-primary-foreground")
 * cn("rounded-lg", className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
