/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/**
 * Resolves a colour value for the current light/dark colour scheme.
 *
 * First checks `props` for a per-usage override — if the caller supplied a
 * colour for the current scheme that value is returned. Otherwise falls back to
 * the matching colour from `constants/theme.ts`.
 *
 * @param props - Optional per-instance colour overrides keyed by scheme.
 * @param colorName - A colour key that exists on both `Colors.light` and `Colors.dark`.
 * @returns The resolved colour string for the active colour scheme.
 *
 * @example
 * // Use the theme's default 'text' colour, but override it in dark mode
 * const color = useThemeColor({ dark: '#ffffff' }, 'text');
 */
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}
