// Product Types
export interface ProductVariant {
  variant_id: number
  variant_name: string
  variant_price: number
  stock_quantity: number
  sku: string
}

export interface ProductImage {
  image_id: number
  image_url: string
  is_primary: boolean
}

export interface Product {
  product_id: number
  vendor_id: number
  category_id: number
  subcategory_id: number | null
  product_name: string
  description: string
  base_price: number
  discounted_price: number | null
  sku: string
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  store_name: string
  category_name: string
  subcategory_name: string | null
  variants: ProductVariant[]
  images: ProductImage[]
}

// Category Types
export interface Category {
  id: number
  name: string
  description: string | null
  imageUrl: string | null
  level: number
  createdAt: string
  subcategories?: any
}

// Internal Category Type (transformed for components)
export interface InternalCategory {
  category_id: number
  category_name: string
  description: string | null
  image_url: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface Subcategory {
  subcategory_id: number
  category_id: number
  name: string
  description: string | null
  image_url: string | null
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

// Banner Types
export interface Banner {
  banner_id: number
  title: string
  description: string | null
  image_url: string
  redirect_url: string | null
  banner_type: string
  is_active: boolean
  start_date: string
  end_date: string
  created_at: string
  updated_at: string
}

// Search Response
export interface SearchProductsResponse {
  products: Product[]
  total: number
  page: number
  totalPages: number
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T
  message?: string
  success?: boolean
}

// Location filter
export interface LocationFilter {
  pincode?: string
  city?: string
  state?: string
}

// Product filters
export interface ProductFilters {
  category_id?: number
  subcategory_name?: string
  search?: string
  pincode?: string
  sort?: 'price_low' | 'price_high' | 'latest'
  page?: number
  limit?: number
}