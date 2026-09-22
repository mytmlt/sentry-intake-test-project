import type { Cart, CartItem, CatalogItem, SavedCart } from './types'

export const CATALOG: CatalogItem[] = [
  { id: 'rope', name: 'Mooring rope', price: 24 },
  { id: 'lantern', name: 'Deck lantern', price: 48 },
  { id: 'compass', name: 'Brass compass', price: 36 },
]

export function emptyCart(): Cart {
  return { items: [] }
}

export function lineTotal(item: CartItem): number {
  return item.price * item.qty
}

export function cartTotal(cart: Cart): number {
  return cart.items.reduce((sum, item) => sum + lineTotal(item), 0)
}

export function isCartEmpty(cart: Cart): boolean {
  return cart.items.length === 0
}

export function addToCart(cart: Cart, product: CatalogItem, qty = 1): Cart {
  if (qty < 1) {
    return cart
  }

  const existing = cart.items.find((item) => item.id === product.id)
  if (existing) {
    return {
      items: cart.items.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + qty } : item,
      ),
    }
  }

  return {
    items: [...cart.items, { ...product, qty }],
  }
}

export function setCartQty(cart: Cart, id: string, qty: number): Cart {
  if (qty < 1) {
    return { items: cart.items.filter((item) => item.id !== id) }
  }

  return {
    items: cart.items.map((item) => (item.id === id ? { ...item, qty } : item)),
  }
}

export function removeFromCart(cart: Cart, id: string): Cart {
  return { items: cart.items.filter((item) => item.id !== id) }
}

export function saveCartForLater(cart: Cart, savedAt = new Date()): SavedCart {
  return {
    items: cart.items.map((item) => ({ ...item })),
    savedAt: savedAt.toISOString(),
  }
}

export function restoreSavedCart(saved: SavedCart): Cart {
  return { items: saved.items.map((item) => ({ ...item })) }
}

export function formatMoney(amount: number): string {
  return `$${amount.toFixed(2)}`
}
