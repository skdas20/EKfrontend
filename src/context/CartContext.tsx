import React, { createContext, useContext, useReducer, useEffect } from 'react'
import type { ReactNode } from 'react'
import { cartAPI } from '../services/api'
import { useAuth } from './AuthContext'

interface CartItem {
  cart_id: string
  product_id: number
  product_name: string
  base_price: number
  discounted_price: number | null
  image_url: string | null
  quantity: number
  variant_id?: number | null
  variant_name?: string | null
  variant_price?: number | null
}

interface CartState {
  items: CartItem[]
  total: number
  subtotal: number
  itemCount: number
  loading: boolean
}

type CartAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: { items: CartItem[]; total: number } }
  | { type: 'ADD_ITEM_OPTIMISTIC'; payload: Omit<CartItem, 'cart_id' | 'quantity'> }
  | { type: 'UPDATE_ITEM_OPTIMISTIC'; payload: { cart_id: string; quantity: number } }
  | { type: 'REMOVE_ITEM_OPTIMISTIC'; payload: string }
  | { type: 'CLEAR_CART' }

const calculateItemPrice = (item: CartItem) => {
  const price = item.variant_price || item.discounted_price || item.base_price
  const numericPrice = typeof price === 'string' ? parseFloat(price) : Number(price)
  return numericPrice * item.quantity
}

const calculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + calculateItemPrice(item), 0)
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)
  // subtotal currently same as total (no client-side discounts/fees applied)
  const subtotal = total
  return { total, subtotal, itemCount }
}

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    
    case 'SET_CART': {
      const { total, subtotal, itemCount } = calculateTotals(action.payload.items)
      return {
        ...state,
        items: action.payload.items,
        total: action.payload.total || total, // Use backend total if provided
        subtotal: action.payload.total ?? subtotal,
        itemCount,
        loading: false
      }
    }
    
    case 'ADD_ITEM_OPTIMISTIC': {
      const existingItem = state.items.find(item => 
        item.product_id === action.payload.product_id && 
        item.variant_id === action.payload.variant_id
      )
      
      let updatedItems: CartItem[]
      
      if (existingItem) {
        updatedItems = state.items.map(item =>
          item.cart_id === existingItem.cart_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        const newItem: CartItem = {
          ...action.payload,
          cart_id: `temp-${Date.now()}`, // Temporary ID
          quantity: 1
        }
        updatedItems = [...state.items, newItem]
      }
      
      const { total, subtotal, itemCount } = calculateTotals(updatedItems)
      return { ...state, items: updatedItems, total, subtotal, itemCount }
    }
    
    case 'UPDATE_ITEM_OPTIMISTIC': {
      if (action.payload.quantity <= 0) {
        return cartReducer(state, { type: 'REMOVE_ITEM_OPTIMISTIC', payload: action.payload.cart_id })
      }
      
      const updatedItems = state.items.map(item =>
        item.cart_id === action.payload.cart_id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      
      const { total, subtotal, itemCount } = calculateTotals(updatedItems)
      return { ...state, items: updatedItems, total, subtotal, itemCount }
    }
    
    case 'REMOVE_ITEM_OPTIMISTIC': {
      const filteredItems = state.items.filter(item => item.cart_id !== action.payload)
      const { total, subtotal, itemCount } = calculateTotals(filteredItems)
      return { ...state, items: filteredItems, total, subtotal, itemCount }
    }
    
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, subtotal: 0, itemCount: 0 }
    
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (productId: number, productName: string, basePrice: number, discountedPrice: number | null, imageUrl: string | null, variantId?: number, variantName?: string, variantPrice?: number) => Promise<boolean>
  removeItem: (cartId: string) => Promise<boolean>
  updateQuantity: (cartId: string, quantity: number) => Promise<boolean>
  clearCart: () => Promise<boolean>
  refreshCart: () => Promise<void>
  getItemQuantity: (productId: number, variantId?: number) => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const { user, token } = useAuth()
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    subtotal: 0,
    itemCount: 0,
    loading: false
  })
  
  // removed unused showLoginPrompt state

  // Load cart when user logs in
  useEffect(() => {
    if (user && token) {
      refreshCart()
    } else {
      dispatch({ type: 'CLEAR_CART' })
    }
  }, [user, token])

  const refreshCart = async () => {
    if (!user || !token) return

    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await cartAPI.getCart(token)
      dispatch({ type: 'SET_CART', payload: { items: response.items || [], total: response.total || 0 } })
    } catch (error) {
      console.error('Error fetching cart:', error)
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const addItem = async (
    productId: number, 
    productName: string, 
    basePrice: number, 
    discountedPrice: number | null, 
    imageUrl: string | null,
    variantId?: number, 
    variantName?: string, 
    variantPrice?: number
  ): Promise<boolean> => {
      if (!user || !token) {
        // User not logged in: don't add item. Login flow handled elsewhere.
        return false
      }

    // Optimistic update
    dispatch({ 
      type: 'ADD_ITEM_OPTIMISTIC', 
      payload: {
        product_id: productId,
        product_name: productName,
        base_price: basePrice,
        discounted_price: discountedPrice,
        image_url: imageUrl,
        variant_id: variantId,
        variant_name: variantName,
        variant_price: variantPrice
      }
    })

    try {
      await cartAPI.addToCart(token, productId, variantId, 1)
      // Refresh cart to get accurate data from server
      await refreshCart()
      return true
    } catch (error) {
      console.error('Error adding item to cart:', error)
      // Revert optimistic update
      await refreshCart()
      return false
    }
  }

  const removeItem = async (cartId: string): Promise<boolean> => {
    if (!user || !token) return false

    // Optimistic update
    dispatch({ type: 'REMOVE_ITEM_OPTIMISTIC', payload: cartId })

    try {
      await cartAPI.removeFromCart(token, cartId)
      return true
    } catch (error) {
      console.error('Error removing item from cart:', error)
      // Revert optimistic update
      await refreshCart()
      return false
    }
  }

  const updateQuantity = async (cartId: string, quantity: number): Promise<boolean> => {
    if (!user || !token) return false

    // Optimistic update
    dispatch({ type: 'UPDATE_ITEM_OPTIMISTIC', payload: { cart_id: cartId, quantity } })

    try {
      if (quantity <= 0) {
        return await removeItem(cartId)
      } else {
        await cartAPI.updateCartItem(token, cartId, quantity)
        return true
      }
    } catch (error) {
      console.error('Error updating cart item:', error)
      // Revert optimistic update
      await refreshCart()
      return false
    }
  }

  const clearCart = async (): Promise<boolean> => {
    if (!user || !token) return false

    try {
      await cartAPI.clearCart(token)
      dispatch({ type: 'CLEAR_CART' })
      return true
    } catch (error) {
      console.error('Error clearing cart:', error)
      return false
    }
  }

  const getItemQuantity = (productId: number, variantId?: number): number => {
    const item = state.items.find(item => 
      item.product_id === productId && 
      item.variant_id === variantId
    )
    return item ? item.quantity : 0
  }

  return (
    <CartContext.Provider value={{ 
      state, 
      addItem, 
      removeItem, 
      updateQuantity, 
      clearCart, 
      refreshCart,
      getItemQuantity
    }}>
      {children}
    </CartContext.Provider>
  )
}