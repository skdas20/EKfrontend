import { useEffect, useState } from 'react'
import { Star, User } from 'lucide-react'
import api from '../../services/api'

interface Review {
  review_id: string
  rating: number
  comment: string
  created_at: string
  customer_name: string
}

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const response = await api.reviews.getProductReviews(productId)
      if (response.success) {
        setReviews(response.reviews || [])
        // Calculate average rating
        if (response.reviews && response.reviews.length > 0) {
          const avg = response.reviews.reduce((sum: number, r: Review) => sum + r.rating, 0) / response.reviews.length
          setAverageRating(Math.round(avg * 10) / 10)
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
        <div className="text-center py-8 text-gray-500">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Customer Reviews</h3>
        <div className="flex items-center gap-2">
          <Star size={20} className="fill-yellow-400 text-yellow-400" />
          <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
          <span className="text-gray-500">({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})</span>
        </div>
      </div>

      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.review_id} className="border-b border-gray-200 pb-4 last:border-0">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900">{review.customer_name}</span>
                  <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                </div>
                <div className="mb-2">
                  {renderStars(review.rating)}
                </div>
                {review.comment && (
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
