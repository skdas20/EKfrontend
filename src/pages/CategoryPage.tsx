import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Grid, List, Filter, ChevronDown } from 'lucide-react'
import ProductCard from '../components/Product/ProductCard'
import SubCategoryCarousel from '../components/Categories/SubCategoryCarousel'
import { LoadingSpinner } from '../components/Loading/LoadingPage'
import { productAPI, categoryAPI } from '../services/api'
import { useLocation } from '../context/LocationContext'
import type { Product, InternalCategory } from '../types/api'

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { pincode } = useLocation()

  const [products, setProducts] = useState<Product[]>([])
  const [category, setCategory] = useState<InternalCategory | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'price_low' | 'price_high'>('name')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null)

  const currentSubCategory = searchParams.get('subcategory') ? parseInt(searchParams.get('subcategory')!) : null

  // Function to fetch products based on category and subcategory
  const fetchProducts = async () => {
    if (!id) return

    try {
      setLoading(true)

      // Determine which API to call based on subcategory selection
      let productsData: Product[]

      if (selectedSubcategory) {
        // Fetch products by subcategory name
        productsData = pincode
          ? await productAPI.getBySubcategory(selectedSubcategory, { pincode })
          : await productAPI.getBySubcategory(selectedSubcategory)
      } else {
        // Fetch products by category
        productsData = pincode
          ? await productAPI.getByLocation(pincode, { category_id: parseInt(id) })
          : await productAPI.getAll({ category_id: parseInt(id) })
      }

      setProducts(productsData)
      setError(null)
    } catch (err) {
      console.error('Error fetching products:', err)
      setError('Failed to load products')
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!id) return

      try {
        setLoading(true)

        // Fetch category details
        const categoryData = await categoryAPI.getAll().then(categories =>
          categories.find(cat => cat.id.toString() === id)
        )

        if (categoryData) {
          // Transform category data to match expected format
          setCategory({
            category_id: categoryData.id,
            category_name: categoryData.name,
            description: categoryData.description,
            image_url: categoryData.imageUrl,
            status: 'active' as const,
            created_at: categoryData.createdAt,
            updated_at: categoryData.createdAt
          })
        }

        setError(null)
      } catch (err) {
        console.error('Error fetching category data:', err)
        setError('Failed to load category')
        setCategory(null)
      } finally {
        setLoading(false)
      }
    }

    fetchCategoryData()
  }, [id])

  // Fetch products when category, subcategory, or pincode changes
  useEffect(() => {
    fetchProducts()
  }, [id, selectedSubcategory, pincode])

  // Handle subcategory selection
  const handleSubcategoryChange = (subcategoryName: string | null) => {
    setSelectedSubcategory(subcategoryName)
  }

  const sortedProducts = products.sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        const priceA = a.discounted_price || a.base_price
        const priceB = b.discounted_price || b.base_price
        return priceA - priceB
      case 'price_high':
        const priceA2 = a.discounted_price || a.base_price
        const priceB2 = b.discounted_price || b.base_price
        return priceB2 - priceA2
      case 'name':
      default:
        return a.product_name.localeCompare(b.product_name)
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (error || !category) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Category not found'}
          </h1>
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </button>

          {/* Category Header */}
          <div className="flex items-center space-x-4">
            {category.image_url && (
              <img
                src={category.image_url}
                alt={category.category_name}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {category.category_name}
                {selectedSubcategory && (
                  <span className="text-2xl text-gray-600 font-normal"> / {selectedSubcategory}</span>
                )}
              </h1>
              {category.description && (
                <p className="text-gray-600 mt-1">{category.description}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {products.length} {products.length === 1 ? 'product' : 'products'} found
                {selectedSubcategory && ` in ${selectedSubcategory}`}
                {pincode && ` for ${pincode}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Left side - Sort options */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                </select>
                <ChevronDown className="absolute right-2 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>

            {/* Right side - View mode */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-cream-100 text-brand-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list'
                    ? 'bg-cream-100 text-brand-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-brand-600" defaultChecked />
                      <span className="ml-2 text-sm text-gray-600">In Stock</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-brand-600" />
                      <span className="ml-2 text-sm text-gray-600">Out of Stock</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offers
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded text-brand-600" />
                      <span className="ml-2 text-sm text-gray-600">Discounted Items</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Grid/List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:flex lg:space-x-8">
          {/* Left Sidebar - SubCategory Carousel (Desktop) */}
          <div className="hidden lg:block lg:w-64 lg:flex-shrink-0">
            {category && (
              <SubCategoryCarousel
                categoryId={category.category_id}
                currentSubCategory={currentSubCategory}
                onSubcategoryChange={handleSubcategoryChange}
              />
            )}
          </div>

          {/* Main Content */}
          <div className="lg:flex-1">
            {/* SubCategory Carousel (Mobile - above products) */}
            <div className="lg:hidden mb-6">
              {category && (
                <SubCategoryCarousel
                  categoryId={category.category_id}
                  currentSubCategory={currentSubCategory}
                  onSubcategoryChange={handleSubcategoryChange}
                />
              )}
            </div>

            {sortedProducts.length > 0 ? (
              <div className={`${
                viewMode === 'grid'
                  ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                  : 'space-y-4'
              }`}>
                {sortedProducts.map((product) => {
                  const primaryImage = product.images?.find(img => img.is_primary)?.image_url
                  const fallbackImage = product.images?.[0]?.image_url

                  return (
                    <div key={product.product_id} className={viewMode === 'list' ? 'bg-white rounded-lg shadow-sm' : ''}>
                      <ProductCard
                        product_id={product.product_id}
                        product_name={product.product_name}
                        base_price={product.base_price}
                        discounted_price={product.discounted_price}
                        image_url={primaryImage || fallbackImage}
                        category_name={product.category_name}
                        status={product.status}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                    <Grid className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
                  <p className="text-gray-500 mb-6">
                    {pincode
                      ? `No products available in ${category?.category_name} for pincode ${pincode}`
                      : `No products available in ${category?.category_name} category`}
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="btn-primary"
                  >
                    Browse Other Categories
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}