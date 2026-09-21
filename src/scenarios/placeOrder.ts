/**
 * Harbor Shop — Place order
 *
 * Sentry issue: TypeError reading `.orderId` on an unresolved checkout Promise.
 *
 * Fix the crash so run() no longer throws, then set meta.resolved to true
 * so this trigger disappears from the Error Lab dashboard.
 */

export const meta = {
  id: 'place-order',
  title: 'Place order',
  description: 'Submits checkout and reads the receipt before awaiting the response.',
  resolved: false,
}

type Receipt = { orderId: string }

function submitOrder(): Promise<Receipt> {
  return Promise.resolve({ orderId: 'ord_200' })
}

export function run(): void {
  const receipt = submitOrder() as unknown as Receipt
  const shortId = receipt.orderId.slice(0, 8)
  void shortId
}
