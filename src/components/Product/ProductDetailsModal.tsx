import { useState, useEffect } from 'react'
import { X, Plus, Minus, ShoppingCart, Star, Heart, Share2, Truck, Shield, Clock } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { LoadingSpinner } from '../Loading/LoadingPage'
import type { Product, ProductVariant } from '../../types/api'

interface ProductDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  loading?: boolean
}

export default function ProductDetailsModal({ isOpen, onClose, product, loading = false }: ProductDetailsModalProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  const { addItem, getItemQuantity } = useCart()
  const { user, showLoginModal } = useAuth()

  useEffect(() => {
    if (product && product.variants?.length > 0) {
      setSelectedVariant(product.variants[0])
    } else {
      setSelectedVariant(null)
    }
    setSelectedImageIndex(0)
    setQuantity(1)
  }, [product])

  if (!isOpen) return null

  const handleClose = () => {
    onClose()
    setSelectedImageIndex(0)
    setQuantity(1)
  }

  const handleAddToCart = async () => {
    if (!product) return
    
    if (!user) {
      showLoginModal()
      return
    }

    setIsLoading(true)
    try {
      const primaryImage = product.images?.find(img => img.is_primary)?.image_url
      const fallbackImage = product.images?.[0]?.image_url
      
      // Add items to cart one by one based on quantity
      for (let i = 0; i < quantity; i++) {
        await addItem(
          product.product_id,
          product.product_name,
          product.base_price,
          product.discounted_price,
          primaryImage || fallbackImage || null,
          selectedVariant?.variant_id,
          selectedVariant?.variant_name,
          selectedVariant?.variant_price
        )
      }
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentPrice = () => {
    if (selectedVariant) {
      return selectedVariant.variant_price
    }
    return product?.discounted_price || product?.base_price || 0
  }

  const getOriginalPrice = () => {
    if (selectedVariant) {
      return selectedVariant.variant_price
    }
    return product?.base_price || 0
  }

  const hasDiscount = () => {
    if (selectedVariant) return false
    return product?.discounted_price && product.discounted_price < product.base_price
  }

  const getDiscountPercentage = () => {
    if (!hasDiscount() || !product) return 0
    return Math.round(((product.base_price - (product.discounted_price || 0)) / product.base_price) * 100)
  }

  const cartQuantity = product ? getItemQuantity(product.product_id) : 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Product Details</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-2"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {loading || !product ? (
          <div className="flex-1 flex items-center justify-center p-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              {/* Image Gallery */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                  <img
                    src={product.images?.[selectedImageIndex]?.image_url || 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=No+Image'}
                    alt={product.product_name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/600x600/f3f4f6/9ca3af?text=No+Image'
                    }}
                  />
                  {hasDiscount() && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
                      {getDiscountPercentage()}% OFF
                    </div>
                  )}
                </div>

                {/* Thumbnail Images */}
                {product.images && product.images.length > 1 && (
                  <div className="flex space-x-2 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <button
                        key={image.image_id}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                          selectedImageIndex === index ? 'border-brand-600' : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image.image_url}
                          alt={`${product.product_name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = 'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=No+Image'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <p className="text-sm text-gray-500 mb-2">{product.category_name}</p>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.product_name}</h1>
                  
                  {/* Price */}
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-3xl font-bold text-gray-900">₹{Number(getCurrentPrice() || 0).toFixed(2)}</span>
                    {hasDiscount() && (
                      <>
                        <span className="text-xl text-gray-500 line-through">₹{Number(getOriginalPrice() || 0).toFixed(2)}</span>
                        <span className="bg-red-100 text-red-800 text-sm font-semibold px-2 py-1 rounded">
                          Save {getDiscountPercentage()}%
                        </span>
                      </>
                    )}
                  </div>

                  {/* Rating placeholder */}
                  <div className="flex items-center space-x-2 mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">(4.5) • 127 reviews</span>
                  </div>
                </div>

                {/* Variants */}
                {product.variants && product.variants.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Available Variants</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {product.variants.map((variant) => (
                        <button
                          key={variant.variant_id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`p-3 border rounded-lg text-left transition-colors ${
                            selectedVariant?.variant_id === variant.variant_id
                              ? 'border-brand-600 bg-brand-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="font-medium text-sm">{variant.variant_name}</div>
                          <div className="text-sm text-gray-600">₹{Number(variant.variant_price || 0).toFixed(2)}</div>
                          <div className="text-xs text-gray-500">
                            {variant.stock_quantity > 0 ? `${variant.stock_quantity} in stock` : 'Out of stock'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity Selector */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Quantity</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-4 py-3 font-medium min-w-[3rem] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="p-3 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    {cartQuantity > 0 && (
                      <span className="text-sm text-green-600 font-medium">
                        {cartQuantity} already in cart
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={isLoading || product.status !== 'active'}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-lg flex items-center justify-center space-x-2 transition-colors ${
                      product.status === 'active'
                        ? 'bg-brand-600 hover:bg-brand-700 text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <LoadingSpinner size="sm" className="text-white" />
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                      <Heart className="h-5 w-5" />
                      <span>Wishlist</span>
                    </button>
                    <button className="py-3 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                      <Share2 className="h-5 w-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>

                {/* Features */}
                <div className="border-t pt-6">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex flex-col items-center">
                      <Truck className="h-8 w-8 text-brand-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Free Delivery</span>
                      <span className="text-xs text-gray-600">On orders above ₹500</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Shield className="h-8 w-8 text-brand-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Quality Assured</span>
                      <span className="text-xs text-gray-600">Fresh & genuine</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Clock className="h-8 w-8 text-brand-600 mb-2" />
                      <span className="text-sm font-medium text-gray-900">Quick Delivery</span>
                      <span className="text-xs text-gray-600">Within 2-4 hours</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                {product.description && (
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{product.description}</p>
                  </div>
                )}

                {/* Store Info */}
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Sold by</h3>
                  <p className="text-gray-600">{product.store_name}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}