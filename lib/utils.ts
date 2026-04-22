import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combines and deduplicates Tailwind CSS class names.
 *
 * Internally uses `clsx` to handle conditional/array class inputs and
 * `tailwind-merge` to resolve Tailwind conflicts (e.g. `p-2 p-4` → `p-4`).
 * This is the standard pattern used by Shadcn UI components.
 *
 * @param inputs - Any number of class values: strings, arrays, or objects.
 * @returns A single merged class string safe to pass to `className`.
 *
 * @example
 * cn('px-2 py-1', isActive && 'bg-blue-500', 'px-4')
 * // → 'py-1 bg-blue-500 px-4'  (px-2 is overridden by px-4)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPhoneNumber(input?: string | number): string {
  const digits = String(input).replace(/\D/g, '');

  if (digits.length !== 10) {
    return digits;
  }

  const areaCode = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const lineNumber = digits.slice(6);

  return `(${areaCode}) ${prefix}-${lineNumber}`;
}
