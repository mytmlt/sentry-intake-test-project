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

export function invoiceDueDateIso(issuedOn: string): string | undefined {
  const issueDate = new Date(issuedOn)
  if (Number.isNaN(issueDate.getTime())) return

  return issueDate.toISOString()
}

export function run(): void {
  const due = invoiceDueDateIso(invoiceIssuedOn())
  void due
}
