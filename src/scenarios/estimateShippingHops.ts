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

function estimateHops(from: string, seen: Set<string> = new Set()): number {
  const next = nextWarehouse(from)
  if (next === from || seen.has(from) || seen.has(next)) {
    return 0
  }
  seen.add(from)
  return 1 + estimateHops(next, seen)
}

export function run(): void {
  const hops = estimateHops('harbor-dc')
  void hops
}
