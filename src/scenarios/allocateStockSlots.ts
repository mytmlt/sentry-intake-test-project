/**
 * Harbor Shop — Allocate stock slots
 *
 * Sentry issue: RangeError: Invalid array length from new Array(-1).
 *
 * Fixed: the inventory API can report a negative count when stock is
 * oversold, so the slot count is clamped to zero before allocating the
 * array instead of trusting the raw value.
 */

export const meta = {
  id: 'allocate-stock-slots',
  title: 'Allocate stock slots',
  description: 'Builds warehouse slots from an inventory count returned by the API.',
  resolved: true,
}

function availableStock(): number {
  return -1
}

function toSlotCount(rawCount: number): number {
  return Math.max(0, rawCount)
}

export function run(): void {
  const slots = new Array(toSlotCount(availableStock()))
  void slots.length
}
