import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Shared style for inline body-text links across content pages. */
export const CONTENT_LINK_CLASS =
  "text-burgundy font-medium underline decoration-1 underline-offset-2 transition-colors hover:text-burgundy-dark hover:decoration-2";
