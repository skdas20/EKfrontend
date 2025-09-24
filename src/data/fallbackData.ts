import type { Product, InternalCategory, Banner } from '../types/api'

// Fallback products when API is offline
export const fallbackProducts: Product[] = [
  {
    product_id: 1,
    vendor_id: 1,
    category_id: 1,
    subcategory_id: 1,
    product_name: 'Fresh Organic Bananas',
    description: 'Sweet and ripe organic bananas',
    base_price: 2.99,
    discounted_price: 2.49,
    sku: 'FRUIT001',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    store_name: 'Fresh Market',
    category_name: 'Fruits',
    subcategory_name: 'Tropical Fruits',
    variants: [],
    images: [{
      image_id: 1,
      image_url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400',
      is_primary: true
    }]
  },
  {
    product_id: 2,
    vendor_id: 1,
    category_id: 2,
    subcategory_id: 2,
    product_name: 'Premium Basmati Rice',
    description: 'Long grain aromatic basmati rice',
    base_price: 12.99,
    discounted_price: null,
    sku: 'GRAIN001',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    store_name: 'Grain Store',
    category_name: 'Grains',
    subcategory_name: 'Rice',
    variants: [],
    images: [{
      image_id: 2,
      image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400',
      is_primary: true
    }]
  },
  {
    product_id: 3,
    vendor_id: 2,
    category_id: 3,
    subcategory_id: 3,
    product_name: 'Fresh Tomatoes',
    description: 'Red ripe tomatoes',
    base_price: 4.99,
    discounted_price: 3.49,
    sku: 'VEG001',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    store_name: 'Veggie World',
    category_name: 'Vegetables',
    subcategory_name: 'Fresh Vegetables',
    variants: [],
    images: [{
      image_id: 3,
      image_url: 'https://images.unsplash.com/photo-1546470427-e5c4d4b24d3a?w=400',
      is_primary: true
    }]
  }
]

// Fallback categories when API is offline
export const fallbackCategories: InternalCategory[] = [
  {
    category_id: 1,
    category_name: 'Fresh Fruits',
    description: 'Fresh and organic fruits',
    image_url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    category_id: 2,
    category_name: 'Grains & Rice',
    description: 'Quality grains and rice',
    image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    category_id: 3,
    category_name: 'Fresh Vegetables',
    description: 'Farm fresh vegetables',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    category_id: 4,
    category_name: 'Dairy Products',
    description: 'Fresh dairy products',
    image_url: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

// Fallback banners when API is offline
export const fallbackBanners: Banner[] = [
  {
    banner_id: 1,
    title: 'Fresh Groceries Delivered Daily',
    description: 'Get fresh vegetables, fruits, and daily essentials delivered to your doorstep',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200',
    redirect_url: null,
    banner_type: 'home_slider',
    is_active: true,
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    banner_id: 2,
    title: 'Flash Sale - 50% Off!',
    description: 'Limited time offer on selected items',
    image_url: 'https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800',
    redirect_url: '/flash-sale',
    banner_type: 'flash_sale',
    is_active: true,
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    banner_id: 3,
    title: 'Premium Quality Products',
    description: 'Discover our featured collection',
    image_url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
    redirect_url: '/featured',
    banner_type: 'featured',
    is_active: true,
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]