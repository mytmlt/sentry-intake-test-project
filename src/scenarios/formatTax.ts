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

function toNumber(value: unknown): number {
  const n = Number(value)
  if (Number.isFinite(n)) return n
  return NaN
}

export function run(): void {
  const price = toNumber(catalogPrice())
  const tax = price.toFixed(2)
  void tax
}
