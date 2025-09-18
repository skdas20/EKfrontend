import { useState, useEffect } from 'react'
import { bannerAPI } from '../../services/api'
import type { Banner } from '../../types/api'

export default function CategoryBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const apiBanners = await bannerAPI.getByType('category_banner')
        setBanners(apiBanners)
      } catch (err) {
        console.error('Error fetching category banners:', err)
        setBanners([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  if (loading || banners.length === 0) {
    return null // Don't show anything if no category banners
  }

  const banner = banners[0] // Show first category banner

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-brand-50 to-accent-50 h-48 md:h-64">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${banner.image_url})`,
            }}
          />
          {/* lighter white overlay to keep imagery visible while ensuring text contrast */}
          <div className="absolute inset-0 bg-white/40" />
          
          <div className="relative z-10 h-full flex items-center justify-center text-center">
            <div className="max-w-3xl px-6">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {banner.title}
              </h2>
              {banner.description && (
                <p className="text-lg text-gray-200 mb-6">
                  {banner.description}
                </p>
              )}
              {banner.redirect_url && (
                <a
                  href={banner.redirect_url}
                  className="btn-primary-gradient"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Shop Now
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}