import { X, Plus, Minus, ShoppingBag } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { LoadingSpinner } from '../Loading/LoadingPage'

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, updateQuantity, removeItem } = useCart()
  const { user, showLoginModal } = useAuth()
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set())
  const navigate = useNavigate()

  // Listen for global events to open the cart drawer or checkout
  useEffect(() => {
    const openCartHandler = (e: Event) => {
      // event detail may include openCheckout flag
      const detail = (e as CustomEvent)?.detail || {}
      // If checkout should be opened and drawer is open, navigate to checkout page
      if (detail.openCheckout && isOpen) {
        onClose() // Close the drawer
        navigate('/checkout') // Navigate to checkout page
      }
    }

    window.addEventListener('openCart', openCartHandler as EventListener)
    return () => window.removeEventListener('openCart', openCartHandler as EventListener)
  }, [isOpen, onClose, navigate])

  const handleUpdateQuantity = async (cartId: string, newQuantity: number) => {
    setLoadingItems(prev => new Set(prev).add(cartId))
    await updateQuantity(cartId, newQuantity)
    setLoadingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(cartId)
      return newSet
    })
  }

  const handleRemoveItem = async (cartId: string) => {
    setLoadingItems(prev => new Set(prev).add(cartId))
    await removeItem(cartId)
    setLoadingItems(prev => {
      const newSet = new Set(prev)
      newSet.delete(cartId)
      return newSet
    })
  }

  if (!isOpen) return null

  return (
    <React.Fragment>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-transparent" onClick={onClose} />
        
        <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-cream-200">
            <h2 className="text-lg font-semibold text-gray-900">Shopping Cart ({state.itemCount})</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => {
                  const isLoading = loadingItems.has(item.cart_id)
                  const price = item.variant_price || item.discounted_price || item.base_price
                  const currentPrice = typeof price === 'string' ? parseFloat(price) : Number(price)
                  
                  return (
                    <div key={item.cart_id} className="flex items-center space-x-4 bg-brand-50 p-3 rounded-lg">
                      <img
                        src={item.image_url || 'https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=No+Image'}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/64x64/f3f4f6/9ca3af?text=No+Image'
                        }}
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">{item.product_name}</h3>
                        {item.variant_name && (
                          <p className="text-xs text-gray-500">{item.variant_name}</p>
                        )}
                        <p className="font-semibold text-brand-700">₹{Number(currentPrice || 0).toFixed(2)}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdateQuantity(item.cart_id, item.quantity - 1)}
                          disabled={isLoading}
                          className="text-gray-500 hover:text-brand-600 disabled:opacity-50 p-1"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {isLoading ? <LoadingSpinner size="sm" /> : item.quantity}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(item.cart_id, item.quantity + 1)}
                          disabled={isLoading}
                          className="text-gray-500 hover:text-brand-600 disabled:opacity-50 p-1"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => handleRemoveItem(item.cart_id)}
                        disabled={isLoading}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {state.items.length > 0 && (
            <div className="border-t border-cream-200 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-xl font-bold text-brand-700">₹{Number(state.total || 0).toFixed(2)}</span>
              </div>
              
              {user ? (
                <button
                  className="w-full btn-primary"
                  onClick={() => {
                    onClose() // Close the drawer
                    navigate('/checkout') // Navigate to checkout page
                  }}
                >
                  Proceed to Checkout
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 text-center">
                    Please login to proceed with checkout
                  </p>
                  <button 
                    className="w-full btn-secondary" 
                    onClick={() => {
                      showLoginModal()
                      onClose()
                    }}
                  >
                    Login to Continue
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </React.Fragment>
  )
}