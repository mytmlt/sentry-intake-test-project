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
  resolved: false,
}

function catalogPrice(): unknown {
  return '19.99'
}

export function run(): void {
  const price = catalogPrice() as number
  const tax = price.toFixed(2)
  void tax
}
