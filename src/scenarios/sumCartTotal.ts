/**
 * Harbor Shop — Sum cart total
 *
 * Sentry issue: TypeError calling `.reduce` on undefined cart items.
 *
 * Fix the crash so run() no longer throws, then set meta.resolved to true
 * so this trigger disappears from the Error Lab dashboard.
 */

export const meta = {
  id: 'sum-cart-total',
  title: 'Sum cart total',
  description: 'Totals line items for a cart that has not been hydrated yet.',
  resolved: true,
}

type CartItem = { price: number; qty: number }
type Cart = { items?: CartItem[] }

function fetchEmptyCart(): Cart {
  return {}
}

export function run(): void {
  const cart = fetchEmptyCart()
  const total = (cart.items ?? []).reduce((sum, item) => sum + item.price * item.qty, 0)
  void total
}
