import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names into a single string, handling conditional classes
 * and merging Tailwind classes intelligently (even if we are using vanilla CSS mostly, 
 * twMerge is safe and helpful for standard utility conflicts if we ever mix them).
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
