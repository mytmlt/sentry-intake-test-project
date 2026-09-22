export const LOW_STOCK_THRESHOLD = 5

export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export function stockStatus(quantity: number): StockStatus {
  if (quantity <= 0) {
    return 'out-of-stock'
  }
  if (quantity <= LOW_STOCK_THRESHOLD) {
    return 'low-stock'
  }
  return 'in-stock'
}

export function stockLabel(quantity: number): string {
  const status = stockStatus(quantity)
  if (status === 'out-of-stock') {
    return 'Out of stock'
  }
  if (status === 'low-stock') {
    return `${quantity} left`
  }
  return `In stock (${quantity})`
}
