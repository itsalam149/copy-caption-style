// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to conditionally join class names and merge Tailwind classes.
 * @param inputs - ClassValue inputs (strings, objects, arrays)
 * @returns A merged string of class names.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}