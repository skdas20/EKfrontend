import { Plus, Minus, Trash2 } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { LoadingSpinner } from '../Loading/LoadingPage'
import { useState } from 'react'

interface CartReviewProps {
  onNext: () => void
  onClose: () => void
}

export default function CartReview({ onNext, onClose }: CartReviewProps) {
  const { state, updateQuantity, removeItem } = useCart()
  const { user } = useAuth()
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())

  const handleQuantityUpdate = async (cartId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await handleRemoveItem(cartId)
      return
    }

    setUpdatingItems(prev => new Set(prev).add(cartId))
    try {
      await updateQuantity(cartId, newQuantity)
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(cartId)
        return next
      })
    }
  }

  const handleRemoveItem = async (cartId: string) => {
    setUpdatingItems(prev => new Set(prev).add(cartId))
    try {
      await removeItem(cartId)
    } finally {
      setUpdatingItems(prev => {
        const next = new Set(prev)
        next.delete(cartId)
        return next
      })
    }
  }

  if (!user) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 mb-4">Please login to view your cart</div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
        >
          Close
        </button>
      </div>
    )
  }

  if (state.items.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-500 mb-4">Your cart is empty</div>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="space-y-4">
        {state.items.map((item) => {
          const isUpdating = updatingItems.has(item.cart_id)
          const currentPrice = Number(item.discounted_price || item.base_price || 0)

          return (
            <div key={item.cart_id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <img
                src={item.image_url || 'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=No+Image'}
                alt={item.product_name}
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/80x80/f3f4f6/9ca3af?text=No+Image'
                }}
              />
              
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{item.product_name}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-lg font-bold text-gray-900">₹{Number(currentPrice || 0).toFixed(2)}</span>
                  {item.discounted_price && (
                    <span className="text-sm text-gray-500 line-through">₹{Number(item.base_price || 0).toFixed(2)}</span>
                  )}
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white rounded-lg border">
                  <button
                    onClick={() => handleQuantityUpdate(item.cart_id, item.quantity - 1)}
                    disabled={isUpdating || item.quantity <= 1}
                    className="p-2 hover:bg-gray-100 rounded-l-lg transition-colors disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  
                  <span className="px-3 py-2 text-sm font-medium min-w-[3rem] text-center">
                    {isUpdating ? <LoadingSpinner size="sm" /> : item.quantity}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityUpdate(item.cart_id, item.quantity + 1)}
                    disabled={isUpdating}
                    className="p-2 hover:bg-gray-100 rounded-r-lg transition-colors disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.cart_id)}
                  disabled={isUpdating}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Item Total */}
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  ₹{Number((currentPrice || 0) * (item.quantity || 0)).toFixed(2)}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Cart Summary */}
      <div className="mt-6 p-4 bg-brand-50 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({state.itemCount} items)</span>
            <span>₹{Number(state.subtotal || 0).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery Fee</span>
            <span className="text-green-600">Free</span>
          </div>
          <div className="border-t pt-2">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>₹{Number(state.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        <button
          onClick={onNext}
          disabled={state.items.length === 0}
          className="w-full mt-4 py-3 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Address
        </button>
      </div>
    </div>
  )
}