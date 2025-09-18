import { ShoppingCart, Search, User, LogOut, MapPin, Package, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useLocation } from '../../context/LocationContext'
import CartDrawer from '../Cart/CartDrawer'
import LoginModal from '../Auth/LoginModal'
import PincodeModal from '../Location/PincodeModal'
import OrderHistory from '../Orders/OrderHistory'

/* ===========================================
   EasyKirana SVG Logo for Header (with shine)
   - Same basket + gradients + word-mark
   - Occasional shine sweep across the text
   - Scales to header height (h-10)
   =========================================== */
const EKLogo = ({ className = '' }: { className?: string }) => {
  return (
    <div className={`relative ${className}`} aria-hidden="false" aria-label="EasyKirana logo">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Pacifico&family=Montserrat:wght@400;600&display=swap');

        /* Shine sweep every ~7.5s, brief and subtle */
        @keyframes ekShine {
          0%   { transform: translateX(-120%); opacity: 0; }
          8%   { opacity: .0; }
          12%  { opacity: .25; }
          18%  { opacity: .18; }
          24%  { opacity: 0; transform: translateX(140%); }
          100% { opacity: 0; transform: translateX(140%); }
        }
        .ek-shine {
          position: absolute;
          inset: 0;
          pointer-events: none;
          mix-blend-mode: screen; /* gentle highlight effect */
          will-change: transform, opacity;
          animation: ekShine 7.5s ease-in-out infinite;
        }
        /* diagonal soft gradient strip */
        .ek-shine::before {
          content: '';
          position: absolute;
          top: -30%;
          bottom: -30%;
          left: 0;
          width: 45%;
          transform: skewX(-18deg);
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,.65) 50%, rgba(255,255,255,0) 100%);
          border-radius: 12px;
        }
        /* Respect reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .ek-shine { animation: none; display: none; }
        }
      `}</style>

      <svg
        viewBox="0 0 1200 420"
        role="img"
        aria-label="EasyKirana — Grocery Became Easy"
        className="h-full w-auto"
      >
        <defs>
          <linearGradient id="g-easy" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1CB64E" />
            <stop offset="100%" stopColor="#0D8F2F" />
          </linearGradient>
          <linearGradient id="g-kirana" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFA22A" />
            <stop offset="60%" stopColor="#FF7F1E" />
            <stop offset="100%" stopColor="#EB5C0C" />
          </linearGradient>
          <linearGradient id="g-basket" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFA33A" />
            <stop offset="100%" stopColor="#FF7F1E" />
          </linearGradient>
          <linearGradient id="g-carrot" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFA63E" />
            <stop offset="100%" stopColor="#FF7B1B" />
          </linearGradient>
        </defs>

        {/* Basket group */}
        <g transform="translate(90,120)">
          {/* handle */}
          <path d="M40 70 L60 10 H150 L170 70" fill="none" stroke="#18A145" strokeWidth="12" strokeLinecap="round" />
          <rect x="80" y="0" rx="14" ry="14" width="50" height="26" fill="#FFFFFF" stroke="#18A145" strokeWidth="10" />

          {/* items */}
          <path d="M72 90 l24 -12 l24 12 v48 h-48z" fill="#FDE2F4" stroke="#E91E63" strokeWidth="3" />
          <rect x="84" y="80" width="24" height="10" fill="#FF6BAA" opacity="0.9" />

          <ellipse cx="155" cy="92" rx="24" ry="8" fill="#89E1DB" />
          <rect x="131" y="92" width="48" height="36" fill="#A7F3D0" />
          <ellipse cx="155" cy="128" rx="24" ry="8" fill="#7ED4C8" />
          <rect x="133" y="80" width="44" height="10" fill="#23B3A9" rx="4" />

          {/* carrot */}
          <path
            d="M210 65 C240 60 260 72 270 90 C276 102 274 116 264 122 C236 139 203 95 210 65 Z"
            fill="url(#g-carrot)" stroke="#E66410" strokeWidth="2.5"
          />
          <path d="M228 54 C238 39 255 42 264 44" fill="none" stroke="#25B34D" strokeWidth="6" strokeLinecap="round" />
          <path d="M220 52 C225 36 238 34 246 35" fill="none" stroke="#31C25A" strokeWidth="6" strokeLinecap="round" />

          {/* basket body */}
          <rect x="0" y="110" width="320" height="180" rx="16" fill="url(#g-basket)" stroke="#18A145" strokeWidth="14" />
          <rect x="-10" y="110" width="340" height="30" rx="14" fill="#FF8D23" stroke="#18A145" strokeWidth="10" />

          {/* basket grid */}
          <g stroke="#18A145" strokeWidth="7" opacity="0.9">
            {Array.from({ length: 10 }).map((_, i) => (
              <line key={`v${i}`} x1={20 + i * 28} y1={148} x2={20 + i * 28} y2={280} />
            ))}
            {Array.from({ length: 5 }).map((_, i) => (
              <line key={`h${i}`} x1={14} y1={160 + i * 24} x2={306} y2={160 + i * 24} />
            ))}
          </g>
        </g>

        {/* Word-mark */}
        <text x="450" y="245" fontFamily="'Pacifico', cursive" fontSize="124" fill="url(#g-easy)" stroke="#0A8E2C" strokeWidth="2" style={{ paintOrder: 'stroke' }}>
          Easy
        </text>
        <rect x="470" y="260" width="160" height="6" rx="3" fill="#1CB64E" />
        <text x="690" y="245" fontFamily="'Pacifico', cursive" fontSize="124" fill="url(#g-kirana)" stroke="#D9540A" strokeWidth="2" style={{ paintOrder: 'stroke' }}>
          Kirana
        </text>

        {/* Tagline (kept lower so it never collides) */}
        <text x="520" y="340" fontFamily="'Montserrat', sans-serif" fontSize="26" letterSpacing="8" fill="#18A145">
          Grocery Became Easy
        </text>
      </svg>

      {/* Shine strip overlay (moves across occasionally) */}
      <span className="ek-shine" />
    </div>
  )
}

export default function Header() {
  // mobile menu removed for single-page site
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [isPincodeOpen, setIsPincodeOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showOrderHistory, setShowOrderHistory] = useState(false)
  const { state } = useCart()
  const { user, logout, isLoginModalOpen, showLoginModal, hideLoginModal } = useAuth()
  const { pincode } = useLocation()
  const userMenuCloseTimeout = useRef<number | null>(null)
  const userMenuWrapperRef = useRef<HTMLDivElement | null>(null)
  const userMenuDropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const openCartListener = (e: Event) => {
      const detail = (e as CustomEvent)?.detail || {}
      setIsCartOpen(true)
      if (detail.openCheckout) {
        window.setTimeout(() => window.dispatchEvent(new CustomEvent('openCart', { detail })), 50)
      }
    }
    window.addEventListener('openCart', openCartListener as EventListener)
    return () => window.removeEventListener('openCart', openCartListener as EventListener)
  }, [])

  useEffect(() => {
    if (!showUserMenu) return
    const onPointerMove = (e: PointerEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el) return
      if (userMenuWrapperRef.current?.contains(el) || userMenuDropdownRef.current?.contains(el)) {
        if (userMenuCloseTimeout.current) {
          window.clearTimeout(userMenuCloseTimeout.current)
          userMenuCloseTimeout.current = null
        }
        return
      }
      if (userMenuCloseTimeout.current) window.clearTimeout(userMenuCloseTimeout.current)
      userMenuCloseTimeout.current = window.setTimeout(() => {
        setShowUserMenu(false)
        userMenuCloseTimeout.current = null
      }, 200)
    }
    const onPointerDown = (ev: PointerEvent) => {
      const el = ev.target as Node | null
      if (!el) return
      if (userMenuWrapperRef.current?.contains(el) || userMenuDropdownRef.current?.contains(el)) return
      setShowUserMenu(false)
    }
    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerdown', onPointerDown)
      if (userMenuCloseTimeout.current) {
        window.clearTimeout(userMenuCloseTimeout.current)
        userMenuCloseTimeout.current = null
      }
    }
  }, [showUserMenu])

  // Prevent body scroll when My Orders modal is open
  useEffect(() => {
    if (showOrderHistory) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [showOrderHistory])

  return (
    <header className="bg-white shadow-sm border-b border-cream-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Location */}
          <div className="flex items-center space-x-4 h-10">
            <a href="/" aria-label="EasyKirana home" className="inline-flex items-center h-10">
              {/* SVG logo scaled to header height */}
              <EKLogo className="h-10 w-auto" />
            </a>

            {pincode && (
              <button
                onClick={() => setIsPincodeOpen(true)}
                className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-brand-600 transition-colors h-8"
              >
                <MapPin className="h-4 w-4" />
                <span className="hidden sm:inline">{pincode}</span>
              </button>
            )}
          </div>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-lg mx-8 hidden md:flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="input-field pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4 h-10">
            {user ? (
              <div
                className="relative"
                ref={(el) => { userMenuWrapperRef.current = el }}
                onMouseEnter={() => {
                  if (userMenuCloseTimeout.current) {
                    window.clearTimeout(userMenuCloseTimeout.current)
                    userMenuCloseTimeout.current = null
                  }
                  setShowUserMenu(true)
                }}
                onMouseLeave={(e) => {
                  const related = (e as React.MouseEvent).relatedTarget as Node | null
                  if (related && (userMenuWrapperRef.current?.contains(related) || userMenuDropdownRef.current?.contains(related))) {
                    return
                  }
                  if (userMenuCloseTimeout.current) window.clearTimeout(userMenuCloseTimeout.current)
                  userMenuCloseTimeout.current = window.setTimeout(() => {
                    setShowUserMenu(false)
                    userMenuCloseTimeout.current = null
                  }, 250)
                }}
              >
                <button
                  className="inline-flex items-center gap-2 text-gray-700 hover:text-brand-600 h-8"
                  onClick={() => {
                    if (userMenuCloseTimeout.current) {
                      window.clearTimeout(userMenuCloseTimeout.current)
                      userMenuCloseTimeout.current = null
                    }
                    setShowUserMenu((s) => !s)
                  }}
                  aria-haspopup="true"
                  aria-expanded={showUserMenu}
                >
                  <User className="h-6 w-6" />
                </button>

                {showUserMenu && (
                  <div
                    ref={(el) => { userMenuDropdownRef.current = el }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50 border"
                    onMouseEnter={() => {
                      if (userMenuCloseTimeout.current) {
                        window.clearTimeout(userMenuCloseTimeout.current)
                        userMenuCloseTimeout.current = null
                      }
                    }}
                    onMouseLeave={(e) => {
                      const related = (e as React.MouseEvent).relatedTarget as Node | null
                      if (related && (userMenuWrapperRef.current?.contains(related) || userMenuDropdownRef.current?.contains(related))) {
                        return
                      }
                      if (userMenuCloseTimeout.current) window.clearTimeout(userMenuCloseTimeout.current)
                      userMenuCloseTimeout.current = window.setTimeout(() => {
                        setShowUserMenu(false)
                        userMenuCloseTimeout.current = null
                      }, 250)
                    }}
                  >
                    <div className="py-1">
                      <div className="px-4 py-3 text-sm text-gray-700 border-b">
                        <p className="font-medium">{user.name || user.phone}</p>
                        <p className="text-gray-500">{user.name ? user.phone : user.role}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowOrderHistory(true)
                          setShowUserMenu(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        My Orders
                      </button>
                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                          window.location.reload()
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => showLoginModal()}
                className="inline-flex items-center gap-1 text-gray-700 hover:text-brand-600 h-8"
              >
                <User className="h-6 w-6" />
                <span className="hidden sm:inline text-sm font-medium leading-none">Login</span>
              </button>
            )}

            <button
              className="relative inline-flex items-center text-gray-700 hover:text-brand-600 h-8"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="h-6 w-6" />
              {state.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-gradient text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {state.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden py-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="input-field pr-10"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => hideLoginModal()}
      />
      <PincodeModal
        isOpen={isPincodeOpen}
        onClose={() => setIsPincodeOpen(false)}
        isFirstTime={false}
      />

      {/* Order History Modal */}
      {showOrderHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-transparent">
          <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-white px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">My Orders</h2>
              <button
                onClick={() => setShowOrderHistory(false)}
                className="text-gray-400 hover:text-gray-600 p-2"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <OrderHistory onClose={() => setShowOrderHistory(false)} />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
