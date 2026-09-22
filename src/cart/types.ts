export type CatalogItem = {
  id: string
  name: string
  price: number
}

export type CartItem = CatalogItem & {
  qty: number
}

export type Cart = {
  items: CartItem[]
}

export type SavedCart = {
  items: CartItem[]
  savedAt: string
}
