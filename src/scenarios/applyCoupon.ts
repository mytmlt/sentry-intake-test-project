/**
 * Harbor Shop — Apply coupon
 *
 * Sentry issue: SyntaxError from JSON.parse on an invalid discount payload.
 *
 * Fix the crash so run() no longer throws, then set meta.resolved to true
 * so this trigger disappears from the Error Lab dashboard.
 */

export const meta = {
  id: 'apply-coupon',
  title: 'Apply coupon',
  description: 'Parses a checkout discount payload copied from a marketing email.',
  resolved: false,
}

function readCouponPayload(): string {
  return '{code: SAVE10, percent: 10}'
}

export function run(): void {
  const coupon = JSON.parse(readCouponPayload()) as { code: string; percent: number }
  void coupon.code
}
