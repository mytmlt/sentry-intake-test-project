import type { CartItem, SavedCart } from './types'

export const SAVED_CART_KEY = 'harbor-shop.saved-cart'

export type StorageLike = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const item = value as Record<string, unknown>
  return (
    typeof item.id === 'string' &&
    typeof item.name === 'string' &&
    typeof item.price === 'number' &&
    Number.isFinite(item.price) &&
    typeof item.qty === 'number' &&
    Number.isInteger(item.qty) &&
    item.qty > 0
  )
}

function isSavedCart(value: unknown): value is SavedCart {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const saved = value as Record<string, unknown>
  return (
    typeof saved.savedAt === 'string' &&
    Number.isFinite(Date.parse(saved.savedAt)) &&
    Array.isArray(saved.items) &&
    saved.items.every(isCartItem)
  )
}

export function loadSavedCart(storage: StorageLike): SavedCart | null {
  const raw = storage.getItem(SAVED_CART_KEY)
  if (!raw) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(raw)
    return isSavedCart(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function persistSavedCart(saved: SavedCart, storage: StorageLike): void {
  storage.setItem(SAVED_CART_KEY, JSON.stringify(saved))
}

export function clearSavedCart(storage: StorageLike): void {
  storage.removeItem(SAVED_CART_KEY)
}
