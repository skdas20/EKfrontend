import { useState, useEffect } from 'react'
import { X, Phone, Lock, Shield, CheckCircle, User } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [isNewUser, setIsNewUser] = useState(false)
  const { sendOTP, verifyOTP, isLoading } = useAuth()

  console.log('LoginModal render - isOpen:', isOpen, 'step:', step, 'phone:', phone)

  useEffect(() => {
    console.log('Step changed in useEffect:', step)
  }, [step])

  useEffect(() => {
    console.log('Modal isOpen changed:', isOpen)
  }, [isOpen])

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('Phone submit called:', phone)
    setError('')
    setSuccessMessage('')
    
    if (!/^\d{10}$/.test(phone)) {
      setError('Please enter a valid 10-digit phone number')
      return
    }
    
    try {
      console.log('Sending OTP to:', phone)
      const result = await sendOTP(phone)
      console.log('OTP result:', result)
      
      if (result.success) {
        console.log('About to change step to otp')
        setSuccessMessage(result.message)
        setIsNewUser(result.isNewUser || false)
        setStep('otp')
        console.log('Step changed to otp, current step state should be:', step)
        // Force a small delay to see if state updates
        setTimeout(() => {
          console.log('After timeout - step is now:', step)
        }, 100)
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
      setError('Failed to send OTP. Please try again.')
    }
  }

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    console.log('OTP submit called:', otp)
    setError('')
    
    if (!/^\d{6}$/.test(otp)) {
      setError('Please enter a valid 6-digit OTP')
      return
    }
    
    try {
      console.log('Verifying OTP:', phone, otp)
      const result = await verifyOTP(phone, otp)
      console.log('Verify result:', result)
      
      if (result.success) {
        onClose()
        resetForm()
      } else {
        setError(result.message)
      }
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setError('Failed to verify OTP. Please try again.')
    }
  }

  const resetForm = () => {
    setStep('phone')
    setPhone('')
    setOtp('')
    setError('')
    setSuccessMessage('')
    setIsNewUser(false)
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
      resetForm()
    }
  }

  const handleResendOTP = async () => {
    setError('')
    const result = await sendOTP(phone)
    if (result.success) {
      setSuccessMessage('OTP sent again!')
    } else {
      setError(result.message)
    }
  }

  if (!isOpen) {
    console.log('Modal not open, returning null')
    return null
  }

  console.log('Modal rendering with step:', step)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent" 
         onClick={(e) => {
           console.log('Background clicked, but preventing close')
           e.preventDefault()
           e.stopPropagation()
         }}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden" 
           onClick={(e) => {
             console.log('Modal content clicked')
             e.stopPropagation()
           }}>
        {/* Header */}
        <div className="bg-white px-6 py-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cream-100 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-brand-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {step === 'phone' ? 'Welcome!' : 'Verify Phone'}
                </h3>
                <p className="text-sm text-gray-600">
                  {step === 'phone' ? 'Enter your mobile number' : 'Enter verification code'}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-2"
              disabled={isLoading}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 'phone' ? (
            // PHONE STEP
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center text-gray-500">
                    <span className="text-sm mr-2">+91</span>
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                      setPhone(value)
                      setError('')
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && phone.length === 10) {
                        handlePhoneSubmit(e)
                      }
                    }}
                    placeholder="9876543210"
                    className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    maxLength={10}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {successMessage}
                  </p>
                </div>
              )}
              
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  console.log('Send OTP button clicked - preventing all defaults')
                  handlePhoneSubmit(e)
                }}
                className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || phone.length !== 10}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Sending OTP...
                  </span>
                ) : (
                  'Send OTP'
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center">
                We'll send you a verification code via SMS
              </p>
            </div>
          ) : step === 'otp' ? (
            // OTP STEP
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  Code sent to +91 {phone}
                </p>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                      setOtp(value)
                      setError('')
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && otp.length === 6) {
                        handleOtpSubmit(e)
                      }
                    }}
                    placeholder="000000"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                    maxLength={6}
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
              </div>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}
              
              {successMessage && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-700 text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {successMessage}
                  </p>
                </div>
              )}
              
              {isNewUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm font-medium">Welcome to EasyKirana!</p>
                  <p className="text-blue-700 text-xs mt-1">
                    Creating your account...
                  </p>
                </div>
              )}
              
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  handleOtpSubmit(e)
                }}
                className="w-full bg-brand-600 text-white py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || otp.length !== 6}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Verifying...
                  </span>
                ) : (
                  'Verify & Login'
                )}
              </button>
              
              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone')
                    setOtp('')
                    setError('')
                  }}
                  className="text-gray-600 hover:text-gray-800"
                  disabled={isLoading}
                >
                  ← Change Number
                </button>
                <button 
                  type="button" 
                  className="text-brand-600 hover:text-brand-700 font-medium"
                  disabled={isLoading}
                  onClick={handleResendOTP}
                >
                  Resend Code
                </button>
              </div>
            </div>
          ) : (
            // FALLBACK - Unknown step
            <div className="space-y-4">
              <p className="text-red-600">Unknown step: {step}</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 px-6 py-3 border-t">
          <p className="text-xs text-gray-500 text-center flex items-center justify-center">
            <Shield className="h-3 w-3 mr-1" />
            Secure SMS verification
          </p>
        </div>
      </div>
    </div>
  )
}