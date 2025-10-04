// import { buildUrl, API_ENDPOINTS } from '../config/api'
import { fallbackProducts, fallbackCategories, fallbackBanners } from '../data/fallbackData'
import type { 
  Product, 
  Category, 
  Subcategory, 
  Banner, 
  SearchProductsResponse,
  ProductFilters
} from '../types/api'

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.easykirana.in/api'

// Global flag to prevent multiple logout calls
let isLoggingOut = false

// Function to handle auth errors globally
const handleAuthError = () => {
  if (isLoggingOut) return
  
  isLoggingOut = true
  console.log('Token expired or unauthorized, logging out...')
  
  // Clear auth data
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user_data')
  
  // Trigger custom event for AuthContext to handle
  window.dispatchEvent(new CustomEvent('auth:logout'))
  
  // Reset flag after a short delay
  setTimeout(() => {
    isLoggingOut = false
  }, 1000)
}

// Enhanced API fetch function with auth error handling
async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout
      signal: AbortSignal.timeout(10000), // 10 second timeout
      ...options
    })
    
    // Handle auth errors
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('API fetch error:', error)
    // Return empty array for most endpoints to prevent blank page
    if (error instanceof Error && (error.name === 'TypeError' || error.message.includes('fetch'))) {
      console.warn('Backend appears to be offline, using fallback data')
      return [] as unknown as T
    }
    throw error
  }
}

// Helper function to build URLs with query parameters
function buildApiUrl(endpoint: string, params?: Record<string, any>): string {
  let url = `${API_BASE_URL}${endpoint}`
  
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`
    }
  }
  
  return url
}

// Product API functions
export const productAPI = {
  // Get all products with optional filters
  async getAll(filters: ProductFilters = {}): Promise<Product[]> {
    try {
      const url = buildApiUrl('/products', filters)
      return await apiFetch<Product[]>(url)
    } catch (error) {
      console.warn('Using fallback products data')
      return fallbackProducts.slice(0, filters.limit || 6)
    }
  },

  // Get product by ID
  async getById(id: string): Promise<Product> {
    const url = buildApiUrl(`/products/${id}`)
    return apiFetch<Product>(url)
  },

  // Search products
  async search(query: string, filters: ProductFilters = {}): Promise<SearchProductsResponse> {
    const searchParams = { ...filters, query }
    const url = buildApiUrl('/products/search', searchParams)
    return apiFetch<SearchProductsResponse>(url)
  },

  // Get products by location (pincode)
  async getByLocation(pincode: string, filters: Omit<ProductFilters, 'pincode'> = {}): Promise<Product[]> {
    try {
      const params = { ...filters, pincode }
      const url = buildApiUrl('/products', params)
      return await apiFetch<Product[]>(url)
    } catch (error) {
      console.warn('Using fallback products data for location:', pincode)
      return fallbackProducts.slice(0, filters.limit || 6)
    }
  },

  // Get products by category
  async getByCategory(categoryId: number, filters: ProductFilters = {}): Promise<Product[]> {
    const params = { ...filters, category_id: categoryId }
    const url = buildApiUrl('/products', params)
    return apiFetch<Product[]>(url)
  },

  // Get products by subcategory name
  async getBySubcategory(subcategoryName: string, filters: Omit<ProductFilters, 'subcategory_name'> = {}): Promise<Product[]> {
    try {
      const params = { ...filters, subcategory_name: subcategoryName }
      const url = buildApiUrl('/products', params)
      return await apiFetch<Product[]>(url)
    } catch (error) {
      console.warn('Failed to fetch products for subcategory:', subcategoryName)
      return []
    }
  }
}

// Category API functions
export const categoryAPI = {
  // Get all categories
  async getAll(): Promise<Category[]> {
    try {
      const url = buildApiUrl('/categories')
      return await apiFetch<Category[]>(url)
    } catch (error) {
      console.warn('Using fallback categories data')
      // Map InternalCategory -> Category shape expected by consumers
      return fallbackCategories.map((c) => ({
        id: c.category_id,
        name: c.category_name,
        description: c.description,
        imageUrl: c.image_url,
        level: 1,
        createdAt: c.created_at,
      }))
    }
  },

  // Get category by ID
  async getById(id: string): Promise<Category> {
    const url = buildApiUrl(`/categories/${id}`)
    return apiFetch<Category>(url)
  },

  // Get all subcategories
  async getSubcategories(): Promise<Subcategory[]> {
    const url = buildApiUrl('/subcategories')
    return apiFetch<Subcategory[]>(url)
  },

  // Get subcategories by category ID
  async getSubcategoriesByCategory(categoryId: number): Promise<Subcategory[]> {
    try {
      const url = buildApiUrl('/subcategories', { category_id: categoryId })
      return await apiFetch<Subcategory[]>(url)
    } catch (error) {
      console.warn('Failed to fetch subcategories for category:', categoryId)
      return []
    }
  }
}

// Banner API functions
export const bannerAPI = {
  // Get all banners
  async getAll(): Promise<Banner[]> {
    try {
      const url = buildApiUrl('/banners')
      return await apiFetch<Banner[]>(url)
    } catch (error) {
      console.warn('Using fallback banners data')
      return fallbackBanners
    }
  },

  // Get banners by type
  async getByType(type: string): Promise<Banner[]> {
    try {
      const url = buildApiUrl('/banners', { type })
      return await apiFetch<Banner[]>(url)
    } catch (error) {
      console.warn(`Using fallback banners data for type: ${type}`)
      return fallbackBanners.filter(banner => banner.banner_type === type)
    }
  }
}

// Cart API functions
export const cartAPI = {
  // Get user's cart
  async getCart(token: string): Promise<any> {
    const url = buildApiUrl('/cart')
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // Add item to cart
  async addToCart(token: string, productId: number, variantId?: number, quantity: number = 1): Promise<any> {
    const url = buildApiUrl('/cart')
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        product_id: productId, 
        variant_id: variantId || null, 
        quantity 
      })
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // Update cart item quantity
  async updateCartItem(token: string, cartId: string, quantity: number): Promise<any> {
    const url = buildApiUrl(`/cart/${cartId}`)
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity })
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // Remove item from cart
  async removeFromCart(token: string, cartId: string): Promise<any> {
    const url = buildApiUrl(`/cart/${cartId}`)
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // Clear entire cart
  async clearCart(token: string): Promise<any> {
    const url = buildApiUrl('/cart')
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }
}

// Auth API functions
export const authAPI = {
  // Customer auth (unified login/register)
  async customerAuth(phoneNumber: string): Promise<any> {
    const url = buildApiUrl('/auth/customer/auth')
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone_number: phoneNumber })
    })
    return response.json()
  },

  // Verify OTP
  async verifyOTP(phoneNumber: string, otp: string): Promise<any> {
    const url = buildApiUrl('/auth/customer/verify')
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phone_number: phoneNumber, otp })
    })
    return response.json()
  }
}

// Order API functions
export const orderAPI = {
  // Create new order
  async createOrder(token: string, orderData: any): Promise<any> {
    const url = buildApiUrl('/orders')
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // Get user's order history
  async getUserOrders(token: string, userId: string): Promise<any> {
    console.log('orderAPI.getUserOrders called with:', { token: token ? 'present' : 'missing', userId })
    const url = buildApiUrl(`/orders/user/${userId}`)
    console.log('orderAPI.getUserOrders: URL =', url)
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    console.log('orderAPI.getUserOrders: response status =', response.status)
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      const errorText = await response.text()
      console.log('orderAPI.getUserOrders: error response =', errorText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('orderAPI.getUserOrders: success data =', data)
    return data
  },

  // Get specific order details
  async getOrderById(token: string, orderId: string): Promise<any> {
    const url = buildApiUrl(`/orders/${orderId}`)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // Cancel order (customer can cancel until delivered)
  async cancelOrder(token: string, orderId: string): Promise<any> {
    const url = buildApiUrl(`/orders/${orderId}/cancel`)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `Failed to cancel order`)
    }
    return response.json()
  }
}

// Address API functions  
export const addressAPI = {
  // Get user addresses
  async getAddresses(token: string): Promise<any> {
    const url = buildApiUrl('/addresses')
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // Create new address
  async createAddress(token: string, addressData: any): Promise<any> {
    const url = buildApiUrl('/addresses')
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(addressData)
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // Update address
  async updateAddress(token: string, addressId: string, addressData: any): Promise<any> {
    const url = buildApiUrl(`/addresses/${addressId}`)
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(addressData)
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // Delete address
  async deleteAddress(token: string, addressId: string): Promise<any> {
    const url = buildApiUrl(`/addresses/${addressId}`)
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  // Set default address
  async setDefaultAddress(token: string, addressId: string): Promise<any> {
    const url = buildApiUrl(`/addresses/${addressId}/set-default`)
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  }
}

// Review API
const reviewAPI = {
  // Create a new review (customer)
  async createReview(token: string, reviewData: {
    productId: string
    orderId: string
    rating: number
    comment?: string
  }): Promise<any> {
    const url = buildApiUrl('/reviews')
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: reviewData.productId,
        order_id: reviewData.orderId,
        rating: reviewData.rating,
        comment: reviewData.comment
      })
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || 'Failed to submit review')
    }
    return response.json()
  },

  // Get all approved reviews for a product (public)
  async getProductReviews(productId: string): Promise<any> {
    const url = buildApiUrl(`/reviews/product/${productId}`)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch reviews`)
    }
    return response.json()
  },

  // Get customer's own reviews
  async getMyReviews(token: string): Promise<any> {
    const url = buildApiUrl('/reviews/my-reviews')
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch your reviews`)
    }
    return response.json()
  },

  // Check if customer can review a specific product from an order
  async canReviewProduct(token: string, orderId: string, productId: string): Promise<any> {
    const url = buildApiUrl(`/reviews/can-review/${orderId}/${productId}`)
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.status === 401) {
      handleAuthError()
      throw new Error('Authentication failed - please login again')
    }
    
    if (!response.ok) {
      return { canReview: false }
    }
    return response.json()
  }
}

// Export all APIs
export const api = {
  products: productAPI,
  categories: categoryAPI,
  banners: bannerAPI,
  cart: cartAPI,
  auth: authAPI,
  orders: orderAPI,
  addresses: addressAPI,
  reviews: reviewAPI
}

export default api