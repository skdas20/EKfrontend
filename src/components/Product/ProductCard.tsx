import { ShoppingCart, Star, Plus, Minus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { LoadingSpinner } from '../Loading/LoadingPage'

interface ProductCardProps {
  product_id: number
  product_name: string
  base_price: number
  discounted_price?: number | null
  image_url: string | null
  category_name: string
  status: 'active' | 'inactive'
}

export default function ProductCard({
  product_id,
  product_name,
  base_price,
  discounted_price,
  image_url,
  category_name,
  status
}: ProductCardProps) {
  const navigate = useNavigate()
  const { addItem, updateQuantity, getItemQuantity, state } = useCart()
  const { user, showLoginModal } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  
  const inStock = status === 'active'
  
  // Safely convert prices to numbers (handles both string and number inputs)
  const basePrice = typeof base_price === 'string' ? parseFloat(base_price) : Number(base_price)
  const discountPrice = discounted_price ? (typeof discounted_price === 'string' ? parseFloat(discounted_price) : Number(discounted_price)) : null
  const currentPrice = discountPrice || basePrice
  
  const quantity = getItemQuantity(product_id)
  
  // Find the cart item for this product
  const cartItem = state.items.find(item => item.product_id === product_id)

  const handleAddToCart = async () => {
    if (!inStock) return
    
    // If user is not logged in, show login modal
    if (!user) {
      showLoginModal()
      return
    }
    
    setIsLoading(true)
    await addItem(
      product_id,
      product_name, 
      basePrice,
      discountPrice,
      image_url
    )
    setIsLoading(false)
  }

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!cartItem) return
    
    setIsLoading(true)
    await updateQuantity(cartItem.cart_id, newQuantity)
    setIsLoading(false)
  }
  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent card click when clicking on interactive elements
    const target = e.target as HTMLElement
    if (target.closest('button') || target.closest('input')) {
      return
    }
    navigate(`/product/${product_id}`)
  }

  return (
    <div 
      className="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={image_url || 'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=No+Image'}
          alt={product_name}
          className="w-full h-48 object-cover rounded-t-lg"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x200/f3f4f6/9ca3af?text=No+Image'
          }}
        />
        {!inStock && (
          <div className="absolute inset-0 bg-gray-100/90 flex items-center justify-center rounded-t-lg">
            <span className="text-gray-800 font-semibold">Out of Stock</span>
          </div>
        )}
        {discountPrice && (
          <div className="absolute top-2 left-2 bg-accent-gradient text-white text-sm px-2 py-1 rounded font-semibold shadow-sm">
            {Math.round(((basePrice - discountPrice) / basePrice) * 100)}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{category_name}</p>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product_name}</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">₹{Number(currentPrice || 0).toFixed(2)}</span>
            {discountPrice && (
              <span className="text-sm text-gray-500 line-through">₹{Number(basePrice || 0).toFixed(2)}</span>
            )}
          </div>
        </div>
        
        {/* Cart Controls */}
        {quantity > 0 ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => handleUpdateQuantity(quantity - 1)}
                disabled={isLoading}
                className="p-2 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              >
                <Minus className="h-4 w-4 text-gray-600" />
              </button>
              
              <span className="px-3 py-1 bg-white rounded text-sm font-medium min-w-[3rem] text-center">
                {isLoading ? <LoadingSpinner size="sm" /> : quantity}
              </span>
              
              <button
                onClick={() => handleUpdateQuantity(quantity + 1)}
                disabled={isLoading}
                className="p-2 hover:bg-gray-200 rounded-md transition-colors disabled:opacity-50"
              >
                <Plus className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            
            {user && (
              <span className="text-xs text-green-600 font-medium">In Cart</span>
            )}
          </div>
        ) : (
          <button 
            onClick={handleAddToCart}
            disabled={!inStock || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 ${
              inStock
                ? 'btn-primary'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" className="text-white" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4" />
                <span>{inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}