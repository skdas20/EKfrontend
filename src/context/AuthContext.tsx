import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { authAPI } from '../services/api'

interface User {
  id: string
  name?: string
  email?: string
  phone: string
  role: string
}

interface AuthContextType {
  user: User | null
  sendOTP: (phone: string) => Promise<{ success: boolean; message: string; isNewUser?: boolean }>
  verifyOTP: (phone: string, otp: string) => Promise<{ success: boolean; message: string }>
  logout: () => void
  isLoading: boolean
  token: string | null
  showLoginModal: () => void
  hideLoginModal: () => void
  isLoginModalOpen: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // Helper function to check if token is expired
  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      const currentTime = Date.now() / 1000
      return payload.exp < currentTime
    } catch (error) {
      console.error('Error parsing token:', error)
      return true // Treat invalid tokens as expired
    }
  }

  // Check for existing auth on mount and validate token
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    const savedUser = localStorage.getItem('user_data')
    
    if (savedToken && savedUser) {
      // Check if token is expired
      if (isTokenExpired(savedToken)) {
        console.log('Stored token is expired, clearing auth data')
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        setToken(null)
        setUser(null)
        return
      }

      setToken(savedToken)
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      }
    }

    // Listen for global logout events (from API errors)
    const handleGlobalLogout = () => {
      console.log('Global logout event received')
      setUser(null)
      setToken(null)
    }

    window.addEventListener('auth:logout', handleGlobalLogout)
    
    return () => {
      window.removeEventListener('auth:logout', handleGlobalLogout)
    }
  }, [])

  const sendOTP = async (phone: string) => {
    setIsLoading(true)
    try {
      // Add +91 prefix if not present
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`
      const response = await authAPI.customerAuth(formattedPhone)
      
      if (response.message === 'OTP sent successfully') {
        return {
          success: true,
          message: response.message,
          isNewUser: response.isNewUser
        }
      } else {
        return {
          success: false,
          message: response.message || 'Failed to send OTP'
        }
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      return {
        success: false,
        message: 'Failed to send OTP. Please try again.'
      }
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOTP = async (phone: string, otp: string) => {
    setIsLoading(true)
    try {
      // Add +91 prefix if not present  
      const formattedPhone = phone.startsWith('+91') ? phone : `+91${phone}`
      const response = await authAPI.verifyOTP(formattedPhone, otp)
      
      if (response.token && response.user) {
        const userData: User = {
          id: response.user.id.toString(),
          phone: response.user.phone_number,
          role: response.user.role,
          name: response.user.name || undefined,
          email: response.user.email || undefined
        }
        
        setUser(userData)
        setToken(response.token)
        
        // Save to localStorage
        localStorage.setItem('auth_token', response.token)
        localStorage.setItem('user_data', JSON.stringify(userData))
        
        return {
          success: true,
          message: response.message || 'Login successful'
        }
      } else {
        return {
          success: false,
          message: response.message || 'Invalid OTP'
        }
      }
    } catch (error) {
      console.error('Verify OTP error:', error)
      return {
        success: false,
        message: 'Invalid OTP or verification failed'
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    console.log('AuthContext: logout called')
    console.log('AuthContext: clearing user and token')
    setUser(null)
    setToken(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    console.log('AuthContext: logout complete')
  }

  const showLoginModal = () => {
    setIsLoginModalOpen(true)
  }

  const hideLoginModal = () => {
    setIsLoginModalOpen(false)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      sendOTP, 
      verifyOTP, 
      logout, 
      isLoading, 
      token,
      showLoginModal,
      hideLoginModal,
      isLoginModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  )
}