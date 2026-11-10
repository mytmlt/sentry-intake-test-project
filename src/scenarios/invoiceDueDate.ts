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

export function run(): void {
  const issuedOn = invoiceIssuedOn()
  const issued = new Date(issuedOn)
  if (isNaN(issued.getTime())) {
    return
  }
  const due = new Date(issued.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
  void due
}
