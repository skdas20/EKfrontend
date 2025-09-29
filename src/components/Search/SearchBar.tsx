import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useLocation } from '../../context/LocationContext'
import { productAPI } from '../../services/api'
import type { Product } from '../../types/api'

interface SearchBarProps {
  className?: string
  placeholder?: string
}

export default function SearchBar({ className = '', placeholder = 'Search products...' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const navigate = useNavigate()
  const { pincode } = useLocation()
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Handle search with debouncing
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    if (query.trim().length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    timeoutRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        // Include pincode filter if available
        const searchFilters = {
          limit: 8,
          ...(pincode && { pincode: pincode.trim() })
        }

        console.log('🔍 SearchBar: Sending search request:', {
          query: query.trim(),
          filters: searchFilters,
          pincode: pincode
        })

        const response = await productAPI.search(query.trim(), searchFilters)
        console.log('🔍 SearchBar: Received search response:', response)
        setResults(response.products || [])
        setShowResults(true)
        setSelectedIndex(-1)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300) // 300ms debounce

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [query, pincode])

  // Clear search results when pincode changes
  useEffect(() => {
    if (query.trim().length >= 2) {
      // Re-trigger search with new pincode
      setResults([])
      setShowResults(false)
    }
  }, [pincode])

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
        setSelectedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleProductClick(results[selectedIndex])
        }
        break
      case 'Escape':
        setShowResults(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }

  const handleProductClick = (product: Product) => {
    setQuery('')
    setShowResults(false)
    setSelectedIndex(-1)
    navigate(`/product/${product.product_id}`)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setShowResults(false)
    setSelectedIndex(-1)
    inputRef.current?.focus()
  }

  const formatPrice = (price: number, discountedPrice?: number | null) => {
    const safePrice = Number(price) || 0
    const safeDiscountedPrice = discountedPrice ? Number(discountedPrice) : null

    if (safeDiscountedPrice && safeDiscountedPrice < safePrice) {
      return (
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-brand-600">₹{safeDiscountedPrice.toFixed(2)}</span>
          <span className="text-sm text-gray-500 line-through">₹{safePrice.toFixed(2)}</span>
        </div>
      )
    }
    return <span className="font-semibold text-gray-900">₹{safePrice.toFixed(2)}</span>
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setShowResults(true)}
          placeholder={placeholder}
          className="input-field pr-20"
        />

        {/* Clear button */}
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-10 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        {/* Search icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <div className="animate-spin h-5 w-5 border-2 border-brand-600 border-t-transparent rounded-full"></div>
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">
              Searching...
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="p-2 border-b border-gray-100 text-sm text-gray-600">
                Found {results.length} product{results.length !== 1 ? 's' : ''} for "{query}"
                {pincode && (
                  <span className="ml-2 text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded">
                    in {pincode}
                  </span>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {results.map((product, index) => {
                  const primaryImage = product.images?.find(img => img.is_primary)?.image_url
                  const fallbackImage = product.images?.[0]?.image_url

                  return (
                    <button
                      key={product.product_id}
                      onClick={() => handleProductClick(product)}
                      className={`w-full p-3 flex items-center space-x-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-b-0 ${
                        selectedIndex === index ? 'bg-brand-50' : ''
                      }`}
                    >
                      {/* Product Image */}
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={primaryImage || fallbackImage || 'https://via.placeholder.com/48x48/f3f4f6/9ca3af?text=No+Image'}
                          alt={product.product_name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/48x48/f3f4f6/9ca3af?text=No+Image'
                          }}
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {product.product_name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {product.category_name}
                        </p>
                        <div className="mt-1">
                          {formatPrice(product.base_price, product.discounted_price)}
                        </div>
                      </div>

                      {/* Store name */}
                      <div className="text-xs text-gray-400 text-right">
                        {product.store_name}
                      </div>
                    </button>
                  )
                })}
              </div>
            </>
          ) : query.trim().length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No products found for "{query}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}