import { useState, useEffect } from 'react'
import { Package, Clock, CheckCircle, XCircle, MapPin, Phone } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { orderAPI } from '../../services/api'
import { LoadingSpinner } from '../Loading/LoadingPage'
import { useCart } from '../../context/CartContext'

interface Order {
  order_id: string
  order_status: string
  total_amount: number
  payment_method: string
  created_at: string
  updated_at: string
  user_details: any
  delivery_address: any
  items: any[]
  payment: any
}

interface OrderHistoryProps {
  onClose?: () => void
}

export default function OrderHistory({ onClose }: OrderHistoryProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const { user, token } = useAuth()
  const { addItem, clearCart } = useCart()
  const [reordering, setReordering] = useState(false)

  useEffect(() => {
    loadOrders()
  }, [])

  const loadOrders = async () => {
    console.log('OrderHistory: loadOrders called')
    console.log('OrderHistory: token =', token ? 'present' : 'missing')
    console.log('OrderHistory: user =', user)
    
    if (!token || !user) {
      console.log('OrderHistory: No token or user, skipping API call')
      return
    }

    try {
      setLoading(true)
      console.log('OrderHistory: Calling orderAPI.getUserOrders with userId:', user.id)
      const data = await orderAPI.getUserOrders(token, user.id)
      console.log('OrderHistory: API response:', data)
      setOrders(data)
    } catch (error) {
      console.error('OrderHistory: Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />
      case 'picked':
        return <Package className="h-5 w-5 text-blue-600" />
      case 'out_for_delivery':
        return <Package className="h-5 w-5 text-blue-600" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-600" />
      default:
        return <Package className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Placed'
      case 'picked':
        return 'Order Picked'
      case 'out_for_delivery':
        return 'Out for Delivery'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'picked':
        return 'bg-blue-100 text-blue-800'
      case 'out_for_delivery':
        return 'bg-blue-100 text-blue-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleReorder = async (order: Order) => {
    if (!user || !token) return
    try {
      setReordering(true)
      
      // Close the My Orders modal first
      if (onClose) {
        onClose()
      }
      
      // Clear current cart
      await clearCart()
      // Add each item from the order to cart
      for (const item of order.items || []) {
        // item expected shape: product_id, variant_id, product_name, variant_name, variant_price, quantity
        await addItem(
          Number(item.product_id),
          item.product_name,
          Number(item.base_price || item.variant_price || 0),
          item.discounted_price ?? null,
          item.image_url ?? null,
          item.variant_id ? Number(item.variant_id) : undefined,
          item.variant_name ?? undefined,
          item.variant_price ? Number(item.variant_price) : undefined
        )
        // If the order had quantity >1, update quantity accordingly (addItem increments by 1 each call)
        if (item.quantity && item.quantity > 1) {
          for (let i = 1; i < item.quantity; i++) {
            await addItem(
              Number(item.product_id),
              item.product_name,
              Number(item.base_price || item.variant_price || 0),
              item.discounted_price ?? null,
              item.image_url ?? null,
              item.variant_id ? Number(item.variant_id) : undefined,
              item.variant_name ?? undefined,
              item.variant_price ? Number(item.variant_price) : undefined
            )
          }
        }
      }

      // Wait a moment for the modal to close, then open cart drawer and checkout
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('openCart', { detail: { openCheckout: true } }))
      }, 300)
    } catch (error) {
      console.error('Reorder failed', error)
    } finally {
      setReordering(false)
    }
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-gray-600">Please login to view your order history.</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Loading your orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Orders Yet</h2>
        <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors">
          Start Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.order_id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Order Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(order.order_status)}
                    <div>
                      <p className="font-semibold text-gray-900">Order #{order.order_id}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                    {getStatusText(order.order_status)}
                  </span>
                </div>
                <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">₹{Number(order.total_amount || 0).toFixed(2)}</p>
                  <p className="text-sm text-gray-600 capitalize">{order.payment?.payment_method || 'Cash on Delivery'}</p>
                </div>
              </div>
            </div>

            {/* Order Content */}
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Items ({order.items?.length || 0})</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {order.items?.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          {item.product_name} x {item.quantity}
                        </span>
                          <span className="font-medium">₹{Number(item.subtotal || 0).toFixed(2)}</span>
                      </div>
                    )) || (
                      <p className="text-sm text-gray-500">No items found</p>
                    )}
                  </div>
                </div>

                {/* Delivery Address */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Delivery Address
                  </h3>
                  {order.delivery_address ? (
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">{order.delivery_address.full_name}</p>
                      <p className="flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {order.delivery_address.mobile_number}
                      </p>
                      <p>{order.delivery_address.address_line1}</p>
                      {order.delivery_address.landmark && (
                        <p>Near {order.delivery_address.landmark}</p>
                      )}
                      <p>{order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Address not available</p>
                  )}
                </div>
              </div>

              {/* Order Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <button
                  onClick={() => setSelectedOrder(selectedOrder?.order_id === order.order_id ? null : order)}
                  className="text-brand-600 hover:text-brand-700 font-medium text-sm"
                >
                  {selectedOrder?.order_id === order.order_id ? 'Hide Details' : 'View Details'}
                </button>
                
                <div className="flex space-x-3">
                  {order.order_status === 'delivered' && (
                    <button
                      onClick={() => handleReorder(order)}
                      className="px-4 py-2 text-sm bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                      disabled={reordering}
                    >
                      {reordering ? 'Adding...' : 'Reorder'}
                    </button>
                  )}
                  {order.order_status === 'pending' && (
                    <button className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors">
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {selectedOrder?.order_id === order.order_id && (
              <div className="border-t border-gray-200 bg-gray-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Order Timeline</h4>
                    <div className="space-y-1 text-gray-600">
                      <p>Order Placed: {new Date(order.created_at).toLocaleString('en-IN')}</p>
                      <p>Last Updated: {new Date(order.updated_at).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment Details</h4>
                    <div className="space-y-1 text-gray-600">
                      <p>Method: {order.payment?.payment_method || 'Cash on Delivery'}</p>
                      <p>Status: {order.payment?.payment_status || 'Pending'}</p>
                        <p>Amount: ₹{Number(order.total_amount || 0).toFixed(2)}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Support</h4>
                    <div className="space-y-1">
                      <button className="text-brand-600 hover:text-brand-700 block">Contact Support</button>
                      <button className="text-brand-600 hover:text-brand-700 block">Track Order</button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}