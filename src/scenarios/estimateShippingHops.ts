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

const WAREHOUSE_CHAIN = ['harbor-dc', 'north-region', 'city-hub', 'local-depot', ''] as const

function nextWarehouse(from: string): string {
  const index = WAREHOUSE_CHAIN.indexOf(from as (typeof WAREHOUSE_CHAIN)[number])
  return index === -1 ? '' : WAREHOUSE_CHAIN[index + 1] ?? ''
}

function estimateHops(from: string): number {
  if (from === '') {
    return 0
  }
  return 1 + estimateHops(nextWarehouse(from))
}

export function run(): void {
  const hops = estimateHops('harbor-dc')
  void hops
}
