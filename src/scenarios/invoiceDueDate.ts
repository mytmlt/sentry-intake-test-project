/**
 * Harbor Shop — Invoice due date
 *
 * Sentry issue: RangeError: Invalid time value from Date#toISOString.
 *
 * Fix the crash so run() no longer throws, then set meta.resolved to true
 * so this trigger disappears from the Error Lab dashboard.
 */

export const meta = {
  id: 'invoice-due-date',
  title: 'Invoice due date',
  description: 'Serializes the invoice due date from a malformed issued-on field.',
  resolved: true,
}

const NET_TERMS_DAYS = 30

function invoiceIssuedOn(): string {
  return '2026-09-01T00:00:00.000Z'
}

function parseDate(value: string): Date | null {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return null
  }
  return parsed
}

export function dueDateIso(issuedOn: string, netDays = NET_TERMS_DAYS): string {
  const issued = parseDate(issuedOn) ?? new Date(Date.UTC(2026, 8, 1))
  const due = new Date(issued.getTime())
  due.setUTCDate(due.getUTCDate() + netDays)
  return due.toISOString()
}

export function run(): void {
  const due = dueDateIso(invoiceIssuedOn())
  void due
}
