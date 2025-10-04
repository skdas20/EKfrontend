import { useState } from 'react'
import { MapPin, CreditCard, Banknote, CheckCircle } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { orderAPI } from '../../services/api'
import { LoadingSpinner } from '../Loading/LoadingPage'

interface OrderSummaryProps {
  selectedAddress: any
  customerEmail: string
  onBack: () => void
  onOrderComplete: (order: any) => void
}

const paymentMethods = [
  {
    id: 'cod',
    name: 'Cash on Delivery',
    description: 'Pay when your order arrives',
    icon: Banknote,
    enabled: true
  },
  {
    id: 'card',
    name: 'Credit/Debit Card',
    description: 'Pay securely with your card',
    icon: CreditCard,
    enabled: false
  }
]

export default function OrderSummary({ selectedAddress, customerEmail, onBack, onOrderComplete }: OrderSummaryProps) {
  const [selectedPayment, setSelectedPayment] = useState('cod')
  const [placingOrder, setPlacingOrder] = useState(false)
  const [orderNotes, setOrderNotes] = useState('')
  const { state, clearCart } = useCart()
  const { user, token } = useAuth()

  const deliveryFee = 0
  const totalAmount = state.total + deliveryFee

  const handlePlaceOrder = async () => {
    if (!token || !user || !selectedAddress) return

    try {
      setPlacingOrder(true)
      
      // Prepare order data
      // Derive vendor_id from first cart item (assumes cart items are from the same vendor)
      const vendorId = state.items && state.items.length > 0 ? (state.items[0] as any).vendor_id : undefined

      // Normalize payment method to backend-expected values
      const normalizedPayment = selectedPayment === 'cod' ? 'COD' : selectedPayment === 'card' ? 'credit_card' : selectedPayment

      const orderData = {
        user_id: user.id,
        vendor_id: vendorId,
        items: state.items.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.discounted_price || item.base_price,
          subtotal: (item.discounted_price || item.base_price) * item.quantity
        })),
        payment_method: normalizedPayment,
        total_amount: totalAmount,
        delivery_address_id: selectedAddress.address_id,
        order_type: 'online',
        notes: orderNotes,
        customer_email: (customerEmail && customerEmail.trim() !== '') ? customerEmail.trim() : undefined,
        customer_name: selectedAddress?.full_name || undefined
      }

      console.log('📧 Email check before order creation:', {
        customerEmail: customerEmail,
        customerEmailInData: orderData.customer_email,
        isEmpty: !customerEmail,
        isUndefined: orderData.customer_email === undefined
      })
      console.log('Creating order with data:', orderData)
      
      const response = await orderAPI.createOrder(token, orderData)
      
      if (response.order_id) {
        // Clear cart and complete order
        await clearCart()
        onOrderComplete({
          order_id: response.order_id,
          total_amount: totalAmount,
          payment_method: selectedPayment,
          delivery_address: selectedAddress,
          items: state.items
        })
      } else {
        throw new Error('Order creation failed')
      }
    } catch (error) {
      console.error('Error placing order:', error)
      alert('Failed to place order. Please try again.')
    } finally {
      setPlacingOrder(false)
    }
  }

  if (!selectedAddress) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-600">No address selected. Please go back and select an address.</p>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
        >
          Back to Address
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
      <div className="space-y-6">
        {/* Delivery Address */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-3 mb-3">
            <MapPin className="h-5 w-5 text-brand-600" />
            <h3 className="font-semibold text-gray-900">Delivery Address</h3>
          </div>
          <div className="pl-8">
            <p className="font-medium text-gray-900">{selectedAddress.full_name}</p>
            <p className="text-gray-600">{selectedAddress.mobile_number}</p>
            <p className="text-gray-600 mt-1">{selectedAddress.address_line1}</p>
            {selectedAddress.landmark && (
              <p className="text-gray-600">Near {selectedAddress.landmark}</p>
            )}
            <p className="text-gray-600">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Order Items ({state.itemCount})</h3>
          <div className="space-y-3">
            {state.items.map((item) => {
              const currentPrice = Number(item.discounted_price || item.base_price || 0)
              const itemTotal = currentPrice * item.quantity

              return (
                <div key={item.cart_id} className="flex items-center space-x-3">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/60x60/f3f4f6/9ca3af?text=No+Image'}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/60x60/f3f4f6/9ca3af?text=No+Image'
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{item.product_name}</p>
                    <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">₹{Number(currentPrice || 0).toFixed(2)} × {item.quantity}</span>
                      {item.discounted_price && (
                        <span className="text-xs text-gray-400 line-through">₹{Number(item.base_price || 0).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{Number(itemTotal || 0).toFixed(2)}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Payment Method</h3>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              const isSelected = selectedPayment === method.id
              
              return (
                <label
                  key={method.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    method.enabled 
                      ? (isSelected ? 'bg-cream-100 border border-brand-500' : 'bg-white border border-gray-200 hover:bg-gray-50')
                      : 'bg-gray-100 border border-gray-200 cursor-not-allowed opacity-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={isSelected}
                    onChange={(e) => setSelectedPayment(e.target.value)}
                    disabled={!method.enabled}
                    className="text-brand-600"
                  />
                  <Icon className="h-5 w-5 text-gray-600" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{method.name}</p>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    {!method.enabled && (
                      <p className="text-xs text-gray-500 mt-1">Coming Soon</p>
                    )}
                  </div>
                  {isSelected && method.enabled && (
                    <CheckCircle className="h-5 w-5 text-brand-600" />
                  )}
                </label>
              )
            })}
          </div>
        </div>

        {/* Order Notes */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Special Instructions (Optional)</h3>
          <textarea
            value={orderNotes}
            onChange={(e) => setOrderNotes(e.target.value)}
            placeholder="Add any special delivery instructions..."
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        {/* Bill Summary */}
        <div className="bg-brand-50 p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-3">Bill Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Item Total</span>
              <span>₹{Number(state.subtotal || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Delivery Fee</span>
              <span className="text-green-600">{deliveryFee === 0 ? 'Free' : `₹${Number(deliveryFee || 0).toFixed(2)}`}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span>₹{Number(totalAmount || 0).toFixed(2)}</span>
              </div>
            </div>
            {selectedPayment === 'cod' && (
              <div className="text-xs text-gray-600 mt-2">
                * Cash to be paid on delivery: ₹{Number(totalAmount || 0).toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={placingOrder || !selectedPayment}
          className="w-full py-4 bg-brand-600 text-white rounded-lg font-semibold text-lg hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {placingOrder ? (
            <>
              <LoadingSpinner size="sm" className="text-white" />
              <span>Placing Order...</span>
            </>
          ) : (
            <>
              <span>Place Order</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}