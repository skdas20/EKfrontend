import { ShoppingCart, Plus, Minus } from 'lucide-react'
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

  const basePrice = typeof base_price === 'string' ? parseFloat(base_price) : Number(base_price)
  const discountPrice = discounted_price ? (typeof discounted_price === 'string' ? parseFloat(discounted_price) : Number(discounted_price)) : null
  const currentPrice = discountPrice || basePrice

  const quantity = getItemQuantity(product_id)
  const cartItem = state.items.find(item => item.product_id === product_id)

  const handleAddToCart = async () => {
    if (!inStock) return
    if (!user) {
      showLoginModal()
      return
    }
    setIsLoading(true)
    await addItem(product_id, product_name, basePrice, discountPrice, image_url)
    setIsLoading(false)
  }

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!cartItem) return
    setIsLoading(true)
    await updateQuantity(cartItem.cart_id, newQuantity)
    setIsLoading(false)
  }

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    if (target.closest('button')) {
      return
    }
    navigate(`/product/${product_id}`)
  }

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col cursor-pointer overflow-hidden group"
      onClick={handleCardClick}
    >
      {/* --- Image Section --- */}
      <div className="relative p-1.5">
        <div className="aspect-square w-full relative">
            <img
            src={image_url || 'https://via.placeholder.com/200/f3f4f6/9ca3af?text=No+Image'}
            alt={product_name}
            className="w-full h-full object-contain"
            onError={(e) => {
                e.currentTarget.src = 'https://via.placeholder.com/200/f3f4f6/9ca3af?text=No+Image'
            }}
            />
        </div>
        {!inStock && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
            <span className="bg-gray-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">OUT OF STOCK</span>
          </div>
        )}
        {discountPrice && inStock && (
            <div className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-bold px-1 py-0.5 rounded">
                {Math.round(((basePrice - discountPrice) / basePrice) * 100)}% OFF
            </div>
        )}
      </div>

      {/* --- Content Section --- */}
      <div className="px-2 pb-2 flex flex-col flex-grow">
        <div className="flex-grow">
            <h3 className="font-medium text-gray-800 text-xs mb-1 line-clamp-2 h-8 leading-tight">{product_name}</h3>
        </div>
        
        {/* --- Price and Action Section --- */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            {discountPrice && (
              <span className="text-[10px] text-gray-400 line-through leading-none">
                ₹{basePrice.toFixed(0)}
              </span>
            )}
            <span className="text-sm font-bold text-gray-900 leading-none">
              ₹{currentPrice.toFixed(0)}
            </span>
          </div>

          <div className="w-16 h-7 flex items-center justify-end">
             {quantity > 0 ? (
                <div className="flex items-center justify-between w-full h-full border border-green-500 rounded bg-green-50">
                   <button
                        onClick={() => handleUpdateQuantity(quantity - 1)}
                        disabled={isLoading}
                        className="px-1 text-green-600 hover:text-red-500 disabled:opacity-50 h-full flex items-center"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="h-3 w-3" />
                    </button>
                    <span className="px-1 text-xs font-bold text-green-700">
                      {isLoading ? <LoadingSpinner size="sm" /> : quantity}
                    </span>
                    <button
                        onClick={() => handleUpdateQuantity(quantity + 1)}
                        disabled={isLoading}
                        className="px-1 text-green-600 hover:text-green-700 disabled:opacity-50 h-full flex items-center"
                        aria-label="Increase quantity"
                    >
                        <Plus className="h-3 w-3" />
                    </button>
                </div>
            ) : (
                <button
                    onClick={handleAddToCart}
                    disabled={!inStock || isLoading}
                    className={`w-full h-full flex items-center justify-center text-[10px] font-bold border rounded transition-all duration-200 ${
                        inStock
                        ? 'border-green-600 text-green-600 bg-white hover:bg-green-600 hover:text-white'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                    aria-label="Add to cart"
                    >
                    {isLoading ? <LoadingSpinner size="sm" /> : 'ADD'}
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}