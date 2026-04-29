import { clsx, type ClassValue } from 'clsx';
import { isNil } from 'lodash';
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
  if (isNil(input)) {
    return '';
  }
  const digits = String(input).replace(/\D/g, '');

  if (digits.length !== 10) {
    return digits;
  }

  const areaCode = digits.slice(0, 3);
  const prefix = digits.slice(3, 6);
  const lineNumber = digits.slice(6);

  return `(${areaCode}) ${prefix}-${lineNumber}`;
}

export function getRandomShippingCost() {
  const maxRaw = process.env.EXPO_PUBLIC_MAX_SHIPPING_COST ?? process.env.MAX_SHIPPING_COST;
  const minRaw = process.env.EXPO_PUBLIC_MIN_SHIPPING_COST ?? process.env.MIN_SHIPPING_COST;
  const maxParsed = maxRaw != null && maxRaw !== '' ? Number(maxRaw) : Number.NaN;
  const minParsed = minRaw != null && minRaw !== '' ? Number(minRaw) : Number.NaN;
  const MAX = Number.isFinite(maxParsed) ? maxParsed : 25;
  const MIN = Number.isFinite(minParsed) ? minParsed : 0;
  const hi = Math.max(MIN, MAX);
  const lo = Math.min(MIN, MAX);
  return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}
