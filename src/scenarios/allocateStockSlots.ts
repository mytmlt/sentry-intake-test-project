/**
 * Harbor Shop — Allocate stock slots
 *
 * Sentry issue: RangeError: Invalid array length from new Array(-1).
 *
 * Fix the crash so run() no longer throws, then set meta.resolved to true
 * so this trigger disappears from the Error Lab dashboard.
 */

export const meta = {
  id: 'allocate-stock-slots',
  title: 'Allocate stock slots',
  description: 'Builds warehouse slots from an inventory count returned by the API.',
  resolved: false,
}

function availableStock(): number {
  return -1
}

export function run(): void {
  const slots = new Array(availableStock())
  void slots.length
}
