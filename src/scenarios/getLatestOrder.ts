/**
 * Harbor Shop — Open latest order
 *
 * Sentry issue: TypeError reading `.id` after an off-by-one orders lookup.
 *
 * Fix the crash so run() no longer throws, then set meta.resolved to true
 * so this trigger disappears from the Error Lab dashboard.
 */

export const meta = {
  id: 'open-latest-order',
  title: 'Open latest order',
  description: 'Loads the most recent order on the account history page.',
  resolved: true,
}

type Order = { id: string; total: number }

function listOrders(): Order[] {
  return [{ id: 'ord_100', total: 42 }]
}

export function run(): void {
  const orders = listOrders()
  const latest = orders[orders.length - 1]
  const id = latest?.id ?? null
  void id
}
