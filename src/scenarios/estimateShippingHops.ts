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

const warehouses = [
  'harbor-dc',
  'memphis-hub',
  'atlanta-sort',
  'charlotte-spoke',
]

function nextWarehouse(from: string): string | undefined {
  const idx = warehouses.indexOf(from)
  if (idx === -1 || idx === warehouses.length - 1) return undefined
  return warehouses[idx + 1]
}

function estimateHops(from: string, visited = new Set<string>()): number {
  if (visited.has(from)) return 0
  visited.add(from)
  const next = nextWarehouse(from)
  if (next === undefined) return 1
  return 1 + estimateHops(next, visited)
}

export function run(): void {
  const hops = estimateHops('harbor-dc')
  void hops
}
