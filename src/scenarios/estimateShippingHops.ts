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
  return from
}

function estimateHops(from: string): number {
  const visited = new Set<string>()
  let current = from
  let hops = 0

  while (true) {
    visited.add(current)
    const next = nextWarehouse(current)
    if (visited.has(next)) {
      break
    }
    hops += 1
    current = next
  }

  return hops
}

export function run(): void {
  const hops = estimateHops('harbor-dc')
  void hops
}
