import { catalogProducts } from './products'
import { ProductCard } from './ProductCard'

export function Catalog() {
  return (
    <section className="catalog" aria-labelledby="catalog-heading">
      <div className="section-head">
        <h2 id="catalog-heading">Shop catalog</h2>
        <p>Stock levels are shown on every product card.</p>
      </div>
      <ul className="product-grid">
        {catalogProducts.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  )
}
