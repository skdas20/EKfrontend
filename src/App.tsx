import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import HomePage from './pages/HomePage'
import ProductDetailsPage from './pages/ProductDetailsPage'
import CategoryPage from './pages/CategoryPage'
import CheckoutPage from './pages/CheckoutPage'
import ScrollToTop from './components/ScrollToTop'
import PincodeModal from './components/Location/PincodeModal'
import LoadingPage from './components/Loading/LoadingPage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { CartProvider } from './context/CartContext'
import { LocationProvider } from './context/LocationContext'
import { AuthProvider } from './context/AuthContext'
import { useLocation } from './context/LocationContext'

function AppContent() {
  const { showPincodeModal, setShowPincodeModal, isFirstTime, pincode } = useLocation()
  const [appLoading, setAppLoading] = useState(true)

  useEffect(() => {
    // Show loading page briefly - allow time for "EasyKirana" typing animation to complete
    const timer = setTimeout(() => {
      setAppLoading(false)
    }, 2200) // Increased to allow full typing animation + pause

    return () => clearTimeout(timer)
  }, [])

  // Only show loading page for initial app load, not for auth operations
  if (appLoading) {
    return <LoadingPage message="Loading EasyKirana..." />
  }

  // Show only basic layout and force pincode selection if no pincode is set
  const hasPincode = pincode && pincode.trim() !== ''
  const shouldShowModal = showPincodeModal || !hasPincode

  return (
    <>
      <Layout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route path="/category/:id" element={<CategoryPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </Layout>
      <PincodeModal
        isOpen={shouldShowModal}
        onClose={() => {
          if (hasPincode) {
            setShowPincodeModal(false)
          }
        }}
        isFirstTime={isFirstTime || !hasPincode}
      />
    </>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <LocationProvider>
            <CartProvider>
              <AppContent />
            </CartProvider>
          </LocationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  )
}

export default App