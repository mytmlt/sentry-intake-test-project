import { describe, expect, it } from 'vitest'
import { catalogProducts, formatPrice } from './products.ts'

describe('catalogProducts', () => {
  it('covers in stock, low stock, and out of stock items', () => {
    const quantities = catalogProducts.map((product) => product.stock)
    expect(quantities.some((stock) => stock > 5)).toBe(true)
    expect(quantities.some((stock) => stock > 0 && stock <= 5)).toBe(true)
    expect(quantities.some((stock) => stock <= 0)).toBe(true)
  })
})

describe('formatPrice', () => {
  it('renders a two-decimal dollar amount', () => {
    expect(formatPrice(24)).toBe('$24.00')
  })
})
