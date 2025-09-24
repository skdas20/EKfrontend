import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ShoppingCart, MapPin, CreditCard, CheckCircle } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartReview from '../components/Checkout/CartReview'
import AddressSelection from '../components/Checkout/AddressSelection'
import OrderSummary from '../components/Checkout/OrderSummary'
import OrderConfirmation from '../components/Checkout/OrderConfirmation'

export type CheckoutStep = 'cart' | 'address' | 'summary' | 'confirmation'

interface StepInfo {
  id: CheckoutStep
  title: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const steps: StepInfo[] = [
  {
    id: 'cart',
    title: 'Cart Review',
    icon: ShoppingCart,
    description: 'Review your items'
  },
  {
    id: 'address',
    title: 'Delivery Address',
    icon: MapPin,
    description: 'Select delivery address'
  },
  {
    id: 'summary',
    title: 'Order Summary',
    icon: CreditCard,
    description: 'Payment & confirmation'
  },
  {
    id: 'confirmation',
    title: 'Order Placed',
    icon: CheckCircle,
    description: 'Order confirmation'
  }
]

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart')
  const [selectedAddress, setSelectedAddress] = useState<any>(null)
  const [orderData, setOrderData] = useState<any>(null)
  const { state } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  // Redirect to home if not logged in or cart is empty
  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    if (state.items.length === 0 && currentStep !== 'confirmation') {
      navigate('/')
      return
    }
  }, [user, state.items.length, currentStep, navigate])

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === currentStep)
  }

  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id)
    }
  }

  const goToPreviousStep = () => {
    const currentIndex = getCurrentStepIndex()
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id)
    }
  }

  const goToStep = (stepId: CheckoutStep) => {
    // Only allow going to previous steps or current step
    const targetIndex = steps.findIndex(step => step.id === stepId)
    const currentIndex = getCurrentStepIndex()
    if (targetIndex <= currentIndex) {
      setCurrentStep(stepId)
    }
  }

  const handleClose = () => {
    if (currentStep !== 'confirmation') {
      navigate('/')
    }
  }

  const handleOrderComplete = (order: any) => {
    setOrderData(order)
    setCurrentStep('confirmation')
  }

  const handleViewOrders = () => {
    // Navigate home and trigger order history modal
    navigate('/')
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('showOrderHistory'))
    }, 100)
  }

  const currentStepIndex = getCurrentStepIndex()
  const canGoBack = currentStepIndex > 0 && currentStep !== 'confirmation'
  const canGoNext = currentStepIndex < steps.length - 1 && currentStep !== 'confirmation'

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-white px-6 py-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
              {currentStep !== 'confirmation' && (
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-600 p-2"
                >
                  <ArrowLeft className="h-6 w-6" />
                  <span className="sr-only">Back to shopping</span>
                </button>
              )}
            </div>

            {/* Step Progress */}
            <div className="mt-6">
              <div className="flex items-center space-x-4">
                {steps.map((step, index) => {
                  const isActive = step.id === currentStep
                  const isCompleted = index < currentStepIndex
                  const isAccessible = index <= currentStepIndex
                  const Icon = step.icon

                  return (
                    <div key={step.id} className="flex items-center">
                      <button
                        onClick={() => goToStep(step.id)}
                        disabled={!isAccessible}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                          isActive
                            ? 'bg-cream-100 text-brand-700 border border-cream-300'
                            : isCompleted
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : isAccessible
                            ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{step.title}</div>
                          <div className="text-xs opacity-75">{step.description}</div>
                        </div>
                      </button>
                      {index < steps.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-gray-400 mx-3" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[500px]">
            {currentStep === 'cart' && (
              <CartReview
                onNext={goToNextStep}
                onClose={handleClose}
              />
            )}
            {currentStep === 'address' && (
              <AddressSelection
                selectedAddress={selectedAddress}
                onAddressSelect={setSelectedAddress}
                onNext={goToNextStep}
                onBack={goToPreviousStep}
              />
            )}
            {currentStep === 'summary' && (
              <OrderSummary
                selectedAddress={selectedAddress}
                onBack={goToPreviousStep}
                onOrderComplete={handleOrderComplete}
              />
            )}
            {currentStep === 'confirmation' && (
              <OrderConfirmation
                orderData={orderData}
                onClose={() => navigate('/')}
                onViewOrders={handleViewOrders}
              />
            )}
          </div>

          {/* Footer - Navigation for non-confirmation steps */}
          {currentStep !== 'confirmation' && (
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Step {currentStepIndex + 1} of {steps.length}
                </div>
                <div className="flex items-center space-x-3">
                  {canGoBack && (
                    <button
                      onClick={goToPreviousStep}
                      className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <ArrowLeft className="h-4 w-4 inline mr-2" />
                      Back
                    </button>
                  )}
                  {canGoNext && currentStep !== 'summary' && (
                    <button
                      onClick={goToNextStep}
                      className="px-6 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
                    >
                      Continue
                      <ArrowRight className="h-4 w-4 inline ml-2" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}