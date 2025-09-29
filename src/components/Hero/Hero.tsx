import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { bannerAPI } from '../../services/api'
import type { Banner } from '../../types/api'

export default function Hero() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const apiBanners = await bannerAPI.getByType('home_slider')
        // API already returns only active banners within date range
        setBanners(apiBanners)
      } catch (err) {
        console.error('Error fetching banners:', err)
        // Keep empty array, will show default hero
        setBanners([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // Auto-advance banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 5000) // Change every 5 seconds

      return () => clearInterval(interval)
    }
  }, [banners.length])

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length)
  }

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length)
  }

  // Default hero content when no banners or loading
  if (loading || banners.length === 0) {
    return (
      <section className="bg-gradient-to-br from-brand-50 via-brand-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {loading ? (
              <div className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded mb-6 max-w-2xl mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded mb-8 max-w-3xl mx-auto"></div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="h-12 bg-gray-200 rounded w-32"></div>
                  <div className="h-12 bg-gray-200 rounded w-40"></div>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  Fresh Groceries
                  <span className="block text-gradient-brand">Delivered Daily</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Get fresh vegetables, fruits, and daily essentials delivered to your doorstep. 
                  Quality products from trusted local vendors.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      const categorySection = document.querySelector('[data-section="categories"]') ||
                                           document.querySelector('section[class*="bg-brand-50"]')
                      categorySection?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="btn-primary-gradient"
                  >
                    Shop Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    )
  }

  const banner = banners[currentBanner]

  return (
    <section className="relative h-96 md:h-[500px] overflow-hidden">
      {/* Banner Image Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
        style={{
          backgroundImage: `url(${banner.image_url})`,
          filter: 'brightness(0.7)'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {banner.title}
            </h1>
            {banner.description && (
              <p className="text-xl text-gray-200 mb-8">
                {banner.description}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              {banner.redirect_url ? (
                <a
                  href={banner.redirect_url}
                  className="btn-primary-gradient"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Now
                </a>
              ) : (
                <button
                  onClick={() => {
                    const categorySection = document.querySelector('[data-section="categories"]') ||
                                         document.querySelector('section[class*="bg-brand-50"]')
                    categorySection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="btn-primary-gradient"
                >
                  Shop Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevBanner}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextBanner}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Banner Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentBanner(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentBanner ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  )
}