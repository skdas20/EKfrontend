import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { useLocation } from '../../context/LocationContext'

interface PincodeModalProps {
  isOpen: boolean
  onClose: () => void
  isFirstTime?: boolean
}

export default function PincodeModal({ isOpen, onClose, isFirstTime = false }: PincodeModalProps) {
  const [inputPincode, setInputPincode] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { setPincode } = useLocation()

  const validatePincode = async (code: string) => {
    if (!/^\d{6}$/.test(code)) {
      return false
    }
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 300))
    setIsLoading(false)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!/^\d{6}$/.test(inputPincode)) {
      setError('Enter 6-digit pincode')
      return
    }

    const isValid = await validatePincode(inputPincode)
    if (isValid) {
      setPincode(inputPincode)
      onClose()
    } else {
      setError('Invalid pincode')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className="bg-white border-2 border-brand-200 rounded-lg shadow-lg p-4 max-w-xs">
        <div className="flex items-center space-x-2 mb-3">
          <MapPin className="h-4 w-4 text-brand-600" />
          <span className="text-sm font-medium text-gray-900">Enter Pincode</span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={inputPincode}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6)
                setInputPincode(value)
                setError('')
              }}
              placeholder="000000"
              className="w-full px-3 py-2 border border-gray-300 rounded text-center font-mono tracking-wide focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              maxLength={6}
              disabled={isLoading}
              required
              autoFocus
            />
            {error && (
              <p className="mt-1 text-xs text-red-600">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full btn-primary py-2 text-sm disabled:opacity-50"
            disabled={isLoading || inputPincode.length !== 6}
          >
            {isLoading ? 'Checking...' : 'Submit'}
          </button>
        </form>

        <p className="text-xs text-gray-500 mt-2">
          Required to show products in your area
        </p>
      </div>
    </div>
  )
}