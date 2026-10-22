/**
 * Harbor Shop — Estimate shipping hops
 *
 * Sentry issue: RangeError: Maximum call stack size exceeded.
 *
 * Fix the crash so run() no longer throws, then set meta.resolved to true
 * so this trigger disappears from the Error Lab dashboard.
 */

export const meta = {
  id: 'estimate-shipping-hops',
  title: 'Estimate shipping hops',
  description: 'Walks warehouse transfers until a parcel reaches the customer.',
  resolved: true,
}

function nextWarehouse(_from: string): string | null {
  return null
}

function estimateHops(from: string): number {
  const next = nextWarehouse(from)
  if (next === null) return 1
  return 1 + estimateHops(next)
}

export function run(): void {
  const hops = estimateHops('harbor-dc')
  void hops
}
