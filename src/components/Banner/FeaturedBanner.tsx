import { useState, useEffect } from 'react'
import { Star } from 'lucide-react'
import { bannerAPI } from '../../services/api'
import type { Banner } from '../../types/api'

export default function FeaturedBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const apiBanners = await bannerAPI.getByType('featured')
        setBanners(apiBanners)
      } catch (err) {
        console.error('Error fetching featured banners:', err)
        setBanners([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  if (loading || banners.length === 0) {
    return null
  }

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Star className="h-6 w-6 text-brand-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Products</h2>
            <Star className="h-6 w-6 text-brand-600" />
          </div>
          <p className="text-gray-600">Hand-picked items just for you</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.slice(0, 3).map((banner, _index) => (
            <div key={banner.banner_id} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="aspect-w-16 aspect-h-10">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-lg font-semibold text-white mb-1">
                  {banner.title}
                </h3>
                {banner.description && (
                  <p className="text-gray-200 text-sm mb-3 line-clamp-2">
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
                    Explore
                  </a>
                )}
              </div>
              
              <div className="absolute top-2 right-2">
                <div className="bg-brand-600 text-white text-xs px-2 py-1 rounded-full font-medium">
                  Featured
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}