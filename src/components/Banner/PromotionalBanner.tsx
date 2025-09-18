import { useState, useEffect } from 'react'
import { bannerAPI } from '../../services/api'
import type { Banner } from '../../types/api'

export default function PromotionalBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [currentBanner, setCurrentBanner] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const apiBanners = await bannerAPI.getByType('promotional')
        setBanners(apiBanners)
      } catch (err) {
        console.error('Error fetching promotional banners:', err)
        setBanners([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // Auto-advance promotional banners
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length)
      }, 4000) // Change every 4 seconds

      return () => clearInterval(interval)
    }
  }, [banners.length])

  if (loading || banners.length === 0) {
    return null
  }

  const banner = banners[currentBanner]

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative overflow-hidden rounded-lg h-40 md:h-48">
            <img
              src={banner.image_url}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-start p-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  {banner.title}
                </h3>
                {banner.description && (
                  <p className="text-gray-200 text-sm mb-3 max-w-md">
                    {banner.description}
                  </p>
                )}
                {banner.redirect_url && (
                  <a
                    href={banner.redirect_url}
                    className="inline-block bg-brand-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-brand-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Deals
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Additional promotional space */}
          <div className="bg-brand-50 rounded-lg p-6 flex items-center justify-center">
            <div className="text-center">
              <h4 className="text-xl font-semibold text-gray-800 mb-2">
                Special Offers
              </h4>
              <p className="text-gray-600 text-sm">
                Don't miss out on our daily deals and seasonal promotions
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}