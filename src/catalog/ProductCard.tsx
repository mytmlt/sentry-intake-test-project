import { formatPrice, type Product } from './products'
import { stockLabel, stockStatus } from './stock'

type ProductCardProps = {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const status = stockStatus(product.stock)

  return (
    <article className="product-card" data-stock={status}>
      <h3>{product.name}</h3>
      <p className="product-price">{formatPrice(product.price)}</p>
      <p className={`product-stock ${status}`} aria-live="polite">
        {stockLabel(product.stock)}
      </p>
    </article>
  )
}
