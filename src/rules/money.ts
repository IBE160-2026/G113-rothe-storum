// Money arithmetic (AD-5). The only place a cost factor is multiplied, in
// integer hundredths, so a float product is never rounded.

/**
 * The stay for one city day in whole euros: `base × costFactor`, with halves
 * rounded up (FR-8). The cost factor has at most two decimals (content
 * schema), so `f = round(costFactor × 100)` is exact and the rest is integer
 * arithmetic: `n = base × f × 100`, price `⌊(n + 5000) / 10000⌋`.
 */
export function accommodationPrice(base: number, costFactor: number): number {
  const f = Math.round(costFactor * 100);
  const n = base * f * 100;
  return Math.floor((n + 5000) / 10000);
}
