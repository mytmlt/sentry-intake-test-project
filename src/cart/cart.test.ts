import { describe, expect, it } from 'vitest'
import {
  addToCart,
  cartTotal,
  CATALOG,
  emptyCart,
  formatMoney,
  removeFromCart,
  restoreSavedCart,
  saveCartForLater,
  setCartQty,
} from './cart.ts'
import {
  clearSavedCart,
  loadSavedCart,
  persistSavedCart,
  SAVED_CART_KEY,
} from './storage.ts'

function memoryStorage(seed: Record<string, string> = {}) {
  const store = { ...seed }
  return {
    getItem(key: string) {
      return store[key] ?? null
    },
    setItem(key: string, value: string) {
      store[key] = value
    },
    removeItem(key: string) {
      delete store[key]
    },
  }
}

describe('cart', () => {
  it('adds a new line and merges quantity for the same product', () => {
    const [rope] = CATALOG
    const cart = addToCart(addToCart(emptyCart(), rope), rope, 2)
    expect(cart.items).toEqual([{ ...rope, qty: 3 }])
    expect(cartTotal(cart)).toBe(72)
  })

  it('ignores non-positive add quantities', () => {
    const [rope] = CATALOG
    expect(addToCart(emptyCart(), rope, 0)).toEqual(emptyCart())
  })

  it('updates quantity and drops a line at zero', () => {
    const [rope, lantern] = CATALOG
    let cart = addToCart(addToCart(emptyCart(), rope), lantern)
    cart = setCartQty(cart, rope.id, 4)
    expect(cart.items.find((item) => item.id === rope.id)?.qty).toBe(4)
    cart = setCartQty(cart, lantern.id, 0)
    expect(cart.items.map((item) => item.id)).toEqual([rope.id])
  })

  it('removes a line item', () => {
    const [rope] = CATALOG
    const cart = removeFromCart(addToCart(emptyCart(), rope), rope.id)
    expect(cart.items).toEqual([])
  })

  it('snapshots a cart for later without sharing item references', () => {
    const [rope] = CATALOG
    const cart = addToCart(emptyCart(), rope, 2)
    const saved = saveCartForLater(cart, new Date('2026-09-22T12:00:00.000Z'))
    cart.items[0].qty = 9
    expect(saved).toEqual({
      items: [{ ...rope, qty: 2 }],
      savedAt: '2026-09-22T12:00:00.000Z',
    })
    expect(restoreSavedCart(saved).items[0].qty).toBe(2)
  })

  it('formats money with two decimals', () => {
    expect(formatMoney(24)).toBe('$24.00')
  })
})

describe('saved cart storage', () => {
  it('persists and reloads a saved cart', () => {
    const storage = memoryStorage()
    const saved = saveCartForLater(
      addToCart(emptyCart(), CATALOG[0], 1),
      new Date('2026-09-22T12:00:00.000Z'),
    )
    persistSavedCart(saved, storage)
    expect(loadSavedCart(storage)).toEqual(saved)
  })

  it('returns null for missing or invalid payloads', () => {
    expect(loadSavedCart(memoryStorage())).toBeNull()
    expect(
      loadSavedCart(memoryStorage({ [SAVED_CART_KEY]: '{not json' })),
    ).toBeNull()
    expect(
      loadSavedCart(
        memoryStorage({
          [SAVED_CART_KEY]: JSON.stringify({ savedAt: 'nope', items: [] }),
        }),
      ),
    ).toBeNull()
  })

  it('clears a saved cart', () => {
    const storage = memoryStorage({
      [SAVED_CART_KEY]: JSON.stringify(
        saveCartForLater(addToCart(emptyCart(), CATALOG[1]), new Date()),
      ),
    })
    clearSavedCart(storage)
    expect(loadSavedCart(storage)).toBeNull()
  })
})
