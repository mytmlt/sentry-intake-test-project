export type Product = {
  id: string
  name: string
  price: number
  stock: number
}

export const catalogProducts: Product[] = [
  { id: 'rope', name: 'Harbor Rope', price: 24, stock: 18 },
  { id: 'lantern', name: 'Dock Lantern', price: 42, stock: 4 },
  { id: 'compass', name: 'Brass Compass', price: 65, stock: 0 },
  { id: 'oilskin', name: 'Oilskin Jacket', price: 120, stock: 11 },
]

export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}
