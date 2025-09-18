import { useState } from 'react'
import { MapPin, Search } from 'lucide-react'

interface LocationFilterProps {
  onLocationChange: (pincode: string) => void
  currentLocation?: string
  loading?: boolean
}

export default function LocationFilter({ onLocationChange, currentLocation, loading }: LocationFilterProps) {
  const [pincode, setPincode] = useState(currentLocation || '')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pincode.trim() && /^\d{6}$/.test(pincode.trim())) {
      onLocationChange(pincode.trim())
      setIsExpanded(false)
    } else {
      alert('Please enter a valid 6-digit pincode')
    }
  }

  const handleClear = () => {
    setPincode('')
    onLocationChange('')
    setIsExpanded(false)
  }

  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-brand-600" />
            <span className="text-sm font-medium text-gray-700">
              Delivery Location:
            </span>
            {currentLocation ? (
              <span className="text-sm text-brand-600 font-medium">
                {currentLocation}
              </span>
            ) : (
              <span className="text-sm text-gray-500">
                Select pincode for local products
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {!isExpanded ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
                disabled={loading}
              >
                {currentLocation ? 'Change' : 'Set Location'}
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter 6-digit pincode"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    maxLength={6}
                    className="w-40 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-brand-500 focus:border-brand-500"
                    disabled={loading}
                    autoFocus
                  />
                  {loading && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin h-3 w-3 border border-brand-600 rounded-full border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <button
                  type="submit"
                  className="p-1 text-brand-600 hover:text-brand-700"
                  disabled={loading}
                >
                  <Search className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                  disabled={loading}
                >
                  Cancel
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}