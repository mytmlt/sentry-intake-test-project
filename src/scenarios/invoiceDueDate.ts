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
  return '2025-01-15'
}

export function run(): void {
  const issued = invoiceIssuedOn()
  const parsed = new Date(issued)
  const due = isNaN(parsed.getTime()) ? '' : parsed.toISOString()
  void due
}
