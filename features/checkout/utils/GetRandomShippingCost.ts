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
