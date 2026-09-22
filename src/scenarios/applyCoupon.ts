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
  resolved: true,
}

export type Coupon = {
  code: string
  percent: number
}

function readCouponPayload(): string {
  return '{"code": "SAVE10", "percent": 10'
}

function tryParseJson(raw: string): unknown {
  try {
    return JSON.parse(raw)
  } catch {
    const trimmed = raw.trim()
    if (!trimmed) {
      return null
    }
    const repaired = trimmed.endsWith('}') ? trimmed : `${trimmed}}`
    try {
      return JSON.parse(repaired)
    } catch {
      return null
    }
  }
}

function asCoupon(value: unknown): Coupon | null {
  if (!value || typeof value !== 'object') {
    return null
  }
  const record = value as Record<string, unknown>
  if (typeof record.code !== 'string' || record.code.trim() === '') {
    return null
  }
  if (typeof record.percent !== 'number' || !Number.isFinite(record.percent)) {
    return null
  }
  return { code: record.code, percent: record.percent }
}

export function parseCouponPayload(raw: string): Coupon | null {
  return asCoupon(tryParseJson(raw))
}

export function applyCoupon(subtotal: number, payload: string): number {
  const coupon = parseCouponPayload(payload)
  if (!coupon) {
    return subtotal
  }
  const percent = Math.min(100, Math.max(0, coupon.percent))
  return Math.round(subtotal * (100 - percent)) / 100
}

export function run(): void {
  const discounted = applyCoupon(100, readCouponPayload())
  void discounted
}
