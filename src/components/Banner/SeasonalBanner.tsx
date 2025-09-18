import { useState, useEffect } from 'react'
import { Snowflake, Sun, Leaf, Flower } from 'lucide-react'
import { bannerAPI } from '../../services/api'
import type { Banner } from '../../types/api'

export default function SeasonalBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const apiBanners = await bannerAPI.getByType('seasonal')
        setBanners(apiBanners)
      } catch (err) {
        console.error('Error fetching seasonal banners:', err)
        setBanners([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // Get seasonal icon based on current month or banner content
  const getSeasonalIcon = () => {
    const month = new Date().getMonth() + 1
    
    if (month >= 3 && month <= 5) return <Flower className="h-6 w-6" /> // Spring
    if (month >= 6 && month <= 8) return <Sun className="h-6 w-6" /> // Summer  
    if (month >= 9 && month <= 11) return <Leaf className="h-6 w-6" /> // Autumn
    return <Snowflake className="h-6 w-6" /> // Winter
  }

  const getSeasonalColors = () => {
    const month = new Date().getMonth() + 1
    
    if (month >= 3 && month <= 5) return 'from-green-400 to-blue-400' // Spring
    if (month >= 6 && month <= 8) return 'from-yellow-400 to-orange-400' // Summer
    if (month >= 9 && month <= 11) return 'from-orange-400 to-red-400' // Autumn
    return 'from-blue-400 to-indigo-400' // Winter
  }

  if (loading || banners.length === 0) {
    return null
  }

  const banner = banners[0]

  return (
    <section className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-brand-50">
          {/* right-side seasonal gradient (keeps left side uniformly cream) */}
          <div className={`absolute right-0 top-0 h-full w-2/5 bg-gradient-to-br ${getSeasonalColors()}`} />
          {/* subtle white veil to slightly soften the whole banner */}
          <div className="absolute inset-0 bg-white/5" />
          {/* Background Pattern only on the right gradient area */}
          <div className="absolute right-0 top-0 h-full w-2/5 opacity-10">
            <div className="grid grid-cols-3 gap-4 h-full items-center justify-center">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex items-center justify-center text-brand-50 text-2xl">
                  {getSeasonalIcon()}
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 px-8 py-12 md:py-16">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-cream-100 p-3 rounded-full text-cream-900">
                    {getSeasonalIcon()}
                  </div>
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-cream-900">
                    {banner.title}
                  </h2>
                  <p className="text-cream-800 text-lg mt-2">
                    Seasonal Collection
                  </p>
                </div>
              </div>
              
              {banner.description && (
                <p className="text-white/90 text-lg mb-6 max-w-2xl">
                  {banner.description}
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                {banner.redirect_url && (
                  <a
                    href={banner.redirect_url}
                    className="bg-brand-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-brand-700 transition-colors inline-block text-center"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shop Seasonal Items
                  </a>
                )}
                <button className="border-2 border-cream-300 text-cream-900 px-8 py-3 rounded-lg font-semibold hover:bg-cream-100 transition-colors">
                  Browse Collection
                </button>
              </div>
            </div>
          </div>

          {banner.image_url && (
            <div className="absolute right-0 top-0 w-2/5 h-full">
              <img
                src={banner.image_url}
                alt={banner.title}
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}