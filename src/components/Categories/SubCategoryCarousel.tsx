import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { categoryAPI } from '../../services/api'
import type { Subcategory } from '../../types/api'

interface SubCategoryCarouselProps {
  categoryId: number
  currentSubCategory?: number | null
  onSubcategoryChange?: (subcategoryName: string | null) => void
}

export default function SubCategoryCarousel({
  categoryId,
  currentSubCategory,
  onSubcategoryChange
}: SubCategoryCarouselProps) {
  const navigate = useNavigate()
  const [subCategories, setSubCategories] = useState<Subcategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true)
        const response = await categoryAPI.getSubcategoriesByCategory(categoryId)
        setSubCategories(response)
      } catch (error) {
        console.error('Failed to fetch subcategories:', error)
        setSubCategories([])
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchSubCategories()
    }
  }, [categoryId])


  const handleSubCategoryClick = (subCategory: Subcategory) => {
    // If there's a callback to handle subcategory change, use it
    if (onSubcategoryChange) {
      onSubcategoryChange(subCategory.name)
    } else {
      // Otherwise navigate with query params
      navigate(`/category/${categoryId}?subcategory=${subCategory.subcategory_id}`)
    }
  }

  const handleAllCategoriesClick = () => {
    if (onSubcategoryChange) {
      onSubcategoryChange(null)
    } else {
      navigate(`/category/${categoryId}`)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-10 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (subCategories.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900 text-sm">Sub Categories</h3>
      </div>

      <div className="space-y-2">
        {/* All Categories Button */}
        <button
          onClick={handleAllCategoriesClick}
          className={`w-full p-3 text-left rounded-lg border transition-all duration-200 hover:shadow-sm ${
            !currentSubCategory
              ? 'border-cream-300 bg-cream-50 text-cream-700'
              : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">All Products</span>
          </div>
        </button>

        {/* Subcategory Buttons */}
        <div className="space-y-2">
          {subCategories.map((subCategory) => (
            <button
              key={subCategory.subcategory_id}
              onClick={() => handleSubCategoryClick(subCategory)}
              className={`w-full p-3 text-center rounded-lg border transition-all duration-200 hover:shadow-sm ${
                currentSubCategory === subCategory.subcategory_id
                  ? 'border-cream-300 bg-cream-50 text-cream-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                {subCategory.image_url ? (
                  <img
                    src={subCategory.image_url}
                    alt={subCategory.name}
                    className="w-12 h-12 rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-400">
                      {subCategory.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-xs font-medium text-center leading-tight">
                  {subCategory.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}