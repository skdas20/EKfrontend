import { CheckCircle, Package, MapPin, Clock, CreditCard } from 'lucide-react'

interface OrderConfirmationProps {
  orderData: any
  onClose: () => void
  onViewOrders?: () => void
}

export default function OrderConfirmation({ orderData, onClose, onViewOrders }: OrderConfirmationProps) {
  if (!orderData) return null

  const estimatedDelivery = new Date()
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 1) // Next day delivery

  return (
    <div className="p-8 text-center">
      {/* Success Icon */}
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="h-10 w-10" />
      </div>

      {/* Success Message */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
      <p className="text-gray-600 mb-6">
        Thank you for your order. We'll send you updates about your delivery.
      </p>

      {/* Order Details Card */}
      <div className="bg-gray-50 p-6 rounded-lg mb-6 text-left max-w-md mx-auto">
        <div className="space-y-4">
          {/* Order ID */}
          <div className="flex items-center space-x-3">
            <Package className="h-5 w-5 text-brand-600" />
            <div>
              <p className="text-sm text-gray-600">Order ID</p>
              <p className="font-semibold text-gray-900">#{orderData.order_id}</p>
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex items-center space-x-3">
            <CreditCard className="h-5 w-5 text-brand-600" />
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="font-semibold text-gray-900">₹{Number(orderData.total_amount || 0).toFixed(2)}</p>
              <p className="text-xs text-gray-500 capitalize">
                {orderData.payment_method === 'cod' ? 'Cash on Delivery' : orderData.payment_method}
              </p>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-brand-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Delivery Address</p>
              <p className="font-semibold text-gray-900">{orderData.delivery_address?.full_name || '—'}</p>
              <p className="text-sm text-gray-600">{orderData.delivery_address?.address_line1 || ''}</p>
              <p className="text-sm text-gray-600">
                {orderData.delivery_address ? `${orderData.delivery_address.city}, ${orderData.delivery_address.state} - ${orderData.delivery_address.pincode}` : ''}
              </p>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-brand-600" />
            <div>
              <p className="text-sm text-gray-600">Estimated Delivery</p>
              <p className="font-semibold text-gray-900">
                {estimatedDelivery.toLocaleDateString('en-IN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-gray-900 mb-3">Items Ordered</h3>
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {orderData.items?.map((item: any, index: number) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.product_name} x {item.quantity}
              </span>
              <span className="font-medium">
                ₹{Number(((item.discounted_price || item.base_price) || 0) * (item.quantity || 0)).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left max-w-md mx-auto">
        <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
        <ul className="space-y-1 text-sm text-blue-800">
          <li>• You'll receive order updates via SMS</li>
          <li>• Our team will prepare your order</li>
          <li>• Track your order in the Orders section</li>
          <li>• Pay cash when delivered to your doorstep</li>
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <button
          onClick={onClose}
          className="flex-1 py-3 px-4 bg-brand-600 text-white rounded-lg font-medium hover:bg-brand-700 transition-colors"
        >
          Continue Shopping
        </button>
        <button
          onClick={() => {
            if (onViewOrders) {
              onViewOrders()
            } else {
              onClose()
            }
          }}
          className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          View Orders
        </button>
      </div>

      {/* Contact Support */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Need help? Contact us at{' '}
          <a href="tel:+1234567890" className="text-brand-600 hover:text-brand-700">
            +91 12345 67890
          </a>
        </p>
      </div>
    </div>
  )
}