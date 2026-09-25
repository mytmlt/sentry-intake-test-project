/**
 * Harbor Shop — Format tax
 *
 * Sentry issue: TypeError because a string catalog price has no `.toFixed`.
 *
 * Fix the crash so run() no longer throws, then set meta.resolved to true
 * so this trigger disappears from the Error Lab dashboard.
 */

export const meta = {
  id: 'format-tax',
  title: 'Format tax',
  description: 'Formats sales tax from a catalog price that arrives as a string.',
  resolved: true,
}

function catalogPrice(): unknown {
  return '19.99'
}

// The catalog API returns prices as unknown, and the previous code silently
// asserted `as number` on that value. TypeScript believed the lie, but at
// runtime the string had no `.toFixed`. Convert the raw value into a real
// number at the boundary instead of trusting an unsafe cast.
function toNumber(value: unknown): number {
  const numeric = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(numeric)) {
    throw new TypeError(`Expected a numeric catalog price, got ${String(value)}`)
  }
  return numeric
}

export function run(): void {
  const price = toNumber(catalogPrice())
  const tax = price.toFixed(2)
  void tax
}
