// API Configuration
export const API_BASE_URL = 'https://api.easykirana.in/api'

// API endpoints
export const API_ENDPOINTS = {
  // Products
  products: '/products',
  productById: (id: string) => `/products/${id}`,
  searchProducts: '/products/search',
  
  // Categories
  categories: '/categories',
  categoryById: (id: string) => `/categories/${id}`,
  subcategories: '/subcategories',
  
  // Banners
  banners: '/banners',
  
  // Auth (for future use)
  auth: {
    customerAuth: '/auth/customer/auth',
    customerVerify: '/auth/customer/verify',
    login: '/auth/login',
    register: '/auth/register'
  },
  
  // Cart & Orders (requires auth)
  cart: '/cart',
  orders: '/orders',
  addresses: '/addresses'
} as const

// Build full URL
export const buildUrl = (endpoint: string, params?: Record<string, string | number>) => {
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