import { useState, useEffect } from 'react'
import { Clock, Zap } from 'lucide-react'
import { bannerAPI } from '../../services/api'
import type { Banner } from '../../types/api'

interface TimeRemaining {
  days: number
  hours: number
  minutes: number
  seconds: number
  isExpired: boolean
}

export default function FlashSaleBanner() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  })

  // Function to calculate time remaining
  const calculateTimeRemaining = (endDate: string): TimeRemaining => {
    const now = new Date().getTime()
    const end = new Date(endDate).getTime()
    const difference = end - now

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true
      }
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((difference % (1000 * 60)) / 1000)

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false
    }
  }

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const apiBanners = await bannerAPI.getByType('flash_sale')
        setBanners(apiBanners)
      } catch (err) {
        console.error('Error fetching flash sale banners:', err)
        setBanners([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  // Timer effect - updates every second
  useEffect(() => {
    if (banners.length === 0) return

    const banner = banners[0]

    // Initial calculation
    setTimeRemaining(calculateTimeRemaining(banner.end_date))

    // Set up interval to update every second
    const interval = setInterval(() => {
      const remaining = calculateTimeRemaining(banner.end_date)
      setTimeRemaining(remaining)

      // Clear interval if expired
      if (remaining.isExpired) {
        clearInterval(interval)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [banners])

  if (loading || banners.length === 0 || timeRemaining.isExpired) {
    return null
  }

  const banner = banners[0]

  // Format timer display - show days if > 0, otherwise show hours:minutes:seconds
  const formatTimer = () => {
    if (timeRemaining.days > 0) {
      return `${timeRemaining.days}d ${timeRemaining.hours.toString().padStart(2, '0')}:${timeRemaining.minutes.toString().padStart(2, '0')}:${timeRemaining.seconds.toString().padStart(2, '0')}`
    }
    return `${timeRemaining.hours.toString().padStart(2, '0')}:${timeRemaining.minutes.toString().padStart(2, '0')}:${timeRemaining.seconds.toString().padStart(2, '0')}`
  }

  return (
    <section className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-lg overflow-hidden bg-accent-50">
          {/* Left-side cream panel for brand-consistent look */}
          <div className="absolute inset-y-0 left-0 w-1/2 bg-accent-100" />
          {/* keep the right side clear so the banner image shows through */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-transparent" />

          <div className="relative z-10 px-6 py-8 md:py-12">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <div className="bg-accent-200 p-2 rounded-full">
                  <Zap className="h-8 w-8 text-accent-900" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                    {banner.title || 'Flash Sale'}
                  </h2>
                  <p className="text-gray-800 text-lg">
                    {banner.description || 'Limited time offers!'}
                  </p>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white/80 backdrop-blur rounded-lg p-4 mb-3">
                  <div className="flex items-center justify-center space-x-2 text-gray-900 mb-2">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm font-medium">
                      {timeRemaining.days > 0 ? 'Ends In' : 'Ends Soon'}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {formatTimer()}
                  </div>
                  {timeRemaining.days > 0 && (
                    <div className="text-xs text-gray-600 mt-1">
                      {timeRemaining.days} day{timeRemaining.days !== 1 ? 's' : ''} remaining
                    </div>
                  )}
                </div>
                
                {banner.redirect_url && (
                  <a
                    href={banner.redirect_url}
                    className="btn-accent-gradient"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Shop Flash Sale
                  </a>
                )}
              </div>
            </div>
          </div>
          
          {banner.image_url && (
            <div 
              className="absolute right-0 top-0 w-1/3 h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${banner.image_url})`,
              }}
            />
          )}
        </div>
      </div>
    </section>
  )
}