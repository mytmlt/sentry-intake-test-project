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

function nextWarehouse(from: string): string {
  const routes: Record<string, string> = {
    'harbor-dc': 'philadelphia-pa',
    'philadelphia-pa': 'newark-nj',
    'newark-nj': 'bronx-ny',
    'bronx-ny': 'customer',
  }
  return routes[from] ?? from
}

const visited = new Set<string>()

function estimateHops(from: string): number {
  if (visited.has(from)) return 0
  visited.add(from)
  const next = nextWarehouse(from)
  if (next === 'customer') return 1
  return 1 + estimateHops(next)
}

export function run(): void {
  visited.clear()
  const hops = estimateHops('harbor-dc')
  void hops
}
