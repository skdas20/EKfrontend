import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { categoryAPI } from '../../services/api'
import type { InternalCategory } from '../../types/api'


// Fallback image mapping
const getCategoryImage = (categoryName: string) => {
  const name = categoryName.toLowerCase()
  if (name.includes('fruit')) return 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400'
  if (name.includes('vegetable')) return 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'
  if (name.includes('grain') || name.includes('rice')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
  if (name.includes('dairy')) return 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400'
  if (name.includes('meat')) return 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400'
  if (name.includes('fish')) return 'https://images.unsplash.com/photo-1544943765-1f0b8ebea73a?w=400'
  if (name.includes('beverage')) return 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400'
  return 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' // Default grocery image
}

export default function CategoryGrid() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState<InternalCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const apiCategories = await categoryAPI.getAll()
        console.log('API Categories received:', apiCategories) // Debug log
        
        // Transform API response to match expected format
        const transformedCategories = apiCategories.map(cat => ({
          category_id: cat.id,
          category_name: cat.name,
          description: cat.description,
          image_url: cat.imageUrl,
          status: 'active' as const, // Assume all returned categories are active
          created_at: cat.createdAt,
          updated_at: cat.createdAt
        }))
        
        setCategories(transformedCategories)
        setError(null)
      } catch (err) {
        console.error('Error fetching categories:', err)
        setError('Failed to load categories')
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you need in our organized categories</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-32 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 text-center">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error && categories.length === 0) {
    return (
      <section className="py-16 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600">Find exactly what you need in our organized categories</p>
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
    <section data-section="categories" className="py-16 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-gray-600">Find exactly what you need in our organized categories</p>
        </div>
        
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => {
              const imageUrl = category.image_url || getCategoryImage(category.category_name)
              
              return (
                <div
                  key={category.category_id}
                  onClick={() => navigate(`/category/${category.category_id}`)}
                  className="card bg-white hover:bg-brand-50 hover:shadow-lg transition-all duration-200 cursor-pointer group rounded-lg overflow-hidden border border-brand-100"
                >
                  <div className="relative overflow-hidden rounded-t-lg">
                    <img
                      src={imageUrl}
                      alt={category.category_name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        // Fallback to default image if image fails to load
                        const img = e.target as HTMLImageElement
                        img.src = getCategoryImage(category.category_name)
                      }}
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 mb-1">{category.category_name}</h3>
                    <p className="text-sm text-gray-500">Browse products</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories available at the moment</p>
          </div>
        )}
      </div>
    </section>
  )
}