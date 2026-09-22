import { useMemo, useState } from 'react'
import {
  addToCart,
  CATALOG,
  cartTotal,
  emptyCart,
  formatMoney,
  isCartEmpty,
  lineTotal,
  removeFromCart,
  restoreSavedCart,
  saveCartForLater,
  setCartQty,
} from './cart/cart'
import {
  clearSavedCart,
  loadSavedCart,
  persistSavedCart,
} from './cart/storage'
import type { Cart, SavedCart } from './cart/types'

function browserStorage(): Storage | null {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

function formatSavedAt(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) {
    return iso
  }
  return date.toLocaleString()
}

export function CartPanel() {
  const storage = useMemo(() => browserStorage(), [])
  const [cart, setCart] = useState(emptyCart)
  const [saved, setSaved] = useState<SavedCart | null>(() =>
    storage ? loadSavedCart(storage) : null,
  )
  const [notice, setNotice] = useState('')

  function remember(next: SavedCart | null) {
    setSaved(next)
    if (!storage) {
      return
    }
    if (next) {
      persistSavedCart(next, storage)
    } else {
      clearSavedCart(storage)
    }
  }

  function saveForLater() {
    if (isCartEmpty(cart)) {
      setNotice('Add items before saving a cart.')
      return
    }
    remember(saveCartForLater(cart))
    setNotice('Cart saved. Come back anytime to restore it.')
  }

  function restore() {
    if (!saved) {
      return
    }
    if (
      !isCartEmpty(cart) &&
      !window.confirm('Replace the current cart with the saved cart?')
    ) {
      return
    }
    setCart(restoreSavedCart(saved))
    setNotice('Saved cart restored.')
  }

  function discardSaved() {
    remember(null)
    setNotice('Saved cart discarded.')
  }

  return (
    <section className="shop" aria-labelledby="shop-heading">
      <div className="section-head">
        <h2 id="shop-heading">Harbor cart</h2>
        <p>Build a cart, then save it for later and restore it on this device.</p>
      </div>

      <div className="panel-grid">
        <div className="panel">
          <h3>Catalog</h3>
          <ul className="shop-list">
            {CATALOG.map((product) => (
              <li key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <span>{formatMoney(product.price)}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setCart((current) => addToCart(current, product))
                    setNotice('')
                  }}
                >
                  Add
                </button>
              </li>
            ))}
          </ul>
        </div>

        <CartList
          title="Current cart"
          cart={cart}
          emptyText="Cart is empty."
          onQty={(id, qty) => {
            setCart((current) => setCartQty(current, id, qty))
          }}
          onRemove={(id) => {
            setCart((current) => removeFromCart(current, id))
          }}
        />

        <div className="panel">
          <h3>Saved for later</h3>
          {saved ? (
            <>
              <p className="hint">Saved {formatSavedAt(saved.savedAt)}</p>
              <CartList
                title=""
                cart={restoreSavedCart(saved)}
                emptyText="Saved cart is empty."
              />
              <div className="shop-actions">
                <button type="button" onClick={restore}>
                  Restore cart
                </button>
                <button type="button" className="secondary" onClick={discardSaved}>
                  Discard
                </button>
              </div>
            </>
          ) : (
            <p className="hint">No saved cart yet.</p>
          )}
          <button
            type="button"
            className="primary-action"
            onClick={saveForLater}
            disabled={isCartEmpty(cart)}
          >
            Save cart for later
          </button>
          {notice ? (
            <p className="hint" role="status">
              {notice}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function CartList({
  title,
  cart,
  emptyText,
  onQty,
  onRemove,
}: {
  title: string
  cart: Cart
  emptyText: string
  onQty?: (id: string, qty: number) => void
  onRemove?: (id: string) => void
}) {
  const editable = Boolean(onQty && onRemove)

  return (
    <div className={title ? 'panel' : 'saved-lines'}>
      {title ? <h3>{title}</h3> : null}
      {isCartEmpty(cart) ? (
        <p className="hint">{emptyText}</p>
      ) : (
        <ul className="shop-list">
          {cart.items.map((item) => (
            <li key={item.id}>
              <div>
                <strong>{item.name}</strong>
                <span>
                  {item.qty} × {formatMoney(item.price)} = {formatMoney(lineTotal(item))}
                </span>
              </div>
              {editable ? (
                <div className="qty-row">
                  <button
                    type="button"
                    className="secondary"
                    aria-label={`Decrease ${item.name}`}
                    onClick={() => onQty?.(item.id, item.qty - 1)}
                  >
                    −
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    aria-label={`Increase ${item.name}`}
                    onClick={() => onQty?.(item.id, item.qty + 1)}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => onRemove?.(item.id)}
                  >
                    Remove
                  </button>
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
      {!isCartEmpty(cart) ? (
        <p className="cart-total">Total {formatMoney(cartTotal(cart))}</p>
      ) : null}
    </div>
  )
}
