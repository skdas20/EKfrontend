import Header from './Header'
import Footer from './Footer'
import LocationFilter from '../Location/LocationFilter'
import type { ReactNode } from 'react'
import { useLocation } from '../../context/LocationContext'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { pincode, setPincode, loading, setLoading } = useLocation()

  const handleLocationChange = async (newPincode: string) => {
    setLoading(true)
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      setPincode(newPincode)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <LocationFilter 
        onLocationChange={handleLocationChange}
        currentLocation={pincode}
        loading={loading}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}