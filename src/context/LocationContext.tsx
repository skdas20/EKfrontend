import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface LocationContextType {
  pincode: string
  setPincode: (pincode: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  showPincodeModal: boolean
  setShowPincodeModal: (show: boolean) => void
  isFirstTime: boolean
}

const LocationContext = createContext<LocationContextType | undefined>(undefined)

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

interface LocationProviderProps {
  children: ReactNode
}

export const LocationProvider: React.FC<LocationProviderProps> = ({ children }) => {
  const [pincode, setPincode] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showPincodeModal, setShowPincodeModal] = useState<boolean>(false)
  const [isFirstTime, setIsFirstTime] = useState<boolean>(false)

  useEffect(() => {
    // Check if user has previously set a pincode
    const savedPincode = localStorage.getItem('user_pincode')
    const hasVisited = localStorage.getItem('has_visited')

    if (savedPincode && savedPincode.trim() !== '') {
      setPincode(savedPincode)
      setShowPincodeModal(false)
    } else {
      // No pincode saved - show modal (first time or returning user without pincode)
      setIsFirstTime(!hasVisited)
      setShowPincodeModal(true)
      if (!hasVisited) {
        localStorage.setItem('has_visited', 'true')
      }
    }
  }, [])

  const handleSetPincode = (newPincode: string) => {
    setPincode(newPincode)
    setIsFirstTime(false)
    setShowPincodeModal(false)
    // Save pincode to localStorage
    localStorage.setItem('user_pincode', newPincode)
  }

  return (
    <LocationContext.Provider value={{ 
      pincode, 
      setPincode: handleSetPincode, 
      loading, 
      setLoading,
      showPincodeModal,
      setShowPincodeModal,
      isFirstTime
    }}>
      {children}
    </LocationContext.Provider>
  )
}