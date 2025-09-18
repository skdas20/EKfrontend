import Hero from '../components/Hero/Hero'
import CategoryGrid from '../components/Categories/CategoryGrid'
import ProductGrid from '../components/Product/ProductGrid'
import CategoryBanner from '../components/Banner/CategoryBanner'
import PromotionalBanner from '../components/Banner/PromotionalBanner'
import FlashSaleBanner from '../components/Banner/FlashSaleBanner'
import FeaturedBanner from '../components/Banner/FeaturedBanner'
import SeasonalBanner from '../components/Banner/SeasonalBanner'

export default function HomePage() {
  return (
    <>
      {/* Hero Section with home_slider banners */}
      <Hero />

      {/* Flash Sale Banner - prominent placement */}
      <FlashSaleBanner />

      {/* Category Banner - after hero */}
      <CategoryBanner />

      {/* Categories Grid */}
      <CategoryGrid />

      {/* Promotional Banner - between categories and products */}
      <PromotionalBanner />

      {/* Featured Banner - showcase special products */}
      <FeaturedBanner />

      {/* Main Products Grid */}
      <ProductGrid />

      {/* Seasonal Banner - at the bottom */}
      <SeasonalBanner />
    </>
  )
}