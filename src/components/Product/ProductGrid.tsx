import { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import { productAPI } from '../../services/api'
import { useLocation } from '../../context/LocationContext'
import type { Product } from '../../types/api'

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { pincode } = useLocation()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        
        // Get products based on location or all products if no pincode
        let apiProducts: Product[]
        
        if (pincode) {
          apiProducts = await productAPI.getByLocation(pincode, { limit: 6 })
        } else {
          apiProducts = await productAPI.getAll({ limit: 6 })
        }
        
        setProducts(apiProducts)
        setError(null)
      } catch (err) {
        console.error('Error fetching products:', err)
        setError('Failed to load products')
        // Keep empty array to show fallback
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [pincode]) // Re-fetch when pincode changes


  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Discover our best-selling items and daily specials</p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error && products.length === 0) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600">Discover our best-selling items and daily specials</p>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="btn-primary"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {pincode ? `Products in ${pincode}` : 'Featured Products'}
          </h2>
          <p className="text-gray-600">
            {pincode 
              ? `Fresh products available for delivery in pincode ${pincode}` 
              : 'Discover our best-selling items and daily specials'
            }
          </p>
        </div>
        
        {products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              {products.map((product) => {
                const primaryImage = product.images?.find(img => img.is_primary)?.image_url
                const fallbackImage = product.images?.[0]?.image_url
                
                return (
                  <ProductCard
                    key={product.product_id}
                    product_id={product.product_id}
                    product_name={product.product_name}
                    base_price={product.base_price}
                    discounted_price={product.discounted_price}
                    image_url={primaryImage || fallbackImage}
                    category_name={product.category_name}
                    status={product.status}
                  />
                )
              })}
            </div>
            
            <div className="text-center mt-12">
              <button className="btn-primary">
                View All Products
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available at the moment</p>
          </div>
        )}
      </div>
    </section>
  )
}