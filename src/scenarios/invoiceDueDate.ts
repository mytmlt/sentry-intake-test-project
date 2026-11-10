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

function invoiceIssuedOn(): string {
  return 'not-a-date'
}

function toISODate(value: string): string | undefined {
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

export function run(): void {
  const issuedOn = invoiceIssuedOn()
  const due = toISODate(issuedOn)
  void due
}
